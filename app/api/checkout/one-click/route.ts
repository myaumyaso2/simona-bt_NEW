import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { normalizeRussianPhone } from '@/lib/utils';
import { getNextOrderNumber } from '@/lib/orders/orderNumber';
import { createAsanaOrderTask } from '@/lib/integrations/asana';
import { notifyNewOrderInMax } from '@/lib/integrations/maxMessenger';
import { sendOrderCreatedEmails } from '@/lib/mail/mailer';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const oneClickOrderSchema = z.object({
  name: z.string().optional().transform((v) => (v && v.trim() ? v.trim() : 'Покупатель в 1 клик')),
  phone: z.string().min(6, 'Укажите номер телефона'),
  productId: z.string().optional(),
  sku: z.string().optional(),
  productName: z.string().min(1, 'Название товара обязательно'),
  brand: z.string().optional(),
  price: z.coerce.number().min(0, 'Цена должна быть неотрицательной'),
  image: z.string().optional(),
  slug: z.string().optional(),
  physicalStatus: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmContent: z.string().optional(),
  utmTerm: z.string().optional(),
  ymClientId: z.string().optional(),
  yclid: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = oneClickOrderSchema.parse(body);

    const customerPhone = normalizeRussianPhone(data.phone);
    const customerName = data.name;

    // 1. Привязка или регистрация клиента
    const customer = await prisma.customer.upsert({
      where: { phone: customerPhone },
      update: {
        ...(customerName && customerName !== 'Покупатель в 1 клик' ? { name: customerName } : {}),
      },
      create: {
        phone: customerPhone,
        name: customerName,
      },
    });

    // 2. Атомарное получение сквозного номера заказа со старого сайта (15104...)
    const orderNumber = await getNextOrderNumber();

    // 2.1 Нормализация 1C-кода товара (sku)
    let canonicalSku = data.sku || null;
    let canonicalId = data.productId || null;

    if (!canonicalSku || !/^\d+$/.test(canonicalSku)) {
      const dbProd = await prisma.product.findFirst({
        where: {
          OR: [
            ...(data.slug ? [{ slug: data.slug }] : []),
            ...(data.productId ? [{ id: data.productId }] : []),
            ...(data.productName ? [{ name: { contains: data.productName } }] : []),
          ],
        },
        select: { id: true, sku: true },
      });
      if (dbProd) {
        canonicalSku = dbProd.sku;
        canonicalId = dbProd.id;
      }
    }

    const orderItem = {
      productId: canonicalId,
      sku: canonicalSku,
      name: data.productName,
      brand: data.brand || null,
      price: data.price,
      quantity: 1,
      image: data.image || null,
      slug: data.slug || null,
      physicalStatus: data.physicalStatus || 'ON_ORDER',
    };

    // 3. Создание заказа в БД со статусом NEW и признаком заказа в 1 клик (isOneClick = true)
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: customer.id,
        customerName,
        customerPhone,
        deliveryType: 'TO_BE_AGREED',
        paymentMethod: 'TO_BE_AGREED',
        deliveryComment: (orderItem.physicalStatus === 'SHOWROOM' || orderItem.physicalStatus === 'DISCOUNT')
          ? '⚠️ [ШТУЧНЫЙ ОБРАЗЕЦ: Витрина/Уценка — требуется подтверждение фактического наличия в салоне на ул. Белинского]\nБыстрый заказ в 1 клик с карточки товара'
          : 'Быстрый заказ в 1 клик с карточки товара',
        totalAmount: data.price,
        status: 'NEW',
        isOneClick: true,
        paymentStatus: 'PENDING',
        itemsJson: JSON.stringify([orderItem]),
        orderItems: {
          create: [orderItem],
        },
        utmSource: data.utmSource || null,
        utmMedium: data.utmMedium || null,
        utmCampaign: data.utmCampaign || null,
        utmContent: data.utmContent || null,
        utmTerm: data.utmTerm || null,
        ymClientId: data.ymClientId || null,
        yclid: data.yclid || null,
      },
    });

    // 4. Оповещение операторов в Asana, мессенджер MAX и отправка Email менеджерам
    const [asanaResult, maxResult, emailResult] = await Promise.all([
      createAsanaOrderTask(order),
      notifyNewOrderInMax(order),
      sendOrderCreatedEmails(order),
    ]);

    if (asanaResult.taskId) {
      await prisma.order.update({
        where: { id: order.id },
        data: { asanaTaskId: asanaResult.taskId },
      });
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      totalAmount: order.totalAmount,
      customerPhone: order.customerPhone,
      notifications: {
        email: emailResult,
        asanaTaskId: asanaResult.taskId,
        maxAlert: maxResult.deliveredMax || maxResult.mode === 'LOCAL_QUEUE',
      },
    });
  } catch (err: unknown) {
    console.error('[OneClickOrder] Ошибка создания заказа в 1 клик:', err);
    const msg = err instanceof Error ? err.message : 'Ошибка оформления быстрого заказа';
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}

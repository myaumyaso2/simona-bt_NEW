import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { normalizeRussianPhone } from '@/lib/utils';
import { sendOrderCreatedEmails } from '@/lib/mail/mailer';
import { createAsanaOrderTask } from '@/lib/integrations/asana';
import { notifyNewOrderInMax } from '@/lib/integrations/maxMessenger';
import { createHoldPayment } from '@/lib/integrations/yookassa';
import { getNextOrderNumber } from '@/lib/orders/orderNumber';

export const dynamic = 'force-dynamic';

interface CheckoutItemInput {
  id?: string;
  productId?: string;
  sku?: string;
  name?: string;
  brand?: string;
  price?: number | string;
  quantity?: number | string;
  image?: string;
  slug?: string;
  physicalStatus?: string;
  stockKominterna?: number;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderNumber = (
      searchParams.get('order') ||
      searchParams.get('orderNumber') ||
      ''
    ).trim();

    if (!orderNumber) {
      return NextResponse.json({ error: 'orderNumber is required' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      select: {
        id: true,
        orderNumber: true,
        totalAmount: true,
        status: true,
        paymentStatus: true,
        paymentMethod: true,
        paymentLink: true,
        deliveryType: true,
        itemsJson: true,
        createdAt: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Заказ не найден' }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Ошибка получения заказа';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Record<string, unknown>;
    const customerName = String(body.customerName || '').trim();
    const rawPhone = String(body.customerPhone || '').trim();
    const customerEmail = body.customerEmail ? String(body.customerEmail).trim() : null;
    const rawDeliveryType = String(body.deliveryType || 'COURIER_DELIVERY').trim();
    const deliveryType =
      rawDeliveryType === 'WHITE_GLOVE_DELIVERY' ? 'COURIER_DELIVERY' : rawDeliveryType;
    const deliveryAddress = body.deliveryAddress ? String(body.deliveryAddress).trim() : null;
    const deliveryDate = body.deliveryDate ? String(body.deliveryDate).trim() : null;
    const deliveryComment = body.deliveryComment ? String(body.deliveryComment).trim() : null;
    const paymentMethod = String(body.paymentMethod || 'IN_SALON').trim();
    const companyName = body.companyName ? String(body.companyName).trim() : null;
    const companyInn = body.companyInn ? String(body.companyInn).trim() : null;
    const items = Array.isArray(body.items) ? (body.items as CheckoutItemInput[]) : [];

    const utmSource = body.utmSource ? String(body.utmSource).trim() : null;
    const utmMedium = body.utmMedium ? String(body.utmMedium).trim() : null;
    const utmCampaign = body.utmCampaign ? String(body.utmCampaign).trim() : null;
    const utmContent = body.utmContent ? String(body.utmContent).trim() : null;
    const utmTerm = body.utmTerm ? String(body.utmTerm).trim() : null;
    const ymClientId = body.ymClientId ? String(body.ymClientId).trim() : null;
    const yclid = body.yclid ? String(body.yclid).trim() : null;

    if (!customerName || !rawPhone) {
      return NextResponse.json(
        { error: 'Имя и телефон клиента обязательны' },
        { status: 400 }
      );
    }

    if (items.length === 0) {
      return NextResponse.json(
        { error: 'В заказе должен быть хотя бы один товар' },
        { status: 400 }
      );
    }

    const customerPhone = normalizeRussianPhone(rawPhone);

    const deliveryCost = 0; // Стоимость доставки рассчитывается справочно и оплачивается отдельно при получении

    const itemsTotal = items.reduce(
      (sum: number, item: CheckoutItemInput) =>
        sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
      0
    );

    const totalAmount = itemsTotal;

    // Сверяем физические статусы позиций по БД (если переданы sku/productId) и входным данным
    const skus = items.map((i) => String(i.sku || '').trim()).filter(Boolean);
    const dbProducts =
      skus.length > 0
        ? await prisma.product.findMany({
            where: { sku: { in: skus } },
            select: { id: true, sku: true, physicalStatus: true, stockKominterna: true },
          })
        : [];
    const dbBySku = new Map(dbProducts.map((p) => [p.sku, p]));

    let allItemsLocalStock = true;
    for (const item of items) {
      const sku = String(item.sku || '').trim();
      const dbProd = sku ? dbBySku.get(sku) : undefined;
      const effectiveStatus = item.physicalStatus || dbProd?.physicalStatus || 'LOCAL_STOCK';
      const effectiveKominterna =
        typeof item.stockKominterna === 'number'
          ? item.stockKominterna
          : typeof dbProd?.stockKominterna === 'number'
          ? dbProd.stockKominterna
          : effectiveStatus === 'LOCAL_STOCK'
          ? 1
          : 0;

      if (effectiveStatus !== 'LOCAL_STOCK' || effectiveKominterna <= 0) {
        allItemsLocalStock = false;
      }
    }

    // Привязка или создание клиента по нормализованному телефону (+7XXXXXXXXXX)
    const customer = await prisma.customer.upsert({
      where: { phone: customerPhone },
      update: {
        name: customerName || undefined,
        ...(customerEmail ? { email: customerEmail } : {}),
      },
      create: {
        phone: customerPhone,
        name: customerName,
        email: customerEmail,
      },
    });

    const orderNumber = await getNextOrderNumber();

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: customer.id,
        customerName,
        customerPhone,
        customerEmail,
        deliveryType,
        deliveryAddress,
        deliveryDate,
        deliveryComment,
        totalAmount,
        status: 'NEW',
        paymentStatus: 'PENDING',
        paymentMethod,
        companyName,
        companyInn,
        itemsJson: JSON.stringify(items),
        utmSource,
        utmMedium,
        utmCampaign,
        utmContent,
        utmTerm,
        ymClientId,
        yclid,
        orderItems: {
          create: items.map((item) => ({
            productId: item.productId || item.id ? String(item.productId || item.id) : null,
            sku: item.sku ? String(item.sku) : null,
            name: String(item.name || 'Товар СИМОНА'),
            brand: item.brand ? String(item.brand) : null,
            price: Number(item.price) || 0,
            quantity: Number(item.quantity) || 1,
            image: item.image ? String(item.image) : null,
            slug: item.slug ? String(item.slug) : null,
            physicalStatus: item.physicalStatus ? String(item.physicalStatus) : null,
          })),
        },
      },
    });

    // Бизнес-правило 2.1.2: Прямой холд ЮKassa вызывается ТОЛЬКО при CARD_ONLINE и наличии ВСЕХ товаров на складе Коминтерна 27 (LOCAL_STOCK)
    let confirmationUrl: string | null = null;
    let paymentId: string | null = null;

    if (paymentMethod === 'CARD_ONLINE' && allItemsLocalStock) {
      try {
        const holdResult = await createHoldPayment({
          id: order.id,
          orderNumber: order.orderNumber,
          totalAmount: order.totalAmount,
          customerName: order.customerName,
          customerPhone: order.customerPhone,
          customerEmail: order.customerEmail,
          items: items.map((item) => ({
            sku: item.sku ? String(item.sku) : undefined,
            name: String(item.name || 'Товар СИМОНА'),
            price: Number(item.price) || 0,
            quantity: Number(item.quantity) || 1,
          })),
        });

        paymentId = holdResult.paymentId;
        confirmationUrl = holdResult.confirmationUrl;

        await prisma.order.update({
          where: { id: order.id },
          data: {
            paymentId,
            paymentLink: confirmationUrl,
          },
        });
      } catch (ykErr: unknown) {
        console.warn('[Checkout] YooKassa hold creation failed, falling back to manual link:', ykErr);
      }
    }

    // Интеграционный контур (Email клиенту + менеджеру, задача в Asana, алерт в MAX)
    const [emailResult, asanaResult, maxResult] = await Promise.all([
      sendOrderCreatedEmails(order),
      createAsanaOrderTask(order),
      notifyNewOrderInMax(order),
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
      customerId: customer.id,
      paymentId,
      confirmationUrl,
      requiresManagerConfirmation: !allItemsLocalStock,
      notifications: {
        email: emailResult,
        asanaTaskId: asanaResult.taskId,
        maxAlert: maxResult.deliveredMax || maxResult.mode === 'LOCAL_QUEUE',
      },
    });
  } catch (e: unknown) {
    console.error('Checkout API error:', e);
    const msg = e instanceof Error ? e.message : 'Ошибка оформления заказа';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

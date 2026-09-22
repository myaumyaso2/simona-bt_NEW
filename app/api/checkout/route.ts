import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function generateOrderNumber(): string {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  return `SMB-${dateStr}-${randomSuffix}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerPhone,
      customerEmail,
      deliveryType = 'PICKUP_WAREHOUSE_KOMINTERNA',
      deliveryAddress,
      deliveryDate,
      deliveryComment,
      paymentMethod = 'IN_SALON',
      items = [],
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
      utmTerm,
      ymClientId,
      yclid,
    } = body;

    if (!customerName || !customerPhone) {
      return NextResponse.json(
        { error: 'Имя и телефон клиента обязательны' },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'В заказе должен быть хотя бы один товар' },
        { status: 400 }
      );
    }

    const totalAmount = items.reduce(
      (sum: number, item: any) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
      0
    );

    const orderNumber = generateOrderNumber();

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail ? customerEmail.trim() : null,
        deliveryType,
        deliveryAddress: deliveryAddress ? deliveryAddress.trim() : null,
        deliveryDate: deliveryDate ? deliveryDate.trim() : null,
        deliveryComment: deliveryComment ? deliveryComment.trim() : null,
        totalAmount,
        status: 'NEW',
        paymentStatus: paymentMethod === 'CARD_ONLINE' ? 'PENDING' : 'PENDING',
        paymentMethod,
        itemsJson: JSON.stringify(items),
        utmSource: utmSource || null,
        utmMedium: utmMedium || null,
        utmCampaign: utmCampaign || null,
        utmContent: utmContent || null,
        utmTerm: utmTerm || null,
        ymClientId: ymClientId || null,
        yclid: yclid || null,
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      totalAmount: order.totalAmount,
    });
  } catch (e: any) {
    console.error('Checkout API error:', e);
    return NextResponse.json({ error: e.message || 'Ошибка оформления заказа' }, { status: 500 });
  }
}

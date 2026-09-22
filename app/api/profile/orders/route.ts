import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');
    const email = searchParams.get('email');

    let whereClause: any = {};

    if (phone) {
      const cleanPhone = phone.replace(/\D/g, '');
      whereClause = {
        customerPhone: {
          contains: cleanPhone.slice(-10),
        },
      };
    } else if (email) {
      whereClause = {
        customerEmail: {
          equals: email.trim().toLowerCase(),
        },
      };
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    const parsedOrders = orders.map((o) => {
      let items = [];
      try {
        items = JSON.parse(o.itemsJson);
      } catch (err) {
        items = [];
      }
      return {
        id: o.id,
        orderNumber: o.orderNumber,
        customerName: o.customerName,
        customerPhone: o.customerPhone,
        customerEmail: o.customerEmail,
        deliveryType: o.deliveryType,
        deliveryAddress: o.deliveryAddress,
        deliveryDate: o.deliveryDate,
        deliveryComment: o.deliveryComment,
        totalAmount: o.totalAmount,
        status: o.status,
        paymentStatus: o.paymentStatus,
        paymentMethod: o.paymentMethod,
        items,
        createdAt: o.createdAt,
      };
    });

    return NextResponse.json({ success: true, orders: parsedOrders });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: 'Не удалось загрузить заказы' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * GET: Выгрузка CSV файла офлайн-конверсий для загрузки в веб-кабинет Яндекс Метрики
 * Формат: ClientId,Target,DateTime,Price,Currency
 */
export async function GET(req: NextRequest) {
  try {
    const orders = await prisma.order.findMany({
      where: {
        status: { in: ['COMPLETED', 'PAID', 'DELIVERED'] },
        ymClientId: { not: null },
      },
      take: 1000,
      orderBy: { createdAt: 'desc' },
    });

    let csv = 'ClientId,Target,DateTime,Price,Currency\n';
    orders.forEach((order) => {
      if (order.ymClientId) {
        const timestamp = Math.floor(new Date(order.createdAt).getTime() / 1000);
        csv += `${order.ymClientId},SALON_PURCHASE,${timestamp},${order.totalAmount || 0},RUB\n`;
      }
    });

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="yandex_offline_conversions.csv"',
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

/**
 * POST: Прием статусов оплат из 1С / CRM для отправки офлайн-конверсий
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { conversions, secretKey } = body;

    const expectedKey = process.env.OFFLINE_CONVERSION_SECRET || 'simona_offline_secret_2026';
    if (secretKey && secretKey !== expectedKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!Array.isArray(conversions)) {
      return NextResponse.json({ error: 'Invalid conversions array' }, { status: 400 });
    }

    // Process and update orders if orderNumber or clientPhone match
    let updatedCount = 0;
    for (const item of conversions) {
      if (item.orderNumber) {
        await prisma.order.updateMany({
          where: { orderNumber: item.orderNumber },
          data: {
            status: 'PAID',
            paymentMethod: item.paymentMethod || 'IN_SALON',
          },
        });
        updatedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      processed: conversions.length,
      updatedOrders: updatedCount,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

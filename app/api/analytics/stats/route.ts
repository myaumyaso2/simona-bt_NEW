import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAuthorized } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  // 1. Authorization check
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const daysParam = searchParams.get('days') || '30';
    const days = parseInt(daysParam, 10);

    const dateFilter =
      days > 0
        ? {
            createdAt: {
              gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
            },
          }
        : {};

    // 2. Fetch orders in period
    const orders = await prisma.order.findMany({
      where: dateFilter,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        orderNumber: true,
        customerName: true,
        customerPhone: true,
        totalAmount: true,
        status: true,
        paymentStatus: true,
        paymentMethod: true,
        deliveryType: true,
        ymClientId: true,
        utmSource: true,
        utmMedium: true,
        utmCampaign: true,
        createdAt: true,
      },
    });

    // 3. Fetch leads count in period for funnel calculation
    const leadsCount = await prisma.lead.count({
      where: dateFilter,
    });

    const totalOrders = orders.length;
    let totalRevenue = 0;
    let paidOrdersCount = 0;
    let ymOrdersCount = 0;

    const utmMap = new Map<
      string,
      { count: number; revenue: number; paidCount: number }
    >();
    const statusMap = new Map<string, number>();

    for (const order of orders) {
      const amount = order.totalAmount || 0;
      const isPaid = ['PAID', 'COMPLETED', 'DELIVERED'].includes(order.status);

      if (isPaid) {
        totalRevenue += amount;
        paidOrdersCount++;
      }

      if (order.ymClientId) {
        ymOrdersCount++;
      }

      // Group by status
      statusMap.set(order.status, (statusMap.get(order.status) || 0) + 1);

      // Group by UTM Source
      const source = (order.utmSource || 'organic / direct').toLowerCase();
      const existingUtm = utmMap.get(source) || {
        count: 0,
        revenue: 0,
        paidCount: 0,
      };
      existingUtm.count++;
      if (isPaid) {
        existingUtm.revenue += amount;
        existingUtm.paidCount++;
      }
      utmMap.set(source, existingUtm);
    }

    const averageCheck =
      paidOrdersCount > 0 ? Math.round(totalRevenue / paidOrdersCount) : 0;

    // Convert UTM stats to array
    const utmStats = Array.from(utmMap.entries())
      .map(([source, data]) => ({
        source,
        ordersCount: data.count,
        paidCount: data.paidCount,
        revenue: data.revenue,
        avgCheck: data.paidCount > 0 ? Math.round(data.revenue / data.paidCount) : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue);

    const statusStats = Array.from(statusMap.entries()).map(([status, count]) => ({
      status,
      count,
    }));

    return NextResponse.json({
      summary: {
        totalOrders,
        paidOrdersCount,
        totalRevenue,
        averageCheck,
        ymOrdersCount,
        leadsCount,
        conversionRate:
          totalOrders + leadsCount > 0
            ? ((paidOrdersCount / (totalOrders + leadsCount)) * 100).toFixed(1)
            : '0.0',
      },
      utmStats,
      statusStats,
      recentOrders: orders.slice(0, 30),
    });
  } catch (e: any) {
    console.error('Analytics stats error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

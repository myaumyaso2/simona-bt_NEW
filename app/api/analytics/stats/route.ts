import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAuthorized } from '@/lib/adminAuth';
import { getDirectCampaignReports } from '@/lib/integrations/direct/reports';
import { getMetrikaTrafficStats } from '@/lib/integrations/metrika/traffic';
import { getWebmasterHealthStats } from '@/lib/integrations/seo/webmasterHealth';

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

    // 2. Fetch orders in period (excluding TEST orders)
    const orders = await prisma.order.findMany({
      where: {
        ...dateFilter,
        status: { not: 'TEST' },
      },
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
        yclid: true,
        utmSource: true,
        utmMedium: true,
        utmCampaign: true,
        createdAt: true,
      },
    });

    // 3. Fetch leads count in period for funnel calculation (excluding TEST leads)
    const leadsCount = await prisma.lead.count({
      where: {
        ...dateFilter,
        status: { not: 'TEST' },
      },
    });

    // 4. Fetch Direct stats, Metrika traffic stats, and Webmaster health in parallel
    const [directStats, trafficStats, webmasterHealth] = await Promise.all([
      getDirectCampaignReports(days),
      getMetrikaTrafficStats(days),
      getWebmasterHealthStats(),
    ]);

    const totalOrders = orders.length;
    let totalRevenue = 0;
    let paidOrdersCount = 0;
    let ymOrdersCount = 0;
    let directPaidRevenue = 0;
    let directPaidCount = 0;
    let directPipelineRevenue = 0;
    let directPipelineCount = 0;

    const utmMap = new Map<
      string,
      { count: number; revenue: number; paidCount: number; pipelineRevenue: number }
    >();
    const statusMap = new Map<string, number>();

    for (const order of orders) {
      const amount = order.totalAmount || 0;
      const isCancelled = order.status === 'CANCELLED';
      // В переходный период 1С 7.7 оплата засчитывается при статусе заказа PAID/COMPLETED/DELIVERED либо при paymentStatus === 'PAID'
      const isPaid =
        !isCancelled &&
        (['PAID', 'COMPLETED', 'DELIVERED'].includes(order.status) ||
          order.paymentStatus === 'PAID');

      if (isPaid) {
        totalRevenue += amount;
        paidOrdersCount++;
      }

      if (order.ymClientId) {
        ymOrdersCount++;
      }

      // Строгая атрибуция платного Яндекс Директа (исключая yandex/organic)
      const lowerUtmSource = (order.utmSource || '').toLowerCase();
      const lowerUtmMedium = (order.utmMedium || '').toLowerCase();
      const lowerUtmCampaign = (order.utmCampaign || '').toLowerCase();

      const isDirectAttributed =
        Boolean(order.yclid) ||
        lowerUtmCampaign.includes('direct') ||
        (lowerUtmSource.includes('yandex') && lowerUtmMedium !== 'organic');

      if (isDirectAttributed) {
        if (isPaid) {
          directPaidRevenue += amount;
          directPaidCount++;
        }
        if (!isCancelled) {
          directPipelineRevenue += amount;
          directPipelineCount++;
        }
      }

      // Group by status
      statusMap.set(order.status, (statusMap.get(order.status) || 0) + 1);

      // Group by Traffic Channel (с учетом yclid и разделения платного Директа и органики)
      const source = isDirectAttributed
        ? 'yandex direct (cpc)'
        : lowerUtmSource && lowerUtmMedium === 'organic'
        ? `${lowerUtmSource} (organic)`
        : lowerUtmSource || 'organic / direct';

      const existingUtm = utmMap.get(source) || {
        count: 0,
        revenue: 0,
        paidCount: 0,
        pipelineRevenue: 0,
      };
      existingUtm.count++;
      if (!isCancelled) {
        existingUtm.pipelineRevenue += amount;
      }
      if (isPaid) {
        existingUtm.revenue += amount;
        existingUtm.paidCount++;
      }
      utmMap.set(source, existingUtm);
    }

    const averageCheck =
      paidOrdersCount > 0 ? Math.round(totalRevenue / paidOrdersCount) : 0;

    // Строгий двухконтурный расчет ДРР исключительно по заказам самого Яндекс Директа (без примешивания чужой органики)
    const directPaidDrrPercent =
      directPaidRevenue > 0
        ? ((directStats.totalCostRub / directPaidRevenue) * 100).toFixed(1)
        : null;

    const directPipelineDrrPercent =
      directPipelineRevenue > 0
        ? ((directStats.totalCostRub / directPipelineRevenue) * 100).toFixed(1)
        : null;

    const isDrrPreliminary = directPaidRevenue === 0 && directPipelineRevenue > 0;
    const drrPercent = directPaidDrrPercent ?? directPipelineDrrPercent ?? '0.0';

    // Convert UTM stats to array
    const utmStats = Array.from(utmMap.entries())
      .map(([source, data]) => ({
        source,
        ordersCount: data.count,
        paidCount: data.paidCount,
        revenue: data.revenue,
        pipelineRevenue: data.pipelineRevenue,
        avgCheck: data.paidCount > 0 ? Math.round(data.revenue / data.paidCount) : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue || b.pipelineRevenue - a.pipelineRevenue);

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
        directSpend: directStats.totalCostRub,
        costWithVat: directStats.costWithVatRub,
        balanceRub: directStats.balanceRub,
        initialDeposit: directStats.initialDepositRub,
        directPaidRevenue,
        directPaidCount,
        directPipelineRevenue,
        directPipelineCount,
        directPaidDrrPercent,
        directPipelineDrrPercent,
        isDrrPreliminary,
        drrPercent,
      },
      directStats,
      trafficStats,
      webmasterHealth,
      utmStats,
      statusStats,
      recentOrders: orders.slice(0, 30),
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Internal Server Error';
    console.error('Analytics stats error:', e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

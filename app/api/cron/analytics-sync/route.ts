import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getDirectCampaignReports } from '@/lib/integrations/direct/reports';
import { uploadOfflineConversionsToMetrika } from '@/lib/integrations/metrika/offlineConversions';
import { sendDirectorMorningDigest } from '@/lib/integrations/direct/telegramDigest';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const CRON_SECRET = process.env.CRON_SECRET || 'simona_cron_secret_2026';

function isCronAuthorized(req: NextRequest): boolean {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) {
    const urlKey = req.nextUrl.searchParams.get('key');
    return urlKey === CRON_SECRET;
  }
  const [scheme, token] = authHeader.split(' ');
  return scheme?.toLowerCase() === 'bearer' && token?.trim() === CRON_SECRET.trim();
}

/**
 * GET/POST /api/cron/analytics-sync
 * Запускается по расписанию (в 04:00 для синка офлайн-конверсий, в 09:00 для утреннего дайджеста директору).
 */
export async function GET(req: NextRequest) {
  return handleSync(req);
}

export async function POST(req: NextRequest) {
  return handleSync(req);
}

async function handleSync(req: NextRequest) {
  if (!isCronAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized CRON request' }, { status: 401 });
  }

  const results: Record<string, any> = {};

  try {
    // 1. Отправка офлайн-конверсий в Яндекс Метрику по API
    const conversionResult = await uploadOfflineConversionsToMetrika();
    results.conversions = conversionResult;

    // 2. Сбор показателей Яндекс Директа за вчерашний день
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = yesterday.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
    });

    const startOfYesterday = new Date(yesterday);
    startOfYesterday.setHours(0, 0, 0, 0);

    const endOfYesterday = new Date(yesterday);
    endOfYesterday.setHours(23, 59, 59, 999);

    const directReports = await getDirectCampaignReports(1);
    results.directSpend = directReports.totalCostRub;

    // 3. Выборка вчерашних оплат из базы заказов (PAID, DELIVERED, COMPLETED)
    const yesterdayOrders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startOfYesterday,
          lte: endOfYesterday,
        },
      },
    });

    let paidCount = 0;
    let paidRevenue = 0;
    let directAttributedRevenue = 0;
    let belinskogo15Revenue = 0;
    let belinskogo11Revenue = 0;
    let onlineRevenue = 0;

    for (const o of yesterdayOrders) {
      const isPaid = ['PAID', 'DELIVERED', 'COMPLETED'].includes(o.status);
      const amount = o.totalAmount || 0;

      if (isPaid) {
        paidCount++;
        paidRevenue += amount;

        const isDirect =
          Boolean(o.yclid) || (o.utmSource && o.utmSource.toLowerCase().includes('yandex'));
        if (isDirect) {
          directAttributedRevenue += amount;
        }

        // Распределение по точкам продаж
        if (o.deliveryType === 'PICKUP_BELINSKOGO_15' || o.paymentMethod === 'IN_SALON') {
          belinskogo15Revenue += amount;
        } else if (o.deliveryType === 'PICKUP_BELINSKOGO_11') {
          belinskogo11Revenue += amount;
        } else {
          onlineRevenue += amount;
        }
      }
    }

    const revenueForDrr = directAttributedRevenue > 0 ? directAttributedRevenue : paidRevenue;
    const drrPercent =
      revenueForDrr > 0 ? ((directReports.totalCostRub / revenueForDrr) * 100).toFixed(1) : '0.0';

    // 4. Отправка утреннего дайджеста в Telegram директору
    const shouldSendTelegram = req.nextUrl.searchParams.get('digest') === 'true' || true;
    let telegramSent = false;

    if (shouldSendTelegram) {
      telegramSent = await sendDirectorMorningDigest({
        dateStr,
        directSpendRub: directReports.totalCostRub,
        paidOrdersCount: paidCount,
        paidRevenueRub: paidRevenue,
        directAttributedRevenueRub: directAttributedRevenue,
        drrPercent,
        salonBelinskogo15Revenue: belinskogo15Revenue,
        salonBelinskogo11Revenue: belinskogo11Revenue,
        onlineStoreRevenue: onlineRevenue,
      });
    }

    results.telegramSent = telegramSent;
    results.summary = {
      date: dateStr,
      directSpend: directReports.totalCostRub,
      paidCount,
      paidRevenue,
      drrPercent,
    };

    return NextResponse.json({ success: true, results });
  } catch (err: any) {
    console.error('CRON analytics sync error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

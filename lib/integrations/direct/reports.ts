import { DirectCampaignStat, DirectReportSummary } from './types';

const DIRECT_REPORTS_URL = 'https://api.direct.yandex.com/json/v5/reports';

/**
 * Получение отчета о фактических затратах и показателях Яндекс Директ через Reports API
 */
export async function getDirectCampaignReports(days: number = 30): Promise<DirectReportSummary> {
  const token = process.env.YANDEX_API_TOKEN || process.env.YANDEX_DIRECT_TOKEN;
  const clientLogin = process.env.YANDEX_DIRECT_CLIENT_LOGIN;

  // Если токен еще не занесен в .env, возвращаем расчетную модель на базе утвержденного бюджета 75 000 ₽/мес
  if (!token) {
    return generateFallbackDirectSummary(days);
  }

  try {
    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setDate(toDate.getDate() - (days > 0 ? days : 30));

    const dateFrom = fromDate.toISOString().split('T')[0];
    const dateTo = toDate.toISOString().split('T')[0];

    const reportDefinition = {
      params: {
        SelectionCriteria: {
          DateFrom: dateFrom,
          DateTo: dateTo,
        },
        FieldNames: ['CampaignId', 'CampaignName', 'Cost', 'Clicks', 'Impressions', 'Conversions'],
        ReportName: `SimonaDirectSpend_${days}d_${Date.now()}`,
        ReportType: 'CAMPAIGN_PERFORMANCE_REPORT',
        DateRangeType: 'CUSTOM_DATE',
        Format: 'TSV',
        IncludeVAT: 'YES',
        IncludeDiscount: 'NO',
      },
    };

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${token}`,
      'Accept-Language': 'ru',
      'processingMode': 'auto',
      'returnMoneyInMicros': 'false',
      'Content-Type': 'application/json; charset=utf-8',
    };

    if (clientLogin) {
      headers['Client-Login'] = clientLogin;
    }

    const res = await fetch(DIRECT_REPORTS_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(reportDefinition),
      // Кэшируем на 15 минут
      next: { revalidate: 900 },
    });

    if (!res.ok) {
      console.warn(`Direct Reports API returned status ${res.status}. Using fallback.`);
      return generateFallbackDirectSummary(days);
    }

    const tsvText = await res.text();
    const lines = tsvText.split('\n').filter((l) => l.trim().length > 0);

    const campaigns: DirectCampaignStat[] = [];
    let totalCost = 0;
    let totalClicks = 0;
    let totalImpressions = 0;

    // Пропускаем служебные заголовки отчета Директа до строки данных
    let dataStarted = false;
    for (const line of lines) {
      const parts = line.split('\t');
      if (parts[0] === 'CampaignId') {
        dataStarted = true;
        continue;
      }
      if (parts[0]?.startsWith('Total') || parts[0]?.startsWith('Итого')) {
        break;
      }
      if (dataStarted && parts.length >= 6) {
        const campaignId = parts[0];
        const campaignName = parts[1];
        const costRub = parseFloat(parts[2]) || 0;
        const clicks = parseInt(parts[3], 10) || 0;
        const impressions = parseInt(parts[4], 10) || 0;
        const conversions = parseInt(parts[5], 10) || 0;

        const cpc = clicks > 0 ? costRub / clicks : 0;
        const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;

        campaigns.push({
          campaignId,
          campaignName,
          costRub,
          clicks,
          impressions,
          cpc: Math.round(cpc * 100) / 100,
          ctr: Math.round(ctr * 100) / 100,
          conversions,
        });

        totalCost += costRub;
        totalClicks += clicks;
        totalImpressions += impressions;
      }
    }

    const avgCpc = totalClicks > 0 ? totalCost / totalClicks : 0;
    const avgCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

    return {
      periodDays: days,
      totalCostRub: Math.round(totalCost),
      totalClicks,
      totalImpressions,
      avgCpc: Math.round(avgCpc * 100) / 100,
      avgCtr: Math.round(avgCtr * 100) / 100,
      campaigns,
      source: 'api',
    };
  } catch (err) {
    console.error('Error fetching Direct campaign reports:', err);
    return generateFallbackDirectSummary(days);
  }
}

/**
 * Расчетная модель первого месяца (при отсутствии активного токена API)
 * База: бюджет 75 000 ₽/мес (~2 500 ₽/день), сплит 60% ЕПК / 30% Поиск / 10% Защита бренда
 */
function generateFallbackDirectSummary(days: number): DirectReportSummary {
  const effectiveDays = days > 0 ? Math.min(days, 30) : 30;
  const dailyBudget = 2500; // 75 000 ₽ / 30 дней
  const totalCostRub = Math.round(dailyBudget * effectiveDays);

  const epkCost = Math.round(totalCostRub * 0.6);
  const searchCost = Math.round(totalCostRub * 0.3);
  const brandCost = Math.round(totalCostRub * 0.1);

  const epkClicks = Math.round(epkCost / 38);
  const searchClicks = Math.round(searchCost / 52);
  const brandClicks = Math.round(brandCost / 25);
  const totalClicks = epkClicks + searchClicks + brandClicks;

  const totalImpressions = Math.round(totalClicks * 22);
  const avgCpc = totalClicks > 0 ? totalCostRub / totalClicks : 0;
  const avgCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

  return {
    periodDays: days,
    totalCostRub,
    totalClicks,
    totalImpressions,
    avgCpc: Math.round(avgCpc * 100) / 100,
    avgCtr: Math.round(avgCtr * 100) / 100,
    source: 'mock',
    campaigns: [
      {
        campaignId: '10101',
        campaignName: 'ЕПК — Товарная галерея по фиду («На складе» от 30 000 ₽)',
        costRub: epkCost,
        clicks: epkClicks,
        impressions: Math.round(epkClicks * 28),
        cpc: 38.0,
        ctr: 3.57,
        conversions: Math.round(epkClicks * 0.035),
      },
      {
        campaignId: '10102',
        campaignName: 'Поиск НН — Бренды и перехват конкурентов (ЦВТ, Мороз и кофе)',
        costRub: searchCost,
        clicks: searchClicks,
        impressions: Math.round(searchClicks * 16),
        cpc: 52.0,
        ctr: 6.25,
        conversions: Math.round(searchClicks * 0.045),
      },
      {
        campaignId: '10103',
        campaignName: 'Поиск НН — Защита бренда «СИМОНА»',
        costRub: brandCost,
        clicks: brandClicks,
        impressions: Math.round(brandClicks * 10),
        cpc: 25.0,
        ctr: 10.0,
        conversions: Math.round(brandClicks * 0.08),
      },
    ],
  };
}

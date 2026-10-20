import { formatPrice } from '@/lib/utils';

export interface DirectorDigestData {
  dateStr: string;
  directSpendRub: number;
  paidOrdersCount: number;
  paidRevenueRub: number;
  directAttributedRevenueRub: number;
  drrPercent: string;
  salonBelinskogo15Revenue: number;
  salonBelinskogo11Revenue: number;
  onlineStoreRevenue: number;
}

/**
 * Отправка утреннего управленческого дайджеста строго персонально директору в Telegram
 */
export async function sendDirectorMorningDigest(data: DirectorDigestData): Promise<boolean> {
  const tgToken = process.env.TELEGRAM_BOT_TOKEN;
  const directorChatId = process.env.DIRECTOR_TELEGRAM_CHAT_ID || process.env.TELEGRAM_CHAT_ID;

  if (!tgToken || !directorChatId) {
    console.info(
      '[Director Digest] TELEGRAM_BOT_TOKEN or DIRECTOR_TELEGRAM_CHAT_ID is not configured. Digest generated locally.'
    );
    return false;
  }

  const message = `📊 СИМОНА • Итоги маркетинга за вчера (${data.dateStr})

💰 Расходы на рекламу:
• Потрачено в Яндекс Директе: ${formatPrice(data.directSpendRub)}

💳 Реальные оплаты в 1С:
• Поступило денег: ${data.paidOrdersCount} оплачено на ${formatPrice(data.paidRevenueRub)}
• Из них приведены рекламой: ${formatPrice(data.directAttributedRevenueRub)}
• Доля рекламных расходов (ДРР): ${data.drrPercent}% (целевая норма до 5%)

📍 Точки продаж:
• Салон Белинского, 15: ${formatPrice(data.salonBelinskogo15Revenue)}
• Салон Белинского, 11/66: ${formatPrice(data.salonBelinskogo11Revenue)}
• Интернет-магазин: ${formatPrice(data.onlineStoreRevenue)}

🔗 Открыть закрытый отчет:
https://simona-bt.ru/analytics`;

  try {
    const url = `https://api.telegram.org/bot${tgToken}/sendMessage`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: directorChatId,
        text: message,
        disable_web_page_preview: false,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('[Director Digest] Telegram API error:', err);
      return false;
    }

    return true;
  } catch (err) {
    console.error('[Director Digest] Network error:', err);
    return false;
  }
}

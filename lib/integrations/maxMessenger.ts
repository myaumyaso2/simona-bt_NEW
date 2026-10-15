import fs from 'fs';
import path from 'path';
import {
  LEAD_TYPE_LABELS,
  DELIVERY_TYPE_LABELS,
  PAYMENT_METHOD_LABELS,
  LeadEmailData,
  OrderEmailData,
} from '../mail/mailer';

const MAX_API_BASE = 'https://botapi.max.ru';
const MAX_LOG_FILE = path.join(process.cwd(), 'storage', 'logs', 'max_messenger.log');

function logMaxEvent(entry: Record<string, unknown>) {
  try {
    const dir = path.dirname(MAX_LOG_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.appendFileSync(
      MAX_LOG_FILE,
      JSON.stringify({ timestamp: new Date().toISOString(), ...entry }) + '\n'
    );
  } catch {
    // ignore log write errors
  }
}

export interface MessengerAlertResult {
  deliveredMax: boolean;
  deliveredTelegram: boolean;
  mode: 'LIVE_API' | 'LOCAL_QUEUE';
}

/**
 * Отправка мгновенного уведомления в группу консультантов в корпоративном мессенджере MAX (max.ru)
 * и дублирующего уведомления в Telegram (при наличии токенов в .env).
 */
export async function sendMaxAlert(text: string): Promise<MessengerAlertResult> {
  const maxToken = process.env.MAX_BOT_TOKEN || '';
  const maxChatId = process.env.MAX_CHAT_ID || '';
  const tgToken = process.env.TELEGRAM_BOT_TOKEN || '';
  const tgChatId = process.env.TELEGRAM_CHAT_ID || '';

  let deliveredMax = false;
  let deliveredTelegram = false;

  // 1. Отправка в MAX Bot API (https://botapi.max.ru/messages?access_token=...&chat_id=...)
  if (maxToken && maxChatId) {
    try {
      const url = `${MAX_API_BASE}/messages?access_token=${encodeURIComponent(
        maxToken
      )}&chat_id=${encodeURIComponent(maxChatId)}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (res.ok) {
        deliveredMax = true;
      }
    } catch (err: unknown) {
      console.warn('[MAX Messenger] Error sending alert:', err);
    }
  }

  // 2. Дублирование в Telegram (если настроен)
  if (tgToken && tgChatId) {
    try {
      const url = `https://api.telegram.org/bot${tgToken}/sendMessage`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: tgChatId,
          text,
        }),
      });
      if (res.ok) {
        deliveredTelegram = true;
      }
    } catch (err: unknown) {
      console.warn('[Telegram Bridge] Error sending alert:', err);
    }
  }

  const mode = deliveredMax || deliveredTelegram ? 'LIVE_API' : 'LOCAL_QUEUE';

  logMaxEvent({
    mode,
    deliveredMax,
    deliveredTelegram,
    text,
  });

  return { deliveredMax, deliveredTelegram, mode };
}

/**
 * Уведомление консультантов в MAX о новой заявке с любой из 9 форм сайта
 */
export async function notifyNewLeadInMax(lead: LeadEmailData): Promise<MessengerAlertResult> {
  const typeLabel = LEAD_TYPE_LABELS[lead.type] || lead.type;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://simona-bt.ru';

  const message = [
    `🔔 Новая заявка: ${typeLabel}`,
    `👤 Клиент: ${lead.name}`,
    `📞 Телефон: ${lead.phone}`,
    lead.email ? `✉️ Email: ${lead.email}` : null,
    lead.preferredShowroom ? `📍 Салон: ${lead.preferredShowroom}` : null,
    lead.preferredDate || lead.preferredTime
      ? `🕒 Время: ${lead.preferredDate || ''} ${lead.preferredTime || ''}`.trim()
      : null,
    lead.productName ? `📦 Прибор: ${lead.productName}` : null,
    lead.portfolioUrl ? `🔗 Ссылка: ${lead.portfolioUrl}` : null,
    lead.attachmentPath ? `📎 Прикреплен файл проекта` : null,
    lead.comment ? `💬 Детали: ${lead.comment}` : null,
    `📊 UTM: ${[lead.utmSource, lead.utmMedium, lead.utmCampaign].filter(Boolean).join('/') || 'прямой'} | ymClientId: ${lead.ymClientId || '—'}`,
    `👉 ${siteUrl}/manager/orders?tab=leads`,
  ]
    .filter(Boolean)
    .join('\n');

  return sendMaxAlert(message);
}

/**
 * Уведомление консультантов в MAX о новом заказе
 */
export async function notifyNewOrderInMax(order: OrderEmailData): Promise<MessengerAlertResult> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://simona-bt.ru';
  const deliveryLabel = DELIVERY_TYPE_LABELS[order.deliveryType] || order.deliveryType;
  const paymentLabel = PAYMENT_METHOD_LABELS[order.paymentMethod] || order.paymentMethod;

  let itemsText = '';
  try {
    const items = JSON.parse(order.itemsJson || '[]') as Array<{
      sku?: string;
      name: string;
      price: number;
      quantity: number;
    }>;
    itemsText = items
      .map((i) => `• [${i.sku || '—'}] ${i.name} (${i.quantity} шт. — ${(i.price * i.quantity).toLocaleString('ru-RU')} ₽)`)
      .join('\n');
  } catch {
    itemsText = '';
  }

  const isOneClick = order.status === 'ONE_CLICK';
  const header = isOneClick
    ? `⚡ Быстрый заказ в 1 клик №${order.orderNumber} — ${Math.round(order.totalAmount).toLocaleString('ru-RU')} ₽`
    : `🛒 Новый заказ №${order.orderNumber} — ${Math.round(order.totalAmount).toLocaleString('ru-RU')} ₽`;

  const message = [
    header,
    `👤 Покупатель: ${order.customerName}`,
    `📞 Телефон: ${order.customerPhone}`,
    order.customerEmail ? `✉️ Email: ${order.customerEmail}` : null,
    `🚚 Получение: ${deliveryLabel}`,
    order.deliveryAddress ? `📍 Адрес: ${order.deliveryAddress}` : null,
    `💳 Оплата: ${paymentLabel}`,
    itemsText ? `\nСостав:\n${itemsText}` : null,
    `\n📊 UTM: ${[order.utmSource, order.utmMedium, order.utmCampaign].filter(Boolean).join('/') || 'прямой'} | ymClientId: ${order.ymClientId || '—'}`,
    `👉 ${siteUrl}/manager/orders`,
  ]
    .filter(Boolean)
    .join('\n');

  return sendMaxAlert(message);
}

/**
 * Уведомление консультантов в MAX о холде средств в ЮKassa (waiting_for_capture)
 */
export async function notifyPaymentHoldInMax(order: OrderEmailData): Promise<MessengerAlertResult> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://simona-bt.ru';
  const message = [
    `💳 Средства по заказу №${order.orderNumber} захолдированы (${Math.round(order.totalAmount).toLocaleString('ru-RU')} ₽)!`,
    `👤 Покупатель: ${order.customerName} (${order.customerPhone})`,
    `📦 Проверьте резерв на складе Коминтерна 27 и подтвердите списание в ЛК ЮKassa.`,
    `👉 ${siteUrl}/manager/orders`,
  ].join('\n');

  return sendMaxAlert(message);
}

/**
 * Уведомление консультантов в MAX о новом сообщении в онлайн-чате на сайте.
 * Включает тег [#chat_{sessionId}] для двусторонней маршрутизации ответов.
 */
export async function notifyChatMessageInMax(params: {
  sessionId: string;
  clientName?: string | null;
  clientPhone?: string | null;
  text: string;
  pageUrl?: string | null;
}): Promise<MessengerAlertResult> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://simona-bt.ru';
  const clientInfo = [params.clientName || 'Гость сайта', params.clientPhone || null]
    .filter(Boolean)
    .join(' • ');

  const message = [
    `💬 Сообщение в онлайн-чате [#chat_${params.sessionId}]`,
    `👤 Клиент: ${clientInfo}`,
    params.pageUrl ? `🌐 Страница: ${params.pageUrl}` : null,
    `📝 Текст: ${params.text}`,
    `\nОтветьте Reply на это сообщение в MAX или в панели: ${siteUrl}/manager/orders?tab=chat`,
  ]
    .filter(Boolean)
    .join('\n');

  return sendMaxAlert(message);
}


import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.mail.ru';
const SMTP_PORT = Number(process.env.SMTP_PORT || 465);
const SMTP_USER = process.env.SMTP_USER || 'inet@simona-bt.ru';
const SMTP_PASS = process.env.SMTP_PASS || 'LNZOs9Wva6kfehXvRgM1';
const SMTP_FROM =
  process.env.SMTP_FROM || '«СИМОНА» Бытовая техника <inet@simona-bt.ru>';
const MANAGER_EMAIL = process.env.MANAGER_EMAIL || 'inet@simona-bt.ru';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://simona-bt.ru';

const MAIL_LOG_FILE = path.join(process.cwd(), 'storage', 'logs', 'mail.log');

function logMailEvent(entry: Record<string, unknown>) {
  try {
    const dir = path.dirname(MAIL_LOG_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.appendFileSync(
      MAIL_LOG_FILE,
      JSON.stringify({ timestamp: new Date().toISOString(), ...entry }) + '\n'
    );
  } catch {
    // ignore log write errors
  }
}

function createTransporter() {
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 10000,
  });
}

export async function verifySmtpConnection(): Promise<{ ok: boolean; error?: string }> {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    return { ok: true };
  } catch (err: unknown) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<{ sent: boolean; messageId?: string; error?: string }> {
  if (!options.to || !options.to.includes('@')) {
    return { sent: false, error: 'Invalid recipient email' };
  }

  if (process.env.SMTP_DRY_RUN === '1') {
    const mockId = `<dryrun-${Date.now()}@simona-bt.ru>`;
    logMailEvent({
      status: 'DRY_RUN_SENT',
      to: options.to,
      subject: options.subject,
      messageId: mockId,
      hasOnlinePayButton: options.html.includes('Оплатить заказ онлайн'),
    });
    return { sent: true, messageId: mockId };
  }

  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: SMTP_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    logMailEvent({
      status: 'SENT',
      to: options.to,
      subject: options.subject,
      messageId: info.messageId,
    });

    return { sent: true, messageId: info.messageId };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    logMailEvent({
      status: 'FALLBACK_LOGGED',
      to: options.to,
      subject: options.subject,
      error: errorMessage,
    });
    console.warn(`[Mailer] SMTP warning for "${options.subject}" -> ${options.to}: ${errorMessage}`);
    return { sent: false, error: errorMessage };
  }
}

export const ORDER_STATUS_LABELS: Record<string, string> = {
  NEW: 'Принят в обработку',
  CONFIRMED: 'Подтвержден экспертом',
  PAID: 'Оплачен',
  READY_FOR_PICKUP: 'Готов к выдаче на складе / в салоне',
  DELIVERED: 'Выполнен / Доставлен',
  CANCELLED: 'Отменен',
};

export const DELIVERY_TYPE_LABELS: Record<string, string> = {
  PICKUP_WAREHOUSE_KOMINTERNA: 'Самовывоз: Центральный склад (ул. Коминтерна, 27)',
  PICKUP_BELINSKOGO_15: 'Самовывоз: Флагманский салон (ул. Белинского, 15)',
  COURIER_DELIVERY: 'Аккуратная доставка и подъем на этаж собственной службой',
  WHITE_GLOVE_DELIVERY: 'Аккуратная доставка и подъем на этаж собственной службой',
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  IN_SALON: 'Оплата в салоне «СИМОНА» (картой или наличными)',
  CARD_ONLINE: 'Онлайн-оплата картой / СБП (ЮKassa)',
  ON_RECEIPT: 'Оплата при получении',
  B2B_INVOICE: 'Безналичный расчет по счету для юрлиц (с НДС)',
};

export const LEAD_TYPE_LABELS: Record<string, string> = {
  ACTIVE_KITCHEN_TESTDRIVE: 'Запись на тест-драйв «Активной кухни»',
  SHOWROOM_VISIT: 'Бронирование визита в салон с экспертом',
  PROJECT_MATCHING: 'Расчет спецификации по дизайн-проекту',
  B2B_CLUB: 'Вступление в Клуб дизайнеров и архитекторов',
  B2B_OPT: 'Запрос оптового прайс-листа (B2B Опт)',
  KITCHEN_ESTIMATE: 'Заявка на расчет комплекта техники для кухни',
  QUICK_CONSULT: 'Быстрая консультация эксперта',
  EQUIPMENT_SELECTION: 'Индивидуальный подбор комплекта техники',
  PRICE_MATCH: 'Запрос персонального ценового предложения (Нашли дешевле)',
};

function formatRub(amount: number): string {
  return `${Math.round(amount || 0).toLocaleString('ru-RU')} ₽`;
}

export function formatCustomerGreeting(name?: string | null): string {
  if (!name) return 'Здравствуйте!';
  const trimmed = name.trim();
  const lower = trimmed.toLowerCase();
  if (
    !trimmed ||
    lower === 'покупатель' ||
    lower === 'покупатель симона' ||
    lower.startsWith('покупатель симона')
  ) {
    return 'Здравствуйте!';
  }
  return `Здравствуйте, ${trimmed}!`;
}

function wrapLuxuryEmailHtml(title: string, badgeOrBody: string, maybeBody?: string): string {
  const bodyHtml = maybeBody !== undefined ? maybeBody : badgeOrBody;
  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="format-detection" content="telephone=no, address=no, email=no, date=no" />
  <title>${title}</title>
  <style type="text/css">
    /* Отключение авто-ссылок для адресов в подвале */
    .address-link a,
    .address-link {
      color: #87888A !important;
      text-decoration: none !important;
      font-size: inherit !important;
      font-family: inherit !important;
      font-weight: inherit !important;
      line-height: inherit !important;
      pointer-events: none !important;
    }
  </style>
</head>
<body id="body" style="margin:0;padding:0;background-color:#111315;font-family:'Montserrat',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#D7D9DB;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#111315;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;background-color:#16191D;border:1px solid #2B313A;border-radius:16px;overflow:hidden;">
          <!-- Header: ТОЛЬКО логотип (в 2 раза крупнее) и телефон (иконка и номер) -->
          <tr>
            <td style="padding:22px 32px;background-color:#16191D;border-bottom:1px solid #2B313A;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;">
                <tr>
                  <td align="left" valign="middle">
                    <a href="${SITE_URL}" target="_blank" style="display:inline-block;text-decoration:none;border:0;outline:none;">
                      <img src="${SITE_URL}/brand/email-logo-v3.png" alt="СИМОНА" width="270" height="48" style="display:block;border:0;outline:none;font-family:'Montserrat',sans-serif;font-size:24px;font-weight:700;color:#00979C;" />
                    </a>
                  </td>
                  <td align="right" valign="middle">
                    <a href="tel:+78314237600" style="display:inline-block;text-decoration:none;border:0;outline:none;">
                      <img src="${SITE_URL}/brand/email-phone-v2.png" alt="(831) 423 76 00" width="114" height="20" style="display:block;border:0;outline:none;font-family:'Montserrat',sans-serif;font-size:14px;font-weight:700;color:#FFFFFF;" />
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Main Body -->
          <tr>
            <td style="padding:32px;">
              ${bodyHtml}
            </td>
          </tr>
          <!-- Footer: Наши магазины в Нижнем Новгороде -->
          <tr>
            <td style="padding:24px 32px;background-color:#111315;border-top:1px solid #2B313A;font-size:13px;color:#87888A;line-height:1.6;">
              <div style="color:#FFFFFF;font-weight:600;margin-bottom:8px;">Наши магазины в Нижнем Новгороде:</div>
              <div style="margin-bottom:4px;color:#87888A;" class="address-link">• СИМОНА на <span style="color:#87888A;text-decoration:none;">Белинского,&zwnj;&nbsp;15</span></div>
              <div style="margin-bottom:12px;color:#87888A;" class="address-link">• Omoikiri &amp; Körting на <span style="color:#87888A;text-decoration:none;">Белинского,&zwnj;&nbsp;11/66</span></div>
              <div style="padding-top:10px;border-top:1px solid #1E2228;color:#87888A;">
                Сайт: <a href="${SITE_URL}" target="_blank" style="color:#00979C !important;text-decoration:underline;font-weight:600;"><span style="color:#00979C !important;text-decoration:underline;">simona-bt.ru</span></a>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export interface OrderEmailItem {
  sku?: string;
  name: string;
  price: number;
  quantity: number;
  brand?: string;
  physicalStatus?: string;
}

export interface OrderEmailData {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  deliveryType: string;
  deliveryAddress?: string | null;
  deliveryDate?: string | null;
  deliveryComment?: string | null;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  paymentLink?: string | null;
  companyName?: string | null;
  companyInn?: string | null;
  itemsJson: string;
  ymClientId?: string | null;
  yclid?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
}

function parseOrderItems(itemsJson: string): OrderEmailItem[] {
  try {
    const parsed = JSON.parse(itemsJson || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function renderOrderItemsTable(items: OrderEmailItem[]): string {
  const rows = items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #2B313A;color:#87888A;font-family:monospace;font-size:12px;">
          ${item.sku || '—'}
        </td>
        <td style="padding:10px 12px;border-bottom:1px solid #2B313A;color:#FFFFFF;font-size:13px;font-weight:500;">
          ${item.name}
        </td>
        <td style="padding:10px 12px;border-bottom:1px solid #2B313A;color:#D7D9DB;font-size:13px;text-align:center;">
          ${item.quantity} шт.
        </td>
        <td style="padding:10px 12px;border-bottom:1px solid #2B313A;color:#00979C;font-size:13px;font-weight:700;text-align:right;white-space:nowrap;">
          ${formatRub(item.price * item.quantity)}
        </td>
      </tr>`
    )
    .join('');

  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #2B313A;border-radius:12px;overflow:hidden;margin:16px 0;background-color:#1E2228;">
      <thead>
        <tr style="background-color:#111315;">
          <th align="left" style="padding:10px 12px;font-size:11px;color:#87888A;border-bottom:1px solid #2B313A;">Код 1С</th>
          <th align="left" style="padding:10px 12px;font-size:11px;color:#87888A;border-bottom:1px solid #2B313A;">Наименование прибора</th>
          <th align="center" style="padding:10px 12px;font-size:11px;color:#87888A;border-bottom:1px solid #2B313A;">Кол-во</th>
          <th align="right" style="padding:10px 12px;font-size:11px;color:#87888A;border-bottom:1px solid #2B313A;">Сумма</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>`;
}

/**
 * 1. Письма при создании нового заказа (клиенту и менеджеру)
 */
export async function sendOrderCreatedEmails(order: OrderEmailData) {
  const items = parseOrderItems(order.itemsJson);
  const deliveryLabel = DELIVERY_TYPE_LABELS[order.deliveryType] || order.deliveryType;
  const paymentLabel = PAYMENT_METHOD_LABELS[order.paymentMethod] || order.paymentMethod;
  const itemsTableHtml = renderOrderItemsTable(items);

  // А) Письмо клиенту (если указан email)
  if (order.customerEmail) {
    const clientBody = `
      <h1 style="font-size:20px;font-weight:700;color:#FFFFFF;margin:0 0 12px 0;">
        ${formatCustomerGreeting(order.customerName)}
      </h1>
      <p style="font-size:14px;color:#D7D9DB;line-height:1.6;margin:0 0 16px 0;">
        Благодарим вас за заказ в сети салонов и интернет-магазине бытовой техники «СИМОНА».
        Ваш заказ <strong style="color:#FFFFFF;">№${order.orderNumber}</strong> принят в обработку.
      </p>
      ${itemsTableHtml}
      <div style="text-align:right;font-size:18px;font-weight:700;color:#00979C;margin-bottom:20px;">
        Итого: ${formatRub(order.totalAmount)}
      </div>
      <div style="padding:16px;background-color:#1E2228;border:1px solid #2B313A;border-radius:12px;font-size:13px;line-height:1.7;">
        <div><strong style="color:#FFFFFF;">Способ получения:</strong> ${deliveryLabel}</div>
        ${order.deliveryAddress ? `<div><strong style="color:#FFFFFF;">Адрес доставки:</strong> ${order.deliveryAddress}</div>` : ''}
        ${order.deliveryDate ? `<div><strong style="color:#FFFFFF;">Желаемая дата:</strong> ${order.deliveryDate}</div>` : ''}
        <div><strong style="color:#FFFFFF;">Способ оплаты:</strong> ${paymentLabel}</div>
      </div>
      <p style="font-size:13px;color:#87888A;line-height:1.6;margin:20px 0 0 0;">
        Эксперт салона «СИМОНА» свяжется с вами в ближайшее время по телефону <strong style="color:#FFFFFF;">${order.customerPhone}</strong> для подтверждения резерва, сверки монтажной совместимости и согласования времени выдачи или доставки.
      </p>
    `;

    await sendEmail({
      to: order.customerEmail,
      subject: `Заказ №${order.orderNumber} принят в обработку — «СИМОНА»`,
      html: wrapLuxuryEmailHtml(
        `Заказ №${order.orderNumber} принят в обработку`,
        'Уведомление о заказе',
        clientBody
      ),
    });
  }

  // Б) Письмо менеджеру
  const managerBody = `
    <h1 style="font-size:20px;font-weight:700;color:#FFFFFF;margin:0 0 12px 0;">
      Новый заказ №${order.orderNumber} на сумму ${formatRub(order.totalAmount)}
    </h1>
    <div style="padding:16px;background-color:#1E2228;border:1px solid #2B313A;border-radius:12px;font-size:13px;line-height:1.7;margin-bottom:16px;">
      <div><strong style="color:#FFFFFF;">Покупатель:</strong> ${order.customerName}</div>
      <div><strong style="color:#FFFFFF;">Телефон:</strong> <a href="tel:${order.customerPhone}" style="color:#00979C;font-weight:700;">${order.customerPhone}</a></div>
      <div><strong style="color:#FFFFFF;">Email:</strong> ${order.customerEmail || 'не указан'}</div>
      <div><strong style="color:#FFFFFF;">Способ получения:</strong> ${deliveryLabel}</div>
      ${order.deliveryAddress ? `<div><strong style="color:#FFFFFF;">Адрес:</strong> ${order.deliveryAddress}</div>` : ''}
      ${order.deliveryDate ? `<div><strong style="color:#FFFFFF;">Желаемая дата:</strong> ${order.deliveryDate}</div>` : ''}
      ${order.deliveryComment ? `<div><strong style="color:#FFFFFF;">Комментарий:</strong> ${order.deliveryComment}</div>` : ''}
      <div><strong style="color:#FFFFFF;">Способ оплаты:</strong> ${paymentLabel}</div>
      ${order.companyName ? `<div><strong style="color:#FFFFFF;">Юрлицо / ИНН:</strong> ${order.companyName} (ИНН: ${order.companyInn || '—'})</div>` : ''}
    </div>
    ${itemsTableHtml}
    <div style="text-align:right;font-size:18px;font-weight:700;color:#00979C;margin-bottom:20px;">
      Итого к оплате: ${formatRub(order.totalAmount)}
    </div>
    <div style="padding:12px 16px;background-color:#111315;border:1px solid #2B313A;border-radius:12px;font-size:11px;color:#87888A;margin-bottom:20px;">
      <strong>Сквозная аналитика:</strong>
      ymClientId: ${order.ymClientId || '—'} |
      yclid: ${order.yclid || '—'} |
      UTM: ${[order.utmSource, order.utmMedium, order.utmCampaign].filter(Boolean).join(' / ') || 'прямой заход'}
    </div>
    <div style="text-align:left;">
      <a href="${SITE_URL}/manager/orders" style="display:inline-block;padding:12px 24px;background-color:#00979C;color:#FFFFFF;text-decoration:none;border-radius:12px;font-size:13px;font-weight:600;">
        Открыть заказ в панели менеджера
      </a>
    </div>
  `;

  return sendEmail({
    to: MANAGER_EMAIL,
    subject: `[Новый заказ №${order.orderNumber}] ${order.customerName} (${order.customerPhone}) — ${formatRub(order.totalAmount)}`,
    html: wrapLuxuryEmailHtml(
      `Новый заказ №${order.orderNumber}`,
      'Операционная панель менеджера',
      managerBody
    ),
  });
}

/**
 * 2. Письмо клиенту при смене статуса заказа в /manager/orders
 * Включает кнопку [ Оплатить заказ онлайн ], если статус CONFIRMED и передана paymentLink
 */
export async function sendOrderStatusChangedEmail(order: OrderEmailData) {
  if (!order.customerEmail) {
    return { sent: false, error: 'Customer email is empty' };
  }

  const statusLabel = ORDER_STATUS_LABELS[order.status] || order.status;
  const items = parseOrderItems(order.itemsJson);
  const itemsTableHtml = renderOrderItemsTable(items);
  const deliveryLabel = DELIVERY_TYPE_LABELS[order.deliveryType] || order.deliveryType;

  const showPaymentBlock =
    order.status === 'CONFIRMED' && Boolean(order.paymentLink && order.paymentLink.trim());

  const paymentCtaHtml = showPaymentBlock
    ? `
      <div style="margin:24px 0;padding:24px;background-color:#1E2228;border:1px solid #00979C;border-radius:12px;">
        <div style="font-size:15px;font-weight:700;color:#FFFFFF;margin-bottom:8px;">
          Ваш заказ проверен экспертом и готов к онлайн-оплате
        </div>
        <p style="font-size:13px;color:#D7D9DB;line-height:1.6;margin:0 0 16px 0;">
          Наличие приборов и совместимость подтверждены. Вы можете безопасно оплатить заказ банковской картой или через СБП (ЮKassa с электронным чеком 54-ФЗ):
        </p>
        <a href="${order.paymentLink!.trim()}" style="display:inline-block;padding:14px 28px;background-color:#00979C;color:#FFFFFF;text-decoration:none;border-radius:12px;font-size:14px;font-weight:700;">
          Оплатить заказ онлайн — ${formatRub(order.totalAmount)}
        </a>
      </div>`
    : '';

  const bodyHtml = `
    <h1 style="font-size:20px;font-weight:700;color:#FFFFFF;margin:0 0 12px 0;">
      Статус вашего заказа №${order.orderNumber} обновлен
    </h1>
    <p style="font-size:14px;color:#D7D9DB;line-height:1.6;margin:0 0 16px 0;">
      ${formatCustomerGreeting(order.customerName)} Статус вашего заказа изменен на:
    </p>
    <div style="display:inline-block;padding:10px 18px;border-radius:12px;background-color:rgba(0,151,156,0.18);border:1px solid #00979C;color:#FFFFFF;font-size:15px;font-weight:700;margin-bottom:16px;">
      ${statusLabel}
    </div>
    ${paymentCtaHtml}
    ${itemsTableHtml}
    <div style="padding:14px 16px;background-color:#1E2228;border:1px solid #2B313A;border-radius:12px;font-size:13px;line-height:1.6;">
      <div><strong style="color:#FFFFFF;">Сумма заказа:</strong> ${formatRub(order.totalAmount)}</div>
      <div><strong style="color:#FFFFFF;">Способ получения:</strong> ${deliveryLabel}</div>
      ${order.deliveryAddress ? `<div><strong style="color:#FFFFFF;">Адрес:</strong> ${order.deliveryAddress}</div>` : ''}
    </div>
  `;

  return sendEmail({
    to: order.customerEmail,
    subject: `Статус вашего заказа №${order.orderNumber} изменен: ${statusLabel} — «СИМОНА»`,
    html: wrapLuxuryEmailHtml(
      `Статус заказа №${order.orderNumber}`,
      'Обновление статуса заказа',
      bodyHtml
    ),
  });
}

export interface LeadEmailData {
  id: string;
  type: string;
  name: string;
  phone: string;
  email?: string | null;
  preferredDate?: string | null;
  preferredTime?: string | null;
  preferredShowroom?: string | null;
  productId?: string | null;
  productName?: string | null;
  portfolioUrl?: string | null;
  attachmentPath?: string | null;
  comment?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  ymClientId?: string | null;
  yclid?: string | null;
  pageUrl?: string | null;
}

/**
 * 3. Письма при отправке любой из 9 лид-форм (менеджеру и клиенту)
 */
export async function sendLeadNotificationEmails(lead: LeadEmailData) {
  const typeLabel = LEAD_TYPE_LABELS[lead.type] || lead.type;

  // А) Письмо клиенту (если оставил email)
  if (lead.email) {
    const clientBody = `
      <h1 style="font-size:20px;font-weight:700;color:#FFFFFF;margin:0 0 12px 0;">
        ${formatCustomerGreeting(lead.name)}
      </h1>
      <p style="font-size:14px;color:#D7D9DB;line-height:1.6;margin:0 0 16px 0;">
        Ваше обращение <strong style="color:#FFFFFF;">«${typeLabel}»</strong> принято экспертами салона «СИМОНА».
      </p>
      <div style="padding:16px;background-color:#1E2228;border:1px solid #2B313A;border-radius:12px;font-size:13px;line-height:1.7;">
        <div><strong style="color:#FFFFFF;">Контактный телефон:</strong> ${lead.phone}</div>
        ${lead.preferredShowroom ? `<div><strong style="color:#FFFFFF;">Выбранный салон:</strong> ${lead.preferredShowroom}</div>` : ''}
        ${lead.preferredDate ? `<div><strong style="color:#FFFFFF;">Желаемая дата и время:</strong> ${lead.preferredDate} ${lead.preferredTime || ''}</div>` : ''}
        ${lead.productName ? `<div><strong style="color:#FFFFFF;">Интересующий прибор:</strong> ${lead.productName}</div>` : ''}
      </div>
      <p style="font-size:13px;color:#87888A;line-height:1.6;margin:20px 0 0 0;">
        Профильный специалист свяжется с вами в течение 15 минут в рабочее время салона (10:00 – 20:00).
      </p>
    `;

    await sendEmail({
      to: lead.email,
      subject: `Ваша заявка принята: ${typeLabel} — «СИМОНА»`,
      html: wrapLuxuryEmailHtml(
        'Ваша заявка принята',
        'Обратная связь «СИМОНА»',
        clientBody
      ),
    });
  }

  // Б) Письмо менеджеру
  const attachmentUrl = lead.attachmentPath
    ? `${SITE_URL}/api/manager/leads/attachment?id=${encodeURIComponent(lead.id)}`
    : null;

  const managerBody = `
    <h1 style="font-size:20px;font-weight:700;color:#FFFFFF;margin:0 0 12px 0;">
      Новая заявка с сайта: ${typeLabel}
    </h1>
    <div style="padding:16px;background-color:#1E2228;border:1px solid #2B313A;border-radius:12px;font-size:13px;line-height:1.7;margin-bottom:16px;">
      <div><strong style="color:#FFFFFF;">Тип обращения:</strong> ${typeLabel} (${lead.type})</div>
      <div><strong style="color:#FFFFFF;">Имя:</strong> ${lead.name}</div>
      <div><strong style="color:#FFFFFF;">Телефон:</strong> <a href="tel:${lead.phone}" style="color:#00979C;font-weight:700;">${lead.phone}</a></div>
      ${lead.email ? `<div><strong style="color:#FFFFFF;">Email:</strong> ${lead.email}</div>` : ''}
      ${lead.preferredShowroom ? `<div><strong style="color:#FFFFFF;">Салон:</strong> ${lead.preferredShowroom}</div>` : ''}
      ${lead.preferredDate || lead.preferredTime ? `<div><strong style="color:#FFFFFF;">Дата / Время:</strong> ${lead.preferredDate || ''} ${lead.preferredTime || ''}</div>` : ''}
      ${lead.productName ? `<div><strong style="color:#FFFFFF;">Товар:</strong> ${lead.productName} (${lead.productId || ''})</div>` : ''}
      ${lead.portfolioUrl ? `<div><strong style="color:#FFFFFF;">Ссылка / Портфолио:</strong> ${lead.portfolioUrl}</div>` : ''}
      ${lead.comment ? `<div><strong style="color:#FFFFFF;">Комментарий / Детали:</strong> ${lead.comment}</div>` : ''}
      ${attachmentUrl ? `<div><strong style="color:#FFFFFF;">Файл проекта:</strong> <a href="${attachmentUrl}" style="color:#00979C;">Скачать вложение (${path.basename(lead.attachmentPath!)})</a></div>` : ''}
    </div>
    <div style="padding:12px 16px;background-color:#111315;border:1px solid #2B313A;border-radius:12px;font-size:11px;color:#87888A;margin-bottom:20px;">
      <strong>Сквозная аналитика:</strong>
      ymClientId: ${lead.ymClientId || '—'} |
      yclid: ${lead.yclid || '—'} |
      UTM: ${[lead.utmSource, lead.utmMedium, lead.utmCampaign].filter(Boolean).join(' / ') || 'прямой заход'}
    </div>
    <div style="text-align:left;">
      <a href="${SITE_URL}/manager/orders?tab=leads" style="display:inline-block;padding:12px 24px;background-color:#00979C;color:#FFFFFF;text-decoration:none;border-radius:12px;font-size:13px;font-weight:600;">
        Открыть заявки в панели менеджера
      </a>
    </div>
  `;

  return sendEmail({
    to: MANAGER_EMAIL,
    subject: `[Заявка: ${typeLabel}] ${lead.name} (${lead.phone})`,
    html: wrapLuxuryEmailHtml(
      `Новая заявка: ${typeLabel}`,
      'Лидогенерация simona-bt.ru',
      managerBody
    ),
  });
}

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  PENDING: 'Ожидает оплаты',
  HOLD: 'Средства захолдированы (ожидает списания)',
  PAID: 'Оплачено (электронный чек 54-ФЗ)',
  CANCELLED: 'Холд отменен / Возврат резерва',
  REFUNDED: 'Средства возвращены покупателю',
};

/**
 * 4. Письма при изменении платежного статуса ЮKassa (HOLD / PAID / CANCELLED / REFUNDED)
 */
export async function sendPaymentStatusEmail(
  order: OrderEmailData,
  paymentStatus: 'HOLD' | 'PAID' | 'CANCELLED' | 'REFUNDED'
) {
  const items = parseOrderItems(order.itemsJson);
  const itemsTableHtml = renderOrderItemsTable(items);
  const statusLabel = PAYMENT_STATUS_LABELS[paymentStatus] || paymentStatus;

  if (paymentStatus === 'HOLD') {
    const managerBody = `
      <h1 style="font-size:20px;font-weight:700;color:#FFFFFF;margin:0 0 12px 0;">
        💳 Средства по заказу №${order.orderNumber} захолдированы (${formatRub(order.totalAmount)})
      </h1>
      <p style="font-size:14px;color:#D7D9DB;line-height:1.6;margin:0 0 16px 0;">
        Покупатель <strong style="color:#FFFFFF;">${order.customerName}</strong> (${order.customerPhone}) успешно авторизовал платеж в ЮKassa (двухстадийный холд <code>capture: false</code>).
        Проверьте физический резерв на складе (ул. Коминтерна, 27) и подтвердите списание средств в личном кабинете ЮKassa.
      </p>
      ${itemsTableHtml}
      <div style="text-align:left;margin-top:16px;">
        <a href="${SITE_URL}/manager/orders" style="display:inline-block;padding:12px 24px;background-color:#00979C;color:#FFFFFF;text-decoration:none;border-radius:12px;font-size:13px;font-weight:600;">
          Открыть заказ №${order.orderNumber} в панели менеджера
        </a>
      </div>
    `;

    await sendEmail({
      to: MANAGER_EMAIL,
      subject: `[ЮKassa HOLD] Заказ №${order.orderNumber} — средства захолдированы (${formatRub(order.totalAmount)})`,
      html: wrapLuxuryEmailHtml(
        `Средства захолдированы — №${order.orderNumber}`,
        'ЮKassa Эквайринг (HOLD)',
        managerBody
      ),
    });
  }

  if (!order.customerEmail) {
    return { sent: false, error: 'Customer email is empty' };
  }

  let explanationText = '';
  if (paymentStatus === 'HOLD') {
    explanationText =
      'Сумма заказа временно зарезервирована (захолдирована) на вашей карте. Итоговое списание и отправка кассового чека 54-ФЗ произойдут сразу после проверки резерва кладовщиком на центральном складе «СИМОНА» (ул. Коминтерна, 27).';
  } else if (paymentStatus === 'PAID') {
    explanationText =
      'Оплата вашего заказа успешно подтверждена и проведена. Электронный кассовый чек в соответствии с 54-ФЗ направлен оператором фискальных данных на вашу почту.';
  } else if (paymentStatus === 'CANCELLED') {
    explanationText =
      'Резервирование (холд) средств по заказу отменено. Банк автоматически разблокирует сумму на вашем счете в кратчайшие сроки.';
  } else if (paymentStatus === 'REFUNDED') {
    explanationText =
      'По вашему заказу оформлен возврат денежных средств. Срок зачисления зависит от банка-эмитента вашей карты.';
  }

  const clientBody = `
    <h1 style="font-size:20px;font-weight:700;color:#FFFFFF;margin:0 0 12px 0;">
      Статус оплаты заказа №${order.orderNumber}
    </h1>
    <div style="display:inline-block;padding:10px 18px;border-radius:12px;background-color:rgba(0,151,156,0.18);border:1px solid #00979C;color:#FFFFFF;font-size:15px;font-weight:700;margin-bottom:16px;">
      ${statusLabel}
    </div>
    <p style="font-size:14px;color:#D7D9DB;line-height:1.6;margin:0 0 16px 0;">
      ${formatCustomerGreeting(order.customerName)} ${explanationText}
    </p>
    ${itemsTableHtml}
    <div style="text-align:right;font-size:18px;font-weight:700;color:#00979C;">
      Сумма: ${formatRub(order.totalAmount)}
    </div>
  `;

  return sendEmail({
    to: order.customerEmail,
    subject: `Оплата заказа №${order.orderNumber}: ${statusLabel} — «СИМОНА»`,
    html: wrapLuxuryEmailHtml(
      `Оплата заказа №${order.orderNumber}`,
      'Платежное уведомление ЮKassa',
      clientBody
    ),
  });
}

/**
 * 5. Отправка одноразового 6-значного кода для входа в Личный кабинет (/profile)
 */
export async function sendOtpEmail(
  email: string,
  code: string,
  customerName?: string | null
) {
  const greeting = formatCustomerGreeting(customerName);
  const bodyHtml = `
    <h1 style="font-size:20px;font-weight:700;color:#FFFFFF;margin:0 0 12px 0;">
      ${greeting}
    </h1>
    <p style="font-size:14px;color:#D7D9DB;line-height:1.6;margin:0 0 20px 0;">
      Ваш одноразовый код для входа в Личный Кабинет покупателя:
    </p>
    <div style="padding:20px 28px;background-color:#1E2228;border:1px solid #00979C;border-radius:12px;font-family:monospace;font-size:32px;font-weight:700;letter-spacing:0.25em;color:#FFFFFF;text-align:left;display:inline-block;margin-bottom:20px;">
      ${code}
    </div>
    <p style="font-size:12px;color:#87888A;line-height:1.6;margin:0;">
      Код действителен в течение 15 минут. Если вы не запрашивали код авторизации на сайте simona-bt.ru, просто проигнорируйте это письмо.
    </p>
  `;

  return sendEmail({
    to: email,
    subject: `${code} — код входа в Личный кабинет «СИМОНА»`,
    html: wrapLuxuryEmailHtml(
      'Код входа в Личный кабинет',
      'Безопасный вход simona-bt.ru',
      bodyHtml
    ),
  });
}


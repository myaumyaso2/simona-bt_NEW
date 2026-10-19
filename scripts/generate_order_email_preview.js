const fs = require('fs');
const path = require('path');

// Base64 encode header images so they render reliably in file:// preview
const logoPath = path.join(process.cwd(), 'public', 'brand', 'email-logo-v3.png');
const phonePath = path.join(process.cwd(), 'public', 'brand', 'email-phone-v2.png');
const logoBase64 = fs.existsSync(logoPath) ? `data:image/png;base64,${fs.readFileSync(logoPath).toString('base64')}` : 'https://simona-bt.ru/brand/email-logo-v3.png';
const phoneBase64 = fs.existsSync(phonePath) ? `data:image/png;base64,${fs.readFileSync(phonePath).toString('base64')}` : 'https://simona-bt.ru/brand/email-phone-v2.png';

const order15104 = {
  orderNumber: '15104',
  customerName: 'Алексей',
  customerPhone: '+7 (950) 617-64-77',
  customerEmail: 'alex@test.ru',
  deliveryType: 'PICKUP_WAREHOUSE_KOMINTERNA',
  paymentMethod: 'IN_SALON',
  totalAmount: 285502,
  items: [
    {
      sku: '85042',
      name: 'Холодильник Körting KSI 1785',
      quantity: 1,
      price: 100490,
    },
    {
      sku: '86535',
      name: 'Холодильник Neff GI 5113F20R Морозильник + KI8413D20R',
      quantity: 1,
      price: 185012,
    },
  ],
  ymClientId: '1729068000.1234567',
  yclid: null,
  utmSource: null,
  utmMedium: null,
  utmCampaign: null,
};

const DELIVERY_TYPE_LABELS = {
  PICKUP_WAREHOUSE_KOMINTERNA: 'самовывоз (склад на ул. Коминтерна, 27)',
  PICKUP_BELINSKOGO_15: 'самовывоз (салон на ул. Белинского, 15)',
  COURIER_DELIVERY: 'доставка',
  WHITE_GLOVE_DELIVERY: 'доставка',
};

const PAYMENT_METHOD_LABELS = {
  IN_SALON: 'в салоне «СИМОНА» (картой или наличными)',
  AT_WAREHOUSE: 'на складе «СИМОНА» (картой или наличными)',
  ON_DELIVERY: 'в момент доставки (наличными курьеру)',
  ON_RECEIPT: 'в момент доставки (наличными курьеру)',
  CARD_ONLINE: 'онлайн картой (ЮKassa / СБП)',
  B2B_INVOICE: 'счет для юрлиц (B2B, безналичный расчет с НДС 20%)',
};

function formatDeliveryLabel(deliveryType) {
  if (!deliveryType) return 'самовывоз (склад на ул. Коминтерна, 27)';
  if (DELIVERY_TYPE_LABELS[deliveryType]) return DELIVERY_TYPE_LABELS[deliveryType];
  const lower = String(deliveryType).toLowerCase();
  if (lower.includes('коминтерна')) return 'самовывоз (склад на ул. Коминтерна, 27)';
  if (lower.includes('белинского')) return 'самовывоз (салон на ул. Белинского, 15)';
  if (lower.includes('доставка')) return 'доставка';
  return deliveryType;
}

function formatPaymentLabel(paymentMethod) {
  if (!paymentMethod) return 'в салоне «СИМОНА» (картой или наличными)';
  if (PAYMENT_METHOD_LABELS[paymentMethod]) return PAYMENT_METHOD_LABELS[paymentMethod];
  const lower = String(paymentMethod).toLowerCase();
  if (lower.includes('салон')) return 'в салоне «СИМОНА» (картой или наличными)';
  if (lower.includes('склад')) return 'на складе «СИМОНА» (картой или наличными)';
  if (lower.includes('доставк') || lower.includes('курьер')) return 'в момент доставки (наличными курьеру)';
  if (lower.includes('онлайн') || lower.includes('картой')) return 'онлайн картой (ЮKassa / СБП)';
  if (lower.includes('счет') || lower.includes('юрлиц') || lower.includes('b2b')) return 'счет для юрлиц (B2B, безналичный расчет с НДС 20%)';
  return paymentMethod;
}

function formatRub(amount) {
  return `${Math.round(amount || 0).toLocaleString('ru-RU')} ₽`;
}

function formatNonBreakingPhone(phone) {
  if (!phone) return '';
  return phone
    .trim()
    .replace(/\s+/g, '&nbsp;')
    .replace(/-/g, '&#8209;');
}

function renderOrderItemsTable(items) {
  const rows = items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #2B313A;color:#FFFFFF;font-family:monospace;font-size:12px;font-weight:600;">
          ${item.sku || '—'}
        </td>
        <td style="padding:10px 12px;border-bottom:1px solid #2B313A;color:#FFFFFF;font-size:13px;font-weight:500;">
          ${item.name}
        </td>
        <td style="padding:10px 12px;border-bottom:1px solid #2B313A;color:#FFFFFF;font-size:13px;text-align:center;">
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
          <th align="left" style="padding:10px 12px;font-size:11px;color:#D7D9DB;font-weight:600;border-bottom:1px solid #2B313A;">Код 1С</th>
          <th align="left" style="padding:10px 12px;font-size:11px;color:#D7D9DB;font-weight:600;border-bottom:1px solid #2B313A;">Наименование прибора</th>
          <th align="center" style="padding:10px 12px;font-size:11px;color:#D7D9DB;font-weight:600;border-bottom:1px solid #2B313A;">Кол-во</th>
          <th align="right" style="padding:10px 12px;font-size:11px;color:#D7D9DB;font-weight:600;border-bottom:1px solid #2B313A;">Сумма</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>`;
}

function wrapLuxuryEmailHtml(title, badgeOrBody, maybeBody) {
  const bodyHtml = maybeBody !== undefined ? maybeBody : badgeOrBody;
  return `
    <table width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;background-color:#16191D;border:1px solid #2B313A;border-radius:16px;overflow:hidden;margin:0 auto 40px auto;">
      <!-- Header -->
      <tr>
        <td style="padding:22px 32px;background-color:#16191D;border-bottom:1px solid #2B313A;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;">
            <tr>
              <td align="left" valign="middle">
                <a href="https://simona-bt.ru" target="_blank" style="display:inline-block;text-decoration:none;border:0;outline:none;">
                  <img src="${logoBase64}" alt="СИМОНА" width="270" height="48" style="display:block;border:0;outline:none;font-family:'Montserrat',sans-serif;font-size:24px;font-weight:700;color:#00979C;" />
                </a>
              </td>
              <td align="right" valign="middle">
                <a href="tel:+78314237600" style="display:inline-block;text-decoration:none;border:0;outline:none;">
                  <img src="${phoneBase64}" alt="(831) 423 76 00" width="114" height="20" style="display:block;border:0;outline:none;font-family:'Montserrat',sans-serif;font-size:14px;font-weight:700;color:#FFFFFF;" />
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
        <td style="padding:24px 32px;background-color:#111315;border-top:1px solid #2B313A;font-size:13px;color:#D7D9DB;line-height:1.6;">
          <div style="color:#FFFFFF;font-weight:600;margin-bottom:8px;">Наши магазины в Нижнем Новгороде:</div>
          <div style="margin-bottom:4px;color:#D7D9DB;" class="address-link">• СИМОНА на <span style="color:#D7D9DB;text-decoration:none;">Белинского,&zwnj;&nbsp;15</span></div>
          <div style="margin-bottom:12px;color:#D7D9DB;" class="address-link">• Omoikiri &amp; Körting на <span style="color:#D7D9DB;text-decoration:none;">Белинского,&zwnj;&nbsp;11/66</span></div>
          <div style="padding-top:10px;border-top:1px solid #1E2228;color:#D7D9DB;">
            Сайт: <a href="https://simona-bt.ru" target="_blank" style="color:#00979C !important;text-decoration:underline;font-weight:600;"><span style="color:#00979C !important;text-decoration:underline;">simona-bt.ru</span></a>
          </div>
        </td>
      </tr>
    </table>`;
}

// 1. Письмо менеджеру (Заказ №15104)
const managerItemsTableHtml = renderOrderItemsTable(order15104.items);
const managerBody = `
  <h1 style="font-size:20px;font-weight:700;color:#FFFFFF;margin:0 0 12px 0;">
    Новый заказ №${order15104.orderNumber} на сумму ${formatRub(order15104.totalAmount)}
  </h1>
  <div style="padding:16px;background-color:#1E2228;border:1px solid #2B313A;border-radius:12px;font-size:13px;line-height:1.7;margin-bottom:16px;">
    <div><strong style="color:#FFFFFF;">Покупатель:</strong> <span style="color:#FFFFFF;">${order15104.customerName}</span></div>
    <div><strong style="color:#FFFFFF;">Телефон:</strong> <a href="tel:${order15104.customerPhone}" style="color:#00979C;font-weight:700;text-decoration:none;"><span style="white-space:nowrap;color:#00979C;font-weight:700;">${formatNonBreakingPhone(order15104.customerPhone)}</span></a></div>
    <div><strong style="color:#FFFFFF;">Email:</strong> <span style="color:#FFFFFF;">${order15104.customerEmail}</span></div>
    <div><strong style="color:#FFFFFF;">Способ получения:</strong> <span style="color:#FFFFFF;">${formatDeliveryLabel(order15104.deliveryType)}</span></div>
    <div><strong style="color:#FFFFFF;">Способ оплаты:</strong> <span style="color:#FFFFFF;">${formatPaymentLabel(order15104.paymentMethod)}</span></div>
  </div>
  ${managerItemsTableHtml}
  <div style="text-align:right;font-size:18px;font-weight:700;color:#00979C;margin-bottom:20px;">
    Итого к оплате: ${formatRub(order15104.totalAmount)}
  </div>
  <div style="padding:12px 16px;background-color:#111315;border:1px solid #2B313A;border-radius:12px;font-size:12px;color:#D7D9DB;margin-bottom:20px;">
    <strong style="color:#FFFFFF;">Сквозная аналитика:</strong>
    ymClientId: ${order15104.ymClientId || '—'} |
    yclid: ${order15104.yclid || '—'} |
    UTM: прямой заход
  </div>
  <div style="text-align:left;">
    <a href="https://simona-bt.ru/manager/orders" style="display:inline-block;padding:12px 24px;background-color:#00979C;color:#FFFFFF;text-decoration:none;border-radius:12px;font-size:13px;font-weight:600;">
      Открыть заказ в панели менеджера
    </a>
  </div>
`;

// 2. Письмо клиенту (Заказ №15104)
const clientItemsTableHtml = renderOrderItemsTable(order15104.items);
const clientBody = `
  <h1 style="font-size:20px;font-weight:700;color:#FFFFFF;margin:0 0 12px 0;">
    Здравствуйте, ${order15104.customerName}!
  </h1>
  <p style="font-size:14px;color:#D7D9DB;line-height:1.6;margin:0 0 16px 0;">
    Ваш заказ <strong style="color:#FFFFFF;">№${order15104.orderNumber}</strong> принят в обработку.
  </p>
  ${clientItemsTableHtml}
  <div style="text-align:right;font-size:18px;font-weight:700;color:#00979C;margin-bottom:20px;">
    Итого: ${formatRub(order15104.totalAmount)}
  </div>
  <div style="padding:16px;background-color:#1E2228;border:1px solid #2B313A;border-radius:12px;font-size:13px;line-height:1.7;">
    <div><strong style="color:#FFFFFF;">Способ получения:</strong> <span style="color:#FFFFFF;">${formatDeliveryLabel(order15104.deliveryType)}</span></div>
    <div><strong style="color:#FFFFFF;">Способ оплаты:</strong> <span style="color:#FFFFFF;">${formatPaymentLabel(order15104.paymentMethod)}</span></div>
  </div>
  <p style="font-size:13px;color:#D7D9DB;line-height:1.6;margin:20px 0 0 0;">
    Эксперт салона «СИМОНА» свяжется с вами в ближайшее время по телефону <span style="white-space:nowrap;color:#FFFFFF;font-weight:700;">${formatNonBreakingPhone(order15104.customerPhone)}</span> для подтверждения резерва и согласования времени выдачи или доставки.
  </p>
`;

const managerEmailHtml = wrapLuxuryEmailHtml('Новый заказ №15104', managerBody);
const clientEmailHtml = wrapLuxuryEmailHtml('Заказ №15104 принят в обработку', clientBody);

const fullPageHtml = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="format-detection" content="telephone=no, address=no, email=no, date=no" />
  <title>Предпросмотр email-уведомлений по заказу №15104 — СИМОНА</title>
  <style type="text/css">
    body {
      margin: 0;
      padding: 32px 16px;
      background-color: #0B0D0E;
      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
      color: #D7D9DB;
    }
    .badge-section {
      text-align: center;
      margin-bottom: 24px;
    }
    .badge-pill {
      display: inline-block;
      padding: 6px 14px;
      border-radius: 9999px;
      background: rgba(0, 151, 156, 0.15);
      border: 1px solid #00979C;
      color: #00979C;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.05em;
    }
  </style>
</head>
<body>
  <div class="badge-section">
    <span class="badge-pill">УВЕДОМЛЕНИЕ МЕНЕДЖЕРУ (ЗАКАЗ №15104)</span>
  </div>
  ${managerEmailHtml}

  <div class="badge-section" style="margin-top: 48px;">
    <span class="badge-pill">УВЕДОМЛЕНИЕ КЛИЕНТУ (ЗАКАЗ №15104)</span>
  </div>
  ${clientEmailHtml}
</body>
</html>`;

fs.writeFileSync(path.join(process.cwd(), 'public', 'order-email-preview.html'), fullPageHtml);
console.log('Successfully wrote public/order-email-preview.html');

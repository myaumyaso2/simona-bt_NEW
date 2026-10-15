const fs = require('fs');
const path = require('path');

const sampleOrder = {
  customerName: 'Алексей',
  customerPhone: '+7 (920) 012-34-56',
  orderNumber: 'SM-2026-8941',
  deliveryType: 'PICKUP_WAREHOUSE_KOMINTERNA',
  paymentMethod: 'IN_SALON',
  totalAmount: 184900,
  items: [
    { sku: '89083', name: 'Индукционная варочная панель ASKO HI1995G', quantity: 1, price: 184900 }
  ]
};

const DELIVERY_TYPE_LABELS = {
  PICKUP_WAREHOUSE_KOMINTERNA: 'самовывоз (склад на ул. Коминтерна, 27)',
  PICKUP_BELINSKOGO_15: 'самовывоз (салон на ул. Белинского, 15)',
  COURIER_DELIVERY: 'Аккуратная доставка и подъем на этаж собственной службой',
  WHITE_GLOVE_DELIVERY: 'Аккуратная доставка и подъем на этаж собственной службой',
};

const PAYMENT_METHOD_LABELS = {
  IN_SALON: 'в салоне «СИМОНА» (картой или наличными)',
  CARD_ONLINE: 'Онлайн-оплата картой / СБП (ЮKassa)',
  ON_RECEIPT: 'при получении',
  B2B_INVOICE: 'Безналичный расчет по счету для юрлиц (с НДС)',
};

function formatRub(amount) {
  return Math.round(amount || 0).toLocaleString('ru-RU') + ' ₽';
}

const deliveryLabel = DELIVERY_TYPE_LABELS[sampleOrder.deliveryType];
const paymentLabel = PAYMENT_METHOD_LABELS[sampleOrder.paymentMethod];

const itemsRows = sampleOrder.items.map(item => `
  <tr>
    <td style="padding:10px 12px;border-bottom:1px solid #2B313A;color:#87888A;font-family:monospace;font-size:12px;">${item.sku}</td>
    <td style="padding:10px 12px;border-bottom:1px solid #2B313A;color:#FFFFFF;font-size:13px;font-weight:500;">${item.name}</td>
    <td style="padding:10px 12px;border-bottom:1px solid #2B313A;color:#D7D9DB;font-size:13px;text-align:center;">${item.quantity} шт.</td>
    <td style="padding:10px 12px;border-bottom:1px solid #2B313A;color:#00979C;font-size:13px;font-weight:700;text-align:right;white-space:nowrap;">${formatRub(item.price * item.quantity)}</td>
  </tr>
`).join('');

const itemsTableHtml = `
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
      ${itemsRows}
    </tbody>
  </table>`;

function formatNonBreakingPhone(phone) {
  if (!phone) return '';
  return phone
    .trim()
    .replace(/\s+/g, '&nbsp;')
    .replace(/-/g, '&#8209;');
}

const clientBody = `
  <h1 style="font-size:20px;font-weight:700;color:#FFFFFF;margin:0 0 12px 0;">
    Здравствуйте, ${sampleOrder.customerName}!
  </h1>
  <p style="font-size:14px;color:#D7D9DB;line-height:1.6;margin:0 0 16px 0;">
    Ваш заказ <strong style="color:#FFFFFF;">№${sampleOrder.orderNumber}</strong> принят в обработку.
  </p>
  ${itemsTableHtml}
  <div style="text-align:right;font-size:18px;font-weight:700;color:#00979C;margin-bottom:20px;">
    Итого: ${formatRub(sampleOrder.totalAmount)}
  </div>
  <div style="padding:16px;background-color:#1E2228;border:1px solid #2B313A;border-radius:12px;font-size:13px;line-height:1.7;">
    <div><strong style="color:#FFFFFF;">Способ получения:</strong> ${deliveryLabel}</div>
    <div><strong style="color:#FFFFFF;">Способ оплаты:</strong> ${paymentLabel}</div>
  </div>
  <p style="font-size:13px;color:#87888A;line-height:1.6;margin:20px 0 0 0;">
    Эксперт салона «СИМОНА» свяжется с вами в ближайшее время по телефону <span style="white-space:nowrap;color:#FFFFFF;font-weight:700;">${formatNonBreakingPhone(sampleOrder.customerPhone)}</span> для подтверждения резерва и согласования времени выдачи или доставки.
  </p>
`;

const html = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="format-detection" content="telephone=no, address=no, email=no, date=no" />
  <title>Заказ №${sampleOrder.orderNumber} принят в обработку — «СИМОНА»</title>
  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      background-color: #111315;
      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
      color: #D7D9DB;
    }
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
<body id="body">
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
                    <a href="https://simona-bt.ru" target="_blank" style="display:inline-block;text-decoration:none;border:0;outline:none;">
                      <img src="./brand/email-logo-v3.png" alt="СИМОНА" width="270" height="48" style="display:block;border:0;outline:none;font-family:'Montserrat',sans-serif;font-size:24px;font-weight:700;color:#00979C;" />
                    </a>
                  </td>
                  <td align="right" valign="middle">
                    <a href="tel:+78314237600" style="display:inline-block;text-decoration:none;border:0;outline:none;">
                      <img src="./brand/email-phone-v2.png" alt="(831) 423 76 00" width="114" height="20" style="display:block;border:0;outline:none;font-family:'Montserrat',sans-serif;font-size:14px;font-weight:700;color:#FFFFFF;" />
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Main Body -->
          <tr>
            <td style="padding:32px;">
              ${clientBody}
            </td>
          </tr>
          <!-- Footer: Наши магазины в Нижнем Новгороде -->
          <tr>
            <td style="padding:24px 32px;background-color:#111315;border-top:1px solid #2B313A;font-size:13px;color:#87888A;line-height:1.6;">
              <div style="color:#FFFFFF;font-weight:600;margin-bottom:8px;">Наши магазины в Нижнем Новгороде:</div>
              <div style="margin-bottom:4px;color:#87888A;" class="address-link">• СИМОНА на <span style="color:#87888A;text-decoration:none;">Белинского,&zwnj;&nbsp;15</span></div>
              <div style="margin-bottom:12px;color:#87888A;" class="address-link">• Omoikiri &amp; Körting на <span style="color:#87888A;text-decoration:none;">Белинского,&zwnj;&nbsp;11/66</span></div>
              <div style="padding-top:10px;border-top:1px solid #1E2228;color:#87888A;">
                Сайт: <a href="https://simona-bt.ru" target="_blank" style="color:#00979C !important;text-decoration:underline;font-weight:600;"><span style="color:#00979C !important;text-decoration:underline;">simona-bt.ru</span></a>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

fs.writeFileSync(path.join(process.cwd(), 'public', 'order-email-preview.html'), html);
console.log('Successfully wrote public/order-email-preview.html');

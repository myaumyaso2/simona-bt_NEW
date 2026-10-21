import fs from 'fs';
import path from 'path';
import {
  LEAD_TYPE_LABELS,
  DELIVERY_TYPE_LABELS,
  PAYMENT_METHOD_LABELS,
  LeadEmailData,
  OrderEmailData,
} from '../mail/mailer';

const ASANA_API_BASE = 'https://app.asana.com/api/1.0';
const ASANA_LOG_FILE = path.join(process.cwd(), 'storage', 'logs', 'asana.log');

function logAsanaEvent(entry: Record<string, unknown>) {
  try {
    const dir = path.dirname(ASANA_LOG_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.appendFileSync(
      ASANA_LOG_FILE,
      JSON.stringify({ timestamp: new Date().toISOString(), ...entry }) + '\n'
    );
  } catch {
    // ignore log write errors
  }
}

export interface AsanaTaskResult {
  success: boolean;
  taskId: string;
  mode: 'LIVE_API' | 'LOCAL_QUEUE';
  error?: string;
}

/**
 * Создает задачу в Asana через REST API v1.0 (https://app.asana.com/api/1.0/tasks).
 * Если ASANA_ACCESS_TOKEN не задан в .env, сохраняет задачу в локальный журнал очереди storage/logs/asana.log
 * и возвращает детерминированный идентификатор задачи.
 */
async function postAsanaTask(params: {
  name: string;
  notes: string;
  sectionId?: string;
}): Promise<AsanaTaskResult> {
  const token = process.env.ASANA_ACCESS_TOKEN || '';
  const workspace = process.env.ASANA_WORKSPACE_ID || '';
  const project = process.env.ASANA_PROJECT_ID || '';

  if (!token) {
    const localId = `asana-local-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    logAsanaEvent({
      mode: 'LOCAL_QUEUE',
      taskId: localId,
      name: params.name,
      notes: params.notes,
    });
    return {
      success: true,
      taskId: localId,
      mode: 'LOCAL_QUEUE',
    };
  }

  try {
    const payload: Record<string, unknown> = {
      name: params.name,
      notes: params.notes,
    };

    if (workspace) payload.workspace = workspace;
    if (project) {
      payload.projects = [project];
      if (params.sectionId) {
        payload.memberships = [{ project, section: params.sectionId }];
      }
    }

    const res = await fetch(`${ASANA_API_BASE}/tasks`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ data: payload }),
    });

    const json = (await res.json()) as { data?: { gid?: string }; errors?: Array<{ message: string }> };

    if (!res.ok || !json.data?.gid) {
      const errMsg = json.errors?.[0]?.message || `HTTP ${res.status}`;
      const fallbackId = `asana-fallback-${Date.now()}`;
      logAsanaEvent({
        mode: 'LOCAL_QUEUE',
        taskId: fallbackId,
        name: params.name,
        error: errMsg,
      });
      return {
        success: false,
        taskId: fallbackId,
        mode: 'LOCAL_QUEUE',
        error: errMsg,
      };
    }

    logAsanaEvent({
      mode: 'LIVE_API',
      taskId: json.data.gid,
      name: params.name,
    });

    return {
      success: true,
      taskId: json.data.gid,
      mode: 'LIVE_API',
    };
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    const fallbackId = `asana-fallback-${Date.now()}`;
    logAsanaEvent({
      mode: 'LOCAL_QUEUE',
      taskId: fallbackId,
      name: params.name,
      error: errMsg,
    });
    return {
      success: false,
      taskId: fallbackId,
      mode: 'LOCAL_QUEUE',
      error: errMsg,
    };
  }
}

/**
 * Создание задачи в Asana по лид-форме (любая из 9 форм сайта)
 */
export async function createAsanaLeadTask(lead: LeadEmailData): Promise<AsanaTaskResult> {
  const typeLabel = LEAD_TYPE_LABELS[lead.type] || lead.type;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://simona-bt.ru';

  const title = `[${typeLabel}] — ${lead.name} — ${lead.phone}`;
  const lines = [
    `Тип обращения: ${typeLabel} (${lead.type})`,
    `Имя клиента: ${lead.name}`,
    `Телефон: ${lead.phone}`,
    lead.email ? `Email: ${lead.email}` : null,
    lead.preferredShowroom ? `Выбранный салон: ${lead.preferredShowroom}` : null,
    lead.preferredDate || lead.preferredTime
      ? `Желаемое время визита: ${lead.preferredDate || ''} ${lead.preferredTime || ''}`.trim()
      : null,
    lead.productName ? `Прибор / Комплект: ${lead.productName} (${lead.productId || ''})` : null,
    lead.portfolioUrl ? `Ссылка / Портфолио: ${lead.portfolioUrl}` : null,
    lead.attachmentPath
      ? `Файл дизайн-проекта: ${siteUrl}/api/manager/leads/attachment?id=${encodeURIComponent(lead.id)}`
      : null,
    lead.comment ? `Комментарий: ${lead.comment}` : null,
    '',
    '--- Сквозная аналитика ---',
    `ymClientId: ${lead.ymClientId || '—'}`,
    `yclid: ${lead.yclid || '—'}`,
    `UTM: ${[lead.utmSource, lead.utmMedium, lead.utmCampaign].filter(Boolean).join(' / ') || 'прямой заход'}`,
    `Панель менеджера: ${siteUrl}/manager/orders?tab=leads`,
  ]
    .filter((v) => v !== null)
    .join('\n');

  return postAsanaTask({
    name: title,
    notes: lines,
    sectionId: process.env.ASANA_LEADS_SECTION_ID || undefined,
  });
}

/**
 * Создание задачи в Asana по новому заказу из корзины / быстрого чекаута
 */
export async function createAsanaOrderTask(order: OrderEmailData): Promise<AsanaTaskResult> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://simona-bt.ru';
  const deliveryLabel = DELIVERY_TYPE_LABELS[order.deliveryType] || order.deliveryType;
  const paymentLabel = PAYMENT_METHOD_LABELS[order.paymentMethod] || order.paymentMethod;

  let itemsList = '';
  try {
    const items = JSON.parse(order.itemsJson || '[]') as Array<{
      sku?: string;
      name: string;
      price: number;
      quantity: number;
    }>;
    itemsList = items
      .map(
        (i, idx) =>
          `${idx + 1}. [Код 1С: ${i.sku || '—'}] ${i.name} — ${i.quantity} шт. × ${i.price.toLocaleString('ru-RU')} ₽`
      )
      .join('\n');
  } catch {
    itemsList = order.itemsJson;
  }

  const isOneClick = Boolean(order.isOneClick) || order.status === 'ONE_CLICK';
  const prefix = isOneClick ? '[Заказ в 1 клик' : '[Заказ';
  const title = `${prefix} №${order.orderNumber}] — ${order.customerName} (${order.customerPhone}) — ${Math.round(order.totalAmount).toLocaleString('ru-RU')} ₽`;
  const notes = [
    `Номер заказа: ${order.orderNumber}`,
    `Сумма заказа: ${Math.round(order.totalAmount).toLocaleString('ru-RU')} ₽`,
    `Покупатель: ${order.customerName}`,
    `Телефон: ${order.customerPhone}`,
    order.customerEmail ? `Email: ${order.customerEmail}` : null,
    `Способ получения: ${deliveryLabel}`,
    order.deliveryAddress ? `Адрес доставки: ${order.deliveryAddress}` : null,
    order.deliveryDate ? `Желаемая дата: ${order.deliveryDate}` : null,
    order.deliveryComment ? `Комментарий к заказу: ${order.deliveryComment}` : null,
    `Способ оплаты: ${paymentLabel}`,
    order.companyName ? `Юрлицо: ${order.companyName} (ИНН: ${order.companyInn || '—'})` : null,
    '',
    '--- Состав заказа ---',
    itemsList,
    '',
    '--- Сквозная аналитика ---',
    `ymClientId: ${order.ymClientId || '—'}`,
    `yclid: ${order.yclid || '—'}`,
    `UTM: ${[order.utmSource, order.utmMedium, order.utmCampaign].filter(Boolean).join(' / ') || 'прямой заход'}`,
    `Панель менеджера: ${siteUrl}/manager/orders`,
  ]
    .filter((v) => v !== null)
    .join('\n');

  return postAsanaTask({
    name: title,
    notes,
    sectionId: process.env.ASANA_ORDERS_SECTION_ID || undefined,
  });
}

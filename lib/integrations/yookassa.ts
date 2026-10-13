import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { z } from 'zod';

const YOOKASSA_API_BASE = 'https://api.yookassa.ru/v3';
const YOOKASSA_LOG_FILE = path.join(process.cwd(), 'storage', 'logs', 'yookassa.log');

function logYooKassaEvent(entry: Record<string, unknown>) {
  try {
    const dir = path.dirname(YOOKASSA_LOG_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.appendFileSync(
      YOOKASSA_LOG_FILE,
      JSON.stringify({ timestamp: new Date().toISOString(), ...entry }) + '\n'
    );
  } catch {
    // ignore log write errors
  }
}

export interface YooKassaOrderItemInput {
  sku?: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CreateHoldPaymentOrderInput {
  id: string;
  orderNumber: string;
  totalAmount: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  items: YooKassaOrderItemInput[];
}

export interface CreateHoldPaymentResult {
  paymentId: string;
  confirmationUrl: string;
  status: string;
  capture: boolean;
  receiptSent: boolean;
  isTestMode: boolean;
}

export interface YooKassaPaymentInfo {
  id: string;
  status: 'pending' | 'waiting_for_capture' | 'succeeded' | 'canceled';
  paid: boolean;
  captured_at?: string;
  amount: {
    value: string;
    currency: string;
  };
  metadata?: {
    orderId?: string;
    orderNumber?: string;
  };
  confirmation?: {
    type: string;
    confirmation_url?: string;
  };
}

function getYooKassaCredentials() {
  const shopId = process.env.YOOKASSA_SHOP_ID || '388703';
  const secretKey =
    process.env.YOOKASSA_SECRET_KEY || 'live_McS9DE3zzJJvU5pKwrS2UbpZ3H7_-9v3RTaBIYV5HOo';
  const vatCode = Number(process.env.YOOKASSA_VAT_CODE || 1);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://simona-bt.ru';
  return { shopId, secretKey, vatCode, siteUrl };
}

function buildBasicAuthHeader(shopId: string, secretKey: string): string {
  const token = Buffer.from(`${shopId}:${secretKey}`).toString('base64');
  return `Basic ${token}`;
}

function normalizePhoneForYooKassa(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('8')) {
    return `7${digits.slice(1)}`;
  }
  if (digits.length === 10) {
    return `7${digits}`;
  }
  return digits || '78314237600';
}

/**
 * Создание двухстадийного платежа (холд / capture: false) с передачей кассового чека 54-ФЗ.
 * Вызывается ТОЛЬКО для заказов со склада в Нижнем Новгороде (LOCAL_STOCK, stockKominterna > 0).
 */
export async function createHoldPayment(
  order: CreateHoldPaymentOrderInput
): Promise<CreateHoldPaymentResult> {
  const { shopId, secretKey, vatCode, siteUrl } = getYooKassaCredentials();
  const idempotenceKey = crypto.randomUUID();
  const returnUrl = `${siteUrl}/checkout/success?order=${encodeURIComponent(order.orderNumber)}`;

  const receiptItems = order.items.map((item) => ({
    description: item.name.slice(0, 128),
    quantity: String(item.quantity),
    amount: {
      value: Number(item.price).toFixed(2),
      currency: 'RUB',
    },
    vat_code: vatCode,
    payment_mode: 'full_prepayment',
    payment_subject: 'commodity',
  }));

  const payload = {
    amount: {
      value: Number(order.totalAmount).toFixed(2),
      currency: 'RUB',
    },
    capture: false, // Двухстадийная оплата (холд средств до проверки резерва)
    confirmation: {
      type: 'redirect',
      return_url: returnUrl,
    },
    description: `Заказ №${order.orderNumber} в интернет-магазине «СИМОНА»`,
    metadata: {
      orderId: order.id,
      orderNumber: order.orderNumber,
    },
    receipt: {
      customer: {
        full_name: order.customerName,
        phone: normalizePhoneForYooKassa(order.customerPhone),
        ...(order.customerEmail ? { email: order.customerEmail } : {}),
      },
      items: receiptItems,
    },
  };

  if (process.env.YOOKASSA_TEST_MODE === 'true') {
    const mockPaymentId = `yk_test_${crypto.randomUUID().slice(0, 12)}`;
    const mockUrl = `https://yoomoney.ru/checkout/payments/v2/contract?orderId=${mockPaymentId}`;
    logYooKassaEvent({
      action: 'CREATE_HOLD_PAYMENT_TEST',
      idempotenceKey,
      orderNumber: order.orderNumber,
      paymentId: mockPaymentId,
      capture: payload.capture,
      amount: payload.amount.value,
      receiptItemsCount: receiptItems.length,
    });
    return {
      paymentId: mockPaymentId,
      confirmationUrl: mockUrl,
      status: 'pending',
      capture: false,
      receiptSent: true,
      isTestMode: true,
    };
  }

  try {
    const res = await fetch(`${YOOKASSA_API_BASE}/payments`, {
      method: 'POST',
      headers: {
        Authorization: buildBasicAuthHeader(shopId, secretKey),
        'Idempotence-Key': idempotenceKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = (await res.json()) as YooKassaPaymentInfo & {
      description?: string;
      code?: string;
    };

    if (!res.ok || !data.id) {
      const errMsg = data.description || `YooKassa HTTP ${res.status}`;
      logYooKassaEvent({
        action: 'CREATE_HOLD_PAYMENT_ERROR',
        orderNumber: order.orderNumber,
        status: res.status,
        error: errMsg,
      });
      throw new Error(errMsg);
    }

    const confirmationUrl = data.confirmation?.confirmation_url || returnUrl;

    logYooKassaEvent({
      action: 'CREATE_HOLD_PAYMENT_LIVE',
      idempotenceKey,
      orderNumber: order.orderNumber,
      paymentId: data.id,
      status: data.status,
      capture: false,
      amount: payload.amount.value,
      confirmationUrl,
    });

    return {
      paymentId: data.id,
      confirmationUrl,
      status: data.status,
      capture: false,
      receiptSent: true,
      isTestMode: false,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    logYooKassaEvent({
      action: 'CREATE_HOLD_PAYMENT_EXCEPTION',
      orderNumber: order.orderNumber,
      error: message,
    });
    throw err;
  }
}

/**
 * Проверка реального статуса платежа через GET /v3/payments/{paymentId}
 * для защиты вебхуков от подделки.
 */
export async function getPaymentInfo(
  paymentId: string,
  expectedTestStatus?: 'pending' | 'waiting_for_capture' | 'succeeded' | 'canceled'
): Promise<YooKassaPaymentInfo | null> {
  if (process.env.YOOKASSA_TEST_MODE === 'true' || paymentId.startsWith('yk_test_')) {
    return {
      id: paymentId,
      status: expectedTestStatus || 'waiting_for_capture',
      paid: expectedTestStatus === 'waiting_for_capture' || expectedTestStatus === 'succeeded',
      amount: {
        value: '0.00',
        currency: 'RUB',
      },
    };
  }

  const { shopId, secretKey } = getYooKassaCredentials();

  try {
    const res = await fetch(`${YOOKASSA_API_BASE}/payments/${encodeURIComponent(paymentId)}`, {
      method: 'GET',
      headers: {
        Authorization: buildBasicAuthHeader(shopId, secretKey),
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      logYooKassaEvent({
        action: 'GET_PAYMENT_INFO_ERROR',
        paymentId,
        httpStatus: res.status,
      });
      return null;
    }

    const data = (await res.json()) as YooKassaPaymentInfo;
    return data;
  } catch (err: unknown) {
    logYooKassaEvent({
      action: 'GET_PAYMENT_INFO_EXCEPTION',
      paymentId,
      error: err instanceof Error ? err.message : String(err),
    });
    return null;
  }
}

const YooKassaWebhookSchema = z.object({
  type: z.string().optional(),
  event: z.enum([
    'payment.waiting_for_capture',
    'payment.succeeded',
    'payment.canceled',
    'refund.succeeded',
  ]),
  object: z.object({
    id: z.string().min(1),
    payment_id: z.string().optional(), // для refund.succeeded
    status: z.string(),
    paid: z.boolean().optional(),
    amount: z
      .object({
        value: z.string(),
        currency: z.string(),
      })
      .optional(),
    metadata: z
      .object({
        orderId: z.string().optional(),
        orderNumber: z.string().optional(),
      })
      .optional(),
  }),
});

export type YooKassaWebhookPayload = z.infer<typeof YooKassaWebhookSchema>;

export function verifyWebhookPayload(rawBody: unknown): {
  valid: boolean;
  payload?: YooKassaWebhookPayload;
  error?: string;
} {
  const parsed = YooKassaWebhookSchema.safeParse(rawBody);
  if (!parsed.success) {
    return {
      valid: false,
      error: parsed.error.issues.map((i) => i.message).join('; '),
    };
  }
  return {
    valid: true,
    payload: parsed.data,
  };
}

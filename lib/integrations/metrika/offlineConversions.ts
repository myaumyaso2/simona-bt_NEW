import { prisma } from '@/lib/prisma';

export const METRIKA_COUNTER_ID = 1351807;

export interface OfflineConversionUploadResult {
  success: boolean;
  uploadedCount: number;
  message: string;
  uploadId?: number;
  dryRun?: boolean;
}

/**
 * Автоматическая отправка офлайн-конверсий в Яндекс Метрику по API
 * Цели: закрытые заказы со статусами PAID (оплачен) или DELIVERED (доставлен/успешен)
 */
export async function uploadOfflineConversionsToMetrika(): Promise<OfflineConversionUploadResult> {
  const token = process.env.YANDEX_API_TOKEN || process.env.YANDEX_METRIKA_TOKEN;

  // 1. Извлекаем оплаченные или доставленные заказы со сквозным ClientID
  const eligibleOrders = await prisma.order.findMany({
    where: {
      status: { in: ['PAID', 'DELIVERED', 'COMPLETED'] },
      ymClientId: { not: null },
    },
    take: 1000,
    orderBy: { createdAt: 'desc' },
  });

  if (eligibleOrders.length === 0) {
    return {
      success: true,
      uploadedCount: 0,
      message: 'Нет новых оплаченных или доставленных заказов со сквозным ClientID для отправки.',
    };
  }

  // 2. Формируем CSV строку по спецификации Яндекс Метрики
  let csv = 'ClientId,Target,DateTime,Price,Currency\n';
  let count = 0;

  for (const order of eligibleOrders) {
    if (order.ymClientId) {
      const timestamp = Math.floor(new Date(order.createdAt).getTime() / 1000);
      const price = Math.round(order.totalAmount || 0);
      csv += `${order.ymClientId},SALON_PURCHASE,${timestamp},${price},RUB\n`;
      count++;
    }
  }

  // Если токен еще не задан, возвращаем статус готовности пакета (dry-run)
  if (!token) {
    return {
      success: true,
      uploadedCount: count,
      dryRun: true,
      message: `Подготовлен пакет из ${count} офлайн-конверсий. Для боевой отправки укажите YANDEX_API_TOKEN в .env.local.`,
    };
  }

  // 3. Отправляем в API Яндекс Метрики (multipart/form-data)
  try {
    const boundary = `----WebKitFormBoundary${Date.now().toString(16)}`;
    const formDataBody = 
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="file"; filename="offline_conversions.csv"\r\n` +
      `Content-Type: text/csv\r\n\r\n` +
      `${csv}\r\n` +
      `--${boundary}--\r\n`;

    const res = await fetch(
      `https://api-metrika.yandex.net/management/v1/counter/${METRIKA_COUNTER_ID}/offline_conversions/upload?client_id_type=CLIENT_ID`,
      {
        method: 'POST',
        headers: {
          'Authorization': `OAuth ${token}`,
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
        },
        body: formDataBody,
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error('Metrika offline conversions upload failed:', res.status, errText);
      return {
        success: false,
        uploadedCount: 0,
        message: `Ошибка Метрики (${res.status}): ${errText}`,
      };
    }

    const data = await res.json();
    const uploadId = data.uploading?.id ?? data.upload?.id ?? data.id;
    return {
      success: true,
      uploadedCount: count,
      uploadId: uploadId,
      message: `Успешно отправлено ${count} офлайн-конверсий в счетчик Метрики №${METRIKA_COUNTER_ID}. ID загрузки: ${uploadId ?? '—'}`,
    };
  } catch (err: any) {
    console.error('Network error uploading to Metrika:', err);
    return {
      success: false,
      uploadedCount: 0,
      message: `Сетевая ошибка: ${err.message}`,
    };
  }
}

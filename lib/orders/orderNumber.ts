import { prisma } from '@/lib/prisma';

export const INITIAL_ORDER_NUMBER = 15104;
export const LAST_UMI_ORDER_NUMBER = 15103;

let sequenceInitialized = false;

/**
 * Инициализирует и синхронизирует последовательность PostgreSQL order_number_seq.
 * Если подключена СУБД PostgreSQL:
 * 1. Создает SEQUENCE order_number_seq START WITH 15104 (если еще не существует).
 * 2. Синхронизирует sequence с максимальным числовым номером заказа в таблице Order (если он >= 15104).
 *
 * Для SQLite (локальный dev) этот блок безопасно перехватывается, и система переходит на fallback-механизм.
 */
async function ensurePostgresSequence(): Promise<boolean> {
  if (sequenceInitialized) return true;

  const dbUrl = process.env.DATABASE_URL || '';
  const isPostgres = dbUrl.startsWith('postgres://') || dbUrl.startsWith('postgresql://');
  if (!isPostgres) {
    return false;
  }

  try {
    await prisma.$executeRawUnsafe(`
      DO $$
      DECLARE
        max_num BIGINT;
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_sequences WHERE sequencename = 'order_number_seq') THEN
          CREATE SEQUENCE order_number_seq START WITH 15104;
        END IF;

        SELECT COALESCE(MAX(CAST("orderNumber" AS BIGINT)), 15103)
        INTO max_num
        FROM "Order"
        WHERE "orderNumber" ~ '^[0-9]+$';

        IF max_num >= 15104 THEN
          PERFORM setval('order_number_seq', max_num, true);
        END IF;
      END $$;
    `);

    sequenceInitialized = true;
    return true;
  } catch {
    // Не удалось инициализировать sequence — используем fallback
    return false;
  }
}

/**
 * Генерирует следующий порядковый номер заказа.
 * 1. Продакшн / Staging (PostgreSQL): атомарный вызов `SELECT nextval('order_number_seq')`.
 * 2. Локальная разработка (SQLite): безопасный поиск максимального числового номера + 1 (минимум 15104).
 */
export async function getNextOrderNumber(): Promise<string> {
  // 1. Попытка через PostgreSQL Sequence
  const isPg = await ensurePostgresSequence();
  if (isPg) {
    try {
      const res = await prisma.$queryRawUnsafe<Array<{ next_num: string | bigint | number }>>(
        `SELECT nextval('order_number_seq')::text AS next_num;`
      );
      if (res && res.length > 0 && res[0].next_num) {
        return String(res[0].next_num);
      }
    } catch {
      // Игнорируем и переходим к fallback
    }
  }

  // 2. Резервный расчет для SQLite / Dev окружения
  try {
    // В SQLite используем выборку всех номеров или поиск максимума
    const orders = await prisma.order.findMany({
      select: { orderNumber: true },
      take: 100,
      orderBy: { createdAt: 'desc' },
    });

    let maxNum = LAST_UMI_ORDER_NUMBER;
    for (const ord of orders) {
      const parsed = parseInt(ord.orderNumber, 10);
      if (!isNaN(parsed) && String(parsed) === ord.orderNumber && parsed > maxNum) {
        maxNum = parsed;
      }
    }

    // Если в последних 100 заказах не нашли числового (или база свежая), проверяем глобально
    if (maxNum <= LAST_UMI_ORDER_NUMBER) {
      const allOrders = await prisma.order.findMany({
        select: { orderNumber: true },
      });
      for (const ord of allOrders) {
        const parsed = parseInt(ord.orderNumber, 10);
        if (!isNaN(parsed) && String(parsed) === ord.orderNumber && parsed > maxNum) {
          maxNum = parsed;
        }
      }
    }

    return String(maxNum + 1);
  } catch (err) {
    console.error('[orderNumber] Ошибка fallback-генератора номера заказа:', err);
    return String(INITIAL_ORDER_NUMBER);
  }
}

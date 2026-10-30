import { prisma } from '@/lib/prisma';

export const INITIAL_ORDER_NUMBER = 15104;
export const LAST_UMI_ORDER_NUMBER = 15103;

let sequenceInitialized = false;

/**
 * Инициализирует и синхронизирует последовательность PostgreSQL order_number_seq.
 * 1. Создает SEQUENCE order_number_seq START WITH 15104 (если еще не существует).
 * 2. Синхронизирует sequence с максимальным числовым номером заказа в таблице Order (если он >= 15104).
 */
export async function ensurePostgresSequence(): Promise<boolean> {
  if (sequenceInitialized) return true;

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
  } catch (err) {
    console.error('[orderNumber] Ошибка инициализации PostgreSQL sequence:', err);
    return false;
  }
}

/**
 * Генерирует следующий порядковый номер заказа через атомарный вызов PostgreSQL:
 * `SELECT nextval('order_number_seq')`.
 */
export async function getNextOrderNumber(): Promise<string> {
  await ensurePostgresSequence();

  const res = await prisma.$queryRawUnsafe<Array<{ next_num: string | bigint | number }>>(
    `SELECT nextval('order_number_seq')::text AS next_num;`
  );

  if (res && res.length > 0 && res[0].next_num) {
    return String(res[0].next_num);
  }

  throw new Error('[orderNumber] Не удалось получить следующий номер заказа из order_number_seq');
}

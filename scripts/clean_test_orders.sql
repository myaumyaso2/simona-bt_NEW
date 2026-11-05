-- 1. Перевод тестовых заказов в статус TEST
UPDATE "Order"
SET status = 'TEST'
WHERE status != 'TEST'
  AND (
    "orderNumber" IN ('15109', '15108', '15111', '15105', 'SMB-261015-2757', '15104', 'SMB-261014-3011', 'SMB-261013-3280', 'SMB-261013-5499', '15102')
    OR "customerPhone" IN ('+79535504787', '+71111111111', '+79990001122', '+11111111111111111111111', '+74534534534', '+75444444444', '+71741747174', '+76555959595', '+70000000000', '+70000000001')
    OR LOWER("customerName") LIKE '%тест%'
    OR LOWER("customerName") LIKE '%тетс%'
    OR LOWER("customerName") IN ('доди', 'орп', 'тптщутщкп', 'ыфы', 'вывы', 'afasf', 'yyrty', '.хзъ', 'ыпывып', '6666666666666')
  );

-- 2. Перевод тестовых заявок в статус TEST
UPDATE "Lead"
SET status = 'TEST'
WHERE status != 'TEST'
  AND (
    phone IN ('+79535504787', '+71111111111', '+79990001122', '+11111111111111111111111', '+77928335833', '+79292364520')
    OR LOWER(name) LIKE '%тест%'
    OR name IN ('WGBYgVXnvzulwvHMiuptKgpy', 'iFPPnsHYZiYaOVsvnkJFimBT')
  );

-- 3. Проверка количества реальных заказов за последние 30 дней
SELECT count(*) as real_orders_30d FROM "Order" WHERE "createdAt" >= NOW() - INTERVAL '30 days' AND status != 'TEST';

-- 4. Проверка количества реальных заявок за последние 30 дней
SELECT count(*) as real_leads_30d FROM "Lead" WHERE "createdAt" >= NOW() - INTERVAL '30 days' AND status != 'TEST';

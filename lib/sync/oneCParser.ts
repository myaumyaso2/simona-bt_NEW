import fs from 'fs';
import readline from 'readline';
import {
  formatProductName,
  cleanLegacySuffixes,
  cleanSystemArticle,
} from '../catalog/productTitle';

export interface OneCStockItem {
  code: string;
  stockKominterna: number; // Берется из "Остаток МП" по регламенту для быстрого потока 1C_ostatki_MP.csv
  stockRawMp: number;
  stockMpSklad: number;
  stockWb: number;
}

export interface OneCCatalogItem {
  code: string;                     // Код 1С (колонка 0) - уникальный SKU и oneCGuid
  rawName: string;                  // Наименование из 1С (колонка 1)
  group: string;                    // Группа товара (колонка 2)
  brand: string;                    // Производитель (колонка 3)
  article: string;                  // Артикул фабрики (колонка 4)
  systemArticle: string;            // Очищенный от пробелов, дефисов и слэшей артикул
  fullName: string;                 // Каноническое имя: [Группа товара] + [Бренд] + [Артикул]
  categoryName: string;             // Структура каталога (колонка 5)
  rawAmount: number;                // Сырой остаток из колонки 6
  additionalDisabledAmount: number; // Добавочный остаток от отключенного дубля спецпредложения
  totalAmount: number;              // Итоговый остаток (колонка 6 + disabledAmount)
  isSpecial: boolean;               // Спец предложени (колонка 7)
  isLeader: boolean;                // Лидер продаж (колонка 8)
  isDiscount: boolean;              // Уценка (колонка 9)
  isDisabled: boolean;              // Не используется (колонка 10)
  isNoPrice: boolean;               // Без цены (колонка 11)
  priceBase: number;                // Розничная цена (колонка 12)
  priceAction: number;              // Цена по акции (колонка 13)
  priceSpecial: number;             // Спец.цена (колонка 14)
  priceOpt: number;                 // Опт.цена (колонка 15)
  color: string;                    // Цвет (колонка 16)
  deliveryDays: number;             // Срок поставки (колонка 17)
  stockMp: number;                  // Остаток МП (колонка 18)
  stockKominterna: number;          // Основной складской остаток (колонка 6 + disabledAmount)
  isRetired: boolean;               // Выведено (колонка 26)

  // Расчетные поля витрины по правилам ExchangeOneCImportCsv
  resolvedPrice: number;
  resolvedOldPrice: number | null;
  resolvedBadge: string | null;     // e.g. "SPECIAL:-15%" или "ACTION:-10%"
  shouldDeactivateBy1C: boolean;    // Флаг bDelete из OneCImportCsv.php
  inStock: boolean;
}

/**
 * Парсер строки CSV с разделителем точка с запятой (с поддержкой кавычек)
 */
export function parseCsvLine(line: string, delimiter = ';'): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // Пропускаем экранированную кавычку
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

/**
 * Парсинг быстрого файла остатков 1C_ostatki_MP.csv
 * Колонки: Код;Остаток МП;Остаток МП Склад;Остаток ВБ
 */
export function parseStockCsvContent(content: Buffer | string): Map<string, OneCStockItem> {
  const decoder = new TextDecoder('windows-1251');
  const text = typeof content === 'string' ? content : decoder.decode(content);
  const lines = text.split(/\r?\n/);
  const stockMap = new Map<string, OneCStockItem>();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const parts = parseCsvLine(line);
    const code = parts[0]?.trim();
    if (!code || isNaN(Number(code)) || code === '0') {
      continue; // Пропускаем заголовок или некорректные строки
    }

    const stockMp = Math.max(0, parseInt(parts[1] || '0', 10) || 0);
    const stockMpSklad = Math.max(0, parseInt(parts[2] || '0', 10) || 0);
    const stockWb = Math.max(0, parseInt(parts[3] || '0', 10) || 0);

    stockMap.set(code, {
      code,
      stockKominterna: stockMp,
      stockRawMp: stockMp,
      stockMpSklad,
      stockWb,
    });
  }

  return stockMap;
}

/**
 * Точная формула расчета цены, старой цены и скидочного бейджа
 * по бизнес-правилам OneCImportCsv.php (строки 589–603 и 851–876)
 */
export function resolveProductPricing(
  priceBase: number,
  priceAction: number,
  priceSpecial: number,
  isSpecial: boolean,
  totalAmount: number,
  isLeader = false
): { price: number; oldPrice: number | null; badge: string | null } {
  let price = 0;
  let oldPrice: number | null = null;
  let badge: string | null = null;

  // 1. Если Спец предложени == 1: при наличии Розничная > 0, Спец.цена > 0 и Остаток товара > 0
  if (isSpecial) {
    if (priceBase > 0 && priceSpecial > 0 && totalAmount > 0) {
      price = priceSpecial;
      oldPrice = priceBase;
      const discountPercent = Math.round(((oldPrice - price) / oldPrice) * 100);
      if (discountPercent > 0) {
        badge = `SPECIAL:-${discountPercent}%`;
      }
    }
  }
  // 2. Иначе если Цена по акции > 0 -> price = Цена по акции
  else if (priceAction > 0) {
    price = priceAction;
    if (priceBase > priceAction) {
      oldPrice = priceBase;
      const discountPercent = Math.round(((oldPrice - price) / oldPrice) * 100);
      if (discountPercent > 0) {
        badge = `ACTION:-${discountPercent}%`;
      }
    }
  }
  // 3. Иначе если Розничная > 0:
  else if (priceBase > 0) {
    if (priceSpecial > 0) {
      price = priceSpecial;
      oldPrice = priceBase;
      const discountPercent = Math.round(((oldPrice - price) / oldPrice) * 100);
      if (discountPercent > 0) {
        badge = `ACTION:-${discountPercent}%`;
      }
    } else {
      price = priceBase;
      oldPrice = null;
    }
  }

  // Защита: если oldPrice <= price, старая цена и процент скидки обнуляются
  if (oldPrice !== null && oldPrice <= price) {
    oldPrice = null;
    badge = null;
  }

  if (!badge && isLeader) {
    badge = 'Хит';
  }

  return { price, oldPrice, badge };
}

/**
 * Предварительный проход по 1C_import.csv (аналог importPrepare в OneCImportCsv.php строки 235-237):
 * Собирает карту disabledAmount[article] для строк, где:
 * Остаток товара (колонка 6) > 0 && Спец предложени (колонка 7) == 1 && Не используется (колонка 10) == 1
 */
export async function collectDisabledAmounts(filePath: string): Promise<Map<string, number>> {
  const disabledAmountMap = new Map<string, number>();
  if (!fs.existsSync(filePath)) {
    return disabledAmountMap;
  }

  const fileStream = fs.createReadStream(filePath, { encoding: 'latin1' });
  const decoder = new TextDecoder('windows-1251');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const rawLine of rl) {
    let line: string;
    try {
      line = decoder.decode(Buffer.from(rawLine, 'latin1'));
    } catch {
      line = rawLine;
    }
    line = line.trim();
    if (!line) continue;

    const parts = parseCsvLine(line);
    const code = parts[0]?.trim();
    if (!code || isNaN(Number(code)) || code === '0') continue;

    const article = parts[4]?.trim() || '';
    const amount = Math.max(0, parseInt(parts[6] || '0', 10) || 0);
    const isSpecial = parts[7] === '1';
    const isDisabled = parts[10] === '1';

    if (amount > 0 && isSpecial && isDisabled && article) {
      disabledAmountMap.set(article, amount);
    }
  }

  return disabledAmountMap;
}

/**
 * Потоковое чтение полного каталога 1C_import.csv чанками
 * Выполняет двухпроходную обработку (сбор disabledAmount -> потоковый парсинг с Windows-1251).
 */
export async function streamCatalogCsv(
  filePath: string,
  onChunk: (chunk: OneCCatalogItem[]) => Promise<void>,
  chunkSize = 500
): Promise<{ totalRows: number; processedItems: number; disabledSpecialCount: number }> {
  if (!fs.existsSync(filePath)) {
    throw new Error(`1C import file not found at: ${filePath}`);
  }

  // Проход 1: собираем disabledAmount по заводскому артикулу
  const disabledAmountMap = await collectDisabledAmounts(filePath);

  // Проход 2: читаем бинарный поток с сохранением байтов 1-к-1 через 'latin1'
  const fileStream = fs.createReadStream(filePath, { encoding: 'latin1' });
  const decoder = new TextDecoder('windows-1251');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let currentChunk: OneCCatalogItem[] = [];
  let totalRows = 0;
  let processedItems = 0;

  for await (const rawLine of rl) {
    totalRows++;
    let line: string;
    try {
      line = decoder.decode(Buffer.from(rawLine, 'latin1'));
    } catch {
      line = rawLine;
    }

    line = line.trim();
    if (!line) continue;

    const parts = parseCsvLine(line);
    const code = parts[0]?.trim();

    // Проверяем валидность кода (число > 0)
    if (!code || isNaN(Number(code)) || code === '0') {
      continue;
    }

    const rawName = parts[1]?.trim() || '';
    const group = cleanLegacySuffixes(parts[2]?.trim() || '');
    const brand = (parts[3]?.trim() || '').toUpperCase();
    const article = parts[4]?.trim() || '';
    const cleanArt = cleanLegacySuffixes(article);
    const systemArticle = cleanSystemArticle(article);

    // Очистка названия категории от маркеров параллельного импорта '//'
    const rawCategoryName = parts[5]?.trim() || '';
    const categoryName = rawCategoryName.replace(/\//g, '').trim();

    // Формируем каноническое название по формуле [Группа товара] + [Бренд] + [Артикул]
    const rawCombinedName = [group, brand, cleanArt].filter(Boolean).join(' ') || rawName;
    const fullName = formatProductName({
      name: rawCombinedName,
      brand,
      category: categoryName || group,
      sku: code,
    });

    const rawAmount = Math.max(0, parseInt(parts[6] || '0', 10) || 0);
    const isSpecial = parts[7] === '1';
    const isLeader = parts[8] === '1';
    const isDiscount = parts[9] === '1';
    const isDisabled = parts[10] === '1';
    const isNoPrice = parts[11] === '1';

    // Прибавляем disabledAmount к активному товару с тем же Артикулом (OneCImportCsv.php строки 235, 881-884)
    const additionalDisabledAmount =
      !isDisabled && article && disabledAmountMap.has(article)
        ? disabledAmountMap.get(article)!
        : 0;
    const totalAmount = rawAmount + additionalDisabledAmount;

    const priceBase = parseFloat(parts[12]?.replace(',', '.') || '0') || 0;
    const priceAction = parseFloat(parts[13]?.replace(',', '.') || '0') || 0;
    const priceSpecial = parseFloat(parts[14]?.replace(',', '.') || '0') || 0;
    const priceOpt = parseFloat(parts[15]?.replace(',', '.') || '0') || 0;

    let color = parts[16]?.trim() || '';
    if (color === '-') color = '';

    const deliveryDays = parseInt(parts[17] || '1', 10) || 1;
    const stockMp = Math.max(0, parseInt(parts[18] || '0', 10) || 0);
    const isRetired = parts[26] === '1';

    // В полном импорте основной складской остаток берется из колонки 6 (Остаток товара) + disabledAmount
    const stockKominterna = totalAmount;
    const inStock = stockKominterna > 0;

    // Расчет цены использует rawAmount для проверки наличия самой строки спецпредложения (как в OneCImportCsv.php строка 590)
    // либо totalAmount для обычных позиций
    const effectiveAmountForPricing = isSpecial && isDisabled ? rawAmount : totalAmount;
    const pricing = resolveProductPricing(
      priceBase,
      priceAction,
      priceSpecial,
      isSpecial,
      effectiveAmountForPricing,
      isLeader
    );

    // Правила деактивации bDelete из OneCImportCsv.php (строки 605-617)
    const shouldDeactivateBy1C =
      priceBase <= 0 ||
      pricing.price <= 0 ||
      isDisabled ||
      (isRetired && (rawAmount <= 0 || pricing.price <= 0)) ||
      (isDiscount && rawAmount <= 0);

    const item: OneCCatalogItem = {
      code,
      rawName,
      group,
      brand,
      article,
      systemArticle,
      fullName,
      categoryName,
      rawAmount,
      additionalDisabledAmount,
      totalAmount,
      isSpecial,
      isLeader,
      isDiscount,
      isDisabled,
      isNoPrice,
      priceBase,
      priceAction,
      priceSpecial,
      priceOpt,
      color,
      deliveryDays,
      stockMp,
      stockKominterna,
      isRetired,
      resolvedPrice: pricing.price,
      resolvedOldPrice: pricing.oldPrice,
      resolvedBadge: pricing.badge,
      shouldDeactivateBy1C,
      inStock,
    };

    currentChunk.push(item);
    processedItems++;

    if (currentChunk.length >= chunkSize) {
      await onChunk(currentChunk);
      currentChunk = [];
    }
  }

  if (currentChunk.length > 0) {
    await onChunk(currentChunk);
  }

  return {
    totalRows,
    processedItems,
    disabledSpecialCount: disabledAmountMap.size,
  };
}

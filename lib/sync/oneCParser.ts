import fs from 'fs';
import readline from 'readline';

export interface OneCStockItem {
  code: string;
  stockKominterna: number; // Берется из "Остаток МП" по регламенту заказчика
  stockRawMp: number;
  stockMpSklad: number;
  stockWb: number;
}

export interface OneCCatalogItem {
  code: string;               // Код 1С (колонка 0) - уникальный SKU
  rawName: string;            // Наименование из 1С (колонка 1)
  group: string;              // Группа товара (колонка 2)
  brand: string;              // Производитель (колонка 3)
  article: string;            // Артикул фабрики (колонка 4)
  fullName: string;           // Шаблон: "Группа товара + Производитель + Артикул"
  categoryName: string;       // Структура каталога (колонка 5)
  totalAmount: number;        // Остаток товара (колонка 6)
  isSpecial: boolean;         // Спец предложени (колонка 7)
  isLeader: boolean;          // Лидер продаж (колонка 8)
  isDiscount: boolean;        // Уценка (колонка 9)
  isDisabled: boolean;        // Не используется (колонка 10)
  isNoPrice: boolean;         // Без цены (колонка 11)
  priceBase: number;          // Розничная цена (колонка 12)
  priceAction: number;        // Цена по акции (колонка 13)
  priceSpecial: number;       // Спец.цена (колонка 14)
  priceOpt: number;           // Опт.цена (колонка 15)
  color: string;              // Цвет (колонка 16)
  deliveryDays: number;       // Срок поставки (колонка 17)
  stockKominterna: number;    // Колонка "Остаток МП" (колонка 18) - склад Коминтерна 27
  isRetired: boolean;         // Выведено (колонка 26)
  
  // Расчетные поля витрины
  resolvedPrice: number;
  resolvedOldPrice: number | null;
  resolvedBadge: string | null; // e.g. "SPECIAL:-15%" (винный) или "ACTION:-10%" (бирюзовый)
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
      stockKominterna: stockMp, // По регламенту заказчика остаток берется из "Остаток МП"
      stockRawMp: stockMp,
      stockMpSklad,
      stockWb,
    });
  }

  return stockMap;
}

/**
 * Расчет цены, старой цены и скидочного бейджа по бизнес-правилам СИМОНА
 */
export function resolveProductPricing(
  priceBase: number,
  priceAction: number,
  priceSpecial: number,
  isSpecial: boolean,
  inStock: boolean
): { price: number; oldPrice: number | null; badge: string | null } {
  let price = priceBase;
  let oldPrice: number | null = null;
  let badge: string | null = null;

  // 1. Спецпредложение (Винный ярлык с процентом)
  if (isSpecial && priceSpecial > 0 && inStock) {
    price = priceSpecial;
    if (priceBase > priceSpecial) {
      oldPrice = priceBase;
      const discountPercent = Math.round(((oldPrice - price) / oldPrice) * 100);
      if (discountPercent > 0) {
        badge = `SPECIAL:-${discountPercent}%`;
      }
    }
  }
  // 2. Акция производителя (Бирюзовый ярлык с процентом)
  else if (priceAction > 0 && priceAction < priceBase) {
    price = priceAction;
    oldPrice = priceBase;
    const discountPercent = Math.round(((oldPrice - price) / oldPrice) * 100);
    if (discountPercent > 0) {
      badge = `ACTION:-${discountPercent}%`;
    }
  }
  // 3. Обычный товар (Без скидок 1С)
  else if (priceBase > 0) {
    price = priceBase;
    oldPrice = null;
    badge = null;
  }

  // Защита от некорректных скидок
  if (oldPrice !== null && oldPrice <= price) {
    oldPrice = null;
    badge = null;
  }

  return { price, oldPrice, badge };
}

/**
 * Потоковое чтение полного каталога 1C_import.csv чанками
 * Читает файл построчно с декодированием Windows-1251, минимизируя память.
 */
export async function streamCatalogCsv(
  filePath: string,
  onChunk: (chunk: OneCCatalogItem[]) => Promise<void>,
  chunkSize = 500
): Promise<{ totalRows: number; processedItems: number }> {
  if (!fs.existsSync(filePath)) {
    throw new Error(`1C import file not found at: ${filePath}`);
  }

  // Читаем бинарный поток с сохранением байтов 1-к-1 через 'latin1'
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
    // Декодируем строку, если она содержит Windows-1251 байты
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
    const group = parts[2]?.trim() || '';
    const brand = (parts[3]?.trim() || '').toUpperCase();
    const article = parts[4]?.trim() || '';

    // Формируем полное имя по стандарту: "Группа товара + Производитель + Артикул"
    const fullName = [group, brand, article].filter(Boolean).join(' ') || rawName;

    const categoryName = parts[5]?.trim() || '';
    const totalAmount = Math.max(0, parseInt(parts[6] || '0', 10) || 0);
    const isSpecial = parts[7] === '1';
    const isLeader = parts[8] === '1';
    const isDiscount = parts[9] === '1';
    const isDisabled = parts[10] === '1';
    const isNoPrice = parts[11] === '1';

    const priceBase = parseFloat(parts[12]?.replace(',', '.') || '0') || 0;
    const priceAction = parseFloat(parts[13]?.replace(',', '.') || '0') || 0;
    const priceSpecial = parseFloat(parts[14]?.replace(',', '.') || '0') || 0;
    const priceOpt = parseFloat(parts[15]?.replace(',', '.') || '0') || 0;

    let color = parts[16]?.trim() || '';
    if (color === '-') color = '';

    const deliveryDays = parseInt(parts[17] || '1', 10) || 1;

    // Колонка 18: "Остаток МП" -> Центральный склад Коминтерна 27
    const stockKominterna = Math.max(0, parseInt(parts[18] || '0', 10) || 0);
    const isRetired = parts[26] === '1';

    const inStock = stockKominterna > 0;
    const pricing = resolveProductPricing(priceBase, priceAction, priceSpecial, isSpecial, inStock);

    const item: OneCCatalogItem = {
      code,
      rawName,
      group,
      brand,
      article,
      fullName,
      categoryName,
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
      stockKominterna,
      isRetired,
      resolvedPrice: pricing.price,
      resolvedOldPrice: pricing.oldPrice,
      resolvedBadge: pricing.badge,
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

  return { totalRows, processedItems };
}

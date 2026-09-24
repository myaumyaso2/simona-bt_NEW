import fs from 'fs';
import { prisma } from '../prisma';
import {
  parseStockCsvContent,
  streamCatalogCsv,
  OneCStockItem,
  OneCCatalogItem,
} from './oneCParser';

export function transliterate(text: string): string {
  const ru: Record<string, string> = {
    а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'zh',
    з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o',
    п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts',
    ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
  };
  return text
    .toLowerCase()
    .split('')
    .map((char) => ru[char] || char)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export interface SyncFastStockResult {
  success: boolean;
  totalInCsv: number;
  matchedInDb: number;
  updatedStockCount: number;
  dryRun: boolean;
  durationMs: number;
  sampleChanges: Array<{
    code: string;
    name: string;
    oldStock: number;
    newStock: number;
    inStock: boolean;
  }>;
}

export interface SyncCatalogResult {
  success: boolean;
  totalCsvRows: number;
  processedItems: number;
  matchedProducts: number;
  updatedPrices: number;
  updatedStocks: number;
  updatedBadges: number;
  createdProducts: number;
  deactivatedProducts: number;
  dryRun: boolean;
  durationMs: number;
  sampleChanges: Array<{
    code: string;
    sku: string;
    name: string;
    changeType: 'PRICE' | 'STOCK' | 'BADGE' | 'CREATED' | 'DEACTIVATED';
    detail: string;
  }>;
}

/**
 * Быстрая синхронизация остатков (1C_ostatki_MP.csv)
 * Запускается каждые 10 минут.
 */
export async function syncFastStock(
  filePathOrContent: string | Buffer,
  options: { dryRun?: boolean } = {}
): Promise<SyncFastStockResult> {
  const start = Date.now();
  const dryRun = options.dryRun ?? false;

  let content: Buffer | string;
  if (typeof filePathOrContent === 'string' && fs.existsSync(filePathOrContent)) {
    content = fs.readFileSync(filePathOrContent);
  } else {
    content = filePathOrContent;
  }

  const stockMap = parseStockCsvContent(content);
  const codes = Array.from(stockMap.keys());

  if (codes.length === 0) {
    return {
      success: true,
      totalInCsv: 0,
      matchedInDb: 0,
      updatedStockCount: 0,
      dryRun,
      durationMs: Date.now() - start,
      sampleChanges: [],
    };
  }

  // Находим товары в БД по кодам 1С
  const existingProducts = await prisma.product.findMany({
    where: {
      oneCGuid: { in: codes },
    },
    select: {
      id: true,
      oneCGuid: true,
      sku: true,
      name: true,
      stockKominterna: true,
      stockCount: true,
      inStock: true,
      physicalStatus: true,
    },
  });

  const sampleChanges: SyncFastStockResult['sampleChanges'] = [];
  let updatedStockCount = 0;

  // Пакетные обновления
  const updates: Array<{
    id: string;
    stockKominterna: number;
    stockCount: number;
    inStock: boolean;
    physicalStatus: string;
  }> = [];

  for (const product of existingProducts) {
    if (!product.oneCGuid) continue;
    const stockInfo = stockMap.get(product.oneCGuid);
    if (!stockInfo) continue;

    const newStock = stockInfo.stockKominterna;
    if (product.stockKominterna !== newStock) {
      updatedStockCount++;

      // Сохраняем физический статус салона, если товар на витрине
      const isShowroom = [
        'SHOWROOM',
        'EXHIBITION_15',
        'EXHIBITION_11',
        'ACTIVE_KITCHEN',
      ].includes(product.physicalStatus);

      const newStatus = isShowroom
        ? product.physicalStatus
        : newStock > 0
        ? 'LOCAL_STOCK'
        : 'ON_ORDER';

      const newInStock = isShowroom ? true : newStock > 0;

      if (sampleChanges.length < 50) {
        sampleChanges.push({
          code: product.oneCGuid,
          name: product.name,
          oldStock: product.stockKominterna,
          newStock,
          inStock: newInStock,
        });
      }

      updates.push({
        id: product.id,
        stockKominterna: newStock,
        stockCount: newStock,
        inStock: newInStock,
        physicalStatus: newStatus,
      });
    }
  }

  // Применяем изменения в БД (если не dryRun)
  if (!dryRun && updates.length > 0) {
    // Выполняем пачками по 100 записей
    const batchSize = 100;
    for (let i = 0; i < updates.length; i += batchSize) {
      const chunk = updates.slice(i, i + batchSize);
      await prisma.$transaction(
        chunk.map((item) =>
          prisma.product.update({
            where: { id: item.id },
            data: {
              stockKominterna: item.stockKominterna,
              stockCount: item.stockCount,
              inStock: item.inStock,
              physicalStatus: item.physicalStatus,
            },
          })
        )
      );
    }
  }

  return {
    success: true,
    totalInCsv: stockMap.size,
    matchedInDb: existingProducts.length,
    updatedStockCount,
    dryRun,
    durationMs: Date.now() - start,
    sampleChanges,
  };
}

/**
 * Полная синхронизация мастер-каталога (1C_import.csv)
 * Запускается каждые 20 минут.
 */
export async function syncFullCatalog(
  filePath: string,
  options: { dryRun?: boolean; createNew?: boolean } = {}
): Promise<SyncCatalogResult> {
  const start = Date.now();
  const dryRun = options.dryRun ?? false;
  const createNew = options.createNew ?? true;

  let totalMatched = 0;
  let updatedPrices = 0;
  let updatedStocks = 0;
  let updatedBadges = 0;
  let createdProducts = 0;
  let deactivatedProducts = 0;
  const sampleChanges: SyncCatalogResult['sampleChanges'] = [];

  // Читаем каталог потоково чанками по 500 строк
  const { totalRows, processedItems } = await streamCatalogCsv(
    filePath,
    async (chunk: OneCCatalogItem[]) => {
      const chunkCodes = chunk.map((item) => item.code);

      // Ищем существующие товары в БД по oneCGuid или sku
      const existing = await prisma.product.findMany({
        where: {
          OR: [
            { oneCGuid: { in: chunkCodes } },
            { sku: { in: chunkCodes } },
          ],
        },
        select: {
          id: true,
          oneCGuid: true,
          sku: true,
          name: true,
          price: true,
          oldPrice: true,
          badge: true,
          stockKominterna: true,
          stockCount: true,
          inStock: true,
          deliveryDays: true,
          physicalStatus: true,
        },
      });

      const existingMap = new Map<string, typeof existing[0]>();
      for (const p of existing) {
        if (p.oneCGuid) existingMap.set(p.oneCGuid, p);
        if (p.sku) existingMap.set(p.sku, p);
      }

      const updateBatch: Array<{
        id: string;
        data: {
          price?: number;
          oldPrice?: number | null;
          badge?: string | null;
          stockKominterna?: number;
          stockCount?: number;
          inStock?: boolean;
          physicalStatus?: string;
          deliveryDays?: number;
        };
      }> = [];

      const createBatch: any[] = [];

      for (const item of chunk) {
        const existingProduct = existingMap.get(item.code);

        if (existingProduct) {
          totalMatched++;

          // 1. Проверяем флаг списания / вывода товара
          const shouldDeactivate =
            (item.isRetired || item.isDisabled || item.isNoPrice) &&
            item.stockKominterna === 0;

          if (shouldDeactivate) {
            if (existingProduct.inStock) {
              deactivatedProducts++;
              if (sampleChanges.length < 100) {
                sampleChanges.push({
                  code: item.code,
                  sku: existingProduct.sku,
                  name: existingProduct.name,
                  changeType: 'DEACTIVATED',
                  detail: `Снят с витрины (Выведено/Отключено в 1С)`,
                });
              }
              updateBatch.push({
                id: existingProduct.id,
                data: {
                  inStock: false,
                  physicalStatus: 'ON_ORDER',
                },
              });
            }
            continue;
          }

          // 2. Сравниваем цены и остатки
          const priceDiff = Math.abs(existingProduct.price - item.resolvedPrice) > 0.01;
          const oldPriceDiff = existingProduct.oldPrice !== item.resolvedOldPrice;
          const badgeDiff = existingProduct.badge !== item.resolvedBadge;
          const stockDiff = existingProduct.stockKominterna !== item.stockKominterna;
          const deliveryDiff = existingProduct.deliveryDays !== item.deliveryDays;

          if (priceDiff || oldPriceDiff || badgeDiff || stockDiff || deliveryDiff) {
            const changes: any = {};

            if (priceDiff) {
              updatedPrices++;
              changes.price = item.resolvedPrice;
              if (sampleChanges.length < 100) {
                sampleChanges.push({
                  code: item.code,
                  sku: existingProduct.sku,
                  name: existingProduct.name,
                  changeType: 'PRICE',
                  detail: `Цена: ${existingProduct.price} ₽ -> ${item.resolvedPrice} ₽`,
                });
              }
            }

            if (oldPriceDiff) {
              changes.oldPrice = item.resolvedOldPrice;
            }

            if (badgeDiff) {
              updatedBadges++;
              changes.badge = item.resolvedBadge;
              if (sampleChanges.length < 100) {
                sampleChanges.push({
                  code: item.code,
                  sku: existingProduct.sku,
                  name: existingProduct.name,
                  changeType: 'BADGE',
                  detail: `Ярлык: ${existingProduct.badge || 'нет'} -> ${item.resolvedBadge || 'нет'}`,
                });
              }
            }

            if (stockDiff) {
              updatedStocks++;
              changes.stockKominterna = item.stockKominterna;
              changes.stockCount = item.stockKominterna;

              const isShowroom = [
                'SHOWROOM',
                'EXHIBITION_15',
                'EXHIBITION_11',
                'ACTIVE_KITCHEN',
              ].includes(existingProduct.physicalStatus);

              changes.inStock = isShowroom ? true : item.inStock;
              changes.physicalStatus = isShowroom
                ? existingProduct.physicalStatus
                : item.inStock
                ? 'LOCAL_STOCK'
                : 'ON_ORDER';

              if (sampleChanges.length < 100) {
                sampleChanges.push({
                  code: item.code,
                  sku: existingProduct.sku,
                  name: existingProduct.name,
                  changeType: 'STOCK',
                  detail: `Остаток Коминтерна 27: ${existingProduct.stockKominterna} шт -> ${item.stockKominterna} шт`,
                });
              }
            }

            if (deliveryDiff) {
              changes.deliveryDays = item.deliveryDays;
            }

            updateBatch.push({
              id: existingProduct.id,
              data: changes,
            });
          }
        } else if (createNew) {
          // Создаем новый товар, если в 1С есть цена и бренд, и товар не выведен
          if (
            item.priceBase > 0 &&
            item.brand &&
            !item.isRetired &&
            !item.isDisabled
          ) {
            createdProducts++;
            const baseSlug = transliterate(
              `${item.brand}-${item.article || item.code}`
            ) || `product-${item.code}`;

            const newProduct = {
              sku: item.code, // По регламенту заказчика: SKU = Код (колонка 0)
              oneCGuid: item.code,
              name: item.fullName,
              slug: `${baseSlug}-${item.code}`,
              brand: item.brand,
              category: item.group || item.categoryName || 'Встраиваемая техника',
              categoryType: 'CATEGORY_B',
              physicalStatus: item.inStock ? 'LOCAL_STOCK' : 'ON_ORDER',
              price: item.resolvedPrice,
              oldPrice: item.resolvedOldPrice,
              badge: item.resolvedBadge,
              inStock: item.inStock,
              stockCount: item.stockKominterna,
              stockKominterna: item.stockKominterna,
              stockBelinskogo15: 0,
              stockRemote: 0,
              deliveryDays: item.deliveryDays || (item.inStock ? 1 : 7),
              color: item.color || null,
              description: `${item.fullName} по официальной цене производителя в интернет-бутике СИМОНА.`,
              featuresJson: '[]',
              imagesJson: '[]',
            };

            createBatch.push(newProduct);

            if (sampleChanges.length < 100) {
              sampleChanges.push({
                code: item.code,
                sku: item.code,
                name: item.fullName,
                changeType: 'CREATED',
                detail: `Новинка: ${item.fullName} (цена ${item.resolvedPrice} ₽)`,
              });
            }
          }
        }
      }

      // Запись обновлений в БД
      if (!dryRun) {
        if (updateBatch.length > 0) {
          await prisma.$transaction(
            updateBatch.map((u) =>
              prisma.product.update({
                where: { id: u.id },
                data: u.data,
              })
            )
          );
        }

        if (createBatch.length > 0) {
          for (const item of createBatch) {
            try {
              await prisma.product.create({ data: item });
            } catch (err: any) {
              // Игнорируем возможные дубликаты slug при параллельных запусках
              console.warn(`[1C-Sync] Error creating product ${item.sku}:`, err.message);
            }
          }
        }
      }
    },
    500
  );

  return {
    success: true,
    totalCsvRows: totalRows,
    processedItems,
    matchedProducts: totalMatched,
    updatedPrices,
    updatedStocks,
    updatedBadges,
    createdProducts,
    deactivatedProducts,
    dryRun,
    durationMs: Date.now() - start,
    sampleChanges,
  };
}

import fs from 'fs';
import path from 'path';
import { prisma } from '../prisma';
import {
  parseStockCsvContent,
  streamCatalogCsv,
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

/**
 * Честная иерархия физического присутствия (AGENTS.md Раздел 9):
 * 1. SHOWROOM / EXHIBITION_15 / EXHIBITION_11 / ACTIVE_KITCHEN при stockBelinskogo15 > 0 или существующем витринном статусе
 * 2. LOCAL_STOCK при stockKominterna > 0
 * 3. REMOTE_STOCK при stockRemote > 0
 * 4. ON_ORDER при отсутствии остатков на всех складах
 */
export function resolvePhysicalStatus(params: {
  currentStatus?: string | null;
  stockBelinskogo15: number;
  stockKominterna: number;
  stockRemote: number;
}): { physicalStatus: string; inStock: boolean } {
  const showroomStatuses = ['SHOWROOM', 'EXHIBITION_15', 'EXHIBITION_11', 'ACTIVE_KITCHEN'];
  const isCurrentlyShowroom = Boolean(
    params.currentStatus && showroomStatuses.includes(params.currentStatus)
  );

  if (params.stockBelinskogo15 > 0 || isCurrentlyShowroom) {
    const status = isCurrentlyShowroom ? params.currentStatus! : 'SHOWROOM';
    return { physicalStatus: status, inStock: true };
  }
  if (params.stockKominterna > 0) {
    return { physicalStatus: 'LOCAL_STOCK', inStock: true };
  }
  if (params.stockRemote > 0) {
    return { physicalStatus: 'REMOTE_STOCK', inStock: true };
  }
  return { physicalStatus: 'ON_ORDER', inStock: false };
}

/**
 * Аккуратное добавление/обновление характеристики "Цвет" внутри featuresJson без затирания остальных характеристик
 */
export function updateColorInFeaturesJson(featuresJson: string, color: string): string {
  const cleanColor = (color || '').trim();
  if (!cleanColor || cleanColor === '-') return featuresJson || '[]';

  let features: Array<{ label: string; value: string }> = [];
  try {
    const parsed = JSON.parse(featuresJson || '[]');
    if (Array.isArray(parsed)) {
      features = parsed;
    }
  } catch {
    features = [];
  }

  const colorIdx = features.findIndex(
    (f) => f && typeof f.label === 'string' && f.label.trim().toLowerCase() === 'цвет'
  );

  if (colorIdx >= 0) {
    if (features[colorIdx].value !== cleanColor) {
      features[colorIdx] = { ...features[colorIdx], value: cleanColor };
      return JSON.stringify(features);
    }
    return featuresJson || '[]';
  } else {
    features.push({ label: 'Цвет', value: cleanColor });
    return JSON.stringify(features);
  }
}

export function hasValidPhotos(imagesJson: string | null | undefined): boolean {
  if (!imagesJson || imagesJson === '[]') return false;
  try {
    const parsed = JSON.parse(imagesJson);
    return Array.isArray(parsed) && parsed.length > 0 && Boolean(parsed[0]);
  } catch {
    return false;
  }
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

export interface SyncChangeRecord {
  code: string;
  sku: string;
  name: string;
  brand: string;
  category: string;
  slug?: string;
  changeType: 'PRICE' | 'STOCK' | 'BADGE' | 'CREATED' | 'DEACTIVATED' | 'INHERITED_PHOTO';
  oldValue?: string | number | null;
  newValue?: string | number | null;
  detail: string;
  reason?: string;
  hasPhoto?: boolean;
}

export interface SyncSessionData {
  id: string;
  startedAt: string;
  finishedAt: string;
  durationMs: number;
  fileName: string;
  totalRows: number;
  stats: {
    totalChanges: number;
    matchedProducts: number;
    updatedPrices: number;
    updatedStocks: number;
    updatedBadges: number;
    createdProducts: number;
    deactivatedProducts: number;
    inheritedSpecialPhotos: number;
  };
  changes: SyncChangeRecord[];
}

export interface SyncSessionSummary {
  id: string;
  startedAt: string;
  finishedAt: string;
  durationMs: number;
  fileName: string;
  totalRows: number;
  stats: SyncSessionData['stats'];
}

export interface SyncCatalogResult {
  success: boolean;
  totalCsvRows: number;
  processedItems: number;
  disabledSpecialCount: number;
  matchedProducts: number;
  updatedPrices: number;
  updatedStocks: number;
  updatedBadges: number;
  createdProducts: number;
  inheritedSpecialPhotos: number;
  deactivatedProducts: number;
  dryRun: boolean;
  durationMs: number;
  sampleChanges: Array<{
    code: string;
    sku: string;
    name: string;
    changeType: 'PRICE' | 'STOCK' | 'BADGE' | 'CREATED' | 'DEACTIVATED' | 'INHERITED_PHOTO';
    detail: string;
  }>;
  allChanges: SyncChangeRecord[];
}

/**
 * Быстрая синхронизация остатков (1C_ostatki_MP.csv)
 * Запускается каждые 10 минут. Сопоставляет по sku и oneCGuid.
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

  // Находим товары в БД по единому ключу: sku ИЛИ oneCGuid
  const existingProducts = await prisma.product.findMany({
    where: {
      OR: [
        { sku: { in: codes } },
        { oneCGuid: { in: codes } },
      ],
    },
    select: {
      id: true,
      oneCGuid: true,
      sku: true,
      name: true,
      stockKominterna: true,
      stockBelinskogo15: true,
      stockRemote: true,
      stockCount: true,
      inStock: true,
      physicalStatus: true,
    },
  });

  const sampleChanges: SyncFastStockResult['sampleChanges'] = [];
  let updatedStockCount = 0;

  const updates: Array<{
    id: string;
    stockKominterna: number;
    stockCount: number;
    inStock: boolean;
    physicalStatus: string;
  }> = [];

  for (const product of existingProducts) {
    const codeKey =
      (product.sku && stockMap.has(product.sku) ? product.sku : null) ||
      (product.oneCGuid && stockMap.has(product.oneCGuid) ? product.oneCGuid : null);
    if (!codeKey) continue;

    const stockInfo = stockMap.get(codeKey);
    if (!stockInfo) continue;

    const newStock = stockInfo.stockKominterna;
    const resolved = resolvePhysicalStatus({
      currentStatus: product.physicalStatus,
      stockBelinskogo15: product.stockBelinskogo15,
      stockKominterna: newStock,
      stockRemote: product.stockRemote,
    });

    if (
      product.stockKominterna !== newStock ||
      product.physicalStatus !== resolved.physicalStatus ||
      product.inStock !== resolved.inStock
    ) {
      updatedStockCount++;

      if (sampleChanges.length < 50) {
        sampleChanges.push({
          code: codeKey,
          name: product.name,
          oldStock: product.stockKominterna,
          newStock,
          inStock: resolved.inStock,
        });
      }

      updates.push({
        id: product.id,
        stockKominterna: newStock,
        stockCount: newStock,
        inStock: resolved.inStock,
        physicalStatus: resolved.physicalStatus,
      });
    }
  }

  if (!dryRun && updates.length > 0) {
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
 * Поиск базового товара по очищенному заводскому артикулу (systemArticle)
 * для наследования фотографий, описания, характеристик и габаритов на спецпредложения
 * (OneCImportCsv.php строки 693–736).
 */
async function findBaseProductForSpecialOffer(
  systemArticle: string,
  rawArticle: string,
  excludeSku: string
) {
  if (!systemArticle && !rawArticle) return null;

  const candidates = await prisma.product.findMany({
    where: {
      sku: { not: excludeSku },
      isSpecial: false,
      OR: [
        ...(systemArticle ? [{ systemArticle }] : []),
        ...(rawArticle && rawArticle.length >= 3 ? [{ name: { contains: rawArticle } }] : []),
      ],
    },
    select: {
      id: true,
      sku: true,
      imagesJson: true,
      description: true,
      shortDesc: true,
      featuresJson: true,
      dimensions: true,
      schematicPdfUrl: true,
    },
    orderBy: { createdAt: 'asc' },
    take: 5,
  });

  // Предпочитаем базовый товар, у которого уже есть фотографии
  const withPhotos = candidates.find((c) => hasValidPhotos(c.imagesJson));
  return withPhotos || candidates[0] || null;
}

/**
 * Полная синхронизация мастер-каталога (1C_import.csv)
 * Приведена в полное соответствие с бизнес-правилами OneCImportCsv.php.
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
  let inheritedSpecialPhotos = 0;
  let deactivatedProducts = 0;
  const sampleChanges: SyncCatalogResult['sampleChanges'] = [];
  const allChanges: SyncChangeRecord[] = [];

  const { totalRows, processedItems, disabledSpecialCount } = await streamCatalogCsv(
    filePath,
    async (chunk: OneCCatalogItem[]) => {
      const chunkCodes = chunk.map((item) => item.code);

      // Ищем существующие товары в БД по единому ключу: sku ИЛИ oneCGuid
      const existing = await prisma.product.findMany({
        where: {
          OR: [
            { sku: { in: chunkCodes } },
            { oneCGuid: { in: chunkCodes } },
          ],
        },
        select: {
          id: true,
          oneCGuid: true,
          sku: true,
          slug: true,
          name: true,
          brand: true,
          category: true,
          productGroup: true,
          systemArticle: true,
          price: true,
          oldPrice: true,
          priceOpt: true,
          badge: true,
          stockKominterna: true,
          stockBelinskogo15: true,
          stockRemote: true,
          stockCount: true,
          inStock: true,
          deliveryDays: true,
          physicalStatus: true,
          color: true,
          featuresJson: true,
          imagesJson: true,
          description: true,
          shortDesc: true,
          dimensions: true,
          schematicPdfUrl: true,
          isActive: true,
          isSpecial: true,
          isDiscount: true,
          noPrice: true,
        },
      });

      const existingMap = new Map<string, (typeof existing)[0]>();
      for (const p of existing) {
        if (p.oneCGuid) existingMap.set(p.oneCGuid, p);
        if (p.sku) existingMap.set(p.sku, p);
      }

      const updateBatch: Array<{
        id: string;
        data: Record<string, unknown>;
      }> = [];

      const createBatch: Array<Record<string, unknown>> = [];

      for (const item of chunk) {
        const existingProduct = existingMap.get(item.code);

        if (existingProduct) {
          totalMatched++;

          // Если это спецпредложение без фото, пробуем унаследовать фото/описание от базового товара
          let currentImagesJson = existingProduct.imagesJson;
          let currentDescription = existingProduct.description;
          let currentShortDesc = existingProduct.shortDesc;
          let currentFeaturesJson = existingProduct.featuresJson;
          let currentDimensions = existingProduct.dimensions;
          let currentSchematicPdfUrl = existingProduct.schematicPdfUrl;
          let inheritedFromSku: string | null = null;

          if (
            item.isSpecial &&
            !item.shouldDeactivateBy1C &&
            !hasValidPhotos(currentImagesJson) &&
            item.systemArticle
          ) {
            const baseProd = await findBaseProductForSpecialOffer(
              item.systemArticle,
              item.article,
              item.code
            );
            if (baseProd && hasValidPhotos(baseProd.imagesJson)) {
              currentImagesJson = baseProd.imagesJson;
              currentDescription = baseProd.description || currentDescription;
              currentShortDesc = baseProd.shortDesc || currentShortDesc;
              currentFeaturesJson = baseProd.featuresJson || currentFeaturesJson;
              currentDimensions = baseProd.dimensions || currentDimensions;
              currentSchematicPdfUrl = baseProd.schematicPdfUrl || currentSchematicPdfUrl;
              inheritedFromSku = baseProd.sku;
              inheritedSpecialPhotos++;
            }
          }

          // Обновляем характеристику Цвет внутри featuresJson
          const nextFeaturesJson = item.color
            ? updateColorInFeaturesJson(currentFeaturesJson, item.color)
            : currentFeaturesJson;

          const hasPhoto = hasValidPhotos(currentImagesJson);
          const targetIsActive = !item.shouldDeactivateBy1C && hasPhoto;

          // Честная иерархия физического присутствия
          const resolvedStatus = item.shouldDeactivateBy1C && item.stockKominterna === 0
            ? {
                physicalStatus:
                  existingProduct.stockBelinskogo15 > 0
                    ? existingProduct.physicalStatus
                    : existingProduct.stockRemote > 0
                    ? 'REMOTE_STOCK'
                    : 'ON_ORDER',
                inStock: existingProduct.stockBelinskogo15 > 0 || existingProduct.stockRemote > 0,
              }
            : resolvePhysicalStatus({
                currentStatus: existingProduct.physicalStatus,
                stockBelinskogo15: existingProduct.stockBelinskogo15,
                stockKominterna: item.stockKominterna,
                stockRemote: existingProduct.stockRemote,
              });

          const nextPrice =
            item.resolvedPrice > 0 ? item.resolvedPrice : existingProduct.price;
          const nextOldPrice = item.shouldDeactivateBy1C ? null : item.resolvedOldPrice;
          const nextBadge = item.shouldDeactivateBy1C ? null : item.resolvedBadge;
          const nextPriceOpt = item.priceOpt > 0 ? item.priceOpt : null;
          const nextColor = item.color || existingProduct.color || null;
          const nextProductGroup = item.group || existingProduct.productGroup || null;
          const nextSystemArticle = item.systemArticle || existingProduct.systemArticle || null;

          const changes: Record<string, unknown> = {};

          // Синхронизация единого ключа sku / oneCGuid
          if (existingProduct.sku !== item.code) changes.sku = item.code;
          if (existingProduct.oneCGuid !== item.code) changes.oneCGuid = item.code;

          // Сравнение и обновление флага активности (деактивация/активация)
          if (existingProduct.isActive !== targetIsActive) {
            changes.isActive = targetIsActive;
            if (!targetIsActive) {
              deactivatedProducts++;
              const reason = !hasPhoto
                ? 'Отсутствует фото'
                : item.isDisabled
                ? 'Не используется (кол. 10)'
                : item.isDiscount && item.rawAmount === 0
                ? 'Уценка с остатком 0'
                : item.isRetired
                ? 'Выведено из ассортимента'
                : 'Нет розничной цены';

              allChanges.push({
                code: item.code,
                sku: existingProduct.sku,
                name: existingProduct.name,
                brand: existingProduct.brand,
                category: existingProduct.category,
                slug: existingProduct.slug,
                changeType: 'DEACTIVATED',
                oldValue: 'Активен',
                newValue: 'Скрыт',
                detail: `Скрыт с витрины (${reason})`,
                reason,
              });

              if (sampleChanges.length < 100) {
                sampleChanges.push({
                  code: item.code,
                  sku: existingProduct.sku,
                  name: existingProduct.name,
                  changeType: 'DEACTIVATED',
                  detail: `Скрыт с витрины (${reason})`,
                });
              }
            }
          }

          if (inheritedFromSku) {
            changes.imagesJson = currentImagesJson;
            changes.description = currentDescription;
            changes.shortDesc = currentShortDesc;
            changes.dimensions = currentDimensions;
            changes.schematicPdfUrl = currentSchematicPdfUrl;
            allChanges.push({
              code: item.code,
              sku: existingProduct.sku,
              name: existingProduct.name,
              brand: existingProduct.brand,
              category: existingProduct.category,
              slug: existingProduct.slug,
              changeType: 'INHERITED_PHOTO',
              oldValue: null,
              newValue: inheritedFromSku,
              detail: `Скопированы фото и характеристики с базового товара SKU ${inheritedFromSku} по артикулу ${item.systemArticle}`,
            });
            if (sampleChanges.length < 100) {
              sampleChanges.push({
                code: item.code,
                sku: existingProduct.sku,
                name: existingProduct.name,
                changeType: 'INHERITED_PHOTO',
                detail: `Скопированы фото и характеристики с базового товара SKU ${inheritedFromSku} по артикулу ${item.systemArticle}`,
              });
            }
          }

          // Сравнение цены
          const priceDiff =
            item.resolvedPrice > 0 &&
            Math.abs(existingProduct.price - nextPrice) > 0.01;
          if (priceDiff) {
            updatedPrices++;
            changes.price = nextPrice;
            allChanges.push({
              code: item.code,
              sku: existingProduct.sku,
              name: existingProduct.name,
              brand: existingProduct.brand,
              category: existingProduct.category,
              slug: existingProduct.slug,
              changeType: 'PRICE',
              oldValue: existingProduct.price,
              newValue: nextPrice,
              detail: `Цена: ${existingProduct.price} ₽ -> ${nextPrice} ₽`,
            });
            if (sampleChanges.length < 100) {
              sampleChanges.push({
                code: item.code,
                sku: existingProduct.sku,
                name: existingProduct.name,
                changeType: 'PRICE',
                detail: `Цена: ${existingProduct.price} ₽ -> ${nextPrice} ₽`,
              });
            }
          }

          if (existingProduct.oldPrice !== nextOldPrice) {
            changes.oldPrice = nextOldPrice;
          }

          if (existingProduct.priceOpt !== nextPriceOpt) {
            changes.priceOpt = nextPriceOpt;
          }

          if (existingProduct.badge !== nextBadge) {
            updatedBadges++;
            changes.badge = nextBadge;
            allChanges.push({
              code: item.code,
              sku: existingProduct.sku,
              name: existingProduct.name,
              brand: existingProduct.brand,
              category: existingProduct.category,
              slug: existingProduct.slug,
              changeType: 'BADGE',
              oldValue: existingProduct.badge || 'нет',
              newValue: nextBadge || 'нет',
              detail: `Ярлык: ${existingProduct.badge || 'нет'} -> ${nextBadge || 'нет'}`,
            });
            if (sampleChanges.length < 100) {
              sampleChanges.push({
                code: item.code,
                sku: existingProduct.sku,
                name: existingProduct.name,
                changeType: 'BADGE',
                detail: `Ярлык: ${existingProduct.badge || 'нет'} -> ${nextBadge || 'нет'}`,
              });
            }
          }

          // Сравнение остатков и физического статуса
          const stockDiff = existingProduct.stockKominterna !== item.stockKominterna;
          if (
            stockDiff ||
            existingProduct.physicalStatus !== resolvedStatus.physicalStatus ||
            existingProduct.inStock !== resolvedStatus.inStock
          ) {
            if (stockDiff) {
              updatedStocks++;
              const extraNote =
                item.additionalDisabledAmount > 0
                  ? ` (вкл. +${item.additionalDisabledAmount} шт из откл. спецпредложения)`
                  : '';
              allChanges.push({
                code: item.code,
                sku: existingProduct.sku,
                name: existingProduct.name,
                brand: existingProduct.brand,
                category: existingProduct.category,
                slug: existingProduct.slug,
                changeType: 'STOCK',
                oldValue: existingProduct.stockKominterna,
                newValue: item.stockKominterna,
                detail: `Остаток (кол. 6): ${existingProduct.stockKominterna} шт -> ${item.stockKominterna} шт${extraNote}`,
              });
              if (sampleChanges.length < 100) {
                sampleChanges.push({
                  code: item.code,
                  sku: existingProduct.sku,
                  name: existingProduct.name,
                  changeType: 'STOCK',
                  detail: `Остаток (кол. 6): ${existingProduct.stockKominterna} шт -> ${item.stockKominterna} шт${extraNote}`,
                });
              }
            }
            changes.stockKominterna = item.stockKominterna;
            changes.stockCount = item.stockKominterna;
            changes.inStock = resolvedStatus.inStock;
            changes.physicalStatus = resolvedStatus.physicalStatus;
          }

          // Обновление атрибутов 1С
          if (existingProduct.productGroup !== nextProductGroup) {
            changes.productGroup = nextProductGroup;
          }
          if (existingProduct.systemArticle !== nextSystemArticle) {
            changes.systemArticle = nextSystemArticle;
          }
          if (existingProduct.isSpecial !== item.isSpecial) {
            changes.isSpecial = item.isSpecial;
          }
          if (existingProduct.isDiscount !== item.isDiscount) {
            changes.isDiscount = item.isDiscount;
          }
          if (existingProduct.noPrice !== item.isNoPrice) {
            changes.noPrice = item.isNoPrice;
          }
          if (existingProduct.color !== nextColor) {
            changes.color = nextColor;
          }
          if (existingProduct.featuresJson !== nextFeaturesJson) {
            changes.featuresJson = nextFeaturesJson;
          }
          if (existingProduct.deliveryDays !== item.deliveryDays) {
            changes.deliveryDays = item.deliveryDays;
          }

          if (Object.keys(changes).length > 0) {
            updateBatch.push({
              id: existingProduct.id,
              data: changes,
            });
          }
        } else if (createNew && !item.shouldDeactivateBy1C && item.brand) {
          // Создание нового товара из 1C_import.csv
          createdProducts++;
          const baseSlug =
            transliterate(`${item.brand}-${item.article || item.code}`) ||
            `product-${item.code}`;

          let imagesJson = '[]';
          let description = `${item.fullName} по официальной цене производителя в салонах и интернет-магазине СИМОНА.`;
          let shortDesc: string | null = null;
          let featuresJson = item.color
            ? updateColorInFeaturesJson('[]', item.color)
            : '[]';
          let dimensions: string | null = null;
          let schematicPdfUrl: string | null = null;
          let inheritedFromSku: string | null = null;

          // Если создается новая карточка со статусом Спец предложени == 1,
          // ищем в БД базовый товар с тем же systemArticle и копируем фото, описание, характеристики и габариты (OneCImportCsv.php строки 693–736)
          if (item.isSpecial && item.systemArticle) {
            const baseProd = await findBaseProductForSpecialOffer(
              item.systemArticle,
              item.article,
              item.code
            );
            if (baseProd) {
              if (hasValidPhotos(baseProd.imagesJson)) {
                imagesJson = baseProd.imagesJson;
                inheritedFromSku = baseProd.sku;
                inheritedSpecialPhotos++;
              }
              if (baseProd.description) description = baseProd.description;
              if (baseProd.shortDesc) shortDesc = baseProd.shortDesc;
              if (baseProd.featuresJson && baseProd.featuresJson !== '[]') {
                featuresJson = item.color
                  ? updateColorInFeaturesJson(baseProd.featuresJson, item.color)
                  : baseProd.featuresJson;
              }
              if (baseProd.dimensions) dimensions = baseProd.dimensions;
              if (baseProd.schematicPdfUrl) schematicPdfUrl = baseProd.schematicPdfUrl;
            }
          }

          // Новинки без фото создаются с isActive = false и попадают во вкладку "/manager/products-no-photo"
          const hasPhoto = hasValidPhotos(imagesJson);
          const isActive = hasPhoto;

          const newProduct = {
            id: item.code,
            sku: item.code,
            oneCGuid: item.code,
            name: item.fullName,
            slug: `${baseSlug}-${item.code}`,
            brand: item.brand,
            category: item.categoryName || item.group || 'Встраиваемая техника',
            categoryType: 'CATEGORY_B',
            productGroup: item.group || null,
            systemArticle: item.systemArticle || null,
            physicalStatus: item.inStock ? 'LOCAL_STOCK' : 'ON_ORDER',
            price: item.resolvedPrice,
            oldPrice: item.resolvedOldPrice,
            priceOpt: item.priceOpt > 0 ? item.priceOpt : null,
            badge: item.resolvedBadge,
            inStock: item.inStock,
            stockCount: item.stockKominterna,
            stockKominterna: item.stockKominterna,
            stockBelinskogo15: 0,
            stockRemote: 0,
            deliveryDays: item.deliveryDays || (item.inStock ? 1 : 7),
            color: item.color || null,
            shortDesc,
            description,
            featuresJson,
            dimensions,
            schematicPdfUrl,
            imagesJson,
            isActive,
            isSpecial: item.isSpecial,
            isDiscount: item.isDiscount,
            noPrice: item.isNoPrice,
          };

          createBatch.push(newProduct);

          const photoNote = inheritedFromSku
            ? ` [Фото унаследовано от SKU ${inheritedFromSku}, активен]`
            : ` [Без фото -> ожидает загрузки в /manager/products-no-photo]`;

          allChanges.push({
            code: item.code,
            sku: item.code,
            name: item.fullName,
            brand: item.brand,
            category: item.categoryName || item.group || 'Встраиваемая техника',
            slug: `${baseSlug}-${item.code}`,
            changeType: 'CREATED',
            oldValue: null,
            newValue: item.resolvedPrice,
            detail: `Новинка: ${item.fullName} (${item.resolvedPrice} ₽)${photoNote}`,
            hasPhoto: Boolean(inheritedFromSku || hasPhoto),
          });

          if (sampleChanges.length < 100) {
            sampleChanges.push({
              code: item.code,
              sku: item.code,
              name: item.fullName,
              changeType: 'CREATED',
              detail: `Новинка: ${item.fullName} (${item.resolvedPrice} ₽)${photoNote}`,
            });
          }
        }
      }

      if (!dryRun) {
        if (updateBatch.length > 0) {
          const batchSize = 100;
          for (let i = 0; i < updateBatch.length; i += batchSize) {
            const slice = updateBatch.slice(i, i + batchSize);
            await prisma.$transaction(
              slice.map((u) =>
                prisma.product.update({
                  where: { id: u.id },
                  data: u.data,
                })
              )
            );
          }
        }

        if (createBatch.length > 0) {
          for (const item of createBatch) {
            try {
              await prisma.product.create({ data: item as never });
            } catch (err: unknown) {
              const message = err instanceof Error ? err.message : String(err);
              console.warn(`[1C-Sync] Error creating product ${String(item.sku)}:`, message);
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
    disabledSpecialCount,
    matchedProducts: totalMatched,
    updatedPrices,
    updatedStocks,
    updatedBadges,
    createdProducts,
    inheritedSpecialPhotos,
    deactivatedProducts,
    dryRun,
    durationMs: Date.now() - start,
    sampleChanges,
    allChanges,
  };
}

const SESSIONS_DIR = path.join(process.cwd(), 'storage', 'sync_sessions');
const SESSIONS_INDEX_FILE = path.join(SESSIONS_DIR, 'sessions_index.json');

export function saveSyncSession(session: SyncSessionData) {
  try {
    if (!fs.existsSync(SESSIONS_DIR)) {
      fs.mkdirSync(SESSIONS_DIR, { recursive: true });
    }
    const sessionFile = path.join(SESSIONS_DIR, `session_${session.id}.json`);
    fs.writeFileSync(sessionFile, JSON.stringify(session, null, 2), 'utf-8');

    // Update latest.json
    fs.writeFileSync(path.join(SESSIONS_DIR, 'latest.json'), JSON.stringify(session, null, 2), 'utf-8');

    // Update sessions_index.json (rotation: keep 30)
    let index: SyncSessionSummary[] = [];
    if (fs.existsSync(SESSIONS_INDEX_FILE)) {
      try {
        index = JSON.parse(fs.readFileSync(SESSIONS_INDEX_FILE, 'utf-8'));
      } catch {
        index = [];
      }
    }

    const summary: SyncSessionSummary = {
      id: session.id,
      startedAt: session.startedAt,
      finishedAt: session.finishedAt,
      durationMs: session.durationMs,
      fileName: session.fileName,
      totalRows: session.totalRows,
      stats: session.stats,
    };

    index = [summary, ...index.filter((s) => s.id !== session.id)].slice(0, 30);
    fs.writeFileSync(SESSIONS_INDEX_FILE, JSON.stringify(index, null, 2), 'utf-8');

    // Cleanup old session files beyond 30
    const activeIds = new Set(index.map((s) => s.id));
    const files = fs.readdirSync(SESSIONS_DIR);
    for (const f of files) {
      if (f.startsWith('session_') && f.endsWith('.json')) {
        const sid = f.replace('session_', '').replace('.json', '');
        if (!activeIds.has(sid)) {
          try {
            fs.unlinkSync(path.join(SESSIONS_DIR, f));
          } catch {}
        }
      }
    }
  } catch (err) {
    console.warn('[SyncService] Failed to save sync session:', err);
  }
}

export function getSyncSessionsList(): SyncSessionSummary[] {
  try {
    if (fs.existsSync(SESSIONS_INDEX_FILE)) {
      return JSON.parse(fs.readFileSync(SESSIONS_INDEX_FILE, 'utf-8'));
    }
  } catch {}
  return [];
}

export function getSyncSessionDetails(sessionId: string): SyncSessionData | null {
  try {
    const file =
      sessionId === 'latest'
        ? path.join(SESSIONS_DIR, 'latest.json')
        : path.join(SESSIONS_DIR, `session_${sessionId}.json`);
    if (fs.existsSync(file)) {
      return JSON.parse(fs.readFileSync(file, 'utf-8'));
    }
  } catch {}
  return null;
}

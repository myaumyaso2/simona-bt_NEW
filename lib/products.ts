import { isProductInOutletCategory } from '@/lib/catalog/outlet';
import { Product } from '@prisma/client';
import { ProductItem, PhysicalStatus, CategoryType, ManufacturerPromo } from '@/types';
import { prisma } from './prisma';
import { CATALOG_PRODUCTS } from '@/data/catalogData';

export function formatPrismaProduct(p: Product): ProductItem {
  let features: { label: string; value: string }[] = [];
  try {
    features = JSON.parse(p.featuresJson || '[]');
  } catch {
    features = [];
  }

  let images: string[] = [];
  try {
    images = JSON.parse(p.imagesJson || '[]');
  } catch {
    images = [];
  }

  return {
    id: p.id,
    sku: p.sku,
    name: p.name,
    slug: p.slug,
    brand: p.brand,
    category: p.category,
    categoryType: (p.categoryType as CategoryType) || 'CATEGORY_B',
    productGroup: p.productGroup || null,
    physicalStatus: (p.physicalStatus as PhysicalStatus) || (p.inStock ? 'LOCAL_STOCK' : 'ON_ORDER'),
    price: p.price,
    oldPrice: p.oldPrice,
    inStock: p.inStock,
    stockCount: p.stockCount,
    stockKominterna: p.stockKominterna,
    stockBelinskogo15: p.stockBelinskogo15,
    stockRemote: p.stockRemote,
    color: p.color,
    shortDesc: p.shortDesc,
    description: p.description,
    features,
    featuresJson: p.featuresJson,
    dimensions: p.dimensions,
    schematicPdfUrl: p.schematicPdfUrl,
    images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80'],
    imagesJson: p.imagesJson,
    badge: p.badge,
    isFeatured: p.isFeatured,
    isDiscount: p.isDiscount,
    oldUrl: p.oldUrl || undefined,
  };
}

export async function getProductBySlug(slug: string): Promise<ProductItem | null> {
  try {
    const dbProduct = await prisma.product.findUnique({
      where: { slug },
    });
    if (dbProduct) {
      return formatPrismaProduct(dbProduct);
    }
  } catch (e) {
    console.error('Error fetching product by slug from DB:', e);
  }

  const staticProduct = CATALOG_PRODUCTS.find((p) => p.slug === slug);
  return staticProduct || null;
}

export async function getCatalogProducts(options?: {
  category?: string;
  categories?: string[];
  categorySlug?: string;
  includeOutlet?: boolean;
  brand?: string;
  limit?: number;
  offset?: number;
  orderBy?: 'popular' | 'price_asc' | 'price_desc' | 'newest';
}): Promise<{ products: ProductItem[]; total: number }> {
  try {
    const where: Record<string, unknown> = { isActive: true };
    if (options?.categories && options.categories.length > 0) {
      where.category = { in: options.categories };
    } else if (options?.category) {
      where.category = { contains: options.category };
    }
    if (options?.brand) {
      const b = options.brand.trim();
      const brandVariants = new Set<string>([
        b,
        b.toUpperCase(),
        b.toLowerCase(),
        b.charAt(0).toUpperCase() + b.slice(1).toLowerCase(),
      ]);
      if (b.toLowerCase().includes('korting') || b.toLowerCase().includes('körting')) {
        brandVariants.add('KORTING');
        brandVariants.add('KÖRTING');
        brandVariants.add('Korting');
        brandVariants.add('Körting');
      }
      if (b.toUpperCase() === 'SIEMENS') {
        brandVariants.add('SIEMENS LV');
        brandVariants.add('Siemens LV');
      }
      where.brand = { in: Array.from(brandVariants) };
    }

    let orderByObj: Record<string, string> = { isFeatured: 'desc' };
    if (options?.orderBy === 'price_asc') {
      orderByObj = { price: 'asc' };
    } else if (options?.orderBy === 'price_desc') {
      orderByObj = { price: 'desc' };
    } else if (options?.orderBy === 'newest') {
      orderByObj = { createdAt: 'desc' };
    }

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        take: options?.limit || 24,
        skip: options?.offset || 0,
        orderBy: orderByObj,
      }),
      prisma.product.count({ where }),
    ]);

    let formatted = items.map(formatPrismaProduct);
    if (options?.includeOutlet && options?.categorySlug) {
      try {
        const outletItems = await prisma.product.findMany({
          where: {
            isActive: true,
            OR: [
              { category: { contains: 'Уцен' } },
              { isDiscount: true },
              { oldUrl: { contains: 'ucen' } },
            ],
            ...(where.brand ? { brand: where.brand } : {}),
          },
        });
        const formattedOutlet = outletItems.map(formatPrismaProduct);
        const matchingOutlet = formattedOutlet.filter((p) =>
          isProductInOutletCategory(p, options.categorySlug!)
        );
        const existingIds = new Set(formatted.map((p) => p.id));
        for (const op of matchingOutlet) {
          if (!existingIds.has(op.id)) {
            formatted.push(op);
          }
        }
      } catch (err) {
        console.error('Error fetching category outlet products:', err);
      }
    }

    return {
      products: formatted,
      total,
    };
  } catch (e) {
    console.error('Error fetching catalog products from DB:', e);
  }

  return {
    products: CATALOG_PRODUCTS.slice(0, options?.limit || 24),
    total: CATALOG_PRODUCTS.length,
  };
}

export async function getPromoProducts(promo: ManufacturerPromo): Promise<ProductItem[]> {
  try {
    const where: Record<string, unknown> = { isActive: true };
    if (promo.participatingSkus && promo.participatingSkus.length > 0) {
      where.sku = { in: promo.participatingSkus };
    } else if (promo.participatingProductSlugs && promo.participatingProductSlugs.length > 0) {
      where.slug = { in: promo.participatingProductSlugs };
    } else if (promo.brand) {
      const b = promo.brand.trim();
      const brandVariants = new Set<string>([
        b,
        b.toUpperCase(),
        b.toLowerCase(),
        b.charAt(0).toUpperCase() + b.slice(1).toLowerCase(),
      ]);
      if (b.toLowerCase().includes('korting') || b.toLowerCase().includes('körting')) {
        brandVariants.add('KORTING');
        brandVariants.add('KÖRTING');
        brandVariants.add('Korting');
        brandVariants.add('Körting');
      }
      where.brand = { in: Array.from(brandVariants) };
    }

    const items = await prisma.product.findMany({
      where,
      orderBy: [
        { inStock: 'desc' },
        { isFeatured: 'desc' },
        { price: 'desc' },
      ],
      take: 100,
    });

    if (items.length > 0) {
      return items.map(formatPrismaProduct);
    }
  } catch (e) {
    console.error('Error fetching promo products from DB:', e);
  }

  // Fallback to static CATALOG_PRODUCTS
  return CATALOG_PRODUCTS.filter((prod) => {
    if (promo.participatingSkus && promo.participatingSkus.length > 0) {
      return promo.participatingSkus.includes(prod.sku);
    }
    if (promo.participatingProductSlugs && promo.participatingProductSlugs.length > 0) {
      return promo.participatingProductSlugs.includes(prod.slug);
    }
    return prod.brand.toLowerCase() === promo.brand.toLowerCase();
  });
}

export const CERTIFICATE_SKUS = ['86152', '86153', '86154', '86155', '86156', '86157'];

export async function getCertificateProducts(): Promise<ProductItem[]> {
  try {
    const items = await prisma.product.findMany({
      where: {
        sku: { in: CERTIFICATE_SKUS },
      },
      orderBy: {
        price: 'asc',
      },
    });

    if (items.length > 0) {
      return items.map(formatPrismaProduct);
    }
  } catch (e) {
    console.error('Error fetching certificate products from DB:', e);
  }

  // Fallback static data if DB is unavailable
  return [
    {
      id: '86152',
      sku: '86152',
      name: 'Подарочный сертификат СИМОНА 3000 руб',
      slug: 'simona-3000-rub',
      brand: 'СИМОНА',
      category: 'Аксессуары',
      categoryType: 'CATEGORY_B',
      physicalStatus: 'LOCAL_STOCK',
      price: 3000,
      oldPrice: null,
      inStock: true,
      stockCount: 10,
      productGroup: 'Подарочный сертификат',
      description: 'Подарочный сертификат «СИМОНА» номиналом 3 000 ₽. Действует во всех салонах и интернет-магазине сети.',
      images: ['https://simona-bt.ru/images/cms/data/photo_code/86152.jpg'],
    },
    {
      id: '86153',
      sku: '86153',
      name: 'Подарочный сертификат СИМОНА 5000 руб',
      slug: 'simona-5000-rub',
      brand: 'СИМОНА',
      category: 'Аксессуары',
      categoryType: 'CATEGORY_B',
      physicalStatus: 'LOCAL_STOCK',
      price: 5000,
      oldPrice: null,
      inStock: true,
      stockCount: 10,
      productGroup: 'Подарочный сертификат',
      description: 'Подарочный сертификат «СИМОНА» номиналом 5 000 ₽. Действует во всех салонах и интернет-магазине сети.',
      images: ['https://simona-bt.ru/images/cms/data/photo_code/86153.jpg'],
    },
    {
      id: '86154',
      sku: '86154',
      name: 'Подарочный сертификат СИМОНА 10000 руб',
      slug: 'simona-10000-rub',
      brand: 'СИМОНА',
      category: 'Аксессуары',
      categoryType: 'CATEGORY_B',
      physicalStatus: 'LOCAL_STOCK',
      price: 10000,
      oldPrice: null,
      inStock: true,
      stockCount: 10,
      productGroup: 'Подарочный сертификат',
      description: 'Подарочный сертификат «СИМОНА» номиналом 10 000 ₽. Действует во всех салонах и интернет-магазине сети.',
      images: ['https://simona-bt.ru/images/cms/data/photo_code/86154.jpg'],
    },
    {
      id: '86155',
      sku: '86155',
      name: 'Подарочный сертификат СИМОНА 30000 руб',
      slug: 'simona-30000-rub',
      brand: 'СИМОНА',
      category: 'Аксессуары',
      categoryType: 'CATEGORY_B',
      physicalStatus: 'LOCAL_STOCK',
      price: 30000,
      oldPrice: null,
      inStock: true,
      stockCount: 10,
      productGroup: 'Подарочный сертификат',
      description: 'Подарочный сертификат «СИМОНА» номиналом 30 000 ₽. Действует во всех салонах и интернет-магазине сети.',
      images: ['https://simona-bt.ru/images/cms/data/photo_code/86155.jpg'],
    },
    {
      id: '86156',
      sku: '86156',
      name: 'Подарочный сертификат СИМОНА 50000 руб',
      slug: 'simona-50000-rub',
      brand: 'СИМОНА',
      category: 'Аксессуары',
      categoryType: 'CATEGORY_B',
      physicalStatus: 'LOCAL_STOCK',
      price: 50000,
      oldPrice: null,
      inStock: true,
      stockCount: 10,
      productGroup: 'Подарочный сертификат',
      description: 'Подарочный сертификат «СИМОНА» номиналом 50 000 ₽. Действует во всех салонах и интернет-магазине сети.',
      images: ['https://simona-bt.ru/images/cms/data/photo_code/86156.jpg'],
    },
    {
      id: '86157',
      sku: '86157',
      name: 'Подарочный сертификат СИМОНА 100000 руб',
      slug: 'simona-100000-rub',
      brand: 'СИМОНА',
      category: 'Аксессуары',
      categoryType: 'CATEGORY_B',
      physicalStatus: 'LOCAL_STOCK',
      price: 100000,
      oldPrice: null,
      inStock: true,
      stockCount: 10,
      productGroup: 'Подарочный сертификат',
      description: 'Подарочный сертификат «СИМОНА» номиналом 100 000 ₽. Действует во всех салонах и интернет-магазине сети.',
      images: ['https://simona-bt.ru/images/cms/data/photo_code/86157.jpg'],
    },
  ];
}

const SEARCH_SYNONYMS: Record<string, string> = {
  миле: 'miele',
  милле: 'miele',
  аско: 'asko',
  смег: 'smeg',
  либхер: 'liebherr',
  либхерр: 'liebherr',
  омойкири: 'omoikiri',
  омоикири: 'omoikiri',
  бертаззони: 'bertazzoni',
  бертазони: 'bertazzoni',
  фальмек: 'falmec',
  фалмек: 'falmec',
  кертинг: 'körting',
  кортинг: 'körting',
  korting: 'körting',
  мидеа: 'midea',
  мидея: 'midea',
  вард: 'vard',
  бош: 'bosch',
  сименс: 'siemens',
  горенье: 'gorenje',
  куперсбуш: 'küppersbusch',
};

const PHYSICAL_PRIORITY: Record<string, number> = {
  ACTIVE_KITCHEN: 1,
  EXHIBITION_15: 1,
  EXHIBITION_11: 1,
  SHOWROOM: 1,
  LOCAL_STOCK: 2,
  REMOTE_STOCK: 3,
  ON_ORDER: 4,
};

/**
 * Полнотекстовый поиск по каталогу СИМОНА с ранжированием:
 * 1. Точное совпадение 1С-кода (sku)
 * 2. Совпадение заводского артикула / модели в названии (name)
 * 3. Совпадение бренда / категории / группы товара
 * Внутри каждого ранга приоритет отдается приборам «На витрине» (SHOWROOM) и «На складе» (LOCAL_STOCK).
 */
export async function searchCatalogProducts(
  rawQuery: string,
  limit = 1500
): Promise<{ products: ProductItem[]; total: number }> {
  const query = (rawQuery || '').trim();
  if (!query) {
    return getCatalogProducts({ limit });
  }

  const lowerQuery = query.toLowerCase();
  const compactQuery = lowerQuery.replace(/[\s\-_/]+/g, '');
  const rawTokens = lowerQuery
    .split(/\s+/)
    .filter(Boolean)
    .map((t) => SEARCH_SYNONYMS[t] || t);

  let allProducts: ProductItem[] = [];
  try {
    const dbItems = await prisma.product.findMany({
      where: { isActive: true },
    });
    allProducts = dbItems.map(formatPrismaProduct);
  } catch {
    allProducts = CATALOG_PRODUCTS;
  }

  const scored: Array<{ product: ProductItem; rank: number; statusPriority: number }> = [];

  for (const product of allProducts) {
    const skuLower = (product.sku || '').toLowerCase();
    const nameLower = (product.name || '').toLowerCase();
    const compactName = nameLower.replace(/[\s\-_/]+/g, '');
    const brandLower = (product.brand || '').toLowerCase();
    const catLower = (product.category || '').toLowerCase();
    const groupLower = (product.productGroup || '').toLowerCase();
    const descLower = (product.description || '').toLowerCase();

    const haystack = `${skuLower} ${nameLower} ${brandLower} ${catLower} ${groupLower} ${descLower}`;

    let rank = 999;

    if (skuLower === lowerQuery) {
      // 1. Точное совпадение 1С-кода (SKU)
      rank = 0;
    } else if (skuLower.startsWith(lowerQuery) && lowerQuery.length >= 3) {
      rank = 1;
    } else if (
      nameLower.includes(lowerQuery) ||
      (compactQuery.length >= 3 && compactName.includes(compactQuery))
    ) {
      // 2. Прямое вхождение заводского артикула или фразы в название
      rank = 2;
    } else if (brandLower === lowerQuery || (rawTokens.length === 1 && brandLower.includes(rawTokens[0]))) {
      rank = 3;
    } else if (rawTokens.length > 0 && rawTokens.every((tok) => haystack.includes(tok))) {
      // 3. Все слова запроса присутствуют в карточке прибора
      rank = 4;
    }

    if (rank < 999) {
      const statusPriority = PHYSICAL_PRIORITY[product.physicalStatus] || 5;
      scored.push({ product, rank, statusPriority });
    }
  }

  scored.sort((a, b) => {
    if (a.rank !== b.rank) return a.rank - b.rank;
    if (a.statusPriority !== b.statusPriority) return a.statusPriority - b.statusPriority;
    return b.product.price - a.product.price;
  });

  const total = scored.length;
  const products = scored.slice(0, limit).map((s) => s.product);

  return { products, total };
}



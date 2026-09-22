import { Product } from '@prisma/client';
import { ProductItem, PhysicalStatus, CategoryType } from '@/types';
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
    physicalStatus: (p.physicalStatus as PhysicalStatus) || (p.inStock ? 'LOCAL_STOCK' : 'ON_ORDER'),
    price: p.price,
    oldPrice: p.oldPrice,
    inStock: p.inStock,
    stockCount: p.stockCount,
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
  brand?: string;
  limit?: number;
  offset?: number;
  orderBy?: 'popular' | 'price_asc' | 'price_desc' | 'newest';
}): Promise<{ products: ProductItem[]; total: number }> {
  try {
    const where: any = {};
    if (options?.category) {
      where.category = { contains: options.category };
    }
    if (options?.brand) {
      where.brand = options.brand;
    }

    let orderByObj: any = { isFeatured: 'desc' };
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

    if (items.length > 0) {
      return {
        products: items.map(formatPrismaProduct),
        total,
      };
    }
  } catch (e) {
    console.error('Error fetching catalog products from DB:', e);
  }

  return {
    products: CATALOG_PRODUCTS.slice(0, options?.limit || 24),
    total: CATALOG_PRODUCTS.length,
  };
}

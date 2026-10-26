import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { MANUFACTURER_PROMOS } from '@/data/promosData';
import {
  CATALOG_CATEGORIES,
  CATALOG_MACRO_SECTIONS,
  getCategoryByDbName,
} from '@/data/catalogCategories';
import { brandNameToSlug, resolveBrandEntry } from '@/lib/catalog/brandsRegistry';

export const dynamic = 'force-dynamic';

export const TIER1_BRAND_SLUGS = [
  'miele',
  'asko',
  'smeg',
  'liebherr',
  'korting',
  'omoikiri',
  'falmec',
  'vard',
  'midea',
  'bosch',
  'elica',
  'gorenje',
  'evelux',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.simona-bt.ru';
  const now = new Date();

  // 1. Static high-priority pages
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${siteUrl}/catalog`, lastModified: now, changeFrequency: 'hourly', priority: 0.95 },
    { url: `${siteUrl}/catalog/ucenennye-tovary`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteUrl}/promos`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteUrl}/brands`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${siteUrl}/showrooms`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${siteUrl}/designers`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${siteUrl}/services`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/warranty`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/delivery-payment`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/contacts`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/opt`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/certificate`, lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${siteUrl}/price-match`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${siteUrl}/returns`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/policy`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ];

  // 2. Macro-Section Hubs (7 top-level catalog sections)
  const macroSectionRoutes: MetadataRoute.Sitemap = CATALOG_MACRO_SECTIONS.map((sec) => ({
    url: `${siteUrl}/catalog/${sec.slug}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.92,
  }));

  // 3. Leaf Catalog Categories
  const categoryRoutes: MetadataRoute.Sitemap = CATALOG_CATEGORIES.map((category) => ({
    url: `${siteUrl}/catalog/${category.slug}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  // 4. Active Manufacturer Promos
  const promoRoutes: MetadataRoute.Sitemap = MANUFACTURER_PROMOS.filter(
    (promo) => promo.isActive !== false
  ).map((promo) => ({
    url: `${siteUrl}/promos/${promo.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // 5. All Active Brands (/brands/[slug]) + All Non-Empty Category+Brand Facets (/catalog/[category]?brand=[BRAND]) + Products
  let brandRoutes: MetadataRoute.Sitemap = [];
  let categoryBrandRoutes: MetadataRoute.Sitemap = [];
  let productRoutes: MetadataRoute.Sitemap = [];

  try {
    const [groupedPairs, products] = await Promise.all([
      prisma.product.groupBy({
        by: ['category', 'brand'],
        where: { isActive: true },
        _count: { id: true },
      }),
      prisma.product.findMany({
        where: { isActive: true },
        select: {
          slug: true,
          inStock: true,
          updatedAt: true,
        },
        take: 8500,
        orderBy: { updatedAt: 'desc' },
      }),
    ]);

    const seenBrandSlugs = new Set<string>();
    const seenCatBrandUrls = new Set<string>();

    for (const row of groupedPairs) {
      if (!row._count.id || row._count.id < 1 || !row.brand) continue;
      if (row.brand.trim().toUpperCase() === 'СИМОНА') continue;

      const bSlug = brandNameToSlug(row.brand);
      if (bSlug && !seenBrandSlugs.has(bSlug)) {
        seenBrandSlugs.add(bSlug);
        brandRoutes.push({
          url: `${siteUrl}/brands/${bSlug}`,
          lastModified: now,
          changeFrequency: 'weekly',
          priority: 0.85,
        });
      }

      if (row.category) {
        const cat = getCategoryByDbName(row.category);
        if (cat) {
          const reg = resolveBrandEntry(row.brand);
          const canonicalDbBrand = reg ? reg.dbBrand : row.brand.trim().toUpperCase();
          const facetUrl = `${siteUrl}/catalog/${cat.slug}?brand=${encodeURIComponent(canonicalDbBrand)}`;
          if (!seenCatBrandUrls.has(facetUrl)) {
            seenCatBrandUrls.add(facetUrl);
            categoryBrandRoutes.push({
              url: facetUrl,
              lastModified: now,
              changeFrequency: 'daily',
              priority: 0.82,
            });
          }
        }
      }
    }

    productRoutes = products.map((p) => ({
      url: `${siteUrl}/product/${p.slug}`,
      lastModified: p.updatedAt || now,
      changeFrequency: p.inStock ? 'daily' : 'weekly',
      priority: p.inStock ? 0.8 : 0.5,
    }));
  } catch (e) {
    console.error('Error generating dynamic sitemap routes:', e);
  }

  return [
    ...staticRoutes,
    ...macroSectionRoutes,
    ...categoryRoutes,
    ...brandRoutes,
    ...categoryBrandRoutes,
    ...promoRoutes,
    ...productRoutes,
  ];
}

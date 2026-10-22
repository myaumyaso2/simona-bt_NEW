import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { MANUFACTURER_PROMOS } from '@/data/promosData';
import { CATALOG_CATEGORIES } from '@/data/catalogCategories';

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

  // 1. Static high-priority pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/catalog`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.95,
    },
    {
      url: `${siteUrl}/promos`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/showrooms`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${siteUrl}/designers`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${siteUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/warranty`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/delivery-payment`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/brands`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/contacts`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/opt`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/price-match`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/returns`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // 2. Catalog Categories (SEO Landing Hubs)
  const categoryRoutes: MetadataRoute.Sitemap = CATALOG_CATEGORIES.map((category) => ({
    url: `${siteUrl}/catalog/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  // 3. Tier-1 Brand Hubs (Quiet Luxury Brand Flagships)
  const brandRoutes: MetadataRoute.Sitemap = TIER1_BRAND_SLUGS.map((slug) => ({
    url: `${siteUrl}/brands/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // 4. Active Manufacturer Promos
  const promoRoutes: MetadataRoute.Sitemap = MANUFACTURER_PROMOS.map((promo) => ({
    url: `${siteUrl}/promos/${promo.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // 5. Products from Database (8 000+ SKU)
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
      },
      select: {
        slug: true,
        inStock: true,
        updatedAt: true,
      },
      take: 8500,
      orderBy: { updatedAt: 'desc' },
    });

    productRoutes = products.map((p) => ({
      url: `${siteUrl}/product/${p.slug}`,
      lastModified: p.updatedAt || new Date(),
      changeFrequency: p.inStock ? 'daily' : 'weekly',
      priority: p.inStock ? 0.8 : 0.5,
    }));
  } catch (e) {
    console.error('Error fetching products for sitemap:', e);
  }

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...brandRoutes,
    ...promoRoutes,
    ...productRoutes,
  ];
}

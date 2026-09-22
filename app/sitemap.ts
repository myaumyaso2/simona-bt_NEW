import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { MANUFACTURER_PROMOS } from '@/data/promosData';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://simona-bt.ru';

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
      url: `${siteUrl}/brands`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // 2. Active promos
  const promoRoutes: MetadataRoute.Sitemap = MANUFACTURER_PROMOS.map((promo) => ({
    url: `${siteUrl}/promos/${promo.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // 3. Products from Database
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const products = await prisma.product.findMany({
      select: {
        slug: true,
        inStock: true,
        updatedAt: true,
      },
      take: 8000,
    });

    productRoutes = products.map((p) => ({
      url: `${siteUrl}/product/${p.slug}`,
      lastModified: p.updatedAt || new Date(),
      changeFrequency: p.inStock ? 'daily' : 'weekly',
      priority: p.inStock ? 0.9 : 0.6,
    }));
  } catch (e) {
    console.error('Error fetching products for sitemap:', e);
  }

  return [...staticRoutes, ...promoRoutes, ...productRoutes];
}

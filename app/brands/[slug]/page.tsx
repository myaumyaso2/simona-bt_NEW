import React from 'react';
import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { formatPrismaProduct } from '@/lib/products';
import { ProductItem } from '@/types';
import { BRAND_DETAILS_MAP, BrandDetails } from '@/data/brandDetails';
import { CatalogView } from '@/components/catalog/CatalogView';
import { SchemaOrgBreadcrumbs } from '@/components/seo/SchemaOrgBreadcrumbs';
import { SchemaOrgItemList } from '@/components/seo/SchemaOrgItemList';
import { formatBrandName } from '@/lib/formatters';
import {
  resolveBrandEntry,
  brandNameToSlug,
  getBrandDbVariants,
} from '@/lib/catalog/brandsRegistry';

interface BrandPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const rawSlug = decodeURIComponent(params.slug);
  const regEntry = resolveBrandEntry(rawSlug);
  const canonicalSlug = regEntry ? regEntry.slug : (brandNameToSlug(rawSlug) || rawSlug.toLowerCase());
  const info = BRAND_DETAILS_MAP[canonicalSlug];
  const brandTitle = regEntry ? regEntry.displayName : (info ? formatBrandName(info.name) : formatBrandName(rawSlug));

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.simona-bt.ru';
  const dbVariants = getBrandDbVariants(regEntry || rawSlug);

  let minPriceFormatted = '';
  let activeCount = 0;
  try {
    const [minProduct, count] = await Promise.all([
      prisma.product.findFirst({
        where: {
          isActive: true,
          price: { gt: 0 },
          brand: { in: dbVariants },
        },
        orderBy: { price: 'asc' },
        select: { price: true },
      }),
      prisma.product.count({
        where: {
          isActive: true,
          brand: { in: dbVariants },
        },
      }),
    ]);
    activeCount = count;
    if (minProduct?.price) {
      minPriceFormatted = `${minProduct.price.toLocaleString('ru-RU')} ₽`;
    }
  } catch (err) {
    console.error('Error fetching brand metadata stats:', err);
  }

  if (activeCount === 0) {
    return {
      title: `Бренд не найден — 404 | СИМОНА Нижний Новгород`,
      robots: { index: false, follow: true },
    };
  }

  const canonicalUrl = `${siteUrl}/brands/${canonicalSlug}`;
  const title = minPriceFormatted
    ? `Бытовая техника ${brandTitle} в Нижнем Новгороде — купить по цене от ${minPriceFormatted} | Салоны СИМОНА`
    : `Бытовая техника ${brandTitle} в Нижнем Новгороде — каталог и цены | Салоны СИМОНА`;
  const description = `Каталог бытовой техники ${brandTitle} (${activeCount} моделей)${minPriceFormatted ? ` по цене от ${minPriceFormatted}` : ''} в салонах и интернет-магазине «СИМОНА» в Нижнем Новгороде (ул. Белинского 15 и 11/66, склад на ул. Коминтерна 27). Официальная гарантия, аккуратная доставка и профессиональное подключение.`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `Бытовая техника ${brandTitle} | Салоны СИМОНА`,
      description,
      url: canonicalUrl,
    },
  };
}

export const dynamic = 'force-dynamic';

export default async function BrandDetailPage({ params }: BrandPageProps) {
  const rawSlug = decodeURIComponent(params.slug);
  if (rawSlug.toLowerCase() === 'simona' || rawSlug.toLowerCase() === 'симона') {
    permanentRedirect('/certificate');
  }

  const regEntry = resolveBrandEntry(rawSlug);
  const canonicalSlug = regEntry ? regEntry.slug : (brandNameToSlug(rawSlug) || rawSlug.toLowerCase());

  if (params.slug !== canonicalSlug) {
    permanentRedirect(`/brands/${canonicalSlug}`);
  }

  const brandTitleFormatted = regEntry ? regEntry.displayName : formatBrandName(canonicalSlug);

  const brandInfo: BrandDetails = BRAND_DETAILS_MAP[canonicalSlug] || {
    name: brandTitleFormatted,
    slug: canonicalSlug,
    country: regEntry?.country || 'Международный бренд',
    category: 'Бытовая техника для дома и кухни',
    showroom: 'Консультация и подбор в салонах на ул. Белинского, 15 и 11/66',
    heroText: `Официальный каталог бытовой техники ${brandTitleFormatted} в Нижнем Новгороде. Поможем подобрать оптимальную модель или комплект с проверкой наличия на центральном складе и официальной гарантией.`,
    advantages: [
      'Официальная гарантия и сертифицированные поставки',
      'Центральный склад в Нижнем Новгороде (ул. Коминтерна, 27)',
      'Аккуратная доставка и подъем на этаж собственной службой',
      'Профессионально устанавливаем и подключаем встраиваемую бытовую технику',
    ],
  };

  const brandQueryVariants = getBrandDbVariants(regEntry || canonicalSlug);

  let products: ProductItem[] = [];
  try {
    const rawProducts = await prisma.product.findMany({
      where: {
        isActive: true,
        brand: {
          in: brandQueryVariants,
        },
      },
      orderBy: [
        { inStock: 'desc' },
        { isFeatured: 'desc' },
        { price: 'asc' },
      ],
      take: 1500,
    });

    products = rawProducts.map(formatPrismaProduct);
  } catch (err) {
    console.error('Error loading brand products:', err);
  }

  if (products.length === 0) {
    notFound();
  }

  // Match the exact brand string stored on Product rows so client-side filter state stays 100% synced
  const effectiveDbBrand = products[0]?.brand || regEntry?.dbBrand || brandInfo.name;

  const breadcrumbs = [
    { name: 'Главная', url: '/' },
    { name: 'Бренды', url: '/brands' },
    { name: brandTitleFormatted, url: `/brands/${canonicalSlug}` },
  ];

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.simona-bt.ru';

  const brandJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Brand',
    name: brandTitleFormatted,
    description: brandInfo.heroText,
    url: `${siteUrl}/brands/${canonicalSlug}`,
  };

  return (
    <main className="min-h-screen bg-[#111315] text-[#D7D9DB]">
      <SchemaOrgBreadcrumbs items={breadcrumbs} />
      <SchemaOrgItemList products={products} categoryTitle={`Бытовая техника ${brandTitleFormatted}`} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(brandJsonLd) }}
      />
      <CatalogView
        initialProducts={products}
        totalCount={products.length}
        initialBrand={effectiveDbBrand}
        brandDetails={brandInfo}
      />
    </main>
  );
}

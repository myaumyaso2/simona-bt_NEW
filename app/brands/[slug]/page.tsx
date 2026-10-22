import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { formatPrismaProduct } from '@/lib/products';
import { ProductItem } from '@/types';
import { BRAND_DETAILS_MAP, BrandDetails } from '@/data/brandDetails';
import { CatalogView } from '@/components/catalog/CatalogView';
import { SchemaOrgBreadcrumbs } from '@/components/seo/SchemaOrgBreadcrumbs';
import { formatBrandName } from '@/lib/formatters';

interface BrandPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const slug = params.slug.toLowerCase();
  const info = BRAND_DETAILS_MAP[slug];
  const brandTitle = info ? info.name : formatBrandName(slug);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.simona-bt.ru';

  return {
    title: `Бытовая техника ${brandTitle} в Нижнем Новгороде | Салоны СИМОНА`,
    description: `Официальный дилер ${brandTitle}. Каталог встраиваемой техники, наличие на складе и экспозиция в салонах на ул. Белинского 15 и 11/66. Консультация экспертов, аккуратная доставка и установка.`,
    openGraph: {
      title: `Бытовая техника ${brandTitle} | Салоны СИМОНА`,
      description: `Официальная сертифицированная коллекция ${brandTitle} в Нижнем Новгороде. Экспозиция в салонах, складское наличие, сервис и гарантия.`,
      url: `${siteUrl}/brands/${slug}`,
    },
  };
}

export const dynamic = 'force-dynamic';

export default async function BrandDetailPage({ params }: BrandPageProps) {
  const slug = params.slug.toLowerCase();
  const brandTitleFormatted = formatBrandName(slug);

  const brandInfo: BrandDetails = BRAND_DETAILS_MAP[slug] || {
    name: brandTitleFormatted,
    slug,
    country: 'Европа',
    category: 'Премиальная бытовая техника',
    showroom: 'Флагманский салон: ул. Белинского, 15',
    heroText: `Официальная продукция ${brandTitleFormatted} в Нижнем Новгороде. Полный ассортимент сертифицированной техники с гарантией производителя.`,
    advantages: [
      'Официальная гарантия производителя',
      'Быстрая доставка с Центрального склада (ул. Коминтерна, 27)',
      'Бесплатное хранение до 6 месяцев',
      'Профессиональный монтаж и подключение',
    ],
  };

  const brandQueryVariants = Array.from(
    new Set([
      brandInfo.name,
      brandInfo.name.toUpperCase(),
      brandInfo.name.toLowerCase(),
      slug,
      slug.toUpperCase(),
      slug === 'korting' ? 'KORTING' : brandInfo.name,
      slug === 'korting' ? 'KÖRTING' : brandInfo.name,
    ])
  );

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

  const breadcrumbs = [
    { name: 'Главная', url: '/' },
    { name: 'Бренды', url: '/brands' },
    { name: brandInfo.name, url: `/brands/${slug}` },
  ];

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.simona-bt.ru';

  // Brand structured data for search engines
  const brandJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Brand',
    name: brandInfo.name,
    description: brandInfo.heroText,
    url: `${siteUrl}/brands/${slug}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'ул. Белинского, 15',
      addressLocality: 'Нижний Новгород',
      addressCountry: 'RU',
    },
  };

  return (
    <main className="min-h-screen bg-[#111315] text-[#D7D9DB]">
      <SchemaOrgBreadcrumbs items={breadcrumbs} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(brandJsonLd) }}
      />
      <CatalogView
        initialProducts={products}
        totalCount={products.length}
        initialBrand={brandInfo.name}
        brandDetails={brandInfo}
      />
    </main>
  );
}

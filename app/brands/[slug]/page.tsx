import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { formatPrismaProduct } from '@/lib/products';
import { ProductItem } from '@/types';
import { BRAND_DETAILS_MAP, BrandDetails } from '@/data/brandDetails';
import { getCategorySlugByName, getCategoryBySlug } from '@/data/catalogCategories';
import { CatalogView } from '@/components/catalog/CatalogView';
import { SchemaOrgBreadcrumbs } from '@/components/seo/SchemaOrgBreadcrumbs';
import { SchemaOrgItemList } from '@/components/seo/SchemaOrgItemList';
import { formatBrandName } from '@/lib/formatters';
import { getSiteContent } from '@/lib/content';
import {
  resolveBrandEntry,
  brandNameToSlug,
  getBrandDbVariants,
} from '@/lib/catalog/brandsRegistry';

const PAGE_SIZE = 24;

interface BrandPageProps {
  params: { slug: string };
  searchParams?: {
    page?: string;
    category?: string;
  };
}

function parsePageParam(rawPage?: string): number {
  const parsed = parseInt(rawPage || '1', 10);
  return Number.isFinite(parsed) && parsed >= 1 ? parsed : 1;
}

export async function generateMetadata({ params, searchParams }: BrandPageProps): Promise<Metadata> {
  const rawSlug = decodeURIComponent(params.slug);
  const pageNum = parsePageParam(searchParams?.page);
  const pageTitleSuffix = pageNum > 1 ? ` — страница ${pageNum}` : '';
  const pageDescSuffix = pageNum > 1 ? ` Страница ${pageNum}.` : '';

  const regEntry = resolveBrandEntry(rawSlug);
  const canonicalSlug = regEntry ? regEntry.slug : (brandNameToSlug(rawSlug) || rawSlug.toLowerCase());
  const info = BRAND_DETAILS_MAP[canonicalSlug];
  const brandTitle = regEntry ? regEntry.displayName : (info ? formatBrandName(info.name) : formatBrandName(rawSlug));
  const countryLabel = regEntry?.country || info?.country || '';

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.simona-bt.ru').replace(/\/+$/, '');
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
      minPriceFormatted = `${Math.round(minProduct.price).toLocaleString('ru-RU')} ₽`;
    }
  } catch (err) {
    console.error('Error fetching brand metadata stats:', err);
  }

  if (activeCount === 0) {
    return {
      title: 'Бренд не найден — 404 | СИМОНА Нижний Новгород',
      robots: { index: false, follow: true },
    };
  }

  const canonicalUrl = `${siteUrl}/brands/${canonicalSlug}${pageNum > 1 ? `?page=${pageNum}` : ''}`;
  const baseTitle = minPriceFormatted
    ? `Бытовая техника ${brandTitle}${countryLabel && countryLabel !== 'Международный бренд' ? ` (${countryLabel})` : ''} в Нижнем Новгороде — цены от ${minPriceFormatted} | СИМОНА`
    : `Бытовая техника ${brandTitle} в Нижнем Новгороде — каталог и цены | Салоны СИМОНА`;
  const title = `${baseTitle}${pageTitleSuffix}`;
  const description = `Каталог бытовой техники ${brandTitle} (${activeCount} моделей)${minPriceFormatted ? ` по цене от ${minPriceFormatted}` : ''}${countryLabel ? `, страна бренда: ${countryLabel}` : ''}. Салоны «СИМОНА» в Нижнем Новгороде (ул. Белинского 15 и 11/66, склад на ул. Коминтерна 27), официальная гарантия и аккуратная доставка.${pageDescSuffix}`;

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

export default async function BrandDetailPage({ params, searchParams }: BrandPageProps) {
  const rawSlug = decodeURIComponent(params.slug);
  const pageNum = parsePageParam(searchParams?.page);

  if (rawSlug.toLowerCase() === 'simona' || rawSlug.toLowerCase() === 'симона') {
    permanentRedirect('/certificate');
  }

  const regEntry = resolveBrandEntry(rawSlug);
  const canonicalSlug = regEntry ? regEntry.slug : (brandNameToSlug(rawSlug) || rawSlug.toLowerCase());

  if (params.slug !== canonicalSlug) {
    permanentRedirect(`/brands/${canonicalSlug}${pageNum > 1 ? `?page=${pageNum}` : ''}`);
  }

  const brandTitleFormatted = regEntry ? regEntry.displayName : formatBrandName(canonicalSlug);
  const { seoBlocks } = getSiteContent();

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
      take: 2000,
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
  const canonicalBrandQuery = regEntry?.dbBrand || effectiveDbBrand.toUpperCase();

  // Build crawlable category links for this brand (/catalog/[cat]?brand=...)
  const catCountMap = new Map<string, { slug: string; title: string; count: number }>();
  let inStockTotal = 0;
  let minBrandPrice = 0;

  for (const p of products) {
    if (p.price > 0 && (minBrandPrice === 0 || p.price < minBrandPrice)) {
      minBrandPrice = p.price;
    }
    if (p.inStock || p.stockCount > 0 || (p.stockKominterna && p.stockKominterna > 0)) {
      inStockTotal++;
    }
    const catSlug = getCategorySlugByName(p.category);
    const catObj = getCategoryBySlug(catSlug);
    if (catObj) {
      const existing = catCountMap.get(catObj.slug);
      if (existing) {
        existing.count += 1;
      } else {
        catCountMap.set(catObj.slug, {
          slug: catObj.slug,
          title: catObj.menuTitle || catObj.title,
          count: 1,
        });
      }
    }
  }

  const brandCategoryLinks = Array.from(catCountMap.values()).sort((a, b) => b.count - a.count);

  const breadcrumbs = [
    { name: 'Главная', url: '/' },
    { name: 'Бренды', url: '/brands' },
    { name: brandTitleFormatted, url: `/brands/${canonicalSlug}` },
  ];

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.simona-bt.ru').replace(/\/+$/, '');
  const pageSlice = products.slice((pageNum - 1) * PAGE_SIZE, pageNum * PAGE_SIZE);

  const originAnswer =
    regEntry?.originSummary ||
    `${brandTitleFormatted} — производитель бытовой техники (страна происхождения бренда: ${brandInfo.country}). В сети салонов «СИМОНА» представлены оригинальные приборы ${brandTitleFormatted} с официальной документацией на русском языке.`;

  const faqItems = [
    {
      question: `Чей бренд ${brandTitleFormatted} и какая страна производитель?`,
      answer: originAnswer,
    },
    {
      question: `Где купить и посмотреть технику ${brandTitleFormatted} в Нижнем Новгороде?`,
      answer: `В каталоге сети салонов «СИМОНА» доступно ${products.length.toLocaleString('ru-RU')} моделей ${brandTitleFormatted}${minBrandPrice > 0 ? ` по цене от ${Math.round(minBrandPrice).toLocaleString('ru-RU')} ₽` : ''}${inStockTotal > 0 ? ` (${inStockTotal.toLocaleString('ru-RU')} в наличии)` : ''}. Консультация и подбор комплекта проводятся в салонах на ул. Белинского, 15 и 11/66, склад самовывоза — ул. Коминтерна, 27.`,
    },
    {
      question: `Какая гарантия и сервис действуют на приборы ${brandTitleFormatted}?`,
      answer: `На всю бытовую технику ${brandTitleFormatted} в салонах «СИМОНА» предоставляется официальная гарантия. Мы выполняем аккуратную доставку и подъем на этаж собственной службой, а также профессионально устанавливаем и подключаем встраиваемую бытовую технику.`,
    },
  ];

  const brandJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Brand',
    name: brandTitleFormatted,
    description: brandInfo.heroText,
    url: `${siteUrl}/brands/${canonicalSlug}`,
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <main className="min-h-screen bg-[#111315] text-[#D7D9DB]">
      <SchemaOrgBreadcrumbs items={breadcrumbs} />
      <SchemaOrgItemList
        products={pageSlice.length > 0 ? pageSlice : products.slice(0, PAGE_SIZE)}
        categoryTitle={`Бытовая техника ${brandTitleFormatted}`}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(brandJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Suspense fallback={<div className="min-h-screen bg-[#111315]" />}>
        <CatalogView
          initialProducts={products}
          totalCount={products.length}
          initialBrand={effectiveDbBrand}
          initialPage={pageNum}
          brandDetails={brandInfo}
        />
      </Suspense>

      {/* Crawlable Brand Categories + Origin & FAQ SEO Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-4">
        <div className="rounded-2xl bg-[#16191D] border border-[#2B313A] p-6 sm:p-8 space-y-8 text-left">
          {brandCategoryLinks.length > 0 && (
            <div>
              <h2 className="text-base sm:text-lg font-bold font-montserrat text-white mb-3">
                {seoBlocks.brandCategoriesHeading}: {brandTitleFormatted}
              </h2>
              <div className="flex flex-wrap gap-2">
                {brandCategoryLinks.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/catalog/${cat.slug}?brand=${encodeURIComponent(canonicalBrandQuery)}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#111315] hover:bg-[#1E2228] border border-[#2B313A] hover:border-simona-teal/60 text-xs font-medium text-[#D7D9DB] hover:text-white transition"
                  >
                    <span>{cat.title} {brandTitleFormatted}</span>
                    <span className="text-[11px] font-mono text-[#87888A]">{cat.count}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className={brandCategoryLinks.length > 0 ? 'pt-6 border-t border-[#2B313A]/60' : ''}>
            <h2 className="text-base sm:text-lg font-bold font-montserrat text-white mb-4">
              {seoBlocks.brandFaqTitle} {brandTitleFormatted}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {faqItems.map((faq) => (
                <div
                  key={faq.question}
                  className="rounded-xl bg-[#111315] border border-[#2B313A] p-5 space-y-2"
                >
                  <h3 className="text-xs sm:text-sm font-semibold text-white font-montserrat leading-snug">
                    {faq.question}
                  </h3>
                  <p className="text-xs text-[#87888A] leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

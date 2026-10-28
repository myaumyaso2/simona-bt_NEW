import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CatalogView } from '@/components/catalog/CatalogView';
import { getCatalogProducts } from '@/lib/products';
import { prisma } from '@/lib/prisma';
import { ProductItem } from '@/types';
import { getCategoryBySlug } from '@/data/catalogCategories';
import {
  CATALOG_FACETS,
  getFacetBySlugs,
  getFacetsByCategory,
} from '@/data/catalogFacets';
import { SchemaOrgBreadcrumbs } from '@/components/seo/SchemaOrgBreadcrumbs';
import { SchemaOrgItemList } from '@/components/seo/SchemaOrgItemList';
import { CategoryFacetLinkItem } from '@/components/catalog/CatalogHero';
import { CategoryExpertGuide } from '@/components/catalog/CategoryExpertGuide';
import { formatBrandName } from '@/lib/formatters';
import { resolveBrandEntry, getBrandDbVariants } from '@/lib/catalog/brandsRegistry';

const PAGE_SIZE = 24;

interface FacetPageProps {
  params: {
    category: string;
    facet: string;
  };
  searchParams?: {
    brand?: string;
    page?: string;
  };
}

export async function generateStaticParams() {
  return CATALOG_FACETS.map((f) => ({
    category: f.categorySlug,
    facet: f.facetSlug,
  }));
}

function parsePageParam(rawPage?: string): number {
  const parsed = parseInt(rawPage || '1', 10);
  return Number.isFinite(parsed) && parsed >= 1 ? parsed : 1;
}

function buildFacetCanonicalUrl(
  siteUrl: string,
  categorySlug: string,
  facetSlug: string,
  canonicalBrandParam?: string,
  pageNum: number = 1
): string {
  const qs = new URLSearchParams();
  if (canonicalBrandParam) {
    qs.set('brand', canonicalBrandParam);
  }
  if (pageNum > 1) {
    qs.set('page', String(pageNum));
  }
  const queryStr = qs.toString();
  return `${siteUrl}/catalog/${categorySlug}/${facetSlug}${queryStr ? `?${queryStr}` : ''}`;
}

export async function generateMetadata({ params, searchParams }: FacetPageProps): Promise<Metadata> {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.simona-bt.ru').replace(/\/+$/, '');
  const facetDef = getFacetBySlugs(params.category, params.facet);
  const category = getCategoryBySlug(params.category);

  if (!facetDef || !category) {
    return {
      title: 'Раздел не найден — 404 | СИМОНА',
      robots: { index: false, follow: true },
    };
  }

  const rawBrand = searchParams?.brand?.trim();
  const pageNum = parsePageParam(searchParams?.page);
  const pageTitleSuffix = pageNum > 1 ? ` — страница ${pageNum}` : '';
  const pageDescSuffix = pageNum > 1 ? ` Страница ${pageNum}.` : '';

  const brandReg = rawBrand ? resolveBrandEntry(rawBrand) : null;
  const brandDisplay = rawBrand ? (brandReg ? brandReg.displayName : formatBrandName(rawBrand)) : '';
  const canonicalBrandParam = rawBrand ? (brandReg ? brandReg.dbBrand : rawBrand.toUpperCase()) : '';

  const brandVariants = rawBrand ? getBrandDbVariants(brandReg || rawBrand) : [];
  let minPriceFormatted = '';
  let matchCount = 0;

  try {
    const { products } = await getCatalogProducts({ categories: category.dbCategories });
    const catProducts = products.filter((p: ProductItem) => {
      const matchFacet = facetDef.filter(p);
      const matchBrand =
        brandVariants.length === 0 ||
        brandVariants.some((b) => (p.brand || '').trim().toUpperCase() === b.toUpperCase());
      return matchFacet && matchBrand;
    });

    matchCount = catProducts.length;
    const minPrice = catProducts.reduce(
      (min: number, p: ProductItem) => (p.price > 0 && (min === 0 || p.price < min) ? p.price : min),
      0
    );
    if (minPrice > 0) {
      minPriceFormatted = `${Math.round(minPrice).toLocaleString('ru-RU')} ₽`;
    }
  } catch (err) {
    console.error('Error fetching facet metadata products:', err);
  }

  const baseTitle = brandDisplay
    ? `${facetDef.h1} ${brandDisplay} в Нижнем Новгороде — купить по цене от ${minPriceFormatted || 'каталога'} | Салоны СИМОНА`
    : minPriceFormatted
    ? `${facetDef.h1} в Нижнем Новгороде — купить по цене от ${minPriceFormatted} | Салоны СИМОНА`
    : `${facetDef.h1} в Нижнем Новгороде | Салоны СИМОНА`;

  const title = `${baseTitle}${pageTitleSuffix}`;
  const description = `${facetDef.metaDescription}${
    matchCount > 0 ? ` В наличии ${matchCount} моделей.` : ''
  }${pageDescSuffix}`;
  const canonicalUrl = buildFacetCanonicalUrl(
    siteUrl,
    params.category,
    params.facet,
    canonicalBrandParam || undefined,
    pageNum
  );

  const shouldIndex = matchCount >= (facetDef.minProductsThreshold || 3);

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    robots: {
      index: shouldIndex,
      follow: true,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
    },
  };
}

export default async function CatalogFacetPage({ params, searchParams }: FacetPageProps) {
  const facetDef = getFacetBySlugs(params.category, params.facet);
  const category = getCategoryBySlug(params.category);

  if (!facetDef || !category) {
    notFound();
  }

  const rawBrand = searchParams?.brand?.trim();
  const pageNum = parsePageParam(searchParams?.page);

  const brandReg = rawBrand ? resolveBrandEntry(rawBrand) : null;
  const brandDisplay = rawBrand ? (brandReg ? brandReg.displayName : formatBrandName(rawBrand)) : '';
  const canonicalBrandParam = rawBrand ? (brandReg ? brandReg.dbBrand : rawBrand.toUpperCase()) : '';
  const activeBrandUpper = canonicalBrandParam ? canonicalBrandParam.toUpperCase() : undefined;

  const { products: allCategoryProducts } = await getCatalogProducts({
    categories: category.dbCategories,
  });

  const facetProducts = allCategoryProducts.filter((p: ProductItem) => facetDef.filter(p));

  const brandVariantsUpper = canonicalBrandParam
    ? new Set(getBrandDbVariants(brandReg || canonicalBrandParam).map((v) => v.toUpperCase()))
    : null;

  const scopedProducts = brandVariantsUpper
    ? facetProducts.filter((p: ProductItem) => brandVariantsUpper.has((p.brand || '').trim().toUpperCase()))
    : facetProducts;

  const pageSlice = scopedProducts.slice((pageNum - 1) * PAGE_SIZE, pageNum * PAGE_SIZE);

  // Sibling facet link chips for popular collections slider
  const siblingFacets = getFacetsByCategory(params.category);
  const facetLinks: CategoryFacetLinkItem[] = siblingFacets
    .map((sf) => ({
      shortTitle: sf.shortTitle,
      facetSlug: sf.facetSlug,
      count: allCategoryProducts.filter((p: ProductItem) => sf.filter(p)).length,
      href: `/catalog/${params.category}/${sf.facetSlug}`,
      isActive: sf.facetSlug === params.facet,
    }))
    .filter((f) => (f.count ?? 0) >= 3);

  // Breadcrumbs
  const breadcrumbs = [
    { name: 'Главная', href: '/' },
    { name: 'Каталог', href: '/catalog' },
    { name: category.sectionTitle, href: `/catalog/${category.sectionSlug}` },
    { name: category.title, href: `/catalog/${category.slug}` },
    { name: facetDef.shortTitle },
  ];

  const heroBreadcrumbs = [
    { name: 'Каталог', url: '/catalog' },
    { name: category.sectionTitle, url: `/catalog/${category.sectionSlug}` },
    { name: category.title, url: `/catalog/${category.slug}` },
    { name: facetDef.shortTitle },
  ];

  const pageTitle = brandDisplay ? `${facetDef.h1} ${brandDisplay}` : facetDef.h1;

  // Schema.org FAQPage JSON-LD
  const faqJsonLd = facetDef.faq?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: facetDef.faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      }
    : null;

  return (
    <>
      <SchemaOrgBreadcrumbs items={breadcrumbs} />
      <SchemaOrgItemList
        products={pageSlice.length > 0 ? pageSlice : scopedProducts.slice(0, PAGE_SIZE)}
        categoryTitle={pageTitle}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      <Suspense fallback={<div className="min-h-screen bg-[#111315]" />}>
        <CatalogView
          initialProducts={facetProducts}
          totalCount={facetProducts.length}
          categorySlug={category.slug}
          categoryTitle={`${pageTitle} в Нижнем Новгороде`}
          categoryDescription={facetDef.seoLeadText}
          initialBrand={canonicalBrandParam}
          initialPage={pageNum}
          breadcrumbs={heroBreadcrumbs}
          facetLinks={facetLinks}
          activeFacetSlug={facetDef.facetSlug}
          facetAllCount={allCategoryProducts.length}
        />
      </Suspense>

      <CategoryExpertGuide
        categorySlug={category.slug}
        categoryTitle={category.title}
        brand={brandDisplay}
      />
    </>
  );
}

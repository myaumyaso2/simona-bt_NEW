import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { CatalogView } from '@/components/catalog/CatalogView';
import { getCatalogProducts, getOutletAndShowroomProducts } from '@/lib/products';
import { prisma } from '@/lib/prisma';
import { ProductItem } from '@/types';
import {
  CATALOG_CATEGORIES,
  CATALOG_MACRO_SECTIONS,
  getCategoryBySlug,
  getCategoriesBySection,
  getMacroSectionBySlug,
} from '@/data/catalogCategories';
import { SchemaOrgBreadcrumbs } from '@/components/seo/SchemaOrgBreadcrumbs';
import { SchemaOrgItemList } from '@/components/seo/SchemaOrgItemList';
import { CategoryFacetLinkItem } from '@/components/catalog/CatalogHero';
import { CategoryExpertGuide } from '@/components/catalog/CategoryExpertGuide';
import { getFacetsByCategory } from '@/data/catalogFacets';
import { formatBrandName } from '@/lib/formatters';
import { resolveBrandEntry, getBrandDbVariants } from '@/lib/catalog/brandsRegistry';

const PAGE_SIZE = 24;

interface CategoryPageProps {
  params: {
    category: string;
  };
  searchParams?: {
    brand?: string;
    page?: string;
  };
}

export async function generateStaticParams() {
  return [
    ...CATALOG_CATEGORIES.map((cat) => ({ category: cat.slug })),
    ...CATALOG_MACRO_SECTIONS.map((sec) => ({ category: sec.slug })),
    { category: 'ucenennye-tovary' },
  ];
}

function normalizeCanonicalImage(url: string, siteUrl: string): string {
  const fixed = url.replace(/^https?:\/\/simona-bt\.ru\//i, 'https://www.simona-bt.ru/');
  return fixed.startsWith('http') ? fixed : `${siteUrl}${fixed}`;
}

function parsePageParam(rawPage?: string): number {
  const parsed = parseInt(rawPage || '1', 10);
  return Number.isFinite(parsed) && parsed >= 1 ? parsed : 1;
}

function buildCategoryCanonicalUrl(
  siteUrl: string,
  slug: string,
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
  return `${siteUrl}/catalog/${slug}${queryStr ? `?${queryStr}` : ''}`;
}

export async function generateMetadata({ params, searchParams }: CategoryPageProps): Promise<Metadata> {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.simona-bt.ru').replace(/\/+$/, '');
  const rawBrand = searchParams?.brand?.trim();
  const pageNum = parsePageParam(searchParams?.page);
  const pageTitleSuffix = pageNum > 1 ? ` — страница ${pageNum}` : '';
  const pageDescSuffix = pageNum > 1 ? ` Страница ${pageNum}.` : '';

  const brandReg = rawBrand ? resolveBrandEntry(rawBrand) : null;
  const brandDisplay = rawBrand ? (brandReg ? brandReg.displayName : formatBrandName(rawBrand)) : '';
  const canonicalBrandParam = rawBrand ? (brandReg ? brandReg.dbBrand : rawBrand.toUpperCase()) : '';

  // 1. Dedicated Outlet & Showroom Sale Hub: /catalog/ucenennye-tovary
  if (params.category === 'ucenennye-tovary') {
    const baseTitle = brandDisplay
      ? `Уцененная техника и витринные образцы ${brandDisplay} в Нижнем Новгороде | Салоны СИМОНА`
      : 'Уцененная бытовая техника и витринные образцы в Нижнем Новгороде — распродажа экспозиции | СИМОНА';
    const title = `${baseTitle}${pageTitleSuffix}`;
    const description = brandDisplay
      ? `Купить витринные образцы со смены экспозиции и уцененную бытовую технику ${brandDisplay} со скидкой в салонах «СИМОНА» в Нижнем Новгороде (ул. Белинского 15 и 11/66). Полная предпродажная проверка и официальная гарантия.${pageDescSuffix}`
      : `Распродажа витринных образцов со смены экспозиции салонов на ул. Белинского 15 и 11/66 и уцененной бытовой техники в Нижнем Новгороде. Честное описание состояния каждого прибора, официальная гарантия и аккуратная доставка.${pageDescSuffix}`;
    const canonicalUrl = buildCategoryCanonicalUrl(
      siteUrl,
      'ucenennye-tovary',
      canonicalBrandParam || undefined,
      pageNum
    );

    return {
      title,
      description,
      alternates: { canonical: canonicalUrl },
      openGraph: {
        title,
        description,
        url: canonicalUrl,
      },
    };
  }

  // 2. Macro-Section Hubs: /catalog/vstraivaemaya-tehnika, etc.
  const macroSection = getMacroSectionBySlug(params.category);
  if (macroSection) {
    const sectionCats = getCategoriesBySection(macroSection.slug);
    const dbCats = sectionCats.flatMap((c) => c.dbCategories);
    const brandVariants = rawBrand ? getBrandDbVariants(brandReg || rawBrand) : [];

    let minPriceFormatted = '';
    let matchCount = 0;
    try {
      const whereClause = {
        isActive: true,
        price: { gt: 0 },
        category: { in: dbCats },
        ...(brandVariants.length > 0 ? { brand: { in: brandVariants } } : {}),
      };
      const [minProduct, count] = await Promise.all([
        prisma.product.findFirst({ where: whereClause, orderBy: { price: 'asc' }, select: { price: true } }),
        prisma.product.count({ where: whereClause }),
      ]);
      matchCount = count;
      if (minProduct?.price) {
        minPriceFormatted = `${Math.round(minProduct.price).toLocaleString('ru-RU')} ₽`;
      }
    } catch (err) {
      console.error('Error fetching macro-section metadata stats:', err);
    }

    const pageTitle = brandDisplay ? `${macroSection.title} ${brandDisplay}` : macroSection.title;
    const baseTitle = minPriceFormatted
      ? `${pageTitle} в Нижнем Новгороде — купить по цене от ${minPriceFormatted} | Салоны СИМОНА`
      : `${pageTitle} в Нижнем Новгороде | Салоны бытовой техники СИМОНА`;
    const title = `${baseTitle}${pageTitleSuffix}`;
    const description = brandDisplay
      ? `Купить ${macroSection.title.toLowerCase()} ${brandDisplay} в Нижнем Новгороде${minPriceFormatted ? ` по цене от ${minPriceFormatted}` : ''}. Склад в Нижнем Новгороде (ул. Коминтерна 27), салоны на ул. Белинского 15 и 11/66, официальная гарантия.${pageDescSuffix}`
      : `${macroSection.description}${minPriceFormatted ? ` Цены от ${minPriceFormatted}.` : ''} Официальная гарантия и аккуратная доставка собственной службой.${pageDescSuffix}`;
    const canonicalUrl = buildCategoryCanonicalUrl(
      siteUrl,
      macroSection.slug,
      canonicalBrandParam || undefined,
      pageNum
    );

    return {
      title,
      description,
      alternates: { canonical: canonicalUrl },
      ...(rawBrand && matchCount === 0 ? { robots: { index: false, follow: true } } : {}),
      openGraph: {
        title,
        description,
        url: canonicalUrl,
      },
    };
  }

  // 3. Leaf Catalog Category: /catalog/[category]
  const category = getCategoryBySlug(params.category);
  if (!category) {
    return {
      title: 'Раздел не найден — 404 | СИМОНА Нижний Новгород',
      robots: { index: false, follow: true },
    };
  }

  const brandVariants = rawBrand ? getBrandDbVariants(brandReg || rawBrand) : [];
  let minPriceFormatted = '';
  let matchCount = 0;
  try {
    const whereClause = {
      isActive: true,
      price: { gt: 0 },
      category: { in: category.dbCategories },
      ...(brandVariants.length > 0 ? { brand: { in: brandVariants } } : {}),
    };
    const [minProduct, count] = await Promise.all([
      prisma.product.findFirst({
        where: whereClause,
        orderBy: { price: 'asc' },
        select: { price: true },
      }),
      prisma.product.count({ where: whereClause }),
    ]);
    matchCount = count;
    if (minProduct?.price) {
      minPriceFormatted = `${Math.round(minProduct.price).toLocaleString('ru-RU')} ₽`;
    }
  } catch (err) {
    console.error('Error fetching minPrice for category metadata:', err);
  }

  const baseCategoryName = category.slug === 'holodilniki' ? 'Холодильники' : (category.menuTitle || category.title);
  let pageTitle = category.title;
  let baseTitle = '';
  let pageDescription = '';

  if (brandDisplay) {
    pageTitle = `${baseCategoryName} ${brandDisplay}`;
    baseTitle = minPriceFormatted
      ? `${pageTitle} в Нижнем Новгороде — купить по цене от ${minPriceFormatted} | Салон СИМОНА`
      : `${pageTitle} в Нижнем Новгороде — купить в салоне СИМОНА | Официальная гарантия`;
    pageDescription = `Купить ${baseCategoryName.toLowerCase()} ${brandDisplay} в салоне «СИМОНА» в Нижнем Новгороде${minPriceFormatted ? ` по цене от ${minPriceFormatted}` : ''}. Официальная гарантия, складской запас (ул. Коминтерна 27), экспозиция на ул. Белинского 15 и 11/66.${pageDescSuffix}`;
  } else {
    pageTitle = category.title;
    baseTitle = minPriceFormatted
      ? `Купить ${category.title.toLowerCase()} в Нижнем Новгороде — цены от ${minPriceFormatted} в салоне СИМОНА | Официальная гарантия`
      : `Купить ${category.title.toLowerCase()} в Нижнем Новгороде | Салоны техники СИМОНА`;
    pageDescription = `${category.heroSubtitle} Проверенные бренды: ${category.featuredBrands.slice(0, 8).map((b) => formatBrandName(b)).join(', ')}. Экспозиция в салонах на ул. Белинского 15 и 11/66, наличие на центральном складе.${pageDescSuffix}`;
  }

  const title = `${baseTitle}${pageTitleSuffix}`;
  const canonicalUrl = buildCategoryCanonicalUrl(
    siteUrl,
    category.slug,
    canonicalBrandParam || undefined,
    pageNum
  );

  return {
    title,
    description: pageDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    ...(rawBrand && matchCount === 0 ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title,
      description: pageDescription,
      url: canonicalUrl,
      images: [
        {
          url: normalizeCanonicalImage(category.image, siteUrl),
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
    },
  };
}

export const dynamic = 'force-dynamic';

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const rawBrand = searchParams?.brand?.trim();
  const pageNum = parsePageParam(searchParams?.page);
  const brandReg = rawBrand ? resolveBrandEntry(rawBrand) : null;
  const brandDisplay = rawBrand ? (brandReg ? brandReg.displayName : formatBrandName(rawBrand)) : undefined;
  const canonicalBrandParam = rawBrand ? (brandReg ? brandReg.dbBrand : rawBrand) : undefined;
  const activeBrandUpper = canonicalBrandParam ? canonicalBrandParam.toUpperCase() : undefined;

  // Legacy safety redirect if /catalog/duhovye-shkafy is ever hit directly
  if (params.category === 'duhovye-shkafy') {
    permanentRedirect(
      `/catalog/vstraivaemye-duhovye-shkafy${canonicalBrandParam ? `?brand=${encodeURIComponent(canonicalBrandParam)}` : ''}`
    );
  }

  // 1. Outlet & Showroom Sale Hub: /catalog/ucenennye-tovary
  if (params.category === 'ucenennye-tovary') {
    const { products, total } = await getOutletAndShowroomProducts();
    const pageTitle = brandDisplay
      ? `Уцененная техника и витринные образцы ${brandDisplay}`
      : 'Уцененная бытовая техника и витринные образцы';

    const breadcrumbs = [
      { name: 'Главная', url: '/' },
      { name: 'Каталог', url: '/catalog' },
      { name: 'Уценка и витринные образцы', url: '/catalog/ucenennye-tovary' },
      ...(brandDisplay && canonicalBrandParam
        ? [{ name: brandDisplay, url: `/catalog/ucenennye-tovary?brand=${encodeURIComponent(canonicalBrandParam)}` }]
        : []),
    ];

    const brandVariantsUpper = canonicalBrandParam
      ? new Set(getBrandDbVariants(brandReg || canonicalBrandParam).map((v) => v.toUpperCase()))
      : null;
    const scopedProducts = brandVariantsUpper
      ? products.filter((p) => brandVariantsUpper.has((p.brand || '').trim().toUpperCase()))
      : products;
    const pageSlice = scopedProducts.slice((pageNum - 1) * PAGE_SIZE, pageNum * PAGE_SIZE);
    const outletDesc =
      'Оригинальные приборы со смены экспозиции салонов на ул. Белинского 15 и 11/66 и товары с уценкой упаковки. Каждый прибор проходит проверку и сопровождается официальной гарантией.';

    return (
      <>
        <SchemaOrgBreadcrumbs items={breadcrumbs} />
        <SchemaOrgItemList
          products={pageSlice.length > 0 ? pageSlice : scopedProducts.slice(0, PAGE_SIZE)}
          categoryTitle={pageTitle}
        />
        <Suspense fallback={<div className="min-h-screen bg-[#111315]" />}>
          <CatalogView
            initialProducts={products}
            totalCount={total}
            categorySlug="ucenennye-tovary"
            categoryTitle={pageTitle}
            categoryDescription={outletDesc}
            initialBrand={canonicalBrandParam}
            initialPage={pageNum}
          />
        </Suspense>
      </>
    );
  }

  // 2. Macro-Section Hub: /catalog/vstraivaemaya-tehnika, etc.
  const macroSection = getMacroSectionBySlug(params.category);
  if (macroSection) {
    const sectionCategories = getCategoriesBySection(macroSection.slug);
    const dbCategories = sectionCategories.flatMap((c) => c.dbCategories);
    const { products, total } = await getCatalogProducts({
      categories: dbCategories,
      categorySlugs: sectionCategories.map((c) => c.slug),
      includeOutlet: true,
      limit: 5000,
    });

    const pageTitle = brandDisplay ? `${macroSection.title} ${brandDisplay}` : macroSection.title;
    const breadcrumbs = [
      { name: 'Главная', url: '/' },
      { name: 'Каталог', url: '/catalog' },
      { name: macroSection.title, url: `/catalog/${macroSection.slug}` },
      ...(brandDisplay && canonicalBrandParam
        ? [{ name: brandDisplay, url: `/catalog/${macroSection.slug}?brand=${encodeURIComponent(canonicalBrandParam)}` }]
        : []),
    ];

    const brandVariantsUpper = canonicalBrandParam
      ? new Set(getBrandDbVariants(brandReg || canonicalBrandParam).map((v) => v.toUpperCase()))
      : null;
    const scopedProducts = brandVariantsUpper
      ? products.filter((p) => brandVariantsUpper.has((p.brand || '').trim().toUpperCase()))
      : products;
    const pageSlice = scopedProducts.slice((pageNum - 1) * PAGE_SIZE, pageNum * PAGE_SIZE);

    const subcategoryLinks = sectionCategories.map((subCat) => ({
      label: subCat.menuTitle || subCat.title,
      href: canonicalBrandParam
        ? `/catalog/${subCat.slug}?brand=${encodeURIComponent(canonicalBrandParam)}`
        : `/catalog/${subCat.slug}`,
    }));

    return (
      <>
        <SchemaOrgBreadcrumbs items={breadcrumbs} />
        <SchemaOrgItemList
          products={pageSlice.length > 0 ? pageSlice : scopedProducts.slice(0, PAGE_SIZE)}
          categoryTitle={pageTitle}
        />
        <Suspense fallback={<div className="min-h-screen bg-[#111315]" />}>
          <CatalogView
            initialProducts={products}
            totalCount={total}
            categorySlug={macroSection.slug}
            categoryTitle={pageTitle}
            categoryDescription={macroSection.description}
            initialBrand={canonicalBrandParam}
            initialPage={pageNum}
            subcategoryLinks={subcategoryLinks}
          />
        </Suspense>
      </>
    );
  }

  // 3. Leaf Catalog Category: /catalog/[category]
  const category = getCategoryBySlug(params.category);

  if (!category) {
    notFound();
  }

  const { products, total } = await getCatalogProducts({
    categories: category.dbCategories,
    categorySlug: category.slug,
    includeOutlet: true,
    limit: 2000,
  });

  const baseCategoryName = category.slug === 'holodilniki' ? 'Холодильники' : (category.menuTitle || category.title);
  const pageTitle = brandDisplay ? `${baseCategoryName} ${brandDisplay}` : category.title;

  const breadcrumbs = [
    { name: 'Главная', url: '/' },
    { name: 'Каталог', url: '/catalog' },
    { name: category.sectionTitle, url: `/catalog/${category.sectionSlug}` },
    { name: category.title, url: `/catalog/${category.slug}` },
    ...(brandDisplay && canonicalBrandParam
      ? [{ name: brandDisplay, url: `/catalog/${category.slug}?brand=${encodeURIComponent(canonicalBrandParam)}` }]
      : []),
  ];

  const brandVariantsUpper = canonicalBrandParam
    ? new Set(getBrandDbVariants(brandReg || canonicalBrandParam).map((v) => v.toUpperCase()))
    : null;
  const scopedProducts = brandVariantsUpper
    ? products.filter((p) => brandVariantsUpper.has((p.brand || '').trim().toUpperCase()))
    : products;
  const pageSlice = scopedProducts.slice((pageNum - 1) * PAGE_SIZE, pageNum * PAGE_SIZE);
  const facetLinks = getFacetsByCategory(category.slug)
    .map((f) => {
      const matchCount = scopedProducts.filter((p: ProductItem) => f.filter(p)).length;
      const facetHref = canonicalBrandParam
        ? `/catalog/${category.slug}/${f.facetSlug}?brand=${encodeURIComponent(canonicalBrandParam)}`
        : `/catalog/${category.slug}/${f.facetSlug}`;
      return {
        shortTitle: f.shortTitle,
        facetSlug: f.facetSlug,
        count: matchCount,
        href: facetHref,
      };
    })
    .filter((f) => f.count >= 3);

  return (
    <>
      <SchemaOrgBreadcrumbs items={breadcrumbs} />
      <SchemaOrgItemList
        products={pageSlice.length > 0 ? pageSlice : scopedProducts.slice(0, PAGE_SIZE)}
        categoryTitle={pageTitle}
      />
      <Suspense fallback={<div className="min-h-screen bg-[#111315]" />}>
        <CatalogView
          initialProducts={products}
          totalCount={total}
          categorySlug={category.slug}
          categoryTitle={pageTitle}
          categoryDescription={category.heroSubtitle}
          initialBrand={canonicalBrandParam}
          initialPage={pageNum}
          facetLinks={facetLinks}
          facetAllCount={scopedProducts.length}
          breadcrumbs={[
            { name: 'Каталог', url: '/catalog' },
            { name: category.sectionTitle, url: `/catalog/${category.sectionSlug}` },
            { name: category.title, ...(brandDisplay ? { url: `/catalog/${category.slug}` } : {}) },
            ...(brandDisplay ? [{ name: brandDisplay }] : []),
          ]}
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

import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { permanentRedirect } from 'next/navigation';
import { CatalogHubView } from '@/components/catalog/CatalogHubView';
import { CatalogView } from '@/components/catalog/CatalogView';
import { SchemaOrgBreadcrumbs } from '@/components/seo/SchemaOrgBreadcrumbs';
import {
  CATALOG_CATEGORIES,
  getCategoryBySlug,
  getMacroSectionBySlug,
} from '@/data/catalogCategories';
import { searchCatalogProducts } from '@/lib/products';
import { brandNameToSlug, resolveBrandEntry } from '@/lib/catalog/brandsRegistry';

interface CatalogPageProps {
  searchParams?: {
    q?: string;
    category?: string;
    section?: string;
    brand?: string;
    presence?: string;
  };
}

export async function generateMetadata({ searchParams }: CatalogPageProps): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.simona-bt.ru';

  if (searchParams?.q && searchParams.q.trim() !== '') {
    const cleanQuery = searchParams.q.trim();
    return {
      title: `Поиск «${cleanQuery}» — каталог техники | СИМОНА Нижний Новгород`,
      robots: { index: false, follow: true },
      alternates: { canonical: `${siteUrl}/catalog` },
    };
  }

  return {
    title: 'Каталог бытовой техники в Нижнем Новгороде | СИМОНА — 8 000+ моделей',
    description:
      'Официальный каталог бытовой техники и кухонной встройки: Miele, Asko, Liebherr, Smeg, Körting, Omoikiri, Bosch, Midea. Экспозиция в салонах на ул. Белинского 15 и 11/66, склад в Нижнем Новгороде.',
    alternates: {
      canonical: `${siteUrl}/catalog`,
    },
    openGraph: {
      title: 'Каталог техники | СИМОНА — Салоны и интернет-магазин',
      description:
        '8 000+ моделей бытовой техники от проверенных мировых брендов. Экспозиция в салонах на ул. Белинского, склад в Нижнем Новгороде.',
      url: `${siteUrl}/catalog`,
    },
  };
}

export const dynamic = 'force-dynamic';

function resolveCatalogTargetSlug(rawSlug: string): string | null {
  const clean = rawSlug.trim().toLowerCase();
  if (clean === 'duhovye-shkafy') return 'vstraivaemye-duhovye-shkafy';
  if (clean === 'ucenennye-tovary' || clean === 'ucenennye_tovary' || clean === 'rasprodazha') {
    return 'ucenennye-tovary';
  }

  const directCat = getCategoryBySlug(clean);
  if (directCat) return directCat.slug;

  const macroSec = getMacroSectionBySlug(clean);
  if (macroSec) return macroSec.slug;

  const matchCat = CATALOG_CATEGORIES.find(
    (c) =>
      c.title.toLowerCase() === clean ||
      c.menuTitle.toLowerCase() === clean ||
      c.dbCategories.some((db) => db.toLowerCase() === clean)
  );
  if (matchCat) return matchCat.slug;

  return null;
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  // 0. Full-text Search View with Faceted Filtering: /catalog?q=...
  if (searchParams?.q && searchParams.q.trim() !== '') {
    const cleanQuery = searchParams.q.trim();
    const { products, total } = await searchCatalogProducts(cleanQuery, 1500);

    const breadcrumbs = [
      { name: 'Главная', url: '/' },
      { name: 'Каталог', url: '/catalog' },
      {
        name: `Поиск: «${cleanQuery}»`,
        url: `/catalog?q=${encodeURIComponent(cleanQuery)}`,
      },
    ];

    return (
      <>
        <SchemaOrgBreadcrumbs items={breadcrumbs} />
        <Suspense fallback={<div className="min-h-screen bg-[#111315]" />}>
          <CatalogView
            initialProducts={products}
            totalCount={total}
            searchQuery={cleanQuery}
            categoryTitle={`Результаты поиска: «${cleanQuery}»`}
            categoryDescription={`Найдено ${total} приборов по запросу «${cleanQuery}» в каталоге бытовой техники «СИМОНА». Используйте вкладки физического наличия и фильтры слева для точного отбора.`}
            initialBrand={searchParams.brand}
          />
        </Suspense>
      </>
    );
  }

  // 1. Discount / Outlet presence query -> Permanent 308 redirect to clean SEO hub /catalog/ucenennye-tovary
  if (searchParams?.presence === 'discount') {
    const brandReg = searchParams.brand ? resolveBrandEntry(searchParams.brand) : null;
    const brandParam = searchParams.brand
      ? `?brand=${encodeURIComponent(brandReg ? brandReg.dbBrand : searchParams.brand.toUpperCase())}`
      : '';
    permanentRedirect(`/catalog/ucenennye-tovary${brandParam}`);
  }

  // 2. Category (or Section) + Brand -> Permanent 308 redirect to /catalog/[slug]?brand=[BRAND]
  const rawCatOrSection = searchParams?.category || searchParams?.section;
  if (searchParams?.brand && rawCatOrSection) {
    const resolvedSlug = resolveCatalogTargetSlug(rawCatOrSection);
    const brandReg = resolveBrandEntry(searchParams.brand);
    const canonicalBrand = brandReg ? brandReg.dbBrand : searchParams.brand.trim().toUpperCase();
    if (resolvedSlug) {
      permanentRedirect(`/catalog/${resolvedSlug}?brand=${encodeURIComponent(canonicalBrand)}`);
    }
    const bSlug = brandNameToSlug(searchParams.brand);
    permanentRedirect(bSlug ? `/brands/${bSlug}` : '/brands');
  }

  // 3. Dedicated Brand query /catalog?brand=X -> Permanent 308 redirect to clean ЧПУ /brands/[slug]
  if (searchParams?.brand) {
    const bSlug = brandNameToSlug(searchParams.brand);
    permanentRedirect(bSlug ? `/brands/${bSlug}` : '/brands');
  }

  // 4. Category or Section query without brand -> Permanent 308 redirect to clean ЧПУ /catalog/[slug]
  if (rawCatOrSection) {
    const resolvedSlug = resolveCatalogTargetSlug(rawCatOrSection);
    if (resolvedSlug) {
      permanentRedirect(`/catalog/${resolvedSlug}`);
    }
    permanentRedirect('/catalog');
  }

  const breadcrumbs = [
    { name: 'Главная', url: '/' },
    { name: 'Каталог', url: '/catalog' },
  ];

  return (
    <>
      <SchemaOrgBreadcrumbs items={breadcrumbs} />
      <Suspense fallback={<div className="min-h-screen bg-[#111315]" />}>
        <CatalogHubView />
      </Suspense>
    </>
  );
}

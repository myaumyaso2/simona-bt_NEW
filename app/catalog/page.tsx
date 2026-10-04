import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { CatalogHubView } from '@/components/catalog/CatalogHubView';
import { CatalogView } from '@/components/catalog/CatalogView';
import { SchemaOrgBreadcrumbs } from '@/components/seo/SchemaOrgBreadcrumbs';
import {
  CATALOG_CATEGORIES,
  getCategoriesBySection,
  getCategoryBySlug,
} from '@/data/catalogCategories';
import { getCatalogProducts } from '@/lib/products';

export const metadata: Metadata = {
  title: 'Каталог бытовой техники в Нижнем Новгороде | СИМОНА — 8 000+ моделей',
  description:
    'Официальный каталог бытовой техники и кухонной встройки: Miele, ASKO, Liebherr, SMEG, Körting, OMOIKIRI, Midea. Экспозиция в салонах на ул. Белинского 15 и 11/66, тест-драйв на «Активной кухне» в Нижнем Новгороде.',
  openGraph: {
    title: 'Каталог техники | СИМОНА — Салоны и интернет-магазин',
    description:
      '8 000+ моделей бытовой техники от проверенных мировых брендов. Экспозиция в салонах на ул. Белинского, склад в Нижнем Новгороде.',
    url: 'https://simona-bt.ru/catalog',
  },
};

export const dynamic = 'force-dynamic';

interface CatalogPageProps {
  searchParams?: {
    category?: string;
    section?: string;
    brand?: string;
  };
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  // 1. Dedicated Brand Catalog View: /catalog?brand=BOSCH (supports optional &category=slug)
  if (searchParams?.brand) {
    const brandUpper = searchParams.brand.toUpperCase();
    const { products, total } = await getCatalogProducts({
      brand: searchParams.brand,
      limit: 1500,
    });

    const breadcrumbs = [
      { name: 'Главная', url: '/' },
      { name: 'Каталог', url: '/catalog' },
      { name: `Техника ${brandUpper}`, url: `/catalog?brand=${encodeURIComponent(searchParams.brand)}` },
    ];

    return (
      <>
        <SchemaOrgBreadcrumbs items={breadcrumbs} />
        <Suspense fallback={<div className="min-h-screen bg-[#111315]" />}>
          <CatalogView
            initialProducts={products}
            totalCount={total}
            categoryTitle={`Техника ${brandUpper}`}
            categoryDescription={`Официальная коллекция бытовой техники ${brandUpper} в салонах и на центральном складе СИМОНА.`}
            initialBrand={searchParams.brand}
            initialCategorySlug={searchParams.category}
          />
        </Suspense>
      </>
    );
  }

  // 2. Backward compatibility: If redirected or linked with ?category=slug (without brand), redirect to clean URL /catalog/[category]
  if (searchParams?.category) {
    const directCat = getCategoryBySlug(searchParams.category);
    if (directCat) {
      redirect(`/catalog/${directCat.slug}`);
    }
    const matchCat = CATALOG_CATEGORIES.find(
      (c) =>
        c.title.toLowerCase() === searchParams.category?.toLowerCase() ||
        c.menuTitle.toLowerCase() === searchParams.category?.toLowerCase() ||
        c.dbCategories.some((db) => db.toLowerCase() === searchParams.category?.toLowerCase())
    );
    if (matchCat) {
      redirect(`/catalog/${matchCat.slug}`);
    }
    redirect(`/catalog/${encodeURIComponent(searchParams.category)}`);
  }

  // Section Filter View: /catalog?section=vstraivaemaya-tehnika
  if (searchParams?.section) {
    const sectionCategories = getCategoriesBySection(searchParams.section);
    if (sectionCategories.length > 0) {
      const sectionTitle = sectionCategories[0].sectionTitle;
      const { products, total } = await getCatalogProducts({
        categories: sectionCategories.flatMap((c) => c.dbCategories),
        limit: 48,
      });

      const breadcrumbs = [
        { name: 'Главная', url: '/' },
        { name: 'Каталог', url: '/catalog' },
        { name: sectionTitle, url: `/catalog?section=${searchParams.section}` },
      ];

      return (
        <>
          <SchemaOrgBreadcrumbs items={breadcrumbs} />
          <Suspense fallback={<div className="min-h-screen bg-[#111315]" />}>
            <CatalogView
              initialProducts={products}
              totalCount={total}
              categorySlug={searchParams.section}
              categoryTitle={sectionTitle}
              categoryDescription={`Полная коллекция приборов раздела «${sectionTitle}» в салонах и на центральном складе СИМОНА.`}
            />
          </Suspense>
        </>
      );
    }
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

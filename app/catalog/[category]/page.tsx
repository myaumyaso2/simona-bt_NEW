import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CatalogView } from '@/components/catalog/CatalogView';
import { getCatalogProducts } from '@/lib/products';
import { CATALOG_CATEGORIES, getCategoryBySlug } from '@/data/catalogCategories';
import { SchemaOrgBreadcrumbs } from '@/components/seo/SchemaOrgBreadcrumbs';

interface CategoryPageProps {
  params: {
    category: string;
  };
  searchParams?: {
    brand?: string;
  };
}

export async function generateStaticParams() {
  return CATALOG_CATEGORIES.map((cat) => ({
    category: cat.slug,
  }));
}

export async function generateMetadata({ params, searchParams }: CategoryPageProps): Promise<Metadata> {
  const category = getCategoryBySlug(params.category);
  if (!category) {
    return {
      title: 'Каталог техники | СИМОНА — Премиальная бытовая техника',
    };
  }

  const brand = searchParams?.brand;
  let pageTitle = category.title;
  let pageDescription = `${category.heroSubtitle} Авторизованные поставки европейских брендов: ${category.featuredBrands.join(', ')}. Экспозиция в салонах на ул. Белинского 15 и 11/66, тест-драйв на «Активной кухне».`;

  if (brand) {
    const baseCategoryName = category.slug === 'holodilniki' ? 'Холодильники' : (category.menuTitle || category.title);
    pageTitle = `${baseCategoryName} ${brand}`;
    pageDescription = `Купить ${baseCategoryName.toLowerCase()} ${brand} в официальном салоне СИМОНА в Нижнем Новгороде. Авторизованная гарантия производителя, складской резерв и тест-драйв в шоурумах на ул. Белинского.`;
  }

  const title = `${pageTitle} | Каталог техники СИМОНА — Нижний Новгород`;

  return {
    title,
    description: pageDescription,
    openGraph: {
      title,
      description: pageDescription,
      url: `https://simona-bt.ru/catalog/${category.slug}${brand ? `?brand=${encodeURIComponent(brand)}` : ''}`,
      images: [
        {
          url: category.image.startsWith('http') ? category.image : `https://simona-bt.ru${category.image}`,
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
  const category = getCategoryBySlug(params.category);

  if (!category) {
    notFound();
  }

  const brand = searchParams?.brand;

  // Fetch products matching database category names
  const { products, total } = await getCatalogProducts({
    categories: category.dbCategories,
    limit: 1500,
  });

  const baseCategoryName = category.slug === 'holodilniki' ? 'Холодильники' : (category.menuTitle || category.title);
  const pageTitle = brand ? `${baseCategoryName} ${brand}` : category.title;

  const breadcrumbs = [
    { name: 'Главная', url: '/' },
    { name: 'Каталог', url: '/catalog' },
    { name: category.title, url: `/catalog/${category.slug}` },
    ...(brand ? [{ name: brand, url: `/catalog/${category.slug}?brand=${encodeURIComponent(brand)}` }] : []),
  ];

  return (
    <>
      <SchemaOrgBreadcrumbs items={breadcrumbs} />
      <Suspense fallback={<div className="min-h-screen bg-[#111315]" />}>
        <CatalogView
          initialProducts={products}
          totalCount={total}
          categorySlug={category.slug}
          categoryTitle={pageTitle}
          categoryDescription={category.heroSubtitle}
          initialBrand={brand}
        />
      </Suspense>
    </>
  );
}

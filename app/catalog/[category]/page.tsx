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
}

export async function generateStaticParams() {
  return CATALOG_CATEGORIES.map((cat) => ({
    category: cat.slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = getCategoryBySlug(params.category);
  if (!category) {
    return {
      title: 'Каталог техники | СИМОНА — Премиальная бытовая техника',
    };
  }

  const title = `${category.title} | Каталог техники СИМОНА — Нижний Новгород`;
  const description = `${category.heroSubtitle} Авторизованные поставки европейских брендов: ${category.featuredBrands.join(', ')}. Экспозиция в салонах на ул. Белинского 15 и 11/66, тест-драйв на «Активной кухне».`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://simona-bt.ru/catalog/${category.slug}`,
      images: [
        {
          url: category.image.startsWith('http') ? category.image : `https://simona-bt.ru${category.image}`,
          width: 1200,
          height: 630,
          alt: category.title,
        },
      ],
    },
  };
}

export const dynamic = 'force-dynamic';

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = getCategoryBySlug(params.category);

  if (!category) {
    notFound();
  }

  // Fetch products matching database category names
  const { products, total } = await getCatalogProducts({
    categories: category.dbCategories,
    limit: 1500,
  });

  const breadcrumbs = [
    { name: 'Главная', url: '/' },
    { name: 'Каталог', url: '/catalog' },
    { name: category.title, url: `/catalog/${category.slug}` },
  ];

  return (
    <>
      <SchemaOrgBreadcrumbs items={breadcrumbs} />
      <Suspense fallback={<div className="min-h-screen bg-[#111315]" />}>
        <CatalogView
          initialProducts={products}
          totalCount={total}
          categorySlug={category.slug}
          categoryTitle={category.title}
          categoryDescription={category.heroSubtitle}
        />
      </Suspense>
    </>
  );
}

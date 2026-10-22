import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CatalogView } from '@/components/catalog/CatalogView';
import { getCatalogProducts } from '@/lib/products';
import { prisma } from '@/lib/prisma';
import { CATALOG_CATEGORIES, getCategoryBySlug } from '@/data/catalogCategories';
import { SchemaOrgBreadcrumbs } from '@/components/seo/SchemaOrgBreadcrumbs';
import { SchemaOrgItemList } from '@/components/seo/SchemaOrgItemList';
import { CategorySeoBlock } from '@/components/catalog/CategorySeoBlock';

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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.simona-bt.ru';
  const brand = searchParams?.brand;

  let minPriceFormatted = '';
  try {
    const minProduct = await prisma.product.findFirst({
      where: {
        isActive: true,
        price: { gt: 0 },
        category: { in: category.dbCategories },
        ...(brand
          ? {
              brand: {
                in: [brand, brand.toUpperCase(), brand.toLowerCase()],
              },
            }
          : {}),
      },
      orderBy: { price: 'asc' },
      select: { price: true },
    });
    if (minProduct?.price) {
      minPriceFormatted = `${minProduct.price.toLocaleString('ru-RU')} ₽`;
    }
  } catch (err) {
    console.error('Error fetching minPrice for category metadata:', err);
  }

  const baseCategoryName = category.slug === 'holodilniki' ? 'Холодильники' : (category.menuTitle || category.title);
  let pageTitle = category.title;
  let title = '';
  let pageDescription = '';

  if (brand) {
    pageTitle = `${baseCategoryName} ${brand}`;
    title = minPriceFormatted
      ? `${pageTitle} в Нижнем Новгороде — купить по цене от ${minPriceFormatted} | Салон СИМОНА`
      : `${pageTitle} в Нижнем Новгороде — купить в официальном салоне СИМОНА | Официальная гарантия`;
    pageDescription = `Купить ${baseCategoryName.toLowerCase()} ${brand} в официальном салоне СИМОНА в Нижнем Новгороде${minPriceFormatted ? ` по цене от ${minPriceFormatted}` : ''}. Авторизованная гарантия производителя, складской резерв (ул. Коминтерна 27), экспозиция на ул. Белинского 15 и тест-драйв на «Активной кухне».`;
  } else {
    pageTitle = category.title;
    title = minPriceFormatted
      ? `Купить ${category.title.toLowerCase()} в Нижнем Новгороде — цены от ${minPriceFormatted} в салоне СИМОНА | Официальная гарантия`
      : `Купить ${category.title.toLowerCase()} в Нижнем Новгороде | Салоны техники СИМОНА`;
    pageDescription = `${category.heroSubtitle} Авторизованные поставки европейских брендов: ${category.featuredBrands.join(', ')}. Экспозиция в салонах на ул. Белинского 15 и 11/66, наличие на центральном складе, тест-драйв на «Активной кухне».`;
  }

  const canonicalUrl = `${siteUrl}/catalog/${category.slug}${brand ? `?brand=${encodeURIComponent(brand)}` : ''}`;

  return {
    title,
    description: pageDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description: pageDescription,
      url: canonicalUrl,
      images: [
        {
          url: category.image.startsWith('http') ? category.image : `${siteUrl}${category.image}`,
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
    categorySlug: category.slug,
    includeOutlet: true,
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
      <SchemaOrgItemList products={products} categoryTitle={pageTitle} />
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
      <CategorySeoBlock categoryTitle={category.title} brand={brand} />
    </>
  );
}

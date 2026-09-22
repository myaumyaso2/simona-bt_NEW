import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/lib/products';
import { ProductDetailView } from '@/components/product/ProductDetailView';
import { SchemaOrgProduct } from '@/components/seo/SchemaOrgProduct';
import { SchemaOrgBreadcrumbs } from '@/components/seo/SchemaOrgBreadcrumbs';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return {
      title: 'Товар не найден | СИМОНА',
    };
  }

  const firstImage = product.images && product.images.length > 0 ? product.images[0] : '';

  return {
    title: `${product.name} — купить в Нижнем Новгороде | СИМОНА`,
    description: `${product.description.slice(0, 160)}. Официальная гарантия, экспозиция в салоне «СИМОНА» на ул. Белинского, 15, доставка по Нижнему Новгороду.`,
    openGraph: {
      title: `${product.name} | СИМОНА`,
      description: product.description.slice(0, 200),
      images: firstImage ? [firstImage] : [],
    },
  };
}

export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const breadcrumbs = [
    { name: 'Главная', url: '/' },
    { name: 'Каталог', url: '/catalog' },
    { name: product.category, url: '/catalog' },
    { name: product.name, url: `/product/${product.slug}` },
  ];

  return (
    <>
      <SchemaOrgProduct product={product} />
      <SchemaOrgBreadcrumbs items={breadcrumbs} />
      <ProductDetailView product={product} />
    </>
  );
}

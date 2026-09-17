import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CATALOG_PRODUCTS } from '@/data/catalogData';
import { ProductDetailView } from '@/components/product/ProductDetailView';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product =
    CATALOG_PRODUCTS.find((p) => p.slug === params.slug) ||
    CATALOG_PRODUCTS[0];

  if (!product) {
    return {
      title: 'Товар не найден | СИМОНА',
    };
  }

  return {
    title: `${product.name} — купить в Нижнем Новгороде | СИМОНА`,
    description: `${product.description} Доставка по Нижнему Новгороду в белых перчатках, официальная гарантия, экспозиция в салоне на ул. Белинского, 15.`,
    openGraph: {
      title: `${product.name} | СИМОНА`,
      description: product.description,
      images: product.images && product.images.length > 0 ? [product.images[0]] : [],
    },
  };
}

export async function generateStaticParams() {
  return CATALOG_PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

export const dynamic = 'force-dynamic';

export default function ProductPage({ params }: ProductPageProps) {
  const product =
    CATALOG_PRODUCTS.find((p) => p.slug === params.slug) ||
    CATALOG_PRODUCTS.find((p) => p.slug.includes(params.slug)) ||
    CATALOG_PRODUCTS[0];

  if (!product) {
    notFound();
  }

  return <ProductDetailView product={product} />;
}

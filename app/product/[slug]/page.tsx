import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/lib/products';
import { ProductDetailView } from '@/components/product/ProductDetailView';
import { SchemaOrgProduct } from '@/components/seo/SchemaOrgProduct';
import { SchemaOrgBreadcrumbs } from '@/components/seo/SchemaOrgBreadcrumbs';
import { formatProductName } from '@/lib/catalog/productTitle';
import { getCategoryBySlug, getCategorySlugByName } from '@/data/catalogCategories';
import { resolveBrandEntry } from '@/lib/catalog/brandsRegistry';
import { formatBrandName } from '@/lib/formatters';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

function normalizeProductImageUrl(rawImg: string, siteUrl: string): string {
  const trimmed = rawImg.trim();
  if (!trimmed) return '';
  const canonicalHost = trimmed.replace(/^https?:\/\/simona-bt\.ru\//i, 'https://www.simona-bt.ru/');
  return canonicalHost.startsWith('http')
    ? canonicalHost
    : `${siteUrl}${canonicalHost.startsWith('/') ? '' : '/'}${canonicalHost}`;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return {
      title: 'Товар не найден | СИМОНА',
      robots: { index: false, follow: true },
    };
  }

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.simona-bt.ru').replace(/\/+$/, '');
  const canonicalUrl = `${siteUrl}/product/${product.slug}`;
  const formattedTitle = formatProductName(product);

  const rawColor =
    product.color?.trim() ||
    product.features?.find((f) => f.label.trim().toLowerCase() === 'цвет')?.value?.trim() ||
    '';
  const colorSuffix =
    rawColor && !formattedTitle.toLowerCase().includes(rawColor.toLowerCase())
      ? ` (${rawColor.toLowerCase()})`
      : '';

  const priceSuffix =
    product.price > 0 ? ` по цене ${Math.round(product.price).toLocaleString('ru-RU')} ₽` : '';

  const cleanDesc = (product.description || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const title = `${formattedTitle}${colorSuffix} — купить${priceSuffix} в Нижнем Новгороде | СИМОНА`;

  const description =
    cleanDesc.length > 15
      ? `${formattedTitle}${priceSuffix}: ${cleanDesc.slice(0, 125).replace(/[.,;:\s]+$/, '')}. Официальная гарантия, салоны «СИМОНА» на ул. Белинского 15 и 11/66, аккуратная доставка.`
      : `Купить ${formattedTitle}${colorSuffix}${priceSuffix} в сети салонов бытовой техники «СИМОНА» в Нижнем Новгороде (ул. Белинского 15 и 11/66, склад на ул. Коминтерна 27). Официальная гарантия и аккуратная доставка собственной службой.`;

  const firstImage =
    product.images && product.images.length > 0
      ? normalizeProductImageUrl(product.images[0], siteUrl)
      : '';

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${formattedTitle}${priceSuffix} | СИМОНА`,
      description,
      url: canonicalUrl,
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

  const formattedTitle = formatProductName(product);
  const categorySlug = getCategorySlugByName(product.category);
  const categoryObj = getCategoryBySlug(categorySlug);
  const categoryDisplayName = categoryObj ? categoryObj.title : product.category;

  const brandReg = resolveBrandEntry(product.brand);
  const brandDisplay = product.brand && product.brand.toUpperCase() !== 'СИМОНА'
    ? (brandReg ? brandReg.displayName : formatBrandName(product.brand))
    : '';
  const canonicalBrandParam = brandReg ? brandReg.dbBrand : (product.brand || '').trim().toUpperCase();

  const breadcrumbs = [
    { name: 'Главная', url: '/' },
    { name: 'Каталог', url: '/catalog' },
    { name: categoryDisplayName, url: `/catalog/${categorySlug}` },
    ...(brandDisplay && canonicalBrandParam
      ? [
          {
            name: `${categoryObj?.menuTitle || categoryDisplayName} ${brandDisplay}`,
            url: `/catalog/${categorySlug}?brand=${encodeURIComponent(canonicalBrandParam)}`,
          },
        ]
      : []),
    { name: formattedTitle, url: `/product/${product.slug}` },
  ];

  return (
    <>
      <SchemaOrgProduct product={product} />
      <SchemaOrgBreadcrumbs items={breadcrumbs} />
      <ProductDetailView product={product} />
    </>
  );
}

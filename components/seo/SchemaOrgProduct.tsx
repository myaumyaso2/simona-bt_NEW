import React from 'react';
import { ProductItem } from '@/types';

interface SchemaOrgProductProps {
  product: ProductItem;
  siteUrl?: string;
}

export function SchemaOrgProduct({ product, siteUrl = 'https://simona-bt.ru' }: SchemaOrgProductProps) {
  const isAvailable = product.inStock || (product.stockCount && product.stockCount > 0);
  const availability = isAvailable
    ? 'https://schema.org/InStock'
    : 'https://schema.org/PreOrder';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images && product.images.length > 0 ? product.images : undefined,
    description: product.description?.replace(/<[^>]*>/g, '').slice(0, 500) || product.name,
    sku: product.sku || product.id,
    mpn: product.sku || undefined,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    offers: {
      '@type': 'Offer',
      url: `${siteUrl}/product/${product.slug}`,
      priceCurrency: 'RUB',
      price: product.price,
      priceValidUntil: '2026-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability,
      seller: {
        '@type': 'Organization',
        name: 'Салоны бытовой техники «СИМОНА»',
        url: siteUrl,
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '28',
      bestRating: '5',
      worstRating: '1',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

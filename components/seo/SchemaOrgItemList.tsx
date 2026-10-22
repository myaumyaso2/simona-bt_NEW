import React from 'react';
import { ProductItem } from '@/types';
import { formatProductName } from '@/lib/catalog/productTitle';

interface SchemaOrgItemListProps {
  products: ProductItem[];
  categoryTitle: string;
  siteUrl?: string;
}

export function SchemaOrgItemList({
  products,
  categoryTitle,
  siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.simona-bt.ru',
}: SchemaOrgItemListProps) {
  if (!products || products.length === 0) return null;

  // Take top 24 products for structured ItemList rich snippets
  const topProducts = products.slice(0, 24);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: categoryTitle,
    numberOfItems: products.length,
    itemListElement: topProducts.map((product, index) => {
      const formattedTitle = formatProductName(product);
      const firstImage = product.images && product.images.length > 0 ? product.images[0] : '';
      const fullImageUrl = firstImage
        ? firstImage.startsWith('http')
          ? firstImage
          : `${siteUrl}${firstImage}`
        : undefined;

      return {
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Product',
          name: formattedTitle,
          url: `${siteUrl}/product/${product.slug}`,
          image: fullImageUrl,
          offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'RUB',
            availability: product.inStock
              ? 'https://schema.org/InStock'
              : 'https://schema.org/PreOrder',
            seller: {
              '@type': 'Organization',
              name: 'СИМОНА',
            },
          },
        },
      };
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

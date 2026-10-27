import React from 'react';
import { ProductItem } from '@/types';
import { formatProductName } from '@/lib/catalog/productTitle';
import { formatBrandName } from '@/lib/formatters';

interface SchemaOrgProductProps {
  product: ProductItem;
  siteUrl?: string;
}

export function SchemaOrgProduct({
  product,
  siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.simona-bt.ru',
}: SchemaOrgProductProps) {
  const isAvailable = product.inStock || (product.stockCount && product.stockCount > 0);
  const availability = isAvailable
    ? 'https://schema.org/InStock'
    : 'https://schema.org/PreOrder';

  const formattedTitle = formatProductName(product);
  const formattedBrand = formatBrandName(product.brand);

  // Extract structured technical parameters for AI Search & Knowledge Graph (Gemini / Alice / GPT)
  const additionalProperty = (product.features || [])
    .filter(
      (f) =>
        f &&
        typeof f.label === 'string' &&
        typeof f.value === 'string' &&
        f.label.trim().length > 0 &&
        f.value.trim().length > 0
    )
    .slice(0, 25)
    .map((f) => ({
      '@type': 'PropertyValue',
      name: f.label.trim(),
      value: f.value.trim(),
    }));

  const countryFeature = product.features?.find(
    (f) => f.label.trim().toLowerCase() === 'страна производства'
  );
  const countryName = countryFeature?.value?.trim();

  // Reviews & Rating: only output aggregateRating when genuine reviews exist or rating > 0
  const reviewCount = product.reviewsCount ?? product.reviews?.length ?? 0;
  const ratingValue = product.rating ?? (reviewCount > 0 ? 5.0 : undefined);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: formattedTitle,
    image: product.images && product.images.length > 0 ? product.images : undefined,
    description: product.description?.replace(/<[^>]*>/g, '').slice(0, 500) || formattedTitle,
    sku: product.sku || product.id,
    mpn: product.sku || undefined,
    brand: {
      '@type': 'Brand',
      name: formattedBrand,
    },
    ...(countryName
      ? {
          countryOfOrigin: {
            '@type': 'Country',
            name: countryName,
          },
        }
      : {}),
    ...(additionalProperty.length > 0 ? { additionalProperty } : {}),
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
      // Google Shopping & Gemini fast delivery and free return criteria
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'RUB',
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'RU',
          addressRegion: 'Нижегородская область',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 0,
            maxValue: 1,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 2,
            unitCode: 'DAY',
          },
        },
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'RU',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 14,
        returnMethod: 'https://schema.org/ReturnInStore',
        returnFees: 'https://schema.org/FreeReturn',
      },
    },
    ...(ratingValue && reviewCount > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: String(ratingValue),
            reviewCount: String(reviewCount),
            bestRating: '5',
            worstRating: '1',
          },
        }
      : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

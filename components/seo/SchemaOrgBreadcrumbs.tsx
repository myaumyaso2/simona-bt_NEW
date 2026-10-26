import React from 'react';

export interface BreadcrumbItem {
  name: string;
  url?: string;
}

interface SchemaOrgBreadcrumbsProps {
  items: BreadcrumbItem[];
  siteUrl?: string;
}

export function SchemaOrgBreadcrumbs({
  items,
  siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.simona-bt.ru',
}: SchemaOrgBreadcrumbsProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => {
      const entry: {
        '@type': string;
        position: number;
        name: string;
        item?: string;
      } = {
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
      };

      if (item.url) {
        entry.item = item.url.startsWith('http') ? item.url : `${siteUrl}${item.url}`;
      }

      return entry;
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

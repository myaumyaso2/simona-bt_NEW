import React from 'react';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

interface SchemaOrgBreadcrumbsProps {
  items: BreadcrumbItem[];
  siteUrl?: string;
}

export function SchemaOrgBreadcrumbs({
  items,
  siteUrl = 'https://simona-bt.ru',
}: SchemaOrgBreadcrumbsProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${siteUrl}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { SimonaIconChevronRight } from '@/components/brand/SimonaIcons';
import { SchemaOrgBreadcrumbs } from '@/components/seo/SchemaOrgBreadcrumbs';

export interface BreadcrumbItem {
  name: string;
  url?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  rightContent?: React.ReactNode;
  className?: string;
  skipJsonLd?: boolean;
}

/**
 * Breadcrumbs — Единый канонический компонент хлебных крошек SIMONA-BT.
 * Сквозная навигационная полоса-бар с микроразметкой Schema.org BreadcrumbList,
 * плавной адаптивностью и усечением длинных заголовков моделей.
 */
export function Breadcrumbs({ items, rightContent, className = '', skipJsonLd = false }: BreadcrumbsProps) {
  // Ensure "Главная" is always the first item in the breadcrumbs chain
  const normalizedItems: BreadcrumbItem[] =
    items.length > 0 && items[0].url === '/'
      ? items
      : [{ name: 'Главная', url: '/' }, ...items];

  // Prepare items for Schema.org JSON-LD (preserve optional url for leaf item)
  const schemaItems = normalizedItems.map((item) => ({
    name: item.name,
    url: item.url,
  }));

  return (
    <>
      {!skipJsonLd && <SchemaOrgBreadcrumbs items={schemaItems} />}
      <div className={`w-full border-b border-[#2B313A] bg-[#16191D]/60 backdrop-blur-md ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3 flex items-center justify-between gap-3 sm:gap-4 overflow-hidden">
          <nav
            aria-label="Хлебные крошки"
            className="flex items-center space-x-2 text-xs text-[#87888A] min-w-0 overflow-x-auto no-scrollbar whitespace-nowrap scroll-smooth py-0.5"
          >
            {normalizedItems.map((item, index) => {
              const isLast = index === normalizedItems.length - 1;

              return (
                <React.Fragment key={`${item.name}-${index}`}>
                  {index > 0 && (
                    <SimonaIconChevronRight className="w-3 h-3 text-[#3E3D40] shrink-0" />
                  )}
                  {isLast || !item.url ? (
                    <span
                      className="text-[#D7D9DB] font-medium truncate max-w-[200px] sm:max-w-xs md:max-w-md lg:max-w-lg"
                      title={item.name}
                    >
                      {item.name}
                    </span>
                  ) : (
                    <Link
                      href={item.url}
                      className="hover:text-white transition-colors shrink-0"
                    >
                      {item.name}
                    </Link>
                  )}
                </React.Fragment>
              );
            })}
          </nav>

          {rightContent && (
            <div className="shrink-0 text-xs hidden sm:block">
              {rightContent}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { BrandCategoryTab } from '@/lib/catalog/brandCategories';
import { BrandCategoryNav } from './BrandCategoryNav';

export type PhysicalTabType = 'ALL' | 'SHOWROOM' | 'LOCAL_STOCK' | 'DISCOUNT' | 'REMOTE_STOCK' | 'ON_ORDER';

export interface PresenceTabItem {
  id: PhysicalTabType;
  label: string;
  count: number;
}

export interface SubcategoryLinkItem {
  label: string;
  href: string;
}

export interface CatalogHeroBreadcrumbItem {
  name: string;
  url?: string;
  href?: string;
}

export interface CategoryFacetLinkItem {
  shortTitle: string;
  facetSlug: string;
  count?: number;
  href: string;
  isActive?: boolean;
}

interface CatalogHeroProps {
  activeSubcategory?: string;
  onSelectSubcategory?: (id: string) => void;
  activePhysicalTab: PhysicalTabType;
  onSelectPhysicalTab: (tab: PhysicalTabType) => void;
  totalCount: number;
  presenceCounts?: Record<PhysicalTabType, number>;
  categoryTitle?: string;
  categorySlug?: string;
  categoryDescription?: string;
  brandName?: string;
  brandCategories?: BrandCategoryTab[];
  activeCategorySlug?: string;
  onSelectCategory?: (slug: string) => void;
  subcategoryLinks?: SubcategoryLinkItem[];
  breadcrumbs?: CatalogHeroBreadcrumbItem[];
  facetLinks?: CategoryFacetLinkItem[];
  activeFacetSlug?: string;
  facetAllCount?: number;
  facetAllHref?: string;
}

function pluralizeModels(count: number): string {
  const abs = Math.abs(count) % 100;
  const n1 = abs % 10;
  if (abs > 10 && abs < 20) return 'моделей';
  if (n1 > 1 && n1 < 5) return 'модели';
  if (n1 === 1) return 'модель';
  return 'моделей';
}

export function CatalogHero({
  activePhysicalTab,
  onSelectPhysicalTab,
  totalCount,
  presenceCounts,
  categoryTitle = 'Каталог техники',
  categoryDescription = 'Официальный каталог бытовой техники с проверкой наличия в салонах и на центральном складе в Нижнем Новгороде.',
  brandCategories,
  activeCategorySlug,
  onSelectCategory,
  subcategoryLinks,
  breadcrumbs,
  categorySlug,
  facetLinks,
  activeFacetSlug,
  facetAllCount,
  facetAllHref,
}: CatalogHeroProps) {
  const allTabs: PresenceTabItem[] = [
    { id: 'ALL', label: 'Все', count: presenceCounts?.ALL ?? totalCount },
    { id: 'LOCAL_STOCK', label: 'На складе', count: presenceCounts?.LOCAL_STOCK ?? 0 },
    { id: 'SHOWROOM', label: 'На витрине', count: presenceCounts?.SHOWROOM ?? 0 },
    { id: 'DISCOUNT', label: 'Уценка', count: presenceCounts?.DISCOUNT ?? 0 },
    { id: 'REMOTE_STOCK', label: 'На удаленном складе', count: presenceCounts?.REMOTE_STOCK ?? 0 },
    { id: 'ON_ORDER', label: 'Под заказ', count: presenceCounts?.ON_ORDER ?? 0 },
  ];

  // Zero Dead Ends: Only display tabs with items (except 'ALL' which is always visible)
  const presenceTabs = allTabs.filter((tab) => tab.id === 'ALL' || tab.count > 0);

  // If the active tab drops to 0 count due to sidebar filters, gracefully fall back to ALL
  useEffect(() => {
    if (activePhysicalTab !== 'ALL') {
      const activeItem = allTabs.find((t) => t.id === activePhysicalTab);
      if (!activeItem || activeItem.count === 0) {
        onSelectPhysicalTab('ALL');
      }
    }
  }, [activePhysicalTab, presenceCounts, onSelectPhysicalTab]);

  const hasBrandCategories = Boolean(brandCategories && brandCategories.length > 0 && onSelectCategory);

  return (
    <>
      <Breadcrumbs
        skipJsonLd
        items={
          breadcrumbs && breadcrumbs.length > 0
            ? breadcrumbs
            : [
                { name: 'Каталог', url: '/catalog' },
                { name: categoryTitle },
              ]
        }
      />
      <section className="pt-4 sm:pt-8 pb-3 sm:pb-6 border-b border-[#2B313A]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title & Count Badge */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 mb-1.5 sm:mb-2">
          <h1 className="text-xl sm:text-3xl lg:text-4xl font-montserrat font-bold text-white tracking-tight">
            {categoryTitle}
          </h1>
          <span className="inline-flex items-center px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-lg text-[11px] sm:text-xs font-semibold bg-[#16191D] border border-[#2B313A] text-simona-teal shadow-sm">
            {totalCount} {pluralizeModels(totalCount)}
          </span>
        </div>

        {/* 3. Description Subtitle */}
        <p className="text-xs sm:text-sm text-[#87888A] max-w-2xl leading-relaxed mb-3 sm:mb-5 line-clamp-2 sm:line-clamp-none">
          {categoryDescription}
        </p>

        {/* 3.5. Macro-Section Subcategory Navigation */}
        {subcategoryLinks && subcategoryLinks.length > 0 && (
          <nav
            aria-label="Подкатегории раздела"
            className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 sm:flex-wrap sm:overflow-visible mb-3 sm:mb-5"
          >
            {subcategoryLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="shrink-0 px-3.5 py-1.5 rounded-xl bg-[#16191D] border border-[#2B313A] hover:border-simona-teal/50 text-xs font-medium text-[#D7D9DB] hover:text-white transition"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}

        {/* 4. Popular Facet Collections Slider (Top Row) */}
        {facetLinks && facetLinks.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 mb-2.5 sm:mb-3">
            <span className="text-[11px] sm:text-xs text-[#87888A] font-medium shrink-0">
              Подборки:
            </span>
            <div className="relative w-full sm:w-auto overflow-x-auto no-scrollbar flex-nowrap inline-flex items-center p-1 rounded-xl bg-[#16191D] border border-[#2B313A] gap-1 scroll-smooth">
              {/* "Все" Tab */}
              {(() => {
                const isAllActive =
                  !activeFacetSlug ||
                  !facetLinks.some(
                    (f) => f.isActive || f.facetSlug === activeFacetSlug
                  );
                const brandQuery = facetLinks.find((f) => f.href.includes('brand='))?.href.split('?')[1];
                const allHref = facetAllHref || `/catalog/${categorySlug || ''}${brandQuery ? `?${brandQuery}` : ''}`;
                return (
                  <Link
                    href={allHref}
                    className={`relative z-10 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors duration-200 whitespace-nowrap cursor-pointer select-none inline-flex items-center ${
                      isAllActive
                        ? 'text-white'
                        : 'text-[#87888A] hover:text-[#D7D9DB]'
                    }`}
                  >
                    {isAllActive && (
                      <motion.div
                        layoutId="facetActiveTab"
                        className="absolute inset-0 rounded-lg shadow-sm -z-10 bg-[#1E2228] border border-[#2B313A]"
                        transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                      />
                    )}
                    <span>Все</span>
                    {typeof facetAllCount === 'number' && facetAllCount > 0 && (
                      <span
                        className={`ml-1 text-[11px] font-mono transition-colors duration-200 ${
                          isAllActive ? 'text-simona-teal font-semibold' : 'text-[#87888A] font-normal'
                        }`}
                      >
                        ({facetAllCount})
                      </span>
                    )}
                  </Link>
                );
              })()}

              {/* Facet Tabs */}
              {facetLinks.map((facet) => {
                const isActive = Boolean(
                  facet.isActive || (activeFacetSlug && facet.facetSlug === activeFacetSlug)
                );
                return (
                  <Link
                    key={facet.facetSlug}
                    href={facet.href}
                    className={`relative z-10 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors duration-200 whitespace-nowrap cursor-pointer select-none inline-flex items-center ${
                      isActive
                        ? 'text-white'
                        : 'text-[#87888A] hover:text-[#D7D9DB]'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="facetActiveTab"
                        className="absolute inset-0 rounded-lg shadow-sm -z-10 bg-[#1E2228] border border-[#2B313A]"
                        transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                      />
                    )}
                    <span>{facet.shortTitle}</span>
                    {typeof facet.count === 'number' && (
                      <span
                        className={`ml-1 text-[11px] font-mono transition-colors duration-200 ${
                          isActive ? 'text-simona-teal font-semibold' : 'text-[#87888A] font-normal'
                        }`}
                      >
                        ({facet.count})
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* 4.5. Controls Slot: 
             If Brand Page: Raised Brand Categories Switcher
             If General Catalog: Presence Tabs Slider with "Наличие:" label (Bottom Row) */}
        {hasBrandCategories && brandCategories && onSelectCategory ? (
          <BrandCategoryNav
            categories={brandCategories}
            activeCategorySlug={activeCategorySlug !== undefined ? activeCategorySlug : brandCategories[0].slug}
            onSelectCategory={onSelectCategory}
          />
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2">
            <span className="text-[11px] sm:text-xs text-[#87888A] font-medium shrink-0">
              Наличие:
            </span>
            <div className="relative w-full sm:w-auto overflow-x-auto no-scrollbar flex-nowrap inline-flex items-center p-1 rounded-xl bg-[#16191D] border border-[#2B313A] gap-1 scroll-smooth">
              {presenceTabs.map((tab) => {
                const isActive = activePhysicalTab === tab.id;
                const isDiscount = tab.id === 'DISCOUNT';
                return (
                  <button
                    key={tab.id}
                    onClick={() => onSelectPhysicalTab(tab.id)}
                    className={`relative z-10 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors duration-200 whitespace-nowrap cursor-pointer select-none ${
                      isActive
                        ? 'text-white'
                        : isDiscount
                          ? 'text-[#C9A2A4] hover:text-white'
                          : 'text-[#87888A] hover:text-[#D7D9DB]'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="presenceActiveTab"
                        className={`absolute inset-0 rounded-lg shadow-sm -z-10 ${
                          isDiscount
                            ? 'bg-simona-wine border border-[#A71B20]'
                            : 'bg-[#1E2228] border border-[#2B313A]'
                        }`}
                        transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                      />
                    )}
                    <span>{tab.label}</span>
                    <span
                      className={`ml-1 text-[11px] font-mono transition-colors duration-200 ${
                        isActive
                          ? isDiscount
                            ? 'text-white font-bold'
                            : 'text-simona-teal font-semibold'
                          : isDiscount
                            ? 'text-[#A71B20] font-medium'
                            : 'text-[#87888A] font-normal'
                      }`}
                    >
                      ({tab.count})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  </>
);
}

'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { CATALOG_PRODUCTS, CATALOG_SUBCATEGORIES } from '@/data/catalogData';
import { MANUFACTURER_PROMOS, isProductInPromo } from '@/data/promosData';
import { CatalogHero, PhysicalTabType } from './CatalogHero';
import { CatalogSidebar, FilterState } from './CatalogSidebar';
import { CatalogToolbar, SortOption, ViewMode } from './CatalogToolbar';
import { LuxuryProductCard } from './LuxuryProductCard';
import { LuxuryProductListCard } from './LuxuryProductListCard';
import { CatalogPagination } from './CatalogPagination';
import { CatalogServiceContour } from './CatalogServiceContour';
import { MobileFilterDrawer } from './MobileFilterDrawer';

export function CatalogView() {
  const searchParams = useSearchParams();
  const [activeSubcategory, setActiveSubcategory] = useState<string>('all');
  const [activePhysicalTab, setActivePhysicalTab] = useState<PhysicalTabType>('ALL');
  const [sort, setSort] = useState<SortOption>('popular');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    selectedPromos: [],
    selectedBrands: [],
    priceMin: 85000,
    priceMax: 890000,
    selectedLocations: [],
    selectedWidth: null,
    selectedColor: null,
  });

  // Deep Link support: /catalog?promo=slug
  const promoParam = searchParams.get('promo');
  useEffect(() => {
    if (promoParam && !filters.selectedPromos.includes(promoParam)) {
      setFilters((prev) => ({
        ...prev,
        selectedPromos: [promoParam],
      }));
    }
  }, [promoParam]);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      selectedPromos: [],
      selectedBrands: [],
      priceMin: 85000,
      priceMax: 890000,
      selectedLocations: [],
      selectedWidth: null,
      selectedColor: null,
    });
    setActiveSubcategory('all');
    setActivePhysicalTab('ALL');
    setCurrentPage(1);
  };

  // Dynamic promo count calculation for current category and tab (Zero Dead Ends)
  const promoCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    MANUFACTURER_PROMOS.forEach((promo) => {
      const count = CATALOG_PRODUCTS.filter((product) => {
        // Physical Tab Filter
        if (activePhysicalTab !== 'ALL') {
          if (activePhysicalTab === 'SHOWROOM') {
            const isShowroom =
              product.physicalStatus === 'SHOWROOM' ||
              product.physicalStatus === 'ACTIVE_KITCHEN' ||
              product.physicalStatus === 'EXHIBITION_15' ||
              product.physicalStatus === 'EXHIBITION_11';
            if (!isShowroom) return false;
          } else if (product.physicalStatus !== activePhysicalTab) {
            return false;
          }
        }
        // Subcategory Filter
        if (activeSubcategory !== 'all') {
          const subtag = CATALOG_SUBCATEGORIES.find((s) => s.id === activeSubcategory);
          if (subtag && !subtag.filterFn(product)) {
            return false;
          }
        }
        return isProductInPromo(product, promo.slug);
      }).length;
      counts[promo.slug] = count;
    });
    return counts;
  }, [activePhysicalTab, activeSubcategory]);

  // Real-time dynamic filtering
  const filteredProducts = useMemo(() => {
    return CATALOG_PRODUCTS.filter((product) => {
      // 0. Promo Filter (OR logic: product participates in ANY of the selected promos)
      if (filters.selectedPromos.length > 0) {
        const matchesPromo = filters.selectedPromos.some((promoSlug) =>
          isProductInPromo(product, promoSlug)
        );
        if (!matchesPromo) return false;
      }

      // 1. Physical Tab Filter
      if (activePhysicalTab !== 'ALL') {
        if (activePhysicalTab === 'SHOWROOM') {
          const isShowroom =
            product.physicalStatus === 'SHOWROOM' ||
            product.physicalStatus === 'ACTIVE_KITCHEN' ||
            product.physicalStatus === 'EXHIBITION_15' ||
            product.physicalStatus === 'EXHIBITION_11';
          if (!isShowroom) return false;
        } else if (product.physicalStatus !== activePhysicalTab) {
          return false;
        }
      }

      // 2. Subcategory Quick Filter
      if (activeSubcategory !== 'all') {
        const subtag = CATALOG_SUBCATEGORIES.find((s) => s.id === activeSubcategory);
        if (subtag && !subtag.filterFn(product)) {
          return false;
        }
      }

      // 3. Brand Filter
      if (
        filters.selectedBrands.length > 0 &&
        !filters.selectedBrands.includes(product.brand)
      ) {
        return false;
      }

      // 4. Price Filter
      if (product.price < filters.priceMin || product.price > filters.priceMax) {
        return false;
      }

      // 5. Location Checkbox Filter
      if (filters.selectedLocations.length > 0) {
        const match = filters.selectedLocations.some((loc) => {
          if (loc === 'SHOWROOM') {
            return (
              product.physicalStatus === 'SHOWROOM' ||
              product.physicalStatus === 'ACTIVE_KITCHEN' ||
              product.physicalStatus === 'EXHIBITION_15' ||
              product.physicalStatus === 'EXHIBITION_11'
            );
          }
          return product.physicalStatus === loc;
        });
        if (!match) return false;
      }

      // 6. Width Filter
      if (filters.selectedWidth) {
        if (
          filters.selectedWidth === '45 см' &&
          !(product.dimensions?.includes('45') || product.name.includes('45'))
        ) {
          return false;
        }
        if (
          filters.selectedWidth === '60 см' &&
          !(product.dimensions?.includes('60') || product.dimensions?.includes('595') || product.name.includes('60'))
        ) {
          return false;
        }
        if (
          filters.selectedWidth === '90 см' &&
          !(product.dimensions?.includes('90') || product.name.includes('90'))
        ) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sort === 'popular') {
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      }
      if (sort === 'price_asc') {
        return a.price - b.price;
      }
      if (sort === 'price_desc') {
        return b.price - a.price;
      }
      if (sort === 'newest') {
        return b.id.localeCompare(a.id);
      }
      return 0;
    });
  }, [activePhysicalTab, activeSubcategory, filters, sort]);

  // Brand count calculation for the sidebar
  const brandCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    CATALOG_PRODUCTS.forEach((p) => {
      counts[p.brand] = (counts[p.brand] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <div className="bg-[#111315] min-h-screen text-white">
      {/* 1. Category Hero Block */}
      <CatalogHero
        activeSubcategory={activeSubcategory}
        onSelectSubcategory={(id) => {
          setActiveSubcategory(id);
          setCurrentPage(1);
        }}
        activePhysicalTab={activePhysicalTab}
        onSelectPhysicalTab={(tab) => {
          setActivePhysicalTab(tab);
          setCurrentPage(1);
        }}
        totalCount={420}
      />

      {/* 2. Main Catalog Workspace: Split-Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Desktop Sidebar (300px) */}
          <div className="hidden lg:block">
            <CatalogSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
              brandCounts={brandCounts}
              promoCounts={promoCounts}
            />
          </div>

          {/* Right Product Grid Area */}
          <div className="flex-1 w-full">
            {/* Toolbar with Active Chips and Sort */}
            <CatalogToolbar
              filters={filters}
              onRemoveBrand={(brand) =>
                handleFilterChange({
                  selectedBrands: filters.selectedBrands.filter((b) => b !== brand),
                })
              }
              onRemoveWidth={() => handleFilterChange({ selectedWidth: null })}
              onRemoveColor={() => handleFilterChange({ selectedColor: null })}
              sort={sort}
              onSortChange={setSort}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onOpenMobileFilters={() => setIsMobileFiltersOpen(true)}
            />

            {/* Active Promo Chips per AGENTS.md 8.2 & Grill-me Alignment */}
            {filters.selectedPromos.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-5 p-3 bg-simona-wine/10 border border-simona-wine/30 rounded-xl animate-fade-in">
                <div className="flex items-center gap-1.5 text-xs text-simona-wine-light font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-simona-wine" />
                  <span>Активные акции:</span>
                </div>
                {filters.selectedPromos.map((slug) => {
                  const promo = MANUFACTURER_PROMOS.find((p) => p.slug === slug);
                  if (!promo) return null;
                  return (
                    <span
                      key={slug}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-simona-wine/25 text-white border border-simona-wine/50 text-xs font-medium shadow-sm backdrop-blur-md"
                    >
                      <span>
                        {promo.brand}: {promo.badgeText}
                      </span>
                      <button
                        onClick={() => {
                          const next = filters.selectedPromos.filter((s) => s !== slug);
                          handleFilterChange({ selectedPromos: next });
                        }}
                        className="hover:bg-white/20 rounded-full p-0.5 transition-colors cursor-pointer"
                        aria-label={`Удалить фильтр ${promo.title}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}
                <button
                  onClick={() => handleFilterChange({ selectedPromos: [] })}
                  className="text-xs text-[#87888A] hover:text-white underline ml-auto transition-colors cursor-pointer"
                >
                  Сбросить акции
                </button>
              </div>
            )}

            {/* Product Cards: Grid or List */}
            {filteredProducts.length > 0 ? (
              <motion.div
                key={`${activePhysicalTab}-${activeSubcategory}-${sort}-${viewMode}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'
                    : 'flex flex-col space-y-4'
                }
              >
                {filteredProducts.map((product) =>
                  viewMode === 'grid' ? (
                    <LuxuryProductCard key={product.id} product={product} />
                  ) : (
                    <LuxuryProductListCard key={product.id} product={product} />
                  )
                )}
              </motion.div>
            ) : (
              <div className="py-20 text-center rounded-2xl bg-[#16191D] border border-[#2B313A] p-8">
                <p className="text-white text-base font-semibold mb-2">
                  По выбранным параметрам приборов не найдено
                </p>
                <p className="text-xs text-[#87888A] mb-5">
                  Попробуйте сбросить некоторые фильтры или выбрать другой диапазон цен
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-semibold transition cursor-pointer"
                >
                  Сбросить все фильтры
                </button>
              </div>
            )}

            {/* Pagination & Load More */}
            <CatalogPagination
              currentPage={currentPage}
              totalPages={18}
              totalItems={420}
              shownItems={Math.min(24, Math.max(filteredProducts.length, 6))}
              onPageChange={setCurrentPage}
              onLoadMore={() => alert('Загружена следующая порция моделей каталога')}
            />
          </div>
        </div>
      </div>

      {/* 3. 4-Column Service Contour Block */}
      <CatalogServiceContour />

      {/* 4. Mobile Drawer */}
      <MobileFilterDrawer
        isOpen={isMobileFiltersOpen}
        onClose={() => setIsMobileFiltersOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        totalFilteredCount={filteredProducts.length}
        brandCounts={brandCounts}
        promoCounts={promoCounts}
      />
    </div>
  );
}

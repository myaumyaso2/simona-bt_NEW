'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CATALOG_PRODUCTS, CATALOG_SUBCATEGORIES } from '@/data/catalogData';
import { CatalogHero, PhysicalTabType } from './CatalogHero';
import { CatalogSidebar, FilterState } from './CatalogSidebar';
import { CatalogToolbar, SortOption } from './CatalogToolbar';
import { LuxuryProductCard } from './LuxuryProductCard';
import { CatalogPagination } from './CatalogPagination';
import { CatalogServiceContour } from './CatalogServiceContour';
import { MobileFilterDrawer } from './MobileFilterDrawer';

export function CatalogView() {
  const [activeSubcategory, setActiveSubcategory] = useState<string>('all');
  const [activePhysicalTab, setActivePhysicalTab] = useState<PhysicalTabType>('ALL');
  const [sort, setSort] = useState<SortOption>('showroom_first');
  const [columns, setColumns] = useState<3 | 4>(3);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    selectedBrands: [],
    priceMin: 85000,
    priceMax: 890000,
    selectedLocations: [],
    selectedWidth: null,
    selectedColor: null,
  });

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
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

  // Real-time dynamic filtering
  const filteredProducts = useMemo(() => {
    return CATALOG_PRODUCTS.filter((product) => {
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
      if (sort === 'showroom_first') {
        const rank = (status: string) => {
          if (
            status === 'SHOWROOM' ||
            status === 'ACTIVE_KITCHEN' ||
            status === 'EXHIBITION_15' ||
            status === 'EXHIBITION_11'
          ) {
            return 1;
          }
          if (status === 'LOCAL_STOCK') return 2;
          if (status === 'REMOTE_STOCK') return 3;
          return 4;
        };
        return rank(a.physicalStatus) - rank(b.physicalStatus);
      }
      if (sort === 'price_asc') {
        return a.price - b.price;
      }
      if (sort === 'price_desc') {
        return b.price - a.price;
      }
      if (sort === 'popular') {
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
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
              columns={columns}
              onColumnsChange={setColumns}
              onOpenMobileFilters={() => setIsMobileFiltersOpen(true)}
            />

            {/* Product Cards Grid */}
            {filteredProducts.length > 0 ? (
              <motion.div
                key={`${activePhysicalTab}-${activeSubcategory}-${sort}-${columns}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className={`grid grid-cols-1 sm:grid-cols-2 ${
                  columns === 4 ? 'xl:grid-cols-4' : 'lg:grid-cols-3'
                } gap-5`}
              >
                {filteredProducts.map((product) => (
                  <LuxuryProductCard key={product.id} product={product} />
                ))}
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
                  className="px-5 py-2.5 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-semibold transition"
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
      />
    </div>
  );
}

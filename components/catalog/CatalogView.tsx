'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { CATALOG_PRODUCTS } from '@/data/catalogData';
import { MANUFACTURER_PROMOS, isProductInPromo } from '@/data/promosData';
import { CatalogHero, PhysicalTabType } from './CatalogHero';
import { CatalogSidebar, FilterState } from './CatalogSidebar';
import { CatalogToolbar, SortOption, ViewMode } from './CatalogToolbar';
import { LuxuryProductCard } from './LuxuryProductCard';
import { LuxuryProductListCard } from './LuxuryProductListCard';
import { CatalogPagination } from './CatalogPagination';
import { ProductItem } from '@/types';
import { CatalogServiceContour } from './CatalogServiceContour';
import { MobileFilterDrawer } from './MobileFilterDrawer';
import { getCategoryFacets, matchProductFeature } from '@/lib/productFeatures';
import { getProductPhysicalStatus } from '@/lib/utils';
import { BrandCategoryNav } from './BrandCategoryNav';
import {
  getBrandCategoriesFromProducts,
  getBrandInfo,
  isProductInCategory,
} from '@/lib/catalog/brandCategories';
import { getCategoryProductGroups, getProductGroup } from '@/lib/catalog/productGroups';

interface CatalogViewProps {
  initialProducts?: ProductItem[];
  totalCount?: number;
  categorySlug?: string;
  categoryTitle?: string;
  categoryDescription?: string;
  initialBrand?: string;
  initialCategorySlug?: string;
}

const PAGE_SIZE = 24;

export function CatalogView({
  initialProducts,
  categorySlug,
  categoryTitle,
  categoryDescription,
  initialBrand,
  initialCategorySlug,
}: CatalogViewProps = {}) {
  const searchParams = useSearchParams();
  const rawProducts = useMemo(() => {
    return initialProducts && initialProducts.length > 0 ? initialProducts : CATALOG_PRODUCTS;
  }, [initialProducts]);

  // Brand mode calculations & category discovery
  const brandCategories = useMemo(() => {
    if (!initialBrand) return [];
    return getBrandCategoriesFromProducts(rawProducts);
  }, [initialBrand, rawProducts]);

  const brandInfo = useMemo(() => {
    if (!initialBrand) return null;
    return getBrandInfo(initialBrand);
  }, [initialBrand]);

  const categoryParam = searchParams.get('category') || initialCategorySlug;
  const [activeCategorySlug, setActiveCategorySlug] = useState<string>(() => {
    if (categoryParam) return categoryParam;
    if (initialBrand && brandCategories.length > 0) return brandCategories[0].slug;
    return categorySlug || '';
  });

  // Keep activeCategorySlug synced if URL searchParams or brandCategories change
  useEffect(() => {
    if (initialBrand) {
      const qCat = searchParams.get('category') || initialCategorySlug;
      if (qCat) {
        setActiveCategorySlug(qCat);
      } else if (brandCategories.length > 0 && (!activeCategorySlug || !brandCategories.some((c) => c.slug === activeCategorySlug))) {
        setActiveCategorySlug(brandCategories[0].slug);
      }
    }
  }, [searchParams, initialCategorySlug, initialBrand, brandCategories, activeCategorySlug]);

  const currentBrandCategory = useMemo(() => {
    if (!initialBrand) return null;
    return brandCategories.find((c) => c.slug === activeCategorySlug) || brandCategories[0] || null;
  }, [initialBrand, brandCategories, activeCategorySlug]);

  // Scoped products: in brand mode, strictly match the selected category!
  const categoryProducts = useMemo(() => {
    if (!initialBrand || !activeCategorySlug) return rawProducts;
    return rawProducts.filter((p) => isProductInCategory(p, activeCategorySlug));
  }, [rawProducts, initialBrand, activeCategorySlug]);

  const [activePhysicalTab, setActivePhysicalTab] = useState<PhysicalTabType>('ALL');
  const [sort, setSort] = useState<SortOption>('popular');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const brandParam = searchParams.get('brand') || initialBrand;

  // Dynamic price bounds strictly for the current category
  const priceBounds = useMemo(() => {
    const prices = categoryProducts.map((p) => p.price).filter((p) => p > 0);
    if (prices.length === 0) return { min: 0, max: 500000 };
    return {
      min: Math.floor(Math.min(...prices) / 1000) * 1000,
      max: Math.ceil(Math.max(...prices) / 1000) * 1000,
    };
  }, [categoryProducts]);

  // Dynamic product groups from 1C column C / canonical titles
  const availableGroups = useMemo(() => {
    return getCategoryProductGroups(categoryProducts);
  }, [categoryProducts]);

  const [filters, setFilters] = useState<FilterState>({
    selectedGroups: [],
    selectedPromos: [],
    selectedBrands: brandParam ? [brandParam] : [],
    priceMin: priceBounds.min,
    priceMax: priceBounds.max,
    selectedWidth: null,
    selectedColor: null,
    selectedFeatures: {},
  });

  // Keep price filter aligned with category price bounds on mount/category change
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      priceMin: priceBounds.min,
      priceMax: priceBounds.max,
    }));
  }, [priceBounds]);

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

  // Deep Link support: /catalog/[category]?brand=BRAND
  useEffect(() => {
    const b = searchParams.get('brand') || initialBrand;
    if (b && !filters.selectedBrands.some((sb) => sb.toUpperCase() === b.toUpperCase())) {
      setFilters((prev) => ({
        ...prev,
        selectedBrands: [b],
      }));
    }
  }, [searchParams, initialBrand]);

  const handleCategorySelect = (slug: string) => {
    setActiveCategorySlug(slug);
    setCurrentPage(1);
    setActivePhysicalTab('ALL');
    setFilters((prev) => ({
      ...prev,
      selectedWidth: null,
      selectedColor: null,
      selectedFeatures: {},
    }));

    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('category', slug);
      window.history.replaceState(null, '', url.pathname + url.search);
    }
  };

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      selectedGroups: [],
      selectedPromos: [],
      selectedBrands: initialBrand ? [initialBrand] : [],
      priceMin: priceBounds.min,
      priceMax: priceBounds.max,
      selectedWidth: null,
      selectedColor: null,
      selectedFeatures: {},
    });
    setActivePhysicalTab('ALL');
    setCurrentPage(1);
  };

  const handleToggleFeature = (label: string, value: string) => {
    const current = filters.selectedFeatures?.[label] || [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];

    const updated = { ...(filters.selectedFeatures || {}) };
    if (next.length > 0) {
      updated[label] = next;
    } else {
      delete updated[label];
    }
    handleFilterChange({ selectedFeatures: updated });
  };

  const handleRemoveFeature = (label: string, value: string) => {
    handleToggleFeature(label, value);
  };

  // Dynamic category facets calculation based on current category selection
  const categoryFacets = useMemo(() => {
    return getCategoryFacets(categoryProducts, 16);
  }, [categoryProducts]);

  // Dynamic promo count calculation for current category and tab (Zero Dead Ends)
  const promoCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    MANUFACTURER_PROMOS.forEach((promo) => {
      const count = categoryProducts.filter((product) => {
        return isProductInPromo(product, promo.slug);
      }).length;
      counts[promo.slug] = count;
    });
    return counts;
  }, [categoryProducts]);

  // Dynamic brand list with real counts for the category
  const availableBrands = useMemo(() => {
    const counts: Record<string, number> = {};
    categoryProducts.forEach((p) => {
      const b = p.brand?.trim() || 'СИМОНА';
      counts[b] = (counts[b] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([id, count]) => ({ id, name: id, count }))
      .sort((a, b) => b.count - a.count);
  }, [categoryProducts]);

  const brandCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    availableBrands.forEach((b) => {
      counts[b.id] = b.count;
    });
    return counts;
  }, [availableBrands]);

  // 1. Products filtered by sidebar criteria (groups, promos, brands, price, dynamic facets) - WITHOUT physical presence tab
  const sidebarFilteredProducts = useMemo(() => {
    return categoryProducts.filter((product) => {
      // 0. Product Group Filter (Column C from 1C_import.csv)
      if (filters.selectedGroups && filters.selectedGroups.length > 0) {
        const pGroup = getProductGroup(product);
        if (!filters.selectedGroups.includes(pGroup)) {
          return false;
        }
      }

      // 0.5. Promo Filter (OR logic: product participates in ANY of the selected promos)
      if (filters.selectedPromos.length > 0) {
        const matchesPromo = filters.selectedPromos.some((promoSlug) =>
          isProductInPromo(product, promoSlug)
        );
        if (!matchesPromo) return false;
      }

      // 1. Brand Filter (case-insensitive) - only apply if not on brand page or multiple brands
      if (
        !initialBrand &&
        filters.selectedBrands.length > 0 &&
        !filters.selectedBrands.some(
          (b) => b.trim().toUpperCase() === product.brand?.trim().toUpperCase()
        )
      ) {
        return false;
      }

      // 2. Price Filter
      if (product.price < filters.priceMin || product.price > filters.priceMax) {
        return false;
      }

      // 3. Dynamic Feature Facets Filter
      if (filters.selectedFeatures && Object.keys(filters.selectedFeatures).length > 0) {
        for (const [label, vals] of Object.entries(filters.selectedFeatures)) {
          if (!vals || vals.length === 0) continue;
          if (!matchProductFeature(product, label, vals)) {
            return false;
          }
        }
      }

      return true;
    });
  }, [categoryProducts, filters, initialBrand]);

  // 2. Dynamic presence counts based on current sidebar filters (Zero Dead Ends reactivity)
  const presenceCounts = useMemo(() => {
    let showroom = 0;
    let localStock = 0;
    let remoteStock = 0;
    let onOrder = 0;

    sidebarFilteredProducts.forEach((p) => {
      const status = getProductPhysicalStatus(p);
      if (status === 'SHOWROOM') {
        showroom++;
      } else if (status === 'LOCAL_STOCK') {
        localStock++;
      } else if (status === 'REMOTE_STOCK') {
        remoteStock++;
      } else {
        onOrder++;
      }
    });

    return {
      ALL: sidebarFilteredProducts.length,
      SHOWROOM: showroom,
      LOCAL_STOCK: localStock,
      REMOTE_STOCK: remoteStock,
      ON_ORDER: onOrder,
    };
  }, [sidebarFilteredProducts]);

  // 3. Final filtered and sorted products (strictly unified with getProductPhysicalStatus)
  const filteredProducts = useMemo(() => {
    return sidebarFilteredProducts
      .filter((product) => {
        if (activePhysicalTab === 'ALL') return true;
        return getProductPhysicalStatus(product) === activePhysicalTab;
      })
      .sort((a, b) => {
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
  }, [sidebarFilteredProducts, activePhysicalTab, sort]);

  // Client-side pagination
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredProducts.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredProducts, currentPage]);

  const dynamicTitle = useMemo(() => {
    if (initialBrand) {
      const catName = currentBrandCategory?.menuTitle || currentBrandCategory?.title || 'Техника';
      return `${catName} ${initialBrand.toUpperCase()}`;
    }
    if (!categoryTitle) return 'Каталог техники';
    if (filters.selectedBrands.length === 1) {
      const b = filters.selectedBrands[0];
      if (categoryTitle.toUpperCase().includes(b.toUpperCase())) {
        return categoryTitle;
      }
      return `${categoryTitle} ${b}`;
    }
    if (filters.selectedBrands.length === 0) {
      if (initialBrand && categoryTitle.toUpperCase().endsWith(initialBrand.toUpperCase())) {
        return categoryTitle.slice(0, -initialBrand.length).trim();
      }
      return categoryTitle;
    }
    return categoryTitle;
  }, [categoryTitle, filters.selectedBrands, initialBrand, currentBrandCategory]);

  const dynamicDescription = useMemo(() => {
    if (initialBrand) {
      if (brandInfo?.heroText) {
        return brandInfo.heroText;
      }
      return `Официальная бытовая техника ${initialBrand.toUpperCase()}. Сертифицированная европейская продукция с гарантией производителя в салонах «СИМОНА».`;
    }
    return categoryDescription;
  }, [initialBrand, brandInfo, categoryDescription]);

  return (
    <div className="bg-[#111315] min-h-screen text-white">
      {/* 1. Category Hero Block with raised Brand Categories Switcher */}
      <CatalogHero
        activePhysicalTab={activePhysicalTab}
        onSelectPhysicalTab={(tab) => {
          setActivePhysicalTab(tab);
          setCurrentPage(1);
        }}
        totalCount={currentBrandCategory ? currentBrandCategory.count : sidebarFilteredProducts.length}
        presenceCounts={presenceCounts}
        categoryTitle={dynamicTitle}
        categorySlug={activeCategorySlug || categorySlug}
        categoryDescription={dynamicDescription}
        brandName={initialBrand ? initialBrand.toUpperCase() : undefined}
        brandCategories={initialBrand ? brandCategories : undefined}
        activeCategorySlug={activeCategorySlug}
        onSelectCategory={handleCategorySelect}
      />

      {/* 1.5. Inventory Presence Tabs for Brand Page (lowered below Hero per user request) */}
      {initialBrand && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
          <div className="relative inline-flex flex-wrap items-center p-1 rounded-xl bg-[#16191D] border border-[#2B313A] gap-1">
            {[
              { id: 'ALL' as const, label: 'Все', count: presenceCounts.ALL },
              { id: 'SHOWROOM' as const, label: 'На витрине', count: presenceCounts.SHOWROOM },
              { id: 'LOCAL_STOCK' as const, label: 'На складе', count: presenceCounts.LOCAL_STOCK },
              { id: 'REMOTE_STOCK' as const, label: 'На удаленном складе', count: presenceCounts.REMOTE_STOCK },
              { id: 'ON_ORDER' as const, label: 'Под заказ', count: presenceCounts.ON_ORDER },
            ]
              .filter((tab) => tab.id === 'ALL' || tab.count > 0)
              .map((tab) => {
                const isActive = activePhysicalTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActivePhysicalTab(tab.id);
                      setCurrentPage(1);
                    }}
                    className={`relative z-10 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors duration-200 whitespace-nowrap cursor-pointer select-none ${
                      isActive ? 'text-white' : 'text-[#87888A] hover:text-[#D7D9DB]'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="presenceActiveTabBrand"
                        className="absolute inset-0 rounded-lg bg-[#1E2228] border border-[#2B313A] shadow-sm -z-10"
                        transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                      />
                    )}
                    <span>{tab.label}</span>
                    <span
                      className={`ml-1 text-[11px] font-mono transition-colors duration-200 ${
                        isActive ? 'text-simona-teal font-semibold' : 'text-[#87888A] font-normal'
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

      {/* 2. Main Catalog Workspace: Split-Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Desktop Sidebar (300px) */}
          <div className="hidden lg:block sticky top-24 shrink-0 z-30">
            <CatalogSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
              availableGroups={availableGroups}
              availableBrands={availableBrands}
              brandCounts={brandCounts}
              promoCounts={promoCounts}
              priceBounds={priceBounds}
              categoryFacets={categoryFacets}
              brandLock={initialBrand ? initialBrand.toUpperCase() : undefined}
            />
          </div>

          {/* Right Product Grid Area */}
          <div className="flex-1 w-full">
            {/* Toolbar with Active Chips and Sort */}
            <CatalogToolbar
              filters={filters}
              onRemoveGroup={(group) =>
                handleFilterChange({
                  selectedGroups: filters.selectedGroups.filter((g) => g !== group),
                })
              }
              onRemoveBrand={(brand) =>
                handleFilterChange({
                  selectedBrands: filters.selectedBrands.filter((b) => b.toUpperCase() !== brand.toUpperCase()),
                })
              }
              onRemoveWidth={() => handleFilterChange({ selectedWidth: null })}
              onRemoveColor={() => handleFilterChange({ selectedColor: null })}
              onRemoveFeature={handleRemoveFeature}
              onToggleFeature={handleToggleFeature}
              categoryFacets={categoryFacets}
              sort={sort}
              onSortChange={setSort}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onOpenMobileFilters={() => setIsMobileFiltersOpen(true)}
              isBrandPage={!!initialBrand}
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
                  const promoTitleClean = promo.title.trim();
                  const promoBrandClean = promo.brand.trim();
                  const promoDisplayName = promoTitleClean.toLowerCase().startsWith(promoBrandClean.toLowerCase())
                    ? promoTitleClean
                    : `${promoBrandClean}. ${promoTitleClean}`;

                  return (
                    <span
                      key={slug}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-simona-wine/25 text-white border border-simona-wine/50 text-xs font-medium shadow-sm backdrop-blur-md max-w-full"
                    >
                      <span className="truncate max-w-[240px] sm:max-w-[340px]" title={promoDisplayName}>
                        {promoDisplayName}
                      </span>
                      <button
                        onClick={() => {
                          const next = filters.selectedPromos.filter((s) => s !== slug);
                          handleFilterChange({ selectedPromos: next });
                        }}
                        className="hover:bg-white/20 rounded-full p-0.5 transition-colors cursor-pointer shrink-0"
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
            {paginatedProducts.length > 0 ? (
              <motion.div
                key={`${activePhysicalTab}-${sort}-${viewMode}-${currentPage}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'
                    : 'flex flex-col space-y-4'
                }
              >
                {paginatedProducts.map((product) =>
                  viewMode === 'grid' ? (
                    <LuxuryProductCard
                      key={product.id}
                      product={product}
                      selectedPromos={filters.selectedPromos}
                    />
                  ) : (
                    <LuxuryProductListCard
                      key={product.id}
                      product={product}
                      selectedPromos={filters.selectedPromos}
                    />
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
            {filteredProducts.length > PAGE_SIZE && (
              <CatalogPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredProducts.length}
                shownItems={paginatedProducts.length}
                onPageChange={setCurrentPage}
                onLoadMore={() => {
                  if (currentPage < totalPages) {
                    setCurrentPage((prev) => prev + 1);
                  }
                }}
              />
            )}
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
        availableGroups={availableGroups}
        availableBrands={availableBrands}
        brandCounts={brandCounts}
        promoCounts={promoCounts}
        priceBounds={priceBounds}
        categoryFacets={categoryFacets}
        brandLock={initialBrand ? initialBrand.toUpperCase() : undefined}
      />
    </div>
  );
}

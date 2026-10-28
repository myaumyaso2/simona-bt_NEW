'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CATALOG_PRODUCTS } from '@/data/catalogData';
import { MANUFACTURER_PROMOS, isProductInPromo } from '@/data/promosData';
import { CatalogHero, PhysicalTabType, SubcategoryLinkItem, CatalogHeroBreadcrumbItem, CategoryFacetLinkItem } from './CatalogHero';
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
import { isProductOutlet, isProductInOutletCategory } from '@/lib/catalog/outlet';
import {
  getBrandCategoriesFromProducts,
  getBrandInfo,
  getBrandFlagshipCategory,
  isProductInCategory,
} from '@/lib/catalog/brandCategories';
import { getCategoryProductGroups, getProductGroup } from '@/lib/catalog/productGroups';
import { getFacetsByCategory } from '@/data/catalogFacets';
import { SimonaIconClose, SimonaIconSearch } from '@/components/brand/SimonaIcons';
import { BrandDetails } from '@/data/brandDetails';
import { BrandShowcaseHero } from '@/components/brand/BrandShowcaseHero';
import { BrandCategoryNav } from './BrandCategoryNav';
import { formatBrandName } from '@/lib/formatters';
import { useStore } from '@/components/providers/StoreContext';
import {
  buildCatalogQueryString,
  parseCatalogQueryParams,
  saveCatalogCategorySession,
  getCatalogCategorySession,
  clearCatalogCategorySession,
} from '@/lib/catalog/filterUrlSync';

interface CatalogViewProps {
  initialProducts?: ProductItem[];
  allCategoryProducts?: ProductItem[];
  totalCount?: number;
  categorySlug?: string;
  categoryTitle?: string;
  categoryDescription?: string;
  initialBrand?: string;
  initialCategorySlug?: string;
  initialPage?: number;
  searchQuery?: string;
  brandDetails?: BrandDetails;
  subcategoryLinks?: SubcategoryLinkItem[];
  breadcrumbs?: CatalogHeroBreadcrumbItem[];
  facetLinks?: CategoryFacetLinkItem[];
  activeFacetSlug?: string;
  facetAllCount?: number;
}

const PAGE_SIZE = 24;

function matchesBrandList(product: ProductItem, targetBrands: string[]): boolean {
  if (!targetBrands || targetBrands.length === 0) return true;
  const pb = product.brand?.trim().toUpperCase() || '';
  return targetBrands.some((b) => {
    const tb = b.trim().toUpperCase();
    if (pb === tb) return true;
    if ((pb === 'KORTING' || pb === 'KÖRTING') && (tb === 'KORTING' || tb === 'KÖRTING')) return true;
    if ((pb === 'SIEMENS' || pb === 'SIEMENS LV') && (tb === 'SIEMENS' || tb === 'SIEMENS LV')) return true;
    return false;
  });
}

function getPhysicalSortPriority(p: ProductItem): number {
  const status = getProductPhysicalStatus(p);
  if (status === 'LOCAL_STOCK') return 1;
  if (status === 'SHOWROOM') return 2;
  if (status === 'REMOTE_STOCK') return 3;
  if (status === 'DISCOUNT') return 4;
  return 5;
}

export function CatalogView({
  initialProducts,
  allCategoryProducts,
  categorySlug,
  categoryTitle,
  categoryDescription,
  initialBrand,
  initialCategorySlug,
  initialPage,
  searchQuery,
  brandDetails,
  subcategoryLinks,
  breadcrumbs,
  facetLinks,
  activeFacetSlug,
  facetAllCount,
}: CatalogViewProps = {}) {
  const searchParams = useSearchParams();
  const { openModal } = useStore();
  const activeSearchQuery = (searchQuery || searchParams.get('q') || '').trim();

  const rawProducts = useMemo(() => {
    if (initialProducts !== undefined) return initialProducts;
    return CATALOG_PRODUCTS;
  }, [initialProducts]);

  // Dedicated brand page: /catalog?brand=BOSCH (no categorySlug provided)
  // Category page with brand filter: /catalog/[category]?brand=SMEG (categorySlug is provided)
  const isDedicatedBrandPage = Boolean(initialBrand && !categorySlug);
  const [lockedBrand, setLockedBrand] = useState<string | null>(initialBrand || null);

  // Brand mode calculations & category discovery (only on dedicated brand landing pages)
  const brandCategories = useMemo(() => {
    if (!isDedicatedBrandPage || !initialBrand) return [];
    return getBrandCategoriesFromProducts(rawProducts, initialBrand);
  }, [isDedicatedBrandPage, initialBrand, rawProducts]);

  const brandInfo = useMemo(() => {
    if (!isDedicatedBrandPage || !initialBrand) return null;
    return getBrandInfo(initialBrand);
  }, [isDedicatedBrandPage, initialBrand]);

  const categoryParam = searchParams.get('category') || initialCategorySlug;
  const flagshipSlug = useMemo(() => {
    return initialBrand ? getBrandFlagshipCategory(initialBrand) : null;
  }, [initialBrand]);

  const [activeCategorySlug, setActiveCategorySlug] = useState<string>(() => {
    if (categorySlug) return categorySlug;
    if (categoryParam) return categoryParam;
    if (flagshipSlug && brandCategories.some((c) => c.slug === flagshipSlug)) return flagshipSlug;
    if (isDedicatedBrandPage && brandCategories.length > 0) return brandCategories[0].slug;
    return '';
  });

  // Keep activeCategorySlug synced if URL searchParams or brandCategories change (only in brand mode)
  useEffect(() => {
    if (isDedicatedBrandPage && initialBrand) {
      const qCat = searchParams.get('category') || initialCategorySlug;
      if (qCat) {
        setActiveCategorySlug(qCat);
      } else if (flagshipSlug && brandCategories.some((c) => c.slug === flagshipSlug)) {
        setActiveCategorySlug(flagshipSlug);
      } else if (brandCategories.length > 0 && (!activeCategorySlug || !brandCategories.some((c) => c.slug === activeCategorySlug))) {
        setActiveCategorySlug(brandCategories[0].slug);
      }
    }
  }, [searchParams, initialCategorySlug, isDedicatedBrandPage, initialBrand, brandCategories, activeCategorySlug, flagshipSlug]);

  const currentBrandCategory = useMemo(() => {
    if (!isDedicatedBrandPage || !initialBrand) return null;
    return brandCategories.find((c) => c.slug === activeCategorySlug) || brandCategories[0] || null;
  }, [isDedicatedBrandPage, initialBrand, brandCategories, activeCategorySlug]);

  const initialUrlParsed = useMemo(() => {
    return parseCatalogQueryParams(searchParams);
  }, []); // Run once on mount

  const isCustomPriceRef = useRef(Boolean(initialUrlParsed.filters?.priceMin !== undefined || initialUrlParsed.filters?.priceMax !== undefined));

  const presenceParam = searchParams.get('presence');
  const [activePhysicalTab, setActivePhysicalTab] = useState<PhysicalTabType>(() => {
    if (initialUrlParsed.activePhysicalTab) return initialUrlParsed.activePhysicalTab;
    if (presenceParam === 'discount') return 'DISCOUNT';
    if (presenceParam === 'showroom') return 'SHOWROOM';
    if (presenceParam === 'stock' || presenceParam === 'local_stock') return 'LOCAL_STOCK';
    if (presenceParam === 'remote' || presenceParam === 'remote_stock') return 'REMOTE_STOCK';
    if (presenceParam === 'order' || presenceParam === 'on_order') return 'ON_ORDER';
    return 'ALL';
  });

  // Keep activePhysicalTab in sync if presence search param changes
  useEffect(() => {
    const p = searchParams.get('presence');
    if (!p) {
      if (activePhysicalTab !== 'ALL') setActivePhysicalTab('ALL');
    } else {
      if (p === 'discount' && activePhysicalTab !== 'DISCOUNT') setActivePhysicalTab('DISCOUNT');
      else if (p === 'showroom' && activePhysicalTab !== 'SHOWROOM') setActivePhysicalTab('SHOWROOM');
      else if ((p === 'stock' || p === 'local_stock') && activePhysicalTab !== 'LOCAL_STOCK') setActivePhysicalTab('LOCAL_STOCK');
      else if ((p === 'remote' || p === 'remote_stock') && activePhysicalTab !== 'REMOTE_STOCK') setActivePhysicalTab('REMOTE_STOCK');
      else if ((p === 'order' || p === 'on_order') && activePhysicalTab !== 'ON_ORDER') setActivePhysicalTab('ON_ORDER');
    }
  }, [searchParams]);

  // Products currently in scope for browsing and sidebar facets
  const categoryProducts = useMemo(() => {
    if (isDedicatedBrandPage && activeCategorySlug) {
      return rawProducts.filter((p) => isProductInCategory(p, activeCategorySlug));
    }
    return rawProducts;
  }, [isDedicatedBrandPage, activeCategorySlug, rawProducts]);

  const [sort, setSort] = useState<SortOption>(() => initialUrlParsed.sort || 'popular');
  const [viewMode, setViewMode] = useState<ViewMode>(() => initialUrlParsed.viewMode || 'grid');
  const [currentPage, setCurrentPage] = useState<number>(() => {
    const raw = initialPage ?? initialUrlParsed.currentPage ?? Number(searchParams.get('page') || '1');
    return Number.isFinite(raw) && raw >= 1 ? Math.floor(raw) : 1;
  });

  const handlePageSelect = (nextPage: number) => {
    setCurrentPage(nextPage);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 260, behavior: 'smooth' });
    }
  };
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [techFilter, setTechFilter] = useState<{ query: string; label: string } | null>(null);

  const handleSelectSeries = (query: string) => {
    setTechFilter({ query, label: `Линейка: ${query}` });
    setCurrentPage(1);
    const el = document.getElementById('brand-catalog');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSelectTechnology = (query: string, categorySlug?: string) => {
    setTechFilter({ query, label: `Технология: ${query}` });
    if (categorySlug && brandCategories.some((c) => c.slug === categorySlug)) {
      setActiveCategorySlug(categorySlug);
    }
    setCurrentPage(1);
    const el = document.getElementById('brand-catalog');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleClearTechFilter = () => {
    setTechFilter(null);
    setCurrentPage(1);
  };

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

  const [filters, setFilters] = useState<FilterState>(() => {
    const defaultBrands = brandParam ? [brandParam] : [];
    const parsedBrands = initialUrlParsed.filters?.selectedBrands;
    return {
      selectedGroups: initialUrlParsed.filters?.selectedGroups || [],
      selectedPromos: initialUrlParsed.filters?.selectedPromos || [],
      selectedBrands: parsedBrands && parsedBrands.length > 0 ? parsedBrands : defaultBrands,
      priceMin: initialUrlParsed.filters?.priceMin ?? priceBounds.min,
      priceMax: initialUrlParsed.filters?.priceMax ?? priceBounds.max,
      selectedWidth: null,
      selectedColor: null,
      selectedFeatures: initialUrlParsed.filters?.selectedFeatures || {},
    };
  });

  const effectiveFilterBrands = useMemo(() => {
    return filters.selectedBrands.length > 0
      ? filters.selectedBrands
      : lockedBrand
      ? [lockedBrand]
      : [];
  }, [filters.selectedBrands, lockedBrand]);

  // Unified disjunctive filter matcher so sidebar facets and counts stay 100% synchronized with active selection
  const matchesFilterCriteria = useMemo(() => {
    return (product: ProductItem, omitDimension?: 'groups' | 'promos' | 'brands' | 'presence' | string) => {
      if (omitDimension !== 'presence' && activePhysicalTab !== 'ALL') {
        if (getProductPhysicalStatus(product) !== activePhysicalTab) {
          return false;
        }
      }

      if (omitDimension !== 'groups' && filters.selectedGroups && filters.selectedGroups.length > 0) {
        const pGroup = getProductGroup(product);
        if (!filters.selectedGroups.includes(pGroup)) {
          return false;
        }
      }

      if (omitDimension !== 'promos' && filters.selectedPromos.length > 0) {
        const matchesPromo = filters.selectedPromos.some((promoSlug) =>
          isProductInPromo(product, promoSlug)
        );
        if (!matchesPromo) return false;
      }

      if (omitDimension !== 'brands' && effectiveFilterBrands.length > 0) {
        if (!matchesBrandList(product, effectiveFilterBrands)) {
          return false;
        }
      }

      if (product.price < filters.priceMin || product.price > filters.priceMax) {
        return false;
      }

      if (filters.selectedFeatures && Object.keys(filters.selectedFeatures).length > 0) {
        for (const [label, vals] of Object.entries(filters.selectedFeatures)) {
          if (omitDimension === label || !vals || vals.length === 0) continue;
          if (!matchProductFeature(product, label, vals)) {
            return false;
          }
        }
      }

      if (techFilter?.query) {
        const q = techFilter.query.toLowerCase();
        const matches =
          product.name.toLowerCase().includes(q) ||
          (product.description || '').toLowerCase().includes(q) ||
          (product.shortDesc || '').toLowerCase().includes(q) ||
          (product.features || []).some((f) => (f.label + ' ' + f.value).toLowerCase().includes(q));
        if (!matches) return false;
      }

      return true;
    };
  }, [activePhysicalTab, filters, effectiveFilterBrands, techFilter]);

  // Dynamic product groups from 1C column C / canonical titles (disjunctively filtered by brand, presence, and features)
  const availableGroups = useMemo(() => {
    const matchingForGroups = categoryProducts.filter((p) => matchesFilterCriteria(p, 'groups'));
    const groups = getCategoryProductGroups(matchingForGroups);
    if (filters.selectedGroups && filters.selectedGroups.length > 0) {
      const existingNames = new Set(groups.map((g) => g.name));
      filters.selectedGroups.forEach((sg) => {
        if (!existingNames.has(sg)) {
          groups.push({ id: sg, name: sg, count: 0 });
        }
      });
    }
    return groups;
  }, [categoryProducts, matchesFilterCriteria, filters.selectedGroups]);

  // Keep price filter aligned with category price bounds on mount/category change (unless user customized price)
  useEffect(() => {
    if (!isCustomPriceRef.current) {
      setFilters((prev) => ({
        ...prev,
        priceMin: priceBounds.min,
        priceMax: priceBounds.max,
      }));
    }
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
    const b = searchParams.get('brand');
    if (b && !filters.selectedBrands.some((sb) => sb.toUpperCase() === b.toUpperCase())) {
      setFilters((prev) => ({
        ...prev,
        selectedBrands: [b],
      }));
      setLockedBrand(b);
    }
  }, [searchParams]);

  // Session & Scroll Restoration on Mount
  const isSessionRestoredRef = useRef(false);
  useEffect(() => {
    if (isSessionRestoredRef.current) return;
    isSessionRestoredRef.current = true;

    const targetCat = categorySlug || activeCategorySlug;
    if (!targetCat || typeof window === 'undefined') return;

    // Check if current URL does not have filter query parameters, but we have a saved category session
    const currentHasQuery = window.location.search && window.location.search.length > 1;
    const sess = getCatalogCategorySession(targetCat);

    if (!currentHasQuery && sess?.url && sess.url.includes('?')) {
      const qIndex = sess.url.indexOf('?');
      const qStr = sess.url.slice(qIndex);
      const urlParams = new URLSearchParams(qStr);
      const parsed = parseCatalogQueryParams(urlParams, priceBounds);

      if (parsed.filters) {
        if (parsed.filters.priceMin !== undefined || parsed.filters.priceMax !== undefined) {
          isCustomPriceRef.current = true;
        }
        setFilters((prev) => ({
          ...prev,
          ...parsed.filters,
          priceMin: parsed.filters?.priceMin ?? prev.priceMin,
          priceMax: parsed.filters?.priceMax ?? prev.priceMax,
        }));
      }
      if (parsed.activePhysicalTab) {
        setActivePhysicalTab(parsed.activePhysicalTab);
      }
      if (parsed.sort) {
        setSort(parsed.sort);
      }
      if (parsed.viewMode) {
        setViewMode(parsed.viewMode);
      }
      if (parsed.currentPage) {
        setCurrentPage(parsed.currentPage);
      }

      window.history.replaceState(null, '', sess.url);
    }

    // Scroll restoration to last clicked product card or saved scroll offset
    if (sess) {
      const targetProductId = sess.lastProductId;
      const savedScrollY = sess.scrollY;

      const timer = setTimeout(() => {
        if (targetProductId) {
          const el = document.getElementById(`product-${targetProductId}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
          }
        }
        if (savedScrollY !== undefined && savedScrollY > 0) {
          window.scrollTo({ top: savedScrollY, behavior: 'smooth' });
        }
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [categorySlug, activeCategorySlug, priceBounds]);

  // Listen to popstate (browser Back / Forward navigation)
  useEffect(() => {
    const handlePopState = () => {
      const currentSearchParams = new URLSearchParams(window.location.search);
      const parsed = parseCatalogQueryParams(currentSearchParams, priceBounds);
      if (parsed.filters) {
        if (parsed.filters.priceMin !== undefined || parsed.filters.priceMax !== undefined) {
          isCustomPriceRef.current = true;
        }
        setFilters((prev) => ({
          ...prev,
          ...parsed.filters,
          priceMin: parsed.filters?.priceMin ?? prev.priceMin,
          priceMax: parsed.filters?.priceMax ?? prev.priceMax,
        }));
      }
      if (parsed.activePhysicalTab !== undefined) {
        setActivePhysicalTab(parsed.activePhysicalTab);
      } else {
        setActivePhysicalTab('ALL');
      }
      if (parsed.sort) setSort(parsed.sort);
      if (parsed.viewMode) setViewMode(parsed.viewMode);
      if (parsed.currentPage) setCurrentPage(parsed.currentPage);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [priceBounds]);

  // Real-time synchronization to URL query parameters & sessionStorage
  const isInitialSyncMounted = useRef(false);
  useEffect(() => {
    if (!isInitialSyncMounted.current) {
      isInitialSyncMounted.current = true;
      return;
    }

    const targetCat = categorySlug || activeCategorySlug;
    if (typeof window === 'undefined') return;

    const queryString = buildCatalogQueryString({
      categorySlug: targetCat,
      filters,
      activePhysicalTab,
      sort,
      viewMode,
      currentPage,
      priceBounds,
      baseSearchParams: new URLSearchParams(window.location.search),
    });

    const pathname = window.location.pathname;
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    const currentFullUrl = window.location.pathname + (window.location.search || '');

    if (newUrl !== currentFullUrl) {
      window.history.replaceState(null, '', newUrl);
    }

    if (targetCat) {
      saveCatalogCategorySession(targetCat, {
        url: newUrl,
        scrollY: window.scrollY,
      });
    }
  }, [
    filters,
    activePhysicalTab,
    sort,
    viewMode,
    currentPage,
    categorySlug,
    activeCategorySlug,
    priceBounds,
  ]);

  const handleRemoveBrand = (brandToRemove: string) => {
    setLockedBrand((prev) => (prev && prev.toUpperCase() === brandToRemove.toUpperCase() ? null : prev));
    setFilters((prev) => ({
      ...prev,
      selectedBrands: prev.selectedBrands.filter((b) => b.toUpperCase() !== brandToRemove.toUpperCase()),
    }));
    setCurrentPage(1);
  };

  const handleUnlockBrand = () => {
    if (isDedicatedBrandPage) {
      window.location.href = '/catalog';
      return;
    }
    setLockedBrand(null);
    setFilters((prev) => ({
      ...prev,
      selectedBrands: [],
    }));
    setCurrentPage(1);
  };

  const handlePresenceTabSelect = (tab: PhysicalTabType) => {
    setActivePhysicalTab(tab);
    setCurrentPage(1);
  };

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
  };

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    if (newFilters.priceMin !== undefined || newFilters.priceMax !== undefined) {
      isCustomPriceRef.current = true;
    }
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    isCustomPriceRef.current = false;
    setFilters({
      selectedGroups: [],
      selectedPromos: [],
      selectedBrands: lockedBrand ? [lockedBrand] : [],
      priceMin: priceBounds.min,
      priceMax: priceBounds.max,
      selectedWidth: null,
      selectedColor: null,
      selectedFeatures: {},
    });
    setActivePhysicalTab('ALL');
    setCurrentPage(1);
    setSort('popular');

    const targetCat = categorySlug || activeCategorySlug;
    if (targetCat) {
      clearCatalogCategorySession(targetCat);
    }

    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  // Listen for menu clean navigation event
  useEffect(() => {
    const handleCategoryResetEvent = (e: Event) => {
      const customEvt = e as CustomEvent<{ categorySlug?: string }>;
      const targetCat = categorySlug || activeCategorySlug;
      if (!customEvt.detail?.categorySlug || customEvt.detail.categorySlug === targetCat) {
        handleResetFilters();
      }
    };
    window.addEventListener('simona_clear_catalog_session', handleCategoryResetEvent);
    return () => window.removeEventListener('simona_clear_catalog_session', handleCategoryResetEvent);
  }, [categorySlug, activeCategorySlug, priceBounds, lockedBrand]);

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

  // Dynamic category facets calculation based on current selection (disjunctive per facet label)
  const categoryFacets = useMemo(() => {
    const brandScopedProducts =
      effectiveFilterBrands.length > 0
        ? categoryProducts.filter((p) => matchesBrandList(p, effectiveFilterBrands))
        : categoryProducts;
    const baseFacets = getCategoryFacets(brandScopedProducts, 16);

    return baseFacets
      .map((facet) => {
        const subset = categoryProducts.filter((p) => matchesFilterCriteria(p, facet.label));
        const selectedForFacet = filters.selectedFeatures?.[facet.label] || [];
        const options = facet.options
          .map((opt) => {
            const count = subset.filter((p) => matchProductFeature(p, facet.label, [opt.value])).length;
            return { value: opt.value, count };
          })
          .filter((opt) => opt.count > 0 || selectedForFacet.includes(opt.value));

        const totalCount = options.reduce((sum, o) => sum + o.count, 0);
        return {
          label: facet.label,
          totalCount,
          options,
        };
      })
      .filter((f) => f.options.length > 0);
  }, [categoryProducts, effectiveFilterBrands, matchesFilterCriteria, filters.selectedFeatures]);

  // Dynamic promo count calculation for current category, brand, and tab (Zero Dead Ends)
  const promoCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    const subset = categoryProducts.filter((p) => matchesFilterCriteria(p, 'promos'));
    MANUFACTURER_PROMOS.forEach((promo) => {
      const count = subset.filter((product) => isProductInPromo(product, promo.slug)).length;
      counts[promo.slug] = count;
    });
    return counts;
  }, [categoryProducts, matchesFilterCriteria]);

  // Dynamic brand list with real counts for the category and active filters
  const availableBrands = useMemo(() => {
    const counts: Record<string, number> = {};
    const subset = categoryProducts.filter((p) => matchesFilterCriteria(p, 'brands'));
    subset.forEach((p) => {
      const b = p.brand?.trim() || 'СИМОНА';
      counts[b] = (counts[b] || 0) + 1;
    });
    effectiveFilterBrands.forEach((eb) => {
      const matchKey = Object.keys(counts).find((k) => k.toUpperCase() === eb.trim().toUpperCase());
      if (!matchKey) {
        counts[eb.trim()] = 0;
      }
    });
    return Object.entries(counts)
      .map(([id, count]) => ({ id, name: id, count }))
      .sort((a, b) => b.count - a.count);
  }, [categoryProducts, matchesFilterCriteria, effectiveFilterBrands]);

  const brandCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    availableBrands.forEach((b) => {
      counts[b.id] = b.count;
      counts[b.id.toUpperCase()] = b.count;
    });
    return counts;
  }, [availableBrands]);

  // Reactive SEO collection chips ("Подборки:") synchronized with client-side brand filter
  const { dynamicFacetLinks, dynamicFacetAllCount, dynamicFacetAllHref } = useMemo(() => {
    if (!facetLinks || !categorySlug) {
      return {
        dynamicFacetLinks: facetLinks,
        dynamicFacetAllCount: facetAllCount,
        dynamicFacetAllHref: undefined,
      };
    }
    const baseAll = allCategoryProducts || categoryProducts;
    const brandScopedAll =
      effectiveFilterBrands.length > 0
        ? baseAll.filter((p) => matchesBrandList(p, effectiveFilterBrands))
        : baseAll;

    const singleBrand = effectiveFilterBrands.length === 1 ? effectiveFilterBrands[0].trim().toUpperCase() : undefined;
    const qs = new URLSearchParams();
    if (singleBrand) {
      qs.set('brand', singleBrand);
    }
    const queryStr = qs.toString();
    const allHref = `/catalog/${categorySlug}${queryStr ? `?${queryStr}` : ''}`;

    const defs = getFacetsByCategory(categorySlug);
    if (defs.length === 0) {
      return {
        dynamicFacetLinks: facetLinks,
        dynamicFacetAllCount: brandScopedAll.length,
        dynamicFacetAllHref: allHref,
      };
    }

    const computedLinks: CategoryFacetLinkItem[] = defs
      .map((def) => {
        const count = brandScopedAll.filter((p) => def.filter(p)).length;
        return {
          shortTitle: def.shortTitle,
          facetSlug: def.facetSlug,
          count,
          href: `/catalog/${categorySlug}/${def.facetSlug}${queryStr ? `?${queryStr}` : ''}`,
          isActive: def.facetSlug === activeFacetSlug,
        };
      })
      .filter((item) => (item.count ?? 0) >= 3 || item.isActive);

    return {
      dynamicFacetLinks: computedLinks,
      dynamicFacetAllCount: brandScopedAll.length,
      dynamicFacetAllHref: allHref,
    };
  }, [facetLinks, facetAllCount, categorySlug, allCategoryProducts, categoryProducts, effectiveFilterBrands, activeFacetSlug]);

  // 1. Products filtered by sidebar criteria (groups, promos, brands, price, dynamic facets) - WITHOUT physical presence tab
  const sidebarFilteredProducts = useMemo(() => {
    return categoryProducts.filter((product) => matchesFilterCriteria(product, 'presence'));
  }, [categoryProducts, matchesFilterCriteria]);

  // 2. Dynamic presence counts based on current sidebar filters (Zero Dead Ends reactivity)
  const presenceCounts = useMemo(() => {
    let showroom = 0;
    let localStock = 0;
    let discount = 0;
    let remoteStock = 0;
    let onOrder = 0;

    sidebarFilteredProducts.forEach((p) => {
      const status = getProductPhysicalStatus(p);
      if (status === 'DISCOUNT') discount++;
      else if (status === 'SHOWROOM') showroom++;
      else if (status === 'LOCAL_STOCK') localStock++;
      else if (status === 'REMOTE_STOCK') remoteStock++;
      else onOrder++;
    });

    return {
      ALL: sidebarFilteredProducts.length,
      LOCAL_STOCK: localStock,
      SHOWROOM: showroom,
      DISCOUNT: discount,
      REMOTE_STOCK: remoteStock,
      ON_ORDER: onOrder,
    };
  }, [sidebarFilteredProducts]);

  // 3. Final filtered and sorted products (strictly unified with getProductPhysicalStatus)
  const filteredProducts = useMemo(() => {
    const base = sidebarFilteredProducts.filter((product) => {
      if (activePhysicalTab === 'ALL') return true;
      return getProductPhysicalStatus(product) === activePhysicalTab;
    });

    // If active search query and default sort, preserve search relevance (SKU -> article -> showroom/warehouse)
    if (activeSearchQuery && sort === 'popular') {
      return base;
    }

    return [...base].sort((a, b) => {
      if (sort === 'popular') {
        const prioDiff = getPhysicalSortPriority(a) - getPhysicalSortPriority(b);
        if (prioDiff !== 0) return prioDiff;
        const featDiff = (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
        if (featDiff !== 0) return featDiff;
        return b.price - a.price;
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
  }, [sidebarFilteredProducts, activePhysicalTab, sort, activeSearchQuery]);

  // Client-side pagination
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredProducts.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredProducts, currentPage]);

  const baseCategoryTitle = useMemo(() => {
    if (!categoryTitle) return 'Каталог техники';
    if (initialBrand && categoryTitle.toUpperCase().endsWith(initialBrand.toUpperCase())) {
      return categoryTitle.slice(0, -initialBrand.length).trim();
    }
    return categoryTitle;
  }, [categoryTitle, initialBrand]);

  const dynamicTitle = useMemo(() => {
    if (isDedicatedBrandPage && lockedBrand) {
      const catName = currentBrandCategory?.menuTitle || currentBrandCategory?.title || 'Техника';
      return `${catName} ${formatBrandName(lockedBrand)}`;
    }
    if (filters.selectedBrands.length === 1) {
      const b = filters.selectedBrands[0];
      const brandFormatted = formatBrandName(b);
      const brandRegex = new RegExp(`\\b${brandFormatted}\\b`, 'i');
      if (brandRegex.test(baseCategoryTitle)) {
        return baseCategoryTitle;
      }
      if (baseCategoryTitle.includes(' в Нижнем Новгороде')) {
        return baseCategoryTitle.replace(' в Нижнем Новгороде', ` ${brandFormatted} в Нижнем Новгороде`);
      }
      return `${baseCategoryTitle} ${brandFormatted}`;
    }
    return baseCategoryTitle;
  }, [baseCategoryTitle, filters.selectedBrands, lockedBrand, isDedicatedBrandPage, currentBrandCategory]);

  const dynamicDescription = useMemo(() => {
    if (isDedicatedBrandPage && initialBrand) {
      if (brandInfo?.heroText) {
        return brandInfo.heroText;
      }
      return `Официальная бытовая техника ${formatBrandName(initialBrand)}. Сертифицированная европейская продукция с гарантией производителя в салонах «СИМОНА».`;
    }
    return categoryDescription;
  }, [isDedicatedBrandPage, initialBrand, brandInfo, categoryDescription]);

  return (
    <div className="bg-[#111315] min-h-screen text-white">
      {brandDetails ? (
        <>
          <BrandShowcaseHero
            brand={brandDetails}
            totalProductsCount={rawProducts.length}
            onSelectSeries={handleSelectSeries}
            onSelectTechnology={handleSelectTechnology}
          />

          {/* Dual-bar category & presence inventory controls: exactly like catalog?brand=ASKO */}
          <div id="brand-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-3">
            {/* Row 1: Brand Category Nav */}
            {brandCategories && brandCategories.length > 0 && (
              <BrandCategoryNav
                categories={brandCategories}
                activeCategorySlug={activeCategorySlug || brandCategories[0].slug}
                onSelectCategory={handleCategorySelect}
              />
            )}

            {/* Row 2: Inventory Presence Tabs */}
            <div className="relative inline-flex flex-wrap items-center p-1 rounded-xl bg-[#16191D] border border-[#2B313A] gap-1">
              {[
                { id: 'ALL' as const, label: 'Все', count: presenceCounts.ALL },
                { id: 'LOCAL_STOCK' as const, label: 'На складе', count: presenceCounts.LOCAL_STOCK },
                  { id: 'SHOWROOM' as const, label: 'На витрине', count: presenceCounts.SHOWROOM },
                { id: 'DISCOUNT' as const, label: 'Уценка', count: presenceCounts.DISCOUNT },
                { id: 'REMOTE_STOCK' as const, label: 'На удаленном складе', count: presenceCounts.REMOTE_STOCK },
                { id: 'ON_ORDER' as const, label: 'Под заказ', count: presenceCounts.ON_ORDER },
              ]
                .filter((tab) => tab.id === 'ALL' || tab.count > 0)
                .map((tab) => {
                  const isActive = activePhysicalTab === tab.id;
                  const isDiscount = tab.id === 'DISCOUNT';
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handlePresenceTabSelect(tab.id)}
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
                          layoutId="presenceActiveTabBrandDetails"
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

            {/* Active Tech / Series Filter Pill if selected */}
            {techFilter && (
              <div className="pt-2 flex items-center gap-2">
                <span className="text-xs text-[#87888A]">Активный фильтр:</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#1E2228] border border-simona-teal/50 text-xs font-semibold text-white">
                  <span>{techFilter.label}</span>
                  <button
                    type="button"
                    onClick={handleClearTechFilter}
                    aria-label="Сбросить фильтр по технологии"
                    className="p-0.5 hover:bg-[#252A32] rounded text-[#87888A] hover:text-white transition cursor-pointer"
                  >
                    <SimonaIconClose className="w-3 h-3" />
                  </button>
                </span>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {/* 1. Category Hero Block with raised Brand Categories Switcher */}
          <CatalogHero
            activePhysicalTab={activePhysicalTab}
            onSelectPhysicalTab={handlePresenceTabSelect}
            totalCount={presenceCounts[activePhysicalTab as PhysicalTabType] ?? presenceCounts.ALL}
            presenceCounts={presenceCounts}
            categoryTitle={dynamicTitle}
            categorySlug={activeCategorySlug || categorySlug}
            categoryDescription={dynamicDescription}
            brandName={isDedicatedBrandPage && lockedBrand ? formatBrandName(lockedBrand) : undefined}
            brandCategories={isDedicatedBrandPage ? brandCategories : undefined}
            activeCategorySlug={activeCategorySlug}
            onSelectCategory={handleCategorySelect}
            subcategoryLinks={subcategoryLinks}
            breadcrumbs={breadcrumbs}
            facetLinks={dynamicFacetLinks}
            activeFacetSlug={activeFacetSlug}
            facetAllCount={dynamicFacetAllCount}
            facetAllHref={dynamicFacetAllHref}
          />

          {/* 1.5. Inventory Presence Tabs for Brand Page (lowered below Hero per user request) */}
          {isDedicatedBrandPage && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-[#87888A] font-medium shrink-0 w-20">
                  Наличие:
                </span>
                <div className="relative inline-flex flex-wrap items-center p-1 rounded-xl bg-[#16191D] border border-[#2B313A] gap-1">
                {[
                  { id: 'ALL' as const, label: 'Все', count: presenceCounts.ALL },
                  { id: 'SHOWROOM' as const, label: 'На витрине', count: presenceCounts.SHOWROOM },
                  { id: 'LOCAL_STOCK' as const, label: 'На складе', count: presenceCounts.LOCAL_STOCK },
                  { id: 'DISCOUNT' as const, label: 'Уценка', count: presenceCounts.DISCOUNT },
                  { id: 'REMOTE_STOCK' as const, label: 'На удаленном складе', count: presenceCounts.REMOTE_STOCK },
                  { id: 'ON_ORDER' as const, label: 'Под заказ', count: presenceCounts.ON_ORDER },
                ]
                  .filter((tab) => tab.id === 'ALL' || tab.count > 0)
                  .map((tab) => {
                    const isActive = activePhysicalTab === tab.id;
                    const isDiscount = tab.id === 'DISCOUNT';
                    return (
                      <button
                        key={tab.id}
                        onClick={() => handlePresenceTabSelect(tab.id)}
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
                            layoutId="presenceActiveTabBrand"
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
            </div>
          )}
        </>
      )}

      {/* 2. Main Catalog Workspace: Split-Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        {/* Search Query Active Banner (Task 2.4.3) */}
        {activeSearchQuery && (
          <div className="mb-6 p-4 rounded-2xl bg-[#16191D] border border-simona-teal/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-simona-teal/15 border border-simona-teal/30 flex items-center justify-center text-simona-teal shrink-0">
                <SimonaIconSearch className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">
                  Результаты поиска по запросу: «<span className="text-simona-teal">{activeSearchQuery}</span>» — найдено{' '}
                  <span className="font-mono font-bold text-white">{filteredProducts.length}</span> товаров
                </div>
                <div className="text-xs text-[#87888A]">
                  Отсортировано по совпадению кода 1С, заводского артикула и физическому наличию в Нижнем Новгороде
                </div>
              </div>
            </div>
            <Link
              href="/catalog"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#1E2228] hover:bg-[#252A32] border border-[#2B313A] text-xs font-semibold text-[#D7D9DB] hover:text-white transition shrink-0"
            >
              <SimonaIconClose className="w-3.5 h-3.5" />
              <span>Сбросить поиск</span>
            </Link>
          </div>
        )}

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
              brandLock={lockedBrand ? lockedBrand.toUpperCase() : undefined}
              onUnlockBrand={handleUnlockBrand}
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
              onRemoveBrand={handleRemoveBrand}
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
              isBrandPage={isDedicatedBrandPage}
            />

            {/* Active Promo Chips per AGENTS.md 8.2 & Grill-me Alignment */}
            {filters.selectedPromos.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-5 p-3 bg-simona-wine/10 border border-simona-wine/30 rounded-xl animate-fade-in">
                <div className="flex items-center gap-1.5 text-xs text-simona-wine-light font-semibold">
                  <span className="w-1.5 h-1.5 rounded-md bg-simona-wine" />
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
                        type="button"
                        onClick={() => {
                          const next = filters.selectedPromos.filter((s) => s !== slug);
                          handleFilterChange({ selectedPromos: next });
                        }}
                        className="hover:bg-white/20 rounded-md p-0.5 transition-colors cursor-pointer shrink-0"
                        aria-label={`Удалить фильтр ${promo.title}`}
                      >
                        <SimonaIconClose className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}
                <button
                  type="button"
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
                      categorySlug={categorySlug || activeCategorySlug}
                      selectedPromos={filters.selectedPromos}
                    />
                  ) : (
                    <LuxuryProductListCard
                      key={product.id}
                      product={product}
                      categorySlug={categorySlug || activeCategorySlug}
                      selectedPromos={filters.selectedPromos}
                    />
                  )
                )}
              </motion.div>
            ) : (
              <div className="py-16 text-left rounded-2xl bg-[#16191D] border border-[#2B313A] p-8">
                <p className="text-white text-base font-semibold mb-2">
                  По выбранным параметрам приборов не найдено
                </p>
                <p className="text-xs text-[#87888A] mb-5">
                  Попробуйте сбросить некоторые фильтры или выбрать другой диапазон цен
                </p>
                <button
                  type="button"
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
                onPageChange={handlePageSelect}
                onLoadMore={() => {
                  if (currentPage < totalPages) {
                    handlePageSelect(currentPage + 1);
                  }
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* 2.5. Dedicated Brand Consultation & Kitchen Spec Banner */}
      {brandDetails && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="bg-[#16191D] border border-[#2B313A] rounded-2xl p-6 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6 text-left shadow-lg">
            <div className="max-w-2xl space-y-2">
              <h3 className="text-xl sm:text-2xl font-montserrat font-bold text-white tracking-tight">
                Комплексный подбор бытовой техники {brandDetails.name}
              </h3>
              <p className="text-xs sm:text-sm text-[#87888A] leading-relaxed font-normal">
                Эксперты сети салонов «СИМОНА» на ул. Белинского 15 и 11/66 рассчитают техническую спецификацию под ваш гарнитур, проверят зазоры встройки и предложат оптимальную выгоду на комплект.
              </p>
            </div>
            <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
              <button
                type="button"
                onClick={() => openModal('SHOWROOM_VISIT', { preferredShowroom: 'BELINSKOGO_15' })}
                className="px-5 py-3 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-semibold tracking-wide transition shadow-lg shadow-simona-teal/20 cursor-pointer"
              >
                Записаться в салон
              </button>
              <button
                type="button"
                onClick={() => openModal('EQUIPMENT_SELECTION')}
                className="px-5 py-3 rounded-xl bg-[#1E2228] hover:bg-[#252A32] text-white border border-[#2B313A] hover:border-simona-teal/50 text-xs font-semibold tracking-wide transition cursor-pointer"
              >
                Запросить спецификацию
              </button>
            </div>
          </div>
        </div>
      )}

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
        brandLock={lockedBrand ? lockedBrand.toUpperCase() : undefined}
        onUnlockBrand={handleUnlockBrand}
      />
    </div>
  );
}

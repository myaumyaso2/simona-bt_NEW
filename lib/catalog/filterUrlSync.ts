'use client';

import { FilterState } from '@/components/catalog/CatalogSidebar';
import { PhysicalTabType } from '@/components/catalog/CatalogHero';
import { SortOption, ViewMode } from '@/components/catalog/CatalogToolbar';

export interface CatalogSessionData {
  url: string;
  scrollY?: number;
  lastProductId?: string;
  timestamp: number;
}

export interface ParsedCatalogUrlState {
  filters?: Partial<FilterState>;
  activePhysicalTab?: PhysicalTabType;
  sort?: SortOption;
  viewMode?: ViewMode;
  currentPage?: number;
}

const SESSION_PREFIX = 'simona_cat_session_';

export function getCategorySessionKey(categorySlug: string): string {
  return `${SESSION_PREFIX}${categorySlug.toLowerCase().trim()}`;
}

export function saveCatalogCategorySession(
  categorySlug: string,
  data: Partial<CatalogSessionData> & { url: string }
): void {
  if (typeof window === 'undefined' || !categorySlug) return;
  try {
    const existing = getCatalogCategorySession(categorySlug);
    const payload: CatalogSessionData = {
      url: data.url,
      scrollY: data.scrollY !== undefined ? data.scrollY : existing?.scrollY,
      lastProductId: data.lastProductId !== undefined ? data.lastProductId : existing?.lastProductId,
      timestamp: Date.now(),
    };
    sessionStorage.setItem(getCategorySessionKey(categorySlug), JSON.stringify(payload));
  } catch (err) {
    // Fallback if sessionStorage is disabled/quota exceeded
  }
}

export function getCatalogCategorySession(categorySlug: string): CatalogSessionData | null {
  if (typeof window === 'undefined' || !categorySlug) return null;
  try {
    const raw = sessionStorage.getItem(getCategorySessionKey(categorySlug));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.url === 'string') {
      return parsed as CatalogSessionData;
    }
  } catch (err) {
    // Fallback
  }
  return null;
}

export function clearCatalogCategorySession(categorySlug?: string): void {
  if (typeof window === 'undefined') return;
  try {
    if (categorySlug) {
      sessionStorage.removeItem(getCategorySessionKey(categorySlug));
    } else {
      const keys = Object.keys(sessionStorage);
      for (const k of keys) {
        if (k.startsWith(SESSION_PREFIX)) {
          sessionStorage.removeItem(k);
        }
      }
    }
  } catch (err) {
    // Fallback
  }
}

/**
 * Encodes all current active catalog filters, presence tab, sort, view mode,
 * and page into human-readable URL query parameters.
 */
export function buildCatalogQueryString(options: {
  categorySlug?: string;
  filters: FilterState;
  activePhysicalTab: PhysicalTabType;
  sort: SortOption;
  viewMode: ViewMode;
  currentPage: number;
  priceBounds?: { min: number; max: number };
  baseSearchParams?: URLSearchParams;
}): string {
  const qs = new URLSearchParams();

  // Preserve general search query if present
  const existingQ = options.baseSearchParams?.get('q');
  if (existingQ) {
    qs.set('q', existingQ);
  }

  // Preserve category param if present (e.g. on /catalog?brand=ASKO&category=...)
  const existingCategory = options.baseSearchParams?.get('category');
  if (existingCategory) {
    qs.set('category', existingCategory);
  }

  // 1. Brand(s)
  if (options.filters.selectedBrands.length > 0) {
    qs.set('brand', options.filters.selectedBrands.join(','));
  }

  // 2. Physical Presence Tab
  if (options.activePhysicalTab !== 'ALL') {
    if (options.activePhysicalTab === 'DISCOUNT') {
      qs.set('presence', 'discount');
    } else if (options.activePhysicalTab === 'LOCAL_STOCK') {
      qs.set('presence', 'stock');
    } else if (options.activePhysicalTab === 'SHOWROOM') {
      qs.set('presence', 'showroom');
    } else if (options.activePhysicalTab === 'REMOTE_STOCK') {
      qs.set('presence', 'remote');
    } else if (options.activePhysicalTab === 'ON_ORDER') {
      qs.set('presence', 'order');
    }
  }

  // 3. Product Groups (Column C / canonical titles)
  if (options.filters.selectedGroups && options.filters.selectedGroups.length > 0) {
    qs.set('group', options.filters.selectedGroups.join(';;'));
  }

  // 4. Promos
  if (options.filters.selectedPromos.length > 0) {
    qs.set('promo', options.filters.selectedPromos.join(','));
  }

  // 5. Price range (only when differing from natural bounds)
  const isMinModified = options.priceBounds && options.filters.priceMin > options.priceBounds.min;
  const isMaxModified = options.priceBounds && options.filters.priceMax < options.priceBounds.max;
  if (isMinModified || isMaxModified) {
    qs.set('price', `${Math.round(options.filters.priceMin)}-${Math.round(options.filters.priceMax)}`);
  }

  // 6. Dynamic Specification Features (e.g. f_Ширина=60 см, f_Цвет=черный)
  if (options.filters.selectedFeatures) {
    for (const [label, vals] of Object.entries(options.filters.selectedFeatures)) {
      if (vals && vals.length > 0) {
        qs.set(`f_${label}`, vals.join(';;'));
      }
    }
  }

  // 7. Sort
  if (options.sort !== 'popular') {
    qs.set('sort', options.sort);
  }

  // 8. View Mode
  if (options.viewMode !== 'grid') {
    qs.set('view', options.viewMode);
  }

  // 9. Pagination Page
  if (options.currentPage > 1) {
    qs.set('page', String(options.currentPage));
  }

  return qs.toString();
}

/**
 * Parses URL query parameters into strongly typed catalog state.
 */
export function parseCatalogQueryParams(
  searchParams: URLSearchParams,
  priceBounds?: { min: number; max: number }
): ParsedCatalogUrlState {
  const result: ParsedCatalogUrlState = {};
  const filterUpdates: Partial<FilterState> = {};

  // 1. Brands
  const rawBrand = searchParams.get('brand');
  if (rawBrand) {
    const brands = rawBrand
      .split(',')
      .map((b) => b.trim())
      .filter(Boolean);
    if (brands.length > 0) {
      filterUpdates.selectedBrands = brands;
    }
  }

  // 2. Presence
  const p = searchParams.get('presence');
  if (p) {
    if (p === 'discount') result.activePhysicalTab = 'DISCOUNT';
    else if (p === 'showroom') result.activePhysicalTab = 'SHOWROOM';
    else if (p === 'stock' || p === 'local_stock') result.activePhysicalTab = 'LOCAL_STOCK';
    else if (p === 'remote' || p === 'remote_stock') result.activePhysicalTab = 'REMOTE_STOCK';
    else if (p === 'order' || p === 'on_order') result.activePhysicalTab = 'ON_ORDER';
  }

  // 3. Groups
  const rawGroup = searchParams.get('group');
  if (rawGroup) {
    const groups = rawGroup
      .split(';;')
      .map((g) => g.trim())
      .filter(Boolean);
    if (groups.length > 0) {
      filterUpdates.selectedGroups = groups;
    }
  }

  // 4. Promos
  const rawPromo = searchParams.get('promo');
  if (rawPromo) {
    const promos = rawPromo
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (promos.length > 0) {
      filterUpdates.selectedPromos = promos;
    }
  }

  // 5. Price
  const rawPrice = searchParams.get('price');
  if (rawPrice && rawPrice.includes('-')) {
    const [pMin, pMax] = rawPrice.split('-').map((v) => parseFloat(v));
    if (!isNaN(pMin) && pMin >= 0) {
      filterUpdates.priceMin = pMin;
    }
    if (!isNaN(pMax) && pMax > 0) {
      filterUpdates.priceMax = pMax;
    }
  }

  // 6. Dynamic Features (f_<label>)
  const selectedFeatures: Record<string, string[]> = {};
  searchParams.forEach((value, key) => {
    if (key.startsWith('f_')) {
      const label = key.slice(2).trim();
      const vals = value
        .split(';;')
        .map((v) => v.trim())
        .filter(Boolean);
      if (label && vals.length > 0) {
        selectedFeatures[label] = vals;
      }
    }
  });
  if (Object.keys(selectedFeatures).length > 0) {
    filterUpdates.selectedFeatures = selectedFeatures;
  }

  // 7. Sort
  const rawSort = searchParams.get('sort');
  if (rawSort === 'price_asc' || rawSort === 'price_desc' || rawSort === 'newest' || rawSort === 'popular') {
    result.sort = rawSort as SortOption;
  }

  // 8. View Mode
  const rawView = searchParams.get('view');
  if (rawView === 'list' || rawView === 'grid') {
    result.viewMode = rawView as ViewMode;
  }

  // 9. Page
  const rawPage = parseInt(searchParams.get('page') || '1', 10);
  if (Number.isFinite(rawPage) && rawPage >= 1) {
    result.currentPage = Math.floor(rawPage);
  }

  if (Object.keys(filterUpdates).length > 0) {
    result.filters = filterUpdates;
  }

  return result;
}

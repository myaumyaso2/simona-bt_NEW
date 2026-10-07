'use client';

import React, { useState, useRef, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { MANUFACTURER_PROMOS } from '@/data/promosData';
import { SimonaIconSearch, SimonaIconCheck, SimonaIconClock } from '@/components/brand/SimonaIcons';
import { CategoryFacet, groupCategoryFacets } from '@/lib/productFeatures';
import { useStore } from '@/components/providers/StoreContext';
import { ManufacturerPromo } from '@/types';
import { ProductGroupOption } from '@/lib/catalog/productGroups';

const accordionTransition = {
  duration: 0.3,
  ease: [0.16, 1, 0.3, 1],
};

export interface FilterState {
  selectedGroups: string[];
  selectedPromos: string[];
  selectedBrands: string[];
  priceMin: number;
  priceMax: number;
  selectedWidth: string | null;
  selectedColor: string | null;
  selectedFeatures: Record<string, string[]>;
}

export interface BrandOption {
  id: string;
  name: string;
  count: number;
}

interface CatalogSidebarProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  availableGroups?: ProductGroupOption[];
  availableBrands?: BrandOption[];
  brandCounts?: Record<string, number>;
  promoCounts?: Record<string, number>;
  priceBounds?: { min: number; max: number };
  categoryFacets?: CategoryFacet[];
  activeVariant?: 'sidebar_facets' | 'top_chips' | 'drawer';
  onOpenDrawer?: () => void;
  brandLock?: string;
}

export function CatalogSidebar({
  filters,
  onFilterChange,
  onResetFilters,
  availableGroups = [],
  availableBrands,
  brandCounts = {},
  promoCounts = {},
  priceBounds = { min: 0, max: 900000 },
  categoryFacets = [],
  brandLock,
}: CatalogSidebarProps) {
  const { openModal } = useStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Section accordion visibility states
  const [groupOpen, setGroupOpen] = useState(true);
  const [groupSearch, setGroupSearch] = useState('');

  const [promoOpen, setPromoOpen] = useState(true);
  const [promoSearch, setPromoSearch] = useState('');
  const [hoveredPromo, setHoveredPromo] = useState<{ promo: ManufacturerPromo; rect: DOMRect } | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [brandSearch, setBrandSearch] = useState('');
  const [brandOpen, setBrandOpen] = useState(true);

  const [priceOpen, setPriceOpen] = useState(true);

  // Local price input state for smooth typing without resetting
  const [localPriceMin, setLocalPriceMin] = useState<string>(String(filters.priceMin));
  const [localPriceMax, setLocalPriceMax] = useState<string>(String(filters.priceMax));

  useEffect(() => {
    setLocalPriceMin(String(filters.priceMin));
  }, [filters.priceMin]);

  useEffect(() => {
    setLocalPriceMax(String(filters.priceMax));
  }, [filters.priceMax]);

  const commitPriceMin = () => {
    let num = Number(localPriceMin.replace(/\D/g, ''));
    if (isNaN(num) || num < priceBounds.min) num = priceBounds.min;
    if (num > filters.priceMax) num = filters.priceMax;
    setLocalPriceMin(String(num));
    if (num !== filters.priceMin) {
      onFilterChange({ priceMin: num });
    }
  };

  const commitPriceMax = () => {
    let num = Number(localPriceMax.replace(/\D/g, ''));
    if (isNaN(num) || num > priceBounds.max) num = priceBounds.max;
    if (num < filters.priceMin) num = filters.priceMin;
    setLocalPriceMax(String(num));
    if (num !== filters.priceMax) {
      onFilterChange({ priceMax: num });
    }
  };

  // State for all other collapsed feature blocks
  const [showAllFilters, setShowAllFilters] = useState(false);

  const [openFacets, setOpenFacets] = useState<Record<string, boolean>>({
    'Ширина': true,
    'Всего конфорок': true,
    'Переключатели': true,
    'Материал панели': true,
    'Цвет': true,
  });

  const groupedFacets = useMemo(() => {
    return groupCategoryFacets(categoryFacets);
  }, [categoryFacets]);

  // Primary facets: "Основные параметры"
  const primaryGroup = useMemo(() => {
    return groupedFacets.find((g) => g.groupName === 'Основные параметры');
  }, [groupedFacets]);

  // Secondary facets: All other groups
  const secondaryGroups = useMemo(() => {
    return groupedFacets.filter((g) => g.groupName !== 'Основные параметры');
  }, [groupedFacets]);

  // Count active filters inside secondary (hidden) groups
  const hiddenActiveCount = useMemo(() => {
    return secondaryGroups.reduce((acc, g) => {
      return acc + g.facets.reduce((fAcc, f) => {
        return fAcc + (filters.selectedFeatures?.[f.label]?.length || 0);
      }, 0);
    }, 0);
  }, [secondaryGroups, filters.selectedFeatures]);

  // Auto-expand secondary groups if any filter inside them is active
  const isSecondaryExpanded = showAllFilters || hiddenActiveCount > 0;

  const asideRef = useRef<HTMLElement>(null);

  const toggleFacetOpen = (label: string) => {
    setOpenFacets((prev) => ({
      ...prev,
      [label]: prev[label] === undefined ? false : !prev[label],
    }));
  };

  const isFacetOpen = (label: string) => {
    if (openFacets[label] !== undefined) return openFacets[label];
    return (filters.selectedFeatures?.[label]?.length ?? 0) > 0;
  };

  const toggleFeatureValue = (label: string, value: string) => {
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
    onFilterChange({ selectedFeatures: updated });
  };

  // 0. ТИП ПРИБОРА (Product Group from 1C_import.csv column C)
  const filteredGroups = useMemo(() => {
    if (!groupSearch.trim()) return availableGroups;
    return availableGroups.filter((g) =>
      g.name.toLowerCase().includes(groupSearch.toLowerCase().trim())
    );
  }, [availableGroups, groupSearch]);

  const toggleGroup = (groupId: string) => {
    const current = filters.selectedGroups || [];
    const next = current.includes(groupId)
      ? current.filter((id) => id !== groupId)
      : [...current, groupId];
    onFilterChange({ selectedGroups: next });
  };

  // 1. АКЦИИ
  const activePromos = MANUFACTURER_PROMOS.filter((promo) => {
    const count = promoCounts[promo.slug] ?? 0;
    return count > 0;
  });

  const filteredPromos = useMemo(() => {
    if (!promoSearch.trim()) return activePromos;
    const q = promoSearch.toLowerCase().trim();
    return activePromos.filter((p) => {
      const title = p.title.toLowerCase();
      const brand = p.brand.toLowerCase();
      return title.includes(q) || brand.includes(q);
    });
  }, [activePromos, promoSearch]);

  const togglePromo = (promoSlug: string) => {
    const next = filters.selectedPromos.includes(promoSlug)
      ? filters.selectedPromos.filter((s) => s !== promoSlug)
      : [...filters.selectedPromos, promoSlug];
    onFilterChange({ selectedPromos: next });
  };

  // 2. БРЕНД
  const effectiveBrands = useMemo(() => {
    if (availableBrands && availableBrands.length > 0) {
      return availableBrands;
    }
    return Object.entries(brandCounts)
      .filter(([_, count]) => count > 0)
      .map(([brand, count]) => ({ id: brand, name: brand, count }))
      .sort((a, b) => b.count - a.count);
  }, [availableBrands, brandCounts]);

  const filteredBrands = useMemo(() => {
    if (!brandSearch.trim()) return effectiveBrands;
    return effectiveBrands.filter((b) =>
      b.name.toLowerCase().includes(brandSearch.toLowerCase().trim())
    );
  }, [effectiveBrands, brandSearch]);

  const toggleBrand = (brandId: string) => {
    const next = filters.selectedBrands.includes(brandId)
      ? filters.selectedBrands.filter((b) => b !== brandId)
      : [...filters.selectedBrands, brandId];
    onFilterChange({ selectedBrands: next });
  };

  // Dual-range slider percentages
  const priceRangeSpan = Math.max(1, priceBounds.max - priceBounds.min);
  const minPercent = Math.max(0, Math.min(100, Math.round(((filters.priceMin - priceBounds.min) / priceRangeSpan) * 100)));
  const maxPercent = Math.max(0, Math.min(100, Math.round(((filters.priceMax - priceBounds.min) / priceRangeSpan) * 100)));

  // Helper to render a facet item (boolean single-line vs accordion)
  const renderFacetItem = (facet: CategoryFacet) => {
    const selectedVals = filters.selectedFeatures?.[facet.label] || [];
    const isBooleanSingle =
      facet.options.length === 1 &&
      (facet.options[0].value.toLowerCase() === 'есть' || facet.options[0].value.toLowerCase() === 'да');

    // 1. Lightweight flat single-row checkbox for boolean presence (Zero accordion clutter)
    if (isBooleanSingle) {
      const opt = facet.options[0];
      const isChecked = selectedVals.includes(opt.value);

      return (
        <div key={facet.label} className="border-b border-[#2B313A]/50 pb-2.5 mb-2.5 last:border-b-0 last:pb-1 last:mb-1">
          <label
            onClick={() => toggleFeatureValue(facet.label, opt.value)}
            className="flex items-center justify-between text-xs cursor-pointer py-1 px-1.5 rounded-lg hover:bg-white/[0.04] group/opt transition-colors select-none"
          >
            <div className="flex items-center space-x-2.5 truncate pr-2">
              <div
                className={`w-4 h-4 rounded-[4px] border shrink-0 flex items-center justify-center transition-colors ${
                  isChecked
                    ? 'bg-simona-teal border-simona-teal text-white shadow-sm'
                    : 'bg-[#1E2228] border-[#2B313A] group-hover/opt:border-simona-teal/60'
                }`}
              >
                {isChecked && <SimonaIconCheck className="w-3 h-3 stroke-[2.5]" />}
              </div>
              <span
                className={`text-[12px] truncate transition-colors ${
                  isChecked ? 'text-white font-medium' : 'text-[#D7D9DB] group-hover/opt:text-white'
                }`}
              >
                {facet.label}
              </span>
            </div>
            <span className="text-[11px] text-[#87888A] font-mono shrink-0">
              [{opt.count}]
            </span>
          </label>
        </div>
      );
    }

    // 2. Multi-option facet accordion
    const open = isFacetOpen(facet.label);
    return (
      <div key={facet.label} className="border-b border-[#2B313A]/50 pb-3 mb-3 last:border-b-0 last:pb-1 last:mb-1">
        <button
          type="button"
          onClick={() => toggleFacetOpen(facet.label)}
          className="w-full flex items-center justify-between text-sm font-semibold text-white py-1 group cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-2 truncate max-w-[85%]">
            <span className="truncate group-hover:text-white transition-colors">
              {facet.label}
            </span>
            {selectedVals.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-md bg-simona-teal text-white text-[10px] font-mono font-bold shrink-0">
                {selectedVals.length}
              </span>
            )}
          </div>
          <ChevronDown
            className={`w-4 h-4 shrink-0 transition-transform duration-300 ${
              open ? 'rotate-180 text-simona-teal' : 'text-[#87888A] group-hover:text-simona-teal'
            }`}
          />
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={accordionTransition}
              className="overflow-hidden"
            >
              <div className="pt-2 space-y-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
                {facet.options.map((opt) => {
                  const isChecked = selectedVals.includes(opt.value);
                  return (
                    <label
                      key={opt.value}
                      onClick={() => toggleFeatureValue(facet.label, opt.value)}
                      className="flex items-center justify-between text-xs cursor-pointer py-0.5 group/opt"
                    >
                      <div className="flex items-center space-x-2.5 truncate pr-2">
                        <div
                          className={`w-4 h-4 rounded-[4px] border shrink-0 flex items-center justify-center transition-colors ${
                            isChecked
                              ? 'bg-simona-teal border-simona-teal text-white'
                              : 'bg-[#1E2228] border-[#2B313A] group-hover/opt:border-simona-teal/60'
                          }`}
                        >
                          {isChecked && (
                            <SimonaIconCheck className="w-3 h-3 stroke-[2.5]" />
                          )}
                        </div>
                        <span
                          className={`text-[11.5px] truncate transition-colors ${
                            isChecked
                              ? 'text-white font-medium'
                              : 'text-[#D7D9DB] group-hover/opt:text-white'
                          }`}
                        >
                          {opt.value}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#87888A] font-mono shrink-0">
                        [{opt.count}]
                      </span>
                    </label>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <aside
      ref={asideRef}
      data-lenis-prevent="true"
      className="w-full lg:w-[300px] shrink-0 bg-[#16191D] rounded-2xl p-5 border border-[#2B313A] space-y-6 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto simona-sidebar-scrollbar overscroll-contain scroll-smooth"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#2B313A]">
        <h3 className="text-base font-montserrat font-bold text-white tracking-tight">
          Фильтры
        </h3>
        <button
          onClick={onResetFilters}
          className="text-xs text-[#87888A] hover:text-simona-teal transition-colors font-medium cursor-pointer"
        >
          Сбросить все
        </button>
      </div>

      {/* 0. ТИП ПРИБОРА (Столбец C "Группа товара" из 1C_import.csv) — Расположен на самом верху */}
      {availableGroups.length > 0 && (
        <div className="border-b border-[#2B313A]/60 pb-4">
          <button
            onClick={() => setGroupOpen(!groupOpen)}
            className="w-full flex items-center justify-between text-sm font-semibold text-white py-1 group cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="group-hover:text-white transition-colors">Тип прибора</span>
              {(filters.selectedGroups?.length ?? 0) > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-simona-teal text-white font-mono font-bold">
                  {filters.selectedGroups.length}
                </span>
              )}
            </div>
            <ChevronDown
              className={`w-4 h-4 transition-all duration-300 ${
                groupOpen
                  ? 'rotate-180 text-simona-teal'
                  : 'text-[#87888A] group-hover:text-simona-teal'
              }`}
            />
          </button>

          <AnimatePresence initial={false}>
            {groupOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={accordionTransition}
                className="overflow-hidden"
              >
                <div className="pt-3 space-y-3">
                  {/* Search input if multiple groups */}
                  {availableGroups.length > 6 && (
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Найти тип прибора..."
                        value={groupSearch}
                        onChange={(e) => setGroupSearch(e.target.value)}
                        className="w-full bg-[#1E2228] border border-[#2B313A] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#87888A] focus:outline-none focus:border-simona-teal transition-colors"
                      />
                      <SimonaIconSearch className="w-3.5 h-3.5 text-[#87888A] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  )}

                  {/* Group Checkboxes */}
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
                    {filteredGroups.map((group) => {
                      const isChecked = filters.selectedGroups?.includes(group.id);
                      return (
                        <label
                          key={group.id}
                          onClick={() => toggleGroup(group.id)}
                          className="flex items-center justify-between text-xs cursor-pointer group/item py-0.5"
                        >
                          <div className="flex items-center space-x-2.5">
                            <div
                              className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors ${
                                isChecked
                                  ? 'bg-simona-teal border-simona-teal text-white'
                                  : 'bg-[#1E2228] border-[#2B313A] group-hover/item:border-simona-teal/60'
                              }`}
                            >
                              {isChecked && <SimonaIconCheck className="w-3 h-3 stroke-[2.5]" />}
                            </div>
                            <span
                              className={`transition-colors ${
                                isChecked ? 'text-white font-medium' : 'text-[#D7D9DB] group-hover/item:text-white'
                              }`}
                            >
                              {group.name}
                            </span>
                          </div>
                          <span className="text-[11px] text-[#87888A] font-mono">({group.count})</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* 1. АКЦИИ ПРОИЗВОДИТЕЛЕЙ */}
      {activePromos.length > 0 && (
        <div className="border-b border-[#2B313A]/60 pb-4">
          <button
            onClick={() => setPromoOpen(!promoOpen)}
            className="w-full flex items-center justify-between text-sm font-semibold text-white py-1 group cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-white group-hover:text-simona-wine-light transition-colors">
                Акции
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-simona-wine/25 text-white border border-simona-wine/50 font-mono font-bold">
                {activePromos.length}
              </span>
            </div>
            <ChevronDown
              className={`w-4 h-4 transition-all duration-300 ${
                promoOpen
                  ? 'rotate-180 text-simona-wine-light'
                  : 'text-[#87888A] group-hover:text-simona-wine-light'
              }`}
            />
          </button>

          <AnimatePresence initial={false}>
            {promoOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={accordionTransition}
                className="overflow-hidden"
              >
                <div className="pt-3 space-y-3">
                  {/* Search input if multiple promos */}
                  {activePromos.length > 5 && (
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Найти акцию..."
                        value={promoSearch}
                        onChange={(e) => setPromoSearch(e.target.value)}
                        className="w-full bg-[#1E2228] border border-[#2B313A] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#87888A] focus:outline-none focus:border-simona-wine transition-colors"
                      />
                      <SimonaIconSearch className="w-3.5 h-3.5 text-[#87888A] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  )}

                  {/* Promo Checkboxes with internal scrollbar */}
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
                    {filteredPromos.map((promo) => {
                      const isChecked = filters.selectedPromos.includes(promo.slug);
                      const count = promoCounts[promo.slug] ?? 0;
                      const promoTitleClean = promo.title.trim();
                      const promoBrandClean = promo.brand.trim();
                      const promoDisplayName = promoTitleClean.toLowerCase().startsWith(promoBrandClean.toLowerCase())
                        ? promoTitleClean
                        : `${promoBrandClean}. ${promoTitleClean}`;

                      return (
                        <label
                          key={promo.id}
                          onClick={() => togglePromo(promo.slug)}
                          onMouseEnter={(e) => {
                            if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
                            const rect = e.currentTarget.getBoundingClientRect();
                            hoverTimeoutRef.current = setTimeout(() => {
                              setHoveredPromo({ promo, rect });
                            }, 150);
                          }}
                          onMouseLeave={() => {
                            if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
                            hoverTimeoutRef.current = setTimeout(() => {
                              setHoveredPromo(null);
                            }, 200);
                          }}
                          className="flex items-start justify-between text-xs cursor-pointer group/item py-1.5 px-2 rounded-lg hover:bg-white/[0.04] transition-colors"
                        >
                          <div className="flex items-start space-x-2.5 min-w-0 pr-2">
                            <div
                              className={`w-4 h-4 rounded-[4px] border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                                isChecked
                                  ? 'bg-simona-wine border-simona-wine text-white shadow-sm'
                                  : 'bg-[#1E2228] border-[#2B313A] group-hover/item:border-simona-wine/60'
                              }`}
                            >
                              {isChecked && <SimonaIconCheck className="w-3 h-3 stroke-[2.5]" />}
                            </div>
                            <span
                              className={`transition-colors leading-snug line-clamp-2 ${
                                isChecked
                                  ? 'text-white font-semibold'
                                  : 'text-[#D7D9DB] group-hover/item:text-white'
                              }`}
                            >
                              {promoDisplayName}
                            </span>
                          </div>
                          <span className="text-[11px] text-[#87888A] font-mono shrink-0 pt-0.5">
                            ({count})
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* 2. БРЕНД */}
      {brandLock ? (
        <div className="border-b border-[#2B313A]/60 pb-4">
          <div className="flex items-center justify-between py-1 text-xs">
            <span className="text-[#87888A] font-medium">Производитель</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-simona-teal/15 border border-simona-teal/30 text-simona-teal font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-simona-teal animate-pulse" />
              {brandLock}
            </span>
          </div>
        </div>
      ) : effectiveBrands.length > 0 && (
        <div className="border-b border-[#2B313A]/60 pb-4">
          <button
            onClick={() => setBrandOpen(!brandOpen)}
            className="w-full flex items-center justify-between text-sm font-semibold text-white py-1 group cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="group-hover:text-white transition-colors">Бренд</span>
              {filters.selectedBrands.length > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-simona-teal text-white font-mono font-bold">
                  {filters.selectedBrands.length}
                </span>
              )}
            </div>
            <ChevronDown
              className={`w-4 h-4 transition-all duration-300 ${
                brandOpen
                  ? 'rotate-180 text-simona-teal'
                  : 'text-[#87888A] group-hover:text-simona-teal'
              }`}
            />
          </button>

          <AnimatePresence initial={false}>
            {brandOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={accordionTransition}
                className="overflow-hidden"
              >
                <div className="pt-3 space-y-3">
                  {effectiveBrands.length > 6 && (
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Найти бренд..."
                        value={brandSearch}
                        onChange={(e) => setBrandSearch(e.target.value)}
                        className="w-full bg-[#1E2228] border border-[#2B313A] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#87888A] focus:outline-none focus:border-simona-teal transition-colors"
                      />
                      <SimonaIconSearch className="w-3.5 h-3.5 text-[#87888A] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  )}

                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
                    {filteredBrands.map((brand) => {
                      const isChecked = filters.selectedBrands.includes(brand.id);
                      return (
                        <label
                          key={brand.id}
                          onClick={() => toggleBrand(brand.id)}
                          className="flex items-center justify-between text-xs cursor-pointer group/item py-0.5"
                        >
                          <div className="flex items-center space-x-2.5">
                            <div
                              className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors ${
                                isChecked
                                  ? 'bg-simona-teal border-simona-teal text-white'
                                  : 'bg-[#1E2228] border-[#2B313A] group-hover/item:border-simona-teal/60'
                              }`}
                            >
                              {isChecked && <SimonaIconCheck className="w-3 h-3 stroke-[2.5]" />}
                            </div>
                            <span
                              className={`transition-colors ${
                                isChecked ? 'text-white font-medium' : 'text-[#D7D9DB] group-hover/item:text-white'
                              }`}
                            >
                              {brand.name}
                            </span>
                          </div>
                          <span className="text-[11px] text-[#87888A] font-mono">({brand.count})</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* 3. ЦЕНА (Двойной интерактивный слайдер и поля ввода без резкого сброса) */}
      <div className="border-b border-[#2B313A]/60 pb-4">
        <button
          onClick={() => setPriceOpen(!priceOpen)}
          className="w-full flex items-center justify-between text-sm font-semibold text-white py-1 group cursor-pointer transition-colors"
        >
          <span className="group-hover:text-white transition-colors">Цена, ₽</span>
          <ChevronDown
            className={`w-4 h-4 transition-all duration-300 ${
              priceOpen
                ? 'rotate-180 text-simona-teal'
                : 'text-[#87888A] group-hover:text-simona-teal'
            }`}
          />
        </button>

        <AnimatePresence initial={false}>
          {priceOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={accordionTransition}
              className="overflow-hidden"
            >
              <div className="pt-3 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-[#87888A] uppercase font-medium block mb-1">
                      от
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={localPriceMin}
                      onChange={(e) => setLocalPriceMin(e.target.value)}
                      onBlur={commitPriceMin}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          commitPriceMin();
                          (e.target as HTMLInputElement).blur();
                        }
                      }}
                      className="w-full bg-[#1E2228] border border-[#2B313A] rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-simona-teal font-mono transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#87888A] uppercase font-medium block mb-1">
                      до
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={localPriceMax}
                      onChange={(e) => setLocalPriceMax(e.target.value)}
                      onBlur={commitPriceMax}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          commitPriceMax();
                          (e.target as HTMLInputElement).blur();
                        }
                      }}
                      className="w-full bg-[#1E2228] border border-[#2B313A] rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-simona-teal font-mono transition-colors"
                    />
                  </div>
                </div>

                {/* Dual-Range Slider Track */}
                <div className="pt-3 pb-1">
                  <div className="relative h-5 flex items-center">
                    {/* Background inactive track */}
                    <div className="absolute w-full h-1.5 bg-[#1E2228] border border-[#2B313A] rounded-lg" />

                    {/* Active highlight range track */}
                    <div
                      className="absolute h-1.5 bg-simona-teal rounded-lg pointer-events-none shadow-[0_0_8px_rgba(0,151,156,0.5)]"
                      style={{
                        left: `${minPercent}%`,
                        width: `${Math.max(0, maxPercent - minPercent)}%`,
                      }}
                    />

                    {/* Left Thumb (Min Price) */}
                    <input
                      type="range"
                      min={priceBounds.min}
                      max={priceBounds.max}
                      step={1000}
                      value={Math.min(filters.priceMin, filters.priceMax - 1000)}
                      onChange={(e) => {
                        const val = Math.min(Number(e.target.value), filters.priceMax - 1000);
                        onFilterChange({ priceMin: val });
                      }}
                      className="absolute w-full appearance-none bg-transparent pointer-events-none z-20 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-simona-teal [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#16191D] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-simona-teal [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#16191D] [&::-moz-range-thumb]:cursor-pointer"
                    />

                    {/* Right Thumb (Max Price) */}
                    <input
                      type="range"
                      min={priceBounds.min}
                      max={priceBounds.max}
                      step={1000}
                      value={Math.max(filters.priceMax, filters.priceMin + 1000)}
                      onChange={(e) => {
                        const val = Math.max(Number(e.target.value), filters.priceMin + 1000);
                        onFilterChange({ priceMax: val });
                      }}
                      className="absolute w-full appearance-none bg-transparent pointer-events-none z-20 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-simona-teal [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#16191D] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-simona-teal [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#16191D] [&::-moz-range-thumb]:cursor-pointer"
                    />
                  </div>

                  <div className="flex justify-between text-[10px] text-[#87888A] font-mono mt-2">
                    <span>{formatPrice(priceBounds.min)}</span>
                    <span>{formatPrice(priceBounds.max)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. ОСНОВНЫЕ ПАРАМЕТРЫ (Цвет, Материал, и т.д.) — Визуально не выделяем оверлайном, идут сразу под ценой */}
      {primaryGroup && primaryGroup.facets.length > 0 && (
        <div className="space-y-0 pt-1">
          {primaryGroup.facets.map(renderFacetItem)}
        </div>
      )}

      {/* 5. КНОПКА «ПОКАЗАТЬ ВСЕ ФИЛЬТРЫ» И ДОПОЛНИТЕЛЬНЫЕ СМЫСЛОВЫЕ БЛОКИ */}
      {secondaryGroups.length > 0 && (
        <div className="pt-2">
          {/* Кнопка-триггер разворачивания */}
          <button
            type="button"
            onClick={() => setShowAllFilters(!showAllFilters)}
            className="w-full py-2.5 px-4 rounded-xl bg-[#1E2228] hover:bg-[#232830] border border-[#2B313A] hover:border-simona-teal text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-sm group select-none"
          >
            <span>
              {isSecondaryExpanded ? 'Скрыть дополнительные фильтры' : 'Показать все фильтры'}
            </span>
            {!isSecondaryExpanded && hiddenActiveCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-md bg-simona-teal text-white text-[10px] font-mono font-bold">
                {hiddenActiveCount}
              </span>
            )}
            <ChevronDown
              className={`w-4 h-4 text-[#87888A] group-hover:text-simona-teal transition-transform duration-300 ${
                isSecondaryExpanded ? 'rotate-180 text-simona-teal' : ''
              }`}
            />
          </button>

          {/* Скрытые группы характеристик с оверлайнами и микро-акцентами */}
          <AnimatePresence initial={false}>
            {isSecondaryExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={accordionTransition}
                className="overflow-hidden space-y-6 pt-5"
              >
                {secondaryGroups.map((group) => {
                  const activeCountInGroup = group.facets.reduce((acc, f) => {
                    return acc + (filters.selectedFeatures?.[f.label]?.length || 0);
                  }, 0);

                  return (
                    <div key={group.groupName} className="pt-2 first:pt-0">
                      {/* Quiet Luxury Micro-Overline Header */}
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#2B313A]/70">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-simona-teal shadow-[0_0_8px_rgba(0,151,156,0.6)]" />
                          <span className="text-[10px] font-bold tracking-wider uppercase text-simona-teal/90">
                            {group.groupName}
                          </span>
                        </div>
                        {activeCountInGroup > 0 && (
                          <span className="px-1.5 py-0.5 rounded-md bg-simona-teal text-white text-[10px] font-mono font-bold shadow-sm">
                            {activeCountInGroup}
                          </span>
                        )}
                      </div>

                      {/* Facets inside group */}
                      <div className="space-y-0">
                        {group.facets.map(renderFacetItem)}
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Floating Hover Card with Brief Promo Terms (Rendered via Portal with Variant 2 Halo) */}
      {mounted && hoveredPromo && createPortal(
        <div
          style={{
            position: 'fixed',
            top: `${Math.min(window.innerHeight - 260, Math.max(16, hoveredPromo.rect.top - 20))}px`,
            left: `${hoveredPromo.rect.right + 12}px`,
            width: '320px',
          }}
          className="z-[9999] pointer-events-none animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Soft Diffuse Shadow Halo (мягкий градиентный спад тени в 0 без жесткой границы плашки) */}
          <div className="absolute inset-0 rounded-2xl pointer-events-none -z-10 shadow-[0_0_50px_25px_rgba(0,0,0,0.85),0_20px_60px_10px_rgba(0,0,0,0.95)]" />

          {/* Popover Card Content */}
          <div className="relative bg-[#16191D]/95 backdrop-blur-xl border border-simona-wine/60 rounded-2xl p-4 shadow-2xl shadow-black/80">
            <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-[#2B313A]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-simona-wine-light font-mono">
                {hoveredPromo.promo.brand}
              </span>
              <span className="text-[10px] text-[#87888A] font-mono flex items-center gap-1">
                <SimonaIconClock className="w-3 h-3 text-simona-wine-light" />
                {hoveredPromo.promo.endDate ? `до ${hoveredPromo.promo.endDate}` : 'Бессрочно'}
              </span>
            </div>

            <h5 className="text-xs font-montserrat font-bold text-white mb-2 leading-snug">
              {hoveredPromo.promo.title}
            </h5>

            <p className="text-[11px] text-[#D7D9DB] leading-relaxed line-clamp-4 mb-3">
              {hoveredPromo.promo.shortDescription}
            </p>

            <div className="text-[10px] text-simona-wine-light font-medium flex items-center gap-1 bg-simona-wine/10 px-2 py-1 rounded-md border border-simona-wine/20">
              <span>● Нажмите чекбокс, чтобы показать приборы акции</span>
            </div>
          </div>
        </div>,
        document.body
      )}
    </aside>
  );
}

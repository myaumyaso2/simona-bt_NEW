'use client';

import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { MANUFACTURER_PROMOS } from '@/data/promosData';
import { SimonaIconSearch, SimonaIconCheck, SimonaIconClock } from '@/components/brand/SimonaIcons';
import { CategoryFacet } from '@/lib/productFeatures';
import { useStore } from '@/components/providers/StoreContext';
import { ManufacturerPromo } from '@/types';

const accordionTransition = {
  duration: 0.3,
  ease: [0.16, 1, 0.3, 1],
};

export interface FilterState {
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
  availableBrands,
  brandCounts = {},
  promoCounts = {},
  priceBounds = { min: 0, max: 900000 },
  categoryFacets = [],
  brandLock,
}: CatalogSidebarProps) {
  const { openModal } = useStore();
  const [promoOpen, setPromoOpen] = useState(true);
  const [hoveredPromo, setHoveredPromo] = useState<{ promo: ManufacturerPromo; rect: DOMRect } | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [brandSearch, setBrandSearch] = useState('');
  const [brandOpen, setBrandOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [openFacets, setOpenFacets] = useState<Record<string, boolean>>({
    'Ширина': true,
    'Всего конфорок': true,
    'Переключатели': true,
    'Материал панели': true,
    'Цвет': true,
  });

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

  // Zero Dead Ends: only display promos with matching products in current category
  const activePromos = MANUFACTURER_PROMOS.filter((promo) => {
    const count = promoCounts[promo.slug] ?? 0;
    return count > 0;
  });

  const togglePromo = (promoSlug: string) => {
    const next = filters.selectedPromos.includes(promoSlug)
      ? filters.selectedPromos.filter((s) => s !== promoSlug)
      : [...filters.selectedPromos, promoSlug];
    onFilterChange({ selectedPromos: next });
  };

  // Dynamic Brand List for the current category
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

      {/* 0. АКЦИИ ПРОИЗВОДИТЕЛЕЙ (1-е место над брендами) */}
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
                <div className="pt-3 space-y-2">
                  {activePromos.map((promo) => {
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* 1. БРЕНД (Привязка к бренду для страницы бренда или динамический выбор) */}
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
                <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-simona-teal/20 text-simona-teal font-mono font-bold">
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
                  {/* Brand Search input */}
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

                  {/* Brand Checkboxes */}
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

      {/* 2. ЦЕНА (Динамический диапазон текущей категории) */}
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
                      type="number"
                      value={filters.priceMin}
                      onChange={(e) => onFilterChange({ priceMin: Number(e.target.value) || priceBounds.min })}
                      onWheel={(e) => (e.target as HTMLInputElement).blur()}
                      className="w-full bg-[#1E2228] border border-[#2B313A] rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-simona-teal font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#87888A] uppercase font-medium block mb-1">
                      до
                    </label>
                    <input
                      type="number"
                      value={filters.priceMax}
                      onChange={(e) => onFilterChange({ priceMax: Number(e.target.value) || priceBounds.max })}
                      onWheel={(e) => (e.target as HTMLInputElement).blur()}
                      className="w-full bg-[#1E2228] border border-[#2B313A] rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-simona-teal font-mono"
                    />
                  </div>
                </div>

                {/* Range Slider Track */}
                <div className="pt-2">
                  <input
                    type="range"
                    min={priceBounds.min}
                    max={priceBounds.max}
                    step={1000}
                    value={Math.min(filters.priceMax, priceBounds.max)}
                    onChange={(e) => onFilterChange({ priceMax: Number(e.target.value) })}
                    className="w-full accent-simona-teal h-1.5 bg-[#1E2228] rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#87888A] font-mono mt-1">
                    <span>{formatPrice(priceBounds.min)}</span>
                    <span>{formatPrice(priceBounds.max)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. ДИНАМИЧЕСКИЕ ХАРАКТЕРИСТИКИ КАТЕГОРИИ */}
      {categoryFacets.map((facet) => {
        const selectedVals = filters.selectedFeatures?.[facet.label] || [];
        const open = isFacetOpen(facet.label);

        return (
          <div key={facet.label} className="border-b border-[#2B313A]/60 pb-4">
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
                  <div className="pt-3 space-y-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
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
      })}

      {/* Floating Hover Card with Brief Promo Terms (Desktop only) */}
      {hoveredPromo && (
        <div
          style={{
            position: 'fixed',
            top: Math.max(16, Math.min(hoveredPromo.rect.top, (typeof window !== 'undefined' ? window.innerHeight : 800) - 340)),
            left: hoveredPromo.rect.right + 12,
            width: 320,
          }}
          className="z-[100] hidden lg:block p-4 rounded-2xl bg-[#16191D]/95 border border-simona-wine/60 text-white shadow-2xl backdrop-blur-2xl animate-fade-in pointer-events-auto"
          onMouseEnter={() => {
            if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
          }}
          onMouseLeave={() => {
            if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = setTimeout(() => {
              setHoveredPromo(null);
            }, 150);
          }}
        >
          <div className="flex items-center justify-between text-[11px] text-simona-wine-light font-semibold mb-1.5">
            <span className="truncate pr-2 font-mono uppercase">{hoveredPromo.promo.brand}</span>
            <div className="flex items-center gap-1 shrink-0 text-[#D7D9DB]">
              <SimonaIconClock className="w-3.5 h-3.5 text-simona-wine-light" />
              <span>до {hoveredPromo.promo.endDate}</span>
            </div>
          </div>
          <div className="text-sm font-montserrat font-bold text-white leading-snug mb-2">
            {hoveredPromo.promo.title}
          </div>
          <p className="text-xs text-[#87888A] leading-relaxed line-clamp-3 mb-3 font-normal">
            {hoveredPromo.promo.shortDescription}
          </p>
          <div className="pt-2.5 border-t border-[#2B313A] flex items-center justify-between">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openModal('PROMO_TERMS', { promoData: hoveredPromo.promo });
                setHoveredPromo(null);
              }}
              className="text-xs font-semibold text-simona-teal hover:text-simona-teal-light transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Подробнее об акции</span>
              <span className="text-sm">→</span>
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}

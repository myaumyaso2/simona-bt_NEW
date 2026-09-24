'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { MANUFACTURER_PROMOS } from '@/data/promosData';
import { SimonaIconSearch, SimonaIconCheck } from '@/components/brand/SimonaIcons';

const accordionTransition = {
  duration: 0.3,
  ease: [0.16, 1, 0.3, 1],
};

export interface FilterState {
  selectedPromos: string[];
  selectedBrands: string[];
  priceMin: number;
  priceMax: number;
  selectedLocations: string[];
  selectedWidth: string | null;
  selectedColor: string | null;
}

interface CatalogSidebarProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  brandCounts?: Record<string, number>;
  promoCounts?: Record<string, number>;
}

const ALL_BRANDS = [
  { id: 'Miele', name: 'Miele', defaultCount: 84 },
  { id: 'ASKO', name: 'ASKO', defaultCount: 62 },
  { id: 'Liebherr', name: 'Liebherr', defaultCount: 48 },
  { id: 'SMEG', name: 'SMEG', defaultCount: 73 },
  { id: 'Bertazzoni', name: 'Bertazzoni', defaultCount: 35 },
  { id: 'Falmec', name: 'Falmec', defaultCount: 29 },
  { id: 'VARD', name: 'VARD', defaultCount: 22 },
  { id: 'Omoikiri', name: 'Omoikiri', defaultCount: 46 },
];

const COLOR_SWATCHES = [
  { id: 'black', name: 'Obsidian Black', hex: '#0D0E10' },
  { id: 'steel', name: 'CleanSteel', hex: '#8F949A' },
  { id: 'graphite', name: 'Graphite Grey', hex: '#3E3D40' },
  { id: 'white', name: 'Pure White', hex: '#FFFFFF' },
  { id: 'copper', name: 'Copper', hex: '#B87333' },
];

export function CatalogSidebar({
  filters,
  onFilterChange,
  onResetFilters,
  brandCounts = {},
  promoCounts = {},
}: CatalogSidebarProps) {
  const [promoOpen, setPromoOpen] = useState(true);
  const [brandSearch, setBrandSearch] = useState('');
  const [brandOpen, setBrandOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [locationOpen, setLocationOpen] = useState(true);
  const [specsOpen, setSpecsOpen] = useState(true);

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

  const filteredBrands = ALL_BRANDS.filter((b) =>
    b.name.toLowerCase().includes(brandSearch.toLowerCase().trim())
  );

  const toggleBrand = (brandId: string) => {
    const next = filters.selectedBrands.includes(brandId)
      ? filters.selectedBrands.filter((b) => b !== brandId)
      : [...filters.selectedBrands, brandId];
    onFilterChange({ selectedBrands: next });
  };

  const toggleLocation = (locId: string) => {
    const next = filters.selectedLocations.includes(locId)
      ? filters.selectedLocations.filter((l) => l !== locId)
      : [...filters.selectedLocations, locId];
    onFilterChange({ selectedLocations: next });
  };

  return (
    <aside className="w-full lg:w-[300px] shrink-0 bg-[#16191D] rounded-2xl p-5 border border-[#2B313A] space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#2B313A]">
        <h3 className="text-base font-montserrat font-bold text-white tracking-tight">
          Фильтры
        </h3>
        <button
          onClick={onResetFilters}
          className="text-xs text-[#87888A] hover:text-simona-teal transition-colors font-medium"
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
                    return (
                      <label
                        key={promo.id}
                        onClick={() => togglePromo(promo.slug)}
                        className="flex items-start justify-between text-xs cursor-pointer group/item py-1 px-1.5 rounded-lg hover:bg-white/[0.02] transition-colors"
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
                          <div className="flex flex-col">
                            <span
                              className={`transition-colors leading-tight ${
                                isChecked
                                  ? 'text-white font-semibold'
                                  : 'text-[#D7D9DB] group-hover/item:text-white'
                              }`}
                            >
                              {promo.brand}: {promo.badgeText}
                            </span>
                            <span className="text-[10px] text-[#87888A] line-clamp-1 mt-0.5">
                              {promo.title}
                            </span>
                          </div>
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

      {/* 1. БРЕНД (Accordion with Search) */}
      <div className="border-b border-[#2B313A]/60 pb-4">
        <button
          onClick={() => setBrandOpen(!brandOpen)}
          className="w-full flex items-center justify-between text-sm font-semibold text-white py-1 group cursor-pointer transition-colors"
        >
          <span className="group-hover:text-white transition-colors">Бренд</span>
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

                {/* Brand Checkboxes */}
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
                  {filteredBrands.map((brand) => {
                    const isChecked = filters.selectedBrands.includes(brand.id);
                    const count = brandCounts[brand.id] !== undefined ? brandCounts[brand.id] : brand.defaultCount;
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
                        <span className="text-[11px] text-[#87888A] font-mono">({count})</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2. ЦЕНА (Accordion with Inputs & Range Slider) */}
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
                      onChange={(e) => onFilterChange({ priceMin: Number(e.target.value) || 0 })}
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
                      onChange={(e) => onFilterChange({ priceMax: Number(e.target.value) || 900000 })}
                      className="w-full bg-[#1E2228] border border-[#2B313A] rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-simona-teal font-mono"
                    />
                  </div>
                </div>

                {/* Range Slider Track */}
                <div className="pt-2">
                  <input
                    type="range"
                    min={50000}
                    max={900000}
                    step={10000}
                    value={filters.priceMax}
                    onChange={(e) => onFilterChange({ priceMax: Number(e.target.value) })}
                    className="w-full accent-simona-teal h-1.5 bg-[#1E2228] rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#87888A] font-mono mt-1">
                    <span>{formatPrice(filters.priceMin)}</span>
                    <span>{formatPrice(filters.priceMax)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. НАЛИЧИЕ (Accordion) */}
      <div className="border-b border-[#2B313A]/60 pb-4">
        <button
          onClick={() => setLocationOpen(!locationOpen)}
          className="w-full flex items-center justify-between text-sm font-semibold text-white py-1 group cursor-pointer transition-colors"
        >
          <span className="group-hover:text-white transition-colors">Наличие</span>
          <ChevronDown
            className={`w-4 h-4 transition-all duration-300 ${
              locationOpen
                ? 'rotate-180 text-simona-teal'
                : 'text-[#87888A] group-hover:text-simona-teal'
            }`}
          />
        </button>

        <AnimatePresence initial={false}>
          {locationOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={accordionTransition}
              className="overflow-hidden"
            >
              <div className="pt-3 space-y-2">
                {[
                  { id: 'SHOWROOM', label: 'На витрине', count: 32 },
                  { id: 'LOCAL_STOCK', label: 'На складе', count: 84 },
                  { id: 'REMOTE_STOCK', label: 'На удаленном складе', count: 146 },
                  { id: 'ON_ORDER', label: 'Под заказ', count: 158 },
                ].map((item) => {
                  const isChecked = filters.selectedLocations.includes(item.id);
                  return (
                    <label
                      key={item.id}
                      onClick={() => toggleLocation(item.id)}
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
                          className={`text-[11.5px] leading-tight transition-colors ${
                            isChecked ? 'text-white font-medium' : 'text-[#D7D9DB] group-hover/item:text-white'
                          }`}
                        >
                          {item.label}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#87888A] font-mono shrink-0 ml-1">[{item.count}]</span>
                    </label>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. ШИРИНА ВСТРОЙКИ & ЦВЕТ */}
      <div>
        <button
          onClick={() => setSpecsOpen(!specsOpen)}
          className="w-full flex items-center justify-between text-sm font-semibold text-white py-1 group cursor-pointer transition-colors"
        >
          <span className="group-hover:text-white transition-colors">Габариты и отделка</span>
          <ChevronDown
            className={`w-4 h-4 transition-all duration-300 ${
              specsOpen
                ? 'rotate-180 text-simona-teal'
                : 'text-[#87888A] group-hover:text-simona-teal'
            }`}
          />
        </button>

        <AnimatePresence initial={false}>
          {specsOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={accordionTransition}
              className="overflow-hidden"
            >
              <div className="pt-3 space-y-4">
                {/* Width pills */}
                <div>
                  <span className="text-[11px] text-[#87888A] font-medium block mb-2">Ширина встройки</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {['45 см', '60 см', '90 см'].map((width) => {
                      const isSelected = filters.selectedWidth === width;
                      return (
                        <button
                          key={width}
                          onClick={() =>
                            onFilterChange({ selectedWidth: isSelected ? null : width })
                          }
                          className={`py-1.5 text-xs rounded-xl font-medium transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-simona-teal text-white shadow-sm border border-simona-teal'
                              : 'bg-[#1E2228] text-[#D7D9DB] border border-[#2B313A] hover:border-simona-teal/40'
                          }`}
                        >
                          {width}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Color swatches */}
                <div>
                  <span className="text-[11px] text-[#87888A] font-medium block mb-2">Цвет фасада</span>
                  <div className="flex items-center space-x-2">
                    {COLOR_SWATCHES.map((swatch) => {
                      const isSelected = filters.selectedColor === swatch.id;
                      return (
                        <button
                          key={swatch.id}
                          title={swatch.name}
                          onClick={() =>
                            onFilterChange({ selectedColor: isSelected ? null : swatch.id })
                          }
                          className={`w-6 h-6 rounded-full border transition-transform relative flex items-center justify-center ${
                            isSelected ? 'scale-110 ring-2 ring-simona-teal ring-offset-2 ring-offset-[#16191D]' : 'hover:scale-105'
                          }`}
                          style={{ backgroundColor: swatch.hex, borderColor: '#3E3D40' }}
                        >
                          {isSelected && (
                            <span className={`w-1.5 h-1.5 rounded-full ${swatch.id === 'white' ? 'bg-black' : 'bg-white'}`} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
}

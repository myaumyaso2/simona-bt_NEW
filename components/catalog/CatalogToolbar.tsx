'use client';

import React from 'react';
import { X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FilterState } from './CatalogSidebar';
import { SimonaIconFilter, SimonaIconCheck } from '@/components/brand/SimonaIcons';
import { CategoryFacet } from '@/lib/productFeatures';

export type SortOption = 'popular' | 'price_asc' | 'price_desc' | 'newest';
export type ViewMode = 'grid' | 'list';

export const SORT_OPTIONS: { id: SortOption; label: string }[] = [
  { id: 'popular', label: 'Популярные' },
  { id: 'price_asc', label: 'Сначала дешевле' },
  { id: 'price_desc', label: 'Сначала дороже' },
  { id: 'newest', label: 'Новинки' },
];

/** Иконка сетки: 6 вертикальных карточек (по 3 в двух рядах) */
function GridViewIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={className}>
      {/* Верхний ряд: 3 вертикальных карточки */}
      <rect x="1.5" y="1.5" width="3.5" height="5.5" rx="0.75" />
      <rect x="6.25" y="1.5" width="3.5" height="5.5" rx="0.75" />
      <rect x="11" y="1.5" width="3.5" height="5.5" rx="0.75" />
      {/* Нижний ряд: 3 вертикальных карточки */}
      <rect x="1.5" y="9" width="3.5" height="5.5" rx="0.75" />
      <rect x="6.25" y="9" width="3.5" height="5.5" rx="0.75" />
      <rect x="11" y="9" width="3.5" height="5.5" rx="0.75" />
    </svg>
  );
}

/** Иконка списка: 3 горизонтальных карточки (одна под другой) */
function ListViewIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={className}>
      <rect x="1.5" y="2" width="13" height="3" rx="0.75" />
      <rect x="1.5" y="6.5" width="13" height="3" rx="0.75" />
      <rect x="1.5" y="11" width="13" height="3" rx="0.75" />
    </svg>
  );
}

interface CatalogToolbarProps {
  filters: FilterState;
  onRemoveBrand: (brand: string) => void;
  onRemoveWidth: () => void;
  onRemoveColor: () => void;
  onRemoveFeature?: (label: string, value: string) => void;
  onToggleFeature?: (label: string, value: string) => void;
  categoryFacets?: CategoryFacet[];
  activeVariant?: 'sidebar_facets' | 'top_chips' | 'drawer';
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onOpenMobileFilters: () => void;
  isBrandPage?: boolean;
}

export function CatalogToolbar({
  filters,
  onRemoveBrand,
  onRemoveWidth,
  onRemoveColor,
  onRemoveFeature,
  onToggleFeature,
  categoryFacets = [],
  activeVariant = 'sidebar_facets',
  sort,
  onSortChange,
  viewMode,
  onViewModeChange,
  onOpenMobileFilters,
  isBrandPage = false,
}: CatalogToolbarProps) {
  const [isSortOpen, setIsSortOpen] = React.useState(false);
  const [openChipLabel, setOpenChipLabel] = React.useState<string | null>(null);
  const sortRef = React.useRef<HTMLDivElement>(null);
  const chipBarRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setIsSortOpen(false);
      }
      if (chipBarRef.current && !chipBarRef.current.contains(e.target as Node)) {
        setOpenChipLabel(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSortOpen(false);
        setOpenChipLabel(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const currentSortLabel =
    SORT_OPTIONS.find((o) => o.id === sort)?.label || 'Популярные';

  const hasActiveFilters =
    filters.selectedBrands.length > 0 ||
    filters.selectedWidth !== null ||
    filters.selectedColor !== null ||
    Object.keys(filters.selectedFeatures || {}).length > 0;

  return (
    <div className="flex flex-col gap-3 pb-4 mb-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Active Chips or Mobile Filter Trigger */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Mobile Filter Button */}
          <button
            onClick={onOpenMobileFilters}
            className="lg:hidden inline-flex items-center px-3.5 py-2 rounded-xl bg-[#16191D] border border-[#2B313A] text-xs font-semibold text-white hover:border-simona-teal transition active:scale-95 cursor-pointer"
          >
            <SimonaIconFilter className="w-3.5 h-3.5 mr-2 text-simona-teal" />
            Фильтры
            {filters.selectedBrands.length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 bg-simona-teal text-white rounded-md text-[10px]">
                {filters.selectedBrands.length}
              </span>
            )}
          </button>

          {/* Active Filter Chips */}
          {!isBrandPage &&
            filters.selectedBrands.map((brand) => (
              <button
                key={brand}
                onClick={() => onRemoveBrand(brand)}
                className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-[#16191D] border border-[#2B313A] hover:border-rose-500/50 text-xs text-[#D7D9DB] hover:text-white transition group cursor-pointer"
              >
                <span>{brand}</span>
                <X className="w-3 h-3 text-[#87888A] group-hover:text-rose-400 transition-colors" />
              </button>
            ))}

          {filters.selectedWidth && (
            <button
              onClick={onRemoveWidth}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-[#16191D] border border-[#2B313A] hover:border-rose-500/50 text-xs text-[#D7D9DB] hover:text-white transition group cursor-pointer"
            >
              <span>{filters.selectedWidth}</span>
              <X className="w-3 h-3 text-[#87888A] group-hover:text-rose-400 transition-colors" />
            </button>
          )}

          {filters.selectedColor && (
            <button
              onClick={onRemoveColor}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-[#16191D] border border-[#2B313A] hover:border-rose-500/50 text-xs text-[#D7D9DB] hover:text-white transition group cursor-pointer"
            >
              <span>Цвет отделки</span>
              <X className="w-3 h-3 text-[#87888A] group-hover:text-rose-400 transition-colors" />
            </button>
          )}

          {/* Active Feature Chips */}
          {Object.entries(filters.selectedFeatures || {}).flatMap(([label, values]) =>
            values.map((val) => (
              <button
                key={`${label}-${val}`}
                onClick={() => onRemoveFeature?.(label, val)}
                className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-simona-teal/15 border border-simona-teal/40 hover:border-rose-500/50 text-xs text-white transition group cursor-pointer"
              >
                <span className="text-[#87888A]">{label}:</span>
                <span className="font-semibold">{val}</span>
                <X className="w-3 h-3 text-[#87888A] group-hover:text-rose-400 transition-colors" />
              </button>
            ))
          )}
        </div>

      {/* Right: Sorting and View Toggle */}
      <div className="flex items-center justify-between sm:justify-end space-x-3 shrink-0">
        {/* Custom Quiet Luxury Sort Dropdown */}
        <div ref={sortRef} className="relative">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-[#87888A] hidden md:inline">Сортировка:</span>
            <button
              type="button"
              onClick={() => setIsSortOpen(!isSortOpen)}
              className={`group flex items-center justify-between gap-2.5 bg-[#16191D] border rounded-xl px-3.5 py-1.5 text-xs font-medium transition-all duration-200 select-none cursor-pointer ${
                isSortOpen
                  ? 'border-simona-teal shadow-md shadow-simona-teal/10 text-white'
                  : 'border-[#2B313A] hover:border-simona-teal/50 text-[#D7D9DB] hover:text-white'
              }`}
            >
              <span>{currentSortLabel}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-300 ${
                  isSortOpen
                    ? 'rotate-180 text-simona-teal'
                    : 'text-[#87888A] group-hover:text-simona-teal'
                }`}
              />
            </button>
          </div>

          {/* Dropdown Menu Popover */}
          <AnimatePresence>
            {isSortOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                className="absolute right-0 top-full mt-1.5 z-50 min-w-[190px] bg-[#16191D] border border-[#2B313A] rounded-xl shadow-2xl p-1.5 backdrop-blur-md"
              >
                <div className="space-y-0.5">
                  {SORT_OPTIONS.map((option) => {
                    const isSelected = sort === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => {
                          onSortChange(option.id);
                          setIsSortOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer text-left ${
                          isSelected
                            ? 'bg-simona-teal/15 text-simona-teal font-semibold'
                            : 'text-[#D7D9DB] hover:bg-[#1E2228] hover:text-white'
                        }`}
                      >
                        <span>{option.label}</span>
                        {isSelected && (
                          <SimonaIconCheck className="w-3.5 h-3.5 text-simona-teal shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* View Mode Switcher (Grid / List) */}
        <div className="hidden md:flex items-center p-1 rounded-xl bg-[#16191D] border border-[#2B313A] relative gap-0.5">
          {/* Grid Button */}
          <button
            onClick={() => onViewModeChange('grid')}
            title="Сетка: 3 колонки"
            className={`relative z-10 p-2 rounded-lg transition-colors duration-200 cursor-pointer select-none flex items-center justify-center ${
              viewMode === 'grid'
                ? 'text-simona-teal'
                : 'text-[#87888A] hover:text-[#D7D9DB]'
            }`}
          >
            {viewMode === 'grid' && (
              <motion.div
                layoutId="catalogViewMode"
                className="absolute inset-0 rounded-lg bg-[#1E2228] border border-[#2B313A] shadow-sm -z-10"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}
            <GridViewIcon className="w-4 h-4" />
          </button>

          {/* List Button */}
          <button
            onClick={() => onViewModeChange('list')}
            title="Список: широкие карточки"
            className={`relative z-10 p-2 rounded-lg transition-colors duration-200 cursor-pointer select-none flex items-center justify-center ${
              viewMode === 'list'
                ? 'text-simona-teal'
                : 'text-[#87888A] hover:text-[#D7D9DB]'
            }`}
          >
            {viewMode === 'list' && (
              <motion.div
                layoutId="catalogViewMode"
                className="absolute inset-0 rounded-lg bg-[#1E2228] border border-[#2B313A] shadow-sm -z-10"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}
            <ListViewIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

      {/* VARIANT 2: Горизонтальные быстрые чипы характеристик над каталогом */}
      {activeVariant === 'top_chips' && categoryFacets.length > 0 && (
        <div
          ref={chipBarRef}
          className="flex items-center gap-2 overflow-x-auto pb-1 simona-sidebar-scrollbar pt-1 border-t border-[#2B313A]/40"
        >
          <span className="text-[11px] font-semibold text-[#87888A] uppercase tracking-wider shrink-0 mr-1">
            Быстрые фильтры:
          </span>
          {categoryFacets.map((facet) => {
            const selectedVals = filters.selectedFeatures?.[facet.label] || [];
            const isChipOpen = openChipLabel === facet.label;
            const hasSelected = selectedVals.length > 0;

            return (
              <div key={facet.label} className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setOpenChipLabel(isChipOpen ? null : facet.label)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                    hasSelected
                      ? 'bg-simona-teal/20 border-simona-teal text-white shadow-sm'
                      : 'bg-[#16191D] border-[#2B313A] text-[#D7D9DB] hover:border-simona-teal/50 hover:text-white'
                  }`}
                >
                  <span>{facet.label}</span>
                  {hasSelected && (
                    <span className="px-1.5 py-0.2 rounded-md bg-simona-teal text-white text-[10px] font-mono">
                      {selectedVals.length}
                    </span>
                  )}
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isChipOpen ? 'rotate-180 text-simona-teal' : 'text-[#87888A]'
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isChipOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -4, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.98 }}
                      transition={{ duration: 0.16 }}
                      className="absolute left-0 top-full mt-1.5 z-40 min-w-[220px] max-h-60 overflow-y-auto bg-[#16191D] border border-[#2B313A] rounded-xl shadow-2xl p-2 simona-sidebar-scrollbar"
                    >
                      <div className="space-y-1">
                        {facet.options.map((opt) => {
                          const isChecked = selectedVals.includes(opt.value);
                          return (
                            <label
                              key={opt.value}
                              onClick={() => onToggleFeature?.(facet.label, opt.value)}
                              className="flex items-center justify-between text-xs cursor-pointer p-1.5 rounded-lg hover:bg-[#1E2228] transition-colors"
                            >
                              <div className="flex items-center space-x-2 truncate pr-2">
                                <div
                                  className={`w-3.5 h-3.5 rounded-[3px] border flex items-center justify-center transition-colors ${
                                    isChecked
                                      ? 'bg-simona-teal border-simona-teal text-white'
                                      : 'bg-[#1E2228] border-[#2B313A]'
                                  }`}
                                >
                                  {isChecked && (
                                    <SimonaIconCheck className="w-2.5 h-2.5 stroke-[2.5]" />
                                  )}
                                </div>
                                <span
                                  className={`text-[11.5px] truncate ${
                                    isChecked ? 'text-white font-medium' : 'text-[#D7D9DB]'
                                  }`}
                                >
                                  {opt.value}
                                </span>
                              </div>
                              <span className="text-[10px] text-[#87888A] font-mono shrink-0">
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
        </div>
      )}
    </div>
  );
}

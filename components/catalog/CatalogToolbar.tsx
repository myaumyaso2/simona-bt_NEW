'use client';

import React from 'react';
import { X, SlidersHorizontal, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FilterState } from './CatalogSidebar';

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
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onOpenMobileFilters: () => void;
}

export function CatalogToolbar({
  filters,
  onRemoveBrand,
  onRemoveWidth,
  onRemoveColor,
  sort,
  onSortChange,
  viewMode,
  onViewModeChange,
  onOpenMobileFilters,
}: CatalogToolbarProps) {
  const [isSortOpen, setIsSortOpen] = React.useState(false);
  const sortRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setIsSortOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSortOpen(false);
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
    filters.selectedColor !== null;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-2">
      {/* Left: Active Chips or Mobile Filter Trigger */}
      <div className="flex items-center flex-wrap gap-2">
        {/* Mobile Filter Button */}
        <button
          onClick={onOpenMobileFilters}
          className="lg:hidden inline-flex items-center px-3.5 py-2 rounded-xl bg-[#16191D] border border-[#2B313A] text-xs font-semibold text-white hover:border-simona-teal transition active:scale-95"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 mr-2 text-simona-teal" />
          Фильтры
          {filters.selectedBrands.length > 0 && (
            <span className="ml-1.5 px-1.5 py-0.2 bg-simona-teal text-white rounded-full text-[10px]">
              {filters.selectedBrands.length}
            </span>
          )}
        </button>

        {/* Active Filter Chips */}
        {filters.selectedBrands.map((brand) => (
          <button
            key={brand}
            onClick={() => onRemoveBrand(brand)}
            className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-[#16191D] border border-[#2B313A] hover:border-rose-500/50 text-xs text-[#D7D9DB] hover:text-white transition group"
          >
            <span>{brand}</span>
            <X className="w-3 h-3 text-[#87888A] group-hover:text-rose-400 transition-colors" />
          </button>
        ))}

        {filters.selectedWidth && (
          <button
            onClick={onRemoveWidth}
            className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-[#16191D] border border-[#2B313A] hover:border-rose-500/50 text-xs text-[#D7D9DB] hover:text-white transition group"
          >
            <span>{filters.selectedWidth}</span>
            <X className="w-3 h-3 text-[#87888A] group-hover:text-rose-400 transition-colors" />
          </button>
        )}

        {filters.selectedColor && (
          <button
            onClick={onRemoveColor}
            className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-[#16191D] border border-[#2B313A] hover:border-rose-500/50 text-xs text-[#D7D9DB] hover:text-white transition group"
          >
            <span>Цвет отделки</span>
            <X className="w-3 h-3 text-[#87888A] group-hover:text-rose-400 transition-colors" />
          </button>
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
                          <Check className="w-3.5 h-3.5 text-simona-teal shrink-0 ml-2" />
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
  );
}

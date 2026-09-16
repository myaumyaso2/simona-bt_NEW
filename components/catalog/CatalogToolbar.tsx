'use client';

import React from 'react';
import { X, SlidersHorizontal, LayoutGrid, Grid3X3 } from 'lucide-react';
import { FilterState } from './CatalogSidebar';

export type SortOption = 'showroom_first' | 'popular' | 'price_asc' | 'price_desc' | 'newest';

interface CatalogToolbarProps {
  filters: FilterState;
  onRemoveBrand: (brand: string) => void;
  onRemoveWidth: () => void;
  onRemoveColor: () => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  columns: 3 | 4;
  onColumnsChange: (cols: 3 | 4) => void;
  onOpenMobileFilters: () => void;
}

export function CatalogToolbar({
  filters,
  onRemoveBrand,
  onRemoveWidth,
  onRemoveColor,
  sort,
  onSortChange,
  columns,
  onColumnsChange,
  onOpenMobileFilters,
}: CatalogToolbarProps) {
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
        {/* Sort dropdown */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-[#87888A] hidden md:inline">Сортировка:</span>
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="bg-[#16191D] border border-[#2B313A] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-simona-teal transition cursor-pointer font-medium"
          >
            <option value="showroom_first">Сначала в салонах</option>
            <option value="popular">По популярности</option>
            <option value="price_asc">По возрастанию цены</option>
            <option value="price_desc">По убыванию цены</option>
            <option value="newest">Новинки</option>
          </select>
        </div>

        {/* Column switch (Desktop only) */}
        <div className="hidden xl:flex items-center space-x-1 bg-[#16191D] p-1 rounded-xl border border-[#2B313A]">
          <button
            onClick={() => onColumnsChange(3)}
            title="3 колонки"
            className={`p-1.5 rounded-lg transition ${
              columns === 3
                ? 'bg-[#1E2228] text-white shadow-sm'
                : 'text-[#87888A] hover:text-white'
            }`}
          >
            <Grid3X3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onColumnsChange(4)}
            title="4 колонки"
            className={`p-1.5 rounded-lg transition ${
              columns === 4
                ? 'bg-[#1E2228] text-white shadow-sm'
                : 'text-[#87888A] hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

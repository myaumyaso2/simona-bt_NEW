'use client';

import React from 'react';
import { X } from 'lucide-react';
import { CatalogSidebar, FilterState } from './CatalogSidebar';

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  totalFilteredCount: number;
  brandCounts?: Record<string, number>;
}

export function MobileFilterDrawer({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onResetFilters,
  totalFilteredCount,
  brandCounts,
}: MobileFilterDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-sm bg-[#16191D] h-full flex flex-col z-10 border-l border-[#2B313A] shadow-2xl">
        {/* Drawer Header */}
        <div className="p-4 border-b border-[#2B313A] flex items-center justify-between">
          <h3 className="text-base font-montserrat font-bold text-white">
            Фильтры
          </h3>
          <button
            onClick={onClose}
            aria-label="Закрыть фильтры"
            className="p-1.5 rounded-lg bg-[#1E2228] border border-[#2B313A] text-[#87888A] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <CatalogSidebar
            filters={filters}
            onFilterChange={onFilterChange}
            onResetFilters={onResetFilters}
            brandCounts={brandCounts}
          />
        </div>

        {/* Sticky Apply Button */}
        <div className="p-4 border-t border-[#2B313A] bg-[#16191D]">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-bold tracking-wide transition shadow-lg shadow-simona-teal/20"
          >
            Показать {totalFilteredCount} приборов
          </button>
        </div>
      </div>
    </div>
  );
}

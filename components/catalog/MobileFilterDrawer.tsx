'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SimonaIconClose } from '@/components/brand/SimonaIcons';
import { CatalogSidebar, FilterState, BrandOption } from './CatalogSidebar';
import { CategoryFacet } from '@/lib/productFeatures';
import { ProductGroupOption } from '@/lib/catalog/productGroups';

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  totalFilteredCount: number;
  availableGroups?: ProductGroupOption[];
  availableBrands?: BrandOption[];
  brandCounts?: Record<string, number>;
  promoCounts?: Record<string, number>;
  priceBounds?: { min: number; max: number };
  categoryFacets?: CategoryFacet[];
  brandLock?: string;
  onUnlockBrand?: () => void;
}

export function MobileFilterDrawer({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onResetFilters,
  totalFilteredCount,
  availableGroups,
  availableBrands,
  brandCounts,
  promoCounts,
  priceBounds,
  categoryFacets,
  brandLock,
  onUnlockBrand,
}: MobileFilterDrawerProps) {
  // Lock body scroll when Bottom Sheet is open
  useEffect(() => {
    if (!isOpen) return;
    const orig = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = orig;
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const activeFiltersCount =
    (filters.selectedGroups?.length || 0) +
    (filters.selectedBrands?.length || 0) +
    (filters.selectedPromos?.length || 0) +
    (filters.selectedWidth ? 1 : 0) +
    (filters.selectedColor ? 1 : 0) +
    Object.values(filters.selectedFeatures || {}).reduce((acc, v) => acc + v.length, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Bottom Sheet Panel (90vh maximum, rounded top, drag to dismiss) */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.15}
            onDragEnd={(_, info) => {
              if (info.offset.y > 90 || info.velocity.y > 450) {
                onClose();
              }
            }}
            className="relative w-full max-h-[90vh] bg-[#16191D] rounded-t-3xl border-t border-x border-[#2B313A] shadow-2xl flex flex-col z-10 overscroll-contain"
          >
            {/* Top Drag Handle */}
            <div className="pt-3 pb-1 flex justify-center cursor-grab active:cursor-grabbing">
              <div className="w-12 h-1.5 rounded-full bg-[#3E4550]" />
            </div>

            {/* Bottom Sheet Header */}
            <div className="px-5 py-3 border-b border-[#2B313A] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-montserrat font-bold text-white tracking-tight">
                  Фильтры
                </h3>
                {activeFiltersCount > 0 && (
                  <span className="px-2 py-0.5 rounded-md bg-simona-teal text-white text-[11px] font-mono font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {activeFiltersCount > 0 && (
                  <button
                    type="button"
                    onClick={onResetFilters}
                    className="text-xs text-simona-teal hover:text-white font-medium transition cursor-pointer"
                  >
                    Сбросить все
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Закрыть фильтры"
                  className="w-9 h-9 rounded-xl bg-[#1E2228] border border-[#2B313A] text-[#87888A] hover:text-white flex items-center justify-center transition cursor-pointer active:scale-95"
                >
                  <SimonaIconClose className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 simona-sidebar-scrollbar">
              <CatalogSidebar
                filters={filters}
                onFilterChange={onFilterChange}
                onResetFilters={onResetFilters}
                availableGroups={availableGroups}
                availableBrands={availableBrands}
                brandCounts={brandCounts}
                promoCounts={promoCounts}
                priceBounds={priceBounds}
                categoryFacets={categoryFacets}
                brandLock={brandLock}
                onUnlockBrand={onUnlockBrand}
                hideHeader={true}
              />
            </div>

            {/* Sticky Bottom Apply Button with Safe-Area */}
            <div className="p-4 border-t border-[#2B313A] bg-[#16191D]/95 backdrop-blur-md pb-[max(1rem,env(safe-area-inset-bottom))]">
              <button
                type="button"
                onClick={onClose}
                className="w-full h-12 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-sm font-bold tracking-wide transition shadow-lg shadow-simona-teal/25 flex items-center justify-center cursor-pointer active:scale-[0.98]"
              >
                Показать {totalFilteredCount} приборов
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

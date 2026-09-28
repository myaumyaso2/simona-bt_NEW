'use client';

import React, { useMemo } from 'react';
import { ProductItem } from '@/types';

export interface TabItem {
  id: string;
  label: string;
}

export function getProductTabs(product: ProductItem): TabItem[] {
  const tabs: TabItem[] = [
    {
      id: 'about',
      label: product.technologies && product.technologies.length > 0 ? 'О технологиях' : 'О приборе',
    },
    { id: 'specs', label: 'Характеристики' },
  ];

  // Zero Dead Ends: Only render Schematics tab if actual files exist
  if (product.schematicPdfUrl || product.schematicDwgUrl) {
    tabs.push({ id: 'schematics', label: 'Схемы встройки (PDF/DWG)' });
  }

  tabs.push({ id: 'bundle', label: 'Комплект в едином стиле' });

  // Zero Dead Ends & Absolute Zero: Only show reviews if authentic reviews exist
  if (product.reviews && product.reviews.length > 0) {
    tabs.push({ id: 'reviews', label: `Отзывы (${product.reviews.length})` });
  }

  return tabs;
}

interface ProductStickySubNavProps {
  product: ProductItem;
  activeTab: string;
  onSelectTab: (tabId: string) => void;
}

export function ProductStickySubNav({
  product,
  activeTab,
  onSelectTab,
}: ProductStickySubNavProps) {
  const tabs = useMemo(() => getProductTabs(product), [product]);

  return (
    <div className="sticky top-[76px] z-30 w-full bg-[#111315]/95 backdrop-blur-md border-y border-[#2B313A] shadow-md">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex items-center h-14 overflow-x-auto scrollbar-none">
        {/* Navigation Tabs (Dynamic, Zero Dead Ends) */}
        <div className="flex items-center gap-6 sm:gap-8 h-full shrink-0">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`h-full flex items-center text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer relative shrink-0 ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'text-[#87888A] hover:text-[#D7D9DB]'
                }`}
              >
                <span>{tab.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-simona-teal shadow-[0_-2px_8px_rgba(0,151,156,0.5)]" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

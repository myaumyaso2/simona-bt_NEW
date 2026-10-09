'use client';

import React, { useMemo } from 'react';
import { ProductItem } from '@/types';
import { getPromosForProduct, getPromosForCategory } from '@/data/promosData';

export interface TabItem {
  id: string;
  label: string;
}

export function getProductTabs(product: ProductItem): TabItem[] {
  const tabs: TabItem[] = [
    { id: 'specs', label: 'Характеристики' },
  ];

  // 2. Dynamic promos tab (Zero Dead Ends: only if promos exist for this product)
  const productPromos = getPromosForProduct(product);
  const categoryPromos = getPromosForCategory(product.category);
  const brandCategoryPromo = !productPromos[0]
    ? categoryPromos.find(
        (p) => p.brand.toLowerCase() === (product.brand || '').toLowerCase()
      ) || null
    : null;
  const promoCount = productPromos.length > 0 ? productPromos.length : brandCategoryPromo ? 1 : 0;

  if (promoCount > 0) {
    tabs.push({
      id: 'promos',
      label: `Акции (${promoCount})`,
    });
  }

  // 3. О приборе / О технологиях
  tabs.push({
    id: 'about',
    label: product.technologies && product.technologies.length > 0 ? 'О технологиях' : 'О приборе',
  });

  // Tabs 'schematics', 'bundle' and 'reviews' hidden per user request

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
                className={`h-full flex items-center gap-1.5 text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer relative shrink-0 ${
                  isActive
                    ? tab.id === 'promos'
                      ? 'text-white font-semibold'
                      : 'text-white font-semibold'
                    : tab.id === 'promos'
                    ? 'text-simona-wine-light hover:text-white'
                    : 'text-[#87888A] hover:text-[#D7D9DB]'
                }`}
              >
                {tab.id === 'promos' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-simona-wine shrink-0 animate-pulse" />
                )}
                <span>{tab.label}</span>
                {isActive && (
                  <span
                    className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                      tab.id === 'promos'
                        ? 'bg-simona-wine shadow-[0_-2px_8px_rgba(138,21,26,0.6)]'
                        : 'bg-simona-teal shadow-[0_-2px_8px_rgba(0,151,156,0.5)]'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

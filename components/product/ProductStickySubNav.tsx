'use client';

import React from 'react';
import { ProductItem } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useStore } from '@/components/providers/StoreContext';
import { SimonaIconCart } from '@/components/brand/SimonaIcons';

export interface TabItem {
  id: string;
  label: string;
}

export const PRODUCT_TABS: TabItem[] = [
  { id: 'about', label: 'О товаре и технологии' },
  { id: 'specs', label: 'Характеристики' },
  { id: 'schematics', label: 'Схемы встройки (PDF/DWG)' },
  { id: 'bundle', label: 'Комплект в едином стиле' },
  { id: 'reviews', label: 'Отзывы и экспертиза' },
];

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
  const { addToCart, setIsCartOpen } = useStore();

  const handleQuickAdd = () => {
    addToCart(product, 1, false);
    setIsCartOpen(true);
  };

  const images = product.images || [];
  const thumbnail = images[0] || 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=100&q=80';

  return (
    <div className="sticky top-[76px] z-30 w-full bg-[#111315]/95 backdrop-blur-md border-y border-[#2B313A] shadow-md">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex items-center justify-between h-14 overflow-x-auto scrollbar-none">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-6 sm:gap-8 h-full shrink-0">
          {PRODUCT_TABS.map((tab) => {
            const isActive = tab.id === activeTab;
            const reviewCount = tab.id === 'reviews' ? ` (${product.reviewsCount || 28})` : '';
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
                <span>
                  {tab.label}
                  {reviewCount}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-simona-teal shadow-[0_-2px_8px_rgba(0,151,156,0.5)]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Floating Mini Buy Box Widget (Right) */}
        <div className="hidden lg:flex items-center gap-3.5 pl-6 border-l border-[#2B313A] shrink-0">
          <img
            src={thumbnail}
            alt={product.name}
            className="w-9 h-9 object-cover rounded-lg border border-[#2B313A] bg-[#1E2228]"
          />

          <div className="flex flex-col">
            <span className="text-xs font-semibold text-white truncate max-w-[160px]">
              {product.brand} {product.sku}
            </span>
            <span className="text-xs font-extrabold text-white">
              {formatPrice(product.price)}
            </span>
          </div>

          <button
            onClick={handleQuickAdd}
            className="h-8 px-4 rounded-full bg-simona-teal hover:bg-simona-teal-light text-white text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
          >
            <SimonaIconCart className="w-3 h-3 text-white" />
            <span>В корзину</span>
          </button>
        </div>
      </div>
    </div>
  );
}

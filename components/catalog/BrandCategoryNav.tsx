'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SimonaIconChevronLeft, SimonaIconChevronRight } from '@/components/brand/SimonaIcons';
import { BrandCategoryTab } from '@/lib/catalog/brandCategories';

interface BrandCategoryNavProps {
  categories: BrandCategoryTab[];
  activeCategorySlug: string;
  onSelectCategory: (slug: string) => void;
  className?: string;
}

export function BrandCategoryNav({
  categories,
  activeCategorySlug,
  onSelectCategory,
  className = '',
}: BrandCategoryNavProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [categories]);

  // Smoothly scroll active category pill into view if needed
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const activeBtn = el.querySelector<HTMLButtonElement>(`[data-slug="${activeCategorySlug}"]`);
    if (activeBtn) {
      const containerRect = el.getBoundingClientRect();
      const btnRect = activeBtn.getBoundingClientRect();
      if (btnRect.left < containerRect.left || btnRect.right > containerRect.right) {
        activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
    checkScroll();
  }, [activeCategorySlug]);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = Math.max(200, el.clientWidth * 0.6);
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  if (!categories || categories.length === 0) return null;

  return (
    <div className={`relative max-w-full flex items-center ${className}`}>
      {/* Pill Container: Identical styling & animation to physical presence slider */}
      <div className="relative inline-flex items-center max-w-full rounded-xl">
        {/* Left Chevron Button with Soft Gradient Fade */}
        {canScrollLeft && (
          <div className="hidden md:flex absolute left-0 top-0 bottom-0 z-20 items-center pl-1 pr-7 bg-gradient-to-r from-[#16191D] via-[#16191D]/90 to-transparent pointer-events-none rounded-l-xl">
            <button
              type="button"
              onClick={() => handleScroll('left')}
              aria-label="Прокрутить категории влево"
              className="pointer-events-auto w-7 h-7 rounded-lg bg-[#1E2228] border border-[#2B313A] text-[#87888A] hover:text-white hover:border-simona-teal hover:bg-[#252A32] flex items-center justify-center transition-all shadow-md hover:shadow-simona-teal/20 cursor-pointer shrink-0"
            >
              <SimonaIconChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="relative inline-flex items-center p-1 rounded-xl bg-[#16191D] border border-[#2B313A] gap-1 overflow-x-auto no-scrollbar scroll-smooth max-w-full select-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((cat) => {
            const isActive = activeCategorySlug === cat.slug;
            return (
              <button
                key={cat.slug}
                type="button"
                data-slug={cat.slug}
                onClick={() => onSelectCategory(cat.slug)}
                className={`relative z-10 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors duration-200 whitespace-nowrap cursor-pointer select-none shrink-0 ${
                  isActive ? 'text-white' : 'text-[#87888A] hover:text-[#D7D9DB]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="brandCategoryActiveTab"
                    className="absolute inset-0 rounded-lg bg-[#1E2228] border border-[#2B313A] shadow-sm -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <span>{cat.menuTitle || cat.title}</span>
                <span
                  className={`ml-1 text-[11px] font-mono transition-colors duration-200 ${
                    isActive ? 'text-simona-teal font-semibold' : 'text-[#87888A] font-normal'
                  }`}
                >
                  ({cat.count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Chevron Button with Soft Gradient Fade */}
        {canScrollRight && (
          <div className="hidden md:flex absolute right-0 top-0 bottom-0 z-20 items-center pr-1 pl-7 bg-gradient-to-l from-[#16191D] via-[#16191D]/90 to-transparent pointer-events-none rounded-r-xl">
            <button
              type="button"
              onClick={() => handleScroll('right')}
              aria-label="Прокрутить категории вправо"
              className="pointer-events-auto w-7 h-7 rounded-lg bg-[#1E2228] border border-[#2B313A] text-[#87888A] hover:text-white hover:border-simona-teal hover:bg-[#252A32] flex items-center justify-center transition-all shadow-md hover:shadow-simona-teal/20 cursor-pointer shrink-0"
            >
              <SimonaIconChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

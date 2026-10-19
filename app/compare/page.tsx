'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useStore } from '@/components/providers/StoreContext';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { LuxuryProductCard } from '@/components/catalog/LuxuryProductCard';
import {
  SimonaIconCompare,
  SimonaIconDownload,
  SimonaIconCheck,
  SimonaIconPlus,
  SimonaIconArrowRight,
  SimonaIconChevronLeft,
  SimonaIconChevronRight,
  SimonaIconTrash,
} from '@/components/brand/SimonaIcons';
import { getProductPhysicalStatus } from '@/lib/utils';
import { ProductItem } from '@/types';

export default function ComparePage() {
  const {
    compare,
    toggleCompare,
    clearCompareCategory,
    updateCompareCategories,
  } = useStore();

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [diffOnly, setDiffOnly] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('');

  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // 1. Fetch products batch when compare IDs change
  useEffect(() => {
    if (compare.length === 0) {
      setProducts([]);
      return;
    }

    const fetchBatch = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/products/batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: compare }),
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.products)) {
          setProducts(data.products);

          // Synchronize cached category map in StoreContext
          const categoryMap: Record<string, string> = {};
          data.products.forEach((p: ProductItem) => {
            if (p.id && p.category) {
              categoryMap[p.id] = p.category;
            }
          });
          updateCompareCategories(categoryMap);
        }
      } catch (err) {
        console.error('Failed to load comparison products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBatch();
  }, [compare, updateCompareCategories]);

  // 2. Derive unique categories currently in compare
  const categories = useMemo(() => {
    const list: string[] = [];
    products.forEach((p) => {
      const cat = p.category || 'Без категории';
      if (!list.includes(cat)) {
        list.push(cat);
      }
    });
    return list;
  }, [products]);

  // 3. Keep activeCategory in sync with available categories
  useEffect(() => {
    if (categories.length > 0) {
      if (!activeCategory || !categories.includes(activeCategory)) {
        setActiveCategory(categories[0]);
      }
    } else {
      setActiveCategory('');
    }
  }, [categories, activeCategory]);

  // 4. Products for currently selected category (max 4 per category)
  const categoryProducts = useMemo(() => {
    if (!activeCategory) return [];
    return products
      .filter((p) => (p.category || 'Без категории') === activeCategory)
      .slice(0, 4);
  }, [products, activeCategory]);

  // 5. Category slider scroll monitoring
  const updateScrollButtons = () => {
    const el = sliderRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => {
    updateScrollButtons();
    const el = sliderRef.current;
    if (!el) return;

    const handleResize = () => updateScrollButtons();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [categories]);

  // Smooth scroll active category pill into view when activeCategory changes
  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    const activeBtn = el.querySelector<HTMLButtonElement>(
      `[data-category="${activeCategory}"]`
    );
    if (activeBtn) {
      const containerRect = el.getBoundingClientRect();
      const btnRect = activeBtn.getBoundingClientRect();
      if (btnRect.left < containerRect.left || btnRect.right > containerRect.right) {
        activeBtn.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest',
        });
      }
    }
    updateScrollButtons();
  }, [activeCategory]);

  const scrollSlider = (direction: 'left' | 'right') => {
    const el = sliderRef.current;
    if (!el) return;
    const scrollAmount = Math.max(180, el.clientWidth * 0.5);
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
    setTimeout(updateScrollButtons, 300);
  };

  // 6. Aggregate feature labels across products in the active category
  const allFeatureLabels = useMemo(() => {
    return Array.from(
      new Set(
        categoryProducts.flatMap((p) => (p.features || []).map((f) => f.label))
      )
    );
  }, [categoryProducts]);

  // 7. Filter feature labels if diffOnly is toggled
  const displayedFeatureLabels = useMemo(() => {
    if (!diffOnly) return allFeatureLabels;
    return allFeatureLabels.filter((label) => {
      const values = categoryProducts.map((p) => {
        const found = (p.features || []).find((f) => f.label === label);
        return found ? found.value : '—';
      });
      return new Set(values).size > 1;
    });
  }, [allFeatureLabels, categoryProducts, diffOnly]);

  return (
    <main className="min-h-screen bg-[#111315] text-[#D7D9DB]">
      <Breadcrumbs items={[{ name: 'Сравнение товаров' }]} />
      <div className="pt-10 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#2B313A] pb-6">
            <div className="text-left space-y-2">
              <h1 className="text-3xl sm:text-4xl font-montserrat font-bold text-white tracking-tight">
              {activeCategory
                ? `${activeCategory} (${categoryProducts.length} из 4)`
                : `Модели (${products.length})`}
            </h1>
            <p className="text-xs sm:text-sm text-[#87888A] max-w-xl">
              {activeCategory
                ? `Детальное сопоставление габаритов, монтажных требований и функционала приборов в категории «${activeCategory}».`
                : 'Детальное сопоставление габаритов, монтажных требований и функционала приборов премиальных брендов.'}
            </p>
          </div>

          {/* Controls: DiffOnly Toggle + Clear Category */}
          {categoryProducts.length > 0 && (
            <div className="flex items-center flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setDiffOnly((prev) => !prev)}
                className="flex items-center space-x-2.5 bg-[#16191D] border border-[#2B313A] hover:border-simona-teal/60 px-3.5 py-2.5 rounded-xl cursor-pointer select-none text-xs text-zinc-300 hover:text-white transition group/diff"
              >
                <div
                  className={`w-4 h-4 rounded-[4px] border shrink-0 flex items-center justify-center transition-colors ${
                    diffOnly
                      ? 'bg-simona-teal border-simona-teal text-white shadow-sm'
                      : 'bg-[#1E2228] border-[#2B313A] group-hover/diff:border-simona-teal/60'
                  }`}
                >
                  {diffOnly && <SimonaIconCheck className="w-3 h-3 stroke-[2.5]" />}
                </div>
                <span
                  className={
                    diffOnly
                      ? 'text-white font-medium'
                      : 'text-zinc-300 group-hover/diff:text-white'
                  }
                >
                  Только различия
                </span>
              </button>

              <button
                onClick={() => clearCompareCategory(activeCategory)}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-[#16191D] border border-[#2B313A] text-xs text-[#87888A] hover:text-red-400 hover:border-red-500/40 hover:bg-red-500/10 transition cursor-pointer"
                title={`Очистить приборы в категории «${activeCategory}»`}
              >
                <SimonaIconTrash className="w-3.5 h-3.5" />
                <span>Очистить эту категорию</span>
              </button>
            </div>
          )}
        </div>

        {/* Categories Slider (Brand Category Nav Single-Pill Bar Style) */}
        {categories.length > 0 && (
          <div className="relative max-w-full flex items-center">
            <div className="relative inline-flex items-center max-w-full rounded-xl">
              {/* Left Chevron Button with Soft Gradient Fade */}
              {canScrollLeft && (
                <div className="flex absolute left-0 top-0 bottom-0 z-20 items-center pl-1 pr-7 bg-gradient-to-r from-[#16191D] via-[#16191D]/90 to-transparent pointer-events-none rounded-l-xl">
                  <button
                    type="button"
                    onClick={() => scrollSlider('left')}
                    aria-label="Прокрутить категории влево"
                    className="pointer-events-auto w-7 h-7 rounded-lg bg-[#1E2228] border border-[#2B313A] text-[#87888A] hover:text-white hover:border-simona-teal hover:bg-[#252A32] flex items-center justify-center transition-all shadow-md hover:shadow-simona-teal/20 cursor-pointer shrink-0"
                  >
                    <SimonaIconChevronLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Scrollable Category Pills */}
              <div
                ref={sliderRef}
                onScroll={updateScrollButtons}
                className="relative inline-flex items-center p-1 rounded-xl bg-[#16191D] border border-[#2B313A] gap-1 overflow-x-auto no-scrollbar scroll-smooth max-w-full select-none"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {categories.map((cat) => {
                  const count = products.filter(
                    (p) => (p.category || 'Без категории') === cat
                  ).length;
                  const isActive = cat === activeCategory;
                  return (
                    <button
                      key={cat}
                      type="button"
                      data-category={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`relative z-10 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors duration-200 whitespace-nowrap cursor-pointer select-none shrink-0 ${
                        isActive
                          ? 'text-white'
                          : 'text-[#87888A] hover:text-[#D7D9DB]'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="compareCategoryActiveTab"
                          className="absolute inset-0 rounded-lg bg-[#1E2228] border border-[#2B313A] shadow-sm -z-10"
                          transition={{
                            type: 'spring',
                            stiffness: 450,
                            damping: 35,
                          }}
                        />
                      )}
                      <span>{cat}</span>
                      <span
                        className={`ml-1 text-[11px] font-mono transition-colors duration-200 ${
                          isActive
                            ? 'text-simona-teal font-semibold'
                            : 'text-[#87888A] font-normal'
                        }`}
                      >
                        ({count})
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Right Chevron Button with Soft Gradient Fade */}
              {canScrollRight && (
                <div className="flex absolute right-0 top-0 bottom-0 z-20 items-center pr-1 pl-7 bg-gradient-to-l from-[#16191D] via-[#16191D]/90 to-transparent pointer-events-none rounded-r-xl">
                  <button
                    type="button"
                    onClick={() => scrollSlider('right')}
                    aria-label="Прокрутить категории вправо"
                    className="pointer-events-auto w-7 h-7 rounded-lg bg-[#1E2228] border border-[#2B313A] text-[#87888A] hover:text-white hover:border-simona-teal hover:bg-[#252A32] flex items-center justify-center transition-all shadow-md hover:shadow-simona-teal/20 cursor-pointer shrink-0"
                  >
                    <SimonaIconChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {products.length === 0 ? (
          <div className="bg-[#16191D] border border-[#2B313A] rounded-3xl p-12 text-center max-w-2xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-simona-teal/10 border border-simona-teal/20 text-simona-teal flex items-center justify-center mx-auto">
              <SimonaIconCompare className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-montserrat font-bold text-white">
              Список сравнения пуст
            </h2>
            <p className="text-xs sm:text-sm text-[#87888A] leading-relaxed">
              Добавляйте интересующие приборы в сравнение прямо из каталога с помощью иконки со шкалой, чтобы наглядно сопоставить их функционал, схемы встройки и габариты. В каждой категории можно сравнивать до 4 моделей одновременно.
            </p>
            <div className="pt-2">
              <Link
                href="/catalog"
                className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-simona-teal/20 cursor-pointer"
              >
                <span>Перейти в каталог</span>
                <SimonaIconArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* Comparison Matrix Table with Synchronized Column Alignment */
          <div className="overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-zinc-700 rounded-2xl border border-[#2B313A] bg-[#16191D]/40">
            <div className="w-full min-w-max divide-y divide-[#2B313A]/60">
              
              {/* Product Cards Row (Clean transparent spacer, adaptive column width, zero graphite overlay) */}
              <div className="flex items-stretch p-4 gap-4">
                {/* Completely Transparent Left Spacer (No background, No border, No shadow) */}
                <div className="w-56 sm:w-60 min-w-[210px] shrink-0 pointer-events-none" />

                {/* Compared Products Cards Container */}
                <div className="flex items-stretch gap-4 flex-1">
                  {categoryProducts.map((item) => (
                    <div
                      key={item.id}
                      className="flex-1 min-w-[270px] max-w-[320px] shrink-0 flex flex-col"
                    >
                      <LuxuryProductCard
                        product={item}
                        showCompareRemove={true}
                        onRemoveFromCompare={() =>
                          toggleCompare(item.id, item.category)
                        }
                      />
                    </div>
                  ))}

                  {/* Empty Slot to add another product up to 4: perfectly fits inside container active area */}
                  {categoryProducts.length < 4 && (
                    <div className="flex-1 min-w-[270px] max-w-[320px] shrink-0 flex flex-col">
                      <Link
                        href={`/catalog?category=${encodeURIComponent(
                          activeCategory
                        )}`}
                        className="w-full h-full border-2 border-dashed border-[#2B313A] hover:border-simona-teal/60 rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all duration-300 group text-[#87888A] hover:text-white bg-[#16191D]/40 hover:bg-[#16191D]/70 cursor-pointer shadow-xl"
                      >
                        <div className="w-14 h-14 rounded-2xl bg-[#1E2228] border border-[#2B313A] group-hover:border-simona-teal/50 flex items-center justify-center mb-4 group-hover:scale-105 transition shadow-lg">
                          <SimonaIconPlus className="w-6 h-6 text-simona-teal" />
                        </div>
                        <span className="text-base font-semibold text-white block mb-1">
                          Добавить прибор
                        </span>
                        <span className="text-xs text-[#87888A] max-w-[200px] leading-relaxed">
                          в категории «{activeCategory}» (еще{' '}
                          {4 - categoryProducts.length} из 4)
                        </span>
                        <div className="mt-6 px-4 py-2 rounded-xl bg-simona-teal/15 text-simona-teal text-xs font-semibold border border-simona-teal/30 group-hover:bg-simona-teal group-hover:text-white transition-all shadow-md shadow-simona-teal/10">
                          Выбрать в каталоге
                        </div>
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Row: Availability Status */}
              <div className="flex items-center min-w-max p-3.5 gap-4 hover:bg-[#1E2228]/20 transition">
                <div className="w-56 sm:w-60 min-w-[210px] sticky left-0 z-20 bg-[#111315] font-semibold text-xs text-zinc-400 pl-4 pr-4 border-r border-[#2B313A]/60 shadow-[4px_0_12px_rgba(0,0,0,0.5)]">
                  Наличие и статус
                </div>
                <div className="flex items-center gap-4 flex-1">
                  {categoryProducts.map((p) => {
                    const status = getProductPhysicalStatus(p);
                    return (
                      <div key={p.id} className="flex-1 min-w-[270px] max-w-[320px] shrink-0 text-xs">
                        {status === 'SHOWROOM' ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#16191D] text-simona-teal border border-simona-teal/40">
                            На витрине
                          </span>
                        ) : status === 'LOCAL_STOCK' ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#16191D] text-simona-teal border border-simona-teal/40">
                            На складе
                          </span>
                        ) : status === 'REMOTE_STOCK' ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#16191D] text-simona-teal border border-simona-teal/40">
                            На удаленном складе
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#1E2228] text-zinc-300 border border-[#2B313A]">
                            Под заказ
                          </span>
                        )}
                      </div>
                    );
                  })}
                  {categoryProducts.length < 4 && (
                    <div className="flex-1 min-w-[270px] max-w-[320px] shrink-0 text-zinc-600 text-xs">
                      —
                    </div>
                  )}
                </div>
              </div>

              {/* Row: Dimensions */}
              <div className="flex items-center min-w-max p-3.5 gap-4 hover:bg-[#1E2228]/20 transition">
                <div className="w-56 sm:w-60 min-w-[210px] sticky left-0 z-20 bg-[#111315] font-semibold text-xs text-zinc-400 pl-4 pr-4 border-r border-[#2B313A]/60 shadow-[4px_0_12px_rgba(0,0,0,0.5)]">
                  Габариты прибора (Ш×В×Г)
                </div>
                <div className="flex items-center gap-4 flex-1">
                  {categoryProducts.map((p) => (
                    <div
                      key={p.id}
                      className="flex-1 min-w-[270px] max-w-[320px] shrink-0 text-xs text-white font-mono"
                    >
                      {p.dimensions || '59.5 × 59.5 × 56.4 см'}
                    </div>
                  ))}
                  {categoryProducts.length < 4 && (
                    <div className="flex-1 min-w-[270px] max-w-[320px] shrink-0 text-zinc-600 text-xs">
                      —
                    </div>
                  )}
                </div>
              </div>

              {/* Row: Schematic PDF */}
              <div className="flex items-center min-w-max p-3.5 gap-4 hover:bg-[#1E2228]/20 transition">
                <div className="w-56 sm:w-60 min-w-[210px] sticky left-0 z-20 bg-[#111315] font-semibold text-xs text-zinc-400 pl-4 pr-4 border-r border-[#2B313A]/60 shadow-[4px_0_12px_rgba(0,0,0,0.5)]">
                  Схема встройки
                </div>
                <div className="flex items-center gap-4 flex-1">
                  {categoryProducts.map((p) => (
                    <div key={p.id} className="flex-1 min-w-[270px] max-w-[320px] shrink-0 text-xs">
                      {p.schematicPdfUrl ? (
                        <a
                          href={p.schematicPdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1.5 text-xs text-simona-teal hover:underline"
                        >
                          <SimonaIconDownload className="w-3.5 h-3.5" />
                          <span>Чертеж ниши (PDF)</span>
                        </a>
                      ) : (
                        <span className="text-zinc-500">По запросу</span>
                      )}
                    </div>
                  ))}
                  {categoryProducts.length < 4 && (
                    <div className="flex-1 min-w-[270px] max-w-[320px] shrink-0 text-zinc-600 text-xs">
                      —
                    </div>
                  )}
                </div>
              </div>

              {/* Dynamic Feature Rows */}
              {displayedFeatureLabels.map((label) => (
                <div
                  key={label}
                  className="flex items-center min-w-max p-3.5 gap-4 hover:bg-[#1E2228]/20 transition"
                >
                  <div className="w-56 sm:w-60 min-w-[210px] sticky left-0 z-20 bg-[#111315] font-semibold text-xs text-zinc-400 pl-4 pr-4 border-r border-[#2B313A]/60 shadow-[4px_0_12px_rgba(0,0,0,0.5)]">
                    {label}
                  </div>
                  <div className="flex items-center gap-4 flex-1">
                    {categoryProducts.map((p) => {
                      const feat = (p.features || []).find((f) => f.label === label);
                      const val = feat ? feat.value : '—';
                      return (
                        <div
                          key={p.id}
                          className="flex-1 min-w-[270px] max-w-[320px] shrink-0 text-xs text-white"
                        >
                          {val === 'Да' || val === 'Есть' ? (
                            <span className="text-emerald-400 font-semibold flex items-center space-x-1">
                              <SimonaIconCheck className="w-3.5 h-3.5" />
                              <span>{val}</span>
                            </span>
                          ) : val === 'Нет' ? (
                            <span className="text-zinc-500">{val}</span>
                          ) : (
                            <span>{val}</span>
                          )}
                        </div>
                      );
                    })}
                    {categoryProducts.length < 4 && (
                      <div className="flex-1 min-w-[270px] max-w-[320px] shrink-0 text-zinc-600 text-xs">
                        —
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        </div>
      </div>
    </main>
  );
}

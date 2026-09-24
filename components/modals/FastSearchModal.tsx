'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, ArrowRight } from 'lucide-react';
import { useStore } from '@/components/providers/StoreContext';
import { ProductItem } from '@/types';
import { formatPrice, PHYSICAL_STATUS_CONFIG } from '@/lib/utils';
import { getPromosForProduct } from '@/data/promosData';
import {
  SimonaIconCart,
  SimonaIconChef,
  SimonaIconSearch,
  SimonaIconClock,
  SimonaIconTrash,
} from '@/components/brand/SimonaIcons';

const HISTORY_KEY = 'simona_search_history';

export function FastSearchModal() {
  const { modal, closeModal, openModal, addToCart } = useStore();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // Load search history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSearchHistory(parsed.slice(0, 10));
        }
      }
    } catch (e) {
      console.error('Error loading search history:', e);
    }
  }, []);

  const saveToHistory = (searchTerm: string) => {
    const term = searchTerm.trim();
    if (!term || term.length < 2) return;
    try {
      const updated = [
        term,
        ...searchHistory.filter((q) => q.toLowerCase() !== term.toLowerCase()),
      ].slice(0, 10);
      setSearchHistory(updated);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving search history:', e);
    }
  };

  const clearHistory = () => {
    try {
      localStorage.removeItem(HISTORY_KEY);
      setSearchHistory([]);
    } catch (e) {
      console.error('Error clearing search history:', e);
    }
  };

  useEffect(() => {
    if (modal.type !== 'SEARCH') return;

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
      } catch (e) {
        console.error('Search error:', e);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchResults, 150);
    return () => clearTimeout(timer);
  }, [query, modal.type]);

  if (modal.type !== 'SEARCH') return null;

  const handleSelectHistory = (term: string) => {
    setQuery(term);
    saveToHistory(term);
  };

  const handleProductClick = (product: ProductItem) => {
    if (query.trim()) {
      saveToHistory(query);
    }
    closeModal();
    router.push(`/product/${product.slug}`);
  };

  const handleCategoryClick = (e: React.MouseEvent, category: string) => {
    e.stopPropagation();
    closeModal();
    router.push('/catalog');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 p-4 bg-black/80 backdrop-blur-xl animate-fade-in"
      onClick={closeModal}
    >
      <div
        className="relative w-full max-w-3xl rounded-3xl bg-[#16191D] border border-[#2B313A] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Gradient Bar */}
        <div className="h-1 w-full bg-gradient-to-r from-simona-teal via-simona-wine to-simona-teal" />

        {/* 1. Search Header */}
        <div className="p-4 sm:p-5 border-b border-[#2B313A] flex items-center gap-3 bg-[#16191D]">
          <SimonaIconSearch className="w-5 h-5 text-simona-teal shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && query.trim()) {
                saveToHistory(query);
              }
            }}
            placeholder="Поиск по каталогу: бренд, артикул (например DGC 7860), тип техники..."
            className="flex-1 bg-transparent text-white text-sm sm:text-base placeholder-[#87888A] focus:outline-none font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-[#87888A] hover:text-white font-medium transition-colors cursor-pointer px-2 py-1"
            >
              Очистить
            </button>
          )}
          <button
            onClick={closeModal}
            className="w-9 h-9 rounded-xl border border-[#2B313A] text-[#87888A] hover:text-white hover:bg-white/10 flex items-center justify-center transition cursor-pointer"
            aria-label="Закрыть поиск"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. History & Quick Suggestions */}
        {query === '' ? (
          <div className="p-4 sm:p-5 border-b border-[#2B313A] bg-[#121417] space-y-4">
            {/* Search History Chips per AGENTS.md 10.2 */}
            {searchHistory.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-[#87888A]">
                  <div className="flex items-center gap-1.5 font-medium">
                    <SimonaIconClock className="w-3.5 h-3.5 text-simona-teal" />
                    <span>История поиска</span>
                  </div>
                  <button
                    onClick={clearHistory}
                    className="inline-flex items-center gap-1 text-[11px] text-[#87888A] hover:text-simona-wine-light transition-colors cursor-pointer"
                  >
                    <SimonaIconTrash className="w-3 h-3" />
                    <span>Очистить всё</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {searchHistory.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectHistory(item)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1E2228] hover:bg-[#282E37] border border-[#2B313A] text-xs text-[#D7D9DB] hover:text-white transition-all cursor-pointer shadow-sm"
                    >
                      <SimonaIconSearch className="w-3 h-3 text-[#87888A]" />
                      <span>{item}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Brands Suggestions */}
            <div>
              <div className="text-xs text-[#87888A] font-medium mb-2">
                Популярные бренды:
              </div>
              <div className="flex items-center gap-2 overflow-x-auto text-xs scrollbar-none">
                {['Miele', 'ASKO', 'Liebherr', 'SMEG', 'OMOIKIRI', 'Bertazzoni', 'Falmec'].map(
                  (b) => (
                    <button
                      key={b}
                      onClick={() => handleSelectHistory(b)}
                      className="px-3 py-1 rounded-xl bg-[#1E2228] hover:bg-simona-teal/20 hover:border-simona-teal text-[#D7D9DB] hover:text-white border border-[#2B313A] font-semibold transition shrink-0 cursor-pointer"
                    >
                      {b}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        ) : null}

        {/* 3. Results List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {loading ? (
            <div className="text-center py-12 text-xs text-[#87888A]">
              Поиск в номенклатурной базе...
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-white font-semibold">
                По вашему запросу ничего не найдено
              </p>
              <p className="text-xs text-[#87888A] mt-1 max-w-md mx-auto leading-relaxed">
                В базе более 8 000 моделей под заказ. Оставьте заявку эксперту салона, и мы подберем прибор по вашей спецификации.
              </p>
              <button
                onClick={() => {
                  closeModal();
                  openModal('PROJECT_MATCHING');
                }}
                className="mt-4 px-5 py-2.5 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-semibold shadow-lg shadow-simona-teal/20 transition cursor-pointer"
              >
                Запросить подбор по спецификации
              </button>
            </div>
          ) : (
            results.map((product) => {
              const statusCfg =
                PHYSICAL_STATUS_CONFIG[product.physicalStatus] ||
                PHYSICAL_STATUS_CONFIG.ON_ORDER;
              const isEcom = product.categoryType === 'CATEGORY_A';
              const productPromos = getPromosForProduct(product);
              const activePromo = productPromos[0];

              return (
                <div
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className="p-3.5 rounded-2xl bg-[#1E2228] hover:bg-[#242A32] border border-[#2B313A] hover:border-simona-teal/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 shadow-sm group cursor-pointer"
                >
                  <div className="flex items-center space-x-3.5 flex-1 min-w-0">
                    {/* Media Thumbnail */}
                    <div className="w-14 h-14 rounded-xl bg-[#16191D] overflow-hidden shrink-0 border border-[#2B313A] p-1 flex items-center justify-center">
                      <img
                        src={
                          Array.isArray(product.images)
                            ? product.images[0]
                            : typeof product.imagesJson === 'string'
                            ? JSON.parse(product.imagesJson || '[]')[0]
                            : 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=400&q=80'
                        }
                        alt={product.name}
                        className="w-full h-full object-cover rounded-md group-hover:scale-105 transition-transform"
                        loading="lazy"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      {/* Breadcrumbs & Status Row per AGENTS.md 10.2 */}
                      <div className="flex flex-wrap items-center gap-2 text-[10.5px]">
                        <button
                          type="button"
                          onClick={(e) => handleCategoryClick(e, product.category)}
                          className="text-[#87888A] hover:text-simona-teal transition-colors font-medium cursor-pointer"
                        >
                          Каталог › {product.category}
                        </button>
                        <span className="text-[#2B313A]">•</span>
                        <span className="font-mono text-[#87888A]">
                          Арт: {product.sku}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${statusCfg.badgeClass}`}
                        >
                          {statusCfg.badge}
                        </span>
                        {activePromo && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-simona-wine/25 text-white border border-simona-wine/50 backdrop-blur-md">
                            <span>АКЦИЯ</span>
                          </span>
                        )}
                      </div>

                      {/* Product Name */}
                      <div className="text-xs sm:text-sm font-bold text-white group-hover:text-simona-teal transition-colors truncate mt-1">
                        {product.name}
                      </div>

                      {/* Price Row */}
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-xs sm:text-sm font-montserrat font-extrabold text-white">
                          {formatPrice(product.price)}
                        </span>
                        {product.oldPrice && (
                          <span className="text-[11px] text-[#87888A] line-through">
                            {formatPrice(product.oldPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div
                    className="shrink-0 flex items-center space-x-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-[#2B313A]/50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {isEcom ? (
                      <button
                        onClick={() => {
                          addToCart(product);
                          closeModal();
                        }}
                        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-simona-teal-dark to-simona-teal hover:to-simona-teal-light text-white text-xs font-semibold tracking-wide transition-all duration-300 shadow-md shadow-simona-teal/30 hover:scale-[1.02] active:scale-98 flex items-center cursor-pointer"
                      >
                        <SimonaIconCart className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span>В корзину</span>
                      </button>
                    ) : product.physicalStatus === 'ACTIVE_KITCHEN' ? (
                      <button
                        onClick={() => {
                          closeModal();
                          openModal('TEST_DRIVE', { product });
                        }}
                        className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 hover:bg-amber-500/30 text-amber-300 text-xs font-bold flex items-center transition cursor-pointer"
                      >
                        <SimonaIconChef className="w-3 h-3 mr-1 text-amber-400" />
                        <span>Тест-драйв</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleProductClick(product)}
                        className="px-3 py-1.5 rounded-xl bg-[#16191D] hover:bg-[#20252C] text-white text-xs font-semibold border border-[#2B313A] hover:border-simona-teal transition flex items-center gap-1 cursor-pointer"
                      >
                        <span>Подробнее</span>
                        <ArrowRight className="w-3 h-3 text-simona-teal" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

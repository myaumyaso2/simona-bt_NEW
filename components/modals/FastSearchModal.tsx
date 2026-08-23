'use client';

import React, { useState, useEffect } from 'react';
import { X, Search, Sparkles, Flame, MapPin, Package, ShoppingBag, ArrowRight } from 'lucide-react';
import { useStore } from '@/components/providers/StoreContext';
import { ProductItem } from '@/types';
import { formatPrice, PHYSICAL_STATUS_CONFIG } from '@/lib/utils';

export function FastSearchModal() {
  const { modal, closeModal, openModal, addToCart } = useStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(false);

  if (modal.type !== 'SEARCH') return null;

  useEffect(() => {
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
  }, [query]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl rounded-2xl bg-[#14161A] border border-zinc-700 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-simona-teal shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по 8 000+ товарам: бренд, артикул (например DGC 7865), тип техники..."
            className="flex-1 bg-transparent text-white text-sm sm:text-base placeholder-zinc-500 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-xs text-zinc-500 hover:text-zinc-300">
              Очистить
            </button>
          )}
          <button
            onClick={closeModal}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
            aria-label="Закрыть"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Brands Suggestions */}
        <div className="px-5 py-2.5 bg-zinc-950/60 border-b border-zinc-800 flex items-center space-x-2 overflow-x-auto text-[11px]">
          <span className="text-zinc-500 shrink-0">Популярные бренды:</span>
          {['Miele', 'ASKO', 'Liebherr', 'SMEG', 'OMOIKIRI', 'Bertazzoni', 'Falmec'].map((b) => (
            <button
              key={b}
              onClick={() => setQuery(b)}
              className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition shrink-0"
            >
              {b}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {loading ? (
            <div className="text-center py-10 text-xs text-zinc-500">
              Поиск в номенклатурной базе...
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-sm text-zinc-400">По вашему запросу ничего не найдено.</p>
              <p className="text-xs text-zinc-500 mt-1">
                В базе более 8 000 моделей под заказ. Оставьте запрос эксперту, и мы найдем нужный артикул.
              </p>
              <button
                onClick={() => {
                  closeModal();
                  openModal('PROJECT_MATCHING');
                }}
                className="mt-4 px-4 py-2 rounded-lg bg-simona-teal text-white text-xs font-medium"
              >
                Запросить поиск по спецификации
              </button>
            </div>
          ) : (
            results.map((product) => {
              const statusCfg = PHYSICAL_STATUS_CONFIG[product.physicalStatus] || PHYSICAL_STATUS_CONFIG.ON_ORDER;
              const isEcom = product.categoryType === 'CATEGORY_A';

              return (
                <div
                  key={product.id}
                  className="p-3.5 rounded-xl bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 transition flex items-center justify-between gap-4"
                >
                  <div className="flex items-center space-x-3.5 flex-1 min-w-0">
                    <div className="w-14 h-14 rounded-lg bg-zinc-950 overflow-hidden shrink-0 border border-zinc-800">
                      <img
                        src={
                          Array.isArray(product.images)
                            ? product.images[0]
                            : typeof product.imagesJson === 'string'
                            ? JSON.parse(product.imagesJson || '[]')[0]
                            : 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=400&q=80'
                        }
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] uppercase font-bold text-simona-teal">{product.brand}</span>
                        <span className="text-[10px] text-zinc-500 font-mono">Арт: {product.sku}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] ${statusCfg.badgeClass}`}>
                          {statusCfg.badge}
                        </span>
                      </div>
                      <div className="text-xs font-medium text-white truncate mt-0.5">{product.name}</div>
                      <div className="text-xs font-serif text-zinc-300 mt-0.5">{formatPrice(product.price)}</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="shrink-0 flex items-center space-x-2">
                    {isEcom ? (
                      <button
                        onClick={() => {
                          addToCart(product);
                          closeModal();
                        }}
                        className="px-3 py-1.5 rounded-lg bg-simona-teal hover:bg-simona-teal-light text-white text-xs font-semibold flex items-center"
                      >
                        <ShoppingBag className="w-3 h-3 mr-1" />
                        В корзину
                      </button>
                    ) : product.physicalStatus === 'ACTIVE_KITCHEN' ? (
                      <button
                        onClick={() => {
                          closeModal();
                          openModal('TEST_DRIVE', { product });
                        }}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold flex items-center"
                      >
                        <Flame className="w-3 h-3 mr-1" />
                        Тест-драйв
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          closeModal();
                          openModal('SHOWROOM_VISIT', { product });
                        }}
                        className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700"
                      >
                        В салон
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

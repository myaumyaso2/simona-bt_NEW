'use client';

import React, { useState, useEffect } from 'react';
import { X, Search, Sparkles } from 'lucide-react';
import { useStore } from '@/components/providers/StoreContext';
import { ProductItem } from '@/types';
import { formatPrice, PHYSICAL_STATUS_CONFIG } from '@/lib/utils';
import { SimonaIconCart, SimonaIconChef } from '@/components/brand/SimonaIcons';

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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white border border-black/[0.08] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Header */}
        <div className="p-4 sm:p-5 border-b border-black/[0.06] flex items-center gap-3">
          <Search className="w-5 h-5 text-simona-teal shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по 8 000+ товарам: бренд, артикул (например DGC 7865), тип техники..."
            className="flex-1 bg-transparent text-[#16181B] text-sm sm:text-base placeholder-[#87888A] focus:outline-none font-medium"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-xs text-[#87888A] hover:text-[#16181B] font-medium">
              Очистить
            </button>
          )}
          <button
            onClick={closeModal}
            className="p-1.5 text-[#87888A] hover:text-[#16181B] rounded-full hover:bg-zinc-100 transition"
            aria-label="Закрыть"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Brands Suggestions */}
        <div className="px-5 py-2.5 bg-[#F8F9FA] border-b border-black/[0.06] flex items-center space-x-2 overflow-x-auto text-[11px]">
          <span className="text-[#87888A] shrink-0 font-medium">Популярные бренды:</span>
          {['Miele', 'ASKO', 'Liebherr', 'SMEG', 'OMOIKIRI', 'Bertazzoni', 'Falmec'].map((b) => (
            <button
              key={b}
              onClick={() => setQuery(b)}
              className="px-2.5 py-1 rounded-full bg-white hover:bg-zinc-100 text-[#3E3D40] hover:text-[#16181B] border border-black/[0.06] font-semibold transition shrink-0 shadow-xs"
            >
              {b}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {loading ? (
            <div className="text-center py-10 text-xs text-[#87888A]">
              Поиск в номенклатурной базе...
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-sm text-[#3E3D40] font-semibold">По вашему запросу ничего не найдено.</p>
              <p className="text-xs text-[#6E7074] mt-1">
                В базе более 8 000 моделей под заказ. Оставьте запрос эксперту, и мы найдем нужный артикул.
              </p>
              <button
                onClick={() => {
                  closeModal();
                  openModal('PROJECT_MATCHING');
                }}
                className="mt-4 px-4 py-2 rounded-full bg-simona-teal text-white text-xs font-semibold shadow-md shadow-simona-teal/20"
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
                  className="p-3.5 rounded-2xl bg-[#F8F9FA] hover:bg-[#F2F3F4] border border-black/[0.04] transition flex items-center justify-between gap-4 shadow-xs"
                >
                  <div className="flex items-center space-x-3.5 flex-1 min-w-0">
                    <div className="w-14 h-14 rounded-xl bg-white overflow-hidden shrink-0 border border-black/[0.06] p-1">
                      <img
                        src={
                          Array.isArray(product.images)
                            ? product.images[0]
                            : typeof product.imagesJson === 'string'
                            ? JSON.parse(product.imagesJson || '[]')[0]
                            : 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=400&q=80'
                        }
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] uppercase font-bold text-simona-teal">{product.brand}</span>
                        <span className="text-[10px] text-[#87888A] font-mono">Арт: {product.sku}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shadow-xs ${statusCfg.badgeClass}`}>
                          {statusCfg.badge}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-[#16181B] truncate mt-0.5">{product.name}</div>
                      <div className="text-xs font-montserrat font-bold text-[#16181B] mt-0.5">{formatPrice(product.price)}</div>
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
                        className="px-3 py-1.5 rounded-full bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-bold flex items-center shadow-xs"
                      >
                        <SimonaIconCart className="w-3 h-3 mr-1" />
                        В корзину
                      </button>
                    ) : product.physicalStatus === 'ACTIVE_KITCHEN' ? (
                      <button
                        onClick={() => {
                          closeModal();
                          openModal('TEST_DRIVE', { product });
                        }}
                        className="px-3 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold flex items-center shadow-xs"
                      >
                        <SimonaIconChef className="w-3 h-3 mr-1" />
                        Тест-драйв
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          closeModal();
                          openModal('SHOWROOM_VISIT', { product });
                        }}
                        className="px-3 py-1.5 rounded-full bg-white hover:bg-zinc-100 text-[#16181B] text-xs font-semibold border border-black/[0.08] shadow-xs"
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

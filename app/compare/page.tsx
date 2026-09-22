'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/components/providers/StoreContext';
import { SectionBadge } from '@/components/ui/SectionBadge';
import {
  SimonaIconCompare,
  SimonaIconCart,
  SimonaIconHeart,
  SimonaIconGuarantee,
} from '@/components/brand/SimonaIcons';
import {
  X,
  Plus,
  ArrowRight,
  Check,
  Minus,
  Sparkles,
  Download,
  Package,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { ProductItem } from '@/types';

export default function ComparePage() {
  const { compare, toggleCompare, addToCart, isInCart, wishlist, toggleWishlist, isInWishlist } = useStore();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [diffOnly, setDiffOnly] = useState(false);

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
        }
      } catch (err) {
        console.error('Failed to load comparison products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBatch();
  }, [compare]);

  // Aggregate all unique feature labels across compared products
  const allFeatureLabels = Array.from(
    new Set(
      products.flatMap((p) => (p.features || []).map((f) => f.label))
    )
  );

  // Filter feature labels if diffOnly is checked
  const displayedFeatureLabels = diffOnly
    ? allFeatureLabels.filter((label) => {
        const values = products.map((p) => {
          const found = (p.features || []).find((f) => f.label === label);
          return found ? found.value : '—';
        });
        return new Set(values).size > 1;
      })
    : allFeatureLabels;

  return (
    <main className="min-h-screen bg-[#111315] text-[#D7D9DB] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#2B313A] pb-6">
          <div className="text-left space-y-2">
            <SectionBadge variant="teal" text="Технический анализ характеристик" />
            <h1 className="text-3xl sm:text-4xl font-montserrat font-bold text-white tracking-tight">
              Сравнение моделей ({products.length} из 4)
            </h1>
            <p className="text-xs sm:text-sm text-[#87888A] max-w-xl">
              Детальное сопоставление габаритов, монтажных требований и функционала приборов премиальных брендов.
            </p>
          </div>

          {/* Controls */}
          {products.length > 1 && (
            <div className="flex items-center space-x-3">
              <label className="flex items-center space-x-2 bg-[#16191D] border border-[#2B313A] px-3.5 py-2.5 rounded-xl cursor-pointer select-none text-xs text-zinc-300 hover:border-simona-teal">
                <input
                  type="checkbox"
                  checked={diffOnly}
                  onChange={(e) => setDiffOnly(e.target.checked)}
                  className="rounded text-simona-teal focus:ring-0"
                />
                <span>Только различия</span>
              </label>

              <button
                onClick={() => compare.forEach((id) => toggleCompare(id))}
                className="text-xs text-[#87888A] hover:text-red-400 transition"
              >
                Очистить все
              </button>
            </div>
          )}
        </div>

        {/* Empty State */}
        {products.length === 0 ? (
          <div className="bg-[#16191D] border border-[#2B313A] rounded-3xl p-12 text-center max-w-2xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-simona-teal/10 border border-simona-teal/20 text-simona-teal flex items-center justify-center mx-auto">
              <SimonaIconCompare className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-montserrat font-bold text-white">
              Список сравнения пуст
            </h2>
            <p className="text-xs sm:text-sm text-[#87888A] leading-relaxed">
              Добавляйте интересующие приборы в сравнение прямо из каталога с помощью иконки со шкалой, чтобы наглядно сопоставить их функционал, схемы встройки и габариты.
            </p>
            <div className="pt-2">
              <Link
                href="/catalog"
                className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-simona-teal/20"
              >
                <span>Перейти в каталог</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* Comparison Table */
          <div className="overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-zinc-700">
            <div className="min-w-[800px]">
              
              {/* Products Top Cards Grid */}
              <div className="grid grid-cols-5 gap-4 pb-6 border-b border-[#2B313A]">
                <div className="p-4 flex flex-col justify-end">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#87888A]">
                    Параметр
                  </span>
                </div>

                {products.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#16191D] border border-[#2B313A] rounded-2xl p-4 flex flex-col justify-between relative group"
                  >
                    {/* Delete button */}
                    <button
                      onClick={() => toggleCompare(item.id)}
                      className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-[#1E2228] text-[#87888A] hover:text-red-400 transition"
                      title="Удалить из сравнения"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div>
                      {/* Image */}
                      <div className="relative aspect-square w-full rounded-xl bg-[#1E2228] overflow-hidden mb-3">
                        <img
                          src={item.images?.[0] || '/images/products/placeholder.webp'}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="text-[10px] font-semibold text-simona-teal uppercase tracking-wider mb-1">
                        {item.brand}
                      </div>

                      <Link href={`/product/${item.slug}`}>
                        <h3 className="text-xs font-semibold text-white hover:text-simona-teal transition line-clamp-2 leading-snug mb-1">
                          {item.name}
                        </h3>
                      </Link>

                      <div className="text-[10px] text-[#87888A] mb-3">
                        Арт: {item.sku}
                      </div>
                    </div>

                    <div>
                      <div className="text-base font-montserrat font-bold text-white mb-3">
                        {formatPrice(item.price)}
                      </div>

                      <button
                        onClick={() => addToCart(item)}
                        className="w-full py-2.5 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-[11px] font-semibold uppercase tracking-wider transition flex items-center justify-center space-x-1.5"
                      >
                        <SimonaIconCart className="w-3.5 h-3.5" />
                        <span>{isInCart(item.id) ? 'В корзине' : 'Купить'}</span>
                      </button>
                    </div>
                  </div>
                ))}

                {/* Slot to add another product if less than 4 */}
                {products.length < 4 && (
                  <Link
                    href="/catalog"
                    className="border-2 border-dashed border-[#2B313A] hover:border-simona-teal/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center transition group text-[#87888A] hover:text-white"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#16191D] flex items-center justify-center mb-3 group-hover:scale-110 transition">
                      <Plus className="w-5 h-5 text-simona-teal" />
                    </div>
                    <span className="text-xs font-semibold block">Добавить прибор</span>
                    <span className="text-[10px] text-[#87888A] mt-1">из каталога (до 4 шт.)</span>
                  </Link>
                )}
              </div>

              {/* Main Attributes Rows */}
              <div className="divide-y divide-[#2B313A]/60 text-xs">
                
                {/* Row: Availability */}
                <div className="grid grid-cols-5 gap-4 py-3.5 items-center">
                  <div className="font-semibold text-zinc-400 pl-2">Наличие и статус</div>
                  {products.map((p) => (
                    <div key={p.id}>
                      <span className="inline-block px-2 py-0.5 rounded-md bg-[#1E2228] border border-[#2B313A] text-[11px] text-zinc-300">
                        {p.inStock ? 'На складе (1-2 дня)' : 'Под заказ из Европы'}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Row: Dimensions */}
                <div className="grid grid-cols-5 gap-4 py-3.5 items-center">
                  <div className="font-semibold text-zinc-400 pl-2">Габариты прибора (Ш×В×Г)</div>
                  {products.map((p) => (
                    <div key={p.id} className="text-white font-mono">
                      {p.dimensions || '59.5 × 59.5 × 56.4 см'}
                    </div>
                  ))}
                </div>

                {/* Row: Schematic PDF */}
                <div className="grid grid-cols-5 gap-4 py-3.5 items-center">
                  <div className="font-semibold text-zinc-400 pl-2">Схема встройки</div>
                  {products.map((p) => (
                    <div key={p.id}>
                      <a
                        href={p.schematicPdfUrl || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-[11px] text-simona-teal hover:underline"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Чертеж ниши (PDF)</span>
                      </a>
                    </div>
                  ))}
                </div>

                {/* Dynamic Features Rows */}
                {displayedFeatureLabels.map((label) => (
                  <div key={label} className="grid grid-cols-5 gap-4 py-3.5 items-center">
                    <div className="font-semibold text-zinc-400 pl-2">{label}</div>
                    {products.map((p) => {
                      const feat = (p.features || []).find((f) => f.label === label);
                      const val = feat ? feat.value : '—';
                      return (
                        <div key={p.id} className="text-white">
                          {val === 'Да' || val === 'Есть' ? (
                            <span className="text-emerald-400 font-semibold flex items-center space-x-1">
                              <Check className="w-3.5 h-3.5" />
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
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

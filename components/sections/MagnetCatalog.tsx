'use client';

import React, { useState } from 'react';
import { ProductItem } from '@/types';
import { ProductCard } from '@/components/catalog/ProductCard';
import { Filter, Layers, Flame, MapPin, ShoppingBag, Package, Sparkles } from 'lucide-react';
import { useStore } from '@/components/providers/StoreContext';

interface MagnetCatalogProps {
  products: ProductItem[];
}

export function MagnetCatalog({ products }: MagnetCatalogProps) {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'ACTIVE_KITCHEN' | 'EXHIBITION' | 'ECOM' | 'ON_ORDER'>('ALL');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const { openModal } = useStore();

  const categories = [
    { id: 'ALL', name: 'Все категории' },
    { id: 'Духовые шкафы с паром', name: 'Встраиваемые духовки' },
    { id: 'Варочные панели', name: 'Варочные панели' },
    { id: 'Холодильники', name: 'Холодильники & Винные шкафы' },
    { id: 'Кофемашины', name: 'Кофемашины' },
    { id: 'Кухонные мойки', name: 'Мойки OMOIKIRI' },
    { id: 'Малая техника', name: 'Малая техника SMEG' },
    { id: 'Уход и химия', name: 'Уход Miele' },
  ];

  const filteredProducts = products.filter((p) => {
    // Filter by tab
    if (activeFilter === 'ACTIVE_KITCHEN' && p.physicalStatus !== 'ACTIVE_KITCHEN') return false;
    if (activeFilter === 'EXHIBITION' && p.physicalStatus !== 'EXHIBITION_15' && p.physicalStatus !== 'EXHIBITION_11') return false;
    if (activeFilter === 'ECOM' && p.categoryType !== 'CATEGORY_A') return false;
    if (activeFilter === 'ON_ORDER' && p.physicalStatus !== 'ON_ORDER') return false;

    // Filter by category
    if (activeCategory !== 'ALL' && p.category !== activeCategory) return false;

    return true;
  });

  return (
    <section id="catalog" className="py-24 bg-[#0E1012] border-t border-zinc-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-simona-teal mb-3">
              Селективный каталог
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-light text-white tracking-tight">
              Каталог-магнит
            </h2>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <button
              onClick={() => openModal('SEARCH')}
              className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-800 hover:border-zinc-700 transition flex items-center"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-simona-teal" />
              Расширенный поиск 8 000+ позиций
            </button>
          </div>
        </div>

        {/* Filter Tabs by Physical Status / Buying Mode */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-6 border-b border-zinc-800/80 no-scrollbar">
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              activeFilter === 'ALL'
                ? 'bg-zinc-100 text-zinc-950 shadow-md'
                : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            Все позиции ({products.length})
          </button>

          <button
            onClick={() => setActiveFilter('ACTIVE_KITCHEN')}
            className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center ${
              activeFilter === 'ACTIVE_KITCHEN'
                ? 'bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/20'
                : 'bg-zinc-900/80 text-amber-400/90 hover:bg-amber-500/10 border border-amber-500/20'
            }`}
          >
            <Flame className="w-3.5 h-3.5 mr-1.5" />
            🔥 На «Активной кухне»
          </button>

          <button
            onClick={() => setActiveFilter('EXHIBITION')}
            className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center ${
              activeFilter === 'EXHIBITION'
                ? 'bg-simona-teal text-white shadow-md shadow-simona-teal/20'
                : 'bg-zinc-900/80 text-simona-teal hover:bg-simona-teal/10 border border-simona-teal/20'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 mr-1.5" />
            📍 В экспозиции (Белинского 15 & 11/66)
          </button>

          <button
            onClick={() => setActiveFilter('ECOM')}
            className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center ${
              activeFilter === 'ECOM'
                ? 'bg-zinc-100 text-zinc-950 shadow-md'
                : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 mr-1.5 text-simona-teal" />
            Купить онлайн (Категория А)
          </button>

          <button
            onClick={() => setActiveFilter('ON_ORDER')}
            className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center ${
              activeFilter === 'ON_ORDER'
                ? 'bg-zinc-100 text-zinc-950 shadow-md'
                : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Package className="w-3.5 h-3.5 mr-1.5 text-zinc-500" />
            Под заказ со склада
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-6 mb-8 text-xs">
          <span className="text-zinc-500 text-[11px] uppercase tracking-wider mr-2 hidden sm:inline">
            Категории:
          </span>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                activeCategory === cat.id
                  ? 'bg-zinc-800 text-simona-teal border border-simona-teal/40 font-medium'
                  : 'bg-zinc-900/40 text-zinc-400 hover:text-zinc-200 border border-zinc-800/40'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-zinc-900/30 border border-zinc-800">
            <p className="text-zinc-400 text-sm">В этой выборке нет товаров.</p>
            <button
              onClick={() => {
                setActiveFilter('ALL');
                setActiveCategory('ALL');
              }}
              className="mt-4 px-4 py-2 rounded-lg bg-zinc-800 text-zinc-200 text-xs hover:bg-zinc-700"
            >
              Сбросить фильтры
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}

        {/* Bottom Banner: 8000 SKU CTA */}
        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-900/80 to-[#141A1E] border border-zinc-800/80 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="max-w-xl">
            <h3 className="text-xl font-serif text-white font-normal">
              Ищете конкретную модель или артикул из каталогов 2026 года?
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
              В нашей номенклатурной базе доступно более 8 000 приборов Miele, ASKO, Liebherr, SMEG, Bertazzoni и Falmec. Эксперты салона оперативно проверят доступность на складе фабрики и рассчитают спецификацию со схемами встройки.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => openModal('PROJECT_MATCHING')}
              className="px-6 py-3.5 rounded-lg bg-simona-teal hover:bg-simona-teal-light text-white text-xs font-semibold tracking-wider uppercase transition shadow-lg shadow-simona-teal/20"
            >
              Запросить подбор по спецификации
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

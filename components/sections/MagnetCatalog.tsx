'use client';

import React, { useState } from 'react';
import { ProductItem } from '@/types';
import { ProductCard } from '@/components/catalog/ProductCard';
import { MapPin, Package, Sparkles } from 'lucide-react';
import { useStore } from '@/components/providers/StoreContext';
import { SimonaPatternOverlay } from '@/components/brand/SimonaPattern';
import { SimonaIconChef, SimonaIconCart, SimonaIconFilter } from '@/components/brand/SimonaIcons';

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
    <section id="catalog" className="py-24 md:py-32 bg-white border-t border-black/[0.06] relative overflow-hidden">
      {/* Official Brandbook Pattern Background */}
      <SimonaPatternOverlay variant="subtle" opacity={0.03} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-simona-teal mb-3">
              Селективная витрина салонов
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-montserrat font-bold text-[#16181B] tracking-tight">
              Каталог-магнит
            </h2>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <button
              onClick={() => openModal('SEARCH')}
              className="px-4 py-2.5 rounded-full bg-white hover:bg-zinc-50 text-[#16181B] text-xs font-semibold border border-black/[0.08] hover:border-simona-teal transition flex items-center shadow-sm active:scale-98"
            >
              <SimonaIconFilter className="w-3.5 h-3.5 mr-2 text-simona-teal" />
              Расширенный поиск 8 000+ позиций
            </button>
          </div>
        </div>

        {/* Filter Tabs by Physical Status / Buying Mode */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-6 border-b border-black/[0.06] no-scrollbar">
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeFilter === 'ALL'
                ? 'bg-[#16181B] text-white shadow-md'
                : 'bg-[#F2F3F4] text-[#6E7074] hover:text-[#16181B] hover:bg-zinc-200/80 border border-black/[0.04]'
            }`}
          >
            Все позиции ({products.length})
          </button>

          <button
            onClick={() => setActiveFilter('ACTIVE_KITCHEN')}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center ${
              activeFilter === 'ACTIVE_KITCHEN'
                ? 'bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/20'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100/80 border border-amber-500/25'
            }`}
          >
            <SimonaIconChef className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
            На «Активной кухне»
          </button>

          <button
            onClick={() => setActiveFilter('EXHIBITION')}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center ${
              activeFilter === 'EXHIBITION'
                ? 'bg-simona-teal text-white shadow-md shadow-simona-teal/20'
                : 'bg-simona-teal/10 text-simona-teal hover:bg-simona-teal/15 border border-simona-teal/25'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 mr-1.5" />
            В экспозиции (Белинского 15 & 11/66)
          </button>

          <button
            onClick={() => setActiveFilter('ECOM')}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center ${
              activeFilter === 'ECOM'
                ? 'bg-[#16181B] text-white shadow-md'
                : 'bg-[#F2F3F4] text-[#6E7074] hover:text-[#16181B] hover:bg-zinc-200/80 border border-black/[0.04]'
            }`}
          >
            <SimonaIconCart className="w-3.5 h-3.5 mr-1.5 text-simona-teal" />
            Купить онлайн (Категория А)
          </button>

          <button
            onClick={() => setActiveFilter('ON_ORDER')}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center ${
              activeFilter === 'ON_ORDER'
                ? 'bg-[#16181B] text-white shadow-md'
                : 'bg-[#F2F3F4] text-[#6E7074] hover:text-[#16181B] hover:bg-zinc-200/80 border border-black/[0.04]'
            }`}
          >
            <Package className="w-3.5 h-3.5 mr-1.5 text-[#87888A]" />
            Под заказ со склада
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-6 mb-8 text-xs no-scrollbar">
          <span className="text-[#87888A] text-[11px] uppercase tracking-wider mr-2 hidden sm:inline font-semibold">
            Категории:
          </span>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all font-medium ${
                activeCategory === cat.id
                  ? 'bg-[#16181B] text-white font-semibold shadow-sm'
                  : 'bg-[#F8F9FA] text-[#6E7074] hover:text-[#16181B] border border-black/[0.06] hover:bg-zinc-200/60'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-[#F8F9FA] border border-black/[0.06]">
            <p className="text-[#6E7074] text-sm">В этой выборке нет товаров.</p>
            <button
              onClick={() => {
                setActiveFilter('ALL');
                setActiveCategory('ALL');
              }}
              className="mt-4 px-5 py-2 rounded-full bg-[#16181B] text-white text-xs hover:bg-zinc-800 transition shadow-sm"
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

        {/* Bottom Banner: 8000 SKU CTA in Light Double-Bezel */}
        <div className="mt-20 p-1.5 rounded-[2rem] bg-black/[0.02] ring-1 ring-black/[0.06] shadow-lg">
          <div className="p-8 sm:p-10 rounded-[calc(2rem-6px)] bg-[#F8F9FA] shadow-sm border border-black/[0.04] flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <h3 className="text-2xl font-montserrat font-bold text-[#16181B]">
                Ищете конкретную модель или артикул из коллекций 2026 года?
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#6E7074] font-normal leading-relaxed">
                В нашей номенклатурной базе доступно более 8 000 приборов Miele, ASKO, Liebherr, SMEG, Bertazzoni и Falmec. Эксперты салона оперативно проверят доступность на складе фабрики и рассчитают спецификацию со схемами встройки.
              </p>
            </div>
            <div className="shrink-0 w-full sm:w-auto">
              <button
                onClick={() => openModal('PROJECT_MATCHING')}
                className="w-full sm:w-auto pl-7 pr-2 py-2 rounded-full bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-semibold tracking-wider uppercase transition-all shadow-lg shadow-simona-teal/20 flex items-center justify-between group active:scale-98"
              >
                <span className="mr-3">Запросить подбор по спецификации</span>
                <span className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                  <Sparkles className="w-4 h-4 text-white" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

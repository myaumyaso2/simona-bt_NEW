'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowRight, ArrowUpRight, Search, Sparkles } from 'lucide-react';
import { CATALOG_CATEGORIES, CatalogCategory } from '@/data/catalogCategories';
import { SectionBadge } from '@/components/ui/SectionBadge';
import { useStore } from '@/components/providers/StoreContext';
import { CatalogServiceContour } from './CatalogServiceContour';
import {
  SimonaIconTag,
  SimonaIconDelivery,
  SimonaIconBuilding,
} from '@/components/brand/SimonaIcons';

const BRAND_STRIP = [
  { name: 'Miele', slug: 'miele', country: 'Германия' },
  { name: 'ASKO', slug: 'asko', country: 'Швеция' },
  { name: 'Liebherr', slug: 'liebherr', country: 'Германия' },
  { name: 'SMEG', slug: 'smeg', country: 'Италия' },
  { name: 'Bertazzoni', slug: 'bertazzoni', country: 'Италия' },
  { name: 'Falmec', slug: 'falmec', country: 'Италия' },
  { name: 'OMOIKIRI', slug: 'omoikiri', country: 'Япония' },
  { name: 'Körting', slug: 'korting', country: 'Германия' },
  { name: 'Schulthess', slug: 'schulthess', country: 'Швейцария' },
  { name: 'VARD', slug: 'vard', country: 'Россия / Европа' },
];

export function CatalogHubView() {
  const { openModal } = useStore();
  const [selectedPresenceFilter, setSelectedPresenceFilter] = useState<'ALL' | 'SHOWROOM' | 'STOCK' | 'ORDER'>('ALL');

  // Filter categories according to O2O presence if needed
  const displayedCategories = React.useMemo(() => {
    if (selectedPresenceFilter === 'SHOWROOM') {
      return CATALOG_CATEGORIES.filter((c) =>
        ['ovens', 'wine-cabinets', 'cooktops', 'coffee-machines', 'smeg-small', 'sinks'].includes(c.slug)
      );
    }
    if (selectedPresenceFilter === 'STOCK') {
      return CATALOG_CATEGORIES.filter((c) =>
        ['ovens', 'refrigerators', 'dishwashers', 'sinks', 'care-accessories'].includes(c.slug)
      );
    }
    if (selectedPresenceFilter === 'ORDER') {
      return CATALOG_CATEGORIES.filter((c) =>
        ['wine-cabinets', 'hoods', 'dishwashers', 'care-accessories'].includes(c.slug)
      );
    }
    return CATALOG_CATEGORIES;
  }, [selectedPresenceFilter]);

  return (
    <div className="bg-[#111315] min-h-screen text-white">
      {/* 1. Header / Breadcrumbs Area */}
      <section className="pt-8 pb-8 border-b border-[#2B313A]/50 relative overflow-hidden">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-0 left-1/4 -translate-x-1/2 w-96 h-96 bg-simona-teal/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 translate-x-1/2 w-96 h-96 bg-simona-wine/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumbs: Root Catalog Level */}
          <nav aria-label="Хлебные крошки" className="flex items-center space-x-2 text-xs text-[#87888A] mb-6 font-normal">
            <Link href="/" className="hover:text-white transition-colors">
              Главная
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#3E3D40]" />
            <span className="text-[#D7D9DB] font-medium">Каталог</span>
          </nav>

          {/* Title & Badge */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
            <div className="max-w-3xl text-left">
              <SectionBadge variant="teal" className="mb-3.5">
                Каталог премиальной техники
              </SectionBadge>

              <div className="flex flex-wrap items-baseline gap-3 sm:gap-4 mb-3">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-montserrat font-bold text-white tracking-tight">
                  Коллекция приборов
                </h1>
                <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold bg-[#16191D] border border-[#2B313A] text-simona-teal shadow-sm">
                  8 000+ SKU
                </span>
              </div>

              <p className="text-sm sm:text-base text-[#87888A] leading-relaxed">
                Авторизованная коллекция европейской бытовой техники от ведущих фабрик Германии, Швеции и Италии. 
                Экспозиция в салонах на ул. Белинского 15 и 11/66, тест-драйв на «Активной кухне» и центральный склад в Нижнем Новгороде.
              </p>
            </div>

            {/* Quick Search Button (Double-Bezel island) */}
            <div className="shrink-0 w-full md:w-auto">
              <button
                type="button"
                onClick={() => openModal('SEARCH')}
                className="w-full md:w-80 p-1.5 rounded-xl bg-[#16191D] border border-[#2B313A] hover:border-simona-teal/60 transition-all duration-300 group flex items-center justify-between shadow-lg text-left"
              >
                <div className="flex items-center space-x-3 px-3 py-1.5">
                  <Search className="w-4 h-4 text-[#87888A] group-hover:text-simona-teal transition-colors" />
                  <span className="text-xs text-[#87888A] group-hover:text-[#D7D9DB] transition-colors truncate">
                    Поиск по артикулу, бренду...
                  </span>
                </div>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono text-[#87888A] bg-[#1E2228] border border-[#2B313A]/70">
                  ⌘K
                </span>
              </button>
            </div>
          </div>

          {/* O2O Presence Quick Navigation Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-2">
            {[
              { id: 'ALL' as const, label: 'Все 10 направлений', count: '8 000+' },
              { id: 'SHOWROOM' as const, label: 'В экспозиции салонов', count: '140+' },
              { id: 'STOCK' as const, label: 'Склад в Нижнем Новгороде', count: '1 200+' },
              { id: 'ORDER' as const, label: 'Под заказ с европейских фабрик', count: '6 500+' },
            ].map((chip) => {
              const isActive = selectedPresenceFilter === chip.id;
              return (
                <button
                  key={chip.id}
                  onClick={() => setSelectedPresenceFilter(chip.id)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 active:scale-95 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-simona-teal text-white shadow-md shadow-simona-teal/20 border border-simona-teal'
                      : 'bg-[#16191D] hover:bg-[#1E2228] text-[#D7D9DB] border border-[#2B313A] hover:border-simona-teal/40'
                  }`}
                >
                  <span>{chip.label}</span>
                  <span className={`text-[10px] font-mono ${isActive ? 'text-white/80' : 'text-[#87888A]'}`}>
                    ({chip.count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. Main Categories Bento Grid */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
            {displayedCategories.map((cat, idx) => (
              <Link
                key={cat.slug}
                href={`/catalog/${cat.slug}`}
                className={`group relative rounded-2xl overflow-hidden border border-[#2B313A] hover:border-simona-teal/60 bg-[#16191D] p-6 sm:p-7 flex flex-col justify-end min-h-[290px] sm:min-h-[320px] transition-all duration-500 shadow-xl ${
                  cat.span || 'lg:col-span-4'
                }`}
              >
                {/* Photo Background & Parallax Overlay */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover opacity-35 group-hover:opacity-45 group-hover:scale-105 transition-all duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111315] via-[#16191D]/85 to-transparent pointer-events-none" />
                </div>

                {/* Top Badge Strip (if present) */}
                {cat.badge && (
                  <div className="absolute top-5 left-5 z-10">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#111315]/80 backdrop-blur-md border border-[#2B313A] text-simona-teal shadow-md">
                      {cat.badge}
                    </span>
                  </div>
                )}

                {/* Card Content Core */}
                <div className="relative z-10 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-xl sm:text-2xl font-montserrat font-bold text-white group-hover:text-simona-teal transition-colors tracking-tight">
                      {cat.title}
                    </h2>
                    {/* Nested Island Button with Spring Micro-Physics */}
                    <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-simona-teal group-hover:border-simona-teal transition-all duration-300">
                      <ArrowUpRight className="w-4 h-4 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[#87888A] line-clamp-2 max-w-xl leading-relaxed">
                    {cat.desc}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#2B313A]/50">
                    <span className="text-xs font-semibold text-simona-teal font-mono">
                      {cat.count}
                    </span>

                    {/* Featured Brands Pills */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {cat.featuredBrands.slice(0, 4).map((brand) => (
                        <span
                          key={brand}
                          className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#1E2228]/80 text-[#D7D9DB] border border-[#2B313A]/60"
                        >
                          {brand}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Authorized European Brand Wall Strip */}
      <section className="py-10 border-t border-[#2B313A]/50 bg-[#16191D]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-simona-teal mb-1">
                Официальные поставки
              </p>
              <h3 className="text-lg font-montserrat font-bold text-white tracking-tight">
                Авторизованные европейские бренды в каталоге
              </h3>
            </div>
            <Link
              href="/brands"
              className="inline-flex items-center space-x-1.5 text-xs font-medium text-simona-teal hover:text-simona-teal-light transition-colors group"
            >
              <span>Все бренды и сертификаты</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {BRAND_STRIP.map((brand) => (
              <Link
                key={brand.slug}
                href={`/brands/${brand.slug}`}
                className="p-3.5 rounded-xl bg-[#16191D] border border-[#2B313A] hover:border-simona-teal/50 hover:bg-[#1E2228] transition-all group flex flex-col justify-between"
              >
                <span className="text-sm font-semibold text-white group-hover:text-simona-teal transition-colors">
                  {brand.name}
                </span>
                <span className="text-[11px] text-[#87888A] mt-1">
                  {brand.country}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Manufacturer Promos Wine Accent Strip (#8A151A) */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-simona-wine/40 bg-gradient-to-r from-simona-wine/20 via-[#16191D] to-[#16191D] p-6 sm:p-8 lg:p-10 relative overflow-hidden shadow-2xl">
            {/* Ambient Wine Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-simona-wine/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="max-w-2xl space-y-2">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-simona-wine/30 border border-simona-wine/50 text-white text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                  <span>Официальные промо-программы производителей</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-montserrat font-bold text-white tracking-tight">
                  Специальные условия и подарки от европейских фабрик
                </h3>
                <p className="text-xs sm:text-sm text-[#D7D9DB]/80 leading-relaxed">
                  Подарочные комплекты по уходу ASKO Scandinavian Care, специальные выгоды на флагманские духовые шкафы Miele Generation 7000 и расширенная гарантия 5 лет на винные шкафы Liebherr.
                </p>
              </div>

              <div className="shrink-0 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/promos"
                  className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-simona-wine hover:bg-simona-wine-hover text-white text-xs font-semibold tracking-wide transition-all duration-200 shadow-lg shadow-simona-wine/25 active:scale-95"
                >
                  <span>Смотреть все акции</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Service Contour */}
      <CatalogServiceContour />
    </div>
  );
}

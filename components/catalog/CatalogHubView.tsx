'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CATALOG_CATEGORIES } from '@/data/catalogCategories';
import { SectionBadge } from '@/components/ui/SectionBadge';
import { CatalogServiceContour } from './CatalogServiceContour';
import { CatalogSectionSlider, CatalogSectionItem } from './CatalogSectionSlider';
import {
  SimonaIconChevronRight,
  SimonaIconArrowRight,
} from '@/components/brand/SimonaIcons';

interface SectionMeta {
  id: string;
  title: string;
  badgeCount: string;
  itemCount: number;
  description: string;
}

const CATALOG_SECTIONS: SectionMeta[] = [
  {
    id: 'all',
    title: 'Все разделы',
    badgeCount: '8 000+',
    itemCount: 8000,
    description:
      'Авторизованная коллекция европейской бытовой техники от ведущих фабрик Германии, Швеции и Италии. Экспозиция в салонах на ул. Белинского 15 и 11/66, тест-драйв на «Активной кухне» и центральный склад в Нижнем Новгороде.',
  },
  {
    id: 'vstraivaemaya-tehnika',
    title: 'Встраиваемая техника',
    badgeCount: '2 641',
    itemCount: 2641,
    description:
      'Флагманская встраиваемая техника для кухни: духовые шкафы, варочные панели, вытяжки, посудомоечные машины и микроволновые печи от ведущих европейских брендов.',
  },
  {
    id: 'krupnaya-bytovaya-tehnika',
    title: 'Крупная бытовая техника',
    badgeCount: '823',
    itemCount: 823,
    description:
      'Отдельностоящие холодильники, стиральные и сушильные машины, кухонные плиты и гладильные системы европейского качества.',
  },
  {
    id: 'mojki-i-smesiteli',
    title: 'Мойки и смесители',
    badgeCount: '1 524',
    itemCount: 1524,
    description:
      'Японские кухонные мойки и смесители OMOIKIRI, гранитные и стальные чаши, врезные дозаторы и аксессуары для комфортной рабочей зоны.',
  },
  {
    id: 'malaya-bytovaya-tehnika',
    title: 'Малая бытовая техника',
    badgeCount: '489',
    itemCount: 489,
    description:
      'Дизайнерская малая бытовая техника: рожковые и автоматические кофемашины, чайники, тостеры, блендеры и кухонные комбайны SMEG и Miele.',
  },
  {
    id: 'bokaly-i-posuda',
    title: 'Бокалы и посуда',
    badgeCount: '226',
    itemCount: 226,
    description:
      'Австрийский сортовой хрусталь Riedel, декантеры ручной работы, премиальная кухонная посуда и сервировочные принадлежности.',
  },
  {
    id: 'klimaticheskaya-tehnika',
    title: 'Климатическая техника',
    badgeCount: '8',
    itemCount: 8,
    description:
      'Накопительные водонагреватели и сплит-системы кондиционирования воздуха для создания идеального микроклимата дома.',
  },
  {
    id: 'uhod-i-aksessuary',
    title: 'Уход и аксессуары',
    badgeCount: '881',
    itemCount: 881,
    description:
      'Фирменные средства по уходу за приборами, профессиональная бытовая химия и оригинальные аксессуары для европейской техники.',
  },
];

export function CatalogHubView() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialTab = searchParams.get('tab');
  const [activeSection, setActiveSection] = useState<string>(() => {
    if (initialTab && CATALOG_SECTIONS.some((s) => s.id === initialTab)) {
      return initialTab;
    }
    return 'all';
  });

  // Synchronize state when URL query changes (e.g. browser back/forward)
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && CATALOG_SECTIONS.some((s) => s.id === tab)) {
      setActiveSection(tab);
    } else if (!tab) {
      setActiveSection('all');
    }
  }, [searchParams]);

  const handleSelectSection = useCallback((id: string) => {
    setActiveSection(id);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (id === 'all') {
        url.searchParams.delete('tab');
      } else {
        url.searchParams.set('tab', id);
      }
      window.history.replaceState(null, '', url.pathname + (url.search ? url.search : ''));
    }
  }, []);

  const sectionSliderItems: CatalogSectionItem[] = useMemo(() => {
    return CATALOG_SECTIONS.map((sec) => ({
      id: sec.id,
      title: sec.title,
      count: sec.badgeCount,
    }));
  }, []);

  // Filter categories according to selected global section
  const displayedCategories = useMemo(() => {
    if (activeSection === 'all') {
      return CATALOG_CATEGORIES;
    }
    return CATALOG_CATEGORIES.filter((c) => c.sectionSlug === activeSection);
  }, [activeSection]);

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
            <SimonaIconChevronRight className="w-3.5 h-3.5 text-[#3E3D40]" />
            <span className="text-[#D7D9DB] font-medium">Каталог</span>
          </nav>

          {/* Title & SectionBadge */}
          <div className="mb-6 max-w-4xl text-left">
            <SectionBadge variant="teal" className="mb-3.5">
              КАТАЛОГ СИМОНЫ
            </SectionBadge>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-montserrat font-bold text-white tracking-tight">
              Категории бытовой техники, аксессуары и средства по уходу
            </h1>
          </div>

          {/* Catalog Global Sections Slider: Replaces legacy availability chips with brand-grade pill navigation */}
          <div className="pt-1">
            <CatalogSectionSlider
              sections={sectionSliderItems}
              activeSectionId={activeSection}
              onSelectSection={handleSelectSection}
            />
          </div>
        </div>
      </section>

      {/* 2. Main Categories Bento Grid */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5"
          >
            <AnimatePresence mode="popLayout">
              {displayedCategories.map((cat) => (
                <motion.div
                  key={cat.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  className={cat.span || 'lg:col-span-4'}
                >
                  <Link
                    href={`/catalog/${cat.slug}`}
                    className="group relative rounded-2xl overflow-hidden border border-[#2B313A] hover:border-simona-teal/60 bg-[#16191D] p-6 sm:p-7 flex flex-col justify-end min-h-[340px] sm:min-h-[360px] h-full transition-all duration-500 shadow-xl"
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

                    {/* Card Content Core */}
                    <div className="relative z-10 space-y-3">
                      <div className="flex items-start justify-between gap-3 min-h-[3.5rem]">
                        <h2 className="text-xl sm:text-2xl font-montserrat font-bold text-white group-hover:text-simona-teal transition-colors tracking-tight leading-snug">
                          {cat.title}
                        </h2>
                        <SimonaIconArrowRight className="w-5 h-5 text-white/70 group-hover:text-simona-teal group-hover:translate-x-1.5 transition-all duration-300 shrink-0 mt-1" />
                      </div>

                      <p className="text-xs sm:text-sm text-[#87888A] line-clamp-3 min-h-[3.75rem] leading-relaxed">
                        {cat.desc}
                      </p>

                      <div className="pt-3 border-t border-[#2B313A]/50 space-y-2">
                        <div className="text-xs font-semibold text-simona-teal font-mono">
                          {cat.count}
                        </div>

                        {/* Featured Brands Pills: up to 3 lines */}
                        <div className="flex flex-wrap items-start content-start gap-1.5 h-[4.75rem] max-h-[4.75rem] overflow-hidden">
                          {cat.featuredBrands.map((brand) => (
                            <button
                              key={brand}
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                router.push(`/catalog?brand=${encodeURIComponent(brand)}&category=${cat.slug}`);
                              }}
                              className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#1E2228]/80 text-[#D7D9DB] border border-[#2B313A]/60 hover:border-simona-teal hover:text-white hover:bg-[#252A32] cursor-pointer transition-all duration-200 active:scale-95 select-none"
                            >
                              {brand}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* 2. Service Contour */}
      <CatalogServiceContour />
    </div>
  );
}

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { SimonaIconChevronLeft, SimonaIconChevronRight } from '@/components/brand/SimonaIcons';
import { getActiveCatalogBrands } from '@/data/catalogMegaMenuBrands';

export interface CatalogMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SubcategoryItem {
  name: string;
  href: string;
}

interface CategoryGroup {
  title: string;
  href?: string;
  items: SubcategoryItem[];
  subtitle?: string;
}

interface ColumnStructure {
  id: string;
  groups: CategoryGroup[];
}

/**
 * 100% точные разделы и категории со старого сайта СИМОНА
 * с балансировкой колонок (17 / 17 / 21 / 20) и исправлением ошибки в блоке аксессуаров.
 */
const CATALOG_COLUMNS: ColumnStructure[] = [
  // КОЛОНКА 1: ВСТРАИВАЕМАЯ ТЕХНИКА + МОЙКИ И СМЕСИТЕЛИ (13 + 3 = 16)
  {
    id: 'col-builtin-sinks',
    groups: [
      {
        title: 'Встраиваемая техника',
        href: '/catalog?section=vstraivaemaya-tehnika',
        items: [
          { name: 'Варочные панели', href: '/catalog/varochnye-paneli' },
          { name: 'Духовые шкафы', href: '/catalog/vstraivaemye-duhovye-shkafy' },
          { name: 'Вытяжки', href: '/catalog/vytyazhki' },
          { name: 'Посудомоечные машины (встраиваемые)', href: '/catalog/vstraivaemye-posudomoechnye-mashiny' },
          { name: 'Микроволновые печи (встраиваемые)', href: '/catalog/vstraivaemye-mikrovolnovye-pechi' },
          { name: 'Кофемашины (встраиваемые)', href: '/catalog/vstraivaemye-kofemashiny' },
          { name: 'Стиральные машины (встраиваемые)', href: '/catalog/vstraivaemye-stiralnye-mashiny' },
          { name: 'Холодильники (встраиваемые)', href: '/catalog/vstraivaemye-holodilniki' },
          { name: 'Измельчители пищевых отходов', href: '/catalog/izmelchiteli-pishchevyh-othodov' },
          { name: 'Сортеры (ведра)', href: '/catalog/sortery-dlya-musora' },
          { name: 'Подогреватели посуды', href: '/catalog/podogrevateli-posudy' },
          { name: 'Вакууматоры (встраиваемые)', href: '/catalog/vstraivaemye-vakuumatory' },
          { name: 'Винные шкафы (встраиваемые)', href: '/catalog/vstraivaemye-vinnye-shkafy' },
        ],
      },
      {
        title: 'Мойки и смесители',
        href: '/catalog?section=mojki-i-smesiteli',
        items: [
          { name: 'Мойки', href: '/catalog/mojki-dlya-kuhni' },
          { name: 'Смесители', href: '/catalog/smesiteli-dlya-kuhni' },
          { name: 'Врезные дозаторы для моющих средств', href: '/catalog/dozatory-dlya-moyushchih-sredstv' },
        ],
      },
    ],
  },

  // КОЛОНКА 2: КРУПНАЯ БЫТОВАЯ + КЛИМАТИЧЕСКАЯ + БОКАЛЫ И ПОСУДА (8 + 2 + 4 = 14)
  {
    id: 'col-major-climate-tableware',
    groups: [
      {
        title: 'Крупная бытовая техника',
        href: '/catalog?section=krupnaya-bytovaya-tehnika',
        items: [
          { name: 'Стиральные машины', href: '/catalog/stiralnye-mashiny' },
          { name: 'Холодильники', href: '/catalog/holodilniki' },
          { name: 'Плиты', href: '/catalog/kuhonnye-plity' },
          { name: 'Посудомоечные машины', href: '/catalog/posudomoechnye-mashiny' },
          { name: 'Сушильные машины', href: '/catalog/sushilnye-mashiny' },
          { name: 'Микроволновые печи', href: '/catalog/mikrovolnovye-pechi' },
          { name: 'Гладильные системы', href: '/catalog/gladilnye-sistemy' },
          { name: 'Винные шкафы', href: '/catalog/vinnye-shkafy' },
        ],
      },
      {
        title: 'Климатическая техника',
        href: '/catalog?section=klimaticheskaya-tehnika',
        items: [
          { name: 'Водонагреватели', href: '/catalog/vodonagrevateli' },
          { name: 'Кондиционеры', href: '/catalog/kondicionery' },
        ],
      },
      {
        title: 'Бокалы и посуда',
        href: '/catalog?section=bokaly-i-posuda',
        items: [
          { name: 'Бокалы Riedel', href: '/catalog/bokaly-riedel' },
          { name: 'Декантеры Riedel', href: '/catalog/dekantery-riedel' },
          { name: 'Посуда', href: '/catalog/posuda' },
          { name: 'Кухонные принадлежности', href: '/catalog/kuhonnye-prinadlezhnosti' },
        ],
      },
    ],
  },

  // КОЛОНКА 3: МАЛАЯ БЫТОВАЯ ТЕХНИКА (17 + 4 = 21)
  {
    id: 'col-small-appliances',
    groups: [
      {
        title: 'Малая бытовая техника',
        subtitle: 'Для кухни',
        href: '/catalog?section=malaya-bytovaya-tehnika',
        items: [
          { name: 'Блендеры', href: '/catalog/blendery' },
          { name: 'Кофеварки', href: '/catalog/kofevarki' },
          { name: 'Кофемашины', href: '/catalog/kofemashiny' },
          { name: 'Кофе', href: '/catalog/kofe' },
          { name: 'Кухонные комбайны', href: '/catalog/kuhonnye-kombajny' },
          { name: 'Миксеры', href: '/catalog/miksery' },
          { name: 'Мультиварки', href: '/catalog/multivarki' },
          { name: 'Мясорубки', href: '/catalog/myasorubki' },
          { name: 'Соковыжималки', href: '/catalog/sokovyzhimalki' },
          { name: 'Тостеры', href: '/catalog/tostery' },
          { name: 'Чайники', href: '/catalog/chajniki' },
          { name: 'Мини-печи', href: '/catalog/mini-pechi' },
          { name: 'Вакууматоры', href: '/catalog/vakuumatory' },
          { name: 'Вспениватели молока', href: '/catalog/vspenivateli-moloka' },
          { name: 'Генераторы льда', href: '/catalog/generatory-lda' },
          { name: 'Яйцеварки', href: '/catalog/yajcevarki' },
          { name: 'Прочая малая кухонная техника', href: '/catalog/prochaya-malaya-kuhonnaya-tehnika' },
        ],
      },
      {
        title: '',
        subtitle: 'Для дома',
        href: '/catalog?section=malaya-bytovaya-tehnika',
        items: [
          { name: 'Весы', href: '/catalog/vesy' },
          { name: 'Пылесосы', href: '/catalog/pylesosy' },
          { name: 'Утюги', href: '/catalog/utyugi' },
          { name: 'Роботы для мойки окон', href: '/catalog/roboty-dlya-mojki-okon' },
        ],
      },
    ],
  },

  // КОЛОНКА 4: СРЕДСТВА ПО УХОДУ И АКСЕССУАРЫ (3 + 14 = 17)
  {
    id: 'col-care-accessories',
    groups: [
      {
        title: 'Средства по уходу за техникой',
        href: '/catalog?section=uhod-i-aksessuary',
        items: [
          { name: 'Для чистки и ухода за бытовой техникой', href: '/catalog/sredstva-dlya-chistki-i-uhoda' },
          { name: 'Для стирки белья', href: '/catalog/sredstva-dlya-stirki-belya' },
          { name: 'Для посуды', href: '/catalog/sredstva-dlya-posudy' },
        ],
      },
      {
        title: 'Аксессуары для бытовой техники',
        href: '/catalog?section=uhod-i-aksessuary',
        items: [
          { name: 'Для вытяжек', href: '/catalog/aksessuary-dlya-vytyazhek' },
          { name: 'Для пылесосов', href: '/catalog/aksessuary-dlya-pylesosov' },
          { name: 'Для моек', href: '/catalog/aksessuary-dlya-moek' },
          { name: 'Для варочных поверхностей', href: '/catalog/aksessuary-dlya-varochnyh-poverhnostej' },
          { name: 'Для холодильников', href: '/catalog/aksessuary-dlya-holodilnikov' },
          { name: 'Для духовых шкафов и плит', href: '/catalog/aksessuary-dlya-duhovyh-shkafov-i-plit' },
          { name: 'Для стиральных и сушильных машин', href: '/catalog/aksessuary-dlya-stiralnyh-i-sushilnyh-mashin' },
          { name: 'Для малой кухонной техники', href: '/catalog/aksessuary-dlya-maloj-kuhonnoj-tehniki' },
          { name: 'Для климатической техники', href: '/catalog/aksessuary-dlya-klimaticheskoj-tehniki' },
          { name: 'Для посудомоечных машин', href: '/catalog/aksessuary-dlya-posudomoechnyh-mashin' },
          { name: 'Для прочей малой бытовой техники', href: '/catalog/aksessuary-dlya-prochej-maloj-bytovoj-tehniki' },
          { name: 'Для кофемашин', href: '/catalog/aksessuary-dlya-kofemashin' },
          { name: 'Электротовары', href: '/catalog/elektrotovary' },
          { name: 'Для гладильных машин и систем', href: '/catalog/aksessuary-dlya-gladilnyh-mashin-i-sistem' },
        ],
      },
    ],
  },
];

export function CatalogMegaMenu({ isOpen, onClose }: CatalogMegaMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const brandStripRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [currentBrand, setCurrentBrand] = useState<string>('');
  const pathname = usePathname();

  const brands = getActiveCatalogBrands();

  // Проверка возможности прокрутки ленты брендов
  const checkScroll = useCallback(() => {
    const el = brandStripRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 6);
  }, []);

  // Синхронизация текущего активного бренда из URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const b = params.get('brand') || '';
      setCurrentBrand(b.toUpperCase());
    }
  }, [pathname, isOpen]);

  // Проверка скролла при открытии меню и ресайзе
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(checkScroll, 60);
    window.addEventListener('resize', checkScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkScroll);
    };
  }, [isOpen, checkScroll]);

  // Автоскролл к выбранному бренду при открытии
  useEffect(() => {
    if (!isOpen || !currentBrand) return;
    const timer = setTimeout(() => {
      const el = brandStripRef.current;
      if (!el) return;
      const activeEl = el.querySelector<HTMLElement>(`[data-brand="${currentBrand}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ inline: 'center', behavior: 'smooth', block: 'nearest' });
      }
    }, 120);
    return () => clearTimeout(timer);
  }, [isOpen, currentBrand]);

  // Закрытие по клавише Esc
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = brandStripRef.current;
    if (!el) return;
    const scrollAmount = Math.min(320, Math.max(220, el.clientWidth * 0.65));
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* МАТОВЫЙ БЭКДРОП С ПЛАВНЫМ FADE */}
          <motion.div
            key="catalog-mega-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            onClick={onClose}
            className="fixed inset-0 bg-[#050608]/75 backdrop-blur-md z-40"
            aria-hidden="true"
          />

          {/* ВЫПАДАЮЩЕЕ ПОЛОТНО ПОД ШАПКОЙ (HEADER-ANCHORED QUIET LUXURY SLIDE & FADE) */}
          <motion.div
            key="catalog-mega-dropdown"
            ref={menuRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{
              opacity: 0,
              y: -8,
              transition: { duration: 0.18, ease: [0.4, 0, 1, 1] },
            }}
            transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full left-0 right-0 z-50 bg-[#14171B] border-b border-[#2B313A] shadow-[0_24px_50px_rgba(0,0,0,0.85)]"
          >
            {/* BRAND BAR STRIP WITH FLOATING ARROWS (QUIET LUXURY STANDARDS) */}
            <div className="relative bg-[#111316] border-b border-[#2B313A] px-3 sm:px-6 py-2 flex items-center justify-between gap-2 select-none">
              {/* Левая плавающая стрелка с мягким градиентом */}
              {canScrollLeft && (
                <div className="hidden md:flex absolute left-3 sm:left-6 top-0 bottom-0 z-20 items-center pl-0.5 pr-8 bg-gradient-to-r from-[#111316] via-[#111316]/95 to-transparent pointer-events-none">
                  <button
                    type="button"
                    onClick={() => handleScroll('left')}
                    aria-label="Прокрутить бренды влево"
                    className="pointer-events-auto w-7 h-7 rounded-lg bg-[#1E2228] border border-[#2B313A] text-[#87888A] hover:text-white hover:border-simona-teal hover:bg-[#252A32] flex items-center justify-center transition-all shadow-md hover:shadow-simona-teal/20 cursor-pointer"
                  >
                    <SimonaIconChevronLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Прокручиваемая лента всех активных брендов */}
              <div
                ref={brandStripRef}
                onScroll={checkScroll}
                className="flex-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 scroll-smooth touch-pan-x"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {brands.map((brand) => {
                  const isBrandActive =
                    currentBrand === brand.name.toUpperCase() ||
                    currentBrand === brand.slug.toUpperCase();

                  return (
                    <Link
                      key={brand.name}
                      data-brand={brand.name.toUpperCase()}
                      href={`/catalog?brand=${encodeURIComponent(brand.slug)}`}
                      onClick={onClose}
                      className={`shrink-0 inline-flex items-center justify-center px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wider font-montserrat uppercase transition-all whitespace-nowrap text-center ${
                        isBrandActive
                          ? 'bg-simona-teal/20 text-simona-teal-light border border-simona-teal shadow-[0_0_12px_rgba(0,151,156,0.35)] font-bold'
                          : 'text-white bg-[#1E2228] border border-[#2B313A] hover:border-simona-teal hover:text-simona-teal-light hover:shadow-[0_0_14px_rgba(0,151,156,0.35)]'
                      }`}
                    >
                      {brand.name}
                    </Link>
                  );
                })}
              </div>

              {/* Правая плавающая стрелка с мягким градиентом */}
              {canScrollRight && (
                <div className="hidden md:flex absolute right-12 sm:right-16 top-0 bottom-0 z-20 items-center pr-0.5 pl-8 bg-gradient-to-l from-[#111316] via-[#111316]/95 to-transparent pointer-events-none">
                  <button
                    type="button"
                    onClick={() => handleScroll('right')}
                    aria-label="Прокрутить бренды вправо"
                    className="pointer-events-auto w-7 h-7 rounded-lg bg-[#1E2228] border border-[#2B313A] text-[#87888A] hover:text-white hover:border-simona-teal hover:bg-[#252A32] flex items-center justify-center transition-all shadow-md hover:shadow-simona-teal/20 cursor-pointer"
                  >
                    <SimonaIconChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Кнопка закрытия мега-меню (Esc) */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Закрыть каталог (Esc)"
                className="w-8 h-8 rounded-xl border border-[#2B313A] bg-[#1E2228] text-[#87888A] hover:text-white hover:border-simona-teal flex items-center justify-center transition-all shrink-0 ml-1 z-30"
              >
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

        {/* 4 СБАЛАНСИРОВАННЫЕ КОЛОНКИ КАТАЛОГА (17 / 17 / 21 / 20) */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-4 sm:py-5 max-h-[calc(100vh-125px)] overflow-y-auto no-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7 lg:gap-8">
            {CATALOG_COLUMNS.map((col) => (
              <div key={col.id} className="flex flex-col gap-5">
                {col.groups.map((group, groupIdx) => (
                  <div key={groupIdx} className="flex flex-col gap-2">
                    {group.title && (
                      <div className="flex items-center justify-between pb-1.5 border-b border-[#2B313A]">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-simona-teal shadow-[0_0_6px_rgba(0,151,156,0.6)]" />
                          <Link
                            href={group.href || '/catalog'}
                            onClick={onClose}
                            className="font-montserrat font-semibold text-xs text-white hover:text-simona-teal transition-colors"
                          >
                            {group.title}
                          </Link>
                        </div>
                      </div>
                    )}

                    {group.subtitle && (
                      <div className="text-[11px] font-semibold text-[#87888A] px-1.5 pt-0.5">
                        {group.subtitle}
                      </div>
                    )}

                    <ul className="flex flex-col gap-0.5 list-none p-0 m-0">
                      {group.items.map((item, itemIdx) => (
                        <li key={itemIdx}>
                          <Link
                            href={item.href}
                            onClick={onClose}
                            className="group/link flex items-center justify-between text-xs text-[#D7D9DB] hover:text-white px-2 py-0.5 rounded-md hover:bg-simona-teal/[0.07] hover:translate-x-1 transition-all"
                          >
                            <span className="group-hover/link:text-white transition-colors">
                              {item.name}
                            </span>
                            <span className="text-[11px] text-simona-teal opacity-0 -translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all">
                              →
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  )}
</AnimatePresence>
  );
}

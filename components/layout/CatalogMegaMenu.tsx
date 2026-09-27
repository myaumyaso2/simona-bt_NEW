'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

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

const BRAND_BAR_ITEMS = [
  { name: 'BOSCH', href: '/brands/bosch' },
  { name: 'ASKO', href: '/brands/asko' },
  { name: 'LIEBHERR', href: '/brands/liebherr' },
  { name: 'SMEG', href: '/brands/smeg' },
  { name: 'MIELE', href: '/brands/miele' },
  { name: 'OMOIKIRI', href: '/brands/omoikiri' },
  { name: 'ELICA', href: '/brands/elica' },
  { name: 'MIDEA', href: '/brands/midea' },
  { name: 'KÖRTING', href: '/brands/korting' },
];

/**
 * 100% точные разделы и категории со старого сайта СИМОНА
 * с балансировкой колонок (17 / 17 / 21 / 20) и исправлением ошибки в блоке аксессуаров.
 */
const CATALOG_COLUMNS: ColumnStructure[] = [
  // КОЛОНКА 1: ВСТРАИВАЕМАЯ ТЕХНИКА + МОЙКИ И СМЕСИТЕЛИ (14 + 3 = 17)
  {
    id: 'col-builtin-sinks',
    groups: [
      {
        title: 'Встраиваемая техника',
        href: '/catalog?section=builtin',
        items: [
          { name: 'Варочные панели', href: '/catalog?category=Варочные+панели' },
          { name: 'Духовые шкафы', href: '/catalog?category=Встраиваемые+духовые+шкафы' },
          { name: 'Вытяжки', href: '/catalog?category=Вытяжки' },
          { name: 'Посудомоечные машины (встраиваемые)', href: '/catalog?category=Встраиваемые+посудомоечные+машины' },
          { name: 'Микроволновые печи (встраиваемые)', href: '/catalog?category=Встраиваемые+микроволновые+печи' },
          { name: 'Кофемашины (встраиваемые)', href: '/catalog?category=Встраиваемые+кофемашины' },
          { name: 'Стиральные машины (встраиваемые)', href: '/catalog?category=Встраиваемые+стиральные+машины' },
          { name: 'Холодильники (встраиваемые)', href: '/catalog?category=Встраиваемые+холодильники' },
          { name: 'Измельчители пищевых отходов', href: '/catalog?category=Измельчители+пищевых+отходов' },
          { name: 'Сортеры (ведра)', href: '/catalog?category=Сортеры+(ведра)' },
          { name: 'Пароварки (встраиваемые)', href: '/catalog?category=Пароварки+(встраиваемые)' },
          { name: 'Подогреватели посуды', href: '/catalog?category=Подогреватели+посуды' },
          { name: 'Вакууматоры (встраиваемые)', href: '/catalog?category=Встраиваемые+вакууматоры' },
          { name: 'Винные шкафы (встраиваемые)', href: '/catalog?category=Встраиваемые+винные+шкафы' },
        ],
      },
      {
        title: 'Мойки и смесители',
        href: '/catalog?section=sinks',
        items: [
          { name: 'Мойки', href: '/catalog?category=Мойки+для+кухни' },
          { name: 'Смесители', href: '/catalog?category=Смесители+для+кухни' },
          { name: 'Врезные дозаторы для моющих средств', href: '/catalog?category=Врезные+дозаторы+для+моющих+средств' },
        ],
      },
    ],
  },

  // КОЛОНКА 2: КРУПНАЯ БЫТОВАЯ + КЛИМАТИЧЕСКАЯ + БОКАЛЫ И ПОСУДА (8 + 5 + 4 = 17)
  {
    id: 'col-major-climate-tableware',
    groups: [
      {
        title: 'Крупная бытовая техника',
        href: '/catalog?section=major',
        items: [
          { name: 'Стиральные машины', href: '/catalog?category=Стиральные+машины' },
          { name: 'Холодильники', href: '/catalog?category=Холодильники+отдельностоящие' },
          { name: 'Плиты', href: '/catalog?category=Плиты' },
          { name: 'Посудомоечные машины', href: '/catalog?category=Посудомоечные+машины' },
          { name: 'Сушильные машины', href: '/catalog?category=Сушильные+машины+для+белья' },
          { name: 'Микроволновые печи', href: '/catalog?category=Микроволновые+печи' },
          { name: 'Гладильные системы', href: '/catalog?category=Гладильные+системы' },
          { name: 'Винные шкафы', href: '/catalog?category=Винные+шкафы' },
        ],
      },
      {
        title: 'Климатическая техника',
        href: '/catalog?section=climate',
        items: [
          { name: 'Водонагреватели', href: '/catalog?category=Водонагреватели' },
          { name: 'Камины', href: '/catalog?category=Камины' },
          { name: 'Кондиционеры', href: '/catalog?category=Кондиционеры' },
          { name: 'Тепловая техника', href: '/catalog?category=Тепловая+техника' },
          { name: 'Увлажнение и очистка воздуха', href: '/catalog?category=Увлажнение+и+очистка+воздуха' },
        ],
      },
      {
        title: 'Бокалы и посуда',
        href: '/catalog?section=tableware',
        items: [
          { name: 'Бокалы Riedel', href: '/catalog?category=Бокалы' },
          { name: 'Декантеры Riedel', href: '/catalog?category=Декантеры' },
          { name: 'Посуда', href: '/catalog?category=Посуда' },
          { name: 'Кухонные принадлежности', href: '/catalog?category=Кухонные+принадлежности' },
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
        href: '/catalog?section=small-kitchen',
        items: [
          { name: 'Блендеры', href: '/catalog?category=Блендеры' },
          { name: 'Кофеварки', href: '/catalog?category=Кофеварки' },
          { name: 'Кофемашины', href: '/catalog?category=Кофемашины' },
          { name: 'Кофе', href: '/catalog?category=Кофе' },
          { name: 'Кухонные комбайны', href: '/catalog?category=Кухонные+комбайны' },
          { name: 'Миксеры', href: '/catalog?category=Миксеры' },
          { name: 'Мультиварки', href: '/catalog?category=Мультиварки' },
          { name: 'Мясорубки', href: '/catalog?category=Мясорубки' },
          { name: 'Соковыжималки', href: '/catalog?category=Соковыжималки' },
          { name: 'Тостеры', href: '/catalog?category=Тостеры' },
          { name: 'Чайники', href: '/catalog?category=Чайники' },
          { name: 'Мини-печи', href: '/catalog?category=Мини-печи' },
          { name: 'Вакууматоры', href: '/catalog?category=Вакууматоры' },
          { name: 'Вспениватели молока', href: '/catalog?category=Вспениватели+молока' },
          { name: 'Генераторы льда', href: '/catalog?category=Генераторы+льда' },
          { name: 'Яйцеварки', href: '/catalog?category=Яйцеварки' },
          { name: 'Прочая малая кухонная техника', href: '/catalog?category=Прочая+малая+кухонная+техника' },
        ],
      },
      {
        title: '',
        subtitle: 'Для дома',
        href: '/catalog?section=small-home',
        items: [
          { name: 'Весы', href: '/catalog?category=Весы' },
          { name: 'Пылесосы', href: '/catalog?category=Пылесосы' },
          { name: 'Утюги', href: '/catalog?category=Утюги' },
          { name: 'Роботы для мойки окон', href: '/catalog?category=Роботы+для+мойки+окон' },
        ],
      },
    ],
  },

  // КОЛОНКА 4: СРЕДСТВА ПО УХОДУ И АКСЕССУАРЫ (6 + 14 = 20)
  {
    id: 'col-care-accessories',
    groups: [
      {
        title: 'Средства по уходу за техникой',
        href: '/catalog?section=care',
        items: [
          { name: 'Для чистки и ухода за бытовой техникой', href: '/catalog?category=Для+чистки+и+ухода+за+бытовой+техникой' },
          { name: 'Для удаления накипи', href: '/catalog?category=Для+удаления+накипи' },
          { name: 'Для стирки белья', href: '/catalog?category=Для+стирки+белья' },
          { name: 'Для посуды', href: '/catalog?category=Для+посуды' },
          { name: 'Ароматизаторы для бытовой техники', href: '/catalog?category=Ароматизаторы+для+бытовой+техники' },
          { name: 'Салфетки для бытовой техники', href: '/catalog?category=Салфетки+для+бытовой+техники' },
        ],
      },
      {
        title: 'Аксессуары для бытовой техники',
        href: '/catalog?section=accessories',
        items: [
          { name: 'Для вытяжек', href: '/catalog?category=Для+вытяжек' },
          { name: 'Для пылесосов', href: '/catalog?category=Для+пылесосов' },
          { name: 'Для моек', href: '/catalog?category=Для+моек' },
          { name: 'Для варочных поверхностей', href: '/catalog?category=Для+варочных+поверхностей' },
          { name: 'Для холодильников', href: '/catalog?category=Для+холодильников' },
          { name: 'Для духовых шкафов и плит', href: '/catalog?category=Для+духовых+шкафов+и+плит' },
          { name: 'Для стиральных и сушильных машин', href: '/catalog?category=Для+стиральных+и+сушильных+машин' },
          { name: 'Для малой кухонной техники', href: '/catalog?category=Для+малой+кухонной+техники' },
          { name: 'Для климатической техники', href: '/catalog?category=Для+климатической+техники' },
          { name: 'Для посудомоечных машин', href: '/catalog?category=Для+посудомоечных+машин' },
          { name: 'Для прочей малой бытовой техники', href: '/catalog?category=Для+прочей+малой+бытовой+техники' },
          { name: 'Для кофемашин', href: '/catalog?category=Для+кофемашин' },
          { name: 'Электротовары', href: '/catalog?category=Электротовары' },
          { name: 'Для гладильных машин и систем', href: '/catalog?category=Для+гладильных+машин+и+систем' },
        ],
      },
    ],
  },
];

export function CatalogMegaMenu({ isOpen, onClose }: CatalogMegaMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

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
            {/* BRAND BAR STRIP (РАВНОМЕРНО РАСПРЕДЕЛЕННЫЕ КЛЮЧЕВЫЕ БРЕНДЫ) */}
        <div className="bg-[#111316] border-b border-[#2B313A] px-4 sm:px-8 py-2.5 flex items-center justify-between gap-3 sm:gap-4">
          <div className="flex-1 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar py-0.5">
            {BRAND_BAR_ITEMS.map((brand) => (
              <Link
                key={brand.name}
                href={brand.href}
                onClick={onClose}
                className="flex-1 min-w-[76px] sm:min-w-0 inline-flex items-center justify-center px-2 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-[#1E2228] border border-[#2B313A] hover:border-simona-teal hover:text-simona-teal-light hover:shadow-[0_0_14px_rgba(0,151,156,0.35)] transition-all whitespace-nowrap text-center"
              >
                {brand.name}
              </Link>
            ))}

            <Link
              href="/brands"
              onClick={onClose}
              className="shrink-0 text-xs font-semibold text-[#87888A] hover:text-white px-3 py-1.5 rounded-xl hover:bg-[#1E2228] border border-transparent hover:border-[#2B313A] transition-all whitespace-nowrap"
            >
              Все бренды →
            </Link>
          </div>

          <button
            onClick={onClose}
            aria-label="Закрыть каталог (Esc)"
            className="w-8 h-8 rounded-xl border border-[#2B313A] bg-[#1E2228] text-[#87888A] hover:text-white hover:border-simona-teal flex items-center justify-center transition-all shrink-0 ml-1"
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
                            className="font-montserrat font-bold text-xs uppercase tracking-wider text-white hover:text-simona-teal transition-colors"
                          >
                            {group.title}
                          </Link>
                        </div>
                      </div>
                    )}

                    {group.subtitle && (
                      <div className="text-[11px] font-bold text-[#87888A] uppercase tracking-wider px-1.5 pt-0.5">
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

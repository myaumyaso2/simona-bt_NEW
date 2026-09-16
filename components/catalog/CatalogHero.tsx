'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { CATALOG_SUBCATEGORIES, SubCategoryTag } from '@/data/catalogData';

export type PhysicalTabType = 'ALL' | 'SHOWROOM' | 'LOCAL_STOCK' | 'REMOTE_STOCK' | 'ON_ORDER';

interface PresenceTabItem {
  id: PhysicalTabType;
  label: string;
  count: number;
}

const PRESENCE_TABS: PresenceTabItem[] = [
  { id: 'ALL', label: 'Все', count: 420 },
  { id: 'SHOWROOM', label: 'На витрине', count: 32 },
  { id: 'LOCAL_STOCK', label: 'На складе', count: 84 },
  { id: 'REMOTE_STOCK', label: 'На удаленном складе', count: 146 },
  { id: 'ON_ORDER', label: 'Под заказ', count: 158 },
];

interface CatalogHeroProps {
  activeSubcategory: string;
  onSelectSubcategory: (id: string) => void;
  activePhysicalTab: PhysicalTabType;
  onSelectPhysicalTab: (tab: PhysicalTabType) => void;
  totalCount: number;
}

export function CatalogHero({
  activeSubcategory,
  onSelectSubcategory,
  activePhysicalTab,
  onSelectPhysicalTab,
  totalCount,
}: CatalogHeroProps) {
  return (
    <section className="pt-8 pb-6 border-b border-[#2B313A]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-xs text-[#87888A] mb-4 font-normal">
          <Link href="/" className="hover:text-white transition-colors">
            Главная
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#3E3D40]" />
          <Link href="/catalog" className="hover:text-white transition-colors">
            Каталог
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#3E3D40]" />
          <span className="text-[#D7D9DB] font-medium">Духовые шкафы и пароварки</span>
        </nav>

        {/* 2. Title & Count Badge */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-montserrat font-bold text-white tracking-tight">
            Духовые шкафы и пароварки
          </h1>
          <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-[#16191D] border border-[#2B313A] text-simona-teal shadow-sm">
            {totalCount} моделей
          </span>
        </div>

        {/* 3. Description Subtitle */}
        <p className="text-sm text-[#87888A] max-w-2xl leading-relaxed mb-6">
          Флагманские приборы с режимами пара, пиролизом и интеллектуальными термощупами от ведущих европейских брендов.
        </p>

        {/* 4. Subcategory Quick Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mb-5">
          {CATALOG_SUBCATEGORIES.map((cat) => {
            const isActive = activeSubcategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectSubcategory(cat.id)}
                className={`shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 active:scale-95 ${
                  isActive
                    ? 'bg-simona-teal text-white shadow-md shadow-simona-teal/20 border border-simona-teal'
                    : 'bg-[#16191D] hover:bg-[#1E2228] text-[#D7D9DB] border border-[#2B313A] hover:border-simona-teal/40'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* 5. Physical Presence Tabs (Sliding Pill Animation) */}
        <div className="relative inline-flex flex-wrap items-center p-1 rounded-xl bg-[#16191D] border border-[#2B313A] gap-1">
          {PRESENCE_TABS.map((tab) => {
            const isActive = activePhysicalTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectPhysicalTab(tab.id)}
                className={`relative z-10 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors duration-200 whitespace-nowrap cursor-pointer select-none ${
                  isActive
                    ? 'text-white'
                    : 'text-[#87888A] hover:text-[#D7D9DB]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="presenceActiveTab"
                    className="absolute inset-0 rounded-lg bg-[#1E2228] border border-[#2B313A] shadow-sm -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <span>{tab.label}</span>
                <span
                  className={`ml-1 text-[11px] font-mono transition-colors duration-200 ${
                    isActive ? 'text-simona-teal font-semibold' : 'text-[#87888A] font-normal'
                  }`}
                >
                  ({tab.count})
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, ArrowRight } from 'lucide-react';
import {
  SimonaIconClock,
  SimonaIconPin,
  SimonaIconGuarantee,
} from '@/components/brand/SimonaIcons';
import { MANUFACTURER_PROMOS } from '@/data/promosData';
import { ManufacturerPromo, PromoBenefitType } from '@/types';
import { useStore } from '@/components/providers/StoreContext';

const BRAND_FILTERS = [
  'Все бренды',
  'Miele',
  'ASKO',
  'Liebherr',
  'SMEG',
  'OMOIKIRI & KÖRTING',
  'Falmec',
];

export function PromosHubView() {
  const [selectedBrand, setSelectedBrand] = useState('Все бренды');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const { openModal } = useStore();

  const filteredPromos = MANUFACTURER_PROMOS.filter((promo) => {
    const brandMatch =
      selectedBrand === 'Все бренды' ||
      promo.brand.toLowerCase().includes(selectedBrand.toLowerCase());

    const typeMatch =
      selectedType === 'ALL' || promo.benefitType === selectedType;

    return brandMatch && typeMatch;
  });

  return (
    <div className="bg-[#111315] min-h-screen text-[#D7D9DB]">
      {/* 1. Breadcrumbs */}
      <div className="border-b border-[#2B313A] bg-[#16191D]/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <nav className="flex items-center space-x-2 text-xs text-[#87888A]">
            <Link href="/" className="hover:text-white transition-colors">
              Главная
            </Link>
            <ChevronRight className="w-3 h-3 text-[#87888A]" />
            <span className="text-[#D7D9DB] font-medium">Акции производителей</span>
          </nav>
        </div>
      </div>

      {/* 2. Hero Header */}
      <div className="relative border-b border-[#2B313A] py-14 sm:py-20 overflow-hidden">
        {/* Glow wine sphere */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-simona-wine/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
          <div className="inline-flex items-center px-3 py-1 rounded-md bg-simona-wine/25 border border-simona-wine/50 text-white text-xs font-semibold uppercase tracking-wider mb-4 backdrop-blur-md">
            <span>Официальные программы выгоды</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white tracking-tight leading-tight">
            Акции производителей бытовой техники
          </h1>

          <p className="text-sm sm:text-base text-[#87888A] mt-4 leading-relaxed">
            Специальные предложения, комплекты со скидкой, подарки и продленная гарантия от официальных европейских брендов в салонах «СИМОНА» на ул. Белинского, 15 и 11/66.
          </p>
        </div>
      </div>

      {/* 3. Filters Toolbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#2B313A]">
          
          {/* Brand Filter Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-none">
            {BRAND_FILTERS.map((brand) => {
              const active = selectedBrand === brand;
              return (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                    active
                      ? 'bg-simona-wine text-white shadow-lg shadow-simona-wine/25 border border-simona-wine-light/60'
                      : 'bg-[#1E2228] text-[#87888A] hover:text-white border border-[#2B313A] hover:border-[#3E3D40]'
                  }`}
                >
                  {brand}
                </button>
              );
            })}
          </div>

          {/* Counter */}
          <div className="text-xs text-[#87888A] shrink-0">
            Найдено программ: <span className="text-white font-semibold">{filteredPromos.length}</span>
          </div>
        </div>
      </div>

      {/* 4. Promos Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
        {filteredPromos.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-[#2B313A] rounded-2xl bg-[#16191D]">
            <p className="text-sm text-[#87888A]">По выбранным фильтрам актуальных акций не найдено.</p>
            <button
              onClick={() => {
                setSelectedBrand('Все бренды');
                setSelectedType('ALL');
              }}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-simona-wine text-white hover:bg-simona-wine-hover transition"
            >
              Сбросить фильтры
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredPromos.map((promo) => (
              <PromoHubCard key={promo.id} promo={promo} />
            ))}
          </div>
        )}
      </div>

      {/* 5. O2O Assurance Section */}
      <div className="border-t border-[#2B313A] bg-[#16191D] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-[#2B313A] bg-[#1E2228] p-8 sm:p-12 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center space-x-2 text-simona-teal text-xs font-semibold uppercase tracking-wider mb-2.5">
                <SimonaIconGuarantee className="w-4 h-4 text-simona-teal" />
                <span>Авторизованный дилер в Нижнем Новгороде</span>
              </div>
              <h3 className="text-2xl font-semibold text-white tracking-tight">
                Получите персональный расчет спецификации с учетом всех акций
              </h3>
              <p className="text-sm text-[#87888A] mt-2.5 leading-relaxed">
                Эксперты салонов «СИМОНА» на ул. Белинского 15 и 11/66 рассчитают максимальную суммарную выгоду на комплект встраиваемой техники, согласуют схемы монтажа с вашим кухонщиком и зарезервируют подарки.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full lg:w-auto">
              <button
                onClick={() => openModal('SHOWROOM_VISIT')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-simona-wine hover:bg-simona-wine-hover text-white text-sm font-semibold transition-all shadow-lg shadow-simona-wine/25 border border-simona-wine-light/50 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <SimonaIconPin className="w-4 h-4 text-white" />
                <span>Забронировать визит в салон</span>
              </button>

              <button
                onClick={() => openModal('EQUIPMENT_SELECTION')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#16191D] hover:bg-[#242A32] text-white text-sm font-semibold transition-all border border-[#2B313A] hover:border-simona-teal/50 flex items-center justify-center cursor-pointer"
              >
                Подобрать комплект
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PromoHubCard({ promo }: { promo: ManufacturerPromo }) {
  return (
    <Link
      href={`/promos/${promo.slug}`}
      className="group flex flex-col justify-between h-full min-h-[460px] rounded-2xl bg-[#16191D] border border-[#2B313A] hover:border-simona-wine/60 transition-all duration-500 overflow-hidden"
    >
      {/* Top Media */}
      <div className="relative h-56 w-full overflow-hidden bg-[#111315]">
        <Image
          src={promo.bannerUrl}
          alt={promo.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#16191D] via-[#16191D]/40 to-transparent" />

        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
          <span className="px-2.5 py-1 rounded-md bg-[#111315]/85 backdrop-blur-md border border-[#2B313A] text-xs font-semibold text-white uppercase tracking-wider shadow-sm">
            {promo.brand}
          </span>

          <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-simona-wine/25 text-white text-xs font-semibold shadow-sm border border-simona-wine/50 backdrop-blur-md">
            <span>{promo.badgeText}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1 justify-between">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#87888A] font-medium">
            {promo.subtitle}
          </span>

          <h3 className="text-lg font-semibold text-white group-hover:text-white mt-1.5 leading-snug line-clamp-2">
            {promo.title}
          </h3>

          <p className="text-xs sm:text-sm text-[#87888A] mt-2.5 leading-relaxed line-clamp-3">
            {promo.shortDescription}
          </p>
        </div>

        <div className="pt-5 mt-5 border-t border-[#2B313A]/60 flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-xs text-[#87888A]">
            <SimonaIconClock className="w-3.5 h-3.5 text-simona-wine-light" />
            <span>до {promo.endDate}</span>
          </div>

          <div className="inline-flex items-center space-x-1 text-xs font-semibold text-simona-wine-light group-hover:text-white transition-colors">
            <span>Условия акции</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { BrandDetails } from '@/data/brandDetails';
import { useStore } from '@/components/providers/StoreContext';
import {
  SimonaIconArrowLeft,
  SimonaIconCheckCircle,
  SimonaIconBuilding,
  SimonaIconFile,
} from '@/components/brand/SimonaIcons';
import { BrandInnovations } from './BrandInnovations';

interface BrandShowcaseHeroProps {
  brand: BrandDetails;
  totalProductsCount: number;
  onSelectSeries: (query: string) => void;
  onSelectTechnology: (query: string, categorySlug?: string) => void;
}

export function BrandShowcaseHero({
  brand,
  totalProductsCount,
  onSelectSeries,
  onSelectTechnology,
}: BrandShowcaseHeroProps) {
  const { openModal } = useStore();

  const handleScrollToCatalog = () => {
    const el = document.getElementById('brand-catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <Breadcrumbs
        skipJsonLd
        items={[
          { name: 'Бренды', url: '/brands' },
          { name: brand.name },
        ]}
        rightContent={
          <Link
            href="/brands"
            className="inline-flex items-center gap-1.5 text-simona-teal hover:text-simona-teal-light transition text-xs font-semibold shrink-0"
          >
            <SimonaIconArrowLeft className="w-3.5 h-3.5" />
            <span>Ко всем брендам</span>
          </Link>
        }
      />

      <div className="pt-8 pb-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* 1. Official Brand Hero Card */}
        <div className="bg-[#16191D] border border-[#2B313A] rounded-2xl sm:rounded-3xl p-6 sm:p-10 relative overflow-hidden text-left shadow-lg">
          <div className="absolute top-0 right-0 w-96 h-96 bg-simona-teal/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl space-y-4 relative z-10">
            {/* Origin & Showroom Pill */}
            <div className="flex items-center flex-wrap gap-2">
              <span className="px-3 py-1 rounded-md bg-[#1E2228] border border-[#2B313A] text-xs font-semibold text-simona-teal">
                {brand.country} • {brand.showroom}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#1E2228] border border-[#2B313A] text-[11px] font-medium text-zinc-300">
                Официальный партнер
              </span>
            </div>

            {/* Brand Title (Anti-Caps Standard) */}
            <h1 className="text-3xl sm:text-5xl font-montserrat font-bold text-white tracking-tight">
              {brand.name}
            </h1>

            {/* Category / Profile */}
            <p className="text-sm sm:text-base text-zinc-200 font-medium">
              {brand.category}
            </p>

            {/* Narrative / USP */}
            <p className="text-xs sm:text-sm text-[#87888A] leading-relaxed">
              {brand.heroText}
            </p>

            {/* Action Buttons: 4-tier Button Hierarchy */}
            <div className="pt-3 flex flex-wrap gap-3">
              {/* Primary: Showroom Visit */}
              <button
                type="button"
                onClick={() =>
                  openModal('SHOWROOM_VISIT', { preferredShowroom: 'BELINSKOGO_15' })
                }
                className="px-5 py-3 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-semibold tracking-wide transition shadow-lg shadow-simona-teal/20 flex items-center gap-2 cursor-pointer"
              >
                <SimonaIconBuilding className="w-4 h-4" />
                <span>Оценить вживую в шоуруме</span>
              </button>

              {/* Action / Buy / Spec: Designer Specification */}
              <button
                type="button"
                onClick={() => openModal('EQUIPMENT_SELECTION')}
                className="px-5 py-3 rounded-xl bg-[#1E2228] hover:bg-[#252A32] text-white border border-[#2B313A] hover:border-simona-teal/50 text-xs font-semibold tracking-wide transition flex items-center gap-2 cursor-pointer"
              >
                <SimonaIconFile className="w-4 h-4 text-simona-teal" />
                <span>Запросить спецификацию</span>
              </button>

              {/* Secondary: Scroll to Catalog */}
              <button
                type="button"
                onClick={handleScrollToCatalog}
                className="px-5 py-3 rounded-xl bg-[#16191D] hover:bg-[#1E2228] text-zinc-300 hover:text-white border border-[#2B313A] text-xs font-semibold tracking-wide transition cursor-pointer"
              >
                Каталог ({totalProductsCount})
              </button>
            </div>
          </div>

          {/* 2. Key Advantages Grid (4 items) */}
          {brand.advantages && brand.advantages.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-8 border-t border-[#2B313A]/70 relative z-10">
              {brand.advantages.map((adv, idx) => (
                <div
                  key={idx}
                  className="bg-[#1E2228]/50 p-4 rounded-xl border border-[#2B313A]/40 flex flex-col justify-start"
                >
                  <SimonaIconCheckCircle className="w-4 h-4 text-simona-teal mb-2 shrink-0" />
                  <p className="text-xs text-zinc-300 leading-relaxed font-medium">
                    {adv}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3. Official Series & Core Technologies Block */}
        <BrandInnovations
          brandName={brand.name}
          series={brand.series}
          technologies={brand.technologies}
          onSelectSeries={onSelectSeries}
          onSelectTechnology={onSelectTechnology}
        />
      </div>
    </>
  );
}

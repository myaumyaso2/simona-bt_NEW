'use client';

import React from 'react';
import { BrandSeriesItem, BrandTechItem } from '@/data/brandDetails';
import {
  SimonaIconSparkles,
  SimonaIconFlame,
  SimonaIconShieldCheck,
  SimonaIconArrowRight,
  SimonaIconCheck,
} from '@/components/brand/SimonaIcons';

interface BrandInnovationsProps {
  brandName: string;
  series?: BrandSeriesItem[];
  technologies?: BrandTechItem[];
  onSelectSeries?: (query: string) => void;
  onSelectTechnology?: (query: string, categorySlug?: string) => void;
  className?: string;
}

export function BrandInnovations({
  brandName,
  series,
  technologies,
  onSelectSeries,
  onSelectTechnology,
  className = '',
}: BrandInnovationsProps) {
  if ((!series || series.length === 0) && (!technologies || technologies.length === 0)) {
    return null;
  }

  return (
    <section className={`space-y-12 ${className}`}>
      {/* 1. Brand Series (Линейки приборов) */}
      {series && series.length > 0 && (
        <div className="space-y-6">
          <div className="text-left space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-montserrat font-bold text-white tracking-tight">
              Линейки техники {brandName}
            </h2>
            <p className="text-xs sm:text-sm text-[#87888A] max-w-2xl">
              Градация модельного ряда по уровню автоматизации, интеллектуальным датчикам и вариантам исполнения фасадов.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {series.map((item) => (
              <div
                key={item.id}
                className="bg-[#16191D] border border-[#2B313A] rounded-xl p-5 sm:p-6 flex flex-col justify-between hover:border-simona-teal/50 transition-all duration-300 shadow-md group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-montserrat font-bold text-white tracking-wide">
                      {item.name}
                    </span>
                    {item.badge && (
                      <span className="px-2.5 py-0.5 rounded-md bg-[#1E2228] border border-[#2B313A] text-[11px] font-semibold text-simona-teal">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-semibold text-simona-teal mb-2">
                    {item.tagline}
                  </div>
                  <p className="text-xs text-[#87888A] leading-relaxed mb-6 font-normal">
                    {item.description}
                  </p>
                </div>

                {onSelectSeries && item.filterQuery && (
                  <button
                    type="button"
                    onClick={() => onSelectSeries(item.filterQuery!)}
                    className="w-full mt-2 px-4 py-2.5 rounded-xl bg-[#1E2228] hover:bg-simona-teal text-white border border-[#2B313A] hover:border-simona-teal text-xs font-semibold tracking-wide transition-all duration-200 flex items-center justify-between group/btn cursor-pointer"
                  >
                    <span>Смотреть приборы {item.name}</span>
                    <SimonaIconArrowRight className="w-3.5 h-3.5 text-[#87888A] group-hover/btn:text-white group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Brand Core Technologies (Ключевые технологии) */}
      {technologies && technologies.length > 0 && (
        <div className="space-y-6 pt-6 border-t border-[#2B313A]/60">
          <div className="text-left space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-montserrat font-bold text-white tracking-tight">
              Ключевые технологии и инженерные патенты
            </h2>
            <p className="text-xs sm:text-sm text-[#87888A] max-w-2xl">
              Официальные разработки производителя для максимальной заботы о посуде, идеального микроклимата и кулинарной точности.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {technologies.map((tech) => (
              <div
                key={tech.id}
                className="bg-[#16191D] border border-[#2B313A] rounded-xl p-5 sm:p-6 flex flex-col justify-between hover:border-simona-teal/50 transition-all duration-300 shadow-md group"
              >
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-lg bg-[#1E2228] border border-[#2B313A] flex items-center justify-center text-simona-teal shrink-0 group-hover:border-simona-teal/40 transition">
                      <SimonaIconSparkles className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[11px] font-semibold text-[#87888A] uppercase tracking-wider">
                      {tech.categoryName}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-montserrat font-bold text-white mb-2 leading-snug group-hover:text-simona-teal transition-colors">
                    {tech.title}
                  </h3>
                  <p className="text-xs text-[#87888A] leading-relaxed mb-6 font-normal">
                    {tech.description}
                  </p>
                </div>

                {onSelectTechnology && tech.filterQuery && (
                  <button
                    type="button"
                    onClick={() => onSelectTechnology(tech.filterQuery!, tech.categorySlug)}
                    className="w-full mt-2 px-4 py-2 rounded-xl bg-[#1E2228] hover:bg-[#252A32] text-zinc-200 hover:text-white border border-[#2B313A] hover:border-simona-teal/40 text-xs font-semibold tracking-wide transition-all duration-200 flex items-center justify-between group/btn cursor-pointer"
                  >
                    <span>Выбрать модели с этой технологией</span>
                    <SimonaIconArrowRight className="w-3.5 h-3.5 text-[#87888A] group-hover/btn:text-simona-teal group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

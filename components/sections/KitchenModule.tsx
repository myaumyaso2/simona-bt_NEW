'use client';

import React from 'react';
import { ExternalLink, Calculator, Sparkles } from 'lucide-react';
import { useStore } from '@/components/providers/StoreContext';
import { SimonaPatternOverlay } from '@/components/brand/SimonaPattern';
import { SimonaIconCheckCircle } from '@/components/brand/SimonaIcons';

export function KitchenModule() {
  const { openModal } = useStore();
  const kuhniUrl = process.env.NEXT_PUBLIC_KUHNI_URL || 'https://simona-kuhni.ru';

  return (
    <section id="kuhni-module" className="py-24 md:py-32 bg-white border-t border-black/[0.06] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-1.5 rounded-[2.5rem] bg-black/[0.02] ring-1 ring-black/[0.06] shadow-xl relative">
          <div className="rounded-[calc(2.5rem-6px)] overflow-hidden bg-[#F8F9FA] shadow-sm border border-black/[0.04] p-8 sm:p-12 lg:p-16 relative">
            {/* Official Brandbook Pattern Background */}
            <SimonaPatternOverlay variant="subtle" opacity={0.03} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
              {/* Left Content */}
              <div className="lg:col-span-7">
                <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-md bg-simona-teal/10 border border-simona-teal/25 text-simona-teal text-xs font-bold mb-4">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Единая экосистема интерьерных решений</span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-montserrat font-bold text-[#16181B] leading-tight">
                  Кухни под ключ <br />
                  <span className="text-[#6E7074] font-montserrat font-semibold text-2xl sm:text-3xl">
                    с идеальной интеграцией техники
                  </span>
                </h2>

                <p className="mt-5 text-sm sm:text-base text-[#6E7074] font-normal leading-relaxed">
                  Салоны «СИМОНА» проектируют кухни премиум-класса с фабриками <strong className="text-[#16181B]">Nobilia</strong> (Германия), <strong className="text-[#16181B]">Cucine Lube</strong> (Италия) и <strong className="text-[#16181B]">Silver Home</strong>. Мы гарантируем миллиметровую точность встройки всех приборов и скрытый монтаж коммуникаций.
                </p>

                {/* Bullet advantages */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#3E3D40] font-medium">
                  <div className="flex items-center space-x-2">
                    <SimonaIconCheckCircle className="w-4 h-4 text-simona-teal shrink-0" />
                    <span>3D-визуализация с выбранной техникой</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <SimonaIconCheckCircle className="w-4 h-4 text-simona-teal shrink-0" />
                    <span>Шеф-монтаж фасадов и приборов одной бригадой</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <SimonaIconCheckCircle className="w-4 h-4 text-simona-teal shrink-0" />
                    <span>Прямой контракт с европейскими фабриками</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <SimonaIconCheckCircle className="w-4 h-4 text-simona-teal shrink-0" />
                    <span>Специальные условия при заказе кухни + техники</span>
                  </div>
                </div>

                {/* Action Buttons: Strictly rounded-xl */}
                <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
                  <button
                    onClick={() => openModal('KITCHEN_ESTIMATE')}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-lg shadow-simona-teal/20 flex items-center justify-between sm:justify-center group active:scale-98 cursor-pointer"
                  >
                    <span>Рассчитать кухню с техникой</span>
                    <span className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center ml-3 group-hover:scale-105 transition-transform">
                      <Calculator className="w-4 h-4 text-white" />
                    </span>
                  </button>

                  <a
                    href={kuhniUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-zinc-50 text-[#16181B] text-xs font-semibold tracking-wide transition border border-black/[0.08] shadow-sm flex items-center justify-center group active:scale-98 cursor-pointer"
                  >
                    <span>Перейти на simona-kuhni.ru</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-2 text-[#87888A] group-hover:text-[#16181B] transition-transform group-hover:translate-x-0.5" />
                  </a>
                </div>
              </div>

              {/* Right Visual Badge Grid in Light Double-Bezel */}
              <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                <div className="p-1 rounded-2xl bg-black/[0.02] ring-1 ring-black/[0.06] shadow-sm">
                  <div className="p-5 rounded-xl bg-white shadow-sm text-center border border-black/[0.02]">
                    <span className="text-xl font-montserrat font-bold text-[#16181B]">Nobilia</span>
                    <p className="text-[11px] text-[#87888A] mt-1 font-medium">Кухни №1 в Германии</p>
                  </div>
                </div>

                <div className="p-1 rounded-2xl bg-black/[0.02] ring-1 ring-black/[0.06] shadow-sm">
                  <div className="p-5 rounded-xl bg-white shadow-sm text-center border border-black/[0.02]">
                    <span className="text-xl font-montserrat font-bold text-[#16181B]">Cucine Lube</span>
                    <p className="text-[11px] text-[#87888A] mt-1 font-medium">Итальянский дизайн</p>
                  </div>
                </div>

                <div className="p-1 rounded-2xl bg-black/[0.02] ring-1 ring-black/[0.06] shadow-sm">
                  <div className="p-5 rounded-xl bg-white shadow-sm text-center border border-black/[0.02]">
                    <span className="text-xl font-montserrat font-bold text-[#16181B]">Silver Home</span>
                    <p className="text-[11px] text-[#87888A] mt-1 font-medium">Индивидуальные фасады</p>
                  </div>
                </div>

                <div className="p-1 rounded-2xl bg-simona-teal/10 ring-1 ring-simona-teal/30 shadow-sm">
                  <div className="p-5 rounded-xl bg-white text-center flex flex-col justify-center border border-simona-teal/20">
                    <span className="text-xl font-montserrat font-bold text-simona-teal">100%</span>
                    <p className="text-[11px] text-[#16181B] mt-0.5 font-semibold">Точность встройки</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

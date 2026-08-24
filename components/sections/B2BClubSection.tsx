'use client';

import React from 'react';
import { Briefcase, Clock, Upload, Sparkles } from 'lucide-react';
import { useStore } from '@/components/providers/StoreContext';
import { SimonaPatternOverlay } from '@/components/brand/SimonaPattern';
import { SimonaIconPercent, SimonaIconStar, SimonaIconGuarantee, SimonaIconTag } from '@/components/brand/SimonaIcons';

const B2B_BENEFITS = [
  {
    icon: SimonaIconPercent,
    title: 'Партнерское вознаграждение до 10%',
    desc: 'Прозрачная и официальная система агентских выплат по всем европейским брендам без задержек.',
  },
  {
    icon: Clock,
    title: 'Технический расчет за 24 часа',
    desc: 'Наши инженеры проверят все схемы встройки, зазоры, вентиляционные каналы и электровыводы.',
  },
  {
    icon: SimonaIconStar,
    title: 'Салон как ваша переговорная база',
    desc: 'Проводите встречи с заказчиками в комфортных лаунж-зонах флагманского салона на Белинского, 15 с кофе и живой демонстрацией техники.',
  },
  {
    icon: SimonaIconGuarantee,
    title: 'Защита и резервирование проектов',
    desc: 'Фиксация спецификации за вашим проектом, заморозка цен и бесплатное хранение на складе до окончания ремонта.',
  },
];

export function B2BClubSection() {
  const { openModal } = useStore();

  return (
    <section id="b2b-club" className="py-24 md:py-32 bg-[#FAFAFA] border-t border-black/[0.06] relative overflow-hidden">
      {/* Official Brandbook Pattern Background */}
      <SimonaPatternOverlay variant="wine" opacity={0.035} />

      {/* Subtle Ambient Wine Glow */}
      <div className="absolute top-1/3 -right-24 w-[600px] h-[600px] bg-simona-wine/[0.04] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Benefits & Narrative */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-simona-wine/10 border border-simona-wine/20 text-simona-wine text-xs font-bold mb-4">
              <SimonaIconStar className="w-3.5 h-3.5" />
              <span>Программа привилегий для профессионалов</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-montserrat font-bold text-[#16181B] leading-tight">
              Клуб архитекторов <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-simona-wine via-simona-wine-light to-amber-700">
                и дизайнеров интерьеров
              </span>
            </h2>

            <p className="mt-4 text-[#6E7074] font-normal text-sm sm:text-base leading-relaxed">
              Мы берем на себя всю инженерную рутину по бытовой технике: от подбора артикулов по визуализациям до шеф-монтажа и гарантийного сервиса перед вашим клиентом.
            </p>

            {/* Benefits Grid: Light Double-Bezel Architecture */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {B2B_BENEFITS.map((item, idx) => (
                <div key={idx} className="p-1 rounded-2xl bg-black/[0.02] ring-1 ring-black/[0.06] hover:ring-simona-wine/40 transition-all shadow-sm">
                  <div className="p-4 rounded-xl bg-white shadow-sm h-full border border-black/[0.02]">
                    <div className="p-2 w-fit rounded-lg bg-simona-wine/10 text-simona-wine mb-3 border border-simona-wine/20">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-xs font-bold text-[#16181B] mb-1">{item.title}</h3>
                    <p className="text-[11px] text-[#6E7074] font-medium leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: B2B Quick Submission Card in Light Double-Bezel */}
          <div className="lg:col-span-5">
            <div className="p-1.5 rounded-[2rem] bg-black/[0.02] ring-1 ring-black/[0.06] shadow-xl">
              <div className="p-8 sm:p-10 rounded-[calc(2rem-6px)] bg-white shadow-sm border border-black/[0.04] relative overflow-hidden">
                <div className="flex items-center space-x-2 text-xs font-bold text-simona-wine uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Вступить в Клуб / Загрузить проект</span>
                </div>
                <h3 className="text-2xl font-montserrat font-bold text-[#16181B] mb-2">
                  Спецификация и расчет за 24 часа
                </h3>
                <p className="text-xs text-[#6E7074] font-normal mb-6 leading-relaxed">
                  Прикрепите чертеж, коллаж или список техники (.pdf, .dwg, .zip), и персональный B2B-менеджер подготовит расчет.
                </p>

                <button
                  onClick={() => openModal('B2B_CLUB')}
                  className="w-full pl-7 pr-2 py-2 rounded-full bg-simona-wine hover:bg-simona-wine-hover text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-lg shadow-simona-wine/25 flex items-center justify-between group mb-4 active:scale-98"
                >
                  <span className="mr-3">Загрузить дизайн-проект</span>
                  <span className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center group-hover:-translate-y-0.5 transition-transform">
                    <Upload className="w-4 h-4 text-white" />
                  </span>
                </button>

                <div className="text-center">
                  <span className="text-[11px] text-[#87888A]">
                    или свяжитесь с B2B-куратором напрямую:{' '}
                    <a href="tel:+78312170015" className="text-[#16181B] hover:text-simona-teal font-semibold">
                      +7 (831) 217-00-15
                    </a>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import React from 'react';
import { Flame, Utensils, Coffee, Calendar, Sparkles } from 'lucide-react';
import { useStore } from '@/components/providers/StoreContext';
import { SimonaPatternOverlay } from '@/components/brand/SimonaPattern';
import { SimonaIconChef } from '@/components/brand/SimonaIcons';

const KITCHEN_FEATURES = [
  {
    icon: SimonaIconChef,
    title: 'Приготовление с паром и Sous-Vide',
    desc: 'Оцените сочность блюд в комбинированных духовых шкафах Miele DGC с точным контролем влажности и температуры.',
  },
  {
    icon: Utensils,
    title: 'Индукция шеф-уровня Celsius°Cooking™',
    desc: 'Тестируйте беспроводные термозонды ASKO, авторежимы обжарки стейков и моментальный отклик индукционных катушек.',
  },
  {
    icon: Coffee,
    title: 'Дегустация авторского кофе',
    desc: 'Попробуйте фирменный эспрессо из флагманских кофемашин Miele серии 7000 с подбором индивидуального профиля помола.',
  },
];

export function ActiveKitchenSection() {
  const { openModal } = useStore();

  return (
    <section id="active-kitchen" className="py-24 md:py-32 bg-[#F8F9FA] border-t border-black/[0.06] relative overflow-hidden">
      {/* Official Brandbook Pattern Background */}
      <SimonaPatternOverlay variant="teal" opacity={0.04} />

      {/* Subtle Warm Spotlight */}
      <div className="absolute top-1/2 -left-20 w-[500px] h-[500px] bg-amber-500/[0.06] rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/2 -right-20 w-[500px] h-[500px] bg-simona-teal/[0.05] rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Visual Showcase in Light Double-Bezel Frame */}
          <div className="lg:col-span-6 relative">
            <div className="p-1.5 rounded-[1.75rem] bg-black/[0.02] ring-1 ring-black/[0.06] shadow-lg">
              <div className="relative rounded-[calc(1.75rem-6px)] overflow-hidden bg-white shadow-sm group">
                <div
                  className="h-[480px] bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{
                    backgroundImage: `url('/showrooms/belinskogo-15/active_kitchen_01.jpg')`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Floating Badge */}
                <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-md bg-white/95 backdrop-blur-md border border-amber-500/30 text-amber-700 text-xs font-bold flex items-center shadow-md">
                  <Flame className="w-3.5 h-3.5 mr-1.5 text-amber-500 animate-pulse" />
                  ул. Белинского, 15 • Гастрономический салон
                </div>

                {/* Bottom Card on Image */}
                <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-white/95 backdrop-blur-md border border-black/[0.08] shadow-xl">
                  <div className="text-xs text-simona-teal font-bold uppercase tracking-wider mb-1">
                    Шеф-тест-драйв до покупки
                  </div>
                  <div className="text-[#16181B] text-sm sm:text-base font-montserrat font-medium leading-relaxed">
                    «Вы не просто выбираете прибор по каталогу — вы готовите на нем сами вместе с шеф-экспертом СИМОНА»
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Copy and Features */}
          <div className="lg:col-span-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-800 text-xs font-bold mb-4">
              <Flame className="w-3.5 h-3.5 text-amber-600" />
              <span>Действующее кулинарное пространство</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-montserrat font-bold text-[#16181B] leading-tight">
              «Активная кухня» <br />
              <span className="text-[#6E7074] font-montserrat font-semibold text-2xl sm:text-3xl">
                и гастрономический тест-драйв
              </span>
            </h2>

            <p className="mt-4 text-[#6E7074] font-normal text-sm sm:text-base leading-relaxed">
              Во флагманском салоне на ул. Белинского, 15 мы создали полностью подключенное кухонное пространство. Здесь работают флагманы Miele и ASKO: подключены к воде, электричеству и вентиляции.
            </p>

            {/* Feature List: Light Double-Bezel Style */}
            <div className="mt-8 space-y-3.5">
              {KITCHEN_FEATURES.map((feat, idx) => (
                <div key={idx} className="p-1 rounded-2xl bg-black/[0.02] ring-1 ring-black/[0.05] hover:ring-amber-500/30 transition-all shadow-sm">
                  <div className="flex items-start space-x-4 p-3.5 rounded-xl bg-white shadow-sm border border-black/[0.02]">
                    <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600 shrink-0 mt-0.5 border border-amber-500/20">
                      <feat.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#16181B]">{feat.title}</h3>
                      <p className="text-xs text-[#6E7074] mt-1 leading-relaxed">{feat.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action buttons: Strictly rounded-xl */}
            <div className="mt-9 flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={() => openModal('TEST_DRIVE')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-amber-500/20 flex items-center justify-between sm:justify-center group active:scale-98 cursor-pointer"
              >
                <span>Записаться на тест-драйв</span>
                <span className="w-8 h-8 rounded-lg bg-black/10 flex items-center justify-center ml-3 group-hover:scale-105 transition-transform">
                  <Calendar className="w-4 h-4 text-zinc-950" />
                </span>
              </button>

              <button
                onClick={() => openModal('SHOWROOM_VISIT', { preferredShowroom: 'Белинского, 15' })}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-zinc-50 text-[#16181B] text-xs font-semibold tracking-wide transition border border-black/[0.08] shadow-sm flex items-center justify-center active:scale-98 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 mr-2 text-simona-teal" />
                О салоне на Белинского, 15
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

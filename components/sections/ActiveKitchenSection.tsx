'use client';

import React from 'react';
import { Flame, Utensils, Coffee, CheckCircle2, Calendar, Sparkles } from 'lucide-react';
import { useStore } from '@/components/providers/StoreContext';

const KITCHEN_FEATURES = [
  {
    icon: Flame,
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
    <section id="active-kitchen" className="py-24 bg-[#111317] border-t border-zinc-800/80 relative overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-simona-teal/10 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Visual Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden border border-zinc-700/60 shadow-2xl group">
              <div
                className="h-[460px] bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80')`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              {/* Floating Badge */}
              <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-amber-500/40 text-amber-400 text-xs font-semibold flex items-center shadow-lg">
                <Flame className="w-3.5 h-3.5 mr-1.5 text-amber-400 animate-pulse" />
                ул. Белинского, 15 • Флагманский салон
              </div>

              {/* Bottom Card on Image */}
              <div className="absolute bottom-6 left-6 right-6 p-5 rounded-xl bg-zinc-900/90 backdrop-blur-md border border-zinc-700">
                <div className="text-xs text-simona-teal font-semibold uppercase tracking-wider mb-1">
                  Живой опыт до покупки
                </div>
                <div className="text-white text-base font-serif">
                  «Вы не просто выбираете прибор по каталогу — вы готовите на нем сами вместе с шеф-экспертом СИМОНА»
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Copy and Features */}
          <div className="lg:col-span-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium mb-4">
              <Flame className="w-3.5 h-3.5" />
              <span>Уникальное пространство в Нижнем Новгороде</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif font-light text-white leading-tight">
              «Активная кухня» <br />
              <span className="text-zinc-400 font-sans text-2xl sm:text-3xl">
                и демонстрация технологий
              </span>
            </h2>

            <p className="mt-4 text-zinc-300 font-light text-sm sm:text-base leading-relaxed">
              Во флагманском салоне на ул. Белинского, 15 мы создали полностью подключенное кухонное пространство. Здесь работают топовые приборы Miele и ASKO: подключены к воде, электричеству и вентиляции.
            </p>

            {/* Feature List */}
            <div className="mt-8 space-y-5">
              {KITCHEN_FEATURES.map((feat, idx) => (
                <div key={idx} className="flex items-start space-x-4 p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800/60">
                  <div className="p-2.5 rounded-lg bg-zinc-800 text-amber-400 shrink-0 mt-0.5">
                    <feat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{feat.title}</h3>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="mt-9 flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={() => openModal('TEST_DRIVE')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-xs tracking-wider uppercase transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Забронировать визит с экспертом
              </button>

              <button
                onClick={() => openModal('SHOWROOM_VISIT', { preferredShowroom: 'Белинского, 15' })}
                className="w-full sm:w-auto px-6 py-3.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 text-xs font-medium tracking-wide transition border border-zinc-700 flex items-center justify-center"
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

'use client';

import React from 'react';
import { ExternalLink, Calculator, Sparkles, CheckCircle2 } from 'lucide-react';
import { useStore } from '@/components/providers/StoreContext';

export function KitchenModule() {
  const { openModal } = useStore();
  const kuhniUrl = process.env.NEXT_PUBLIC_KUHNI_URL || 'https://simona-kuhni.ru';

  return (
    <section id="kuhni-module" className="py-24 bg-[#0E1012] border-t border-zinc-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-zinc-950 via-zinc-900 to-[#12181B] border border-zinc-800 p-8 sm:p-12 lg:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-simona-teal/10 border border-simona-teal/30 text-simona-teal text-xs font-medium mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Единая экосистема интерьерных решений</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-white leading-tight">
                Кухни под ключ <br />
                <span className="text-zinc-400 font-sans text-2xl sm:text-3xl">
                  с идеальной интеграцией техники
                </span>
              </h2>

              <p className="mt-5 text-sm sm:text-base text-zinc-300 font-light leading-relaxed">
                Салоны «СИМОНА» проектируют кухни премиум-класса с фабриками <strong>Nobilia</strong> (Германия), <strong>Cucine Lube</strong> (Италия) и <strong>Silver Home</strong>. Мы гарантируем миллиметровую точность встройки всех приборов и скрытый монтаж коммуникаций.
              </p>

              {/* Bullet advantages */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-300">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-simona-teal shrink-0" />
                  <span>3D-визуализация с выбранной техникой</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-simona-teal shrink-0" />
                  <span>Шеф-монтаж фасадов и приборов одной бригадой</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-simona-teal shrink-0" />
                  <span>Прямой контракт с европейскими фабриками</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-simona-teal shrink-0" />
                  <span>Специальные условия при заказе кухни + техники</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
                <button
                  onClick={() => openModal('KITCHEN_ESTIMATE')}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-lg bg-simona-teal hover:bg-simona-teal-light text-white text-xs font-semibold uppercase tracking-wider transition shadow-lg shadow-simona-teal/20 flex items-center justify-center"
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  Рассчитать кухню с техникой
                </button>

                <a
                  href={kuhniUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-medium tracking-wide transition border border-zinc-700 flex items-center justify-center group"
                >
                  <span>Перейти на simona-kuhni.ru</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-2 text-zinc-400 group-hover:text-white transition-transform group-hover:translate-x-0.5" />
                </a>
              </div>
            </div>

            {/* Right Visual Badge Grid */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-center">
                <span className="text-2xl font-serif text-white">Nobilia</span>
                <p className="text-[11px] text-zinc-400 mt-1">Кухни №1 в Германии</p>
              </div>
              <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-center">
                <span className="text-2xl font-serif text-white">Cucine Lube</span>
                <p className="text-[11px] text-zinc-400 mt-1">Итальянский дизайн</p>
              </div>
              <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-center">
                <span className="text-2xl font-serif text-white">Silver Home</span>
                <p className="text-[11px] text-zinc-400 mt-1">Индивидуальные фасады</p>
              </div>
              <div className="p-6 rounded-2xl bg-simona-teal/10 border border-simona-teal/30 text-center flex flex-col justify-center">
                <span className="text-xl font-serif text-simona-teal font-semibold">100%</span>
                <p className="text-[11px] text-zinc-300 mt-0.5">Точность встройки</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

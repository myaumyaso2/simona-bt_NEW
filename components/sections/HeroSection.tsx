'use client';

import React from 'react';
import { Sparkles, FileText, ArrowRight, ShieldCheck, Flame, Compass } from 'lucide-react';
import { useStore } from '@/components/providers/StoreContext';

export function HeroSection() {
  const { openModal } = useStore();

  return (
    <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#0E1012] via-[#121519] to-[#0E1012]">
      {/* Background Image / Ambient Overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 scale-105 transition-transform duration-1000"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E1012] via-[#0E1012]/80 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-simona-teal/10 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Top Tag */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-700/60 backdrop-blur-md mb-8">
          <span className="w-2 h-2 rounded-full bg-simona-teal animate-pulse" />
          <span className="text-xs font-medium tracking-wider uppercase text-zinc-300">
            Нижний Новгород • Флагманские салоны на ул. Белинского
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-light text-white tracking-tight leading-[1.15] max-w-4xl mx-auto">
          СИМОНА. <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-400">
            Премиальная бытовая техника
          </span>{' '}
          <br />
          <span className="italic font-light text-simona-teal">для вашей идеальной кухни</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg lg:text-xl text-zinc-400 font-light max-w-2xl mx-auto leading-relaxed">
          Официальный партнер Miele, ASKO, Liebherr, SMEG в Нижнем Новгороде. Экспертный подбор под дизайн-проекты, демонстрация технологий на Активной кухне и заботливый сервис.
        </p>

        {/* Primary Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
          <button
            onClick={() => openModal('SHOWROOM_VISIT')}
            className="w-full sm:w-auto px-8 py-4 rounded-lg bg-simona-teal hover:bg-simona-teal-light text-white font-medium text-sm tracking-wide transition-all duration-200 shadow-xl shadow-simona-teal/20 flex items-center justify-center group active:scale-98"
          >
            <Sparkles className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
            Записаться на визит в салон
          </button>

          <button
            onClick={() => openModal('PROJECT_MATCHING')}
            className="w-full sm:w-auto px-8 py-4 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 hover:text-white font-medium text-sm tracking-wide transition-all border border-zinc-700/80 hover:border-zinc-600 flex items-center justify-center group backdrop-blur-md"
          >
            <FileText className="w-4 h-4 mr-2 text-simona-teal" />
            Подобрать технику по дизайн-проекту
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Value Chips */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-zinc-800/60">
          <div className="flex flex-col items-center text-center p-3 rounded-lg bg-zinc-900/40 border border-zinc-800/40">
            <Flame className="w-5 h-5 text-amber-400 mb-1.5" />
            <span className="text-xs font-semibold text-zinc-200">Активная кухня</span>
            <span className="text-[11px] text-zinc-500">Тест-драйв приборов до покупки</span>
          </div>

          <div className="flex flex-col items-center text-center p-3 rounded-lg bg-zinc-900/40 border border-zinc-800/40">
            <Compass className="w-5 h-5 text-simona-teal mb-1.5" />
            <span className="text-xs font-semibold text-zinc-200">2 салона в центре</span>
            <span className="text-[11px] text-zinc-500">Белинского, 15 и 11/66</span>
          </div>

          <div className="flex flex-col items-center text-center p-3 rounded-lg bg-zinc-900/40 border border-zinc-800/40">
            <ShieldCheck className="w-5 h-5 text-simona-teal mb-1.5" />
            <span className="text-xs font-semibold text-zinc-200">Официальная гарантия</span>
            <span className="text-[11px] text-zinc-500">Прямые поставки брендов</span>
          </div>

          <div className="flex flex-col items-center text-center p-3 rounded-lg bg-zinc-900/40 border border-zinc-800/40">
            <span className="text-base font-bold text-zinc-200 mb-0.5">8 000+</span>
            <span className="text-xs font-semibold text-zinc-200">Моделей под проект</span>
            <span className="text-[11px] text-zinc-500">Схемы встройки и чертежи</span>
          </div>
        </div>
      </div>
    </section>
  );
}

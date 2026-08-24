'use client';

import React from 'react';
import { Sparkles, ArrowRight, Compass } from 'lucide-react';
import { useStore } from '@/components/providers/StoreContext';
import { SimonaPatternOverlay } from '@/components/brand/SimonaPattern';
import { SimonaLogo } from '@/components/brand/SimonaLogo';
import { SimonaIconChef, SimonaIconStar, SimonaIconGuarantee } from '@/components/brand/SimonaIcons';

export function HeroSection() {
  const { openModal } = useStore();

  return (
    <section className="relative min-h-[92dvh] flex items-center justify-center overflow-hidden bg-[#FAFAFA] py-16 md:py-24">
      {/* Official Brandbook Pattern Background (Nodes 1236:59605 & 2103:2483) */}
      <SimonaPatternOverlay variant="teal" opacity={0.05} />

      {/* Ambient Light Visual Backing */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.06] scale-105 transition-transform duration-1000"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85')`,
          }}
        />
        {/* Soft Radial Ambient Spotlight */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-radial from-simona-teal/[0.08] via-transparent to-transparent blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#FAFAFA] to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Brand Sign Badge */}
        <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-white border border-black/[0.06] shadow-sm mb-8">
          <SimonaLogo signOnly variant="teal" size="xs" className="w-4 h-3" />
          <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.15em] uppercase text-[#3E3D40]">
            Нижний Новгород • Флагманские пространства на ул. Белинского
          </span>
        </div>

        {/* Main Heading - Pure Montserrat per Brandbook */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-montserrat font-bold text-[#16181B] tracking-tight leading-[1.12] max-w-5xl mx-auto">
          Бутик высокой кулинарной <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-simona-teal-dark via-simona-teal to-simona-teal-light">
            и встраиваемой техники
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg lg:text-xl text-[#6E7074] font-normal max-w-3xl mx-auto leading-relaxed">
          Авторизованный партнер <strong className="text-[#16181B] font-semibold">Miele, ASKO, Liebherr, SMEG, Bertazzoni</strong>. 
          Персональный шеф-тест-драйв на «Активной кухне», сомелье-подбор винных шкафов и инженерный расчет схем встройки.
        </p>

        {/* Primary Action Buttons: Button-in-Button Standard */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
          <button
            onClick={() => openModal('SHOWROOM_VISIT')}
            className="w-full sm:w-auto pl-7 pr-2 py-2 rounded-full bg-simona-teal hover:bg-simona-teal-hover text-white font-semibold text-xs tracking-wider uppercase transition-all duration-300 shadow-xl shadow-simona-teal/25 flex items-center justify-between group active:scale-98"
          >
            <span className="mr-3">Записаться на визит с экспертом</span>
            <span className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
            </span>
          </button>

          <button
            onClick={() => openModal('PROJECT_MATCHING')}
            className="w-full sm:w-auto pl-7 pr-2 py-2 rounded-full bg-white hover:bg-zinc-50 text-[#16181B] font-semibold text-xs tracking-wider uppercase transition-all duration-300 border border-black/[0.08] hover:border-simona-teal/50 flex items-center justify-between group shadow-sm active:scale-98"
          >
            <span className="mr-3">Подобрать под дизайн-проект</span>
            <span className="w-9 h-9 rounded-full bg-black/[0.05] flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
              <ArrowRight className="w-4 h-4 text-simona-teal" />
            </span>
          </button>
        </div>

        {/* Light Double-Bezel Value Cards with Official Identity Icons */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto pt-8 border-t border-black/[0.06]">
          <div className="p-1 rounded-2xl bg-black/[0.02] ring-1 ring-black/[0.05] transition-all hover:ring-simona-teal/40 shadow-sm">
            <div className="p-4 rounded-xl bg-white shadow-sm flex flex-col items-center text-center">
              <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-2.5">
                <SimonaIconChef className="w-4 h-4 text-amber-500" />
              </div>
              <span className="text-xs font-bold text-[#16181B]">Активная кухня</span>
              <span className="text-[11px] text-[#6E7074] mt-0.5 font-medium">Шеф-дегустация и тест-драйв</span>
            </div>
          </div>

          <div className="p-1 rounded-2xl bg-black/[0.02] ring-1 ring-black/[0.05] transition-all hover:ring-simona-teal/40 shadow-sm">
            <div className="p-4 rounded-xl bg-white shadow-sm flex flex-col items-center text-center">
              <div className="w-9 h-9 rounded-full bg-simona-teal/10 border border-simona-teal/20 flex items-center justify-center mb-2.5">
                <Compass className="w-4 h-4 text-simona-teal" />
              </div>
              <span className="text-xs font-bold text-[#16181B]">2 салона в центре</span>
              <span className="text-[11px] text-[#6E7074] mt-0.5 font-medium">Белинского, 15 и 11/66</span>
            </div>
          </div>

          <div className="p-1 rounded-2xl bg-black/[0.02] ring-1 ring-black/[0.05] transition-all hover:ring-simona-teal/40 shadow-sm">
            <div className="p-4 rounded-xl bg-white shadow-sm flex flex-col items-center text-center">
              <div className="w-9 h-9 rounded-full bg-simona-wine/10 border border-simona-wine/20 flex items-center justify-center mb-2.5">
                <SimonaIconStar className="w-4 h-4 text-simona-wine" />
              </div>
              <span className="text-xs font-bold text-[#16181B]">Клуб дизайнеров</span>
              <span className="text-[11px] text-[#6E7074] mt-0.5 font-medium">Переговорная база & B2B 10%</span>
            </div>
          </div>

          <div className="p-1 rounded-2xl bg-black/[0.02] ring-1 ring-black/[0.05] transition-all hover:ring-simona-teal/40 shadow-sm">
            <div className="p-4 rounded-xl bg-white shadow-sm flex flex-col items-center text-center">
              <div className="w-9 h-9 rounded-full bg-simona-gold/15 border border-simona-gold/30 flex items-center justify-center mb-2.5">
                <SimonaIconGuarantee className="w-4 h-4 text-amber-600" />
              </div>
              <span className="text-xs font-bold text-[#16181B]">Шеф-монтаж</span>
              <span className="text-[11px] text-[#6E7074] mt-0.5 font-medium">Официальная гарантия фабрик</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

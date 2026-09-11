'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, Smartphone } from 'lucide-react';
import { useStore } from '@/components/providers/StoreContext';
import { SimonaLogo } from '@/components/brand/SimonaLogo';
import { SimonaPatternOverlay } from '@/components/brand/SimonaPattern';

export function OrderOnlineBanner() {
  const { openModal } = useStore();

  return (
    <section className="py-16 sm:py-20 bg-[#111315]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Frame per Figma node 1:656 */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#006e72] via-[#00979C] to-[#00a8ae] p-8 sm:p-12 lg:p-16 shadow-2xl">
          {/* Subtle Brand Pattern Watermark */}
          <SimonaPatternOverlay variant="white" opacity={0.08} />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column Content (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* White Logo */}
              <div className="mb-2">
                <SimonaLogo variant="white" descriptor="bt_kitchens" size="sm" />
              </div>

              {/* Title H2 */}
              <h2 className="text-3xl sm:text-5xl font-montserrat font-bold text-white tracking-tight leading-tight">
                Заказывайте онлайн
              </h2>

              {/* Description */}
              <p className="text-sm sm:text-base text-white/90 font-normal leading-relaxed max-w-xl">
                Совершайте покупки не выходя из дома. Каталог 8 000+ позиций с доставкой и шеф-монтажом по Нижнему Новгороду.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <Link
                  href="/catalog"
                  className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-white hover:bg-zinc-100 text-[#007378] font-montserrat font-semibold text-xs uppercase tracking-wider transition-all duration-300 shadow-xl space-x-2 text-center active:scale-98"
                >
                  <span>Открыть каталог</span>
                  <ArrowRight className="w-4 h-4 text-[#007378]" />
                </Link>

                <button
                  onClick={() => openModal('SHOWROOM_VISIT')}
                  className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/40 text-white font-montserrat font-semibold text-xs uppercase tracking-wider transition-all duration-300 space-x-2 text-center"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Записаться в салон</span>
                </button>
              </div>

              {/* Bullet Features */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 pt-4 text-xs font-medium text-white/95 border-t border-white/20">
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
                  <span>Доставка по НН</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
                  <span>Шеф-монтаж</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
                  <span>Хранение на складе</span>
                </div>
              </div>

            </div>

            {/* Right Column: Mobile App Interface Mockup (5 Cols) */}
            <div className="lg:col-span-5 flex items-center justify-center relative">
              <div className="relative w-64 sm:w-72 aspect-[9/18] rounded-[2.5rem] bg-[#111315] p-3 shadow-[0_25px_60px_rgba(0,0,0,0.5)] border-[4px] border-[#2B313A] flex flex-col justify-between overflow-hidden group">
                
                {/* Smartphone screen header */}
                <div className="w-full flex justify-between items-center px-3 pt-1 text-[10px] text-white/60">
                  <span>9:41</span>
                  <div className="w-16 h-3.5 bg-black rounded-full mx-auto -mt-1" />
                  <span>5G 100%</span>
                </div>

                {/* Smartphone screen body */}
                <div className="flex-1 mt-3 rounded-2xl bg-[#16191D] p-4 flex flex-col justify-between border border-white/5">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-simona-teal tracking-wider uppercase">SIMONA</span>
                      <span className="w-2 h-2 rounded-full bg-simona-teal animate-ping" />
                    </div>
                    
                    <div className="h-20 rounded-xl bg-[#1E2228] border border-[#2B313A] p-2 flex flex-col justify-end relative overflow-hidden">
                      <img
                        src="/showrooms/belinskogo-15/active_kitchen_01.jpg"
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover opacity-60"
                      />
                      <span className="relative z-10 text-[9px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded w-fit">
                        Активная кухня
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="h-2 bg-[#2B313A] rounded w-3/4" />
                      <div className="h-2 bg-[#2B313A]/60 rounded w-1/2" />
                    </div>
                  </div>

                  <div className="w-full py-2 rounded-lg bg-simona-teal text-white text-[10px] font-bold text-center uppercase tracking-wider shadow-md">
                    Каталог 8 000+ SKU
                  </div>
                </div>

                {/* Smartphone home bar */}
                <div className="w-24 h-1 bg-white/30 rounded-full mx-auto mt-2" />
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

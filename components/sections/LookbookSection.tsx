'use client';

import React, { useState } from 'react';
import { LookbookProject, LookbookHotspot } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Sparkles, MapPin, Eye, ArrowRight, User } from 'lucide-react';
import { useStore } from '@/components/providers/StoreContext';
import { SimonaPatternOverlay } from '@/components/brand/SimonaPattern';

const LOOKBOOK_PROJECTS: LookbookProject[] = [
  {
    id: 'proj-1',
    title: 'Пентхаус на Верхне-Волжской набережной',
    designer: 'Архитектурное бюро «STUDIO 52» (Нижний Новгород)',
    location: 'Нижний Новгород, Верхне-Волжская наб.',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
    description: 'Интерьер в стиле современного минимализма с открытой островной кухней. Интегрирован комбинированный комплект Miele Obsidian Black с пароваркой и вакууматором.',
    hotspots: [
      {
        x: 42,
        y: 46,
        product: {
          name: 'Комбинированный духовой шкаф с паром Miele DGC 7865 HC Pro',
          brand: 'Miele',
          sku: 'DGC 7865 HC Pro',
          price: 890000,
          physicalStatus: 'ACTIVE_KITCHEN',
          slug: 'miele-dgc-7865-hc-pro-obsidian-black',
        },
      },
      {
        x: 65,
        y: 58,
        product: {
          name: 'Индукционная панель ASKO Celsius°Cooking™ HIG1995AB',
          brand: 'ASKO',
          sku: 'HIG1995AB',
          price: 430000,
          physicalStatus: 'ACTIVE_KITCHEN',
          slug: 'asko-celsius-cooking-hig1995ab',
        },
      },
    ],
  },
  {
    id: 'proj-2',
    title: 'Загородная резиденция в Александровском саду',
    designer: 'Дизайнер интерьеров Екатерина Морозова',
    location: 'Нижегородская область',
    imageUrl: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=85',
    description: 'Просторная кухня-гостиная с акцентом на натуральный камень и японскую эстетику OMOIKIRI в мокрой зоне.',
    hotspots: [
      {
        x: 52,
        y: 62,
        product: {
          name: 'Кухонная мойка OMOIKIRI Yonas 86-CA Artgranit',
          brand: 'OMOIKIRI',
          sku: 'SINK-YONAS-86-CA',
          price: 49900,
          physicalStatus: 'EXHIBITION_11',
          slug: 'omoikiri-yonas-86-ca-artgranit',
        },
      },
      {
        x: 55,
        y: 50,
        product: {
          name: 'Смеситель OMOIKIRI Nagano Gun Metal с фильтром',
          brand: 'OMOIKIRI',
          sku: 'NAGANO-PVD-GM',
          price: 36900,
          physicalStatus: 'EXHIBITION_11',
          slug: 'omoikiri-nagano-gun-metal',
        },
      },
    ],
  },
];

export function LookbookSection() {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<LookbookHotspot | null>(null);
  const { openModal } = useStore();

  const currentProject = LOOKBOOK_PROJECTS[activeProjectIndex];

  return (
    <section id="lookbook" className="py-24 md:py-32 bg-[#F8F9FA] border-t border-black/[0.06] relative overflow-hidden">
      {/* Official Brandbook Pattern Background */}
      <SimonaPatternOverlay variant="subtle" opacity={0.035} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-simona-teal mb-3">
              Реализованные интерьеры
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-montserrat font-bold text-[#16181B] tracking-tight">
              Lookbook проектов
            </h2>
          </div>
          <p className="mt-4 md:mt-0 text-sm text-[#6E7074] max-w-md font-normal leading-relaxed">
            Проекты ведущих дизайнеров Нижнего Новгорода, полностью укомплектованные техникой из салонов «СИМОНА». Нажмите на точки для просмотра приборов.
          </p>
        </div>

        {/* Project Selector Tabs */}
        <div className="flex items-center space-x-3 mb-8 overflow-x-auto pb-2 no-scrollbar">
          {LOOKBOOK_PROJECTS.map((proj, idx) => (
            <button
              key={proj.id}
              onClick={() => {
                setActiveProjectIndex(idx);
                setActiveHotspot(null);
              }}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all ${
                activeProjectIndex === idx
                  ? 'bg-[#16181B] text-white shadow-md'
                  : 'bg-white text-[#6E7074] hover:text-[#16181B] hover:bg-zinc-100 border border-black/[0.08]'
              }`}
            >
              {proj.title}
            </button>
          ))}
        </div>

        {/* Interactive Image in Light Double-Bezel Frame */}
        <div className="p-1.5 rounded-[2rem] bg-black/[0.02] ring-1 ring-black/[0.06] shadow-xl">
          <div className="rounded-[calc(2rem-6px)] overflow-hidden bg-white shadow-sm">
            <div className="relative aspect-[16/9] w-full">
              <img
                src={currentProject.imageUrl}
                alt={currentProject.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 pointer-events-none" />

              {/* Interactive Hotspot Buttons with 44x44px accessible touch target */}
              {currentProject.hotspots.map((hs, hIdx) => (
                <div
                  key={hIdx}
                  style={{ top: `${hs.y}%`, left: `${hs.x}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                >
                  <button
                    onClick={() => setActiveHotspot(activeHotspot === hs ? null : hs)}
                    className="relative group w-11 h-11 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-simona-teal rounded-full"
                    aria-label={`Прибор: ${hs.product.name}`}
                  >
                    <span className="absolute inset-2 rounded-full bg-simona-teal/40 animate-ping opacity-75 pointer-events-none" />
                    <span className="relative flex items-center justify-center w-8 h-8 rounded-full bg-simona-teal text-white shadow-xl border-2 border-white hover:scale-110 transition-transform">
                      <Eye className="w-3.5 h-3.5" />
                    </span>
                  </button>

                  {/* Hotspot Popover Tooltip */}
                  {activeHotspot === hs && (
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-14 w-72 p-4 rounded-2xl bg-white/95 backdrop-blur-xl border border-simona-teal/50 shadow-2xl text-left z-30 animate-scale">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-simona-teal mb-1">
                        {hs.product.brand} • Арт: {hs.product.sku}
                      </div>
                      <div className="text-xs font-bold text-[#16181B] line-clamp-2 mb-2">
                        {hs.product.name}
                      </div>
                      <div className="text-sm font-montserrat font-bold text-[#16181B] mb-3">
                        {formatPrice(hs.product.price)}
                      </div>
                      <button
                        onClick={() => {
                          openModal('PROJECT_MATCHING');
                          setActiveHotspot(null);
                        }}
                        className="w-full py-2 px-3 rounded-full bg-simona-teal hover:bg-simona-teal-hover text-white text-[11px] font-bold transition active:scale-98 shadow-sm"
                      >
                        Запросить расчет комплекта
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Project Details Footer on Card */}
            <div className="p-6 sm:p-8 bg-white border-t border-black/[0.06] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-montserrat font-bold text-[#16181B]">{currentProject.title}</h3>
                <div className="flex flex-wrap items-center gap-4 mt-1.5 text-xs text-[#6E7074]">
                  <span className="flex items-center text-simona-teal font-semibold">
                    <User className="w-3.5 h-3.5 mr-1" />
                    {currentProject.designer}
                  </span>
                  <span className="flex items-center text-[#87888A]">
                    <MapPin className="w-3.5 h-3.5 mr-1" />
                    {currentProject.location}
                  </span>
                </div>
              </div>

              <button
                onClick={() => openModal('PROJECT_MATCHING')}
                className="pl-5 pr-2 py-2 rounded-full bg-[#16181B] hover:bg-zinc-800 text-white text-xs font-semibold border border-black/[0.08] transition flex items-center justify-between group shrink-0 self-start md:self-auto active:scale-98 shadow-sm"
              >
                <span className="mr-3">Комплектовать похожий проект</span>
                <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                  <ArrowRight className="w-3.5 h-3.5 text-simona-teal" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

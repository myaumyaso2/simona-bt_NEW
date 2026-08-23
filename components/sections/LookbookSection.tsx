'use client';

import React, { useState } from 'react';
import { LookbookProject, LookbookHotspot } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Sparkles, MapPin, Eye, ArrowRight, User } from 'lucide-react';
import { useStore } from '@/components/providers/StoreContext';

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
    <section id="lookbook" className="py-24 bg-[#111317] border-t border-zinc-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-simona-teal mb-3">
              Реализованные интерьеры
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-light text-white tracking-tight">
              Lookbook проектов
            </h2>
          </div>
          <p className="mt-4 md:mt-0 text-sm text-zinc-400 max-w-md font-light">
            Проекты ведущих дизайнеров Нижнего Новгорода, полностью укомплектованные техникой из салонов «СИМОНА». Нажмите на точки для просмотра приборов.
          </p>
        </div>

        {/* Project Selector Tabs */}
        <div className="flex items-center space-x-3 mb-8 overflow-x-auto pb-2">
          {LOOKBOOK_PROJECTS.map((proj, idx) => (
            <button
              key={proj.id}
              onClick={() => {
                setActiveProjectIndex(idx);
                setActiveHotspot(null);
              }}
              className={`px-5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                activeProjectIndex === idx
                  ? 'bg-simona-teal text-white shadow-lg shadow-simona-teal/20'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
              }`}
            >
              {proj.title}
            </button>
          ))}
        </div>

        {/* Interactive Image with Hotspots */}
        <div className="relative rounded-2xl overflow-hidden border border-zinc-700/80 shadow-2xl bg-zinc-950">
          <div className="relative aspect-[16/9] w-full">
            <img
              src={currentProject.imageUrl}
              alt={currentProject.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

            {/* Interactive Hotspot Buttons */}
            {currentProject.hotspots.map((hs, hIdx) => (
              <div
                key={hIdx}
                style={{ top: `${hs.y}%`, left: `${hs.x}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
              >
                <button
                  onClick={() => setActiveHotspot(activeHotspot === hs ? null : hs)}
                  className="relative group p-2 focus:outline-none"
                  aria-label={`Прибор: ${hs.product.name}`}
                >
                  <span className="absolute inset-0 rounded-full bg-simona-teal/40 animate-ping opacity-75" />
                  <span className="relative flex items-center justify-center w-8 h-8 rounded-full bg-simona-teal text-white shadow-xl border-2 border-white hover:scale-110 transition-transform">
                    <Eye className="w-3.5 h-3.5" />
                  </span>
                </button>

                {/* Hotspot Popover Tooltip */}
                {activeHotspot === hs && (
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-12 w-72 p-4 rounded-xl bg-zinc-900/95 backdrop-blur-md border border-simona-teal/50 shadow-2xl text-left z-30 animate-scale">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-simona-teal mb-1">
                      {hs.product.brand} • Арт: {hs.product.sku}
                    </div>
                    <div className="text-xs font-medium text-white line-clamp-2 mb-2">
                      {hs.product.name}
                    </div>
                    <div className="text-sm font-serif text-zinc-200 mb-3">
                      {formatPrice(hs.product.price)}
                    </div>
                    <button
                      onClick={() => {
                        openModal('PROJECT_MATCHING');
                        setActiveHotspot(null);
                      }}
                      className="w-full py-2 px-3 rounded-lg bg-simona-teal hover:bg-simona-teal-light text-white text-[11px] font-semibold transition"
                    >
                      Запросить расчет комплекта
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Project Details Footer on Card */}
          <div className="p-6 bg-zinc-900/95 border-t border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-serif text-white">{currentProject.title}</h3>
              <div className="flex flex-wrap items-center gap-4 mt-1 text-xs text-zinc-400">
                <span className="flex items-center text-simona-teal">
                  <User className="w-3.5 h-3.5 mr-1" />
                  {currentProject.designer}
                </span>
                <span className="flex items-center text-zinc-500">
                  <MapPin className="w-3.5 h-3.5 mr-1" />
                  {currentProject.location}
                </span>
              </div>
            </div>

            <button
              onClick={() => openModal('PROJECT_MATCHING')}
              className="px-5 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700 transition flex items-center shrink-0 self-start md:self-auto"
            >
              Комплектовать похожий проект
              <ArrowRight className="w-3.5 h-3.5 ml-2 text-simona-teal" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import React from 'react';
import { Play, Send } from 'lucide-react';
import { SimonaPatternOverlay } from '@/components/brand/SimonaPattern';

const LIVE_STORIES = [
  {
    title: 'Готовим стейк рибай на пару в Miele DGC 7865',
    tag: 'Мастер-класс',
    views: '1.4k',
    thumbnail: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Обзор варочной панели ASKO Celsius°Cooking',
    tag: 'Технологии',
    views: '2.1k',
    thumbnail: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Распаковка лимитированного холодильника SMEG x D&G',
    tag: 'Эксклюзив',
    views: '3.8k',
    thumbnail: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Тест на прочность японской мойки OMOIKIRI Artgranit',
    tag: 'Краш-тест',
    views: '980',
    thumbnail: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
  },
];

export function LiveContentWidget() {
  return (
    <section className="py-24 bg-white border-t border-black/[0.06] relative overflow-hidden">
      {/* Official Brandbook Pattern Background */}
      <SimonaPatternOverlay variant="subtle" opacity={0.03} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-simona-teal mb-2 flex items-center">
              <span className="w-2 h-2 rounded-full bg-simona-wine mr-2 animate-pulse" />
              Live-контент
            </div>
            <h2 className="text-3xl sm:text-4xl font-montserrat font-bold text-[#16181B]">
              Видео из жизни салонов
            </h2>
          </div>
          <a
            href="https://t.me/simona_bt_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 md:mt-0 inline-flex items-center text-xs text-simona-teal hover:text-simona-teal-dark font-semibold transition"
          >
            <Send className="w-3.5 h-3.5 mr-1.5" />
            Смотреть больше в Telegram-канале
          </a>
        </div>

        {/* Stories Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {LIVE_STORIES.map((story, idx) => (
            <div
              key={idx}
              className="p-1 rounded-3xl bg-black/[0.02] ring-1 ring-black/[0.06] hover:ring-simona-teal/40 transition-all duration-300 shadow-sm"
            >
              <div className="group relative rounded-[calc(1.5rem-2px)] overflow-hidden aspect-[9/14] bg-zinc-900 cursor-pointer">
                <img
                  src={story.thumbnail}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                {/* Tag */}
                <div className="absolute top-4 left-4">
                  <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] uppercase font-bold tracking-wider text-simona-teal border border-white/10 shadow-sm">
                    {story.tag}
                  </span>
                </div>

                {/* Play Button Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/25 backdrop-blur-md text-white flex items-center justify-center group-hover:scale-110 group-hover:bg-simona-teal transition-all shadow-xl">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>

                {/* Bottom text */}
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-xs font-semibold text-white line-clamp-2 leading-snug">
                    {story.title}
                  </p>
                  <span className="text-[10px] text-zinc-300 mt-1 block">
                    {story.views} просмотров
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

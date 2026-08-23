'use client';

import React from 'react';
import { Play, Sparkles, Send } from 'lucide-react';

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
    <section className="py-20 bg-[#111317] border-t border-zinc-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-simona-teal mb-2 flex items-center">
              <span className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse" />
              Live-контент
            </div>
            <h2 className="text-3xl font-serif font-light text-white">
              Видео из жизни салонов
            </h2>
          </div>
          <a
            href="https://t.me/simona_bt_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 md:mt-0 inline-flex items-center text-xs text-simona-teal hover:underline font-medium"
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
              className="group relative rounded-2xl overflow-hidden aspect-[9/14] bg-zinc-900 border border-zinc-800 cursor-pointer shadow-lg hover:border-simona-teal/50 transition-all duration-300"
            >
              <img
                src={story.thumbnail}
                alt={story.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              {/* Tag */}
              <div className="absolute top-4 left-4">
                <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] uppercase font-semibold tracking-wider text-simona-teal border border-zinc-700">
                  {story.tag}
                </span>
              </div>

              {/* Play Button Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center group-hover:scale-110 group-hover:bg-simona-teal transition-all shadow-xl">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>
              </div>

              {/* Bottom text */}
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-xs font-medium text-white line-clamp-2 leading-snug">
                  {story.title}
                </p>
                <span className="text-[10px] text-zinc-400 mt-1 block">
                  {story.views} просмотров
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

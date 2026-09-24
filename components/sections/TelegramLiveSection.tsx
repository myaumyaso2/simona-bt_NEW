'use client';

import React, { useEffect, useRef } from 'react';
import { Send, Play, Eye } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStore } from '@/components/providers/StoreContext';
import { SectionBadge } from '@/components/ui/SectionBadge';
import { PlexusConstellationBackground } from '@/components/backgrounds/PlexusConstellationBackground';

const TELEGRAM_VIDEOS = [
  {
    id: 'asko-steam',
    title: 'Тест-драйв комби-пароварки ASKO',
    views: '2.4K',
    thumbnail: '/showrooms/belinskogo-15/active_kitchen_01.jpg',
    telegramUrl: 'https://t.me/simona_bt',
  },
  {
    id: 'omoikiri-colors',
    title: 'Новые матовые цвета смесителей Omoikiri',
    views: '1.8K',
    thumbnail: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    telegramUrl: 'https://t.me/simona_bt',
  },
  {
    id: 'liebherr-wine',
    title: 'Как правильно хранить вино в Liebherr',
    views: '3.1K',
    thumbnail: '/showrooms/belinskogo-15/wine_storage_01.jpg',
    telegramUrl: 'https://t.me/simona_bt',
  },
];

export function TelegramLiveSection() {
  const { openModal } = useStore();
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const videosRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (containerRef.current) {
        gsap.fromTo(
          containerRef.current,
          { y: 40, opacity: 0, scale: 0.98 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 85%',
            },
          }
        );
      }

      if (leftRef.current) {
        gsap.fromTo(
          leftRef.current,
          { x: -25, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.75,
            delay: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 85%',
            },
          }
        );
      }

      if (videosRef.current) {
        gsap.fromTo(
          videosRef.current.children,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.12,
            delay: 0.25,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 85%',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-20 sm:py-24 bg-[#111315] border-t border-[#2B313A] overflow-hidden">
      {/* Interactive Plexus Constellation Background */}
      <PlexusConstellationBackground nodeCount={32} opacity={0.85} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Box Container per Figma with Quiet Luxury Frosted Glass */}
        <div
          ref={containerRef}
          className="rounded-3xl bg-[#16191D]/90 backdrop-blur-xl border border-[#2B313A] p-8 sm:p-12 lg:p-14 shadow-2xl relative z-10"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Content (5 Cols) */}
            <div ref={leftRef} className="lg:col-span-5 space-y-5">
              <SectionBadge variant="teal">
                Live из салонов «СИМОНА»
              </SectionBadge>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-montserrat font-bold text-white tracking-tight leading-snug">
                Следите за обзорами новинок в Telegram
              </h2>

              <p className="text-sm text-[#87888A] leading-relaxed">
                Честные тест-драйвы техники, видео с закрытых кулинарных мастер-классов, анонсы поступлений эксклюзивных серий и секреты правильного ухода.
              </p>

              <div className="pt-2">
                <a
                  href="https://t.me/simona_bt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-simona-teal-dark to-simona-teal hover:to-simona-teal-light text-white text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-lg shadow-simona-teal/25 hover:shadow-simona-teal/40"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Перейти в Telegram-канал @simona_bt</span>
                </a>
              </div>
            </div>

            {/* Right: 3 Video Cards (7 Cols) */}
            <div ref={videosRef} className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {TELEGRAM_VIDEOS.map((vid) => (
                <div
                  key={vid.id}
                  onClick={() =>
                    openModal('VIDEO_PREVIEW', {
                      videoData: {
                        title: vid.title,
                        views: vid.views,
                        thumbnail: vid.thumbnail,
                        telegramUrl: vid.telegramUrl,
                      },
                    })
                  }
                  className="group cursor-pointer flex flex-col space-y-2.5"
                >
                  {/* Thumbnail Container */}
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-[#2B313A] group-hover:border-simona-teal transition-all duration-300 bg-black">
                    <img
                      src={vid.thumbnail}
                      alt={vid.title}
                      className="w-full h-full object-cover opacity-75 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-11 h-11 rounded-xl bg-black/60 group-hover:bg-simona-teal border border-white/20 text-white flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-md">
                        <Play className="w-4 h-4 ml-0.5 fill-white" />
                      </div>
                    </div>

                    {/* Views counter */}
                    <div className="absolute bottom-2.5 right-2.5 flex items-center space-x-1 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-[10px] text-white/90">
                      <Eye className="w-3 h-3 text-simona-teal" />
                      <span>{vid.views}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h4 className="text-xs font-montserrat font-medium text-[#D7D9DB] group-hover:text-white transition-colors leading-snug line-clamp-2">
                    {vid.title}
                  </h4>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

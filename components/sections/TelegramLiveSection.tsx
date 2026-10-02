'use client';

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStore } from '@/components/providers/StoreContext';
import { SectionBadge } from '@/components/ui/SectionBadge';
import { PlexusConstellationBackground } from '@/components/backgrounds/PlexusConstellationBackground';
import { useSiteContent } from '@/components/providers/ContentContext';
import { TelegramVideo } from '@/types';
import {
  SimonaIconTelegram,
  SimonaIconPlay,
  SimonaIconEye,
  SimonaIconChevronLeft,
  SimonaIconChevronRight,
  SimonaIconClock,
} from '@/components/brand/SimonaIcons';

interface TelegramLiveSectionProps {
  initialVideos?: TelegramVideo[];
}

export function TelegramLiveSection({ initialVideos = [] }: TelegramLiveSectionProps) {
  const { openModal } = useStore();
  const content = useSiteContent();
  const [videos, setVideos] = useState<TelegramVideo[]>(initialVideos);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const carouselContainerRef = useRef<HTMLDivElement>(null);

  // Fallback client-side fetch if initialVideos was empty
  useEffect(() => {
    if (videos.length === 0) {
      fetch('/api/telegram-videos')
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setVideos(data);
          }
        })
        .catch((err) => console.error('Error fetching Telegram videos:', err));
    }
  }, [videos.length]);

  // Handle responsive itemsPerView
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // GSAP Entrance Animation
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

      if (carouselContainerRef.current) {
        gsap.fromTo(
          carouselContainerRef.current,
          { x: 25, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.75,
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

  const maxIndex = Math.max(0, videos.length - itemsPerView);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  // Touch Swipe Handlers for mobile
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 45) {
      handleNext();
    } else if (diff < -45) {
      handlePrev();
    }
    setTouchStartX(null);
  };

  const channelUrl = content.telegram.channelUrl || 'https://t.me/simona_sale';

  return (
    <section
      ref={sectionRef}
      className="relative py-20 sm:py-24 bg-[#111315] border-t border-[#2B313A] overflow-hidden"
    >
      {/* Interactive Plexus Constellation Background */}
      <PlexusConstellationBackground nodeCount={32} opacity={0.85} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Box Container per Figma with Quiet Luxury Frosted Glass */}
        <div
          ref={containerRef}
          className="rounded-3xl bg-[#16191D]/90 backdrop-blur-xl border border-[#2B313A] p-6 sm:p-10 lg:p-12 shadow-2xl relative z-10"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Content (4 Cols on Desktop) */}
            <div ref={leftRef} className="lg:col-span-4 space-y-5">
              <div className="flex items-center space-x-2">
                <SectionBadge variant="teal">
                  {content.telegram.badge}
                </SectionBadge>
                {videos.length > 0 && (
                  <span className="px-2.5 py-0.5 rounded-md bg-[#111315] border border-[#2B313A] text-[11px] font-mono text-simona-teal">
                    {videos.length} видео
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl font-montserrat font-bold text-white tracking-tight leading-snug">
                {content.telegram.title}
              </h2>

              <p className="text-sm text-[#87888A] leading-relaxed">
                {content.telegram.subtitle}
              </p>

              <div className="pt-1 flex flex-col sm:flex-row lg:flex-col gap-4">
                <a
                  href={channelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-simona-teal-dark to-simona-teal hover:to-simona-teal-light text-white text-xs font-semibold tracking-wide transition-all duration-300 shadow-lg shadow-simona-teal/25 hover:shadow-simona-teal/40"
                >
                  <SimonaIconTelegram className="w-4 h-4" />
                  <span>{content.telegram.subscribeCta}</span>
                </a>

                {/* Stepped Navigation Controls */}
                <div className="flex items-center justify-between sm:justify-start space-x-3 pt-1">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handlePrev}
                      disabled={currentIndex === 0}
                      aria-label="Предыдущий ролик"
                      className="w-10 h-10 rounded-xl border border-[#2B313A] bg-[#111315] hover:border-simona-teal text-white flex items-center justify-center transition-all disabled:opacity-30 disabled:hover:border-[#2B313A] disabled:cursor-not-allowed cursor-pointer"
                    >
                      <SimonaIconChevronLeft className="w-4 h-4" />
                    </button>

                    <div className="px-3.5 py-2 rounded-xl bg-[#111315] border border-[#2B313A] text-xs font-mono text-[#87888A] select-none">
                      <span className="text-white font-semibold">
                        {String(currentIndex + 1).padStart(2, '0')}
                      </span>
                      <span className="mx-1.5 opacity-40">/</span>
                      <span>{String(maxIndex + 1).padStart(2, '0')}</span>
                    </div>

                    <button
                      onClick={handleNext}
                      disabled={currentIndex >= maxIndex}
                      aria-label="Следующий ролик"
                      className="w-10 h-10 rounded-xl border border-[#2B313A] bg-[#111315] hover:border-simona-teal text-white flex items-center justify-center transition-all disabled:opacity-30 disabled:hover:border-[#2B313A] disabled:cursor-not-allowed cursor-pointer"
                    >
                      <SimonaIconChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <span className="text-[11px] text-[#87888A] lg:hidden">
                    Свайп для листания →
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Interactive Stepped Carousel Track (8 Cols on Desktop) */}
            <div
              ref={carouselContainerRef}
              className="lg:col-span-8 overflow-hidden relative"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              <div
                className="flex transition-transform duration-500 ease-out will-change-transform"
                style={{
                  gap: '16px',
                  transform: `translateX(calc(-${currentIndex} * (100% + 16px) / ${itemsPerView}))`,
                }}
              >
                {videos.map((vid, idx) => {
                  const itemWidthStyle =
                    itemsPerView === 1
                      ? 'w-full min-w-full'
                      : itemsPerView === 2
                      ? 'w-[calc((100%-16px)/2)] min-w-[calc((100%-16px)/2)]'
                      : 'w-[calc((100%-32px)/3)] min-w-[calc((100%-32px)/3)]';

                  const formattedDate = vid.date
                    ? new Date(vid.date).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'short',
                      })
                    : null;

                  return (
                    <div
                      key={vid.id || idx}
                      onClick={() =>
                        openModal('VIDEO_PREVIEW', {
                          videoData: {
                            title: vid.title,
                            views: vid.views,
                            thumbnail: vid.thumbnail,
                            telegramUrl: vid.telegramUrl,
                            postId: vid.postId,
                            description: vid.description,
                            date: vid.date,
                            duration: vid.duration,
                            videoUrl: vid.videoSrc,
                          },
                        })
                      }
                      className={`${itemWidthStyle} flex-shrink-0 group cursor-pointer flex flex-col rounded-2xl overflow-hidden border border-[#2B313A] bg-[#111315]/80 hover:border-simona-teal transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-simona-teal/5`}
                    >
                      {/* Video Thumbnail Box */}
                      <div className="relative aspect-[4/3] w-full bg-black overflow-hidden">
                        <img
                          src={vid.thumbnail}
                          alt={vid.title}
                          loading="lazy"
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-95 group-hover:scale-105 transition-all duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-11 h-11 rounded-xl bg-black/60 group-hover:bg-simona-teal border border-white/20 text-white flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg">
                            <SimonaIconPlay className="w-4 h-4 ml-0.5 fill-white" />
                          </div>
                        </div>

                        {/* Duration Chip (Top Right) */}
                        {vid.duration && (
                          <div className="absolute top-2.5 right-2.5 flex items-center space-x-1 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-sm text-[10px] text-white/90 border border-white/10 font-medium">
                            <SimonaIconClock className="w-2.5 h-2.5 text-[#87888A]" />
                            <span>{vid.duration}</span>
                          </div>
                        )}

                        {/* Views Badge (Bottom Left) */}
                        <div className="absolute bottom-2.5 left-2.5 flex items-center space-x-1 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-sm text-[10px] text-white/90 border border-white/10">
                          <SimonaIconEye className="w-3 h-3 text-simona-teal" />
                          <span>{vid.views}</span>
                        </div>
                      </div>

                      {/* Title & Metadata Bottom Area */}
                      <div className="p-3.5 flex flex-col justify-between flex-1 space-y-2.5">
                        <h4 className="text-xs font-montserrat font-medium text-[#D7D9DB] group-hover:text-white transition-colors leading-snug line-clamp-2">
                          {vid.title}
                        </h4>

                        <div className="flex items-center justify-between text-[10px] text-[#87888A] pt-1 border-t border-[#2B313A]/50">
                          {formattedDate && <span>{formattedDate}</span>}
                          <span className="text-simona-teal font-medium group-hover:underline ml-auto">
                            Смотреть обзор →
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

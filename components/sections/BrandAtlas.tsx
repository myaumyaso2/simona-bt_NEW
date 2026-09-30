'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { SectionBadge } from '@/components/ui/SectionBadge';
import { PlexusConstellationBackground } from '@/components/backgrounds/PlexusConstellationBackground';
import { useSiteContent } from '@/components/providers/ContentContext';
import { BrandLogo } from '@/components/brand/BrandLogos';
import { BrandCardData } from '@/lib/catalog/brandStats';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface BrandAtlasProps {
  initialBrands?: BrandCardData[];
}

export function BrandAtlas({ initialBrands }: BrandAtlasProps) {
  const content = useSiteContent();
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [brands] = useState<BrandCardData[]>(() => initialBrands || []);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Mouse Drag state
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const dragDistanceRef = useRef(0);

  // Обновление прогресс-бара и состояния стрелок
  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) {
      setScrollProgress(100);
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }

    const currentScroll = el.scrollLeft;
    const progress = Math.min(100, Math.max(0, (currentScroll / maxScroll) * 100));
    setScrollProgress(progress);
    setCanScrollLeft(currentScroll > 10);
    setCanScrollRight(currentScroll < maxScroll - 10);
  }, []);

  useEffect(() => {
    updateScrollState();
    const el = trackRef.current;
    if (!el) return;

    const handleScroll = () => updateScrollState();
    el.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      el.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [updateScrollState]);

  // Плавный скролл кнопками
  const handleScrollBy = (offset: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: offset, behavior: 'smooth' });
  };

  // Drag-and-drop логика для мыши (Fluid Drag)
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = trackRef.current;
    if (!el) return;

    isDownRef.current = true;
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollLeft;
    dragDistanceRef.current = 0;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDownRef.current) return;
    const el = trackRef.current;
    if (!el) return;

    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startXRef.current) * 1.35; // чувствительность свайпа
    dragDistanceRef.current = Math.abs(walk);
    el.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUp = () => {
    isDownRef.current = false;
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Если пользователь тянул карточки дальше 6px, предотвращаем случайный переход по ссылке
    if (dragDistanceRef.current > 6) {
      e.preventDefault();
    }
  };

  // GSAP анимация плавного появления блока при скролле
  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { y: 25, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 85%',
            },
          }
        );
      }

      if (trackRef.current) {
        const cards = trackRef.current.querySelectorAll('.brand-kinetic-card');
        gsap.fromTo(
          cards,
          { y: 30, opacity: 0, scale: 0.96 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.03,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: trackRef.current,
              start: 'top 88%',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="brands"
      ref={sectionRef}
      className="relative py-16 sm:py-20 lg:py-24 bg-[#111315] border-t border-[#2B313A]/70 overflow-hidden select-none"
    >
      {/* Interactive Constellation Background */}
      <PlexusConstellationBackground nodeCount={36} maxDist={140} mouseRadius={200} />

      {/* Foreground Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header: Unified Left-Aligned Split-Header */}
        <div
          ref={titleRef}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-10"
        >
          <div className="max-w-2xl text-left">
            <SectionBadge variant="teal" className="mb-3.5">
              {content.brandAtlas?.badge || 'Официальный дилер европейских брендов'}
            </SectionBadge>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white tracking-tight font-montserrat">
              {content.brandAtlas?.title || 'Брендовый атлас СИМОНА'}
            </h2>
            <p className="text-xs sm:text-sm text-[#87888A] mt-2.5 max-w-xl leading-relaxed">
              {content.brandAtlas?.subtitle ||
                'Прямые поставки оригинальной техники ведущих мировых марок с официальной заводской гарантией и сертифицированным монтажом'}
            </p>
          </div>

          {/* Action Controls: Arrow Navigation & Catalog Link */}
          <div className="flex items-center gap-3 shrink-0 self-start md:self-end">
            <div className="inline-flex items-center gap-1.5 p-1 bg-[#16191D]/90 backdrop-blur-md border border-[#2B313A] rounded-xl shadow-inner">
              <button
                type="button"
                onClick={() => handleScrollBy(-420)}
                disabled={!canScrollLeft}
                aria-label="Прокрутить бренды влево"
                className="w-9 h-9 rounded-lg flex items-center justify-center text-[#87888A] hover:text-white hover:bg-[#1E2228] transition-all disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => handleScrollBy(420)}
                disabled={!canScrollRight}
                aria-label="Прокрутить бренды вправо"
                className="w-9 h-9 rounded-lg flex items-center justify-center text-[#87888A] hover:text-white hover:bg-[#1E2228] transition-all disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>

            <Link
              href="/catalog"
              className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#16191D]/90 backdrop-blur-md border border-[#2B313A] hover:border-simona-teal/60 text-xs sm:text-sm font-medium text-[#D7D9DB] hover:text-white transition-all shadow-sm"
            >
              <span>Смотреть все бренды</span>
              <svg
                className="w-3.5 h-3.5 text-simona-teal group-hover:translate-x-1 transition-transform"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Horizontal Kinetic Track */}
        <div
          ref={trackRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="flex gap-4 overflow-x-auto py-2 px-1 cursor-grab active:cursor-grabbing scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] touch-pan-x"
          style={{
            scrollSnapType: 'x proximity',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {brands.map((brand) => (
            <Link
              key={brand.slug}
              href={`/catalog?brand=${encodeURIComponent(brand.slug)}`}
              onClick={handleCardClick}
              className="brand-kinetic-card group relative flex-shrink-0 w-[270px] sm:w-[310px] p-6 rounded-xl bg-gradient-to-b from-[#1A1E24]/90 to-[#16191D]/95 backdrop-blur-md border border-[#2B313A] hover:border-simona-teal/70 hover:bg-[#1E2228] transition-all duration-300 flex flex-col items-center justify-between min-h-[160px] text-center shadow-lg shadow-black/30 hover:shadow-simona-teal/10 hover:-translate-y-1 overflow-hidden"
              style={{ scrollSnapAlign: 'start' }}
            >
              {/* Radial Glow Sheen on Hover */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,151,156,0.14)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Top Priority Ribbon for Main 9 Brands */}
              {brand.isPriority && (
                <div className="absolute top-2.5 right-3 text-[10px] font-semibold tracking-wider text-[#87888A] uppercase opacity-40 group-hover:opacity-75 group-hover:text-simona-teal transition-all">
                  Флагман
                </div>
              )}

              {/* Authentic Quiet Luxury Vector Brand Logo */}
              <div className="h-12 w-full flex items-center justify-center text-[#D7D9DB] group-hover:text-white transition-all duration-260 group-hover:scale-105 relative z-10">
                <BrandLogo name={brand.name} />
              </div>

              {/* Brand Metadata: Country, USP, and Real Inventory Badge */}
              <div className="w-full flex flex-col items-center gap-2 mt-4 relative z-10">
                <span className="text-[11px] font-medium text-[#87888A] group-hover:text-[#E2E8F0] transition-colors leading-tight">
                  {brand.country} • {brand.usp}
                </span>

                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-simona-teal/10 border border-simona-teal/20 text-simona-teal text-[11px] font-semibold group-hover:bg-simona-teal/20 group-hover:border-simona-teal/40 transition-all">
                  <span className="w-1.5 h-1.5 rounded-full bg-simona-teal animate-pulse" />
                  {brand.countLabel}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Dynamic Kinetic Progress Bar */}
        <div className="mt-8 max-w-md mx-auto h-1 bg-[#1E2228] rounded-full overflow-hidden border border-[#2B313A]/50">
          <div
            className="h-full bg-gradient-to-r from-simona-teal to-[#00B5BA] rounded-full transition-all duration-150"
            style={{
              width: `${Math.max(15, Math.min(100, scrollProgress + 15))}%`,
              transform: `translateX(${scrollProgress * 0.85}%)`,
            }}
          />
        </div>
      </div>
    </section>
  );
}

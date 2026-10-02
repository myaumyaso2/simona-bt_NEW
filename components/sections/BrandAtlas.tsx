'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import Link from 'next/link';
import { SectionBadge } from '@/components/ui/SectionBadge';
import { PlexusConstellationBackground } from '@/components/backgrounds/PlexusConstellationBackground';
import { useSiteContent } from '@/components/providers/ContentContext';
import { BrandCardData } from '@/lib/catalog/brandStats';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface BrandAtlasProps {
  initialBrands?: BrandCardData[];
}

function BrandCardItem({ brand }: { brand: BrandCardData }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(cardRef.current, {
      rotateY: x * 0.04,
      rotateX: -y * 0.04,
      transformPerspective: 900,
      duration: 0.25,
      ease: 'power2.out',
    });

    if (sheenRef.current) {
      gsap.to(sheenRef.current, {
        opacity: 0.22,
        x: e.clientX - rect.left - 80,
        y: e.clientY - rect.top - 80,
        duration: 0.2,
      });
    }
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.6,
      ease: 'power3.out',
    });

    if (sheenRef.current) {
      gsap.to(sheenRef.current, {
        opacity: 0,
        duration: 0.4,
      });
    }
  };

  return (
    <Link
      ref={cardRef}
      href={`/catalog?brand=${encodeURIComponent(brand.slug)}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="brand-card group relative overflow-hidden flex flex-col items-center justify-center p-4 sm:p-5 rounded-xl bg-gradient-to-b from-[#1A1E24]/90 to-[#16191D]/95 backdrop-blur-md border border-[#2B313A] hover:border-simona-teal/70 hover:bg-[#1E2228] transition-all duration-300 min-h-[124px] text-center will-change-transform shadow-lg shadow-black/40 hover:shadow-simona-teal/10 hover:-translate-y-1"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Dynamic Cursor Sheen */}
      <div
        ref={sheenRef}
        className="pointer-events-none absolute w-44 h-44 rounded-full bg-[radial-gradient(circle,rgba(0,181,186,0.32)_0%,transparent_70%)] opacity-0 -translate-x-1/2 -translate-y-1/2"
      />

      {/* Brand Text Name (Uppercase Architectural Typography - Quiet Luxury Exception) */}
      <span className="font-montserrat text-lg sm:text-xl font-bold uppercase tracking-wider text-white group-hover:text-simona-teal transition-colors relative z-10 leading-snug">
        {brand.name}
      </span>

      {/* Country & USP Specialty */}
      <span className="text-[11px] text-[#87888A] mt-1 font-medium group-hover:text-[#D7D9DB] transition-colors relative z-10 text-center leading-tight line-clamp-1">
        {brand.country} • {brand.usp}
      </span>

      {/* Real Inventory Model Count Badge */}
      <span className="inline-flex items-center gap-1.5 mt-2.5 px-2.5 py-0.5 rounded-md bg-simona-teal/10 border border-simona-teal/20 text-simona-teal text-[11px] font-semibold group-hover:bg-simona-teal/20 group-hover:border-simona-teal/40 transition-all relative z-10">
        <span className="w-1.5 h-1.5 rounded-full bg-simona-teal animate-pulse" />
        {brand.countLabel}
      </span>
    </Link>
  );
}

export function BrandAtlas({ initialBrands = [] }: BrandAtlasProps) {
  const content = useSiteContent();
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const [currentPage, setCurrentPage] = useState(0);

  // Разбиваем бренды на страницы по 10 карточек (2 ряда по 5 колонок)
  const pageSize = 10;
  const pages = useMemo(() => {
    const list: BrandCardData[][] = [];
    for (let i = 0; i < initialBrands.length; i += pageSize) {
      list.push(initialBrands.slice(i, i + pageSize));
    }
    return list.length > 0 ? list : [[]];
  }, [initialBrands]);

  const totalPages = pages.length;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Touch Swipe для мобильных устройств
  const touchStartXRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;

    if (diff > 50 && currentPage < totalPages - 1) {
      setCurrentPage((p) => p + 1);
    } else if (diff < -50 && currentPage > 0) {
      setCurrentPage((p) => p - 1);
    }
    touchStartXRef.current = null;
  };

  // GSAP анимация появления секции при скролле
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

      if (sliderRef.current) {
        const cards = sliderRef.current.querySelectorAll('.brand-card');
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
              trigger: sliderRef.current,
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

          {/* Action Controls: Page Counter + Arrow Controls + Link to Catalog */}
          <div className="flex items-center gap-3 shrink-0 self-start md:self-end">
            <div className="inline-flex items-center gap-2 p-1.5 bg-[#16191D]/90 backdrop-blur-md border border-[#2B313A] rounded-xl shadow-inner">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                aria-label="Предыдущая страница брендов"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#87888A] hover:text-white hover:bg-[#1E2228] transition-all disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer"
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

              <div className="text-xs font-bold text-[#87888A] px-2 font-mono tabular-nums select-none">
                <span className="text-simona-teal">
                  {String(currentPage + 1).padStart(2, '0')}
                </span>{' '}
                /{' '}
                <span>{String(totalPages).padStart(2, '0')}</span>
              </div>

              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                aria-label="Следующая страница брендов"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#87888A] hover:text-white hover:bg-[#1E2228] transition-all disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer"
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
              <span>В каталог</span>
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

        {/* 2x5 Grid Slider Container */}
        <div
          ref={sliderRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative overflow-hidden w-full"
        >
          <div
            className="flex transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] w-full"
            style={{
              transform: `translateX(-${currentPage * 100}%)`,
            }}
          >
            {pages.map((pageBrands, pageIdx) => (
              <div
                key={pageIdx}
                className="w-full shrink-0 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4"
              >
                {pageBrands.map((brand) => (
                  <BrandCardItem key={brand.slug} brand={brand} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

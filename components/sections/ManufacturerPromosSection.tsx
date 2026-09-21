'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { SimonaIconClock } from '@/components/brand/SimonaIcons';
import { MANUFACTURER_PROMOS, getFeaturedPromos } from '@/data/promosData';
import { ManufacturerPromo } from '@/types';

export function ManufacturerPromosSection() {
  const promos = getFeaturedPromos();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const touchStartX = useRef<number | null>(null);

  // Responsive calculation of items per view
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

  const maxIndex = Math.max(0, promos.length - itemsPerView);

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  // Touch Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const currentX = e.touches[0].clientX;
    const diff = touchStartX.current - currentX;

    if (diff > 50) {
      nextSlide();
      touchStartX.current = null;
    } else if (diff < -50) {
      prevSlide();
      touchStartX.current = null;
    }
  };

  const handleTouchEnd = () => {
    touchStartX.current = null;
  };

  const progressPercentage =
    maxIndex > 0 ? ((currentIndex) / maxIndex) * 100 : 100;

  return (
    <section
      id="promos"
      className="relative py-16 sm:py-24 bg-[#111315] border-b border-[#2B313A] overflow-hidden"
    >
      {/* Background subtle radial gradient */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-simona-wine/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
          <div>
            {/* Wine Accent Badge */}
            <div className="inline-flex items-center px-3 py-1 rounded-md bg-simona-wine/25 border border-simona-wine/50 text-white text-xs font-semibold uppercase tracking-wider mb-3.5 backdrop-blur-md">
              <span>Спецпредложения и выгода</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white tracking-tight">
              Акции европейских производителей
            </h2>
            <p className="text-sm sm:text-base text-[#87888A] max-w-2xl mt-2 font-normal">
              Официальные программы выгоды и подарков от авторизованных брендов для комплектования кухни вашей мечты.
            </p>
          </div>

          {/* Controls & Hub Link */}
          <div className="flex items-center space-x-4 shrink-0">
            <Link
              href="/promos"
              className="group inline-flex items-center space-x-1.5 text-xs sm:text-sm font-medium text-[#D7D9DB] hover:text-white transition-colors"
            >
              <span>Все акции производителей</span>
              <ArrowRight className="w-4 h-4 text-simona-wine-light group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Slider Navigation Arrows */}
            <div className="flex items-center space-x-2">
              <button
                onClick={prevSlide}
                disabled={currentIndex === 0}
                aria-label="Предыдущие акции"
                className="w-10 h-10 rounded-full border border-[#2B313A] bg-[#16191D] text-[#87888A] hover:text-white hover:border-simona-wine/60 hover:bg-[#1E2228] transition-all flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextSlide}
                disabled={currentIndex >= maxIndex}
                aria-label="Следующие акции"
                className="w-10 h-10 rounded-full border border-[#2B313A] bg-[#16191D] text-[#87888A] hover:text-white hover:border-simona-wine/60 hover:bg-[#1E2228] transition-all flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Viewport */}
        <div
          className="overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex transition-transform duration-500 ease-out gap-6"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView + (itemsPerView === 1 ? 0 : 24 / itemsPerView))}%)`,
            }}
          >
            {promos.map((promo) => (
              <div
                key={promo.id}
                className="shrink-0"
                style={{
                  width: `calc(${100 / itemsPerView}% - ${(24 * (itemsPerView - 1)) / itemsPerView}px)`,
                }}
              >
                <PromoCard promo={promo} />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Indicators & Progress Line */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-[#87888A]">
              Показано {Math.min(currentIndex + itemsPerView, promos.length)} из {promos.length} спецпредложений
            </span>
          </div>

          <div className="w-full sm:w-64 h-1 bg-[#1E2228] rounded-full overflow-hidden">
            <div
              className="h-full bg-simona-wine transition-all duration-300 rounded-full"
              style={{ width: `${Math.max(15, progressPercentage)}%` }}
            />
          </div>
        </div>

      </div>
    </section>
  );
}

function PromoCard({ promo }: { promo: ManufacturerPromo }) {
  return (
    <Link
      href={`/promos/${promo.slug}`}
      className="group flex flex-col justify-between h-full min-h-[460px] rounded-2xl bg-[#16191D] border border-[#2B313A] hover:border-simona-wine/60 transition-all duration-500 overflow-hidden"
    >
      {/* Visual Top Media */}
      <div className="relative h-56 w-full overflow-hidden bg-[#111315]">
        <Image
          src={promo.bannerUrl}
          alt={promo.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        {/* Cinematic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#16191D] via-[#16191D]/40 to-transparent" />

        {/* Header Tags over Image */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
          {/* Brand Tag */}
          <span className="px-2.5 py-1 rounded-md bg-[#111315]/85 backdrop-blur-md border border-[#2B313A] text-xs font-semibold text-white uppercase tracking-wider shadow-sm">
            {promo.brand}
          </span>

          {/* Official Wine Promo Badge */}
          <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-simona-wine/25 text-white text-xs font-semibold shadow-sm border border-simona-wine/50 backdrop-blur-md">
            <span>{promo.badgeText}</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-1 justify-between">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#87888A] font-medium">
            {promo.subtitle}
          </span>

          <h3 className="text-lg font-semibold text-white group-hover:text-white mt-1.5 leading-snug line-clamp-2">
            {promo.title}
          </h3>

          <p className="text-xs sm:text-sm text-[#87888A] mt-2.5 leading-relaxed line-clamp-2">
            {promo.shortDescription}
          </p>
        </div>

        {/* Footer info: Deadline and Arrow CTA */}
        <div className="pt-5 mt-5 border-t border-[#2B313A]/60 flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-xs text-[#87888A]">
            <SimonaIconClock className="w-3.5 h-3.5 text-simona-wine-light" />
            <span>до {promo.endDate}</span>
          </div>

          <div className="inline-flex items-center space-x-1 text-xs font-semibold text-simona-wine-light group-hover:text-white transition-colors">
            <span>Подробнее</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}

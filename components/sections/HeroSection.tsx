'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStore } from '@/components/providers/StoreContext';
import { SimonaPatternOverlay } from '@/components/brand/SimonaPattern';
import { SimonaIconConsultation, SimonaIconMark } from '@/components/brand/SimonaIcons';
import { SectionBadge } from '@/components/ui/SectionBadge';
import { HeroBackgroundSlider } from './HeroBackgroundSlider';

const HERO_DESKTOP_SLIDES = [
  '/hero/slides/desktop_1.webp',
  '/hero/slides/desktop_2.webp',
  '/hero/slides/desktop_3.webp',
  '/hero/slides/desktop_4.webp',
  '/hero/slides/desktop_5.webp',
];

const HERO_MOBILE_SLIDES = [
  '/hero/slides/mobile_1.webp',
  '/hero/slides/mobile_2.webp',
  '/hero/slides/mobile_3.webp',
  '/hero/slides/mobile_4.webp',
  '/hero/slides/mobile_5.webp',
];

export function HeroSection() {
  const { openModal } = useStore();
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const contentParallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Initial Entrance Cascade
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      tl.fromTo(
        badgeRef.current,
        { y: -18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, delay: 0.15 }
      )
        .fromTo(
          headingRef.current,
          { y: 35, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          '-=0.35'
        )
        .fromTo(
          subtitleRef.current,
          { y: 22, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7 },
          '-=0.45'
        )
        .fromTo(
          buttonsRef.current,
          { y: 20, opacity: 0, scale: 0.96 },
          { y: 0, opacity: 1, scale: 1, duration: 0.65, ease: 'back.out(1.3)' },
          '-=0.4'
        );

      if (featuresRef.current) {
        const featureItems = featuresRef.current.children;
        tl.fromTo(
          featureItems,
          { y: 28, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.65, stagger: 0.14 },
          '-=0.3'
        );
      }

      // 2. Parallax on Scroll Down (Content container floats up and dims, Background scrolls slower)
      if (sectionRef.current && contentParallaxRef.current) {
        gsap.to(contentParallaxRef.current, {
          yPercent: -15,
          opacity: 0.35,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });

        if (bgRef.current) {
          gsap.to(bgRef.current, {
            yPercent: 12,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          });
        }
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[85vh] lg:min-h-[90vh] flex flex-col justify-between overflow-hidden bg-[#111315] pt-12 pb-10 lg:pt-16 lg:pb-12"
    >
      {/* Background Image & Luxury Dark Overlays */}
      <div ref={bgRef} className="absolute inset-0 z-0 pointer-events-none">
        <HeroBackgroundSlider
          desktopImages={HERO_DESKTOP_SLIDES}
          mobileImages={HERO_MOBILE_SLIDES}
          slideDuration={7.5}
          fadeDuration={1.8}
        />
        {/* Adaptive Vignette: Soft full overlay on mobile, focused left-only gradient on desktop */}
        <div className="lg:hidden absolute inset-0 bg-gradient-to-b from-[#111315]/80 via-[#111315]/50 to-[#111315]/90" />
        <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-[#111315] via-[#111315]/80 via-[48%] to-transparent" />
        <div className="hidden lg:block absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_20%_40%,rgba(17,19,21,0.85)_0%,transparent_100%)]" />
        {/* Sleek edge fading for seamless section transitions */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#111315] to-transparent opacity-60 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#111315] to-transparent pointer-events-none" />
        <SimonaPatternOverlay variant="subtle" opacity={0.015} />
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto">
        <div ref={contentParallaxRef} className="max-w-3xl">
          {/* Partner Badge */}
          <SectionBadge
            ref={badgeRef}
            variant="teal"
            className="mb-6 sm:mb-8"
          >
            Официальный партнер Miele · ASKO · Liebherr · SMEG · OMOIKIRI
          </SectionBadge>

          {/* Heading H1 */}
          <h1
            ref={headingRef}
            className="text-3xl sm:text-5xl lg:text-6xl font-montserrat font-bold text-white tracking-tight leading-[1.15] mb-6 [text-shadow:_0_2px_12px_rgba(0,0,0,0.95),_0_4px_32px_rgba(0,0,0,0.9)]"
          >
            Премиальная бытовая техника для вашей идеальной кухни
          </h1>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="text-sm sm:text-base lg:text-lg text-[#D7D9DB] font-normal leading-relaxed max-w-2xl mb-8 sm:mb-10 [text-shadow:_0_2px_8px_rgba(0,0,0,0.95)]"
          >
            Флагманские шоурумы в центре Нижнего Новгорода. Персональный подбор под дизайн-проект, выверка встроечных схем и сертифицированный шеф-монтаж.
          </p>

          {/* Action CTA Buttons */}
          <div
            ref={buttonsRef}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4"
          >
            <button
              onClick={() => openModal('EQUIPMENT_SELECTION')}
              className="inline-flex items-center justify-center px-7 py-4 rounded-xl bg-gradient-to-r from-simona-teal-dark to-simona-teal hover:to-simona-teal-light text-white text-sm font-semibold tracking-wide transition-all duration-300 shadow-lg shadow-simona-teal/30 hover:shadow-simona-teal/50 hover:scale-[1.02] active:scale-98 space-x-2.5 text-center cursor-pointer"
            >
              <SimonaIconConsultation className="w-5 h-5 text-white flex-shrink-0" />
              <span>Получить консультацию</span>
            </button>

            <Link
              href="/catalog"
              className="inline-flex items-center justify-center px-7 py-4 rounded-xl bg-[#16191D] hover:bg-[#1E2228] border border-[#2B313A] hover:border-simona-teal/50 text-white text-sm font-medium tracking-wide transition-all duration-300 space-x-2.5 text-center group"
            >
              <SimonaIconMark className="w-5 h-5 text-simona-teal flex-shrink-0 group-hover:scale-110 transition-transform" />
              <span>Перейти в каталог</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 3 Key Advantages at Bottom */}
      <div
        ref={featuresRef}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-12 pt-8 border-t border-[#2B313A]/60"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          
          <div className="flex flex-col space-y-1.5">
            <span className="text-xl lg:text-2xl font-montserrat font-semibold text-white tracking-tight [text-shadow:_0_1px_8px_rgba(0,0,0,0.8)]">
              Эксперты встройки
            </span>
            <span className="text-xs sm:text-sm text-[#D7D9DB]/85 leading-relaxed font-normal [text-shadow:_0_1px_4px_rgba(0,0,0,0.8)]">
              Премиальная встраиваемая бытовая техника, персональный подбор комплектов и выверка монтажных схем.
            </span>
          </div>

          <div className="flex flex-col space-y-1.5">
            <span className="text-xl lg:text-2xl font-montserrat font-semibold text-white tracking-tight [text-shadow:_0_1px_8px_rgba(0,0,0,0.8)]">
              Активная кухня
            </span>
            <span className="text-xs sm:text-sm text-[#D7D9DB]/85 leading-relaxed font-normal [text-shadow:_0_1px_4px_rgba(0,0,0,0.8)]">
              Демонстрируем работу премиальной бытовой техники, устраиваем дегустации, рассказываем о новинках.
            </span>
          </div>

          <div className="flex flex-col space-y-1.5">
            <span className="text-xl lg:text-2xl font-montserrat font-semibold text-white tracking-tight [text-shadow:_0_1px_8px_rgba(0,0,0,0.8)]">
              Дизайнерам и B2B
            </span>
            <span className="text-xs sm:text-sm text-[#D7D9DB]/85 leading-relaxed font-normal [text-shadow:_0_1px_4px_rgba(0,0,0,0.8)]">
              Интересные условия сотрудничества с дизайнерами интерьера и оптовыми клиентами.
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}

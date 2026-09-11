'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Clock, ShieldCheck, Check, Calendar } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStore } from '@/components/providers/StoreContext';

const SHOWROOMS_DATA = {
  'belinskogo-15': {
    name: 'Флагманский салон премиум-техники',
    tabLabel: 'Флагман — Белинского, 15',
    address: 'г. Нижний Новгород, ул. Белинского, 15 (напротив парка Пушкина)',
    hours: 'Пн–Сб: 10:00–20:00 | Вс: 10:00–18:00',
    parking: 'Собственная охраняемая парковка для клиентов',
    badge: '🔥 Постоянная зона демонстрации подключенной техники ASKO и Miele (пар, индукция, кофе)',
    photos: [
      '/showrooms/belinskogo-15/salon_01.jpg',
      '/showrooms/belinskogo-15/active_kitchen_01.jpg',
      '/showrooms/belinskogo-15/wine_storage_01.jpg',
      '/showrooms/belinskogo-15/smeg_zone_01.jpg',
      '/showrooms/belinskogo-15/miele_zone_01.jpg',
    ],
    features: [
      'Монобрендовые бренд-зоны Miele, ASKO, Liebherr, SMEG, VARD',
      'Действующая «Активная кухня»: реальное тестирование пара и индукции',
      'Переговорная зона и инженерный подбор по чертежам для дизайнеров',
    ],
    buttonText: 'Забронировать визит с демонстрацией',
  },
  'belinskogo-11': {
    name: 'Фирменный салон OMOIKIRI & KÖRTING',
    tabLabel: 'Omoikiri & Körting — 11/66',
    address: 'г. Нижний Новгород, ул. Белинского, 11/66 (пересечение с ул. Ашхабадской)',
    hours: 'Ежедневно с 10:00 до 20:00',
    parking: 'Удобный паркинг перед входом в салон',
    badge: '📍 Экспозиция японских моек, смесителей под фильтр и встройки Körting',
    photos: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
      '/showrooms/belinskogo-15/details_01.jpg',
      '/showrooms/belinskogo-15/details_02.jpg',
      '/showrooms/belinskogo-15/salon_02.jpg',
      '/showrooms/belinskogo-15/coffee_corner_01.jpg',
    ],
    features: [
      'Полная коллекция моек из японского гранита Tetogranit и Artgranit',
      'Смесители 2-в-1 с подключением фильтра питьевой воды и измельчители',
      'Встраиваемая дизайнерская техника Körting с официальной гарантией',
    ],
    buttonText: 'Забронировать визит в салон OMOIKIRI',
  },
};

export function ShowroomsFigmaSection() {
  const [activeTab, setActiveTab] = useState<'belinskogo-15' | 'belinskogo-11'>('belinskogo-15');
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const { openModal } = useStore();

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const mainImgRef = useRef<HTMLImageElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  const current = SHOWROOMS_DATA[activeTab];

  // Initial ScrollTrigger entrance
  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 85%',
            },
          }
        );
      }

      if (galleryRef.current && cardRef.current) {
        gsap.fromTo(
          galleryRef.current,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: galleryRef.current,
              start: 'top 85%',
            },
          }
        );

        gsap.fromTo(
          cardRef.current,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: cardRef.current,
              start: 'top 85%',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Morph transition on tab switch or photo change
  const handleTabChange = (tab: 'belinskogo-15' | 'belinskogo-11') => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setActivePhotoIdx(0);

    if (mainImgRef.current) {
      gsap.fromTo(
        mainImgRef.current,
        { opacity: 0.35, scale: 1.04 },
        { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' }
      );
    }

    if (featuresRef.current) {
      gsap.fromTo(
        featuresRef.current.children,
        { x: -14, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.45, stagger: 0.08, ease: 'power2.out' }
      );
    }
  };

  const handlePhotoChange = (idx: number) => {
    if (idx === activePhotoIdx) return;
    setActivePhotoIdx(idx);

    if (mainImgRef.current) {
      gsap.fromTo(
        mainImgRef.current,
        { opacity: 0.4, scale: 1.03 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }
      );
    }
  };

  return (
    <section
      id="showrooms"
      ref={sectionRef}
      className="py-20 sm:py-24 bg-[#16191D] border-t border-[#2B313A]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header per Figma node 1:73 */}
        <div ref={headerRef} className="max-w-3xl mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-simona-teal mb-3">
            Физические пространства «СИМОНА» в Нижнем Новгороде
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-montserrat font-semibold text-white tracking-tight leading-tight">
            Два экспертных пространства на улице Белинского
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#87888A] leading-relaxed">
            Оцените материалы, эргономику и технологии приборов вживую перед покупкой
          </p>
        </div>

        {/* 2-Column Showcase Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Gallery (7 Cols) */}
          <div ref={galleryRef} className="lg:col-span-7 flex flex-col space-y-4">
            {/* Main Stage Image */}
            <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-[#2B313A] shadow-2xl bg-[#111315]">
              <img
                ref={mainImgRef}
                src={current.photos[activePhotoIdx]}
                alt={current.name}
                className="w-full h-full object-cover will-change-transform"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

              {/* Badge over Main Image */}
              <div className="absolute bottom-4 left-4 right-4 sm:left-5 sm:right-5">
                <div className="inline-flex items-center px-4 py-2 rounded-xl bg-[#111315]/90 backdrop-blur-md border border-white/10 text-xs text-white shadow-lg">
                  <span>{current.badge}</span>
                </div>
              </div>
            </div>

            {/* 4 Thumbnails */}
            <div className="grid grid-cols-4 gap-3">
              {current.photos.slice(1, 5).map((thumb, idx) => {
                const actualIdx = idx + 1;
                const isSelected = activePhotoIdx === actualIdx;
                return (
                  <button
                    key={actualIdx}
                    onClick={() => handlePhotoChange(actualIdx)}
                    className={`relative aspect-[16/10] rounded-xl overflow-hidden border transition-all ${
                      isSelected
                        ? 'border-simona-teal ring-2 ring-simona-teal/30 scale-[1.02]'
                        : 'border-[#2B313A] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={thumb} alt="" className="w-full h-full object-cover" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Tab & Detail Card (5 Cols) */}
          <div ref={cardRef} className="lg:col-span-5 flex flex-col space-y-4">
            {/* Tab Switcher */}
            <div className="flex rounded-xl bg-[#111315] p-1 border border-[#2B313A]">
              <button
                onClick={() => handleTabChange('belinskogo-15')}
                className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-semibold tracking-wide transition-all text-center ${
                  activeTab === 'belinskogo-15'
                    ? 'bg-[#1E2228] text-white shadow-sm border border-[#2B313A]'
                    : 'text-[#87888A] hover:text-white'
                }`}
              >
                Флагман — Белинского, 15
              </button>
              <button
                onClick={() => handleTabChange('belinskogo-11')}
                className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-semibold tracking-wide transition-all text-center ${
                  activeTab === 'belinskogo-11'
                    ? 'bg-[#1E2228] text-white shadow-sm border border-[#2B313A]'
                    : 'text-[#87888A] hover:text-white'
                }`}
              >
                Omoikiri & Körting — 11/66
              </button>
            </div>

            {/* Info Container */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#1E2228] border border-[#2B313A] flex flex-col justify-between space-y-6 shadow-xl">
              <div className="space-y-4">
                <h3 className="text-xl font-montserrat font-bold text-white">
                  {current.name}
                </h3>

                {/* Meta details */}
                <div className="space-y-2.5 text-xs text-[#D7D9DB]">
                  <div className="flex items-start space-x-2.5">
                    <MapPin className="w-4 h-4 text-simona-teal shrink-0 mt-0.5" />
                    <span>{current.address}</span>
                  </div>
                  <div className="flex items-center space-x-2.5">
                    <Clock className="w-4 h-4 text-[#87888A] shrink-0" />
                    <span>{current.hours}</span>
                  </div>
                  <div className="flex items-center space-x-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#87888A] shrink-0" />
                    <span>{current.parking}</span>
                  </div>
                </div>

                {/* Features Checkpoints */}
                <div ref={featuresRef} className="pt-4 border-t border-[#2B313A] space-y-3">
                  {current.features.map((feat, i) => (
                    <div key={i} className="flex items-start space-x-2.5 text-xs text-[#87888A]">
                      <div className="w-4 h-4 rounded-full bg-simona-teal/15 text-simona-teal flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => openModal('SHOWROOM_VISIT', { preferredShowroom: current.tabLabel })}
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-simona-teal-dark via-simona-teal to-simona-teal-light hover:brightness-110 text-white font-semibold text-xs uppercase tracking-wider transition-all duration-300 shadow-lg shadow-simona-teal/25 flex items-center justify-center space-x-2 active:scale-98"
              >
                <Calendar className="w-4 h-4" />
                <span>{current.buttonText}</span>
              </button>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

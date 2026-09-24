'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionBadge } from '@/components/ui/SectionBadge';
import {
  SimonaIconPin,
  SimonaIconClock,
  SimonaIconPhoneSolid,
} from '@/components/brand/SimonaIcons';

interface ShowroomPhoto {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  photo: string;
}

interface ShowroomData {
  id: 'belinskogo-15' | 'belinskogo-11';
  tabLabel: string;
  name: string;
  address: string;
  mapUrl: string;
  hours: string;
  parking: string;
  phone: string;
  phoneRaw: string;
  photos: ShowroomPhoto[];
}

const SHOWROOMS: Record<'belinskogo-15' | 'belinskogo-11', ShowroomData> = {
  'belinskogo-15': {
    id: 'belinskogo-15',
    tabLabel: 'Флагман — Белинского, 15',
    name: 'Флагманский салон «СИМОНА»',
    address: 'г. Нижний Новгород, ул. Белинского, 15',
    mapUrl: 'https://yandex.ru/maps/-/CTh94C5D',
    hours: 'Ежедневно с 10:00 до 20:00',
    parking: 'Выделенный паркинг для клиентов салона',
    phone: '+7 (831) 423-76-00',
    phoneRaw: '+78314237600',
    photos: [
      {
        id: 'flagman-1',
        number: '01',
        title: 'Остров «Активной кухни»',
        subtitle: 'Действующая демонстрационная зона приготовления',
        photo: '/showrooms/belinskogo-15/active_kitchen_01.jpg',
      },
      {
        id: 'flagman-2',
        number: '02',
        title: 'Галерея встройки ASKO',
        subtitle: 'Духовые шкафы, пароварки и подогреватели посуды',
        photo: '/showrooms/belinskogo-15/asko_zone_01.jpg',
      },
      {
        id: 'flagman-3',
        number: '03',
        title: 'Винная зона Сомелье',
        subtitle: 'Климатические шкафы Liebherr с янтарной подсветкой',
        photo: '/showrooms/belinskogo-15/wine_storage_01.jpg',
      },
      {
        id: 'flagman-4',
        number: '04',
        title: 'Ретро-коллекции SMEG',
        subtitle: 'Культовый итальянский дизайн 50-х годов',
        photo: '/showrooms/belinskogo-15/smeg_zone_01.jpg',
      },
      {
        id: 'flagman-5',
        number: '05',
        title: 'Зона премиум-встройки Miele',
        subtitle: 'Передовые технологии ухода за посудой и бельем',
        photo: '/showrooms/belinskogo-15/miele_zone_01.jpg',
      },
      {
        id: 'flagman-6',
        number: '06',
        title: 'Тест-драйв пара и индукции',
        subtitle: 'Практическая кулинария перед выбором комплекта',
        photo: '/showrooms/belinskogo-15/active_kitchen_02.jpg',
      },
      {
        id: 'flagman-7',
        number: '07',
        title: 'Лаундж и переговорная',
        subtitle: 'Пространство для дизайнеров интерьера и архитекторов',
        photo: '/showrooms/belinskogo-15/lounge_01.jpg',
      },
      {
        id: 'flagman-8',
        number: '08',
        title: 'Панорама флагманского салона',
        subtitle: 'Экспозиция премиальной бытовой техники на Белинского',
        photo: '/showrooms/belinskogo-15/salon_01.jpg',
      },
    ],
  },
  'belinskogo-11': {
    id: 'belinskogo-11',
    tabLabel: 'Omoikiri & Körting — 11/66',
    name: 'Фирменный салон OMOIKIRI & KÖRTING',
    address: 'г. Нижний Новгород, ул. Белинского, 11/66 (пересечение с ул. Ашхабадской)',
    mapUrl: 'https://yandex.ru/maps/-/CTh94C5D',
    hours: 'Ежедневно с 10:00 до 20:00',
    parking: 'Удобный паркинг перед входом в салон',
    phone: '+7 (831) 423-76-00',
    phoneRaw: '+78314237600',
    photos: [
      {
        id: 'omoikiri-1',
        number: '01',
        title: 'Японский гранит Tetogranit',
        subtitle: 'Экспозиция моек Omoikiri во всех фирменных цветах',
        photo:
          'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1400&q=80',
      },
      {
        id: 'omoikiri-2',
        number: '02',
        title: 'Смесители 2-в-1 под фильтр',
        subtitle: 'Питьевая вода, гибкие изливы и встроенные дозаторы',
        photo: '/showrooms/belinskogo-15/details_01.jpg',
      },
      {
        id: 'omoikiri-3',
        number: '03',
        title: 'Встраиваемая техника Körting',
        subtitle: 'Дизайнерские духовые шкафы и индукционные поверхности',
        photo: '/showrooms/belinskogo-15/salon_02.jpg',
      },
      {
        id: 'omoikiri-4',
        number: '04',
        title: 'Мойки из стали и измельчители',
        subtitle: 'Нержавеющая сталь AISI 304 и бесщеточные измельчители NAGARE',
        photo: '/showrooms/belinskogo-15/details_02.jpg',
      },
      {
        id: 'omoikiri-5',
        number: '05',
        title: 'Кухонные аксессуары премиум',
        subtitle: 'Магнитные доски, коландеры и ролл-маты для мойки',
        photo: '/showrooms/belinskogo-15/details_03.jpg',
      },
      {
        id: 'omoikiri-6',
        number: '06',
        title: 'Кофе-лаундж консультаций',
        subtitle: 'Индивидуальный подбор сантехники и встройки для кухни',
        photo: '/showrooms/belinskogo-15/coffee_corner_01.jpg',
      },
    ],
  },
};

export function ShowroomsFigmaSection() {
  const [activeTab, setActiveTab] = useState<'belinskogo-15' | 'belinskogo-11'>('belinskogo-15');
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const passportRef = useRef<HTMLDivElement>(null);

  const currentShowroom = SHOWROOMS[activeTab];
  const photos = currentShowroom.photos;

  // Tripled list for infinite seamless loop
  const loopPhotos = [...photos, ...photos, ...photos];

  // Motion & Drag State
  const posRef = useRef(0);
  const targetSpeedRef = useRef(0.55); // base slow drift speed (pixels / frame)
  const currentSpeedRef = useRef(0.55);
  const isHoveredRef = useRef(false);
  const isDraggingRef = useRef(false);
  const isDragPanRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartPosRef = useRef(0);
  const animFrameIdRef = useRef<number | null>(null);
  const dragResetTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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

      if (passportRef.current) {
        gsap.fromTo(
          passportRef.current,
          { y: 25, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            delay: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: passportRef.current,
              start: 'top 92%',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Continuous loop runner
  useEffect(() => {
    let lastTime = performance.now();

    const tick = (now: number) => {
      const delta = Math.min((now - lastTime) / 16.666, 2.5);
      lastTime = now;

      if (!isDraggingRef.current && trackRef.current) {
        const target = isHoveredRef.current ? 0 : targetSpeedRef.current;
        currentSpeedRef.current += (target - currentSpeedRef.current) * 0.08;
        posRef.current += currentSpeedRef.current * delta;

        // Wrap around 1/3 of the track width
        const singleSetWidth = trackRef.current.scrollWidth / 3;
        if (singleSetWidth > 0) {
          if (posRef.current >= singleSetWidth) {
            posRef.current -= singleSetWidth;
          } else if (posRef.current < 0) {
            posRef.current += singleSetWidth;
          }
        }

        trackRef.current.style.transform = `translate3d(${-posRef.current}px, 0, 0)`;
      }

      animFrameIdRef.current = requestAnimationFrame(tick);
    };

    animFrameIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [activeTab]);

  // Tab change with Sliding Pill & smooth ribbon reset
  const handleTabChange = useCallback(
    (tab: 'belinskogo-15' | 'belinskogo-11') => {
      if (tab === activeTab) return;

      if (sliderRef.current) {
        gsap.to(sliderRef.current, {
          xPercent: tab === 'belinskogo-15' ? 0 : 100,
          duration: 0.35,
          ease: 'power2.out',
        });
      }

      if (trackRef.current) {
        gsap.to(trackRef.current, {
          opacity: 0.3,
          duration: 0.18,
          ease: 'power1.in',
          onComplete: () => {
            setActiveTab(tab);
            posRef.current = 0;
            gsap.to(trackRef.current, {
              opacity: 1,
              duration: 0.4,
              ease: 'power2.out',
            });
          },
        });
      } else {
        setActiveTab(tab);
        posRef.current = 0;
      }
    },
    [activeTab]
  );

  // Manual arrow nudge
  const handleNudge = useCallback((direction: 'left' | 'right') => {
    const cardWidth = 540 + 24; // card width + gap
    const nudgeAmount = direction === 'left' ? -cardWidth : cardWidth;
    
    const start = posRef.current;
    const end = start + nudgeAmount;
    
    gsap.to({ val: start }, {
      val: end,
      duration: 0.55,
      ease: 'power2.out',
      onUpdate: function () {
        posRef.current = this.targets()[0].val;
        if (trackRef.current) {
          const singleSetWidth = trackRef.current.scrollWidth / 3;
          if (singleSetWidth > 0) {
            if (posRef.current >= singleSetWidth) posRef.current -= singleSetWidth;
            if (posRef.current < 0) posRef.current += singleSetWidth;
          }
          trackRef.current.style.transform = `translate3d(${-posRef.current}px, 0, 0)`;
        }
      },
    });
  }, []);

  // Pointer drag events
  const handlePointerDown = (e: React.PointerEvent) => {
    // Only primary mouse button or touch
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    isDraggingRef.current = true;
    isDragPanRef.current = false;
    dragStartXRef.current = e.clientX;
    dragStartPosRef.current = posRef.current;
    if (dragResetTimeoutRef.current) {
      clearTimeout(dragResetTimeoutRef.current);
      dragResetTimeoutRef.current = null;
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || !trackRef.current) return;
    const deltaX = e.clientX - dragStartXRef.current;
    const dist = Math.abs(deltaX);

    // Only initiate pan scrolling if movement exceeds 8px
    if (dist > 8) {
      isDragPanRef.current = true;
      posRef.current = dragStartPosRef.current - deltaX;

      const singleSetWidth = trackRef.current.scrollWidth / 3;
      if (singleSetWidth > 0) {
        if (posRef.current >= singleSetWidth) posRef.current -= singleSetWidth;
        if (posRef.current < 0) posRef.current += singleSetWidth;
      }
      trackRef.current.style.transform = `translate3d(${-posRef.current}px, 0, 0)`;
    }
  };

  const handlePointerUp = useCallback(() => {
    isDraggingRef.current = false;
    // If a pan occurred, keep isDragPanRef true for 80ms to swallow the immediate click event
    if (isDragPanRef.current) {
      if (dragResetTimeoutRef.current) clearTimeout(dragResetTimeoutRef.current);
      dragResetTimeoutRef.current = setTimeout(() => {
        isDragPanRef.current = false;
      }, 80);
    }
  }, []);

  // Global window listener so releasing outside the track always cleans up dragging state
  useEffect(() => {
    const onWindowPointerUp = () => {
      if (isDraggingRef.current) {
        handlePointerUp();
      }
    };
    window.addEventListener('pointerup', onWindowPointerUp);
    window.addEventListener('pointercancel', onWindowPointerUp);
    return () => {
      window.removeEventListener('pointerup', onWindowPointerUp);
      window.removeEventListener('pointercancel', onWindowPointerUp);
      if (dragResetTimeoutRef.current) clearTimeout(dragResetTimeoutRef.current);
    };
  }, [handlePointerUp]);

  // Click on a photo to open Lightbox
  const handleCardClick = (actualIdx: number) => {
    // If user panned/dragged the ribbon, ignore the click
    if (isDragPanRef.current) return;
    setLightboxIdx(actualIdx);
  };

  const goToPrevPhoto = useCallback(() => {
    setLightboxIdx((prev) => {
      if (prev === null) return null;
      return (prev - 1 + photos.length) % photos.length;
    });
  }, [photos.length]);

  const goToNextPhoto = useCallback(() => {
    setLightboxIdx((prev) => {
      if (prev === null) return null;
      return (prev + 1) % photos.length;
    });
  }, [photos.length]);

  // Touch swipe gestures for mobile
  const touchStartXRef = useRef<number | null>(null);
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      touchStartXRef.current = e.touches[0].clientX;
    }
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    if (e.changedTouches.length > 0) {
      const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
      if (deltaX > 40) {
        goToPrevPhoto();
      } else if (deltaX < -40) {
        goToNextPhoto();
      }
    }
    touchStartXRef.current = null;
  }, [goToPrevPhoto, goToNextPhoto]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (lightboxIdx === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxIdx(null);
      } else if (e.key === 'ArrowLeft') {
        goToPrevPhoto();
      } else if (e.key === 'ArrowRight') {
        goToNextPhoto();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIdx, goToPrevPhoto, goToNextPhoto]);

  const activeLightboxPhoto = lightboxIdx !== null ? photos[lightboxIdx] : null;

  return (
    <section
      id="showrooms"
      ref={sectionRef}
      className="py-20 sm:py-24 bg-[#16191D] border-t border-[#2B313A] overflow-hidden"
    >
      {/* 1. Header with Tab Switcher & Navigation Arrows */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl text-left">
            <SectionBadge variant="teal" className="mb-3.5">
              Физические пространства «СИМОНА» в Нижнем Новгороде
            </SectionBadge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-montserrat font-semibold text-white tracking-tight leading-tight">
              Наши магазины
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#87888A] leading-relaxed">
              Оцените материалы, эргономику и технологии приборов вживую перед покупкой
            </p>
          </div>

          {/* Controls: Showroom Tabs + Nudge Arrows */}
          <div className="flex items-center space-x-3 shrink-0 self-start md:self-end">
            {/* Showroom Tab Switcher (Sliding Pill) */}
            <div className="relative inline-flex rounded-xl bg-[#111315] p-1 border border-[#2B313A]">
              <div
                ref={sliderRef}
                className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-lg bg-[#1E2228] border border-[#2B313A] shadow-sm pointer-events-none will-change-transform"
              />
              <button
                onClick={() => handleTabChange('belinskogo-15')}
                className={`relative z-10 py-2.5 px-4 rounded-lg text-xs font-semibold tracking-wide transition-colors duration-300 text-center whitespace-nowrap ${
                  activeTab === 'belinskogo-15' ? 'text-white' : 'text-[#87888A] hover:text-[#D7D9DB]'
                }`}
              >
                Флагман — Белинского, 15
              </button>
              <button
                onClick={() => handleTabChange('belinskogo-11')}
                className={`relative z-10 py-2.5 px-4 rounded-lg text-xs font-semibold tracking-wide transition-colors duration-300 text-center whitespace-nowrap ${
                  activeTab === 'belinskogo-11' ? 'text-white' : 'text-[#87888A] hover:text-[#D7D9DB]'
                }`}
              >
                Omoikiri & Körting — 11/66
              </button>
            </div>

            {/* Manual Arrows [ ← ] [ → ] */}
            <div className="hidden sm:flex items-center space-x-1.5">
              <button
                onClick={() => handleNudge('left')}
                aria-label="Предыдущий ракурс"
                className="w-10 h-10 rounded-xl bg-[#111315] border border-[#2B313A] text-[#87888A] hover:text-white hover:border-simona-teal/50 hover:bg-[#1E2228] transition-all flex items-center justify-center active:scale-95 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleNudge('right')}
                aria-label="Следующий ракурс"
                className="w-10 h-10 rounded-xl bg-[#111315] border border-[#2B313A] text-[#87888A] hover:text-white hover:border-simona-teal/50 hover:bg-[#1E2228] transition-all flex items-center justify-center active:scale-95 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Full-Width Edge-to-Edge Moving Ribbon */}
      <div
        className="relative w-full overflow-hidden select-none py-2 cursor-grab active:cursor-grabbing"
        onMouseEnter={() => {
          isHoveredRef.current = true;
        }}
        onMouseLeave={() => {
          isHoveredRef.current = false;
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Soft edge blur masks (seamless fade into section background) */}
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-r from-[#16191D] via-[#16191D]/70 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-l from-[#16191D] via-[#16191D]/70 to-transparent z-10 pointer-events-none" />

        {/* The continuously moving ribbon track */}
        <div
          ref={trackRef}
          className="flex space-x-6 will-change-transform"
          style={{ width: 'max-content' }}
        >
          {loopPhotos.map((item, index) => {
            const actualIdx = index % photos.length;

            return (
              <div
                key={`${item.id}-${index}`}
                onClick={() => handleCardClick(actualIdx)}
                role="button"
                tabIndex={0}
                className="group relative w-[310px] sm:w-[480px] lg:w-[540px] h-[220px] sm:h-[340px] lg:h-[370px] rounded-2xl overflow-hidden bg-[#111315] border border-[#2B313A] hover:border-simona-teal/60 transition-all duration-500 shadow-xl shrink-0 cursor-pointer focus:outline-none"
              >
                {/* Image with subtle hover scale */}
                <img
                  src={item.photo}
                  alt={item.title}
                  draggable={false}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 select-none pointer-events-none"
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#111315]/90 via-[#111315]/25 to-transparent pointer-events-none transition-opacity duration-300 group-hover:opacity-90" />

                {/* Number Badge at Top Left */}
                <div className="absolute top-4 left-4 pointer-events-none z-10">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#111315]/80 backdrop-blur-md border border-white/10 text-[11px] font-bold text-simona-teal tracking-wider">
                    {item.number}
                  </span>
                </div>

                {/* Maximize Icon Badge at Top Right */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-auto">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIdx(actualIdx);
                    }}
                    className="w-9 h-9 rounded-xl bg-[#111315]/90 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:scale-110 hover:border-simona-teal transition-all cursor-pointer"
                  >
                    <Maximize2 className="w-4 h-4 text-simona-teal-light" />
                  </button>
                </div>

                {/* Bottom Information Card */}
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 pointer-events-none z-10">
                  <p className="text-[11px] font-semibold text-simona-teal uppercase tracking-widest mb-1 opacity-90">
                    {item.subtitle}
                  </p>
                  <h3 className="text-lg sm:text-xl font-montserrat font-bold text-white tracking-tight group-hover:text-simona-teal-light transition-colors">
                    {item.title}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Showroom Compact Status Bar (Equal Width Columns) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={passportRef}
          className="mt-8 rounded-2xl bg-[#1E2228] border border-[#2B313A] shadow-xl grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#2B313A]"
        >
          {/* 1. Address with Map link (clickable) */}
          <a
            href={currentShowroom.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-3.5 group text-xs text-[#D7D9DB] hover:text-white transition-colors p-4 sm:px-6 lg:px-8"
          >
            <div className="w-8 h-8 rounded-xl bg-[#111315] border border-[#2B313A] text-simona-teal flex items-center justify-center shrink-0 group-hover:border-simona-teal/50 group-hover:bg-[#16191D] transition-all">
              <SimonaIconPin className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-semibold text-[#87888A] tracking-wider mb-0.5">
                Адрес салона
              </div>
              <div className="font-medium group-hover:text-simona-teal-light transition-colors flex items-center gap-1">
                <span>{currentShowroom.address}</span>
                <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </div>
            </div>
          </a>

          {/* 2. Hours */}
          <div className="flex items-center space-x-3.5 text-xs text-[#D7D9DB] p-4 sm:px-6 lg:px-8">
            <div className="w-8 h-8 rounded-xl bg-[#111315] border border-[#2B313A] text-simona-teal flex items-center justify-center shrink-0">
              <SimonaIconClock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-semibold text-[#87888A] tracking-wider mb-0.5">
                Режим работы
              </div>
              <div className="font-medium text-white">{currentShowroom.hours}</div>
            </div>
          </div>

          {/* 3. Phone (clickable) */}
          <a
            href={`tel:${currentShowroom.phoneRaw}`}
            className="flex items-center space-x-3.5 group text-xs text-[#D7D9DB] hover:text-white transition-colors p-4 sm:px-6 lg:px-8"
          >
            <div className="w-8 h-8 rounded-xl bg-[#111315] border border-[#2B313A] text-simona-teal flex items-center justify-center shrink-0 group-hover:border-simona-teal/50 group-hover:bg-[#16191D] transition-all">
              <SimonaIconPhoneSolid className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-semibold text-[#87888A] tracking-wider mb-0.5">
                Телефон салона
              </div>
              <div className="font-medium text-white group-hover:text-simona-teal-light transition-colors">
                {currentShowroom.phone}
              </div>
            </div>
          </a>
        </div>
      </div>

      {/* 4. Fullscreen Cinematic Lightbox Modal via Portal to document.body */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {lightboxIdx !== null && activeLightboxPhoto && (
              <motion.div
                key="lightbox-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/92 backdrop-blur-2xl p-4 sm:p-8"
                style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
                onClick={() => setLightboxIdx(null)}
              >
                {/* Modal Card with Scale & Fade */}
                <motion.div
                  key="lightbox-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="relative max-w-5xl w-full flex flex-col items-center select-none"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Top Bar: Title, Count, Close Button */}
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.08, ease: 'easeOut' }}
                    className="w-full flex items-center justify-between mb-4 px-2"
                  >
                    <div className="flex items-center space-x-3">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={`counter-${activeLightboxPhoto.number}`}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.2 }}
                          className="px-2.5 py-1 rounded-lg bg-simona-teal/20 text-simona-teal border border-simona-teal/30 text-xs font-bold"
                        >
                          {activeLightboxPhoto.number} / {photos.length < 10 ? `0${photos.length}` : photos.length}
                        </motion.span>
                      </AnimatePresence>
                      <div>
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={`title-${activeLightboxPhoto.id}`}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.22 }}
                          >
                            <h4 className="text-base sm:text-lg font-montserrat font-bold text-white">
                              {activeLightboxPhoto.title}
                            </h4>
                            <p className="text-xs text-[#87888A] hidden sm:block">
                              {activeLightboxPhoto.subtitle}
                            </p>
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </div>

                    <button
                      onClick={() => setLightboxIdx(null)}
                      aria-label="Закрыть"
                      className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </motion.div>

                  {/* Central Large Photo with Touch Swipes & Cinematic Crossfade */}
                  <div
                    className="relative w-full h-[55vh] sm:h-[68vh] lg:h-[72vh] rounded-2xl overflow-hidden bg-[#111315] border border-white/10 shadow-2xl flex items-center justify-center touch-pan-y"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.img
                        key={activeLightboxPhoto.id}
                        src={activeLightboxPhoto.photo}
                        alt={activeLightboxPhoto.title}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.01 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="w-full h-full object-contain rounded-2xl select-none pointer-events-none"
                        draggable={false}
                      />
                    </AnimatePresence>

                    {/* Lightbox Nav Arrows */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        goToPrevPhoto();
                      }}
                      aria-label="Предыдущее фото"
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-xl bg-black/60 hover:bg-black/90 border border-white/15 text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md z-20"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        goToNextPhoto();
                      }}
                      aria-label="Следующее фото"
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-xl bg-black/60 hover:bg-black/90 border border-white/15 text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md z-20"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Bottom Bar: Salon metadata line */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1, ease: 'easeOut' }}
                    className="w-full flex items-center justify-center text-xs text-[#87888A] mt-4 px-2 flex-wrap gap-2 text-center"
                  >
                    <span className="text-white font-medium">{currentShowroom.name}</span>
                    <span className="text-[#3E3D40] hidden sm:inline">•</span>
                    <a
                      href={currentShowroom.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-simona-teal text-[#D7D9DB] transition-colors underline-offset-4 hover:underline"
                    >
                      {currentShowroom.address}
                    </a>
                    <span className="text-[#3E3D40] hidden sm:inline">•</span>
                    <a
                      href={`tel:${currentShowroom.phoneRaw}`}
                      className="text-white font-medium hover:text-simona-teal transition-colors"
                    >
                      {currentShowroom.phone}
                    </a>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </section>
  );
}

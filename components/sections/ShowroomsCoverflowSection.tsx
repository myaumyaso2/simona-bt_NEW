'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import {
  MapPin,
  Clock,
  Phone,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Play,
  Pause,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
  phone: string;
  phoneRaw: string;
  photos: ShowroomPhoto[];
}

const SHOWROOMS_DATA: Record<'belinskogo-15' | 'belinskogo-11', ShowroomData> = {
  'belinskogo-15': {
    id: 'belinskogo-15',
    tabLabel: 'Флагман — Белинского, 15',
    name: 'Флагманский салон «СИМОНА»',
    address: 'г. Нижний Новгород, ул. Белинского, 15',
    mapUrl: 'https://yandex.ru/maps/-/CTh94C5D',
    hours: 'Ежедневно с 10:00 до 20:00',
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
        subtitle: 'Персональный подбор кухонных моек и техники за чашкой кофе',
        photo: '/showrooms/belinskogo-15/lounge_01.jpg',
      },
      {
        id: 'omoikiri-7',
        number: '07',
        title: 'Панорама салона Omoikiri',
        subtitle: 'Премиальная сантехника и встройка на Белинского, 11/66',
        photo: '/showrooms/belinskogo-15/salon_01.jpg',
      },
    ],
  },
};

export function ShowroomsCoverflowSection() {
  const [activeTab, setActiveTab] = useState<'belinskogo-15' | 'belinskogo-11'>('belinskogo-15');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const currentShowroom = SHOWROOMS_DATA[activeTab];
  const photos = currentShowroom.photos;

  // Auto-slide every 4 seconds when not paused and lightbox not open
  useEffect(() => {
    if (isPaused || lightboxIdx !== null) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [isPaused, lightboxIdx, photos.length]);

  // Tab change handler
  const handleTabChange = (tab: 'belinskogo-15' | 'belinskogo-11') => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setCurrentIndex(0);

    if (sliderRef.current) {
      gsap.to(sliderRef.current, {
        x: tab === 'belinskogo-11' ? '100%' : '0%',
        duration: 0.35,
        ease: 'power2.out',
      });
    }
  };

  // 3D Coverflow Update function using GSAP per user reference
  const updateCoverflow = useCallback(
    (index: number) => {
      const items = cardRefs.current;
      const total = photos.length;

      items.forEach((item, i) => {
        if (!item) return;
        const offset = i - index;
        const absOffset = Math.abs(offset);

        // Responsive spacing: 220px on desktop, 140px on mobile
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
        const spacing = isMobile ? 130 : 210;

        let targetX = 0;
        if (offset > 0) {
          targetX = offset * spacing + (isMobile ? 25 : 45);
        } else if (offset < 0) {
          targetX = offset * spacing - (isMobile ? 25 : 45);
        }

        // GSAP 3D Coverflow parameters
        const rotateY = offset === 0 ? 0 : offset < 0 ? 32 : -32;
        const z = offset === 0 ? 70 : -absOffset * 45 - 35;
        const scale = offset === 0 ? (isMobile ? 1.08 : 1.15) : Math.max(0.72, 0.88 - absOffset * 0.07);
        const opacity = absOffset > 3 ? 0 : Math.max(0.2, 1 - absOffset * 0.22);
        const zIndex = 100 - absOffset * 10;
        const brightness = offset === 0 ? 1 : 0.48;

        gsap.to(item, {
          x: targetX,
          rotateY,
          z,
          scale,
          opacity,
          zIndex,
          filter: `brightness(${brightness})`,
          duration: 0.55,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      });
    },
    [photos.length]
  );

  useEffect(() => {
    updateCoverflow(currentIndex);
  }, [currentIndex, updateCoverflow, activeTab]);

  // Touch & Drag Swipe Support
  const dragStartXRef = useRef<number | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    dragStartXRef.current = e.clientX;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragStartXRef.current === null) return;
    const deltaX = e.clientX - dragStartXRef.current;
    if (deltaX > 45) {
      // Swipe Right -> Prev
      setCurrentIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
    } else if (deltaX < -45) {
      // Swipe Left -> Next
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }
    dragStartXRef.current = null;
  };

  // Lightbox handlers
  const openLightbox = (index: number) => {
    setLightboxIdx(index);
  };

  const closeLightbox = () => {
    setLightboxIdx(null);
  };

  const nextLightbox = useCallback(() => {
    setLightboxIdx((prev) => (prev !== null ? (prev + 1) % photos.length : null));
  }, [photos.length]);

  const prevLightbox = useCallback(() => {
    setLightboxIdx((prev) =>
      prev !== null ? (prev > 0 ? prev - 1 : photos.length - 1) : null
    );
  }, [photos.length]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (lightboxIdx === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextLightbox();
      if (e.key === 'ArrowLeft') prevLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIdx, nextLightbox, prevLightbox]);

  return (
    <section
      id="showrooms-coverflow"
      ref={sectionRef}
      className="relative py-20 sm:py-24 bg-[#111315] border-t border-[#2B313A] overflow-hidden scroll-mt-28"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. Header with Concept Badge, Title and Salons Tab Switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            {/* Concept Badge */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-[#16191D] border border-simona-teal/50 mb-3.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-simona-teal animate-pulse" />
              <span className="text-xs font-semibold text-simona-teal uppercase tracking-widest">
                Вариант 2: GSAP 3D Coverflow Carousel
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-montserrat font-semibold text-white tracking-tight leading-tight">
              Наши магазины
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#87888A] leading-relaxed">
              Интерактивная 3D-витрина салонов бытовой техники «СИМОНА» на ул. Белинского
            </p>
          </div>

          {/* Controls: Salon Tabs + Navigation Arrows */}
          <div className="flex items-center space-x-3 shrink-0 self-start md:self-end">
            {/* Showroom Tab Switcher (Sliding Pill) */}
            <div className="relative inline-flex rounded-xl bg-[#16191D] p-1 border border-[#2B313A]">
              <div
                ref={sliderRef}
                className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-lg bg-[#1E2228] border border-simona-teal/40 shadow-sm pointer-events-none will-change-transform"
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

            {/* Arrows [ ← ] [ → ] */}
            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1))}
                aria-label="Предыдущий слайд"
                className="w-10 h-10 rounded-xl bg-[#16191D] border border-[#2B313A] text-[#87888A] hover:text-white hover:border-simona-teal/50 hover:bg-[#1E2228] transition-all flex items-center justify-center active:scale-95 cursor-pointer shadow-md"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentIndex((prev) => (prev + 1) % photos.length)}
                aria-label="Следующий слайд"
                className="w-10 h-10 rounded-xl bg-[#16191D] border border-[#2B313A] text-[#87888A] hover:text-white hover:border-simona-teal/50 hover:bg-[#1E2228] transition-all flex items-center justify-center active:scale-95 cursor-pointer shadow-md"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* 2. 3D Coverflow Carousel Stage */}
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative w-full h-[400px] sm:h-[460px] md:h-[520px] my-6 flex items-center justify-center select-none overflow-hidden"
          style={{ perspective: 1200 }}
        >
          {/* Coverflow Cards */}
          <div
            className="relative w-full h-full flex items-center justify-center"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {photos.map((p, i) => {
              const isCurrent = i === currentIndex;
              return (
                <div
                  key={p.id}
                  ref={(node) => {
                    cardRefs.current[i] = node;
                  }}
                  onClick={() => {
                    if (isCurrent) {
                      openLightbox(i);
                    } else {
                      setCurrentIndex(i);
                    }
                  }}
                  className={`absolute w-[300px] sm:w-[380px] md:w-[460px] aspect-[16/10] rounded-2xl overflow-hidden cursor-pointer will-change-transform shadow-2xl transition-shadow duration-300 ${
                    isCurrent
                      ? 'border-2 border-simona-teal/70 shadow-simona-teal/20 shadow-xl'
                      : 'border border-[#2B313A]/80 hover:border-simona-teal/40'
                  }`}
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* Photo Container */}
                  <div className="relative w-full h-full bg-[#16191D]">
                    <Image
                      src={p.photo}
                      alt={p.title}
                      fill
                      sizes="(max-width: 640px) 300px, (max-width: 1024px) 420px, 480px"
                      className="object-cover transition-transform duration-700"
                      priority={i < 3}
                    />

                    {/* Gradient Protection Layer */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111315]/95 via-[#111315]/40 to-transparent" />

                    {/* Number Badge (Top-Left) */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold bg-[#111315]/80 backdrop-blur-md border border-[#2B313A] text-simona-teal">
                        {p.number}
                      </span>
                    </div>

                    {/* Maximize Icon on Hover (Top-Right) */}
                    {isCurrent && (
                      <div className="absolute top-4 right-4 z-10">
                        <div className="w-8 h-8 rounded-full bg-[#111315]/80 backdrop-blur-md border border-simona-teal/50 text-simona-teal flex items-center justify-center hover:scale-110 transition-transform">
                          <Maximize2 className="w-4 h-4" />
                        </div>
                      </div>
                    )}

                    {/* Caption & Subtitle (Bottom) */}
                    <div className="absolute bottom-4 left-4 right-4 z-10">
                      <h3 className="text-base sm:text-lg font-montserrat font-semibold text-white tracking-wide leading-snug drop-shadow-md">
                        {p.title}
                      </h3>
                      <p className="text-xs text-[#D7D9DB]/90 mt-1 line-clamp-1">
                        {p.subtitle}
                      </p>
                      {isCurrent && (
                        <span className="inline-block mt-1.5 text-[10px] uppercase font-semibold tracking-wider text-simona-teal">
                          ✦ Нажмите для полноэкранного просмотра
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Soft 3D Reflection below card */}
                  <div
                    className="absolute -bottom-12 left-0 right-0 h-10 pointer-events-none opacity-20 blur-sm overflow-hidden"
                    style={{
                      transform: 'scaleY(-1)',
                      maskImage: 'linear-gradient(to bottom, black, transparent)',
                      WebkitMaskImage: 'linear-gradient(to bottom, black, transparent)',
                    }}
                  >
                    <Image src={p.photo} alt="" fill className="object-cover" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Bottom Carousel Bar: Progress Dots & Autoplay Indicator */}
        <div className="flex items-center justify-center gap-3 my-4">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="text-xs text-[#87888A] hover:text-white flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#16191D] border border-[#2B313A]"
          >
            {isPaused ? (
              <>
                <Play className="w-3 h-3 text-simona-teal" />
                <span>Авто-показ</span>
              </>
            ) : (
              <>
                <Pause className="w-3 h-3 text-simona-teal" />
                <span>Пауза</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-1.5">
            {photos.map((_, dotIdx) => (
              <button
                key={`dot-${dotIdx}`}
                onClick={() => setCurrentIndex(dotIdx)}
                aria-label={`Перейти к кадру ${dotIdx + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  dotIdx === currentIndex
                    ? 'w-6 h-2 bg-simona-teal'
                    : 'w-2 h-2 bg-[#2B313A] hover:bg-[#87888A]'
                }`}
              />
            ))}
          </div>

          <span className="text-xs font-mono text-[#87888A]">
            {String(currentIndex + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
          </span>
        </div>

        {/* 4. Showroom Status Card below Coverflow (Address, Hours, Phone) */}
        <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-[#16191D] border border-[#2B313A] shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Address */}
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-[#1E2228] border border-[#2B313A] flex items-center justify-center shrink-0 text-simona-teal">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-[#87888A] uppercase tracking-wider block">
                  Адрес пространства
                </span>
                <a
                  href={currentShowroom.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-white hover:text-simona-teal transition-colors mt-0.5 inline-block"
                >
                  {currentShowroom.address}
                </a>
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-[#1E2228] border border-[#2B313A] flex items-center justify-center shrink-0 text-simona-teal">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-[#87888A] uppercase tracking-wider block">
                  Режим работы
                </span>
                <p className="text-sm font-medium text-white mt-0.5">
                  {currentShowroom.hours}
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-[#1E2228] border border-[#2B313A] flex items-center justify-center shrink-0 text-simona-teal">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-[#87888A] uppercase tracking-wider block">
                  Телефон экспертов
                </span>
                <a
                  href={`tel:${currentShowroom.phoneRaw}`}
                  className="text-sm font-medium text-white hover:text-simona-teal transition-colors mt-0.5 inline-block"
                >
                  {currentShowroom.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Fullscreen Cinematic Lightbox Modal */}
      {lightboxIdx !== null &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-2xl transition-opacity duration-300"
            onClick={closeLightbox}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              aria-label="Закрыть полноэкранный просмотр"
              className="absolute top-5 right-5 z-50 w-11 h-11 rounded-full bg-[#1E2228]/80 border border-[#2B313A] text-[#87888A] hover:text-white hover:border-simona-teal flex items-center justify-center transition-all cursor-pointer shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Prev Photo Arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevLightbox();
              }}
              aria-label="Предыдущее фото"
              className="absolute left-4 sm:left-6 z-50 w-12 h-12 rounded-full bg-[#1E2228]/80 border border-[#2B313A] text-white hover:border-simona-teal flex items-center justify-center transition-all cursor-pointer shadow-xl hover:scale-105"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Photo Arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextLightbox();
              }}
              aria-label="Следующее фото"
              className="absolute right-4 sm:right-6 z-50 w-12 h-12 rounded-full bg-[#1E2228]/80 border border-[#2B313A] text-white hover:border-simona-teal flex items-center justify-center transition-all cursor-pointer shadow-xl hover:scale-105"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Active Lightbox Content Container */}
            <div
              className="relative max-w-5xl w-full max-h-[85vh] flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full aspect-[16/10] max-h-[75vh] rounded-2xl overflow-hidden border border-[#2B313A] shadow-2xl bg-[#111315]">
                <Image
                  src={photos[lightboxIdx].photo}
                  alt={photos[lightboxIdx].title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  priority
                />
              </div>

              {/* Lightbox Caption */}
              <div className="mt-4 text-center">
                <div className="inline-flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-semibold text-simona-teal px-2 py-0.5 rounded bg-[#1E2228] border border-[#2B313A]">
                    {photos[lightboxIdx].number} / {String(photos.length).padStart(2, '0')}
                  </span>
                  <span className="text-xs text-[#87888A]">
                    {currentShowroom.name}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-montserrat font-semibold text-white">
                  {photos[lightboxIdx].title}
                </h3>
                <p className="text-xs sm:text-sm text-[#87888A] mt-0.5">
                  {photos[lightboxIdx].subtitle}
                </p>
              </div>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
}

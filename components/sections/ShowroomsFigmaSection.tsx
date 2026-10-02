'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionBadge } from '@/components/ui/SectionBadge';
import {
  SimonaIconPin,
  SimonaIconClock,
  SimonaIconPhoneSolid,
} from '@/components/brand/SimonaIcons';
import { useSiteContent } from '@/components/providers/ContentContext';
import { SHOWROOM_CONFIGS, ShowroomPhotoItem } from '@/data/showroomPhotosData';

export function ShowroomsFigmaSection() {
  const content = useSiteContent();
  const [activeTab, setActiveTab] = useState<'belinskogo-15' | 'belinskogo-11'>('belinskogo-15');
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const passportRef = useRef<HTMLDivElement>(null);

  // Responsive device check: Desktop vs Smartphone
  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const currentShowroom = SHOWROOM_CONFIGS[activeTab];
  // Desktop gets horizontal photos, smartphone gets vertical photos
  const photos: ShowroomPhotoItem[] = useMemo(() => {
    return isMobile ? currentShowroom.mobilePhotos : currentShowroom.desktopPhotos;
  }, [isMobile, currentShowroom]);

  // Adjust number of copies for seamless loop based on photo count
  const loopCopies = photos.length >= 25 ? 2 : 3;
  const loopPhotos = useMemo(() => {
    const list: ShowroomPhotoItem[] = [];
    for (let i = 0; i < loopCopies; i++) {
      list.push(...photos);
    }
    return list;
  }, [photos, loopCopies]);

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

        // Wrap around 1/loopCopies of the track width
        const singleSetWidth = trackRef.current.scrollWidth / loopCopies;
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
  }, [activeTab, isMobile, loopCopies]);

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
  const handleNudge = useCallback(
    (direction: 'left' | 'right') => {
      const cardWidth = isMobile ? 260 + 16 : 540 + 24;
      const nudgeAmount = direction === 'left' ? -cardWidth : cardWidth;

      const start = posRef.current;
      const end = start + nudgeAmount;

      gsap.to(
        { val: start },
        {
          val: end,
          duration: 0.55,
          ease: 'power2.out',
          onUpdate: function () {
            posRef.current = this.targets()[0].val;
            if (trackRef.current) {
              const singleSetWidth = trackRef.current.scrollWidth / loopCopies;
              if (singleSetWidth > 0) {
                if (posRef.current >= singleSetWidth) posRef.current -= singleSetWidth;
                if (posRef.current < 0) posRef.current += singleSetWidth;
              }
              trackRef.current.style.transform = `translate3d(${-posRef.current}px, 0, 0)`;
            }
          },
        }
      );
    },
    [isMobile, loopCopies]
  );

  // Pointer drag handling for ribbon
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    isDragPanRef.current = false;
    dragStartXRef.current = e.clientX;
    dragStartPosRef.current = posRef.current;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - dragStartXRef.current;
    if (Math.abs(deltaX) > 6) {
      isDragPanRef.current = true;
    }
    posRef.current = dragStartPosRef.current - deltaX;

    if (trackRef.current) {
      const singleSetWidth = trackRef.current.scrollWidth / loopCopies;
      if (singleSetWidth > 0) {
        if (posRef.current >= singleSetWidth) posRef.current -= singleSetWidth;
        if (posRef.current < 0) posRef.current += singleSetWidth;
      }
      trackRef.current.style.transform = `translate3d(${-posRef.current}px, 0, 0)`;
    }
  };

  const handlePointerUp = useCallback(() => {
    isDraggingRef.current = false;
    if (dragResetTimeoutRef.current) clearTimeout(dragResetTimeoutRef.current);
    dragResetTimeoutRef.current = setTimeout(() => {
      isDragPanRef.current = false;
    }, 120);
  }, []);

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

  // Touch swipe gestures for mobile Lightbox
  const touchStartXRef = useRef<number | null>(null);
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      touchStartXRef.current = e.touches[0].clientX;
    }
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
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
    },
    [goToPrevPhoto, goToNextPhoto]
  );

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
      className="py-20 sm:py-24 bg-[#16191D] border-t border-[#2B313A] overflow-hidden select-none"
    >
      {/* 1. Header with Tab Switcher & Navigation Arrows */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl text-left">
            <SectionBadge variant="teal" className="mb-3.5">
              {content.showroomsSection?.badge || 'Салоны на Белинского'}
            </SectionBadge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-montserrat font-semibold text-white tracking-tight leading-tight">
              {content.showroomsSection?.title || 'Шоурумы бытовой техники на Белинского'}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#87888A] leading-relaxed">
              {content.showroomsSection?.subtitle ||
                'Два фирменных салона в историческом центре Нижнего Новгорода. Действующая кулинарная студия, экспозиции ASKO, Miele, Liebherr, SMEG, Körting и монобрендовый корнер Omoikiri.'}
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
                type="button"
                onClick={() => handleTabChange('belinskogo-15')}
                className={`relative z-10 py-2.5 px-4 rounded-lg text-xs font-semibold tracking-wide transition-colors duration-300 text-center whitespace-nowrap cursor-pointer ${
                  activeTab === 'belinskogo-15' ? 'text-white' : 'text-[#87888A] hover:text-[#D7D9DB]'
                }`}
              >
                Флагман — Белинского, 15
              </button>
              <button
                type="button"
                onClick={() => handleTabChange('belinskogo-11')}
                className={`relative z-10 py-2.5 px-4 rounded-lg text-xs font-semibold tracking-wide transition-colors duration-300 text-center whitespace-nowrap cursor-pointer ${
                  activeTab === 'belinskogo-11' ? 'text-white' : 'text-[#87888A] hover:text-[#D7D9DB]'
                }`}
              >
                Omoikiri & Körting — 11/66
              </button>
            </div>

            {/* Manual Arrows [ ← ] [ → ] */}
            <div className="hidden sm:flex items-center space-x-1.5">
              <button
                type="button"
                onClick={() => handleNudge('left')}
                aria-label="Предыдущий ракурс"
                className="w-10 h-10 rounded-xl bg-[#111315] border border-[#2B313A] text-[#87888A] hover:text-white hover:border-simona-teal/50 hover:bg-[#1E2228] transition-all flex items-center justify-center active:scale-95 cursor-pointer"
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
                onClick={() => handleNudge('right')}
                aria-label="Следующий ракурс"
                className="w-10 h-10 rounded-xl bg-[#111315] border border-[#2B313A] text-[#87888A] hover:text-white hover:border-simona-teal/50 hover:bg-[#1E2228] transition-all flex items-center justify-center active:scale-95 cursor-pointer"
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
          className={`flex will-change-transform ${isMobile ? 'space-x-4' : 'space-x-6'}`}
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
                className={`group relative overflow-hidden rounded-2xl bg-[#111315] border border-[#2B313A] hover:border-simona-teal/60 transition-all duration-500 shadow-xl shrink-0 cursor-pointer focus:outline-none ${
                  isMobile
                    ? 'w-[260px] h-[390px]'
                    : 'w-[440px] sm:w-[480px] lg:w-[540px] h-[300px] sm:h-[340px] lg:h-[370px]'
                }`}
              >
                {/* Image with subtle hover scale */}
                <img
                  src={item.photo}
                  alt={item.title}
                  loading="lazy"
                  draggable={false}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 select-none pointer-events-none"
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#111315]/95 via-[#111315]/30 to-transparent pointer-events-none transition-opacity duration-300 group-hover:opacity-90" />

                {/* Number Badge at Top Left */}
                <div className="absolute top-4 left-4 pointer-events-none z-10">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#111315]/85 backdrop-blur-md border border-white/10 text-[11px] font-bold text-simona-teal tracking-wider">
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
                    aria-label="Увеличить фото"
                    className="w-9 h-9 rounded-xl bg-[#111315]/90 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:scale-110 hover:border-simona-teal transition-all cursor-pointer"
                  >
                    <svg
                      className="w-4 h-4 text-simona-teal"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="15 3 21 3 21 9" />
                      <polyline points="9 21 3 21 3 15" />
                      <line x1="21" y1="3" x2="14" y2="10" />
                      <line x1="3" y1="21" x2="10" y2="14" />
                    </svg>
                  </button>
                </div>

                {/* Bottom Information Card */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 pointer-events-none z-10">
                  <p className="text-[10px] sm:text-[11px] font-semibold text-simona-teal uppercase tracking-widest mb-1 opacity-90 line-clamp-1">
                    {item.subtitle}
                  </p>
                  <h3 className="text-base sm:text-lg lg:text-xl font-montserrat font-bold text-white tracking-tight group-hover:text-simona-teal transition-colors line-clamp-2">
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
              <div className="font-medium group-hover:text-simona-teal transition-colors flex items-center gap-1">
                <span>{currentShowroom.address}</span>
                <svg
                  className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
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
              <div className="font-medium text-white group-hover:text-simona-teal transition-colors">
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
                          {activeLightboxPhoto.number} /{' '}
                          {photos.length < 10 ? `0${photos.length}` : photos.length}
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
                      type="button"
                      onClick={() => setLightboxIdx(null)}
                      aria-label="Закрыть"
                      className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
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
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        goToPrevPhoto();
                      }}
                      aria-label="Предыдущее фото"
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-xl bg-black/60 hover:bg-black/90 border border-white/15 text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md z-20"
                    >
                      <svg
                        className="w-5 h-5"
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
                      onClick={(e) => {
                        e.stopPropagation();
                        goToNextPhoto();
                      }}
                      aria-label="Следующее фото"
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-xl bg-black/60 hover:bg-black/90 border border-white/15 text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md z-20"
                    >
                      <svg
                        className="w-5 h-5"
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

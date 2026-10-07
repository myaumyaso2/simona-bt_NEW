'use client';

import React, { useState, useRef, useCallback, useMemo } from 'react';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=80';

interface ProductCardGalleryProps {
  images: string[];
  title: string;
  className?: string;
}

export function ProductCardGallery({
  images,
  title,
  className = '',
}: ProductCardGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const preloadedRef = useRef(false);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const justSwipedRef = useRef(false);

  // Filter valid image URLs
  const cleanImages = useMemo(() => {
    const valid = (images || []).filter(
      (img) => typeof img === 'string' && img.trim().length > 0
    );
    return valid.length > 0 ? valid : [FALLBACK_IMAGE];
  }, [images]);

  // Preload remaining images in background on first interaction
  const preloadImages = useCallback(() => {
    if (preloadedRef.current || cleanImages.length <= 1) return;
    preloadedRef.current = true;
    cleanImages.slice(1).forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [cleanImages]);

  // Desktop hover tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cleanImages.length <= 1) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || rect.width <= 0) return;

    const x = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(0.9999, x / rect.width));
    const newIndex = Math.floor(ratio * cleanImages.length);

    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  };

  const handleMouseEnter = () => {
    preloadImages();
  };

  const handleMouseLeave = () => {
    setActiveIndex(0);
  };

  // Touch swipe handling for mobile devices
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (cleanImages.length <= 1) return;
    preloadImages();
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
    justSwipedRef.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStartRef.current || cleanImages.length <= 1) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;

    // Detect horizontal swipe intent and prevent click navigation
    if (Math.abs(deltaX) > 12 && Math.abs(deltaX) > Math.abs(deltaY)) {
      justSwipedRef.current = true;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStartRef.current || cleanImages.length <= 1) return;
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const elapsed = Date.now() - touchStartRef.current.time;

    touchStartRef.current = null;

    if (Math.abs(deltaX) > 30 && Math.abs(deltaX) > Math.abs(deltaY) && elapsed < 800) {
      justSwipedRef.current = true;
      if (deltaX < 0) {
        // Swiped left -> next
        setActiveIndex((prev) => (prev + 1) % cleanImages.length);
      } else {
        // Swiped right -> prev
        setActiveIndex((prev) => (prev - 1 + cleanImages.length) % cleanImages.length);
      }

      setTimeout(() => {
        justSwipedRef.current = false;
      }, 300);
    } else {
      setTimeout(() => {
        justSwipedRef.current = false;
      }, 50);
    }
  };

  const handleClickCapture = (e: React.MouseEvent) => {
    if (justSwipedRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const currentImage = cleanImages[activeIndex] || cleanImages[0];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClickCapture={handleClickCapture}
      className={`relative w-full h-full flex items-center justify-center select-none ${className}`}
    >
      {/* Active Product Image */}
      <img
        src={currentImage}
        alt={`${title}${cleanImages.length > 1 ? ` — ракурс ${activeIndex + 1} из ${cleanImages.length}` : ''}`}
        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 select-none pointer-events-none"
        loading="lazy"
        onError={(e) => {
          e.currentTarget.src = FALLBACK_IMAGE;
        }}
      />

      {/* Segmented Indicator Bars (Bottom of Showcase Tablet) */}
      {cleanImages.length > 1 && (
        <div
          className={`absolute bottom-2 left-2.5 right-2.5 z-20 flex items-center gap-1 pointer-events-none transition-opacity duration-200 ${
            activeIndex > 0 ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
        >
          {cleanImages.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 flex-1 rounded-full transition-all duration-150 ${
                idx === activeIndex
                  ? 'bg-simona-teal shadow-sm shadow-simona-teal/50'
                  : 'bg-[#16191D]/25'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

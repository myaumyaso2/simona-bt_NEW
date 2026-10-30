'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductItem } from '@/types';
import {
  SimonaIconCheck,
  SimonaIconShare,
  SimonaIconClose,
  SimonaIconChevronLeft,
  SimonaIconChevronRight,
} from '@/components/brand/SimonaIcons';
import { formatBrandName } from '@/lib/formatters';

interface ProductHeroGalleryProps {
  product: ProductItem;
}

export function ProductHeroGallery({ product }: ProductHeroGalleryProps) {
  const images =
    product.images && product.images.length > 0
      ? product.images
      : ['https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80'];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const brandFormatted = formatBrandName(product.brand);

  const handleShare = async () => {
    if (typeof window !== 'undefined') {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Share error:', err);
      }
    }
  };

  const handlePrevImage = useCallback(() => {
    setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  const handleNextImage = useCallback(() => {
    setActiveImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : prev));
  }, [images.length]);

  const handleDragEnd = (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
    const swipeThreshold = 35;
    if ((info.offset.x < -swipeThreshold || info.velocity.x < -300) && activeImageIndex < images.length - 1) {
      handleNextImage();
    } else if ((info.offset.x > swipeThreshold || info.velocity.x > 300) && activeImageIndex > 0) {
      handlePrevImage();
    }
  };

  // Keyboard navigation when fullscreen lightbox is active
  useEffect(() => {
    if (!isZoomed) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsZoomed(false);
      } else if (e.key === 'ArrowLeft') {
        handlePrevImage();
      } else if (e.key === 'ArrowRight') {
        handleNextImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZoomed, handlePrevImage, handleNextImage]);

  return (
    <div className="flex flex-col md:flex-row gap-3 sm:gap-4 w-full">
      {/* 1. Thumbnails Strip (Desktop: left vertical, Mobile: bottom horizontal scroll) */}
      <div className="order-2 md:order-1 flex md:flex-col gap-2 sm:gap-3 overflow-x-auto md:overflow-visible pb-1 md:pb-0 no-scrollbar shrink-0">
        {images.map((img, idx) => {
          const isActive = idx === activeImageIndex;
          return (
            <button
              key={idx}
              onClick={() => setActiveImageIndex(idx)}
              className={`relative w-[60px] h-[60px] sm:w-[76px] sm:h-[76px] md:w-[88px] md:h-[88px] rounded-xl overflow-hidden bg-white border transition-all duration-200 cursor-pointer shrink-0 p-1 flex items-center justify-center ${
                isActive
                  ? 'border-simona-teal ring-1 ring-simona-teal/50 shadow-md shadow-simona-teal/10'
                  : 'border-[#2B313A] hover:border-[#87888A]/60 opacity-80 hover:opacity-100'
              }`}
            >
              <div className="relative w-full h-full">
                <Image
                  src={img}
                  alt={`${product.name} - ракурс ${idx + 1}`}
                  fill
                  sizes="88px"
                  className="object-contain p-1"
                  loading="lazy"
                />
              </div>
              {isActive && (
                <div className="absolute inset-0 border-2 border-simona-teal rounded-xl pointer-events-none" />
              )}
            </button>
          );
        })}
      </div>

      {/* 2. Main Image Stage with Touch Swipe & Dots (Responsive square on mobile, fixed height on desktop) */}
      <div className="order-1 md:order-2 w-full aspect-square sm:aspect-auto sm:h-[460px] md:h-[560px] md:flex-1 relative bg-white rounded-2xl border border-white/10 shadow-inner overflow-hidden flex items-center justify-center p-3 sm:p-6 select-none touch-pan-y">
        {/* Brand Tag (Top-Left) */}
        <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-20 pointer-events-none">
          <span className="px-2.5 py-0.5 rounded-md bg-[#16191D]/90 backdrop-blur-md text-[10px] font-bold tracking-wider text-white border border-[#2B313A] shadow-md">
            {brandFormatted}
          </span>
        </div>

        {/* Top-Right Share Button */}
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-20">
          <button
            onClick={handleShare}
            title="Поделиться ссылкой"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-[#111315]/80 backdrop-blur-md border border-[#2B313A] text-[#D7D9DB] hover:text-white hover:border-[#87888A] transition-all duration-200 cursor-pointer shadow-md relative"
          >
            {copied ? (
              <SimonaIconCheck className="w-4 h-4 text-emerald-400" />
            ) : (
              <SimonaIconShare className="w-4 h-4" />
            )}
            {copied && (
              <span className="absolute -left-24 top-2 px-2 py-0.5 rounded-md bg-[#16191D] border border-[#2B313A] text-[10px] text-white whitespace-nowrap shadow-lg">
                Скопировано
              </span>
            )}
          </button>
        </div>

        {/* Main Photo with Swipeable Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeImageIndex}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="w-full h-full flex items-center justify-center relative cursor-grab active:cursor-grabbing"
          >
            <Image
              src={images[activeImageIndex]}
              alt={product.name}
              fill
              priority={activeImageIndex === 0}
              fetchPriority={activeImageIndex === 0 ? 'high' : 'auto'}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain drop-shadow-md p-2 sm:p-4"
              onClick={() => setIsZoomed(true)}
            />
          </motion.div>
        </AnimatePresence>

        {/* Dots Pagination Indicator (Mobile & Tablet) */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 z-20 flex justify-center items-center gap-1.5 pointer-events-none md:hidden">
            {images.map((_, dotIdx) => (
              <span
                key={dotIdx}
                className={`transition-all duration-300 rounded-full ${
                  dotIdx === activeImageIndex
                    ? 'w-5 h-1.5 bg-simona-teal shadow-[0_0_6px_rgba(0,151,156,0.6)]'
                    : 'w-1.5 h-1.5 bg-[#2B313A]/70'
                }`}
              />
            ))}
          </div>
        )}

        {/* Fullscreen Zoom Lightbox Modal */}
        <AnimatePresence>
          {isZoomed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6 select-none"
            >
              {/* Lightbox Header Bar */}
              <div className="flex items-center justify-between z-20 w-full max-w-5xl mx-auto pt-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl bg-[#1E2228] border border-[#2B313A] text-xs font-semibold tracking-wider text-white">
                    {brandFormatted}
                  </span>
                  {images.length > 1 && (
                    <span className="px-2.5 py-1 rounded-xl bg-[#16191D] border border-[#2B313A] text-xs font-medium text-[#87888A]">
                      {activeImageIndex + 1} / {images.length}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => setIsZoomed(false)}
                  className="text-white bg-[#1E2228] border border-[#2B313A] rounded-xl w-10 h-10 flex items-center justify-center hover:border-white transition-colors cursor-pointer shadow-lg"
                  aria-label="Закрыть полноэкранный просмотр"
                >
                  <SimonaIconClose className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Lightbox Main Stage with Touch Swipe & Desktop Arrows */}
              <div className="relative flex-1 flex items-center justify-center w-full max-w-5xl mx-auto my-3 overflow-hidden">
                {/* Prev Arrow Button (Desktop / Tablet) */}
                {images.length > 1 && activeImageIndex > 0 && (
                  <button
                    onClick={handlePrevImage}
                    className="hidden sm:flex absolute left-2 md:left-4 z-20 w-11 h-11 rounded-xl bg-[#1E2228]/80 hover:bg-[#1E2228] border border-[#2B313A] text-white items-center justify-center cursor-pointer transition-colors"
                    aria-label="Предыдущее фото"
                  >
                    <SimonaIconChevronLeft className="w-5 h-5" />
                  </button>
                )}

                {/* Next Arrow Button (Desktop / Tablet) */}
                {images.length > 1 && activeImageIndex < images.length - 1 && (
                  <button
                    onClick={handleNextImage}
                    className="hidden sm:flex absolute right-2 md:right-4 z-20 w-11 h-11 rounded-xl bg-[#1E2228]/80 hover:bg-[#1E2228] border border-[#2B313A] text-white items-center justify-center cursor-pointer transition-colors"
                    aria-label="Следующее фото"
                  >
                    <SimonaIconChevronRight className="w-5 h-5" />
                  </button>
                )}

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImageIndex}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={handleDragEnd}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={images[activeImageIndex]}
                      alt={`${product.name} - ракурс ${activeImageIndex + 1}`}
                      className="max-h-[75vh] max-w-[92vw] object-contain rounded-2xl drop-shadow-2xl bg-white p-4"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Lightbox Footer Thumbnails Strip */}
              {images.length > 1 && (
                <div className="z-20 flex items-center justify-center gap-2 overflow-x-auto no-scrollbar py-2 max-w-full mx-auto px-2">
                  {images.map((img, idx) => {
                    const isActive = idx === activeImageIndex;
                    return (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative w-12 h-12 rounded-lg overflow-hidden bg-white border transition-all cursor-pointer shrink-0 p-0.5 flex items-center justify-center ${
                          isActive
                            ? 'border-simona-teal ring-2 ring-simona-teal/50'
                            : 'border-[#2B313A] opacity-60 hover:opacity-100'
                        }`}
                        aria-label={`Ракурс ${idx + 1}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img}
                          alt=""
                          className="w-full h-full object-contain"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

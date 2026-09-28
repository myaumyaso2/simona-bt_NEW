'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductItem } from '@/types';
import {
  SimonaIconCheck,
  SimonaIconShare,
} from '@/components/brand/SimonaIcons';
import { formatBrandName } from '@/lib/formatters';
import { getProductPhysicalStatus } from '@/lib/utils';

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

  const physicalStatus = getProductPhysicalStatus(product);
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

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full">
      {/* 1. Vertical Thumbnails Strip (Desktop: left, Mobile: horizontal scroll) */}
      <div className="order-2 md:order-1 flex md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-none shrink-0">
        {images.map((img, idx) => {
          const isActive = idx === activeImageIndex;
          return (
            <button
              key={idx}
              onClick={() => setActiveImageIndex(idx)}
              className={`relative w-[76px] h-[76px] md:w-[88px] md:h-[88px] rounded-xl overflow-hidden bg-white border transition-all duration-200 cursor-pointer shrink-0 p-1 flex items-center justify-center ${
                isActive
                  ? 'border-simona-teal ring-1 ring-simona-teal/50 shadow-md shadow-simona-teal/10'
                  : 'border-[#2B313A] hover:border-[#87888A]/60 opacity-80 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt={`${product.name} - ракурс ${idx + 1}`}
                className="w-full h-full object-contain"
                loading="lazy"
              />
              {isActive && (
                <div className="absolute inset-0 border-2 border-simona-teal rounded-xl pointer-events-none" />
              )}
            </button>
          );
        })}
      </div>

      {/* 2. Main Image Stage (White Luxury Showcase Tablet with object-contain) */}
      <div className="order-1 md:order-2 flex-1 relative h-[380px] sm:h-[480px] md:h-[580px] bg-white rounded-2xl border border-white/10 shadow-inner overflow-hidden flex items-center justify-center p-4 sm:p-6 select-none">
        {/* Badges Stack (Top-Left): Availability Status + Brand Tag */}
        <div className="absolute top-4 left-4 z-20 flex flex-col items-start gap-1.5 max-w-[85%] pointer-events-none">
          {physicalStatus === 'SHOWROOM' ? (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10.5px] font-semibold bg-[#16191D]/85 text-simona-teal border border-simona-teal/40 backdrop-blur-md shadow-md">
              На витрине
            </span>
          ) : physicalStatus === 'LOCAL_STOCK' ? (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10.5px] font-semibold bg-[#16191D]/85 text-simona-teal border border-simona-teal/40 backdrop-blur-md shadow-md">
              На складе
            </span>
          ) : physicalStatus === 'REMOTE_STOCK' ? (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10.5px] font-semibold bg-[#16191D]/85 text-simona-teal border border-simona-teal/40 backdrop-blur-md shadow-md">
              На удаленном складе
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10.5px] font-medium bg-[#16191D]/85 text-[#D7D9DB] border border-[#2B313A] backdrop-blur-md shadow-md">
              Под заказ
            </span>
          )}

          {/* Brand Tag directly below status badge */}
          <span className="px-2.5 py-0.5 rounded-md bg-[#16191D]/90 backdrop-blur-md text-[10px] font-bold tracking-wider text-white border border-[#2B313A] shadow-md">
            {brandFormatted}
          </span>
        </div>

        {/* Top-Right Share Button */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={handleShare}
            title="Поделиться ссылкой"
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#111315]/80 backdrop-blur-md border border-[#2B313A] text-[#D7D9DB] hover:text-white hover:border-[#87888A] transition-all duration-200 cursor-pointer shadow-md relative"
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

        {/* Main Photo with smooth animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeImageIndex}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-full h-full flex items-center justify-center relative"
          >
            <img
              src={images[activeImageIndex]}
              alt={product.name}
              className="max-h-full max-w-full object-contain drop-shadow-md cursor-zoom-in"
              onClick={() => setIsZoomed(true)}
            />
          </motion.div>
        </AnimatePresence>

        {/* Fullscreen Zoom Lightbox Modal */}
        <AnimatePresence>
          {isZoomed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsZoomed(false)}
              className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4 sm:p-10 cursor-zoom-out"
            >
              <img
                src={images[activeImageIndex]}
                alt={product.name}
                className="max-h-[90vh] max-w-[90vw] object-contain rounded-xl shadow-2xl border border-[#2B313A]"
              />
              <button
                onClick={() => setIsZoomed(false)}
                className="absolute top-6 right-6 text-white bg-[#1E2228] border border-[#2B313A] rounded-xl w-10 h-10 flex items-center justify-center hover:border-white transition-colors cursor-pointer"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

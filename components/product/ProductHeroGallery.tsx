'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductItem } from '@/types';
import { useStore } from '@/components/providers/StoreContext';
import {
  SimonaIconHeart,
  SimonaIconCompare,
  SimonaIconGuarantee,
  SimonaIconCheck,
  SimonaIconShare,
} from '@/components/brand/SimonaIcons';
import { Maximize2 } from 'lucide-react';

interface ProductHeroGalleryProps {
  product: ProductItem;
}

export function ProductHeroGallery({ product }: ProductHeroGalleryProps) {
  const images = product.images && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80'];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const { isInWishlist, toggleWishlist, isInCompare, toggleCompare } = useStore();
  const inWishlist = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);

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
              className={`relative w-[76px] h-[76px] md:w-[88px] md:h-[88px] rounded-xl overflow-hidden bg-[#1E2228] border transition-all duration-200 cursor-pointer shrink-0 ${
                isActive
                  ? 'border-simona-teal ring-1 ring-simona-teal/50 shadow-md shadow-simona-teal/10'
                  : 'border-[#2B313A] hover:border-[#87888A]/60 opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt={`${product.name} - ракурс ${idx + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {isActive && (
                <div className="absolute inset-0 border-2 border-simona-teal rounded-xl pointer-events-none" />
              )}
            </button>
          );
        })}
      </div>

      {/* 2. Main Image Stage */}
      <div className="order-1 md:order-2 flex-1 relative h-[380px] sm:h-[480px] md:h-[580px] bg-[#1E2228] rounded-2xl border border-[#2B313A] overflow-hidden flex items-center justify-center p-4 select-none">
        {/* Top-Left Badges Stack (Strict Quiet Luxury, No emojis) */}
        <div className="absolute top-4 left-4 z-20 flex flex-col items-start gap-2 max-w-[85%]">
          {/* Badge 1: Showroom Presence */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 backdrop-blur-md shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>В наличии: салон Белинского, 15</span>
          </div>

          {/* Badge 2: Exhibition Status */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-simona-teal/15 text-simona-teal border border-simona-teal/30 backdrop-blur-md shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-simona-teal" />
            <span>В экспозиции флагманского зала</span>
          </div>

          {/* Badge 3: Official Manufacturer Warranty */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-white/10 text-white/90 border border-white/15 backdrop-blur-md shadow-sm">
            <SimonaIconGuarantee className="w-3.5 h-3.5 text-[#D7D9DB]" />
            <span>Гарантия производителя 2 года</span>
          </div>
        </div>

        {/* Top-Right Action Icons */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
          {/* Wishlist */}
          <button
            onClick={() => toggleWishlist(product.id)}
            title={inWishlist ? 'Удалить из избранного' : 'Добавить в избранное'}
            className={`w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-md border transition-all duration-200 cursor-pointer shadow-md ${
              inWishlist
                ? 'bg-simona-wine/30 border-simona-wine text-simona-wine'
                : 'bg-[#111315]/80 border-[#2B313A] text-[#D7D9DB] hover:text-white hover:border-[#87888A]'
            }`}
          >
            <SimonaIconHeart
              className={`w-4 h-4 ${inWishlist ? 'text-simona-wine fill-simona-wine' : ''}`}
            />
          </button>

          {/* Compare */}
          <button
            onClick={() => toggleCompare(product.id)}
            title={inCompare ? 'Удалить из сравнения' : 'Добавить к сравнению'}
            className={`w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-md border transition-all duration-200 cursor-pointer shadow-md ${
              inCompare
                ? 'bg-simona-teal/30 border-simona-teal text-simona-teal'
                : 'bg-[#111315]/80 border-[#2B313A] text-[#D7D9DB] hover:text-white hover:border-[#87888A]'
            }`}
          >
            <SimonaIconCompare className="w-4 h-4" />
          </button>

          {/* Share */}
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
              <span className="absolute -left-20 top-2 px-2 py-0.5 rounded-md bg-[#16191D] border border-[#2B313A] text-[10px] text-white">
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
              className="max-h-full max-w-full object-contain rounded-lg drop-shadow-2xl cursor-zoom-in"
              onClick={() => setIsZoomed(true)}
            />
          </motion.div>
        </AnimatePresence>

        {/* Bottom-Right 360 / Interior Badge */}
        <button
          onClick={() => setIsZoomed(true)}
          className="absolute bottom-4 right-4 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#111315]/85 backdrop-blur-md border border-[#2B313A] text-xs text-[#D7D9DB] hover:text-white hover:border-simona-teal transition-all duration-200 cursor-pointer shadow-md"
        >
          <Maximize2 className="w-3.5 h-3.5 text-simona-teal" />
          <span>360° / Фото в интерьере</span>
        </button>

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

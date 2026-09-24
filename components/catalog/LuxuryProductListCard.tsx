'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductItem } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useStore } from '@/components/providers/StoreContext';
import { getPromosForProduct } from '@/data/promosData';
import {
  SimonaIconCart,
  SimonaIconHeart,
  SimonaIconCompare,
} from '@/components/brand/SimonaIcons';
import { getDiscountBadgeInfo } from '@/lib/catalog/badgeHelper';

interface LuxuryProductListCardProps {
  product: ProductItem;
}

interface SpecRow {
  label: string;
  value: string;
}

function getProductSpecs(product: ProductItem): SpecRow[] {
  // 1. Color
  let color = 'Черный классический';
  if (product.name.includes('Obsidian Black')) color = 'Черный обсидиан (Obsidian)';
  else if (product.name.includes('CleanSteel')) color = 'Нержавеющая сталь CleanSteel';
  else if (product.name.includes('Brilliant White')) color = 'Белый (Brilliant White)';
  else if (product.name.includes('Grafitschwarz')) color = 'Графитовый серый (Graphite)';
  else if (product.name.includes('Nero')) color = 'Черный матовый (Nero)';
  else if (product.name.includes('CS GB') || product.name.includes('Black')) color = 'Черное стекло (Black Glass)';
  else if (product.name.includes('Steel') || product.name.includes('Inox')) color = 'Нержавеющая сталь';

  // 2. Volume
  let volume = '72 л';
  const volMatch = product.shortDesc?.match(/(\d+)\s*л/);
  if (volMatch) {
    volume = `${volMatch[1]} л`;
  }

  // 3. Width
  let width = '60 см';
  if (product.dimensions) {
    const wMatch = product.dimensions.match(/(\d+)\s*см/);
    if (wMatch) width = `${wMatch[1]} см`;
  } else if (product.name.includes('45') || product.shortDesc?.includes('45 см')) {
    width = '45 см';
  } else if (product.name.includes('90') || product.shortDesc?.includes('90 см')) {
    width = '90 см';
  }

  // 4. Cleaning
  let cleaning = 'Каталитическая эмаль';
  if (
    (product.shortDesc && product.shortDesc.toLowerCase().includes('пиролиз')) ||
    (product.description && product.description.toLowerCase().includes('пиролиз'))
  ) {
    cleaning = 'Пиролитическая';
  } else if (
    (product.shortDesc && product.shortDesc.toLowerCase().includes('пар')) ||
    (product.description && product.description.toLowerCase().includes('пар'))
  ) {
    cleaning = 'Паровая (HydroClean)';
  }

  // 5. Country
  const brand = product.brand.toLowerCase();
  let country = 'Германия';
  if (brand.includes('miele')) country = 'Германия';
  else if (brand.includes('asko')) country = 'Словения';
  else if (brand.includes('bertazzoni')) country = 'Италия';
  else if (brand.includes('smeg')) country = 'Италия';
  else if (brand.includes('körting') || brand.includes('korting')) country = 'Италия';
  else if (brand.includes('liebherr')) country = 'Германия';
  else if (brand.includes('falmec')) country = 'Италия';
  else if (brand.includes('vard')) country = 'Турция';
  else if (brand.includes('omoikiri')) country = 'Япония';

  return [
    { label: 'Цвет отделки', value: color },
    { label: 'Объем камеры', value: volume },
    { label: 'Ширина встройки', value: width },
    { label: 'Тип очистки', value: cleaning },
    { label: 'Страна производства', value: country },
  ];
}

export function LuxuryProductListCard({ product }: LuxuryProductListCardProps) {
  const {
    openModal,
    addToCart,
    setIsCartOpen,
    isInCart,
    isInWishlist,
    toggleWishlist,
    isInCompare,
    toggleCompare,
  } = useStore();

  const inCart = isInCart(product.id);
  const inWishlist = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);

  const productPromos = getPromosForProduct(product);
  const activePromo = productPromos[0];
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const images = Array.isArray(product.images)
    ? product.images
    : typeof product.imagesJson === 'string'
    ? JSON.parse(product.imagesJson || '[]')
    : [];

  const mainImage =
    images[0] ||
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=80';

  const specs = getProductSpecs(product);

  const discountBadge = getDiscountBadgeInfo(product);
  const showPromoBadge = Boolean(activePromo || discountBadge);
  const badgeText = discountBadge ? discountBadge.text : 'АКЦИЯ';
  const badgeClass = discountBadge
    ? discountBadge.className
    : 'bg-simona-wine/25 hover:bg-simona-wine/40 text-white border-simona-wine/50';

  return (
    <div className="group rounded-2xl bg-[#16191D] border border-[#2B313A] hover:border-simona-teal/60 p-4 sm:p-5 transition-all duration-300 shadow-xl flex flex-col sm:flex-row gap-5 items-stretch">
      {/* 1. Left Media Area: Compact Square 220x220px */}
      <Link
        href={`/product/${product.slug}`}
        className="block relative w-full sm:w-52 sm:h-52 md:w-56 md:h-56 aspect-square shrink-0 rounded-xl overflow-hidden bg-[#1E2228] border border-[#2B313A]/50 flex items-center justify-center"
      >
        {/* Badges Stack (Top-Left): Status + Brand directly below */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col items-start gap-1.5 max-w-[85%]">
          {/* Availability Badge */}
          {product.physicalStatus === 'SHOWROOM' ||
          product.physicalStatus === 'ACTIVE_KITCHEN' ||
          product.physicalStatus === 'EXHIBITION_15' ||
          product.physicalStatus === 'EXHIBITION_11' ? (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10.5px] font-semibold bg-simona-teal/20 text-simona-teal border border-simona-teal/40 backdrop-blur-md shadow-sm">
              На витрине
            </span>
          ) : product.physicalStatus === 'LOCAL_STOCK' ? (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10.5px] font-semibold bg-simona-teal/20 text-simona-teal border border-simona-teal/40 backdrop-blur-md shadow-sm">
              На складе
            </span>
          ) : product.physicalStatus === 'REMOTE_STOCK' ? (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10.5px] font-semibold bg-simona-teal/20 text-simona-teal border border-simona-teal/40 backdrop-blur-md shadow-sm">
              На удаленном складе
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10.5px] font-medium bg-white/10 text-[#D7D9DB] border border-white/15 backdrop-blur-md shadow-sm">
              Под заказ
            </span>
          )}

          {/* Brand Tag directly below */}
          <span className="px-2.5 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] uppercase font-bold tracking-wider text-white border border-white/10 shadow-sm">
            {product.brand}
          </span>
        </div>

        {/* Promo / Discount Badge (Top-Right) per user rules & AGENTS.md */}
        {showPromoBadge && (
          <div
            className="absolute top-2.5 right-2.5 z-20"
            onMouseEnter={() => setIsTooltipOpen(true)}
            onMouseLeave={() => setIsTooltipOpen(false)}
          >
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (activePromo) {
                  openModal('PROMO_TERMS', { promoData: activePromo });
                }
              }}
              className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10.5px] font-semibold border backdrop-blur-md shadow-sm transition-all duration-200 cursor-pointer transform hover:scale-105 ${badgeClass}`}
              title={activePromo ? 'Нажмите для подробных условий акции' : 'Скидка'}
            >
              <span>{badgeText}</span>
            </button>

            {/* Interactive Tooltip */}
            {activePromo && (
              <AnimatePresence>
                {isTooltipOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.95 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      openModal('PROMO_TERMS', { promoData: activePromo });
                    }}
                    className="absolute right-0 top-full mt-2 w-64 p-3 rounded-xl bg-[#16191D] border border-simona-wine/60 text-white shadow-2xl backdrop-blur-2xl z-30 cursor-pointer text-left"
                  >
                    <div className="flex items-center justify-between text-[10px] text-simona-wine-light font-semibold mb-1">
                      <span>{activePromo.badgeText}</span>
                      <span>до {activePromo.endDate}</span>
                    </div>
                    <div className="text-xs font-montserrat font-bold text-white leading-tight mb-1 line-clamp-2">
                      {activePromo.title}
                    </div>
                    <p className="text-[11px] text-[#D7D9DB] line-clamp-2 leading-relaxed">
                      {activePromo.shortDescription}
                    </p>
                    <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-simona-teal font-medium">
                      <span>Узнать подробности</span>
                      <span className="text-white text-xs">→</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        )}

        {/* Product Image */}
        <img
          src={mainImage}
          alt={product.name}
          className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </Link>

      {/* 2. Middle Content & Specifications Area */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div>
          {/* Category & SKU */}
          <div className="flex items-center gap-2 text-[11px] text-[#87888A] mb-1 font-medium">
            <span>{product.category}</span>
            <span>•</span>
            <span className="font-mono text-[#D7D9DB] font-medium">
              Арт: {product.sku}
            </span>
          </div>

          {/* Product Name */}
          <Link href={`/product/${product.slug}`} className="block">
            <h3 className="text-base sm:text-lg font-montserrat font-bold text-white group-hover:text-simona-teal transition-colors leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Specifications Table with Dot Leaders */}
          <div className="mt-4 space-y-2.5">
            {specs.map((item, idx) => (
              <div key={idx} className="flex items-baseline text-xs">
                <span className="text-[#87888A] shrink-0 font-normal">{item.label}</span>
                <span className="flex-1 mx-2 border-b border-dotted border-[#2B313A] relative -top-0.5" />
                <span className="text-white font-medium shrink-0 font-mono text-[11.5px]">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Right Financial & Action Area (Compact ~200px) */}
      <div className="w-full sm:w-48 md:w-52 shrink-0 flex flex-col justify-between border-t sm:border-t-0 sm:border-l border-[#2B313A] pt-4 sm:pt-0 sm:pl-5">
        <div>
          {/* Price Block */}
          <div className="flex items-baseline flex-wrap gap-2 mb-1">
            <span className="text-xl sm:text-2xl font-montserrat font-bold text-white">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-xs text-[#87888A] line-through font-normal">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>
          <p className="text-[11px] text-[#87888A]">
            Шеф-монтаж салона
          </p>

          {/* Accent Wine Benefit row per AGENTS.md 8.2 */}
          {activePromo && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                openModal('PROMO_TERMS', { promoData: activePromo });
              }}
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-simona-wine-light hover:text-white transition-colors mt-2 cursor-pointer text-left group/benefit"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-simona-wine shrink-0 group-hover/benefit:scale-125 transition-transform" />
              <span className="underline decoration-simona-wine/50 underline-offset-2">
                {activePromo.badgeText} ({activePromo.brand})
              </span>
            </button>
          )}
        </div>

        {/* Buttons Stack: Wishlist/Compare ABOVE Buy Button */}
        <div className="mt-4 pt-3 border-t border-[#2B313A]/60 sm:border-t-0 sm:pt-0">
          {/* Row 1: Wishlist and Compare Buttons НАД кнопкой «Купить» */}
          <div className="grid grid-cols-2 gap-2 mb-2.5">
            {/* Wishlist Button */}
            <button
              onClick={() => toggleWishlist(product.id)}
              aria-label={inWishlist ? 'Удалить из избранного' : 'Добавить в избранное'}
              title={inWishlist ? 'В избранном' : 'В избранное'}
              className={`h-9 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer ${
                inWishlist
                  ? 'bg-simona-teal border border-simona-teal text-white shadow-md shadow-simona-teal/20'
                  : 'bg-[#1E2228] border border-[#2B313A] text-[#87888A] hover:text-white hover:border-simona-teal/50 hover:bg-[#242A32]'
              }`}
            >
              <SimonaIconHeart className="w-4 h-4" />
            </button>

            {/* Compare Button */}
            <button
              onClick={() => toggleCompare(product.id)}
              aria-label={inCompare ? 'Удалить из сравнения' : 'Добавить в сравнение'}
              title={inCompare ? 'В сравнении' : 'В сравнение'}
              className={`h-9 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer ${
                inCompare
                  ? 'bg-simona-teal border border-simona-teal text-white shadow-md shadow-simona-teal/20'
                  : 'bg-[#1E2228] border border-[#2B313A] text-[#87888A] hover:text-white hover:border-simona-teal/50 hover:bg-[#242A32]'
              }`}
            >
              <SimonaIconCompare className="w-4 h-4" />
            </button>
          </div>

          {/* Row 2: Full-width Buy / In Cart Button */}
          {inCart ? (
            <button
              onClick={() => setIsCartOpen(true)}
              className="w-full h-10 px-3 rounded-xl bg-gradient-to-r from-simona-teal-dark to-simona-teal hover:to-simona-teal-light text-white text-xs font-semibold tracking-wide transition-all duration-300 shadow-lg shadow-simona-teal/30 hover:shadow-simona-teal/50 hover:scale-[1.02] active:scale-98 flex items-center justify-center cursor-pointer"
            >
              <SimonaIconCart className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
              <span>В корзину</span>
            </button>
          ) : (
            <button
              onClick={() => addToCart(product, 1, false)}
              className="w-full h-10 px-3 rounded-xl bg-[#16191D] hover:bg-[#1E2228] border border-simona-teal text-white text-xs font-bold tracking-wide transition-all duration-300 shadow-md shadow-simona-teal/10 hover:shadow-simona-teal/20 hover:scale-[1.02] active:scale-98 flex items-center justify-center cursor-pointer"
            >
              <SimonaIconCart className="w-3.5 h-3.5 mr-1.5 flex-shrink-0 text-simona-teal" />
              <span>Купить</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

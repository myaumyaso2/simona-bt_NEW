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

function getProductChips(product: ProductItem): string[] {
  const chips: string[] = [];
  const desc = (product.shortDesc || '') + ' ' + (product.description || '');
  const descLower = desc.toLowerCase();
  const nameLower = product.name.toLowerCase();

  // 1. Width (Ширина)
  let width = '';
  if (product.dimensions) {
    if (product.dimensions.includes('45') || product.name.includes('45')) width = '45 см';
    else if (product.dimensions.includes('90') || product.name.includes('90')) width = '90 см';
    else if (
      product.dimensions.includes('60') ||
      product.dimensions.includes('595') ||
      product.dimensions.includes('596')
    ) {
      width = '60 см';
    } else {
      const dimMatch = product.dimensions.match(/(\d{2,3})\s*(?:см|мм)/i);
      if (dimMatch) {
        const val = parseInt(dimMatch[1], 10);
        width = val > 100 ? `${Math.round(val / 10)} см` : `${val} см`;
      }
    }
  } else if (product.name.includes('45')) width = '45 см';
  else if (product.name.includes('90')) width = '90 см';
  else if (product.name.includes('60')) width = '60 см';

  // 2. Volume (Объем)
  let volume = '';
  const volMatch = desc.match(/(\d{2,3})\s*л\b/i);
  if (volMatch) {
    volume = `${volMatch[1]} л`;
  }

  // 3. Key Technology / Cleaning
  let tech = '';
  if (descLower.includes('пиролиз') || descLower.includes('пиролитическ')) {
    tech = 'Пиролиз';
  } else if (descLower.includes('катализ') || descLower.includes('каталитическ')) {
    tech = 'Катализ';
  } else if (descLower.includes('пар') || nameLower.includes('пар')) {
    tech = 'Пар';
  } else if (descLower.includes('свч') || nameLower.includes('свч')) {
    tech = 'СВЧ';
  } else if (descLower.includes('индукц') || nameLower.includes('индукц')) {
    tech = 'Индукция';
  } else if (descLower.includes('nofrost') || descLower.includes('no frost') || descLower.includes('ноу фрост')) {
    tech = 'NoFrost';
  }

  // 4. Color (Цвет отделки)
  let color = '';
  if (product.colors && product.colors.length > 0) {
    color = product.colors[0].name.split('(')[0].trim();
  } else if (nameLower.includes('obsidian black') || nameLower.includes('черный') || descLower.includes('черный обсидиан')) {
    color = 'Черный';
  } else if (nameLower.includes('белый') || descLower.includes('белый')) {
    color = 'Белый';
  } else if (nameLower.includes('нерж') || descLower.includes('нержавеющ')) {
    color = 'Нерж. сталь';
  } else if (nameLower.includes('графит') || descLower.includes('графит')) {
    color = 'Графит';
  }

  // 5. Country of Brand
  const brand = (product.brand || '').toLowerCase();
  let country = '';
  if (brand.includes('miele')) country = 'Германия';
  else if (brand.includes('asko')) country = 'Словения';
  else if (brand.includes('bertazzoni')) country = 'Италия';
  else if (brand.includes('smeg')) country = 'Италия';
  else if (brand.includes('körting') || brand.includes('korting')) country = 'Италия';
  else if (brand.includes('liebherr')) country = 'Германия';
  else if (brand.includes('falmec')) country = 'Италия';
  else if (brand.includes('vard')) country = 'Турция';
  else if (brand.includes('omoikiri')) country = 'Япония';

  // Prioritized placement: Width -> Volume -> Key Technology -> Color -> Country
  if (width) chips.push(width);
  if (volume && chips.length < 3) chips.push(volume);
  if (tech && chips.length < 3) chips.push(tech);
  if (color && chips.length < 3) chips.push(color);
  if (country && chips.length < 3) chips.push(country);

  // Fallback from features with strict filtering (exclude warranties, IDs, months)
  if (chips.length < 3 && product.features && product.features.length > 0) {
    for (const f of product.features) {
      if (chips.length >= 3) break;
      const val = (f.value || '').trim();
      const lbl = (f.label || '').toLowerCase();
      const valLower = val.toLowerCase();

      if (
        !val ||
        val.length > 15 ||
        lbl.includes('гарант') ||
        lbl.includes('срок') ||
        lbl.includes('код') ||
        lbl.includes('арт') ||
        lbl.includes('вес') ||
        valLower.includes('месяц') ||
        valLower.includes('мес') ||
        valLower.includes('год') ||
        valLower.includes('лет') ||
        chips.some((c) => c.toLowerCase() === valLower)
      ) {
        continue;
      }
      chips.push(val);
    }
  }

  return chips.slice(0, 3);
}

interface LuxuryProductCardProps {
  product: ProductItem;
}

export function LuxuryProductCard({ product }: LuxuryProductCardProps) {
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

  const discountBadge = getDiscountBadgeInfo(product);
  const showPromoBadge = Boolean(activePromo || discountBadge);
  const badgeText = discountBadge ? discountBadge.text : 'АКЦИЯ';
  const badgeClass = discountBadge
    ? discountBadge.className
    : 'bg-simona-wine/25 hover:bg-simona-wine/40 text-white border-simona-wine/50';

  const chips = getProductChips(product);

  const renderActionButtons = () => (
    <div className="flex items-center gap-2 w-full">
      {/* Main Cart / Buy Button */}
      {inCart ? (
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex-1 h-10 px-3.5 rounded-xl bg-gradient-to-r from-simona-teal-dark to-simona-teal hover:to-simona-teal-light text-white text-xs font-semibold tracking-wide transition-all duration-300 shadow-lg shadow-simona-teal/30 hover:shadow-simona-teal/50 hover:scale-[1.02] active:scale-98 flex items-center justify-center cursor-pointer"
        >
          <SimonaIconCart className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
          <span>В корзину</span>
        </button>
      ) : (
        <button
          onClick={() => addToCart(product, 1, false)}
          className="flex-1 h-10 px-3.5 rounded-xl bg-[#16191D] hover:bg-[#1E2228] border border-simona-teal text-white text-xs font-bold tracking-wide transition-all duration-300 shadow-md shadow-simona-teal/10 hover:shadow-simona-teal/20 hover:scale-[1.02] active:scale-98 flex items-center justify-center cursor-pointer"
        >
          <SimonaIconCart className="w-3.5 h-3.5 mr-1.5 flex-shrink-0 text-simona-teal" />
          <span>Купить</span>
        </button>
      )}

      {/* Wishlist Button */}
      <button
        onClick={() => toggleWishlist(product.id)}
        aria-label={inWishlist ? 'Удалить из избранного' : 'Добавить в избранное'}
        title={inWishlist ? 'В избранном' : 'В избранное'}
        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0 cursor-pointer ${
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
        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0 cursor-pointer ${
          inCompare
            ? 'bg-simona-teal border border-simona-teal text-white shadow-md shadow-simona-teal/20'
            : 'bg-[#1E2228] border border-[#2B313A] text-[#87888A] hover:text-white hover:border-simona-teal/50 hover:bg-[#242A32]'
        }`}
      >
        <SimonaIconCompare className="w-4 h-4" />
      </button>
    </div>
  );

  const renderChips = () => (
    <div className="flex items-center gap-1.5 overflow-hidden w-full">
      {chips.map((chip, idx) => (
        <span
          key={idx}
          className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#1E2228] text-[#D7D9DB] border border-[#2B313A] shrink-0"
        >
          {chip}
        </span>
      ))}
    </div>
  );

  return (
    <div className="group rounded-2xl bg-[#16191D] border border-[#2B313A] hover:border-simona-teal/60 p-4 transition-all duration-300 shadow-xl flex flex-col justify-between">
      <div>
        {/* Top Media Area */}
        <Link
          href={`/product/${product.slug}`}
          className="block relative aspect-[4/3] bg-[#1E2228] rounded-xl overflow-hidden flex items-center justify-center border border-[#2B313A]/50"
        >
          {/* Badges Stack (Top-Left): Availability Status + Brand Tag */}
          <div className="absolute top-2.5 left-2.5 z-10 flex flex-col items-start gap-1.5 max-w-[85%]">
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

            {/* Brand Tag directly below status badge */}
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

              {/* Interactive Tooltip on Hover */}
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

        {/* Content Area */}
        <div className="mt-3.5">
          {/* Category & SKU */}
          <div className="flex items-center justify-between gap-2 text-[11px] text-[#87888A] mb-1.5 font-medium">
            <span className="truncate">{product.category}</span>
            <span className="font-mono text-[#D7D9DB] shrink-0 font-medium">
              Арт: {product.sku}
            </span>
          </div>

          {/* Product Name */}
          <Link href={`/product/${product.slug}`} className="block">
            <h3 className="text-[15px] font-montserrat font-bold text-white group-hover:text-simona-teal transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>
        </div>
      </div>

      {/* Price & Smart CTA Actions */}
      <div className="mt-4 pt-3.5 border-t border-[#2B313A]">
        <div className="flex items-baseline justify-between mb-1">
          <div className="flex items-baseline">
            <span className="text-lg font-montserrat font-bold text-white">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="ml-2 text-xs text-[#87888A] line-through font-normal">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Action / Specs Slot */}
        <div className="mt-3">
          {/* Desktop (lg:): Elevator animation or fixed buttons if inCart */}
          <div className="hidden lg:block">
            {inCart ? (
              <div className="h-10 flex items-center">
                {renderActionButtons()}
              </div>
            ) : (
              <div className="relative h-10 overflow-hidden rounded-xl">
                {/* STATE A: Chips (Visible in Rest, Slides UP on hover) */}
                <div className="absolute inset-0 flex items-center transition-all duration-300 ease-out transform group-hover:-translate-y-full group-hover:opacity-0 pointer-events-auto group-hover:pointer-events-none">
                  {renderChips()}
                </div>

                {/* STATE B: Action Buttons (Hidden below, Slides UP into view on hover) */}
                <div className="absolute inset-0 flex items-center transition-all duration-300 ease-out transform translate-y-full opacity-0 pointer-events-none group-hover:translate-y-0 group-hover:opacity-100 group-hover:pointer-events-auto">
                  {renderActionButtons()}
                </div>
              </div>
            )}
          </div>

          {/* Mobile & Tablet (< lg): Chips + Buttons always visible */}
          <div className="lg:hidden space-y-2.5">
            <div>{renderChips()}</div>
            <div>{renderActionButtons()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ProductItem } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useStore } from '@/components/providers/StoreContext';
import { ArrowRight } from 'lucide-react';
import {
  SimonaIconCart,
  SimonaIconDelivery,
  SimonaIconPin,
  SimonaIconClock,
  SimonaIconStar,
  SimonaIconCheck,
} from '@/components/brand/SimonaIcons';
import { getPromosForProduct, getPromosForCategory } from '@/data/promosData';
import { getDiscountBadgeInfo } from '@/lib/catalog/badgeHelper';

interface ProductBuyBoxProps {
  product: ProductItem;
  onOpenOneClickBuy: () => void;
  onNavigateToTab: (tabId: string) => void;
}

export function ProductBuyBox({
  product,
  onOpenOneClickBuy,
  onNavigateToTab,
}: ProductBuyBoxProps) {
  const { addToCart, setIsCartOpen, openModal } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedColorId, setSelectedColorId] = useState(
    product.colors?.[0]?.id || 'obsidian'
  );
  const [isAddedAnimation, setIsAddedAnimation] = useState(false);

  const productPromos = getPromosForProduct(product);
  const activePromo = productPromos[0];
  const categoryPromos = getPromosForCategory(product.category);
  const categoryPromo = !activePromo ? categoryPromos[0] : null;

  const colors = product.colors || [
    { id: 'obsidian', name: 'Obsidian Black (Черный обсидиан)', colorHex: '#0E0F12', isAvailable: true },
    { id: 'cleansteel', name: 'CleanSteel (Нержавеющая сталь)', colorHex: '#9BA1A6', isAvailable: true },
    { id: 'graphite', name: 'Graphite Grey (Графит)', colorHex: '#3E3D40', isAvailable: true },
  ];

  const selectedColor = colors.find((c) => c.id === selectedColorId) || colors[0];

  const handleAddToCart = () => {
    addToCart(product, quantity, false);
    setIsAddedAnimation(true);
    setTimeout(() => {
      setIsAddedAnimation(false);
      setIsCartOpen(true);
    }, 400);
  };

  const handleIncrement = () => setQuantity((prev) => Math.min(prev + 1, 10));
  const handleDecrement = () => setQuantity((prev) => Math.max(prev - 1, 1));

  const savings = product.oldPrice ? product.oldPrice - product.price : 0;
  const installmentPerMonth = Math.round(product.price / 12);

  return (
    <div className="w-full bg-[#16191D] border border-[#2B313A] rounded-2xl p-6 sm:p-7 flex flex-col gap-5 shadow-xl">
      {/* 1. Brand Tag & SKU */}
      <div className="flex items-center justify-between gap-3">
        <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-black/60 border border-white/10 text-[11px] font-bold tracking-wider uppercase text-white">
          {product.brand}
        </div>
        <span className="font-mono text-xs text-[#87888A]">
          Арт. {product.sku}
        </span>
      </div>

      {/* 2. Title & Rating */}
      <div>
        <h1 className="text-xl sm:text-2xl font-montserrat font-bold text-white leading-tight tracking-tight">
          {product.name}
        </h1>

        <div className="flex flex-wrap items-center gap-2 mt-2.5 text-xs text-[#87888A]">
          <div className="flex items-center gap-1 text-[#D4AF37] font-semibold">
            <SimonaIconStar className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
            <span>4.9 / 5.0</span>
          </div>
          <span>•</span>
          <button
            onClick={() => onNavigateToTab('reviews')}
            className="hover:text-white transition-colors underline-offset-2 hover:underline cursor-pointer"
          >
            {product.reviewsCount || 28} отзывов владельцев
          </button>
          <span>•</span>
          <button
            onClick={() => onNavigateToTab('reviews')}
            className="text-simona-teal hover:text-simona-teal-light transition-colors font-medium cursor-pointer"
          >
            Экспертная оценка СИМОНА
          </button>
        </div>
      </div>

      {/* 3. Color / Finish Selection */}
      <div className="pt-2 border-t border-[#2B313A]/60">
        <div className="flex items-center justify-between text-xs mb-2.5">
          <span className="text-[#87888A]">Цвет фасада:</span>
          <span className="text-white font-medium">{selectedColor.name}</span>
        </div>

        <div className="flex items-center gap-3">
          {colors.map((color) => {
            const isSelected = color.id === selectedColorId;
            return (
              <button
                key={color.id}
                onClick={() => setSelectedColorId(color.id)}
                title={color.name}
                className={`w-7 h-7 rounded-full transition-all duration-200 cursor-pointer relative flex items-center justify-center ${
                  isSelected
                    ? 'ring-2 ring-simona-teal ring-offset-2 ring-offset-[#16191D] scale-110'
                    : 'border border-[#2B313A] hover:scale-105'
                }`}
                style={{ backgroundColor: color.colorHex }}
              >
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Key Specs Capsule */}
      <div className="bg-[#1E2228] border border-[#2B313A]/70 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs text-[#D7D9DB]">
        <div className="flex items-center gap-1.5">
          <span className="text-[#87888A]">Объем:</span>
          <span className="font-semibold text-white">68 л</span>
        </div>
        <span className="text-[#2B313A]">•</span>
        <div className="flex items-center gap-1.5">
          <span className="text-[#87888A]">Ширина:</span>
          <span className="font-semibold text-white">60 см</span>
        </div>
        <span className="text-[#2B313A]">•</span>
        <div className="flex items-center gap-1.5">
          <span className="text-[#87888A]">Режимы:</span>
          <span className="font-semibold text-white">Пар + СВЧ + Пиролиз</span>
        </div>
      </div>

      {/* 5. Price & Benefits Box */}
      <div className="bg-[#1E2228] border border-[#2B313A] rounded-xl p-4 sm:p-5 flex flex-col gap-2">
        <div className="flex items-baseline justify-between gap-2">
          <div className="flex items-baseline gap-3">
            <span className="text-2xl sm:text-3xl font-montserrat font-extrabold text-white tracking-tight">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-sm text-[#87888A] line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {(() => {
              const discountBadge = getDiscountBadgeInfo(product);
              if (discountBadge) {
                return (
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border shadow-sm ${discountBadge.className}`}
                  >
                    {discountBadge.text}
                  </span>
                );
              }
              return null;
            })()}

            {savings > 0 && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-simona-wine text-white shadow-sm">
                Выгода {formatPrice(savings)}
              </span>
            )}
          </div>
        </div>

        <div className="text-xs text-simona-teal font-medium mt-1">
          или от {formatPrice(installmentPerMonth)}/мес без переплат (рассрочка 0-0-12)
        </div>
      </div>

      {/* 5.1. Accent Wine Manufacturer Promo Module per AGENTS.md 8.3 & Grill-Me */}
      {activePromo ? (
        <div className="rounded-xl border border-simona-wine/60 bg-simona-wine/10 p-4 sm:p-4.5 flex flex-col gap-2.5 shadow-lg relative overflow-hidden transition-all duration-300">
          {/* Subtle glow background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-simona-wine/15 rounded-full blur-2xl pointer-events-none" />

          {/* Top row: Badge and End Date */}
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-simona-wine/25 text-white shadow-sm border border-simona-wine/50 backdrop-blur-md">
              <span>
                {activePromo.badgeText} ({activePromo.brand})
              </span>
            </span>
            <div className="flex items-center gap-1.5 text-[11px] text-simona-wine-light font-medium">
              <SimonaIconClock className="w-3 h-3 shrink-0" />
              <span>до {activePromo.endDate}</span>
            </div>
          </div>

          {/* Promo Title */}
          <div className="text-sm font-montserrat font-bold text-white leading-snug">
            {activePromo.title}
          </div>

          {/* Short terms */}
          <p className="text-xs text-[#D7D9DB] leading-relaxed line-clamp-2">
            {activePromo.shortDescription}
          </p>

          {/* Modal trigger button */}
          <div className="pt-1 flex items-center justify-between">
            <button
              type="button"
              onClick={() => openModal('PROMO_TERMS', { promoData: activePromo })}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:text-simona-wine-light transition-colors group cursor-pointer"
            >
              <span className="underline decoration-simona-wine/60 underline-offset-4">
                Подробнее об акции и подарках
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-simona-wine-light group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      ) : categoryPromo ? (
        /* Contextual Category Promo Link when item itself is not in promo */
        <div className="rounded-xl border border-simona-wine/30 bg-simona-wine/5 p-3 sm:p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs shadow-sm">
          <div className="flex items-center gap-2 text-[#D7D9DB]">
            <span className="w-1.5 h-1.5 rounded-full bg-simona-wine shrink-0" />
            <span>
              Для категории <strong className="text-white font-semibold">{product.category}</strong> действуют акции:{' '}
              <strong className="text-simona-wine-light">
                {categoryPromo.badgeText} ({categoryPromo.brand})
              </strong>
            </span>
          </div>
          <Link
            href={`/catalog?promo=${encodeURIComponent(categoryPromo.slug)}`}
            className="inline-flex items-center gap-1 text-simona-wine-light hover:text-white font-semibold whitespace-nowrap transition-colors group shrink-0"
          >
            <span>Смотреть все товары по акции</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      ) : null}

      {/* 6. Action Buttons: Quantity + Add To Cart + Buy 1-Click */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          {/* Quantity Selector */}
          <div className="flex items-center bg-[#1E2228] border border-[#2B313A] rounded-xl px-2 py-1 h-12">
            <button
              onClick={handleDecrement}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#87888A] hover:text-white disabled:opacity-30 cursor-pointer font-bold transition-colors"
            >
              −
            </button>
            <span className="w-8 text-center text-sm font-semibold text-white">
              {quantity}
            </span>
            <button
              onClick={handleIncrement}
              disabled={quantity >= 10}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#87888A] hover:text-white disabled:opacity-30 cursor-pointer font-bold transition-colors"
            >
              +
            </button>
          </div>

          {/* Primary CTA: Add To Cart */}
          <button
            onClick={handleAddToCart}
            className={`flex-1 h-12 rounded-xl font-bold text-sm tracking-wide text-white transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-teal-950/40 ${
              isAddedAnimation
                ? 'bg-emerald-600 scale-[0.98]'
                : 'bg-simona-teal hover:bg-simona-teal-light active:scale-[0.98]'
            }`}
          >
            {isAddedAnimation ? (
              <>
                <SimonaIconCheck className="w-4 h-4 text-white" />
                <span>Добавлено в корзину</span>
              </>
            ) : (
              <>
                <SimonaIconCart className="w-4 h-4 text-white" />
                <span>В корзину — {formatPrice(product.price * quantity)}</span>
              </>
            )}
          </button>
        </div>

        {/* Secondary CTA: 1-Click Buy */}
        <button
          onClick={onOpenOneClickBuy}
          className="w-full h-11 rounded-xl bg-transparent hover:bg-white/5 border border-[#2B313A] hover:border-white/30 text-white font-medium text-xs tracking-wider transition-all duration-200 cursor-pointer"
        >
          Купить в 1 клик
        </button>
      </div>

      {/* 7. Delivery & In-store Pickup Status Rows */}
      <div className="pt-3 border-t border-[#2B313A]/70 flex flex-col gap-2.5 text-xs">
        {/* Delivery Row */}
        <div className="flex items-start gap-2.5 text-[#D7D9DB]">
          <SimonaIconDelivery className="w-4 h-4 text-[#87888A] shrink-0 mt-0.5" />
          <div>
            <span className="text-[#87888A]">Доставка по Нижнему Новгороду: </span>
            <span className="text-white font-medium">Завтра, бесплатно</span>{' '}
            <span className="text-[#87888A]">(в белых перчатках до кухни)</span>
          </div>
        </div>

        {/* Pickup Row */}
        <div className="flex items-start gap-2.5 text-emerald-400">
          <SimonaIconPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-[#87888A]">Самовывоз: </span>
            <span className="font-semibold text-emerald-400">Сегодня</span>{' '}
            <span className="text-[#87888A]">из флагманского салона на ул. Белинского, 15 (в наличии)</span>
          </div>
        </div>

        {/* Showroom Consultation Appointment */}
        <div className="flex items-start gap-2.5 text-simona-teal">
          <SimonaIconClock className="w-4 h-4 text-simona-teal shrink-0 mt-0.5" />
          <div>
            <span className="text-[#87888A]">Консультация в салоне: </span>
            <span className="text-white">Модель представлена в экспозиции — </span>
            <button
              onClick={() => openModal('SHOWROOM_VISIT', { product })}
              className="text-simona-teal hover:text-simona-teal-light underline font-medium cursor-pointer"
            >
              Записаться на персональный показ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

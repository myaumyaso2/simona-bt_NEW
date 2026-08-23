'use client';

import React from 'react';
import Image from 'next/image';
import { ShoppingBag, FileDown, Calendar, Sparkles, MapPin, Package, Flame, Check } from 'lucide-react';
import { ProductItem } from '@/types';
import { formatPrice, PHYSICAL_STATUS_CONFIG } from '@/lib/utils';
import { useStore } from '@/components/providers/StoreContext';

interface ProductCardProps {
  product: ProductItem;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, openModal } = useStore();
  const statusCfg = PHYSICAL_STATUS_CONFIG[product.physicalStatus] || PHYSICAL_STATUS_CONFIG.ON_ORDER;
  const isEcom = product.categoryType === 'CATEGORY_A';

  const images = Array.isArray(product.images)
    ? product.images
    : typeof product.imagesJson === 'string'
    ? JSON.parse(product.imagesJson || '[]')
    : [];

  const mainImage = images[0] || 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="group rounded-xl bg-zinc-900/50 border border-zinc-800/80 hover:border-zinc-700 transition-all duration-300 flex flex-col justify-between overflow-hidden hover:shadow-2xl">
      {/* Top Media Area */}
      <div className="relative aspect-[4/3] bg-zinc-950/60 overflow-hidden flex items-center justify-center p-4">
        {/* Physical Status Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium backdrop-blur-md ${statusCfg.badgeClass}`}>
            {statusCfg.badge}
          </span>
        </div>

        {/* Brand Tag */}
        <div className="absolute top-3 right-3 z-10">
          <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] uppercase font-bold tracking-wider text-zinc-300 border border-zinc-800">
            {product.brand}
          </span>
        </div>

        {/* Product Image */}
        <img
          src={mainImage}
          alt={product.name}
          className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & SKU */}
          <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-1.5">
            <span>{product.category}</span>
            <span className="font-mono">Арт: {product.sku}</span>
          </div>

          {/* Product Name */}
          <h3 className="text-sm font-medium text-zinc-100 group-hover:text-simona-teal transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>

          {/* Short Description */}
          {product.shortDesc && (
            <p className="mt-2 text-xs text-zinc-400 font-light line-clamp-2 leading-relaxed">
              {product.shortDesc}
            </p>
          )}

          {/* Dimensions */}
          {product.dimensions && (
            <div className="mt-2.5 text-[11px] text-zinc-500 flex items-center">
              <span className="text-zinc-600 mr-1.5">Габариты:</span>
              <span className="text-zinc-400 font-mono">{product.dimensions}</span>
            </div>
          )}
        </div>

        {/* Price & Smart CTA Actions */}
        <div className="mt-5 pt-4 border-t border-zinc-800/80">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-lg font-serif font-medium text-white">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <span className="ml-2 text-xs text-zinc-500 line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
            </div>
            {product.inStock ? (
              <span className="text-[11px] text-emerald-400 flex items-center">
                <Check className="w-3 h-3 mr-1" />
                В наличии
              </span>
            ) : (
              <span className="text-[11px] text-zinc-500">Под заказ</span>
            )}
          </div>

          {/* SMART CTA BUTTONS BASED ON CATEGORY & PHYSICAL STATUS */}
          {isEcom ? (
            /* Category A: E-Commerce */
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => addToCart(product)}
                className="py-2.5 px-3 rounded-lg bg-simona-teal hover:bg-simona-teal-light text-white text-xs font-semibold tracking-wide transition flex items-center justify-center col-span-2 shadow-md hover:shadow-simona-teal/20 active:scale-98"
              >
                <ShoppingBag className="w-3.5 h-3.5 mr-1.5" />
                Добавить в корзину
              </button>
            </div>
          ) : product.physicalStatus === 'ACTIVE_KITCHEN' ? (
            /* Category B: Active Kitchen */
            <div className="space-y-2">
              <button
                onClick={() => openModal('TEST_DRIVE', { product })}
                className="w-full py-2.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold tracking-wide transition flex items-center justify-center shadow-lg shadow-amber-500/10"
              >
                <Flame className="w-3.5 h-3.5 mr-1.5 text-zinc-950" />
                Записаться на тест-драйв
              </button>
              {product.schematicPdfUrl && (
                <a
                  href={product.schematicPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-1.5 px-3 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 text-[11px] font-medium transition flex items-center justify-center border border-zinc-700"
                >
                  <FileDown className="w-3.5 h-3.5 mr-1.5 text-simona-teal" />
                  Скачать схему встройки (PDF)
                </a>
              )}
            </div>
          ) : product.physicalStatus === 'EXHIBITION_15' || product.physicalStatus === 'EXHIBITION_11' ? (
            /* Category B: Exhibition Showroom */
            <div className="space-y-2">
              <button
                onClick={() =>
                  openModal('SHOWROOM_VISIT', {
                    product,
                    preferredShowroom:
                      product.physicalStatus === 'EXHIBITION_15' ? 'Белинского, 15' : 'Белинского, 11/66',
                  })
                }
                className="w-full py-2.5 px-3 rounded-lg bg-simona-teal hover:bg-simona-teal-light text-white text-xs font-semibold tracking-wide transition flex items-center justify-center"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                Оценить вживую в салоне
              </button>
              <button
                onClick={() => openModal('PROJECT_MATCHING', { product })}
                className="w-full py-1.5 px-3 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 text-[11px] font-medium transition flex items-center justify-center border border-zinc-700"
              >
                Запросить расчет комплекта
              </button>
            </div>
          ) : (
            /* Category B: On Order (~8000 items) */
            <div className="space-y-2">
              <button
                onClick={() => openModal('QUICK_CONSULT', { product })}
                className="w-full py-2.5 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 hover:text-white text-xs font-medium tracking-wide transition flex items-center justify-center border border-zinc-700"
              >
                <Package className="w-3.5 h-3.5 mr-1.5 text-simona-teal" />
                Консультация эксперта по модели
              </button>
              <button
                onClick={() => openModal('PROJECT_MATCHING', { product })}
                className="w-full py-1.5 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-[11px] font-light transition flex items-center justify-center"
              >
                Запросить спецификацию и сроки
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProductItem } from '@/types';
import { trackEcommerceDetail } from '@/lib/analytics/tracker';
import { ProductHeroGallery } from './ProductHeroGallery';
import { ProductBuyBox } from './ProductBuyBox';
import { ProductStickySubNav } from './ProductStickySubNav';
import { ProductTabsSection } from './ProductTabsSection';
import { ProductShowroomBlock } from './ProductShowroomBlock';
import { ProductWhiteGloveService } from './ProductWhiteGloveService';
import { ProductMobileBottomBar } from './ProductMobileBottomBar';
import { OneClickBuyModal } from './OneClickBuyModal';
import { ChevronRight, ArrowLeft } from 'lucide-react';

interface ProductDetailViewProps {
  product: ProductItem;
}

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const [activeTab, setActiveTab] = useState('about');
  const [isOneClickBuyOpen, setIsOneClickBuyOpen] = useState(false);

  useEffect(() => {
    trackEcommerceDetail(product);
  }, [product]);

  const handleNavigateToTab = (tabId: string) => {
    setActiveTab(tabId);
    const element = document.getElementById('product-tabs-nav');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#111315] text-white flex flex-col justify-between selection:bg-simona-teal selection:text-white pb-20 md:pb-0">
      <div>
        {/* 1. Breadcrumbs & Back Link */}
        <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 pt-5 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#87888A]">
          {/* Breadcrumb path */}
          <nav aria-label="Breadcrumbs" className="flex flex-wrap items-center gap-1.5">
            <Link href="/" className="hover:text-white transition-colors">
              Главная
            </Link>
            <ChevronRight className="w-3 h-3 text-[#3E3D40]" />
            <Link href="/catalog" className="hover:text-white transition-colors">
              Каталог
            </Link>
            <ChevronRight className="w-3 h-3 text-[#3E3D40]" />
            <Link href="/catalog" className="hover:text-white transition-colors">
              {product.category}
            </Link>
            <ChevronRight className="w-3 h-3 text-[#3E3D40]" />
            <span className="text-[#D7D9DB] truncate max-w-[200px] sm:max-w-xs">
              {product.name}
            </span>
          </nav>

          {/* Return to catalog link */}
          <Link
            href="/catalog"
            className="inline-flex items-center gap-1 text-simona-teal hover:text-simona-teal-light transition-colors font-medium shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Вернуться в каталог</span>
          </Link>
        </div>

        {/* 2. Hero Section: 60/40 Asymmetric Split */}
        <section className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Left Column: Gallery (60% ~ 7 cols) */}
            <div className="lg:col-span-7 w-full">
              <ProductHeroGallery product={product} />
            </div>

            {/* Right Column: Sticky Buy Box (40% ~ 5 cols) */}
            <div className="lg:col-span-5 w-full lg:sticky lg:top-24">
              <ProductBuyBox
                product={product}
                onOpenOneClickBuy={() => setIsOneClickBuyOpen(true)}
                onNavigateToTab={handleNavigateToTab}
              />
            </div>
          </div>
        </section>

        {/* 3. Sticky Sub-Navigation Bar */}
        <div id="product-tabs-nav">
          <ProductStickySubNav
            product={product}
            activeTab={activeTab}
            onSelectTab={setActiveTab}
          />
        </div>

        {/* 4. Interactive Tabs Section */}
        <ProductTabsSection
          product={product}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
        />

        {/* 5. Architectural Showroom Showcase */}
        <ProductShowroomBlock product={product} />

        {/* 6. White Glove Service Contour */}
        <ProductWhiteGloveService />
      </div>

      {/* 7. Mobile Floating Sticky Bottom Bar (390px) */}
      <ProductMobileBottomBar product={product} />

      {/* 8. One-Click Express Checkout Modal */}
      <OneClickBuyModal
        isOpen={isOneClickBuyOpen}
        onClose={() => setIsOneClickBuyOpen(false)}
        product={product}
      />
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Menu, X, Sparkles } from 'lucide-react';
import { useStore } from '@/components/providers/StoreContext';
import { SimonaLogo } from '@/components/brand/SimonaLogo';
import { SimonaIconCart } from '@/components/brand/SimonaIcons';
import { SimonaPatternOverlay } from '@/components/brand/SimonaPattern';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartCount, setIsCartOpen, openModal } = useStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-xl border-b border-black/[0.06] shadow-sm py-3'
          : 'bg-white/95 backdrop-blur-md border-b border-black/[0.04] py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo - Official Turquoise on White with "Бытовая техника и кухни" */}
          <Link href="/" className="group flex items-center mr-8 shrink-0">
            <SimonaLogo variant="teal" descriptor="bt_kitchens" size="md" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center space-x-6 text-[13px] font-semibold text-[#3E3D40]">
            <Link href="#catalog" className="hover:text-simona-teal transition-colors">
              Каталог
            </Link>
            <Link
              href="#active-kitchen"
              className="hover:text-simona-teal transition-colors flex items-center space-x-1.5 text-amber-600 hover:text-amber-700"
            >
              <span>Активная кухня</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
            </Link>
            <Link href="#brands" className="hover:text-simona-teal transition-colors">
              Бренды
            </Link>
            <Link href="#lookbook" className="hover:text-simona-teal transition-colors">
              Lookbook
            </Link>
            <Link href="#kuhni-module" className="hover:text-simona-teal transition-colors">
              Кухни под ключ
            </Link>
            <Link href="#b2b-club" className="hover:text-simona-teal transition-colors text-simona-wine font-semibold">
              Клуб дизайнеров
            </Link>
            <Link href="#showrooms" className="hover:text-simona-teal transition-colors">
              Салоны
            </Link>
            <Link href="#gallery" className="hover:text-simona-teal transition-colors">
              Галерея
            </Link>
          </nav>

          {/* Actions: Search, Cart, CTA */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Search Trigger */}
            <button
              onClick={() => openModal('SEARCH')}
              aria-label="Поиск по каталогу"
              className="px-3.5 py-1.5 text-[#3E3D40] hover:text-[#16181B] bg-[#F2F3F4] hover:bg-zinc-200/80 rounded-full transition-all flex items-center space-x-2 border border-black/[0.04]"
            >
              <Search className="w-3.5 h-3.5 text-simona-teal" />
              <span className="hidden md:inline text-xs text-[#6E7074] font-medium pr-1">Поиск 8 000+ SKU...</span>
            </button>

            {/* Cart Trigger with Official Simona Icon */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Корзина"
              className="relative p-2 text-[#3E3D40] hover:text-[#16181B] bg-[#F2F3F4] hover:bg-zinc-200/80 rounded-full transition-all border border-black/[0.04]"
            >
              <SimonaIconCart className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-simona-teal text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-scale shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Main O2O CTA - Button-in-Button */}
            <button
              onClick={() => openModal('SHOWROOM_VISIT')}
              className="hidden sm:inline-flex items-center pl-4 pr-1.5 py-1.5 rounded-full bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-semibold tracking-wide transition-all shadow-md shadow-simona-teal/20 group active:scale-98"
            >
              <span className="mr-2.5">Визит в салон</span>
              <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:rotate-12 transition-transform">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </span>
            </button>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-[#3E3D40] hover:text-[#16181B] rounded-md"
              aria-label="Меню"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden mt-4 pt-4 border-t border-black/[0.08] space-y-3 pb-3">
            <Link
              href="#catalog"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-[#16181B] hover:text-simona-teal"
            >
              Каталог товаров
            </Link>
            <Link
              href="#active-kitchen"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm text-amber-600 hover:text-amber-700 font-semibold"
            >
              🔥 Активная кухня и тест-драйв
            </Link>
            <Link
              href="#brands"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-[#16181B] hover:text-simona-teal"
            >
              Бренды
            </Link>
            <Link
              href="#lookbook"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-[#16181B] hover:text-simona-teal"
            >
              Lookbook проектов
            </Link>
            <Link
              href="#kuhni-module"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-[#16181B] hover:text-simona-teal"
            >
              Кухни под ключ
            </Link>
            <Link
              href="#b2b-club"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm text-simona-wine font-semibold"
            >
              Клуб архитекторов и дизайнеров
            </Link>
            <Link
              href="#showrooms"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-[#16181B] hover:text-simona-teal"
            >
              Салоны на ул. Белинского
            </Link>
            <Link
              href="#gallery"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-[#16181B] hover:text-simona-teal"
            >
              Фотогалерея интерьеров
            </Link>

            <div className="pt-3 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openModal('SHOWROOM_VISIT');
                }}
                className="w-full py-2.5 bg-simona-teal text-white rounded-full text-sm font-semibold shadow-md shadow-simona-teal/20"
              >
                Записаться на визит в салон
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openModal('PROJECT_MATCHING');
                }}
                className="w-full py-2.5 bg-[#16181B] text-white rounded-full text-sm font-semibold"
              >
                Подобрать технику по дизайн-проекту
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

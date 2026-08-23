'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, Menu, X, Sparkles, ChevronDown } from 'lucide-react';
import { useStore } from '@/components/providers/StoreContext';
import { SimonaLogo } from '@/components/brand/SimonaLogo';

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
          ? 'bg-[#0E1012]/95 backdrop-blur-md border-b border-zinc-800 shadow-2xl py-3.5'
          : 'bg-[#0E1012] border-b border-zinc-900 py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center">
            <SimonaLogo variant="white" descriptor="bt" size="md" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center space-x-7 text-[13px] font-medium text-zinc-300">
            <Link href="#catalog" className="hover:text-simona-teal transition-colors">
              Каталог
            </Link>
            <Link
              href="#active-kitchen"
              className="hover:text-simona-teal transition-colors flex items-center space-x-1 text-amber-400/90 hover:text-amber-300"
            >
              <span>Активная кухня</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
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
            <Link href="#b2b-club" className="hover:text-simona-teal transition-colors text-simona-teal">
              Дизайнерам & B2B
            </Link>
            <Link href="#showrooms" className="hover:text-simona-teal transition-colors">
              Салоны
            </Link>
          </nav>

          {/* Actions: Search, Cart, CTA */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Search Trigger */}
            <button
              onClick={() => openModal('SEARCH')}
              aria-label="Поиск по каталогу"
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800/80 rounded-full transition-colors flex items-center space-x-2 border border-transparent hover:border-zinc-700"
            >
              <Search className="w-4 h-4 text-zinc-300" />
              <span className="hidden md:inline text-xs text-zinc-400 pr-1">Поиск 8 000+ SKU...</span>
            </button>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Корзина"
              className="relative p-2 text-zinc-300 hover:text-white hover:bg-zinc-800/80 rounded-full transition-colors border border-zinc-800"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-simona-teal text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-scale">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Main O2O CTA */}
            <button
              onClick={() => openModal('SHOWROOM_VISIT')}
              className="hidden sm:inline-flex items-center px-4 py-2 rounded-md bg-simona-teal hover:bg-simona-teal-light text-white text-xs font-semibold tracking-wide transition-all shadow-md hover:shadow-simona-teal/30 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Визит в салон
            </button>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-zinc-400 hover:text-white rounded-md"
              aria-label="Меню"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden mt-4 pt-4 border-t border-zinc-800 space-y-3 pb-3">
            <Link
              href="#catalog"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm text-zinc-300 hover:text-simona-teal"
            >
              Каталог товаров
            </Link>
            <Link
              href="#active-kitchen"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm text-amber-400 hover:text-amber-300 font-medium"
            >
              🔥 Активная кухня и тест-драйв
            </Link>
            <Link
              href="#brands"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm text-zinc-300 hover:text-simona-teal"
            >
              Бренды
            </Link>
            <Link
              href="#lookbook"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm text-zinc-300 hover:text-simona-teal"
            >
              Lookbook проектов
            </Link>
            <Link
              href="#kuhni-module"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm text-zinc-300 hover:text-simona-teal"
            >
              Кухни под ключ
            </Link>
            <Link
              href="#b2b-club"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm text-simona-teal font-medium"
            >
              Клуб архитекторов и дизайнеров
            </Link>
            <Link
              href="#showrooms"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm text-zinc-300 hover:text-simona-teal"
            >
              Салоны на ул. Белинского
            </Link>

            <div className="pt-3 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openModal('SHOWROOM_VISIT');
                }}
                className="w-full py-2.5 bg-simona-teal text-white rounded text-sm font-semibold"
              >
                Записаться на визит в салон
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openModal('PROJECT_MATCHING');
                }}
                className="w-full py-2.5 bg-zinc-800 text-zinc-200 rounded text-sm font-medium border border-zinc-700"
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

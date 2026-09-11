'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Menu, X, ChevronDown } from 'lucide-react';
import { useStore } from '@/components/providers/StoreContext';
import { SimonaLogo } from '@/components/brand/SimonaLogo';
import {
  SimonaIconCart,
  SimonaIconHeart,
  SimonaIconCompare,
  SimonaIconUser,
} from '@/components/brand/SimonaIcons';

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
          ? 'bg-[#111315]/95 backdrop-blur-xl border-b border-[#2B313A] shadow-xl py-3.5'
          : 'bg-[#111315]/90 backdrop-blur-lg border-b border-[#2B313A]/70 py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* Brand Logo & Search */}
          <div className="flex items-center space-x-5 lg:space-x-8">
            <Link href="/" className="group flex items-center shrink-0">
              <SimonaLogo variant="teal" descriptor="none" size="md" />
            </Link>

            {/* Smart Search Bar */}
            <div
              onClick={() => openModal('SEARCH')}
              role="button"
              tabIndex={0}
              aria-label="Поиск по каталогу"
              className="hidden md:flex items-center space-x-2.5 px-3.5 py-2 rounded-xl bg-[#16191D] border border-[#2B313A] hover:border-simona-teal/50 transition-all cursor-pointer w-64 lg:w-72 text-[#87888A] hover:text-[#D7D9DB]"
            >
              <Search className="w-4 h-4 text-[#87888A] shrink-0" />
              <span className="text-xs truncate">Поиск прибора или артикула...</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-7 text-sm font-medium text-[#D7D9DB]">
            <Link 
              href="/catalog" 
              className="hover:text-white transition-colors flex items-center space-x-1 group"
            >
              <span>Каталог</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#87888A] group-hover:text-white transition-transform" />
            </Link>
            <Link 
              href="/catalog?promo=true" 
              className="hover:text-white transition-colors"
            >
              Акции
            </Link>
            <Link 
              href="#brands" 
              className="hover:text-white transition-colors"
            >
              Бренды
            </Link>
            <button 
              onClick={() => openModal('B2B_CLUB')}
              className="hover:text-white transition-colors text-left"
            >
              Дизайнерам
            </button>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-1.5 sm:space-x-2.5">
            {/* Mobile search button */}
            <button
              onClick={() => openModal('SEARCH')}
              aria-label="Поиск"
              className="md:hidden p-2 text-[#87888A] hover:text-white bg-[#1E2228] rounded-xl border border-[#2B313A] transition"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* User Auth / Personal Account Button (Figma Node 4344:77) */}
            <button
              onClick={() => openModal('AUTH')}
              aria-label="Личный кабинет"
              title="Личный кабинет"
              className="p-2 sm:p-2.5 text-[#87888A] hover:text-white bg-[#1E2228] hover:bg-[#242A32] rounded-xl border border-[#2B313A] hover:border-simona-teal/50 transition flex items-center justify-center group"
            >
              <SimonaIconUser className="w-4 h-4 group-hover:text-simona-teal transition-colors" />
            </button>

            {/* Paired Wishlist + Compare Block (Split-Pill Container) */}
            <div className="hidden sm:flex items-center h-[38px] rounded-xl bg-[#1E2228] border border-[#2B313A] hover:border-[#3E3D40] transition-colors p-0.5">
              {/* Wishlist Button (Figma Node 1006:67) */}
              <button
                onClick={() => alert('Избранное: список сохраненных приборов пуст')}
                aria-label="Избранное"
                title="Избранное"
                className="h-full px-2.5 text-[#87888A] hover:text-white hover:bg-[#242A32] rounded-lg transition-all flex items-center space-x-1.5 group"
              >
                <SimonaIconHeart className="w-4 h-4 group-hover:text-simona-teal transition-colors" />
                <span className="text-[10px] font-semibold text-[#87888A] group-hover:text-simona-teal transition-colors">
                  0
                </span>
              </button>

              {/* Subtle vertical divider */}
              <div className="w-px h-3.5 bg-[#2B313A]" />

              {/* Compare Button (Figma Node 1006:69) */}
              <button
                onClick={() => alert('Сравнение: выберите модели в каталоге для сравнения характеристик')}
                aria-label="Сравнение"
                title="Сравнение"
                className="h-full px-2.5 text-[#87888A] hover:text-white hover:bg-[#242A32] rounded-lg transition-all flex items-center space-x-1.5 group"
              >
                <SimonaIconCompare className="w-4 h-4 group-hover:text-simona-teal transition-colors" />
                <span className="text-[10px] font-semibold text-[#87888A] group-hover:text-simona-teal transition-colors">
                  0
                </span>
              </button>
            </div>

            {/* Cart Button (Figma Node 1006:61) */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Корзина"
              className="relative p-2 sm:p-2.5 text-[#87888A] hover:text-white bg-[#1E2228] hover:bg-[#242A32] rounded-xl border border-[#2B313A] hover:border-simona-teal/50 transition group flex items-center justify-center"
              title="Корзина"
            >
              <SimonaIconCart className="w-4 h-4 group-hover:text-simona-teal transition-colors" />
              <span className="absolute -top-1.5 -right-1.5 bg-simona-teal text-white text-[10px] font-bold min-w-4 h-4 px-1 rounded-md flex items-center justify-center shadow-md">
                {cartCount}
              </span>
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Меню"
              className="lg:hidden p-2 sm:p-2.5 text-[#87888A] hover:text-white bg-[#1E2228] rounded-xl border border-[#2B313A] transition ml-0.5 sm:ml-1"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#16191D] border-b border-[#2B313A] px-4 pt-3 pb-6 space-y-3 animate-fade-in mt-3">
          {/* Quick Wishlist & Compare in Mobile Menu */}
          <div className="flex items-center space-x-2 pt-1 pb-2 border-b border-[#2B313A]/60">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                alert('Избранное: список сохраненных приборов пуст');
              }}
              className="flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-[#1E2228] border border-[#2B313A] text-xs text-[#D7D9DB] hover:text-white transition"
            >
              <SimonaIconHeart className="w-4 h-4 text-simona-teal" />
              <span>Избранное (0)</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                alert('Сравнение: выберите модели в каталоге для сравнения характеристик');
              }}
              className="flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-[#1E2228] border border-[#2B313A] text-xs text-[#D7D9DB] hover:text-white transition"
            >
              <SimonaIconCompare className="w-4 h-4 text-simona-teal" />
              <span>Сравнение (0)</span>
            </button>
          </div>
          <Link
            href="/catalog"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-white border-b border-[#2B313A]"
          >
            Каталог техники (8 000+ SKU)
          </Link>
          <Link
            href="/catalog?promo=true"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-[#D7D9DB] border-b border-[#2B313A]"
          >
            Акции и спецпредложения
          </Link>
          <Link
            href="#brands"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-[#D7D9DB] border-b border-[#2B313A]"
          >
            Мировые бренды
          </Link>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              openModal('B2B_CLUB');
            }}
            className="block w-full text-left py-2 text-sm font-medium text-simona-teal border-b border-[#2B313A]"
          >
            Клуб архитекторов и дизайнеров
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              openModal('SHOWROOM_VISIT');
            }}
            className="w-full mt-3 py-2.5 rounded-xl bg-simona-teal text-white text-xs font-semibold tracking-wide text-center"
          >
            Записаться на визит в салон
          </button>
        </div>
      )}
    </header>
  );
}

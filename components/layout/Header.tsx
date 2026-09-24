'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useStore } from '@/components/providers/StoreContext';
import { SimonaLogo } from '@/components/brand/SimonaLogo';
import {
  SimonaIconCart,
  SimonaIconHeart,
  SimonaIconCompare,
  SimonaIconUser,
  SimonaIconSearch,
} from '@/components/brand/SimonaIcons';

interface HeaderProps {
  isScrolled?: boolean;
  onMobileMenuToggle?: (isOpen: boolean) => void;
}

export function Header({ isScrolled: propIsScrolled, onMobileMenuToggle }: HeaderProps = {}) {
  const [internalScrolled, setInternalScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartCount, setIsCartOpen, openModal, wishlist, compare } = useStore();

  const isScrolled = propIsScrolled !== undefined ? propIsScrolled : internalScrolled;

  useEffect(() => {
    if (propIsScrolled !== undefined) return;
    const handleScroll = () => {
      setInternalScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [propIsScrolled]);

  const handleMobileMenuToggle = (open: boolean) => {
    setMobileMenuOpen(open);
    onMobileMenuToggle?.(open);
  };

  return (
    <header
      className={`w-full z-40 transition-all duration-300 ${
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
              <SimonaIconSearch className="w-4 h-4 text-[#87888A] shrink-0" />
              <span className="text-xs truncate">Поиск прибора или артикула...</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 text-xs font-semibold uppercase tracking-wider text-[#D7D9DB]">
            <Link 
              href="/catalog" 
              className="hover:text-white transition-colors"
            >
              Каталог
            </Link>
            <Link 
              href="/promos" 
              className="hover:text-white transition-colors text-simona-wine hover:text-simona-wine-hover"
            >
              Акции
            </Link>
            <Link 
              href="/brands" 
              className="hover:text-white transition-colors"
            >
              Бренды
            </Link>
            <Link 
              href="/designers" 
              className="hover:text-white transition-colors"
            >
              Дизайнерам
            </Link>
            <Link 
              href="/showrooms" 
              className="hover:text-white transition-colors"
            >
              Салоны
            </Link>
            <Link 
              href="/services" 
              className="hover:text-white transition-colors"
            >
              Сервис
            </Link>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-1.5 sm:space-x-2.5">
            {/* Mobile search button */}
            <button
              onClick={() => openModal('SEARCH')}
              aria-label="Поиск"
              className="md:hidden p-2 text-[#87888A] hover:text-white bg-[#1E2228] rounded-xl border border-[#2B313A] transition"
            >
              <SimonaIconSearch className="w-4 h-4" />
            </button>

            {/* User Auth / Personal Account Link */}
            <Link
              href="/profile"
              aria-label="Личный кабинет"
              title="Личный кабинет"
              className="p-2 sm:p-2.5 text-[#87888A] hover:text-white bg-[#1E2228] hover:bg-[#242A32] rounded-xl border border-[#2B313A] hover:border-simona-teal/50 transition flex items-center justify-center group"
            >
              <SimonaIconUser className="w-4 h-4 group-hover:text-simona-teal transition-colors" />
            </Link>

            {/* Paired Wishlist + Compare Block (Split-Pill Container) */}
            <div className="hidden sm:flex items-center h-[38px] rounded-xl bg-[#1E2228] border border-[#2B313A] hover:border-[#3E3D40] transition-colors p-0.5">
              {/* Wishlist Link */}
              <Link
                href="/profile?tab=wishlist"
                aria-label="Избранное"
                title="Избранное"
                className="h-full px-2.5 text-[#87888A] hover:text-white hover:bg-[#242A32] rounded-lg transition-all flex items-center space-x-1.5 group"
              >
                <SimonaIconHeart
                  className={`w-4 h-4 transition-colors ${
                    wishlist.length > 0 ? 'text-simona-teal' : 'group-hover:text-simona-teal'
                  }`}
                />
                <span
                  className={`text-[10px] font-semibold transition-colors ${
                    wishlist.length > 0 ? 'text-simona-teal' : 'text-[#87888A] group-hover:text-simona-teal'
                  }`}
                >
                  {wishlist.length}
                </span>
              </Link>

              {/* Subtle vertical divider */}
              <div className="w-px h-3.5 bg-[#2B313A]" />

              {/* Compare Link */}
              <Link
                href="/compare"
                aria-label="Сравнение"
                title="Сравнение"
                className="h-full px-2.5 text-[#87888A] hover:text-white hover:bg-[#242A32] rounded-lg transition-all flex items-center space-x-1.5 group"
              >
                <SimonaIconCompare
                  className={`w-4 h-4 transition-colors ${
                    compare.length > 0 ? 'text-simona-teal' : 'group-hover:text-simona-teal'
                  }`}
                />
                <span
                  className={`text-[10px] font-semibold transition-colors ${
                    compare.length > 0 ? 'text-simona-teal' : 'text-[#87888A] group-hover:text-simona-teal'
                  }`}
                >
                  {compare.length}
                </span>
              </Link>
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
              onClick={() => handleMobileMenuToggle(!mobileMenuOpen)}
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
            <Link
              href="/profile?tab=wishlist"
              onClick={() => handleMobileMenuToggle(false)}
              className="flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-[#1E2228] border border-[#2B313A] text-xs text-[#D7D9DB] hover:text-white transition"
            >
              <SimonaIconHeart className="w-4 h-4 text-simona-teal" />
              <span>Избранное ({wishlist.length})</span>
            </Link>
            <Link
              href="/compare"
              onClick={() => handleMobileMenuToggle(false)}
              className="flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-[#1E2228] border border-[#2B313A] text-xs text-[#D7D9DB] hover:text-white transition"
            >
              <SimonaIconCompare className="w-4 h-4 text-simona-teal" />
              <span>Сравнение ({compare.length})</span>
            </Link>
          </div>
          <Link
            href="/catalog"
            onClick={() => handleMobileMenuToggle(false)}
            className="block py-2 text-sm font-medium text-white border-b border-[#2B313A]"
          >
            Каталог техники (8 000+ SKU)
          </Link>
          <Link
            href="/promos"
            onClick={() => handleMobileMenuToggle(false)}
            className="block py-2 text-sm font-medium text-simona-wine border-b border-[#2B313A]"
          >
            Акции производителей
          </Link>
          <Link
            href="/brands"
            onClick={() => handleMobileMenuToggle(false)}
            className="block py-2 text-sm font-medium text-[#D7D9DB] border-b border-[#2B313A]"
          >
            Мировые бренды
          </Link>
          <Link
            href="/designers"
            onClick={() => handleMobileMenuToggle(false)}
            className="block py-2 text-sm font-medium text-[#D7D9DB] border-b border-[#2B313A]"
          >
            Клуб архитекторов и дизайнеров
          </Link>
          <Link
            href="/showrooms"
            onClick={() => handleMobileMenuToggle(false)}
            className="block py-2 text-sm font-medium text-[#D7D9DB] border-b border-[#2B313A]"
          >
            Шоурумы и Активная кухня
          </Link>
          <Link
            href="/services"
            onClick={() => handleMobileMenuToggle(false)}
            className="block py-2 text-sm font-medium text-[#D7D9DB] border-b border-[#2B313A]"
          >
            Премиальный сервис и монтаж
          </Link>
          <Link
            href="/profile"
            onClick={() => handleMobileMenuToggle(false)}
            className="block py-2 text-sm font-medium text-simona-teal border-b border-[#2B313A]"
          >
            Личный кабинет клиента
          </Link>
          <Link
            href="/showrooms#booking"
            onClick={() => handleMobileMenuToggle(false)}
            className="block w-full mt-3 py-2.5 rounded-xl bg-simona-teal text-white text-xs font-semibold tracking-wide text-center"
          >
            Записаться на визит в салон
          </Link>
        </div>
      )}
    </header>
  );
}

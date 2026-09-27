'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useStore } from '@/components/providers/StoreContext';
import { SimonaLogo } from '@/components/brand/SimonaLogo';
import { CatalogMegaMenu } from './CatalogMegaMenu';
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
  onCatalogMenuToggle?: (isOpen: boolean) => void;
}

export function Header({
  isScrolled: propIsScrolled,
  onMobileMenuToggle,
  onCatalogMenuToggle,
}: HeaderProps = {}) {
  const pathname = usePathname();
  const [internalScrolled, setInternalScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [catalogMenuOpen, setCatalogMenuOpen] = useState(false);
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

  // Close menus on route change
  useEffect(() => {
    setCatalogMenuOpen(false);
    onCatalogMenuToggle?.(false);
    setMobileMenuOpen(false);
    onMobileMenuToggle?.(false);
  }, [pathname]);

  const handleMobileMenuToggle = (open: boolean) => {
    setMobileMenuOpen(open);
    onMobileMenuToggle?.(open);
    if (open && catalogMenuOpen) {
      setCatalogMenuOpen(false);
      onCatalogMenuToggle?.(false);
    }
  };

  const handleCatalogMenuToggle = (open: boolean) => {
    setCatalogMenuOpen(open);
    onCatalogMenuToggle?.(open);
    if (open && mobileMenuOpen) {
      setMobileMenuOpen(false);
      onMobileMenuToggle?.(false);
    }
  };

  return (
    <header
      className={`w-full relative z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#111315]/95 backdrop-blur-xl border-b border-[#2B313A] shadow-xl py-3.5'
          : 'bg-[#111315]/90 backdrop-blur-lg border-b border-[#2B313A]/70 py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-50">
        <div className="flex items-center justify-between gap-4">
          
          {/* Brand Logo & Search */}
          <div className="flex items-center space-x-3 sm:space-x-4 lg:space-x-6">
            <Link href="/" className="group flex items-center shrink-0">
              <SimonaLogo variant="teal" descriptor="none" size="md" />
            </Link>

            {/* Smart Search Bar */}
            <div
              onClick={() => openModal('SEARCH')}
              role="button"
              tabIndex={0}
              aria-label="Поиск по каталогу"
              className="hidden lg:flex items-center space-x-2.5 px-3.5 py-2 rounded-xl bg-[#16191D] border border-[#2B313A] hover:border-simona-teal/50 transition-all cursor-pointer w-48 xl:w-60 text-[#87888A] hover:text-[#D7D9DB]"
            >
              <SimonaIconSearch className="w-4 h-4 text-[#87888A] shrink-0" />
              <span className="text-xs truncate">Поиск прибора...</span>
            </div>
          </div>

          {/* Desktop Navigation (Human Case, Animated Underlines, Active States) */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 text-xs font-medium font-montserrat">
            {/* 1. Каталог */}
            <button
              type="button"
              onClick={() => handleCatalogMenuToggle(!catalogMenuOpen)}
              aria-label="Каталог"
              aria-expanded={catalogMenuOpen}
              className={`relative py-1.5 transition-colors group select-none cursor-pointer ${
                catalogMenuOpen || pathname?.startsWith('/catalog')
                  ? 'text-white'
                  : 'text-[#D7D9DB] hover:text-white'
              }`}
            >
              <span>Каталог</span>
              <span
                className={`absolute bottom-0 left-0 h-[2px] w-full bg-simona-teal transition-transform duration-300 origin-left ${
                  catalogMenuOpen || pathname?.startsWith('/catalog')
                    ? 'scale-x-100'
                    : 'scale-x-0 group-hover:scale-x-100'
                }`}
              />
            </button>

            {/* 2. Акции (белый текст, винный ховер/актив) */}
            <Link
              href="/promos"
              className="relative py-1.5 text-white transition-colors group select-none"
            >
              <span>Акции</span>
              <span
                className={`absolute bottom-0 left-0 h-[2px] w-full bg-simona-wine transition-transform duration-300 origin-left ${
                  pathname?.startsWith('/promos')
                    ? 'scale-x-100'
                    : 'scale-x-0 group-hover:scale-x-100'
                }`}
              />
            </Link>

            {/* 3. Дизайнерам */}
            <Link
              href="/designers"
              className={`relative py-1.5 transition-colors group select-none ${
                pathname?.startsWith('/designers')
                  ? 'text-white'
                  : 'text-[#D7D9DB] hover:text-white'
              }`}
            >
              <span>Дизайнерам</span>
              <span
                className={`absolute bottom-0 left-0 h-[2px] w-full bg-simona-teal transition-transform duration-300 origin-left ${
                  pathname?.startsWith('/designers')
                    ? 'scale-x-100'
                    : 'scale-x-0 group-hover:scale-x-100'
                }`}
              />
            </Link>

            {/* 4. Опт */}
            <Link
              href="/opt"
              className={`relative py-1.5 transition-colors group select-none ${
                pathname?.startsWith('/opt')
                  ? 'text-white'
                  : 'text-[#D7D9DB] hover:text-white'
              }`}
            >
              <span>Опт</span>
              <span
                className={`absolute bottom-0 left-0 h-[2px] w-full bg-simona-teal transition-transform duration-300 origin-left ${
                  pathname?.startsWith('/opt')
                    ? 'scale-x-100'
                    : 'scale-x-0 group-hover:scale-x-100'
                }`}
              />
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
          {/* Main 4 Navigation Links */}
          <div className="flex flex-col gap-0.5 border-b border-[#2B313A] pb-2">
            <button
              type="button"
              onClick={() => {
                handleMobileMenuToggle(false);
                handleCatalogMenuToggle(true);
              }}
              className="w-full flex items-center justify-between py-2 text-sm font-medium text-[#D7D9DB] hover:text-white transition-colors"
            >
              <span>Каталог</span>
              <span className="text-xs text-simona-teal">Все разделы →</span>
            </button>
            <Link
              href="/promos"
              onClick={() => handleMobileMenuToggle(false)}
              className="flex items-center justify-between py-2 text-sm font-medium text-white hover:text-simona-wine transition-colors"
            >
              <span>Акции</span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-simona-wine/20 text-simona-wine border border-simona-wine/40">
                Спецпредложения
              </span>
            </Link>
            <Link
              href="/designers"
              onClick={() => handleMobileMenuToggle(false)}
              className="py-2 text-sm font-medium text-[#D7D9DB] hover:text-white transition-colors"
            >
              Дизайнерам
            </Link>
            <Link
              href="/opt"
              onClick={() => handleMobileMenuToggle(false)}
              className="py-2 text-sm font-medium text-[#D7D9DB] hover:text-white transition-colors"
            >
              Опт
            </Link>
          </div>

          {/* Showroom Contacts & Booking Card */}
          <div className="p-3.5 rounded-xl bg-[#1E2228] border border-[#2B313A] space-y-2.5 text-xs text-[#87888A]">
            <div className="text-[11px] font-semibold text-[#D7D9DB]">Салоны в Нижнем Новгороде:</div>
            <div className="space-y-1">
              <div className="text-white flex items-center justify-between">
                <span>ул. Белинского, 15</span>
                <span className="text-[11px] text-[#87888A]">Флагман</span>
              </div>
              <div className="text-white flex items-center justify-between">
                <span>ул. Белинского, 11/66</span>
                <span className="text-[11px] text-[#87888A]">Omoikiri & Körting</span>
              </div>
            </div>
            <div className="pt-1.5 border-t border-[#2B313A]/60 flex items-center justify-between">
              <a href="tel:+78314237600" className="text-white font-medium hover:text-simona-teal transition-colors">
                (831) 423 76 00
              </a>
              <span className="text-[11px]">Ежедневно 10:00 – 20:00</span>
            </div>
            <Link
              href="/showrooms#booking"
              onClick={() => handleMobileMenuToggle(false)}
              className="block w-full mt-1.5 py-2 rounded-xl bg-simona-teal text-white text-xs font-semibold tracking-wide text-center hover:bg-simona-teal-hover transition-colors"
            >
              Записаться на визит в салон
            </Link>
          </div>
        </div>
      )}

      {/* Mega-Menu Dropdown (Header-Anchored, 100% genuine taxonomy) */}
      <CatalogMegaMenu
        isOpen={catalogMenuOpen}
        onClose={() => handleCatalogMenuToggle(false)}
      />
    </header>
  );
}

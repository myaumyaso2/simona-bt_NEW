'use client';

import React, { useState, useEffect, useRef } from 'react';
import { UmbrellaBar } from './UmbrellaBar';
import { Header } from './Header';

export function HeaderContainer() {
  const [showUmbrella, setShowUmbrella] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const lastScrollYRef = useRef(0);
  const turnPointRef = useRef(0);
  const isScrollingDownRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScrollPos = (scrollY: number) => {
      const currentScrollY = Math.max(0, scrollY);
      const lastScrollY = lastScrollYRef.current;
      const delta = currentScrollY - lastScrollY;

      setIsScrolled(currentScrollY > 20);

      // At the top of the page, UmbrellaBar is always visible
      if (currentScrollY <= 20) {
        setShowUmbrella(true);
        isScrollingDownRef.current = false;
        turnPointRef.current = currentScrollY;
        lastScrollYRef.current = currentScrollY;
        return;
      }

      // If mobile menu is open, keep UmbrellaBar visible
      if (isMobileMenuOpen) {
        setShowUmbrella(true);
        lastScrollYRef.current = currentScrollY;
        return;
      }

      // Detect direction switch & thresholds
      if (delta > 0) {
        // Scrolling DOWN
        if (!isScrollingDownRef.current) {
          isScrollingDownRef.current = true;
          turnPointRef.current = lastScrollY;
        }

        if (currentScrollY - turnPointRef.current > 8 || delta > 8) {
          setShowUmbrella(false);
        }
      } else if (delta < 0) {
        // Scrolling UP
        if (isScrollingDownRef.current) {
          isScrollingDownRef.current = false;
          turnPointRef.current = lastScrollY;
        }

        // Reveal when scrolled up by > 15px threshold
        if (turnPointRef.current - currentScrollY > 15 || delta < -15) {
          setShowUmbrella(true);
        }
      }

      lastScrollYRef.current = currentScrollY;
    };

    const nativeHandler = () => {
      handleScrollPos(window.scrollY);
    };

    window.addEventListener('scroll', nativeHandler, { passive: true });

    const lenis = (window as any).__simonaLenis;
    const lenisHandler = (e: any) => {
      handleScrollPos(typeof e?.scroll === 'number' ? e.scroll : window.scrollY);
    };

    if (lenis) {
      lenis.on('scroll', lenisHandler);
    }

    return () => {
      window.removeEventListener('scroll', nativeHandler);
      if (lenis) {
        lenis.off('scroll', lenisHandler);
      }
    };
  }, [isMobileMenuOpen]);

  return (
    <div
      className={`sticky top-0 z-50 w-full transition-transform duration-300 ease-out will-change-transform ${
        !showUmbrella ? '-translate-y-[36px]' : 'translate-y-0'
      }`}
    >
      <UmbrellaBar />
      <Header onMobileMenuToggle={setIsMobileMenuOpen} isScrolled={isScrolled} />
    </div>
  );
}

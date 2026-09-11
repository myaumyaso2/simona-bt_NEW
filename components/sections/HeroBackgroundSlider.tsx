'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface HeroBackgroundSliderProps {
  desktopImages: string[];
  mobileImages: string[];
  slideDuration?: number; // duration of each slide in seconds (default: 7.5s)
  fadeDuration?: number; // crossfade duration in seconds (default: 1.8s)
}

export function HeroBackgroundSlider({
  desktopImages,
  mobileImages,
  slideDuration = 7.5,
  fadeDuration = 1.8,
}: HeroBackgroundSliderProps) {
  const [isPortrait, setIsPortrait] = useState(false);
  const plane1Ref = useRef<HTMLDivElement>(null);
  const plane2Ref = useRef<HTMLDivElement>(null);

  // Monitor screen orientation & mobile viewport
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px), (orientation: portrait)');
    const updateOrientation = () => setIsPortrait(mql.matches);
    updateOrientation();

    mql.addEventListener('change', updateOrientation);
    return () => mql.removeEventListener('change', updateOrientation);
  }, []);

  // GSAP Double-Buffered Ken Burns & Dissolve Slider
  useEffect(() => {
    const images = isPortrait ? mobileImages : desktopImages;
    if (!images || images.length === 0) return;

    const p1 = plane1Ref.current;
    const p2 = plane2Ref.current;
    if (!p1 || !p2) return;

    // Helper to preload image into browser cache
    const preloadImage = (url: string) => {
      const img = new Image();
      img.src = url;
    };

    // Preload all slides in background
    images.forEach(preloadImage);

    // Initial setup:
    // Plane 1 shows first image, scale 1.0, opacity 1
    p1.style.backgroundImage = `url('${images[0]}')`;
    gsap.killTweensOf([p1, p2]);
    gsap.set(p1, { opacity: 1, scale: 1.0 });

    if (images.length === 1) {
      gsap.set(p2, { opacity: 0 });
      return;
    }

    // Plane 2 prepares next image
    p2.style.backgroundImage = `url('${images[1 % images.length]}')`;
    gsap.set(p2, { opacity: 0, scale: 1.0 });

    let currentIndex = 0;
    let activePlane = 1; // 1 or 2
    let isCancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    // Start gentle Ken Burns on active plane
    gsap.to(p1, {
      scale: 1.05,
      duration: slideDuration,
      ease: 'sine.out',
    });

    const transitionToNext = () => {
      if (isCancelled) return;

      const nextIndex = (currentIndex + 1) % images.length;
      const currentPlaneEl = activePlane === 1 ? p1 : p2;
      const nextPlaneEl = activePlane === 1 ? p2 : p1;

      // Assign the incoming slide to the dormant plane and reset its scale
      nextPlaneEl.style.backgroundImage = `url('${images[nextIndex]}')`;
      gsap.set(nextPlaneEl, { scale: 1.0 });

      // Crossfade: fade in incoming plane, fade out current plane
      gsap.to(currentPlaneEl, {
        opacity: 0,
        duration: fadeDuration,
        ease: 'power1.inOut',
      });

      gsap.to(nextPlaneEl, {
        opacity: 1,
        duration: fadeDuration,
        ease: 'power1.inOut',
      });

      // Ken Burns zoom on incoming plane
      gsap.to(nextPlaneEl, {
        scale: 1.05,
        duration: slideDuration,
        ease: 'sine.out',
      });

      // Switch active plane and advance index
      activePlane = activePlane === 1 ? 2 : 1;
      currentIndex = nextIndex;

      // Preload following slide
      const upcomingIndex = (currentIndex + 1) % images.length;
      preloadImage(images[upcomingIndex]);

      // Schedule subsequent transition
      const intervalMs = Math.max(1000, (slideDuration - fadeDuration) * 1000);
      timeoutId = setTimeout(transitionToNext, intervalMs);
    };

    const firstIntervalMs = Math.max(1000, (slideDuration - fadeDuration) * 1000);
    timeoutId = setTimeout(transitionToNext, firstIntervalMs);

    return () => {
      isCancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
      gsap.killTweensOf([p1, p2]);
    };
  }, [isPortrait, desktopImages, mobileImages, slideDuration, fadeDuration]);

  // Initial SSR fallback image
  const defaultInitialImage = desktopImages[0] || '/hero/hero_bg_real.webp';

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Plane 1 */}
      <div
        ref={plane1Ref}
        className="absolute inset-0 bg-cover bg-[center_right_20%] lg:bg-center filter contrast-[1.08] brightness-[1.04] saturate-[1.06] will-change-transform"
        style={{
          backgroundImage: `url('${defaultInitialImage}')`,
          opacity: 1,
        }}
      />
      {/* Plane 2 */}
      <div
        ref={plane2Ref}
        className="absolute inset-0 bg-cover bg-[center_right_20%] lg:bg-center filter contrast-[1.08] brightness-[1.04] saturate-[1.06] will-change-transform"
        style={{
          opacity: 0,
        }}
      />
    </div>
  );
}

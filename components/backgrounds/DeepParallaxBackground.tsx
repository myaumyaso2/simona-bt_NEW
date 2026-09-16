'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { SimonaIconMark } from '@/components/brand/SimonaIcons';

interface DeepParallaxBackgroundProps {
  className?: string;
  opacity?: number;
}

export function DeepParallaxBackground({
  className = '',
  opacity = 1,
}: DeepParallaxBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const layerBackRef = useRef<HTMLDivElement>(null);
  const layerMidRef = useRef<HTMLDivElement>(null);
  const layerFrontRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Ambient floating breath
    const ctx = gsap.context(() => {
      if (layerBackRef.current) {
        gsap.to(layerBackRef.current.children, {
          y: '+=18',
          rotation: '+=3',
          duration: 6,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          stagger: 0.6,
        });
      }
      if (layerMidRef.current) {
        gsap.to(layerMidRef.current.children, {
          y: '-=22',
          rotation: '-=4',
          duration: 7,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          stagger: 0.8,
        });
      }
    }, container);

    const targetEl = container.parentElement || container;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;

      // Multi-layer 3D depth parallax
      if (layerBackRef.current) {
        gsap.to(layerBackRef.current, {
          x: -nx * 30,
          y: -ny * 30,
          duration: 0.6,
          ease: 'power2.out',
        });
      }
      if (layerMidRef.current) {
        gsap.to(layerMidRef.current, {
          x: nx * 55,
          y: ny * 55,
          rotationY: nx * 10,
          duration: 0.45,
          ease: 'power2.out',
        });
      }
      if (layerFrontRef.current) {
        gsap.to(layerFrontRef.current, {
          x: -nx * 85,
          y: -ny * 85,
          rotationY: -nx * 14,
          duration: 0.38,
          ease: 'power2.out',
        });
      }
    };

    const handleMouseLeave = () => {
      [layerBackRef.current, layerMidRef.current, layerFrontRef.current].forEach(
        (l) => {
          if (l) {
            gsap.to(l, {
              x: 0,
              y: 0,
              rotationY: 0,
              duration: 0.9,
              ease: 'power3.out',
            });
          }
        }
      );
    };

    targetEl.addEventListener('mousemove', handleMouseMove);
    targetEl.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      ctx.revert();
      targetEl.removeEventListener('mousemove', handleMouseMove);
      targetEl.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ opacity, perspective: 1000 }}
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none z-0 ${className}`}
    >
      {/* Background layer (Depth 0.03): Monumental soft architectural marks */}
      <div
        ref={layerBackRef}
        className="absolute inset-0 pointer-events-none will-change-transform"
      >
        <SimonaIconMark className="absolute -top-16 -left-20 w-[540px] h-[390px] text-simona-teal/[0.08] blur-[2px]" />
        <SimonaIconMark className="absolute top-1/3 -right-24 w-[600px] h-[430px] text-white/[0.05] blur-[3px]" />
        <SimonaIconMark className="absolute -bottom-24 -left-16 w-[560px] h-[400px] text-simona-teal/[0.07] blur-[2px]" />
      </div>

      {/* Mid layer (Depth 0.06): Architectural precision watermarks */}
      <div
        ref={layerMidRef}
        className="absolute inset-0 pointer-events-none will-change-transform"
      >
        <SimonaIconMark className="absolute top-1/4 right-[15%] w-[340px] h-[245px] text-simona-teal/[0.11]" />
        <SimonaIconMark className="absolute top-2/3 left-[10%] w-[320px] h-[230px] text-[#87888A]/[0.10]" />
        <SimonaIconMark className="absolute bottom-16 right-1/4 w-[300px] h-[215px] text-simona-teal/[0.09]" />
      </div>

      {/* Foreground ambient layer (Depth 0.10): Crisp subtle luxury accents */}
      <div
        ref={layerFrontRef}
        className="absolute inset-0 pointer-events-none will-change-transform"
      >
        <SimonaIconMark className="absolute top-12 left-1/2 -translate-x-1/2 w-[240px] h-[175px] text-simona-teal/[0.14] drop-shadow-[0_0_35px_rgba(0,181,186,0.18)]" />
        <SimonaIconMark className="absolute top-1/2 right-[8%] w-[260px] h-[190px] text-simona-teal/[0.12] drop-shadow-[0_0_25px_rgba(0,181,186,0.14)]" />
      </div>
    </div>
  );
}

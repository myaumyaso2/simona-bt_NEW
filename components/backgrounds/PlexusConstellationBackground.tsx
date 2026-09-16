'use client';

import React, { useEffect, useRef } from 'react';

interface PlexusConstellationBackgroundProps {
  className?: string;
  nodeCount?: number;
  maxDist?: number;
  mouseRadius?: number;
  fadeBottom?: boolean;
  fadeTop?: boolean;
  opacity?: number;
}

export function PlexusConstellationBackground({
  className = '',
  nodeCount = 36,
  maxDist = 140,
  mouseRadius = 220,
  fadeBottom = false,
  fadeTop = false,
  opacity = 1,
}: PlexusConstellationBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = container.clientWidth);
    let height = (canvas.height = container.clientHeight);

    let mouseX = -1000;
    let mouseY = -1000;
    let isHovered = false;

    // Dual-loop Simona vector monogram from Figma 4350:92
    const path1 = new Path2D(
      'M456.922 0.0789557H456.134C447.142 0.0789557 439.807 7.42026 439.807 16.4193V16.4982V87.4642V87.5431C439.807 96.3843 446.905 103.489 455.66 103.805V103.883C522.862 106.015 541.161 129.302 541.161 199.399V282.838C541.161 356.567 520.969 379.38 444.697 379.38H332.852H221.007C144.735 379.38 124.544 356.567 124.544 282.838V199.32C124.544 129.302 142.842 106.015 210.044 103.805V103.726C218.799 103.489 225.898 96.3843 225.898 87.4642V87.3853V16.4193V16.3403C225.898 7.34131 218.562 0 209.571 0H208.782C50.8743 0 0 50.9156 0 178.244V304.625C0 431.953 50.8743 482 208.782 482H332.931H457.08C614.988 482 665.862 431.953 665.862 304.625V178.244C665.704 50.9945 614.83 0.0789557 456.922 0.0789557Z'
    );
    const path2 = new Path2D(
      'M379.074 0.0782125H286.475C277.641 0.0782125 270.463 7.26164 270.463 16.1028V53.5198V234.684V272.101C270.463 280.943 277.641 288.126 286.475 288.126H379.074C387.908 288.126 395.085 280.943 395.085 272.101V234.684V53.4408V16.0238C395.085 7.26162 387.908 0.0782125 379.074 0.0782125Z'
    );

    const nodes = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      scale: 0.032 + Math.random() * 0.014,
      baseAlpha: 0.22 + Math.random() * 0.15,
    }));

    const handleResize = () => {
      if (!container || !canvas) return;
      width = canvas.width = container.clientWidth;
      height = canvas.height = container.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Track mouse on section parent so cards and text do not block interaction
    const targetEl = container.parentElement || container;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      isHovered = true;
    };

    const handleMouseLeave = () => {
      isHovered = false;
      mouseX = -1000;
      mouseY = -1000;
    };

    targetEl.addEventListener('mousemove', handleMouseMove);
    targetEl.addEventListener('mouseleave', handleMouseLeave);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 15 || n.x > width - 15) n.vx *= -1;
        if (n.y < 15 || n.y > height - 15) n.vy *= -1;

        // Interaction with cursor
        if (isHovered) {
          const dx = mouseX - n.x;
          const dy = mouseY - n.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouseRadius && dist > 1) {
            const pull = (1 - dist / mouseRadius) * 0.45;
            n.x += (dx / dist) * pull;
            n.y += (dy / dist) * pull;

            // Connecting laser strand to cursor
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(mouseX, mouseY);
            ctx.strokeStyle = `rgba(0, 181, 186, ${(1 - dist / mouseRadius) * 0.6})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }

        // Connecting strands between neighboring nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n.x - n2.x;
          const dy = n.y - n2.y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.28;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.strokeStyle = `rgba(0, 151, 156, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Draw Simona vector monogram
        ctx.save();
        ctx.translate(n.x - 10, n.y - 7);
        ctx.scale(n.scale, n.scale);

        const distToMouse = Math.hypot(mouseX - n.x, mouseY - n.y);
        const alpha =
          isHovered && distToMouse < mouseRadius
            ? Math.min(0.9, n.baseAlpha + (1 - distToMouse / mouseRadius) * 0.6)
            : n.baseAlpha;

        ctx.fillStyle = `rgba(0, 181, 186, ${alpha})`;
        if (alpha > 0.4) {
          ctx.shadowColor = 'rgba(0, 181, 186, 0.6)';
          ctx.shadowBlur = 8;
        }
        ctx.fill(path1);
        ctx.fill(path2);
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      targetEl.removeEventListener('mousemove', handleMouseMove);
      targetEl.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [nodeCount, maxDist, mouseRadius]);

  const maskStyle: React.CSSProperties = {};
  if (fadeBottom && fadeTop) {
    maskStyle.maskImage = 'linear-gradient(to bottom, transparent 0%, black 20%, black 75%, transparent 100%)';
    maskStyle.WebkitMaskImage = 'linear-gradient(to bottom, transparent 0%, black 20%, black 75%, transparent 100%)';
  } else if (fadeBottom) {
    maskStyle.maskImage = 'linear-gradient(to bottom, black 0%, black 60%, transparent 100%)';
    maskStyle.WebkitMaskImage = 'linear-gradient(to bottom, black 0%, black 60%, transparent 100%)';
  } else if (fadeTop) {
    maskStyle.maskImage = 'linear-gradient(to bottom, transparent 0%, black 40%, black 100%)';
    maskStyle.WebkitMaskImage = 'linear-gradient(to bottom, transparent 0%, black 40%, black 100%)';
  }

  return (
    <div
      ref={containerRef}
      style={{ opacity, ...maskStyle }}
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none z-0 ${className}`}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}

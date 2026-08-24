import React from 'react';

export interface SimonaPatternProps {
  variant?: 'white' | 'teal' | 'dark' | 'wine' | 'subtle';
  opacity?: number;
  className?: string;
  size?: number | string;
}

/**
 * Аутентичный фирменный паттерн СИМОНА из Figma Brandbook (ноды 1236:59605 & 2103:2483 / Фреймы 61 и 62).
 * Сетка из фирменных монограмм/знаков СИМОНА со ступенчатым смещением и мягкими тенями.
 */
export function SimonaPatternOverlay({
  variant = 'subtle',
  opacity = 0.04,
  className = '',
  size = '320px',
}: SimonaPatternProps) {
  let bgImage = '/brand/pattern-white.svg';

  switch (variant) {
    case 'teal':
      bgImage = '/brand/pattern-teal.svg';
      break;
    case 'dark':
      bgImage = '/brand/pattern-dark.svg';
      break;
    case 'wine':
      bgImage = '/brand/pattern-white.svg';
      break;
    case 'white':
    case 'subtle':
    default:
      bgImage = '/brand/pattern-white.svg';
      break;
  }

  const bgSize = typeof size === 'number' ? `${size}px` : size;

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <div
        className="w-full h-full bg-repeat bg-center"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: bgSize,
        }}
      />
    </div>
  );
}

/**
 * 3D Изометрическая фирменная графика СИМОНА (Figma Brandbook Node 1236:59605 / Frame 61)
 * Фирменный объемный бирюзовый знак с градиентным свечением и вдавленной сеткой.
 */
export function Simona3DArtwork({ className = '' }: { className?: string }) {
  return (
    <div className={`relative rounded-3xl overflow-hidden shadow-2xl ${className}`}>
      <img
        src="/brand/pattern-3d-showcase.png"
        alt="СИМОНА Фирменная 3D графика"
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  );
}

/**
 * Декоративный триптих фирменного паттерна (Белый / Темный / Бирюзовый)
 */
export function SimonaPatternTriptych({ className = '' }: { className?: string }) {
  return (
    <div className={`relative rounded-2xl overflow-hidden shadow-lg ${className}`}>
      <img
        src="/brand/pattern-triptych.png"
        alt="СИМОНА Палитра паттерна"
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  );
}

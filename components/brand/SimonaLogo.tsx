import React from 'react';

interface SimonaLogoProps {
  variant?: 'white' | 'dark' | 'teal';
  descriptor?: 'bt' | 'kitchens' | 'bt_kitchens' | 'none';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function SimonaLogo({
  variant = 'white',
  descriptor = 'bt',
  className = '',
  size = 'md'
}: SimonaLogoProps) {
  const isWhite = variant === 'white';
  const isTeal = variant === 'teal';

  const textColor = isTeal ? '#00979C' : isWhite ? '#FFFFFF' : '#111315';
  const accentColor = '#00979C';
  const descColor = isWhite ? '#94A3B8' : '#717C83';

  // Sizing maps
  const heightMap = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10'
  };

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Brand Geometric Icon Mark from Figma */}
      <svg
        className={heightMap[size]}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="36" height="36" rx="8" fill={isWhite ? '#1C2025' : '#F2F3F4'} />
        <path
          d="M23 12C23 12 20.5 10 18 10C14.5 10 12 12.2 12 15C12 20 24 16.5 24 21.5C24 24.5 21 26 17.5 26C14 26 12 24 12 24"
          stroke={accentColor}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="25.5" cy="10.5" r="2" fill={accentColor} />
      </svg>

      {/* Brand Typography & Descriptor */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center leading-none">
          <span
            className={`font-montserrat font-bold tracking-[0.16em] leading-none ${
              size === 'sm' ? 'text-lg' : size === 'md' ? 'text-2xl' : 'text-3xl'
            }`}
            style={{ color: textColor }}
          >
            СИМОНА
          </span>
          <span className="w-1.5 h-1.5 rounded-full ml-1" style={{ backgroundColor: accentColor }} />
        </div>

        {descriptor !== 'none' && (
          <span
            className={`font-montserrat tracking-[0.24em] uppercase font-semibold mt-1 leading-tight ${
              size === 'sm' ? 'text-[8px]' : 'text-[9px]'
            }`}
            style={{ color: descColor }}
          >
            {descriptor === 'bt' && 'Бытовая техника'}
            {descriptor === 'kitchens' && 'Кухни и мебель'}
            {descriptor === 'bt_kitchens' && 'Техника & Кухни'}
          </span>
        )}
      </div>
    </div>
  );
}

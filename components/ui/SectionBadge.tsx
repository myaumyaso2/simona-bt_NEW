import React, { forwardRef } from 'react';

export interface SectionBadgeProps {
  children?: React.ReactNode;
  text?: string;
  variant?: 'teal' | 'wine';
  className?: string;
  pulse?: boolean;
}

export const SectionBadge = forwardRef<HTMLDivElement, SectionBadgeProps>(
  ({ children, text, variant = 'teal', className = '', pulse = true }, ref) => {
    const isWine = variant === 'wine';

    return (
      <div
        ref={ref}
        className={`inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-md bg-[#16191D]/90 backdrop-blur-md shadow-md ${
          isWine ? 'border border-simona-wine/40' : 'border border-[#2B313A]'
        } ${className}`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
            isWine
              ? 'bg-simona-wine shadow-[0_0_8px_rgba(138,21,26,0.9)]'
              : 'bg-simona-teal shadow-[0_0_8px_rgba(0,151,156,0.85)]'
          } ${pulse ? 'animate-pulse' : ''}`}
        />
        <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.12em] uppercase text-[#D7D9DB] select-none">
          {children || text}
        </span>
      </div>
    );
  }
);

SectionBadge.displayName = 'SectionBadge';

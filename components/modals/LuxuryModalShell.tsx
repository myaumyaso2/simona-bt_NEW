'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { SectionBadge } from '@/components/ui/SectionBadge';

export interface LuxuryModalShellProps {
  isOpen: boolean;
  onClose: () => void;
  maxWidth?: string;
  badgeText?: string;
  badgeVariant?: 'teal' | 'wine';
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function LuxuryModalShell({
  isOpen,
  onClose,
  maxWidth = 'max-w-lg',
  badgeText,
  badgeVariant = 'teal',
  title,
  subtitle,
  children,
  className = '',
}: LuxuryModalShellProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          {/* Backdrop with motion blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            ref={containerRef}
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
            className={`relative w-full ${maxWidth} rounded-3xl bg-[#16191D] border border-[#2B313A] shadow-2xl p-6 sm:p-8 text-white z-10 my-auto ${className}`}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-9 h-9 rounded-xl border border-[#2B313A] text-[#87888A] hover:text-white hover:bg-[#1E2228] flex items-center justify-center transition cursor-pointer"
              aria-label="Закрыть"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Optional Header Section */}
            {(badgeText || title || subtitle) && (
              <div className="mb-5 sm:mb-6 pr-8">
                {badgeText && (
                  <div className="mb-2.5">
                    <SectionBadge variant={badgeVariant}>{badgeText}</SectionBadge>
                  </div>
                )}
                {title && (
                  <h3 className="text-xl sm:text-2xl font-montserrat font-bold text-white tracking-tight">
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p className="text-xs sm:text-sm text-[#87888A] font-normal mt-1 leading-relaxed">
                    {subtitle}
                  </p>
                )}
              </div>
            )}

            {/* Modal Body */}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

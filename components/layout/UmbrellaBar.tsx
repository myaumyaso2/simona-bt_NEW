'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';
import {
  SimonaIconPin,
  SimonaIconClock,
  SimonaIconPhoneSolid,
} from '@/components/brand/SimonaIcons';

export function UmbrellaBar() {
  const kuhniUrl = process.env.NEXT_PUBLIC_KUHNI_URL || 'https://simona-kuhni.ru';

  return (
    <div className="bg-[#0B0C0E] border-b border-[#2B313A] text-xs text-[#87888A] select-none z-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between">
        {/* Umbrella Brand Switcher */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-[#1E2228] border border-[#2B313A]/60">
            <span className="w-1.5 h-1.5 rounded-full bg-simona-teal shadow-[0_0_8px_rgba(0,151,156,0.6)]"></span>
            <span className="text-white text-[11px] font-semibold tracking-wide">Бытовая техника</span>
          </div>
          <a
            href={kuhniUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-[#87888A] hover:text-white transition-colors text-[11px] font-medium group"
          >
            <span>Кухни и мебель</span>
            <ExternalLink className="w-2.5 h-2.5 text-[#87888A] group-hover:text-white transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>

        {/* Address, Schedule & Phone */}
        <div className="flex items-center space-x-5 lg:space-x-6 text-[11px]">
          {/* Address with Yandex Maps Link (Organization Card) */}
          <a
            href="https://yandex.ru/maps/-/CTh94C5D"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-[#87888A] hover:text-white transition-colors group"
            title="Открыть салон «СИМОНА» на Яндекс.Картах"
          >
            <SimonaIconPin className="w-3.5 h-3.5 text-simona-teal shrink-0 group-hover:scale-110 transition-transform" />
            <span>Нижний Новгород, Белинского 15</span>
          </a>

          {/* Schedule with Figma Clock Icon */}
          <div className="hidden md:inline-flex items-center gap-1.5 text-[#87888A]">
            <SimonaIconClock className="w-3.5 h-3.5 text-simona-teal shrink-0" />
            <span>Ежедневно с 10:00 до 20:00</span>
          </div>

          {/* Phone in the far right corner with solid turquoise handset */}
          <a
            href="tel:+78314237600"
            className="flex items-center space-x-1.5 text-white hover:text-simona-teal transition-colors font-medium text-[12px] whitespace-nowrap shrink-0 group"
          >
            <SimonaIconPhoneSolid className="w-3 h-3 text-simona-teal shrink-0 group-hover:scale-110 transition-transform" />
            <span>(831) 423&nbsp;76&nbsp;00</span>
          </a>
        </div>
      </div>
    </div>
  );
}

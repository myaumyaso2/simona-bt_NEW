'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Clock, ExternalLink } from 'lucide-react';

export function UmbrellaBar() {
  const kuhniUrl = process.env.NEXT_PUBLIC_KUHNI_URL || 'https://simona-kuhni.ru';

  return (
    <div className="bg-[#F2F3F4] border-b border-black/[0.06] text-xs text-[#6E7074] select-none z-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-10 flex items-center justify-between">
        {/* Umbrella Brand Switcher */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          <span className="text-[#87888A] text-[10px] uppercase tracking-wider mr-1 hidden md:inline font-semibold">
            Группа СИМОНА:
          </span>
          <div className="flex items-center bg-white rounded-full p-0.5 border border-black/[0.06] shadow-sm">
            <span className="flex items-center px-3 py-1 rounded-full text-simona-teal bg-simona-teal/[0.1] font-semibold text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-simona-teal mr-1.5 animate-pulse"></span>
              Бытовая техника
            </span>
            <a
              href={kuhniUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-3 py-1 rounded-full text-[#6E7074] hover:text-[#16181B] hover:bg-black/[0.03] transition-colors text-[11px] font-medium group"
            >
              Кухни и мебель
              <ExternalLink className="w-3 h-3 ml-1 text-[#87888A] group-hover:text-[#16181B] transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>

        {/* Salons & Hours */}
        <div className="hidden lg:flex items-center space-x-6 text-[11px]">
          <div className="flex items-center space-x-1.5 text-[#3E3D40]">
            <MapPin className="w-3.5 h-3.5 text-simona-teal" />
            <span>ул. Белинского, 15 <span className="text-[#87888A]">(Флагман / Активная кухня)</span></span>
          </div>
          <div className="flex items-center space-x-1.5 text-[#3E3D40]">
            <MapPin className="w-3.5 h-3.5 text-simona-teal" />
            <span>ул. Белинского, 11/66 <span className="text-[#87888A]">(OMOIKIRI & KÖRTING)</span></span>
          </div>
          <div className="flex items-center space-x-1.5 text-[#6E7074]">
            <Clock className="w-3.5 h-3.5 text-[#87888A]" />
            <span>10:00 – 20:00</span>
          </div>
        </div>

        {/* Contact info & Telegram */}
        <div className="flex items-center space-x-4">
          <a
            href="tel:+78312170015"
            className="flex items-center space-x-1.5 text-[#16181B] hover:text-simona-teal transition-colors font-semibold text-[12px]"
          >
            <Phone className="w-3.5 h-3.5 text-simona-teal" />
            <span>+7 (831) 217-00-15</span>
          </a>
          <a
            href="https://t.me/simona_bt_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full bg-white text-[#3E3D40] hover:text-simona-teal hover:border-simona-teal transition text-[11px] font-medium border border-black/[0.08] shadow-sm"
          >
            Telegram
          </a>
        </div>
      </div>
    </div>
  );
}

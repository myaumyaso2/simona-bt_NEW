'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Clock, ExternalLink } from 'lucide-react';

export function UmbrellaBar() {
  const kuhniUrl = process.env.NEXT_PUBLIC_KUHNI_URL || 'https://simona-kuhni.ru';

  return (
    <div className="bg-[#090A0C] border-b border-zinc-800/80 text-xs text-zinc-400 select-none z-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-10 flex items-center justify-between">
        {/* Umbrella Brand Switcher */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          <span className="text-zinc-500 text-[10px] uppercase tracking-wider mr-1 hidden md:inline">
            Группа СИМОНА:
          </span>
          <div className="flex items-center bg-zinc-900/90 rounded-full p-0.5 border border-zinc-800">
            <span className="flex items-center px-3 py-1 rounded-full text-white bg-simona-teal/20 text-simona-teal font-medium text-[11px] shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-simona-teal mr-1.5 animate-pulse"></span>
              Бытовая техника
            </span>
            <a
              href={kuhniUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-3 py-1 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors text-[11px] group"
            >
              Кухни и мебель
              <ExternalLink className="w-3 h-3 ml-1 text-zinc-500 group-hover:text-zinc-300 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>

        {/* Salons & Hours */}
        <div className="hidden lg:flex items-center space-x-6 text-[11px]">
          <div className="flex items-center space-x-1.5 text-zinc-300">
            <MapPin className="w-3.5 h-3.5 text-simona-teal" />
            <span>ул. Белинского, 15 <span className="text-zinc-500">(Флагман / Активная кухня)</span></span>
          </div>
          <div className="flex items-center space-x-1.5 text-zinc-300">
            <MapPin className="w-3.5 h-3.5 text-simona-teal" />
            <span>ул. Белинского, 11/66 <span className="text-zinc-500">(OMOIKIRI & KÖRTING)</span></span>
          </div>
          <div className="flex items-center space-x-1.5 text-zinc-400">
            <Clock className="w-3.5 h-3.5 text-zinc-500" />
            <span>10:00 – 20:00</span>
          </div>
        </div>

        {/* Contact info & Telegram */}
        <div className="flex items-center space-x-4">
          <a
            href="tel:+78312170015"
            className="flex items-center space-x-1.5 text-zinc-200 hover:text-simona-teal transition-colors font-medium text-[12px]"
          >
            <Phone className="w-3.5 h-3.5 text-simona-teal" />
            <span>+7 (831) 217-00-15</span>
          </a>
          <a
            href="https://t.me/simona_bt_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-300 hover:text-white hover:bg-simona-teal/20 transition text-[11px] border border-zinc-700/50"
          >
            Telegram
          </a>
        </div>
      </div>
    </div>
  );
}

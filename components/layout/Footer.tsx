'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Send, Clock, ShieldCheck } from 'lucide-react';
import { useStore } from '@/components/providers/StoreContext';

export function Footer() {
  const { openModal } = useStore();
  const kuhniUrl = process.env.NEXT_PUBLIC_KUHNI_URL || 'https://simona-kuhni.ru';

  return (
    <footer className="bg-[#08090A] border-t border-zinc-900 text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: Brand & Tagline */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block">
              <span className="font-serif tracking-widest text-3xl font-light text-white hover:text-simona-teal transition-colors">
                СИМОНА
              </span>
            </Link>
            <p className="mt-4 text-xs text-zinc-400 font-light max-w-sm leading-relaxed">
              Премиальный интернет-бутик и digital-витрина салонов встраиваемой бытовой техники в Нижнем Новгороде. Официальный партнер Miele, ASKO, Liebherr, SMEG, Bertazzoni, Falmec, OMOIKIRI.
            </p>

            <div className="mt-6 flex items-center space-x-3">
              <a
                href="https://t.me/simona_bt_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-simona-teal/20 text-zinc-300 hover:text-white border border-zinc-800 transition text-[11px] flex items-center"
              >
                <Send className="w-3.5 h-3.5 mr-1.5 text-simona-teal" />
                Telegram-канал СИМОНА
              </a>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-white font-semibold uppercase tracking-wider text-[11px] mb-4">
              Навигация
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="#catalog" className="hover:text-simona-teal transition-colors">
                  Каталог техники
                </Link>
              </li>
              <li>
                <Link href="#active-kitchen" className="hover:text-simona-teal transition-colors text-amber-400/90">
                  🔥 Активная кухня
                </Link>
              </li>
              <li>
                <Link href="#brands" className="hover:text-simona-teal transition-colors">
                  Брендовый атлас
                </Link>
              </li>
              <li>
                <Link href="#lookbook" className="hover:text-simona-teal transition-colors">
                  Lookbook интерьеров
                </Link>
              </li>
              <li>
                <a href={kuhniUrl} target="_blank" rel="noopener noreferrer" className="hover:text-simona-teal transition-colors">
                  Кухни и мебель
                </a>
              </li>
              <li>
                <Link href="#b2b-club" className="hover:text-simona-teal transition-colors text-simona-teal">
                  Клуб дизайнеров (B2B)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Salons */}
          <div>
            <h4 className="text-white font-semibold uppercase tracking-wider text-[11px] mb-4">
              Салоны в Н.Новгороде
            </h4>
            <div className="space-y-4">
              <div>
                <div className="text-zinc-200 font-medium">Флагман СИМОНА</div>
                <div className="text-zinc-400 text-[11px] mt-0.5">ул. Белинского, 15</div>
                <div className="text-zinc-500 text-[10px]">Крупная встройка, «Активная кухня»</div>
              </div>

              <div>
                <div className="text-zinc-200 font-medium">Салон OMOIKIRI & KÖRTING</div>
                <div className="text-zinc-400 text-[11px] mt-0.5">ул. Белинского, 11/66</div>
                <div className="text-zinc-500 text-[10px]">Японские мойки, смесители, встройка</div>
              </div>

              <div className="text-[11px] text-zinc-400 pt-1">
                <Clock className="w-3 h-3 inline mr-1 text-zinc-500" />
                Ежедневно 10:00 – 20:00
              </div>
            </div>
          </div>

          {/* Col 4: Contacts & CTA */}
          <div>
            <h4 className="text-white font-semibold uppercase tracking-wider text-[11px] mb-4">
              Контакты
            </h4>
            <div className="space-y-3">
              <a
                href="tel:+78312170015"
                className="text-base font-serif text-white hover:text-simona-teal transition-colors block"
              >
                +7 (831) 217-00-15
              </a>
              <div className="text-[11px] text-zinc-400">
                Консультации и запись к экспертам
              </div>

              <button
                onClick={() => openModal('SHOWROOM_VISIT')}
                className="w-full mt-2 py-2 px-3 rounded-lg bg-zinc-800 hover:bg-simona-teal hover:text-white text-zinc-200 text-[11px] font-semibold tracking-wide transition border border-zinc-700"
              >
                Забронировать визит
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between text-[11px] text-zinc-500 gap-4">
          <div>
            © {new Date().getFullYear()} Салон бытовой техники «СИМОНА» (simona-bt.ru). Все права защищены.
          </div>
          <div className="flex flex-wrap gap-4 text-zinc-500">
            <span>Политика конфиденциальности (152-ФЗ)</span>
            <span>Оферта интернет-магазина (54-ФЗ)</span>
            <span>Информация не является публичной офертой</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

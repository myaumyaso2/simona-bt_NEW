'use client';

import React from 'react';
import Link from 'next/link';
import { Send, ArrowRight, ExternalLink } from 'lucide-react';
import { useStore } from '@/components/providers/StoreContext';
import { SimonaLogo } from '@/components/brand/SimonaLogo';
import { SimonaPatternOverlay } from '@/components/brand/SimonaPattern';

export function Footer() {
  const { openModal } = useStore();
  const kuhniUrl = process.env.NEXT_PUBLIC_KUHNI_URL || 'https://simona-kuhni.ru';

  return (
    <footer className="relative bg-[#0B0C0E] border-t border-[#2B313A] text-xs text-[#87888A] overflow-hidden">
      {/* Brand Pattern Background */}
      <SimonaPatternOverlay variant="subtle" opacity={0.02} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        {/* 4 Columns Grid per Figma node 1:566 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-[#2B313A]">
          
          {/* Col 1: Brand & Kuhni Direction (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-block">
              <SimonaLogo variant="white" descriptor="bt_kitchens" size="md" />
            </Link>
            
            <p className="text-xs text-[#87888A] leading-relaxed max-w-sm">
              Премиальный интернет-бутик и digital-витрина бытовой техники в Нижнем Новгороде.
            </p>

            <div className="pt-2">
              <a
                href={kuhniUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 text-xs text-simona-teal hover:text-simona-teal-light font-medium group transition-colors"
              >
                <span>НАПРАВЛЕНИЕ МЕБЕЛИ И КУХОНЬ simona-kuhni.ru</span>
                <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>

          {/* Col 2: Salons in NN (3 Cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-white">
              Салоны в Нижнем Новгороде
            </h4>
            
            <div className="space-y-3 text-xs">
              <div>
                <p className="text-white font-medium">Флагман: ул. Белинского, 15</p>
                <a href="tel:+78312170015" className="text-[#87888A] hover:text-simona-teal transition-colors">
                  +7 (831) 217-00-15
                </a>
              </div>

              <div>
                <p className="text-white font-medium">Omoikiri & Körting: Белинского, 11/66</p>
                <a href="tel:+78312170011" className="text-[#87888A] hover:text-simona-teal transition-colors">
                  +7 (831) 217-00-11
                </a>
              </div>

              <div className="pt-1">
                <a
                  href="https://t.me/simona_bt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 text-simona-teal hover:underline font-medium"
                >
                  <Send className="w-3 h-3" />
                  <span>Telegram-консьерж</span>
                </a>
              </div>
            </div>
          </div>

          {/* Col 3: Navigation (2 Cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-white">
              Навигация
            </h4>
            
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/catalog" className="text-[#87888A] hover:text-white transition-colors">
                  Каталог техники
                </Link>
              </li>
              <li>
                <Link href="#brands" className="text-[#87888A] hover:text-white transition-colors">
                  Брендовый атлас
                </Link>
              </li>
              <li>
                <Link href="#service" className="text-[#87888A] hover:text-white transition-colors">
                  Бесплатное хранение
                </Link>
              </li>
              <li>
                <Link href="#service" className="text-[#87888A] hover:text-white transition-colors">
                  Шеф-монтаж
                </Link>
              </li>
              <li>
                <button
                  onClick={() => openModal('QUICK_CONSULT')}
                  className="text-[#87888A] hover:text-white transition-colors text-left"
                >
                  Оплата и согласование
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Designers B2B (3 Cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-white">
              Архитекторам и дизайнерам
            </h4>
            
            <p className="text-xs text-[#87888A] leading-relaxed">
              Специальная программа сотрудничества, выверка схем за 24 часа, база 3D-моделей.
            </p>

            <div className="pt-1">
              <button
                onClick={() => openModal('B2B_CLUB')}
                className="inline-flex items-center space-x-1.5 text-xs text-simona-teal hover:text-simona-teal-light font-medium group transition-colors"
              >
                <span>Перейти в B2B-раздел</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar per Figma */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#87888A]">
          <p>© 2026 Салон бытовой техники «СИМОНА». Все права защищены.</p>

          <div className="flex items-center space-x-6">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert('Политика конфиденциальности: Данные обрабатываются в соответствии с 152-ФЗ.');
              }}
              className="hover:text-white transition-colors"
            >
              Политика конфиденциальности
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert('Пользовательское соглашение: Условия использования цифровой витрины simona-bt.ru.');
              }}
              className="hover:text-white transition-colors"
            >
              Пользовательское соглашение
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

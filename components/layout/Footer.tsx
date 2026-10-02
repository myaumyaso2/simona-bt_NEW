'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Send, ArrowRight, ExternalLink } from 'lucide-react';
import { useStore } from '@/components/providers/StoreContext';
import { SimonaLogo } from '@/components/brand/SimonaLogo';
import { SimonaPatternOverlay } from '@/components/brand/SimonaPattern';
import { SimonaIconPin } from '@/components/brand/SimonaIcons';
import { useSiteContent } from '@/components/providers/ContentContext';

export function Footer() {
  const pathname = usePathname();
  const { openModal } = useStore();
  const content = useSiteContent();
  const kuhniUrl = process.env.NEXT_PUBLIC_KUHNI_URL || content.contacts.kuhniUrl;

  if (pathname?.startsWith('/admin')) {
    return null;
  }

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
              {content.footer.brandTagline}
            </p>

            <div className="pt-2">
              <a
                href={kuhniUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 text-xs text-simona-teal hover:text-simona-teal-light font-medium group transition-colors"
              >
                <span>{content.footer.kuhniLinkText}</span>
                <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>

          {/* Col 2: Salons in NN (3 Cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-white">
              {content.footer.salonsHeading}
            </h4>
            
            <div className="space-y-3 text-xs">
              <div>
                <p className="text-white font-medium">Флагман: {content.contacts.flagmanAddress}</p>
                <a href={`tel:${content.contacts.phoneFlagman.replace(/[^+\d]/g, '')}`} className="text-[#87888A] hover:text-simona-teal transition-colors">
                  {content.contacts.phoneFlagman}
                </a>
              </div>

              <div>
                <p className="text-white font-medium">Omoikiri & Körting: {content.contacts.omoikiriAddress}</p>
                <a href={`tel:${content.contacts.phoneOmoikiri.replace(/[^+\d]/g, '')}`} className="text-[#87888A] hover:text-simona-teal transition-colors">
                  {content.contacts.phoneOmoikiri}
                </a>
              </div>

              <div className="pt-2 flex flex-col space-y-1.5">
                <Link
                  href="/contacts"
                  className="inline-flex items-center space-x-1.5 text-simona-teal hover:text-simona-teal-light font-medium transition-colors"
                >
                  <SimonaIconPin className="w-3.5 h-3.5" />
                  <span>Все контакты и реквизиты</span>
                </Link>

                <a
                  href={content.contacts.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 text-[#87888A] hover:text-white transition-colors"
                >
                  <Send className="w-3 h-3" />
                  <span>Telegram-консьерж</span>
                </a>
              </div>
            </div>
          </div>

          {/* Col 3: Navigation (3 Cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-white">
              {content.footer.navHeading}
            </h4>
            
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/catalog" className="text-[#87888A] hover:text-white transition-colors">
                  {content.navigation.catalog}
                </Link>
              </li>
              <li>
                <Link href="/promos" className="text-[#87888A] hover:text-white transition-colors">
                  {content.navigation.promos}
                </Link>
              </li>
              <li>
                <Link href="/delivery-payment" className="text-[#87888A] hover:text-white transition-colors">
                  Доставка и оплата
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-[#87888A] hover:text-white transition-colors">
                  Установка и хранение
                </Link>
              </li>
              <li>
                <Link href="/warranty" className="text-[#87888A] hover:text-white transition-colors">
                  Гарантия и сервис
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-[#87888A] hover:text-white transition-colors">
                  Возврат и обмен
                </Link>
              </li>
              <li>
                <Link href="/certificate" className="text-[#87888A] hover:text-white transition-colors">
                  Подарочные сертификаты
                </Link>
              </li>
              <li>
                <Link href="/price-match" className="text-[#87888A] hover:text-white transition-colors">
                  Гарантия лучшей цены
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Designers B2B (3 Cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-white">
              {content.footer.designersHeading}
            </h4>
            
            <p className="text-xs text-[#87888A] leading-relaxed">
              {content.footer.designersText}
            </p>

            <div className="pt-1">
              <button
                onClick={() => openModal('B2B_CLUB')}
                className="inline-flex items-center space-x-1.5 text-xs text-simona-teal hover:text-simona-teal-light font-medium group transition-colors"
              >
                <span>{content.footer.designersCta}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar per Figma */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#87888A]">
          <p>{content.footer.copyright}</p>

          <div className="flex items-center space-x-6">
            <Link
              href="/policy?tab=privacy"
              className="hover:text-white transition-colors"
            >
              {content.footer.privacyPolicyText}
            </Link>
            <Link
              href="/policy?tab=terms"
              className="hover:text-white transition-colors"
            >
              {content.footer.userAgreementText}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

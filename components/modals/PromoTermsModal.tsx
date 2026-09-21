'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { X, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';
import { useStore } from '@/components/providers/StoreContext';
import { SimonaIconConsultation } from '@/components/brand/SimonaIcons';

export function PromoTermsModal() {
  const { modal, closeModal, openModal } = useStore();
  const router = useRouter();

  if (modal.type !== 'PROMO_TERMS' || !modal.promoData) {
    return null;
  }

  const promo = modal.promoData;

  const handleViewProducts = () => {
    closeModal();
    router.push(`/catalog?promo=${encodeURIComponent(promo.slug)}`);
  };

  const handleConsultation = () => {
    openModal('QUICK_CONSULT');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in"
      onClick={closeModal}
    >
      <div
        className="relative w-full max-w-2xl rounded-3xl bg-[#16191D] border border-simona-wine/40 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Gradient Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-simona-wine via-simona-wine-light to-simona-wine" />

        {/* Modal Header */}
        <div className="p-6 sm:p-7 border-b border-[#2B313A]/70 flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-black/60 border border-white/10 text-[11px] font-bold tracking-wider uppercase text-white">
                {promo.brand}
              </span>
              {promo.brandCountry && (
                <span className="text-xs text-[#87888A] font-medium">
                  {promo.brandCountry}
                </span>
              )}
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-simona-wine/25 text-white border border-simona-wine/50 backdrop-blur-md">
                <span>{promo.badgeText}</span>
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-montserrat font-bold text-white tracking-tight leading-snug mt-1">
              {promo.title}
            </h2>

            <div className="flex items-center gap-2 text-xs text-simona-wine-light font-medium">
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span>Действует до {promo.endDate}</span>
            </div>
          </div>

          <button
            onClick={closeModal}
            className="p-2 text-[#87888A] hover:text-white rounded-full hover:bg-white/10 transition-colors shrink-0"
            aria-label="Закрыть окно"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 overflow-y-auto space-y-6 text-sm text-[#D7D9DB] leading-relaxed">
          {/* Short Description */}
          <div className="p-4 rounded-2xl bg-[#1E2228] border border-[#2B313A] text-white font-medium">
            {promo.shortDescription}
          </div>

          {/* Full Description text */}
          <div className="whitespace-pre-line text-xs sm:text-sm text-[#87888A]">
            {promo.fullDescription}
          </div>

          {/* Conditions List */}
          {promo.conditions && promo.conditions.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs uppercase font-bold tracking-wider text-white">
                Официальные условия программы
              </h3>
              <div className="space-y-2">
                {(promo.conditions || []).map((condition: string, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 text-xs text-[#D7D9DB]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-simona-teal shrink-0 mt-0.5" />
                    <span>{condition}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Salon Privileges Guarantee */}
          <div className="p-4 rounded-2xl bg-simona-teal/10 border border-simona-teal/20 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-white">
              <span className="w-2 h-2 rounded-full bg-simona-teal animate-pulse" />
              <span>Официальная гарантия и сервис авторизованного бутика</span>
            </div>
            <span className="text-[#87888A]">Белинского, 15 / 11-66</span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-5 sm:p-6 border-t border-[#2B313A] bg-[#121417] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handleConsultation}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-[#2B313A] text-[#D7D9DB] hover:text-white hover:border-simona-teal hover:bg-simona-teal/10 text-xs font-semibold transition-all cursor-pointer"
          >
            <SimonaIconConsultation className="w-4 h-4 text-simona-teal" />
            <span>Консультация эксперта</span>
          </button>

          <button
            onClick={handleViewProducts}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-simona-wine hover:bg-simona-wine-hover text-white text-xs font-bold transition-all shadow-lg hover:shadow-simona-wine/30 cursor-pointer"
          >
            <span>Смотреть все товары акции</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import {
  SimonaIconMax,
  SimonaIconCheckCircle,
  SimonaIconSparkles,
} from '@/components/brand/SimonaIcons';
import { useStore } from '@/components/providers/StoreContext';
import { LuxuryModalShell } from '@/components/modals/LuxuryModalShell';

export function EquipmentSelectionModal() {
  const { modal, closeModal } = useStore();
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [agree, setAgree] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const isOpen = modal.type === 'EQUIPMENT_SELECTION';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree) {
      setError('Необходимо согласие с политикой конфиденциальности');
      return;
    }
    if (!phone.trim()) {
      setError('Пожалуйста, укажите контактный телефон');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'EQUIPMENT_SELECTION',
          name: name.trim() || 'Клиент (Подбор)',
          phone: phone.trim(),
          comment: 'Запрос на подбор бытовой техники',
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Ошибка отправки');

      setSuccess(true);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка отправки заявки';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setError('');
    setName('');
    setPhone('');
    setAgree(true);
    closeModal();
  };

  return (
    <LuxuryModalShell
      isOpen={isOpen}
      onClose={handleClose}
      maxWidth="max-w-lg"
      padding="p-5 sm:p-7"
      badgeText={!success ? 'ОТПРАВИТЬ ЗАЯВКУ' : undefined}
      badgeVariant="teal"
      title={!success ? 'Подбор бытовой техники' : undefined}
      subtitle={
        !success
          ? 'Эксперты салона подготовят предложение по технике под ваши размеры и бюджет.'
          : undefined
      }
    >
      {success ? (
        <div className="text-center py-6 sm:py-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-simona-teal/15 border border-simona-teal/30 flex items-center justify-center text-simona-teal shadow-[0_0_24px_rgba(0,151,156,0.2)]">
            <SimonaIconCheckCircle className="w-7 h-7" />
          </div>
          <h3 className="text-xl sm:text-2xl font-montserrat font-bold text-white mb-2">
            Запрос принят!
          </h3>
          <p className="text-xs sm:text-sm text-[#87888A] max-w-sm mx-auto leading-relaxed mb-6">
            Эксперт салона СИМОНА свяжется с вами в течение 15 минут для консультации и подбора техники.
          </p>
          <button
            onClick={handleClose}
            className="px-6 py-2.5 rounded-xl bg-[#1E2228] hover:bg-[#2B313A] text-white text-xs font-semibold border border-[#2B313A] transition shadow-sm cursor-pointer"
          >
            Закрыть
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* 1. Fast Messengers Block (Telegram & MAX) */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#1E2228] border border-[#2B313A]">
            <div className="text-xs font-medium text-[#87888A] mb-2.5 text-center sm:text-left">
              Быстрая консультация в мессенджерах:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Telegram */}
              <a
                href="https://t.me/SimonaExpert?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5.%20%D0%9C%D0%B5%D0%BD%D1%8F%20%D0%B8%D0%BD%D1%82%D0%B5%D1%80%D0%B5%D1%81%D1%83%D0%B5%D1%82%20%D0%BF%D0%BE%D0%B4%D0%B1%D0%BE%D1%80%20%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D0%BA%D0%B8"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-[#2AABEE] hover:bg-[#2296d2] text-white text-xs sm:text-sm font-semibold transition space-x-2 shadow-md hover:shadow-lg hover:shadow-[#2AABEE]/25 cursor-pointer active:scale-[0.98]"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="12" fill="#2AABEE" />
                  <path
                    d="M5.4 11.95L17.15 7.42C17.69 7.22 18.17 7.55 17.99 8.28L15.99 17.71C15.84 18.39 15.44 18.55 14.87 18.23L11.82 15.98L10.35 17.39C10.19 17.55 10.05 17.69 9.74 17.69L9.96 14.54L15.69 9.36C15.94 9.14 15.64 9.02 15.31 9.24L8.23 13.7L5.18 12.75C4.52 12.54 4.51 12.09 5.4 11.95Z"
                    fill="white"
                  />
                </svg>
                <span>Написать в Telegram</span>
              </a>

              {/* MAX */}
              <a
                href="https://max.ru/u/f9LHodD0cOIuy7am7AqiTUQzRCTzos1MKUnVod70alUJhmKBTjkjQi7MYf4"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-[#5C3BFE] hover:bg-[#4B2BE8] text-white text-xs sm:text-sm font-semibold transition space-x-2 shadow-md hover:shadow-lg hover:shadow-[#5C3BFE]/25 cursor-pointer active:scale-[0.98]"
              >
                <SimonaIconMax className="w-4 h-4 shrink-0" />
                <span>Написать в MAX</span>
              </a>
            </div>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#2B313A]" />
            </div>
            <div className="relative px-3 bg-[#16191D] text-[11px] text-[#87888A]">
              или оставьте телефон для звонка
            </div>
          </div>

          {/* 2. Direct 2-field form (Phone left, Name right) */}
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#D7D9DB] mb-1.5 font-medium text-xs">
                  Контактный телефон <span className="text-simona-teal">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+7 (900) 000-00-00"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#111315] border border-[#2B313A] text-white text-sm placeholder-[#6E7074] focus:outline-none focus:border-simona-teal focus:ring-1 focus:ring-simona-teal/50 transition font-medium"
                />
              </div>

              <div>
                <label className="block text-[#D7D9DB] mb-1.5 font-medium text-xs">
                  Ваше имя
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Как к вам обращаться?"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#111315] border border-[#2B313A] text-white text-sm placeholder-[#6E7074] focus:outline-none focus:border-simona-teal focus:ring-1 focus:ring-simona-teal/50 transition font-medium"
                />
              </div>
            </div>

            {error && (
              <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center">
                <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-1 space-y-2.5">
              <button
                type="submit"
                disabled={loading || !agree}
                className="w-full py-3.5 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-sm font-semibold transition active:scale-[0.98] shadow-lg shadow-simona-teal/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 cursor-pointer"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Получить консультацию эксперта</span>
                    <SimonaIconSparkles className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Policy Checkbox under the button */}
              <div className="flex items-center justify-center space-x-2 pt-0.5 text-xs text-[#87888A]">
                <input
                  type="checkbox"
                  id="selection_agree"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="w-4 h-4 rounded accent-simona-teal cursor-pointer shrink-0"
                />
                <label htmlFor="selection_agree" className="cursor-pointer select-none text-[11px] sm:text-xs">
                  Соглашаюсь с{' '}
                  <a
                    href="/policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#D7D9DB] hover:text-white underline transition-colors"
                  >
                    политикой конфиденциальности компании
                  </a>
                </label>
              </div>
            </div>
          </form>
        </div>
      )}
    </LuxuryModalShell>
  );
}

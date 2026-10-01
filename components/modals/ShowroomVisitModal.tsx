'use client';

import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { SimonaIconCheckCircle } from '@/components/brand/SimonaIcons';
import { useStore } from '@/components/providers/StoreContext';
import { LuxuryModalShell } from '@/components/modals/LuxuryModalShell';
import { formatProductName } from '@/lib/catalog/productTitle';

export function ShowroomVisitModal() {
  const { modal, closeModal } = useStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showroom, setShowroom] = useState(
    modal.preferredShowroom || 'Белинского, 15 (Флагман / Встройка / Miele / ASKO)'
  );
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const isOpen = modal.type === 'SHOWROOM_VISIT';

  const handleClose = () => {
    setSuccess(false);
    setError('');
    setName('');
    setPhone('');
    setDate('');
    closeModal();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'SHOWROOM_VISIT',
          name,
          phone,
          preferredDate: date,
          preferredShowroom: showroom,
          productId: modal.product?.id,
          productName: modal.product ? formatProductName(modal.product) : undefined,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      setSuccess(true);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка отправки заявки';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LuxuryModalShell
      isOpen={isOpen}
      onClose={handleClose}
      badgeText={!success ? 'Персональная консультация с экспертом' : undefined}
      badgeVariant="teal"
      title={!success ? 'Запись на визит в салон СИМОНА' : undefined}
      subtitle={
        !success
          ? 'Подготовим образцы техники, каталоги встройки и свежесваренный кофе к вашему приезду.'
          : undefined
      }
    >
      {success ? (
        <div className="text-center py-6 sm:py-8">
          <div className="w-16 h-16 rounded-2xl bg-simona-teal/15 border border-simona-teal/30 text-simona-teal flex items-center justify-center mx-auto mb-4 shadow-[0_0_24px_rgba(0,151,156,0.2)]">
            <SimonaIconCheckCircle className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-montserrat font-bold text-white mb-2">
            Визит забронирован!
          </h3>
          <p className="text-xs sm:text-sm text-[#87888A] font-normal max-w-sm mx-auto leading-relaxed">
            Дежурный эксперт салона свяжется с вами для подтверждения времени встречи и подготовки экспозиции.
          </p>
          <button
            onClick={handleClose}
            className="mt-6 px-6 py-2.5 rounded-xl bg-[#1E2228] hover:bg-[#2B313A] text-white text-xs font-semibold border border-[#2B313A] transition shadow-sm cursor-pointer"
          >
            Закрыть
          </button>
        </div>
      ) : (
        <div>
          {modal.product && (
            <div className="mb-5 p-3 rounded-xl bg-[#1E2228] border border-[#2B313A] text-xs text-[#D7D9DB]">
              Интересующая модель:{' '}
              <span className="text-white font-semibold">
                {formatProductName(modal.product)}
              </span>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#D7D9DB] mb-1.5 font-medium">
                Выберите салон *
              </label>
              <select
                value={showroom}
                onChange={(e) => setShowroom(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#111315] border border-[#2B313A] text-white focus:outline-none focus:border-simona-teal focus:ring-1 focus:ring-simona-teal/50 transition font-medium cursor-pointer"
              >
                <option value="Белинского, 15 (Флагман / Встройка / Miele / ASKO)">
                  Флагман СИМОНА — ул. Белинского, 15 (Крупная встройка, «Активная кухня»)
                </option>
                <option value="Белинского, 11/66 (OMOIKIRI & KÖRTING)">
                  Фирменный салон — ул. Белинского, 11/66 (Японские мойки, смесители, Körting)
                </option>
              </select>
            </div>

            <div>
              <label className="block text-[#D7D9DB] mb-1.5 font-medium">
                Ваше имя *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Анна"
                className="w-full px-4 py-3 rounded-xl bg-[#111315] border border-[#2B313A] text-white placeholder-[#6E7074] focus:outline-none focus:border-simona-teal focus:ring-1 focus:ring-simona-teal/50 transition font-medium"
              />
            </div>

            <div>
              <label className="block text-[#D7D9DB] mb-1.5 font-medium">
                Телефон *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+7 (900) 000-00-00"
                className="w-full px-4 py-3 rounded-xl bg-[#111315] border border-[#2B313A] text-white placeholder-[#6E7074] focus:outline-none focus:border-simona-teal focus:ring-1 focus:ring-simona-teal/50 transition font-medium"
              />
            </div>

            <div>
              <label className="block text-[#D7D9DB] mb-1.5 font-medium">
                Удобная дата или время
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="Например: Завтра после 15:00"
                className="w-full px-4 py-3 rounded-xl bg-[#111315] border border-[#2B313A] text-white placeholder-[#6E7074] focus:outline-none focus:border-simona-teal focus:ring-1 focus:ring-simona-teal/50 transition font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-simona-teal hover:bg-simona-teal-hover disabled:opacity-50 text-white text-sm font-semibold transition shadow-lg shadow-simona-teal/20 active:scale-[0.98] cursor-pointer mt-2"
            >
              {loading ? 'Отправка...' : 'Забронировать визит'}
            </button>

            <p className="text-[11px] text-[#87888A] text-center leading-tight pt-1">
              Нажимая кнопку, вы даете согласие на обработку персональных данных.
            </p>
          </form>
        </div>
      )}
    </LuxuryModalShell>
  );
}

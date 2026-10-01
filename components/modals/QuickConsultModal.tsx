'use client';

import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { SimonaIconCheckCircle } from '@/components/brand/SimonaIcons';
import { useStore } from '@/components/providers/StoreContext';
import { LuxuryModalShell } from '@/components/modals/LuxuryModalShell';
import { formatProductName } from '@/lib/catalog/productTitle';

export function QuickConsultModal() {
  const { modal, closeModal } = useStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const isOpen = modal.type === 'QUICK_CONSULT';

  const handleClose = () => {
    setSuccess(false);
    setError('');
    setName('');
    setPhone('');
    setComment('');
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
          type: 'QUICK_CONSULT',
          name,
          phone,
          productId: modal.product?.id,
          productName: modal.product ? formatProductName(modal.product) : undefined,
          comment,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      setSuccess(true);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка отправки';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LuxuryModalShell
      isOpen={isOpen}
      onClose={handleClose}
      badgeText={!success ? 'Консультация эксперта СИМОНА' : undefined}
      badgeVariant="teal"
      title={!success ? 'Задать вопрос эксперту' : undefined}
      subtitle={
        !success && !modal.product
          ? 'Эксперт салона ответит на вопросы по характеристикам, наличию и совместимости техники.'
          : undefined
      }
    >
      {success ? (
        <div className="text-center py-6 sm:py-8">
          <div className="w-16 h-16 rounded-2xl bg-simona-teal/15 border border-simona-teal/30 text-simona-teal flex items-center justify-center mx-auto mb-4 shadow-[0_0_24px_rgba(0,151,156,0.2)]">
            <SimonaIconCheckCircle className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-montserrat font-bold text-white mb-2">
            Консультация запрошена
          </h3>
          <p className="text-xs sm:text-sm text-[#87888A] font-normal max-w-sm mx-auto leading-relaxed">
            Эксперт салона СИМОНА ответит на все вопросы по характеристикам, наличию и срокам поставки.
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
              Модель:{' '}
              <span className="text-simona-teal font-semibold">
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
              <label className="block text-[#D7D9DB] mb-1.5 font-medium">Ваше имя *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Алексей"
                className="w-full px-4 py-3 rounded-xl bg-[#111315] border border-[#2B313A] text-white placeholder-[#6E7074] focus:outline-none focus:border-simona-teal focus:ring-1 focus:ring-simona-teal/50 transition font-medium"
              />
            </div>

            <div>
              <label className="block text-[#D7D9DB] mb-1.5 font-medium">Телефон для связи *</label>
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
              <label className="block text-[#D7D9DB] mb-1.5 font-medium">Ваш вопрос</label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Уточните наличие, страну сборки или совместимость со схемой встройки..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#111315] border border-[#2B313A] text-white placeholder-[#6E7074] focus:outline-none focus:border-simona-teal focus:ring-1 focus:ring-simona-teal/50 transition font-medium resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-simona-teal hover:bg-simona-teal-hover disabled:opacity-50 text-white text-sm font-semibold transition shadow-lg shadow-simona-teal/20 active:scale-[0.98] cursor-pointer mt-2"
            >
              {loading ? 'Отправка...' : 'Получить консультацию'}
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

'use client';

import React, { useState } from 'react';
import { X, HelpCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import { useStore } from '@/components/providers/StoreContext';

export function QuickConsultModal() {
  const { modal, closeModal } = useStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (modal.type !== 'QUICK_CONSULT') return null;

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
          productName: modal.product?.name,
          comment,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Ошибка отправки');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-black/[0.08] shadow-2xl p-6 sm:p-8 text-[#16181B]">
        <button
          onClick={closeModal}
          className="absolute top-5 right-5 p-2 text-[#87888A] hover:text-[#16181B] rounded-full hover:bg-zinc-100 transition"
          aria-label="Закрыть"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-simona-teal/10 text-simona-teal flex items-center justify-center mx-auto mb-4 border border-simona-teal/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-montserrat font-bold text-[#16181B] mb-2">Консультация запрошена</h3>
            <p className="text-sm text-[#6E7074] font-normal max-w-sm mx-auto leading-relaxed">
              Эксперт салона СИМОНА ответит на все вопросы по характеристикам, наличию и срокам поставки.
            </p>
            <button
              onClick={closeModal}
              className="mt-6 px-6 py-2.5 rounded-xl bg-[#16181B] hover:bg-zinc-800 text-white text-xs font-semibold uppercase tracking-wider transition shadow-sm"
            >
              Закрыть
            </button>
          </div>
        ) : (
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-simona-teal/10 text-simona-teal border border-simona-teal/25 text-xs font-bold mb-3">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Консультация эксперта СИМОНА</span>
            </div>

            <h3 className="text-2xl font-montserrat font-bold text-[#16181B]">
              Задать вопрос эксперту
            </h3>

            {modal.product && (
              <p className="text-xs text-[#3E3D40] mt-2 p-3 rounded-xl bg-[#F8F9FA] border border-black/[0.06]">
                Модель: <span className="text-[#16181B] font-bold">{modal.product.name}</span>
              </p>
            )}

            {error && (
              <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center">
                <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-xs">
              <div>
                <label className="block text-[#3E3D40] mb-1 font-semibold">Ваше имя *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Алексей"
                  className="w-full px-4 py-3 rounded-xl bg-[#F8F9FA] border border-black/[0.08] text-[#16181B] placeholder-[#87888A] focus:outline-none focus:border-simona-teal focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-[#3E3D40] mb-1 font-semibold">Телефон для связи *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+7 (900) 000-00-00"
                  className="w-full px-4 py-3 rounded-xl bg-[#F8F9FA] border border-black/[0.08] text-[#16181B] placeholder-[#87888A] focus:outline-none focus:border-simona-teal focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-[#3E3D40] mb-1 font-semibold">Ваш вопрос</label>
                <textarea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Уточните наличие, страну сборки или совместимость со схемой встройки..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-black/[0.08] text-[#16181B] placeholder-[#87888A] focus:outline-none focus:border-simona-teal focus:bg-white transition resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-simona-teal hover:bg-simona-teal-hover disabled:opacity-50 text-white font-bold uppercase tracking-wider transition shadow-lg shadow-simona-teal/20 active:scale-98"
              >
                {loading ? 'Отправка...' : 'Получить консультацию'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

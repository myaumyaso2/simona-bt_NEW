'use client';

import React, { useState } from 'react';
import { X, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { useStore } from '@/components/providers/StoreContext';

export function ProjectMatchingModal() {
  const { modal, closeModal } = useStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [budget, setBudget] = useState('500 000 – 1 000 000 ₽');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (modal.type !== 'PROJECT_MATCHING' && modal.type !== 'KITCHEN_ESTIMATE') return null;

  const isKitchen = modal.type === 'KITCHEN_ESTIMATE';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: isKitchen ? 'KITCHEN_ESTIMATE' : 'PROJECT_MATCHING',
          name,
          phone,
          productId: modal.product?.id,
          productName: modal.product?.name,
          comment: `Бюджет: ${budget}. Пожелания: ${comment}`,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#14161A] border border-zinc-700 shadow-2xl p-6 sm:p-8 text-white">
        <button
          onClick={closeModal}
          className="absolute top-5 right-5 p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition"
          aria-label="Закрыть"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-simona-teal/20 text-simona-teal flex items-center justify-center mx-auto mb-4 border border-simona-teal/40">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-serif text-white mb-2">Запрос принят!</h3>
            <p className="text-sm text-zinc-400 font-light max-w-sm mx-auto leading-relaxed">
              Эксперт салона СИМОНА подготовит персональную подборку комплекта техники и свяжется с вами.
            </p>
            <button
              onClick={closeModal}
              className="mt-6 px-6 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold uppercase tracking-wider transition"
            >
              Закрыть
            </button>
          </div>
        ) : (
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-simona-teal/10 text-simona-teal border border-simona-teal/30 text-xs font-medium mb-3">
              <FileText className="w-3.5 h-3.5" />
              <span>{isKitchen ? 'Кухни под ключ + Техника' : 'Индивидуальный подбор комплекта'}</span>
            </div>

            <h3 className="text-2xl font-serif text-white">
              {isKitchen ? 'Расчет кухни с техникой' : 'Подбор техники по дизайн-проекту'}
            </h3>

            {error && (
              <div className="mt-4 p-3 rounded-lg bg-red-950/50 border border-red-800 text-red-300 text-xs flex items-center">
                <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 mb-1 font-medium">Ваше имя *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Иван"
                  className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-simona-teal transition"
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1 font-medium">Телефон для связи *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+7 (900) 000-00-00"
                  className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-simona-teal transition"
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1 font-medium">Ориентир по бюджету</label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-simona-teal transition"
                >
                  <option value="до 500 000 ₽">до 500 000 ₽</option>
                  <option value="500 000 – 1 000 000 ₽">500 000 – 1 000 000 ₽</option>
                  <option value="1 000 000 – 2 000 000 ₽">1 000 000 – 2 000 000 ₽</option>
                  <option value="от 2 000 000 ₽ (Премиум-класс)">от 2 000 000 ₽ (Премиум-класс)</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-300 mb-1 font-medium">Пожелания по брендам или списку техники</label>
                <textarea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Нужен комплект Miele/ASKO: духовка, индукция, посудомойка, винный шкаф..."
                  className="w-full px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-simona-teal transition resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-lg bg-simona-teal hover:bg-simona-teal-light disabled:opacity-50 text-white font-bold uppercase tracking-wider transition shadow-lg shadow-simona-teal/20"
              >
                {loading ? 'Отправка...' : 'Запросить расчет'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

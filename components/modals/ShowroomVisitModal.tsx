'use client';

import React, { useState } from 'react';
import { X, Sparkles, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import { useStore } from '@/components/providers/StoreContext';

export function ShowroomVisitModal() {
  const { modal, closeModal } = useStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showroom, setShowroom] = useState(
    modal.preferredShowroom || 'Белинского, 15 (Флагман / Встройка / Miele / ASKO)'
  );
  const [date, setDate] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (modal.type !== 'SHOWROOM_VISIT') return null;

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
          productName: modal.product?.name,
          comment,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Ошибка отправки заявки');
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
            <h3 className="text-2xl font-serif text-white mb-2">Визит забронирован!</h3>
            <p className="text-sm text-zinc-400 font-light max-w-sm mx-auto leading-relaxed">
              Дежурный эксперт салона свяжется с вами для подтверждения времени встречи и подготовки экспозиции.
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
              <Sparkles className="w-3.5 h-3.5" />
              <span>Персональная консультация с экспертом</span>
            </div>

            <h3 className="text-2xl font-serif text-white">
              Запись на визит в салон СИМОНА
            </h3>
            <p className="text-xs text-zinc-400 font-light mt-1">
              Подготовим образцы техники, каталоги встройки и свежесваренный кофе к вашему приезду.
            </p>

            {modal.product && (
              <div className="mt-3 p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300">
                Интересующая модель: <span className="text-white font-medium">{modal.product.name}</span>
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 rounded-lg bg-red-950/50 border border-red-800 text-red-300 text-xs flex items-center">
                <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 mb-1 font-medium">Выберите салон *</label>
                <select
                  value={showroom}
                  onChange={(e) => setShowroom(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-simona-teal transition"
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
                <label className="block text-zinc-300 mb-1 font-medium">Ваше имя *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Анна"
                  className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-simona-teal transition"
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1 font-medium">Телефон *</label>
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
                <label className="block text-zinc-300 mb-1 font-medium">Удобная дата или время</label>
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="Например: Завтра после 15:00"
                  className="w-full px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-simona-teal transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-lg bg-simona-teal hover:bg-simona-teal-light disabled:opacity-50 text-white font-bold uppercase tracking-wider transition shadow-lg shadow-simona-teal/20"
              >
                {loading ? 'Отправка...' : 'Забронировать визит'}
              </button>

              <p className="text-[10px] text-zinc-500 text-center leading-tight">
                Нажимая кнопку, вы даете согласие на обработку персональных данных.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

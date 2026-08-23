'use client';

import React, { useState } from 'react';
import { X, Flame, Calendar, Clock, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { useStore } from '@/components/providers/StoreContext';

export function TestDriveModal() {
  const { modal, closeModal } = useStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('14:00');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (modal.type !== 'TEST_DRIVE') return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'ACTIVE_KITCHEN_TESTDRIVE',
          name,
          phone,
          preferredDate: date,
          preferredTime: time,
          preferredShowroom: 'ул. Белинского, 15 (Активная кухня)',
          productId: modal.product?.id,
          productName: modal.product?.name,
          comment,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка при отправке заявки');
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
            <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-500/40">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-serif text-white mb-2">Запись подтверждена!</h3>
            <p className="text-sm text-zinc-400 font-light max-w-sm mx-auto leading-relaxed">
              Шеф-эксперт «Активной кухни» салона СИМОНА (ул. Белинского, 15) свяжется с вами для согласования меню тест-драйва и времени визита.
            </p>
            <button
              onClick={closeModal}
              className="mt-6 px-6 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold uppercase tracking-wider transition"
            >
              Отлично
            </button>
          </div>
        ) : (
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-medium mb-3">
              <Flame className="w-3.5 h-3.5" />
              <span>Активная кухня • ул. Белинского, 15</span>
            </div>

            <h3 className="text-2xl font-serif text-white">
              Запись на кулинарный тест-драйв
            </h3>

            {modal.product ? (
              <p className="text-xs text-zinc-300 mt-1 font-medium bg-zinc-900 p-2.5 rounded-lg border border-zinc-800">
                Прибор для тестирования: <span className="text-amber-400">{modal.product.name}</span>
              </p>
            ) : (
              <p className="text-xs text-zinc-400 font-light mt-1">
                Приготовление на пару, Sous-Vide, индукция ASKO Celsius°Cooking и дегустация кофе.
              </p>
            )}

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
                  placeholder="Константин"
                  className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition"
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
                  className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 mb-1 font-medium">Желаемая дата</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 mb-1 font-medium">Время</label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-amber-500 transition"
                  >
                    <option value="12:00">12:00</option>
                    <option value="14:00">14:00</option>
                    <option value="16:00">16:00</option>
                    <option value="18:00">18:00</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 mb-1 font-medium">Пожелания к рецептам или приборам</label>
                <textarea
                  rows={2}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Хочу протестировать приготовление рыбы на пару и выпечку хлеба..."
                  className="w-full px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-zinc-950 font-bold uppercase tracking-wider transition shadow-lg shadow-amber-500/20"
              >
                {loading ? 'Отправка...' : 'Забронировать тест-драйв'}
              </button>

              <p className="text-[10px] text-zinc-500 text-center leading-tight">
                Нажимая кнопку, вы даете согласие на обработку персональных данных в соответствии с 152-ФЗ.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

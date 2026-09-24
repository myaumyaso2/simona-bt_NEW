'use client';

import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { SimonaIconFlame, SimonaIconCheckCircle } from '@/components/brand/SimonaIcons';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-black/[0.08] shadow-2xl p-6 sm:p-8 text-[#16181B]">
        <button
          onClick={closeModal}
          className="absolute top-5 right-5 w-9 h-9 rounded-xl border border-black/[0.08] text-[#87888A] hover:text-[#16181B] hover:bg-zinc-100 flex items-center justify-center transition cursor-pointer"
          aria-label="Закрыть"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-4 border border-amber-500/30">
              <SimonaIconCheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-montserrat font-bold text-[#16181B] mb-2">Запись подтверждена!</h3>
            <p className="text-sm text-[#6E7074] font-normal max-w-sm mx-auto leading-relaxed">
              Шеф-эксперт «Активной кухни» салона СИМОНА (ул. Белинского, 15) свяжется с вами для согласования меню тест-драйва и времени визита.
            </p>
            <button
              onClick={closeModal}
              className="mt-6 px-6 py-2.5 rounded-xl bg-[#16181B] hover:bg-zinc-800 text-white text-xs font-semibold uppercase tracking-wider transition shadow-sm cursor-pointer"
            >
              Отлично
            </button>
          </div>
        ) : (
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-md bg-amber-500/10 text-amber-600 border border-amber-500/30 text-xs font-bold mb-3">
              <SimonaIconFlame className="w-3.5 h-3.5" />
              <span>Активная кухня • ул. Белинского, 15</span>
            </div>

            <h3 className="text-2xl font-montserrat font-bold text-[#16181B]">
              Запись на кулинарный тест-драйв
            </h3>

            {modal.product ? (
              <p className="text-xs text-[#3E3D40] mt-1 font-medium bg-[#F8F9FA] p-3 rounded-xl border border-black/[0.06]">
                Прибор для тестирования: <span className="text-amber-600 font-bold">{modal.product.name}</span>
              </p>
            ) : (
              <p className="text-xs text-[#6E7074] font-normal mt-1">
                Приготовление на пару, Sous-Vide, индукция ASKO Celsius°Cooking и дегустация кофе.
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
                  placeholder="Константин"
                  className="w-full px-4 py-3 rounded-xl bg-[#F8F9FA] border border-black/[0.08] text-[#16181B] placeholder-[#87888A] focus:outline-none focus:border-amber-500 focus:bg-white transition"
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
                  className="w-full px-4 py-3 rounded-xl bg-[#F8F9FA] border border-black/[0.08] text-[#16181B] placeholder-[#87888A] focus:outline-none focus:border-amber-500 focus:bg-white transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#3E3D40] mb-1 font-semibold">Желаемая дата</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#F8F9FA] border border-black/[0.08] text-[#16181B] focus:outline-none focus:border-amber-500 focus:bg-white transition font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[#3E3D40] mb-1 font-semibold">Время</label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#F8F9FA] border border-black/[0.08] text-[#16181B] focus:outline-none focus:border-amber-500 focus:bg-white transition font-medium"
                  >
                    <option value="12:00">12:00</option>
                    <option value="14:00">14:00</option>
                    <option value="16:00">16:00</option>
                    <option value="18:00">18:00</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#3E3D40] mb-1 font-semibold">Пожелания к рецептам или приборам</label>
                <textarea
                  rows={2}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Хочу протестировать приготовление рыбы на пару и выпечку хлеба..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-black/[0.08] text-[#16181B] placeholder-[#87888A] focus:outline-none focus:border-amber-500 focus:bg-white transition resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-zinc-950 font-bold uppercase tracking-wider transition shadow-lg shadow-amber-500/20 active:scale-98"
              >
                {loading ? 'Отправка...' : 'Забронировать тест-драйв'}
              </button>

              <p className="text-[10px] text-[#87888A] text-center leading-tight">
                Нажимая кнопку, вы даете согласие на обработку персональных данных в соответствии с 152-ФЗ.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

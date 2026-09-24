'use client';

import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { SimonaIconSparkles, SimonaIconCheckCircle } from '@/components/brand/SimonaIcons';
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
            <div className="w-16 h-16 rounded-2xl bg-simona-teal/10 text-simona-teal flex items-center justify-center mx-auto mb-4 border border-simona-teal/30">
              <SimonaIconCheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-montserrat font-bold text-[#16181B] mb-2">Визит забронирован!</h3>
            <p className="text-sm text-[#6E7074] font-normal max-w-sm mx-auto leading-relaxed">
              Дежурный эксперт салона свяжется с вами для подтверждения времени встречи и подготовки экспозиции.
            </p>
            <button
              onClick={closeModal}
              className="mt-6 px-6 py-2.5 rounded-xl bg-[#16181B] hover:bg-zinc-800 text-white text-xs font-semibold uppercase tracking-wider transition shadow-sm cursor-pointer"
            >
              Закрыть
            </button>
          </div>
        ) : (
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-md bg-simona-teal/10 text-simona-teal border border-simona-teal/25 text-xs font-bold mb-3">
              <SimonaIconSparkles className="w-3.5 h-3.5" />
              <span>Персональная консультация с экспертом</span>
            </div>

            <h3 className="text-2xl font-montserrat font-bold text-[#16181B]">
              Запись на визит в салон СИМОНА
            </h3>
            <p className="text-xs text-[#6E7074] font-normal mt-1">
              Подготовим образцы техники, каталоги встройки и свежесваренный кофе к вашему приезду.
            </p>

            {modal.product && (
              <div className="mt-3 p-3 rounded-xl bg-[#F8F9FA] border border-black/[0.06] text-xs text-[#3E3D40]">
                Интересующая модель: <span className="text-[#16181B] font-bold">{modal.product.name}</span>
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center">
                <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-xs">
              <div>
                <label className="block text-[#3E3D40] mb-1 font-semibold">Выберите салон *</label>
                <select
                  value={showroom}
                  onChange={(e) => setShowroom(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#F8F9FA] border border-black/[0.08] text-[#16181B] focus:outline-none focus:border-simona-teal focus:bg-white transition font-medium"
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
                <label className="block text-[#3E3D40] mb-1 font-semibold">Ваше имя *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Анна"
                  className="w-full px-4 py-3 rounded-xl bg-[#F8F9FA] border border-black/[0.08] text-[#16181B] placeholder-[#87888A] focus:outline-none focus:border-simona-teal focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-[#3E3D40] mb-1 font-semibold">Телефон *</label>
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
                <label className="block text-[#3E3D40] mb-1 font-semibold">Удобная дата или время</label>
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="Например: Завтра после 15:00"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-black/[0.08] text-[#16181B] placeholder-[#87888A] focus:outline-none focus:border-simona-teal focus:bg-white transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-simona-teal hover:bg-simona-teal-hover disabled:opacity-50 text-white font-bold uppercase tracking-wider transition shadow-lg shadow-simona-teal/20 active:scale-98"
              >
                {loading ? 'Отправка...' : 'Забронировать визит'}
              </button>

              <p className="text-[10px] text-[#87888A] text-center leading-tight">
                Нажимая кнопку, вы даете согласие на обработку персональных данных.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

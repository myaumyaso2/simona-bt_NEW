'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SectionBadge } from '@/components/ui/SectionBadge';
import {
  SimonaIconPin,
  SimonaIconClock,
  SimonaIconPhoneSolid,
  SimonaIconGuarantee,
  SimonaIconChef,
  SimonaIconStar,
} from '@/components/brand/SimonaIcons';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Coffee,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Send,
  Navigation,
  Building,
} from 'lucide-react';
import { useAnalyticsData } from '@/lib/analytics/utm';
import { trackGoal } from '@/lib/analytics/tracker';

export default function ShowroomsPage() {
  const analyticsData = useAnalyticsData();
  const [selectedShowroom, setSelectedShowroom] = useState<'BELINSKOGO_15' | 'BELINSKOGO_11'>('BELINSKOGO_15');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('14:00');
  const [interest, setInterest] = useState('ACTIVE_KITCHEN');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const showroomLabel =
        selectedShowroom === 'BELINSKOGO_15'
          ? 'Флагманский салон: ул. Белинского, 15'
          : 'Фирменный салон OMOIKIRI & KÖRTING: ул. Белинского, 11/66';

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'SHOWROOM_VISIT',
          name,
          phone,
          preferredDate: date || undefined,
          preferredTime: time || undefined,
          preferredShowroom: showroomLabel,
          comment: `Интерес: ${interest}`,
          ...analyticsData,
        }),
      });

      if (!res.ok) throw new Error('Ошибка бронирования визита');

      setSuccess(true);
      trackGoal('SHOWROOM_VISIT_BOOKED', { showroom: selectedShowroom, date, time });
    } catch (err) {
      console.error(err);
      alert('Ошибка при бронировании. Пожалуйста, позвоните нам: +7 (831) 423-76-00');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#111315] text-[#D7D9DB] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="bg-[#16191D] border border-[#2B313A] rounded-3xl p-6 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-simona-teal/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl text-left space-y-4">
            <SectionBadge variant="teal" text="Пространства Quiet Luxury в Нижнем Новгороде" />
            <h1 className="text-3xl sm:text-5xl font-montserrat font-bold text-white tracking-tight leading-tight">
              Шоурумы премиальной техники «СИМОНА»
            </h1>
            <p className="text-sm sm:text-base text-[#87888A] leading-relaxed">
              Два концептуальных салона в едином архитектурном ансамбле на улице Белинского. Оцените тишину работы приборов, тактильность материалов, посмотрите демонстрации в «Активной кухне» и выберите идеальный комплект встройки.
            </p>
            <div className="pt-2">
              <a
                href="#booking"
                className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-simona-teal/20"
              >
                <span>Забронировать персональный визит</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* 2 Flagship Showrooms + Warehouse */}
        <div className="space-y-8">
          <div className="text-left space-y-2">
            <SectionBadge variant="teal" text="Физические локации" />
            <h2 className="text-2xl sm:text-3xl font-montserrat font-bold text-white tracking-tight">
              Адреса салонов и центрального склада
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Showroom 1: Belinskogo 15 */}
            <div className="bg-[#16191D] border border-[#2B313A] rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-simona-teal/50 transition shadow-xl relative overflow-hidden">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-md bg-simona-teal/15 text-simona-teal border border-simona-teal/30 text-[11px] font-semibold uppercase tracking-wider">
                    Флагманский салон
                  </span>
                  <div className="text-xs text-[#87888A] flex items-center space-x-1">
                    <SimonaIconClock className="w-3.5 h-3.5 text-simona-teal inline" />
                    <span>10:00 – 20:00 ежедневно</span>
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-montserrat font-bold text-white mb-2">
                  Салон «СИМОНА» на Белинского, 15
                </h3>
                <p className="text-xs sm:text-sm text-simona-teal font-medium mb-4 flex items-center space-x-1">
                  <SimonaIconPin className="w-4 h-4 inline" />
                  <span>г. Нижний Новгород, ул. Белинского, 15</span>
                </p>

                <p className="text-xs sm:text-sm text-[#87888A] leading-relaxed mb-6">
                  Флагманская экспозиция премиальной бытовой техники европейских брендов: монобрендовые зоны Miele, ASKO, Liebherr, SMEG, VARD. Действующая «Активная кухня» для дегустаций и тест-драйвов, лаундж-зона для архитекторов и экспресс-выдача малой техники.
                </p>

                {/* Features Pill List */}
                <div className="grid grid-cols-2 gap-2 text-xs text-zinc-300 mb-6">
                  <div className="bg-[#1E2228] p-2.5 rounded-xl border border-[#2B313A] flex items-center space-x-2">
                    <SimonaIconChef className="w-4 h-4 text-simona-teal" />
                    <span>Активная кухня</span>
                  </div>
                  <div className="bg-[#1E2228] p-2.5 rounded-xl border border-[#2B313A] flex items-center space-x-2">
                    <Coffee className="w-4 h-4 text-simona-teal" />
                    <span>Лаундж для архитекторов</span>
                  </div>
                  <div className="bg-[#1E2228] p-2.5 rounded-xl border border-[#2B313A] flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-simona-teal" />
                    <span>Miele, ASKO, SMEG</span>
                  </div>
                  <div className="bg-[#1E2228] p-2.5 rounded-xl border border-[#2B313A] flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-simona-teal" />
                    <span>Экспресс-выдача</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#2B313A] flex items-center justify-between">
                <a
                  href="https://yandex.ru/maps/-/CDuWvEnB"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-simona-teal hover:underline font-semibold flex items-center space-x-1"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Построить маршрут в Яндекс.Картах</span>
                </a>
                <a href="tel:+78314237600" className="text-xs text-white font-mono font-semibold">
                  (831) 423-76-00
                </a>
              </div>
            </div>

            {/* Showroom 2: Belinskogo 11/66 */}
            <div className="bg-[#16191D] border border-[#2B313A] rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-simona-teal/50 transition shadow-xl relative overflow-hidden">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-md bg-simona-wine/25 text-white border border-simona-wine/50 text-[11px] font-semibold uppercase tracking-wider">
                    Монобрендовый салон
                  </span>
                  <div className="text-xs text-[#87888A] flex items-center space-x-1">
                    <SimonaIconClock className="w-3.5 h-3.5 text-simona-teal inline" />
                    <span>10:00 – 20:00 ежедневно</span>
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-montserrat font-bold text-white mb-2">
                  Салон OMOIKIRI & KÖRTING
                </h3>
                <p className="text-xs sm:text-sm text-simona-teal font-medium mb-4 flex items-center space-x-1">
                  <SimonaIconPin className="w-4 h-4 inline" />
                  <span>г. Нижний Новгород, ул. Белинского, 11/66</span>
                </p>

                <p className="text-xs sm:text-sm text-[#87888A] leading-relaxed mb-6">
                  Специализированная мокрая зона и сантехнический бутик. Коллекции японских моек из гранита Tetogranit и Artgranit, смесители 2-в-1 с подключением фильтра, измельчители пищевых отходов NAGARE и немецкая встройка Körting.
                </p>

                {/* Logistics Disclaimer Notice */}
                <div className="bg-[#1E2228] p-3.5 rounded-xl border border-amber-500/20 text-xs text-amber-200/90 mb-6 flex items-start space-x-2.5">
                  <span className="text-amber-400 font-bold">ℹ️</span>
                  <span>
                    <strong>Внимание:</strong> Пункта выдачи заказов по данному адресу нет. Салон работает исключительно как выставочное пространство и зона консультаций.
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#2B313A] flex items-center justify-between">
                <a
                  href="https://yandex.ru/maps/-/CDuWvEnB"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-simona-teal hover:underline font-semibold flex items-center space-x-1"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Построить маршрут в Яндекс.Картах</span>
                </a>
                <a href="tel:+78314237600" className="text-xs text-white font-mono font-semibold">
                  (831) 423-76-00
                </a>
              </div>
            </div>
          </div>

          {/* Central Warehouse Banner */}
          <div className="bg-[#16191D] border border-[#2B313A] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-left">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-md bg-[#1E2228] border border-[#2B313A] text-xs font-semibold text-zinc-300">
                <Building className="w-3.5 h-3.5 text-simona-teal" />
                <span>Основной логистический узел</span>
              </div>
              <h3 className="text-xl font-montserrat font-bold text-white">
                Центральный склад и терминал самовывоза: ул. Коминтерна, 27
              </h3>
              <p className="text-xs sm:text-sm text-[#87888A] max-w-2xl leading-relaxed">
                Основная точка выдачи крупной и встраиваемой техники. Оборудованная рампа, бесплатная погрузка в транспорт клиента, ответственное хранение заказов до 6 месяцев. График: Пн–Пт 09:00–18:00, Сб 10:00–16:00.
              </p>
            </div>

            <a
              href="https://yandex.ru/maps/-/CDuWvQ1a"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-[#1E2228] hover:bg-[#242A32] text-white border border-[#2B313A] text-xs font-semibold uppercase tracking-wider transition shrink-0 flex items-center space-x-2"
            >
              <Navigation className="w-4 h-4 text-simona-teal" />
              <span>Схема проезда к складу</span>
            </a>
          </div>
        </div>

        {/* Active Kitchen Feature Block */}
        <div className="bg-gradient-to-br from-[#16191D] to-[#1E2228] border border-[#2B313A] rounded-3xl p-6 sm:p-12 relative overflow-hidden">
          <div className="max-w-3xl text-left space-y-4">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-md bg-simona-teal/20 text-simona-teal border border-simona-teal/30 text-xs font-semibold uppercase tracking-wider">
              <SimonaIconChef className="w-4 h-4 text-simona-teal" />
              <span>Сервисная фича флагмана</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-montserrat font-bold text-white tracking-tight">
              «Активная кухня» — протестируйте технику до покупки
            </h2>
            <p className="text-xs sm:text-sm text-[#87888A] leading-relaxed">
              Не покупайте приборы вслепую по каталожным цифрам. В нашем шоуруме на Белинского, 15 установлена действующая кухня с подключенными духовыми шкафами с паром, индукционными поверхностями со скрытыми вытяжками, винными шкафами и вакууматорами.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs">
              <div className="bg-[#111315]/60 p-4 rounded-xl border border-[#2B313A]">
                <span className="font-bold text-white block mb-1">Дегустации и выпечка</span>
                <span className="text-[#87888A]">Оцените равномерность подъема теста и работу паровых программ Miele.</span>
              </div>
              <div className="bg-[#111315]/60 p-4 rounded-xl border border-[#2B313A]">
                <span className="font-bold text-white block mb-1">Акустический комфорт</span>
                <span className="text-[#87888A]">Убедитесь лично в бесшумности вытяжек Falmec и посудомоек ASKO.</span>
              </div>
              <div className="bg-[#111315]/60 p-4 rounded-xl border border-[#2B313A]">
                <span className="font-bold text-white block mb-1">Кофе-тест</span>
                <span className="text-[#87888A]">Приготовьте эспрессо или капучино на встроенных кофемашинах.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Visit Booking Form */}
        <div id="booking" className="bg-[#16191D] border border-[#2B313A] rounded-3xl p-6 sm:p-10">
          <div className="max-w-2xl mx-auto">
            <div className="text-left space-y-2 mb-8">
              <SectionBadge variant="teal" text="Индивидуальный визит" />
              <h2 className="text-2xl sm:text-3xl font-montserrat font-bold text-white tracking-tight">
                Забронировать визит и консультацию
              </h2>
              <p className="text-xs sm:text-sm text-[#87888A]">
                Выберите удобный салон и время. Эксперт подготовит интересующие вас модели и зарезервирует демонстрационную зону.
              </p>
            </div>

            {success ? (
              <div className="bg-[#1E2228] border border-simona-teal/40 rounded-2xl p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-simona-teal/10 border border-simona-teal/30 text-simona-teal flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-montserrat font-bold text-white">Визит успешно забронирован!</h3>
                <p className="text-xs text-[#87888A] max-w-md mx-auto leading-relaxed">
                  Мы ждем вас в салоне. Менеджер свяжется для подтверждения времени и ответит на предварительные вопросы.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="px-6 py-2.5 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-semibold uppercase tracking-wider"
                >
                  Забронировать еще визит
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-2">Выберите салон для визита:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedShowroom('BELINSKOGO_15')}
                      className={`p-3.5 rounded-xl border text-left transition ${
                        selectedShowroom === 'BELINSKOGO_15'
                          ? 'bg-simona-teal/15 border-simona-teal text-white'
                          : 'bg-[#1E2228] border-[#2B313A] text-[#87888A] hover:text-white'
                      }`}
                    >
                      <div className="font-semibold text-white text-xs">Флагман на Белинского, 15</div>
                      <div className="text-[11px] text-[#87888A] mt-0.5">Встройка, Активная кухня, Miele/SMEG</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedShowroom('BELINSKOGO_11')}
                      className={`p-3.5 rounded-xl border text-left transition ${
                        selectedShowroom === 'BELINSKOGO_11'
                          ? 'bg-simona-teal/15 border-simona-teal text-white'
                          : 'bg-[#1E2228] border-[#2B313A] text-[#87888A] hover:text-white'
                      }`}
                    >
                      <div className="font-semibold text-white text-xs">Салон на Белинского, 11/66</div>
                      <div className="text-[11px] text-[#87888A] mt-0.5">OMOIKIRI, мойки, смесители, Körting</div>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1.5">Ваше имя *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ольга"
                      className="w-full px-4 py-3 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white focus:outline-none focus:border-simona-teal"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1.5">Телефон для подтверждения *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+7 (900) 000-00-00"
                      className="w-full px-4 py-3 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white focus:outline-none focus:border-simona-teal"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1.5">Желаемая дата</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white focus:outline-none focus:border-simona-teal"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1.5">Желаемое время</label>
                    <select
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white focus:outline-none focus:border-simona-teal"
                    >
                      <option value="11:00">11:00</option>
                      <option value="13:00">13:00</option>
                      <option value="15:00">15:00</option>
                      <option value="17:00">17:00</option>
                      <option value="19:00">19:00</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1.5">Цель визита</label>
                  <select
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white focus:outline-none focus:border-simona-teal"
                  >
                    <option value="ACTIVE_KITCHEN">Тест-драйв в «Активной кухне»</option>
                    <option value="FULL_SET">Подбор полного комплекта техники под дизайн-проект</option>
                    <option value="OMOIKIRI_SINKS">Подбор мойки, смесителя и измельчителя OMOIKIRI</option>
                    <option value="ARCHITECT_MEETING">Встреча дизайнера с клиентом в лаундже</option>
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-simona-teal/20 flex items-center justify-center space-x-2"
                  >
                    <span>{submitting ? 'Отправка...' : 'Подтвердить бронирование визита'}</span>
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

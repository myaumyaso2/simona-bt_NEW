'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SectionBadge } from '@/components/ui/SectionBadge';
import {
  SimonaIconDelivery,
  SimonaIconGuarantee,
  SimonaIconPin,
  SimonaIconClock,
  SimonaIconPhoneSolid,
  SimonaIconStar,
  SimonaIconCheck,
  SimonaIconCheckCircle,
  SimonaIconBuilding,
} from '@/components/brand/SimonaIcons';
import {
  Wrench,
  Ruler,
  Calendar,
  Send,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useAnalyticsData } from '@/lib/analytics/utm';
import { trackGoal } from '@/lib/analytics/tracker';

export default function ServicesPage() {
  const analyticsData = useAnalyticsData();
  const [serviceType, setServiceType] = useState('INSTALLATION');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'PROJECT_MATCHING',
          name,
          phone,
          comment: `Услуга: ${serviceType} | Адрес: ${address} | Детали: ${comment}`,
          ...analyticsData,
        }),
      });

      if (!res.ok) throw new Error('Ошибка отправки заявки');

      setSuccess(true);
      trackGoal('SERVICE_REQUEST_SUBMIT', { serviceType, name, phone });
    } catch (err) {
      console.error(err);
      alert('Ошибка при отправке. Пожалуйста, позвоните нам: +7 (831) 423-76-00');
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
            <SectionBadge variant="teal" text="Премиальный сервисный контур" />
            <h1 className="text-3xl sm:text-5xl font-montserrat font-bold text-white tracking-tight leading-tight">
              Сервисная экосистема «СИМОНА»
            </h1>
            <p className="text-sm sm:text-base text-[#87888A] leading-relaxed">
              Покупка премиальной техники — это комплексный процесс. Мы берем на себя каждый этап: от предварительного инженерного аудита и бесплатного складского хранения до монтажа в перчатках и авторизованного сервисного обслуживания.
            </p>
            <div className="pt-2">
              <a
                href="#order-service"
                className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-simona-teal/20"
              >
                <span>Заказать шеф-монтаж или выезд инженера</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* 4 Pillars of Service */}
        <div className="space-y-6">
          <div className="text-left space-y-2">
            <SectionBadge variant="teal" text="Стандарты заботы" />
            <h2 className="text-2xl sm:text-3xl font-montserrat font-bold text-white tracking-tight">
              4 опоры нашего сервисного обслуживания
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pillar 1: White Glove Delivery */}
            <div className="bg-[#16191D] border border-[#2B313A] rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-simona-teal/50 transition shadow-xl">
              <div>
                <div className="w-12 h-12 rounded-xl bg-simona-teal/10 border border-simona-teal/30 text-simona-teal flex items-center justify-center mb-4">
                  <SimonaIconDelivery className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-montserrat font-bold text-white mb-2">
                  Доставка в белых перчатках
                </h3>
                <p className="text-xs sm:text-sm text-[#87888A] leading-relaxed mb-4">
                  Собственный специализированный автопарк с гидролифтами. Экипаж из двух опытных экспедиторов бережно заносит крупногабаритные приборы в квартиру, распаковывает в белых перчатках, проверяет целостность стекол и эмали при клиенте и утилизирует упаковочный картон.
                </p>
                <ul className="space-y-2 text-xs text-zinc-300">
                  <li className="flex items-center space-x-2">
                    <SimonaIconCheck className="w-4 h-4 text-simona-teal shrink-0" />
                    <span>Бесплатно при сумме заказа от 50 000 ₽ по Нижнему Новгороду</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <SimonaIconCheck className="w-4 h-4 text-simona-teal shrink-0" />
                    <span>Согласование точного 2-часового окна прибытия</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <SimonaIconCheck className="w-4 h-4 text-simona-teal shrink-0" />
                    <span>Подъем на любой этаж на грузовом или пассажирском лифте</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-[#2B313A] text-xs font-semibold text-simona-teal">
                Гарантия 100% сохранности внешнего вида техники
              </div>
            </div>

            {/* Pillar 2: Certified Installation */}
            <div className="bg-[#16191D] border border-[#2B313A] rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-simona-teal/50 transition shadow-xl">
              <div>
                <div className="w-12 h-12 rounded-xl bg-simona-teal/10 border border-simona-teal/30 text-simona-teal flex items-center justify-center mb-4">
                  <Wrench className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-montserrat font-bold text-white mb-2">
                  Сертифицированный шеф-монтаж
                </h3>
                <p className="text-xs sm:text-sm text-[#87888A] leading-relaxed mb-4">
                  Монтаж премиальной встройки требует инженерной точности. Наши мастера прошли сертификацию на заводах Miele, ASKO, SMEG и Falmec. Выполняем скрытую навеску мебельных фасадов, балансировку петель, подключение к 3-фазной сети и пуско-наладку.
                </p>
                <ul className="space-y-2 text-xs text-zinc-300">
                  <li className="flex items-center space-x-2">
                    <SimonaIconCheck className="w-4 h-4 text-simona-teal shrink-0" />
                    <span>Сохранение полной фабричной гарантии производителя</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <SimonaIconCheck className="w-4 h-4 text-simona-teal shrink-0" />
                    <span>Дополнительная гарантия 2 года на выполненные монтажные работы</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <SimonaIconCheck className="w-4 h-4 text-simona-teal shrink-0" />
                    <span>Подключение посудомоек с защитой AquaStop и гидроизоляцией</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-[#2B313A] text-xs font-semibold text-simona-teal">
                Аттестованные специалисты с допусками
              </div>
            </div>

            {/* Pillar 3: Free 6-Month Warehouse Storage */}
            <div className="bg-[#16191D] border border-[#2B313A] rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-simona-teal/50 transition shadow-xl">
              <div>
                <div className="w-12 h-12 rounded-xl bg-simona-teal/10 border border-simona-teal/30 text-simona-teal flex items-center justify-center mb-4">
                  <SimonaIconBuilding className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-montserrat font-bold text-white mb-2">
                  Бесплатное хранение до 6 месяцев
                </h3>
                <p className="text-xs sm:text-sm text-[#87888A] leading-relaxed mb-4">
                  Ремонт затягивается или мебель еще не доставлена? Оплаченные приборы будут бесплатно и надежно храниться на нашем Центральном складе (г. Нижний Новгород, ул. Коминтерна, 27) в сухом отапливаемом боксе со страхованием 100% стоимости.
                </p>
                <ul className="space-y-2 text-xs text-zinc-300">
                  <li className="flex items-center space-x-2">
                    <SimonaIconCheck className="w-4 h-4 text-simona-teal shrink-0" />
                    <span>Фиксация цены приборов от скачков курсов валют</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <SimonaIconCheck className="w-4 h-4 text-simona-teal shrink-0" />
                    <span>Круглосуточная охрана, видеонаблюдение и температурный режим</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <SimonaIconCheck className="w-4 h-4 text-simona-teal shrink-0" />
                    <span>Доставка на объект по вашему первому звонку</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-[#2B313A] text-xs font-semibold text-simona-teal">
                Склад: Нижний Новгород, ул. Коминтерна, 27
              </div>
            </div>

            {/* Pillar 4: On-site Engineering Audit */}
            <div className="bg-[#16191D] border border-[#2B313A] rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-simona-teal/50 transition shadow-xl">
              <div>
                <div className="w-12 h-12 rounded-xl bg-simona-teal/10 border border-simona-teal/30 text-simona-teal flex items-center justify-center mb-4">
                  <Ruler className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-montserrat font-bold text-white mb-2">
                  Выездной инженерный замер объекта
                </h3>
                <p className="text-xs sm:text-sm text-[#87888A] leading-relaxed mb-4">
                  Предотвратите дорогостоящие переделки на этапе черновых работ. Наш технический специалист выезжает на объект, проводит лазерные замеры ниш, проверяет расположение розеток, сечение силового кабеля и пропускную способность вентиляции.
                </p>
                <ul className="space-y-2 text-xs text-zinc-300">
                  <li className="flex items-center space-x-2">
                    <SimonaIconCheck className="w-4 h-4 text-simona-teal shrink-0" />
                    <span>Формирование технического листа ТЗ для кухонной фабрики</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <SimonaIconCheck className="w-4 h-4 text-simona-teal shrink-0" />
                    <span>Проверка правильности вывода фаз для индукционных панелей</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <SimonaIconCheck className="w-4 h-4 text-simona-teal shrink-0" />
                    <span>Расчет сопротивления вентканалов для вытяжек</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-[#2B313A] text-xs font-semibold text-simona-teal">
                Выезд по Нижнему Новгороду и коттеджным поселкам
              </div>
            </div>
          </div>
        </div>

        {/* Order Service Request Form */}
        <div id="order-service" className="bg-[#16191D] border border-[#2B313A] rounded-3xl p-6 sm:p-10">
          <div className="max-w-2xl mx-auto">
            <div className="text-left space-y-2 mb-8">
              <SectionBadge variant="teal" text="Заказ сервисных услуг" />
              <h2 className="text-2xl sm:text-3xl font-montserrat font-bold text-white tracking-tight">
                Оставить заявку на монтаж или замер
              </h2>
              <p className="text-xs sm:text-sm text-[#87888A]">
                Сервисный координатор свяжется с вами в течение 30 минут для согласования даты и состава работ.
              </p>
            </div>

            {success ? (
              <div className="bg-[#1E2228] border border-simona-teal/40 rounded-2xl p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-simona-teal/10 border border-simona-teal/30 text-simona-teal flex items-center justify-center mx-auto">
                  <SimonaIconCheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-montserrat font-bold text-white">Заявка успешно принята!</h3>
                <p className="text-xs text-[#87888A] max-w-md mx-auto leading-relaxed">
                  Мастер сервисной службы СИМОНА свяжется с вами для согласования удобного времени визита на объект.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="px-6 py-2.5 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-semibold uppercase tracking-wider"
                >
                  Оставить еще заявку
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-2">Какая услуга вам требуется?</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setServiceType('INSTALLATION')}
                      className={`p-3 rounded-xl border text-left transition ${
                        serviceType === 'INSTALLATION'
                          ? 'bg-simona-teal/15 border-simona-teal text-white'
                          : 'bg-[#1E2228] border-[#2B313A] text-[#87888A] hover:text-white'
                      }`}
                    >
                      <div className="font-semibold text-white">Шеф-монтаж и подключение</div>
                      <div className="text-[10px] text-[#87888A]">Встройка приборов, навеска фасадов</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setServiceType('ON_SITE_AUDIT')}
                      className={`p-3 rounded-xl border text-left transition ${
                        serviceType === 'ON_SITE_AUDIT'
                          ? 'bg-simona-teal/15 border-simona-teal text-white'
                          : 'bg-[#1E2228] border-[#2B313A] text-[#87888A] hover:text-white'
                      }`}
                    >
                      <div className="font-semibold text-white">Выездной замер и аудит</div>
                      <div className="text-[10px] text-[#87888A]">Проверка электрики и ниш до ремонта</div>
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
                      placeholder="Сергей"
                      className="w-full px-4 py-3 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white focus:outline-none focus:border-simona-teal"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1.5">Номер телефона *</label>
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

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1.5">Адрес объекта (город, улица, дом)</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="г. Нижний Новгород, ЖК Симфония, кв. 14"
                    className="w-full px-4 py-3 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white focus:outline-none focus:border-simona-teal"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1.5">Комментарий или перечень приборов</label>
                  <textarea
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Например: варочная индукция, духовой шкаф Miele, вытяжка, посудомойка..."
                    className="w-full px-4 py-3 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white focus:outline-none focus:border-simona-teal resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-simona-teal/20 flex items-center justify-center space-x-2"
                  >
                    <span>{submitting ? 'Отправка...' : 'Отправить сервисную заявку'}</span>
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Hot Contact Bar */}
        <div className="bg-[#16191D] border border-[#2B313A] rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-simona-teal/10 text-simona-teal flex items-center justify-center shrink-0">
              <SimonaIconPhoneSolid className="w-5 h-5" />
            </div>
            <div>
              <span className="font-semibold text-white block">Прямой диспетчер сервисной службы</span>
              <span className="text-[#87888A]">Ежедневно с 09:00 до 20:00 без выходных</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="tel:+78314237600"
              className="text-white hover:text-simona-teal font-semibold font-mono text-sm transition"
            >
              +7 (831) 423-76-00
            </a>
            <span className="text-[#87888A]">service@simona-bt.ru</span>
          </div>
        </div>
      </div>
    </main>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SectionBadge } from '@/components/ui/SectionBadge';
import {
  SimonaIconGuarantee,
  SimonaIconCheck,
  SimonaIconPhoneSolid,
} from '@/components/brand/SimonaIcons';
import {
  Tag,
  Scale,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Send,
  HelpCircle,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { useAnalyticsData } from '@/lib/analytics/utm';
import { trackGoal } from '@/lib/analytics/tracker';

const CRITERIA = [
  {
    title: '1. Идентичный товар',
    desc: 'Полное совпадение бренда, наименования, заводского артикула, цвета, комплектации и года выпуска.',
  },
  {
    title: '2. Официальный статус',
    desc: 'Магазин конкурента является авторизованным дилером производителя в РФ и предоставляет официальную гарантию.',
  },
  {
    title: '3. Реальное наличие',
    desc: 'Товар фактически доступен к заказу и доставке в Нижний Новгород (учитывается конечная цена с доставкой).',
  },
  {
    title: '4. Подтверждение цены',
    desc: 'Цена активна на момент проверки и не обусловлена уценкой, витринным образцом с дефектами или ошибкой на сайте.',
  },
];

export default function PriceMatchPage() {
  const analyticsData = useAnalyticsData();
  const [productName, setProductName] = useState('');
  const [competitorUrl, setCompetitorUrl] = useState('');
  const [competitorPrice, setCompetitorPrice] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
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
          type: 'PRICE_MATCH',
          name: clientName,
          phone: clientPhone,
          comment: `Гарантия лучшей цены: Товар: ${productName} | Ссылка конкурента: ${competitorUrl} | Цена конкурента: ${competitorPrice} ₽`,
          ...analyticsData,
        }),
      });
      if (!res.ok) throw new Error('Ошибка отправки запроса');
      setSuccess(true);
      trackGoal('PRICE_MATCH_SUBMIT', { productName, competitorPrice });
    } catch (err) {
      console.error(err);
      alert('Ошибка при отправке. Пожалуйста, позвоните нам: +7 (831) 423-76-00');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#111315] text-[#D7D9DB] pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header Hero */}
        <div className="bg-[#16191D] border border-[#2B313A] rounded-3xl p-6 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-simona-teal/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl text-left space-y-4">
            <SectionBadge variant="teal">
              Честная ценовая политика
            </SectionBadge>
            <h1 className="text-3xl sm:text-5xl font-montserrat font-bold text-white tracking-tight leading-tight">
              Гарантия лучшей цены. Нашли дешевле?
            </h1>
            <p className="text-sm sm:text-base text-[#87888A] leading-relaxed">
              Более 30 лет мы работаем напрямую с производителями европейской и надежной бытовой техники. Если вы нашли желаемый прибор дешевле у другого официального дилера — отправьте нам ссылку, и мы сформируем для вас более выгодное комплексное предложение.
            </p>
            <div className="pt-2">
              <a
                href="#request-form"
                className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-semibold tracking-wide transition shadow-lg shadow-simona-teal/20"
              >
                <span>Отправить заявку на снижение цены</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* 4 Pillars of Fair Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#16191D] border border-[#2B313A] rounded-3xl p-6 space-y-3 hover:border-simona-teal/40 transition">
            <div className="w-10 h-10 rounded-xl bg-simona-teal/10 border border-simona-teal/30 text-simona-teal flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-montserrat font-bold text-white">Прямые контракты</h3>
            <p className="text-xs text-[#87888A] leading-relaxed">
              Работаем без лишних перекупщиков: поставляем технику напрямую с центральных складов брендов в России.
            </p>
          </div>

          <div className="bg-[#16191D] border border-[#2B313A] rounded-3xl p-6 space-y-3 hover:border-simona-teal/40 transition">
            <div className="w-10 h-10 rounded-xl bg-simona-teal/10 border border-simona-teal/30 text-simona-teal flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-base font-montserrat font-bold text-white">Честный расчет</h3>
            <p className="text-xs text-[#87888A] leading-relaxed">
              Учитываем полную стоимость: доставку до квартиры, подъем и сервисное обслуживание, а не только голую цену на сайте.
            </p>
          </div>

          <div className="bg-[#16191D] border border-[#2B313A] rounded-3xl p-6 space-y-3 hover:border-simona-teal/40 transition">
            <div className="w-10 h-10 rounded-xl bg-simona-teal/10 border border-simona-teal/30 text-simona-teal flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-montserrat font-bold text-white">Ответ за 60 минут</h3>
            <p className="text-xs text-[#87888A] leading-relaxed">
              В рабочие часы дежурный эксперт проверит информацию и предложит вам специальную скидку или подарок к заказу.
            </p>
          </div>

          <div className="bg-[#16191D] border border-[#2B313A] rounded-3xl p-6 space-y-3 hover:border-simona-teal/40 transition">
            <div className="w-10 h-10 rounded-xl bg-simona-teal/10 border border-simona-teal/30 text-simona-teal flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-montserrat font-bold text-white">Официальная гарантия</h3>
            <p className="text-xs text-[#87888A] leading-relaxed">
              Даже при снижении цены вы получаете полный пакет гарантийного сопровождения и право на авторизованный сервис.
            </p>
          </div>
        </div>

        {/* Criteria & Form Split */}
        <div id="request-form" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Program Rules (5 Cols) */}
          <div className="lg:col-span-5 bg-[#16191D] border border-[#2B313A] rounded-3xl p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-simona-teal font-semibold">Условия программы</span>
              <h3 className="text-xl font-montserrat font-bold text-white mb-2">
                Критерии сравнения цен
              </h3>
              <p className="text-xs text-[#87888A] leading-relaxed">
                Чтобы мы могли предложить лучшую цену, предложение конкурента должно соответствовать прозрачным критериям:
              </p>
            </div>

            <div className="space-y-4">
              {CRITERIA.map((crit, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-[#1E2228] border border-[#2B313A] space-y-1">
                  <div className="text-xs font-semibold text-white">{crit.title}</div>
                  <p className="text-xs text-[#87888A] leading-relaxed">{crit.desc}</p>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-[#1E2228]/50 border border-[#2B313A]/50 text-xs text-[#87888A]">
              Программа не распространяется на предложения частных лиц на досках объявлений, витринные образцы со следами эксплуатации или серые поставки без российской гарантии.
            </div>
          </div>

          {/* Submission Form (7 Cols) */}
          <div className="lg:col-span-7 bg-[#16191D] border border-[#2B313A] rounded-3xl p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-simona-teal font-semibold">Быстрая заявка</span>
              <h3 className="text-xl font-montserrat font-bold text-white mb-2">
                Запрос на снижение стоимости
              </h3>
              <p className="text-xs text-[#87888A] leading-relaxed">
                Укажите модель прибора и ссылку на страницу товара у конкурента. Мы согласуем для вас специальную цену.
              </p>
            </div>

            {success ? (
              <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-white">Заявка принята в обработку</h4>
                <p className="text-xs text-zinc-300 max-w-md mx-auto">
                  Специалист отдела продаж проверит цену конкурента и перезвонит вам в течение 1 часа с персональным предложением.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] text-[#87888A] mb-1">
                    Модель прибора или артикул в «СИМОНЕ» *
                  </label>
                  <input
                    type="text"
                    required
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Например: Духовой шкаф ASKO OCS8678G или код 89083"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white text-xs placeholder-[#5A606A] focus:outline-none focus:border-simona-teal transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] text-[#87888A] mb-1">
                      Ссылка на товар у конкурента *
                    </label>
                    <input
                      type="url"
                      required
                      value={competitorUrl}
                      onChange={(e) => setCompetitorUrl(e.target.value)}
                      placeholder="https://magazin.ru/product..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white text-xs placeholder-[#5A606A] focus:outline-none focus:border-simona-teal transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#87888A] mb-1">
                      Цена у конкурента (₽) *
                    </label>
                    <input
                      type="number"
                      required
                      value={competitorPrice}
                      onChange={(e) => setCompetitorPrice(e.target.value)}
                      placeholder="98500"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white text-xs placeholder-[#5A606A] focus:outline-none focus:border-simona-teal transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] text-[#87888A] mb-1">Ваше имя *</label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Дмитрий"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white text-xs placeholder-[#5A606A] focus:outline-none focus:border-simona-teal transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#87888A] mb-1">Контактный телефон *</label>
                    <input
                      type="tel"
                      required
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="+7 (999) 000-00-00"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white text-xs placeholder-[#5A606A] focus:outline-none focus:border-simona-teal transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-semibold tracking-wide transition shadow-lg shadow-simona-teal/20 flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <span>Отправка запроса...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Получить персональное ценовое предложение</span>
                    </>
                  )}
                </button>

                <p className="text-[10px] text-[#87888A] text-center">
                  Мы свяжемся с вами в течение 1 часа в рабочее время (ежедневно с 10:00 до 20:00).
                </p>
              </form>
            )}
          </div>

        </div>

      </div>
    </main>
  );
}

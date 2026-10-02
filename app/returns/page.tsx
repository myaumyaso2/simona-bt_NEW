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
  RotateCcw,
  Scale,
  FileText,
  AlertCircle,
  Clock,
  ArrowRight,
  Download,
  CheckCircle2,
  HelpCircle,
  Send,
} from 'lucide-react';
import { useAnalyticsData } from '@/lib/analytics/utm';
import { trackGoal } from '@/lib/analytics/tracker';

const RETURN_STEPS = [
  {
    step: '01',
    title: 'Подача заявления',
    desc: 'Заполните онлайн-форму ниже или обратитесь во флагманский салон на ул. Белинского, 15 с паспортом, кассовым чеком и накладной.',
  },
  {
    step: '02',
    title: 'Проверка качества',
    desc: 'Осмотр прибора сервисным инженером для подтверждения сохранности товарного вида либо фиксации заводского брака.',
  },
  {
    step: '03',
    title: 'Принятие решения',
    desc: 'Срок рассмотрения заявления и возврата денежных средств — до 10 календарных дней согласно ст. 22 ЗоЗПП РФ.',
  },
  {
    step: '04',
    title: 'Возврат средств или замена',
    desc: 'Деньги возвращаются на ту же банковскую карту, с которой была совершена оплата, либо отгружается новый прибор.',
  },
];

export default function ReturnsPage() {
  const analyticsData = useAnalyticsData();
  const [activeTab, setActiveTab] = useState<'distance' | 'defect' | 'expert'>('distance');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [reason, setReason] = useState('');
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
          type: 'RETURN_REQUEST',
          name,
          phone,
          comment: `Запрос на возврат: Заказ №: ${orderNumber} | Причина: ${reason}`,
          ...analyticsData,
        }),
      });
      if (!res.ok) throw new Error('Ошибка отправки заявления');
      setSuccess(true);
      trackGoal('RETURN_REQUEST_SUBMIT', { orderNumber });
    } catch (err) {
      console.error(err);
      alert('Ошибка при отправке. Пожалуйста, позвоните нам: +7 (831) 423-76-00');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadBlank = () => {
    // Generate text/file for claim form
    const formContent = `ЗАЯВЛЕНИЕ О ВОЗВРАТЕ ТОВАРА
Руководству ООО «Технотрейд-НН» (Салоны бытовой техники «СИМОНА»)
От покупателя (ФИО): __________________________________________________
Паспортные данные: Серия ______ Номер ________ Кем выдан: ______________
Телефон: _______________________ Email: _______________________________

ЗАЯВЛЕНИЕ
Прошу принять к возврату товар:
Наименование прибора: ________________________________________________
Серийный номер (S/N): _________________ Дата покупки: ________________
Номер кассового/товарного чека: _______________________________________
Причина возврата:
[ ] Товар надлежащего качества (дистанционная покупка, 7 дней)
[ ] Обнаружен производственный дефект в течение 15 дней
[ ] Существенный недостаток / гарантийный ремонт свыше 45 дней
Подробное описание: __________________________________________________

Прошу вернуть денежные средства:
[ ] На банковскую карту, с которой производилась оплата
[ ] На расчетный счет: _______________________________________________
Банк получателя: _____________________ БИК: __________________________
Корр. счет: __________________________ Номер счета: __________________

Дата: «____» ____________ 202__ г.     Подпись: ______________________`;

    const blob = new Blob([formContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Zayavlenie_na_vozvrat_Simona_bt.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-[#111315] text-[#D7D9DB] pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header Hero */}
        <div className="bg-[#16191D] border border-[#2B313A] rounded-3xl p-6 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-simona-teal/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl text-left space-y-4">
            <SectionBadge variant="teal">
              Защита прав потребителей
            </SectionBadge>
            <h1 className="text-3xl sm:text-5xl font-montserrat font-bold text-white tracking-tight leading-tight">
              Возврат и обмен товара. Честные правила
            </h1>
            <p className="text-sm sm:text-base text-[#87888A] leading-relaxed">
              Мы строго следуем законодательству РФ (ЗоЗПП 2300-1 и Постановление № 924). Любые вопросы возврата, обмена или рекламаций решаются открыто, уважительно и в установленные законом сроки без искусственных бюрократических препятствий.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="#return-form"
                className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-semibold tracking-wide transition shadow-lg shadow-simona-teal/20"
              >
                <span>Подать заявление онлайн</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <button
                onClick={handleDownloadBlank}
                className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-[#1E2228] hover:bg-[#252B33] border border-[#2B313A] text-white text-xs font-semibold tracking-wide transition"
              >
                <Download className="w-4 h-4 text-simona-teal" />
                <span>Скачать бланк заявления</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4-Step Process Flowchart */}
        <div className="space-y-6">
          <div className="text-left space-y-1">
            <span className="text-xs uppercase tracking-widest text-simona-teal font-semibold">Порядок действий</span>
            <h2 className="text-2xl sm:text-3xl font-montserrat font-bold text-white tracking-tight">
              4 шага процедуры возврата
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {RETURN_STEPS.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#16191D] border border-[#2B313A] rounded-3xl p-6 space-y-3 hover:border-simona-teal/40 transition relative group"
              >
                <div className="text-2xl font-montserrat font-bold text-simona-teal/40 group-hover:text-simona-teal transition-colors">
                  {item.step}
                </div>
                <h3 className="text-base font-bold text-white">{item.title}</h3>
                <p className="text-xs text-[#87888A] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Legal Scenarios (Tabs) */}
        <div className="bg-[#16191D] border border-[#2B313A] rounded-3xl p-6 sm:p-10 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2B313A] pb-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-simona-teal font-semibold">Юридические нормы ЗоЗПП РФ</span>
              <h2 className="text-2xl font-montserrat font-bold text-white tracking-tight">
                Условия возврата по категориям
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTab('distance')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition ${
                  activeTab === 'distance'
                    ? 'bg-simona-teal text-white shadow-md shadow-simona-teal/20'
                    : 'bg-[#1E2228] border border-[#2B313A] text-[#87888A] hover:text-white'
                }`}
              >
                Дистанционная покупка (7 дней)
              </button>
              <button
                onClick={() => setActiveTab('defect')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition ${
                  activeTab === 'defect'
                    ? 'bg-simona-teal text-white shadow-md shadow-simona-teal/20'
                    : 'bg-[#1E2228] border border-[#2B313A] text-[#87888A] hover:text-white'
                }`}
              >
                Товар с недостатком (15 дней / гарантия)
              </button>
              <button
                onClick={() => setActiveTab('expert')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition ${
                  activeTab === 'expert'
                    ? 'bg-simona-teal text-white shadow-md shadow-simona-teal/20'
                    : 'bg-[#1E2228] border border-[#2B313A] text-[#87888A] hover:text-white'
                }`}
              >
                Экспертиза и сроки возврата
              </button>
            </div>
          </div>

          {activeTab === 'distance' && (
            <div className="space-y-4 text-xs text-zinc-300 leading-relaxed">
              <div className="p-4 rounded-2xl bg-[#1E2228] border border-[#2B313A] flex items-start gap-3">
                <RotateCcw className="w-5 h-5 text-simona-teal shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white text-sm block mb-1">
                    Покупка в интернет-магазине simona-bt.ru (ст. 26.1 ЗоЗПП РФ):
                  </strong>
                  <span>
                    Вы вправе отказаться от товара в любое время до его передачи, а после передачи — в течение <strong>7 календарных дней</strong>.
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <h4 className="text-sm font-bold text-white">Обязательные требования к возврату надлежащего качества:</h4>
                <ul className="space-y-1.5 pl-2">
                  <li className="flex items-start gap-2">
                    <SimonaIconCheck className="w-4 h-4 text-simona-teal shrink-0 mt-0.5" />
                    <span>Товар не был в употреблении, не монтировался и не подключался к коммуникациям (воде, газу, электричеству).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <SimonaIconCheck className="w-4 h-4 text-simona-teal shrink-0 mt-0.5" />
                    <span>Полностью сохранены товарный вид, потребительские свойства, заводские пломбы, защитные пленки и ярлыки.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <SimonaIconCheck className="w-4 h-4 text-simona-teal shrink-0 mt-0.5" />
                    <span>Сохранена оригинальная заводская упаковка и полная комплектность (инструкции, крепеж, кабели).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <SimonaIconCheck className="w-4 h-4 text-simona-teal shrink-0 mt-0.5" />
                    <span>Наличие документа, подтверждающего факт покупки (электронный чек, накладная, номер заказа).</span>
                  </li>
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs">
                При покупке непосредственно в физическом салоне (офлайн) технически сложные товары бытового назначения (Постановление Правительства РФ № 924) надлежащего качества обмену и возврату не подлежат.
              </div>
            </div>
          )}

          {activeTab === 'defect' && (
            <div className="space-y-4 text-xs text-zinc-300 leading-relaxed">
              <div className="p-4 rounded-2xl bg-[#1E2228] border border-[#2B313A] flex items-start gap-3">
                <Scale className="w-5 h-5 text-simona-teal shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white text-sm block mb-1">
                    Обнаружение производственного брака в технически сложном товаре (ст. 18 ЗоЗПП РФ):
                  </strong>
                  <span>
                    Бытовая техника входит в перечень технически сложных товаров (Постановление Правительства РФ от 10.11.2011 № 924).
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-[#1E2228]/50 border border-[#2B313A] space-y-2">
                  <span className="text-simona-teal font-semibold text-xs block">Первые 15 дней с момента покупки:</span>
                  <p>
                    При обнаружении <strong>любого производственного дефекта</strong> вы имеете право по своему выбору:
                  </p>
                  <ul className="space-y-1 list-disc pl-4 text-zinc-400">
                    <li>Потребовать полного возврата уплаченных денежных средств;</li>
                    <li>Потребовать замены на прибор этой же марки и модели;</li>
                    <li>Потребовать замены на другой прибор с перерасчетом цены.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-[#1E2228]/50 border border-[#2B313A] space-y-2">
                  <span className="text-simona-teal font-semibold text-xs block">По истечении 15 дней:</span>
                  <p>
                    Возврат или замена осуществляются в следующих случаях:
                  </p>
                  <ul className="space-y-1 list-disc pl-4 text-zinc-400">
                    <li>Обнаружен <strong>существенный недостаток</strong> (неустранимый или повторяющийся вновь);</li>
                    <li>Нарушены установленные законом сроки гарантийного ремонта (более 45 дней);</li>
                    <li>Невозможность использовать прибор более 30 дней в течение каждого гарантийного года.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'expert' && (
            <div className="space-y-4 text-xs text-zinc-300 leading-relaxed">
              <div className="p-4 rounded-2xl bg-[#1E2228] border border-[#2B313A] flex items-start gap-3">
                <Clock className="w-5 h-5 text-simona-teal shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white text-sm block mb-1">
                    Проверка качества и независимая экспертиза:
                  </strong>
                  <span>
                    При возникновении разногласий о причинах дефекта продавец проводит проверку качества либо независимую экспертизу за свой счет.
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <h4 className="text-sm font-bold text-white">Сроки удовлетворения требований (ЗоЗПП РФ):</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-[#1E2228] border border-[#2B313A] text-simona-teal font-mono font-bold shrink-0">10 дней</span>
                    <span>Срок возврата денежных средств со дня предъявления требования (ст. 22 ЗоЗПП РФ).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-[#1E2228] border border-[#2B313A] text-simona-teal font-mono font-bold shrink-0">7–20 дней</span>
                    <span>Срок замены товара (до 20 дней при необходимости дополнительной проверки качества, ст. 21 ЗоЗПП РФ).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-[#1E2228] border border-[#2B313A] text-simona-teal font-mono font-bold shrink-0">до 45 дней</span>
                    <span>Максимальный предельный срок безвозмездного гарантийного ремонта (ст. 20 ЗоЗПП РФ).</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Claim Submission Form */}
        <div id="return-form" className="bg-[#16191D] border border-[#2B313A] rounded-3xl p-6 sm:p-10 space-y-6">
          <div className="border-b border-[#2B313A] pb-4">
            <span className="text-xs uppercase tracking-widest text-simona-teal font-semibold">Электронная подача</span>
            <h2 className="text-2xl sm:text-3xl font-montserrat font-bold text-white tracking-tight">
              Заявление на возврат или обмен товара
            </h2>
            <p className="text-xs text-[#87888A] mt-1">
              Заполните данные по заказу. Наш юридическо-сервисный отдел свяжется с вами для согласования даты осмотра и оформления акта.
            </p>
          </div>

          {success ? (
            <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h4 className="text-base font-bold text-white">Заявление успешно принято к рассмотрению</h4>
              <p className="text-xs text-zinc-300 max-w-md mx-auto">
                Номер обращения зарегистрирован. В течение 24 часов вам перезвонит сотрудник клиентского сервиса для назначения даты осмотра прибора.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] text-[#87888A] mb-1">ФИО покупателя *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Иванов Иван Иванович"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white text-xs placeholder-[#5A606A] focus:outline-none focus:border-simona-teal transition"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[#87888A] mb-1">Контактный телефон *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+7 (999) 000-00-00"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white text-xs placeholder-[#5A606A] focus:outline-none focus:border-simona-teal transition"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[#87888A] mb-1">Номер заказа или чека *</label>
                  <input
                    type="text"
                    required
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="Например: 12480"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white text-xs placeholder-[#5A606A] focus:outline-none focus:border-simona-teal transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-[#87888A] mb-1">Причина возврата или описание дефекта *</label>
                <textarea
                  required
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Опишите ситуацию: возврат товара надлежащего качества (в 7-дневный срок) либо характер обнаруженного недостатка..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white text-xs placeholder-[#5A606A] focus:outline-none focus:border-simona-teal transition resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-semibold tracking-wide transition shadow-lg shadow-simona-teal/20 flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <span>Регистрация заявления...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Отправить электронное заявление</span>
                    </>
                  )}
                </button>

                <p className="text-[10px] text-[#87888A]">
                  Все обращения регистрируются в соответствии со ст. 22 Закона РФ «О защите прав потребителей».
                </p>
              </div>
            </form>
          )}
        </div>

      </div>
    </main>
  );
}

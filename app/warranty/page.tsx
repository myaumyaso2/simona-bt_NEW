'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SectionBadge } from '@/components/ui/SectionBadge';
import {
  SimonaIconGuarantee,
  SimonaIconCheck,
  SimonaIconPhoneSolid,
  SimonaIconBuilding,
} from '@/components/brand/SimonaIcons';
import {
  Wrench,
  ShieldCheck,
  Award,
  AlertTriangle,
  FileCheck,
  Clock,
  PhoneCall,
  Send,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { useAnalyticsData } from '@/lib/analytics/utm';
import { trackGoal } from '@/lib/analytics/tracker';

const BRAND_WARRANTIES = [
  {
    brand: 'ASKO (Швеция)',
    period: '2 года официальной гарантии',
    desc: 'Премиальные стиральные, сушильные, посудомоечные машины и кухонные комплекты. Бесплатный выезд сертифицированного мастера при гарантийном случае.',
    hotline: '8 (800) 707-08-07',
  },
  {
    brand: 'Miele (Германия)',
    period: '2 года официальной гарантии',
    desc: 'Немецкая легендарная надежность, ресурс приборов рассчитан на 20 лет службы. Гарантийное обслуживание строго авторизованными инженерами.',
    hotline: '8 (800) 200-29-00',
  },
  {
    brand: 'Liebherr (Германия)',
    period: '2 года + до 5 лет на компрессор',
    desc: 'Холодильники, морозильники и винные шкафы. Оригинальные европейские компрессоры Secop/Embraco и сертифицированная заправка хладагентом.',
    hotline: '8 (800) 100-34-55',
  },
  {
    brand: 'SMEG (Италия)',
    period: '2 года официальной гарантии',
    desc: 'Дизайнерская техника серий Dolce Stil Novo, Linea, Victoria и Coloniale. Полный спектр оригинальных итальянских запчастей на центральном складе.',
    hotline: '8 (800) 707-02-90',
  },
  {
    brand: 'Körting (Германия)',
    period: '2 года гарантии',
    desc: 'Встраиваемые духовые шкафы, варочные поверхности, вытяжки и СВЧ. Сеть авторизованных сервисных центров во всех районах Нижнего Новгорода.',
    hotline: '8 (800) 500-68-92',
  },
  {
    brand: 'Omoikiri (Япония)',
    period: 'От 2 до 15 лет (в зависимости от серии)',
    desc: 'На гранитные мойки из материала Tetogranit и Artgranit — до 15 лет гарантии! На смесители и PVD-покрытия — 5 лет. Оригинальные картриджи Sedal.',
    hotline: '8 (800) 700-60-39',
  },
  {
    brand: 'VARD (Россия/Европа)',
    period: '3 года полной гарантии',
    desc: 'Инновационная бытовая техника с повышенным сроком гарантийного сопровождения и превентивной заменой узлов.',
    hotline: '8 (800) 550-25-10',
  },
  {
    brand: 'Midea (Международный бренд)',
    period: '2 года гарантии',
    desc: 'Один из крупнейших мировых производителей с надежной элементной базой, доступностью запчастей и оперативным сервисным реагированием.',
    hotline: '8 (800) 777-00-88',
  },
];

const SERVICE_CENTERS = [
  {
    name: 'Единая сервисно-монтажная служба «СИМОНА»',
    address: 'г. Нижний Новгород, ул. Белинского, 15 (выезд во все районы города и области)',
    phone: '+7 (831) 423-93-90',
    schedule: 'Пн–Сб: с 09:00 до 19:00',
    brands: 'Первичная диагностика, выездной осмотр, монтаж и сохранение гарантии на установку',
    isPrimary: true,
  },
  {
    name: 'АСЦ «Электроника» (Авторизованный центр)',
    address: 'г. Нижний Новгород, ул. Окская Гавань, 3',
    phone: '+7 (831) 277-90-90',
    schedule: 'Пн–Пт: 09:00 – 18:00, Сб: 10:00 – 15:00',
    brands: 'ASKO, Liebherr, Smeg, Körting, Midea',
  },
  {
    name: 'АСЦ «Техносервис-НН»',
    address: 'г. Нижний Новгород, Сормовское шоссе, 13',
    phone: '+7 (831) 241-11-22',
    schedule: 'Пн–Пт: 09:00 – 18:00',
    brands: 'Miele, Körting, Falmec, Elica',
  },
  {
    name: 'Фирменный сервис OMOIKIRI Service Center',
    address: 'г. Нижний Новгород, ул. Белинского, 11/66 (прием обращений)',
    phone: '+7 (920) 005-76-82',
    schedule: 'Ежедневно: с 10:00 до 20:00',
    brands: 'Omoikiri: мойки, смесители, дозаторы, измельчители',
  },
];

export default function WarrantyPage() {
  const analyticsData = useAnalyticsData();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [brand, setBrand] = useState('ASKO');
  const [model, setModel] = useState('');
  const [serial, setSerial] = useState('');
  const [issue, setIssue] = useState('');
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
          type: 'WARRANTY_CLAIM',
          name,
          phone,
          comment: `Гарантия/Сервис: Бренд: ${brand} | Модель: ${model} | Сер. номер: ${serial} | Неисправность: ${issue}`,
          ...analyticsData,
        }),
      });
      if (!res.ok) throw new Error('Ошибка отправки заявки');
      setSuccess(true);
      trackGoal('WARRANTY_CLAIM_SUBMIT', { brand, model });
    } catch (err) {
      console.error(err);
      alert('Ошибка при отправке. Пожалуйста, позвоните нам: +7 (831) 423-93-90');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#111315] text-[#D7D9DB] pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Hero Section */}
        <div className="bg-[#16191D] border border-[#2B313A] rounded-3xl p-6 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-simona-teal/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl text-left space-y-4">
            <SectionBadge variant="teal">
              Заводская защита
            </SectionBadge>
            <h1 className="text-3xl sm:text-5xl font-montserrat font-bold text-white tracking-tight leading-tight">
              Официальная гарантия и сервисная поддержка
            </h1>
            <p className="text-sm sm:text-base text-[#87888A] leading-relaxed">
              Вся бытовая техника в салонах «СИМОНА» поставляется по официальным дилерским контрактам с полной заводской гарантией от 1 года до 15 лет. Мы не бросаем клиентов после покупки и берем на себя взаимодействие с авторизованными сервисными центрами.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="#claim-form"
                className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-semibold tracking-wide transition shadow-lg shadow-simona-teal/20"
              >
                <span>Оформить гарантийную заявку</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#asc-directory"
                className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-[#1E2228] hover:bg-[#252B33] border border-[#2B313A] text-white text-xs font-semibold tracking-wide transition"
              >
                <Wrench className="w-4 h-4 text-simona-teal" />
                <span>Сервисные центры в НН</span>
              </a>
            </div>
          </div>
        </div>

        {/* 4 Pillars of Warranty Protection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#16191D] border border-[#2B313A] rounded-3xl p-6 space-y-3 hover:border-simona-teal/40 transition">
            <div className="w-10 h-10 rounded-xl bg-simona-teal/10 border border-simona-teal/30 text-simona-teal flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-montserrat font-bold text-white">Оригинальные талоны</h3>
            <p className="text-xs text-[#87888A] leading-relaxed">
              Каждый прибор комплектуется официальным гарантийным талоном производителя с отметкой о продаже и кассовым чеком 1С.
            </p>
          </div>

          <div className="bg-[#16191D] border border-[#2B313A] rounded-3xl p-6 space-y-3 hover:border-simona-teal/40 transition">
            <div className="w-10 h-10 rounded-xl bg-simona-teal/10 border border-simona-teal/30 text-simona-teal flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-montserrat font-bold text-white">Защита при установке</h3>
            <p className="text-xs text-[#87888A] leading-relaxed">
              При монтаже сертифицированными мастерами «СИМОНЫ» вы получаете +2 года дополнительной гарантии на все выполненные работы.
            </p>
          </div>

          <div className="bg-[#16191D] border border-[#2B313A] rounded-3xl p-6 space-y-3 hover:border-simona-teal/40 transition">
            <div className="w-10 h-10 rounded-xl bg-simona-teal/10 border border-simona-teal/30 text-simona-teal flex items-center justify-center">
              <PhoneCall className="w-5 h-5" />
            </div>
            <h3 className="text-base font-montserrat font-bold text-white">Маршрутизация в АСЦ</h3>
            <p className="text-xs text-[#87888A] leading-relaxed">
              Вам не нужно искать сервисы самостоятельно: наш сервисный менеджер направит заявку официальному дистрибьютору и ускорит визит мастера.
            </p>
          </div>

          <div className="bg-[#16191D] border border-[#2B313A] rounded-3xl p-6 space-y-3 hover:border-simona-teal/40 transition">
            <div className="w-10 h-10 rounded-xl bg-simona-teal/10 border border-simona-teal/30 text-simona-teal flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-montserrat font-bold text-white">Соблюдение сроков</h3>
            <p className="text-xs text-[#87888A] leading-relaxed">
              Строго соблюдаем закон РФ «О защите прав потребителей»: срок гарантийного ремонта не превышает 45 календарных дней.
            </p>
          </div>
        </div>

        {/* Brand Warranties Grid */}
        <div className="space-y-8">
          <div className="text-left space-y-1">
            <span className="text-xs uppercase tracking-widest text-simona-teal font-semibold">Сроки и программы производителей</span>
            <h2 className="text-2xl sm:text-3xl font-montserrat font-bold text-white tracking-tight">
              Гарантийные обязательства брендов
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {BRAND_WARRANTIES.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#16191D] border border-[#2B313A] rounded-3xl p-6 flex flex-col justify-between hover:border-simona-teal/50 transition-all shadow-xl"
              >
                <div className="space-y-3">
                  <div className="text-sm font-bold text-white">{item.brand}</div>
                  <div className="inline-block px-2.5 py-1 rounded-md bg-simona-teal/10 text-simona-teal border border-simona-teal/20 text-xs font-semibold">
                    {item.period}
                  </div>
                  <p className="text-xs text-[#87888A] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-[#2B313A]/60 flex items-center justify-between text-xs">
                  <span className="text-[#87888A]">Горячая линия:</span>
                  <a
                    href={`tel:${item.hotline.replace(/[^+\d]/g, '')}`}
                    className="text-white hover:text-simona-teal font-medium transition-colors"
                  >
                    {item.hotline}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Authorized Service Centers Directory */}
        <div id="asc-directory" className="space-y-6">
          <div className="text-left space-y-1">
            <span className="text-xs uppercase tracking-widest text-simona-teal font-semibold">Авторизованный сервис в НН</span>
            <h2 className="text-2xl sm:text-3xl font-montserrat font-bold text-white tracking-tight">
              Куда обращаться при гарантийном случае
            </h2>
            <p className="text-xs text-[#87888A]">
              Вы можете подать заявку напрямую в сервисный центр либо через дежурного специалиста «СИМОНЫ».
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SERVICE_CENTERS.map((sc, idx) => (
              <div
                key={idx}
                className={`rounded-3xl p-6 sm:p-7 border transition-all ${
                  sc.isPrimary
                    ? 'bg-[#1E2228] border-simona-teal/60 shadow-xl shadow-simona-teal/5'
                    : 'bg-[#16191D] border-[#2B313A] hover:border-simona-teal/40'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-bold text-white">{sc.name}</h3>
                  {sc.isPrimary && (
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-simona-teal text-white font-semibold">
                      Собственная служба
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-xs text-[#87888A] mb-4">
                  <p className="text-zinc-300">{sc.address}</p>
                  <p>Режим работы: {sc.schedule}</p>
                  <p className="text-[11px] text-zinc-400">Обслуживаемые бренды: {sc.brands}</p>
                </div>

                <div className="pt-3 border-t border-[#2B313A]/60 flex items-center justify-between text-xs">
                  <a
                    href={`tel:${sc.phone.replace(/[^+\d]/g, '')}`}
                    className="text-white hover:text-simona-teal font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-simona-teal" />
                    <span>{sc.phone}</span>
                  </a>
                  <a
                    href="#claim-form"
                    className="text-simona-teal hover:underline font-medium text-xs"
                  >
                    Подать заявку онлайн →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Diagnostic Form & Important Rules Split */}
        <div id="claim-form" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Rules & Precautions (5 Cols) */}
          <div className="lg:col-span-5 bg-[#16191D] border border-[#2B313A] rounded-3xl p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-simona-teal font-semibold">Важные требования</span>
              <h3 className="text-xl font-montserrat font-bold text-white mb-2">
                Условия сохранения гарантии
              </h3>
              <p className="text-xs text-[#87888A] leading-relaxed">
                Пожалуйста, обратите внимание на технические требования фабрик-изготовителей, чтобы избежать отказа в гарантийном обслуживании:
              </p>
            </div>

            <div className="space-y-3.5 text-xs text-zinc-300">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Не удаляйте заводской шильдик:</strong> наклейка с моделью и серийным номером прибора необходима для идентификации и заказа запчастей.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Правильное электроподключение:</strong> приборы должны подключаться к заземленным евророзеткам с выделенной линией и УЗО соответствующего номинала.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Запрет неавторизованного вскрытия:</strong> самостоятельный ремонт или вмешательство случайных мастеров влечет аннулирование гарантии.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Бытовое назначение:</strong> гарантия распространяется на технику, используемую для личных нужд (не в общепите или на производствах).
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#1E2228] border border-[#2B313A] space-y-2 text-xs">
              <div className="text-white font-semibold">Нужен монтаж с сохранением гарантии?</div>
              <p className="text-[#87888A] leading-relaxed">
                Доверьте установку нашим сертифицированным мастерам.
              </p>
              <Link
                href="/services"
                className="text-simona-teal hover:underline inline-flex items-center gap-1 font-medium"
              >
                <span>Подробнее об услугах монтажа</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Claim Submission Form (7 Cols) */}
          <div className="lg:col-span-7 bg-[#16191D] border border-[#2B313A] rounded-3xl p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-simona-teal font-semibold">Электронная регистрация</span>
              <h3 className="text-xl font-montserrat font-bold text-white mb-2">
                Заявка на диагностику и гарантийный ремонт
              </h3>
              <p className="text-xs text-[#87888A] leading-relaxed">
                Заполните форму, и наш сервисный координатор свяжется с вами в течение 2 часов для первичной консультации и направления сертифицированного мастера.
              </p>
            </div>

            {success ? (
              <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-white">Заявка успешно зарегистрирована</h4>
                <p className="text-xs text-zinc-300 max-w-md mx-auto">
                  Номер обращения передан в сервисную службу «СИМОНА». Мы согласуем время визита мастера или подготовим документы для АСЦ.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] text-[#87888A] mb-1">Ваше имя *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Сергей"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white text-xs placeholder-[#5A606A] focus:outline-none focus:border-simona-teal transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#87888A] mb-1">Номер телефона *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+7 (999) 000-00-00"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white text-xs placeholder-[#5A606A] focus:outline-none focus:border-simona-teal transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] text-[#87888A] mb-1">Бренд техники *</label>
                    <select
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white text-xs focus:outline-none focus:border-simona-teal transition"
                    >
                      <option value="ASKO">ASKO</option>
                      <option value="Miele">Miele</option>
                      <option value="Liebherr">Liebherr</option>
                      <option value="Smeg">Smeg</option>
                      <option value="Körting">Körting</option>
                      <option value="Omoikiri">Omoikiri</option>
                      <option value="VARD">VARD</option>
                      <option value="Midea">Midea</option>
                      <option value="Другой">Другой производитель</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#87888A] mb-1">Модель (артикул)</label>
                    <input
                      type="text"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="Например: HI 1995 G"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white text-xs placeholder-[#5A606A] focus:outline-none focus:border-simona-teal transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#87888A] mb-1">Серийный номер (S/N)</label>
                    <input
                      type="text"
                      value={serial}
                      onChange={(e) => setSerial(e.target.value)}
                      placeholder="С шильдика прибора"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white text-xs placeholder-[#5A606A] focus:outline-none focus:border-simona-teal transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-[#87888A] mb-1">Описание неисправности *</label>
                  <textarea
                    required
                    rows={3}
                    value={issue}
                    onChange={(e) => setIssue(e.target.value)}
                    placeholder="Опишите, как проявляется дефект (код ошибки на дисплее, посторонний шум, отсутствие нагрева и т.д.)..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white text-xs placeholder-[#5A606A] focus:outline-none focus:border-simona-teal transition resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-semibold tracking-wide transition shadow-lg shadow-simona-teal/20 flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <span>Регистрация заявки...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Отправить заявку на гарантийный выезд</span>
                    </>
                  )}
                </button>

                <p className="text-[10px] text-[#87888A] text-center">
                  Отправляя заявку, вы соглашаетесь с{' '}
                  <Link href="/policy?tab=privacy" className="underline hover:text-white">
                    политикой конфиденциальности
                  </Link>.
                </p>
              </form>
            )}
          </div>

        </div>

      </div>
    </main>
  );
}

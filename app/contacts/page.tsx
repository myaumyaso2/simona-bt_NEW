'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SectionBadge } from '@/components/ui/SectionBadge';
import {
  SimonaIconPin,
  SimonaIconClock,
  SimonaIconPhoneSolid,
  SimonaIconCheck,
  SimonaIconBuilding,
  SimonaIconGuarantee,
} from '@/components/brand/SimonaIcons';
import {
  Send,
  Mail,
  Phone,
  Copy,
  CheckCircle2,
  ExternalLink,
  MapPin,
  ArrowRight,
  ShieldCheck,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { useAnalyticsData } from '@/lib/analytics/utm';
import { trackGoal } from '@/lib/analytics/tracker';

const LOCATIONS = [
  {
    id: 'flagman',
    title: 'Флагманский салон «СИМОНА»',
    tag: 'Главная экспозиция & Активная кухня',
    address: 'г. Нижний Новгород, ул. Белинского, 15',
    phone: '+7 (831) 423-76-00',
    phoneRaw: '+78314237600',
    email: 'salon.belinka@simona-bt.ru',
    hours: 'Ежедневно: с 10:00 до 20:00',
    yandexMapUrl: 'https://yandex.ru/maps/org/simona/1042774312/',
    features: [
      'Полная экспозиция встраиваемой и соло техники премиальных и надежных европейских брендов',
      'Действующая «Активная кухня» для кулинарных демонстраций и тест-драйва приборов',
      'Лаундж-зона для работы дизайнеров, архитекторов и кухонных салонов с заказчиками',
      'Экспресс-самовывоз малой бытовой техники, фильтров и средств по уходу',
      'Собственная парковка для клиентов перед салоном',
    ],
    pickupNote: 'Выдача малой техники и аксессуаров. Крупная техника отгружается с центрального склада.',
  },
  {
    id: 'omoikiri',
    title: 'Фирменный салон OMOIKIRI & KÖRTING',
    tag: 'Монобрендовый шоурум сантехники и встройки',
    address: 'г. Нижний Новгород, ул. Белинского, 11/66',
    phone: '+7 (920) 005-76-82',
    phoneRaw: '+79200057682',
    email: 'omoikiri@simona-bt.ru',
    hours: 'Ежедневно: с 10:00 до 20:00',
    yandexMapUrl: 'https://yandex.ru/maps/org/simona/1042774312/',
    features: [
      'Премиальные японские гранитные и стальные мойки Omoikiri, смесители 2-в-1 и системы фильтрации',
      'Измельчители пищевых отходов (диспоузеры) в подключенном рабочем состоянии',
      'Встраиваемая кухонная техника Körting (Германия) в актуальных дизайнерских сериях',
      'Консультация экспертов по подбору сантехнических узлов под столешницы из камня и массива',
    ],
    pickupNote: 'Внимание: салон работает в формате демонстрационного центра. Пункта выдачи заказов нет.',
    isNoPickup: true,
  },
  {
    id: 'warehouse',
    title: 'Центральный склад и терминал самовывоза',
    tag: 'Логистический хаб (~8000 SKU)',
    address: 'г. Нижний Новгород, ул. Коминтерна, 27 (офис 3 / бокс выдачи)',
    phone: '+7 (831) 423-93-90',
    phoneRaw: '+78314239390',
    email: 'sklad@simona-bt.ru',
    hours: 'Самовывоз: Пн–Пт с 10:00 до 17:00, Сб с 10:00 до 14:30, Вс — выходной',
    yandexMapUrl: 'https://yandex.ru/maps/-/CDuW523W',
    features: [
      'Централизованное хранение складского фонда (~8000 артикулов в наличии)',
      'Зона отгрузки крупногабаритной техники в легковые авто, прицепы и грузовой транспорт',
      'Проверка внешнего вида, целостности стекла и комплектации перед погрузкой',
      'Пункт бесплатного ответственного хранения оплаченных заказов до 6 месяцев',
    ],
    pickupNote: 'Пропускной режим: Территория ЗАО «Нефтепродукт». На КПП сказать охране: «В Симону».',
    isWarehouse: true,
  },
];

const DEPARTMENTS = [
  {
    title: 'Розничный отдел и консультации',
    desc: 'Подбор комплектов техники для кухни, проверка наличия и резервирование',
    phone: '+7 (831) 423-76-00',
    email: 'info@simona-bt.ru',
  },
  {
    title: 'Отдел дизайнеров и архитекторов (B2B)',
    desc: 'Спецификации по чертежам, бонусные программы, библиотека 3D-моделей и образцов',
    phone: '+7 (831) 423-76-00',
    email: 'b2b@simona-bt.ru',
  },
  {
    title: 'Оптовый отдел и поставки застройщикам',
    desc: 'Комплектация жилых комплексов, апартаментов, отелей и корпоративных объектов',
    phone: '+7 (831) 283-00-94',
    email: 'opt@simona-bt.ru',
  },
  {
    title: 'Направление авторских кухонь «СИМОНА»',
    desc: 'Проектирование и изготовление премиальных кухонных гарнитуров со встроенной техникой',
    phone: '+7 (831) 212-82-42',
    email: 'kuhni@simona-bt.ru',
  },
  {
    title: 'Служба сервиса, доставки и рекламаций',
    desc: 'Согласование интервала доставки, авторизованный монтаж, гарантийное содействие',
    phone: '+7 (831) 423-93-90',
    email: 'service@simona-bt.ru',
  },
  {
    title: 'Консьерж-сервис в Telegram',
    desc: 'Быстрые ответы дежурного эксперта, фото техники из салона, отправка КП в чат',
    phone: '@SimonaExpert',
    email: 'https://t.me/SimonaExpert',
    isTelegram: true,
  },
];

export default function ContactsPage() {
  const analyticsData = useAnalyticsData();
  const [activeLocation, setActiveLocation] = useState<'all' | 'flagman' | 'omoikiri' | 'warehouse'>('all');
  const [copied, setCopied] = useState(false);
  
  // Leadership feedback form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const requisitesText = `ООО «Технотрейд-НН»
ИНН: 5260300686 / КПП: 526001001
ОГРН: 1115260005827
Юридический адрес: 603000, г. Нижний Новгород, ул. Максима Горького, д. 77, кв. 78
Банк: Волго-Вятский банк ПАО Сбербанк
Р/С: 40702810142000032399
К/С: 30101810900000000603
БИК: 042202603
Генеральный директор: Сергин Алексей Борисович
Главный бухгалтер: Киселева Ирина Викторовна`;

  const handleCopyRequisites = () => {
    navigator.clipboard.writeText(requisitesText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'QUALITY_CONTROL',
          name,
          phone,
          email,
          comment: `Обращение руководству: ${message}`,
          ...analyticsData,
        }),
      });
      if (!res.ok) throw new Error('Ошибка отправки сообщения');
      setSuccess(true);
      trackGoal('CONTACT_FEEDBACK_SUBMIT', { name, phone });
    } catch (err) {
      console.error(err);
      alert('Ошибка при отправке. Пожалуйста, позвоните нам: +7 (831) 423-76-00');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredLocations = activeLocation === 'all'
    ? LOCATIONS
    : LOCATIONS.filter((l) => l.id === activeLocation);

  return (
    <main className="min-h-screen bg-[#111315] text-[#D7D9DB] pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Hero Section */}
        <div className="bg-[#16191D] border border-[#2B313A] rounded-3xl p-6 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-simona-teal/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl text-left space-y-4">
            <SectionBadge variant="teal">
              Контакты и адреса
            </SectionBadge>
            <h1 className="text-3xl sm:text-5xl font-montserrat font-bold text-white tracking-tight leading-tight">
              Салоны и логистический центр «СИМОНА»
            </h1>
            <p className="text-sm sm:text-base text-[#87888A] leading-relaxed">
              Более 30 лет помогаем жителям Нижнего Новгорода и профессиональным дизайнерам подбирать идеальную технику. 
              Ждем вас в наших фирменных салонах на улице Белинского и в пункте выдачи центрального склада.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="#locations"
                className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-semibold tracking-wide transition shadow-lg shadow-simona-teal/20"
              >
                <span>Выбрать салон на карте</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#requisites"
                className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-[#1E2228] hover:bg-[#252B33] border border-[#2B313A] text-white text-xs font-semibold tracking-wide transition"
              >
                <FileText className="w-4 h-4 text-simona-teal" />
                <span>Реквизиты юрлица</span>
              </a>
            </div>
          </div>
        </div>

        {/* 3 Physical Nodes (Interactive Filter) */}
        <div id="locations" className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#2B313A] pb-4">
            <div className="text-left space-y-1">
              <span className="text-xs uppercase tracking-widest text-simona-teal font-semibold">Локации в Нижнем Новгороде</span>
              <h2 className="text-2xl sm:text-3xl font-montserrat font-bold text-white tracking-tight">
                Физическое присутствие
              </h2>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveLocation('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition ${
                  activeLocation === 'all'
                    ? 'bg-simona-teal text-white shadow-md shadow-simona-teal/20'
                    : 'bg-[#1E2228] border border-[#2B313A] text-[#87888A] hover:text-white'
                }`}
              >
                Все точки (3)
              </button>
              <button
                onClick={() => setActiveLocation('flagman')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition ${
                  activeLocation === 'flagman'
                    ? 'bg-simona-teal text-white shadow-md shadow-simona-teal/20'
                    : 'bg-[#1E2228] border border-[#2B313A] text-[#87888A] hover:text-white'
                }`}
              >
                Белинского, 15
              </button>
              <button
                onClick={() => setActiveLocation('omoikiri')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition ${
                  activeLocation === 'omoikiri'
                    ? 'bg-simona-teal text-white shadow-md shadow-simona-teal/20'
                    : 'bg-[#1E2228] border border-[#2B313A] text-[#87888A] hover:text-white'
                }`}
              >
                Белинского, 11/66
              </button>
              <button
                onClick={() => setActiveLocation('warehouse')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition ${
                  activeLocation === 'warehouse'
                    ? 'bg-simona-teal text-white shadow-md shadow-simona-teal/20'
                    : 'bg-[#1E2228] border border-[#2B313A] text-[#87888A] hover:text-white'
                }`}
              >
                Склад (Коминтерна, 27)
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {filteredLocations.map((loc) => (
              <div
                key={loc.id}
                className="bg-[#16191D] border border-[#2B313A] rounded-3xl p-6 sm:p-7 flex flex-col justify-between hover:border-simona-teal/50 transition-all shadow-xl group"
              >
                <div className="space-y-4">
                  {/* Badge & Type */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] px-2.5 py-1 rounded-md bg-[#1E2228] border border-[#2B313A] text-simona-teal font-medium">
                      {loc.tag}
                    </span>
                    {loc.isNoPickup ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        Только экспозиция
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {loc.isWarehouse ? 'Пункт выдачи' : 'Экспресс-выдача'}
                      </span>
                    )}
                  </div>

                  {/* Title & Address */}
                  <div>
                    <h3 className="text-lg font-montserrat font-bold text-white group-hover:text-simona-teal transition-colors mb-1">
                      {loc.title}
                    </h3>
                    <p className="text-xs text-zinc-300 flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-simona-teal shrink-0 mt-0.5" />
                      <span>{loc.address}</span>
                    </p>
                  </div>

                  {/* Contacts Line */}
                  <div className="pt-2 border-t border-[#2B313A]/60 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[#87888A]">Телефон:</span>
                      <a
                        href={`tel:${loc.phoneRaw}`}
                        className="text-white font-medium hover:text-simona-teal transition-colors"
                      >
                        {loc.phone}
                      </a>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#87888A]">Эл. почта:</span>
                      <a
                        href={`mailto:${loc.email}`}
                        className="text-zinc-300 hover:text-white transition-colors underline-offset-2 hover:underline"
                      >
                        {loc.email}
                      </a>
                    </div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[#87888A] shrink-0">Режим работы:</span>
                      <span className="text-right text-zinc-300 font-medium">{loc.hours}</span>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="pt-3 border-t border-[#2B313A]/60">
                    <div className="text-[11px] font-semibold text-[#87888A] uppercase tracking-wider mb-2">
                      Особенности точки:
                    </div>
                    <ul className="space-y-1.5 text-xs text-zinc-300">
                      {loc.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <SimonaIconCheck className="w-3.5 h-3.5 text-simona-teal shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pickup / Pass Note */}
                  <div className="p-3 rounded-xl bg-[#1E2228] border border-[#2B313A] text-xs text-zinc-300 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-simona-teal shrink-0 mt-0.5" />
                    <span>{loc.pickupNote}</span>
                  </div>
                </div>

                {/* Map Button */}
                <div className="pt-6 mt-4 border-t border-[#2B313A]">
                  <a
                    href={loc.yandexMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-[#1E2228] hover:bg-[#252B33] border border-[#2B313A] text-xs font-semibold text-white transition group/btn"
                  >
                    <span>Открыть в Яндекс.Картах</span>
                    <ExternalLink className="w-3.5 h-3.5 text-simona-teal group-hover/btn:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Specialized Departments Directory */}
        <div className="space-y-6">
          <div className="text-left space-y-1">
            <span className="text-xs uppercase tracking-widest text-simona-teal font-semibold">Прямая связь</span>
            <h2 className="text-2xl sm:text-3xl font-montserrat font-bold text-white tracking-tight">
              Специализированные отделы
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {DEPARTMENTS.map((dept, idx) => (
              <div
                key={idx}
                className="bg-[#16191D] border border-[#2B313A] rounded-2xl p-5 flex flex-col justify-between hover:border-simona-teal/40 transition"
              >
                <div>
                  <h3 className="text-sm font-semibold text-white mb-1.5">{dept.title}</h3>
                  <p className="text-xs text-[#87888A] leading-relaxed mb-4">{dept.desc}</p>
                </div>
                <div className="pt-3 border-t border-[#2B313A]/60 flex items-center justify-between text-xs">
                  {dept.isTelegram ? (
                    <a
                      href={dept.email}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 text-simona-teal hover:underline font-medium"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{dept.phone}</span>
                    </a>
                  ) : (
                    <a
                      href={`tel:${dept.phone.replace(/[^+\d]/g, '')}`}
                      className="text-white hover:text-simona-teal font-medium transition-colors"
                    >
                      {dept.phone}
                    </a>
                  )}
                  {!dept.isTelegram && (
                    <a
                      href={`mailto:${dept.email}`}
                      className="text-[#87888A] hover:text-white transition-colors"
                    >
                      {dept.email}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legal Requisites & Direct Feedback Split */}
        <div id="requisites" className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
          
          {/* Requisites Card (7 Cols) */}
          <div className="lg:col-span-7 bg-[#16191D] border border-[#2B313A] rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2B313A] pb-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-simona-teal font-semibold">Юридическая информация</span>
                <h3 className="text-xl font-montserrat font-bold text-white">Реквизиты организации</h3>
              </div>
              <button
                onClick={handleCopyRequisites}
                className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-[#1E2228] hover:bg-[#252B33] border border-[#2B313A] text-xs font-semibold text-white transition shrink-0"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Скопировано!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-simona-teal" />
                    <span>Скопировать реквизиты</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1 bg-[#1E2228]/50 p-3.5 rounded-xl border border-[#2B313A]/50">
                <span className="text-[#87888A]">Полное наименование:</span>
                <p className="text-white font-medium">Общество с ограниченной ответственностью «Технотрейд-НН»</p>
              </div>

              <div className="space-y-1 bg-[#1E2228]/50 p-3.5 rounded-xl border border-[#2B313A]/50">
                <span className="text-[#87888A]">ИНН / КПП:</span>
                <p className="text-white font-mono font-medium">5260300686 / 526001001</p>
              </div>

              <div className="space-y-1 bg-[#1E2228]/50 p-3.5 rounded-xl border border-[#2B313A]/50">
                <span className="text-[#87888A]">ОГРН:</span>
                <p className="text-white font-mono font-medium">1115260005827</p>
              </div>

              <div className="space-y-1 bg-[#1E2228]/50 p-3.5 rounded-xl border border-[#2B313A]/50">
                <span className="text-[#87888A]">БИК банка:</span>
                <p className="text-white font-mono font-medium">042202603 (ПАО Сбербанк)</p>
              </div>

              <div className="sm:col-span-2 space-y-1 bg-[#1E2228]/50 p-3.5 rounded-xl border border-[#2B313A]/50">
                <span className="text-[#87888A]">Юридический адрес:</span>
                <p className="text-white font-medium">603000, г. Нижний Новгород, ул. Максима Горького, д. 77, кв. 78</p>
              </div>

              <div className="space-y-1 bg-[#1E2228]/50 p-3.5 rounded-xl border border-[#2B313A]/50">
                <span className="text-[#87888A]">Расчетный счет:</span>
                <p className="text-white font-mono font-medium">40702810142000032399</p>
              </div>

              <div className="space-y-1 bg-[#1E2228]/50 p-3.5 rounded-xl border border-[#2B313A]/50">
                <span className="text-[#87888A]">Корреспондентский счет:</span>
                <p className="text-white font-mono font-medium">30101810900000000603</p>
              </div>

              <div className="space-y-1 bg-[#1E2228]/50 p-3.5 rounded-xl border border-[#2B313A]/50">
                <span className="text-[#87888A]">Генеральный директор:</span>
                <p className="text-white font-medium">Сергин Алексей Борисович</p>
              </div>

              <div className="space-y-1 bg-[#1E2228]/50 p-3.5 rounded-xl border border-[#2B313A]/50">
                <span className="text-[#87888A]">Главный бухгалтер:</span>
                <p className="text-white font-medium">Киселева Ирина Викторовна</p>
              </div>
            </div>

            <p className="text-[11px] text-[#87888A] leading-relaxed">
              Работаем с физическими лицами и организациями всех форм собственности. Возможен безналичный расчет с выставлением счета, работа по договорам поставки и электронный документооборот (ЭДО Диадок / СБИС).
            </p>
          </div>

          {/* Direct Message to Leadership (5 Cols) */}
          <div className="lg:col-span-5 bg-[#16191D] border border-[#2B313A] rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-simona-teal font-semibold">Контроль качества</span>
                <h3 className="text-xl font-montserrat font-bold text-white mb-1">
                  Написать руководству
                </h3>
                <p className="text-xs text-[#87888A] leading-relaxed">
                  Почта руководителя проверяется ежедневно. Если у вас возник сложный вопрос по заказу, предложение или замечание по работе сотрудников — ваше сообщение будет рассмотрено лично.
                </p>
              </div>

              {success ? (
                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h4 className="text-sm font-semibold text-white">Сообщение передано руководству</h4>
                  <p className="text-xs text-zinc-300">
                    Спасибо за обратную связь. Мы свяжемся с вами в течение 1 рабочего дня.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[11px] text-[#87888A] mb-1">Ваше имя *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Константин"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white text-xs placeholder-[#5A606A] focus:outline-none focus:border-simona-teal transition"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-[#87888A] mb-1">Телефон *</label>
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
                      <label className="block text-[11px] text-[#87888A] mb-1">Эл. почта</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="client@mail.ru"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white text-xs placeholder-[#5A606A] focus:outline-none focus:border-simona-teal transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#87888A] mb-1">Суть обращения *</label>
                    <textarea
                      required
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Опишите вопрос, номер заказа или ситуацию..."
                      className="w-full px-3.5 py-2 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white text-xs placeholder-[#5A606A] focus:outline-none focus:border-simona-teal transition resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-semibold tracking-wide transition shadow-lg shadow-simona-teal/20 flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {submitting ? (
                      <span>Отправка...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Отправить обращение директору</span>
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-[#87888A] text-center">
                    Нажимая кнопку, вы соглашаетесь с{' '}
                    <Link href="/policy?tab=privacy" className="underline hover:text-white">
                      политикой обработки данных
                    </Link>.
                  </p>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}

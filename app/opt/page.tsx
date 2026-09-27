'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SectionBadge } from '@/components/ui/SectionBadge';
import {
  SimonaIconPercent,
  SimonaIconGuarantee,
  SimonaIconBuilding,
  SimonaIconChef,
  SimonaIconFile,
  SimonaIconCheckCircle,
  SimonaIconPhoneSolid,
  SimonaIconStar,
  SimonaIconClock,
} from '@/components/brand/SimonaIcons';
import {
  Briefcase,
  ShieldCheck,
  Send,
  Layers,
  ArrowRight,
  Truck,
  Sparkles,
  Users,
  Award,
  BookOpen,
  DollarSign,
  ExternalLink,
} from 'lucide-react';
import { useAnalyticsData } from '@/lib/analytics/utm';
import { trackGoal } from '@/lib/analytics/tracker';

const OPT_PILLARS = [
  {
    num: '01',
    title: 'Выгодные оптовые цены',
    desc: 'Прямые контракты с европейскими заводами позволяют нам предлагать конкурентные оптовые прайсы и маржинальность для салонов, кухонных студий и комплектаторов.',
    highlight: 'Высокая дилерская доходность с каждой единицы',
    icon: DollarSign,
  },
  {
    num: '02',
    title: 'Прозрачная система скидок',
    desc: 'Гибкая шкала бонусов и накопительных условий в зависимости от объема выборки, с обязательной защитой проектов партнера перед конечным заказчиком.',
    highlight: 'Фиксация объекта и защита проектной сделки',
    icon: SimonaIconPercent,
  },
  {
    num: '03',
    title: 'Прямые контракты с производителями',
    desc: 'Официальный дистрибьютор ведущих брендов: Smeg, Asko, Vard, Falmec, Faber, Elica, Teka, Franke, Jetair, Bertazzoni. Гарантия качества на уровне заводов-изготовителей.',
    highlight: 'Прямые поставки без посредников и переплат',
    icon: SimonaIconGuarantee,
  },
  {
    num: '04',
    title: 'Индивидуальные консультации экспертов',
    desc: 'С вами работает персональный B2B-менеджер, который поможет на всех этапах — от подбора спецификации под ТЗ до отгрузки и шеф-монтажа.',
    highlight: 'Персональный менеджер-эксперт для вашей компании',
    icon: Users,
  },
  {
    num: '05',
    title: 'Широкий складской ассортимент',
    desc: 'Собственный распределительный логистический комплекс на ул. Коминтерна, 27 с постоянным наличием ключевых позиций встраиваемой и крупной бытовой техники.',
    highlight: 'Тысячи ходовых SKU всегда в наличии в Нижнем Новгороде',
    icon: SimonaIconBuilding,
  },
  {
    num: '06',
    title: 'Собственная сервисная служба',
    desc: 'Авторизованный сервисный центр Simona обеспечивает гарантийное и постгарантийное обслуживание, быстрый выезд инженеров и наличие оригинальных запчастей.',
    highlight: 'Полная сервисная и гарантийная безопасность',
    icon: ShieldCheck,
  },
  {
    num: '07',
    title: 'Эксклюзивные коллекции и новинки',
    desc: 'Доступ к лимитированным сериям, премьерным линейкам и эксклюзивным артикулам премиальных приборов, которые выделят ваше предложение среди конкурентов.',
    highlight: 'Уникальные приборы под авторские дизайн-проекты',
    icon: Sparkles,
  },
  {
    num: '08',
    title: 'Удобный логистический сервис',
    desc: 'Бережная и оперативная доставка оборудования собственным специализированным автопарком по городу, области и транспортными компаниями по всей России.',
    highlight: 'Точная доставка до склада или объекта заказчика',
    icon: Truck,
  },
  {
    num: '09',
    title: 'Маркетинговая и техническая поддержка',
    desc: 'Предоставляем каталоги, образцы материалов, технические схемы встройки, 3D-модели для визуализации и полиграфические POS-материалы для вашего салона.',
    highlight: 'Полный пакет документов и промо-материалов',
    icon: SimonaIconFile,
  },
  {
    num: '10',
    title: 'Участие в партнерских мероприятиях',
    desc: 'Приглашаем партнеров на закрытые презентации, конференции производителей, зарубежные обучающие поездки на европейские заводы и гастрономические вечера.',
    highlight: 'Прямой контакт с топ-менеджментом брендов',
    icon: Award,
  },
  {
    num: '11',
    title: 'Компенсация выставочных образцов',
    desc: 'Специальные льготные условия и частичная или полная компенсация затрат на экспозиционную технику для кухонных салонов и демонстрационных шоурумов.',
    highlight: 'Выгодное оснащение вашей выставочной экспозиции',
    icon: Layers,
  },
  {
    num: '12',
    title: 'Обучение персонала в любом регионе',
    desc: 'Проводим очные и онлайн-тренинги по продуктовым линейкам для ваших дизайнеров и продавцов: делимся глубокими техническими нюансами и техниками продаж.',
    highlight: 'Регулярные мастер-классы и повышение квалификации',
    icon: BookOpen,
  },
];

const PROFILES = [
  'Кухонный салон / Студия',
  'Мебельное производство',
  'Застройщик / Девелопер',
  'Архитектурное бюро',
  'Комплектатор объектов',
  'Торговая организация / Дилер',
];

const KEY_OPT_BRANDS = [
  'Smeg',
  'Asko',
  'Vard',
  'Falmec',
  'Franke',
  'Bertazzoni',
  'Faber',
  'Elica',
  'Jetair',
  'Teka',
  'Liebherr',
  'Bosch',
];

export default function OptPage() {
  const analyticsData = useAnalyticsData();
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [profile, setProfile] = useState(PROFILES[0]);
  const [city, setCity] = useState('Нижний Новгород');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [agreement, setAgreement] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((item) => item !== brand) : [...prev, brand]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreement) {
      alert('Пожалуйста, подтвердите согласие на обработку персональных данных.');
      return;
    }

    setSubmitting(true);

    try {
      const detailedNotes = [
        company ? `Компания: ${company}` : null,
        profile ? `Профиль деятельности: ${profile}` : null,
        city ? `Регион: ${city}` : null,
        selectedBrands.length > 0 ? `Интересующие бренды: ${selectedBrands.join(', ')}` : null,
        comment ? `Комментарий: ${comment}` : null,
      ]
        .filter(Boolean)
        .join(' | ');

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'B2B_OPT',
          name,
          phone,
          email: email || undefined,
          comment: detailedNotes,
          ...analyticsData,
        }),
      });

      if (!res.ok) throw new Error('Ошибка отправки заявки');

      setSuccess(true);
      trackGoal('OPT_COOPERATION_SUBMIT', { name, company, phone, profile });
    } catch (err) {
      console.error(err);
      alert('Произошла ошибка при отправке заявки. Пожалуйста, позвоните нам: +7 (831) 423-76-00');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#111315] text-[#D7D9DB] pt-28 pb-24 px-4 sm:px-6 lg:px-8 selection:bg-simona-teal/20 selection:text-white">
      <div className="max-w-7xl mx-auto space-y-20">

        {/* HERO SECTION */}
        <section className="relative rounded-3xl bg-[#16191D] border border-[#2B313A] p-7 sm:p-12 lg:p-16 overflow-hidden shadow-2xl">
          {/* Subtle Ambient Radial Lighting Cones */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-simona-teal/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-[360px] h-[360px] bg-simona-wine/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 max-w-4xl text-left space-y-6">
            <SectionBadge variant="teal" text="Оптовый отдел и дистрибьюция" />

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-montserrat font-semibold tracking-tight text-white leading-[1.12]">
              Бытовая техника оптом от компании Simona
            </h1>

            <p className="text-base sm:text-lg text-[#87888A] leading-relaxed max-w-3xl">
              Компания Simona — надежный дистрибьютор и партнер на рынке бытовой техники с 1995 года. Мы работаем по прямым контрактам с ведущими европейскими фабриками: Smeg, Asko, Vard, Falmec, Franke, Bertazzoni, Elica, Jetair, Teka. Обеспечиваем конкурентные оптовые цены, проектную защиту, наличие на складе и авторизованный сервис.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#cooperation-form"
                className="px-7 py-3.5 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-semibold tracking-wide transition shadow-lg shadow-simona-teal/25 flex items-center gap-2 group cursor-pointer"
              >
                <span>Заполнить форму сотрудничества</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>

              <a
                href="tel:+78314237600"
                className="px-6 py-3.5 rounded-xl bg-[#1E2228] hover:bg-[#252A32] text-white border border-[#2B313A] hover:border-simona-teal/50 text-xs font-medium tracking-wide transition flex items-center gap-2"
              >
                <SimonaIconPhoneSolid className="w-3.5 h-3.5 text-simona-teal" />
                <span>+7 (831) 423-76-00</span>
              </a>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6 mt-14 pt-8 border-t border-[#2B313A]">
            <div>
              <div className="text-2xl sm:text-4xl font-montserrat font-semibold text-white">25+ лет</div>
              <div className="text-xs text-[#87888A] mt-1.5 leading-snug">Безупречной репутации на B2B-рынке техники</div>
            </div>
            <div>
              <div className="text-2xl sm:text-4xl font-montserrat font-semibold text-white">100%</div>
              <div className="text-xs text-[#87888A] mt-1.5 leading-snug">Прямые дистрибьюторские контракты с фабриками</div>
            </div>
            <div>
              <div className="text-2xl sm:text-4xl font-montserrat font-semibold text-white">6 месяцев</div>
              <div className="text-xs text-[#87888A] mt-1.5 leading-snug">Бесплатного хранения оптовых партий на складе</div>
            </div>
            <div>
              <div className="text-2xl sm:text-4xl font-montserrat font-semibold text-white">0 ₽</div>
              <div className="text-xs text-[#87888A] mt-1.5 leading-snug">Компенсация образцов для экспозиций партнеров</div>
            </div>
          </div>
        </section>

        {/* BRAND PORTFOLIO STRIP */}
        <section className="space-y-4">
          <div className="text-left space-y-1">
            <span className="text-xs font-semibold text-simona-teal">Прямые контракты</span>
            <h3 className="text-base sm:text-lg font-montserrat font-semibold text-white">
              Европейские бренды в оптовом портфеле
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {KEY_OPT_BRANDS.map((brand) => (
              <div
                key={brand}
                className="py-3 px-4 rounded-xl bg-[#16191D] border border-[#2B313A] text-center text-xs font-medium text-white hover:border-simona-teal/50 hover:text-simona-teal-light transition-colors"
              >
                {brand}
              </div>
            ))}
          </div>
        </section>

        {/* 12 ADVANTAGES */}
        <section className="space-y-8">
          <div className="text-left space-y-2.5">
            <SectionBadge variant="teal" text="Преимущества для партнеров" />
            <h2 className="text-2xl sm:text-4xl font-montserrat font-semibold tracking-tight text-white">
              Почему оптовые партнеры выбирают компанию Simona
            </h2>
            <p className="text-sm text-[#87888A] max-w-2xl">
              Мы выстраиваем долгосрочные и открытые партнерские отношения, предоставляя не только продукцию с завода, но и комплексный сервис высочайшего уровня.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {OPT_PILLARS.map((item) => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.num}
                  className="rounded-2xl bg-[#16191D] border border-[#2B313A] p-6 flex flex-col justify-between hover:border-simona-teal/50 hover:shadow-[0_12px_30px_rgba(0,151,156,0.08)] transition-all duration-300 group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold text-simona-teal tracking-wider">
                        {item.num}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-[#1E2228] border border-[#2B313A] flex items-center justify-center text-simona-teal group-hover:border-simona-teal/60 transition-colors">
                        <IconComp className="w-5 h-5" />
                      </div>
                    </div>
                    <h3 className="text-base font-semibold text-white group-hover:text-simona-teal-light transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-[#87888A] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-[#2B313A]/70 text-[11px] font-medium text-simona-teal flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-simona-teal" />
                    <span>{item.highlight}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* COOPERATION FORM */}
        <section
          id="cooperation-form"
          className="relative rounded-3xl bg-[#16191D] border border-[#2B313A] p-6 sm:p-12 lg:p-14 overflow-hidden shadow-2xl"
        >
          {/* Subtle Ambient Light */}
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-simona-teal/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-left space-y-2.5">
              <SectionBadge variant="teal" text="Оптовое сотрудничество" />
              <h2 className="text-2xl sm:text-4xl font-montserrat font-semibold tracking-tight text-white">
                Заполнить форму сотрудничества
              </h2>
              <p className="text-xs sm:text-sm text-[#87888A] leading-relaxed">
                Оставьте заявку, и руководитель оптового отдела свяжется с вами в течение 30 минут для передачи оптового прайс-листа и обсуждения партнерских условий.
              </p>
            </div>

            {success ? (
              <div className="rounded-2xl bg-[#1E2228] border border-simona-teal/40 p-8 sm:p-10 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-simona-teal/15 text-simona-teal flex items-center justify-center mx-auto border border-simona-teal/30">
                  <SimonaIconCheckCircle className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-montserrat font-semibold text-white">
                  Заявка на оптовое сотрудничество принята!
                </h3>
                <p className="text-xs sm:text-sm text-[#87888A] max-w-md mx-auto leading-relaxed">
                  Наш оптовый отдел свяжется с вами по указанным контактам, предоставит актуальные дилерские прайс-листы и ответит на все вопросы.
                </p>
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="mt-2 px-6 py-2.5 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-semibold tracking-wide transition cursor-pointer"
                >
                  Отправить еще один запрос
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 text-xs">
                
                {/* 1. Контактное лицо и Компания */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#D7D9DB] font-medium mb-1.5">
                      Контактное лицо (ФИО) *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Алексей Смирнов"
                      className="w-full px-4 py-3 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white focus:outline-none focus:border-simona-teal transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[#D7D9DB] font-medium mb-1.5">
                      Название компании / Салона *
                    </label>
                    <input
                      type="text"
                      required
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Кухни & Интерьер НН"
                      className="w-full px-4 py-3 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white focus:outline-none focus:border-simona-teal transition-colors"
                    />
                  </div>
                </div>

                {/* 2. Телефон и Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#D7D9DB] font-medium mb-1.5">
                      Телефон для связи *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+7 (920) 000-00-00"
                      className="w-full px-4 py-3 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white focus:outline-none focus:border-simona-teal transition-colors font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[#D7D9DB] font-medium mb-1.5">
                      Электронная почта *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="opt@kitchen-nn.ru"
                      className="w-full px-4 py-3 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white focus:outline-none focus:border-simona-teal transition-colors"
                    />
                  </div>
                </div>

                {/* 3. Профиль деятельности */}
                <div>
                  <label className="block text-[#D7D9DB] font-medium mb-2">
                    Профиль вашей организации:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {PROFILES.map((p) => (
                      <button
                        type="button"
                        key={p}
                        onClick={() => setProfile(p)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-medium transition cursor-pointer border ${
                          profile === p
                            ? 'bg-simona-teal text-white border-simona-teal shadow-[0_0_12px_rgba(0,151,156,0.3)]'
                            : 'bg-[#1E2228] text-[#87888A] border-[#2B313A] hover:text-white hover:border-[#3E3D40]'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Город / Регион */}
                <div>
                  <label className="block text-[#D7D9DB] font-medium mb-1.5">
                    Регион / Город поставки *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Нижний Новгород / Нижегородская область"
                    className="w-full px-4 py-3 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white focus:outline-none focus:border-simona-teal transition-colors"
                  />
                </div>

                {/* 5. Интересующие бренды */}
                <div>
                  <label className="block text-[#D7D9DB] font-medium mb-2">
                    Интересующие бренды для поставок:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {KEY_OPT_BRANDS.map((brand) => (
                      <button
                        type="button"
                        key={brand}
                        onClick={() => toggleBrand(brand)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition cursor-pointer ${
                          selectedBrands.includes(brand)
                            ? 'bg-simona-teal text-white border-simona-teal shadow-[0_0_10px_rgba(0,151,156,0.3)]'
                            : 'bg-[#1E2228] text-[#87888A] border-[#2B313A] hover:text-white'
                        }`}
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 6. Комментарий / Объемы */}
                <div>
                  <label className="block text-[#D7D9DB] font-medium mb-1.5">
                    Планируемые объемы или комментарий к запросу
                  </label>
                  <textarea
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Укажите количество салонов, примерный ежемесячный объем, потребность в выставочных образцах или конкретные артикулы..."
                    className="w-full px-4 py-3 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white focus:outline-none focus:border-simona-teal transition-colors resize-none"
                  />
                </div>

                {/* 7. Согласие */}
                <div className="flex items-start gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    id="opt-agreement-checkbox"
                    checked={agreement}
                    onChange={(e) => setAgreement(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-simona-teal bg-[#1E2228] border-[#2B313A] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <label htmlFor="opt-agreement-checkbox" className="text-[11px] text-[#87888A] leading-relaxed cursor-pointer select-none">
                    Я даю согласие на хранение и обработку персональных данных в соответствии с требованиями Федерального закона 152-ФЗ.
                  </label>
                </div>

                {/* 8. Кнопка отправки */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-semibold tracking-wide transition shadow-lg shadow-simona-teal/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <span>{submitting ? 'Отправка...' : 'Отправить заявку на оптовое сотрудничество'}</span>
                    <Send className="w-4 h-4" />
                  </button>

                  <div className="text-[11px] text-[#87888A] text-center sm:text-right">
                    Прямые поставки от официального дистрибьютора • Защита проектов
                  </div>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* DIRECT WHOLESALE CONTACT BAR */}
        <section className="rounded-2xl bg-[#16191D] border border-[#2B313A] p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-simona-teal/10 border border-simona-teal/20 text-simona-teal flex items-center justify-center shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div className="text-left space-y-0.5">
              <div className="font-semibold text-white text-sm">
                Оптовый отдел компании Simona
              </div>
              <div className="text-xs text-[#87888A]">
                Центральный склад: г. Нижний Новгород, ул. Коминтерна, 27 • Салон: ул. Белинского, 15
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 shrink-0">
            <a
              href="tel:+78314237600"
              className="px-4 py-2.5 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white hover:text-simona-teal font-medium text-xs transition"
            >
              +7 (831) 423-76-00
            </a>

            <a
              href="mailto:b2b@simona-bt.ru"
              className="px-4 py-2.5 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white hover:text-simona-teal font-medium text-xs transition"
            >
              b2b@simona-bt.ru
            </a>

            <a
              href="https://t.me/SimonaExpert"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-[#2AABEE]/20 hover:bg-[#2AABEE]/30 text-[#2AABEE] border border-[#2AABEE]/40 text-xs font-medium transition flex items-center gap-2"
            >
              <span>Telegram: @SimonaExpert</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </section>

      </div>
    </main>
  );
}

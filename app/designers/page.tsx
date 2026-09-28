'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SectionBadge } from '@/components/ui/SectionBadge';
import {
  SimonaIconPercent,
  SimonaIconGuarantee,
  SimonaIconClock,
  SimonaIconBuilding,
  SimonaIconChef,
  SimonaIconFile,
  SimonaIconCheckCircle,
  SimonaIconPhoneSolid,
  SimonaIconPin,
  SimonaIconStar,
} from '@/components/brand/SimonaIcons';
import {
  Coffee,
  Wrench,
  Send,
  Layers,
  ArrowRight,
  Download,
  Share2,
  Truck,
  Sparkles,
  Users,
  ExternalLink,
} from 'lucide-react';
import { useAnalyticsData } from '@/lib/analytics/utm';
import { trackGoal } from '@/lib/analytics/tracker';
import { useSiteContent } from '@/components/providers/ContentContext';

const DESIGNER_PILLARS = [
  {
    num: '01',
    title: 'Достойное дизайнерское вознаграждение',
    desc: 'Гарантируем своевременную выплату агентского вознаграждения точно в срок и в полном объеме. Все финансовые обязательства официально фиксируются договором.',
    highlight: 'Выплаты по безналичному расчету без задержек',
    icon: SimonaIconPercent,
  },
  {
    num: '02',
    title: 'Специальные закрытые мероприятия',
    desc: 'Персональные приглашения на закрытые презентации премьерных линеек техники, дегустации с шеф-поварами, закрытые распродажи и закрытые мастер-классы европейских брендов.',
    highlight: 'Нетворкинг в сообществе ведущих дизайнеров',
    icon: Sparkles,
  },
  {
    num: '03',
    title: 'Лаундж для встреч с клиентами',
    desc: 'Вам не нужно арендовать коворкинг или бронировать столик в кафе: назначайте встречи в нашем флагманском салоне в центре города на ул. Белинского, 15. Чай, премиальный кофе и сладости для вас и ваших гостей.',
    highlight: 'Премиальная переговорная зона в центре города',
    icon: Coffee,
  },
  {
    num: '04',
    title: 'Большая экспозиция кухонь и техники',
    desc: 'Более 5 000 моделей бытовой техники в наличии и под заказ. Выделенные монобрендовые бренд-зоны Smeg, Asko и крупнейший выбор премиальной встройки в Нижнем Новгороде.',
    highlight: 'Экспозиция премиум-класса на Белинского',
    icon: SimonaIconBuilding,
  },
  {
    num: '05',
    title: 'Эксперты по встраиванию с 1995 года',
    desc: 'Инженерный аудит расстановки: проверяем вентиляционные зазоры, сечения кабелей, фазность, высоты цоколей и воздуховоды. Исключаем дорогостоящие ошибки до начала чистовой отделки.',
    highlight: 'Инженерный контроль монтажных чертежей',
    icon: SimonaIconFile,
  },
  {
    num: '06',
    title: 'Активная кухня и тест-драйв',
    desc: 'Проводим живой тест-драйв техники на полностью подключенной кухне в салоне. Пароварки, вакууматоры, индукционные панели, подогреватели и кофемашины — приготовление блюд вместе с шеф-поваром.',
    highlight: 'Демонстрация возможностей техники для заказчика',
    icon: SimonaIconChef,
  },
  {
    num: '07',
    title: 'Топовые европейские бренды',
    desc: 'Прямые контракты с фабриками: Miele, Asko, Smeg, Liebherr, Bosch, Bora, Falmec, Franke, Teka, Bertazzoni, а также кухонные бренды Nobilia, Cucine Lube и Дриада.',
    highlight: 'Прямые поставки от официальных фабрик',
    icon: SimonaIconStar,
  },
  {
    num: '08',
    title: 'Быстрая и бережная логистика',
    desc: 'Отлаженная служба доставки и складской распределительный комплекс. Бережно доставляем заказы по Нижнему Новгороду, области и в любые регионы России строго в оговоренные сроки.',
    highlight: 'Доставка точно в день готовности объекта',
    icon: Truck,
  },
  {
    num: '09',
    title: 'PR и публикации реализованных проектов',
    desc: 'Продвигаем авторов лучших проектов: готовим фоторепортажи, публикуем ваши работы на нашем сайте и в соцсетях компании, рассказывая аудитории о вашем дизайнерском таланте.',
    highlight: 'Освещение ваших интерьеров в медиаканалах',
    icon: Share2,
  },
  {
    num: '10',
    title: 'Бесплатное хранение на складе',
    desc: 'Позволяет зафиксировать стоимость оборудования по текущему курсу и хранить комплект на нашем складе (ул. Коминтерна, 27) до момента окончания отделочных работ на объекте.',
    highlight: 'До 6 месяцев бесплатного ответственного хранения',
    icon: SimonaIconGuarantee,
  },
  {
    num: '11',
    title: 'Совместный подбор техники и кухни',
    desc: 'Спроектировать кухонный гарнитур и подобрать встраиваемые приборы можно в одном окне. Единая гарантийная ответственность, доставка одним рейсом и согласованный монтаж.',
    highlight: 'Синхронная комплектация мебели и встройки',
    icon: Layers,
  },
  {
    num: '12',
    title: 'Выделенный отдел по работе с дизайнерами',
    desc: 'Персональный менеджер-куратор говорит с вами на одном профессиональном языке, наизусть знает артикулы, габаритные схемы и сопровождает объект от эскиза до первого пуска.',
    highlight: 'Индивидуальное кураторство каждого проекта',
    icon: Users,
  },
];

const SPECIALIZATIONS = [
  'Дизайнер интерьера',
  'Архитектор',
  'Декоратор',
  'Комплектатор',
  'Дизайн-студия / Бюро',
];

const AVAILABLE_BRANDS = [
  'Miele',
  'Asko',
  'Liebherr',
  'Smeg',
  'Bosch',
  'Bora',
  'Falmec',
  'Omoikiri',
  'Körting',
  'Vard',
  'Bertazzoni',
];

export default function DesignersPage() {
  const content = useSiteContent();
  const analyticsData = useAnalyticsData();
  const [name, setName] = useState('');
  const [studio, setStudio] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [specialization, setSpecialization] = useState(SPECIALIZATIONS[0]);
  const [city, setCity] = useState('Нижний Новгород');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [source, setSource] = useState('Рекомендация коллег');
  const [comment, setComment] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [agreement, setAgreement] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((item) => item !== brand) : [...prev, brand]
    );
  };

  const handlePhoneChange = (val: string) => {
    // Basic formatting for RF phones
    setPhone(val);
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
        studio ? `Студия/Организация: ${studio}` : null,
        specialization ? `Специализация: ${specialization}` : null,
        city ? `Город: ${city}` : null,
        source ? `Откуда узнали: ${source}` : null,
        selectedBrands.length > 0 ? `Интересующие бренды: ${selectedBrands.join(', ')}` : null,
        comment ? `Комментарий: ${comment}` : null,
      ]
        .filter(Boolean)
        .join(' | ');

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'B2B_CLUB',
          name,
          phone,
          email: email || undefined,
          portfolioUrl: portfolioUrl || undefined,
          comment: detailedNotes,
          ...analyticsData,
        }),
      });

      if (!res.ok) throw new Error('Ошибка отправки заявки');

      setSuccess(true);
      trackGoal('DESIGNER_SPEC_SUBMIT', { name, studio, phone, specialization });
    } catch (err) {
      console.error(err);
      alert('Произошла ошибка при отправке заявки. Пожалуйста, свяжитесь с нами напрямую: +7 (903) 601-01-18');
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
            <SectionBadge variant="teal">
              {content.designersPage.badge}
            </SectionBadge>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-montserrat font-semibold tracking-tight text-white leading-[1.12]">
              {content.designersPage.title}
            </h1>

            <p className="text-base sm:text-lg text-[#87888A] leading-relaxed max-w-3xl">
              {content.designersPage.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#cooperation-form"
                className="px-7 py-3.5 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-semibold tracking-wide transition shadow-lg shadow-simona-teal/25 flex items-center gap-2 group cursor-pointer"
              >
                <span>{content.designersPage.ctaButton}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>

              <a
                href="https://t.me/nikitin_simona"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl bg-[#1E2228] hover:bg-[#252A32] text-white border border-[#2B313A] hover:border-simona-teal/50 text-xs font-medium tracking-wide transition flex items-center gap-2"
              >
                <span>Связаться с куратором в Telegram</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#87888A]" />
              </a>
            </div>
          </div>

          {/* Quick Verified Metrics Bar */}
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6 mt-14 pt-8 border-t border-[#2B313A]">
            <div>
              <div className="text-2xl sm:text-4xl font-montserrat font-semibold text-white">до 20%</div>
              <div className="text-xs text-[#87888A] mt-1.5 leading-snug">Дизайнерское вознаграждение по договору</div>
            </div>
            <div>
              <div className="text-2xl sm:text-4xl font-montserrat font-semibold text-white">5 000+</div>
              <div className="text-xs text-[#87888A] mt-1.5 leading-snug">SKU техники в наличии и под заказ</div>
            </div>
            <div>
              <div className="text-2xl sm:text-4xl font-montserrat font-semibold text-white">6 месяцев</div>
              <div className="text-xs text-[#87888A] mt-1.5 leading-snug">Бесплатное хранение на складе в Н. Новгороде</div>
            </div>
            <div>
              <div className="text-2xl sm:text-4xl font-montserrat font-semibold text-white">24 часа</div>
              <div className="text-xs text-[#87888A] mt-1.5 leading-snug">Подготовка сметы и монтажных схем встройки</div>
            </div>
          </div>
        </section>

        {/* 12 REASONS TO CHOOSE SIMONA */}
        <section className="space-y-8">
          <div className="text-left space-y-2.5">
            <SectionBadge variant="teal" text="Привилегии клуба" />
            <h2 className="text-2xl sm:text-4xl font-montserrat font-semibold tracking-tight text-white">
              12 причин выбрать компанию Simona
            </h2>
            <p className="text-sm text-[#87888A] max-w-2xl">
              Наш отдел по работе с дизайнерами готов стать частью вашей команды, чтобы создавать безупречные интерьеры без компромиссов.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DESIGNER_PILLARS.map((item) => {
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

        {/* DOCUMENTS & REQUIREMENTS DOWNLOAD CARD */}
        <section className="rounded-2xl bg-[#16191D] border border-[#2B313A] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-left">
            <div className="flex items-center gap-2 text-simona-teal text-xs font-semibold">
              <SimonaIconFile className="w-4 h-4" />
              <span>Документы для сотрудничества</span>
            </div>
            <h3 className="text-lg sm:text-xl font-montserrat font-semibold text-white">
              Какие документы необходимы для заключения партнерского договора?
            </h3>
            <p className="text-xs sm:text-sm text-[#87888A] max-w-2xl leading-relaxed">
              Ознакомьтесь с перечнем документов для самозанятых, индивидуальных предпринимателей и юридических лиц для регистрации в Архитектурном Клубе.
            </p>
          </div>

          <a
            href="/files/Список документов для дизайнеров.pdf"
            download
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-[#1E2228] hover:bg-[#252A32] text-white border border-[#2B313A] hover:border-simona-teal/60 text-xs font-medium tracking-wide transition flex items-center gap-2.5 shrink-0"
          >
            <Download className="w-4 h-4 text-simona-teal" />
            <span>Скачать перечень документов (PDF)</span>
          </a>
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
              <SectionBadge variant="teal" text="Форма сотрудничества" />
              <h2 className="text-2xl sm:text-4xl font-montserrat font-semibold tracking-tight text-white">
                Заполнить форму сотрудничества
              </h2>
              <p className="text-xs sm:text-sm text-[#87888A] leading-relaxed">
                Оставьте заявку, и ведущий менеджер отдела по работе с дизайнерами свяжется с вами в течение 30 минут в рабочее время для обсуждения персональных условий.
              </p>
            </div>

            {success ? (
              <div className="rounded-2xl bg-[#1E2228] border border-simona-teal/40 p-8 sm:p-10 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-simona-teal/15 text-simona-teal flex items-center justify-center mx-auto border border-simona-teal/30">
                  <SimonaIconCheckCircle className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-montserrat font-semibold text-white">
                  Заявка на сотрудничество успешно принята!
                </h3>
                <p className="text-xs sm:text-sm text-[#87888A] max-w-md mx-auto leading-relaxed">
                  Куратор направления свяжется с вами по указанному телефону, передаст партнерские материалы и согласует условия договора.
                </p>
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="mt-2 px-6 py-2.5 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-semibold tracking-wide transition cursor-pointer"
                >
                  Отправить еще одну заявку
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 text-xs">
                
                {/* 1. ФИО и Студия */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#D7D9DB] font-medium mb-1.5">
                      ФИО *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Мария Воронова"
                      className="w-full px-4 py-3 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white focus:outline-none focus:border-simona-teal transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[#D7D9DB] font-medium mb-1.5">
                      Студия дизайна / Бренд
                    </label>
                    <input
                      type="text"
                      value={studio}
                      onChange={(e) => setStudio(e.target.value)}
                      placeholder="Art Studio Interior"
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
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      placeholder="+7 (920) 000-00-00"
                      className="w-full px-4 py-3 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white focus:outline-none focus:border-simona-teal transition-colors font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[#D7D9DB] font-medium mb-1.5">
                      Электронная почта
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="designer@concept.ru"
                      className="w-full px-4 py-3 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white focus:outline-none focus:border-simona-teal transition-colors"
                    />
                  </div>
                </div>

                {/* 3. Вид деятельности (Селекторы) */}
                <div>
                  <label className="block text-[#D7D9DB] font-medium mb-2">
                    Вид деятельности:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {SPECIALIZATIONS.map((spec) => (
                      <button
                        type="button"
                        key={spec}
                        onClick={() => setSpecialization(spec)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-medium transition cursor-pointer border ${
                          specialization === spec
                            ? 'bg-simona-teal text-white border-simona-teal shadow-[0_0_12px_rgba(0,151,156,0.3)]'
                            : 'bg-[#1E2228] text-[#87888A] border-[#2B313A] hover:text-white hover:border-[#3E3D40]'
                        }`}
                      >
                        {spec}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Город и Откуда узнали */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#D7D9DB] font-medium mb-1.5">
                      Город / Регион
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Нижний Новгород"
                      className="w-full px-4 py-3 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white focus:outline-none focus:border-simona-teal transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[#D7D9DB] font-medium mb-1.5">
                      Откуда узнали о нас
                    </label>
                    <select
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white focus:outline-none focus:border-simona-teal transition-colors"
                    >
                      <option value="Рекомендация коллег">Рекомендация коллег</option>
                      <option value="Выставка / Мероприятие">Выставка / Мероприятие</option>
                      <option value="Социальные сети">Социальные сети</option>
                      <option value="Посетили салон">Посетили салон на Белинского</option>
                      <option value="Поиск в интернете">Поиск в интернете</option>
                    </select>
                  </div>
                </div>

                {/* 5. Ссылка на портфолио или проект */}
                <div>
                  <label className="block text-[#D7D9DB] font-medium mb-1.5">
                    Ссылка на портфолио / проект (Яндекс.Диск, Google Drive, сайт, соцсети)
                  </label>
                  <input
                    type="url"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    placeholder="https://disk.yandex.ru/d/... или ссылка на портфолио"
                    className="w-full px-4 py-3 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white focus:outline-none focus:border-simona-teal transition-colors"
                  />
                </div>

                {/* 6. Интересующие бренды */}
                <div>
                  <label className="block text-[#D7D9DB] font-medium mb-2">
                    Интересующие бренды в проектах:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_BRANDS.map((brand) => (
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

                {/* 7. Комментарий */}
                <div>
                  <label className="block text-[#D7D9DB] font-medium mb-1.5">
                    Комментарий или особенности проекта
                  </label>
                  <textarea
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Укажите сроки готовности объекта, пожелания по выезду на замер или встрече в лаундже салона..."
                    className="w-full px-4 py-3 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white focus:outline-none focus:border-simona-teal transition-colors resize-none"
                  />
                </div>

                {/* 8. Согласие */}
                <div className="flex items-start gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    id="agreement-checkbox"
                    checked={agreement}
                    onChange={(e) => setAgreement(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-simona-teal bg-[#1E2228] border-[#2B313A] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <label htmlFor="agreement-checkbox" className="text-[11px] text-[#87888A] leading-relaxed cursor-pointer select-none">
                    Я даю согласие на хранение и обработку персональных данных в соответствии с требованиями Федерального закона 152-ФЗ.
                  </label>
                </div>

                {/* 9. Кнопка отправки */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-semibold tracking-wide transition shadow-lg shadow-simona-teal/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <span>{submitting ? 'Отправка...' : 'Отправить заявку на сотрудничество'}</span>
                    <Send className="w-4 h-4" />
                  </button>

                  <div className="text-[11px] text-[#87888A] text-center sm:text-right">
                    Защита авторских прав • Конфиденциальность проектов
                  </div>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* DIRECT CURATOR CONTACT BAR */}
        <section className="rounded-2xl bg-[#16191D] border border-[#2B313A] p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-simona-teal/10 border border-simona-teal/20 text-simona-teal flex items-center justify-center shrink-0">
              <SimonaIconPhoneSolid className="w-5 h-5" />
            </div>
            <div className="text-left space-y-0.5">
              <div className="font-semibold text-white text-sm">
                Отдел по работе с дизайнерами
              </div>
              <div className="text-xs text-[#87888A]">
                Куратор направления: Никитин • г. Нижний Новгород, ул. Белинского, 15
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 shrink-0">
            <a
              href="tel:+79036010118"
              className="px-4 py-2.5 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white hover:text-simona-teal font-medium text-xs transition"
            >
              +7 (903) 601 01 18
            </a>

            <a
              href="https://t.me/nikitin_simona"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-[#2AABEE]/20 hover:bg-[#2AABEE]/30 text-[#2AABEE] border border-[#2AABEE]/40 text-xs font-medium transition flex items-center gap-2"
            >
              <span>Telegram: @nikitin_simona</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </section>

      </div>
    </main>
  );
}

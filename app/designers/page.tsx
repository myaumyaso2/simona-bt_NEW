'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SectionBadge } from '@/components/ui/SectionBadge';
import {
  SimonaIconGuarantee,
  SimonaIconPin,
  SimonaIconClock,
  SimonaIconPercent,
  SimonaIconPhoneSolid,
  SimonaIconStar,
} from '@/components/brand/SimonaIcons';
import {
  Briefcase,
  CheckCircle2,
  FileCheck,
  Download,
  Warehouse,
  Coffee,
  Wrench,
  ShieldCheck,
  Send,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useAnalyticsData } from '@/lib/analytics/utm';
import { trackGoal } from '@/lib/analytics/tracker';

export default function DesignersPage() {
  const analyticsData = useAnalyticsData();
  const [name, setName] = useState('');
  const [studio, setStudio] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [projectLink, setProjectLink] = useState('');
  const [comment, setComment] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const availableBrands = [
    'Miele',
    'ASKO',
    'Liebherr',
    'SMEG',
    'OMOIKIRI',
    'Körting',
    'VARD',
    'Falmec',
    'BORA',
    'Kuppersbusch',
  ];

  const toggleBrand = (b: string) => {
    setSelectedBrands((prev) =>
      prev.includes(b) ? prev.filter((item) => item !== b) : [...prev, b]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const notes = [
        studio ? `Студия: ${studio}` : null,
        selectedBrands.length > 0 ? `Бренды: ${selectedBrands.join(', ')}` : null,
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
          portfolioUrl: projectLink || undefined,
          comment: notes,
          ...analyticsData,
        }),
      });

      if (!res.ok) throw new Error('Ошибка отправки заявки');

      setSuccess(true);
      trackGoal('DESIGNER_SPEC_SUBMIT', { name, studio, phone });
    } catch (err) {
      console.error(err);
      alert('Произошла ошибка при отправке. Пожалуйста, позвоните нам напрямую: +7 (831) 423-76-00');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#111315] text-[#D7D9DB] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Hero Section */}
        <div className="bg-[#16191D] border border-[#2B313A] rounded-3xl p-6 sm:p-12 relative overflow-hidden">
          {/* Subtle Ambient Light */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-simona-teal/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl text-left space-y-4">
            <SectionBadge variant="teal" text="Архитектурный Клуб «СИМОНА»" />
            <h1 className="text-3xl sm:text-5xl font-montserrat font-bold text-white tracking-tight leading-tight">
              Комплектация дизайн-проектов премиальной встраиваемой техникой
            </h1>
            <p className="text-sm sm:text-base text-[#87888A] leading-relaxed">
              Мы берем на себя полную техническую ответственность: сверку вентиляционных зазоров и электрических фаз, подготовку CAD-чертежей, координацию с кухонными фабриками, бережное хранение на складе и сертифицированный шеф-монтаж.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <a
                href="#spec-form"
                className="px-6 py-3.5 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-simona-teal/20"
              >
                Отправить проект на расчет
              </a>
              <Link
                href="/showrooms"
                className="px-6 py-3.5 rounded-xl bg-[#1E2228] hover:bg-[#252A32] text-white border border-[#2B313A] text-xs font-semibold uppercase tracking-wider transition"
              >
                Забронировать лаундж для встречи
              </Link>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-[#2B313A]">
            <div>
              <div className="text-2xl sm:text-3xl font-montserrat font-bold text-white">до 20%</div>
              <div className="text-xs text-[#87888A] mt-1">Партнерское вознаграждение и скидки</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-montserrat font-bold text-white">6 месяцев</div>
              <div className="text-xs text-[#87888A] mt-1">Бесплатное хранение на Коминтерна, 27</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-montserrat font-bold text-white">24 часа</div>
              <div className="text-xs text-[#87888A] mt-1">Подготовка спецификации с 3D-моделями</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-montserrat font-bold text-white">100%</div>
              <div className="text-xs text-[#87888A] mt-1">Гарантия точности монтажных схем</div>
            </div>
          </div>
        </div>

        {/* 6 Key Privileges Grid */}
        <div className="space-y-6">
          <div className="text-left space-y-2">
            <SectionBadge variant="teal" text="Привилегии партнерства" />
            <h2 className="text-2xl sm:text-3xl font-montserrat font-bold text-white tracking-tight">
              Почему архитекторы и дизайнеры выбирают «СИМОНА»
            </h2>
            <p className="text-xs sm:text-sm text-[#87888A] max-w-2xl">
              С 1997 года мы создали безупречную репутацию в Нижнем Новгороде как самый надежный партнер для премиальных интерьеров.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Card 1 */}
            <div className="bg-[#16191D] border border-[#2B313A] rounded-2xl p-6 flex flex-col justify-between hover:border-simona-teal/50 transition shadow-md">
              <div>
                <div className="w-12 h-12 rounded-xl bg-simona-teal/10 border border-simona-teal/20 text-simona-teal flex items-center justify-center mb-4">
                  <SimonaIconPercent className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">Прозрачные финансовые условия</h3>
                <p className="text-xs text-[#87888A] leading-relaxed">
                  Персональный договор комплектации, своевременные агентские выплаты, защита проекта перед заказчиком и эксклюзивные цены на комплексные сеты встройки.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#2B313A] text-[11px] text-simona-teal font-semibold">
                Выплаты без задержек по безналичному расчету
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#16191D] border border-[#2B313A] rounded-2xl p-6 flex flex-col justify-between hover:border-simona-teal/50 transition shadow-md">
              <div>
                <div className="w-12 h-12 rounded-xl bg-simona-teal/10 border border-simona-teal/20 text-simona-teal flex items-center justify-center mb-4">
                  <FileCheck className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">Инженерный аудит чертежей</h3>
                <p className="text-xs text-[#87888A] leading-relaxed">
                  Проверяем высоты цоколей, габариты вентиляционных решеток для холодильников, диаметры воздуховодов вытяжек и электрические фазы. Исключаем ошибки монтажа на стадии проекта.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#2B313A] text-[11px] text-simona-teal font-semibold">
                Согласование с кухонными фабриками
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-[#16191D] border border-[#2B313A] rounded-2xl p-6 flex flex-col justify-between hover:border-simona-teal/50 transition shadow-md">
              <div>
                <div className="w-12 h-12 rounded-xl bg-simona-teal/10 border border-simona-teal/20 text-simona-teal flex items-center justify-center mb-4">
                  <Warehouse className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">Бесплатный резерв и хранение</h3>
                <p className="text-xs text-[#87888A] leading-relaxed">
                  Фиксация цен и бесплатное ответственное хранение на Центральном складе (Коминтерна, 27) до 6 месяцев. Доставка на объект строго в день готовности кухни.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#2B313A] text-[11px] text-simona-teal font-semibold">
                Фиксация стоимости от курсовых колебаний
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-[#16191D] border border-[#2B313A] rounded-2xl p-6 flex flex-col justify-between hover:border-simona-teal/50 transition shadow-md">
              <div>
                <div className="w-12 h-12 rounded-xl bg-simona-teal/10 border border-simona-teal/20 text-simona-teal flex items-center justify-center mb-4">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">База 3D-моделей и схем встройки</h3>
                <p className="text-xs text-[#87888A] leading-relaxed">
                  Предоставляем файлы 3ds Max (.max), CAD (.dwg) и векторные схемы встройки для интеграции в ваши дизайн-проекты и рендеры.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#2B313A] text-[11px] text-simona-teal font-semibold">
                Прямой доступ к библиотекам европейских брендов
              </div>
            </div>

            {/* Card 5 */}
            <div className="bg-[#16191D] border border-[#2B313A] rounded-2xl p-6 flex flex-col justify-between hover:border-simona-teal/50 transition shadow-md">
              <div>
                <div className="w-12 h-12 rounded-xl bg-simona-teal/10 border border-simona-teal/20 text-simona-teal flex items-center justify-center mb-4">
                  <Coffee className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">Архитектурный коворкинг</h3>
                <p className="text-xs text-[#87888A] leading-relaxed">
                  Проводите встречи со своими заказчиками во флагманском салоне на ул. Белинского, 15. Уютная лаундж-зона, свежесваренный кофе, демонстрационные зоны и образцы фасадов.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#2B313A] text-[11px] text-simona-teal font-semibold">
                Тест-драйв приборов в Активной кухне
              </div>
            </div>

            {/* Card 6 */}
            <div className="bg-[#16191D] border border-[#2B313A] rounded-2xl p-6 flex flex-col justify-between hover:border-simona-teal/50 transition shadow-md">
              <div>
                <div className="w-12 h-12 rounded-xl bg-simona-teal/10 border border-simona-teal/20 text-simona-teal flex items-center justify-center mb-4">
                  <Wrench className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">Шеф-монтаж и сервисный контур</h3>
                <p className="text-xs text-[#87888A] leading-relaxed">
                  Собственная служба сертифицированных монтажников. Навешивание фасадов, юстировка зазоров, подключение индукции и пуско-наладка с официальной заводской гарантией.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#2B313A] text-[11px] text-simona-teal font-semibold">
                Собственный авторизованный сервис-центр
              </div>
            </div>
          </div>
        </div>

        {/* Specification Upload Form */}
        <div id="spec-form" className="bg-[#16191D] border border-[#2B313A] rounded-3xl p-6 sm:p-10 relative">
          <div className="max-w-3xl mx-auto">
            <div className="text-left space-y-2 mb-8">
              <SectionBadge variant="teal" text="Заявка на расчет спецификации" />
              <h2 className="text-2xl sm:text-3xl font-montserrat font-bold text-white tracking-tight">
                Отправьте проект на подбор техники со скидкой
              </h2>
              <p className="text-xs sm:text-sm text-[#87888A]">
                Прикрепите ссылку на PDF или облачное хранилище. Мы подготовим расчет комплекта в течение 24 часов.
              </p>
            </div>

            {success ? (
              <div className="bg-[#1E2228] border border-simona-teal/40 rounded-2xl p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-simona-teal/10 border border-simona-teal/30 text-simona-teal flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-montserrat font-bold text-white">Проект принят в расчет!</h3>
                <p className="text-xs text-[#87888A] max-w-md mx-auto leading-relaxed">
                  Ведущий куратор Архитектурного Клуба СИМОНА свяжется с вами для согласования параметров спецификации и передаст персональную смету.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="px-6 py-2.5 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-semibold uppercase tracking-wider"
                >
                  Отправить еще один проект
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1.5">Ваше имя *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Мария Воронова"
                      className="w-full px-4 py-3 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white focus:outline-none focus:border-simona-teal"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1.5">Студия дизайна / Частный архитектор</label>
                    <input
                      type="text"
                      value={studio}
                      onChange={(e) => setStudio(e.target.value)}
                      placeholder="Art Studio Interior"
                      className="w-full px-4 py-3 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white focus:outline-none focus:border-simona-teal"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1.5">Телефон для связи *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+7 (920) 000-00-00"
                      className="w-full px-4 py-3 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white focus:outline-none focus:border-simona-teal"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1.5">Электронная почта</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="designer@concept.ru"
                      className="w-full px-4 py-3 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white focus:outline-none focus:border-simona-teal"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1.5">Ссылка на спецификацию / проект (Яндекс.Диск, Google Drive, Облако)</label>
                  <input
                    type="url"
                    value={projectLink}
                    onChange={(e) => setProjectLink(e.target.value)}
                    placeholder="https://disk.yandex.ru/d/..."
                    className="w-full px-4 py-3 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white focus:outline-none focus:border-simona-teal"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-2">Желаемые бренды в проекте:</label>
                  <div className="flex flex-wrap gap-2">
                    {availableBrands.map((brand) => (
                      <button
                        type="button"
                        key={brand}
                        onClick={() => toggleBrand(brand)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${
                          selectedBrands.includes(brand)
                            ? 'bg-simona-teal text-white border-simona-teal'
                            : 'bg-[#1E2228] text-[#87888A] border-[#2B313A] hover:text-white'
                        }`}
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1.5">Особые пожелания или требования к проекту</label>
                  <textarea
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Укажите бюджет, сроки готовности кухни, необходимость выездного замера или шеф-монтажа..."
                    className="w-full px-4 py-3 rounded-xl bg-[#1E2228] border border-[#2B313A] text-white focus:outline-none focus:border-simona-teal resize-none"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-simona-teal hover:bg-simona-teal-hover text-white text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-simona-teal/20 flex items-center justify-center space-x-2"
                  >
                    <span>{submitting ? 'Отправка...' : 'Отправить проект на расчет'}</span>
                    <Send className="w-4 h-4" />
                  </button>

                  <div className="text-[11px] text-[#87888A] text-center sm:text-right">
                    Конфиденциальность гарантируется • Защита авторских прав дизайнера
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Direct Contact Bar */}
        <div className="bg-[#16191D] border border-[#2B313A] rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-simona-teal/10 text-simona-teal flex items-center justify-center shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <span className="font-semibold text-white block">Отдел по работе с архитекторами и дизайнерами</span>
              <span className="text-[#87888A]">г. Нижний Новгород, ул. Белинского, 15 (Флагманский салон)</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="tel:+78314237600"
              className="text-white hover:text-simona-teal font-semibold font-mono text-sm transition"
            >
              +7 (831) 423-76-00
            </a>
            <span className="text-[#87888A]">b2b@simona-bt.ru</span>
          </div>
        </div>
      </div>
    </main>
  );
}

'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { SectionBadge } from '@/components/ui/SectionBadge';
import {
  ShieldCheck,
  FileText,
  Lock,
  Cookie,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

function PolicyContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'terms' ? 'terms' : searchParams.get('tab') === 'cookies' ? 'cookies' : 'privacy';
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'cookies'>(initialTab);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'terms') setActiveTab('terms');
    else if (tab === 'cookies') setActiveTab('cookies');
    else if (tab === 'privacy') setActiveTab('privacy');
  }, [searchParams]);

  return (
    <main className="min-h-screen bg-[#111315] text-[#D7D9DB] pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header Hero */}
        <div className="bg-[#16191D] border border-[#2B313A] rounded-3xl p-6 sm:p-10 relative overflow-hidden text-left space-y-3">
          <SectionBadge variant="teal">
            Правовая информация
          </SectionBadge>
          <h1 className="text-2xl sm:text-4xl font-montserrat font-bold text-white tracking-tight leading-tight">
            Политика конфиденциальности и условия использования
          </h1>
          <p className="text-xs sm:text-sm text-[#87888A] leading-relaxed">
            Официальные правовые документы интернет-магазина и сети салонов бытовой техники «СИМОНА» (ООО «Технотрейд-НН»).
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#2B313A] gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'privacy'
                ? 'bg-simona-teal text-white shadow-md shadow-simona-teal/20'
                : 'bg-[#16191D] border border-[#2B313A] text-[#87888A] hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Политика конфиденциальности (152-ФЗ)</span>
          </button>

          <button
            onClick={() => setActiveTab('terms')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'terms'
                ? 'bg-simona-teal text-white shadow-md shadow-simona-teal/20'
                : 'bg-[#16191D] border border-[#2B313A] text-[#87888A] hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Пользовательское соглашение и оферта</span>
          </button>

          <button
            onClick={() => setActiveTab('cookies')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'cookies'
                ? 'bg-simona-teal text-white shadow-md shadow-simona-teal/20'
                : 'bg-[#16191D] border border-[#2B313A] text-[#87888A] hover:text-white'
            }`}
          >
            <Cookie className="w-3.5 h-3.5" />
            <span>Политика файлов Cookie</span>
          </button>
        </div>

        {/* Tab 1: Privacy Policy (152-FZ) */}
        {activeTab === 'privacy' && (
          <div className="bg-[#16191D] border border-[#2B313A] rounded-3xl p-6 sm:p-10 space-y-8 text-xs leading-relaxed text-zinc-300">
            <div className="border-b border-[#2B313A] pb-4">
              <span className="text-[11px] text-simona-teal font-semibold uppercase tracking-wider block mb-1">
                Редакция от 1 октября 2026 г.
              </span>
              <h2 className="text-xl sm:text-2xl font-montserrat font-bold text-white">
                Политика в отношении обработки персональных данных
              </h2>
            </div>

            <section className="space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">1. Общие положения</h3>
              <p>
                1.1. Настоящая Политика обработки персональных данных (далее — «Политика») составлена в соответствии с требованиями Федерального закона от 27.07.2006 № 152-ФЗ «О персональных данных» и определяет порядок обработки персональных данных и меры по обеспечению безопасности персональных данных, предпринимаемые <strong>ООО «Технотрейд-НН»</strong> (ОГРН 1115260005827, ИНН 5260300686, адрес: 603000, г. Нижний Новгород, ул. Максима Горького, д. 77, кв. 78, далее — «Оператор»).
              </p>
              <p>
                1.2. Оператор ставит своей важнейшей целью и условием осуществления своей деятельности соблюдение прав и свобод человека и гражданина при обработке его персональных данных, в том числе защиты прав на неприкосновенность частной жизни, личную и семейную тайну.
              </p>
              <p>
                1.3. Настоящая Политика применяется ко всей информации, которую Оператор может получить о посетителях веб-сайта <code>https://simona-bt.ru</code>, а также покупателях салонов «СИМОНА».
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">2. Категории обрабатываемых данных</h3>
              <p>2.1. Оператор может обрабатывать следующие персональные данные Пользователя:</p>
              <ul className="list-disc pl-5 space-y-1 text-zinc-400">
                <li>Фамилия, имя, отчество;</li>
                <li>Номер контактного телефона (мобильного или городского);</li>
                <li>Адрес электронной почты (e-mail);</li>
                <li>Адрес фактической доставки товаров (город, улица, номер дома, корпус, подъезд, этаж, квартира);</li>
                <li>История заказов, покупок и гарантийных обращений;</li>
                <li>Обезличенные данные о посетителях (в т.ч. файлы cookie, IP-адрес, данные счетчика Яндекс Метрики 1351807).</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">3. Цели обработки персональных данных</h3>
              <ul className="list-disc pl-5 space-y-1 text-zinc-400">
                <li>Идентификация стороны в рамках соглашений и договоров с Оператором;</li>
                <li>Оформление заказов на продажу, доставку, монтаж и бесплатное хранение бытовой техники;</li>
                <li>Предоставление Пользователю клиентской и технической поддержки при возникновении проблем, связанных с использованием сервисов;</li>
                <li>Связь с Пользователем, включая направление уведомлений, запросов и информации, касающихся исполнения заказов;</li>
                <li>Направление кассовых фискальных чеков в электронном виде (в соответствии с 54-ФЗ);</li>
                <li>Улучшение качества работы сайта, удобства его использования и разработка новых сервисов.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">4. Правовые основания и безопасность</h3>
              <p>
                4.1. Правовыми основаниями обработки персональных данных являются: Конституция РФ, Гражданский кодекс РФ, Закон РФ «О защите прав потребителей», согласие Пользователя на обработку персональных данных.
              </p>
              <p>
                4.2. Безопасность персональных данных обеспечивается путем реализации правовых, организационных и технических мер (256-битное шифрование SSL, защищенные каналы связи, ограничение круга лиц, имеющих доступ к базам данных).
              </p>
              <p>
                4.3. Персональные данные Пользователя никогда, ни при каких условиях не будут переданы третьим лицам, за исключением случаев, связанных с исполнением действующего законодательства либо исполнением заказа (например, передача адреса службе доставки или экспедиторам транспортных компаний).
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">5. Актуализация и отзыв согласия</h3>
              <p>
                5.1. Пользователь может в любой момент актуализировать свои персональные данные либо отозвать свое согласие на их обработку, направив официальное уведомление на адрес электронной почты Оператора: <code>info@simona-bt.ru</code> с пометкой «Отзыв согласия на обработку персональных данных».
              </p>
            </section>
          </div>
        )}

        {/* Tab 2: Terms of Service & Public Offer */}
        {activeTab === 'terms' && (
          <div className="bg-[#16191D] border border-[#2B313A] rounded-3xl p-6 sm:p-10 space-y-8 text-xs leading-relaxed text-zinc-300">
            <div className="border-b border-[#2B313A] pb-4">
              <span className="text-[11px] text-simona-teal font-semibold uppercase tracking-wider block mb-1">
                Публичная оферта интернет-магазина
              </span>
              <h2 className="text-xl sm:text-2xl font-montserrat font-bold text-white">
                Пользовательское соглашение и публичная оферта
              </h2>
            </div>

            <section className="space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">1. Предмет соглашения</h3>
              <p>
                1.1. Настоящее Пользовательское соглашение (далее — «Соглашение») регулирует отношения между ООО «Технотрейд-НН» (далее — «Продавец») и пользователем сети Интернет (далее — «Покупатель») при оформлении заказов на сайте <code>simona-bt.ru</code>.
              </p>
              <p>
                1.2. В соответствии со статьей 437 Гражданского кодекса РФ данный документ является официальным публичным предложением (публичной офертой). Оформление заказа на Сайте либо совершение оплаты является полным и безоговорочным акцептом настоящей Оферты.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">2. Оформление заказа и цены</h3>
              <p>
                2.1. Заказ формируется Покупателем самостоятельно через функционал корзины интернет-магазина либо при обращении к менеджеру-консультанту салона.
              </p>
              <p>
                2.2. Цены на сайте указаны в рублях РФ. Продавец вправе в одностороннем порядке изменять цены на товары до момента подтверждения и оплаты заказа Покупателем.
              </p>
              <p>
                2.3. В случае отсутствия заказанного товара на складе Продавец незамедлительно уведомляет Покупателя и предлагает альтернативную модель либо аннулирует заказ с возвратом денежных средств.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">3. Оплата и передача товара</h3>
              <p>
                3.1. Оплата производится банковскими картами через шлюз ЮKassa, по СБП, безналичным расчетом по счету либо наличными/картой в салоне Продавца.
              </p>
              <p>
                3.2. Доставка осуществляется по Нижнему Новгороду и Нижегородской области собственной службой доставки либо транспортными компаниями по РФ в соответствии с условиями, опубликованными в разделе <Link href="/delivery-payment" className="text-simona-teal underline">Доставка и оплата</Link>.
              </p>
              <p>
                3.3. При получении товара Покупатель обязан осмотреть внешний вид, проверить отсутствие механических повреждений стекла и эмали, а также комплектность в присутствии экспедитора.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">4. Возврат и гарантия</h3>
              <p>
                4.1. Возврат и гарантийное обслуживание осуществляются строго по правилам Закона РФ «О защите прав потребителей» и условиям, опубликованным в разделах <Link href="/returns" className="text-simona-teal underline">Возврат и обмен</Link> и <Link href="/warranty" className="text-simona-teal underline">Гарантия</Link>.
              </p>
            </section>
          </div>
        )}

        {/* Tab 3: Cookies Policy */}
        {activeTab === 'cookies' && (
          <div className="bg-[#16191D] border border-[#2B313A] rounded-3xl p-6 sm:p-10 space-y-8 text-xs leading-relaxed text-zinc-300">
            <div className="border-b border-[#2B313A] pb-4">
              <span className="text-[11px] text-simona-teal font-semibold uppercase tracking-wider block mb-1">
                Файлы Cookie и аналитика
              </span>
              <h2 className="text-xl sm:text-2xl font-montserrat font-bold text-white">
                Политика использования файлов Cookie
              </h2>
            </div>

            <section className="space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">1. Что такое файлы Cookie?</h3>
              <p>
                Файлы cookie (куки) — это небольшие текстовые фрагменты данных, сохраняемые на вашем компьютере или мобильном устройстве при посещении сайта <code>simona-bt.ru</code>. Они помогают сайту запоминать ваши действия и предпочтения (содержимое корзины, избранные товары, выбранный город).
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">2. Какие файлы cookie мы используем?</h3>
              <ul className="list-disc pl-5 space-y-2 text-zinc-400">
                <li>
                  <strong className="text-white">Технические (функциональные) cookie:</strong> необходимы для работы корзины, сравнения характеристик техники и сохранения авторизации.
                </li>
                <li>
                  <strong className="text-white">Аналитические cookie:</strong> используются сервисом Яндекс Метрика (счетчик 1351807) для анонимного анализа посещаемости, источников трафика и улучшения пользовательского интерфейса.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">3. Как управлять файлами cookie?</h3>
              <p>
                Вы можете в любой момент отключить или удалить файлы cookie в настройках вашего браузера (Chrome, Safari, Firefox, Яндекс Браузер). Обратите внимание: отключение технических cookie может нарушить работу корзины и списков сравнения товаров.
              </p>
            </section>
          </div>
        )}

      </div>
    </main>
  );
}

export default function PolicyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#111315] pt-32 pb-24 text-center text-[#87888A]">
          Загрузка правовых документов...
        </div>
      }
    >
      <PolicyContent />
    </Suspense>
  );
}

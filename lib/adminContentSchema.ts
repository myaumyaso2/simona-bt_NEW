import { SiteContent } from '@/types/siteContent';

export interface AdminFieldDef {
  keyPath: string;
  section: string;
  label: string;
  type: 'text' | 'textarea' | 'url';
  help?: string;
}

export interface AdminTabDef {
  id: string;
  title: string;
  badge: string;
  description: string;
  fields: AdminFieldDef[];
}

export const ADMIN_TABS: AdminTabDef[] = [
  {
    id: 'nav_contacts',
    title: 'Сквозные элементы',
    badge: 'Шапка / Меню / Подвал',
    description: 'Телефоны, адреса шоурумов, ссылки навигации и правовая информация в подвале сайта',
    fields: [
      // Umbrella-бар
      {
        section: 'Umbrella-бар',
        keyPath: 'contacts.flagmanAddress',
        label: 'Адрес флагмана в верхней полосе',
        type: 'text',
      },
      {
        section: 'Umbrella-бар',
        keyPath: 'contacts.flagmanMapUrl',
        label: 'Ссылка на флагман в Яндекс.Картах',
        type: 'url',
      },
      {
        section: 'Umbrella-бар',
        keyPath: 'contacts.schedule',
        label: 'Режим работы салонов',
        type: 'text',
      },
      {
        section: 'Umbrella-бар',
        keyPath: 'contacts.phone',
        label: 'Номер телефона (отображаемый)',
        type: 'text',
      },
      {
        section: 'Umbrella-бар',
        keyPath: 'contacts.phoneRaw',
        label: 'Номер телефона для звонка (tel:)',
        type: 'text',
      },
      {
        section: 'Umbrella-бар',
        keyPath: 'contacts.kuhniUrl',
        label: 'Ссылка на направление кухонь',
        type: 'url',
      },
      // Контакты
      {
        section: 'Контакты салонов',
        keyPath: 'contacts.phoneFlagman',
        label: 'Телефон флагмана на Белинского 15',
        type: 'text',
      },
      {
        section: 'Контакты салонов',
        keyPath: 'contacts.phoneOmoikiri',
        label: 'Телефон салона на Белинского 11/66',
        type: 'text',
      },
      {
        section: 'Контакты салонов',
        keyPath: 'contacts.omoikiriAddress',
        label: 'Адрес салона Omoikiri & Körting',
        type: 'text',
      },
      {
        section: 'Контакты салонов',
        keyPath: 'contacts.warehouseAddress',
        label: 'Адрес Центрального склада',
        type: 'text',
      },
      {
        section: 'Контакты салонов',
        keyPath: 'contacts.telegramUrl',
        label: 'Ссылка на Telegram-консьержа',
        type: 'url',
      },
      {
        section: 'Контакты салонов',
        keyPath: 'contacts.telegramHandle',
        label: 'Отображаемый ник Telegram',
        type: 'text',
      },
      // Главное меню
      {
        section: 'Главное меню',
        keyPath: 'navigation.catalog',
        label: 'Пункт меню: Каталог',
        type: 'text',
      },
      {
        section: 'Главное меню',
        keyPath: 'navigation.promos',
        label: 'Пункт меню: Акции',
        type: 'text',
      },
      {
        section: 'Главное меню',
        keyPath: 'navigation.designers',
        label: 'Пункт меню: Дизайнерам',
        type: 'text',
      },
      {
        section: 'Главное меню',
        keyPath: 'navigation.opt',
        label: 'Пункт меню: Опт',
        type: 'text',
      },
      {
        section: 'Главное меню',
        keyPath: 'navigation.services',
        label: 'Пункт меню: Сервис',
        type: 'text',
      },
      {
        section: 'Главное меню',
        keyPath: 'navigation.showrooms',
        label: 'Пункт меню: Шоурумы',
        type: 'text',
      },
      {
        section: 'Главное меню',
        keyPath: 'navigation.searchPlaceholder',
        label: 'Подсказка в строке поиска',
        type: 'text',
      },
      // Подвал (Footer)
      {
        section: 'Подвал (Footer)',
        keyPath: 'footer.brandTagline',
        label: 'Слоган под логотипом «СИМОНА»',
        type: 'textarea',
      },
      {
        section: 'Подвал (Footer)',
        keyPath: 'footer.kuhniLinkText',
        label: 'Текст ссылки на мебельное направление',
        type: 'text',
      },
      {
        section: 'Подвал (Footer)',
        keyPath: 'footer.salonsHeading',
        label: 'Заголовок колонки салонов',
        type: 'text',
      },
      {
        section: 'Подвал (Footer)',
        keyPath: 'footer.navHeading',
        label: 'Заголовок колонки навигации',
        type: 'text',
      },
      {
        section: 'Подвал (Footer)',
        keyPath: 'footer.designersHeading',
        label: 'Заголовок B2B колонки дизайнеров',
        type: 'text',
      },
      {
        section: 'Подвал (Footer)',
        keyPath: 'footer.designersText',
        label: 'Текст приглашения для дизайнеров',
        type: 'textarea',
      },
      {
        section: 'Подвал (Footer)',
        keyPath: 'footer.designersCta',
        label: 'Кнопка перехода в B2B раздел',
        type: 'text',
      },
      {
        section: 'Подвал (Footer)',
        keyPath: 'footer.copyright',
        label: 'Строка копирайта',
        type: 'text',
      },
      {
        section: 'Подвал (Footer)',
        keyPath: 'footer.privacyPolicyText',
        label: 'Текст ссылки политики конфиденциальности',
        type: 'text',
      },
      {
        section: 'Подвал (Footer)',
        keyPath: 'footer.userAgreementText',
        label: 'Текст ссылки пользовательского соглашения',
        type: 'text',
      },
    ],
  },
  {
    id: 'home',
    title: 'Главная страница',
    badge: 'Витрина / Бренды / Сервис',
    description: 'Первый экран Hero, промо-акции, атлас брендов, адреса шоурумов, направления каталога и Telegram',
    fields: [
      // Hero
      {
        section: 'Hero (Первый экран)',
        keyPath: 'hero.badge',
        label: 'Верхняя плашка брендов-партнеров',
        type: 'text',
      },
      {
        section: 'Hero (Первый экран)',
        keyPath: 'hero.title',
        label: 'Главный заголовок H1',
        type: 'textarea',
      },
      {
        section: 'Hero (Первый экран)',
        keyPath: 'hero.subtitle',
        label: 'Описание под главным заголовком',
        type: 'textarea',
      },
      {
        section: 'Hero (Первый экран)',
        keyPath: 'hero.primaryCta',
        label: 'Кнопка консультации (бирюзовая)',
        type: 'text',
      },
      {
        section: 'Hero (Первый экран)',
        keyPath: 'hero.secondaryCta',
        label: 'Кнопка перехода в каталог',
        type: 'text',
      },
      // УТП Hero
      {
        section: 'УТП Hero (Карточка 1)',
        keyPath: 'hero.features.experts.title',
        label: 'Заголовок: Эксперты встройки',
        type: 'text',
      },
      {
        section: 'УТП Hero (Карточка 1)',
        keyPath: 'hero.features.experts.description',
        label: 'Описание: Эксперты встройки',
        type: 'textarea',
      },
      {
        section: 'УТП Hero (Карточка 2)',
        keyPath: 'hero.features.activeKitchen.title',
        label: 'Заголовок: Активная кухня',
        type: 'text',
      },
      {
        section: 'УТП Hero (Карточка 2)',
        keyPath: 'hero.features.activeKitchen.description',
        label: 'Описание: Активная кухня',
        type: 'textarea',
      },
      {
        section: 'УТП Hero (Карточка 3)',
        keyPath: 'hero.features.b2b.title',
        label: 'Заголовок: Дизайнерам и B2B',
        type: 'text',
      },
      {
        section: 'УТП Hero (Карточка 3)',
        keyPath: 'hero.features.b2b.description',
        label: 'Описание: Дизайнерам и B2B',
        type: 'textarea',
      },
      // Акции витрины
      {
        section: 'Акции производителей',
        keyPath: 'promosSection.badge',
        label: 'Винный бейдж блока акций',
        type: 'text',
      },
      {
        section: 'Акции производителей',
        keyPath: 'promosSection.title',
        label: 'Заголовок блока акций',
        type: 'text',
      },
      {
        section: 'Акции производителей',
        keyPath: 'promosSection.subtitle',
        label: 'Описание блока акций',
        type: 'textarea',
      },
      {
        section: 'Акции производителей',
        keyPath: 'promosSection.allPromosCta',
        label: 'Текст ссылки на все акции',
        type: 'text',
      },
      // Брендовый атлас
      {
        section: 'Брендовый атлас',
        keyPath: 'brandAtlas.badge',
        label: 'Бейдж над брендами',
        type: 'text',
      },
      {
        section: 'Брендовый атлас',
        keyPath: 'brandAtlas.title',
        label: 'Заголовок блока брендов',
        type: 'text',
      },
      {
        section: 'Брендовый атлас',
        keyPath: 'brandAtlas.subtitle',
        label: 'Описание блока брендов',
        type: 'textarea',
      },
      // Шоурумы на Белинского
      {
        section: 'Шоурумы на Белинского',
        keyPath: 'showroomsSection.badge',
        label: 'Бейдж блока шоурумов',
        type: 'text',
      },
      {
        section: 'Шоурумы на Белинского',
        keyPath: 'showroomsSection.title',
        label: 'Заголовок блока шоурумов',
        type: 'text',
      },
      {
        section: 'Шоурумы на Белинского',
        keyPath: 'showroomsSection.subtitle',
        label: 'Описание блока шоурумов',
        type: 'textarea',
      },
      {
        section: 'Шоурумы на Белинского',
        keyPath: 'showroomsSection.flagmanTitle',
        label: 'Название флагманского салона',
        type: 'text',
      },
      {
        section: 'Шоурумы на Белинского',
        keyPath: 'showroomsSection.flagmanAddress',
        label: 'Адрес флагманского салона',
        type: 'text',
      },
      {
        section: 'Шоурумы на Белинского',
        keyPath: 'showroomsSection.flagmanHours',
        label: 'Режим работы флагмана',
        type: 'text',
      },
      {
        section: 'Шоурумы на Белинского',
        keyPath: 'showroomsSection.flagmanParking',
        label: 'Информация о парковке флагмана',
        type: 'text',
      },
      {
        section: 'Шоурумы на Белинского',
        keyPath: 'showroomsSection.omoikiriTitle',
        label: 'Название салона Omoikiri & Körting',
        type: 'text',
      },
      {
        section: 'Шоурумы на Белинского',
        keyPath: 'showroomsSection.omoikiriAddress',
        label: 'Адрес салона Omoikiri & Körting',
        type: 'text',
      },
      {
        section: 'Шоурумы на Белинского',
        keyPath: 'showroomsSection.omoikiriHours',
        label: 'Режим работы второго салона',
        type: 'text',
      },
      {
        section: 'Шоурумы на Белинского',
        keyPath: 'showroomsSection.omoikiriParking',
        label: 'Информация о парковке второго салона',
        type: 'text',
      },
      // Ключевые направления
      {
        section: 'Направления каталога',
        keyPath: 'keyDirections.badge',
        label: 'Бейдж блока направлений',
        type: 'text',
      },
      {
        section: 'Направления каталога',
        keyPath: 'keyDirections.title',
        label: 'Заголовок блока направлений',
        type: 'text',
      },
      {
        section: 'Направления каталога',
        keyPath: 'keyDirections.subtitle',
        label: 'Описание блока направлений',
        type: 'textarea',
      },
      // Сервисный стандарт
      {
        section: 'Сервисный стандарт',
        keyPath: 'service.badge',
        label: 'Бейдж сервисного блока',
        type: 'text',
      },
      {
        section: 'Сервисный стандарт',
        keyPath: 'service.title',
        label: 'Заголовок сервисного блока',
        type: 'text',
      },
      {
        section: 'Сервисный стандарт',
        keyPath: 'service.subtitle',
        label: 'Описание сервисного блока',
        type: 'textarea',
      },
      {
        section: 'Сервисный стандарт',
        keyPath: 'service.consultationCta',
        label: 'Текст перед телефоном заботы',
        type: 'text',
      },
      {
        section: 'Сервисные карты',
        keyPath: 'service.cards[0].title',
        label: 'Услуга 1: Заголовок',
        type: 'text',
      },
      {
        section: 'Сервисные карты',
        keyPath: 'service.cards[0].description',
        label: 'Услуга 1: Описание',
        type: 'textarea',
      },
      {
        section: 'Сервисные карты',
        keyPath: 'service.cards[1].title',
        label: 'Услуга 2: Заголовок',
        type: 'text',
      },
      {
        section: 'Сервисные карты',
        keyPath: 'service.cards[1].description',
        label: 'Услуга 2: Описание',
        type: 'textarea',
      },
      {
        section: 'Сервисные карты',
        keyPath: 'service.cards[2].title',
        label: 'Услуга 3: Заголовок',
        type: 'text',
      },
      {
        section: 'Сервисные карты',
        keyPath: 'service.cards[2].description',
        label: 'Услуга 3: Описание',
        type: 'textarea',
      },
      // Telegram Live
      {
        section: 'Telegram Live-блок',
        keyPath: 'telegram.badge',
        label: 'Бейдж блока Telegram',
        type: 'text',
      },
      {
        section: 'Telegram Live-блок',
        keyPath: 'telegram.title',
        label: 'Заголовок блока Telegram',
        type: 'text',
      },
      {
        section: 'Telegram Live-блок',
        keyPath: 'telegram.subtitle',
        label: 'Описание блока Telegram',
        type: 'textarea',
      },
      {
        section: 'Telegram Live-блок',
        keyPath: 'telegram.subscribeCta',
        label: 'Текст кнопки подписки на канал',
        type: 'text',
      },
    ],
  },
  {
    id: 'designers',
    title: 'Дизайнерам',
    badge: '/designers',
    description: 'Условия дизайнерского клуба, главный экран и все 12 опор сотрудничества с архитекторами',
    fields: [
      {
        section: 'Главный экран',
        keyPath: 'designersPage.badge',
        label: 'Бейдж страницы дизайнеров',
        type: 'text',
      },
      {
        section: 'Главный экран',
        keyPath: 'designersPage.title',
        label: 'Заголовок H1 страницы',
        type: 'text',
      },
      {
        section: 'Главный экран',
        keyPath: 'designersPage.subtitle',
        label: 'Описание условий сотрудничества',
        type: 'textarea',
      },
      {
        section: 'Главный экран',
        keyPath: 'designersPage.ctaButton',
        label: 'Кнопка вступления в клуб',
        type: 'text',
      },
      {
        section: 'Главный экран',
        keyPath: 'designersPage.secondaryButton',
        label: 'Кнопка бронирования встречи',
        type: 'text',
      },
      // 12 опор
      ...Array.from({ length: 12 }).flatMap((_, i) => [
        {
          section: `Опора 0${i + 1}`,
          keyPath: `designersPage.pillars[${i}].title`,
          label: `Опора 0${i + 1}: Название`,
          type: 'text' as const,
        },
        {
          section: `Опора 0${i + 1}`,
          keyPath: `designersPage.pillars[${i}].desc`,
          label: `Опора 0${i + 1}: Описание`,
          type: 'textarea' as const,
        },
      ]),
    ],
  },
  {
    id: 'opt',
    title: 'Оптовый отдел',
    badge: '/opt',
    description: 'Поставки застройщикам и кухонным студиям, главный экран и 12 опор оптового партнерства',
    fields: [
      {
        section: 'Главный экран',
        keyPath: 'optPage.badge',
        label: 'Бейдж оптового отдела',
        type: 'text',
      },
      {
        section: 'Главный экран',
        keyPath: 'optPage.title',
        label: 'Заголовок H1 страницы',
        type: 'text',
      },
      {
        section: 'Главный экран',
        keyPath: 'optPage.subtitle',
        label: 'Описание оптовых условий',
        type: 'textarea',
      },
      {
        section: 'Главный экран',
        keyPath: 'optPage.ctaButton',
        label: 'Кнопка запроса прайс-листа',
        type: 'text',
      },
      {
        section: 'Главный экран',
        keyPath: 'optPage.secondaryButton',
        label: 'Кнопка B2B консультации',
        type: 'text',
      },
      // 12 опор
      ...Array.from({ length: 12 }).flatMap((_, i) => [
        {
          section: `Опора 0${i + 1}`,
          keyPath: `optPage.pillars[${i}].title`,
          label: `Опора 0${i + 1}: Название`,
          type: 'text' as const,
        },
        {
          section: `Опора 0${i + 1}`,
          keyPath: `optPage.pillars[${i}].desc`,
          label: `Опора 0${i + 1}: Описание`,
          type: 'textarea' as const,
        },
      ]),
    ],
  },
  {
    id: 'services',
    title: 'Сервис и монтаж',
    badge: '/services',
    description: 'Сервисная экосистема, шеф-монтаж, хранение на складе и инженерный замер объекта',
    fields: [
      {
        section: 'Главный экран',
        keyPath: 'servicesPage.badge',
        label: 'Бейдж сервисной страницы',
        type: 'text',
      },
      {
        section: 'Главный экран',
        keyPath: 'servicesPage.title',
        label: 'Заголовок H1 сервисной экосистемы',
        type: 'text',
      },
      {
        section: 'Главный экран',
        keyPath: 'servicesPage.subtitle',
        label: 'Описание сервисных процессов',
        type: 'textarea',
      },
      {
        section: 'Главный экран',
        keyPath: 'servicesPage.ctaButton',
        label: 'Кнопка заказа сервиса/шеф-монтажа',
        type: 'text',
      },
      {
        section: 'Блок 4 опор',
        keyPath: 'servicesPage.pillarsTitle',
        label: 'Заголовок блока сервисных опор',
        type: 'text',
      },
      ...Array.from({ length: 4 }).flatMap((_, i) => [
        {
          section: `Сервисная опора ${i + 1}`,
          keyPath: `servicesPage.pillars[${i}].title`,
          label: `Опора ${i + 1}: Название`,
          type: 'text' as const,
        },
        {
          section: `Сервисная опора ${i + 1}`,
          keyPath: `servicesPage.pillars[${i}].desc`,
          label: `Опора ${i + 1}: Описание`,
          type: 'textarea' as const,
        },
      ]),
    ],
  },
  {
    id: 'showrooms',
    title: 'Шоурумы',
    badge: '/showrooms',
    description: 'Страница флагманских салонов «СИМОНА» на ул. Белинского 15 и 11/66',
    fields: [
      {
        section: 'Главный экран',
        keyPath: 'showroomsPage.badge',
        label: 'Бейдж страницы шоурумов',
        type: 'text',
      },
      {
        section: 'Главный экран',
        keyPath: 'showroomsPage.title',
        label: 'Заголовок H1 страницы',
        type: 'text',
      },
      {
        section: 'Главный экран',
        keyPath: 'showroomsPage.subtitle',
        label: 'Описание экспозиции салонов',
        type: 'textarea',
      },
      {
        section: 'Главный экран',
        keyPath: 'showroomsPage.ctaButton',
        label: 'Кнопка бронирования визита',
        type: 'text',
      },
      {
        section: 'Салоны',
        keyPath: 'showroomsPage.flagmanName',
        label: 'Название 1-го салона (Флагман)',
        type: 'text',
      },
      {
        section: 'Салоны',
        keyPath: 'showroomsPage.omoikiriName',
        label: 'Название 2-го салона (Omoikiri & Körting)',
        type: 'text',
      },
    ],
  },
  {
    id: 'promos',
    title: 'Каталог акций',
    badge: '/promos',
    description: 'Заголовок и вступительный текст раздела федеральных акций европейских брендов',
    fields: [
      {
        section: 'Главный экран',
        keyPath: 'promosPage.badge',
        label: 'Бейдж каталога акций',
        type: 'text',
      },
      {
        section: 'Главный экран',
        keyPath: 'promosPage.title',
        label: 'Заголовок H1 страницы акций',
        type: 'text',
      },
      {
        section: 'Главный экран',
        keyPath: 'promosPage.subtitle',
        label: 'Описание акций европейских производителей',
        type: 'textarea',
      },
    ],
  },
];

/**
 * Safely extract a value from nested object by path (e.g. 'hero.features.experts.title' or 'service.cards[0].title')
 */
export function getValueByPath(obj: any, path: string): string {
  if (!obj) return '';

  // Parse path with array indexes: 'service.cards[0].title' -> ['service', 'cards', 0, 'title']
  const parts: (string | number)[] = [];
  const segments = path.split('.');

  for (const segment of segments) {
    const arrayMatch = segment.match(/^([a-zA-Z0-9_]+)\[(\d+)\]$/);
    if (arrayMatch) {
      parts.push(arrayMatch[1]);
      parts.push(parseInt(arrayMatch[2], 10));
    } else {
      parts.push(segment);
    }
  }

  let current = obj;
  for (const part of parts) {
    if (current === undefined || current === null) return '';
    current = current[part];
  }

  return current !== undefined && current !== null ? String(current) : '';
}

/**
 * Safely immutably update a nested value in object by path
 */
export function setValueByPath(obj: SiteContent, path: string, value: string): SiteContent {
  const clone = JSON.parse(JSON.stringify(obj)) as SiteContent;

  const parts: (string | number)[] = [];
  const segments = path.split('.');

  for (const segment of segments) {
    const arrayMatch = segment.match(/^([a-zA-Z0-9_]+)\[(\d+)\]$/);
    if (arrayMatch) {
      parts.push(arrayMatch[1]);
      parts.push(parseInt(arrayMatch[2], 10));
    } else {
      parts.push(segment);
    }
  }

  let current: any = clone;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (current[part] === undefined || current[part] === null) {
      current[part] = typeof parts[i + 1] === 'number' ? [] : {};
    }
    current = current[part];
  }

  const lastKey = parts[parts.length - 1];
  current[lastKey] = value;

  return clone;
}

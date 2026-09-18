import { ManufacturerPromo } from '@/types';

export const MANUFACTURER_PROMOS: ManufacturerPromo[] = [
  {
    id: 'promo-miele-7000',
    slug: 'miele-generation-7000-benefit',
    brand: 'Miele',
    brandCountry: 'Германия',
    title: 'Выгода до 15% на премиум-комплекты Generation 7000',
    subtitle: 'Комплектование кухонной зоны Miele',
    badgeText: 'Выгода до 15%',
    benefitType: 'DISCOUNT',
    discountAmount: '15%',
    endDate: '31 октября 2026',
    shortDescription: 'При заказе комплекта из духового шкафа с паром и индукционной панели Generation 7000 предоставляется персональная выгода до 15% и бесплатный шеф-монтаж.',
    fullDescription: `Официальная программа авторизованного партнера Miele в Нижнем Новгороде. 
Поколение техники Generation 7000 объединяет безупречную визуальную симметрию, интеллектуальное управление M Touch и уникальные технологии пара DualSteam и TasteControl.

При единовременном заказе от двух приборов серии Generation 7000 (духовой шкаф / комби-пароварка + варочная панель или вытяжка) салон «СИМОНА» предоставляет:
- Персональную выгоду до 15% на спецификацию приборов;
- Приоритетный бесплатный шеф-монтаж сертифицированными инженерами;
- Бесплатное ответственное хранение на складе до окончания ремонта;
- Вводный персональный мастер-класс на «Активной кухне» флагмана на ул. Белинского, 15.`,
    conditions: [
      'В акции участвуют приборы серий PureLine, VitroLine и ArtLine поколения Generation 7000.',
      'Минимальный комплект: 2 прибора крупной встраиваемой техники Miele.',
      'Предложение суммируется с бесплатным хранением на складе в Нижнем Новгороде.',
      'Официальная гарантия производителя 2 года с обслуживанием через салон СИМОНА.',
    ],
    bannerUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=85',
    participatingProductSlugs: [
      'miele-dgc-7860-obsidian-black',
      'miele-h-7464-bp-grafitschwarz',
      'miele-dgc-7440-compact-white',
    ],
    categoryNames: ['Духовые шкафы с паром', 'Варочные панели', 'Компактные приборы 45 см'],
    isFeatured: true,
  },
  {
    id: 'promo-asko-care',
    slug: 'asko-scandinavian-care-gift',
    brand: 'ASKO',
    brandCountry: 'Швеция',
    title: 'Скандинавская забота: фирменный комплект по уходу в подарок',
    subtitle: 'Серия Elements & Craft',
    badgeText: 'Подарок к заказу',
    benefitType: 'GIFT',
    discountAmount: 'Подарок',
    endDate: '15 ноября 2026',
    shortDescription: 'Эксклюзивный фирменный комплект профессиональных аксессуаров и средств по уходу ASKO в подарок при покупке парового духового шкафа или стирального комплекса.',
    fullDescription: `Шведский бренд ASKO славится минималистичным скандинавским дизайном, долговечной нержавеющей сталью и заботой о здоровье семьи.

При приобретении любого духового шкафа ASKO серий Elements или Craft в салоне «СИМОНА» вы получаете:
- Фирменный комплект гастроемкостей из пищевой нержавеющей стали для приготовления сувид и на пару;
- Набор профессиональных средств по декальцинации парогенератора;
- Демонстрацию программ шеф-поваром салона на «Активной кухне» ул. Белинского, 15.`,
    conditions: [
      'Предложение действует на все паровые и комбинированные духовые шкафы ASKO Elements и Craft.',
      'Подарочный набор выдается при передаче или доставке прибора.',
      'Количество подарочных комплектов ограничено складским резервом.',
    ],
    bannerUrl: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=1600&q=85',
    participatingProductSlugs: [
      'asko-op8664s-cleansteel',
      'asko-ocs8664s-combisteam',
    ],
    categoryNames: ['Паровые духовые шкафы', 'Уход за бельем'],
    isFeatured: true,
  },
  {
    id: 'promo-liebherr-warranty',
    slug: 'liebherr-grandcru-extended-warranty',
    brand: 'Liebherr',
    brandCountry: 'Германия',
    title: 'Продленная официальная гарантия 5 лет на винные шкафы',
    subtitle: 'Коллекция GrandCru Selection',
    badgeText: '5 лет гарантии',
    benefitType: 'EXTENDED_WARRANTY',
    discountAmount: '5 лет',
    endDate: '31 декабря 2026',
    shortDescription: 'Продленная 5-летняя гарантия от авторизованного партнера Liebherr и сервисный сертификат на климатические шкафы для хранения вин серии GrandCru.',
    fullDescription: `Liebherr — эталон точного холода и винной климатологии из Германии. 
Винные шкафы GrandCru оснащены компрессорами с нулевой вибрацией, фильтрами из активированного угля FreshAir и стеклами с тройной защитой от УФ-излучения.

При оформлении винного шкафа Liebherr в салоне «СИМОНА»:
- Предоставляется сертификат расширенной сервисной гарантии на 5 лет;
- Доставка «в белых перчатках» с подъемом на этаж и бережным заносом;
- Точная калибровка климатических зон сомелье салона.`,
    conditions: [
      'Распространяется на моно- и мультитемпературные винные шкафы Liebherr серии GrandCru и Vinidor.',
      'Обязательна регистрация серийного номера в авторизованной сервисной службе СИМОНА.',
    ],
    bannerUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1600&q=85',
    participatingProductSlugs: [],
    categoryNames: ['Винные шкафы', 'Холодильники'],
    isFeatured: true,
  },
  {
    id: 'promo-smeg-duet',
    slug: 'smeg-design-duet-benefit',
    brand: 'SMEG',
    brandCountry: 'Италия',
    title: 'Дизайнерский дуэт: выгода 20% на малую технику 50’s Style',
    subtitle: 'Итальянская эстетика на вашей кухне',
    badgeText: 'Скидка 20%',
    benefitType: 'DISCOUNT',
    discountAmount: '20%',
    endDate: '20 ноября 2026',
    shortDescription: 'Скидка 20% на чайники, тостеры и кофемашины культовой серии 50’s Style при заказе крупной встраиваемой техники Dolce Stil Novo или Linea.',
    fullDescription: `Дом SMEG превращает бытовую технику в арт-объекты. Сочетание строгой архитектурной встройки Dolce Stil Novo с ретро-акцентами 50’s Style создает неповторимый авторский интерьер.

При покупке духового шкафа или варочной панели SMEG в салоне «СИМОНА» вы получаете право на скидку 20% на любой малый прибор из коллекции 50’s Style на ваш выбор (включая лимитированные цвета).`,
    conditions: [
      'Участвует встраиваемая техника серий Dolce Stil Novo, Linea, Victoria, Coloniale.',
      'Скидка 20% применяется к одному малому прибору 50’s Style на каждый крупный прибор в чеке.',
    ],
    bannerUrl: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1600&q=85',
    participatingProductSlugs: [
      'smeg-sf6604vcne-nero',
    ],
    categoryNames: ['Духовые шкафы', 'Малая бытовая техника'],
    isFeatured: true,
  },
  {
    id: 'promo-omoikiri-washing-zone',
    slug: 'omoikiri-washing-zone-set',
    brand: 'OMOIKIRI & KÖRTING',
    brandCountry: 'Япония / Германия',
    title: 'Комплексное оснащение моечной зоны: выгода 15% на трио',
    subtitle: 'Фирменный салон на Белинского, 11/66',
    badgeText: 'Выгода 15%',
    benefitType: 'DISCOUNT',
    discountAmount: '15%',
    endDate: '10 декабря 2026',
    shortDescription: 'Скидка 15% на комплект из гранитной или стальной мойки Omoikiri, смесителя 2-в-1 с подключением фильтра и индукционного измельчителя отходов.',
    fullDescription: `Японская культура организации пространства у кухонной раковины Omoikiri: мойки из запатентованного композита Artgranit и Tetogranit, смесители со скрытой подачей фильтрованной воды и мощные тихие измельчители пищевых отходов Nagare.

Специальная программа фирменного монобрендового пространства OMOIKIRI & KÖRTING (ул. Белинского, 11/66):
- Выгода 15% на комплект «Мойка + Смеситель + Измельчитель»;
- Фирменный дозатор для жидкого мыла в тон мойки в подарок;
- Монтажные шаблоны и консультация по выводам коммуникаций под ключ.`,
    conditions: [
      'Действует в монобрендовом салоне Белинского, 11/66 и при заказе на сайте.',
      'Комплект должен включать: мойку Omoikiri, смеситель Omoikiri и измельчитель отходов.',
    ],
    bannerUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1600&q=85',
    participatingProductSlugs: [
      'korting-okb-9102-cs-gb',
    ],
    categoryNames: ['Мойки и смесители', 'Измельчители отходов'],
    isFeatured: true,
  },
  {
    id: 'promo-falmec-filter',
    slug: 'falmec-carbon-zeo-gift',
    brand: 'Falmec',
    brandCountry: 'Италия',
    title: 'Тишина и свежесть: премиум-фильтр Carbon.Zeo в подарок',
    subtitle: 'Инновационные вытяжки Circle.Tech',
    badgeText: 'Подарок к вытяжке',
    benefitType: 'GIFT',
    discountAmount: 'Подарок',
    endDate: '30 ноября 2026',
    shortDescription: 'Регенерируемый комбинированный фильтр с активированным углем и цеолитом Carbon.Zeo в подарок при заказе вытяжки Falmec серии Circle.Tech.',
    fullDescription: `Итальянская фабрика Falmec переосмыслила вытяжные системы. Технология Circle.Tech объединяет очистку воздуха и аспирацию в компактном горизонтальном корпусе с ультранизким уровнем шума.

При заказе островной или пристенной вытяжки Falmec Circle.Tech салон «СИМОНА» дарит дополнительный сертифицированный фильтр Carbon.Zeo со сроком службы до 5 лет с возможностью регенерации в духовке.`,
    conditions: [
      'В акции участвуют модели Sophie, Dama, Loop, Materia, Spazio серии Circle.Tech.',
      'Гарантия тихой работы и монтаж сертифицированными инженерами СИМОНА.',
    ],
    bannerUrl: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=1600&q=85',
    participatingProductSlugs: [],
    categoryNames: ['Вытяжки', 'Тихая аспирация'],
    isFeatured: true,
  },
];

export function getFeaturedPromos(): ManufacturerPromo[] {
  return MANUFACTURER_PROMOS.filter((p) => p.isFeatured);
}

export function getPromoBySlug(slug: string): ManufacturerPromo | undefined {
  return MANUFACTURER_PROMOS.find((p) => p.slug === slug);
}

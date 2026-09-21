import { ProductItem } from '@/types';

export interface SubCategoryTag {
  id: string;
  name: string;
  filterFn: (product: ProductItem) => boolean;
}

export const CATALOG_SUBCATEGORIES: SubCategoryTag[] = [
  { id: 'all', name: 'Все модели', filterFn: () => true },
  { id: 'steam', name: 'С функцией пара', filterFn: (p) => p.name.toLowerCase().includes('пар') || p.category.toLowerCase().includes('пар') || Boolean(p.description && p.description.toLowerCase().includes('пар')) },
  { id: 'microwave', name: 'С СВЧ', filterFn: (p) => p.name.toLowerCase().includes('свч') || (p.shortDesc ? p.shortDesc.toLowerCase().includes('свч') : false) },
  { id: 'compact-45', name: 'Компактные 45 см', filterFn: (p) => Boolean(p.dimensions && p.dimensions.includes('45')) || p.name.includes('45') },
  { id: 'standard-60', name: 'Стандартные 60 см', filterFn: (p) => Boolean(p.dimensions && (p.dimensions.includes('60') || p.dimensions.includes('595'))) || p.name.includes('60') },
  { id: 'wide-90', name: 'Широкие 90 см', filterFn: (p) => Boolean(p.dimensions && p.dimensions.includes('90')) || p.name.includes('90') },
  { id: 'pyrolysis', name: 'Пиролитическая очистка', filterFn: (p) => Boolean(p.description && p.description.toLowerCase().includes('пиролиз')) || Boolean(p.shortDesc && p.shortDesc.toLowerCase().includes('пиролиз')) },
];

export const CATALOG_PRODUCTS: ProductItem[] = [
  // 1. Miele DGC 7860 Obsidian Black (Flagship reference from Figma Make)
  {
    id: 'prod-figma-1',
    sku: 'DGC 7860',
    name: 'Комбинированный духовой шкаф с паром Miele DGC 7860 Obsidian Black',
    slug: 'miele-dgc-7860-obsidian-black',
    brand: 'Miele',
    category: 'Духовой шкаф с паром',
    categoryType: 'CATEGORY_B',
    physicalStatus: 'SHOWROOM',
    price: 489900,
    oldPrice: 539000,
    inStock: true,
    stockCount: 1,
    rating: 4.9,
    reviewsCount: 28,
    shortDesc: '60 см • 68 л • Пар + СВЧ + Пиролиз • M Touch • Wi-Fi',
    description: 'Флагманский комбинированный духовой шкаф Miele Generation 7000 с внешним парогенератором DualSteam, встроенной HD-камерой FoodView в рабочей камере и пиролитической самоочисткой. Представлен в экспозиции флагманского салона СИМОНА на ул. Белинского, 15.',
    dimensions: '596 × 595 × 568 мм (ниша 590-595 × 560-568 × 550 мм)',
    schematicPdfUrl: '/schematics/miele-dgc7860.pdf',
    schematicDwgUrl: '/schematics/miele-dgc7860.dwg',
    manualUrl: '/manuals/miele-dgc7860-ru.pdf',
    images: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
    ],
    badge: 'На витрине',
    isFeatured: true,
    promoSlugs: ['miele-generation-7000-benefit'],
    colors: [
      { id: 'obsidian', name: 'Obsidian Black (Черный обсидиан)', colorHex: '#0E0F12', isAvailable: true },
      { id: 'cleansteel', name: 'CleanSteel (Нержавеющая сталь)', colorHex: '#9BA1A6', isAvailable: true },
      { id: 'graphite', name: 'Graphite Grey (Графит)', colorHex: '#3E3D40', isAvailable: true },
    ],
    technologies: [
      {
        title: 'DualSteam: Точная подача пара',
        subtitle: 'Внешний парогенератор',
        description: 'Равномерное распределение пара за 40 секунд, сохранение клеточной структуры и микроэлементов продуктов на уровне ресторанной гастрономии.',
        imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
      },
      {
        title: 'Встроенная HD-камера FoodView',
        subtitle: 'Интеллектуальный контроль',
        description: 'Визуальный контроль процесса приготовления в рабочей камере в режиме реального времени через мобильное приложение Miele@mobile.',
        imageUrl: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=800&q=80',
      },
      {
        title: 'Пиролиз и покрытие PerfectClean',
        subtitle: 'Безупречная самоочистка',
        description: 'Термолиз любых загрязнений при 480°C и запатентованная антипригарная эмаль PerfectClean. Уборка сводится к протиранию влажной салфеткой.',
        imageUrl: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80',
      },
    ],
    specGroups: [
      {
        groupName: 'Габариты и конструкция',
        items: [
          { label: 'Тип монтажа', value: 'Встраиваемый в колонну или под столешницу' },
          { label: 'Габариты прибора (ВхШхГ)', value: '596 × 595 × 568 мм' },
          { label: 'Размеры ниши для встройки', value: '590-595 × 560-568 × 550 мм' },
          { label: 'Полезный объем рабочей камеры', value: '68 литров' },
          { label: 'Количество уровней установки', value: '4 с направляющими FlexiClip' },
          { label: 'Масса нетто', value: '46.4 кг' },
        ],
      },
      {
        groupName: 'Функции и подключение',
        items: [
          { label: 'Диапазон температур', value: '30°C – 250°C' },
          { label: 'Режимы приготовления', value: '24 автопрограммы, СВЧ, конвекция + пар' },
          { label: 'Мощность подключения', value: '3.5 кВт (220-240 В, 16 А)' },
          { label: 'Тип управления', value: 'Сенсорный цветной дисплей M Touch' },
          { label: 'Сетевые возможности', value: 'Wi-Fi (Miele@home)' },
          { label: 'Страна производства', value: 'Германия' },
        ],
      },
    ],
    expertVerdict: {
      expertName: 'Михаил Семенов',
      expertRole: 'Ведущий технический специалист салона «СИМОНА»',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      title: 'Прецизионная инженерия пара Miele',
      quote: 'DGC 7860 — один из самых сбалансированных комби-приборов в линейке Generation 7000. Внешний парогенератор DualSteam полностью исключает образование накипи внутри рабочей камеры, а точность беспроводного термощупа до 1 градуса позволяет готовить сложные ресторанные блюда без риска температурной ошибки.',
      scores: [
        { label: 'Качество сборки', score: 5.0 },
        { label: 'Точность датчиков', score: 5.0 },
        { label: 'Надежность узлов', score: 4.9 },
      ],
    },
    reviews: [
      {
        id: 'rev-1',
        author: 'Елена В.',
        verifiedPurchase: true,
        location: 'ЖК «Дворянский», Нижний Новгород',
        rating: 5,
        date: '14 февраля 2026',
        text: 'Установили в колонну вместе с кофемашиной Miele в ЖК «Дворянский». Черное стекло Obsidian выглядит монолитно. Функция пара великолепно раскрывает домашнюю выпечку и деликатную рыбу.',
        photos: [
          'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=500&q=80',
          'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=500&q=80',
        ],
      },
      {
        id: 'rev-2',
        author: 'Михаил К.',
        verifiedPurchase: true,
        location: 'Архитектурное бюро «Среда»',
        rating: 5,
        date: '28 января 2026',
        text: 'Регулярно закладываю эту модель в проекты для частных заказчиков. Безупречная геометрия встройки вровень с фасадами кухонь, а инженеры СИМОНЫ подключили и откалибровали все день в день.',
      },
    ],
  },

  // 2. ASKO OP8664S CleanSteel (Exact from Figma)
  {
    id: 'prod-figma-2',
    sku: 'OP8664S',
    name: 'ASKO OP8664S CleanSteel',
    slug: 'asko-op8664s-cleansteel',
    brand: 'ASKO',
    category: 'Паровой духовой шкаф',
    categoryType: 'CATEGORY_B',
    physicalStatus: 'SHOWROOM',
    price: 312000,
    oldPrice: null,
    inStock: true,
    stockCount: 2,
    shortDesc: '60 см • 72 л • Пар • Гриль • SteelTouch',
    description: 'Паровой шкаф ASKO премиальной серии Elements. Сенсорный дисплей SteelTouch, чистый пар PureSteam и пиролитическая самоочистка. Выставлен в экспозиции салона СИМОНА на ул. Белинского, 15.',
    dimensions: '595 × 595 × 546 мм (60 см)',
    schematicPdfUrl: '/schematics/asko-op8664s.pdf',
    images: [
      'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=1000&q=80',
    ],
    badge: 'На витрине',
    isFeatured: true,
  },

  // 3. Bertazzoni F6011MODVTNE Nero (Exact from Figma)
  {
    id: 'prod-figma-3',
    sku: 'F6011MODVTNE',
    name: 'Bertazzoni F6011MODVTNE Nero',
    slug: 'bertazzoni-f6011modvtne-nero',
    brand: 'Bertazzoni',
    category: 'Многофункциональный шкаф',
    categoryType: 'CATEGORY_B',
    physicalStatus: 'LOCAL_STOCK',
    price: 274500,
    oldPrice: 298000,
    inStock: true,
    stockCount: 5,
    shortDesc: '60 см • 76 л • 11 режимов • Пиролиз',
    description: 'Итальянский шедевр Modern Series в матовом черном исполнении Nero. 11 профессиональных режимов приготовления, телескопические направляющие и пиролиз. В наличии на складе в Нижнем Новгороде.',
    dimensions: '592 × 598 × 550 мм (60 см)',
    schematicPdfUrl: '/schematics/bertazzoni-f6011.pdf',
    images: [
      'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=1000&q=80',
    ],
    badge: 'На складе',
    isFeatured: false,
  },

  // 4. Miele H 7464 BP Grafitschwarz (Exact from Figma)
  {
    id: 'prod-figma-4',
    sku: 'H 7464 BP',
    name: 'Miele H 7464 BP Grafitschwarz',
    slug: 'miele-h-7464-bp-grafitschwarz',
    brand: 'Miele',
    category: 'Духовой шкаф',
    categoryType: 'CATEGORY_B',
    physicalStatus: 'SHOWROOM',
    price: 389900,
    oldPrice: null,
    inStock: true,
    stockCount: 2,
    shortDesc: '60 см • 76 л • Пиролиз • DirectSensor',
    description: 'Духовой шкаф Miele в эксклюзивном оттенке «Графитовый серый» без ручки (Touch2Open). Пиролиз, автоматические программы и термощуп. Доступен для визуальной оценки в салоне на Белинского, 15.',
    dimensions: '596 × 595 × 569 мм (60 см)',
    schematicPdfUrl: '/schematics/miele-h7464.pdf',
    images: [
      'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=1000&q=80',
    ],
    badge: 'На витрине',
    isFeatured: true,
    promoSlugs: ['miele-generation-7000-benefit'],
  },

  // 5. SMEG SF6604VCNE Nero (Exact from Figma)
  {
    id: 'prod-figma-5',
    sku: 'SF6604VCNE',
    name: 'SMEG SF6604VCNE Nero',
    slug: 'smeg-sf6604vcne-nero',
    brand: 'SMEG',
    category: 'Паровой комби-шкаф',
    categoryType: 'CATEGORY_B',
    physicalStatus: 'REMOTE_STOCK',
    price: 258000,
    oldPrice: 279000,
    inStock: true,
    stockCount: 1,
    shortDesc: '60 см • 70 л • Пар + СВЧ • Пиролиз',
    description: 'Премиальная линия Dolce Stil Novo от итальянского дома SMEG. Медное или черное обрамление Eclipse Glass, комбинированные режимы пара и микроволн. Поставка с центрального склада в РФ.',
    dimensions: '592 × 597 × 548 мм (60 см)',
    schematicPdfUrl: '/schematics/smeg-sf6604.pdf',
    images: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=80',
    ],
    badge: 'На удаленном складе',
    isFeatured: true,
    promoSlugs: ['smeg-design-duet-benefit'],
  },

  // 6. ASKO OCS8664S CombiSteam (Exact from Figma)
  {
    id: 'prod-figma-6',
    sku: 'OCS8664S',
    name: 'ASKO OCS8664S CombiSteam',
    slug: 'asko-ocs8664s-combisteam',
    brand: 'ASKO',
    category: 'Паровой духовой шкаф',
    categoryType: 'CATEGORY_B',
    physicalStatus: 'ON_ORDER',
    price: 341000,
    oldPrice: null,
    inStock: true,
    stockCount: 4,
    shortDesc: '60 см • 72 л • Пар • СВЧ • Wi-Fi',
    description: 'Многофункциональный паровой шкаф ASKO серии Craft со скандинавским стальным фасадом. Режим приготовления сувид и автоматическая система подачи пара. Поставка под заказ со склада фабрики.',
    dimensions: '595 × 595 × 546 мм (60 см)',
    schematicPdfUrl: '/schematics/asko-ocs8664s.pdf',
    images: [
      'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=1000&q=80',
    ],
    badge: 'Под заказ',
    isFeatured: false,
    promoSlugs: ['asko-scandinavian-care-gift'],
  },

  // 7. Miele DGC 7440 Compact 45 cm (Compact model)
  {
    id: 'prod-7',
    sku: 'DGC 7440',
    name: 'Miele DGC 7440 Compact Brilliant White',
    slug: 'miele-dgc-7440-compact-white',
    brand: 'Miele',
    category: 'Компактный паровой шкаф',
    categoryType: 'CATEGORY_B',
    physicalStatus: 'SHOWROOM',
    price: 395000,
    oldPrice: 425000,
    inStock: true,
    stockCount: 1,
    shortDesc: '45 см • 48 л • Пар DualSteam • DirectSensor',
    description: 'Компактная комби-пароварка 45 см в белоснежном стекле Brilliant White. Идеальна для установки в кухонную колонну парой с кофемашиной. В экспозиции на Белинского, 15.',
    dimensions: '455 × 595 × 568 мм (45 см)',
    schematicPdfUrl: '/schematics/miele-dgc7440.pdf',
    images: [
      'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=1000&q=80',
    ],
    badge: 'На витрине',
    isFeatured: true,
    promoSlugs: ['miele-generation-7000-benefit'],
  },

  // 8. Bertazzoni F90PRO1XT 90 cm (Wide 90 cm model)
  {
    id: 'prod-8',
    sku: 'F90PRO1XT',
    name: 'Bertazzoni Professional F90PRO1XT Stainless Steel',
    slug: 'bertazzoni-f90pro1xt-90cm',
    brand: 'Bertazzoni',
    category: 'Широкий духовой шкаф 90 см',
    categoryType: 'CATEGORY_B',
    physicalStatus: 'REMOTE_STOCK',
    price: 498000,
    oldPrice: null,
    inStock: true,
    stockCount: 2,
    shortDesc: '90 см • 100 л • 11 функций • Двойной конвектор',
    description: 'Профессиональный духовой шкаф увеличенной ширины 90 см из аутентичной нержавеющей стали. Позволяет готовить крупную дичь и выпекать одновременно на нескольких уровнях. Центральный склад.',
    dimensions: '595 × 895 × 570 мм (90 см)',
    schematicPdfUrl: '/schematics/bertazzoni-f90.pdf',
    images: [
      'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=1000&q=80',
    ],
    badge: 'На удаленном складе',
    isFeatured: false,
  },

  // 9. OMOIKIRI & KÖRTING 11/66 Showroom model
  {
    id: 'prod-9',
    sku: 'OKB 9102 CS GB',
    name: 'KÖRTING OKB 9102 CS GB Steam SteamPro',
    slug: 'korting-okb-9102-cs-gb',
    brand: 'Omoikiri',
    category: 'Духовой шкаф с паром',
    categoryType: 'CATEGORY_B',
    physicalStatus: 'LOCAL_STOCK',
    price: 189900,
    oldPrice: 215000,
    inStock: true,
    stockCount: 2,
    shortDesc: '60 см • 72 л • Парогенератор SteamPro • Сенсор',
    description: 'Духовой шкаф с функцией пара и термощупом. В наличии на нижегородском складе СИМОНА.',
    dimensions: '595 × 595 × 565 мм (60 см)',
    schematicPdfUrl: '/schematics/korting-okb9102.pdf',
    images: [
      'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=1000&q=80',
    ],
    badge: 'На складе',
    isFeatured: true,
    promoSlugs: ['omoikiri-washing-zone-set'],
  },

];

export interface BundleItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  isMain?: boolean;
}

export interface AccessoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  badge?: string;
}

export const MIELE_SUITE_BUNDLE: BundleItem[] = [
  {
    id: 'bundle-oven',
    sku: 'DGC 7860',
    name: 'Духовой шкаф с паром Miele DGC 7860 Obsidian Black',
    category: 'Духовой шкаф',
    price: 489900,
    imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
    isMain: true,
  },
  {
    id: 'bundle-coffee',
    sku: 'CVA 7845',
    name: 'Встраиваемая кофемашина Miele CVA 7845 Obsidian Black',
    category: 'Кофемашина',
    price: 429900,
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    isMain: false,
  },
  {
    id: 'bundle-drawer',
    sku: 'ESW 7010',
    name: 'Подогреватель посуды Miele ESW 7010 Obsidian Black',
    category: 'Подогреватель посуды',
    price: 149900,
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
    isMain: false,
  },
];

export const MIELE_CARE_ACCESSORIES: AccessoryItem[] = [
  {
    id: 'acc-1',
    sku: 'HFC 70',
    name: 'Противень с покрытием PerfectClean',
    category: 'Оригинальный аксессуар',
    price: 18900,
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80',
    badge: 'Рекомендация Miele',
  },
  {
    id: 'acc-2',
    sku: 'Wireless Probe',
    name: 'Беспроводной пищевой термощуп Miele',
    category: 'Высокоточный датчик',
    price: 14200,
    imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'acc-3',
    sku: 'Descaling Tabs',
    name: 'Таблетки от накипи для пароварок Miele',
    category: 'Фирменная химия',
    price: 3490,
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80',
    badge: 'Хит продаж',
  },
  {
    id: 'acc-4',
    sku: 'DGClean',
    name: 'Очиститель рабочей камеры DGClean Miele',
    category: 'Фирменный уход',
    price: 2890,
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80',
  },
];


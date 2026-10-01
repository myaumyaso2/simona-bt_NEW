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

  // --- Топ-SKU сентябрьских акций европейских производителей (UMI.CMS) ---
  {
    "id": "prod-umi-611664",
    "sku": "KWO 0010-PR2",
    "name": "KWO 0010-PR2 Штопор электрический",
    "slug": "kwo_0010-pr2_shtopor_elektricheskij",
    "brand": "Körting",
    "category": "KORTING",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 1990,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "KWO 0010-PR2 Штопор электрический",
    "description": "Официальная техника Körting в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/90619.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "korting-pokupka-eto-podarok1"
    ]
  },

  {
    "id": "prod-umi-611228",
    "sku": "KHB 0317 W Tulip",
    "name": "KHB 0317 W Tulip Блендер погружной",
    "slug": "khb_0317_w_tulip_blender_pogruzhnoj",
    "brand": "Körting",
    "category": "KORTING",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 6490,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "KHB 0317 W Tulip Блендер погружной",
    "description": "Официальная техника Körting в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/90163.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "korting-pokupka-eto-podarok1"
    ]
  },

  {
    "id": "prod-umi-609608",
    "sku": "KGPA 0403 W Infinity",
    "name": "KGPA 0403 W Infinity Электрический гриль",
    "slug": "kgpa_0403_w_infinity_elektricheskij_gril",
    "brand": "Körting",
    "category": "KORTING",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 13990,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "KGPA 0403 W Infinity Электрический гриль",
    "description": "Официальная техника Körting в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/88714.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "korting-pokupka-eto-podarok1"
    ]
  },

  {
    "id": "prod-umi-612992",
    "sku": "KFD 2403 Pro S",
    "name": "KFD 2403 Pro S Сушилка для продуктов",
    "slug": "kfd_2403_pro_s_sushilka_dlya_produktov",
    "brand": "Körting",
    "category": "KORTING",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 25990,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "KFD 2403 Pro S Сушилка для продуктов",
    "description": "Официальная техника Körting в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/91928.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "korting-pokupka-eto-podarok1"
    ]
  },

  {
    "id": "prod-umi-590205",
    "sku": "KIT0160040",
    "name": "KIT0160040 Подставка для WOK",
    "slug": "podstavka_dlya_wok_kit0160040",
    "brand": "SMEG",
    "category": "SMEG",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 6290,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "KIT0160040 Подставка для WOK",
    "description": "Официальная техника SMEG в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/76905.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "akciya-ot-smeg-skidka-20-na-komplekt-bytovoj-tehniki",
      "smeg-skidka-stiralnye-sushilnye-mashiny-2026"
    ]
  },

  {
    "id": "prod-umi-579393",
    "sku": "LGCN",
    "name": "LGCN Соединительная планка",
    "slug": "lgcn_soedinitel_naya_planka",
    "brand": "SMEG",
    "category": "SMEG",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 9290,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "LGCN Соединительная планка",
    "description": "Официальная техника SMEG в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/69273.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "akciya-ot-smeg-skidka-20-na-komplekt-bytovoj-tehniki",
      "smeg-skidka-stiralnye-sushilnye-mashiny-2026"
    ]
  },

  {
    "id": "prod-umi-580457",
    "sku": "WOKGHU",
    "name": "WOKGHU Кольцо WOK из чугуна",
    "slug": "wokghu_kol_co_wok_iz_chuguna",
    "brand": "SMEG",
    "category": "SMEG",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 6990,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "WOKGHU Кольцо WOK из чугуна",
    "description": "Официальная техника SMEG в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/10244.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "akciya-ot-smeg-skidka-20-na-komplekt-bytovoj-tehniki",
      "smeg-skidka-stiralnye-sushilnye-mashiny-2026"
    ]
  },

  {
    "id": "prod-umi-592084",
    "sku": "6MP800P",
    "name": "6MP800P Набор ручек",
    "slug": "6mp800p_nabor_ruchek",
    "brand": "SMEG",
    "category": "SMEG",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 5290,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "6MP800P Набор ручек",
    "description": "Официальная техника SMEG в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/15766.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "akciya-ot-smeg-skidka-20-na-komplekt-bytovoj-tehniki",
      "smeg-skidka-stiralnye-sushilnye-mashiny-2026"
    ]
  },

  {
    "id": "prod-umi-592085",
    "sku": "6MP1PGF",
    "name": "6MP1PGF Набор из 6 ручек для варочных панелей",
    "slug": "6mp_1pgf_nabor_iz_6_ruchek_dlya_varochnyh_panelej",
    "brand": "SMEG",
    "category": "SMEG",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 5290,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "6MP1PGF Набор из 6 ручек для варочных панелей",
    "description": "Официальная техника SMEG в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/64975.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "akciya-ot-smeg-skidka-20-na-komplekt-bytovoj-tehniki",
      "smeg-skidka-stiralnye-sushilnye-mashiny-2026"
    ]
  },

  {
    "id": "prod-umi-592089",
    "sku": "5MP700AO",
    "name": "5MP 700AO Набор из 5 ручек для варочных панелей",
    "slug": "5mp_700ao_nabor_iz_5_ruchek_dlya_varochnyh_panelej",
    "brand": "SMEG",
    "category": "SMEG",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 9290,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "5MP 700AO Набор из 5 ручек для варочных панелей",
    "description": "Официальная техника SMEG в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/64971.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "akciya-ot-smeg-skidka-20-na-komplekt-bytovoj-tehniki",
      "smeg-skidka-stiralnye-sushilnye-mashiny-2026"
    ]
  },

  {
    "id": "prod-umi-603815",
    "sku": "KFW 803 DB GN",
    "name": "KFW 803 DB GN Холодильный шкаф для вина",
    "slug": "kfw_803_db_gn_holodil_nyj_shkaf_dlya_vina",
    "brand": "Körting",
    "category": "KORTING",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 123990,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "KFW 803 DB GN Холодильный шкаф для вина",
    "description": "Официальная техника Körting в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/85048.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "korting-ckidka-pri-pokupke-komplekta"
    ]
  },

  {
    "id": "prod-umi-603809",
    "sku": "KFW 604 DB GN",
    "name": "KFW 604 DB GN Холодильный шкаф для вина",
    "slug": "kfw_604_db_gn_holodil_nyj_shkaf_dlya_vina",
    "brand": "Körting",
    "category": "KORTING",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 111490,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "KFW 604 DB GN Холодильный шкаф для вина",
    "description": "Официальная техника Körting в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/85046.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "korting-ckidka-pri-pokupke-komplekta"
    ]
  },

  {
    "id": "prod-umi-603804",
    "sku": "KFW 604 DB GXN",
    "name": "KFW 604 DB GXN Холодильный шкаф для вина",
    "slug": "kfw_604_db_gxn_holodil_nyj_shkaf_dlya_vina",
    "brand": "Körting",
    "category": "KORTING",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 111490,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "KFW 604 DB GXN Холодильный шкаф для вина",
    "description": "Официальная техника Körting в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/85047.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "korting-ckidka-pri-pokupke-komplekta"
    ]
  },

  {
    "id": "prod-umi-603799",
    "sku": "KFW 501 SL GXN",
    "name": "KFW 501 SL GXN Холодильный шкаф для вина",
    "slug": "kfw_501_sl_gxn_holodil_nyj_shkaf_dlya_vina",
    "brand": "Körting",
    "category": "KORTING",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 100490,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "KFW 501 SL GXN Холодильный шкаф для вина",
    "description": "Официальная техника Körting в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/85045.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "korting-ckidka-pri-pokupke-komplekta"
    ]
  },

  {
    "id": "prod-umi-603790",
    "sku": "KFW 501 SL GN",
    "name": "KFW 501 SL GN Холодильный шкаф для вина",
    "slug": "kfw_501_sl_gn_holodil_nyj_shkaf_dlya_vina",
    "brand": "Körting",
    "category": "KORTING",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 100490,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "KFW 501 SL GN Холодильный шкаф для вина",
    "description": "Официальная техника Körting в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/85044.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "korting-ckidka-pri-pokupke-komplekta"
    ]
  },

  {
    "id": "prod-umi-597282",
    "sku": "DSK 150",
    "name": "DSK 150 Соединительный элемент",
    "slug": "dsk_150_soedinitel_nyj_element",
    "brand": "Körting",
    "category": "KORTING",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 18990,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "DSK 150 Соединительный элемент",
    "description": "Официальная техника Körting в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/79016.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "korting-ckidka-pri-pokupke-komplekta"
    ]
  },

  {
    "id": "prod-umi-604501",
    "sku": "BD 4500",
    "name": "BD 4500 Посудомоечная машина",
    "slug": "bd_4500_posudomoechnaya_mashina",
    "brand": "Evelux",
    "category": "EVELUX",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 26690,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "BD 4500 Посудомоечная машина",
    "description": "Официальная техника Evelux в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/85617.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "evelux-skidki-pri-pokupke-komplekta",
      "evelux-34"
    ]
  },

  {
    "id": "prod-umi-604482",
    "sku": "BD 6000",
    "name": "BD 6000 Посудомоечная машина",
    "slug": "bd_6000_posudomoechnaya_mashina",
    "brand": "Evelux",
    "category": "EVELUX",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 26990,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "BD 6000 Посудомоечная машина",
    "description": "Официальная техника Evelux в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/85619.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "evelux-skidki-pri-pokupke-komplekta",
      "evelux-34"
    ]
  },

  {
    "id": "prod-umi-604479",
    "sku": "BD 6002",
    "name": "BD 6002 Посудомоечная машина",
    "slug": "bd_6002_posudomoechnaya_mashina",
    "brand": "Evelux",
    "category": "EVELUX",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 30600,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "BD 6002 Посудомоечная машина",
    "description": "Официальная техника Evelux в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/85620.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "evelux-skidki-pri-pokupke-komplekta",
      "evelux-34"
    ]
  },

  {
    "id": "prod-umi-604477",
    "sku": "BD 4502",
    "name": "BD 4502 Посудомоечная машина",
    "slug": "bd_4502_posudomoechnaya_mashina",
    "brand": "Evelux",
    "category": "EVELUX",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 33990,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "BD 4502 Посудомоечная машина",
    "description": "Официальная техника Evelux в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/85618.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "evelux-skidki-pri-pokupke-komplekta",
      "evelux-34"
    ]
  },

  {
    "id": "prod-umi-604775",
    "sku": "BD 4503",
    "name": "BD 4503 Посудомоечная машина FIX",
    "slug": "bd_4503_posudomoechnaya_mashina_fix",
    "brand": "Evelux",
    "category": "EVELUX",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 50190,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "BD 4503 Посудомоечная машина FIX",
    "description": "Официальная техника Evelux в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/85890.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "evelux-skidki-pri-pokupke-komplekta",
      "evelux-34"
    ]
  },

  {
    "id": "prod-umi-604783",
    "sku": "BD 4501",
    "name": "BD 4501 Посудомоечная машина FIX",
    "slug": "bd_4501_posudomoechnaya_mashina_fix",
    "brand": "Evelux",
    "category": "EVELUX",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 45290,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "BD 4501 Посудомоечная машина FIX",
    "description": "Официальная техника Evelux в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/85889.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "evelux-skidki-pri-pokupke-komplekta",
      "evelux-34"
    ]
  },

  {
    "id": "prod-umi-610073",
    "sku": "VOE 684G",
    "name": "VOE 684G Духовой шкаф",
    "slug": "voe_684g_duhovoj_shkaf",
    "brand": "VARD",
    "category": "VARD",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 104990,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "VOE 684G Духовой шкаф",
    "description": "Официальная техника VARD в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/89058.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "vard-skidki-pri-pokupke-komplekta",
      "vard-vygoda-15-populyarnye-modeli-2026"
    ]
  },

  {
    "id": "prod-umi-610072",
    "sku": "VPE 681MB",
    "name": "VPE 681MB Духовой шкаф",
    "slug": "vpe_681mb_duhovoj_shkaf",
    "brand": "VARD",
    "category": "VARD",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 145990,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "VPE 681MB Духовой шкаф",
    "description": "Официальная техника VARD в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/89065.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "vard-skidki-pri-pokupke-komplekta",
      "vard-vygoda-15-populyarnye-modeli-2026"
    ]
  },

  {
    "id": "prod-umi-610071",
    "sku": "VOC 444HB",
    "name": "VOC 444HB Духовой шкаф",
    "slug": "voc_444hb_duhovoj_shkaf",
    "brand": "VARD",
    "category": "VARD",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 41490,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "VOC 444HB Духовой шкаф",
    "description": "Официальная техника VARD в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/89062.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "vard-skidki-pri-pokupke-komplekta",
      "vard-vygoda-15-populyarnye-modeli-2026"
    ]
  },

  {
    "id": "prod-umi-610070",
    "sku": "VOS 684SG",
    "name": "VOS 684SG Духовой шкаф",
    "slug": "vos_684sg_duhovoj_shkaf",
    "brand": "VARD",
    "category": "VARD",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 143990,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "VOS 684SG Духовой шкаф",
    "description": "Официальная техника VARD в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/89054.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "vard-skidki-pri-pokupke-komplekta",
      "vard-vygoda-15-populyarnye-modeli-2026"
    ]
  },

  {
    "id": "prod-umi-610069",
    "sku": "VOP 682G",
    "name": "VOP 682G Духовой шкаф",
    "slug": "vop_682g_duhovoj_shkaf",
    "brand": "VARD",
    "category": "VARD",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 119990,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "VOP 682G Духовой шкаф",
    "description": "Официальная техника VARD в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/89056.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "vard-skidki-pri-pokupke-komplekta",
      "vard-vygoda-15-populyarnye-modeli-2026"
    ]
  },

  {
    "id": "prod-umi-610067",
    "sku": "VPS 681MG",
    "name": "VPS 681MG Духовой шкаф",
    "slug": "vps_681mg_duhovoj_shkaf",
    "brand": "VARD",
    "category": "VARD",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 159990,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "VPS 681MG Духовой шкаф",
    "description": "Официальная техника VARD в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/89068.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "vard-skidki-pri-pokupke-komplekta",
      "vard-vygoda-15-populyarnye-modeli-2026"
    ]
  },

  {
    "id": "prod-umi-603664",
    "sku": "VHI 9552K",
    "name": "VHI 9552K Варочная панель",
    "slug": "vhi_9552k_varochnaya_panel",
    "brand": "VARD",
    "category": "VARD",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 59990,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "VHI 9552K Варочная панель",
    "description": "Официальная техника VARD в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/84899.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "vard-gril-plancha"
    ]
  },

  {
    "id": "prod-umi-603641",
    "sku": "VHI 6461K",
    "name": "VHI 6461K Варочная панель",
    "slug": "vhi_6461k_varochnaya_panel",
    "brand": "VARD",
    "category": "VARD",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 42490,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "VHI 6461K Варочная панель",
    "description": "Официальная техника VARD в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/84898.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "vard-gril-plancha"
    ]
  },

  {
    "id": "prod-umi-604764",
    "sku": "VHI 6461X",
    "name": "VHI 6461X Варочная панель",
    "slug": "vhi_6461x_varochnaya_panel",
    "brand": "VARD",
    "category": "VARD",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 37490,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "VHI 6461X Варочная панель",
    "description": "Официальная техника VARD в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/85829.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "vard-gril-plancha"
    ]
  },

  {
    "id": "prod-umi-610839",
    "sku": "VHH 8462B",
    "name": "VHH 8462B Варочная панель с вытяжкой",
    "slug": "vhh_8462b_varochnaya_panel_s_vytyazhkoj",
    "brand": "VARD",
    "category": "VARD",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 129990,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "VHH 8462B Варочная панель с вытяжкой",
    "description": "Официальная техника VARD в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/89690.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "vard-gril-plancha"
    ]
  },

  {
    "id": "prod-umi-610843",
    "sku": "VHH 6472B",
    "name": "VHH 6472B Варочная панель с вытяжкой",
    "slug": "vhh_6472b_varochnaya_panel_s_vytyazhkoj",
    "brand": "VARD",
    "category": "VARD",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 109990,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "VHH 6472B Варочная панель с вытяжкой",
    "description": "Официальная техника VARD в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/89689.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "vard-gril-plancha"
    ]
  },

  {
    "id": "prod-umi-610845",
    "sku": "VHA01GP",
    "name": "VHA01GP Гриль планча",
    "slug": "vha01gp_gril_plancha",
    "brand": "VARD",
    "category": "VARD",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 8890,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "VHA01GP Гриль планча",
    "description": "Официальная техника VARD в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/89693.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "vard-gril-plancha"
    ]
  },

  {
    "id": "prod-umi-578582",
    "sku": "Внешний мотор SLIM",
    "name": "Внешний мотор SLIM (800м3/ч)",
    "slug": "vneshnij_motor_slim_800m3_ch",
    "brand": "Falmec",
    "category": "FALMEC",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 71145,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "Внешний мотор SLIM (800м3/ч)",
    "description": "Официальная техника Falmec в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/59637.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "falmec-skidka-20-na-komplekt1"
    ]
  },

  {
    "id": "prod-umi-578613",
    "sku": "Внешний мотор 1500 м3/ч KACL.7964AF",
    "name": "Внешний мотор 1500 м3/ч KACL.7964AF",
    "slug": "vneshnij_motor_1500_m3_ch_kacl_796_4af",
    "brand": "Falmec",
    "category": "FALMEC",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 111690,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "Внешний мотор 1500 м3/ч KACL.7964AF",
    "description": "Официальная техника Falmec в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/60455.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "falmec-skidka-20-na-komplekt1"
    ]
  },

  {
    "id": "prod-umi-578692",
    "sku": "Внешний мотор 1300 м3/ч KACL.7974AF",
    "name": "Внешний мотор 1300 м3/ч KACL.7974AF",
    "slug": "vneshnij_motor_1300_m3_ch_kacl_797_4af",
    "brand": "Falmec",
    "category": "FALMEC",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 126990,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "Внешний мотор 1300 м3/ч KACL.7974AF",
    "description": "Официальная техника Falmec в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/60457.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "falmec-skidka-20-na-komplekt1"
    ]
  },

  {
    "id": "prod-umi-578712",
    "sku": "Внешний мотор 1000м3/ч KACL.78641F",
    "name": "Внешний мотор 1000м3/ч KACL.78641F",
    "slug": "vneshnij_motor_1000m3_ch_kacl_786_41f",
    "brand": "Falmec",
    "category": "FALMEC",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 95625,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "Внешний мотор 1000м3/ч KACL.78641F",
    "description": "Официальная техника Falmec в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/60456.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "falmec-skidka-20-na-komplekt1"
    ]
  },

  {
    "id": "prod-umi-587073",
    "sku": "105080053",
    "name": "Пульт ДУ 105080053",
    "slug": "pul_t_du_105080053",
    "brand": "Falmec",
    "category": "FALMEC",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 11169,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "Пульт ДУ 105080053",
    "description": "Официальная техника Falmec в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/60459.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "falmec-skidka-20-na-komplekt1"
    ]
  },

  {
    "id": "prod-umi-587807",
    "sku": "Внешний мотор KACL 78446F",
    "name": "Внешний мотор KACL 78446F",
    "slug": "vneshnij_motor_kacl_78446f",
    "brand": "Falmec",
    "category": "FALMEC",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 71145,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "Внешний мотор KACL 78446F",
    "description": "Официальная техника Falmec в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/75744.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "falmec-skidka-20-na-komplekt1"
    ]
  },

  {
    "id": "prod-umi-610108",
    "sku": "LEVEL ONE",
    "name": "LEVEL ONE Варочная панель с вытяжкой",
    "slug": "level_one_varochnaya_panel_s_vytyazhkoj",
    "brand": "Falmec",
    "category": "FALMEC",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 688500,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "LEVEL ONE Варочная панель с вытяжкой",
    "description": "Официальная техника Falmec в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/89020.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "falmec-bolshe-podarkov"
    ]
  },

  {
    "id": "prod-umi-603972",
    "sku": "BRERA",
    "name": "BRERA Варочная панель с вытяжкой",
    "slug": "brera_varochnaya_panel_s_vytyazhkoj",
    "brand": "Falmec",
    "category": "FALMEC",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 504900,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "BRERA Варочная панель с вытяжкой",
    "description": "Официальная техника Falmec в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/85235.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "falmec-bolshe-podarkov",
      "falmec-new-actions"
    ]
  },

  {
    "id": "prod-umi-598991",
    "sku": "KACL 987 Steel",
    "name": "KACL 987 Steel Сливной клапан",
    "slug": "kacl_987_steel_slivnoj_klapan",
    "brand": "Falmec",
    "category": "FALMEC",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 4590,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "KACL 987 Steel Сливной клапан",
    "description": "Официальная техника Falmec в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/80675.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "falmec-water-50"
    ]
  },

  {
    "id": "prod-umi-598990",
    "sku": "KACL 984",
    "name": "KACL 984 Поддон для сушки",
    "slug": "kacl_984_poddon_dlya_sushki",
    "brand": "Falmec",
    "category": "FALMEC",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 10710,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "KACL 984 Поддон для сушки",
    "description": "Официальная техника Falmec в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/80666.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "falmec-water-50"
    ]
  },

  {
    "id": "prod-umi-598986",
    "sku": "KACL 983",
    "name": "KACL 983 Поддон для сушки",
    "slug": "kacl_983_poddon_dlya_sushki",
    "brand": "Falmec",
    "category": "FALMEC",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 9180,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "KACL 983 Поддон для сушки",
    "description": "Официальная техника Falmec в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/80665.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "falmec-water-50"
    ]
  },

  {
    "id": "prod-umi-598978",
    "sku": "KACL 982",
    "name": "KACL 982 Колландер",
    "slug": "kacl_982_kollander",
    "brand": "Falmec",
    "category": "FALMEC",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 11781,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "KACL 982 Колландер",
    "description": "Официальная техника Falmec в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/80663.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "falmec-water-50"
    ]
  },

  {
    "id": "prod-umi-598963",
    "sku": "KACL 987 WHITE",
    "name": "KACL 987 WHITE Автоматический сливной клапан",
    "slug": "kacl_987_white_avtomaticheskij_slivnoj_klapan",
    "brand": "Falmec",
    "category": "FALMEC",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 6120,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "KACL 987 WHITE Автоматический сливной клапан",
    "description": "Официальная техника Falmec в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/80673.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "falmec-water-50"
    ]
  },

  {
    "id": "prod-umi-598945",
    "sku": "KACL 993",
    "name": "KACL 993 Многофункциональная доска",
    "slug": "kacl_993_mnogofunkcional_naya_doska",
    "brand": "Falmec",
    "category": "FALMEC",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 8415,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "KACL 993 Многофункциональная доска",
    "description": "Официальная техника Falmec в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/80670.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "falmec-water-50"
    ]
  },

  {
    "id": "prod-umi-611556",
    "sku": "OKB 3221 AGN STEAM MW",
    "name": "OKB 3221 AGN STEAM MW Духовой шкаф (Кухни PRO)",
    "slug": "okb_3221_agn_steam_mw_duhovoj_shkaf_fix",
    "brand": "Körting",
    "category": "KORTING",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 122990,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "OKB 3221 AGN STEAM MW Духовой шкаф (Кухни PRO)",
    "description": "Официальная техника Körting в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/90507.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "skidka-50-holodilnik-korting-ksi-17545-cfnf-kuhni-pro"
    ]
  },

  {
    "id": "prod-umi-611937",
    "sku": "OKB 61061 SQGW",
    "name": "OKB 61061 SQGW Духовой шкаф (Кухни PRO)",
    "slug": "okb_61061_sqgw_duhovoj_shkaf",
    "brand": "Körting",
    "category": "KORTING",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 94990,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "OKB 61061 SQGW Духовой шкаф (Кухни PRO)",
    "description": "Официальная техника Körting в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/90900.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "skidka-50-holodilnik-korting-ksi-17545-cfnf-kuhni-pro"
    ]
  },

  {
    "id": "prod-umi-611980",
    "sku": "OKB 61031 QGN",
    "name": "OKB 61031 QGN Духовой шкаф (Кухни PRO)",
    "slug": "okb_61031_qgn_duhovoj_shkaf",
    "brand": "Körting",
    "category": "KORTING",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 89490,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "OKB 61031 QGN Духовой шкаф (Кухни PRO)",
    "description": "Официальная техника Körting в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/90956.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "skidka-50-holodilnik-korting-ksi-17545-cfnf-kuhni-pro"
    ]
  },

  {
    "id": "prod-umi-611982",
    "sku": "OKB 61061 SQGGr",
    "name": "OKB 61061 SQGGr Духовой шкаф (Кухни PRO)",
    "slug": "okb_61061_sqggr_duhovoj_shkaf",
    "brand": "Körting",
    "category": "KORTING",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 94990,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "OKB 61061 SQGGr Духовой шкаф (Кухни PRO)",
    "description": "Официальная техника Körting в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/90957.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "skidka-50-holodilnik-korting-ksi-17545-cfnf-kuhni-pro"
    ]
  },

  {
    "id": "prod-umi-611983",
    "sku": "OKB 61061 SQGN",
    "name": "OKB 61061 SQGN Духовой шкаф (Кухни PRO)",
    "slug": "okb_61061_sqgn_duhovoj_shkaf",
    "brand": "Körting",
    "category": "KORTING",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 94990,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "OKB 61061 SQGN Духовой шкаф (Кухни PRO)",
    "description": "Официальная техника Körting в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/90958.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "skidka-50-holodilnik-korting-ksi-17545-cfnf-kuhni-pro"
    ]
  },

  {
    "id": "prod-umi-605702",
    "sku": "OKB 6071 CN",
    "name": "OKB 6071 CN Духовой шкаф (Кухни)",
    "slug": "okb_6071_cn_duhovoj_shkaf",
    "brand": "Körting",
    "category": "KORTING",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 54990,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "OKB 6071 CN Духовой шкаф (Кухни)",
    "description": "Официальная техника Körting в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/86842.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "skidka-50-holodilnik-korting-ksi-17545-cfnf-kuhni-pro"
    ]
  },

  {
    "id": "prod-umi-611107",
    "sku": "KSI 17545 CFNF",
    "name": "KSI 17545 CFNF Холодильник",
    "slug": "ksi_17545_cfnf_holodil_nik",
    "brand": "Körting",
    "category": "KORTING",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 122990,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "KSI 17545 CFNF Холодильник",
    "description": "Официальная техника Körting в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/90012.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "skidka-50-holodilnik-korting-ksi-17545-cfnf-kuhni-pro"
    ]
  },

  {
    "id": "prod-umi-612931",
    "sku": "KHI 6393 N",
    "name": "KHI 6393 N Вытяжка",
    "slug": "khi_6393_n_vytyazhka",
    "brand": "Körting",
    "category": "KORTING",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 14190,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "KHI 6393 N Вытяжка",
    "description": "Официальная техника Körting в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/91834.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "korting-formula-vygody-sentyabr-2026"
    ]
  },

  {
    "id": "prod-umi-611739",
    "sku": "OKB 3810 FGN",
    "name": "OKB 3810 FGN Духовой шкаф",
    "slug": "okb_3810_fgn_duhovoj_shkaf",
    "brand": "Körting",
    "category": "KORTING",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 44590,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "OKB 3810 FGN Духовой шкаф",
    "description": "Официальная техника Körting в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/90690.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "korting-formula-vygody-sentyabr-2026"
    ]
  },

  {
    "id": "prod-umi-597162",
    "sku": "KDI 45140",
    "name": "KDI 45140 Посудомоечная машина",
    "slug": "kdi_45140_posudomoechnaya_mashina",
    "brand": "Körting",
    "category": "KORTING",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 44990,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "KDI 45140 Посудомоечная машина",
    "description": "Официальная техника Körting в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/78923.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "korting-formula-vygody-sentyabr-2026"
    ]
  },

  {
    "id": "prod-umi-597261",
    "sku": "KDI 60110",
    "name": "KDI 60110 Посудомоечная машина",
    "slug": "kdi_60110_posudomoechnaya_mashina",
    "brand": "Körting",
    "category": "KORTING",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 41990,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "KDI 60110 Посудомоечная машина",
    "description": "Официальная техника Körting в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/78930.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "korting-formula-vygody-sentyabr-2026"
    ]
  },

  {
    "id": "prod-umi-611715",
    "sku": "JW 8W12T3",
    "name": "JW 8W12T3 Стиральная машина",
    "slug": "jw_8w12t3_stiral_naya_mashina",
    "brand": "Jacky's",
    "category": "JACKYS",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 61990,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "JW 8W12T3 Стиральная машина",
    "description": "Официальная техника Jacky's в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/90670.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "jackys-kaskad-2026"
    ]
  },

  {
    "id": "prod-umi-612595",
    "sku": "JW 8TC41N",
    "name": "JW 8TC41N Стиральная машина",
    "slug": "jw_8tc41n_stiral_naya_mashina",
    "brand": "Jacky's",
    "category": "JACKYS",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 49999,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "JW 8TC41N Стиральная машина",
    "description": "Официальная техника Jacky's в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/91493.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "jackys-kaskad-2026",
      "jackys-specialnye-promo-ceny-2026"
    ]
  },

  {
    "id": "prod-umi-612602",
    "sku": "JW F0944BTD2",
    "name": "JW F0944BTD2 Стиральная машина",
    "slug": "jw_f0944btd2_stiral_naya_mashina",
    "brand": "Jacky's",
    "category": "JACKYS",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 59990,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "JW F0944BTD2 Стиральная машина",
    "description": "Официальная техника Jacky's в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/91499.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "jackys-kaskad-2026"
    ]
  },

  {
    "id": "prod-umi-612608",
    "sku": "JW 105W14T3",
    "name": "JW 105W14T3 Стиральная машина",
    "slug": "jw_105w14t3_stiral_naya_mashina",
    "brand": "Jacky's",
    "category": "JACKYS",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 59990,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "JW 105W14T3 Стиральная машина",
    "description": "Официальная техника Jacky's в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/91489.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "jackys-kaskad-2026"
    ]
  },

  {
    "id": "prod-umi-612609",
    "sku": "JW F1223BTB",
    "name": "JW F1223BTB Стиральная машина",
    "slug": "jw_f1223btb_stiral_naya_mashina",
    "brand": "Jacky's",
    "category": "JACKYS",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 59990,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "JW F1223BTB Стиральная машина",
    "description": "Официальная техника Jacky's в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/91498.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "jackys-kaskad-2026"
    ]
  },

  {
    "id": "prod-umi-612616",
    "sku": "JW 6W12L0N",
    "name": "JW 6W12L0N Стиральная машина",
    "slug": "jw_6w12l0n_stiral_naya_mashina",
    "brand": "Jacky's",
    "category": "JACKYS",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 36999,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "JW 6W12L0N Стиральная машина",
    "description": "Официальная техника Jacky's в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/91491.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "jackys-kaskad-2026",
      "jackys-specialnye-promo-ceny-2026"
    ]
  },

  {
    "id": "prod-umi-605532",
    "sku": "COF 01WHEU",
    "name": "COF 01WHEU Мини печь",
    "slug": "cof_01wheu_mini_pech",
    "brand": "SMEG",
    "category": "SMEG",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 108790,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "COF 01WHEU Мини печь",
    "description": "Официальная техника SMEG в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/86660.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "smeg-osen-v-stile-smeg-2026"
    ]
  },

  {
    "id": "prod-umi-605624",
    "sku": "PIC 01WHMEU",
    "name": "PIC 01WHMEU Настольная плита",
    "slug": "pic_01whmeu_nastol_naya_plita",
    "brand": "SMEG",
    "category": "SMEG",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 45590,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "PIC 01WHMEU Настольная плита",
    "description": "Официальная техника SMEG в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/86760.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "smeg-osen-v-stile-smeg-2026"
    ]
  },

  {
    "id": "prod-umi-605646",
    "sku": "COF 01BLEU",
    "name": "COF 01BLEU Мини печь",
    "slug": "cof_01bleu_mini_pech",
    "brand": "SMEG",
    "category": "SMEG",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 108790,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "COF 01BLEU Мини печь",
    "description": "Официальная техника SMEG в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/86796.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "smeg-osen-v-stile-smeg-2026"
    ]
  },

  {
    "id": "prod-umi-607151",
    "sku": "COF 01PGEU",
    "name": "COF 01PGEU Мини печь",
    "slug": "cof_01pgeu_mini_pech",
    "brand": "SMEG",
    "category": "SMEG",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 108790,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "COF 01PGEU Мини печь",
    "description": "Официальная техника SMEG в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/87047.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "smeg-osen-v-stile-smeg-2026"
    ]
  },

  {
    "id": "prod-umi-612681",
    "sku": "MOC 02EGMEU",
    "name": "MOC 02EGMEU Микроволновая печь",
    "slug": "moc_02egmeu_mikrovolnovaya_pech",
    "brand": "SMEG",
    "category": "SMEG",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 47990,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "MOC 02EGMEU Микроволновая печь",
    "description": "Официальная техника SMEG в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/91587.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "smeg-osen-v-stile-smeg-2026"
    ]
  },

  {
    "id": "prod-umi-603502",
    "sku": "EGF 03WHEU",
    "name": "EGF 03WHEU Кофемашина",
    "slug": "egf_03wheu_kofemashina",
    "brand": "SMEG",
    "category": "SMEG",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 66242,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "EGF 03WHEU Кофемашина",
    "description": "Официальная техника SMEG в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/84727.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "smeg-osen-v-stile-smeg-2026"
    ]
  },

  {
    "id": "prod-umi-612687",
    "sku": "MOC 01EGMEU",
    "name": "MOC 01EGMEU Микроволновая печь",
    "slug": "moc_01egmeu_mikrovolnovaya_pech",
    "brand": "SMEG",
    "category": "SMEG",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 39990,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "MOC 01EGMEU Микроволновая печь",
    "description": "Официальная техника SMEG в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/91586.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "smeg-osen-v-stile-smeg-2026"
    ]
  },

  {
    "id": "prod-umi-603503",
    "sku": "EGF 03RDEU",
    "name": "EGF 03RDEU Кофемашина",
    "slug": "egf_03rdeu_kofemashina",
    "brand": "SMEG",
    "category": "SMEG",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 71990,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "EGF 03RDEU Кофемашина",
    "description": "Официальная техника SMEG в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/84726.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "smeg-osen-v-stile-smeg-2026"
    ]
  },

  {
    "id": "prod-umi-610877",
    "sku": "EBS 1001",
    "name": "EBS 1001 Весы кухонные FIX",
    "slug": "ebs_1001_vesy_kuhonnye",
    "brand": "Evelux",
    "category": "EVELUX",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 1290,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "EBS 1001 Весы кухонные FIX",
    "description": "Официальная техника Evelux в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/89734.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "evelux-pokupka-eto-podarok-2026"
    ]
  },

  {
    "id": "prod-umi-604961",
    "sku": "KCM 1001 EX",
    "name": "KCM 1001 EX Кофеварка",
    "slug": "kcm_1001_ex_kofevarka",
    "brand": "Evelux",
    "category": "KORTING",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 12990,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "KCM 1001 EX Кофеварка",
    "description": "Официальная техника Evelux в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/86038.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "evelux-pokupka-eto-podarok-2026"
    ]
  },

  {
    "id": "prod-umi-586622",
    "sku": "KIT0121001",
    "name": "KIT0121001 Соединитель 80ММ 227*94",
    "slug": "soedinitel_80mm_227_94_kit0121001",
    "brand": "Evelux",
    "category": "ELICA",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 2490,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "KIT0121001 Соединитель 80ММ 227*94",
    "description": "Официальная техника Evelux в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/68638.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "evelux-pokupka-eto-podarok-2026"
    ]
  },

  {
    "id": "prod-umi-608520",
    "sku": "EWK 0902 G",
    "name": "EWK 0902 G Чайник эл. FIX",
    "slug": "ewk_0902_g_chajnik_el_fix",
    "brand": "Evelux",
    "category": "EVELUX",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 1790,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "EWK 0902 G Чайник эл. FIX",
    "description": "Официальная техника Evelux в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/88487.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "evelux-pokupka-eto-podarok-2026"
    ]
  },

  {
    "id": "prod-umi-608517",
    "sku": "EWK 0904 G",
    "name": "EWK 0904 G Чайник эл FIX",
    "slug": "ewk_0904_g_chajnik_el_fix",
    "brand": "Evelux",
    "category": "EVELUX",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 1890,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "EWK 0904 G Чайник эл FIX",
    "description": "Официальная техника Evelux в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/88489.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "evelux-pokupka-eto-podarok-2026"
    ]
  },

  {
    "id": "prod-umi-608515",
    "sku": "EWK 0903 G",
    "name": "EWK 0903 G Чайник эл. FIX",
    "slug": "ewk_0903_g_chajnik_el_fix",
    "brand": "Evelux",
    "category": "EVELUX",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 1490,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "EWK 0903 G Чайник эл. FIX",
    "description": "Официальная техника Evelux в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/88488.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "evelux-pokupka-eto-podarok-2026"
    ]
  },

  {
    "id": "prod-umi-609624",
    "sku": "KWK 0904 Infinity",
    "name": "KWK 0904 Infinity Чайник эл.",
    "slug": "kwk_0904_infinity_chajnik_el",
    "brand": "Evelux",
    "category": "KORTING",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 3990,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "KWK 0904 Infinity Чайник эл.",
    "description": "Официальная техника Evelux в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/88723.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "evelux-pokupka-eto-podarok-2026"
    ]
  },

  {
    "id": "prod-umi-608528",
    "sku": "EHB 0301 B",
    "name": "EHB 0301 B Блендер погружной FIX",
    "slug": "ehb_0301_b_blender_pogruzhnoj_fix",
    "brand": "Evelux",
    "category": "EVELUX",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 2990,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "EHB 0301 B Блендер погружной FIX",
    "description": "Официальная техника Evelux в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/88483.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "evelux-pokupka-eto-podarok-2026"
    ]
  },

  {
    "id": "prod-umi-609814",
    "sku": "VIRTUS MULTI 60 TFT BL",
    "name": "VIRTUS MULTI 60 TFT BL Духовой шкаф",
    "slug": "virtus_multi_60_tft_bl_duhovoj_shkaf1",
    "brand": "ELICA",
    "category": "ELICA",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 132590,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "VIRTUS MULTI 60 TFT BL Духовой шкаф",
    "description": "Официальная техника ELICA в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/88837.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "elica-komfortnoe-budushchee-virtus-2026"
    ]
  },

  {
    "id": "prod-umi-609811",
    "sku": "VIRTUS MULTI 60 DD BL",
    "name": "VIRTUS MULTI 60 DD BL Духовой шкаф",
    "slug": "virtus_multi_60_dd_bl_duhovoj_shkaf1",
    "brand": "ELICA",
    "category": "ELICA",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 101990,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "VIRTUS MULTI 60 DD BL Духовой шкаф",
    "description": "Официальная техника ELICA в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/88838.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "elica-komfortnoe-budushchee-virtus-2026"
    ]
  },

  {
    "id": "prod-umi-609806",
    "sku": "VIRTUS MULTI 90 TFT BL",
    "name": "VIRTUS MULTI 90 TFT BL Духовой шкаф",
    "slug": "virtus_multi_90_tft_bl_duhovoj_shkaf1",
    "brand": "ELICA",
    "category": "ELICA",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 203990,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "VIRTUS MULTI 90 TFT BL Духовой шкаф",
    "description": "Официальная техника ELICA в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/88835.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "elica-komfortnoe-budushchee-virtus-2026"
    ]
  },

  {
    "id": "prod-umi-611974",
    "sku": "VIRTUS MULTI 60 TFT PYRO BL",
    "name": "VIRTUS MULTI 60 TFT PYRO BL Духовой шкаф",
    "slug": "virtus_multi_60_tft_pyro_bl_duhovoj_shkaf",
    "brand": "ELICA",
    "category": "ELICA",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 169990,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "VIRTUS MULTI 60 TFT PYRO BL Духовой шкаф",
    "description": "Официальная техника ELICA в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/90938.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "elica-komfortnoe-budushchee-virtus-2026"
    ]
  },

  {
    "id": "prod-umi-612042",
    "sku": "INPUSH 60 B",
    "name": "INPUSH 60 B Вытяжка",
    "slug": "inpush_60_b_vytyazhka",
    "brand": "ELICA",
    "category": "KUPPERSBERG",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 12000,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "INPUSH 60 B Вытяжка",
    "description": "Официальная техника ELICA в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/90708.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "elica-komfortnoe-budushchee-virtus-2026"
    ]
  },

  {
    "id": "prod-umi-609716",
    "sku": "VIRTUS WARM DRAWER 60 PP BL",
    "name": "VIRTUS WARM DRAWER 60 PP BL Подогреватель посуды",
    "slug": "virtus_warm_drawer_60_pp_bl_podogrevatel_posudy",
    "brand": "ELICA",
    "category": "ELICA",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 61190,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "VIRTUS WARM DRAWER 60 PP BL Подогреватель посуды",
    "description": "Официальная техника ELICA в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/85717.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "elica-komfortnoe-budushchee-virtus-2026"
    ]
  },

  {
    "id": "prod-umi-609754",
    "sku": "Ingrid 60 X",
    "name": "Ingrid 60 X Вытяжка FIX",
    "slug": "ingrid_60_x_vytyazhka_fix",
    "brand": "ELICA",
    "category": "EVELUX",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 16390,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "Ingrid 60 X Вытяжка FIX",
    "description": "Официальная техника ELICA в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/88800.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "elica-komfortnoe-budushchee-virtus-2026"
    ]
  },

  {
    "id": "prod-umi-603363",
    "sku": "DW60EPR/21",
    "name": "DW60EPR/21 Посудомоечная машина",
    "slug": "dw60epr_21_posudomoechnaya_mashina",
    "brand": "ELICA",
    "category": "BERTAZZONI",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 64900,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "DW60EPR/21 Посудомоечная машина",
    "description": "Официальная техника ELICA в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/84585.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "elica-komfortnoe-budushchee-virtus-2026"
    ]
  },

  {
    "id": "prod-umi-609704",
    "sku": "RATIO 302 PLUS BL",
    "name": "RATIO 302 PLUS BL Варочная панель",
    "slug": "ratio_302_plus_bl_varochnaya_panel",
    "brand": "ELICA",
    "category": "ELICA",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 45890,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "RATIO 302 PLUS BL Варочная панель",
    "description": "Официальная техника ELICA в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/85704.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "elica-osennij-duet-connex-2026"
    ]
  },

  {
    "id": "prod-umi-609705",
    "sku": "RATIO 874 SLIM BL",
    "name": "RATIO 874 SLIM BL Варочная панель",
    "slug": "ratio_874_slim_bl_varochnaya_panel",
    "brand": "ELICA",
    "category": "ELICA",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 117290,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "RATIO 874 SLIM BL Варочная панель",
    "description": "Официальная техника ELICA в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/85710.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "elica-osennij-duet-connex-2026"
    ]
  },

  {
    "id": "prod-umi-609707",
    "sku": "RATIO 804 PLUS BL",
    "name": "RATIO 804 PLUS BL Варочная панель",
    "slug": "ratio_804_plus_bl_varochnaya_panel",
    "brand": "ELICA",
    "category": "ELICA",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 86690,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "RATIO 804 PLUS BL Варочная панель",
    "description": "Официальная техника ELICA в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/85709.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "elica-osennij-duet-connex-2026"
    ]
  },

  {
    "id": "prod-umi-609709",
    "sku": "RATIO 603 BL",
    "name": "RATIO 603 BL Варочная панель",
    "slug": "ratio_603_bl_varochnaya_panel",
    "brand": "ELICA",
    "category": "ELICA",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 66290,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "RATIO 603 BL Варочная панель",
    "description": "Официальная техника ELICA в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/85706.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "elica-osennij-duet-connex-2026"
    ]
  },

  {
    "id": "prod-umi-609712",
    "sku": "RATIO 702 BL",
    "name": "RATIO 702 BL Варочная панель",
    "slug": "ratio_702_bl_varochnaya_panel",
    "brand": "ELICA",
    "category": "ELICA",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 56090,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "RATIO 702 BL Варочная панель",
    "description": "Официальная техника ELICA в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/85705.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "elica-osennij-duet-connex-2026"
    ]
  },

  {
    "id": "prod-umi-610765",
    "sku": "RATIO CONNEX 604 PLUS BL",
    "name": "RATIO CONNEX 604 PLUS BL Варочная панель",
    "slug": "ratio_connex_604_plus_bl_varochnaya_panel",
    "brand": "ELICA",
    "category": "ELICA",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 76490,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "RATIO CONNEX 604 PLUS BL Варочная панель",
    "description": "Официальная техника ELICA в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/89607.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "elica-osennij-duet-connex-2026"
    ]
  },

  {
    "id": "prod-umi-610766",
    "sku": "RATIO CONNEX 603 PLUS BL",
    "name": "RATIO CONNEX 603 PLUS BL Варочная панель",
    "slug": "ratio_connex_603_plus_bl_varochnaya_panel",
    "brand": "ELICA",
    "category": "ELICA",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 76490,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "RATIO CONNEX 603 PLUS BL Варочная панель",
    "description": "Официальная техника ELICA в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/89606.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "elica-osennij-duet-connex-2026"
    ]
  },

  {
    "id": "prod-umi-610767",
    "sku": "RATIO CONNEX 803 PLUS BL",
    "name": "RATIO CONNEX 803 PLUS BL Варочная панель",
    "slug": "ratio_connex_803_plus_bl_varochnaya_panel",
    "brand": "ELICA",
    "category": "ELICA",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 96890,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "RATIO CONNEX 803 PLUS BL Варочная панель",
    "description": "Официальная техника ELICA в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/89608.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "elica-osennij-duet-connex-2026"
    ]
  },

  {
    "id": "prod-umi-612603",
    "sku": "JR FW568EN",
    "name": "JR FW568EN Холодильник",
    "slug": "jr_fw568en_holodil_nik",
    "brand": "Jacky's",
    "category": "JACKYS",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 89999,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "JR FW568EN Холодильник",
    "description": "Официальная техника Jacky's в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/91523.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "jackys-specialnye-promo-ceny-2026"
    ]
  },

  {
    "id": "prod-umi-612618",
    "sku": "JW S0822B2",
    "name": "JW S0822B2 Стиральная машина",
    "slug": "jw_s0822b2_stiral_naya_mashina",
    "brand": "Jacky's",
    "category": "JACKYS",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 35999,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "JW S0822B2 Стиральная машина",
    "description": "Официальная техника Jacky's в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/91495.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "jackys-specialnye-promo-ceny-2026"
    ]
  },

  {
    "id": "prod-umi-612625",
    "sku": "JW 6TC21",
    "name": "JW 6TC21 Стиральная машина",
    "slug": "jw_6tc21_stiral_naya_mashina",
    "brand": "Jacky's",
    "category": "JACKYS",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 33999,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "JW 6TC21 Стиральная машина",
    "description": "Официальная техника Jacky's в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/91492.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "jackys-specialnye-promo-ceny-2026"
    ]
  },

  {
    "id": "prod-umi-612627",
    "sku": "JR FD2000",
    "name": "JR FD2000 Холодильник",
    "slug": "jr_fd2000_holodil_nik",
    "brand": "Jacky's",
    "category": "JACKYS",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 79999,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "JR FD2000 Холодильник",
    "description": "Официальная техника Jacky's в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/91513.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "jackys-specialnye-promo-ceny-2026"
    ]
  },

  {
    "id": "prod-umi-612637",
    "sku": "JR FD526V",
    "name": "JR FD526V Холодильник",
    "slug": "jr_fd526v_holodil_nik",
    "brand": "Jacky's",
    "category": "JACKYS",
    "categoryType": "CATEGORY_B",
    "physicalStatus": "SHOWROOM",
    "price": 199999,
    "oldPrice": null,
    "inStock": true,
    "stockCount": 3,
    "rating": 4.9,
    "reviewsCount": 14,
    "shortDesc": "JR FD526V Холодильник",
    "description": "Официальная техника Jacky's в салоне «СИМОНА» (Нижний Новгород, ул. Белинского 15). Гарантия производителя.",
    "images": [
      "https://www.simona-bt.ru/images/cms/data/photo_code/91526.jpg"
    ],
    "badge": "На витрине",
    "isFeatured": true,
    "promoSlugs": [
      "jackys-specialnye-promo-ceny-2026"
    ]
  },
  {
    id: 'prod-korting-1',
    sku: '89083',
    name: 'Духовой шкаф Körting OKB 1680 GN MW',
    slug: 'körting-okb-1680-gn-mw',
    brand: 'Körting',
    category: 'Духовой шкаф',
    categoryType: 'CATEGORY_B',
    physicalStatus: 'SHOWROOM',
    price: 111490,
    oldPrice: 128213,
    inStock: true,
    stockCount: 3,
    rating: 4.9,
    reviewsCount: 14,
    shortDesc: 'Официальная гарантия производителя • Экспозиция в салонах СИМОНА',
    description: 'Духовой шкаф Körting OKB 1680 GN MW. Доступен к заказу в салонах бытовой техники СИМОНА в Нижнем Новгороде.',
    images: ["https://simona-bt.ru/images/cms/data/photo_code/89083.jpg"],
    badge: 'На витрине',
    isFeatured: true,
  },
  {
    id: 'prod-korting-2',
    sku: '89082',
    name: 'Духовой шкаф Körting OKB 1471 CGN',
    slug: 'körting-okb-1471-cgn',
    brand: 'Körting',
    category: 'Духовой шкаф',
    categoryType: 'CATEGORY_B',
    physicalStatus: 'SHOWROOM',
    price: 66990,
    oldPrice: 77038,
    inStock: true,
    stockCount: 3,
    rating: 4.9,
    reviewsCount: 14,
    shortDesc: 'Официальная гарантия производителя • Экспозиция в салонах СИМОНА',
    description: 'Духовой шкаф Körting OKB 1471 CGN. Доступен к заказу в салонах бытовой техники СИМОНА в Нижнем Новгороде.',
    images: ["https://simona-bt.ru/images/cms/data/photo_code/89082.jpg"],
    badge: 'На витрине',
    isFeatured: true,
  },
  {
    id: 'prod-korting-3',
    sku: '88802',
    name: 'Духовой шкаф с паром Körting OKB 1650 GN Steam',
    slug: 'körting-okb-1650-gn-steam',
    brand: 'Körting',
    category: 'Духовой шкаф с паром',
    categoryType: 'CATEGORY_B',
    physicalStatus: 'SHOWROOM',
    price: 116990,
    oldPrice: 134538,
    inStock: true,
    stockCount: 3,
    rating: 4.9,
    reviewsCount: 14,
    shortDesc: 'Официальная гарантия производителя • Экспозиция в салонах СИМОНА',
    description: 'Духовой шкаф с паром Körting OKB 1650 GN Steam. Доступен к заказу в салонах бытовой техники СИМОНА в Нижнем Новгороде.',
    images: ["https://simona-bt.ru/images/cms/data/photo_code/88802.jpg"],
    badge: 'На витрине',
    isFeatured: true,
  },
  {
    id: 'prod-korting-4',
    sku: '78850',
    name: 'Индукционная варочная панель Körting HIB 67010 HID M',
    slug: 'körting-hib-67010-hid-m',
    brand: 'Körting',
    category: 'Индукционная варочная панель',
    categoryType: 'CATEGORY_B',
    physicalStatus: 'SHOWROOM',
    price: 64990,
    oldPrice: 74738,
    inStock: true,
    stockCount: 3,
    rating: 4.9,
    reviewsCount: 14,
    shortDesc: 'Официальная гарантия производителя • Экспозиция в салонах СИМОНА',
    description: 'Индукционная варочная панель Körting HIB 67010 HID M. Доступен к заказу в салонах бытовой техники СИМОНА в Нижнем Новгороде.',
    images: ["https://simona-bt.ru/images/cms/data/photo_code/89083.jpg"],
    badge: 'На витрине',
    isFeatured: true,
  },
  {
    id: 'prod-korting-5',
    sku: '78681',
    name: 'Индукционная варочная панель Körting HIB 97010 HID M',
    slug: 'körting-hib-97010-hid-m',
    brand: 'Körting',
    category: 'Индукционная варочная панель',
    categoryType: 'CATEGORY_B',
    physicalStatus: 'SHOWROOM',
    price: 89990,
    oldPrice: 103488,
    inStock: true,
    stockCount: 3,
    rating: 4.9,
    reviewsCount: 14,
    shortDesc: 'Официальная гарантия производителя • Экспозиция в салонах СИМОНА',
    description: 'Индукционная варочная панель Körting HIB 97010 HID M. Доступен к заказу в салонах бытовой техники СИМОНА в Нижнем Новгороде.',
    images: ["https://simona-bt.ru/images/cms/data/photo_code/89082.jpg"],
    badge: 'На витрине',
    isFeatured: true,
  },
  {
    id: 'prod-korting-6',
    sku: '78960',
    name: 'Встраиваемая посудомоечная машина Körting KDI 60110',
    slug: 'körting-kdi-60110',
    brand: 'Körting',
    category: 'Встраиваемая посудомоечная машина',
    categoryType: 'CATEGORY_B',
    physicalStatus: 'SHOWROOM',
    price: 52990,
    oldPrice: 60938,
    inStock: true,
    stockCount: 3,
    rating: 4.9,
    reviewsCount: 14,
    shortDesc: 'Официальная гарантия производителя • Экспозиция в салонах СИМОНА',
    description: 'Встраиваемая посудомоечная машина Körting KDI 60110. Доступен к заказу в салонах бытовой техники СИМОНА в Нижнем Новгороде.',
    images: ["https://simona-bt.ru/images/cms/data/photo_code/88802.jpg"],
    badge: 'На витрине',
    isFeatured: true,
  },
  {
    id: 'prod-korting-7',
    sku: '88695',
    name: 'Встраиваемый холодильник Körting KSI 17780 CVNF',
    slug: 'körting-ksi-17780-cvnf',
    brand: 'Körting',
    category: 'Встраиваемый холодильник',
    categoryType: 'CATEGORY_B',
    physicalStatus: 'SHOWROOM',
    price: 104990,
    oldPrice: 120738,
    inStock: true,
    stockCount: 3,
    rating: 4.9,
    reviewsCount: 14,
    shortDesc: 'Официальная гарантия производителя • Экспозиция в салонах СИМОНА',
    description: 'Встраиваемый холодильник Körting KSI 17780 CVNF. Доступен к заказу в салонах бытовой техники СИМОНА в Нижнем Новгороде.',
    images: ["https://simona-bt.ru/images/cms/data/photo_code/89083.jpg"],
    badge: 'На витрине',
    isFeatured: true,
  },
  {
    id: 'prod-korting-8',
    sku: '88705',
    name: 'Дегидратор для продуктов Körting KFD 2402 Pro',
    slug: 'körting-kfd-2402-pro',
    brand: 'Körting',
    category: 'Дегидратор для продуктов',
    categoryType: 'CATEGORY_B',
    physicalStatus: 'SHOWROOM',
    price: 25990,
    oldPrice: 29888,
    inStock: true,
    stockCount: 3,
    rating: 4.9,
    reviewsCount: 14,
    shortDesc: 'Официальная гарантия производителя • Экспозиция в салонах СИМОНА',
    description: 'Дегидратор для продуктов Körting KFD 2402 Pro. Доступен к заказу в салонах бытовой техники СИМОНА в Нижнем Новгороде.',
    images: ["https://simona-bt.ru/images/cms/data/photo_code/88802.jpg"],
    badge: 'На витрине',
    isFeatured: true,
  },
  {
    id: 'prod-falmec-1',
    sku: '88178',
    name: 'Встраиваемая вытяжка Falmec Gruppo Incasso Vision 50',
    slug: 'falmec-gruppo-incasso-vision-50',
    brand: 'Falmec',
    category: 'Встраиваемая вытяжка',
    categoryType: 'CATEGORY_B',
    physicalStatus: 'SHOWROOM',
    price: 85680,
    oldPrice: 98531,
    inStock: true,
    stockCount: 3,
    rating: 4.9,
    reviewsCount: 14,
    shortDesc: 'Официальная гарантия производителя • Экспозиция в салонах СИМОНА',
    description: 'Встраиваемая вытяжка Falmec Gruppo Incasso Vision 50. Доступен к заказу в салонах бытовой техники СИМОНА в Нижнем Новгороде.',
    images: ["https://simona-bt.ru/images/cms/data/photo_code/88178.jpg"],
    badge: 'На витрине',
    isFeatured: true,
  },
  {
    id: 'prod-falmec-2',
    sku: '88173',
    name: 'Островная вытяжка Falmec Mira Plus Isola 40',
    slug: 'falmec-mira-plus-isola-40',
    brand: 'Falmec',
    category: 'Островная вытяжка',
    categoryType: 'CATEGORY_B',
    physicalStatus: 'SHOWROOM',
    price: 153000,
    oldPrice: 175950,
    inStock: true,
    stockCount: 3,
    rating: 4.9,
    reviewsCount: 14,
    shortDesc: 'Официальная гарантия производителя • Экспозиция в салонах СИМОНА',
    description: 'Островная вытяжка Falmec Mira Plus Isola 40. Доступен к заказу в салонах бытовой техники СИМОНА в Нижнем Новгороде.',
    images: ["https://simona-bt.ru/images/cms/data/photo_code/88173.jpg"],
    badge: 'На витрине',
    isFeatured: true,
  },
  {
    id: 'prod-falmec-3',
    sku: '88167',
    name: 'Индукционная панель с вытяжкой Falmec Level One',
    slug: 'falmec-level-one',
    brand: 'Falmec',
    category: 'Индукционная панель с вытяжкой',
    categoryType: 'CATEGORY_B',
    physicalStatus: 'SHOWROOM',
    price: 389000,
    oldPrice: 447350,
    inStock: true,
    stockCount: 3,
    rating: 4.9,
    reviewsCount: 14,
    shortDesc: 'Официальная гарантия производителя • Экспозиция в салонах СИМОНА',
    description: 'Индукционная панель с вытяжкой Falmec Level One. Доступен к заказу в салонах бытовой техники СИМОНА в Нижнем Новгороде.',
    images: ["https://simona-bt.ru/images/cms/data/photo_code/88178.jpg"],
    badge: 'На витрине',
    isFeatured: true,
  },
  {
    id: 'prod-falmec-4',
    sku: '88165',
    name: 'Индукционная панель с вытяжкой Falmec Brera',
    slug: 'falmec-brera',
    brand: 'Falmec',
    category: 'Индукционная панель с вытяжкой',
    categoryType: 'CATEGORY_B',
    physicalStatus: 'SHOWROOM',
    price: 429000,
    oldPrice: 493350,
    inStock: true,
    stockCount: 3,
    rating: 4.9,
    reviewsCount: 14,
    shortDesc: 'Официальная гарантия производителя • Экспозиция в салонах СИМОНА',
    description: 'Индукционная панель с вытяжкой Falmec Brera. Доступен к заказу в салонах бытовой техники СИМОНА в Нижнем Новгороде.',
    images: ["https://simona-bt.ru/images/cms/data/photo_code/88173.jpg"],
    badge: 'На витрине',
    isFeatured: true,
  },
  {
    id: 'prod-falmec-5',
    sku: '80624',
    name: 'Индукционная панель с вытяжкой Falmec Quantum',
    slug: 'falmec-quantum',
    brand: 'Falmec',
    category: 'Индукционная панель с вытяжкой',
    categoryType: 'CATEGORY_B',
    physicalStatus: 'SHOWROOM',
    price: 359000,
    oldPrice: 412850,
    inStock: true,
    stockCount: 3,
    rating: 4.9,
    reviewsCount: 14,
    shortDesc: 'Официальная гарантия производителя • Экспозиция в салонах СИМОНА',
    description: 'Индукционная панель с вытяжкой Falmec Quantum. Доступен к заказу в салонах бытовой техники СИМОНА в Нижнем Новгороде.',
    images: ["https://simona-bt.ru/images/cms/data/photo_code/88178.jpg"],
    badge: 'На витрине',
    isFeatured: true,
  },
  {
    id: 'prod-falmec-6',
    sku: '88545',
    name: 'Кухонная мойка Falmec Water 50 Copper',
    slug: 'falmec-water-50-copper',
    brand: 'Falmec',
    category: 'Кухонная мойка',
    categoryType: 'CATEGORY_B',
    physicalStatus: 'SHOWROOM',
    price: 68900,
    oldPrice: 79235,
    inStock: true,
    stockCount: 3,
    rating: 4.9,
    reviewsCount: 14,
    shortDesc: 'Официальная гарантия производителя • Экспозиция в салонах СИМОНА',
    description: 'Кухонная мойка Falmec Water 50 Copper. Доступен к заказу в салонах бытовой техники СИМОНА в Нижнем Новгороде.',
    images: ["https://simona-bt.ru/images/cms/data/photo_code/88173.jpg"],
    badge: 'На витрине',
    isFeatured: true,
  },
  {
    id: 'prod-falmec-7',
    sku: '83228',
    name: 'Смеситель кухонный Falmec Treviso Chrome',
    slug: 'falmec-treviso-chrome',
    brand: 'Falmec',
    category: 'Смеситель кухонный',
    categoryType: 'CATEGORY_B',
    physicalStatus: 'SHOWROOM',
    price: 34500,
    oldPrice: 39675,
    inStock: true,
    stockCount: 3,
    rating: 4.9,
    reviewsCount: 14,
    shortDesc: 'Официальная гарантия производителя • Экспозиция в салонах СИМОНА',
    description: 'Смеситель кухонный Falmec Treviso Chrome. Доступен к заказу в салонах бытовой техники СИМОНА в Нижнем Новгороде.',
    images: ["https://simona-bt.ru/images/cms/data/photo_code/88178.jpg"],
    badge: 'На витрине',
    isFeatured: true,
  },
  {
    id: 'prod-evelux-1',
    sku: '88726',
    name: 'Духовой шкаф Evelux EO 620 PB',
    slug: 'evelux-eo-620-pb',
    brand: 'Evelux',
    category: 'Духовой шкаф',
    categoryType: 'CATEGORY_B',
    physicalStatus: 'SHOWROOM',
    price: 34990,
    oldPrice: 40238,
    inStock: true,
    stockCount: 3,
    rating: 4.9,
    reviewsCount: 14,
    shortDesc: 'Официальная гарантия производителя • Экспозиция в салонах СИМОНА',
    description: 'Духовой шкаф Evelux EO 620 PB. Доступен к заказу в салонах бытовой техники СИМОНА в Нижнем Новгороде.',
    images: ["https://simona-bt.ru/images/cms/data/photo_code/89083.jpg"],
    badge: 'На витрине',
    isFeatured: true,
  },
  {
    id: 'prod-evelux-2',
    sku: '85590',
    name: 'Индукционная варочная панель Evelux IHE 6041 B',
    slug: 'evelux-ihe-6041-b',
    brand: 'Evelux',
    category: 'Индукционная варочная панель',
    categoryType: 'CATEGORY_B',
    physicalStatus: 'SHOWROOM',
    price: 27990,
    oldPrice: 32188,
    inStock: true,
    stockCount: 3,
    rating: 4.9,
    reviewsCount: 14,
    shortDesc: 'Официальная гарантия производителя • Экспозиция в салонах СИМОНА',
    description: 'Индукционная варочная панель Evelux IHE 6041 B. Доступен к заказу в салонах бытовой техники СИМОНА в Нижнем Новгороде.',
    images: ["https://simona-bt.ru/images/cms/data/photo_code/89082.jpg"],
    badge: 'На витрине',
    isFeatured: true,
  },
  {
    id: 'prod-evelux-3',
    sku: '85594',
    name: 'Встраиваемая посудомоечная машина Evelux BD 6010',
    slug: 'evelux-bd-6010',
    brand: 'Evelux',
    category: 'Встраиваемая посудомоечная машина',
    categoryType: 'CATEGORY_B',
    physicalStatus: 'SHOWROOM',
    price: 36990,
    oldPrice: 42538,
    inStock: true,
    stockCount: 3,
    rating: 4.9,
    reviewsCount: 14,
    shortDesc: 'Официальная гарантия производителя • Экспозиция в салонах СИМОНА',
    description: 'Встраиваемая посудомоечная машина Evelux BD 6010. Доступен к заказу в салонах бытовой техники СИМОНА в Нижнем Новгороде.',
    images: ["https://simona-bt.ru/images/cms/data/photo_code/88802.jpg"],
    badge: 'На витрине',
    isFeatured: true,
  },
  {
    id: 'prod-evelux-4',
    sku: '85591',
    name: 'Напольные весы Evelux EBS 1001',
    slug: 'evelux-ebs-1001',
    brand: 'Evelux',
    category: 'Напольные весы',
    categoryType: 'CATEGORY_B',
    physicalStatus: 'SHOWROOM',
    price: 2490,
    oldPrice: 2863,
    inStock: true,
    stockCount: 3,
    rating: 4.9,
    reviewsCount: 14,
    shortDesc: 'Официальная гарантия производителя • Экспозиция в салонах СИМОНА',
    description: 'Напольные весы Evelux EBS 1001. Доступен к заказу в салонах бытовой техники СИМОНА в Нижнем Новгороде.',
    images: ["https://simona-bt.ru/images/cms/data/photo_code/89083.jpg"],
    badge: 'На витрине',
    isFeatured: true,
  },
  {
    id: 'prod-evelux-5',
    sku: '85634',
    name: 'Электрический чайник Evelux EWK 0904 G',
    slug: 'evelux-ewk-0904-g',
    brand: 'Evelux',
    category: 'Электрический чайник',
    categoryType: 'CATEGORY_B',
    physicalStatus: 'SHOWROOM',
    price: 3990,
    oldPrice: 4588,
    inStock: true,
    stockCount: 3,
    rating: 4.9,
    reviewsCount: 14,
    shortDesc: 'Официальная гарантия производителя • Экспозиция в салонах СИМОНА',
    description: 'Электрический чайник Evelux EWK 0904 G. Доступен к заказу в салонах бытовой техники СИМОНА в Нижнем Новгороде.',
    images: ["https://simona-bt.ru/images/cms/data/photo_code/89082.jpg"],
    badge: 'На витрине',
    isFeatured: true,
  },
  {
    id: 'prod-evelux-6',
    sku: '85617',
    name: 'Погружной блендер Evelux EHB 0301 B',
    slug: 'evelux-ehb-0301-b',
    brand: 'Evelux',
    category: 'Погружной блендер',
    categoryType: 'CATEGORY_B',
    physicalStatus: 'SHOWROOM',
    price: 4990,
    oldPrice: 5738,
    inStock: true,
    stockCount: 3,
    rating: 4.9,
    reviewsCount: 14,
    shortDesc: 'Официальная гарантия производителя • Экспозиция в салонах СИМОНА',
    description: 'Погружной блендер Evelux EHB 0301 B. Доступен к заказу в салонах бытовой техники СИМОНА в Нижнем Новгороде.',
    images: ["https://simona-bt.ru/images/cms/data/photo_code/88802.jpg"],
    badge: 'На витрине',
    isFeatured: true,
  },
  {
    id: 'prod-vard-1',
    sku: '89058',
    name: 'Духовой шкаф VARD VOB678X',
    slug: 'vard-vob678x',
    brand: 'VARD',
    category: 'Духовой шкаф',
    categoryType: 'CATEGORY_B',
    physicalStatus: 'SHOWROOM',
    price: 89990,
    oldPrice: 103488,
    inStock: true,
    stockCount: 3,
    rating: 4.9,
    reviewsCount: 14,
    shortDesc: 'Официальная гарантия производителя • Экспозиция в салонах СИМОНА',
    description: 'Духовой шкаф VARD VOB678X. Доступен к заказу в салонах бытовой техники СИМОНА в Нижнем Новгороде.',
    images: ["https://simona-bt.ru/images/cms/data/photo_code/89083.jpg"],
    badge: 'На витрине',
    isFeatured: true,
  },
  {
    id: 'prod-vard-2',
    sku: '89065',
    name: 'Индукционная варочная панель VARD VIB642B',
    slug: 'vard-vib642b',
    brand: 'VARD',
    category: 'Индукционная варочная панель',
    categoryType: 'CATEGORY_B',
    physicalStatus: 'SHOWROOM',
    price: 59990,
    oldPrice: 68988,
    inStock: true,
    stockCount: 3,
    rating: 4.9,
    reviewsCount: 14,
    shortDesc: 'Официальная гарантия производителя • Экспозиция в салонах СИМОНА',
    description: 'Индукционная варочная панель VARD VIB642B. Доступен к заказу в салонах бытовой техники СИМОНА в Нижнем Новгороде.',
    images: ["https://simona-bt.ru/images/cms/data/photo_code/89082.jpg"],
    badge: 'На витрине',
    isFeatured: true,
  },
  {
    id: 'prod-vard-3',
    sku: '89062',
    name: 'Встраиваемая посудомоечная машина VARD VBD450',
    slug: 'vard-vbd450',
    brand: 'VARD',
    category: 'Встраиваемая посудомоечная машина',
    categoryType: 'CATEGORY_B',
    physicalStatus: 'SHOWROOM',
    price: 64990,
    oldPrice: 74738,
    inStock: true,
    stockCount: 3,
    rating: 4.9,
    reviewsCount: 14,
    shortDesc: 'Официальная гарантия производителя • Экспозиция в салонах СИМОНА',
    description: 'Встраиваемая посудомоечная машина VARD VBD450. Доступен к заказу в салонах бытовой техники СИМОНА в Нижнем Новгороде.',
    images: ["https://simona-bt.ru/images/cms/data/photo_code/88802.jpg"],
    badge: 'На витрине',
    isFeatured: true,
  },
  {
    id: 'prod-vard-4',
    sku: '89054',
    name: 'Стиральная машина VARD VWS8614',
    slug: 'vard-vws8614',
    brand: 'VARD',
    category: 'Стиральная машина',
    categoryType: 'CATEGORY_B',
    physicalStatus: 'SHOWROOM',
    price: 79990,
    oldPrice: 91988,
    inStock: true,
    stockCount: 3,
    rating: 4.9,
    reviewsCount: 14,
    shortDesc: 'Официальная гарантия производителя • Экспозиция в салонах СИМОНА',
    description: 'Стиральная машина VARD VWS8614. Доступен к заказу в салонах бытовой техники СИМОНА в Нижнем Новгороде.',
    images: ["https://simona-bt.ru/images/cms/data/photo_code/88802.jpg"],
    badge: 'На витрине',
    isFeatured: true,
  },
  {
    id: 'prod-vard-5',
    sku: '84904',
    name: 'Набор мельниц для специй VARD VSMPS26T',
    slug: 'vard-vsmps26t',
    brand: 'VARD',
    category: 'Набор мельниц для специй',
    categoryType: 'CATEGORY_B',
    physicalStatus: 'SHOWROOM',
    price: 8990,
    oldPrice: 10338,
    inStock: true,
    stockCount: 3,
    rating: 4.9,
    reviewsCount: 14,
    shortDesc: 'Официальная гарантия производителя • Экспозиция в салонах СИМОНА',
    description: 'Набор мельниц для специй VARD VSMPS26T. Доступен к заказу в салонах бытовой техники СИМОНА в Нижнем Новгороде.',
    images: ["https://simona-bt.ru/images/cms/data/photo_code/89083.jpg"],
    badge: 'На витрине',
    isFeatured: true,
  },
  {
    id: 'prod-vard-6',
    sku: '84912',
    name: 'Рожковая кофеварка эспрессо VARD VCPA1C',
    slug: 'vard-vcpa1c',
    brand: 'VARD',
    category: 'Рожковая кофеварка эспрессо',
    categoryType: 'CATEGORY_B',
    physicalStatus: 'SHOWROOM',
    price: 19990,
    oldPrice: 22988,
    inStock: true,
    stockCount: 3,
    rating: 4.9,
    reviewsCount: 14,
    shortDesc: 'Официальная гарантия производителя • Экспозиция в салонах СИМОНА',
    description: 'Рожковая кофеварка эспрессо VARD VCPA1C. Доступен к заказу в салонах бытовой техники СИМОНА в Нижнем Новгороде.',
    images: ["https://simona-bt.ru/images/cms/data/photo_code/89082.jpg"],
    badge: 'На витрине',
    isFeatured: true,
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


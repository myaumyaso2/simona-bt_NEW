import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Simona-BT luxury catalog...');

  await prisma.product.deleteMany();

  const products = [
    // --- КАТЕГОРИЯ Б: АКТИВНАЯ КУХНЯ (Белинского, 15) ---
    {
      sku: 'DGC 7865 HC Pro',
      name: 'Комбинированный духовой шкаф с паром Miele DGC 7865 HC Pro Obsidian Black',
      slug: 'miele-dgc-7865-hc-pro-obsidian-black',
      brand: 'Miele',
      category: 'Духовые шкафы с паром',
      categoryType: 'CATEGORY_B',
      physicalStatus: 'ACTIVE_KITCHEN',
      price: 890000,
      oldPrice: 950000,
      inStock: true,
      stockCount: 2,
      shortDesc: 'Флагманский прибор с подключением к воде, беспроводным термощупом и камерой в рабочей камере.',
      description: 'Комби-пароварка Miele серии DGC 7865 с технологией DualSteam и HydroClean для автоматической самоочистки. Подключена на демонстрационной Активной кухне салона СИМОНА (ул. Белинского, 15). Вы можете оценить приготовление сувид, выпечку с паром и автоматические программы в реальном действии.',
      featuresJson: JSON.stringify([
        { label: 'Объем камеры', value: '67 л' },
        { label: 'Режимы', value: 'Приготовление на пару, Sous-vide, Конвекция +, Гриль' },
        { label: 'Подключение к воде', value: 'Прямой подвод и слив' },
        { label: 'Управление', value: 'M Touch сенсорный дисплей с датчиком MotionReact' },
        { label: 'Страна производства', value: 'Германия' }
      ]),
      dimensions: '595 × 596 × 568 мм',
      schematicPdfUrl: '/schematics/miele-dgc7865-drawings.pdf',
      imagesJson: JSON.stringify([
        'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=1200&q=80'
      ]),
      badge: '🔥 Активная кухня',
      isFeatured: true
    },
    {
      sku: 'HIG1995AB',
      name: 'Индукционная варочная панель ASKO Celsius°Cooking™ HIG1995AB',
      slug: 'asko-celsius-cooking-hig1995ab',
      brand: 'ASKO',
      category: 'Варочные панели',
      categoryType: 'CATEGORY_B',
      physicalStatus: 'ACTIVE_KITCHEN',
      price: 430000,
      oldPrice: null,
      inStock: true,
      stockCount: 1,
      shortDesc: 'Индукционная поверхность с беспроводным термозондом и контролем температуры с точностью до 1°C.',
      description: 'Система Celsius°Cooking от ASKO позволяет готовить как шеф-повар: точный контроль температуры масла, карамелизация и сувид прямо на панели. Протестируйте панель в действии на Активной кухне салона СИМОНА.',
      featuresJson: JSON.stringify([
        { label: 'Зоны нагрева', value: '5 индукционных зон с объединением Bridge' },
        { label: 'Интерфейс', value: 'Цветной TFT-дисплей с пошаговыми шеф-рецептами' },
        { label: 'Датчики', value: 'Bluetooth-термозонд и совместимая посуда' },
        { label: 'Ширина', value: '90 см' },
        { label: 'Страна производства', value: 'Словения / Швеция' }
      ]),
      dimensions: '54 × 904 × 522 мм',
      schematicPdfUrl: '/schematics/asko-hig1995ab-scheme.pdf',
      imagesJson: JSON.stringify([
        'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=1200&q=80'
      ]),
      badge: '🔥 Активная кухня',
      isFeatured: true
    },
    {
      sku: 'CVA 7845',
      name: 'Встраиваемая кофемашина Miele CVA 7845 Obsidian Black',
      slug: 'miele-cva-7845-obsidian-black',
      brand: 'Miele',
      category: 'Кофемашины',
      categoryType: 'CATEGORY_B',
      physicalStatus: 'ACTIVE_KITCHEN',
      price: 690000,
      oldPrice: null,
      inStock: true,
      stockCount: 1,
      shortDesc: 'Кофемашина с технологией CoffeeSelect (3 бункера для зерен), AutoDescale и AutoClean.',
      description: 'Флагманская встраиваемая кофемашина Miele. Попробуйте авторский эспрессо и капучино из отборных сортов кофе во время визита в салон на Белинского, 15.',
      featuresJson: JSON.stringify([
        { label: 'Емкости для зерен', value: '3 отдельных контейнера (CoffeeSelect)' },
        { label: 'Очистка', value: 'Автоматическое удаление накипи AutoDescale' },
        { label: 'Подключение', value: 'Прямое подключение к водопроводу' },
        { label: 'Профили пользователей', value: 'До 10 индивидуальных профилей' }
      ]),
      dimensions: '455 × 595 × 475 мм',
      schematicPdfUrl: '/schematics/miele-cva7845.pdf',
      imagesJson: JSON.stringify([
        'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=1200&q=80'
      ]),
      badge: '🔥 Дегустация в салоне',
      isFeatured: true
    },

    // --- КАТЕГОРИЯ Б: ЭКСПОЗИЦИЯ САЛОНА (Белинского, 15) ---
    {
      sku: 'ECBN 6256 PremiumPlus',
      name: 'Двухдверный встраиваемый холодильник Liebherr ECBN 6256',
      slug: 'liebherr-ecbn-6256-premium-plus',
      brand: 'Liebherr',
      category: 'Холодильники',
      categoryType: 'CATEGORY_B',
      physicalStatus: 'EXHIBITION_15',
      price: 1350000,
      oldPrice: 1480000,
      inStock: true,
      stockCount: 1,
      shortDesc: 'Французская дверь FrenchDoor, зона свежести BioFresh и автоматический ледогенератор IceMaker.',
      description: 'Премиальный французский холодильник Liebherr с зоной BioFresh для длительного сохранения свежести премиальных продуктов. Представлен вживую в шоуруме СИМОНА на Белинского, 15.',
      featuresJson: JSON.stringify([
        { label: 'Полезный объем', value: '471 л (холодильное 357 л / морозильное 114 л)' },
        { label: 'Зона BioFresh', value: '68 л с регулировкой влажности HydroSafe / DrySafe' },
        { label: 'Ледогенератор', value: 'IceMaker с постоянным подключением к воде' },
        { label: 'Освещение', value: 'Светодиодные световые колонны LED' }
      ]),
      dimensions: '2027 × 910 × 610 мм',
      schematicPdfUrl: '/schematics/liebherr-ecbn6256.pdf',
      imagesJson: JSON.stringify([
        'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=1200&q=80'
      ]),
      badge: '📍 В экспозиции',
      isFeatured: true
    },
    {
      sku: 'FAB28RDMC5',
      name: 'Холодильник SMEG 50s Style x Dolce & Gabbana «Sicily is my Love»',
      slug: 'smeg-fab28-dolce-gabbana',
      brand: 'SMEG',
      category: 'Холодильники',
      categoryType: 'CATEGORY_B',
      physicalStatus: 'EXHIBITION_15',
      price: 1850000,
      oldPrice: null,
      inStock: true,
      stockCount: 1,
      shortDesc: 'Коллекционный прибор ручной художественной росписи от итальянских мастеров.',
      description: 'Икона итальянского стиля. Лимитированная серия, созданная в коллаборации SMEG и модного дома Dolce & Gabbana. Доступен для осмотра в интерьерной экспозиции на Белинского, 15.',
      featuresJson: JSON.stringify([
        { label: 'Серия', value: 'Dolce & Gabbana Special Edition' },
        { label: 'Объем', value: '270 л' },
        { label: 'Класс энергопотребления', value: 'A+++' },
        { label: 'Производство', value: 'Италия (ручная роспись)' }
      ]),
      dimensions: '1500 × 601 × 768 мм',
      schematicPdfUrl: '/schematics/smeg-fab28.pdf',
      imagesJson: JSON.stringify([
        'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=1200&q=80'
      ]),
      badge: '📍 Арт-объект',
      isFeatured: true
    },

    // --- КАТЕГОРИЯ Б: ЭКСПОЗИЦИЯ OMOIKIRI & KÖRTING (Белинского, 11/66) ---
    {
      sku: 'SINK-YONAS-86-CA',
      name: 'Кухонная мойка OMOIKIRI Yonas 86-CA из искусственного гранита Artgranit',
      slug: 'omoikiri-yonas-86-ca-artgranit',
      brand: 'OMOIKIRI',
      category: 'Кухонные мойки',
      categoryType: 'CATEGORY_B',
      physicalStatus: 'EXHIBITION_11',
      price: 49900,
      oldPrice: 56900,
      inStock: true,
      stockCount: 4,
      shortDesc: 'Японская гранитная мойка глубокого оттенка Канкун с антибактериальным защитным слоем.',
      description: 'Премиальная мойка OMOIKIRI из ударопрочного кварцевого композита Artgranit. Представлена на фирменных стендах салона OMOIKIRI & KÖRTING на ул. Белинского, 11/66.',
      featuresJson: JSON.stringify([
        { label: 'Материал', value: 'Artgranit (кварц + гранит + полиэфирные смолы)' },
        { label: 'Размер чаши', value: '500 × 430 × 200 мм' },
        { label: 'Монтаж', value: 'Врезной / подстольный' },
        { label: 'Гарантия', value: '8 лет' }
      ]),
      dimensions: '860 × 500 × 200 мм',
      schematicPdfUrl: '/schematics/omoikiri-yonas86.pdf',
      imagesJson: JSON.stringify([
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80'
      ]),
      badge: '📍 Салон 11/66',
      isFeatured: true
    },
    {
      sku: 'NAGANO-PVD-GM',
      name: 'Смеситель OMOIKIRI Nagano с подключением фильтра питьевой воды Gun Metal',
      slug: 'omoikiri-nagano-gun-metal',
      brand: 'OMOIKIRI',
      category: 'Смесители',
      categoryType: 'CATEGORY_B',
      physicalStatus: 'EXHIBITION_11',
      price: 36900,
      oldPrice: null,
      inStock: true,
      stockCount: 6,
      shortDesc: 'Смеситель 2-в-1 с PVD-покрытием оружейная сталь и отдельным каналом фильтрованной воды PureLife.',
      description: 'Экспозиция японской сантехники в салоне на Белинского, 11/66. Технология Pure Life исключает смешивание водопроводной и фильтрованной воды.',
      featuresJson: JSON.stringify([
        { label: 'Покрытие', value: 'PVD Gun Metal (устойчиво к царапинам)' },
        { label: 'Управление', value: 'Двухрычажный керамический картридж Sedal 35 мм' },
        { label: 'Аэратор', value: 'Пластиковый аэратор с защитой от известкового налета' }
      ]),
      dimensions: 'Высота 345 мм, вылет 210 мм',
      schematicPdfUrl: '/schematics/omoikiri-nagano.pdf',
      imagesJson: JSON.stringify([
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
      ]),
      badge: '📍 Салон 11/66',
      isFeatured: false
    },

    // --- КАТЕГОРИЯ Б: ПОД ЗАКАЗ (~8000 позиций) ---
    {
      sku: 'PRO1206GDFSNET',
      name: 'Комбинированный кухонный блок Bertazzoni Professional Series 120 см Carbonio',
      slug: 'bertazzoni-pro120-carbonio',
      brand: 'Bertazzoni',
      category: 'Кухонные блоки',
      categoryType: 'CATEGORY_B',
      physicalStatus: 'ON_ORDER',
      price: 2150000,
      oldPrice: null,
      inStock: false,
      stockCount: 0,
      shortDesc: 'Двухдуховочный блок с газовой варочной панелью на 6 конфорок и теппан-яки.',
      description: 'Шедевр итальянского инжиниринга Bertazzoni. Поставляется напрямую с фабрики в Италии под индивидуальный дизайн-проект кухни. Запросите расчет сроков и техническую карту встройки.',
      featuresJson: JSON.stringify([
        { label: 'Двойная духовка', value: 'Основная 69 л + вспомогательная 54 л' },
        { label: 'Варочная поверхность', value: '6 латунных конфорок с двойным пламенем 5 кВт + Teppanyaki' },
        { label: 'Финишная отделка', value: 'Матовая автомобильная эмаль Carbonio' },
        { label: 'Страна производства', value: 'Италия' }
      ]),
      dimensions: '890-915 × 1195 × 600 мм',
      schematicPdfUrl: '/schematics/bertazzoni-pro120.pdf',
      imagesJson: JSON.stringify([
        'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80'
      ]),
      badge: '📦 Под заказ',
      isFeatured: false
    },

    // --- КАТЕГОРИЯ А: ПРЯМОЙ E-COMMERCE (Корзина, ЮKassa, СБП) ---
    {
      sku: 'KLF03CREU',
      name: 'Электрический чайник SMEG 50s Style Кремовый KLF03CREU',
      slug: 'smeg-kettle-klf03creu-cream',
      brand: 'SMEG',
      category: 'Малая техника',
      categoryType: 'CATEGORY_A',
      physicalStatus: 'EXHIBITION_15',
      price: 21990,
      oldPrice: 24990,
      inStock: true,
      stockCount: 12,
      shortDesc: 'Винтажный чайник из нержавеющей стали с мягким открыванием крышки Soft Opening.',
      description: 'Культовый чайник SMEG в ретро-стиле 50-х годов. Корпус из полированной нержавеющей стали, съемный фильтр от накипи. Доступен для быстрого онлайн-заказа с доставкой или самовывозом.',
      featuresJson: JSON.stringify([
        { label: 'Объем', value: '1.7 л' },
        { label: 'Мощность', value: '2400 Вт' },
        { label: 'Материал', value: 'Нержавеющая сталь' },
        { label: 'База', value: 'Поворот на 360° с нескользящими ножками' }
      ]),
      dimensions: '248 × 226 × 171 мм',
      schematicPdfUrl: null,
      imagesJson: JSON.stringify([
        'https://images.unsplash.com/photo-1594213114663-ddbe3f2a8346?auto=format&fit=crop&w=1200&q=80'
      ]),
      badge: 'В наличии',
      isFeatured: true
    },
    {
      sku: 'TSF01RDEU',
      name: 'Тостер на 2 слота SMEG 50s Style Красный TSF01RDEU',
      slug: 'smeg-toaster-tsf01rdeu-red',
      brand: 'SMEG',
      category: 'Малая техника',
      categoryType: 'CATEGORY_A',
      physicalStatus: 'EXHIBITION_15',
      price: 21990,
      oldPrice: null,
      inStock: true,
      stockCount: 8,
      shortDesc: '6 уровней поджаривания, функции подогрева, размораживания и багель.',
      description: 'Премиальный тостер SMEG. Идеальная равномерная прожарка тостов, автоматическая центровка ломтиков. Оформление онлайн за 1 минуту.',
      featuresJson: JSON.stringify([
        { label: 'Количество отделений', value: '2 экстра-широких слота (36 мм)' },
        { label: 'Мощность', value: '950 Вт' },
        { label: 'Функции', value: 'Разморозка, Багель, Подогрев' }
      ]),
      dimensions: '198 × 310 × 195 мм',
      schematicPdfUrl: null,
      imagesJson: JSON.stringify([
        'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1200&q=80'
      ]),
      badge: 'В наличии',
      isFeatured: true
    },
    {
      sku: 'UltraPhase 1 & 2',
      name: 'Набор моющих средств Miele UltraPhase 1 и 2 для системы TwinDos (6 шт)',
      slug: 'miele-ultraphase-1-2-set',
      brand: 'Miele',
      category: 'Уход и химия',
      categoryType: 'CATEGORY_A',
      physicalStatus: 'EXHIBITION_15',
      price: 16900,
      oldPrice: 18900,
      inStock: true,
      stockCount: 25,
      shortDesc: 'Оригинальный полугодовой комплект картриджей для стиральных машин Miele W1.',
      description: 'Двухфазное жидкое моющее средство Miele CareCollection для безупречной чистоты белого и цветного белья. Сохраняет яркость цветов и мягкость тканей.',
      featuresJson: JSON.stringify([
        { label: 'Состав комплекта', value: '3 картриджа UltraPhase 1 + 3 картриджа UltraPhase 2' },
        { label: 'Расход', value: 'До 150 циклов стирки' },
        { label: 'Совместимость', value: 'Все стиральные машины Miele с системой TwinDos' }
      ]),
      dimensions: null,
      schematicPdfUrl: null,
      imagesJson: JSON.stringify([
        'https://images.unsplash.com/photo-1585670270608-b4b0051e5ea8?auto=format&fit=crop&w=1200&q=80'
      ]),
      badge: 'Хит ухода',
      isFeatured: true
    }
  ];

  for (const p of products) {
    await prisma.product.create({ data: p });
  }

  console.log(`Successfully seeded ${products.length} catalog items.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { ManufacturerPromo, ProductItem } from '@/types';

/**
 * Единый реестр официальных промо-акций европейских производителей бытовой техники.
 * Источник истины: Asana (проект 'Розница Симона', раздел 'Акции, вебинары').
 * Актуализировано автономным скиллом simona-promo-manager: Октябрь 2026.
 * Архитектурные инварианты:
 * 1. Интерактивная сетка Tiers Grid («Ступени выгоды и подарков»)
 * 2. Чек-лист официальных условий (conditions) с иконками-галочками
 * 3. Стандартизированный классификатор механики badgeText
 * 4. Канонический стандарт названий SKU: [Группа] [Бренд] [Артикул]
 */
export const MANUFACTURER_PROMOS: ManufacturerPromo[] = [
  {
    id: 'promo-korting-gifts',
    slug: 'korting-pokupka-eto-podarok1',
    title: "Покупка – это подарок: премиальные аксессуары Körting",
    brand: 'Körting',
    brandCountry: 'Германия',
    badgeText: 'Подарок за покупку',
    discountBadge: 'Подарки до 25 990 ₽',
    timeRemaining: 'до 31 октября 2026',
    startDate: '2026-10-01',
    endDate: '2026-10-31',
    isActive: true,
    bannerUrl: '/images/promos/pilot-korting-gifts-thumb.jpg',
    thumbnailUrl: '/images/promos/pilot-korting-gifts-thumb.jpg',
    heroBgUrl: '/images/promos/pilot-korting-gifts-hero.jpg',
    yandexBannerUrl: '/images/promos/pilot-korting-gifts-thumb.jpg',
    shortDescription: "Подарки от Körting при заказе бытовой техники: штопор KWO 0010-PR2, блендер KHB 0317 W, кухонный комбайн KFP 0201 Diva или дегидратор KFD 2402 Pro в салонах СИМОНА.",
    fullDescription: "Официальная акция немецкого бренда Körting в салонах СИМОНА. Приобретая крупную бытовую технику Körting, покупатель получает полезные аксессуары и подарки в зависимости от суммы покупки.",
    tiers: [
      {
            "step": "от 10 000 ₽",
            "benefit": "Штопор KWO 0010-PR2",
            "description": "Электрический штопор для вина в фирменном дизайне"
      },
      {
            "step": "от 25 000 ₽",
            "benefit": "Блендер KHB 0317 W",
            "description": "Погружной блендер Tulip с насадками"
      },
      {
            "step": "от 50 000 ₽",
            "benefit": "Комбайн KFP 0201 Diva",
            "description": "Многофункциональный кухонный комбайн"
      },
      {
            "step": "от 75 000 ₽",
            "benefit": "Дегидратор KFD 2402 Pro",
            "description": "Профессиональный дегидратор для сушки фруктов и трав"
      }
],
    conditions: [
      "В акции участвует весь актуальный ассортимент бытовой техники Körting в наличии на складе СИМОНА.",
      "Все приборы в комплекте должны быть из разных товарных категорий.",
      "Подарок выдается сразу при оформлении покупки в салоне или при доставке заказа.",
      "Количество акционных подарков ограничено складским резервом производителя.",
      "Бесплатное бережное хранение техники на центральном складе СИМОНА до окончания ремонта."
],
    participatingSkus: ["89083", "89082", "88802", "78850", "78681", "78960", "88695", "88705"],
    participatingProductSlugs: ["körting-okb-1680-gn-mw", "körting-okb-1471-cgn", "körting-okb-1650-gn-steam", "körting-hib-67010-hid-m", "körting-hib-97010-hid-m", "körting-kdi-60110", "körting-ksi-17780-cvnf", "körting-kfd-2402-pro"],
  },
  {
    id: 'promo-korting-cascade',
    slug: 'korting-kaskad',
    title: "Каскадные скидки до 100% на комплект техники Körting",
    brand: 'Körting',
    brandCountry: 'Германия',
    badgeText: 'Комплектная скидка',
    discountBadge: 'Скидка до 100%',
    timeRemaining: 'до 30 ноября 2026',
    startDate: '2026-10-01',
    endDate: '2026-11-30',
    isActive: true,
    bannerUrl: '/images/promos/promo-korting-cascade-thumb.jpg',
    thumbnailUrl: '/images/promos/promo-korting-cascade-thumb.jpg',
    heroBgUrl: '/images/promos/promo-korting-cascade-hero.jpg',
    yandexBannerUrl: '/images/promos/promo-korting-cascade-yandex.jpg',
    shortDescription: "Каскадная программа выгоды Körting: скидка 25% на второй, 50% на третий, 75% на четвертый и 100% на пятый прибор в комплекте крупной бытовой техники.",
    fullDescription: "Выгодное оснащение кухни премиальной техникой Körting. Скидка применяется к наименьшему по стоимости прибору в чеке в зависимости от общего количества предметов в заказе.",
    tiers: [
      {
            "step": "2 прибора",
            "benefit": "–25%",
            "description": "Скидка 25% на наименьший по стоимости прибор в заказе"
      },
      {
            "step": "3 прибора",
            "benefit": "–50%",
            "description": "Скидка 50% на наименьший по стоимости прибор в заказе"
      },
      {
            "step": "4 прибора",
            "benefit": "–75%",
            "description": "Скидка 75% на наименьший по стоимости прибор в заказе"
      },
      {
            "step": "5 приборов",
            "benefit": "–100%",
            "description": "Пятый прибор в комплекте предоставляется бесплатно"
      }
],
    conditions: [
      "В комплекте участвует весь ассортимент крупной бытовой техники Körting, кроме МБТ.",
      "Наличие духового шкафа в заказе розницы не является строгим условием и согласовывается индивидуально.",
      "Все приборы в комплекте должны быть из разных товарных категорий актуального каталога.",
      "Скидки суммируются с действующими промо-ценами РРЦ на выделенный ассортимент."
],
    participatingSkus: ["89083", "89082", "88802", "78850", "78681", "78960", "88695", "88705"],
    participatingProductSlugs: ["körting-okb-1680-gn-mw", "körting-okb-1471-cgn", "körting-okb-1650-gn-steam", "körting-hib-67010-hid-m", "körting-hib-97010-hid-m", "körting-kdi-60110", "körting-ksi-17780-cvnf", "körting-kfd-2402-pro"],
  },
  {
    id: 'promo-korting-razygryvaet-podarki',
    slug: 'korting-razdaet-podarki',
    title: "Körting раздает подарки: посудомоечная машина или холодильник по спеццене",
    brand: 'Körting',
    brandCountry: 'Германия',
    badgeText: 'Подарок за покупку',
    discountBadge: 'Посудомойка в подарок',
    timeRemaining: 'до 30 ноября 2026',
    startDate: '2026-10-01',
    endDate: '2026-11-30',
    isActive: true,
    bannerUrl: '/images/promos/promo-korting-presents-thumb.jpg',
    thumbnailUrl: '/images/promos/promo-korting-presents-thumb.jpg',
    heroBgUrl: '/images/promos/promo-korting-presents-hero.jpg',
    yandexBannerUrl: '/images/promos/promo-korting-presents-yandex.jpg',
    shortDescription: "При покупке комплекта из трех приборов Körting с духовым шкафом в подарок предоставляется встраиваемая посудомоечная машина KDI 60110 или спеццена 19 990 ₽ на холодильник KSI 17780 CVNF.",
    fullDescription: "Флагманская промо-программа бренда Körting. При заказе комплекта техники из трех приборов (обязательно наличие духового шкафа) покупатель выбирает супер-бонус.",
    tiers: [
      {
            "step": "Комплект из 3 приборов",
            "benefit": "Посудомойка KDI 60110",
            "description": "Встраиваемая посудомоечная машина 60 см в подарок"
      },
      {
            "step": "Альтернатива",
            "benefit": "Холодильник за 19 990 ₽",
            "description": "Специальная фиксированная цена на встраиваемый холодильник KSI 17780 CVNF"
      }
],
    conditions: [
      "В комплекте обязательно наличие полноразмерного духового шкафа Körting.",
      "Все приборы в комплекте должны быть из разных категорий крупной бытовой техники.",
      "При отсутствии акционного прибора на складе действует опция замены с доплатой разницы.",
      "Скидки суммируются с промо-ценами на выделенный ассортимент."
],
    participatingSkus: ["89083", "89082", "88802", "78850", "78681", "78960", "88695", "88705"],
    participatingProductSlugs: ["körting-okb-1680-gn-mw", "körting-okb-1471-cgn", "körting-okb-1650-gn-steam", "körting-hib-67010-hid-m", "körting-hib-97010-hid-m", "körting-kdi-60110", "körting-ksi-17780-cvnf", "körting-kfd-2402-pro"],
  },
  {
    id: 'promo-korting-kitchens-pro',
    slug: 'korting-skidka-50-varochnaya-kuhni-pro',
    title: "Скидка 50% на индукционную варочную панель Körting по программе Кухни PRO",
    brand: 'Körting',
    brandCountry: 'Германия',
    badgeText: 'Скидка на комплект',
    discountBadge: 'Скидка 50% на варочную',
    timeRemaining: 'до 31 октября 2026',
    startDate: '2026-10-01',
    endDate: '2026-10-31',
    isActive: true,
    bannerUrl: '/images/promos/promo-korting-kitchens-pro-thumb.jpg',
    thumbnailUrl: '/images/promos/promo-korting-kitchens-pro-thumb.jpg',
    heroBgUrl: '/images/promos/promo-korting-kitchens-pro-hero.jpg',
    yandexBannerUrl: '/images/promos/promo-korting-kitchens-pro-yandex.jpg',
    shortDescription: "Специальное предложение: выгода 50% на индукционные варочные поверхности HIB 67010 HID M или HIB 97010 HID M при покупке духового шкафа линейки Кухни PRO.",
    fullDescription: "Профессиональная серия встраиваемой техники Körting Кухни PRO. Премиальный духовой шкаф и инновационная индукционная панель со скидкой 50%.",
    tiers: [
      {
            "step": "Духовой шкаф PRO",
            "benefit": "–50% на индукцию",
            "description": "Скидка 50% на варочные поверхности HIB 67010 HID M или HIB 97010 HID M"
      }
],
    conditions: [
      "Основной прибор — любой встраиваемый духовой шкаф Körting из профессиональной серии Кухни PRO.",
      "Акционный прибор — варочные панели HIB 67010 HID M (60 см) или HIB 97010 HID M (90 см).",
      "Количество акционных варочных панелей на складе строго ограничено."
],
    participatingSkus: ["89083", "89082", "88802", "78850", "78681", "78960", "88695", "88705"],
    participatingProductSlugs: ["körting-okb-1680-gn-mw", "körting-okb-1471-cgn", "körting-okb-1650-gn-steam", "körting-hib-67010-hid-m", "körting-hib-97010-hid-m", "körting-kdi-60110", "körting-ksi-17780-cvnf", "körting-kfd-2402-pro"],
  },
  {
    id: 'promo-falmec-water-50',
    slug: 'falmec-akciya-water-50',
    title: "Скидка 50% на мойки и смесители Falmec Water",
    brand: 'Falmec',
    brandCountry: 'Италия',
    badgeText: 'Скидка на коллекцию',
    discountBadge: 'Скидка 50%',
    timeRemaining: 'до 31 октября 2026',
    startDate: '2026-10-01',
    endDate: '2026-10-31',
    isActive: true,
    bannerUrl: '/images/promos/promo-falmec-water-50-thumb.jpg',
    thumbnailUrl: '/images/promos/promo-falmec-water-50-thumb.jpg',
    heroBgUrl: '/images/promos/promo-falmec-water-50-hero.jpg',
    yandexBannerUrl: '/images/promos/promo-falmec-water-50-yandex.jpg',
    shortDescription: "Грандиозная выгода 50% от РРЦ на коллекцию кухонных моек из нержавеющей стали AISI 304 и дизайнерских смесителей Falmec Water из наличия на складе.",
    fullDescription: "Итальянская сантехника Falmec Water премиум-класса. Прямая скидка 50% распространяется на весь ассортимент моек и смесителей со склада в Москве.",
    tiers: [
      {
            "step": "Мойки и смесители",
            "benefit": "–50% от РРЦ",
            "description": "Прямая выгода на всю коллекцию сантехники Falmec Water"
      }
],
    conditions: [
      "Скидка 50% предоставляется от действующей рекомендованной розничной цены (РРЦ).",
      "Смесители и мойки участвуют из наличия на центральном складе в Москве.",
      "Аксессуары для моек (колландеры, дозаторы) в акции не участвуют."
],
    participatingSkus: ["88178", "88173", "88167", "88165", "80624", "88545", "83228"],
    participatingProductSlugs: ["falmec-gruppo-incasso-vision-50", "falmec-mira-plus-isola-40", "falmec-level-one", "falmec-brera", "falmec-quantum", "falmec-water-50-copper", "falmec-treviso-chrome"],
  },
  {
    id: 'promo-falmec-integrated-gifts',
    slug: 'falmec-integrirovannye-modeli-podarki',
    title: "Интегрированные модели Falmec: подарок iPad или пылесос Dreame",
    brand: 'Falmec',
    brandCountry: 'Италия',
    badgeText: 'Подарок за покупку',
    discountBadge: 'Подарок Apple iPad',
    timeRemaining: 'до 31 октября 2026',
    startDate: '2026-10-01',
    endDate: '2026-10-31',
    isActive: true,
    bannerUrl: '/images/promos/promo-falmec-integrated-gifts-thumb.jpg',
    thumbnailUrl: '/images/promos/promo-falmec-integrated-gifts-thumb.jpg',
    heroBgUrl: '/images/promos/promo-falmec-integrated-gifts-hero.jpg',
    yandexBannerUrl: '/images/promos/promo-falmec-integrated-gifts-yandex.jpg',
    shortDescription: "При покупке флагманских вытяжек со встроенной индукцией Falmec Level One, Brera или Quantum — подарок Apple iPad 11\". При покупке Falmec Zero — пылесос Dreame R10s Pro.",
    fullDescription: "Премиальные интегрированные варочные панели с вытяжкой Falmec. При покупке шедевров итальянской инженерной мысли покупатель получает премиальный цифровой подарок для дома.",
    tiers: [
      {
            "step": "Level One / Brera / Quantum",
            "benefit": "Apple iPad 11\"",
            "description": "Планшет Apple iPad (2025) 11\" 128Gb Wi-Fi в подарок"
      },
      {
            "step": "Модель Falmec Zero",
            "benefit": "Пылесос Dreame R10s Pro",
            "description": "Беспроводной пылесос Dreame в подарок"
      }
],
    conditions: [
      "Акция действует при заказе интегрированных вытяжек Falmec актуального ряда.",
      "Подарок передается клиенту вместе с комплектом техники.",
      "Официальная гарантия производителя на прибор и подарок."
],
    participatingSkus: ["88178", "88173", "88167", "88165", "80624", "88545", "83228"],
    participatingProductSlugs: ["falmec-gruppo-incasso-vision-50", "falmec-mira-plus-isola-40", "falmec-level-one", "falmec-brera", "falmec-quantum", "falmec-water-50-copper", "falmec-treviso-chrome"],
  },
  {
    id: 'promo-falmec-induction-hood',
    slug: 'falmec-komplekt-indukciya-i-vytyazhka',
    title: "Скидка 20% на комплект из индукционной панели и вытяжки Falmec",
    brand: 'Falmec',
    brandCountry: 'Италия',
    badgeText: 'Скидка на комплект',
    discountBadge: 'Скидка 20% на дуэт',
    timeRemaining: 'до 31 октября 2026',
    startDate: '2026-10-01',
    endDate: '2026-10-31',
    isActive: true,
    bannerUrl: '/images/promos/promo-falmec-induction-hood-thumb.jpg',
    thumbnailUrl: '/images/promos/promo-falmec-induction-hood-thumb.jpg',
    heroBgUrl: '/images/promos/promo-falmec-induction-hood-hero.jpg',
    yandexBannerUrl: '/images/promos/promo-falmec-induction-hood-yandex.jpg',
    shortDescription: "Интеллектуальная синхронизация: выгода 20% при совместной покупке индукционной поверхности и вытяжки Falmec с поддержкой беспроводного пульта управления.",
    fullDescription: "Безупречная интеграция вытяжки и варочной панели Falmec. Управление интенсивностью вытяжки прямо с рабочей поверхности или пульта дистанционного управления.",
    tiers: [
      {
            "step": "Дуэт приборов",
            "benefit": "–20% на комплект",
            "description": "Скидка 20% при синхронной покупке индукции и вытяжки с пультом ДУ"
      }
],
    conditions: [
      "Основной прибор — индукционная варочная панель Falmec.",
      "Второй прибор — вытяжка Falmec с поддержкой пульта ДУ (Dialogue System).",
      "Скидка 20% рассчитывается на оба прибора в комплекте."
],
    participatingSkus: ["88178", "88173", "88167", "88165", "80624", "88545", "83228"],
    participatingProductSlugs: ["falmec-gruppo-incasso-vision-50", "falmec-mira-plus-isola-40", "falmec-level-one", "falmec-brera", "falmec-quantum", "falmec-water-50-copper", "falmec-treviso-chrome"],
  },
  {
    id: 'promo-falmec-extra-discount',
    slug: 'falmec-dopolnitelnaya-skidka-na-komplekt',
    title: "Дополнительная скидка до 20% на кухонный комплект Falmec",
    brand: 'Falmec',
    brandCountry: 'Италия',
    badgeText: 'Комплектная скидка',
    discountBadge: 'Доп. скидка до 20%',
    timeRemaining: 'до 31 октября 2026',
    startDate: '2026-10-01',
    endDate: '2026-10-31',
    isActive: true,
    bannerUrl: '/images/promos/promo-falmec-extra-discount-thumb.jpg',
    thumbnailUrl: '/images/promos/promo-falmec-extra-discount-thumb.jpg',
    heroBgUrl: '/images/promos/promo-falmec-extra-discount-hero.jpg',
    yandexBannerUrl: '/images/promos/promo-falmec-extra-discount-yandex.jpg',
    shortDescription: "Комплексная выгода: скидка 5% на мойку и смеситель, 10% при добавлении вытяжки и 20% при заказе полного комплекта с варочной поверхностью Falmec.",
    fullDescription: "Нарастающая скидка при расширении комплектации зоны мойки и приготовления Falmec.",
    tiers: [
      {
            "step": "Мойка + смеситель",
            "benefit": "–5%",
            "description": "Дополнительная скидка 5% на комплект сантехники"
      },
      {
            "step": "+ вытяжка",
            "benefit": "–10%",
            "description": "Скидка 10% при заказе 3 предметов"
      },
      {
            "step": "+ варочная поверхность",
            "benefit": "–20%",
            "description": "Максимальная скидка 20% на весь заказ из 4 приборов"
      }
],
    conditions: [
      "Все приборы должны быть бренда Falmec.",
      "Скидка суммируется в чеке при единовременной покупке.",
      "Бесплатная доставка и подъем на этаж службой СИМОНА."
],
    participatingSkus: ["88178", "88173", "88167", "88165", "80624", "88545", "83228"],
    participatingProductSlugs: ["falmec-gruppo-incasso-vision-50", "falmec-mira-plus-isola-40", "falmec-level-one", "falmec-brera", "falmec-quantum", "falmec-water-50-copper", "falmec-treviso-chrome"],
  },
  {
    id: 'promo-evelux-34',
    slug: 'evelux-akciya-3-ravno-4',
    title: "Четвертый прибор в подарок: программа 3=4 на технику EVELUX",
    brand: 'Evelux',
    brandCountry: 'Словения',
    badgeText: 'Комплектная скидка',
    discountBadge: '4-й прибор в подарок',
    timeRemaining: 'до 30 ноября 2026',
    startDate: '2026-10-01',
    endDate: '2026-11-30',
    isActive: true,
    bannerUrl: '/images/promos/promo-evelux-34-thumb.jpg',
    thumbnailUrl: '/images/promos/promo-evelux-34-thumb.jpg',
    heroBgUrl: '/images/promos/promo-evelux-34-hero.jpg',
    yandexBannerUrl: '/images/promos/promo-evelux-34-yandex.jpg',
    shortDescription: "При заказе трех приборов крупной бытовой техники EVELUX с духовым шкафом четвёртый предмет с наименьшей стоимостью предоставляется в подарок.",
    fullDescription: "Официальная промо-акция бренда EVELUX. Полное оснащение современной кухни: духовой шкаф, варочная панель, вытяжка и посудомоечная машина — платите только за три прибора.",
    tiers: [
      {
            "step": "3 прибора КБТ",
            "benefit": "4-й прибор в подарок",
            "description": "Наименьший по стоимости предмет в заказе оформляется со 100% скидкой"
      }
],
    conditions: [
      "В акции участвует весь ассортимент техники Evelux (с пометкой FIX в 1С).",
      "В комплекте обязательно наличие духового шкафа Evelux.",
      "Все 4 прибора должны быть из разных товарных категорий.",
      "Скидки суммируются с промо-ценами на выделенный ассортимент."
],
    participatingSkus: ["88726", "85590", "85594", "85591", "85634", "85617"],
    participatingProductSlugs: ["evelux-eo-620-pb", "evelux-ihe-6041-b", "evelux-bd-6010", "evelux-ebs-1001", "evelux-ewk-0904-g", "evelux-ehb-0301-b"],
  },
  {
    id: 'promo-evelux-cascade',
    slug: 'evelux-kaskad',
    title: "Каскадные скидки до 100% на технику EVELUX",
    brand: 'Evelux',
    brandCountry: 'Словения',
    badgeText: 'Комплектная скидка',
    discountBadge: 'Скидка до 100%',
    timeRemaining: 'до 30 ноября 2026',
    startDate: '2026-10-01',
    endDate: '2026-11-30',
    isActive: true,
    bannerUrl: '/images/promos/promo-evelux-cascade-thumb.jpg',
    thumbnailUrl: '/images/promos/promo-evelux-cascade-thumb.jpg',
    heroBgUrl: '/images/promos/promo-evelux-cascade-hero.jpg',
    yandexBannerUrl: '/images/promos/promo-evelux-cascade-yandex.jpg',
    shortDescription: "Каскадная система скидок на комплекты EVELUX: 25% на второй, 50% на третий, 75% на четвертый и 100% на пятый прибор крупной бытовой техники.",
    fullDescription: "Приобретайте комплект техники EVELUX с максимальной ступенчатой выгодой. В акции участвует крупная встраиваемая и отдельностоящая техника актуального модельного ряда.",
    tiers: [
      {
            "step": "2 прибора",
            "benefit": "–25%",
            "description": "Скидка 25% на наименьший по стоимости прибор"
      },
      {
            "step": "3 прибора",
            "benefit": "–50%",
            "description": "Скидка 50% на наименьший по стоимости прибор"
      },
      {
            "step": "4 прибора",
            "benefit": "–75%",
            "description": "Скидка 75% на наименьший по стоимости прибор"
      },
      {
            "step": "5 приборов",
            "benefit": "–100%",
            "description": "Пятый прибор в заказе оформляется бесплатно"
      }
],
    conditions: [
      "В акции участвует крупная бытовая техника Evelux в наличии на складе.",
      "Наличие духовки в заказе розницы может обсуждаться индивидуально.",
      "Все приборы в комплекте должны быть из разных категорий."
],
    participatingSkus: ["88726", "85590", "85594", "85591", "85634", "85617"],
    participatingProductSlugs: ["evelux-eo-620-pb", "evelux-ihe-6041-b", "evelux-bd-6010", "evelux-ebs-1001", "evelux-ewk-0904-g", "evelux-ehb-0301-b"],
  },
  {
    id: 'promo-evelux-gifts',
    slug: 'evelux-pokupka-eto-podarok',
    title: "Покупка – это подарок: полезные аксессуары EVELUX",
    brand: 'Evelux',
    brandCountry: 'Словения',
    badgeText: 'Подарок за покупку',
    discountBadge: 'Подарки до 15 000 ₽',
    timeRemaining: 'до 30 ноября 2026',
    startDate: '2026-10-01',
    endDate: '2026-11-30',
    isActive: true,
    bannerUrl: '/images/promos/promo-evelux-gifts-thumb.jpg',
    thumbnailUrl: '/images/promos/promo-evelux-gifts-thumb.jpg',
    heroBgUrl: '/images/promos/promo-evelux-gifts-hero.jpg',
    yandexBannerUrl: '/images/promos/promo-evelux-gifts-yandex.jpg',
    shortDescription: "Подарки при покупке техники EVELUX: весы EBS 1001 при заказе от 10 000 ₽, стеклянный чайник EWK 0904 G от 20 000 ₽ или блендер EHB 0301 B от 30 000 ₽.",
    fullDescription: "Приятные бонусы к заказу техники EVELUX в салонах СИМОНА. Приобретая крупную технику, вы получаете стильные приборы МБТ в подарок.",
    tiers: [
      {
            "step": "от 10 000 ₽",
            "benefit": "Весы EBS 1001",
            "description": "Электронные напольные весы EVELUX в подарок"
      },
      {
            "step": "от 20 000 ₽",
            "benefit": "Чайник EWK 0904 G",
            "description": "Стеклянный электрочайник с LED-подсветкой в подарок"
      },
      {
            "step": "от 30 000 ₽",
            "benefit": "Блендер EHB 0301 B",
            "description": "Погружной блендер с измельчителем в подарок"
      }
],
    conditions: [
      "В акции участвует весь ассортимент бытовой техники Evelux из наличия.",
      "Сумма чека рассчитывается с учетом всех действующих скидок.",
      "Подарок выдается сразу при подтверждении заказа."
],
    participatingSkus: ["88726", "85590", "85594", "85591", "85634", "85617"],
    participatingProductSlugs: ["evelux-eo-620-pb", "evelux-ihe-6041-b", "evelux-bd-6010", "evelux-ebs-1001", "evelux-ewk-0904-g", "evelux-ehb-0301-b"],
  },
    {
    id: 'promo-vard-top-models',
    slug: 'vard-vygoda-15-20-populyarnye-modeli',
    title: "Выгода 15-20% на популярные модели техники VARD",
    brand: 'VARD',
    brandCountry: 'Германия',
    badgeText: 'Специальные цены',
    discountBadge: 'Скидка до 20%',
    timeRemaining: 'до 31 октября 2026',
    startDate: '2026-10-01',
    endDate: '2026-10-31',
    isActive: true,
    bannerUrl: '/images/promos/promo-vard-top-models-thumb.jpg',
    thumbnailUrl: '/images/promos/promo-vard-top-models-thumb.jpg',
    heroBgUrl: '/images/promos/promo-vard-top-models-hero.jpg',
    shortDescription: "Специальные сниженные цены на бестселлеры крупной бытовой техники VARD: духовые шкафы, индукционные панели, вытяжки и посудомоечные машины.",
    fullDescription: "Премиальный комфорт и лаконичный дизайн техники VARD с прямой выгодой до 20%. Специальные условия на выделенный пул приборов бренда в салонах СИМОНА.",
    tiers: [
      {
        step: "Выделенный пул SKU",
        benefit: "–15% ... –20%",
        description: "Фиксированные специальные промо-цены на популярные модели"
      }
    ],
    conditions: [
      "Спеццены действуют на выделенный ассортимент техники VARD в рознице.",
      "Цены в каталоге указаны с учетом специального предложения.",
      "Официальная гарантия производителя 3 года."
    ],
    participatingSkus: ["84891", "89688", "84918", "86805", "84924", "84923", "88143", "84903", "84904", "85833", "84888", "89062", "89064", "84898", "84910", "84911", "86803", "88505", "84914", "84915", "86804"],
    participatingProductSlugs: ["vard-vmc-355hk", "vard-vdi-612lt", "vard-vdi-651c", "vard-wci-4ss", "vard-vic-177niw", "vard-vhgs-6434k", "vard-vhls-6434k", "vard-von-444b", "vard-voe-444i", "vard-voc-444hb", "vard-voe-442hb", "vard-vwf-514b", "vard-vwf-314", "vard-vwd-514s", "vard-vwd-414b", "vard-vth-61b", "vard-vwd-514sb"],
  },
  {
    id: 'promo-vard-cascade',
    slug: 'vard-kaskad',
    title: "Каскадные скидки до 100% на комплект техники VARD",
    brand: 'VARD',
    brandCountry: 'Германия',
    badgeText: 'Комплектная скидка',
    discountBadge: 'Скидка до 100%',
    timeRemaining: 'до 31 октября 2026',
    startDate: '2026-10-01',
    endDate: '2026-10-31',
    isActive: true,
    bannerUrl: '/images/promos/promo-vard-cascade-thumb.jpg',
    thumbnailUrl: '/images/promos/promo-vard-cascade-thumb.jpg',
    heroBgUrl: '/images/promos/promo-vard-cascade-hero.jpg',
    shortDescription: "Комплектная программа VARD: 25% скидка на второй, 50% на третий, 75% на четвертый и 100% на пятый предмет крупной бытовой техники в заказе.",
    fullDescription: "Ступенчатая каскадная выгода при комплексном заказе приборов VARD для новой кухни. Скидка начисляется на товар по наименьшей стоимости в чеке.",
    tiers: [
      {
        step: "2 любых прибора",
        benefit: "–25%",
        description: "Скидка 25% на наименьший по стоимости товар в чеке"
      },
      {
        step: "3 любых прибора",
        benefit: "–50%",
        description: "Скидка 50% на наименьший по стоимости товар в чеке"
      },
      {
        step: "4 любых прибора",
        benefit: "–75%",
        description: "Скидка 75% на наименьший по стоимости товар в чеке"
      },
      {
        step: "5 любых приборов",
        benefit: "–100%",
        description: "Скидка 100% на наименьший по стоимости товар в чеке"
      }
    ],
    conditions: [
      "В акции участвуют любые модели крупной бытовой техники VARD из акционного списка.",
      "Скидка предоставляется на товар с наименьшей стоимостью в заказе.",
      "Акция может суммироваться с акцией на подарок (набор мельниц)."
    ],
    participatingSkus: ["89687", "84908", "86810", "86809", "90148", "84891", "89688", "84919", "84918", "86805", "85827", "89051", "89052", "84924", "84923", "88145", "88143", "84903", "84902", "84900", "84905", "84904", "89053", "89054", "89055", "89056", "89057", "89058", "84890", "85835", "85833", "85834", "89060", "84888", "85832", "89062", "85831", "85830", "89059", "89064", "84889", "89061", "89063", "84887", "84886", "89065", "89066", "89067", "89068", "84899", "84898", "85829", "84896", "84897", "86807", "89690", "89689", "88149", "88150", "88151", "88152", "89692", "85836", "89691", "88502", "88504", "85828", "84920", "84894", "84895", "84893", "84892", "84910", "84909", "84911", "84912", "86804", "86803", "88505", "88506", "84914", "84913", "91654", "84916", "91656", "91657", "91658", "91655", "84921", "89071", "89279"],
    participatingProductSlugs: ["vard-vcc-6k", "vard-vcc-5k", "vard-vmg-245pk", "vard-vmg-125pk", "vard-vmg-122pk", "vard-vmc-355hk", "vard-vdi-612lt", "vard-vdi-651c", "vard-vdi-451c", "vard-wci-4sstb", "vard-wci-4sstg", "vard-wci-4ss", "vard-vfi-177niw", "vard-vic-177niw", "vard-vhgs-6434k", "vard-vhg-6424x", "vard-vhls-9534k", "vard-vhls-6434k", "vard-vos-684sb", "vard-vos-684sg", "vard-vop-682b", "vard-vop-682g", "vard-voe-684b", "vard-voe-684g", "vard-von-564b", "vard-von-444b", "vard-von-564x", "vard-voe-554hb", "vard-voe-444i", "vard-von-444x", "vard-voc-444hb", "vard-von-441b", "vard-von-441x", "vard-voe-554hx", "vard-voe-442hb", "vard-voe-444b", "vard-voc-444hi", "vard-voe-442hx", "vard-voe-432b", "vard-voe-432y", "vard-vpe-681mb", "vard-vpe-681mg", "vard-vps-681mb", "vard-vps-681mg", "vard-vhi-9552k", "vard-vhi-6461x", "vard-vhi-6420b", "vard-vhi-6420x", "vard-vhi-3260k", "vard-vhh-8462b", "vard-vhh-6472b", "vard-vcpa1c", "vard-vcpa1v", "vard-vcpa1a", "vard-vcpa1o", "vard-vfg-665pk", "vard-vfg-664pk", "vard-vfg-661k", "vard-vsmps-26t", "vard-vsmps-15n", "vard-vrs-177ni", "vard-vhc-6464k", "vard-vhc-6464x", "vard-vhc-6421x", "vard-vhc-6421b", "vard-vwf-514b", "vard-vwf-514", "vard-vwf-314", "vard-vwf-494", "vard-vwd-514sb", "vard-vwd-514s", "vard-vwd-414b", "vard-vwd-414", "vard-vth-61b", "vard-vth-61", "vard-vth-58", "vard-vri-191m60bg", "vard-vri-192m54sx", "vard-vam-14b", "vard-vam-14g"],
  },
  {
    id: 'promo-vard-mill-gift',
    slug: 'vard-podarok-nabor-melnic',
    title: "Набор мельниц для специй VARD в подарок при заказе от 3 приборов",
    brand: 'VARD',
    brandCountry: 'Германия',
    badgeText: 'Подарок за покупку',
    discountBadge: 'Мельницы в подарок',
    timeRemaining: 'до 31 октября 2026',
    startDate: '2026-10-01',
    endDate: '2026-10-31',
    isActive: true,
    bannerUrl: '/images/promos/promo-vard-mill-lifestyle-thumb.jpg',
    thumbnailUrl: '/images/promos/promo-vard-mill-lifestyle-thumb.jpg',
    heroBgUrl: '/images/promos/promo-vard-mill-lifestyle-hero.jpg',
    shortDescription: "При покупке от 3 любых единиц крупной бытовой техники VARD покупатель получает в подарок дизайнерский набор мельниц для специй VARD VSMPS26T.",
    fullDescription: "Акция для ценителей кулинарного искусства. Фирменный набор автоматических гравитационных мельниц для соли и перца VARD станет стильным украшением вашей кухни.",
    tiers: [
      {
        step: "от 3 приборов КБТ",
        benefit: "Набор мельниц VSMPS26T",
        description: "Автоматический набор гравитационных мельниц для специй VARD в подарок"
      }
    ],
    conditions: [
      "В акции участвует весь ассортимент крупной бытовой техники VARD.",
      "Акция может накладываться на акцию «Каскад VARD».",
      "Акция не суммируется с акцией на кофеварку.",
      "Подарок выдается при оформлении комплекта в салонах СИМОНА."
    ],
    participatingSkus: ["88502", "89687", "84908", "86810", "86809", "90148", "84891", "89688", "84919", "84918", "86805", "85827", "89051", "89052", "84924", "84923", "88145", "88143", "84903", "84902", "84900", "84905", "84904", "89053", "89054", "89055", "89056", "89057", "89058", "84890", "85835", "85833", "85834", "89060", "84888", "85832", "89062", "85831", "85830", "89059", "89064", "84889", "89061", "89063", "84887", "84886", "89065", "89066", "89067", "89068", "84899", "84898", "85829", "84896", "84897", "86807", "89690", "89689", "88149", "88150", "88151", "88152", "89692", "85836", "89691", "88504", "85828", "84920", "84894", "84895", "84893", "84892", "84910", "84909", "84911", "84912", "86804", "86803", "88505", "88506", "84914", "84913", "91654", "84916", "91656", "91657", "91658", "91655", "84921", "89071", "89279"],
    participatingProductSlugs: ["vard-vsmps-26t", "vard-vcc-6k", "vard-vcc-5k", "vard-vmg-245pk", "vard-vmg-125pk", "vard-vmg-122pk", "vard-vmc-355hk", "vard-vdi-612lt", "vard-vdi-651c", "vard-vdi-451c", "vard-wci-4sstb", "vard-wci-4sstg", "vard-wci-4ss", "vard-vfi-177niw", "vard-vic-177niw", "vard-vhgs-6434k", "vard-vhg-6424x", "vard-vhls-9534k", "vard-vhls-6434k", "vard-vos-684sb", "vard-vos-684sg", "vard-vop-682b", "vard-vop-682g", "vard-voe-684b", "vard-voe-684g", "vard-von-564b", "vard-von-444b", "vard-von-564x", "vard-voe-554hb", "vard-voe-444i", "vard-von-444x", "vard-voc-444hb", "vard-von-441b", "vard-von-441x", "vard-voe-554hx", "vard-voe-442hb", "vard-voe-444b", "vard-voc-444hi", "vard-voe-442hx", "vard-voe-432b", "vard-voe-432y", "vard-vpe-681mb", "vard-vpe-681mg", "vard-vps-681mb", "vard-vps-681mg", "vard-vhi-9552k", "vard-vhi-6461x", "vard-vhi-6420b", "vard-vhi-6420x", "vard-vhi-3260k", "vard-vhh-8462b", "vard-vhh-6472b", "vard-vcpa1c", "vard-vcpa1v", "vard-vcpa1a", "vard-vcpa1o", "vard-vfg-665pk", "vard-vfg-664pk", "vard-vfg-661k", "vard-vsmps-15n", "vard-vrs-177ni", "vard-vhc-6464k", "vard-vhc-6464x", "vard-vhc-6421x", "vard-vhc-6421b", "vard-vwf-514b", "vard-vwf-514", "vard-vwf-314", "vard-vwf-494", "vard-vwd-514sb", "vard-vwd-514s", "vard-vwd-414b", "vard-vwd-414", "vard-vth-61b", "vard-vth-61", "vard-vth-58", "vard-vri-191m60bg", "vard-vri-192m54sx", "vard-vam-14b", "vard-vam-14g"],
  },
  {
    id: 'promo-vard-coffee-maker-gift',
    slug: 'vard-podarok-kofevarka',
    title: "Кофеварка эспрессо VARD в подарок при покупке от 4 приборов",
    brand: 'VARD',
    brandCountry: 'Германия',
    badgeText: 'Подарок за покупку',
    discountBadge: 'Кофеварка в подарок',
    timeRemaining: 'до 31 октября 2026',
    startDate: '2026-10-01',
    endDate: '2026-10-31',
    isActive: true,
    bannerUrl: '/images/promos/promo-vard-coffee-lineup-thumb.jpg',
    thumbnailUrl: '/images/promos/promo-vard-coffee-lineup-thumb.jpg',
    heroBgUrl: '/images/promos/promo-vard-coffee-lineup-hero.jpg',
    shortDescription: "При покупке от 4 любых единиц крупной бытовой техники VARD — стильная рожковая кофеварка эспрессо VARD на выбор (VCPA1C, VCPA1V, VCPA1A или VCPA1O) в подарок.",
    fullDescription: "Ароматный кофе каждый день: при заказе полного комплекта техники VARD из 4 приборов покупатель получает итальянскую рожковую кофеварку с давлением 20 бар в подарок.",
    tiers: [
      {
        step: "от 4 приборов КБТ",
        benefit: "Кофеварка VCPA1",
        description: "Рожковая кофеварка эспрессо VARD с давлением 20 бар на выбор по цвету в подарок"
      }
    ],
    conditions: [
      "В акции участвует весь ассортимент крупной бытовой техники VARD.",
      "Покупатель может выбрать любой доступный цвет корпуса кофеварки.",
      "Акция может накладываться на акцию «Каскад VARD».",
      "Подарок выдается вместе с заказом."
    ],
    participatingSkus: ["88149", "88150", "88151", "88152", "89687", "84908", "86810", "86809", "90148", "84891", "89688", "84919", "84918", "86805", "85827", "89051", "89052", "84924", "84923", "88145", "88143", "84903", "84902", "84900", "84905", "84904", "89053", "89054", "89055", "89056", "89057", "89058", "84890", "85835", "85833", "85834", "89060", "84888", "85832", "89062", "85831", "85830", "89059", "89064", "84889", "89061", "89063", "84887", "84886", "89065", "89066", "89067", "89068", "84899", "84898", "85829", "84896", "84897", "86807", "89690", "89689", "89692", "85836", "89691", "88502", "88504", "85828", "84920", "84894", "84895", "84893", "84892", "84910", "84909", "84911", "84912", "86804", "86803", "88505", "88506", "84914", "84913", "91654", "84916", "91656", "91657", "91658", "91655", "84921", "89071", "89279"],
    participatingProductSlugs: ["vard-vcpa1c", "vard-vcpa1v", "vard-vcpa1a", "vard-vcpa1o", "vard-vcc-6k", "vard-vcc-5k", "vard-vmg-245pk", "vard-vmg-125pk", "vard-vmg-122pk", "vard-vmc-355hk", "vard-vdi-612lt", "vard-vdi-651c", "vard-vdi-451c", "vard-wci-4sstb", "vard-wci-4sstg", "vard-wci-4ss", "vard-vfi-177niw", "vard-vic-177niw", "vard-vhgs-6434k", "vard-vhg-6424x", "vard-vhls-9534k", "vard-vhls-6434k", "vard-vos-684sb", "vard-vos-684sg", "vard-vop-682b", "vard-vop-682g", "vard-voe-684b", "vard-voe-684g", "vard-von-564b", "vard-von-444b", "vard-von-564x", "vard-voe-554hb", "vard-voe-444i", "vard-von-444x", "vard-voc-444hb", "vard-von-441b", "vard-von-441x", "vard-voe-554hx", "vard-voe-442hb", "vard-voe-444b", "vard-voc-444hi", "vard-voe-442hx", "vard-voe-432b", "vard-voe-432y", "vard-vpe-681mb", "vard-vpe-681mg", "vard-vps-681mb", "vard-vps-681mg", "vard-vhi-9552k", "vard-vhi-6461x", "vard-vhi-6420b", "vard-vhi-6420x", "vard-vhi-3260k", "vard-vhh-8462b", "vard-vhh-6472b", "vard-vfg-665pk", "vard-vfg-664pk", "vard-vfg-661k", "vard-vsmps-26t", "vard-vsmps-15n", "vard-vrs-177ni", "vard-vhc-6464k", "vard-vhc-6464x", "vard-vhc-6421x", "vard-vhc-6421b", "vard-vwf-514b", "vard-vwf-514", "vard-vwf-314", "vard-vwf-494", "vard-vwd-514sb", "vard-vwd-514s", "vard-vwd-414b", "vard-vwd-414", "vard-vth-61b", "vard-vth-61", "vard-vth-58", "vard-vri-191m60bg", "vard-vri-192m54sx", "vard-vam-14b", "vard-vam-14g"],
  },
{
    id: 'promo-smeg-bundle-archived',
    slug: 'smeg-skidki-na-komplekty',
    title: "Скидки до 20% на комплекты техники Smeg",
    brand: 'SMEG',
    badgeText: 'Комплектная скидка',
    discountBadge: 'Скидка до 20%',
    timeRemaining: 'Акция завершена 30 сентября 2026',
    startDate: '2026-09-01',
    endDate: '2026-09-30',
    isActive: false,
    bannerUrl: '/images/promos/promo-smeg-bundle.jpg',
    thumbnailUrl: '/images/promos/promo-smeg-bundle.jpg',
    heroBgUrl: '/images/promos/promo-smeg-bundle.jpg',
    shortDescription: "Специальное предложение на комплекты встраиваемой и соло техники Smeg.",
    fullDescription: "Акция завершилась 30 сентября 2026 года. Следите за актуальными предложениями бренда в салонах СИМОНА.",
    tiers: [],
    conditions: [
      "Акция завершена."
],
    participatingSkus: [],
    participatingProductSlugs: [],
  },
  {
    id: 'promo-asko-autumn-archived',
    slug: 'asko-specialnye-predlozheniya-osen',
    title: "Специальные условия на технику ASKO",
    brand: 'ASKO',
    badgeText: 'Специальные условия',
    discountBadge: 'Спецусловия',
    timeRemaining: 'Акция завершена 30 сентября 2026',
    startDate: '2026-09-01',
    endDate: '2026-09-30',
    isActive: false,
    bannerUrl: '/images/promos/promo-korting-formula.jpg',
    thumbnailUrl: '/images/promos/promo-korting-formula.jpg',
    heroBgUrl: '/images/promos/promo-korting-formula.jpg',
    shortDescription: "Специальная программа на скандинавскую технику ASKO для кухни и ухода за бельем.",
    fullDescription: "Акция завершилась 30 сентября 2026 года. Следите за актуальными предложениями бренда в салонах СИМОНА.",
    tiers: [],
    conditions: [
      "Акция завершена."
],
    participatingSkus: [],
    participatingProductSlugs: [],
  },
];

export function getActivePromos(): ManufacturerPromo[] {
  return MANUFACTURER_PROMOS.filter((promo) => promo.isActive !== false);
}

export function getFeaturedPromos(): ManufacturerPromo[] {
  return MANUFACTURER_PROMOS.filter((promo) => promo.isFeatured !== false && promo.isActive !== false);
}

export function getPromoBySlug(slug: string): ManufacturerPromo | undefined {
  return MANUFACTURER_PROMOS.find((promo) => promo.slug === slug);
}

export function getPromosByBrand(brand: string): ManufacturerPromo[] {
  return MANUFACTURER_PROMOS.filter(
    (promo) => promo.brand.toLowerCase() === brand.toLowerCase() && promo.isActive !== false
  );
}

export function getPromosForProduct(product: ProductItem): ManufacturerPromo[] {
  return MANUFACTURER_PROMOS.filter(
    (promo) =>
      promo.isActive !== false &&
      (promo.participatingProductSlugs?.includes(product.slug) ||
        (product.promoSlugs && product.promoSlugs.includes(promo.slug)) ||
        (product.brand && promo.brand && product.brand.toLowerCase() === promo.brand.toLowerCase()))
  );
}

export function isProductInPromo(product: ProductItem, promoSlug: string): boolean {
  return (
    Boolean(product.promoSlugs?.includes(promoSlug)) ||
    MANUFACTURER_PROMOS.some(
      (p) =>
        p.slug === promoSlug &&
        p.isActive !== false &&
        (p.participatingProductSlugs?.includes(product.slug) ||
          p.brand.toLowerCase() === product.brand.toLowerCase())
    )
  );
}

export function getPromosForCategory(categoryName: string): ManufacturerPromo[] {
  if (!categoryName) return [];
  const norm = categoryName.toLowerCase();
  return MANUFACTURER_PROMOS.filter(
    (promo) =>
      promo.isActive !== false &&
      promo.categoryNames?.some((c) => {
        const cNorm = c.toLowerCase();
        return (
          norm.includes(cNorm) ||
          cNorm.includes(norm) ||
          (norm.includes('духов') && cNorm.includes('духов')) ||
          (norm.includes('вароч') && cNorm.includes('вароч')) ||
          (norm.includes('паров') && cNorm.includes('паров')) ||
          (norm.includes('мойк') && cNorm.includes('мойк')) ||
          (norm.includes('вытяжк') && cNorm.includes('вытяжк')) ||
          (norm.includes('винн') && cNorm.includes('винн')) ||
          (norm.includes('стирал') && cNorm.includes('стирал')) ||
          (norm.includes('холод') && cNorm.includes('холод'))
        );
      })
  );
}

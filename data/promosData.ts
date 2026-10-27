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
    title: "Körting. Покупка – это подарок: премиальные аксессуары",
    brand: 'Körting',
    brandCountry: 'Германия',
    badgeText: 'Подарок за покупку',
    discountBadge: 'Подарки до 25 990 ₽',
    timeRemaining: 'до 31 октября 2026',
    startDate: '2026-10-01',
    endDate: '2026-10-31',
    isActive: true,
    bannerUrl: '/images/promos/promo-korting-gifts-thumb.jpg',
    thumbnailUrl: '/images/promos/promo-korting-gifts-thumb.jpg',
    heroBgUrl: '/images/promos/promo-korting-gifts-hero.jpg',
    yandexBannerUrl: '/images/promos/promo-korting-gifts-yandex.jpg',
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
    title: "Körting. Каскадные скидки до 100% на комплект техники",
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
    title: "Körting. Раздает подарки: посудомоечная машина или холодильник по спеццене",
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
    title: "Körting. Скидка 50% на индукционную варочную панель по программе Кухни PRO",
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
    asanaTaskGid: '1218978227415388',
    title: "Falmec. Скидка 50% на мойки и смесители Water",
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
    asanaTaskGid: '1218978227415397',
    title: "Falmec. Интегрированные модели: подарок iPad или пылесос Dreame",
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
    asanaTaskGid: '1218978227454653',
    title: "Falmec. Скидка 20% на комплект из индукционной панели и вытяжки",
    brand: 'Falmec',
    brandCountry: 'Италия',
    badgeText: 'Акция завершена',
    discountBadge: 'Акция завершена',
    timeRemaining: 'Акция завершена 21 октября 2026',
    startDate: '2026-10-01',
    endDate: '2026-10-21',
    isActive: false,
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
    asanaTaskGid: '1218978227387321',
    title: "Falmec. Дополнительная скидка до 20% на кухонный комплект",
    brand: 'Falmec',
    brandCountry: 'Италия',
    badgeText: 'Акция завершена',
    discountBadge: 'Акция завершена',
    timeRemaining: 'Акция завершена 21 октября 2026',
    startDate: '2026-10-01',
    endDate: '2026-10-21',
    isActive: false,
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
    title: "Evelux. Четвертый прибор в подарок: программа 3=4",
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
    title: "Evelux. Каскадные скидки до 100% на комплект техники",
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
    title: "Evelux. Покупка – это подарок: полезные аксессуары",
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
    title: "Vard. Выгода 15-20% на популярные модели",
    brand: 'Vard',
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
    yandexBannerUrl: '/images/promos/promo-vard-top-models-yandex.jpg',
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
    participatingSkus: ["84891", "89688", "86805", "84923", "88143", "84903", "84904", "85833", "84888", "89062", "89064", "84910", "84911", "86803", "88505", "84914", "86804"],
    participatingProductSlugs: ["vard-vmc-355hk", "vard-vdi-612lt", "vard-vdi-651c", "vard-wci-4ss", "vard-vic-177niw", "vard-vhgs-6434k", "vard-vhls-6434k", "vard-von-444b", "vard-voe-444i", "vard-voc-444hb", "vard-voe-442hb", "vard-vwf-514b", "vard-vwf-314", "vard-vwd-514s", "vard-vwd-414b", "vard-vth-61b", "vard-vwd-514sb"],
  },
  {
    id: 'promo-vard-cascade',
    slug: 'vard-kaskad',
    title: "Vard. Каскадные скидки до 100% на комплект техники",
    brand: 'Vard',
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
    yandexBannerUrl: '/images/promos/promo-vard-cascade-yandex.jpg',
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
    participatingSkus: ["89687", "84908", "86810", "86809", "90148", "84891", "89688", "86805", "85827", "89051", "89052", "84923", "88145", "88143", "84903", "84900", "84905", "84904", "89053", "89054", "89055", "89056", "89057", "89058", "85835", "85833", "85834", "89060", "84888", "85832", "89062", "85831", "85830", "89059", "89064", "84889", "89061", "89063", "84887", "84886", "89065", "89066", "89067", "89068", "84899", "85829", "84896", "84897", "86807", "89690", "89689", "88149", "88150", "88151", "88152", "89692", "85836", "89691", "88502", "88504", "84920", "84894", "84895", "84893", "84892", "84910", "84909", "84911", "84912", "86804", "86803", "88505", "88506", "84914", "84913", "84916", "91657", "91655", "89071", "89279"],
    participatingProductSlugs: ["vard-vcc-6k", "vard-vcc-5k", "vard-vmg-245pk", "vard-vmg-125pk", "vard-vmg-122pk", "vard-vmc-355hk", "vard-vdi-612lt", "vard-vdi-651c", "vard-vdi-451c", "vard-wci-4sstb", "vard-wci-4sstg", "vard-wci-4ss", "vard-vfi-177niw", "vard-vic-177niw", "vard-vhgs-6434k", "vard-vhg-6424x", "vard-vhls-9534k", "vard-vhls-6434k", "vard-vos-684sb", "vard-vos-684sg", "vard-vop-682b", "vard-vop-682g", "vard-voe-684b", "vard-voe-684g", "vard-von-564b", "vard-von-444b", "vard-von-564x", "vard-voe-554hb", "vard-voe-444i", "vard-von-444x", "vard-voc-444hb", "vard-von-441b", "vard-von-441x", "vard-voe-554hx", "vard-voe-442hb", "vard-voe-444b", "vard-voc-444hi", "vard-voe-442hx", "vard-voe-432b", "vard-voe-432y", "vard-vpe-681mb", "vard-vpe-681mg", "vard-vps-681mb", "vard-vps-681mg", "vard-vhi-9552k", "vard-vhi-6461x", "vard-vhi-6420b", "vard-vhi-6420x", "vard-vhi-3260k", "vard-vhh-8462b", "vard-vhh-6472b", "vard-vcpa1c", "vard-vcpa1v", "vard-vcpa1a", "vard-vcpa1o", "vard-vfg-665pk", "vard-vfg-664pk", "vard-vfg-661k", "vard-vsmps-26t", "vard-vsmps-15n", "vard-vrs-177ni", "vard-vhc-6464k", "vard-vhc-6464x", "vard-vhc-6421x", "vard-vhc-6421b", "vard-vwf-514b", "vard-vwf-514", "vard-vwf-314", "vard-vwf-494", "vard-vwd-514sb", "vard-vwd-514s", "vard-vwd-414b", "vard-vwd-414", "vard-vth-61b", "vard-vth-61", "vard-vth-58", "vard-vri-191m60bg", "vard-vri-192m54sx", "vard-vam-14b", "vard-vam-14g"],
  },
  {
    id: 'promo-vard-mill-gift',
    slug: 'vard-podarok-nabor-melnic',
    title: "Vard. Набор мельниц для специй в подарок при заказе от 3 приборов",
    brand: 'Vard',
    brandCountry: 'Германия',
    badgeText: 'Подарок за покупку',
    discountBadge: 'Мельницы в подарок',
    timeRemaining: 'до 31 октября 2026',
    startDate: '2026-10-01',
    endDate: '2026-10-31',
    isActive: true,
    bannerUrl: '/images/promos/promo-vard-mill-gift-thumb.jpg',
    thumbnailUrl: '/images/promos/promo-vard-mill-gift-thumb.jpg',
    heroBgUrl: '/images/promos/promo-vard-mill-gift-hero.jpg',
    yandexBannerUrl: '/images/promos/promo-vard-mill-gift-yandex.jpg',
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
    participatingSkus: ["88502", "89687", "84908", "86810", "86809", "90148", "84891", "89688", "86805", "85827", "89051", "89052", "84923", "88145", "88143", "84903", "84900", "84905", "84904", "89053", "89054", "89055", "89056", "89057", "89058", "85835", "85833", "85834", "89060", "84888", "85832", "89062", "85831", "85830", "89059", "89064", "84889", "89061", "89063", "84887", "84886", "89065", "89066", "89067", "89068", "84899", "85829", "84896", "84897", "86807", "89690", "89689", "88149", "88150", "88151", "88152", "89692", "85836", "89691", "88504", "84920", "84894", "84895", "84893", "84892", "84910", "84909", "84911", "84912", "86804", "86803", "88505", "88506", "84914", "84913", "84916", "91657", "91655", "89071", "89279"],
    participatingProductSlugs: ["vard-vsmps-26t", "vard-vcc-6k", "vard-vcc-5k", "vard-vmg-245pk", "vard-vmg-125pk", "vard-vmg-122pk", "vard-vmc-355hk", "vard-vdi-612lt", "vard-vdi-651c", "vard-vdi-451c", "vard-wci-4sstb", "vard-wci-4sstg", "vard-wci-4ss", "vard-vfi-177niw", "vard-vic-177niw", "vard-vhgs-6434k", "vard-vhg-6424x", "vard-vhls-9534k", "vard-vhls-6434k", "vard-vos-684sb", "vard-vos-684sg", "vard-vop-682b", "vard-vop-682g", "vard-voe-684b", "vard-voe-684g", "vard-von-564b", "vard-von-444b", "vard-von-564x", "vard-voe-554hb", "vard-voe-444i", "vard-von-444x", "vard-voc-444hb", "vard-von-441b", "vard-von-441x", "vard-voe-554hx", "vard-voe-442hb", "vard-voe-444b", "vard-voc-444hi", "vard-voe-442hx", "vard-voe-432b", "vard-voe-432y", "vard-vpe-681mb", "vard-vpe-681mg", "vard-vps-681mb", "vard-vps-681mg", "vard-vhi-9552k", "vard-vhi-6461x", "vard-vhi-6420b", "vard-vhi-6420x", "vard-vhi-3260k", "vard-vhh-8462b", "vard-vhh-6472b", "vard-vcpa1c", "vard-vcpa1v", "vard-vcpa1a", "vard-vcpa1o", "vard-vfg-665pk", "vard-vfg-664pk", "vard-vfg-661k", "vard-vsmps-15n", "vard-vrs-177ni", "vard-vhc-6464k", "vard-vhc-6464x", "vard-vhc-6421x", "vard-vhc-6421b", "vard-vwf-514b", "vard-vwf-514", "vard-vwf-314", "vard-vwf-494", "vard-vwd-514sb", "vard-vwd-514s", "vard-vwd-414b", "vard-vwd-414", "vard-vth-61b", "vard-vth-61", "vard-vth-58", "vard-vri-191m60bg", "vard-vri-192m54sx", "vard-vam-14b", "vard-vam-14g"],
  },
  {
    id: 'promo-vard-coffee-maker-gift',
    slug: 'vard-podarok-kofevarka',
    title: "Vard. Кофеварка эспрессо в подарок при покупке от 4 приборов",
    brand: 'Vard',
    brandCountry: 'Германия',
    badgeText: 'Подарок за покупку',
    discountBadge: 'Кофеварка в подарок',
    timeRemaining: 'до 31 октября 2026',
    startDate: '2026-10-01',
    endDate: '2026-10-31',
    isActive: true,
    bannerUrl: '/images/promos/promo-vard-coffee-maker-gift-thumb.jpg',
    thumbnailUrl: '/images/promos/promo-vard-coffee-maker-gift-thumb.jpg',
    heroBgUrl: '/images/promos/promo-vard-coffee-maker-gift-hero.jpg',
    yandexBannerUrl: '/images/promos/promo-vard-coffee-maker-gift-yandex.jpg',
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
    participatingSkus: ["88149", "88150", "88151", "88152", "89687", "84908", "86810", "86809", "90148", "84891", "89688", "86805", "85827", "89051", "89052", "84923", "88145", "88143", "84903", "84900", "84905", "84904", "89053", "89054", "89055", "89056", "89057", "89058", "85835", "85833", "85834", "89060", "84888", "85832", "89062", "85831", "85830", "89059", "89064", "84889", "89061", "89063", "84887", "84886", "89065", "89066", "89067", "89068", "84899", "85829", "84896", "84897", "86807", "89690", "89689", "89692", "85836", "89691", "88502", "88504", "84920", "84894", "84895", "84893", "84892", "84910", "84909", "84911", "84912", "86804", "86803", "88505", "88506", "84914", "84913", "84916", "91657", "91655", "89071", "89279"],
    participatingProductSlugs: ["vard-vcpa1c", "vard-vcpa1v", "vard-vcpa1a", "vard-vcpa1o", "vard-vcc-6k", "vard-vcc-5k", "vard-vmg-245pk", "vard-vmg-125pk", "vard-vmg-122pk", "vard-vmc-355hk", "vard-vdi-612lt", "vard-vdi-651c", "vard-vdi-451c", "vard-wci-4sstb", "vard-wci-4sstg", "vard-wci-4ss", "vard-vfi-177niw", "vard-vic-177niw", "vard-vhgs-6434k", "vard-vhg-6424x", "vard-vhls-9534k", "vard-vhls-6434k", "vard-vos-684sb", "vard-vos-684sg", "vard-vop-682b", "vard-vop-682g", "vard-voe-684b", "vard-voe-684g", "vard-von-564b", "vard-von-444b", "vard-von-564x", "vard-voe-554hb", "vard-voe-444i", "vard-von-444x", "vard-voc-444hb", "vard-von-441b", "vard-von-441x", "vard-voe-554hx", "vard-voe-442hb", "vard-voe-444b", "vard-voc-444hi", "vard-voe-442hx", "vard-voe-432b", "vard-voe-432y", "vard-vpe-681mb", "vard-vpe-681mg", "vard-vps-681mb", "vard-vps-681mg", "vard-vhi-9552k", "vard-vhi-6461x", "vard-vhi-6420b", "vard-vhi-6420x", "vard-vhi-3260k", "vard-vhh-8462b", "vard-vhh-6472b", "vard-vfg-665pk", "vard-vfg-664pk", "vard-vfg-661k", "vard-vsmps-26t", "vard-vsmps-15n", "vard-vrs-177ni", "vard-vhc-6464k", "vard-vhc-6464x", "vard-vhc-6421x", "vard-vhc-6421b", "vard-vwf-514b", "vard-vwf-514", "vard-vwf-314", "vard-vwf-494", "vard-vwd-514sb", "vard-vwd-514s", "vard-vwd-414b", "vard-vwd-414", "vard-vth-61b", "vard-vth-61", "vard-vth-58", "vard-vri-191m60bg", "vard-vri-192m54sx", "vard-vam-14b", "vard-vam-14g"],
  },
  {
    id: 'promo-smeg-cascade',
    slug: 'smeg-kaskadnye-skidki-na-krupnuyu-bytovuyu-tehniku',
    asanaTaskGid: '1219343964973314',
    brand: 'Smeg',
    brandCountry: 'Италия',
    title: "Smeg. Каскадные скидки до 15% на крупную бытовую технику",
    badgeText: 'Комплектная скидка',
    discountBadge: 'Скидка до 15%',
    timeRemaining: 'до 24 декабря 2026',
    benefitType: 'DISCOUNT',
    discountAmount: 'до 15%',
    startDate: '2026-10-12',
    endDate: '2026-12-24',
    isActive: true,
    bannerUrl: '/images/promos/promo-smeg-cascade-thumb.jpg',
    thumbnailUrl: '/images/promos/promo-smeg-cascade-thumb.jpg',
    heroBgUrl: '/images/promos/promo-smeg-cascade-hero.jpg',
    shortDescription: "Каскадная программа выгоды Smeg: скидка 8% на духовой шкаф, 12% на комплект с варочной панелью и до 15% при заказе от 3 приборов разных категорий КБТ или комплекта техники для стирки и сушки.",
    fullDescription: "Официальная каскадная акция итальянского бренда Smeg в салонах СИМОНА. При единовременной покупке крупной бытовой техники Smeg предоставляется прогрессивная скидка на комплект приборов для кухни, а также на технику по уходу за бельем.",
    tiers: [
      {
        step: "Духовой шкаф",
        benefit: "–8%",
        description: "Скидка 8% при покупке любого духового шкафа Smeg"
      },
      {
        step: "Духовой шкаф + варочная панель",
        benefit: "–12%",
        description: "Скидка 12% на комплект из духового шкафа и варочной панели Smeg"
      },
      {
        step: "От 3 приборов разных категорий",
        benefit: "–15%",
        description: "Скидка 15% при покупке 3 и более приборов разных товарных категорий КБТ"
      },
      {
        step: "Уход за бельем (1 прибор / комплект)",
        benefit: "–10% / –15%",
        description: "Скидка 10% на 1 стиральную или сушильную машину, либо 15% при покупке от 2 единиц техники для стирки и сушки"
      }
    ],
    conditions: [
      "В акции участвует крупная бытовая техника Smeg из наличия на складе, транзита и под заказ (при 100% предоплате).",
      "Скидки рассчитываются от действующих розничных цен.",
      "В акции не участвуют мойки, смесители и аксессуары.",
      "Акция не распространяется на дизайнерскую серию холодильников Dolce&Gabbana и уцененные товары.",
      "Предложение не суммируется с другими действующими акциями вендора.",
      "Прием заказов по акции — по 24 декабря 2026 года включительно (отгрузка приборов не позднее 27 декабря 2026 года)."
    ],
    participatingSkus: ["75440","75439","64103","75438","89015","89014","87607","89016","64109","64101","64157","87046","64071","86755","75437","86756","83862","83863","84294","89124","48199","90935","91088","89310","89309","89312","76735","89311","52684","83057","88427","83936","84236","86456","62889","52317","73157","83055","83056","91818","83935","91817","91821","84813","85777","91862","90878","91536","91710","91884","61326","79840","83064","83191","83865","83864","76157","59100","59101","73469","59070","72993","58788","88629","89301","89300","89302","66716","79917","75526","66673","68104","87045","87095","86162","89634","52721","89635","89811","90109","90537","87088","90884","87113","90885","91452","15955","91561","91760","89760","15959","91823","69966","37644","37646","56010","2903","68103","2850","14505","14513","14512","89569","42282","50727","52679","52680","52681","52683","63760","64166","64165","65942","65940","65941","62883","62882","66733","67388","67558","67557","68099","69217","69952","37645","58780","73004","73158","73427","70264","77559","77897","69992","69993","69991","78555","82799","82937","83343","83341","83922","83921","83918","83920","83916","75299","83917","83919","75298","84230","84229","75431","84674","76151","85335","86798","86797","78177","78401","78402","78547","79749","79748","87394","87478","88628","89198","89299","89297","89298","86775","89387","86767","86774","90088","86768","90298","86764","86769","90297","86776","90421","90532","90529","86763","90527","86773","80063","90533","86777","90530","90534","86766","90531","90535","90528","80556","86778","90876","81953","90874","86765","81954","90873","86770","90875","90872","81955","90960","83052","90959","91129","91458","88353","89381","91451","83054","89352","91585","83047","91703","83045","91704","89351","83050","91705","89383","83043","91759","77551","83041","83053","77797","83611","89324","89328","83613","89321","89353","83929","89316","83930","89382","83931","83927","89331","89332","89329","89336","89323","85349","85345","89380","85344","89343","85348","89326","89334","69264","86127","89357","89339","89322","89335","89327","89379","89318","89325","89354","89341","89319","89333","89350","89320","89342","89317","89349","89337","89392","87470","87481","89545","89546","90001","90003","91466","90005","91589","91588","90092","90090","90091","90089","90107","90877","90890","91560","91709","91708","91707","91706","91819"],
    participatingProductSlugs: ["smeg-lsia-147s","smeg-lsia-127","smeg-cpr-915n","smeg-lbi-147","smeg-mp-722ao","smeg-fmi-025b3","smeg-dt-393ru4","smeg-mp-822nao","smeg-cpv-315x","smeg-cpr-315x","smeg-fmi-017-x","smeg-cpv-115b3","smeg-mp-322-x1","smeg-scv-115g","smeg-lsf-147e","smeg-scv-115gs","smeg-wm-3t04ru","smeg-wm-3t60cru","smeg-wm-3t24ru","smeg-wm-3t04ru4","smeg-spr-864-bgh","smeg-wm-3t04ru-2","smeg-wm-3t60cru-2","smeg-sf-68c1po","smeg-sf-68c1ao","smeg-sop-6302s2pn","smeg-cpr-915x","smeg-so-6104s4pb3","smeg-sr-975pgh","smeg-cpr-115b3","smeg-sf-6400s1pzb","smeg-cpr-315n","smeg-cpr-915p","smeg-ctp9015b","smeg-se-364-etbm","smeg-mp-822-po","smeg-mp-822npo","smeg-fmi-120b3","smeg-mp-122b3","smeg-cvi-329xe","smeg-so-4301m0n","smeg-cvi-129b3e","smeg-cvi-338lx1","smeg-so-4301m0x","smeg-so-4101m0b3","smeg-cvi-638rn1","smeg-fmi-125g","smeg-fmi-225bi","smeg-fmi-325n","smeg-fmi-020-x","smeg-srv-896-pogh","smeg-suk-91mfx9","smeg-c-9gmx2","smeg-c-6imxt2","smeg-cg-90cixt","smeg-c-9gmmb2","smeg-stl-323bqlh","smeg-srv-876-aogh","smeg-srv-896-aogh","smeg-c-8175tne-3","smeg-srv-864-aogh","smeg-c-8194tne-2","smeg-srv-876-pogh","smeg-cx-91gmbl","smeg-cx-91imbl","smeg-c-95gmcmb2","smeg-sx-91gm","smeg-kseg-5xsa","smeg-stl-342csl","smeg-s-8f174dne","smeg-kseg-7xsa","smeg-ks-905-sxe2","smeg-stl-362dq","smeg-stl-262d","smeg-u-8l080de","smeg-stl-7324aql","smeg-sr-975xgh","smeg-stl-7332cl","smeg-stl-5352c","smeg-stl-7322bql","smeg-stl-7324aqllw","smeg-s-8f174ne","smeg-st-4522din","smeg-c-3170ne","smeg-st-4533cin","smeg-stl-362dq-2","smeg-pgf-30b","smeg-st-4523din","smeg-stl-362dq-3","smeg-u-8f082de","smeg-pgf-32g","smeg-st-4512ein","smeg-ks-905-bxe2","smeg-pgf-64-4","smeg-pgf-95-4","smeg-sf-6381-x","smeg-se-70-sgh-5","smeg-ks-905-nxe2","smeg-ser-60-sgh-3","smeg-sr-764-ao","smeg-sr-775-ao","smeg-sr-775-po","smeg-kv-194-g","smeg-pgf-32i-1","smeg-si-5322-b","smeg-sr-964ngh","smeg-sr-964pgh","smeg-sr-964xgh","smeg-sr-975ngh","smeg-p-864-po","smeg-p-875-po","smeg-p-864-ao","smeg-pv-332-cn","smeg-p-875-ao","smeg-pv-331-cn","smeg-px-375","smeg-px-364-l","smeg-si1m-7643b","smeg-si-964-pm","smeg-si-964nm","smeg-si-764aom","smeg-si-764pom","smeg-si4642d","smeg-si-964xm","smeg-pgf-75-4","smeg-pv-675-cnr","smeg-fc-18en4ax","smeg-pm-3643d","smeg-pv-864po","smeg-si-364bm","smeg-sia-1963d","smeg-si-2641dp","smeg-sf-6905-p1","smeg-sf-6905-x1","smeg-sf-6905-n1","smeg-si1m-4954d","smeg-se-484emtd","smeg-se-495etd","smeg-sim-3864d","smeg-pv-364n","smeg-sim-3323d","smeg-si-2321d","smeg-px-375mb","smeg-se-464td","smeg-pv-375n","smeg-sop-6302tx","smeg-px-364lmb","smeg-se-464tb","smeg-sop-6301s2x","smeg-si1m-4854d","smeg-si1m-4644d","smeg-so-6302tx","smeg-si1m-4634d","smeg-so-6102ts","smeg-sim-1964d","smeg-hobd-482d2","smeg-hobd-472d2","smeg-so-6302s3px","smeg-sop-6902s2pn","smeg-sop-6902s2pp","smeg-so-6302m2x","smeg-mte-40","smeg-mte-30","smeg-pgf-962","smeg-hobd-682d2","smeg-pv-264b","smeg-si2m-5643d1","smeg-sim-3644d","smeg-pgf-31g2","smeg-si1m-5633d1","smeg-fab-10rpg6","smeg-pv-164b3","smeg-fab-10lwh6","smeg-fab-10rpb6","smeg-sim-3644n","smeg-fab-10rbl6","smeg-sim-3964n","smeg-fab-10lcr6","smeg-fab-10rcr6","smeg-hobd-382n2","smeg-fab-10rpk6","smeg-pvl-664-cn","smeg-sisl-7844x","smeg-sim-3644mwh","smeg-fab-10lbl6","smeg-hhsl-7844mb","smeg-fab-10ror6","smeg-so-4302s3x","smeg-sisl-7964","smeg-fab-10rrd6","smeg-sisl-7844","smeg-sisl-7964mb","smeg-fab-10lrd6","smeg-sisl-7844mb","smeg-sisl-7964x","smeg-hhsl-7844x","smeg-sop-6302s2px","smeg-fab-10rwh6","smeg-sim-3964mwh","smeg-sop-6900tn","smeg-si1m-24854d","smeg-fab-10lor6","smeg-sop-6900tx","smeg-si1m-24644d","smeg-fab-10rduj6","smeg-si2b-22641d","smeg-si1b-22641d","smeg-sop-6902s2px","smeg-sim-3864n","smeg-sop-6102s2pb3","smeg-si1m-24954d","smeg-se-232td2","smeg-se-263td2","smeg-fab-10rdlm5","smeg-fab-5lpb6","smeg-se-264td2","smeg-sop-6900tp","smeg-fab-28rpg6","smeg-se-232tx2","smeg-so-6102tb3","smeg-hhsl-7845x","smeg-so-6102s3pb3","smeg-sisl-7845x","smeg-fab-28rpb6","smeg-sop-6101s2b3","smeg-sisl-7955x","smeg-fab-5lsv6","smeg-so-6102m2b3","smeg-si-2641d","smeg-sr-764-po","smeg-so-4102s3b3","smeg-sop-6102tb3","smeg-srv-864-pogh","smeg-so-4102m1b3","smeg-fab-5rpb6","smeg-fab-5rsv6","smeg-so-6101s2b3","smeg-fab-5rcr6","smeg-fab-28rpk6","smeg-so-4902m1n","smeg-fab-5lor6","smeg-so-4902m1p","smeg-fab-5lpg6","smeg-so-4902m1x","smeg-sf-6301tn","smeg-fab-28lbl6","smeg-fab-28lcr6","smeg-fab-5rwh6","smeg-fab-28lpk6","smeg-fab-5ror6","smeg-so-6302m2n","smeg-so-4101m1b3","smeg-fab-5lcr6","smeg-so-4302m1x","smeg-fab-28rcr6","smeg-so-6104apb3","smeg-fab-5rpk6","smeg-fab-28lpb6","smeg-sf-6301-tvx","smeg-sfp-9302tx","smeg-fab-28rwh6","smeg-fab-28lwh6","smeg-fab-5rduj6","smeg-fab-28lpg6","smeg-fab-5rrd6","smeg-fab-5lbl6","smeg-fab-5lrd6","smeg-fab-5rpg6","smeg-fab-28rrd6","smeg-fab-28rbe6","smeg-fab-5lwh6","smeg-fab-28lor6","smeg-fab-28ror6","smeg-fab-5rbl6","smeg-fab-28rbl6","smeg-fab-5lpk6","smeg-fab-28rli6","smeg-fab-28lrd6","smeg-fab-28rpb5","smeg-sop-6104s2pb3","smeg-so-6303apn","smeg-sf-67c1ao","smeg-sf-67c1po","smeg-sf-6100vb3ru","smeg-sfp-61tb3fr","smeg-fqi-48xe","smeg-sf-6100vb3","smeg-fqi-48xd","smeg-fqi-48kd","smeg-sfp-68c1tpo","smeg-sfp-67c1tpo","smeg-sfp-68c1tao","smeg-sfp-67c1tao","smeg-sf-68c1b","smeg-sf-6200tb","smeg-sf-6381-x-2","smeg-sfp-6201tb","smeg-sop-6202tb","smeg-so-6204apb","smeg-so-6202m2b","smeg-so-6201s2b","smeg-sop-6204s2pb"],
  },
];

export function getActivePromos(): ManufacturerPromo[] {
  return MANUFACTURER_PROMOS.filter((promo) => promo.isActive !== false);
}

export function getFeaturedPromos(): ManufacturerPromo[] {
  return MANUFACTURER_PROMOS.filter((promo) => promo.isFeatured !== false && promo.isActive !== false);
}

export function getPromoBySlug(slug: string): ManufacturerPromo | undefined {
  return MANUFACTURER_PROMOS.find((promo) => promo.slug === slug || (slug === 'smeg-skidki-na-komplekty' && promo.id === 'promo-smeg-cascade'));
}

export function getPromosByBrand(brand: string): ManufacturerPromo[] {
  return MANUFACTURER_PROMOS.filter(
    (promo) => promo.brand.toLowerCase() === brand.toLowerCase() && promo.isActive !== false
  );
}

export function isProductMatchingPromo(promo: ManufacturerPromo, product: ProductItem): boolean {
  if (promo.isActive === false) return false;

  if (product.promoSlugs && product.promoSlugs.includes(promo.slug)) {
    return true;
  }

  const hasSkus = Boolean(promo.participatingSkus && promo.participatingSkus.length > 0);
  const hasSlugs = Boolean(promo.participatingProductSlugs && promo.participatingProductSlugs.length > 0);

  if (hasSkus && promo.participatingSkus?.includes(product.sku)) {
    return true;
  }

  if (hasSlugs && promo.participatingProductSlugs?.includes(product.slug)) {
    return true;
  }

  // If promo has explicit SKU or slug restrictions, do not match general brand
  if (hasSkus || hasSlugs) {
    return false;
  }

  // Fallback to brand-wide match only for promos with no explicit SKU restriction
  return Boolean(
    product.brand &&
      promo.brand &&
      product.brand.trim().toLowerCase() === promo.brand.trim().toLowerCase()
  );
}

export function getPromosForProduct(product: ProductItem): ManufacturerPromo[] {
  return MANUFACTURER_PROMOS.filter((promo) => isProductMatchingPromo(promo, product));
}

export function isProductInPromo(product: ProductItem, promoSlug: string): boolean {
  const promo = MANUFACTURER_PROMOS.find((p) => p.slug === promoSlug);
  if (!promo) return false;
  return isProductMatchingPromo(promo, product);
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

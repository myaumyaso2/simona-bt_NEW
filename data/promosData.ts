import { ManufacturerPromo, ProductItem } from '@/types';

export const MANUFACTURER_PROMOS: ManufacturerPromo[] = [
  {
    "id": "promo-korting-gifts",
    "slug": "korting-pokupka-eto-podarok1",
    "brand": "Körting",
    "brandCountry": "Германия",
    "title": "Покупка – это подарок: премиальные аксессуары Körting",
    "subtitle": "Фирменные подарки при заказе техники",
    "badgeText": "Подарки до 25 990 ₽",
    "benefitType": "GIFT",
    "discountAmount": "Подарок",
    "endDate": "31 октября 2026",
    "shortDescription": "Подарки от Körting при покупке техники в салоне Симона: электрический штопор при покупке от 10 000 руб., блендер при заказе от 25 000 руб., гриль при покупке от 50 000 руб. и дегидратор при заказе от 75 000 руб.! Акция действует до 31.10.2026.",
    "fullDescription": "В салонах бытовой техники «СИМОНА» действует специальная программа подарков от немецкого бренда Körting. При единовременном заказе приборов бренда на фиксированную сумму вы получаете в подарок полезные кухонные аксессуары и малую бытовую технику — от электрического штопора до премиального дегидратора.",
    "conditions": [
      "В акции участвует весь актуальный ассортимент бытовой техники Körting.",
      "Все приборы в комплекте должны быть из разных товарных категорий.",
      "Подарки предоставляются при оформлении заказа и наличии приборов на складе.",
      "Бесплатное ответственное хранение оплаченной техники на складе в Нижнем Новгороде.",
      "Официальная гарантия производителя с авторизованным сервисным обслуживанием.",
      "Срок действия специального предложения: до 31 октября 2026 года."
    ],
    "bannerUrl": "/images/promos/promo-korting-gifts.jpg",
    "participatingProductSlugs": [
      "kwo_0010-pr2_shtopor_elektricheskij",
      "khb_0317_w_tulip_blender_pogruzhnoj",
      "kgpa_0403_w_infinity_elektricheskij_gril",
      "kfd_2403_pro_s_sushilka_dlya_produktov"
    ],
    "categoryNames": [
      "Духовые шкафы",
      "Варочные панели",
      "Вытяжки",
      "Посудомоечные машины"
    ],
    "isFeatured": true,
    "tiers": [
      {
        "step": "от 10 000 ₽",
        "benefit": "Электрический штопор",
        "description": "Фирменный штопор Körting KWO 0010-PR2 в подарок"
      },
      {
        "step": "от 25 000 ₽",
        "benefit": "Погружной блендер",
        "description": "Блендер Körting KHB 0317 W Tulip в подарок"
      },
      {
        "step": "от 50 000 ₽",
        "benefit": "Гриль-пресс",
        "description": "Электрический гриль KGPA 0403 W Infinity в подарок"
      },
      {
        "step": "от 75 000 ₽",
        "benefit": "Дегидратор",
        "description": "Сушилка для продуктов KFD 2403 Pro S в подарок"
      }
    ]
  },
  {
    "id": "promo-smeg-bundle",
    "slug": "akciya-ot-smeg-skidka-20-na-komplekt-bytovoj-tehniki",
    "brand": "SMEG",
    "brandCountry": "Италия",
    "title": "Скидка до 20% при покупке комплекта техники SMEG",
    "subtitle": "Каскадная выгода на встраиваемую технику",
    "badgeText": "Скидка до 20%",
    "benefitType": "DISCOUNT",
    "discountAmount": "20%",
    "endDate": "28 сентября 2026",
    "shortDescription": "Каскадная скидка до 20% на премиальную технику SMEG: скидка 10% при заказе духового шкафа с 1 прибором, 15% с двумя приборами и 20% при покупке от 4 предметов в салоне Симона до 28 сентября 2026 года.",
    "fullDescription": "Итальянский бренд SMEG и салон «СИМОНА» предлагают прогрессивную систему скидок на встраиваемую технику для кухни. Составьте комплект из духового шкафа и дополнительных приборов, чтобы получить максимальную выгоду до 20% на весь заказ.",
    "conditions": [
      "Обязательным условием является наличие в комплекте духового шкафа SMEG.",
      "Все приборы в комплекте должны быть из разных товарных категорий.",
      "Предложение действует в салонах «СИМОНА» и при заказе на сайте.",
      "Бесплатное хранение оплаченного комплекта на складе в Нижнем Новгороде.",
      "Официальная гарантия производителя 2 года с авторизованным сервисом.",
      "Срок проведения акции: до 28 сентября 2026 года."
    ],
    "bannerUrl": "/images/promos/promo-smeg-bundle.jpg",
    "participatingProductSlugs": [
      "podstavka_dlya_wok_kit0160040",
      "lgcn_soedinitel_naya_planka",
      "wokghu_kol_co_wok_iz_chuguna",
      "6mp800p_nabor_ruchek",
      "6mp_1pgf_nabor_iz_6_ruchek_dlya_varochnyh_panelej",
      "5mp_700ao_nabor_iz_5_ruchek_dlya_varochnyh_panelej"
    ],
    "categoryNames": [
      "Духовые шкафы",
      "Варочные панели",
      "Вытяжки",
      "Посудомоечные машины"
    ],
    "isFeatured": true,
    "tiers": [
      {
        "step": "Духовой шкаф + 1 прибор",
        "benefit": "Скидка 10%",
        "description": "На комплект из двух приборов разных категорий"
      },
      {
        "step": "Духовой шкаф + 2 прибора",
        "benefit": "Скидка 15%",
        "description": "На комплект из трех приборов разных категорий"
      },
      {
        "step": "От 4 приборов",
        "benefit": "Скидка 20%",
        "description": "Максимальная скидка на комплект с духовым шкафом"
      }
    ]
  },
  {
    "id": "promo-korting-bundle",
    "slug": "korting-ckidka-pri-pokupke-komplekta",
    "brand": "Körting",
    "brandCountry": "Германия",
    "title": "Скидка при покупке комплекта техники Körting",
    "subtitle": "Каскадная выгода до 100% на прибор в чеке",
    "badgeText": "Скидка до 100%",
    "benefitType": "DISCOUNT",
    "discountAmount": "до 100%",
    "endDate": "30 сентября 2026",
    "shortDescription": "Каскадные скидки на технику Körting в салоне Симона: скидка 25% на второй прибор, 50% на третий, 75% на четвертый и 100% на пятый прибор в чеке. Выгодное предложение для обустройства кухни до 30 сентября 2026 года.",
    "fullDescription": "Каскадная программа скидок от немецкого бренда Körting позволяет укомплектовать кухню техникой европейского уровня с исключительной выгодой. Чем больше предметов в заказе, тем выше скидка на прибор с наименьшей стоимостью — вплоть до 100%.",
    "conditions": [
      "В акции участвует весь ассортимент крупной бытовой техники Körting.",
      "Обязательно наличие духового шкафа в комплекте.",
      "Все приборы в комплекте должны быть из разных товарных категорий.",
      "Скидка предоставляется на прибор с наименьшей розничной стоимостью.",
      "Бесплатное ответственное хранение на складе «СИМОНА» в Нижнем Новгороде.",
      "Срок действия акции: до 30 сентября 2026 года."
    ],
    "bannerUrl": "/images/promos/promo-korting-bundle.jpg",
    "participatingProductSlugs": [
      "kfw_803_db_gn_holodil_nyj_shkaf_dlya_vina",
      "kfw_604_db_gn_holodil_nyj_shkaf_dlya_vina",
      "kfw_604_db_gxn_holodil_nyj_shkaf_dlya_vina",
      "kfw_501_sl_gxn_holodil_nyj_shkaf_dlya_vina",
      "kfw_501_sl_gn_holodil_nyj_shkaf_dlya_vina",
      "dsk_150_soedinitel_nyj_element"
    ],
    "categoryNames": [
      "Духовые шкафы",
      "Варочные панели",
      "Вытяжки",
      "Холодильники"
    ],
    "isFeatured": true,
    "tiers": [
      {
        "step": "2 прибора",
        "benefit": "–25% на 2-й прибор",
        "description": "Скидка на наименьший по стоимости прибор в чеке"
      },
      {
        "step": "3 прибора",
        "benefit": "–50% на 3-й прибор",
        "description": "Скидка на наименьший по стоимости прибор в чеке"
      },
      {
        "step": "4 прибора",
        "benefit": "–75% на 4-й прибор",
        "description": "Скидка на наименьший по стоимости прибор в чеке"
      },
      {
        "step": "5 приборов",
        "benefit": "–100% на 5-й прибор",
        "description": "5-й прибор с наименьшей стоимостью предоставляется бесплатно"
      }
    ]
  },
  {
    "id": "promo-evelux-bundle",
    "slug": "evelux-skidki-pri-pokupke-komplekta",
    "brand": "Evelux",
    "brandCountry": "Турция",
    "title": "Скидки при покупке комплекта техники Evelux",
    "subtitle": "Каскадная шкала скидок на кухню",
    "badgeText": "Скидка до 100%",
    "benefitType": "DISCOUNT",
    "discountAmount": "до 100%",
    "endDate": "30 сентября 2026",
    "shortDescription": "Каскадная система скидок на технику EVELUX: скидка до 100% на прибор с наименьшей стоимостью при покупке комплекта до 5 предметов в салоне Симона. Предложение действительно до 30 сентября 2026 года.",
    "fullDescription": "Комплексное оснащение кухни приборами бренда Evelux по выгодной каскадной шкале. При покупке от 2 до 5 приборов крупной бытовой техники вы получаете растущую скидку на прибор с наименьшей ценой.",
    "conditions": [
      "В акции участвует весь ассортимент крупной встраиваемой техники Evelux.",
      "Обязательно включение в комплект духового шкафа Evelux.",
      "Каждый прибор в заказе должен быть из отдельной категории.",
      "Не суммируется с другими специальными предложениями бренда.",
      "Официальная гарантия и хранение на складе до окончания чистовой отделки.",
      "Срок действия программы: до 30 сентября 2026 года."
    ],
    "bannerUrl": "/images/promos/promo-evelux-bundle.jpg",
    "participatingProductSlugs": [
      "bd_4500_posudomoechnaya_mashina",
      "bd_6000_posudomoechnaya_mashina",
      "bd_6002_posudomoechnaya_mashina",
      "bd_4502_posudomoechnaya_mashina",
      "bd_4503_posudomoechnaya_mashina_fix",
      "bd_4501_posudomoechnaya_mashina_fix"
    ],
    "categoryNames": [
      "Духовые шкафы",
      "Варочные панели",
      "Вытяжки",
      "Посудомоечные машины"
    ],
    "isFeatured": true,
    "tiers": [
      {
        "step": "2 прибора",
        "benefit": "–25% на 2-й прибор",
        "description": "Скидка на наименьший по стоимости прибор"
      },
      {
        "step": "3 прибора",
        "benefit": "–50% на 3-й прибор",
        "description": "Скидка на наименьший по стоимости прибор"
      },
      {
        "step": "4 прибора",
        "benefit": "–75% на 4-й прибор",
        "description": "Скидка на наименьший по стоимости прибор"
      },
      {
        "step": "5 приборов",
        "benefit": "–100% на 5-й прибор",
        "description": "Пятый прибор в чеке за 1 рубль"
      }
    ]
  },
  {
    "id": "promo-vard-bundle",
    "slug": "vard-skidki-pri-pokupke-komplekta",
    "brand": "VARD",
    "brandCountry": "Германия",
    "title": "Скидки при покупке комплекта техники VARD",
    "subtitle": "Каскадная выгода на премиальную линейку",
    "badgeText": "Скидка до 100%",
    "benefitType": "DISCOUNT",
    "discountAmount": "до 100%",
    "endDate": "30 сентября 2026",
    "shortDescription": "Каскадная акция на технику VARD: скидки 25%, 50%, 75% и до 100% на наименьший по стоимости прибор при покупке комплекта техники для кухни в салоне Симона до 30 сентября 2026 года.",
    "fullDescription": "Премиальный бренд VARD предлагает каскадную шкалу скидок до 100% при покупке кухонного комплекта, а также гарантированный подарок — набор фирменных мельниц для специй при заказе от двух единиц техники.",
    "conditions": [
      "В акции участвует весь ассортимент бытовой техники VARD (кроме аксессуаров).",
      "При покупке от двух любых единиц техники выдается набор мельниц для специй VARD VSMPS15N в подарок.",
      "Все приборы в комплекте должны быть из разных товарных категорий.",
      "Скидка применяется к прибору с наименьшей розничной стоимостью в чеке.",
      "Акция действует в салонах «СИМОНА» до 30 сентября 2026 года."
    ],
    "bannerUrl": "/images/promos/promo-vard-bundle.jpg",
    "participatingProductSlugs": [
      "voe_684g_duhovoj_shkaf",
      "vpe_681mb_duhovoj_shkaf",
      "voc_444hb_duhovoj_shkaf",
      "vos_684sg_duhovoj_shkaf",
      "vop_682g_duhovoj_shkaf",
      "vps_681mg_duhovoj_shkaf"
    ],
    "categoryNames": [
      "Духовые шкафы",
      "Варочные панели",
      "Вытяжки",
      "Посудомоечные машины"
    ],
    "isFeatured": true,
    "tiers": [
      {
        "step": "2 прибора",
        "benefit": "–25% на прибор + Подарок",
        "description": "Скидка 25% на наименьший прибор + набор мельниц VARD"
      },
      {
        "step": "3 прибора",
        "benefit": "–50% на прибор + Подарок",
        "description": "Скидка 50% на наименьший прибор + набор мельниц VARD"
      },
      {
        "step": "4 прибора",
        "benefit": "–75% на прибор + Подарок",
        "description": "Скидка 75% на наименьший прибор + набор мельниц VARD"
      },
      {
        "step": "5 приборов",
        "benefit": "–100% на прибор + Подарок",
        "description": "Пятый прибор бесплатно + набор мельниц VARD"
      }
    ]
  },
  {
    "id": "promo-vard-plancha",
    "slug": "vard-gril-plancha",
    "brand": "VARD",
    "brandCountry": "Германия",
    "title": "Гриль планча в подарок при покупке варочной панели VARD",
    "subtitle": "Фирменный аксессуар VHA01GP для гурманов",
    "badgeText": "Гриль-планча в подарок",
    "benefitType": "GIFT",
    "discountAmount": "Подарок",
    "endDate": "30 сентября 2026",
    "shortDescription": "Фирменный гриль-планча VARD VHA01GP в подарок при покупке индукционной варочной панели VARD с функцией объединения зон нагрева FlexiBridge в салоне Симона до 30 сентября 2026 года.",
    "fullDescription": "При покупке технологичной индукционной варочной панели VARD с зонами свободного объединения нагрева FlexiBridge вы получаете в подарок профессиональный гриль-планча VARD VHA01GP из литого алюминия с антипригарным покрытием.",
    "conditions": [
      "В акции участвуют индукционные варочные поверхности VARD с функцией объединения зон FlexiBridge.",
      "Подарок предоставляется единовременно с покупкой панели.",
      "Официальная гарантия производителя и авторизованный сервис.",
      "Количество подарков ограничено складским резервом.",
      "Период проведения акции: до 30 сентября 2026 года."
    ],
    "bannerUrl": "/images/promos/promo-vard-plancha.jpg",
    "participatingProductSlugs": [
      "vhi_9552k_varochnaya_panel",
      "vhi_6461k_varochnaya_panel",
      "vhi_6461x_varochnaya_panel",
      "vhh_8462b_varochnaya_panel_s_vytyazhkoj",
      "vhh_6472b_varochnaya_panel_s_vytyazhkoj",
      "vha01gp_gril_plancha"
    ],
    "categoryNames": [
      "Варочные панели",
      "Грили"
    ],
    "isFeatured": true,
    "tiers": [
      {
        "step": "Индукционная панель",
        "benefit": "Гриль-планча VARD",
        "description": "Модель VHA01GP в подарок к варочной панели с FlexiBridge"
      }
    ]
  },
  {
    "id": "promo-falmec-duet",
    "slug": "falmec-skidka-20-na-komplekt1",
    "brand": "Falmec",
    "brandCountry": "Италия",
    "title": "Скидка 20% на комплект: панель и вытяжка Falmec",
    "subtitle": "Итальянский дуэт аспирации и индукции",
    "badgeText": "Скидка 20%",
    "benefitType": "DISCOUNT",
    "discountAmount": "20%",
    "endDate": "30 сентября 2026",
    "shortDescription": "Идеальный дуэт для современной кухни: скидка 20% на комплект из индукционной варочной панели и дизайнерской вытяжки Falmec в салоне Симона. Предложение действует до 30 сентября 2026 года.",
    "fullDescription": "Специальное предложение от итальянского производителя Falmec: при покупке индукционной варочной поверхности и вытяжки с дистанционным управлением предоставляется скидка 20% на весь комплект.",
    "conditions": [
      "В акции участвуют вытяжки Falmec с поддержкой пульта дистанционного управления.",
      "Скидка 20% рассчитывается от действующей розничной цены каждого прибора.",
      "Бесплатное ответственное хранение на складе «СИМОНА» в Нижнем Новгороде.",
      "Программа действует в салонах и интернет-витрине до 30 сентября 2026 года."
    ],
    "bannerUrl": "/images/promos/promo-falmec-duet.jpg",
    "participatingProductSlugs": [
      "vneshnij_motor_slim_800m3_ch",
      "vneshnij_motor_1500_m3_ch_kacl_796_4af",
      "vneshnij_motor_1300_m3_ch_kacl_797_4af",
      "vneshnij_motor_1000m3_ch_kacl_786_41f",
      "pul_t_du_105080053",
      "vneshnij_motor_kacl_78446f"
    ],
    "categoryNames": [
      "Вытяжки",
      "Варочные панели"
    ],
    "isFeatured": true,
    "tiers": [
      {
        "step": "Панель + вытяжка",
        "benefit": "Скидка 20%",
        "description": "На комплект из варочной панели и совместимой вытяжки с ДУ"
      }
    ]
  },
  {
    "id": "promo-falmec-gifts",
    "slug": "falmec-bolshe-podarkov",
    "brand": "Falmec",
    "brandCountry": "Италия",
    "title": "Больше подарков: аксессуары и фильтры Falmec",
    "subtitle": "Пульт ДУ и угольные фильтры High Performance",
    "badgeText": "Фильтры и ДУ в подарок",
    "benefitType": "GIFT",
    "discountAmount": "Подарок",
    "endDate": "30 сентября 2026",
    "shortDescription": "Интегрированные модели Falmec с ценными подарками: пульт ДУ, угольные фильтры High Performance и фирменные аксессуары в подарок при покупке премиальных вытяжек Falmec до 30 сентября 2026 года.",
    "fullDescription": "Приобретая флагманские вытяжные системы и варочные панели со встроенной вытяжкой от Falmec, вы получаете ценные подарки — планшеты Apple iPad или беспроводные пылесосы Dreame.",
    "conditions": [
      "Подарок выдается при покупке указанных флагманских моделей Falmec.",
      "Количество подарков ограничено стоком производителя.",
      "Бесплатная бережная доставка по Нижнему Новгороду и области.",
      "Период действия специального предложения: до 30 сентября 2026 года."
    ],
    "bannerUrl": "/images/promos/promo-falmec-gifts.jpg",
    "participatingProductSlugs": [
      "level_one_varochnaya_panel_s_vytyazhkoj",
      "brera_varochnaya_panel_s_vytyazhkoj"
    ],
    "categoryNames": [
      "Вытяжки"
    ],
    "isFeatured": true,
    "tiers": [
      {
        "step": "LEVEL ONE / BRERA",
        "benefit": "Apple iPad 11\"",
        "description": "Планшет Apple iPad 11\" Wi-Fi в подарок"
      },
      {
        "step": "QUANTUM",
        "benefit": "Apple iPad 11\"",
        "description": "Планшет Apple iPad 11\" Wi-Fi в подарок"
      },
      {
        "step": "Серия ZERO",
        "benefit": "Пылесос Dreame",
        "description": "Беспроводной пылесос Dreame R10s Pro в подарок"
      }
    ]
  },
  {
    "id": "promo-falmec-bundle",
    "slug": "falmec-new-actions",
    "brand": "Falmec",
    "brandCountry": "Италия",
    "title": "Скидки при покупке комплекта техники Falmec",
    "subtitle": "Специальные условия на вытяжные системы Circle.Tech",
    "badgeText": "Выгода до 15%",
    "benefitType": "DISCOUNT",
    "discountAmount": "15%",
    "endDate": "30 сентября 2026",
    "shortDescription": "Специальные скидки на комплекты итальянской техники Falmec: экономия до 15% при единовременном заказе приборов бренда в салоне Симона до 30 сентября 2026 года.",
    "fullDescription": "Комплексная скидка на итальянскую технику и кухонные системы Falmec. При одновременном заказе мойки, смесителя, вытяжки и варочной панели ваша выгода достигает 20%.",
    "conditions": [
      "Скидка начисляется на общую сумму акционных приборов Falmec в чеке.",
      "Приборы должны соответствовать актуальному каталогу производителя.",
      "Возможность бесплатного хранения на складе до готовности кухонного гарнитура.",
      "Срок проведения акции: до 30 сентября 2026 года."
    ],
    "bannerUrl": "/images/promos/promo-falmec-bundle.jpg",
    "participatingProductSlugs": [
      "brera_varochnaya_panel_s_vytyazhkoj"
    ],
    "categoryNames": [
      "Вытяжки",
      "Варочные панели"
    ],
    "isFeatured": true,
    "tiers": [
      {
        "step": "Мойка + смеситель",
        "benefit": "Скидка 5%",
        "description": "На комплект кухонной сантехники Falmec"
      },
      {
        "step": "+ Вытяжка",
        "benefit": "Скидка 10%",
        "description": "При добавлении в комплект вытяжки Falmec"
      },
      {
        "step": "+ Варочная панель",
        "benefit": "Скидка 20%",
        "description": "Максимальная скидка при заказе 4 предметов Falmec"
      }
    ]
  },
  {
    "id": "promo-evelux-34",
    "slug": "evelux-34",
    "brand": "Evelux",
    "brandCountry": "Турция",
    "title": "Акция 3=4: четвертый прибор Evelux в подарок",
    "subtitle": "Комплексное оснащение кухни с максимальной выгодой",
    "badgeText": "4-й прибор бесплатно",
    "benefitType": "GIFT",
    "discountAmount": "100% на 4-й",
    "endDate": "30 сентября 2026",
    "shortDescription": "Специальная акция 3=4 от бренда EVELUX: при покупке трех предметов крупной бытовой техники четвертый прибор с наименьшей стоимостью предоставляется в подарок! Акция действует до 30 сентября 2026 года.",
    "fullDescription": "Уникальное предложение для полного оснащения кухни: при заказе четырех приборов крупной бытовой техники Evelux четвертый предмет с наименьшей стоимостью предоставляется в подарок (скидка 100%).",
    "conditions": [
      "Обязательно наличие в комплекте встраиваемого духового шкафа Evelux.",
      "Все четыре прибора должны быть из разных товарных категорий.",
      "В акции участвует крупная встраиваемая бытовая техника бренда.",
      "Официальная гарантия производителя на всю технику в чеке.",
      "Акция действует до 30 сентября 2026 года."
    ],
    "bannerUrl": "/images/promos/promo-evelux-34.jpg",
    "participatingProductSlugs": [
      "bd_4500_posudomoechnaya_mashina",
      "bd_6000_posudomoechnaya_mashina",
      "bd_6002_posudomoechnaya_mashina",
      "bd_4502_posudomoechnaya_mashina",
      "bd_4503_posudomoechnaya_mashina_fix",
      "bd_4501_posudomoechnaya_mashina_fix"
    ],
    "categoryNames": [
      "Духовые шкафы",
      "Варочные панели",
      "Вытяжки",
      "Посудомоечные машины"
    ],
    "isFeatured": true,
    "tiers": [
      {
        "step": "Комплект 4 прибора",
        "benefit": "4-й прибор в подарок",
        "description": "Прибор с наименьшей ценой отгружается бесплатно"
      }
    ]
  },
  {
    "id": "promo-falmec-sinks",
    "slug": "falmec-water-50",
    "brand": "Falmec",
    "brandCountry": "Италия",
    "title": "Скидка 50% на мойки и смесители Falmec",
    "subtitle": "При покупке вытяжки или варочной панели",
    "badgeText": "Скидка 50% на воду",
    "benefitType": "DISCOUNT",
    "discountAmount": "50%",
    "endDate": "30 сентября 2026",
    "shortDescription": "Скидка 50% на итальянские мойки и смесители Falmec при одновременной покупке вытяжки или варочной панели бренда в салоне бытовой техники Симона. Акция продлена до 30 сентября 2026 года.",
    "fullDescription": "Эксклюзивная выгода для кухни: при покупке вытяжки или варочной панели Falmec вы получаете скидку 50% на любую дизайнерскую кухонную мойку или смеситель из премиальной коллекции бренда.",
    "conditions": [
      "Скидка 50% предоставляется на мойку и/или смеситель Falmec при наличии вытяжки или варочной панели в заказе.",
      "Аксессуары для моек в акции не участвуют.",
      "Бесплатное хранение на складе «СИМОНА» в Нижнем Новгороде.",
      "Акция продлена до 30 сентября 2026 года."
    ],
    "bannerUrl": "/images/promos/promo-falmec-sinks.jpg",
    "participatingProductSlugs": [
      "kacl_987_steel_slivnoj_klapan",
      "kacl_984_poddon_dlya_sushki",
      "kacl_983_poddon_dlya_sushki",
      "kacl_982_kollander",
      "kacl_987_white_avtomaticheskij_slivnoj_klapan",
      "kacl_993_mnogofunkcional_naya_doska"
    ],
    "categoryNames": [
      "Мойки и смесители",
      "Вытяжки"
    ],
    "isFeatured": true,
    "tiers": [
      {
        "step": "Вытяжка или панель",
        "benefit": "–50% на мойку и смеситель",
        "description": "Половина стоимости на кухонную сантехнику Falmec"
      }
    ]
  },
  {
    "id": "promo-korting-ksi17545",
    "slug": "skidka-50-holodilnik-korting-ksi-17545-cfnf-kuhni-pro",
    "brand": "Körting",
    "brandCountry": "Германия",
    "title": "Скидка 50% на холодильник Körting KSI 17545 CFNF (Кухни PRO)",
    "subtitle": "При заказе духового шкафа специальной серии",
    "badgeText": "Скидка 50% на холод",
    "benefitType": "DISCOUNT",
    "discountAmount": "50%",
    "endDate": "30 сентября 2026",
    "shortDescription": "Скидка 50% на встраиваемый холодильник Körting KSI 17545 CFNF при покупке комплекта техники: встраиваемый духовой шкаф из специальной линейки «Кухни PRO» + еще один прибор Körting в салоне Симона.",
    "fullDescription": "Специальная партнерская программа от Körting и салона «СИМОНА»: приобретая духовой шкаф из линейки «Кухни PRO» и второй крупный прибор бренда, вы получаете передовой встраиваемый холодильник Körting KSI 17545 CFNF за полцены.",
    "conditions": [
      "В комплекте обязательно наличие духового шкафа серии «Кухни PRO» (с индексом Кухни).",
      "Второй прибор — крупная техника Körting (варочная панель, вытяжка или посудомойка).",
      "Скидка 50% распространяется строго на встраиваемый холодильник KSI 17545 CFNF.",
      "Бесплатное ответственное хранение на складе до окончания ремонта.",
      "Предложение действительно до 30 сентября 2026 года."
    ],
    "bannerUrl": "/images/promos/promo-korting-ksi17545.jpg",
    "participatingProductSlugs": [
      "okb_3221_agn_steam_mw_duhovoj_shkaf_fix",
      "okb_61061_sqgw_duhovoj_shkaf",
      "okb_61031_qgn_duhovoj_shkaf",
      "okb_61061_sqggr_duhovoj_shkaf",
      "okb_61061_sqgn_duhovoj_shkaf",
      "okb_6071_cn_duhovoj_shkaf",
      "ksi_17545_cfnf_holodil_nik"
    ],
    "categoryNames": [
      "Холодильники",
      "Духовые шкафы"
    ],
    "isFeatured": true,
    "tiers": [
      {
        "step": "Духовой шкаф PRO + прибор",
        "benefit": "–50% на холодильник",
        "description": "Экономия половины стоимости на модель Körting KSI 17545 CFNF"
      }
    ]
  },
  {
    "id": "promo-korting-formula",
    "slug": "korting-formula-vygody-sentyabr-2026",
    "brand": "Körting",
    "brandCountry": "Германия",
    "title": "Формула выгоды: подарки за покупку комплекта Körting",
    "subtitle": "Вытяжка, духовой шкаф или посудомоечная машина в подарок",
    "badgeText": "Крупная техника в подарок",
    "benefitType": "GIFT",
    "discountAmount": "Подарок",
    "endDate": "30 сентября 2026",
    "shortDescription": "Подарки при покупке комплекта техники KÖRTING: при покупке 2 приборов — вытяжка в подарок, 3 приборов — духовой шкаф в подарок, 4 приборов — посудомоечная машина в подарок!",
    "fullDescription": "Программа «Формула выгоды» от Körting дарит крупную встраиваемую технику при покупке кухонного сета. В зависимости от объема заказа вы получаете в подарок вытяжку, духовой шкаф или посудомоечную машину.",
    "conditions": [
      "В акции участвует крупная бытовая техника Körting (кроме соло-микроволновок и 2-конфорочных поверхностей).",
      "Все приборы в комплекте должны быть из разных категорий.",
      "Подарочные приборы отгружаются вместе с заказом.",
      "Бесплатное хранение на складе «СИМОНА» до окончания ремонта.",
      "Период проведения акции: до 30 сентября 2026 года."
    ],
    "bannerUrl": "/images/promos/promo-korting-formula.jpg",
    "participatingProductSlugs": [
      "khi_6393_n_vytyazhka",
      "okb_3810_fgn_duhovoj_shkaf",
      "kdi_45140_posudomoechnaya_mashina",
      "kdi_60110_posudomoechnaya_mashina"
    ],
    "categoryNames": [
      "Духовые шкафы",
      "Вытяжки",
      "Посудомоечные машины"
    ],
    "isFeatured": true,
    "tiers": [
      {
        "step": "2 прибора",
        "benefit": "Вытяжка в подарок",
        "description": "Полновстраиваемая вытяжка Körting KHI 6393 N"
      },
      {
        "step": "3 прибора",
        "benefit": "Духовой шкаф в подарок",
        "description": "Электрический духовой шкаф Körting OKB 3810 FGN"
      },
      {
        "step": "4 прибора",
        "benefit": "Посудомоечная машина",
        "description": "KDI 45140 или KDI 60110 на выбор в подарок"
      }
    ]
  },
  {
    "id": "promo-jackys-cascade",
    "slug": "jackys-kaskad-2026",
    "brand": "Jacky's",
    "brandCountry": "Великобритания",
    "title": "Скидки до 100% на технику Jacky's при покупке комплекта",
    "subtitle": "Каскадная шкала выгоды на английскую технику",
    "badgeText": "Скидка до 100%",
    "benefitType": "DISCOUNT",
    "discountAmount": "до 100%",
    "endDate": "31 октября 2026",
    "shortDescription": "Специальное предложение от Jacky's: скидки до 100% на прибор с наименьшей стоимостью при покупке комплекта техники в салоне Симона.",
    "fullDescription": "Каскадная программа скидок на европейскую технику Jacky's. При заказе комплекта для кухни вы получаете возрастающую скидку на наименьший по стоимости прибор — вплоть до 100%.",
    "conditions": [
      "В акции участвует весь актуальный ассортимент техники Jacky's.",
      "Все приборы в комплекте должны относиться к разным категориям.",
      "Скидка предоставляется на прибор с наименьшей стоимостью.",
      "Официальная гарантия производителя и авторизованный сервис.",
      "Срок действия акции: до 31 октября 2026 года."
    ],
    "bannerUrl": "/images/promos/promo-jackys-cascade.jpg",
    "participatingProductSlugs": [
      "jw_8w12t3_stiral_naya_mashina",
      "jw_8tc41n_stiral_naya_mashina",
      "jw_f0944btd2_stiral_naya_mashina",
      "jw_105w14t3_stiral_naya_mashina",
      "jw_f1223btb_stiral_naya_mashina",
      "jw_6w12l0n_stiral_naya_mashina"
    ],
    "categoryNames": [
      "Духовые шкафы",
      "Варочные панели",
      "Холодильники",
      "Стиральные машины"
    ],
    "isFeatured": true,
    "tiers": [
      {
        "step": "2 прибора",
        "benefit": "–25% на 2-й прибор",
        "description": "Скидка на наименьший по стоимости прибор в чеке"
      },
      {
        "step": "3 прибора",
        "benefit": "–50% на 3-й прибор",
        "description": "Скидка на наименьший по стоимости прибор в чеке"
      },
      {
        "step": "4 прибора",
        "benefit": "–75% на 4-й прибор",
        "description": "Скидка на наименьший по стоимости прибор в чеке"
      },
      {
        "step": "5 приборов",
        "benefit": "–100% на 5-й прибор",
        "description": "Пятый прибор в чеке предоставляется бесплатно"
      }
    ]
  },
  {
    "id": "promo-smeg-laundry",
    "slug": "smeg-skidka-stiralnye-sushilnye-mashiny-2026",
    "brand": "SMEG",
    "brandCountry": "Италия",
    "title": "Скидка до 15% на стиральные и сушильные машины SMEG",
    "subtitle": "Итальянский уход за деликатными тканями",
    "badgeText": "Скидка до 15%",
    "benefitType": "DISCOUNT",
    "discountAmount": "15%",
    "endDate": "28 сентября 2026",
    "shortDescription": "Скидка 10% при покупке от 1 прибора и скидка 15% при покупке комплекта стиральной и сушильной машины SMEG (включая встраиваемые модели) в салоне Симона.",
    "fullDescription": "Премиальный уход за гардеробом от итальянского производителя SMEG. Скидка 10% на единичный прибор и 15% при покупке комплекта стиральной и сушильной машин, включая встраиваемые модификации.",
    "conditions": [
      "В акции участвуют отдельностоящие и встраиваемые стиральные и сушильные машины SMEG.",
      "Скидка рассчитывается от действующей розничной цены.",
      "Бесплатное хранение на складе «СИМОНА» в Нижнем Новгороде.",
      "Срок действия акции: до 28 сентября 2026 года."
    ],
    "bannerUrl": "/images/promos/promo-smeg-laundry.jpg",
    "participatingProductSlugs": [
      "podstavka_dlya_wok_kit0160040",
      "lgcn_soedinitel_naya_planka",
      "wokghu_kol_co_wok_iz_chuguna",
      "6mp800p_nabor_ruchek",
      "6mp_1pgf_nabor_iz_6_ruchek_dlya_varochnyh_panelej",
      "5mp_700ao_nabor_iz_5_ruchek_dlya_varochnyh_panelej"
    ],
    "categoryNames": [
      "Стиральные машины",
      "Сушильные машины"
    ],
    "isFeatured": true,
    "tiers": [
      {
        "step": "1 прибор для стирки",
        "benefit": "Скидка 10%",
        "description": "На любую стиральную или сушильную машину SMEG"
      },
      {
        "step": "Комплект для стирки",
        "benefit": "Скидка 15%",
        "description": "На комплект из стиральной и сушильной машины"
      }
    ]
  },
  {
    "id": "promo-vard-15",
    "slug": "vard-vygoda-15-populyarnye-modeli-2026",
    "brand": "VARD",
    "brandCountry": "Германия",
    "title": "Выгода 15% на выделенный ассортимент бытовой техники VARD",
    "subtitle": "Специальные цены на популярные модели месяца",
    "badgeText": "Скидка 15%",
    "benefitType": "DISCOUNT",
    "discountAmount": "15%",
    "endDate": "30 сентября 2026",
    "shortDescription": "С 1 по 30 сентября 2026 года действует специальная скидка 15% на популярные модели бытовой техники VARD в салоне Симона.",
    "fullDescription": "Специальное сентябрьское предложение на популярные модели премиальной техники VARD. Прямая скидка 15% на выбранные духовые шкафы, варочные панели и посудомоечные машины.",
    "conditions": [
      "В акции участвуют избранные модели техники VARD из складского наличия.",
      "Цены в салоне и на сайте указаны с учетом скидки 15%.",
      "Официальная расширенная гарантия производителя.",
      "Бесплатное ответственное хранение на складе «СИМОНА».",
      "Период проведения акции: до 30 сентября 2026 года."
    ],
    "bannerUrl": "/images/promos/promo-vard-15.jpg",
    "participatingProductSlugs": [
      "voe_684g_duhovoj_shkaf",
      "vpe_681mb_duhovoj_shkaf",
      "voc_444hb_duhovoj_shkaf",
      "vos_684sg_duhovoj_shkaf",
      "vop_682g_duhovoj_shkaf",
      "vps_681mg_duhovoj_shkaf"
    ],
    "categoryNames": [
      "Духовые шкафы",
      "Варочные панели",
      "Холодильники"
    ],
    "isFeatured": true,
    "tiers": [
      {
        "step": "Выделенный пул SKU",
        "benefit": "Скидка 15%",
        "description": "Прямое снижение цены на популярные модели VARD"
      }
    ]
  },
  {
    "id": "promo-smeg-autumn",
    "slug": "smeg-osen-v-stile-smeg-2026",
    "brand": "SMEG",
    "brandCountry": "Италия",
    "title": "«Осень в стиле SMEG»: скидка 20% на малую технику 50’s Style",
    "subtitle": "Дизайнерские чайники, тостеры, блендеры и кофемашины",
    "badgeText": "Скидка 20%",
    "benefitType": "DISCOUNT",
    "discountAmount": "20%",
    "endDate": "28 сентября 2026",
    "shortDescription": "Специальная осенняя акция от SMEG в салоне Симона: скидка 20% на дизайнерскую малую бытовую технику избранных коллекций с 7 по 28 сентября 2026 года.",
    "fullDescription": "Культовая ретро-эстетика 50's Style на вашей кухне. Итальянский бренд SMEG дарит скидку 20% на малую бытовую технику — чайники, тостеры, кофемашины, блендеры и миксеры в классических пастельных и ярких цветах.",
    "conditions": [
      "В акции участвует серийная малая техника SMEG стиля 50-х годов.",
      "Палитра включает кремовый, пастельный голубой, черный, красный, розовый и белый цвета.",
      "Количество приборов по промо-цене ограничено складским наличием.",
      "Срок действия акции: до 28 сентября 2026 года."
    ],
    "bannerUrl": "/images/promos/promo-smeg-autumn.jpg",
    "participatingProductSlugs": [
      "cof_01wheu_mini_pech",
      "pic_01whmeu_nastol_naya_plita",
      "cof_01bleu_mini_pech",
      "cof_01pgeu_mini_pech",
      "moc_02egmeu_mikrovolnovaya_pech",
      "egf_03wheu_kofemashina",
      "moc_01egmeu_mikrovolnovaya_pech",
      "egf_03rdeu_kofemashina"
    ],
    "categoryNames": [
      "Малая бытовая техника",
      "Кофемашины",
      "Чайники и тостеры"
    ],
    "isFeatured": true,
    "tiers": [
      {
        "step": "Коллекция 50's Style",
        "benefit": "Скидка 20%",
        "description": "На чайники, тостеры, кофемашины, блендеры и миксеры"
      }
    ]
  },
  {
    "id": "promo-evelux-gifts",
    "slug": "evelux-pokupka-eto-podarok-2026",
    "brand": "Evelux",
    "brandCountry": "Турция",
    "title": "Покупка – это подарок: весы, чайник или блендер Evelux",
    "subtitle": "Подарки при покупке техники от 10 000, 20 000 и 30 000 ₽",
    "badgeText": "Подарки к заказу",
    "benefitType": "GIFT",
    "discountAmount": "Подарок",
    "endDate": "30 сентября 2026",
    "shortDescription": "Подарки от бренда EVELUX при покупке техники в салоне Симона: напольные весы от 10 000 руб., стеклянный чайник от 20 000 руб. и блендер от 30 000 руб. Срок акции до 30 сентября 2026 года.",
    "fullDescription": "Полезные подарки при заказе техники Evelux для кухни и дома в салоне «СИМОНА». В зависимости от суммы покупки вы получаете электронные весы, дизайнерский стеклянный чайник или мощный погружной блендер.",
    "conditions": [
      "В акции участвует крупная бытовая техника бренда Evelux.",
      "Все приборы в заказе должны быть из разных категорий.",
      "Подарки выдаются при оформлении покупки в салоне или на сайте.",
      "Бесплатное хранение на складе «СИМОНА» до окончания отделочных работ.",
      "Акция действует до 30 сентября 2026 года."
    ],
    "bannerUrl": "/images/promos/promo-evelux-gifts.jpg",
    "participatingProductSlugs": [
      "ebs_1001_vesy_kuhonnye",
      "kcm_1001_ex_kofevarka",
      "soedinitel_80mm_227_94_kit0121001",
      "ewk_0902_g_chajnik_el_fix",
      "ewk_0904_g_chajnik_el_fix",
      "ewk_0903_g_chajnik_el_fix",
      "kwk_0904_infinity_chajnik_el",
      "ehb_0301_b_blender_pogruzhnoj_fix"
    ],
    "categoryNames": [
      "Духовые шкафы",
      "Варочные панели",
      "Вытяжки"
    ],
    "isFeatured": true,
    "tiers": [
      {
        "step": "от 10 000 ₽",
        "benefit": "Напольные весы",
        "description": "Электронные весы Evelux EBS 1001 в подарок"
      },
      {
        "step": "от 20 000 ₽",
        "benefit": "Стеклянный чайник",
        "description": "Чайник Evelux EWK 0904 G с подсветкой в подарок"
      },
      {
        "step": "от 30 000 ₽",
        "benefit": "Погружной блендер",
        "description": "Блендер Evelux EHB 0301 B с насадками в подарок"
      }
    ]
  },
  {
    "id": "promo-elica-virtus",
    "slug": "elica-komfortnoe-budushchee-virtus-2026",
    "brand": "ELICA",
    "brandCountry": "Италия",
    "title": "Телескопические направляющие к духовым шкафам ELICA Virtus",
    "subtitle": "Комплект направляющих за 1 рубль к премиум-духовкам",
    "badgeText": "Направляющие за 1 ₽",
    "benefitType": "SPECIAL_PRICE",
    "discountAmount": "1 ₽",
    "endDate": "30 сентября 2026",
    "shortDescription": "Специальное предложение от итальянского бренда ELICA: комплект телескопических направляющих всего за 1 рубль при покупке духового шкафа серии Virtus в салоне Симона до 30 сентября 2026 года.",
    "fullDescription": "Итальянский бренд ELICA дарит комфорт кулинарного творчества. При покупке премиального духового шкафа серии ELICA Virtus вы получаете фирменный комплект телескопических направляющих всего за 1 рубль.",
    "conditions": [
      "Предложение распространяется на духовые шкафы ELICA VIRTUS (MULTI 60 DD, MULTI 60 TFT, MULTI 90 TFT).",
      "Телескопические направляющие отгружаются единовременно с духовым шкафом.",
      "Официальная гарантия и авторизованное сервисное обслуживание.",
      "Период проведения акции: до 30 сентября 2026 года."
    ],
    "bannerUrl": "/images/promos/promo-elica-virtus.jpg",
    "participatingProductSlugs": [
      "virtus_multi_60_tft_bl_duhovoj_shkaf1",
      "virtus_multi_60_dd_bl_duhovoj_shkaf1",
      "virtus_multi_90_tft_bl_duhovoj_shkaf1",
      "virtus_multi_60_tft_pyro_bl_duhovoj_shkaf",
      "inpush_60_b_vytyazhka",
      "virtus_warm_drawer_60_pp_bl_podogrevatel_posudy",
      "ingrid_60_x_vytyazhka_fix",
      "dw60epr_21_posudomoechnaya_mashina"
    ],
    "categoryNames": [
      "Духовые шкафы",
      "Аксессуары"
    ],
    "isFeatured": true,
    "tiers": [
      {
        "step": "Духовой шкаф Virtus",
        "benefit": "Направляющие за 1 ₽",
        "description": "Оригинальный комплект KIT0204339 для плавного выдвижения противней"
      }
    ]
  },
  {
    "id": "promo-elica-duet",
    "slug": "elica-osennij-duet-connex-2026",
    "brand": "ELICA",
    "brandCountry": "Италия",
    "title": "Осенний дуэт: скидка 50% на вытяжку к варочной панели ELICA",
    "subtitle": "Скидка на дизайнерские вытяжки при заказе панелей CONNEX",
    "badgeText": "Скидка 50% на вытяжку",
    "benefitType": "DISCOUNT",
    "discountAmount": "50%",
    "endDate": "30 сентября 2026",
    "shortDescription": "Скидка 50% на дизайнерские вытяжки серии ELICA @ при покупке индукционной варочной поверхности серии ELICA CONNEX в салоне Симона с 1 по 30 сентября 2026 года.",
    "fullDescription": "Инновационный дуэт от ELICA: при покупке индукционной варочной панели серии CONNEX с беспроводной связью вы получаете скидку 50% на вытяжку из дизайнерской линейки ELICA @.",
    "conditions": [
      "Основной прибор — индукционная варочная панель серии ELICA CONNEX.",
      "Второй прибор — дизайнерская вытяжка серии ELICA @ (Adele, Majestic, Haiku, Hidden, Plat, Stripe и др.).",
      "Бесплатное хранение на складе «СИМОНА» до окончания ремонта.",
      "Срок действия акции: до 30 сентября 2026 года."
    ],
    "bannerUrl": "/images/promos/promo-elica-duet.jpg",
    "participatingProductSlugs": [
      "ratio_302_plus_bl_varochnaya_panel",
      "ratio_874_slim_bl_varochnaya_panel",
      "ratio_804_plus_bl_varochnaya_panel",
      "ratio_603_bl_varochnaya_panel",
      "ratio_702_bl_varochnaya_panel",
      "ratio_connex_604_plus_bl_varochnaya_panel",
      "ratio_connex_603_plus_bl_varochnaya_panel",
      "ratio_connex_803_plus_bl_varochnaya_panel"
    ],
    "categoryNames": [
      "Варочные панели",
      "Вытяжки"
    ],
    "isFeatured": true,
    "tiers": [
      {
        "step": "Панель ELICA CONNEX",
        "benefit": "–50% на вытяжку ELICA @",
        "description": "Половина стоимости вытяжки при синхронном заказе с панелью"
      }
    ]
  },
  {
    "id": "promo-jackys-special-prices",
    "slug": "jackys-specialnye-promo-ceny-2026",
    "brand": "Jacky's",
    "brandCountry": "Великобритания",
    "title": "Выгодные промо-цены на популярные модели Jacky's",
    "subtitle": "Специальные цены на крупную бытовую технику",
    "badgeText": "Специальные цены",
    "benefitType": "SPECIAL_PRICE",
    "discountAmount": "Спеццена",
    "endDate": "30 октября 2026",
    "shortDescription": "Специальные промо-цены на технику JACKY'S в салоне Симона: скидки на духовые шкафы, варочные панели, вытяжки, посудомоечные машины и холодильники до 30 октября 2026 года.",
    "fullDescription": "Ограниченное ценовое предложение от европейского бренда Jacky's. Специальные сниженные цены на востребованные модели духовых шкафов, варочных поверхностей, посудомоечных машин и холодильников.",
    "conditions": [
      "Специальные цены действуют на выделенный пул моделей крупной техники Jacky's.",
      "Цены на сайте и в салонах указаны с учетом скидки.",
      "Официальная гарантия производителя и бережная доставка от салона «СИМОНА».",
      "Период действия акции: до 30 октября 2026 года."
    ],
    "bannerUrl": "/images/promos/promo-jackys-special-prices.jpg",
    "participatingProductSlugs": [
      "jw_8tc41n_stiral_naya_mashina",
      "jr_fw568en_holodil_nik",
      "jw_6w12l0n_stiral_naya_mashina",
      "jw_s0822b2_stiral_naya_mashina",
      "jw_6tc21_stiral_naya_mashina",
      "jr_fd2000_holodil_nik",
      "jr_fd526v_holodil_nik"
    ],
    "categoryNames": [
      "Стиральные машины",
      "Холодильники",
      "Духовые шкафы",
      "Посудомоечные машины"
    ],
    "isFeatured": true,
    "tiers": [
      {
        "step": "Выделенный пул SKU",
        "benefit": "Специальные цены",
        "description": "Фиксированные промо-цены на европейскую технику Jacky's"
      }
    ]
  }
];

export function getFeaturedPromos(): ManufacturerPromo[] {
  return MANUFACTURER_PROMOS.filter((p) => p.isFeatured);
}

export function getPromoBySlug(slug: string): ManufacturerPromo | undefined {
  return MANUFACTURER_PROMOS.find((p) => p.slug === slug);
}

export function getPromosForProduct(product: ProductItem): ManufacturerPromo[] {
  return MANUFACTURER_PROMOS.filter(
    (promo) =>
      promo.participatingProductSlugs?.includes(product.slug) ||
      (product.promoSlugs && product.promoSlugs.includes(promo.slug))
  );
}

export function isProductInPromo(product: ProductItem, promoSlug: string): boolean {
  return (
    Boolean(product.promoSlugs?.includes(promoSlug)) ||
    MANUFACTURER_PROMOS.some(
      (p) => p.slug === promoSlug && p.participatingProductSlugs?.includes(product.slug)
    )
  );
}

export function getPromosForCategory(categoryName: string): ManufacturerPromo[] {
  if (!categoryName) return [];
  const norm = categoryName.toLowerCase();
  return MANUFACTURER_PROMOS.filter((promo) =>
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

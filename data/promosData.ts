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
    "fullDescription": "\n<p>В акции участвует весь ассортимент бытовой техники бренда Körting.</p>\n<p><strong>Подарки предоставляются:</strong></p>\n<ul>\n<li>При покупке приборов на сумму 10 000 руб. – в подарок предоставляется электрический штопор KWO 0010-PR2:<br />#action_items#</li>\n<li>При покупке приборов на сумму 25 000 руб. – в подарок предоставляется погружной блендер KHB 0317 W Tulip:<br />#action_items2#</li>\n<li>При покупке приборов на сумму 50 000 руб. – в подарок предоставляется гриль KGPA 0403 W Infinity:<br />#action_items3#</li>\n<li>При покупке приборов на сумму 75 000 руб. – в подарок предоставляется дегидратор KFD 2403 Pro S:<br />#action_items4#</li>\n</ul>\n<p><strong>Условия проведения акции:</strong></p>\n<ul>\n<li>Все приборы в комплекте должны быть из разных товарных категорий.</li>\n<li>Все приборы в комплекте должны соответствовать актуальному ассортименту Körting и быть в наличии на момент покупки.</li>\n<li>Акции не пересекаются.</li>\n<li>Количество подарков ограничено.</li>\n<li>Организатор оставляет за собой право на преждевременную остановку акции и изменение ее сроков.</li>\n</ul>\n<p><em>Период проведения акции: с 1 сентября по 31 октября 2026 года.</em></p>",
    "conditions": [
      "При покупке приборов на сумму 10 000 руб. – в подарок предоставляется электрический штопор KWO 0010-PR2:#action_items#",
      "При покупке приборов на сумму 25 000 руб. – в подарок предоставляется погружной блендер KHB 0317 W Tulip:#action_items2#",
      "При покупке приборов на сумму 50 000 руб. – в подарок предоставляется гриль KGPA 0403 W Infinity:#action_items3#",
      "При покупке приборов на сумму 75 000 руб. – в подарок предоставляется дегидратор KFD 2403 Pro S:#action_items4#",
      "Все приборы в комплекте должны быть из разных товарных категорий.",
      "Все приборы в комплекте должны соответствовать актуальному ассортименту Körting и быть в наличии на момент покупки.",
      "Акции не пересекаются.",
      "Количество подарков ограничено.",
      "Организатор оставляет за собой право на преждевременную остановку акции и изменение ее сроков."
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
    "isFeatured": true
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
    "fullDescription": "<p></p>\r\n<p>Уточняйте условия акции в салонах СИМОНА или по телефону.</p>",
    "conditions": [
      "Акция действует в салонах СИМОНА и при оформлении заказа на сайте.",
      "Предложение суммируется с бесплатным ответственным хранением на складе в Нижнем Новгороде.",
      "Официальная гарантия производителя с авторизованным сервисным обслуживанием.",
      "Количество акционных приборов ограничено наличием на складе."
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
    "isFeatured": true
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
    "fullDescription": "<p style=\"text-align: justify;\"></p>\r\n<p style=\"text-align: justify;\">Скидки при покупке комплекта:</p>\r\n<ol>\r\n<li style=\"text-align: justify;\">В акции участвует весь ассортимент техники KORTING, кроме мелкой бытовой техники.</li>\r\n<li style=\"text-align: justify;\">Размер скидки составляет:\r\n<ul>\r\n<li style=\"text-align: justify;\">при покупке двух приборов, скидка на наименьший по стоимости — 25%</li>\r\n<li>при покупке трех приборов, скидка на наименьший по стоимости — 50%</li>\r\n<li>при покупке четырех приборов, скидка на наименьший по стоимости — 75%</li>\r\n<li>при покупке пяти приборов, скидка на наименьший по стоимости −100%</li>\r\n</ul>\r\n</li>\r\n<li style=\"text-align: justify;\"><strong>В комплекте обязательно наличие духового шкафа.</strong></li>\r\n<li style=\"text-align: justify;\">Все приборы в комплекте должны быть из разных товарных категорий.</li>\r\n<li style=\"text-align: justify;\">Организатор оставляет за собой право на преждевременную остановку акции и изменение ее сроков.</li>\r\n</ol>\r\n<p>Подробности уточняйте у наших менеджеров в салонах продаж и по телефону <strong>(831) 423 76 00</strong></p>",
    "conditions": [
      "при покупке трех приборов, скидка на&nbsp;наименьший по&nbsp;стоимости&nbsp;&mdash; 50%",
      "при покупке четырех приборов, скидка на&nbsp;наименьший по&nbsp;стоимости&nbsp;&mdash; 75%",
      "при покупке пяти приборов, скидка на&nbsp;наименьший по&nbsp;стоимости &minus;100%"
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
    "isFeatured": true
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
    "fullDescription": "<p></p>\r\n<ol>\r\n<li style=\"text-align: justify;\">В акции участвует весь ассортимент техники Evelux, кроме мелкой бытовой техники.</li>\r\n<li style=\"text-align: justify;\">Размер скидки составляет:\r\n<ul>\r\n<li>при покупке двух приборов, скидка на наименьший по стоимости — 25%</li>\r\n<li>при покупке трех приборов, скидка на наименьший по стоимости — 50%</li>\r\n<li>при покупке четырех приборов, скидка на наименьший по стоимости — 75%</li>\r\n<li>при покупке пяти приборов, скидка на наименьший по стоимости −100%</li>\r\n</ul>\r\n</li>\r\n<li style=\"text-align: justify;\"><strong>В комплекте обязательно наличие духового шкафа.</strong></li>\r\n<li style=\"text-align: justify;\">Все приборы в комплекте должны быть из разных товарных категорий.</li>\r\n<li style=\"text-align: justify;\">Организатор оставляет за собой право на преждевременную остановку акции и изменение ее сроков.</li>\r\n</ol>",
    "conditions": [
      "при покупке двух приборов, скидка на&nbsp;наименьший по&nbsp;стоимости&nbsp;&mdash; 25%",
      "при покупке трех приборов, скидка на&nbsp;наименьший по&nbsp;стоимости&nbsp;&mdash; 50%",
      "при покупке четырех приборов, скидка на&nbsp;наименьший по&nbsp;стоимости&nbsp;&mdash; 75%",
      "при покупке пяти приборов, скидка на&nbsp;наименьший по&nbsp;стоимости &minus;100%"
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
    "isFeatured": true
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
    "fullDescription": "<p></p>\r\n<p>В акции участвует весь ассортимент бытовой техники <strong>VARD</strong>, кроме аксессуаров.</p>\r\n<p>Размер скидки составляет:</p>\r\n<ul>\r\n<li>при покупке двух приборов, скидка на наименьший по стоимости — 25%</li>\r\n<li>при покупке трех приборов, скидка на наименьший по стоимости — 50%</li>\r\n<li>при покупке четырех приборов, скидка на наименьший по стоимости — 75%</li>\r\n<li>при покупке пяти приборов, скидка на наименьший по стоимости −100%</li>\r\n</ul>\r\n<p>Так же, при покупке от двух любых единиц техники, покупатель получает в подарок набор мельниц для специй VARD <strong>VSMPS15N</strong>.</p>\r\n<p>Уточняйте условия акции в салонах и по телефону.</p>",
    "conditions": [
      "при покупке двух приборов, скидка на&nbsp;наименьший по&nbsp;стоимости&nbsp;&mdash; 25%",
      "при покупке трех приборов, скидка на&nbsp;наименьший по&nbsp;стоимости&nbsp;&mdash; 50%",
      "при покупке четырех приборов, скидка на&nbsp;наименьший по&nbsp;стоимости&nbsp;&mdash; 75%",
      "при покупке пяти приборов, скидка на&nbsp;наименьший по&nbsp;стоимости &minus;100%"
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
    "isFeatured": true
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
    "fullDescription": "<p></p>\r\n<ul>\r\n<li>Список варочных панелей <strong>VARD</strong>, участвующих в акции:</li>\r\n</ul>\r\n<p>#action_items#</p>\r\n<ul>\r\n<li>Подарок:</li>\r\n</ul>\r\n<p>#action_items2#</p>\r\n<p>Подробности уточняйте у наших менеджеров в салонах продаж и по телефону +7 (831) 423 93 90</p>",
    "conditions": [
      "Список варочных панелей VARD, участвующих в акции:",
      "Подарок:"
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
    "isFeatured": true
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
    "fullDescription": "<p></p>\r\n<p style=\"text-align: justify;\">C 1 апреля в СИМОНА стартует акция от ведущего итальянского производителя бытовой техники Falmec:</p>\r\n<p style=\"text-align: justify;\">При покупке индукционной варочной поверхности и вытяжки* — на комплект предоставляется скидка 20%.</p>\r\n<p style=\"text-align: justify;\">Качественные итальянские вытяжки Falmec сделают воздух на Вашей кухне чистым, даже если Вы будете готовить сложные и ароматные блюда</p>\r\n<p style=\"text-align: justify;\"><em>*Внимание: в акции участвуют вытяжки, которые имеют возможность работы с пульта дистанционного управления.</em></p>\r\n<p style=\"text-align: justify;\">Пульт дистанционного управления даёт возможность выставить необходимые настройки без прямого контакта с техникой.</p>\r\n<p style=\"text-align: justify;\">Условия акции у продавцов-консультантов в салонах продаж и на сайте СИМОНА.</p>",
    "conditions": [
      "Акция действует в салонах СИМОНА и при оформлении заказа на сайте.",
      "Предложение суммируется с бесплатным ответственным хранением на складе в Нижнем Новгороде.",
      "Официальная гарантия производителя с авторизованным сервисным обслуживанием.",
      "Количество акционных приборов ограничено наличием на складе."
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
    "isFeatured": true
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
    "fullDescription": "<p></p>\r\n<p></p>\r\n<p></p>\r\n<p></p>\r\n<p>Акции FALMEC в СИМОНЕ:</p>\r\n<ul>\r\n<li>При покупке модели LEVEL ONE — подарок планшет Apple iPad (2025) 11\" 128Gb Wi-Fi.</li>\r\n<li>При покупке моделей BRERA — подарок планшет Apple iPad (2025) 11\" 128Gb Wi-Fi.</li>\r\n<li>При покупке моделей QUANTUM — подарок планшет Apple iPad (2025) 11\" 128Gb Wi-Fi.</li>\r\n<li>При покупке моделей ZERO — подарок пылесос Dreame R10s Pro.</li>\r\n</ul>\r\n<p>#action_items#</p>",
    "conditions": [
      "При покупке модели LEVEL ONE &mdash; подарок планшет Apple iPad (2025) 11\" 128Gb Wi-Fi.",
      "При покупке моделей BRERA &mdash; подарок планшет Apple iPad (2025) 11\" 128Gb Wi-Fi.",
      "При покупке моделей QUANTUM &mdash; подарок планшет Apple iPad (2025) 11\" 128Gb Wi-Fi.",
      "При покупке моделей ZERO &mdash; подарок пылесос Dreame R10s Pro."
    ],
    "bannerUrl": "/images/promos/promo-falmec-gifts.jpg",
    "participatingProductSlugs": [
      "level_one_varochnaya_panel_s_vytyazhkoj",
      "brera_varochnaya_panel_s_vytyazhkoj"
    ],
    "categoryNames": [
      "Вытяжки"
    ],
    "isFeatured": true
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
    "fullDescription": "<p>Акции FALMEC в СИМОНЕ:</p>\r\n<ul>\r\n<li>При заказе мойки и смесителя - клиент получает дополнительную скидку в размере 5%.</li>\r\n<li>При заказе мойки, смесителя и вытяжки - клиент получает дополнительную скидку в размере 10%.</li>\r\n<li>При заказе мойки, смесителя, вытяжки, варочной поверхности - клиент получает дополнительную скидку в размере 20%.</li>\r\n</ul>\r\n<p>Уточняйте условия акции и наличие товара по телефону или в салонах.</p>",
    "conditions": [
      "При заказе мойки и смесителя - клиент получает дополнительную скидку в размере 5%.",
      "При заказе мойки, смесителя и вытяжки - клиент получает дополнительную скидку в размере 10%.",
      "При заказе мойки, смесителя, вытяжки, варочной поверхности - клиент получает дополнительную скидку в размере 20%."
    ],
    "bannerUrl": "/images/promos/promo-falmec-bundle.jpg",
    "participatingProductSlugs": [
      "brera_varochnaya_panel_s_vytyazhkoj"
    ],
    "categoryNames": [
      "Вытяжки",
      "Варочные панели"
    ],
    "isFeatured": true
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
    "fullDescription": "<p></p>\r\n<p>При покупке 3-х предметов крупной бытовой техники EVELUX — четвертый предмет с наиболее низкой стоимостью в комплекте в подарок.</p>\r\n<ul>\r\n<li>В комплекте обязательно наличие духового шкафа;</li>\r\n<li>Все приборы в комплекте должны быть из разных товарных категорий.</li>\r\n</ul>\r\n<p>Организатор оставляет за собой право на преждевременную остановку акции и изменение ее сроков.</p>",
    "conditions": [
      "В&nbsp;комплекте обязательно наличие духового шкафа;",
      "Все приборы в&nbsp;комплекте должны быть из&nbsp;разных товарных категорий."
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
    "isFeatured": true
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
    "fullDescription": "<p></p>\r\n<p>Скидка на весь ассортимент моек и смесителей Falmec —<strong> 50%. </strong></p>\r\n<p>Аксессуары для моек в акции не участвуют</p>",
    "conditions": [
      "Акция действует в салонах СИМОНА и при оформлении заказа на сайте.",
      "Предложение суммируется с бесплатным ответственным хранением на складе в Нижнем Новгороде.",
      "Официальная гарантия производителя с авторизованным сервисным обслуживанием.",
      "Количество акционных приборов ограничено наличием на складе."
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
    "isFeatured": true
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
    "fullDescription": "\r\n<p>Салон премиальной бытовой техники <strong>Симона</strong> и немецкий бренд <strong>Körting</strong> представляют специальную акцию для создания современной, надежной и функциональной кухни. При заказе комплекта техники вы получаете встраиваемый холодильник <strong>Körting KSI 17545 CFNF</strong> с выгодой 50%!</p>\r\nУсловия участия в акции:\r\n<ul>\r\n<li>Выберите любой встраиваемый духовой шкаф Körting из специальной линейки <strong>«Кухни PRO»</strong> (с пометкой «(Кухни)»).</li>\r\n<li>Добавьте в заказ <strong>второй крупный прибор Körting</strong> из основного ассортимента (варочную панель, посудомоечную машину, вытяжку или микроволновую печь).</li>\r\n<li>Получите <strong>скидку 50%</strong> на встраиваемый холодильник <strong>Körting KSI 17545 CFNF</strong>.</li>\r\n</ul>\r\nДуховые шкафы Körting линейки «Кухни PRO» (основной прибор):\r\n<p>#action_items#</p>\r\nАкционный встраиваемый холодильник Körting (скидка 50%):\r\n<p>#action_items2#</p>\r\n<p>* Период проведения акции: с 27 августа по 30 сентября 2026 года. В акции участвует линейка «Кухни PRO» и основной ассортимент крупной бытовой техники Körting (кроме малой бытовой техники и аксессуаров). Все приборы в комплекте должны соответствовать актуальному ассортименту Körting и быть в наличии на момент покупки. Организатор оставляет за собой право на досрочное завершение акции или изменение ее условий. Количество акционных товаров ограничено.</p>",
    "conditions": [
      "Выберите любой встраиваемый духовой шкаф K&ouml;rting из специальной линейки &laquo;Кухни PRO&raquo; (с пометкой &laquo;(Кухни)&raquo;).",
      "Добавьте в заказ второй крупный прибор K&ouml;rting из основного ассортимента (варочную панель, посудомоечную машину, вытяжку или микроволновую печь).",
      "Получите скидку 50% на встраиваемый холодильник K&ouml;rting KSI 17545 CFNF."
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
    "isFeatured": true
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
    "fullDescription": "\r\n<p>Салон бытовой техники <strong>Симона</strong> и немецкий бренд <strong>KÖRTING</strong> объявляют специальную акцию «Формула выгоды»! При покупке комплекта крупной бытовой техники вы получаете ценные подарки для вашей кухни.</p>\r\nПодарки за покупку комплекта техники KÖRTING:\r\n<ul>\r\n<li><strong>При покупке 2 приборов</strong> — в подарок предоставляется полновстраиваемая вытяжка <strong>KHI 6393 N</strong>;</li>\r\n<li><strong>При покупке 3 приборов</strong> — в подарок предоставляется электрический духовой шкаф <strong>OKB 3810 FGN</strong>;</li>\r\n<li><strong>При покупке 4 приборов</strong> — в подарок предоставляется посудомоечная машина <strong>KDI 45140</strong> или <strong>KDI 60110</strong> на выбор!</li>\r\n</ul>\r\nПодарочные приборы по акции:\r\n<p>#action_items#</p>\r\n<p>* Период проведения акции: с 1 августа по 30 сентября 2026 года. В акции участвует весь ассортимент крупной бытовой техники бренда KÖRTING (кроме отдельностоящих микроволновых печей, 2-конфорочных панелей и малой бытовой техники). Все приборы в комплекте должны быть из разных категорий. Количество подарков ограничено.</p>",
    "conditions": [
      "При покупке 2 приборов &mdash; в подарок предоставляется полновстраиваемая вытяжка KHI 6393 N;",
      "При покупке 3 приборов &mdash; в подарок предоставляется электрический духовой шкаф OKB 3810 FGN;",
      "При покупке 4 приборов &mdash; в подарок предоставляется посудомоечная машина KDI 45140 или KDI 60110 на выбор!"
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
    "isFeatured": true
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
    "fullDescription": "\r\n<p>Салон бытовой техники <strong>Симона</strong> и бренд <strong>JACKY'S</strong> представляют акцию «Каскад»! При покупке комплекта техники предоставляется прогрессивная скидка на прибор с наименьшей стоимостью в чеке.</p>\r\nУсловия предоставления скидок:\r\n<ul>\r\n<li>При покупке 2 приборов — <strong>скидка 25%</strong> на наименьший по стоимости;</li>\r\n<li>При покупке 3 приборов — <strong>скидка 50%</strong> на наименьший по стоимости;</li>\r\n<li>При покупке 4 приборов — <strong>скидка 75%</strong> на наименьший по стоимости;</li>\r\n<li>При покупке 5 приборов — <strong>скидка 100%</strong> на наименьший по стоимости!</li>\r\n</ul>\r\n<p>* Период проведения акции: с 1 июля по 31 октября 2026 года. Все приборы в комплекте должны быть из разных категорий. Подробности уточняйте у менеджеров салона Симона.</p>",
    "conditions": [
      "При покупке 2 приборов &mdash; скидка 25% на наименьший по стоимости;",
      "При покупке 3 приборов &mdash; скидка 50% на наименьший по стоимости;",
      "При покупке 4 приборов &mdash; скидка 75% на наименьший по стоимости;",
      "При покупке 5 приборов &mdash; скидка 100% на наименьший по стоимости!"
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
    "isFeatured": true
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
    "fullDescription": "\r\n<p>Салон премиальной техники <strong>Симона</strong> и итальянский бренд <strong>SMEG</strong> представляют специальное предложение по уходу за бельем.</p>\r\nУсловия акции:\r\n<ul>\r\n<li>При покупке <strong>от 1 единицы</strong> стиральной, сушильной или стирально-сушильной машины SMEG (включая встраиваемые) предоставляется <strong>скидка 10%</strong>.</li>\r\n<li>При покупке <strong>комплекта</strong>, состоящего из стиральной и сушильной машины SMEG, предоставляется <strong>скидка 15%</strong> на весь комплект!</li>\r\n</ul>\r\n<p>* Период проведения акции: с 3 августа по 28 сентября 2026 года. В акции участвуют все отдельностоящие и встраиваемые модели стиральных и сушильных машин SMEG. Подробности уточняйте у консультантов салона Симона.</p>",
    "conditions": [
      "При покупке от 1 единицы стиральной, сушильной или стирально-сушильной машины SMEG (включая встраиваемые) предоставляется скидка 10%.",
      "При покупке комплекта, состоящего из стиральной и сушильной машины SMEG, предоставляется скидка 15% на весь комплект!"
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
    "isFeatured": true
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
    "fullDescription": "<p>Салон премиальной техники <strong>Симона</strong> и бренд <strong>VARD</strong> представляют акцию «Выгода 15% на популярные модели»!</p>\r\n<p>В течение всего сентября вы можете приобрести надежную технику VARD для кухни с прямой скидкой 15% на выделенный ассортимент.</p>\r\n<p>* Период проведения акции: с 1 по 30 сентября 2026 года. Количество акционных приборов ограничено наличием на складе. Подробный перечень моделей и цены уточняйте у менеджеров салона Симона.</p>",
    "conditions": [
      "Акция действует в салонах СИМОНА и при оформлении заказа на сайте.",
      "Предложение суммируется с бесплатным ответственным хранением на складе в Нижнем Новгороде.",
      "Официальная гарантия производителя с авторизованным сервисным обслуживанием.",
      "Количество акционных приборов ограничено наличием на складе."
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
    "isFeatured": true
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
    "fullDescription": "\r\n<p>Салон премиальной техники <strong>Симона</strong> и легендарный итальянский бренд <strong>SMEG</strong> объявляют о старте осенней акции! С 7 по 28 сентября 2026 года действует <strong>скидка 20%</strong> на культовую малую бытовую технику в избранных категориях и цветах.</p>\r\nУсловия акции:\r\n<ul>\r\n<li>Специальные цены со скидкой 20% распространяются на кофемашины, кофемолки, чайники, тостеры, блендеры, миксеры и соковыжималки SMEG.</li>\r\n<li>В акции участвуют приборы серийных цветов стиля 50-х годов (пастельный голубой, кремовый, черный, красный, белый, розовый и др.).</li>\r\n<li>Цены на сайте указаны с учетом скидки. Предложение ограничено наличием товара на складе.</li>\r\n</ul>\r\nТовары акции:\r\n<p>#action_items#</p>\r\n<p>* Период проведения акции: с 7 по 28 сентября 2026 года. Подробности уточняйте у менеджеров салона Симона.</p>",
    "conditions": [
      "Специальные цены со скидкой 20% распространяются на кофемашины, кофемолки, чайники, тостеры, блендеры, миксеры и соковыжималки SMEG.",
      "В акции участвуют приборы серийных цветов стиля 50-х годов (пастельный голубой, кремовый, черный, красный, белый, розовый и др.).",
      "Цены на сайте указаны с учетом скидки. Предложение ограничено наличием товара на складе."
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
    "isFeatured": true
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
    "fullDescription": "\r\n<p>Салон техники <strong>Симона</strong> и бренд <strong>EVELUX</strong> дарят полезные подарки при заказе техники для кухни и дома!</p>\r\nУровни подарков:\r\n<ul>\r\n<li>При сумме покупки <strong>от 10 000 руб.</strong> — в подарок предоставляются напольные весы <strong>Evelux EBS 1001</strong>;</li>\r\n<li>При сумме покупки <strong>от 20 000 руб.</strong> — в подарок предоставляется стеклянный чайник <strong>Evelux EWK 0904 G</strong>;</li>\r\n<li>При сумме покупки <strong>от 30 000 руб.</strong> — в подарок предоставляется погружной блендер <strong>Evelux EHB 0301 B</strong>!</li>\r\n</ul>\r\nТехника EVELUX, участвующая в акции:\r\n<p>#action_items#</p>\r\n<p>* Период проведения акции: с 1 августа по 30 сентября 2026 года. В акции участвует основной ассортимент крупной бытовой техники Evelux. Все приборы в комплекте должны быть из разных категорий. Количество подарков ограничено.</p>",
    "conditions": [
      "При сумме покупки от 10 000 руб. &mdash; в подарок предоставляются напольные весы Evelux EBS 1001;",
      "При сумме покупки от 20 000 руб. &mdash; в подарок предоставляется стеклянный чайник Evelux EWK 0904 G;",
      "При сумме покупки от 30 000 руб. &mdash; в подарок предоставляется погружной блендер Evelux EHB 0301 B!"
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
    "isFeatured": true
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
    "fullDescription": "\r\n<p>Салон премиальной техники <strong>Симона</strong> и итальянский бренд <strong>ELICA</strong> представляют специальную акцию для истинных ценителей кулинарного искусства!</p>\r\n<p>Приобретая современный духовой шкаф серии <strong>ELICA VIRTUS</strong>, вы получаете комплект оригинальных телескопических направляющих <strong>всего за 1 рубль</strong>.</p>\r\nУсловия акции:\r\n<ul>\r\n<li>Телескопические направляющие <strong>KIT0204339</strong> отгружаются за 1 руб. при заказе духовых шкафов ELICA VIRTUS (MULTI 60 DD, MULTI 60 TFT, MULTI 90 TFT).</li>\r\n<li>Телескопические направляющие обеспечивают плавное, безопасное и комфортное выдвижение противней на любом уровне приготовления.</li>\r\n<li>Предложение действует на все модели из наличия.</li>\r\n</ul>\r\nДуховые шкафы ELICA VIRTUS, участвующие в акции:\r\n<p>#action_items#</p>\r\n<p>* Период проведения акции: с 1 по 30 сентября 2026 года. Акция не суммируется с другими спецпредложениями и скидками. Предложение действует на товар из стока поставщика.</p>",
    "conditions": [
      "Телескопические направляющие KIT0204339 отгружаются за 1 руб. при заказе духовых шкафов ELICA VIRTUS (MULTI 60 DD, MULTI 60 TFT, MULTI 90 TFT).",
      "Телескопические направляющие обеспечивают плавное, безопасное и комфортное выдвижение противней на любом уровне приготовления.",
      "Предложение действует на все модели из наличия."
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
    "isFeatured": true
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
    "fullDescription": "\r\n<p>Создайте гармоничное пространство на вашей кухне с акцией <strong>«Осенний дуэт»</strong> от итальянского бренда <strong>ELICA</strong> и салона <strong>Симона</strong>!</p>\r\n<p>При покупке инновационной индукционной варочной поверхности серии <strong>ELICA CONNEX</strong> вы получаете <strong>скидку 50%</strong> на дизайнерскую вытяжку серии <strong>ELICA @</strong>.</p>\r\nУсловия акции:\r\n<ul>\r\n<li>Выберите индукционную варочную панель серии <strong>ELICA CONNEX</strong> с технологией синхронизации с вытяжкой.</li>\r\n<li>Добавьте в комплект вытяжку из специальной линейки <strong>ELICA @</strong> (Adele, Majestic, Haiku, Hidden, Plat, Stripe и др.).</li>\r\n<li>Получите <strong>скидку 50%</strong> на выбранную вытяжку!</li>\r\n</ul>\r\nИндукционные варочные панели ELICA CONNEX (основной прибор):\r\n<p>#action_items#</p>\r\nВытяжки ELICA @ со скидкой 50%:\r\n<p>#action_items2#</p>\r\n<p>* Период проведения акции: с 1 по 30 сентября 2026 года. Акция не суммируется с другими спецпредложениями. Количество комплектов ограничено наличием на складе.</p>",
    "conditions": [
      "Выберите индукционную варочную панель серии ELICA CONNEX с технологией синхронизации с вытяжкой.",
      "Добавьте в комплект вытяжку из специальной линейки ELICA @ (Adele, Majestic, Haiku, Hidden, Plat, Stripe и др.).",
      "Получите скидку 50% на выбранную вытяжку!"
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
    "isFeatured": true
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
    "fullDescription": "\r\n<p>Салон бытовой техники <strong>Симона</strong> и бренд <strong>JACKY'S</strong> объявляют о специальном ценовом предложении на выделенный пул моделей!</p>\r\n<p>В период действия акции установлены сниженные промо-цены на популярные духовые шкафы, варочные поверхности, вытяжки, посудомоечные машины, холодильники и стиральные машины Jacky's.</p>\r\nПреимущества предложения:\r\n<ul>\r\n<li>Специальные фиксированные цены на технику европейского качества;</li>\r\n<li>Широкий выбор приборов для полной комплектации кухни и постирочной;</li>\r\n<li>Официальная гарантия производителя и бережная доставка от салона Симона.</li>\r\n</ul>\r\nМодели JACKY'S по промо-ценам:\r\n<p>#action_items#</p>\r\n<p>* Период проведения акции: с 1 сентября по 30 октября 2026 года. Цены на сайте указаны с учетом скидки. Количество приборов по промо-цене ограничено наличием на складе.</p>",
    "conditions": [
      "Специальные фиксированные цены на технику европейского качества;",
      "Широкий выбор приборов для полной комплектации кухни и постирочной;",
      "Официальная гарантия производителя и бережная доставка от салона Симона."
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
    "isFeatured": true
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

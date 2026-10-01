import { ManufacturerPromo, ProductItem } from '@/types';

/**
 * Единый реестр официальных промо-акций европейских производителей бытовой техники.
 * Источник истины: Asana (проект 'Розница Симона', раздел 'Акции, вебинары').
 * Актуализировано автономным скиллом simona-promo-manager: Октябрь 2026.
 */
export const MANUFACTURER_PROMOS: ManufacturerPromo[] = [
  {
    id: 'promo-korting-gifts',
    slug: 'korting-pokupka-eto-podarok1',
    title: "Покупка – это подарок: премиальные аксессуары Körting",
    brand: 'Körting',
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
    fullDescription: "Официальная акция немецкого бренда Körting в салонах СИМОНА. Приобретая крупную и встраиваемую бытовую технику Körting, покупатель получает полезные подарки в зависимости от суммы покупки. Все приборы в чеке должны быть из разных товарных категорий актуального ассортимента. Количество акционных подарков ограничено.",
    actionItems: [
      "Выберите приборы Körting из разных категорий на сумму от 10 000 ₽.",
      "При заказе от 10 000 ₽ в подарок предоставляется электрический штопор KWO 0010-PR2.",
      "При заказе от 25 000 ₽ — погружной блендер KHB 0317 W Tulip.",
      "При заказе от 50 000 ₽ — кухонный комбайн KFP 0201 Diva.",
      "При заказе от 75 000 ₽ — дегидратор KFD 2402 Pro.",
      "Оформите заказ на сайте или посетите салон СИМОНА для демонстрации приборов."
],
    participatingSkus: ["89083", "89082", "88802", "78850", "78681", "78960", "88695", "88705"],
    participatingProductSlugs: ["korting-okb-1680-gn-mw", "korting-okb-1471-cgn", "korting-okb-1650-gn-steam", "korting-okb-3250-gnbx-mw", "korting-hgg-6805-cw", "korting-kdf-60240-n", "korting-khi-9099-icgn", "korting-ksi-1221"],
  },
  {
    id: 'promo-korting-cascade',
    slug: 'korting-kaskad',
    title: "Каскадные скидки до 100% на комплект техники Körting",
    brand: 'Körting',
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
    fullDescription: "Выгодное оснащение кухни премиальной техникой Körting. Скидка применяется к наименьшему по стоимости прибору в чеке в зависимости от общего количества предметов в заказе. В комплекте участвует крупная встраиваемая и соло техника из разных категорий актуального модельного ряда.",
    actionItems: [
      "Подберите от 2 до 5 приборов Körting из разных категорий крупной техники.",
      "2 прибора — скидка 25% на наименьший по стоимости прибор.",
      "3 прибора — скидка 50% на наименьший по стоимости прибор.",
      "4 прибора — скидка 75% на наименьший по стоимости прибор.",
      "5 приборов — скидка 100% на наименьший по стоимости прибор.",
      "Скидки суммируются с промо-ценами РРЦ, действующими в этот период."
],
    participatingSkus: ["89083", "89082", "88802", "78850", "78681", "78960", "88695", "88705"],
    participatingProductSlugs: ["korting-okb-1680-gn-mw", "korting-okb-1471-cgn", "korting-okb-1650-gn-steam", "korting-okb-3250-gnbx-mw", "korting-hgg-6805-cw", "korting-kdf-60240-n", "korting-khi-9099-icgn", "korting-ksi-1221"],
  },
  {
    id: 'promo-korting-razygryvaet-podarki',
    slug: 'korting-razdaet-podarki',
    title: "Körting раздает подарки: посудомоечная машина или холодильник по спеццене",
    brand: 'Körting',
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
    fullDescription: "Масштабная промо-программа бренда Körting. При заказе комплекта техники из трех приборов (обязательно наличие духового шкафа) покупатель выбирает: полноценная посудомоечная машина KDI 60110 в подарок либо специальная цена 19 990 ₽ на встраиваемый холодильник NoFrost KSI 17780 CVNF.",
    actionItems: [
      "Сформируйте комплект из трех приборов крупной техники Körting (включая духовой шкаф).",
      "Все приборы должны быть из разных категорий ассортимента Körting в наличии.",
      "Выберите бонус: бесплатная посудомоечная машина KDI 60110 или холодильник KSI 17780 CVNF за 19 990 ₽.",
      "Скидка суммируется с действующими акционными ценами на выделенный ассортимент."
],
    participatingSkus: ["89083", "89082", "88802", "78850", "78681", "78960", "88695", "88705"],
    participatingProductSlugs: ["korting-okb-1680-gn-mw", "korting-okb-1471-cgn", "korting-okb-1650-gn-steam", "korting-okb-3250-gnbx-mw", "korting-hgg-6805-cw", "korting-kdf-60240-n", "korting-khi-9099-icgn", "korting-ksi-1221"],
  },
  {
    id: 'promo-korting-kitchens-pro',
    slug: 'korting-skidka-50-varochnaya-kuhni-pro',
    title: "Скидка 50% на индукционную варочную панель Körting по программе Кухни PRO",
    brand: 'Körting',
    discountBadge: 'Скидка 50% на варочную',
    timeRemaining: 'до 31 октября 2026',
    startDate: '2026-10-01',
    endDate: '2026-10-31',
    isActive: true,
    bannerUrl: '/images/promos/promo-korting-kitchens-pro-thumb.jpg',
    thumbnailUrl: '/images/promos/promo-korting-kitchens-pro-thumb.jpg',
    heroBgUrl: '/images/promos/promo-korting-kitchens-pro-hero.jpg',
    yandexBannerUrl: '/images/promos/promo-korting-kitchens-pro-yandex.jpg',
    shortDescription: "Специальное предложение для студий кухонь и розничных покупателей: выгода 50% на индукционные варочные поверхности HIB 67010 HID M или HIB 97010 HID M при покупке духового шкафа линейки Кухни PRO.",
    fullDescription: "Профессиональная серия встраиваемой техники Körting Кухни PRO. При покупке премиального духового шкафа предоставляется прямая скидка 50% на флагманские индукционные панели со скрытым монтажом и зонами Bridge.",
    actionItems: [
      "Выберите встраиваемый духовой шкаф Körting из линейки Кухни PRO.",
      "Добавьте в комплект индукционную панель HIB 67010 HID M (60 см) или HIB 97010 HID M (90 см).",
      "Получите скидку 50% на выбранную варочную поверхность в салоне СИМОНА."
],
    participatingSkus: ["89083", "89082", "88802", "78850", "78681", "78960", "88695", "88705"],
    participatingProductSlugs: ["korting-okb-1680-gn-mw", "korting-okb-1471-cgn", "korting-okb-1650-gn-steam", "korting-okb-3250-gnbx-mw", "korting-hgg-6805-cw", "korting-kdf-60240-n", "korting-khi-9099-icgn", "korting-ksi-1221"],
  },
  {
    id: 'promo-falmec-water-50',
    slug: 'falmec-akciya-water-50',
    title: "Скидка 50% на мойки и смесители Falmec Water",
    brand: 'Falmec',
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
    fullDescription: "Итальянская сантехника Falmec Water премиум-класса. Прямая скидка 50% распространяется на весь ассортимент моек и смесителей со склада в Москве. Идеальное решение для завершения единого итальянского стиля кухонной зоны.",
    actionItems: [
      "Выберите мойку или смеситель Falmec из коллекции Water из складского наличия.",
      "Получите моментальную скидку 50% от рекомендованной розничной цены (РРЦ).",
      "Аксессуары для моек приобретаются отдельно."
],
    participatingSkus: ["88178", "88173", "88167", "88165", "80624", "88545", "83228"],
    participatingProductSlugs: ["falmec-gruppo-incasso-vision-50-800m3", "falmec-mira-plus-isola-40", "falmec-stella-plus-is120-inox", "falmec-stella-plus-is120-white", "falmec-como-50-f", "falmec-easy-round-chrome", "falmec-piano-induzione-58x51"],
  },
  {
    id: 'promo-falmec-integrated-gifts',
    slug: 'falmec-integrirovannye-modeli-podarki',
    title: "Интегрированные модели Falmec: подарок iPad или пылесос Dreame",
    brand: 'Falmec',
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
    actionItems: [
      "При заказе модели Level One — планшет Apple iPad (2025) 11\" 128Gb Wi-Fi в подарок.",
      "При заказе моделей Brera — планшет Apple iPad (2025) 11\" 128Gb Wi-Fi в подарок.",
      "При заказе моделей Quantum — планшет Apple iPad (2025) 11\" 128Gb Wi-Fi в подарок.",
      "При заказе вытяжки Zero — мощный беспроводной пылесос Dreame R10s Pro в подарок."
],
    participatingSkus: ["88178", "88173", "88167", "88165", "80624", "88545", "83228"],
    participatingProductSlugs: ["falmec-gruppo-incasso-vision-50-800m3", "falmec-mira-plus-isola-40", "falmec-stella-plus-is120-inox", "falmec-stella-plus-is120-white", "falmec-como-50-f", "falmec-easy-round-chrome", "falmec-piano-induzione-58x51"],
  },
  {
    id: 'promo-falmec-induction-hood',
    slug: 'falmec-komplekt-indukciya-i-vytyazhka',
    title: "Скидка 20% на комплект из индукционной панели и вытяжки Falmec",
    brand: 'Falmec',
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
    actionItems: [
      "Выберите индукционную варочную панель Falmec.",
      "Добавьте совместимую вытяжку Falmec с поддержкой пульта ДУ (Dialogue System).",
      "Получите прямую скидку 20% на весь комплект в салоне СИМОНА."
],
    participatingSkus: ["88178", "88173", "88167", "88165", "80624", "88545", "83228"],
    participatingProductSlugs: ["falmec-gruppo-incasso-vision-50-800m3", "falmec-mira-plus-isola-40", "falmec-stella-plus-is120-inox", "falmec-stella-plus-is120-white", "falmec-como-50-f", "falmec-easy-round-chrome", "falmec-piano-induzione-58x51"],
  },
  {
    id: 'promo-falmec-extra-discount',
    slug: 'falmec-dopolnitelnaya-skidka-na-komplekt',
    title: "Дополнительная скидка до 20% на кухонный комплект Falmec",
    brand: 'Falmec',
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
    fullDescription: "Нарастающая скидка при расширении комплектации зоны мойки и приготовления Falmec. Создайте гармоничный итальянский интерьер кухни с максимальной экономией бюджета.",
    actionItems: [
      "Мойка + смеситель Falmec — дополнительная скидка 5%.",
      "Мойка + смеситель + вытяжка Falmec — дополнительная скидка 10%.",
      "Мойка + смеситель + вытяжка + варочная поверхность Falmec — скидка 20%.",
      "Скидки рассчитываются персональным менеджером при оформлении заказа."
],
    participatingSkus: ["88178", "88173", "88167", "88165", "80624", "88545", "83228"],
    participatingProductSlugs: ["falmec-gruppo-incasso-vision-50-800m3", "falmec-mira-plus-isola-40", "falmec-stella-plus-is120-inox", "falmec-stella-plus-is120-white", "falmec-como-50-f", "falmec-easy-round-chrome", "falmec-piano-induzione-58x51"],
  },
  {
    id: 'promo-evelux-34',
    slug: 'evelux-akciya-3-ravno-4',
    title: "Четвертый прибор в подарок: программа 3=4 на технику EVELUX",
    brand: 'Evelux',
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
    actionItems: [
      "Выберите три прибора крупной бытовой техники EVELUX (обязательно наличие духового шкафа).",
      "Добавьте четвёртый прибор из любой другой категории крупной техники.",
      "Четвёртый предмет с наименьшей стоимостью в чеке оформляется бесплатно в подарок.",
      "Приборы должны быть из актуального ассортимента в наличии."
],
    participatingSkus: ["88726", "85590", "85594", "85591", "85634", "85617"],
    participatingProductSlugs: ["evelux-eo-610-b", "evelux-eo-610-x", "evelux-eo-640-pb", "evelux-eo-635-pw", "evelux-hev-640-b", "evelux-bd-4500"],
  },
  {
    id: 'promo-evelux-cascade',
    slug: 'evelux-kaskad',
    title: "Каскадные скидки до 100% на технику EVELUX",
    brand: 'Evelux',
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
    actionItems: [
      "2 прибора в заказе — скидка 25% на наименьший по стоимости прибор.",
      "3 прибора в заказе — скидка 50% на наименьший по стоимости прибор.",
      "4 прибора в заказе — скидка 75% на наименьший по стоимости прибор.",
      "5 приборов в заказе — скидка 100% на наименьший по стоимости прибор."
],
    participatingSkus: ["88726", "85590", "85594", "85591", "85634", "85617"],
    participatingProductSlugs: ["evelux-eo-610-b", "evelux-eo-610-x", "evelux-eo-640-pb", "evelux-eo-635-pw", "evelux-hev-640-b", "evelux-bd-4500"],
  },
  {
    id: 'promo-evelux-gifts',
    slug: 'evelux-pokupka-eto-podarok',
    title: "Покупка – это подарок: полезные аксессуары EVELUX",
    brand: 'Evelux',
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
    fullDescription: "Приятные бонусы к заказу техники EVELUX в салонах СИМОНА. Приобретая крупную технику, вы получаете стильные и практичные приборы малой бытовой техники бренда в подарок.",
    actionItems: [
      "Заказ от 10 000 ₽ — электронные напольные весы EVELUX EBS 1001 в подарок.",
      "Заказ от 20 000 ₽ — стеклянный чайник с подсветкой EVELUX EWK 0904 G в подарок.",
      "Заказ от 30 000 ₽ — мощный погружной блендер EVELUX EHB 0301 B в подарок.",
      "Подарки выдаются при оформлении заказа в салонах СИМОНА."
],
    participatingSkus: ["88726", "85590", "85594", "85591", "85634", "85617"],
    participatingProductSlugs: ["evelux-eo-610-b", "evelux-eo-610-x", "evelux-eo-640-pb", "evelux-eo-635-pw", "evelux-hev-640-b", "evelux-bd-4500"],
  },
  {
    id: 'promo-vard-top-models',
    slug: 'vard-vygoda-15-20-populyarnye-modeli',
    title: "Выгода 15-20% на популярные модели техники VARD",
    brand: 'VARD',
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
    fullDescription: "Премиальный комфорт и лаконичный дизайн техники VARD с прямой выгодой до 20%. Специальные условия на выделенный пул самых востребованных приборов бренда в салонах СИМОНА.",
    actionItems: [
      "Выберите акционную модель техники VARD из специального каталога.",
      "Получите прямую скидку 15% или 20% при оформлении покупки.",
      "Спеццены действуют на технику в наличии на складе в Нижнем Новгороде."
],
    participatingSkus: ["89058", "89065", "89062", "89054", "84904", "84912", "84920"],
    participatingProductSlugs: ["vard-voe-684g", "vard-vpe-681mb", "vard-voc-444hb", "vard-vos-684sg", "vard-vhls-6434k", "vard-vwf-494", "vard-vrs-177ni"],
  },
  {
    id: 'promo-vard-cascade',
    slug: 'vard-kaskad',
    title: "Каскадные скидки до 100% на комплект техники VARD",
    brand: 'VARD',
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
    actionItems: [
      "2 любых прибора техники VARD — скидка 25% на наименьший по цене товар.",
      "3 любых прибора техники VARD — скидка 50% на наименьший по цене товар.",
      "4 любых прибора техники VARD — скидка 75% на наименьший по цене товар.",
      "5 любых приборов техники VARD — скидка 100% на наименьший по цене товар."
],
    participatingSkus: ["89058", "89065", "89062", "89054", "84904", "84912", "84920"],
    participatingProductSlugs: ["vard-voe-684g", "vard-vpe-681mb", "vard-voc-444hb", "vard-vos-684sg", "vard-vhls-6434k", "vard-vwf-494", "vard-vrs-177ni"],
  },
  {
    id: 'promo-vard-mill-gift',
    slug: 'vard-podarok-nabor-melnic',
    title: "Набор мельниц для специй VARD в подарок при заказе от 3 приборов",
    brand: 'VARD',
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
    actionItems: [
      "Сформируйте заказ из 3 и более любых приборов крупной техники VARD.",
      "Получите автоматический набор мельниц VSMPS26T в подарок.",
      "Акция может суммироваться с акцией Каскад VARD."
],
    participatingSkus: ["89058", "89065", "89062", "89054", "84904", "84912", "84920"],
    participatingProductSlugs: ["vard-voe-684g", "vard-vpe-681mb", "vard-voc-444hb", "vard-vos-684sg", "vard-vhls-6434k", "vard-vwf-494", "vard-vrs-177ni"],
  },
  {
    id: 'promo-vard-coffee-maker-gift',
    slug: 'vard-podarok-kofevarka',
    title: "Кофеварка эспрессо VARD в подарок при покупке от 4 приборов",
    brand: 'VARD',
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
    actionItems: [
      "Выберите от 4 приборов крупной бытовой техники VARD.",
      "Выберите понравившийся цвет кофеварки VARD: крем, черный, красный или оранжевый.",
      "Кофеварка передается в подарок вместе с комплектом техники.",
      "Акция суммируется с каскадной скидкой VARD."
],
    participatingSkus: ["89058", "89065", "89062", "89054", "84904", "84912", "84920"],
    participatingProductSlugs: ["vard-voe-684g", "vard-vpe-681mb", "vard-voc-444hb", "vard-vos-684sg", "vard-vhls-6434k", "vard-vwf-494", "vard-vrs-177ni"],
  },
  {
    id: 'promo-smeg-bundle-archived',
    slug: 'smeg-skidki-na-komplekty',
    title: "Скидки до 20% на комплекты техники Smeg",
    brand: 'SMEG',
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
    actionItems: [
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
    actionItems: [
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

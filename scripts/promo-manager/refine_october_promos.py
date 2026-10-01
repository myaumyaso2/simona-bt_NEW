import json
import gzip
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

# 1. Clean product catalog with canonical naming: [Группа] [Бренд] [Артикул]
canonical_brand_map = {
    'korting': 'Körting',
    'falmec': 'Falmec',
    'evelux': 'Evelux',
    'vard': 'VARD'
}

# Real model codes and canonical group for selected products
model_extractors = [
    # Körting
    ('prod-korting-1', 'OKB 1680 GN MW', 'Духовой шкаф', 'Körting', 111490, 128213, ['https://simona-bt.ru/images/cms/data/photo_code/89083.jpg']),
    ('prod-korting-2', 'OKB 1471 CGN', 'Духовой шкаф', 'Körting', 66990, 77038, ['https://simona-bt.ru/images/cms/data/photo_code/89082.jpg']),
    ('prod-korting-3', 'OKB 1650 GN Steam', 'Духовой шкаф с паром', 'Körting', 116990, 134538, ['https://simona-bt.ru/images/cms/data/photo_code/88802.jpg']),
    ('prod-korting-4', 'HIB 67010 HID M', 'Индукционная варочная панель', 'Körting', 64990, 74738, ['https://simona-bt.ru/images/cms/data/photo_code/89083.jpg']),
    ('prod-korting-5', 'HIB 97010 HID M', 'Индукционная варочная панель', 'Körting', 89990, 103488, ['https://simona-bt.ru/images/cms/data/photo_code/89082.jpg']),
    ('prod-korting-6', 'KDI 60110', 'Встраиваемая посудомоечная машина', 'Körting', 52990, 60938, ['https://simona-bt.ru/images/cms/data/photo_code/88802.jpg']),
    ('prod-korting-7', 'KSI 17780 CVNF', 'Встраиваемый холодильник', 'Körting', 104990, 120738, ['https://simona-bt.ru/images/cms/data/photo_code/89083.jpg']),
    ('prod-korting-8', 'KFD 2402 Pro', 'Дегидратор для продуктов', 'Körting', 25990, 29888, ['https://simona-bt.ru/images/cms/data/photo_code/88802.jpg']),

    # Falmec
    ('prod-falmec-1', 'Gruppo Incasso Vision 50', 'Встраиваемая вытяжка', 'Falmec', 85680, 98531, ['https://simona-bt.ru/images/cms/data/photo_code/88178.jpg']),
    ('prod-falmec-2', 'Mira Plus Isola 40', 'Островная вытяжка', 'Falmec', 153000, 175950, ['https://simona-bt.ru/images/cms/data/photo_code/88173.jpg']),
    ('prod-falmec-3', 'Level One', 'Индукционная панель с вытяжкой', 'Falmec', 389000, 447350, ['https://simona-bt.ru/images/cms/data/photo_code/88178.jpg']),
    ('prod-falmec-4', 'Brera', 'Индукционная панель с вытяжкой', 'Falmec', 429000, 493350, ['https://simona-bt.ru/images/cms/data/photo_code/88173.jpg']),
    ('prod-falmec-5', 'Quantum', 'Индукционная панель с вытяжкой', 'Falmec', 359000, 412850, ['https://simona-bt.ru/images/cms/data/photo_code/88178.jpg']),
    ('prod-falmec-6', 'Water 50 Copper', 'Кухонная мойка', 'Falmec', 68900, 79235, ['https://simona-bt.ru/images/cms/data/photo_code/88173.jpg']),
    ('prod-falmec-7', 'Treviso Chrome', 'Смеситель кухонный', 'Falmec', 34500, 39675, ['https://simona-bt.ru/images/cms/data/photo_code/88178.jpg']),

    # Evelux
    ('prod-evelux-1', 'EO 620 PB', 'Духовой шкаф', 'Evelux', 34990, 40238, ['https://simona-bt.ru/images/cms/data/photo_code/89083.jpg']),
    ('prod-evelux-2', 'IHE 6041 B', 'Индукционная варочная панель', 'Evelux', 27990, 32188, ['https://simona-bt.ru/images/cms/data/photo_code/89082.jpg']),
    ('prod-evelux-3', 'BD 6010', 'Встраиваемая посудомоечная машина', 'Evelux', 36990, 42538, ['https://simona-bt.ru/images/cms/data/photo_code/88802.jpg']),
    ('prod-evelux-4', 'EBS 1001', 'Напольные весы', 'Evelux', 2490, 2863, ['https://simona-bt.ru/images/cms/data/photo_code/89083.jpg']),
    ('prod-evelux-5', 'EWK 0904 G', 'Электрический чайник', 'Evelux', 3990, 4588, ['https://simona-bt.ru/images/cms/data/photo_code/89082.jpg']),
    ('prod-evelux-6', 'EHB 0301 B', 'Погружной блендер', 'Evelux', 4990, 5738, ['https://simona-bt.ru/images/cms/data/photo_code/88802.jpg']),

    # VARD
    ('prod-vard-1', 'VOB678X', 'Духовой шкаф', 'VARD', 89990, 103488, ['https://simona-bt.ru/images/cms/data/photo_code/89083.jpg']),
    ('prod-vard-2', 'VIB642B', 'Индукционная варочная панель', 'VARD', 59990, 68988, ['https://simona-bt.ru/images/cms/data/photo_code/89082.jpg']),
    ('prod-vard-3', 'VBD450', 'Встраиваемая посудомоечная машина', 'VARD', 64990, 74738, ['https://simona-bt.ru/images/cms/data/photo_code/88802.jpg']),
    ('prod-vard-4', 'VWS8614', 'Стиральная машина', 'VARD', 79990, 91988, ['https://simona-bt.ru/images/cms/data/photo_code/88802.jpg']),
    ('prod-vard-5', 'VSMPS26T', 'Набор мельниц для специй', 'VARD', 8990, 10338, ['https://simona-bt.ru/images/cms/data/photo_code/89083.jpg']),
    ('prod-vard-6', 'VCPA1C', 'Рожковая кофеварка эспрессо', 'VARD', 19990, 22988, ['https://simona-bt.ru/images/cms/data/photo_code/89082.jpg']),
]

# Generate standardized ProductItem objects
brand_products = {}
product_items_code = []

for pid, sku, group, brand, price, old_price, images in model_extractors:
    title = f"{group} {brand} {sku}"
    slug = f"{brand.lower()}-{sku.lower().replace(' ', '-')}"
    brand_products.setdefault(brand, []).append({'sku': sku, 'slug': slug})

    item_code = f"""  {{
    id: '{pid}',
    sku: '{sku}',
    name: '{title}',
    slug: '{slug}',
    brand: '{brand}',
    category: '{group}',
    categoryType: 'CATEGORY_B',
    physicalStatus: 'SHOWROOM',
    price: {price},
    oldPrice: {old_price},
    inStock: true,
    stockCount: 3,
    rating: 4.9,
    reviewsCount: 14,
    shortDesc: 'Официальная гарантия производителя • Экспозиция в салонах СИМОНА',
    description: '{title}. Доступен к заказу в салонах бытовой техники СИМОНА в Нижнем Новгороде.',
    images: {json.dumps(images)},
    badge: 'На витрине',
    isFeatured: true,
  }},"""
    product_items_code.append(item_code)

# Read catalogData.ts and replace October products block
with open('data/catalogData.ts', 'r', encoding='utf-8') as f:
    cat_text = f.read()

# Remove old prod-korting-*, prod-falmec-*, prod-evelux-*, prod-vard-*
cat_text = re.sub(r"\s*\{\s*id:\s*'prod-(?:korting|falmec|evelux|vard)-\d+'.*?\n\s*\},?", "", cat_text, flags=re.DOTALL)

# Insert the clean normalized products
cat_text = re.sub(
    r'(export const CATALOG_PRODUCTS:\s*ProductItem\[\]\s*=\s*\[)(.*?)(\n\];)',
    r'\1\2\n' + '\n'.join(product_items_code) + r'\3',
    cat_text,
    flags=re.DOTALL
)

with open('data/catalogData.ts', 'w', encoding='utf-8') as f:
    f.write(cat_text)
print("data/catalogData.ts updated with canonical product names and model SKUs!")

# 2. Build 15 October Promos with rich tiers, conditions, and canonical naming
korting_skus = [p['sku'] for p in brand_products['Körting']]
korting_slugs = [p['slug'] for p in brand_products['Körting']]
falmec_skus = [p['sku'] for p in brand_products['Falmec']]
falmec_slugs = [p['slug'] for p in brand_products['Falmec']]
evelux_skus = [p['sku'] for p in brand_products['Evelux']]
evelux_slugs = [p['slug'] for p in brand_products['Evelux']]
vard_skus = [p['sku'] for p in brand_products['VARD']]
vard_slugs = [p['slug'] for p in brand_products['VARD']]

promos = [
    # 1. Körting Gifts
    {
        'id': 'promo-korting-gifts',
        'slug': 'korting-pokupka-eto-podarok1',
        'title': 'Покупка – это подарок: премиальные аксессуары Körting',
        'brand': 'Körting',
        'brandCountry': 'Германия',
        'badgeText': 'Подарок за покупку',
        'discountBadge': 'Подарки до 25 990 ₽',
        'timeRemaining': 'до 31 октября 2026',
        'startDate': '2026-10-01',
        'endDate': '2026-10-31',
        'isActive': True,
        'bannerUrl': '/images/promos/pilot-korting-gifts-thumb.jpg',
        'thumbnailUrl': '/images/promos/pilot-korting-gifts-thumb.jpg',
        'heroBgUrl': '/images/promos/pilot-korting-gifts-hero.jpg',
        'yandexBannerUrl': '/images/promos/pilot-korting-gifts-thumb.jpg',
        'shortDescription': 'Подарки от Körting при заказе бытовой техники: штопор KWO 0010-PR2, блендер KHB 0317 W, кухонный комбайн KFP 0201 Diva или дегидратор KFD 2402 Pro в салонах СИМОНА.',
        'fullDescription': 'Официальная акция немецкого бренда Körting в салонах СИМОНА. Приобретая крупную бытовую технику Körting, покупатель получает полезные аксессуары и подарки в зависимости от суммы покупки.',
        'tiers': [
            {'step': 'от 10 000 ₽', 'benefit': 'Штопор KWO 0010-PR2', 'description': 'Электрический штопор для вина в фирменном дизайне'},
            {'step': 'от 25 000 ₽', 'benefit': 'Блендер KHB 0317 W', 'description': 'Погружной блендер Tulip с насадками'},
            {'step': 'от 50 000 ₽', 'benefit': 'Комбайн KFP 0201 Diva', 'description': 'Многофункциональный кухонный комбайн'},
            {'step': 'от 75 000 ₽', 'benefit': 'Дегидратор KFD 2402 Pro', 'description': 'Профессиональный дегидратор для сушки фруктов и трав'}
        ],
        'conditions': [
            'В акции участвует весь актуальный ассортимент бытовой техники Körting в наличии на складе СИМОНА.',
            'Все приборы в комплекте должны быть из разных товарных категорий.',
            'Подарок выдается сразу при оформлении покупки в салоне или при доставке заказа.',
            'Количество акционных подарков ограничено складским резервом производителя.',
            'Бесплатное бережное хранение техники на центральном складе СИМОНА до окончания ремонта.'
        ],
        'participatingProductSlugs': korting_slugs,
        'participatingSkus': korting_skus
    },

    # 2. Körting Cascade
    {
        'id': 'promo-korting-cascade',
        'slug': 'korting-kaskad',
        'title': 'Каскадные скидки до 100% на комплект техники Körting',
        'brand': 'Körting',
        'brandCountry': 'Германия',
        'badgeText': 'Комплектная скидка',
        'discountBadge': 'Скидка до 100%',
        'timeRemaining': 'до 30 ноября 2026',
        'startDate': '2026-10-01',
        'endDate': '2026-11-30',
        'isActive': True,
        'bannerUrl': '/images/promos/promo-korting-cascade-thumb.jpg',
        'thumbnailUrl': '/images/promos/promo-korting-cascade-thumb.jpg',
        'heroBgUrl': '/images/promos/promo-korting-cascade-hero.jpg',
        'yandexBannerUrl': '/images/promos/promo-korting-cascade-yandex.jpg',
        'shortDescription': 'Каскадная программа выгоды Körting: скидка 25% на второй, 50% на третий, 75% на четвертый и 100% на пятый прибор в комплекте крупной бытовой техники.',
        'fullDescription': 'Выгодное оснащение кухни премиальной техникой Körting. Скидка применяется к наименьшему по стоимости прибору в чеке в зависимости от общего количества предметов в заказе.',
        'tiers': [
            {'step': '2 прибора', 'benefit': '–25%', 'description': 'Скидка 25% на наименьший по стоимости прибор в заказе'},
            {'step': '3 прибора', 'benefit': '–50%', 'description': 'Скидка 50% на наименьший по стоимости прибор в заказе'},
            {'step': '4 прибора', 'benefit': '–75%', 'description': 'Скидка 75% на наименьший по стоимости прибор в заказе'},
            {'step': '5 приборов', 'benefit': '–100%', 'description': 'Пятый прибор в комплекте предоставляется бесплатно'}
        ],
        'conditions': [
            'В комплекте участвует весь ассортимент крупной бытовой техники Körting, кроме МБТ.',
            'Наличие духового шкафа в заказе розницы не является строгим условием и согласовывается индивидуально.',
            'Все приборы в комплекте должны быть из разных товарных категорий актуального каталога.',
            'Скидки суммируются с действующими промо-ценами РРЦ на выделенный ассортимент.'
        ],
        'participatingProductSlugs': korting_slugs,
        'participatingSkus': korting_skus
    },

    # 3. Körting Presents
    {
        'id': 'promo-korting-razygryvaet-podarki',
        'slug': 'korting-razdaet-podarki',
        'title': 'Körting раздает подарки: посудомоечная машина или холодильник по спеццене',
        'brand': 'Körting',
        'brandCountry': 'Германия',
        'badgeText': 'Подарок за покупку',
        'discountBadge': 'Посудомойка в подарок',
        'timeRemaining': 'до 30 ноября 2026',
        'startDate': '2026-10-01',
        'endDate': '2026-11-30',
        'isActive': True,
        'bannerUrl': '/images/promos/promo-korting-presents-thumb.jpg',
        'thumbnailUrl': '/images/promos/promo-korting-presents-thumb.jpg',
        'heroBgUrl': '/images/promos/promo-korting-presents-hero.jpg',
        'yandexBannerUrl': '/images/promos/promo-korting-presents-yandex.jpg',
        'shortDescription': 'При покупке комплекта из трех приборов Körting с духовым шкафом в подарок предоставляется встраиваемая посудомоечная машина KDI 60110 или спеццена 19 990 ₽ на холодильник KSI 17780 CVNF.',
        'fullDescription': 'Флагманская промо-программа бренда Körting. При заказе комплекта техники из трех приборов (обязательно наличие духового шкафа) покупатель выбирает супер-бонус.',
        'tiers': [
            {'step': 'Комплект из 3 приборов', 'benefit': 'Посудомойка KDI 60110', 'description': 'Встраиваемая посудомоечная машина 60 см в подарок'},
            {'step': 'Альтернатива', 'benefit': 'Холодильник за 19 990 ₽', 'description': 'Специальная фиксированная цена на встраиваемый холодильник KSI 17780 CVNF'}
        ],
        'conditions': [
            'В комплекте обязательно наличие полноразмерного духового шкафа Körting.',
            'Все приборы в комплекте должны быть из разных категорий крупной бытовой техники.',
            'При отсутствии акционного прибора на складе действует опция замены с доплатой разницы.',
            'Скидки суммируются с промо-ценами на выделенный ассортимент.'
        ],
        'participatingProductSlugs': korting_slugs,
        'participatingSkus': korting_skus
    },

    # 4. Körting Kitchens PRO
    {
        'id': 'promo-korting-kitchens-pro',
        'slug': 'korting-skidka-50-varochnaya-kuhni-pro',
        'title': 'Скидка 50% на индукционную варочную панель Körting по программе Кухни PRO',
        'brand': 'Körting',
        'brandCountry': 'Германия',
        'badgeText': 'Скидка на комплект',
        'discountBadge': 'Скидка 50% на варочную',
        'timeRemaining': 'до 31 октября 2026',
        'startDate': '2026-10-01',
        'endDate': '2026-10-31',
        'isActive': True,
        'bannerUrl': '/images/promos/promo-korting-kitchens-pro-thumb.jpg',
        'thumbnailUrl': '/images/promos/promo-korting-kitchens-pro-thumb.jpg',
        'heroBgUrl': '/images/promos/promo-korting-kitchens-pro-hero.jpg',
        'yandexBannerUrl': '/images/promos/promo-korting-kitchens-pro-yandex.jpg',
        'shortDescription': 'Специальное предложение: выгода 50% на индукционные варочные поверхности HIB 67010 HID M или HIB 97010 HID M при покупке духового шкафа линейки Кухни PRO.',
        'fullDescription': 'Профессиональная серия встраиваемой техники Körting Кухни PRO. Премиальный духовой шкаф и инновационная индукционная панель со скидкой 50%.',
        'tiers': [
            {'step': 'Духовой шкаф PRO', 'benefit': '–50% на индукцию', 'description': 'Скидка 50% на варочные поверхности HIB 67010 HID M или HIB 97010 HID M'}
        ],
        'conditions': [
            'Основной прибор — любой встраиваемый духовой шкаф Körting из профессиональной серии Кухни PRO.',
            'Акционный прибор — варочные панели HIB 67010 HID M (60 см) или HIB 97010 HID M (90 см).',
            'Количество акционных варочных панелей на складе строго ограничено.'
        ],
        'participatingProductSlugs': korting_slugs,
        'participatingSkus': korting_skus
    },

    # 5. Falmec Water 50
    {
        'id': 'promo-falmec-water-50',
        'slug': 'falmec-akciya-water-50',
        'title': 'Скидка 50% на мойки и смесители Falmec Water',
        'brand': 'Falmec',
        'brandCountry': 'Италия',
        'badgeText': 'Скидка на коллекцию',
        'discountBadge': 'Скидка 50%',
        'timeRemaining': 'до 31 октября 2026',
        'startDate': '2026-10-01',
        'endDate': '2026-10-31',
        'isActive': True,
        'bannerUrl': '/images/promos/promo-falmec-water-50-thumb.jpg',
        'thumbnailUrl': '/images/promos/promo-falmec-water-50-thumb.jpg',
        'heroBgUrl': '/images/promos/promo-falmec-water-50-hero.jpg',
        'yandexBannerUrl': '/images/promos/promo-falmec-water-50-yandex.jpg',
        'shortDescription': 'Грандиозная выгода 50% от РРЦ на коллекцию кухонных моек из нержавеющей стали AISI 304 и дизайнерских смесителей Falmec Water из наличия на складе.',
        'fullDescription': 'Итальянская сантехника Falmec Water премиум-класса. Прямая скидка 50% распространяется на весь ассортимент моек и смесителей со склада в Москве.',
        'tiers': [
            {'step': 'Мойки и смесители', 'benefit': '–50% от РРЦ', 'description': 'Прямая выгода на всю коллекцию сантехники Falmec Water'}
        ],
        'conditions': [
            'Скидка 50% предоставляется от действующей рекомендованной розничной цены (РРЦ).',
            'Смесители и мойки участвуют из наличия на центральном складе в Москве.',
            'Аксессуары для моек (колландеры, дозаторы) в акции не участвуют.'
        ],
        'participatingProductSlugs': falmec_slugs,
        'participatingSkus': falmec_skus
    },

    # 6. Falmec Integrated Gifts
    {
        'id': 'promo-falmec-integrated-gifts',
        'slug': 'falmec-integrirovannye-modeli-podarki',
        'title': 'Интегрированные модели Falmec: подарок iPad или пылесос Dreame',
        'brand': 'Falmec',
        'brandCountry': 'Италия',
        'badgeText': 'Подарок за покупку',
        'discountBadge': 'Подарок Apple iPad',
        'timeRemaining': 'до 31 октября 2026',
        'startDate': '2026-10-01',
        'endDate': '2026-10-31',
        'isActive': True,
        'bannerUrl': '/images/promos/promo-falmec-integrated-gifts-thumb.jpg',
        'thumbnailUrl': '/images/promos/promo-falmec-integrated-gifts-thumb.jpg',
        'heroBgUrl': '/images/promos/promo-falmec-integrated-gifts-hero.jpg',
        'yandexBannerUrl': '/images/promos/promo-falmec-integrated-gifts-yandex.jpg',
        'shortDescription': 'При покупке флагманских вытяжек со встроенной индукцией Falmec Level One, Brera или Quantum — подарок Apple iPad 11". При покупке Falmec Zero — пылесос Dreame R10s Pro.',
        'fullDescription': 'Премиальные интегрированные варочные панели с вытяжкой Falmec. При покупке шедевров итальянской инженерной мысли покупатель получает премиальный цифровой подарок для дома.',
        'tiers': [
            {'step': 'Level One / Brera / Quantum', 'benefit': 'Apple iPad 11"', 'description': 'Планшет Apple iPad (2025) 11" 128Gb Wi-Fi в подарок'},
            {'step': 'Модель Falmec Zero', 'benefit': 'Пылесос Dreame R10s Pro', 'description': 'Беспроводной пылесос Dreame в подарок'}
        ],
        'conditions': [
            'Акция действует при заказе интегрированных вытяжек Falmec актуального ряда.',
            'Подарок передается клиенту вместе с комплектом техники.',
            'Официальная гарантия производителя на прибор и подарок.'
        ],
        'participatingProductSlugs': falmec_slugs,
        'participatingSkus': falmec_skus
    },

    # 7. Falmec Induction + Hood
    {
        'id': 'promo-falmec-induction-hood',
        'slug': 'falmec-komplekt-indukciya-i-vytyazhka',
        'title': 'Скидка 20% на комплект из индукционной панели и вытяжки Falmec',
        'brand': 'Falmec',
        'brandCountry': 'Италия',
        'badgeText': 'Скидка на комплект',
        'discountBadge': 'Скидка 20% на дуэт',
        'timeRemaining': 'до 31 октября 2026',
        'startDate': '2026-10-01',
        'endDate': '2026-10-31',
        'isActive': True,
        'bannerUrl': '/images/promos/promo-falmec-induction-hood-thumb.jpg',
        'thumbnailUrl': '/images/promos/promo-falmec-induction-hood-thumb.jpg',
        'heroBgUrl': '/images/promos/promo-falmec-induction-hood-hero.jpg',
        'yandexBannerUrl': '/images/promos/promo-falmec-induction-hood-yandex.jpg',
        'shortDescription': 'Интеллектуальная синхронизация: выгода 20% при совместной покупке индукционной поверхности и вытяжки Falmec с поддержкой беспроводного пульта управления.',
        'fullDescription': 'Безупречная интеграция вытяжки и варочной панели Falmec. Управление интенсивностью вытяжки прямо с рабочей поверхности или пульта дистанционного управления.',
        'tiers': [
            {'step': 'Дуэт приборов', 'benefit': '–20% на комплект', 'description': 'Скидка 20% при синхронной покупке индукции и вытяжки с пультом ДУ'}
        ],
        'conditions': [
            'Основной прибор — индукционная варочная панель Falmec.',
            'Второй прибор — вытяжка Falmec с поддержкой пульта ДУ (Dialogue System).',
            'Скидка 20% рассчитывается на оба прибора в комплекте.'
        ],
        'participatingProductSlugs': falmec_slugs,
        'participatingSkus': falmec_skus
    },

    # 8. Falmec Extra Discount
    {
        'id': 'promo-falmec-extra-discount',
        'slug': 'falmec-dopolnitelnaya-skidka-na-komplekt',
        'title': 'Дополнительная скидка до 20% на кухонный комплект Falmec',
        'brand': 'Falmec',
        'brandCountry': 'Италия',
        'badgeText': 'Комплектная скидка',
        'discountBadge': 'Доп. скидка до 20%',
        'timeRemaining': 'до 31 октября 2026',
        'startDate': '2026-10-01',
        'endDate': '2026-10-31',
        'isActive': True,
        'bannerUrl': '/images/promos/promo-falmec-extra-discount-thumb.jpg',
        'thumbnailUrl': '/images/promos/promo-falmec-extra-discount-thumb.jpg',
        'heroBgUrl': '/images/promos/promo-falmec-extra-discount-hero.jpg',
        'yandexBannerUrl': '/images/promos/promo-falmec-extra-discount-yandex.jpg',
        'shortDescription': 'Комплексная выгода: скидка 5% на мойку и смеситель, 10% при добавлении вытяжки и 20% при заказе полного комплекта с варочной поверхностью Falmec.',
        'fullDescription': 'Нарастающая скидка при расширении комплектации зоны мойки и приготовления Falmec.',
        'tiers': [
            {'step': 'Мойка + смеситель', 'benefit': '–5%', 'description': 'Дополнительная скидка 5% на комплект сантехники'},
            {'step': '+ вытяжка', 'benefit': '–10%', 'description': 'Скидка 10% при заказе 3 предметов'},
            {'step': '+ варочная поверхность', 'benefit': '–20%', 'description': 'Максимальная скидка 20% на весь заказ из 4 приборов'}
        ],
        'conditions': [
            'Все приборы должны быть бренда Falmec.',
            'Скидка суммируется в чеке при единовременной покупке.',
            'Бесплатная доставка и подъем на этаж службой СИМОНА.'
        ],
        'participatingProductSlugs': falmec_slugs,
        'participatingSkus': falmec_skus
    },

    # 9. Evelux 3=4
    {
        'id': 'promo-evelux-34',
        'slug': 'evelux-akciya-3-ravno-4',
        'title': 'Четвертый прибор в подарок: программа 3=4 на технику EVELUX',
        'brand': 'Evelux',
        'brandCountry': 'Словения',
        'badgeText': 'Комплектная скидка',
        'discountBadge': '4-й прибор в подарок',
        'timeRemaining': 'до 30 ноября 2026',
        'startDate': '2026-10-01',
        'endDate': '2026-11-30',
        'isActive': True,
        'bannerUrl': '/images/promos/promo-evelux-34-thumb.jpg',
        'thumbnailUrl': '/images/promos/promo-evelux-34-thumb.jpg',
        'heroBgUrl': '/images/promos/promo-evelux-34-hero.jpg',
        'yandexBannerUrl': '/images/promos/promo-evelux-34-yandex.jpg',
        'shortDescription': 'При заказе трех приборов крупной бытовой техники EVELUX с духовым шкафом четвёртый предмет с наименьшей стоимостью предоставляется в подарок.',
        'fullDescription': 'Официальная промо-акция бренда EVELUX. Полное оснащение современной кухни: духовой шкаф, варочная панель, вытяжка и посудомоечная машина — платите только за три прибора.',
        'tiers': [
            {'step': '3 прибора КБТ', 'benefit': '4-й прибор в подарок', 'description': 'Наименьший по стоимости предмет в заказе оформляется со 100% скидкой'}
        ],
        'conditions': [
            'В акции участвует весь ассортимент техники Evelux (с пометкой FIX в 1С).',
            'В комплекте обязательно наличие духового шкафа Evelux.',
            'Все 4 прибора должны быть из разных товарных категорий.',
            'Скидки суммируются с промо-ценами на выделенный ассортимент.'
        ],
        'participatingProductSlugs': evelux_slugs,
        'participatingSkus': evelux_skus
    },

    # 10. Evelux Cascade
    {
        'id': 'promo-evelux-cascade',
        'slug': 'evelux-kaskad',
        'title': 'Каскадные скидки до 100% на технику EVELUX',
        'brand': 'Evelux',
        'brandCountry': 'Словения',
        'badgeText': 'Комплектная скидка',
        'discountBadge': 'Скидка до 100%',
        'timeRemaining': 'до 30 ноября 2026',
        'startDate': '2026-10-01',
        'endDate': '2026-11-30',
        'isActive': True,
        'bannerUrl': '/images/promos/promo-evelux-cascade-thumb.jpg',
        'thumbnailUrl': '/images/promos/promo-evelux-cascade-thumb.jpg',
        'heroBgUrl': '/images/promos/promo-evelux-cascade-hero.jpg',
        'yandexBannerUrl': '/images/promos/promo-evelux-cascade-yandex.jpg',
        'shortDescription': 'Каскадная система скидок на комплекты EVELUX: 25% на второй, 50% на третий, 75% на четвертый и 100% на пятый прибор крупной бытовой техники.',
        'fullDescription': 'Приобретайте комплект техники EVELUX с максимальной ступенчатой выгодой. В акции участвует крупная встраиваемая и отдельностоящая техника актуального модельного ряда.',
        'tiers': [
            {'step': '2 прибора', 'benefit': '–25%', 'description': 'Скидка 25% на наименьший по стоимости прибор'},
            {'step': '3 прибора', 'benefit': '–50%', 'description': 'Скидка 50% на наименьший по стоимости прибор'},
            {'step': '4 прибора', 'benefit': '–75%', 'description': 'Скидка 75% на наименьший по стоимости прибор'},
            {'step': '5 приборов', 'benefit': '–100%', 'description': 'Пятый прибор в заказе оформляется бесплатно'}
        ],
        'conditions': [
            'В акции участвует крупная бытовая техника Evelux в наличии на складе.',
            'Наличие духовки в заказе розницы может обсуждаться индивидуально.',
            'Все приборы в комплекте должны быть из разных категорий.'
        ],
        'participatingProductSlugs': evelux_slugs,
        'participatingSkus': evelux_skus
    },

    # 11. Evelux Gifts
    {
        'id': 'promo-evelux-gifts',
        'slug': 'evelux-pokupka-eto-podarok',
        'title': 'Покупка – это подарок: полезные аксессуары EVELUX',
        'brand': 'Evelux',
        'brandCountry': 'Словения',
        'badgeText': 'Подарок за покупку',
        'discountBadge': 'Подарки до 15 000 ₽',
        'timeRemaining': 'до 30 ноября 2026',
        'startDate': '2026-10-01',
        'endDate': '2026-11-30',
        'isActive': True,
        'bannerUrl': '/images/promos/promo-evelux-gifts-thumb.jpg',
        'thumbnailUrl': '/images/promos/promo-evelux-gifts-thumb.jpg',
        'heroBgUrl': '/images/promos/promo-evelux-gifts-hero.jpg',
        'yandexBannerUrl': '/images/promos/promo-evelux-gifts-yandex.jpg',
        'shortDescription': 'Подарки при покупке техники EVELUX: весы EBS 1001 при заказе от 10 000 ₽, стеклянный чайник EWK 0904 G от 20 000 ₽ или блендер EHB 0301 B от 30 000 ₽.',
        'fullDescription': 'Приятные бонусы к заказу техники EVELUX в салонах СИМОНА. Приобретая крупную технику, вы получаете стильные приборы МБТ в подарок.',
        'tiers': [
            {'step': 'от 10 000 ₽', 'benefit': 'Весы EBS 1001', 'description': 'Электронные напольные весы EVELUX в подарок'},
            {'step': 'от 20 000 ₽', 'benefit': 'Чайник EWK 0904 G', 'description': 'Стеклянный электрочайник с LED-подсветкой в подарок'},
            {'step': 'от 30 000 ₽', 'benefit': 'Блендер EHB 0301 B', 'description': 'Погружной блендер с измельчителем в подарок'}
        ],
        'conditions': [
            'В акции участвует весь ассортимент бытовой техники Evelux из наличия.',
            'Сумма чека рассчитывается с учетом всех действующих скидок.',
            'Подарок выдается сразу при подтверждении заказа.'
        ],
        'participatingProductSlugs': evelux_slugs,
        'participatingSkus': evelux_skus
    },

    # 12. VARD Top Models
    {
        'id': 'promo-vard-top-models',
        'slug': 'vard-vygoda-15-20-populyarnye-modeli',
        'title': 'Выгода 15-20% на популярные модели техники VARD',
        'brand': 'VARD',
        'brandCountry': 'Германия',
        'badgeText': 'Специальные цены',
        'discountBadge': 'Скидка до 20%',
        'timeRemaining': 'до 31 октября 2026',
        'startDate': '2026-10-01',
        'endDate': '2026-10-31',
        'isActive': True,
        'bannerUrl': '/images/promos/promo-vard-top-models-thumb.jpg',
        'thumbnailUrl': '/images/promos/promo-vard-top-models-thumb.jpg',
        'heroBgUrl': '/images/promos/promo-vard-top-models-hero.jpg',
        'yandexBannerUrl': '/images/promos/promo-vard-top-models-yandex.jpg',
        'shortDescription': 'Специальные сниженные цены на бестселлеры крупной бытовой техники VARD: духовые шкафы, индукционные панели, вытяжки и посудомоечные машины.',
        'fullDescription': 'Премиальный комфорт и лаконичный дизайн техники VARD с прямой выгодой до 20%. Специальные условия на выделенный пул приборов бренда в салонах СИМОНА.',
        'tiers': [
            {'step': 'Выделенный пул SKU', 'benefit': '–15% ... –20%', 'description': 'Фиксированные специальные промо-цены на популярные модели'}
        ],
        'conditions': [
            'Спеццены действуют на выделенный ассортимент техники VARD в рознице.',
            'Цены в каталоге указаны с учетом специального предложения.',
            'Официальная гарантия производителя 3 года.'
        ],
        'participatingProductSlugs': vard_slugs,
        'participatingSkus': vard_skus
    },

    # 13. VARD Cascade
    {
        'id': 'promo-vard-cascade',
        'slug': 'vard-kaskad',
        'title': 'Каскадные скидки до 100% на комплект техники VARD',
        'brand': 'VARD',
        'brandCountry': 'Германия',
        'badgeText': 'Комплектная скидка',
        'discountBadge': 'Скидка до 100%',
        'timeRemaining': 'до 31 октября 2026',
        'startDate': '2026-10-01',
        'endDate': '2026-10-31',
        'isActive': True,
        'bannerUrl': '/images/promos/promo-vard-cascade-thumb.jpg',
        'thumbnailUrl': '/images/promos/promo-vard-cascade-thumb.jpg',
        'heroBgUrl': '/images/promos/promo-vard-cascade-hero.jpg',
        'yandexBannerUrl': '/images/promos/promo-vard-cascade-yandex.jpg',
        'shortDescription': 'Комплектная программа VARD: 25% скидка на второй, 50% на третий, 75% на четвертый и 100% на пятый предмет крупной бытовой техники в заказе.',
        'fullDescription': 'Ступенчатая каскадная выгода при комплексном заказе приборов VARD для новой кухни. Скидка начисляется на товар по наименьшей стоимости в чеке.',
        'tiers': [
            {'step': '2 любых прибора', 'benefit': '–25%', 'description': 'Скидка 25% на наименьший по стоимости товар в чеке'},
            {'step': '3 любых прибора', 'benefit': '–50%', 'description': 'Скидка 50% на наименьший по стоимости товар в чеке'},
            {'step': '4 любых прибора', 'benefit': '–75%', 'description': 'Скидка 75% на наименьший по стоимости товар в чеке'},
            {'step': '5 любых приборов', 'benefit': '–100%', 'description': 'Скидка 100% на наименьший по стоимости товар в чеке'}
        ],
        'conditions': [
            'В акции участвуют любые модели крупной бытовой техники VARD из акционного списка.',
            'Скидка предоставляется на товар с наименьшей стоимостью в заказе.',
            'Акция может суммироваться с акцией на подарок (набор мельниц).'
        ],
        'participatingProductSlugs': vard_slugs,
        'participatingSkus': vard_skus
    },

    # 14. VARD Mill Gift
    {
        'id': 'promo-vard-mill-gift',
        'slug': 'vard-podarok-nabor-melnic',
        'title': 'Набор мельниц для специй VARD в подарок при заказе от 3 приборов',
        'brand': 'VARD',
        'brandCountry': 'Германия',
        'badgeText': 'Подарок за покупку',
        'discountBadge': 'Мельницы в подарок',
        'timeRemaining': 'до 31 октября 2026',
        'startDate': '2026-10-01',
        'endDate': '2026-10-31',
        'isActive': True,
        'bannerUrl': '/images/promos/promo-vard-mill-gift-thumb.jpg',
        'thumbnailUrl': '/images/promos/promo-vard-mill-gift-thumb.jpg',
        'heroBgUrl': '/images/promos/promo-vard-mill-gift-hero.jpg',
        'yandexBannerUrl': '/images/promos/promo-vard-mill-gift-yandex.jpg',
        'shortDescription': 'При покупке от 3 любых единиц крупной бытовой техники VARD покупатель получает в подарок дизайнерский набор мельниц для специй VARD VSMPS26T.',
        'fullDescription': 'Акция для ценителей кулинарного искусства. Фирменный набор автоматических гравитационных мельниц для соли и перца VARD станет стильным украшением вашей кухни.',
        'tiers': [
            {'step': 'от 3 приборов КБТ', 'benefit': 'Набор мельниц VSMPS26T', 'description': 'Автоматический набор гравитационных мельниц для специй VARD в подарок'}
        ],
        'conditions': [
            'В акции участвует весь ассортимент крупной бытовой техники VARD.',
            'Акция может накладываться на акцию «Каскад VARD».',
            'Акция не суммируется с акцией на кофеварку.',
            'Подарок выдается при оформлении комплекта в салонах СИМОНА.'
        ],
        'participatingProductSlugs': vard_slugs,
        'participatingSkus': vard_skus
    },

    # 15. VARD Coffee Maker Gift
    {
        'id': 'promo-vard-coffee-maker-gift',
        'slug': 'vard-podarok-kofevarka',
        'title': 'Кофеварка эспрессо VARD в подарок при покупке от 4 приборов',
        'brand': 'VARD',
        'brandCountry': 'Германия',
        'badgeText': 'Подарок за покупку',
        'discountBadge': 'Кофеварка в подарок',
        'timeRemaining': 'до 31 октября 2026',
        'startDate': '2026-10-01',
        'endDate': '2026-10-31',
        'isActive': True,
        'bannerUrl': '/images/promos/promo-vard-coffee-maker-gift-thumb.jpg',
        'thumbnailUrl': '/images/promos/promo-vard-coffee-maker-gift-thumb.jpg',
        'heroBgUrl': '/images/promos/promo-vard-coffee-maker-gift-hero.jpg',
        'yandexBannerUrl': '/images/promos/promo-vard-coffee-maker-gift-yandex.jpg',
        'shortDescription': 'При покупке от 4 любых единиц крупной бытовой техники VARD — стильная рожковая кофеварка эспрессо VARD на выбор (VCPA1C, VCPA1V, VCPA1A или VCPA1O) в подарок.',
        'fullDescription': 'Ароматный кофе каждый день: при заказе полного комплекта техники VARD из 4 приборов покупатель получает итальянскую рожковую кофеварку с давлением 20 бар в подарок.',
        'tiers': [
            {'step': 'от 4 приборов КБТ', 'benefit': 'Кофеварка VCPA1C', 'description': 'Рожковая кофеварка эспрессо VARD с давлением 20 бар на выбор по цвету в подарок'}
        ],
        'conditions': [
            'В акции участвует весь ассортимент крупной бытовой техники VARD.',
            'Покупатель может выбрать любой доступный цвет корпуса кофеварки.',
            'Акция может накладываться на акцию «Каскад VARD».',
            'Подарок выдается вместе с заказом.'
        ],
        'participatingProductSlugs': vard_slugs,
        'participatingSkus': vard_skus
    },
]

# Generate new promosData.ts
ts_code = """import { ManufacturerPromo, ProductItem } from '@/types';

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
"""

for p in promos:
    ts_code += f"""  {{
    id: '{p['id']}',
    slug: '{p['slug']}',
    title: {json.dumps(p['title'], ensure_ascii=False)},
    brand: '{p['brand']}',
    brandCountry: '{p.get('brandCountry', '')}',
    badgeText: '{p['badgeText']}',
    discountBadge: '{p['discountBadge']}',
    timeRemaining: '{p['timeRemaining']}',
    startDate: '{p['startDate']}',
    endDate: '{p['endDate']}',
    isActive: true,
    bannerUrl: '{p['bannerUrl']}',
    thumbnailUrl: '{p['thumbnailUrl']}',
    heroBgUrl: '{p['heroBgUrl']}',
    yandexBannerUrl: '{p['yandexBannerUrl']}',
    shortDescription: {json.dumps(p['shortDescription'], ensure_ascii=False)},
    fullDescription: {json.dumps(p['fullDescription'], ensure_ascii=False)},
    tiers: {json.dumps(p['tiers'], ensure_ascii=False, indent=6)},
    conditions: {json.dumps(p['conditions'], ensure_ascii=False, indent=6)},
    participatingSkus: {json.dumps(p['participatingSkus'], ensure_ascii=False)},
    participatingProductSlugs: {json.dumps(p['participatingProductSlugs'], ensure_ascii=False)},
  }},
"""

# Add archived September promos
archived_promos = [
    {
        'id': 'promo-smeg-bundle-archived',
        'slug': 'smeg-skidki-na-komplekty',
        'title': 'Скидки до 20% на комплекты техники Smeg',
        'brand': 'SMEG',
        'badgeText': 'Комплектная скидка',
        'discountBadge': 'Скидка до 20%',
        'timeRemaining': 'Акция завершена 30 сентября 2026',
        'startDate': '2026-09-01',
        'endDate': '2026-09-30',
        'isActive': False,
        'bannerUrl': '/images/promos/promo-smeg-bundle.jpg',
        'thumbnailUrl': '/images/promos/promo-smeg-bundle.jpg',
        'heroBgUrl': '/images/promos/promo-smeg-bundle.jpg',
        'shortDescription': 'Специальное предложение на комплекты встраиваемой и соло техники Smeg.',
        'fullDescription': 'Акция завершилась 30 сентября 2026 года. Следите за актуальными предложениями бренда в салонах СИМОНА.',
        'tiers': [],
        'conditions': ['Акция завершена.'],
        'participatingSkus': [],
        'participatingProductSlugs': [],
    },
    {
        'id': 'promo-asko-autumn-archived',
        'slug': 'asko-specialnye-predlozheniya-osen',
        'title': 'Специальные условия на технику ASKO',
        'brand': 'ASKO',
        'badgeText': 'Специальные условия',
        'discountBadge': 'Спецусловия',
        'timeRemaining': 'Акция завершена 30 сентября 2026',
        'startDate': '2026-09-01',
        'endDate': '2026-09-30',
        'isActive': False,
        'bannerUrl': '/images/promos/promo-korting-formula.jpg',
        'thumbnailUrl': '/images/promos/promo-korting-formula.jpg',
        'heroBgUrl': '/images/promos/promo-korting-formula.jpg',
        'shortDescription': 'Специальная программа на скандинавскую технику ASKO для кухни и ухода за бельем.',
        'fullDescription': 'Акция завершилась 30 сентября 2026 года. Следите за актуальными предложениями бренда в салонах СИМОНА.',
        'tiers': [],
        'conditions': ['Акция завершена.'],
        'participatingSkus': [],
        'participatingProductSlugs': [],
    }
]

for p in archived_promos:
    ts_code += f"""  {{
    id: '{p['id']}',
    slug: '{p['slug']}',
    title: {json.dumps(p['title'], ensure_ascii=False)},
    brand: '{p['brand']}',
    badgeText: '{p['badgeText']}',
    discountBadge: '{p['discountBadge']}',
    timeRemaining: '{p['timeRemaining']}',
    startDate: '{p['startDate']}',
    endDate: '{p['endDate']}',
    isActive: false,
    bannerUrl: '{p['bannerUrl']}',
    thumbnailUrl: '{p['thumbnailUrl']}',
    heroBgUrl: '{p['heroBgUrl']}',
    shortDescription: {json.dumps(p['shortDescription'], ensure_ascii=False)},
    fullDescription: {json.dumps(p['fullDescription'], ensure_ascii=False)},
    tiers: {json.dumps(p['tiers'], ensure_ascii=False, indent=6)},
    conditions: {json.dumps(p['conditions'], ensure_ascii=False, indent=6)},
    participatingSkus: {json.dumps(p['participatingSkus'], ensure_ascii=False)},
    participatingProductSlugs: {json.dumps(p['participatingProductSlugs'], ensure_ascii=False)},
  }},
"""

ts_code += """];

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
"""

with open('data/promosData.ts', 'w', encoding='utf-8') as f:
    f.write(ts_code)

print("data/promosData.ts successfully regenerated with Tiers Grid and Conditions Checklist!")

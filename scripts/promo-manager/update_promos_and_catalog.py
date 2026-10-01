import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

# 1. Load October products
with open('scripts/promo-manager/october_products.json', 'r', encoding='utf-8') as f:
    october_prods = json.load(f)

print(f"Loaded {len(october_prods)} October products.")

# 2. Update data/catalogData.ts
with open('data/catalogData.ts', 'r', encoding='utf-8') as f:
    cat_content = f.read()

# Check if products already added
added_count = 0
new_items_code = []
for p in october_prods:
    if f"id: '{p['id']}'" not in cat_content and f"sku: '{p['sku']}'" not in cat_content:
        # format product item as typescript object
        img_list_str = json.dumps(p['images'], ensure_ascii=False)
        item_code = f"""  {{
    id: '{p['id']}',
    sku: '{p['sku']}',
    name: {json.dumps(p['name'], ensure_ascii=False)},
    slug: '{p['slug']}',
    brand: '{p['brand']}',
    category: '{p['category']}',
    categoryType: 'CATEGORY_B',
    physicalStatus: '{p['physicalStatus']}',
    price: {p['price']},
    oldPrice: {p['oldPrice']},
    inStock: true,
    stockCount: {p['stockCount']},
    rating: {p['rating']},
    reviewsCount: {p['reviewsCount']},
    shortDesc: {json.dumps(p['shortDesc'], ensure_ascii=False)},
    description: {json.dumps(p['description'], ensure_ascii=False)},
    images: {img_list_str},
    badge: '{p['badge']}',
    isFeatured: true,
  }},"""
        new_items_code.append(item_code)
        added_count += 1

if new_items_code:
    # Insert before the closing bracket of CATALOG_PRODUCTS
    # Find the end of export const CATALOG_PRODUCTS: ProductItem[] = [ ... ];
    cat_content = re.sub(
        r'(export const CATALOG_PRODUCTS:\s*ProductItem\[\]\s*=\s*\[)(.*?)(\n\];)',
        r'\1\2\n' + '\n'.join(new_items_code) + r'\3',
        cat_content,
        flags=re.DOTALL
    )
    with open('data/catalogData.ts', 'w', encoding='utf-8') as f:
        f.write(cat_content)
    print(f"Added {added_count} products into data/catalogData.ts.")
else:
    print("Catalog products already up to date.")

# 3. Construct 15 October Promos + Archive September Promos
# Let's map products per brand:
brand_slugs = {}
for p in october_prods:
    b = p['brand']
    brand_slugs.setdefault(b, []).append(p['slug'])

korting_slugs = brand_slugs.get('Körting', [])
falmec_slugs = brand_slugs.get('Falmec', [])
evelux_slugs = brand_slugs.get('Evelux', [])
vard_slugs = brand_slugs.get('VARD', [])

october_promos = [
    # --- KÖRTING ---
    {
        'id': 'promo-korting-gifts',
        'slug': 'korting-pokupka-eto-podarok1',
        'title': 'Покупка – это подарок: премиальные аксессуары Körting',
        'brand': 'Körting',
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
        'fullDescription': 'Официальная акция немецкого бренда Körting в салонах СИМОНА. Приобретая крупную и встраиваемую бытовую технику Körting, покупатель получает полезные подарки в зависимости от суммы покупки. Все приборы в чеке должны быть из разных товарных категорий актуального ассортимента. Количество акционных подарков ограничено.',
        'actionItems': [
            'Выберите приборы Körting из разных категорий на сумму от 10 000 ₽.',
            'При заказе от 10 000 ₽ в подарок предоставляется электрический штопор KWO 0010-PR2.',
            'При заказе от 25 000 ₽ — погружной блендер KHB 0317 W Tulip.',
            'При заказе от 50 000 ₽ — кухонный комбайн KFP 0201 Diva.',
            'При заказе от 75 000 ₽ — дегидратор KFD 2402 Pro.',
            'Оформите заказ на сайте или посетите салон СИМОНА для демонстрации приборов.'
        ],
        'participatingProductSlugs': korting_slugs,
        'participatingSkus': [p['sku'] for p in october_prods if p['brand'] == 'Körting']
    },
    {
        'id': 'promo-korting-cascade',
        'slug': 'korting-kaskad',
        'title': 'Каскадные скидки до 100% на комплект техники Körting',
        'brand': 'Körting',
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
        'fullDescription': 'Выгодное оснащение кухни премиальной техникой Körting. Скидка применяется к наименьшему по стоимости прибору в чеке в зависимости от общего количества предметов в заказе. В комплекте участвует крупная встраиваемая и соло техника из разных категорий актуального модельного ряда.',
        'actionItems': [
            'Подберите от 2 до 5 приборов Körting из разных категорий крупной техники.',
            '2 прибора — скидка 25% на наименьший по стоимости прибор.',
            '3 прибора — скидка 50% на наименьший по стоимости прибор.',
            '4 прибора — скидка 75% на наименьший по стоимости прибор.',
            '5 приборов — скидка 100% на наименьший по стоимости прибор.',
            'Скидки суммируются с промо-ценами РРЦ, действующими в этот период.'
        ],
        'participatingProductSlugs': korting_slugs,
        'participatingSkus': [p['sku'] for p in october_prods if p['brand'] == 'Körting']
    },
    {
        'id': 'promo-korting-razygryvaet-podarki',
        'slug': 'korting-razdaet-podarki',
        'title': 'Körting раздает подарки: посудомоечная машина или холодильник по спеццене',
        'brand': 'Körting',
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
        'fullDescription': 'Масштабная промо-программа бренда Körting. При заказе комплекта техники из трех приборов (обязательно наличие духового шкафа) покупатель выбирает: полноценная посудомоечная машина KDI 60110 в подарок либо специальная цена 19 990 ₽ на встраиваемый холодильник NoFrost KSI 17780 CVNF.',
        'actionItems': [
            'Сформируйте комплект из трех приборов крупной техники Körting (включая духовой шкаф).',
            'Все приборы должны быть из разных категорий ассортимента Körting в наличии.',
            'Выберите бонус: бесплатная посудомоечная машина KDI 60110 или холодильник KSI 17780 CVNF за 19 990 ₽.',
            'Скидка суммируется с действующими акционными ценами на выделенный ассортимент.'
        ],
        'participatingProductSlugs': korting_slugs,
        'participatingSkus': [p['sku'] for p in october_prods if p['brand'] == 'Körting']
    },
    {
        'id': 'promo-korting-kitchens-pro',
        'slug': 'korting-skidka-50-varochnaya-kuhni-pro',
        'title': 'Скидка 50% на индукционную варочную панель Körting по программе Кухни PRO',
        'brand': 'Körting',
        'discountBadge': 'Скидка 50% на варочную',
        'timeRemaining': 'до 31 октября 2026',
        'startDate': '2026-10-01',
        'endDate': '2026-10-31',
        'isActive': True,
        'bannerUrl': '/images/promos/promo-korting-kitchens-pro-thumb.jpg',
        'thumbnailUrl': '/images/promos/promo-korting-kitchens-pro-thumb.jpg',
        'heroBgUrl': '/images/promos/promo-korting-kitchens-pro-hero.jpg',
        'yandexBannerUrl': '/images/promos/promo-korting-kitchens-pro-yandex.jpg',
        'shortDescription': 'Специальное предложение для студий кухонь и розничных покупателей: выгода 50% на индукционные варочные поверхности HIB 67010 HID M или HIB 97010 HID M при покупке духового шкафа линейки Кухни PRO.',
        'fullDescription': 'Профессиональная серия встраиваемой техники Körting Кухни PRO. При покупке премиального духового шкафа предоставляется прямая скидка 50% на флагманские индукционные панели со скрытым монтажом и зонами Bridge.',
        'actionItems': [
            'Выберите встраиваемый духовой шкаф Körting из линейки Кухни PRO.',
            'Добавьте в комплект индукционную панель HIB 67010 HID M (60 см) или HIB 97010 HID M (90 см).',
            'Получите скидку 50% на выбранную варочную поверхность в салоне СИМОНА.'
        ],
        'participatingProductSlugs': korting_slugs,
        'participatingSkus': [p['sku'] for p in october_prods if p['brand'] == 'Körting']
    },

    # --- FALMEC ---
    {
        'id': 'promo-falmec-water-50',
        'slug': 'falmec-akciya-water-50',
        'title': 'Скидка 50% на мойки и смесители Falmec Water',
        'brand': 'Falmec',
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
        'fullDescription': 'Итальянская сантехника Falmec Water премиум-класса. Прямая скидка 50% распространяется на весь ассортимент моек и смесителей со склада в Москве. Идеальное решение для завершения единого итальянского стиля кухонной зоны.',
        'actionItems': [
            'Выберите мойку или смеситель Falmec из коллекции Water из складского наличия.',
            'Получите моментальную скидку 50% от рекомендованной розничной цены (РРЦ).',
            'Аксессуары для моек приобретаются отдельно.'
        ],
        'participatingProductSlugs': falmec_slugs,
        'participatingSkus': [p['sku'] for p in october_prods if p['brand'] == 'Falmec']
    },
    {
        'id': 'promo-falmec-integrated-gifts',
        'slug': 'falmec-integrirovannye-modeli-podarki',
        'title': 'Интегрированные модели Falmec: подарок iPad или пылесос Dreame',
        'brand': 'Falmec',
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
        'actionItems': [
            'При заказе модели Level One — планшет Apple iPad (2025) 11" 128Gb Wi-Fi в подарок.',
            'При заказе моделей Brera — планшет Apple iPad (2025) 11" 128Gb Wi-Fi в подарок.',
            'При заказе моделей Quantum — планшет Apple iPad (2025) 11" 128Gb Wi-Fi в подарок.',
            'При заказе вытяжки Zero — мощный беспроводной пылесос Dreame R10s Pro в подарок.'
        ],
        'participatingProductSlugs': falmec_slugs,
        'participatingSkus': [p['sku'] for p in october_prods if p['brand'] == 'Falmec']
    },
    {
        'id': 'promo-falmec-induction-hood',
        'slug': 'falmec-komplekt-indukciya-i-vytyazhka',
        'title': 'Скидка 20% на комплект из индукционной панели и вытяжки Falmec',
        'brand': 'Falmec',
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
        'actionItems': [
            'Выберите индукционную варочную панель Falmec.',
            'Добавьте совместимую вытяжку Falmec с поддержкой пульта ДУ (Dialogue System).',
            'Получите прямую скидку 20% на весь комплект в салоне СИМОНА.'
        ],
        'participatingProductSlugs': falmec_slugs,
        'participatingSkus': [p['sku'] for p in october_prods if p['brand'] == 'Falmec']
    },
    {
        'id': 'promo-falmec-extra-discount',
        'slug': 'falmec-dopolnitelnaya-skidka-na-komplekt',
        'title': 'Дополнительная скидка до 20% на кухонный комплект Falmec',
        'brand': 'Falmec',
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
        'fullDescription': 'Нарастающая скидка при расширении комплектации зоны мойки и приготовления Falmec. Создайте гармоничный итальянский интерьер кухни с максимальной экономией бюджета.',
        'actionItems': [
            'Мойка + смеситель Falmec — дополнительная скидка 5%.',
            'Мойка + смеситель + вытяжка Falmec — дополнительная скидка 10%.',
            'Мойка + смеситель + вытяжка + варочная поверхность Falmec — скидка 20%.',
            'Скидки рассчитываются персональным менеджером при оформлении заказа.'
        ],
        'participatingProductSlugs': falmec_slugs,
        'participatingSkus': [p['sku'] for p in october_prods if p['brand'] == 'Falmec']
    },

    # --- EVELUX ---
    {
        'id': 'promo-evelux-34',
        'slug': 'evelux-akciya-3-ravno-4',
        'title': 'Четвертый прибор в подарок: программа 3=4 на технику EVELUX',
        'brand': 'Evelux',
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
        'actionItems': [
            'Выберите три прибора крупной бытовой техники EVELUX (обязательно наличие духового шкафа).',
            'Добавьте четвёртый прибор из любой другой категории крупной техники.',
            'Четвёртый предмет с наименьшей стоимостью в чеке оформляется бесплатно в подарок.',
            'Приборы должны быть из актуального ассортимента в наличии.'
        ],
        'participatingProductSlugs': evelux_slugs,
        'participatingSkus': [p['sku'] for p in october_prods if p['brand'] == 'Evelux']
    },
    {
        'id': 'promo-evelux-cascade',
        'slug': 'evelux-kaskad',
        'title': 'Каскадные скидки до 100% на технику EVELUX',
        'brand': 'Evelux',
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
        'actionItems': [
            '2 прибора в заказе — скидка 25% на наименьший по стоимости прибор.',
            '3 прибора в заказе — скидка 50% на наименьший по стоимости прибор.',
            '4 прибора в заказе — скидка 75% на наименьший по стоимости прибор.',
            '5 приборов в заказе — скидка 100% на наименьший по стоимости прибор.'
        ],
        'participatingProductSlugs': evelux_slugs,
        'participatingSkus': [p['sku'] for p in october_prods if p['brand'] == 'Evelux']
    },
    {
        'id': 'promo-evelux-gifts',
        'slug': 'evelux-pokupka-eto-podarok',
        'title': 'Покупка – это подарок: полезные аксессуары EVELUX',
        'brand': 'Evelux',
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
        'fullDescription': 'Приятные бонусы к заказу техники EVELUX в салонах СИМОНА. Приобретая крупную технику, вы получаете стильные и практичные приборы малой бытовой техники бренда в подарок.',
        'actionItems': [
            'Заказ от 10 000 ₽ — электронные напольные весы EVELUX EBS 1001 в подарок.',
            'Заказ от 20 000 ₽ — стеклянный чайник с подсветкой EVELUX EWK 0904 G в подарок.',
            'Заказ от 30 000 ₽ — мощный погружной блендер EVELUX EHB 0301 B в подарок.',
            'Подарки выдаются при оформлении заказа в салонах СИМОНА.'
        ],
        'participatingProductSlugs': evelux_slugs,
        'participatingSkus': [p['sku'] for p in october_prods if p['brand'] == 'Evelux']
    },

    # --- VARD ---
    {
        'id': 'promo-vard-top-models',
        'slug': 'vard-vygoda-15-20-populyarnye-modeli',
        'title': 'Выгода 15-20% на популярные модели техники VARD',
        'brand': 'VARD',
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
        'fullDescription': 'Премиальный комфорт и лаконичный дизайн техники VARD с прямой выгодой до 20%. Специальные условия на выделенный пул самых востребованных приборов бренда в салонах СИМОНА.',
        'actionItems': [
            'Выберите акционную модель техники VARD из специального каталога.',
            'Получите прямую скидку 15% или 20% при оформлении покупки.',
            'Спеццены действуют на технику в наличии на складе в Нижнем Новгороде.'
        ],
        'participatingProductSlugs': vard_slugs,
        'participatingSkus': [p['sku'] for p in october_prods if p['brand'] == 'VARD']
    },
    {
        'id': 'promo-vard-cascade',
        'slug': 'vard-kaskad',
        'title': 'Каскадные скидки до 100% на комплект техники VARD',
        'brand': 'VARD',
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
        'actionItems': [
            '2 любых прибора техники VARD — скидка 25% на наименьший по цене товар.',
            '3 любых прибора техники VARD — скидка 50% на наименьший по цене товар.',
            '4 любых прибора техники VARD — скидка 75% на наименьший по цене товар.',
            '5 любых приборов техники VARD — скидка 100% на наименьший по цене товар.'
        ],
        'participatingProductSlugs': vard_slugs,
        'participatingSkus': [p['sku'] for p in october_prods if p['brand'] == 'VARD']
    },
    {
        'id': 'promo-vard-mill-gift',
        'slug': 'vard-podarok-nabor-melnic',
        'title': 'Набор мельниц для специй VARD в подарок при заказе от 3 приборов',
        'brand': 'VARD',
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
        'actionItems': [
            'Сформируйте заказ из 3 и более любых приборов крупной техники VARD.',
            'Получите автоматический набор мельниц VSMPS26T в подарок.',
            'Акция может суммироваться с акцией Каскад VARD.'
        ],
        'participatingProductSlugs': vard_slugs,
        'participatingSkus': [p['sku'] for p in october_prods if p['brand'] == 'VARD']
    },
    {
        'id': 'promo-vard-coffee-maker-gift',
        'slug': 'vard-podarok-kofevarka',
        'title': 'Кофеварка эспрессо VARD в подарок при покупке от 4 приборов',
        'brand': 'VARD',
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
        'actionItems': [
            'Выберите от 4 приборов крупной бытовой техники VARD.',
            'Выберите понравившийся цвет кофеварки VARD: крем, черный, красный или оранжевый.',
            'Кофеварка передается в подарок вместе с комплектом техники.',
            'Акция суммируется с каскадной скидкой VARD.'
        ],
        'participatingProductSlugs': vard_slugs,
        'participatingSkus': [p['sku'] for p in october_prods if p['brand'] == 'VARD']
    },
]

# Read existing promos to keep archived ones (September ASKO, SMEG, Miele, Liebherr)
with open('data/promosData.ts', 'r', encoding='utf-8') as f:
    orig_text = f.read()

# Generate new promosData.ts file
ts_code = """import { ManufacturerPromo, ProductItem } from '@/types';

/**
 * Единый реестр официальных промо-акций европейских производителей бытовой техники.
 * Источник истины: Asana (проект 'Розница Симона', раздел 'Акции, вебинары').
 * Актуализировано автономным скиллом simona-promo-manager: Октябрь 2026.
 */
export const MANUFACTURER_PROMOS: ManufacturerPromo[] = [
"""

for p in october_promos:
    ts_code += f"""  {{
    id: '{p['id']}',
    slug: '{p['slug']}',
    title: {json.dumps(p['title'], ensure_ascii=False)},
    brand: '{p['brand']}',
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
    actionItems: {json.dumps(p['actionItems'], ensure_ascii=False, indent=6)},
    participatingSkus: {json.dumps(p['participatingSkus'], ensure_ascii=False)},
    participatingProductSlugs: {json.dumps(p['participatingProductSlugs'], ensure_ascii=False)},
  }},
"""

# Add archived September promos as isActive: false so existing slugs don't return 404
archived_promos = [
    {
        'id': 'promo-smeg-bundle-archived',
        'slug': 'smeg-skidki-na-komplekty',
        'title': 'Скидки до 20% на комплекты техники Smeg',
        'brand': 'SMEG',
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
        'actionItems': ['Акция завершена.'],
        'participatingSkus': [],
        'participatingProductSlugs': [],
    },
    {
        'id': 'promo-asko-autumn-archived',
        'slug': 'asko-specialnye-predlozheniya-osen',
        'title': 'Специальные условия на технику ASKO',
        'brand': 'ASKO',
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
        'actionItems': ['Акция завершена.'],
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
    actionItems: {json.dumps(p['actionItems'], ensure_ascii=False, indent=6)},
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

print("data/promosData.ts updated with helper functions!")

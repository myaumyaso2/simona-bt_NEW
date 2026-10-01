import gzip
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with gzip.open('data/exported_catalog_products.json.gz', 'rt', encoding='utf-8') as f:
    master = json.load(f)

# Find top products with good photos and prices for target brands
brands_target = {
    'KORTING': ['духовой шкаф', 'варочная панель', 'посудомоечная машина', 'вытяжка', 'холодильник'],
    'FALMEC': ['вытяжка', 'мойка', 'смеситель', 'варочная'],
    'EVELUX': ['духовой шкаф', 'варочная панель', 'посудомоечная машина'],
    'VARD': ['духовой шкаф', 'варочная панель', 'стиральная машина', 'холодильник']
}

selected_products = []

for brand_name, categories in brands_target.items():
    found_for_brand = []
    for cat in categories:
        for p in master:
            b_val = (p.get('brand') or '').lower().replace('ö', 'o')
            if brand_name.lower().replace('ö', 'o') in b_val:
                title = p.get('name') or p.get('title') or ''
                images = p.get('images') or []
                price = p.get('price') or 0
                sku = p.get('sku') or p.get('article') or ''
                if cat in title.lower() and images and price > 10000 and sku:
                    if sku not in [x['sku'] for x in found_for_brand]:
                        found_for_brand.append({
                            'id': f"prod-{brand_name.lower()}-{len(found_for_brand)+1}",
                            'sku': sku,
                            'name': title,
                            'slug': p.get('slug') or f"{brand_name.lower()}-{sku.lower().replace(' ', '-')}",
                            'brand': 'Körting' if 'k' in brand_name.lower() else brand_name.capitalize() if brand_name != 'VARD' else 'VARD',
                            'category': cat.capitalize(),
                            'categoryType': 'CATEGORY_B',
                            'physicalStatus': 'SHOWROOM' if len(found_for_brand) % 2 == 0 else 'LOCAL_STOCK',
                            'price': int(price),
                            'oldPrice': int(price * 1.15),
                            'inStock': True,
                            'stockCount': 3,
                            'rating': 4.8,
                            'reviewsCount': 12,
                            'shortDesc': f"Официальная гарантия производителя • Экспозиция в салонах СИМОНА",
                            'description': p.get('description') or f"Техника {brand_name}. Представлена в салонах бытовой техники СИМОНА в Нижнем Новгороде.",
                            'images': images[:3],
                            'badge': 'На витрине' if len(found_for_brand) % 2 == 0 else 'На складе',
                            'isFeatured': True,
                        })
                        if len(found_for_brand) >= 4:
                            break
    selected_products.extend(found_for_brand)
    print(f"Selected {len(found_for_brand)} products for {brand_name}")

with open('scripts/promo-manager/october_products.json', 'w', encoding='utf-8') as f:
    json.dump(selected_products, f, ensure_ascii=False, indent=2)

print(f"Saved {len(selected_products)} total showcase products for October brands.")

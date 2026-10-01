import gzip
import json
import re

# 1. Read catalogData.ts
with open('data/catalogData.ts', 'r', encoding='utf-8') as f:
    cat_text = f.read()

featured_skus = set(re.findall(r"sku:\s*['\"]([^'\"]+)['\"]", cat_text))
print(f"Featured SKUs in catalogData.ts: {len(featured_skus)}")

# 2. Read master exported_catalog_products.json.gz
with gzip.open('data/exported_catalog_products.json.gz', 'rt', encoding='utf-8') as f:
    master_products = json.load(f)

print(f"Master products in exported_catalog_products.json.gz: {len(master_products)}")

brands_count = {}
brand_skus = {}
for p in master_products:
    brand = (p.get('brand') or '').strip()
    sku = (p.get('sku') or p.get('article') or '').strip()
    if brand and sku:
        brands_count[brand] = brands_count.get(brand, 0) + 1
        brand_skus.setdefault(brand.lower(), []).append(sku)

for target in ['korting', 'falmec', 'evelux', 'vard']:
    matching_brands = [b for b in brands_count if target in b.lower()]
    total = sum(brands_count[b] for b in matching_brands)
    print(f"Brand '{target}': {total} products found across {matching_brands}")

import json
import re

with open('data/catalogData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Find all catalog products
pattern = re.compile(r"id:\s*['\"]([^'\"]+)['\"].*?sku:\s*['\"]([^'\"]+)['\"].*?brand:\s*['\"]([^'\"]+)['\"].*?title:\s*['\"]([^'\"]+)['\"].*?price:\s*([0-9]+)", re.DOTALL)
matches = pattern.findall(text)
print(f"Total catalog products parsed: {len(matches)}")

brands = {}
for m in matches:
    b = m[2].strip()
    brands.setdefault(b, []).append({
        'id': m[0],
        'sku': m[1],
        'title': m[3],
        'price': int(m[4])
    })

target_brands = ['korting', 'kört', 'falmec', 'evelux', 'vard']
for b, items in brands.items():
    if any(k in b.lower() for k in target_brands):
        print(f"Brand: {b} -> {len(items)} items")
        for item in items[:5]:
            print(f"   [{item['sku']}] {item['title']} - {item['price']} руб.")

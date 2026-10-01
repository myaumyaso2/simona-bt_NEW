import json
import re

# Read data/promosData.ts
with open('data/promosData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Map of promo id/slug to standardized mechanic badgeText
mechanics_map = {
    'promo-korting-gifts': 'Подарок за покупку',
    'promo-korting-cascade': 'Комплектная скидка',
    'promo-korting-razygryvaet-podarki': 'Подарок за покупку',
    'promo-korting-kitchens-pro': 'Скидка на комплект',
    'promo-falmec-water-50': 'Скидка на коллекцию',
    'promo-falmec-integrated-gifts': 'Подарок за покупку',
    'promo-falmec-induction-hood': 'Скидка на комплект',
    'promo-falmec-extra-discount': 'Комплектная скидка',
    'promo-evelux-34': 'Комплектная скидка',
    'promo-evelux-cascade': 'Комплектная скидка',
    'promo-evelux-gifts': 'Подарок за покупку',
    'promo-vard-top-models': 'Специальные цены',
    'promo-vard-cascade': 'Комплектная скидка',
    'promo-vard-mill-gift': 'Подарок за покупку',
    'promo-vard-coffee-maker-gift': 'Подарок за покупку',
    'promo-smeg-bundle-archived': 'Комплектная скидка',
    'promo-asko-autumn-archived': 'Специальные условия',
}

# Add badgeText to each promo object in promosData.ts
def replacer(match):
    full = match.group(0)
    p_id = match.group(1)
    badge = mechanics_map.get(p_id, 'Акция')
    if 'badgeText:' in full:
        return full
    # Insert badgeText right before discountBadge or after brand
    return full.replace(f"id: '{p_id}',", f"id: '{p_id}',\n    badgeText: '{badge}',")

new_text = re.sub(r"id:\s*'([^']+)',", replacer, text)

with open('data/promosData.ts', 'w', encoding='utf-8') as f:
    f.write(new_text)

print("data/promosData.ts updated with standardized mechanics badgeText!")

# Also update update_promos_and_catalog.py so future updates retain badgeText
with open('scripts/promo-manager/update_promos_and_catalog.py', 'r', encoding='utf-8') as f:
    updater_text = f.read()

# Make sure updater writes badgeText: '{p.get('badgeText', p.get('discountBadge'))}'
if "badgeText:" not in updater_text:
    updater_text = updater_text.replace(
        "discountBadge: '{p['discountBadge']}',",
        "badgeText: mechanics_map.get(p['id'], 'Акция'),\n    discountBadge: '{p['discountBadge']}',"
    )
    updater_text = "mechanics_map = " + json.dumps(mechanics_map, ensure_ascii=False, indent=2) + "\n\n" + updater_text
    with open('scripts/promo-manager/update_promos_and_catalog.py', 'w', encoding='utf-8') as f:
        f.write(updater_text)
    print("update_promos_and_catalog.py updated with mechanics_map!")

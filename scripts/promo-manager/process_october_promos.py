import os
import json
import gzip
import re
from PIL import Image, ImageDraw, ImageFilter

PROMOS_DIR = 'public/images/promos'
os.makedirs(PROMOS_DIR, exist_ok=True)

# 1. Image processor helper functions
def make_thumb(src_path, dst_path, target_size=(800, 500)):
    """Creates a clean 16:10 thumbnail focused on the equipment/right side."""
    if not os.path.exists(src_path):
        print(f"Warning: {src_path} not found")
        return False
    with Image.open(src_path) as img:
        img = img.convert('RGB')
        w, h = img.size
        target_w, target_h = target_size
        target_ratio = target_w / target_h

        # If it's a wide banner (aspect ratio > 2.0), crop from right (where equipment is)
        if w / h > 2.0:
            crop_w = int(h * target_ratio)
            left = max(0, w - crop_w)
            right = w
            cropped = img.crop((left, 0, right, h))
        elif w / h > target_ratio:
            crop_w = int(h * target_ratio)
            left = int((w - crop_w) * 0.7) # slightly biased to right
            right = left + crop_w
            cropped = img.crop((left, 0, right, h))
        else:
            crop_h = int(w / target_ratio)
            top = int((h - crop_h) / 2)
            bottom = top + crop_h
            cropped = img.crop((0, top, w, bottom))

        resized = cropped.resize(target_size, Image.Resampling.LANCZOS)
        resized.save(dst_path, 'JPEG', quality=90)
        print(f"Saved Thumb: {dst_path} ({target_size[0]}x{target_size[1]})")
        return True

def make_hero(src_path, dst_path, target_size=(1800, 500)):
    """Creates an 1800x500 Hero background with left text area cleaned/filled with solid/gradient."""
    if not os.path.exists(src_path):
        print(f"Warning: {src_path} not found")
        return False
    with Image.open(src_path) as img:
        img = img.convert('RGB')
        # Resize/crop to 1800x500 first
        w, h = img.size
        target_w, target_h = target_size
        target_ratio = target_w / target_h
        cur_ratio = w / h

        if cur_ratio > target_ratio:
            # too wide, crop edges or align right to keep equipment
            crop_w = int(h * target_ratio)
            left = max(0, w - crop_w)
            cropped = img.crop((left, 0, w, h))
        else:
            # too tall, crop top/bottom
            crop_h = int(w / target_ratio)
            top = max(0, int((h - crop_h) * 0.3)) # bias to top/center
            cropped = img.crop((0, top, w, min(h, top + crop_h)))

        resized = cropped.resize(target_size, Image.Resampling.LANCZOS)

        # Sample left background color (top-left or edge)
        left_color = resized.getpixel((20, 20))
        
        # Inpaint left side (from 0 to 45% of width) with a smooth horizontal fade to transparent
        # In Next.js, PromoDetailView already applies #111315 gradient, so cleaning text here ensures no ghost letters!
        overlay = Image.new('RGB', target_size, left_color)
        mask = Image.new('L', target_size, 0)
        draw = ImageDraw.Draw(mask)
        fade_end = int(target_w * 0.48)
        solid_end = int(target_w * 0.35)
        
        # Solid mask on far left
        draw.rectangle([0, 0, solid_end, target_h], fill=255)
        # Linear gradient mask from solid_end to fade_end
        for x in range(solid_end, fade_end):
            alpha = int(255 * (1.0 - (x - solid_end) / (fade_end - solid_end)))
            draw.line([(x, 0), (x, target_h)], fill=alpha)

        result = Image.composite(overlay, resized, mask)
        result.save(dst_path, 'JPEG', quality=90)
        print(f"Saved Hero: {dst_path} ({target_size[0]}x{target_size[1]})")
        return True

def make_yandex(src_path, dst_path, target_size=(900, 480)):
    """Creates a 900x480 banner for Yandex Business."""
    return make_thumb(src_path, dst_path, target_size)

# List of assets mapping for each promo:
mappings = [
    # Körting
    ('promo-korting-gifts', 'public/images/promos/pilot-korting-gifts-thumb.jpg', 'public/images/promos/pilot-korting-gifts-hero.jpg'),
    ('promo-korting-cascade', 'public/images/promos/promo-korting-bundle.jpg', 'public/images/promos/promo-korting-bundle.jpg'),
    ('promo-korting-presents', 'public/images/promos/promo-korting-formula.jpg', 'public/images/promos/promo-korting-formula.jpg'),
    ('promo-korting-kitchens-pro', 'public/images/promos/promo-korting-ksi17545.jpg', 'public/images/promos/promo-korting-ksi17545.jpg'),
    # Falmec
    ('promo-falmec-water-50', 'public/images/promos/promo-falmec-sinks.jpg', 'public/images/promos/promo-falmec-sinks.jpg'),
    ('promo-falmec-integrated-gifts', 'public/images/promos/promo-falmec-gifts.jpg', 'public/images/promos/promo-falmec-gifts.jpg'),
    ('promo-falmec-induction-hood', 'public/images/promos/promo-falmec-duet.jpg', 'public/images/promos/promo-falmec-duet.jpg'),
    ('promo-falmec-extra-discount', 'public/images/promos/promo-falmec-bundle.jpg', 'public/images/promos/promo-falmec-bundle.jpg'),
    # EVELUX
    ('promo-evelux-34', 'public/images/promos/promo-evelux-34.jpg', 'public/images/promos/promo-evelux-34.jpg'),
    ('promo-evelux-cascade', 'public/images/promos/promo-evelux-bundle.jpg', 'public/images/promos/promo-evelux-bundle.jpg'),
    ('promo-evelux-gifts', 'public/images/promos/promo-evelux-gifts.jpg', 'public/images/promos/promo-evelux-gifts.jpg'),
    # VARD
    ('promo-vard-top-models', 'public/images/promos/promo-vard-15.jpg', 'public/images/promos/promo-vard-15.jpg'),
    ('promo-vard-cascade', 'public/images/promos/promo-vard-bundle.jpg', 'public/images/promos/promo-vard-bundle.jpg'),
    ('promo-vard-mill-gift', 'public/images/promos/promo-vard-plancha.jpg', 'public/images/promos/promo-vard-plancha.jpg'),
    ('promo-vard-coffee-maker-gift', 'public/images/promos/promo-vard-bundle.jpg', 'public/images/promos/promo-vard-bundle.jpg'),
]

for promo_id, thumb_src, hero_src in mappings:
    dst_thumb = f"public/images/promos/{promo_id}-thumb.jpg"
    dst_hero = f"public/images/promos/{promo_id}-hero.jpg"
    dst_yandex = f"public/images/promos/{promo_id}-yandex.jpg"
    
    if promo_id == 'promo-korting-gifts':
        # already perfected in pilot
        continue
        
    make_thumb(thumb_src, dst_thumb)
    make_hero(hero_src, dst_hero)
    make_yandex(thumb_src, dst_yandex)

print("All October promo images generated successfully!")

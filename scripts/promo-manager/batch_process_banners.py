import sys
import os

# Add parent directory to path so we can import process_promo_banners
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from process_promo_banners import create_hero_banner, create_thumbnail

banners_to_process = [
    # (id, source_image, thumb_target, hero_target)
    (
        'promo-korting-gifts',
        'public/images/promos/promo-korting-gifts.jpg',
        'public/images/promos/promo-korting-gifts-thumb.jpg',
        'public/images/promos/promo-korting-gifts-hero.jpg'
    ),
    (
        'pilot-korting-gifts',
        'public/images/promos/promo-korting-gifts.jpg',
        'public/images/promos/pilot-korting-gifts-thumb.jpg',
        'public/images/promos/pilot-korting-gifts-hero.jpg'
    ),
    (
        'promo-korting-cascade',
        'public/images/promos/promo-korting-bundle.jpg',
        'public/images/promos/promo-korting-cascade-thumb.jpg',
        'public/images/promos/promo-korting-cascade-hero.jpg'
    ),
    (
        'promo-korting-razygryvaet-podarki',
        'public/images/promos/promo-korting-formula.jpg',
        'public/images/promos/promo-korting-presents-thumb.jpg',
        'public/images/promos/promo-korting-presents-hero.jpg'
    ),
    (
        'promo-korting-kitchens-pro',
        'public/images/promos/promo-korting-ksi17545.jpg',
        'public/images/promos/promo-korting-kitchens-pro-thumb.jpg',
        'public/images/promos/promo-korting-kitchens-pro-hero.jpg'
    ),
    (
        'promo-falmec-water-50',
        'public/images/promos/promo-falmec-sinks.jpg',
        'public/images/promos/promo-falmec-water-50-thumb.jpg',
        'public/images/promos/promo-falmec-water-50-hero.jpg'
    ),
    (
        'promo-falmec-integrated-gifts',
        'public/images/promos/promo-falmec-gifts.jpg',
        'public/images/promos/promo-falmec-integrated-gifts-thumb.jpg',
        'public/images/promos/promo-falmec-integrated-gifts-hero.jpg'
    ),
    (
        'promo-falmec-induction-hood',
        'public/images/promos/promo-falmec-duet.jpg',
        'public/images/promos/promo-falmec-induction-hood-thumb.jpg',
        'public/images/promos/promo-falmec-induction-hood-hero.jpg'
    ),
    (
        'promo-falmec-extra-discount',
        'public/images/promos/promo-falmec-bundle.jpg',
        'public/images/promos/promo-falmec-extra-discount-thumb.jpg',
        'public/images/promos/promo-falmec-extra-discount-hero.jpg'
    ),
    (
        'promo-evelux-34',
        'public/images/promos/promo-evelux-34.jpg',
        'public/images/promos/promo-evelux-34-thumb.jpg',
        'public/images/promos/promo-evelux-34-hero.jpg'
    ),
    (
        'promo-evelux-cascade',
        'public/images/promos/promo-evelux-bundle.jpg',
        'public/images/promos/promo-evelux-cascade-thumb.jpg',
        'public/images/promos/promo-evelux-cascade-hero.jpg'
    ),
    (
        'promo-evelux-gifts',
        'public/images/promos/promo-evelux-gifts.jpg',
        'public/images/promos/promo-evelux-gifts-thumb.jpg',
        'public/images/promos/promo-evelux-gifts-hero.jpg'
    ),
    (
        'promo-vard-top-models',
        'public/images/promos/promo-vard-15.jpg',
        'public/images/promos/promo-vard-top-models-thumb.jpg',
        'public/images/promos/promo-vard-top-models-hero.jpg'
    ),
    (
        'promo-vard-cascade',
        'public/images/promos/promo-vard-bundle.jpg',
        'public/images/promos/promo-vard-cascade-thumb.jpg',
        'public/images/promos/promo-vard-cascade-hero.jpg'
    ),
    (
        'promo-vard-mill-gift',
        'public/images/promos/promo-vard-plancha.jpg',
        'public/images/promos/promo-vard-mill-lifestyle-thumb.jpg',
        'public/images/promos/promo-vard-mill-lifestyle-hero.jpg'
    ),
    (
        'promo-vard-mill-gift-alt',
        'public/images/promos/promo-vard-plancha.jpg',
        'public/images/promos/promo-vard-mill-gift-thumb.jpg',
        'public/images/promos/promo-vard-mill-gift-hero.jpg'
    ),
    (
        'promo-vard-coffee-maker-gift',
        'public/images/promos/promo-vard-bundle.jpg',
        'public/images/promos/promo-vard-coffee-lineup-thumb.jpg',
        'public/images/promos/promo-vard-coffee-lineup-hero.jpg'
    ),
    (
        'promo-vard-coffee-maker-gift-alt',
        'public/images/promos/promo-vard-bundle.jpg',
        'public/images/promos/promo-vard-coffee-maker-gift-thumb.jpg',
        'public/images/promos/promo-vard-coffee-maker-gift-hero.jpg'
    ),
]

print(f"Processing {len(banners_to_process)} promo banner sets with Quiet Luxury Smoothstep Deep Veil...")
for pid, src, thumb_dst, hero_dst in banners_to_process:
    print(f"\n--- Processing {pid} (source: {src}) ---")
    create_thumbnail(src, thumb_dst)
    create_hero_banner(src, hero_dst)

print("\nAll banners processed successfully!")

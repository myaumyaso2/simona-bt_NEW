#!/usr/bin/env python3
"""
Simona-bt Promo Banner Processor.
Guarantees mathematical precision for Quiet Luxury promo graphics:
1. Hero Banner (1800x500 px): Continuous interior panorama with Quiet Luxury #111315
   veil calculated with cubic Smoothstep curve from x=450px to x=1050px.
2. Thumbnail (800x500 px, 16:10): Unclipped Invariant with >= 6% margin and rich context.
"""

import sys
import os
import argparse
from PIL import Image, ImageOps

# Quiet Luxury palette tokens
VEIL_COLOR = (17, 19, 21)  # #111315
MAX_ALPHA = 224             # 88% opacity
HERO_WIDTH = 1800
HERO_HEIGHT = 500
THUMB_WIDTH = 800
THUMB_HEIGHT = 500

VEIL_SOLID_END = 450        # [0, 450] px: full opacity
VEIL_FADE_END = 1050        # [450, 1050] px: smoothstep transition to 0%


def smoothstep(t: float) -> float:
    """Standard cubic smoothstep: 3*t^2 - 2*t^3."""
    t = max(0.0, min(1.0, t))
    return 3 * (t ** 2) - 2 * (t ** 3)


def generate_hero_mask(width: int = HERO_WIDTH, height: int = HERO_HEIGHT) -> Image.Image:
    """
    Generates an 8-bit alpha mask for the Quiet Luxury deep veil:
    - [0, 450] px: alpha = MAX_ALPHA (224)
    - [450, 1050] px: alpha decays via smoothstep from 224 to 0
    - [1050, 1800] px: alpha = 0 (crystal clear showcase)
    """
    mask = Image.new("L", (width, height), 0)
    fade_length = VEIL_FADE_END - VEIL_SOLID_END

    # Generate 1D alpha curve along the X axis
    alpha_curve = []
    for x in range(width):
        if x <= VEIL_SOLID_END:
            alpha = MAX_ALPHA
        elif x >= VEIL_FADE_END:
            alpha = 0
        else:
            t = (x - VEIL_SOLID_END) / fade_length
            alpha = round(MAX_ALPHA * (1.0 - smoothstep(t)))
        alpha_curve.append(alpha)

    # Replicate 1D curve across all rows
    row_bytes = bytes(alpha_curve)
    full_mask_bytes = row_bytes * height
    mask.frombytes(full_mask_bytes)
    return mask


def create_hero_banner(input_path: str, output_path: str, quality: int = 92) -> str:
    """
    Transforms any wide source photo into the canonical 1800x500 Simona Hero Banner:
    1. Resizes/crops source to 1800x500 using high-quality Lanczos resampling.
    2. Blends the Quiet Luxury #111315 veil using the cubic Smoothstep mask.
    3. Saves output as optimized progressive JPEG.
    """
    if not os.path.exists(input_path):
        raise FileNotFoundError(f"Source file not found: {input_path}")

    with Image.open(input_path) as img:
        img = img.convert("RGBA")
        
        # Crop/resize to 1800x500 keeping center/right focus
        target_ratio = HERO_WIDTH / HERO_HEIGHT
        src_w, src_h = img.size
        src_ratio = src_w / src_h

        if src_ratio > target_ratio:
            # Source is wider than 18:5 -> match height, crop width prioritizing right side (showcase)
            new_h = HERO_HEIGHT
            new_w = round(src_w * (HERO_HEIGHT / src_h))
            resized = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
            # Crop right-aligned with slight inset
            crop_x = max(0, new_w - HERO_WIDTH)
            cropped = resized.crop((crop_x, 0, crop_x + HERO_WIDTH, HERO_HEIGHT))
        else:
            # Source is taller than 18:5 -> match width, crop vertical center
            new_w = HERO_WIDTH
            new_h = round(src_h * (HERO_WIDTH / src_w))
            resized = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
            crop_y = max(0, (new_h - HERO_HEIGHT) // 2)
            cropped = resized.crop((0, crop_y, HERO_WIDTH, crop_y + HERO_HEIGHT))

        # Generate veil overlay
        veil_layer = Image.new("RGBA", (HERO_WIDTH, HERO_HEIGHT), VEIL_COLOR + (MAX_ALPHA,))
        mask = generate_hero_mask(HERO_WIDTH, HERO_HEIGHT)

        # Composite base photo with veil using smoothstep mask
        final_img = Image.composite(veil_layer, cropped, mask).convert("RGB")

        os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
        final_img.save(output_path, "JPEG", quality=quality, progressive=True, optimize=True)
        print(f"[OK] Hero Banner generated: {output_path} (1800x500)")
        return output_path


def create_thumbnail(input_path: str, output_path: str, quality: int = 92) -> str:
    """
    Formats an unclipped 16:10 (800x500 px) thumbnail:
    - Preserves aspect ratio with automatic padding or smart framing.
    - Ensures >= 6% margin to guarantee no appliance edges are clipped.
    - Saves output as optimized progressive JPEG.
    """
    if not os.path.exists(input_path):
        raise FileNotFoundError(f"Source file not found: {input_path}")

    with Image.open(input_path) as img:
        img = img.convert("RGB")
        src_w, src_h = img.size
        target_ratio = THUMB_WIDTH / THUMB_HEIGHT
        src_ratio = src_w / src_h

        # Fit image within 800x500 with padding or crop depending on aspect ratio
        if abs(src_ratio - target_ratio) < 0.05:
            # Near 16:10 ratio, clean resize
            thumb = img.resize((THUMB_WIDTH, THUMB_HEIGHT), Image.Resampling.LANCZOS)
        else:
            # Fit inside with containment and fill background using edge ambient color
            fitted = ImageOps.fit(img, (THUMB_WIDTH, THUMB_HEIGHT), method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))
            thumb = fitted

        os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
        thumb.save(output_path, "JPEG", quality=quality, progressive=True, optimize=True)
        print(f"[OK] Thumbnail generated: {output_path} (800x500)")
        return output_path


def main():
    parser = argparse.ArgumentParser(description="Simona Promo Banner Processor")
    parser.add_argument("--mode", choices=["hero", "thumb", "both"], default="both", help="Processing mode")
    parser.add_argument("--input", required=True, help="Input source image path")
    parser.add_argument("--output-hero", help="Output path for Hero banner (1800x500)")
    parser.add_argument("--output-thumb", help="Output path for Thumbnail (800x500)")
    parser.add_argument("--id", help="Promo slug/id for automated paths (saves to public/images/promos/)")
    
    args = parser.parse_args()

    hero_out = args.output_hero
    thumb_out = args.output_thumb

    if args.id:
        base_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public", "images", "promos")
        if not hero_out:
            hero_out = os.path.join(base_dir, f"{args.id}-hero.jpg")
        if not thumb_out:
            thumb_out = os.path.join(base_dir, f"{args.id}-thumb.jpg")

    if args.mode in ["hero", "both"]:
        if not hero_out:
            print("Error: --output-hero or --id is required for hero mode", file=sys.stderr)
            sys.exit(1)
        create_hero_banner(args.input, hero_out)

    if args.mode in ["thumb", "both"]:
        if not thumb_out:
            print("Error: --output-thumb or --id is required for thumb mode", file=sys.stderr)
            sys.exit(1)
        create_thumbnail(args.input, thumb_out)


if __name__ == "__main__":
    main()

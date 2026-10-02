import os
import sys
import pillow_heif
from PIL import Image

pillow_heif.register_heif_opener()

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
PUBLIC_DIR = os.path.join(PROJECT_ROOT, 'public', 'showrooms')

SRC_BELINSKOGO_15 = r'C:\Users\trash\Pictures\Техника Симона\Белинского 15'
SRC_OMOIKIRI_KORTING = r'C:\Users\trash\Pictures\Техника Симона\OMOIKIRI KORTING'

os.makedirs(os.path.join(PUBLIC_DIR, 'belinskogo-15', 'desktop'), exist_ok=True)
os.makedirs(os.path.join(PUBLIC_DIR, 'belinskogo-15', 'mobile'), exist_ok=True)
os.makedirs(os.path.join(PUBLIC_DIR, 'belinskogo-11', 'desktop'), exist_ok=True)
os.makedirs(os.path.join(PUBLIC_DIR, 'belinskogo-11', 'mobile'), exist_ok=True)

def process_file(src_path, out_dir, filename_prefix, target_type='desktop'):
    try:
        with Image.open(src_path) as img:
            img = img.convert('RGB')
            w, h = img.size
            
            if target_type == 'desktop':
                # Max dimension 1600x1100
                max_w, max_h = 1600, 1100
            else:
                # Max dimension 900x1400
                max_w, max_h = 900, 1400
                
            scale = min(max_w / w, max_h / h, 1.0)
            new_w = int(round(w * scale))
            new_h = int(round(h * scale))
            
            resized = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
            
            out_filename = f'{filename_prefix}.webp'
            out_path = os.path.join(out_dir, out_filename)
            resized.save(out_path, 'WEBP', quality=82, method=6)
            
            file_size_kb = os.path.getsize(out_path) / 1024
            return out_filename, new_w, new_h, file_size_kb
    except Exception as e:
        print(f'Error processing {src_path}: {e}', file=sys.stderr)
        return None

def process_showroom(src_dir, dest_key):
    print(f'=== Processing {dest_key} from {src_dir} ===')
    files = sorted([f for f in os.listdir(src_dir) if not f.startswith('.')])
    
    desktop_records = []
    mobile_records = []
    
    h_idx = 1
    v_idx = 1
    
    for f in files:
        full_path = os.path.join(src_dir, f)
        if not os.path.isfile(full_path):
            continue
        try:
            with Image.open(full_path) as im:
                is_horiz = im.size[0] >= im.size[1]
        except Exception as e:
            print(f'Skipping unreadable {f}: {e}')
            continue
            
        if is_horiz:
            prefix = f'{dest_key}_desktop_{h_idx:02d}'
            out_dir = os.path.join(PUBLIC_DIR, dest_key, 'desktop')
            res = process_file(full_path, out_dir, prefix, 'desktop')
            if res:
                out_name, w, h, size_kb = res
                desktop_records.append({
                    'original': f,
                    'file': f'/showrooms/{dest_key}/desktop/{out_name}',
                    'width': w,
                    'height': h,
                    'size_kb': round(size_kb, 1)
                })
                print(f'  [Desktop] {f} -> {out_name} ({w}x{h}, {size_kb:.1f} KB)')
                h_idx += 1
        else:
            prefix = f'{dest_key}_mobile_{v_idx:02d}'
            out_dir = os.path.join(PUBLIC_DIR, dest_key, 'mobile')
            res = process_file(full_path, out_dir, prefix, 'mobile')
            if res:
                out_name, w, h, size_kb = res
                mobile_records.append({
                    'original': f,
                    'file': f'/showrooms/{dest_key}/mobile/{out_name}',
                    'width': w,
                    'height': h,
                    'size_kb': round(size_kb, 1)
                })
                print(f'  [Mobile]  {f} -> {out_name} ({w}x{h}, {size_kb:.1f} KB)')
                v_idx += 1
                
    return desktop_records, mobile_records

if __name__ == '__main__':
    d15, m15 = process_showroom(SRC_BELINSKOGO_15, 'belinskogo-15')
    d11, m11 = process_showroom(SRC_OMOIKIRI_KORTING, 'belinskogo-11')
    
    import json
    data = {
        'belinskogo-15': {'desktop': d15, 'mobile': m15},
        'belinskogo-11': {'desktop': d11, 'mobile': m11}
    }
    with open(os.path.join(PUBLIC_DIR, 'showrooms_data.json'), 'w', encoding='utf-8') as fp:
        json.dump(data, fp, ensure_ascii=False, indent=2)
        
    print('\nFinished! Summary:')
    print(f'Belinskogo 15: {len(d15)} desktop, {len(m15)} mobile')
    print(f'Belinskogo 11: {len(d11)} desktop, {len(m11)} mobile')

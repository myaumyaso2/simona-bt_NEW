#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Autonomous Remote Stock Synchronizer for SIMONA-BT (simona-bt_NEW)
------------------------------------------------------------------
Reads supplier inventory files (.xlsx / .xls) from Google Drive folder,
matches products with the catalog by brand + normalized article,
and updates 'stockRemote' and 'physicalStatus' in the Prisma database.

Business Rules:
1. Stock >= 5 pcs -> eligible for "На удаленном складе" (REMOTE_STOCK).
2. Priority: DISCOUNT > SHOWROOM > LOCAL_STOCK > REMOTE_STOCK > ON_ORDER.
   If product is already in local warehouse ("На складе" / LOCAL_STOCK) or
   on showroom display ("На витрине" / SHOWROOM), the supplier stock count is
   saved to stockRemote, but physicalStatus remains LOCAL_STOCK / SHOWROOM.
3. Out of stock / removed items: For brands present in the files, if a product
   is not in the file or its supplier stock is < 5, stockRemote is reset to 0
   and physicalStatus reverts to ON_ORDER (unless locally in stock).
4. Excludes damaged / b-stock goods (Уценка, НК:*, OUTLET).
5. Supports --dry-run for safe verification.
"""

import os
import sys
import glob
import re
import json
import sqlite3
import argparse
from datetime import datetime

# Force UTF-8 stdout
sys.stdout.reconfigure(encoding='utf-8')

def norm(s):
    """Normalize article or brand: uppercase, alphanumeric only."""
    if not s:
        return ''
    return re.sub(r'[^A-Z0-9А-Я]', '', str(s).upper())

def parse_stock_num(v):
    """Parse stock value (supports float, int, strings like '>100', '>10', '>5')."""
    if v is None:
        return 0
    s = str(v).strip()
    if not s or s in ('0', '0.0', '-'):
        return 0
    if s.startswith('>'):
        try:
            return int(s[1:])
        except ValueError:
            return 5
    try:
        f = float(s.replace(',', '.'))
        return int(round(f))
    except ValueError:
        return 0

# --- SUPPLIER FILE PARSERS ---

def parse_aeg_haier_midea(filepath):
    """AEG, Хаер, Хайберг, Купперсберг, Либхер, Мидея.xls"""
    import xlrd
    items = []
    wb = xlrd.open_workbook(filepath)
    ws = wb.sheet_by_index(0)
    for r in range(1, ws.nrows):
        title = str(ws.cell_value(r, 0)).strip()
        if not title:
            continue
        parts = title.split(maxsplit=1)
        raw_b = parts[0].upper()
        raw_m = parts[1] if len(parts) > 1 else ''
        
        # Determine brand
        brand_map = {
            'AEG': 'AEG',
            'HAIER': 'HAIER',
            'ХАЕР': 'HAIER',
            'MIDEA': 'MIDEA',
            'МИДЕЯ': 'MIDEA',
            'KUPPERSBERG': 'KUPPERSBERG',
            'КУППЕРСБЕРГ': 'KUPPERSBERG',
            'LIEBHERR': 'LIEBHERR',
            'ЛИБХЕР': 'LIEBHERR',
            'ЛИБХЕРР': 'LIEBHERR',
            'HIBERG': 'HIBERG',
            'ХАЙБЕРГ': 'HIBERG',
        }
        brand = brand_map.get(raw_b, raw_b)
        
        # Stock: Col 7 (Остаток на складе поставщика) + Col 8 (удаленный склад)
        st1 = parse_stock_num(ws.cell_value(r, 7)) if ws.ncols > 7 else 0
        st2 = parse_stock_num(ws.cell_value(r, 8)) if ws.ncols > 8 else 0
        stock = st1 + st2
        
        items.append({
            'brand': brand,
            'article': raw_m,
            'stock': stock,
            'raw_title': title,
            'file': os.path.basename(filepath)
        })
    return items

def parse_bosch(filepath):
    """Bosch (о).xls"""
    import xlrd
    items = []
    wb = xlrd.open_workbook(filepath)
    ws = wb.sheet_by_index(0)
    for r in range(1, ws.nrows):
        col0 = str(ws.cell_value(r, 0)).strip()
        # Skip damaged / b-stock
        if col0.startswith('НК:'):
            continue
        cat_num = str(ws.cell_value(r, 1)).strip()
        if not cat_num:
            continue
        title = str(ws.cell_value(r, 2)).strip() if ws.ncols > 2 else ''
        stock = parse_stock_num(ws.cell_value(r, 4)) if ws.ncols > 4 else 0
        
        items.append({
            'brand': 'BOSCH',
            'article': cat_num,
            'stock': stock,
            'raw_title': title or cat_num,
            'file': os.path.basename(filepath)
        })
    return items

def parse_electrolux(filepath):
    """Electrolux (о).xls"""
    import xlrd
    items = []
    wb = xlrd.open_workbook(filepath)
    ws = wb.sheet_by_index(0)
    for r in range(1, ws.nrows):
        col0 = str(ws.cell_value(r, 0)).strip()
        if col0.startswith('НК:'):
            continue
        cat_num = str(ws.cell_value(r, 1)).strip()
        if not cat_num:
            continue
        title = str(ws.cell_value(r, 2)).strip() if ws.ncols > 2 else ''
        stock = parse_stock_num(ws.cell_value(r, 3)) if ws.ncols > 3 else 0
        
        items.append({
            'brand': 'ELECTROLUX',
            'article': cat_num,
            'stock': stock,
            'raw_title': title or cat_num,
            'file': os.path.basename(filepath)
        })
    return items

def parse_dreame(filepath):
    """Dreame.xls"""
    import xlrd
    items = []
    wb = xlrd.open_workbook(filepath)
    ws = wb.sheet_by_index(0)
    for r in range(1, ws.nrows):
        nom = str(ws.cell_value(r, 0)).strip()
        if not nom:
            continue
        # Exclude discount cols 5-8. Take Vorsino (col 2) + Chashnikovo (col 3) + Chashnikovo Mark (col 4)
        s_vor = parse_stock_num(ws.cell_value(r, 2)) if ws.ncols > 2 else 0
        s_cha = parse_stock_num(ws.cell_value(r, 3)) if ws.ncols > 3 else 0
        s_mar = parse_stock_num(ws.cell_value(r, 4)) if ws.ncols > 4 else 0
        stock = s_vor + s_cha + s_mar
        
        # Extract model
        parts = nom.split(',')
        art = parts[-1].strip() if len(parts) > 1 else nom
        
        items.append({
            'brand': 'DREAME',
            'article': art,
            'stock': stock,
            'raw_title': nom,
            'file': os.path.basename(filepath)
        })
    return items

def parse_braukmann(filepath):
    """Браукман.xls (Steba, Caso, Black+Decker, Rommelsbacher)"""
    import xlrd
    items = []
    wb = xlrd.open_workbook(filepath)
    ws = wb.sheet_by_index(0)
    for r in range(5, ws.nrows):
        nom = str(ws.cell_value(r, 0)).strip()
        if not nom or nom.startswith('Ценовая') or nom.startswith('Номенклатура'):
            continue
        stock = parse_stock_num(ws.cell_value(r, 1)) if ws.ncols > 1 else 0
        
        nom_upper = nom.upper()
        brand = 'STEBA'
        if 'CASO' in nom_upper:
            brand = 'CASO'
        elif 'BLACK' in nom_upper:
            brand = 'BLACK+DECKER'
        elif 'ROMMELSBACHER' in nom_upper:
            brand = 'ROMMELSBACHER'
            
        items.append({
            'brand': brand,
            'article': nom,
            'stock': stock,
            'raw_title': nom,
            'file': os.path.basename(filepath)
        })
    return items

def parse_vard(filepath):
    """Вард.xlsx"""
    import openpyxl
    items = []
    wb = openpyxl.load_workbook(filepath, data_only=True)
    ws = wb.active
    for r in range(10, ws.max_row + 1):
        nom = str(ws.cell(r, 2).value or '').strip()
        stock = parse_stock_num(ws.cell(r, 4).value)
        if not nom:
            continue
        # Format: "AERB01 Льдогенератор..." -> model is AERB01
        model = nom.split()[0]
        items.append({
            'brand': 'VARD',
            'article': model,
            'stock': stock,
            'raw_title': nom,
            'file': os.path.basename(filepath)
        })
    return items

def parse_dedietrich(filepath):
    """ДеДитриш, Граудэ, Купперсбуш, Шультез.xlsx"""
    import openpyxl
    items = []
    wb = openpyxl.load_workbook(filepath, data_only=True)
    ws = wb.active
    for r in range(2, ws.max_row + 1):
        art = str(ws.cell(r, 2).value or '').strip()
        nom = str(ws.cell(r, 3).value or '').strip()
        brand_raw = str(ws.cell(r, 4).value or '').strip().upper()
        # Col 5 is OUTLET -> ignore. Col 6 is ORBITA (main shipments)
        stock = parse_stock_num(ws.cell(r, 6).value)
        if not art:
            continue
        
        brand_map = {
            'DE DIETRICH': 'DE DIETRICH',
            'GRAUDE': 'GRAUDE',
            'KUPPERSBUSCH': 'KUPPERSBUSCH',
            'SCHULTHESS': 'SCHULTHESS'
        }
        brand = brand_map.get(brand_raw, brand_raw)
        
        items.append({
            'brand': brand,
            'article': art,
            'stock': stock,
            'raw_title': nom or art,
            'file': os.path.basename(filepath)
        })
    return items

def parse_evelux(filepath):
    """Остатки EVELUX.XLSX"""
    import openpyxl
    items = []
    wb = openpyxl.load_workbook(filepath, data_only=True)
    ws = wb.active
    for r in range(4, ws.max_row + 1):
        model = str(ws.cell(r, 2).value or '').strip()
        stock = parse_stock_num(ws.cell(r, 3).value)
        if not model or model.startswith('Аксессуары') or model.startswith('Дополнительная'):
            continue
        items.append({
            'brand': 'EVELUX',
            'article': model,
            'stock': stock,
            'raw_title': model,
            'file': os.path.basename(filepath)
        })
    return items

def parse_evelux_src(filepath):
    """Остатки EVELUX СРЦ.XLSX"""
    import openpyxl
    items = []
    wb = openpyxl.load_workbook(filepath, data_only=True)
    ws = wb.active
    for r in range(4, ws.max_row + 1):
        model = str(ws.cell(r, 3).value or '').strip()
        stock = parse_stock_num(ws.cell(r, 4).value)
        if not model or model.startswith('Встраиваемая') or model.startswith('Варочная'):
            continue
        items.append({
            'brand': 'EVELUX',
            'article': model,
            'stock': stock,
            'raw_title': model,
            'file': os.path.basename(filepath)
        })
    return items

def parse_korting(filepath):
    """Остатки KORTING.XLSX"""
    import openpyxl
    items = []
    wb = openpyxl.load_workbook(filepath, data_only=True)
    ws = wb.active
    for r in range(4, ws.max_row + 1):
        model = str(ws.cell(r, 2).value or '').strip()
        stock = parse_stock_num(ws.cell(r, 3).value)
        if not model or model.startswith('Аксессуары') or model.startswith('Дополнительная'):
            continue
        items.append({
            'brand': 'KORTING',
            'article': model,
            'stock': stock,
            'raw_title': model,
            'file': os.path.basename(filepath)
        })
    return items

def parse_jackys(filepath):
    """Прайс-сток JACKY`S.xlsx"""
    import openpyxl
    items = []
    wb = openpyxl.load_workbook(filepath, data_only=True)
    ws = wb.active
    for r in range(2, ws.max_row + 1):
        model = str(ws.cell(r, 2).value or '').strip()
        stock = parse_stock_num(ws.cell(r, 3).value)
        if not model:
            continue
        items.append({
            'brand': 'JACKYS',
            'article': model,
            'stock': stock,
            'raw_title': model,
            'file': os.path.basename(filepath)
        })
    return items

def parse_smeg(filepath):
    """Смег.xlsx"""
    import openpyxl
    items = []
    wb = openpyxl.load_workbook(filepath, data_only=True)
    ws = wb.active
    for r in range(2, ws.max_row + 1):
        art = str(ws.cell(r, 1).value or '').strip()
        stock = parse_stock_num(ws.cell(r, 3).value)
        if not art:
            continue
        items.append({
            'brand': 'SMEG',
            'article': art,
            'stock': stock,
            'raw_title': art,
            'file': os.path.basename(filepath)
        })
    return items

def parse_falmec(filepath):
    """Фалмек.xls"""
    import xlrd
    items = []
    wb = xlrd.open_workbook(filepath)
    ws = wb.sheet_by_index(0)
    for r in range(10, ws.nrows):
        art = str(ws.cell_value(r, 1)).strip()
        nom = str(ws.cell_value(r, 2)).strip()
        stock = parse_stock_num(ws.cell_value(r, 3)) if ws.ncols > 3 else 0
        if not art and not nom:
            continue
        items.append({
            'brand': 'FALMEC',
            'article': art,
            'alt_article': nom.split('(')[0].strip(),
            'stock': stock,
            'raw_title': nom or art,
            'file': os.path.basename(filepath)
        })
    return items

def parse_franke_elikor(filepath):
    """Франке, Эликор.xlsx"""
    import openpyxl
    items = []
    wb = openpyxl.load_workbook(filepath, data_only=True)
    ws = wb.active
    for r in range(2, ws.max_row + 1):
        art = str(ws.cell(r, 1).value or '').strip()
        fun = str(ws.cell(r, 2).value or '').strip()
        nom = str(ws.cell(r, 4).value or '').strip()
        stock = parse_stock_num(ws.cell(r, 5).value)
        if not art and not fun:
            continue
        
        brand = 'FRANKE'
        if 'ELIKOR' in nom.upper() or 'ЭЛИКОР' in nom.upper():
            brand = 'ELIKOR'
            
        items.append({
            'brand': brand,
            'article': fun or art,
            'alt_article': art,
            'stock': stock,
            'raw_title': nom,
            'file': os.path.basename(filepath)
        })
    return items

def parse_elica_jetair(filepath):
    """Элика, Джет.xlsx"""
    import openpyxl
    items = []
    wb = openpyxl.load_workbook(filepath, data_only=True)
    ws = wb.active
    for r in range(2, ws.max_row + 1):
        art = str(ws.cell(r, 1).value or '').strip()
        nom = str(ws.cell(r, 2).value or '').strip()
        stock = parse_stock_num(ws.cell(r, 3).value)
        if not art:
            continue
        
        brand = 'ELICA'
        if nom.upper().startswith('JETAIR'):
            brand = 'JETAIR'
            
        clean_nom = re.sub(r'^(ELICA|JETAIR)\s*', '', nom, flags=re.IGNORECASE).replace('@', '').strip()
        
        items.append({
            'brand': brand,
            'article': art,
            'alt_article': clean_nom,
            'stock': stock,
            'raw_title': nom,
            'file': os.path.basename(filepath)
        })
    return items

FILE_PARSER_REGISTRY = {
    'AEG_Haier_Midea.xls': parse_aeg_haier_midea,
    'Bosch.xls': parse_bosch,
    'Electrolux.xls': parse_electrolux,
    'Dreame.xls': parse_dreame,
    'Braukmann.xls': parse_braukmann,
    'Vard.xlsx': parse_vard,
    'DeDietrich.xlsx': parse_dedietrich,
    'Evelux.xlsx': parse_evelux,
    'Evelux_SRC.xlsx': parse_evelux_src,
    'Korting.xlsx': parse_korting,
    'Jackys.xlsx': parse_jackys,
    'Smeg.xlsx': parse_smeg,
    'Falmec.xls': parse_falmec,
    'Franke_Elikor.xlsx': parse_franke_elikor,
    'Elica_Jetair.xlsx': parse_elica_jetair,
}

def main():
    parser = argparse.ArgumentParser(description="Synchronize Remote Warehouse Stock for SIMONA-BT")
    parser.add_argument("--stocks-dir", default="data/supplier_stocks", help="Directory with supplier excel files")
    parser.add_argument("--db-path", default="prisma/dev.db", help="Path to SQLite database")
    parser.add_argument("--threshold", type=int, default=5, help="Stock threshold for REMOTE_STOCK status")
    parser.add_argument("--dry-run", action="store_true", help="Dry run: show what would change without DB writes")
    parser.add_argument("--report-path", default="data/remote_stock_sync_report.md", help="Path to output markdown report")
    args = parser.parse_args()

    print(f"=== SIMONA-BT REMOTE STOCK SYNCHRONIZER ===")
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Stocks dir: {args.stocks_dir}")
    print(f"Database: {args.db_path}")
    print(f"Threshold: >= {args.threshold} pcs")
    print(f"Mode: {'DRY-RUN (NO DB WRITES)' if args.dry_run else 'LIVE PRODUCTION WRITE'}")
    print("=" * 45)

    if not os.path.exists(args.db_path):
        print(f"Error: database file {args.db_path} not found!")
        sys.exit(1)

    # 1. Load DB products
    conn = sqlite3.connect(args.db_path)
    cur = conn.cursor()
    cur.execute("""
        SELECT id, sku, brand, name, systemArticle, inStock, stockKominterna, stockBelinskogo15, stockRemote, physicalStatus, isDiscount, isSpecial
        FROM Product
    """)
    db_rows = cur.fetchall()
    print(f"Loaded {len(db_rows)} products from database.")

    # 2. Build multi-key lookup index:
    # (brand_norm, norm_art) -> db_row
    db_index = {}
    db_by_id = {}
    for r in db_rows:
        pid, sku, brand, name, sys_art, in_st, st_kom, st_bel, st_rem, phys, is_disc, is_spec = r
        b_norm = norm(brand)
        db_by_id[pid] = r
        if sys_art:
            db_index[(b_norm, norm(sys_art))] = pid
        # Secondary index: words from name
        for word in name.split():
            n_w = norm(word)
            if len(n_w) >= 3 and (b_norm, n_w) not in db_index:
                db_index[(b_norm, n_w)] = pid

    # 3. Parse all supplier files
    all_supplier_items = []
    processed_brands = set()
    files_processed = 0

    stock_files = sorted(glob.glob(os.path.join(args.stocks_dir, "*.*")))
    if not stock_files:
        print(f"Warning: No files found in {args.stocks_dir}!")
        sys.exit(0)

    for filepath in stock_files:
        fn = os.path.basename(filepath)
        # Find matching parser
        parser_func = None
        for reg_name, func in FILE_PARSER_REGISTRY.items():
            if reg_name.lower() in fn.lower() or fn.lower() in reg_name.lower():
                parser_func = func
                break
        
        if not parser_func:
            # Fallback heuristic
            if 'bosch' in fn.lower(): parser_func = parse_bosch
            elif 'korting' in fn.lower(): parser_func = parse_korting
            elif 'smeg' in fn.lower(): parser_func = parse_smeg
            elif 'vard' in fn.lower(): parser_func = parse_vard
            elif 'evelux' in fn.lower() and 'срц' in fn.lower(): parser_func = parse_evelux_src
            elif 'evelux' in fn.lower(): parser_func = parse_evelux
            elif 'elica' in fn.lower(): parser_func = parse_elica_jetair
            elif 'falmec' in fn.lower(): parser_func = parse_falmec
            elif 'franke' in fn.lower(): parser_func = parse_franke_elikor
            elif 'jacky' in fn.lower(): parser_func = parse_jackys
            elif 'dreame' in fn.lower(): parser_func = parse_dreame
            elif 'aeg' in fn.lower() or 'haier' in fn.lower(): parser_func = parse_aeg_haier_midea
            elif 'браукман' in fn.lower() or 'braukmann' in fn.lower(): parser_func = parse_braukmann
            elif 'дедитриш' in fn.lower() or 'dedietrich' in fn.lower(): parser_func = parse_dedietrich

        if not parser_func:
            print(f"Skipping unrecognized file: {fn}")
            continue

        try:
            items = parser_func(filepath)
            all_supplier_items.extend(items)
            files_processed += 1
            for item in items:
                processed_brands.add(norm(item['brand']))
            print(f"Parsed {fn}: {len(items)} items")
        except Exception as e:
            print(f"Error parsing {fn}: {e}")

    print(f"\nTotal supplier items parsed: {len(all_supplier_items)}")
    print(f"Brands covered: {len(processed_brands)}")

    # 4. Map supplier items to DB products (aggregating maximum available stock per product)
    product_supplier_stock = {} # pid -> max stock
    matched_supplier_rows = 0
    unmatched_supplier_rows = 0
    unmatched_samples = []

    for item in all_supplier_items:
        b_norm = norm(item['brand'])
        art_norm = norm(item['article'])
        pid = db_index.get((b_norm, art_norm))
        
        # Try alt_article if present
        if not pid and 'alt_article' in item:
            alt_norm = norm(item['alt_article'])
            pid = db_index.get((b_norm, alt_norm))

        if pid:
            matched_supplier_rows += 1
            current = product_supplier_stock.get(pid, 0)
            if item['stock'] > current:
                product_supplier_stock[pid] = item['stock']
        else:
            unmatched_supplier_rows += 1
            if len(unmatched_samples) < 20:
                unmatched_samples.append(f"{item['brand']} {item['article']} (stock={item['stock']}, file={item['file']})")

    # 5. Evaluate state transitions
    updated_to_remote_stock = []
    preserved_local_stock = []
    preserved_showroom = []
    reset_to_on_order = []
    untouched_products = 0

    db_updates = [] # (new_stock_remote, new_physical_status, pid)

    for pid, r in db_by_id.items():
        _, sku, brand, name, sys_art, in_st, st_kom, st_bel, st_rem, curr_phys, is_disc, is_spec = r
        b_norm = norm(brand)

        # Check if brand is managed by this sync run
        if b_norm not in processed_brands:
            untouched_products += 1
            continue

        supplier_stock = product_supplier_stock.get(pid, 0)

        # Priority 1: DISCOUNT
        if curr_phys == 'DISCOUNT' or (bool(is_disc) and not bool(is_spec)):
            new_phys = 'DISCOUNT'
            new_in_stock = 1 if (st_kom and st_kom > 0) else 0
        # Priority 2: SHOWROOM
        elif curr_phys == 'SHOWROOM' or (st_bel and st_bel > 0) or (bool(is_disc) and bool(is_spec)):
            new_phys = 'SHOWROOM'
            new_in_stock = 1
            preserved_showroom.append(r)
        # Priority 3: LOCAL_STOCK
        elif (st_kom and st_kom > 0) or (curr_phys == 'LOCAL_STOCK' and (st_kom is None or st_kom > 0)):
            new_phys = 'LOCAL_STOCK'
            new_in_stock = 1
            preserved_local_stock.append(r)
        # Priority 4: REMOTE_STOCK
        elif supplier_stock >= args.threshold:
            new_phys = 'REMOTE_STOCK'
            new_in_stock = 0
            if curr_phys != 'REMOTE_STOCK' or st_rem != supplier_stock:
                updated_to_remote_stock.append((r, supplier_stock))
        # Priority 5: ON_ORDER
        else:
            new_phys = 'ON_ORDER'
            new_in_stock = 0
            if curr_phys == 'REMOTE_STOCK' or (st_rem and st_rem > 0):
                reset_to_on_order.append(r)

        # Record update if values changed
        new_rem_val = supplier_stock if supplier_stock >= args.threshold else 0
        curr_in_st_int = 1 if in_st else 0
        if new_rem_val != st_rem or new_phys != curr_phys or new_in_stock != curr_in_st_int:
            db_updates.append((new_rem_val, new_phys, new_in_stock, pid))

    print(f"\n--- SYNCHRONIZATION RESULTS ---")
    print(f"Processed supplier files: {files_processed}")
    print(f"Matched supplier records: {matched_supplier_rows}")
    print(f"Unmatched supplier records: {unmatched_supplier_rows}")
    print(f"Products to set as 'REMOTE_STOCK': {len(updated_to_remote_stock)}")
    print(f"Products with LOCAL_STOCK priority preserved: {len(preserved_local_stock)}")
    print(f"Products with SHOWROOM priority preserved: {len(preserved_showroom)}")
    print(f"Products reset to 'ON_ORDER' (out of stock): {len(reset_to_on_order)}")
    print(f"Total database updates: {len(db_updates)}")

    # 6. Apply DB updates if not dry-run
    if not args.dry_run:
        cur.executemany("""
            UPDATE Product
            SET stockRemote = ?, physicalStatus = ?, inStock = ?, updatedAt = CURRENT_TIMESTAMP
            WHERE id = ?
        """, db_updates)
        conn.commit()
        print(f"SUCCESS: Committed {len(db_updates)} updates to database.")
    else:
        print("DRY-RUN completed. No changes written to database.")

    conn.close()

    # 7. Generate Markdown Report
    os.makedirs(os.path.dirname(os.path.abspath(args.report_path)), exist_ok=True)
    with open(args.report_path, 'w', encoding='utf-8') as rep:
        rep.write(f"# Отчет о синхронизации удаленного склада (SIMONA-BT)\n\n")
        rep.write(f"- **Дата и время**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        rep.write(f"- **Режим**: {'DRY-RUN (тестовый прогон)' if args.dry_run else 'LIVE PRODUCTION'}\n")
        rep.write(f"- **Порог наличия**: $\\ge {args.threshold}$ шт.\n")
        rep.write(f"- **Обработано файлов поставщиков**: {files_processed}\n")
        rep.write(f"- **Всего строк в файлах поставщиков**: {len(all_supplier_items)}\n")
        rep.write(f"- **Сопоставлено строк**: {matched_supplier_rows}\n")
        rep.write(f"- **Пропущено строк (нет в каталоге)**: {unmatched_supplier_rows}\n\n")
        
        rep.write(f"## Сводка по товарам каталога\n\n")
        rep.write(f"| Метрика | Количество |\n")
        rep.write(f"|---|---:|\n")
        rep.write(f"| Переведено в статус «На удаленном складе» (`REMOTE_STOCK`) | **{len(updated_to_remote_stock)}** |\n")
        rep.write(f"| Сохранен статус «На складе» в НН (`LOCAL_STOCK` priority) | **{len(preserved_local_stock)}** |\n")
        rep.write(f"| Сохранен статус «На витрине» (`SHOWROOM` priority) | **{len(preserved_showroom)}** |\n")
        rep.write(f"| Сброшено в «Под заказ» (`ON_ORDER`, остаток < {args.threshold} шт.) | **{len(reset_to_on_order)}** |\n")
        rep.write(f"| Всего изменений в базе данных | **{len(db_updates)}** |\n\n")

        if updated_to_remote_stock:
            rep.write(f"### Примеры товаров, получивших статус «На удаленном складе» (топ-15):\n\n")
            rep.write(f"| 1C Код | Бренд | Артикул | Наименование | Остаток поставщика |\n")
            rep.write(f"|---|---|---|---|---:|\n")
            for r, stock in updated_to_remote_stock[:15]:
                rep.write(f"| {r[1]} | {r[2]} | {r[4] or '-'} | {r[3]} | {stock} шт. |\n")
            rep.write(f"\n")

        if reset_to_on_order:
            rep.write(f"### Примеры товаров, сброшенных в «Под заказ» (топ-10):\n\n")
            rep.write(f"| 1C Код | Бренд | Артикул | Наименование |\n")
            rep.write(f"|---|---|---|---|\n")
            for r in reset_to_on_order[:10]:
                rep.write(f"| {r[1]} | {r[2]} | {r[4] or '-'} | {r[3]} |\n")
            rep.write(f"\n")

        if unmatched_samples:
            rep.write(f"### Примеры позиций поставщиков, отсутствующих в каталоге СИМОНЫ:\n\n")
            for s in unmatched_samples[:10]:
                rep.write(f"- `{s}`\n")

    print(f"Report saved to: {args.report_path}")

if __name__ == '__main__':
    main()

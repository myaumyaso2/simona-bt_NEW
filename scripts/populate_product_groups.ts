import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { prisma } from '../lib/prisma';
import { parseCsvLine } from '../lib/sync/oneCParser';

/**
 * Extracts product group from product name and brand as a fallback:
 * E.g. "Индукционная варочная панель SMEG SI4642D" + "SMEG" -> "Индукционная варочная панель"
 */
export function extractProductGroupFromName(name: string, brand?: string, category?: string): string {
  if (!name) return category || '';
  if (brand) {
    const escapedBrand = brand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?:^|\\s+)${escapedBrand}(?:\\s+|$)`, 'i');
    const parts = name.split(regex);
    if (parts.length > 1 && parts[0].trim().length > 0) {
      return parts[0].trim();
    }
  }
  // Try splitting by common brands if brand was slightly different
  const commonSplits = ['KÖRTING', 'KORTING', 'SMEG', 'ASKO', 'MIELE', 'MIDEA', 'OMOIKIRI', 'FALMEC', 'EVELUX', 'VARD', 'LIEBHERR', 'BOSCH', 'NEFF', 'SIEMENS', 'GRAUDE', 'ELICA', 'BERTAZZONI'];
  for (const b of commonSplits) {
    const regex = new RegExp(`(?:^|\\s+)${b}(?:\\s+|$)`, 'i');
    const parts = name.split(regex);
    if (parts.length > 1 && parts[0].trim().length > 0) {
      return parts[0].trim();
    }
  }
  return category || '';
}

async function main() {
  console.log('🚀 Starting productGroup enrichment from 1C_import.csv and catalog...');
  const csvPath = path.join(process.cwd(), 'data', '1C_import.csv');

  const map1C = new Map<string, string>();
  if (fs.existsSync(csvPath)) {
    console.log('📦 Reading data/1C_import.csv (windows-1251)...');
    const buffer = fs.readFileSync(csvPath);
    const text = new TextDecoder('windows-1251').decode(buffer);
    const lines = text.split(/\r?\n/);
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const parts = parseCsvLine(line);
      const code = parts[0]?.trim();
      const group = parts[2]?.trim(); // Column C: "Группа товара"
      if (code && group) {
        map1C.set(code, group);
      }
    }
    console.log(`Loaded ${map1C.size} SKU-to-Group mappings from 1C_import.csv.`);
  }

  // 1. Enrich data/exported_catalog_products.json.gz
  const gzPath = path.join(process.cwd(), 'data', 'exported_catalog_products.json.gz');
  if (fs.existsSync(gzPath)) {
    console.log('📦 Updating data/exported_catalog_products.json.gz...');
    const rawBuffer = fs.readFileSync(gzPath);
    const decompressed = zlib.gunzipSync(rawBuffer).toString('utf-8');
    const products: any[] = JSON.parse(decompressed);

    let from1C = 0;
    let fromFallback = 0;

    for (const p of products) {
      let group = map1C.get(p.sku);
      if (group) {
        from1C++;
      } else {
        group = extractProductGroupFromName(p.name, p.brand, p.category);
        fromFallback++;
      }
      p.productGroup = group;
    }

    const compressed = zlib.gzipSync(Buffer.from(JSON.stringify(products, null, 2), 'utf-8'));
    fs.writeFileSync(gzPath, compressed);
    console.log(`✅ data/exported_catalog_products.json.gz updated! (From 1C: ${from1C}, From Fallback: ${fromFallback})`);
  }

  // 2. Update database (SQLite or PostgreSQL)
  console.log('🗄️ Updating database products...');
  const dbProducts = await prisma.product.findMany({
    select: { id: true, sku: true, name: true, brand: true, category: true, productGroup: true }
  });
  console.log(`Found ${dbProducts.length} products in DB.`);

  let dbUpdated = 0;
  for (const p of dbProducts) {
    let group = map1C.get(p.sku) || extractProductGroupFromName(p.name, p.brand, p.category);
    if (group && group !== p.productGroup) {
      await prisma.product.update({
        where: { id: p.id },
        data: { productGroup: group }
      });
      dbUpdated++;
    }
  }
  console.log(`✅ Updated ${dbUpdated} products in database with productGroup!`);
}

main()
  .catch((e) => {
    console.error('Error running script:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

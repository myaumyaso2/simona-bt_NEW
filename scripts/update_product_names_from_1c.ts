import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { prisma } from '../lib/prisma';
import { parseCsvLine } from '../lib/sync/oneCParser';

async function main() {
  console.log('🚀 Starting synchronization of product names from 1C_import.csv...');
  const start = Date.now();

  const primaryCsvPath = path.join(process.cwd(), 'data', '1C_import.csv');
  const fallbackCsvPath = 'C:\\Users\\trash\\Documents\\1C_import.csv';

  let csvPath = primaryCsvPath;
  if (!fs.existsSync(csvPath)) {
    if (fs.existsSync(fallbackCsvPath)) {
      console.log(`Copying 1C_import.csv from ${fallbackCsvPath} to data/1C_import.csv...`);
      fs.copyFileSync(fallbackCsvPath, primaryCsvPath);
      csvPath = primaryCsvPath;
    } else {
      throw new Error('1C_import.csv not found!');
    }
  }

  // 1. Read CSV with windows-1251 decoding
  console.log('📦 Reading and decoding 1C_import.csv (windows-1251)...');
  const buffer = fs.readFileSync(csvPath);
  const text = new TextDecoder('windows-1251').decode(buffer);
  const lines = text.split(/\r?\n/);
  console.log(`Found ${lines.length} lines in 1C_import.csv.`);

  // Map 1C data by Code
  // Columns:
  // 0: Код
  // 1: Наименование
  // 2: Группа товара
  // 3: Производитель
  // 4: Артикул
  // 18: Остаток МП
  // 19: Остаток МП Склад
  const oneCMap = new Map<string, {
    code: string;
    rawName: string;
    group: string;
    brand: string;
    article: string;
    fullName: string;
    stockKominterna: number;
  }>();

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const parts = parseCsvLine(line);
    const code = parts[0]?.trim();
    if (!code || isNaN(Number(code)) || code === '0') continue;

    const rawName = parts[1]?.trim() || '';
    const group = parts[2]?.trim() || '';
    const brand = (parts[3]?.trim() || '').toUpperCase();
    const article = parts[4]?.trim() || '';

    // Standard Quiet Luxury template: "Группа товара + Бренд + Артикул"
    const fullNameParts = [group, brand, article].filter(Boolean);
    const fullName = fullNameParts.length > 0 ? fullNameParts.join(' ') : rawName;
    const stockKominterna = Math.max(0, parseInt(parts[18] || '0', 10) || 0);

    oneCMap.set(code, {
      code,
      rawName,
      group,
      brand,
      article,
      fullName,
      stockKominterna,
    });
  }

  console.log(`Successfully mapped ${oneCMap.size} records from 1C_import.csv.`);

  // 2. Read existing products from master dump
  const gzPath = path.join(process.cwd(), 'data', 'exported_catalog_products.json.gz');
  if (!fs.existsSync(gzPath)) {
    throw new Error(`Master catalog dump not found at: ${gzPath}`);
  }

  console.log('📦 Reading data/exported_catalog_products.json.gz...');
  const rawData = zlib.gunzipSync(fs.readFileSync(gzPath)).toString('utf8');
  const products: any[] = JSON.parse(rawData);
  console.log(`Found ${products.length} products in master dump.`);

  let matchedFrom1C = 0;
  let normalizedFallbacks = 0;

  for (const prod of products) {
    const code = String(prod.id || prod.sku).trim();
    const oneC = oneCMap.get(code);

    if (oneC && oneC.fullName) {
      prod.name = oneC.fullName;
      if (oneC.brand) {
        prod.brand = oneC.brand;
      }
      matchedFrom1C++;
    } else {
      // Fallback normalization if not found in 1C import
      // e.g. "SR 764AO Варочная панель" -> "Варочная панель SMEG SR 764AO"
      const oldName: string = prod.name || '';
      const brand: string = (prod.brand || '').trim();

      // Check if old name ends with category/group (e.g. "Варочная панель", "Вытяжка", "Мойка", "Барбекю")
      const match = oldName.match(/^(.*?)\s+([А-Яа-яЁё][а-яёА-ЯЁ\s-]+)$/);
      if (match && brand) {
        const article = match[1].trim();
        const group = match[2].trim();
        if (article && group && !group.includes(brand)) {
          prod.name = `${group} ${brand} ${article}`;
          normalizedFallbacks++;
        }
      }
    }

    // Set physical status based on stock rules
    if (prod.stockKominterna > 0 || prod.inStock) {
      prod.physicalStatus = 'LOCAL_STOCK';
    } else if (prod.stockRemote > 0) {
      prod.physicalStatus = 'REMOTE_STOCK';
    } else {
      prod.physicalStatus = 'ON_ORDER';
    }
  }

  console.log(`Matched and updated from 1C: ${matchedFrom1C}`);
  console.log(`Normalized fallbacks: ${normalizedFallbacks}`);

  // 3. Save backup and overwrite data/exported_catalog_products.json.gz
  const backupPath = path.join(process.cwd(), 'data', `exported_catalog_products.backup_names_${Date.now()}.json.gz`);
  fs.copyFileSync(gzPath, backupPath);
  console.log(`💾 Backup saved to: ${path.basename(backupPath)}`);

  const updatedGz = zlib.gzipSync(Buffer.from(JSON.stringify(products), 'utf8'));
  fs.writeFileSync(gzPath, updatedGz);
  console.log('✅ Overwritten data/exported_catalog_products.json.gz with new names.');

  // 4. Update SQLite database in batches
  console.log('🧹 Updating SQLite database products with new names, brands, and physical statuses...');
  const batchSize = 100;
  let dbUpdated = 0;

  for (let i = 0; i < products.length; i += batchSize) {
    const chunk = products.slice(i, i + batchSize);
    await prisma.$transaction(
      chunk.map((p: any) =>
        prisma.product.update({
          where: { id: p.id },
          data: {
            name: p.name,
            brand: p.brand,
            physicalStatus: p.physicalStatus,
          },
        })
      )
    );
    dbUpdated += chunk.length;
    if (dbUpdated % 1000 === 0 || dbUpdated === products.length) {
      console.log(`  -> Updated ${dbUpdated} / ${products.length} products in SQLite...`);
    }
  }

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`\n✨ Successfully finished product names update in ${elapsed}s!`);
}

main()
  .catch((e) => {
    console.error('❌ Error updating product names:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

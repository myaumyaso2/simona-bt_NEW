import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import readline from 'readline';
import { prisma } from '../lib/prisma';

async function main() {
  console.log('🚀 Starting Discount Reason and Showroom/Discount status enrichment...');

  const exportPath = 'C:\\Users\\trash\\.gemini\\antigravity\\brain\\e8fbc5f5-4ac1-458b-bb14-a46d4efd4a35\\scratch\\old_site_catalog_export';
  const reasonMap = new Map<string, string>();

  if (fs.existsSync(exportPath)) {
    console.log('📦 Reading reasons from old_site_catalog_export...');
    const fileStream = fs.createReadStream(exportPath, { encoding: 'latin1' });
    const dec = new TextDecoder('windows-1251');
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

    let lineNum = 0;
    let kodCol = 0;
    let ucenCol = 24;
    let reasonCol = 25;

    for await (const rawLine of rl) {
      const line = dec.decode(Buffer.from(rawLine, 'latin1'));
      lineNum++;
      if (lineNum === 1) {
        const headers = line.split(';').map((h) => h.trim());
        kodCol = headers.indexOf('kod');
        ucenCol = headers.indexOf('ucenennye_tovary_text');
        reasonCol = headers.indexOf('reason');
        continue;
      }

      const p = line.split(';');
      const kod = p[kodCol]?.trim();
      if (!kod) continue;

      let r = p[reasonCol]?.trim() || '';
      if (!r && p[ucenCol]?.trim()) {
        r = p[ucenCol].replace(/<[^>]+>/g, '').trim();
      }

      if (r) {
        reasonMap.set(kod, r);
      }
    }
    console.log(`Found ${reasonMap.size} discount reasons in export.`);
  }

  // 2. Parse 1C_import.csv for accurate 1C flags
  const oneCPath = path.join(process.cwd(), 'data', '1C_import.csv');
  const oneCMap = new Map<string, { isDiscount: boolean; isSpecial: boolean; amount: number; priceSpecial: number }>();

  if (fs.existsSync(oneCPath)) {
    console.log('📦 Reading 1C_import.csv for showroom & discount flags...');
    const fileStream = fs.createReadStream(oneCPath, { encoding: 'latin1' });
    const dec = new TextDecoder('windows-1251');
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

    for await (const rawLine of rl) {
      const line = dec.decode(Buffer.from(rawLine, 'latin1'));
      const p = line.split(';');
      const code = p[0]?.trim();
      if (!code || isNaN(Number(code)) || code === '0') continue;

      const isSpecial = p[7] === '1';
      const isDiscount = p[9] === '1';
      const amount = Math.max(0, parseInt(p[6] || '0', 10) || 0);
      const priceSpecial = Math.max(0, parseFloat(p[14] || '0') || 0);

      oneCMap.set(code, { isDiscount, isSpecial, amount, priceSpecial });
    }
    console.log(`Processed ${oneCMap.size} items from 1C.`);
  }

  // 3. Update data/exported_catalog_products.json.gz
  const gzPath = path.join(process.cwd(), 'data', 'exported_catalog_products.json.gz');
  let products: any[] = [];
  if (fs.existsSync(gzPath)) {
    console.log('📦 Updating master dump exported_catalog_products.json.gz...');
    products = JSON.parse(zlib.gunzipSync(fs.readFileSync(gzPath)).toString('utf8'));
    let showroomCount = 0;
    let discountCount = 0;
    let reasonsAdded = 0;

    for (const prod of products) {
      const code = String(prod.sku || prod.id || '').trim();
      const oneC = oneCMap.get(code);
      const reason = reasonMap.get(code);

      if (reason) {
        prod.discountReason = reason;
        reasonsAdded++;
      }

      if (oneC) {
        prod.isDiscount = oneC.isDiscount;
        prod.isSpecial = oneC.isSpecial;

        if (oneC.isDiscount && oneC.isSpecial && oneC.amount > 0) {
          prod.physicalStatus = 'SHOWROOM';
          prod.inStock = true;
          showroomCount++;
        } else if (oneC.isDiscount && !oneC.isSpecial && oneC.amount > 0) {
          prod.physicalStatus = 'DISCOUNT';
          prod.inStock = true;
          discountCount++;
        } else if (oneC.isDiscount && oneC.amount === 0) {
          prod.isActive = false;
        }
      } else {
        // Fallback check on existing flags
        if (prod.isDiscount && prod.isSpecial && (prod.stockCount > 0 || prod.inStock)) {
          prod.physicalStatus = 'SHOWROOM';
          showroomCount++;
        } else if (prod.isDiscount && !prod.isSpecial && (prod.stockCount > 0 || prod.inStock)) {
          prod.physicalStatus = 'DISCOUNT';
          discountCount++;
        }
      }
    }

    fs.writeFileSync(gzPath, zlib.gzipSync(JSON.stringify(products, null, 2)));
    console.log(`Dump updated: ${reasonsAdded} reasons attached, ${showroomCount} SHOWROOM, ${discountCount} DISCOUNT.`);
  }

  // 4. Update Database
  console.log('💾 Updating Database records in Prisma...');
  let dbUpdated = 0;
  for (const [code, reason] of Array.from(reasonMap.entries())) {
    try {
      const res = await prisma.product.updateMany({
        where: { sku: code },
        data: { discountReason: reason },
      });
      dbUpdated += res.count;
    } catch (e) {
      // Ignore not found
    }
  }

  // Update physicalStatus in DB according to 1C flags
  let dbShowroom = 0;
  let dbDiscount = 0;
  let dbDeactivated = 0;

  for (const [code, oneC] of Array.from(oneCMap.entries())) {
    if (oneC.isDiscount && oneC.isSpecial && oneC.amount > 0) {
      await prisma.product.updateMany({
        where: { sku: code },
        data: {
          physicalStatus: 'SHOWROOM',
          isDiscount: true,
          isSpecial: true,
          inStock: true,
          isActive: true,
        },
      });
      dbShowroom++;
    } else if (oneC.isDiscount && !oneC.isSpecial && oneC.amount > 0) {
      await prisma.product.updateMany({
        where: { sku: code },
        data: {
          physicalStatus: 'DISCOUNT',
          isDiscount: true,
          isSpecial: false,
          inStock: true,
          isActive: true,
        },
      });
      dbDiscount++;
    } else if (oneC.isDiscount && oneC.amount === 0) {
      await prisma.product.updateMany({
        where: { sku: code },
        data: {
          isDiscount: true,
          isActive: false,
        },
      });
      dbDeactivated++;
    }
  }

  console.log(`✨ DB finished: ${dbUpdated} reasons, ${dbShowroom} showroom, ${dbDiscount} discount, ${dbDeactivated} deactivated with amount 0.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());

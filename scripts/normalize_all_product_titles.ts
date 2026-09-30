import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { prisma } from '../lib/prisma';
import { formatProductName } from '../lib/catalog/productTitle';

async function main() {
  console.log('🚀 Starting universal normalization of all catalog product names...');
  const start = Date.now();

  const gzPath = path.join(process.cwd(), 'data', 'exported_catalog_products.json.gz');
  if (!fs.existsSync(gzPath)) {
    throw new Error(`Master catalog dump not found at: ${gzPath}`);
  }

  const rawData = zlib.gunzipSync(fs.readFileSync(gzPath)).toString('utf8');
  const products: any[] = JSON.parse(rawData);
  console.log(`📦 Loaded ${products.length} products from master dump.`);

  let updatedCount = 0;
  const updatedSample: Array<{ id: string; old: string; new: string }> = [];

  for (const prod of products) {
    const oldName = prod.name || '';
    const newName = formatProductName(prod);

    if (oldName !== newName) {
      prod.name = newName;
      updatedCount++;
      if (updatedSample.length < 20) {
        updatedSample.push({ id: prod.id, old: oldName, new: newName });
      }
    }
  }

  console.log(`✨ Total products normalized: ${updatedCount}`);
  console.log('Sample updates:');
  updatedSample.forEach((s, idx) => {
    console.log(`${idx + 1}. [${s.id}] "${s.old}" ---> "${s.new}"`);
  });

  // 1. Save backup and overwrite data/exported_catalog_products.json.gz
  const backupPath = path.join(process.cwd(), 'data', `exported_catalog_products.backup_norm_${Date.now()}.json.gz`);
  fs.copyFileSync(gzPath, backupPath);
  console.log(`💾 Backup saved to: ${path.basename(backupPath)}`);

  const updatedGz = zlib.gzipSync(Buffer.from(JSON.stringify(products), 'utf8'));
  fs.writeFileSync(gzPath, updatedGz);
  console.log('✅ Overwritten data/exported_catalog_products.json.gz with normalized names.');

  // 2. Update database (SQLite or PostgreSQL)
  console.log('🗄️ Updating database records with normalized names...');
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
          },
        })
      )
    );
    dbUpdated += chunk.length;
    if (dbUpdated % 1000 === 0 || dbUpdated === products.length) {
      console.log(`  -> Updated ${dbUpdated} / ${products.length} database products...`);
    }
  }

  const duration = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`🎉 Done in ${duration}s! All ${products.length} products comply with "Группа товара + Бренд + Артикул".`);
}

main()
  .catch((err) => {
    console.error('❌ Error during normalization:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

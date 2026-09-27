import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { prisma } from '../lib/prisma';

async function main() {
  console.log('🔄 Starting migration to 1C Codes as universal ID & SKU...');

  const prodsGzPath = path.join(process.cwd(), 'data', 'exported_catalog_products.json.gz');
  if (!fs.existsSync(prodsGzPath)) {
    throw new Error(`Catalog dump file not found: ${prodsGzPath}`);
  }

  // 1. Decompress and read
  console.log('📦 Reading data/exported_catalog_products.json.gz...');
  const rawData = zlib.gunzipSync(fs.readFileSync(prodsGzPath)).toString('utf8');
  const products = JSON.parse(rawData);
  console.log(`Found ${products.length} products.`);

  // 2. Transform: id = oneCGuid, sku = oneCGuid
  let updatedCount = 0;
  for (const p of products) {
    if (p.oneCGuid) {
      p.id = String(p.oneCGuid).trim();
      p.sku = String(p.oneCGuid).trim();
      updatedCount++;
    }
  }

  console.log(`Updated ${updatedCount} products to have id=1C Code and sku=1C Code.`);

  // 3. Save backup of old gz file first
  const backupPath = path.join(process.cwd(), 'data', `exported_catalog_products.backup_${Date.now()}.json.gz`);
  fs.copyFileSync(prodsGzPath, backupPath);
  console.log(`💾 Backup saved to: ${path.basename(backupPath)}`);

  // 4. Compress and write back to data/exported_catalog_products.json.gz
  const updatedGz = zlib.gzipSync(Buffer.from(JSON.stringify(products), 'utf8'));
  fs.writeFileSync(prodsGzPath, updatedGz);
  console.log('✅ Overwritten data/exported_catalog_products.json.gz with updated IDs & SKUs.');

  // 5. Update SQLite database in batches
  console.log('🧹 Purging and reloading SQLite Product table...');
  await prisma.product.deleteMany();

  const batchSize = 100;
  let inserted = 0;

  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize).map((p: any) => ({
      id: p.id,
      sku: p.sku || 'NO-SKU',
      name: p.name,
      slug: p.slug,
      brand: p.brand || 'СИМОНА',
      category: p.category || 'Встраиваемая техника',
      categoryType: p.categoryType || 'CATEGORY_B',
      physicalStatus: p.physicalStatus || (p.inStock ? 'LOCAL_STOCK' : 'ON_ORDER'),
      price: Number(p.price) || 0,
      oldPrice: p.oldPrice ? Number(p.oldPrice) : null,
      inStock: Boolean(p.inStock),
      stockCount: Number(p.stockCount) || 0,
      stockKominterna: Number(p.stockKominterna) || 0,
      stockBelinskogo15: Number(p.stockBelinskogo15) || 0,
      stockRemote: Number(p.stockRemote) || 0,
      deliveryDays: Number(p.deliveryDays) || 1,
      oneCGuid: p.oneCGuid || null,
      oldUrl: p.oldUrl || null,
      color: p.color || null,
      shortDesc: p.shortDesc || null,
      description: p.description || p.name,
      featuresJson: JSON.stringify(p.features || []),
      dimensions: p.dimensions || null,
      schematicPdfUrl: p.schematicPdfUrl || null,
      imagesJson: JSON.stringify(p.images || []),
      badge: p.badge || null,
      isFeatured: Boolean(p.isFeatured),
    }));

    await prisma.product.createMany({
      data: batch,
    });

    inserted += batch.length;
    if (inserted % 1000 === 0 || inserted === products.length) {
      console.log(`  -> Inserted ${inserted} / ${products.length} products into DB...`);
    }
  }

  // 6. Verification
  const totalDb = await prisma.product.count();
  const sample = await prisma.product.findMany({
    take: 5,
    select: { id: true, sku: true, oneCGuid: true, name: true }
  });

  console.log('\n📊 Migration complete:');
  console.log(`Total products in SQLite: ${totalDb}`);
  console.log('Sample verified products:');
  console.dir(sample, { depth: null });
}

main()
  .catch((e) => {
    console.error('❌ Migration failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

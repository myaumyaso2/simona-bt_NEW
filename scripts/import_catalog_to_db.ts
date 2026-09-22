import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { prisma } from '../lib/prisma';

async function main() {
  console.log('🚀 Starting import of real UMI.CMS catalog into database...');
  const start = Date.now();

  const prodsGzPath = path.join(process.cwd(), 'data', 'exported_catalog_products.json.gz');
  const redirsGzPath = path.join(process.cwd(), 'data', 'exported_301_redirects.json.gz');

  if (!fs.existsSync(prodsGzPath)) {
    throw new Error(`Products file not found at ${prodsGzPath}`);
  }

  console.log('📦 Reading and decompressing exported products...');
  const prodsRaw = zlib.gunzipSync(fs.readFileSync(prodsGzPath)).toString('utf8');
  const rawProducts = JSON.parse(prodsRaw);
  console.log(`Found ${rawProducts.length} products to import.`);

  console.log('🧹 Clearing existing products and redirects...');
  await prisma.product.deleteMany();
  await prisma.redirect301.deleteMany();

  console.log('💾 Inserting products in batches...');
  const batchSize = 100;
  let inserted = 0;

  for (let i = 0; i < rawProducts.length; i += batchSize) {
    const batch = rawProducts.slice(i, i + batchSize).map((p: any) => ({
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
    if (inserted % 1000 === 0 || inserted === rawProducts.length) {
      console.log(`  -> Inserted ${inserted} / ${rawProducts.length} products...`);
    }
  }

  // Import 301 Redirects
  if (fs.existsSync(redirsGzPath)) {
    console.log('🔗 Decompressing and importing 301-redirect rules...');
    const redirsRaw = zlib.gunzipSync(fs.readFileSync(redirsGzPath)).toString('utf8');
    const redirsObj: Record<string, string> = JSON.parse(redirsRaw);
    const redirectEntries = Object.entries(redirsObj).map(([oldPath, newPath]) => ({
      oldPath,
      newPath,
    }));

    console.log(`Found ${redirectEntries.length} redirect rules to import.`);
    let redirsInserted = 0;

    for (let i = 0; i < redirectEntries.length; i += 200) {
      const batch = redirectEntries.slice(i, i + 200);
      // skipDuplicates available in SQLite and Postgres
      await prisma.redirect301.createMany({
        data: batch,
      });
      redirsInserted += batch.length;
      if (redirsInserted % 3000 === 0 || redirsInserted === redirectEntries.length) {
        console.log(`  -> Inserted ${redirsInserted} / ${redirectEntries.length} redirects...`);
      }
    }
  }

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`✨ Successfully imported catalog in ${elapsed}s!`);
}

main()
  .catch((e) => {
    console.error('❌ Import failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

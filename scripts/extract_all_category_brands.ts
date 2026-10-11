import { prisma } from '../lib/prisma';
import { CATALOG_CATEGORIES } from '../data/catalogCategories';
import fs from 'fs';
import path from 'path';

async function run() {
  console.log('Fetching products from database...');
  const prods = await prisma.product.findMany({
    select: { category: true, brand: true }
  });
  console.log(`Loaded ${prods.length} products.`);

  const brandCountsByCategory: Record<string, Record<string, number>> = {};
  for (const p of prods) {
    if (!p.category || !p.brand) continue;
    const cat = p.category.trim();
    const brand = p.brand.trim();
    if (!brandCountsByCategory[cat]) brandCountsByCategory[cat] = {};
    brandCountsByCategory[cat][brand] = (brandCountsByCategory[cat][brand] || 0) + 1;
  }

  const updatedCategories = CATALOG_CATEGORIES.map(cat => {
    const brandsMap: Record<string, number> = {};
    for (const dbCat of cat.dbCategories) {
      const bMap = brandCountsByCategory[dbCat] || {};
      for (const [b, count] of Object.entries(bMap)) {
        brandsMap[b] = (brandsMap[b] || 0) + count;
      }
    }
    const sortedBrands = Object.entries(brandsMap)
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0]);

    const finalBrands = sortedBrands.length > 0 ? sortedBrands : cat.featuredBrands;
    return {
      ...cat,
      featuredBrands: finalBrands
    };
  });

  const categoriesFilePath = path.join(__dirname, '../data/catalogCategories.ts');
  const fileHeader = `// Auto-generated Catalog Category Registry for SIMONA-BT
// Source of truth linking MegaMenu, Catalog URLs (/catalog/[category]), and Database queries.

export interface CatalogCategory {
  slug: string;
  title: string;          // Литературный заголовок для H1 / SEO (например: "Встраиваемые духовые шкафы")
  menuTitle: string;      // Название в мега-меню (например: "Духовые шкафы")
  shortTitle: string;
  sectionId: string;      // ID колонки в мега-меню
  sectionTitle: string;   // Название секции ("Встраиваемая техника")
  sectionSlug: string;    // ЧПУ-слаг секции ("vstraivaemaya-tehnika")
  dbCategories: string[]; // Точные имена категорий в базе данных PostgreSQL
  desc: string;
  heroSubtitle: string;
  count: string;
  countNum: number;
  image: string;
  featuredBrands: string[];
  badge?: string;
  span?: string;
}

export const CATALOG_CATEGORIES: CatalogCategory[] = `;

  const helperFunctions = `

export function getCategoryBySlug(slug: string): CatalogCategory | undefined {
  return CATALOG_CATEGORIES.find((c) => c.slug === slug);
}

export function getCategoriesBySection(sectionSlug: string): CatalogCategory[] {
  return CATALOG_CATEGORIES.filter((c) => c.sectionSlug === sectionSlug);
}

export function getAllActiveCategories(): CatalogCategory[] {
  return CATALOG_CATEGORIES.filter((c) => c.countNum > 0);
}

export function getCategorySlugByName(name?: string): string {
  if (!name) return 'varochnye-paneli';
  const lower = name.toLowerCase();
  const found = CATALOG_CATEGORIES.find(
    (c) =>
      c.dbCategories.some((db) => db.toLowerCase() === lower) ||
      c.title.toLowerCase() === lower ||
      c.menuTitle.toLowerCase() === lower
  );
  return found ? found.slug : 'varochnye-paneli';
}

export function getCategoryByDbName(dbCategory: string): CatalogCategory | undefined {
  return CATALOG_CATEGORIES.find((c) => c.dbCategories.includes(dbCategory));
}
`;

  const newContent = fileHeader + JSON.stringify(updatedCategories, null, 2) + ';' + helperFunctions;
  fs.writeFileSync(categoriesFilePath, newContent, 'utf-8');
  console.log(`Successfully updated ${categoriesFilePath} with full brands lists!`);

  for (const c of updatedCategories.slice(0, 5)) {
    console.log(`- ${c.title} (${c.slug}): ${c.featuredBrands.length} brands -> ${c.featuredBrands.slice(0, 8).join(', ')}...`);
  }
}

run()
  .catch(err => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

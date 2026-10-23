import fs from 'fs';
import path from 'path';
import { prisma } from '../lib/prisma';
import { resolveProductHierarchy } from '../lib/catalog/categoryHierarchy';
import { getFeatureSemanticGroup, SemanticFeatureGroup, SEMANTIC_FEATURE_GROUPS } from '../lib/productFeatures';

export interface CategorySpecField {
  label: string;
  group: SemanticFeatureGroup;
  unit?: string;
  isCore: boolean;
  commonValues: string[];
}

export interface CategorySpecSchema {
  subcategory: string;
  globalCategory: string;
  fields: CategorySpecField[];
}

function extractUnit(label: string): string | undefined {
  const match = label.match(/\((.*?)\)/);
  if (match) return match[1];
  return undefined;
}

const GROUP_ORDER: Record<SemanticFeatureGroup, number> = {
  'Основные параметры': 1,
  'Габариты и монтаж': 2,
  'Функции и режимы': 3,
  'Комфорт, уход и безопасность': 4,
  'Дополнительные характеристики': 5,
};

async function main() {
  console.log('🚀 Generating Category Specification Schemas from Database Audit...');

  const products = await prisma.product.findMany({
    select: {
      id: true,
      sku: true,
      name: true,
      brand: true,
      category: true,
      productGroup: true,
      featuresJson: true,
    },
  });

  console.log(`Loaded ${products.length} products.`);

  const subcategoryMap = new Map<string, {
    globalCategory: string;
    count: number;
    withFeaturesCount: number;
    featureCounts: Map<string, number>;
    featureValues: Map<string, Map<string, number>>;
  }>();

  for (const p of products) {
    const hier = resolveProductHierarchy(p);
    const sub = hier.subcategory;

    if (!subcategoryMap.has(sub)) {
      subcategoryMap.set(sub, {
        globalCategory: hier.globalCategory,
        count: 0,
        withFeaturesCount: 0,
        featureCounts: new Map(),
        featureValues: new Map(),
      });
    }

    const entry = subcategoryMap.get(sub)!;
    entry.count++;

    let feats: Array<{ label: string; value: string }> = [];
    try {
      feats = JSON.parse(p.featuresJson || '[]');
    } catch {
      feats = [];
    }

    if (feats.length > 0) {
      entry.withFeaturesCount++;
    }

    for (const f of feats) {
      if (!f.label || !f.value || f.value === '-' || f.value.trim() === '') continue;
      const l = f.label.trim();
      const val = f.value.trim();

      entry.featureCounts.set(l, (entry.featureCounts.get(l) || 0) + 1);

      if (!entry.featureValues.has(l)) {
        entry.featureValues.set(l, new Map());
      }
      const valMap = entry.featureValues.get(l)!;
      valMap.set(val, (valMap.get(val) || 0) + 1);
    }
  }

  const schemas: Record<string, CategorySpecSchema> = {};

  for (const [sub, info] of Array.from(subcategoryMap.entries())) {
    // Collect features present in at least 2 products or at least 5% of products with features
    const minOccurrences = Math.max(2, Math.min(5, Math.floor(info.withFeaturesCount * 0.05)));

    const candidateFeatures: Array<[string, number]> = Array.from(info.featureCounts.entries())
      .filter(([feat, cnt]) => cnt >= minOccurrences && feat.toLowerCase() !== 'бренд')
      .sort((a, b) => b[1] - a[1]);

    // Top 30 features max per subcategory to keep schemas focused
    const topCandidates = candidateFeatures.slice(0, 30);

    const fields: CategorySpecField[] = topCandidates.map(([label, cnt], index) => {
      const group = getFeatureSemanticGroup(label);
      const unit = extractUnit(label);
      const isCore = index < 10; // Top 10 are core

      const valMap = info.featureValues.get(label);
      let commonValues: string[] = [];
      if (valMap) {
        commonValues = Array.from(valMap.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 8)
          .map(([v]) => v);
      }

      return {
        label,
        group,
        unit,
        isCore,
        commonValues,
      };
    });

    // Sort fields by semantic group order, then by isCore desc, then label
    fields.sort((a, b) => {
      const gDiff = GROUP_ORDER[a.group] - GROUP_ORDER[b.group];
      if (gDiff !== 0) return gDiff;
      if (a.isCore !== b.isCore) return a.isCore ? -1 : 1;
      return a.label.localeCompare(b.label, 'ru');
    });

    schemas[sub] = {
      subcategory: sub,
      globalCategory: info.globalCategory,
      fields,
    };
  }

  console.log(`Generated schemas for ${Object.keys(schemas).length} subcategories.`);

  const outPath = path.join(process.cwd(), 'data', 'categorySpecSchemas.ts');
  const fileContent = `// Auto-generated Category Specification Schemas for SIMONA-BT
// Source of truth for Excel templates, Manager visual editor, and AI auto-enrichment.

import { SemanticFeatureGroup } from '@/lib/productFeatures';

export interface CategorySpecField {
  label: string;
  group: SemanticFeatureGroup;
  unit?: string;
  isCore: boolean;
  commonValues: string[];
}

export interface CategorySpecSchema {
  subcategory: string;
  globalCategory: string;
  fields: CategorySpecField[];
}

export const CATEGORY_SPEC_SCHEMAS: Record<string, CategorySpecSchema> = ${JSON.stringify(schemas, null, 2)};

/**
 * Returns the canonical specification schema for a given subcategory.
 * If exact match is not found, attempts fallback lookup.
 */
export function getCategorySpecSchema(subcategory: string): CategorySpecSchema | null {
  if (!subcategory) return null;
  const direct = CATEGORY_SPEC_SCHEMAS[subcategory];
  if (direct) return direct;

  const subLower = subcategory.toLowerCase().trim();
  const foundKey = Object.keys(CATEGORY_SPEC_SCHEMAS).find(
    (k) => k.toLowerCase() === subLower || subLower.includes(k.toLowerCase()) || k.toLowerCase().includes(subLower)
  );

  return foundKey ? CATEGORY_SPEC_SCHEMAS[foundKey] : null;
}
`;

  fs.writeFileSync(outPath, fileContent, 'utf8');
  console.log(`✅ Saved data/categorySpecSchemas.ts (${(fileContent.length / 1024).toFixed(1)} KB)`);
}

main().catch(console.error).finally(() => prisma.$disconnect());

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAuthorized } from '@/lib/adminAuth';
import { formatProductName } from '@/lib/catalog/productTitle';
import { resolveProductHierarchy, getSectionPriority } from '@/lib/catalog/categoryHierarchy';
import {
  recordSpecAuditLog,
  syncProductsToMasterDump,
  deriveDimensionsAndColorFromFeatures,
  SpecProductSnapshot,
} from '@/lib/catalog/specAuditService';

export const dynamic = 'force-dynamic';

export interface ProductSpecNodeItem {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: string;
  productGroup?: string | null;
  price: number;
  stockKominterna: number;
  stockBelinskogo15: number;
  totalStock: number;
  inStock: boolean;
  isActive: boolean;
  globalCategory: string;
  subcategory: string;
  featureCount: number;
  features: Array<{ label: string; value: string }>;
  description: string;
  schematicPdfUrl?: string | null;
  dimensions?: string | null;
  color?: string | null;
  images: string[];
}

export interface SpecBrandNode {
  brand: string;
  count: number;
  needFillCount: number;
  filledCount: number;
  missingCount: number;
  incompleteCount: number;
  products: ProductSpecNodeItem[];
}

export interface SpecSubcategoryNode {
  subcategory: string;
  count: number;
  needFillCount: number;
  filledCount: number;
  missingCount: number;
  incompleteCount: number;
  brands: SpecBrandNode[];
}

export interface SpecGlobalCategoryNode {
  globalCategory: string;
  count: number;
  needFillCount: number;
  filledCount: number;
  missingCount: number;
  incompleteCount: number;
  subcategories: SpecSubcategoryNode[];
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Требуется авторизация менеджера' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q')?.trim().toLowerCase() || '';
    const filter = (searchParams.get('filter') || 'need_fill') as
      | 'need_fill'
      | 'filled'
      | 'missing'
      | 'incomplete'
      | 'all';
    const subcategoryParam = searchParams.get('subcategory')?.trim() || '';

    // Fetch all active products
    const rawProducts = await prisma.product.findMany({
      where: {
        isActive: true,
      },
      orderBy: [
        { inStock: 'desc' },
        { stockKominterna: 'desc' },
        { brand: 'asc' },
        { name: 'asc' },
      ],
      select: {
        id: true,
        sku: true,
        name: true,
        brand: true,
        category: true,
        productGroup: true,
        price: true,
        stockKominterna: true,
        stockBelinskogo15: true,
        stockRemote: true,
        inStock: true,
        isActive: true,
        featuresJson: true,
        description: true,
        schematicPdfUrl: true,
        dimensions: true,
        color: true,
        imagesJson: true,
      },
    });

    let totalCatalogCount = rawProducts.length;
    let missingSpecsTotal = 0;
    let incompleteSpecsTotal = 0;

    const enrichedItems: ProductSpecNodeItem[] = rawProducts.map((p) => {
      const hier = resolveProductHierarchy(p);
      const canonicalName = formatProductName({
        name: p.name,
        brand: p.brand,
        category: p.category,
        sku: p.sku,
      });
      const totalStock = (p.stockKominterna || 0) + (p.stockBelinskogo15 || 0);

      let features: Array<{ label: string; value: string }> = [];
      try {
        features = JSON.parse(p.featuresJson || '[]');
      } catch {
        features = [];
      }

      let images: string[] = [];
      try {
        images = JSON.parse(p.imagesJson || '[]');
      } catch {
        images = [];
      }

      const featureCount = features.length;
      if (featureCount === 0) {
        missingSpecsTotal++;
      } else if (featureCount < 4) {
        incompleteSpecsTotal++;
      }

      return {
        id: p.id,
        sku: p.sku,
        name: canonicalName,
        brand: p.brand,
        category: p.category,
        productGroup: p.productGroup,
        price: p.price,
        stockKominterna: p.stockKominterna,
        stockBelinskogo15: p.stockBelinskogo15,
        totalStock,
        inStock: totalStock > 0 || p.inStock,
        isActive: p.isActive,
        globalCategory: hier.globalCategory,
        subcategory: hier.subcategory,
        featureCount,
        features,
        description: p.description,
        schematicPdfUrl: p.schematicPdfUrl,
        dimensions: p.dimensions,
        color: p.color,
        images,
      };
    });

    const needFillTotal = missingSpecsTotal + incompleteSpecsTotal;
    const filledSpecsTotal = totalCatalogCount - needFillTotal;

    // Filter items according to requested filter mode
    let filtered = enrichedItems;

    if (filter === 'need_fill' || filter === 'missing' || filter === 'incomplete') {
      filtered = filtered.filter((p) => p.featureCount < 4);
    } else if (filter === 'filled') {
      filtered = filtered.filter((p) => p.featureCount >= 4);
    }

    if (subcategoryParam) {
      filtered = filtered.filter(
        (p) => p.subcategory.toLowerCase() === subcategoryParam.toLowerCase()
      );
    }

    if (query) {
      filtered = filtered.filter(
        (p) =>
          p.sku.toLowerCase().includes(query) ||
          p.name.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.subcategory.toLowerCase().includes(query) ||
          p.globalCategory.toLowerCase().includes(query)
      );
    }

    // Build hierarchical tree
    const globalMap = new Map<string, SpecGlobalCategoryNode>();

    for (const p of filtered) {
      if (!globalMap.has(p.globalCategory)) {
        globalMap.set(p.globalCategory, {
          globalCategory: p.globalCategory,
          count: 0,
          needFillCount: 0,
          filledCount: 0,
          missingCount: 0,
          incompleteCount: 0,
          subcategories: [],
        });
      }
      const gNode = globalMap.get(p.globalCategory)!;
      gNode.count++;
      if (p.featureCount < 4) {
        gNode.needFillCount++;
        if (p.featureCount === 0) gNode.missingCount++;
        else gNode.incompleteCount++;
      } else {
        gNode.filledCount++;
      }

      let subNode = gNode.subcategories.find((s) => s.subcategory === p.subcategory);
      if (!subNode) {
        subNode = {
          subcategory: p.subcategory,
          count: 0,
          needFillCount: 0,
          filledCount: 0,
          missingCount: 0,
          incompleteCount: 0,
          brands: [],
        };
        gNode.subcategories.push(subNode);
      }
      subNode.count++;
      if (p.featureCount < 4) {
        subNode.needFillCount++;
        if (p.featureCount === 0) subNode.missingCount++;
        else subNode.incompleteCount++;
      } else {
        subNode.filledCount++;
      }

      let brandNode = subNode.brands.find((b) => b.brand.toLowerCase() === p.brand.toLowerCase());
      if (!brandNode) {
        brandNode = {
          brand: p.brand,
          count: 0,
          needFillCount: 0,
          filledCount: 0,
          missingCount: 0,
          incompleteCount: 0,
          products: [],
        };
        subNode.brands.push(brandNode);
      }
      brandNode.count++;
      if (p.featureCount < 4) {
        brandNode.needFillCount++;
        if (p.featureCount === 0) brandNode.missingCount++;
        else brandNode.incompleteCount++;
      } else {
        brandNode.filledCount++;
      }

      brandNode.products.push(p);
    }

    // Sort tree
    const tree = Array.from(globalMap.values()).sort(
      (a, b) => getSectionPriority(a.globalCategory) - getSectionPriority(b.globalCategory)
    );

    tree.forEach((g) => {
      g.subcategories.sort((a, b) => b.count - a.count);
      g.subcategories.forEach((s) => {
        s.brands.sort((a, b) => b.count - a.count);
      });
    });

    return NextResponse.json({
      success: true,
      totalCatalogCount,
      needFillTotal,
      filledSpecsTotal,
      missingSpecsTotal,
      incompleteSpecsTotal,
      filteredCount: filtered.length,
      filter,
      tree,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Ошибка сервера';
    console.error('Error in GET /api/manager/specs:', err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Требуется авторизация менеджера' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { sku, features, description, schematicPdfUrl, operator } = body;

    if (!sku) {
      return NextResponse.json({ error: 'Не указан SKU товара' }, { status: 400 });
    }

    const prod = await prisma.product.findFirst({
      where: { sku: String(sku).trim() },
    });

    if (!prod) {
      return NextResponse.json({ error: `Товар с SKU ${sku} не найден` }, { status: 404 });
    }

    let oldFeats: Array<{ label: string; value: string }> = [];
    try {
      oldFeats = JSON.parse(prod.featuresJson || '[]');
    } catch {
      oldFeats = [];
    }

    const cleanFeatures: Array<{ label: string; value: string }> = (features || [])
      .filter((f: { label?: string; value?: string }) => f && f.label && f.value && f.value.trim() !== '')
      .map((f: { label: string; value: string }) => ({ label: f.label.trim(), value: f.value.trim() }));

    const { dimensions, color } = deriveDimensionsAndColorFromFeatures(cleanFeatures);

    const beforeSnapshot: SpecProductSnapshot = {
      sku: prod.sku,
      name: prod.name,
      brand: prod.brand,
      features: oldFeats,
      description: prod.description,
      schematicPdfUrl: prod.schematicPdfUrl,
      dimensions: prod.dimensions,
      color: prod.color,
    };

    const nextDesc = description !== undefined ? description : prod.description;
    const nextSchematic = schematicPdfUrl !== undefined ? schematicPdfUrl : prod.schematicPdfUrl;

    const afterSnapshot: SpecProductSnapshot = {
      sku: prod.sku,
      name: prod.name,
      brand: prod.brand,
      features: cleanFeatures,
      description: nextDesc,
      schematicPdfUrl: nextSchematic,
      dimensions,
      color,
    };

    // Update product in SQLite
    const updated = await prisma.product.update({
      where: { id: prod.id },
      data: {
        featuresJson: JSON.stringify(cleanFeatures),
        description: nextDesc,
        schematicPdfUrl: nextSchematic || null,
        dimensions: dimensions || null,
        color: color || null,
      },
    });

    // Record audit log
    const logEntry = await recordSpecAuditLog({
      actionType: 'MANUAL_EDIT',
      operator: operator || 'Менеджер СИМОНА',
      subcategory: resolveProductHierarchy(prod).subcategory,
      details: `Точечное редактирование характеристик товара ${prod.brand} ${prod.sku} (${cleanFeatures.length} свойств).`,
      affectedCount: 1,
      beforeSnapshots: [beforeSnapshot],
      afterSnapshots: [afterSnapshot],
    });

    // Background sync to master dump
    syncProductsToMasterDump([prod.sku]).catch((err) => {
      console.error('Error syncing single product to master dump:', err);
    });

    return NextResponse.json({
      success: true,
      product: updated,
      logId: logEntry.id,
      summaryMessage: `Характеристики товара ${prod.sku} успешно обновлены (${cleanFeatures.length} параметров)`,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Ошибка обновления характеристик';
    console.error('Error in POST /api/manager/specs:', err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

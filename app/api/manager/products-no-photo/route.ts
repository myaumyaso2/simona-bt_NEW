import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { prisma } from '@/lib/prisma';
import { isAuthorized } from '@/lib/adminAuth';
import { formatProductName } from '@/lib/catalog/productTitle';
import { resolveProductHierarchy, getSectionPriority } from '@/lib/catalog/categoryHierarchy';
import { processPhotoUploadBatch, parsePhotoFileName } from '@/lib/catalog/photoUploadService';

export const dynamic = 'force-dynamic';
export const maxDuration = 120; // 2 minutes for large image batch processing

export interface ProductNodeItem {
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
}

export interface BrandNode {
  brand: string;
  count: number;
  inStockCount: number;
  products: ProductNodeItem[];
}

export interface SubcategoryNode {
  subcategory: string;
  count: number;
  inStockCount: number;
  brands: BrandNode[];
}

export interface GlobalCategoryNode {
  globalCategory: string;
  count: number;
  inStockCount: number;
  subcategories: SubcategoryNode[];
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Требуется авторизация менеджера' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q')?.trim().toLowerCase() || '';
    const onlyInStock = searchParams.get('onlyInStock') === 'true';

    // All products without photos in database
    const rawProducts = await prisma.product.findMany({
      where: {
        OR: [{ imagesJson: '[]' }, { imagesJson: '' }],
      },
      orderBy: [
        { inStock: 'desc' },
        { stockKominterna: 'desc' },
        { updatedAt: 'desc' },
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
      },
    });

    const totalCount = rawProducts.length;
    let totalInStockCount = 0;

    // Enrich with canonical name and 4-tier hierarchy
    const enrichedItems: ProductNodeItem[] = rawProducts.map((p) => {
      const hier = resolveProductHierarchy(p);
      const canonicalName = formatProductName({
        name: p.name,
        brand: p.brand,
        category: p.category,
        sku: p.sku,
      });
      const totalStock = (p.stockKominterna || 0) + (p.stockBelinskogo15 || 0);
      const isStockAvailable = totalStock > 0 || p.inStock;

      if (isStockAvailable) {
        totalInStockCount++;
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
        inStock: isStockAvailable,
        isActive: p.isActive,
        globalCategory: hier.globalCategory,
        subcategory: hier.subcategory,
      };
    });

    // Apply filtering (search query and stock filter)
    let filtered = enrichedItems;
    if (onlyInStock) {
      filtered = filtered.filter((p) => p.inStock);
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

    // Build 4-level hierarchical tree:
    // GlobalCategory -> Subcategory -> Brand -> Products
    const globalMap = new Map<string, Map<string, Map<string, ProductNodeItem[]>>>();

    for (const item of filtered) {
      let subMap = globalMap.get(item.globalCategory);
      if (!subMap) {
        subMap = new Map();
        globalMap.set(item.globalCategory, subMap);
      }

      let brandMap = subMap.get(item.subcategory);
      if (!brandMap) {
        brandMap = new Map();
        subMap.set(item.subcategory, brandMap);
      }

      let brandProducts = brandMap.get(item.brand);
      if (!brandProducts) {
        brandProducts = [];
        brandMap.set(item.brand, brandProducts);
      }

      brandProducts.push(item);
    }

    const tree: GlobalCategoryNode[] = Array.from(globalMap.entries())
      .map(([globalCategory, subMap]) => {
        const subcategories: SubcategoryNode[] = Array.from(subMap.entries())
          .map(([subcategory, brandMap]) => {
            const brands: BrandNode[] = Array.from(brandMap.entries())
              .map(([brand, products]) => {
                const inStockCount = products.filter((p) => p.inStock).length;
                return {
                  brand,
                  count: products.length,
                  inStockCount,
                  products: products.sort((a, b) => a.name.localeCompare(b.name, 'ru')),
                };
              })
              .sort((a, b) => a.brand.localeCompare(b.brand, 'ru'));

            const subCount = brands.reduce((sum, b) => sum + b.count, 0);
            const subInStock = brands.reduce((sum, b) => sum + b.inStockCount, 0);

            return {
              subcategory,
              count: subCount,
              inStockCount: subInStock,
              brands,
            };
          })
          .sort((a, b) => a.subcategory.localeCompare(b.subcategory, 'ru'));

        const globalCount = subcategories.reduce((sum, s) => sum + s.count, 0);
        const globalInStock = subcategories.reduce((sum, s) => sum + s.inStockCount, 0);

        return {
          globalCategory,
          count: globalCount,
          inStockCount: globalInStock,
          subcategories,
        };
      })
      .sort((a, b) => getSectionPriority(a.globalCategory) - getSectionPriority(b.globalCategory));

    return NextResponse.json({
      success: true,
      totalCount,
      totalInStockCount,
      filteredCount: filtered.length,
      tree,
      products: filtered,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Ошибка загрузки структуры товаров без картинок';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * POST /api/manager/products-no-photo
 * Handles both single-file and batch drag-and-drop file uploads.
 * Converts to WebP via Sharp and activates product if price > 0.
 */
export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Требуется авторизация менеджера' }, { status: 401 });
  }

  try {
    const formData = await req.formData();

    // 1. Collect all uploaded files (supports "files" array or single "file")
    const rawFiles: File[] = [];
    const allFileEntries = formData.getAll('files');
    if (allFileEntries.length > 0) {
      for (const entry of allFileEntries) {
        if (entry instanceof File) rawFiles.push(entry);
      }
    }

    const singleFile = formData.get('file');
    if (singleFile instanceof File && !rawFiles.includes(singleFile)) {
      rawFiles.push(singleFile);
    }

    // Support manual SKU override if single file is provided with explicit "sku" field
    const explicitSku = (formData.get('sku') as string | null)?.trim();

    if (rawFiles.length === 0) {
      return NextResponse.json({ error: 'Файлы изображений не переданы' }, { status: 400 });
    }

    // Prepare files with buffers
    const filesToProcess: Array<{ name: string; buffer: Buffer }> = [];
    for (const file of rawFiles) {
      let fileName = file.name;
      // If single file uploaded with explicit SKU form field, rename to `${explicitSku}.jpg`
      if (rawFiles.length === 1 && explicitSku) {
        const ext = path.extname(file.name) || '.jpg';
        const parsed = parsePhotoFileName(file.name);
        const slot = parsed.slotIndex && parsed.slotIndex > 1 ? `_${parsed.slotIndex}` : '';
        fileName = `${explicitSku}${slot}${ext}`;
      }

      const arrayBuffer = await file.arrayBuffer();
      filesToProcess.push({
        name: fileName,
        buffer: Buffer.from(arrayBuffer),
      });
    }

    // Process batch through unified service
    const result = await processPhotoUploadBatch(filesToProcess);

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Ошибка обработки загрузки фотографий';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

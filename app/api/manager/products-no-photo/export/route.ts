import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { isAuthorized } from '@/lib/adminAuth';
import { generateNoPhotoProductsWorkbook } from '@/lib/catalog/excelExportService';
import { resolveProductHierarchy } from '@/lib/catalog/categoryHierarchy';
import { formatProductName } from '@/lib/catalog/productTitle';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Требуется авторизация менеджера' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const onlyInStock = searchParams.get('onlyInStock') === 'true';
    const query = searchParams.get('q')?.trim().toLowerCase() || '';

    // Базовый фильтр: только актуальные товары, которые реально активируются при загрузке фото
    const andConditions: Prisma.ProductWhereInput[] = [
      // 1. Без картинок
      {
        OR: [{ imagesJson: '[]' }, { imagesJson: '' }],
      },
      // 2. Действующая розничная цена (price > 0 и не флаг noPrice)
      {
        price: { gt: 0 },
        noPrice: false,
      },
      // 3. Исключить архивную уценку с нулевым остатком (гасится 1С, на витрине не открывается)
      {
        NOT: {
          AND: [
            { isDiscount: true },
            { stockKominterna: { lte: 0 } },
            { stockBelinskogo15: { lte: 0 } },
          ],
        },
      },
    ];

    // Фильтр по физическому наличию (если выбран таб "Только в наличии на складе")
    if (onlyInStock) {
      andConditions.push({
        OR: [
          { stockKominterna: { gt: 0 } },
          { stockBelinskogo15: { gt: 0 } },
          { inStock: true },
        ],
      });
    }

    const products = await prisma.product.findMany({
      where: { AND: andConditions },
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

    // Фильтрация по поисковой строке (если менеджер фильтрует по бренду, модели или категории)
    let exportProducts = products;
    if (query) {
      exportProducts = products.filter((p) => {
        const hier = resolveProductHierarchy(p);
        const canonicalName = formatProductName({
          name: p.name,
          brand: p.brand,
          category: p.category,
          sku: p.sku,
        });
        return (
          p.sku.toLowerCase().includes(query) ||
          p.name.toLowerCase().includes(query) ||
          canonicalName.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          hier.subcategory.toLowerCase().includes(query) ||
          hier.globalCategory.toLowerCase().includes(query)
        );
      });
    }

    const buffer = await generateNoPhotoProductsWorkbook(exportProducts);

    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10);
    const filename = `simona_products_without_photos_${dateStr}.xlsx`;

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Ошибка формирования Excel файла';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

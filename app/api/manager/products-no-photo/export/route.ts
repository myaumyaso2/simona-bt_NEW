import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAuthorized } from '@/lib/adminAuth';
import { generateNoPhotoProductsWorkbook } from '@/lib/catalog/excelExportService';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Требуется авторизация менеджера' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const onlyInStock = searchParams.get('onlyInStock') === 'true';

    const where: Record<string, unknown> = {
      OR: [{ imagesJson: '[]' }, { imagesJson: '' }],
    };

    if (onlyInStock) {
      where.OR = [
        { stockKominterna: { gt: 0 } },
        { stockBelinskogo15: { gt: 0 } },
        { inStock: true },
      ];
      where.AND = [{ OR: [{ imagesJson: '[]' }, { imagesJson: '' }] }];
    }

    const products = await prisma.product.findMany({
      where,
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

    const buffer = await generateNoPhotoProductsWorkbook(products);

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

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';
import { isAuthorized } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Требуется авторизация менеджера' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q')?.trim() || '';

    const where: Record<string, unknown> = {
      OR: [{ imagesJson: '[]' }, { imagesJson: '' }],
    };

    if (query) {
      where.AND = [
        {
          OR: [
            { sku: { contains: query } },
            { name: { contains: query } },
            { brand: { contains: query } },
          ],
        },
      ];
    }

    const [products, totalNoPhoto] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: [{ inStock: 'desc' }, { updatedAt: 'desc' }],
        take: 150,
      }),
      prisma.product.count({
        where: {
          OR: [{ imagesJson: '[]' }, { imagesJson: '' }],
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      products,
      totalNoPhoto,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Ошибка загрузки списка новинок без фото';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * POST /api/manager/products-no-photo
 * Загрузка фотографии для товара (сохраняет в public/images/cms/data/photo_code/{sku}.jpg,
 * обновляет imagesJson и активирует товар isActive = true на витрине).
 */
export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Требуется авторизация менеджера' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const sku = (formData.get('sku') as string | null)?.trim();
    const productId = (formData.get('productId') as string | null)?.trim();
    const file = formData.get('file') as File | null;

    if (!sku && !productId) {
      return NextResponse.json({ error: 'Укажите код 1С (sku) или ID товара' }, { status: 400 });
    }

    if (!file) {
      return NextResponse.json({ error: 'Файл изображения не передан' }, { status: 400 });
    }

    const product = await prisma.product.findFirst({
      where: productId ? { id: productId } : { sku: sku! },
    });

    if (!product) {
      return NextResponse.json({ error: `Товар с кодом ${sku || productId} не найден` }, { status: 404 });
    }

    const targetSku = product.sku || sku!;
    const photoDir = path.join(process.cwd(), 'public', 'images', 'cms', 'data', 'photo_code');
    if (!fs.existsSync(photoDir)) {
      fs.mkdirSync(photoDir, { recursive: true });
    }

    const fileName = `${targetSku}.jpg`;
    const filePath = path.join(photoDir, fileName);
    const arrayBuffer = await file.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(arrayBuffer));

    const publicImageUrl = `/images/cms/data/photo_code/${fileName}`;

    // Сохраняем URL в imagesJson и активируем карточку на витрине (если у товара есть розничная цена > 0)
    const nextImages = [publicImageUrl];
    const shouldActivate = product.price > 0 && !product.noPrice;

    const updated = await prisma.product.update({
      where: { id: product.id },
      data: {
        imagesJson: JSON.stringify(nextImages),
        isActive: shouldActivate,
      },
    });

    return NextResponse.json({
      success: true,
      imageUrl: publicImageUrl,
      product: updated,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Ошибка сохранения фотографии';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

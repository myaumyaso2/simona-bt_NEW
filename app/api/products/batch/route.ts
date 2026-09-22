import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { formatPrismaProduct } from '@/lib/products';
import { CATALOG_PRODUCTS } from '@/data/catalogData';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const ids: string[] = Array.isArray(body?.ids) ? body.ids : [];

    if (ids.length === 0) {
      return NextResponse.json({ success: true, products: [] });
    }

    const dbProducts = await prisma.product.findMany({
      where: {
        id: { in: ids },
      },
    });

    const formatted = dbProducts.map(formatPrismaProduct);

    // If some ids not in DB, fallback check in static CATALOG_PRODUCTS
    const foundIds = new Set(formatted.map((p) => p.id));
    for (const id of ids) {
      if (!foundIds.has(id)) {
        const staticItem = CATALOG_PRODUCTS.find((p) => p.id === id);
        if (staticItem) {
          formatted.push(staticItem);
        }
      }
    }

    return NextResponse.json({ success: true, products: formatted });
  } catch (err: any) {
    console.error('Error fetching batch products:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

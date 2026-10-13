import { NextRequest, NextResponse } from 'next/server';
import { getCatalogProducts, searchCatalogProducts } from '@/lib/products';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q')?.trim() || '';
  const limitParam = Number(searchParams.get('limit')) || 24;

  if (!query) {
    const { products, total } = await getCatalogProducts({
      limit: 8,
      orderBy: 'popular',
    });
    return NextResponse.json({
      results: products,
      count: products.length,
      totalCount: total,
      query: '',
    });
  }

  const { products, total } = await searchCatalogProducts(query, limitParam);

  return NextResponse.json({
    results: products,
    count: products.length,
    totalCount: total,
    query,
  });
}

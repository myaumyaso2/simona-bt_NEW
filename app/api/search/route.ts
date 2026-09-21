import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CATALOG_PRODUCTS } from '@/data/catalogData';

const SYNONYMS: Record<string, string> = {
  'миле': 'Miele',
  'милле': 'Miele',
  'miele': 'Miele',
  'аско': 'ASKO',
  'asko': 'ASKO',
  'смег': 'SMEG',
  'smeg': 'SMEG',
  'либхер': 'Liebherr',
  'либхерр': 'Liebherr',
  'liebherr': 'Liebherr',
  'омойкири': 'OMOIKIRI',
  'омоикири': 'OMOIKIRI',
  'omoikiri': 'OMOIKIRI',
  'бертаззони': 'Bertazzoni',
  'бертазони': 'Bertazzoni',
  'bertazzoni': 'Bertazzoni',
  'фальмек': 'Falmec',
  'фалмек': 'Falmec',
  'falmec': 'Falmec',
  'кертинг': 'KÖRTING',
  'кортинг': 'KÖRTING',
  'korting': 'KÖRTING',
};

// Availability priority: SHOWROOM / EXHIBITION / ACTIVE_KITCHEN (1) -> LOCAL_STOCK (2) -> REMOTE_STOCK (3) -> ON_ORDER (4)
const priorityMap: Record<string, number> = {
  ACTIVE_KITCHEN: 1,
  EXHIBITION_15: 1,
  EXHIBITION_11: 1,
  SHOWROOM: 1,
  LOCAL_STOCK: 2,
  REMOTE_STOCK: 3,
  ON_ORDER: 4,
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q')?.trim() || '';

  if (!query) {
    try {
      const defaultProducts = await prisma.product.findMany({
        take: 8,
        orderBy: { isFeatured: 'desc' },
      });
      if (defaultProducts.length > 0) {
        return NextResponse.json({ results: defaultProducts });
      }
    } catch {
      // fallback
    }
    return NextResponse.json({ results: CATALOG_PRODUCTS.slice(0, 8) });
  }

  const lowerQuery = query.toLowerCase();
  let resolvedBrand = '';
  for (const [key, val] of Object.entries(SYNONYMS)) {
    if (lowerQuery.includes(key)) {
      resolvedBrand = val;
      break;
    }
  }

  let results: any[] = [];
  try {
    results = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { sku: { contains: query } },
          { category: { contains: query } },
          { brand: { contains: resolvedBrand || query } },
          { description: { contains: query } },
        ],
      },
      take: 20,
    });
  } catch {
    results = [];
  }

  // Fallback to CATALOG_PRODUCTS in-memory search if DB returned 0
  if (results.length === 0) {
    results = CATALOG_PRODUCTS.filter((p) => {
      const targetBrand = resolvedBrand.toLowerCase();
      const pBrand = p.brand.toLowerCase();
      const pName = p.name.toLowerCase();
      const pSku = p.sku.toLowerCase();
      const pCat = p.category.toLowerCase();
      return (
        pName.includes(lowerQuery) ||
        pSku.includes(lowerQuery) ||
        pCat.includes(lowerQuery) ||
        pBrand.includes(lowerQuery) ||
        (targetBrand && pBrand.includes(targetBrand))
      );
    });
  }

  const sorted = [...results].sort((a, b) => {
    const pA = priorityMap[a.physicalStatus] || 5;
    const pB = priorityMap[b.physicalStatus] || 5;
    return pA - pB;
  });

  return NextResponse.json({
    results: sorted,
    count: sorted.length,
    query,
  });
}

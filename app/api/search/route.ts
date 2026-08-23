import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q')?.trim() || '';

  if (!query) {
    const defaultProducts = await prisma.product.findMany({
      take: 8,
      orderBy: { isFeatured: 'desc' },
    });
    return NextResponse.json({ results: defaultProducts });
  }

  const lowerQuery = query.toLowerCase();
  let resolvedBrand = '';
  for (const [key, val] of Object.entries(SYNONYMS)) {
    if (lowerQuery.includes(key)) {
      resolvedBrand = val;
      break;
    }
  }

  // Search in database
  const products = await prisma.product.findMany({
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

  // O2O Priority Sorting: Active Kitchen -> Exhibition 15 -> Exhibition 11 -> On Order
  const priorityMap: Record<string, number> = {
    ACTIVE_KITCHEN: 1,
    EXHIBITION_15: 2,
    EXHIBITION_11: 3,
    ON_ORDER: 4,
  };

  const sorted = [...products].sort((a, b) => {
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

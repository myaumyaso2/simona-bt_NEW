import { NextRequest, NextResponse } from 'next/server';
import { isAuthorized } from '@/lib/adminAuth';
import { generateSubcategorySpecWorkbook } from '@/lib/catalog/specExcelService';

export const dynamic = 'force-dynamic';

function transliterate(text: string): string {
  const ru: Record<string, string> = {
    а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'zh',
    з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o',
    п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts',
    ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
  };
  return text
    .toLowerCase()
    .split('')
    .map((char) => ru[char] || char)
    .join('')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Требуется авторизация менеджера' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const subcategory = searchParams.get('subcategory')?.trim();
    const brand = searchParams.get('brand')?.trim();
    const filter = (searchParams.get('filter') || 'all') as 'all' | 'missing' | 'incomplete';

    if (!subcategory) {
      return NextResponse.json({ error: 'Параметр subcategory обязателен' }, { status: 400 });
    }

    const buffer = await generateSubcategorySpecWorkbook(subcategory, {
      brand: brand || undefined,
      filter,
    });

    const dateStr = new Date().toISOString().slice(0, 10);
    const translitSub = transliterate(subcategory);
    const filename = `simona_specs_${translitSub}_${dateStr}.xlsx`;

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Ошибка формирования Excel-шаблона';
    console.error('Error in GET /api/manager/specs/export:', err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

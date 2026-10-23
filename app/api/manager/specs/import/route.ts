import { NextRequest, NextResponse } from 'next/server';
import { isAuthorized } from '@/lib/adminAuth';
import { parseSubcategorySpecWorkbook } from '@/lib/catalog/specExcelService';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Требуется авторизация менеджера' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const subcategory = formData.get('subcategory') as string | null;
    const dryRun = formData.get('dryRun') === 'true';
    const operator = (formData.get('operator') as string | null) || 'Менеджер СИМОНА';

    if (!file) {
      return NextResponse.json({ error: 'Файл Excel (.xlsx) не прикреплен' }, { status: 400 });
    }

    if (!subcategory) {
      return NextResponse.json({ error: 'Не указана подкатегория' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await parseSubcategorySpecWorkbook(buffer, subcategory, {
      dryRun,
      operator,
    });

    return NextResponse.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Ошибка импорта Excel-файла';
    console.error('Error in POST /api/manager/specs/import:', err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

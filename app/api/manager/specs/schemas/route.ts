import { NextRequest, NextResponse } from 'next/server';
import { isAuthorized } from '@/lib/adminAuth';
import { getCategorySpecSchema, CATEGORY_SPEC_SCHEMAS } from '@/data/categorySpecSchemas';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Требуется авторизация менеджера' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const subcategory = searchParams.get('subcategory')?.trim();

  if (subcategory) {
    const schema = getCategorySpecSchema(subcategory);
    return NextResponse.json({ success: true, schema });
  }

  return NextResponse.json({
    success: true,
    subcategories: Object.keys(CATEGORY_SPEC_SCHEMAS),
  });
}

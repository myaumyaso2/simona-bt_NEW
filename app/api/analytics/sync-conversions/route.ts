import { NextRequest, NextResponse } from 'next/server';
import { isAuthorized } from '@/lib/adminAuth';
import { uploadOfflineConversionsToMetrika } from '@/lib/integrations/metrika/offlineConversions';

export const dynamic = 'force-dynamic';

/**
 * POST /api/analytics/sync-conversions
 * Запуск отправки закрытых сделок (PAID, DELIVERED) в счетчик Яндекс Метрики
 */
export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await uploadOfflineConversionsToMetrika();
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('Offline conversion upload error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

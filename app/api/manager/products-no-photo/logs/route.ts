import { NextRequest, NextResponse } from 'next/server';
import { isAuthorized } from '@/lib/adminAuth';
import { getPhotoUploadLogs } from '@/lib/catalog/photoUploadService';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Требуется авторизация менеджера' }, { status: 401 });
  }

  try {
    const logs = getPhotoUploadLogs();
    return NextResponse.json({
      success: true,
      logs,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Ошибка загрузки журнала';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

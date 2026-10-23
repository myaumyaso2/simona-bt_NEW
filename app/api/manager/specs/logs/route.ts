import { NextRequest, NextResponse } from 'next/server';
import { isAuthorized } from '@/lib/adminAuth';
import { getSpecAuditLogs, rollbackSpecAuditLog } from '@/lib/catalog/specAuditService';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Требуется авторизация менеджера' }, { status: 401 });
  }

  try {
    const logs = await getSpecAuditLogs();
    return NextResponse.json({ success: true, logs });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Ошибка чтения журнала';
    console.error('Error in GET /api/manager/specs/logs:', err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Требуется авторизация менеджера' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { logId } = body;

    if (!logId) {
      return NextResponse.json({ error: 'Не передан ID записи журнала (logId)' }, { status: 400 });
    }

    const res = await rollbackSpecAuditLog(logId);
    if (!res.success) {
      return NextResponse.json({ error: res.error || 'Ошибка отката' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      restoredCount: res.restoredCount,
      summaryMessage: `Операция успешно откатана. Восстановлены исходные характеристики для ${res.restoredCount} товаров.`,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Ошибка отката операции';
    console.error('Error in POST /api/manager/specs/logs:', err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { isAuthorized } from '@/lib/adminAuth';
import { getSyncSessionDetails } from '@/lib/sync/oneCSyncService';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('sessionId') || 'latest';
  const type = searchParams.get('type') || 'ALL';
  const query = (searchParams.get('q') || '').trim().toLowerCase();

  const sessionDetails = getSyncSessionDetails(sessionId);
  if (!sessionDetails) {
    return new NextResponse('Сессия синхронизации не найдена', { status: 404 });
  }

  let filtered = sessionDetails.changes || [];
  if (type !== 'ALL') {
    filtered = filtered.filter((c) => c.changeType === type);
  }
  if (query) {
    filtered = filtered.filter(
      (c) =>
        c.sku.toLowerCase().includes(query) ||
        (c.name && c.name.toLowerCase().includes(query)) ||
        (c.brand && c.brand.toLowerCase().includes(query)) ||
        (c.category && c.category.toLowerCase().includes(query))
    );
  }

  // Windows Excel friendly CSV: UTF-8 BOM (\uFEFF) + semicolon delimiter
  const headers = [
    'Код 1С',
    'Наименование',
    'Бренд',
    'Категория',
    'Тип изменения',
    'Было',
    'Стало',
    'Детали',
  ];

  const changeTypeLabels: Record<string, string> = {
    PRICE: 'Изменение цены',
    STOCK: 'Изменение остатка',
    BADGE: 'Ярлык / Акция',
    CREATED: 'Новый товар',
    DEACTIVATED: 'Снят с витрины',
    INHERITED_PHOTO: 'Унаследовано фото',
  };

  const rows = filtered.map((c) => [
    `"${c.sku}"`,
    `"${(c.name || '').replace(/"/g, '""')}"`,
    `"${(c.brand || '').replace(/"/g, '""')}"`,
    `"${(c.category || '').replace(/"/g, '""')}"`,
    `"${changeTypeLabels[c.changeType] || c.changeType}"`,
    `"${c.oldValue !== undefined && c.oldValue !== null ? String(c.oldValue).replace(/"/g, '""') : '-'}"`,
    `"${c.newValue !== undefined && c.newValue !== null ? String(c.newValue).replace(/"/g, '""') : '-'}"`,
    `"${(c.detail || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\r\n');

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="simona_1c_sync_${sessionDetails.id}.csv"`,
    },
  });
}

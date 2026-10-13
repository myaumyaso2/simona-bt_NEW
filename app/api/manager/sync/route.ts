import { NextRequest, NextResponse } from 'next/server';
import { isAuthorized } from '@/lib/adminAuth';
import { getSyncSessionsList, getSyncSessionDetails } from '@/lib/sync/oneCSyncService';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('sessionId') || 'latest';
  const type = searchParams.get('type') || 'ALL';
  const query = (searchParams.get('q') || '').trim().toLowerCase();
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
  const limit = Math.min(200, Math.max(10, parseInt(searchParams.get('limit') || '50', 10) || 50));

  const sessions = getSyncSessionsList();
  const sessionDetails = getSyncSessionDetails(sessionId);

  if (!sessionDetails) {
    return NextResponse.json({
      sessions,
      currentSession: null,
      error: 'Session not found',
    });
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
        (c.category && c.category.toLowerCase().includes(query)) ||
        (c.detail && c.detail.toLowerCase().includes(query))
    );
  }

  const totalFiltered = filtered.length;
  const totalPages = Math.ceil(totalFiltered / limit) || 1;
  const startIndex = (page - 1) * limit;
  const paginatedChanges = filtered.slice(startIndex, startIndex + limit);

  return NextResponse.json({
    sessions,
    currentSession: {
      id: sessionDetails.id,
      startedAt: sessionDetails.startedAt,
      finishedAt: sessionDetails.finishedAt,
      durationMs: sessionDetails.durationMs,
      fileName: sessionDetails.fileName,
      totalRows: sessionDetails.totalRows,
      stats: sessionDetails.stats,
      page,
      limit,
      totalPages,
      totalFiltered,
      changes: paginatedChanges,
    },
  });
}

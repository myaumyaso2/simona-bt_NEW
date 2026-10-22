import { NextRequest, NextResponse } from 'next/server';
import { uploadOfflineConversionsToMetrika } from '@/lib/integrations/metrika/offlineConversions';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const CRON_SECRET = process.env.CRON_SECRET || 'simona_cron_secret_2026';

function isCronAuthorized(req: NextRequest): boolean {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) {
    const urlKey = req.nextUrl.searchParams.get('key');
    return urlKey === CRON_SECRET;
  }
  const [scheme, token] = authHeader.split(' ');
  return scheme?.toLowerCase() === 'bearer' && token?.trim() === CRON_SECRET.trim();
}

/**
 * GET/POST /api/cron/offline-conversions
 * Защищенный эндпоинт для ночной передачи офлайн-конверсий в Яндекс Метрику (счетчик 1351807).
 * Запускается crontab сервера в 03:00 ночи.
 */
export async function GET(req: NextRequest) {
  return handleUpload(req);
}

export async function POST(req: NextRequest) {
  return handleUpload(req);
}

async function handleUpload(req: NextRequest) {
  if (!isCronAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized CRON request' }, { status: 401 });
  }

  try {
    const result = await uploadOfflineConversionsToMetrika();
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      ...result,
    });
  } catch (err: any) {
    console.error('Error during offline conversions upload:', err);
    return NextResponse.json(
      {
        success: false,
        timestamp: new Date().toISOString(),
        error: err.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const LOG_FILE_PATH = path.join(process.cwd(), 'data', '404_missing_urls.jsonl');

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, referer } = body || {};

    if (!url) {
      return NextResponse.json({ ok: false, error: 'URL required' }, { status: 400 });
    }

    const userAgent = req.headers.get('user-agent') || 'unknown';
    const entry = {
      timestamp: new Date().toISOString(),
      url: String(url).slice(0, 500),
      referer: referer ? String(referer).slice(0, 500) : req.headers.get('referer') || null,
      userAgent: userAgent.slice(0, 200),
      ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
    };

    // Append to jsonl log file asynchronously
    fs.appendFile(LOG_FILE_PATH, JSON.stringify(entry) + '\n', (err) => {
      if (err) console.error('Failed to append to 404 log:', err);
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

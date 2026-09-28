import { NextResponse } from 'next/server';
import { getSiteContent } from '@/lib/content';

export const dynamic = 'force-dynamic';

export async function GET() {
  const content = getSiteContent();
  return NextResponse.json(content, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}

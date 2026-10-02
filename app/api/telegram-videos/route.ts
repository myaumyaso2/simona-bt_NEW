import { NextResponse } from 'next/server';
import { getTelegramVideos } from '@/lib/telegram';

export const revalidate = 1800; // 30 minutes ISR cache

export async function GET() {
  const videos = getTelegramVideos();
  return NextResponse.json(videos, {
    headers: {
      'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=86400',
    },
  });
}

import { buildYandexMarketXmlResponse } from '@/lib/feeds/yandexMarketFeed';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export async function GET() {
  return buildYandexMarketXmlResponse();
}

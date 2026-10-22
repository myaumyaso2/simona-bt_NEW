import { MetadataRoute } from 'next';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

export default function robots(): MetadataRoute.Robots {
  const headersList = headers();
  const host = (headersList.get('host') || '').toLowerCase();

  // 1. Technical / staging / archive subdomains: strict Disallow all
  if (
    host.includes('new.simona-bt.ru') ||
    host.includes('old.simona-bt.ru') ||
    host.includes('dev.simona-bt.ru') ||
    host.includes('localhost')
  ) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    };
  }

  // 2. Production domain (simona-bt.ru / www.simona-bt.ru)
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/manager/',
        '/profile/',
        '/checkout/',
        '/api/',
        '/admin/',
      ],
    },
    sitemap: [
      'https://www.simona-bt.ru/sitemap.xml',
      'https://www.simona-bt.ru/sitemap-images.xml',
    ],
    host: 'https://www.simona-bt.ru',
  };
}

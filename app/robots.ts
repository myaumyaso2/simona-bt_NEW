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

  // Common protected system / utility paths to disallow for all crawlers
  const privateDisallows = [
    '/manager',
    '/profile',
    '/checkout',
    '/compare',
    '/analytics',
    '/api/',
    '/admin',
    '/emarket/',
    '/udata/',
    '/upage/',
    '/users/',
  ];

  // 2. Production domain (simona-bt.ru / www.simona-bt.ru)
  return {
    rules: [
      // Specialized Generative AI search crawlers (Gemini, Alice, ChatGPT, Claude, Perplexity)
      {
        userAgent: [
          'YandexAdditional',
          'Google-Extended',
          'GPTBot',
          'OAI-SearchBot',
          'ClaudeBot',
          'PerplexityBot',
          'Applebot-Extended',
        ],
        allow: [
          '/',
          '/catalog',
          '/brands',
          '/promos',
          '/feeds/',
          '/api/feeds/',
          '/api/og',
        ],
        disallow: privateDisallows,
      },
      // General search engines (YandexBot, Googlebot, Bingbot, etc.)
      {
        userAgent: '*',
        allow: [
          '/',
          '/feeds/',
          '/api/feeds/',
          '/api/og',
        ],
        disallow: privateDisallows,
      },
    ],
    sitemap: [
      'https://www.simona-bt.ru/sitemap.xml',
      'https://www.simona-bt.ru/sitemap-images.xml',
    ],
    host: 'https://www.simona-bt.ru',
  };
}

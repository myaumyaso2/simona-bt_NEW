import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import redirectsMap from '@/data/redirects.json';

const redirects: Record<string, string> = redirectsMap;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/shop/')) {
    // 1. Direct match with exact path
    let target = redirects[pathname];

    // 2. Fallback with trailing slash
    if (!target && !pathname.endsWith('/')) {
      target = redirects[pathname + '/'];
    }

    // 3. Fallback without trailing slash
    if (!target && pathname.endsWith('/')) {
      target = redirects[pathname.slice(0, -1)];
    }

    if (target) {
      return NextResponse.redirect(new URL(target, request.url), 301);
    }

    // 4. Default fallback for old discontinued shop categories -> /catalog
    return NextResponse.redirect(new URL('/catalog', request.url), 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/shop/:path*'],
};

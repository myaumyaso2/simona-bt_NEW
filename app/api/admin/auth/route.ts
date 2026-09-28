import { NextRequest, NextResponse } from 'next/server';
import {
  verifyPassword,
  getAuthToken,
  getAuthCookieName,
  isAuthorized,
} from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const authorized = isAuthorized(req);
  return NextResponse.json({ authenticated: authorized });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body.action || 'login';

    if (action === 'logout') {
      const response = NextResponse.json({ success: true, authenticated: false });
      response.cookies.set({
        name: getAuthCookieName(),
        value: '',
        path: '/',
        maxAge: 0,
        httpOnly: true,
        sameSite: 'lax',
      });
      return response;
    }

    if (action === 'check') {
      const authorized = isAuthorized(req);
      return NextResponse.json({ authenticated: authorized });
    }

    // Default action: login
    const password = body.password || '';
    if (!verifyPassword(password)) {
      return NextResponse.json(
        { success: false, error: 'Неверный пароль администратора' },
        { status: 401 }
      );
    }

    const token = getAuthToken();
    const response = NextResponse.json({ success: true, authenticated: true });

    // Store auth token in HTTP-only cookie for 30 days
    response.cookies.set({
      name: getAuthCookieName(),
      value: token,
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Ошибка сервера' },
      { status: 500 }
    );
  }
}

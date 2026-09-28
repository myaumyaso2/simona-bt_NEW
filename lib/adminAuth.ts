import crypto from 'crypto';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Vzevzcj2';
const AUTH_COOKIE_NAME = 'simona_admin_auth';

// Deterministic token based on the admin password and secret
function generateExpectedToken(): string {
  const secret = process.env.AUTH_SECRET || 'simona-luxury-cms-secret-salt-2026';
  return crypto.createHmac('sha256', secret).update(ADMIN_PASSWORD).digest('hex');
}

export function verifyPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

export function getAuthToken(): string {
  return generateExpectedToken();
}

export function getAuthCookieName(): string {
  return AUTH_COOKIE_NAME;
}

export function isAuthorized(req: Request): boolean {
  const cookieHeader = req.headers.get('cookie') || '';
  const cookies = parseCookies(cookieHeader);
  const token = cookies[AUTH_COOKIE_NAME];
  if (!token) return false;
  return token === generateExpectedToken();
}

function parseCookies(header: string): Record<string, string> {
  const list: Record<string, string> = {};
  if (!header) return list;

  header.split(';').forEach((cookie) => {
    const parts = cookie.split('=');
    if (parts.length >= 2) {
      const name = parts[0].trim();
      const val = parts.slice(1).join('=').trim();
      list[name] = decodeURIComponent(val);
    }
  });

  return list;
}

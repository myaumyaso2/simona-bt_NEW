import crypto from 'crypto';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export const CUSTOMER_COOKIE_NAME = 'simona_customer_token';
export const UMI_HASH_SALT =
  'o95j43hiwjrthpoiwj45ihwpriobneop;jfgp3408ghqpqh5gpqoi4hgp9q85h';

const AUTH_SECRET =
  process.env.CUSTOMER_AUTH_SECRET ||
  process.env.MANAGER_SESSION_SECRET ||
  'simona-customer-jwt-secret-2026-nn';

export interface CustomerSessionPayload {
  customerId: string;
  phone: string;
  email?: string | null;
  role: string;
  exp: number;
}

/**
 * Современное хеширование пароля через криптостойкий KDF scrypt (встроен в Node.js crypto)
 */
export function hashPassword(plainPassword: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(plainPassword, salt, 64).toString('hex');
  return `$scrypt$${salt}$${derivedKey}`;
}

/**
 * Проверка современного хеша пароля
 */
export function verifyModernPassword(plainPassword: string, storedHash: string): boolean {
  if (!storedHash || !storedHash.startsWith('$scrypt$')) return false;
  const parts = storedHash.split('$');
  // ['', 'scrypt', salt, derivedKey]
  if (parts.length !== 4) return false;
  const [, , salt, keyHex] = parts;
  if (!salt || !keyHex) return false;
  try {
    const keyBuf = Buffer.from(keyHex, 'hex');
    const derivedBuf = crypto.scryptSync(plainPassword, salt, 64);
    if (keyBuf.length !== derivedBuf.length) return false;
    return crypto.timingSafeEqual(keyBuf, derivedBuf);
  } catch {
    return false;
  }
}

/**
 * Создание legacy-хеша по алгоритму UMI.CMS (для тестирования и совместимости)
 */
export function createLegacyUmiHash(
  plainPassword: string,
  algorithm: 'sha256_salted' | 'md5' = 'sha256_salted'
): string {
  if (algorithm === 'md5') {
    return crypto.createHash('md5').update(plainPassword, 'utf8').digest('hex');
  }
  return crypto
    .createHash('sha256')
    .update(plainPassword + UMI_HASH_SALT, 'utf8')
    .digest('hex');
}

/**
 * Проверка legacy-хеша UMI.CMS (MD5 / SHA-256 с солью UMI iAlgorithm::HASH_SALT / SHA-256 без соли / SHA-1)
 */
export function verifyLegacyUmiPassword(plainPassword: string, legacyHash: string): boolean {
  const cleanHash = (legacyHash || '').trim().toLowerCase();
  if (!cleanHash) return false;

  const md5Plain = crypto.createHash('md5').update(plainPassword, 'utf8').digest('hex');
  const md5Salted = crypto
    .createHash('md5')
    .update(plainPassword + UMI_HASH_SALT, 'utf8')
    .digest('hex');
  const sha256Salted = crypto
    .createHash('sha256')
    .update(plainPassword + UMI_HASH_SALT, 'utf8')
    .digest('hex');
  const sha256Plain = crypto.createHash('sha256').update(plainPassword, 'utf8').digest('hex');
  const sha1Plain = crypto.createHash('sha1').update(plainPassword, 'utf8').digest('hex');

  // В UMI.CMS также встречался вариант sha256(md5(password) + salt) при миграциях старых версий
  const sha256FromMd5Salted = crypto
    .createHash('sha256')
    .update(md5Plain + UMI_HASH_SALT, 'utf8')
    .digest('hex');

  return (
    cleanHash === sha256Salted ||
    cleanHash === md5Plain ||
    cleanHash === md5Salted ||
    cleanHash === sha256Plain ||
    cleanHash === sha1Plain ||
    cleanHash === sha256FromMd5Salted
  );
}

/**
 * Подпись сессионного токена покупателя (HMAC-SHA256, 30 дней)
 */
export function signCustomerToken(payload: Omit<CustomerSessionPayload, 'exp'>): string {
  const fullPayload: CustomerSessionPayload = {
    ...payload,
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000,
  };
  const dataB64 = Buffer.from(JSON.stringify(fullPayload), 'utf8').toString('base64url');
  const signature = crypto
    .createHmac('sha256', AUTH_SECRET)
    .update(dataB64)
    .digest('base64url');
  return `${dataB64}.${signature}`;
}

/**
 * Верификация сессионного токена покупателя
 */
export function verifyCustomerToken(token: string | undefined | null): CustomerSessionPayload | null {
  if (!token || !token.includes('.')) return null;
  const [dataB64, signature] = token.split('.');
  if (!dataB64 || !signature) return null;

  const expectedSig = crypto
    .createHmac('sha256', AUTH_SECRET)
    .update(dataB64)
    .digest('base64url');

  if (signature !== expectedSig) return null;

  try {
    const decoded = JSON.parse(
      Buffer.from(dataB64, 'base64url').toString('utf8')
    ) as CustomerSessionPayload;
    if (!decoded.customerId || decoded.exp < Date.now()) {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Получение авторизованного покупателя из HttpOnly cookie (или заголовка Cookie в NextRequest)
 */
export async function getAuthenticatedCustomer(req?: NextRequest) {
  let token: string | undefined;
  if (req) {
    token = req.cookies.get(CUSTOMER_COOKIE_NAME)?.value;
  } else {
    const cookieStore = cookies();
    token = cookieStore.get(CUSTOMER_COOKIE_NAME)?.value;
  }

  const session = verifyCustomerToken(token);
  if (!session) return null;

  const customer = await prisma.customer.findUnique({
    where: { id: session.customerId },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' },
        include: {
          orderItems: true,
        },
      },
    },
  });

  return customer;
}

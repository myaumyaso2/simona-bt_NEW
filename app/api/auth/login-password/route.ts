import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { normalizeRussianPhone } from '@/lib/utils';
import {
  CUSTOMER_COOKIE_NAME,
  hashPassword,
  signCustomerToken,
  verifyLegacyUmiPassword,
  verifyModernPassword,
} from '@/lib/customerAuth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Record<string, unknown>;
    const rawLogin = String(
      body.login || body.identifier || body.email || body.phone || ''
    ).trim();
    const password = String(body.password || '');

    if (!rawLogin || !password) {
      return NextResponse.json(
        { error: 'Укажите Email / телефон и пароль' },
        { status: 400 }
      );
    }

    const isEmail = rawLogin.includes('@');
    let customer = isEmail
      ? await prisma.customer.findFirst({
          where: { email: rawLogin.toLowerCase() },
        })
      : await prisma.customer.findUnique({
          where: { phone: normalizeRussianPhone(rawLogin) },
        });

    if (!customer) {
      return NextResponse.json(
        { error: 'Пользователь не найден или неверный пароль' },
        { status: 401 }
      );
    }

    let isValid = false;
    let upgradedFromLegacy = false;

    if (customer.passwordHash) {
      isValid = verifyModernPassword(password, customer.passwordHash);
    }

    if (!isValid && customer.legacyPassword) {
      const legacyMatch = verifyLegacyUmiPassword(password, customer.legacyPassword);
      if (legacyMatch) {
        isValid = true;
        upgradedFromLegacy = true;
        const modernHash = hashPassword(password);
        customer = await prisma.customer.update({
          where: { id: customer.id },
          data: {
            passwordHash: modernHash,
            legacyPassword: null,
          },
        });
      }
    }

    if (!isValid) {
      return NextResponse.json(
        { error: 'Неверный логин или пароль' },
        { status: 401 }
      );
    }

    // Привязываем исторические заказы по телефону или email
    await prisma.order.updateMany({
      where: {
        customerId: null,
        OR: [
          { customerPhone: customer.phone },
          ...(customer.email ? [{ customerEmail: customer.email }] : []),
        ],
      },
      data: { customerId: customer.id },
    });

    const token = signCustomerToken({
      customerId: customer.id,
      phone: customer.phone,
      email: customer.email,
      role: customer.role,
    });

    const res = NextResponse.json({
      ok: true,
      upgradedFromLegacy,
      customer: {
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        role: customer.role,
        companyName: customer.companyName,
        bonusPoints: customer.bonusPoints,
      },
    });

    res.cookies.set(CUSTOMER_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60,
    });

    return res;
  } catch (err: unknown) {
    console.error('[Auth login-password] Error:', err);
    const msg = err instanceof Error ? err.message : 'Ошибка входа по паролю';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { normalizeRussianPhone } from '@/lib/utils';
import { CUSTOMER_COOKIE_NAME, signCustomerToken } from '@/lib/customerAuth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Record<string, unknown>;
    const rawIdentifier = String(
      body.identifier || body.email || body.phone || ''
    ).trim();
    const code = String(body.code || '').trim();

    if (!rawIdentifier || !code) {
      return NextResponse.json(
        { error: 'Укажите Email / телефон и 6-значный код из письма' },
        { status: 400 }
      );
    }

    const isEmail = rawIdentifier.includes('@');
    const customer = isEmail
      ? await prisma.customer.findFirst({
          where: { email: rawIdentifier.toLowerCase() },
        })
      : await prisma.customer.findUnique({
          where: { phone: normalizeRussianPhone(rawIdentifier) },
        });

    if (!customer || !customer.otpCode || !customer.otpExpiresAt) {
      return NextResponse.json(
        { error: 'Код не запрашивался или устарел. Запросите новый код.' },
        { status: 400 }
      );
    }

    if (customer.otpExpiresAt.getTime() < Date.now()) {
      return NextResponse.json(
        { error: 'Срок действия кода истек. Запросите новый код.' },
        { status: 400 }
      );
    }

    if (customer.otpCode !== code) {
      return NextResponse.json(
        { error: 'Неверный код подтверждения' },
        { status: 400 }
      );
    }

    // Очищаем использованный OTP-код
    await prisma.customer.update({
      where: { id: customer.id },
      data: {
        otpCode: null,
        otpExpiresAt: null,
      },
    });

    // Привязываем исторические заказы по телефону или email к этому профилю
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
    console.error('[Auth verify-code] Error:', err);
    const msg = err instanceof Error ? err.message : 'Ошибка проверки кода';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

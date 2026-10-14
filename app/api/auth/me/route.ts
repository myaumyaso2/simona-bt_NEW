import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CUSTOMER_COOKIE_NAME, verifyCustomerToken } from '@/lib/customerAuth';
import { normalizeRussianPhone } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(CUSTOMER_COOKIE_NAME)?.value;
    const session = verifyCustomerToken(token);

    if (!session) {
      return NextResponse.json({ authenticated: false, customer: null, orders: [] });
    }

    const customer = await prisma.customer.findUnique({
      where: { id: session.customerId },
    });

    if (!customer) {
      return NextResponse.json({ authenticated: false, customer: null, orders: [] });
    }

    const orders = await prisma.order.findMany({
      where: {
        OR: [
          { customerId: customer.id },
          { customerPhone: customer.phone },
          ...(customer.email ? [{ customerEmail: customer.email }] : []),
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        orderItems: true,
      },
    });

    return NextResponse.json({
      authenticated: true,
      customer: {
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        role: customer.role,
        companyName: customer.companyName,
        address: customer.address,
        bonusPoints: customer.bonusPoints,
        createdAt: customer.createdAt,
      },
      orders,
    });
  } catch (err: unknown) {
    console.error('[Auth me] Error:', err);
    return NextResponse.json({ authenticated: false, customer: null, orders: [] }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const token = req.cookies.get(CUSTOMER_COOKIE_NAME)?.value;
    const session = verifyCustomerToken(token);
    if (!session) {
      return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 });
    }

    const body = (await req.json()) as Record<string, unknown>;
    const name = body.name !== undefined ? String(body.name).trim() : undefined;
    const rawPhone = body.phone !== undefined ? String(body.phone).trim() : undefined;
    const email = body.email !== undefined ? String(body.email).trim().toLowerCase() : undefined;
    const address = body.address !== undefined ? String(body.address).trim() : undefined;
    const companyName =
      body.companyName !== undefined ? String(body.companyName).trim() : undefined;

    let normalizedPhone: string | undefined = undefined;
    if (rawPhone) {
      const digitsOnly = rawPhone.replace(/\D/g, '');
      if (digitsOnly.length < 10) {
        return NextResponse.json(
          { error: 'Пожалуйста, укажите полный номер телефона РФ (+7...)' },
          { status: 400 }
        );
      }
      normalizedPhone = normalizeRussianPhone(rawPhone);

      // Проверим, не занят ли номер другим аккаунтом
      const existing = await prisma.customer.findUnique({
        where: { phone: normalizedPhone },
      });
      if (existing && existing.id !== session.customerId) {
        return NextResponse.json(
          { error: 'Этот номер телефона уже привязан к другому профилю' },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.customer.update({
      where: { id: session.customerId },
      data: {
        ...(name ? { name } : {}),
        ...(normalizedPhone ? { phone: normalizedPhone } : {}),
        ...(email !== undefined ? { email: email || null } : {}),
        ...(address !== undefined ? { address: address || null } : {}),
        ...(companyName !== undefined ? { companyName: companyName || null } : {}),
      },
    });

    // Если обновлен телефон или email, привяжем исторические заказы
    if (normalizedPhone || email) {
      await prisma.order.updateMany({
        where: {
          customerId: null,
          OR: [
            ...(normalizedPhone ? [{ customerPhone: normalizedPhone }] : []),
            ...(email ? [{ customerEmail: email }] : []),
          ],
        },
        data: { customerId: updated.id },
      });
    }

    return NextResponse.json({
      ok: true,
      customer: {
        id: updated.id,
        name: updated.name,
        phone: updated.phone,
        email: updated.email,
        role: updated.role,
        companyName: updated.companyName,
        address: updated.address,
        bonusPoints: updated.bonusPoints,
      },
    });
  } catch (err: unknown) {
    console.error('[Auth me PATCH] Error:', err);
    const msg = err instanceof Error ? err.message : 'Ошибка сохранения профиля';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}


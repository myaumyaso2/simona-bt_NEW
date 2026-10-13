import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { normalizeRussianPhone } from '@/lib/utils';
import { sendOtpEmail } from '@/lib/mail/mailer';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Record<string, unknown>;
    const rawIdentifier = String(
      body.identifier || body.email || body.phone || ''
    ).trim();
    const rawEmail = body.email ? String(body.email).trim().toLowerCase() : null;

    if (!rawIdentifier) {
      return NextResponse.json(
        { error: 'Укажите Email или номер телефона для получения кода' },
        { status: 400 }
      );
    }

    const isEmail = rawIdentifier.includes('@');
    let customer = null;

    if (isEmail) {
      const emailLower = rawIdentifier.toLowerCase();
      customer = await prisma.customer.findFirst({
        where: { email: emailLower },
      });

      if (!customer) {
        // Проверим, есть ли заказы с таким email, чтобы взять телефон и имя клиента
        const orderWithEmail = await prisma.order.findFirst({
          where: { customerEmail: emailLower },
          orderBy: { createdAt: 'desc' },
        });

        const phone = orderWithEmail?.customerPhone
          ? normalizeRussianPhone(orderWithEmail.customerPhone)
          : `+7000${String(Math.floor(1000000 + Math.random() * 8999999))}`;

        customer = await prisma.customer.upsert({
          where: { phone },
          update: { email: emailLower },
          create: {
            phone,
            email: emailLower,
            name: orderWithEmail?.customerName || '',
          },
        });
      }
    } else {
      const normalizedPhone = normalizeRussianPhone(rawIdentifier);
      customer = await prisma.customer.findUnique({
        where: { phone: normalizedPhone },
      });

      if (!customer) {
        const orderWithPhone = await prisma.order.findFirst({
          where: { customerPhone: normalizedPhone },
          orderBy: { createdAt: 'desc' },
        });

        customer = await prisma.customer.create({
          data: {
            phone: normalizedPhone,
            email: rawEmail || orderWithPhone?.customerEmail || null,
            name: orderWithPhone?.customerName || '',
          },
        });
      } else if (rawEmail && !customer.email) {
        customer = await prisma.customer.update({
          where: { id: customer.id },
          data: { email: rawEmail },
        });
      }
    }

    const targetEmail = isEmail
      ? rawIdentifier.toLowerCase()
      : rawEmail || customer.email;

    if (!targetEmail || !targetEmail.includes('@')) {
      return NextResponse.json(
        {
          error:
            'Для этого номера телефона в профиле не указан Email. Пожалуйста, введите ваш Email для получения одноразового кода.',
          needsEmail: true,
        },
        { status: 400 }
      );
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.customer.update({
      where: { id: customer.id },
      data: {
        otpCode: code,
        otpExpiresAt: expiresAt,
      },
    });

    await sendOtpEmail(targetEmail, code, customer.name);

    return NextResponse.json({
      ok: true,
      customerId: customer.id,
      sentTo: targetEmail,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (err: unknown) {
    console.error('[Auth send-code] Error:', err);
    const msg = err instanceof Error ? err.message : 'Ошибка отправки кода';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

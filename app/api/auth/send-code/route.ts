import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { normalizeRussianPhone } from '@/lib/utils';
import { sendOtpEmail } from '@/lib/mail/mailer';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Record<string, unknown>;
    const rawIdentifier = String(
      body.identifier || body.email || ''
    ).trim();

    if (!rawIdentifier) {
      return NextResponse.json(
        { error: 'Укажите ваш Email для получения 6-значного кода' },
        { status: 400 }
      );
    }

    const isPhoneLike =
      rawIdentifier.startsWith('+') ||
      rawIdentifier.startsWith('8') ||
      /^\d+$/.test(rawIdentifier.replace(/[\s\-()]/g, ''));

    if (isPhoneLike && !rawIdentifier.includes('@')) {
      return NextResponse.json(
        {
          error:
            'Вход по коду доступен только через Email. Для входа по номеру телефона используйте вкладку «По паролю».',
        },
        { status: 400 }
      );
    }

    const emailLower = rawIdentifier.toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailLower)) {
      return NextResponse.json(
        { error: 'Пожалуйста, укажите корректный адрес электронной почты (например, client@mail.ru)' },
        { status: 400 }
      );
    }

    let customer = await prisma.customer.findFirst({
      where: { email: emailLower },
    });

    if (!customer) {
      // Проверим, есть ли заказы с таким email, чтобы взять телефон и имя клиента
      const orderWithEmail = await prisma.order.findFirst({
        where: { customerEmail: emailLower },
        orderBy: { createdAt: 'desc' },
      });

      if (orderWithEmail?.customerPhone) {
        const orderPhone = normalizeRussianPhone(orderWithEmail.customerPhone);
        const existingCustByPhone = await prisma.customer.findUnique({
          where: { phone: orderPhone },
        });
        if (existingCustByPhone) {
          customer = await prisma.customer.update({
            where: { id: existingCustByPhone.id },
            data: { email: emailLower },
          });
        }
      }

      if (!customer) {
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
    }

    const targetEmail = emailLower;

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

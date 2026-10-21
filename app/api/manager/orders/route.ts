import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAuthorized } from '@/lib/adminAuth';
import { sendOrderStatusChangedEmail } from '@/lib/mail/mailer';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Требуется авторизация менеджера' }, { status: 401 });
  }

  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
    });

    const response = NextResponse.json({ success: true, orders });
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Ошибка загрузки заказов';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Требуется авторизация менеджера' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, status, paymentStatus, paymentLink, notifyCustomer = true } = body as {
      id?: string;
      status?: string;
      paymentStatus?: string;
      paymentLink?: string;
      notifyCustomer?: boolean;
    };

    if (!id) {
      return NextResponse.json({ error: 'Не указан ID заказа' }, { status: 400 });
    }

    const existing = await prisma.order.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Заказ не найден' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (status !== undefined) updateData.status = status;
    if (paymentStatus !== undefined) updateData.paymentStatus = paymentStatus;
    if (paymentLink !== undefined) updateData.paymentLink = paymentLink.trim() || null;
    if (status === 'PAID' && paymentStatus === undefined) {
      updateData.paymentStatus = 'PAID';
    }

    const updated = await prisma.order.update({
      where: { id },
      data: updateData,
    });

    let emailResult: { sent: boolean; error?: string } | null = null;
    const statusChanged = status !== undefined && status !== existing.status;
    const linkAddedWhileConfirmed =
      updated.status === 'CONFIRMED' &&
      Boolean(updated.paymentLink) &&
      updated.paymentLink !== existing.paymentLink;

    if (notifyCustomer && (statusChanged || linkAddedWhileConfirmed) && updated.customerEmail) {
      emailResult = await sendOrderStatusChangedEmail(updated);
    }

    return NextResponse.json({
      success: true,
      order: updated,
      emailResult,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Ошибка обновления заказа';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

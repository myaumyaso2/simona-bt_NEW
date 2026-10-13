import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getPaymentInfo, verifyWebhookPayload } from '@/lib/integrations/yookassa';
import { sendPaymentStatusEmail } from '@/lib/mail/mailer';
import { notifyPaymentHoldInMax } from '@/lib/integrations/maxMessenger';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const rawBody = (await req.json()) as unknown;
    const verification = verifyWebhookPayload(rawBody);

    if (!verification.valid || !verification.payload) {
      return NextResponse.json(
        { error: `Invalid YooKassa webhook payload: ${verification.error || 'unknown'}` },
        { status: 400 }
      );
    }

    const { event, object } = verification.payload;
    const targetPaymentId =
      event === 'refund.succeeded' && object.payment_id ? object.payment_id : object.id;
    const metaOrderId = object.metadata?.orderId;
    const metaOrderNumber = object.metadata?.orderNumber;

    // 1. Ищем заказ по paymentId, либо по metadata.orderId / metadata.orderNumber
    let order = await prisma.order.findFirst({
      where: {
        OR: [
          { paymentId: targetPaymentId },
          ...(metaOrderId ? [{ id: metaOrderId }] : []),
          ...(metaOrderNumber ? [{ orderNumber: metaOrderNumber }] : []),
        ],
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: `Order not found for paymentId=${targetPaymentId}` },
        { status: 404 }
      );
    }

    // 2. Для событий платежа верифицируем статус через GET /v3/payments/{paymentId}
    if (event !== 'refund.succeeded') {
      const expectedStatus =
        event === 'payment.waiting_for_capture'
          ? 'waiting_for_capture'
          : event === 'payment.succeeded'
          ? 'succeeded'
          : 'canceled';

      const paymentInfo = await getPaymentInfo(targetPaymentId, expectedStatus);
      if (!paymentInfo) {
        return NextResponse.json(
          { error: 'Unable to verify payment status with YooKassa API' },
          { status: 400 }
        );
      }

      if (paymentInfo.status !== expectedStatus) {
        return NextResponse.json(
          {
            error: `Payment status mismatch: webhook=${expectedStatus}, api=${paymentInfo.status}`,
          },
          { status: 400 }
        );
      }
    }

    // 3. Обновляем статус оплаты и отправляем уведомления
    if (event === 'payment.waiting_for_capture') {
      order = await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentId: targetPaymentId,
          paymentStatus: 'HOLD',
        },
      });

      await Promise.all([
        notifyPaymentHoldInMax(order),
        sendPaymentStatusEmail(order, 'HOLD'),
      ]);
    } else if (event === 'payment.succeeded') {
      order = await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentId: targetPaymentId,
          paymentStatus: 'PAID',
          status: 'PAID',
        },
      });

      await sendPaymentStatusEmail(order, 'PAID');
    } else if (event === 'payment.canceled') {
      order = await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentId: targetPaymentId,
          paymentStatus: 'CANCELLED',
        },
      });

      await sendPaymentStatusEmail(order, 'CANCELLED');
    } else if (event === 'refund.succeeded') {
      order = await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: 'REFUNDED',
        },
      });

      await sendPaymentStatusEmail(order, 'REFUNDED');
    }

    return NextResponse.json({
      ok: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      paymentStatus: order.paymentStatus,
      status: order.status,
    });
  } catch (err: unknown) {
    console.error('[YooKassa Webhook] Error:', err);
    const msg = err instanceof Error ? err.message : 'Internal webhook error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

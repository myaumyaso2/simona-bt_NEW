import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { notifyChatMessageInMax } from '@/lib/integrations/maxMessenger';
import { sendChatMessageNotificationEmail } from '@/lib/mail/mailer';

export const dynamic = 'force-dynamic';

const PostChatMessageSchema = z.object({
  sessionId: z.string().min(3),
  text: z.string().min(1).max(2000),
  clientName: z.string().optional().nullable(),
  clientPhone: z.string().optional().nullable(),
  pageUrl: z.string().optional().nullable(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = (searchParams.get('sessionId') || '').trim();

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId is required' }, { status: 400 });
    }

    const messages = await prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
      take: 200,
    });

    return NextResponse.json({
      ok: true,
      sessionId,
      messages,
    });
  } catch (err: unknown) {
    console.error('[Chat Messages GET] Error:', err);
    const msg = err instanceof Error ? err.message : 'Ошибка загрузки сообщений';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = (await req.json()) as unknown;
    const parsed = PostChatMessageSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues.map((i) => i.message).join('; ') },
        { status: 400 }
      );
    }

    const { sessionId, text, clientName, clientPhone, pageUrl } = parsed.data;

    // Проверка истории сообщений клиента в данной сессии для определения триггеров email-уведомления
    const previousClientMessages = await prisma.chatMessage.findMany({
      where: { sessionId, sender: 'CLIENT' },
      orderBy: { createdAt: 'desc' },
      take: 1,
    });

    const isFirstMessage = previousClientMessages.length === 0;
    const lastMsg = previousClientMessages[0];
    const isInactiveTimeout =
      Boolean(lastMsg) &&
      Date.now() - new Date(lastMsg.createdAt).getTime() > 3 * 60 * 60 * 1000; // > 3 часов неактивности

    const hasPhoneNow = Boolean(clientPhone && clientPhone.trim());
    const isContactSubmission =
      hasPhoneNow &&
      (text.toLowerCase().includes('контакт для связи') || !lastMsg?.clientPhone);

    const shouldSendEmail = isFirstMessage || isInactiveTimeout || isContactSubmission;

    const message = await prisma.chatMessage.create({
      data: {
        sessionId,
        sender: 'CLIENT',
        text: text.trim(),
        clientName: clientName ? clientName.trim() : null,
        clientPhone: clientPhone ? clientPhone.trim() : null,
        pageUrl: pageUrl ? pageUrl.trim() : null,
      },
    });

    // 1. Трансляция сообщения консультантам в корпоративный мессенджер MAX с тегом [#chat_{sessionId}]
    const maxPromise = notifyChatMessageInMax({
      sessionId,
      clientName: message.clientName,
      clientPhone: message.clientPhone,
      text: message.text,
      pageUrl: message.pageUrl,
    });

    // 2. Отправка email-уведомления менеджерам (inet@simona-bt.ru, absergin@mail.ru)
    let emailPromise: Promise<unknown> = Promise.resolve();
    if (shouldSendEmail) {
      emailPromise = sendChatMessageNotificationEmail({
        sessionId,
        text: message.text,
        clientName: message.clientName,
        clientPhone: message.clientPhone,
        pageUrl: message.pageUrl,
        isContactSubmit: isContactSubmission,
      }).catch((mailErr: unknown) => {
        console.warn('[Chat Messages POST] Email notification error:', mailErr);
      });
    }

    const [maxResult] = await Promise.all([maxPromise, emailPromise]);

    return NextResponse.json({
      ok: true,
      message,
      maxAlert: maxResult,
      emailSent: shouldSendEmail,
    });
  } catch (err: unknown) {
    console.error('[Chat Messages POST] Error:', err);
    const msg = err instanceof Error ? err.message : 'Ошибка отправки сообщения';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

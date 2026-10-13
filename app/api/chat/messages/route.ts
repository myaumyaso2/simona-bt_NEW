import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { notifyChatMessageInMax } from '@/lib/integrations/maxMessenger';

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

    // Трансляция сообщения консультантам в корпоративный мессенджер MAX с тегом [#chat_{sessionId}]
    const maxResult = await notifyChatMessageInMax({
      sessionId,
      clientName: message.clientName,
      clientPhone: message.clientPhone,
      text: message.text,
      pageUrl: message.pageUrl,
    });

    return NextResponse.json({
      ok: true,
      message,
      maxAlert: maxResult,
    });
  } catch (err: unknown) {
    console.error('[Chat Messages POST] Error:', err);
    const msg = err instanceof Error ? err.message : 'Ошибка отправки сообщения';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

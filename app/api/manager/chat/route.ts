import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAuthorized } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

export interface ChatSessionSummary {
  sessionId: string;
  clientName: string | null;
  clientPhone: string | null;
  pageUrl: string | null;
  lastMessageText: string;
  lastMessageAt: string;
  unreadCount: number;
  messages: Array<{
    id: string;
    sessionId: string;
    sender: string;
    text: string;
    clientName: string | null;
    clientPhone: string | null;
    pageUrl: string | null;
    createdAt: Date;
  }>;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Требуется авторизация менеджера' }, { status: 401 });
  }

  try {
    const allMessages = await prisma.chatMessage.findMany({
      orderBy: { createdAt: 'asc' },
      take: 1000,
    });

    const sessionsMap = new Map<string, ChatSessionSummary>();

    for (const msg of allMessages) {
      let existing = sessionsMap.get(msg.sessionId);
      if (!existing) {
        existing = {
          sessionId: msg.sessionId,
          clientName: msg.clientName || null,
          clientPhone: msg.clientPhone || null,
          pageUrl: msg.pageUrl || null,
          lastMessageText: msg.text,
          lastMessageAt: msg.createdAt.toISOString(),
          unreadCount: 0,
          messages: [],
        };
        sessionsMap.set(msg.sessionId, existing);
      }

      if (msg.clientName) existing.clientName = msg.clientName;
      if (msg.clientPhone) existing.clientPhone = msg.clientPhone;
      if (msg.pageUrl) existing.pageUrl = msg.pageUrl;
      existing.lastMessageText = msg.text;
      existing.lastMessageAt = msg.createdAt.toISOString();
      if (msg.sender === 'CLIENT' && !msg.isRead) {
        existing.unreadCount += 1;
      }
      existing.messages.push(msg);
    }

    const sessions = Array.from(sessionsMap.values()).sort(
      (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
    );

    return NextResponse.json({
      ok: true,
      sessions,
    });
  } catch (err: unknown) {
    console.error('[Manager Chat GET] Error:', err);
    const msg = err instanceof Error ? err.message : 'Ошибка загрузки диалогов чата';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Требуется авторизация менеджера' }, { status: 401 });
  }

  try {
    const body = (await req.json()) as { sessionId?: string; text?: string };
    const sessionId = (body.sessionId || '').trim();
    const text = (body.text || '').trim();

    if (!sessionId || !text) {
      return NextResponse.json(
        { error: 'Не указан sessionId или текст ответа' },
        { status: 400 }
      );
    }

    const message = await prisma.chatMessage.create({
      data: {
        sessionId,
        sender: 'MANAGER',
        text,
      },
    });

    // Помечаем сообщения клиента в этой сессии как прочитанные
    await prisma.chatMessage.updateMany({
      where: { sessionId, sender: 'CLIENT', isRead: false },
      data: { isRead: true },
    });

    return NextResponse.json({
      ok: true,
      message,
    });
  } catch (err: unknown) {
    console.error('[Manager Chat POST] Error:', err);
    const msg = err instanceof Error ? err.message : 'Ошибка отправки ответа менеджера';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

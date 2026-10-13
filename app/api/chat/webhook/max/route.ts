import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

interface MaxWebhookBody {
  update_type?: string;
  message?: {
    body?: {
      mid?: string;
      text?: string;
    };
    link?: {
      type?: string;
      message?: {
        text?: string;
        body?: {
          text?: string;
        };
      };
    };
  };
  reply_to_message?: {
    text?: string;
  };
  parentText?: string;
  text?: string;
  sessionId?: string;
  maxMessageId?: string;
}

const CHAT_SESSION_REGEX = /\[#chat_([a-zA-Z0-9_-]+)\]/;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as MaxWebhookBody;

    const incomingText =
      body.message?.body?.text ||
      body.text ||
      '';

    const parentText =
      body.message?.link?.message?.body?.text ||
      body.message?.link?.message?.text ||
      body.reply_to_message?.text ||
      body.parentText ||
      '';

    let sessionId = body.sessionId || null;

    if (!sessionId) {
      const parentMatch = parentText.match(CHAT_SESSION_REGEX);
      if (parentMatch && parentMatch[1]) {
        sessionId = parentMatch[1];
      } else {
        const inlineMatch = incomingText.match(CHAT_SESSION_REGEX);
        if (inlineMatch && inlineMatch[1]) {
          sessionId = inlineMatch[1];
        }
      }
    }

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session tag [#chat_{sessionId}] not found in MAX webhook payload' },
        { status: 400 }
      );
    }

    const cleanReplyText = incomingText.replace(CHAT_SESSION_REGEX, '').trim();
    if (!cleanReplyText) {
      return NextResponse.json(
        { error: 'Empty manager reply text' },
        { status: 400 }
      );
    }

    const maxMessageId = body.message?.body?.mid || body.maxMessageId || null;

    const saved = await prisma.chatMessage.create({
      data: {
        sessionId,
        sender: 'MANAGER',
        text: cleanReplyText,
        maxMessageId,
      },
    });

    return NextResponse.json({
      ok: true,
      sessionId,
      message: saved,
    });
  } catch (err: unknown) {
    console.error('[MAX Chat Webhook] Error:', err);
    const msg = err instanceof Error ? err.message : 'Internal webhook error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

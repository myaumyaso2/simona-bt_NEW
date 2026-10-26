import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAuthorized } from '@/lib/adminAuth';
import { markAsanaTaskAsTest } from '@/lib/integrations/asana';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Требуется авторизация менеджера' }, { status: 401 });
  }

  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
      take: 250,
    });

    return NextResponse.json({ success: true, leads });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Ошибка загрузки заявок';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Требуется авторизация менеджера' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, status } = body as { id?: string; status?: string };

    if (!id || !status) {
      return NextResponse.json({ error: 'Не указан ID или статус заявки' }, { status: 400 });
    }

    const currentLead = await prisma.lead.findUnique({
      where: { id },
      select: { id: true, status: true, asanaTaskId: true },
    });

    if (!currentLead) {
      return NextResponse.json({ error: 'Заявка не найдена' }, { status: 404 });
    }

    // Если заявка переводится в статус TEST, добавляем комментарий в Asana и закрываем задачу
    if (status === 'TEST' && currentLead.asanaTaskId) {
      await markAsanaTaskAsTest(currentLead.asanaTaskId);
    }

    const updated = await prisma.lead.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, lead: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Ошибка обновления заявки';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

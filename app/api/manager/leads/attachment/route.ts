import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';
import { isAuthorized } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Требуется авторизация менеджера' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Не указан ID заявки' }, { status: 400 });
  }

  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead || !lead.attachmentPath) {
    return NextResponse.json({ error: 'Файл вложения не найден' }, { status: 404 });
  }

  const resolvedPath = path.isAbsolute(lead.attachmentPath)
    ? lead.attachmentPath
    : path.join(process.cwd(), lead.attachmentPath);

  if (!fs.existsSync(resolvedPath)) {
    return NextResponse.json({ error: 'Файл отсутствует на диске' }, { status: 404 });
  }

  const fileBuffer = fs.readFileSync(resolvedPath);
  const fileName = path.basename(resolvedPath);
  const ext = path.extname(fileName).toLowerCase();

  const mimeMap: Record<string, string> = {
    '.pdf': 'application/pdf',
    '.zip': 'application/zip',
    '.dwg': 'application/acad',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
  };

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      'Content-Type': mimeMap[ext] || 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(fileName)}"`,
    },
  });
}

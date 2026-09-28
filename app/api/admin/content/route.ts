import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { isAuthorized } from '@/lib/adminAuth';
import { getSiteContent } from '@/lib/content';

export const dynamic = 'force-dynamic';

const CONTENT_PATH = path.join(process.cwd(), 'content', 'siteContent.json');
const BACKUPS_DIR = path.join(process.cwd(), 'content', 'backups');

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const content = getSiteContent();
    return NextResponse.json({ success: true, content });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Ошибка загрузки контента' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const newContent = body.content;

    if (!newContent || typeof newContent !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Некорректная структура контента' },
        { status: 400 }
      );
    }

    // 1. Ensure backups directory exists
    if (!fs.existsSync(BACKUPS_DIR)) {
      fs.mkdirSync(BACKUPS_DIR, { recursive: true });
    }

    // 2. Create automated backup before saving
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const timestampStr = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(
      now.getHours()
    )}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
    const backupFileName = `siteContent_${timestampStr}.json`;
    const backupFilePath = path.join(BACKUPS_DIR, backupFileName);

    if (fs.existsSync(CONTENT_PATH)) {
      const existingData = fs.readFileSync(CONTENT_PATH, 'utf-8');
      fs.writeFileSync(backupFilePath, existingData, 'utf-8');
    }

    // 3. Keep only last 30 backups to save disk space
    try {
      const backupFiles = fs
        .readdirSync(BACKUPS_DIR)
        .filter((f) => f.startsWith('siteContent_') && f.endsWith('.json'))
        .sort()
        .reverse();

      if (backupFiles.length > 30) {
        backupFiles.slice(30).forEach((oldFile) => {
          try {
            fs.unlinkSync(path.join(BACKUPS_DIR, oldFile));
          } catch {
            // ignore cleanup errors
          }
        });
      }
    } catch {
      // ignore directory read errors
    }

    // 4. Save new formatted JSON content
    const formatted = JSON.stringify(newContent, null, 2);
    fs.writeFileSync(CONTENT_PATH, formatted, 'utf-8');

    return NextResponse.json({
      success: true,
      backupFile: backupFileName,
      timestamp: now.toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Ошибка сохранения контента' },
      { status: 500 }
    );
  }
}

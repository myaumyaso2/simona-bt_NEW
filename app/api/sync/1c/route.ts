import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { syncFastStock, syncFullCatalog } from '@/lib/sync/oneCSyncService';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes execution window for full catalog

const SYNC_SECRET = process.env.SYNC_SECRET_KEY || 'simona_secure_sync_secret_2026';

// Пути к стандартным файлам обмена 1С на боевом сервере
const DEFAULT_STOCK_PATHS = [
  '/var/www/simona-bt.ru/data/www/simona-bt.ru/159.253.20.27/1C_ostatki_MP.csv',
  '/var/www/simona-bt.ru/data/www/new.simona-bt.ru/storage/sync/1C_ostatki_MP.csv',
  path.join(process.cwd(), 'data', '1C_ostatki_MP.csv'),
];

const DEFAULT_CATALOG_PATHS = [
  '/var/www/simona-bt.ru/data/www/simona-bt.ru/159.253.20.27/1C_import.csv',
  '/var/www/simona-bt.ru/data/www/new.simona-bt.ru/storage/sync/1C_import.csv',
  path.join(process.cwd(), 'data', '1C_import.csv'),
];

function findExistingFile(paths: string[]): string | null {
  for (const p of paths) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

/**
 * Аутентификация запроса по Bearer-токену
 */
function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return false;

  const [scheme, token] = authHeader.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !token) return false;

  return token.trim() === SYNC_SECRET.trim();
}

/**
 * GET /api/sync/1c — статус готовности и наличие файлов обмена
 */
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: 'Unauthorized: Invalid or missing Bearer token' },
      { status: 401 }
    );
  }

  const stockFile = findExistingFile(DEFAULT_STOCK_PATHS);
  const catalogFile = findExistingFile(DEFAULT_CATALOG_PATHS);

  return NextResponse.json({
    status: 'READY',
    availableFiles: {
      stock: stockFile ? { path: stockFile, sizeBytes: fs.statSync(stockFile).size } : null,
      catalog: catalogFile ? { path: catalogFile, sizeBytes: fs.statSync(catalogFile).size } : null,
    },
    defaultStockPaths: DEFAULT_STOCK_PATHS,
    defaultCatalogPaths: DEFAULT_CATALOG_PATHS,
  });
}

/**
 * POST /api/sync/1c — запуск синхронизации остатков или полного каталога
 * Query params:
 *   - type: 'stock' (быстрый поток) | 'catalog' / 'full' (полный каталог)
 *   - dryRun: 'true' | 'false' (по умолчанию false)
 *   - createNew: 'true' | 'false' (по умолчанию true для каталога)
 */
export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: 'Unauthorized: Invalid or missing Bearer token' },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const syncType = searchParams.get('type') || 'stock';
    const dryRun = searchParams.get('dryRun') === 'true';
    const createNew = searchParams.get('createNew') !== 'false';

    // 1. Проверяем, передан ли файл прямо в теле запроса (multipart/form-data)
    let uploadedFileBuffer: Buffer | null = null;
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      if (file) {
        const arrayBuffer = await file.arrayBuffer();
        uploadedFileBuffer = Buffer.from(arrayBuffer);
      }
    } else if (contentType.includes('text/csv') || contentType.includes('application/octet-stream')) {
      const arrayBuffer = await request.arrayBuffer();
      if (arrayBuffer.byteLength > 0) {
        uploadedFileBuffer = Buffer.from(arrayBuffer);
      }
    }

    // 2. Обработка быстрого потока остатков
    if (syncType === 'stock') {
      let targetSource: string | Buffer;

      if (uploadedFileBuffer) {
        targetSource = uploadedFileBuffer;
      } else {
        const file = findExistingFile(DEFAULT_STOCK_PATHS);
        if (!file) {
          return NextResponse.json(
            {
              error: 'Stock CSV file (1C_ostatki_MP.csv) not found in incoming directories',
              checkedPaths: DEFAULT_STOCK_PATHS,
            },
            { status: 404 }
          );
        }
        targetSource = file;
      }

      const result = await syncFastStock(targetSource, { dryRun });
      return NextResponse.json({
        type: 'FAST_STOCK_SYNC',
        ...result,
      });
    }

    // 3. Обработка полного мастер-каталога
    if (syncType === 'catalog' || syncType === 'full') {
      let targetFilePath: string;

      if (uploadedFileBuffer) {
        // Сохраняем временный файл для потокового чтения без OOM
        const tmpDir = path.join(process.cwd(), 'tmp');
        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
        targetFilePath = path.join(tmpDir, `1c_uploaded_${Date.now()}.csv`);
        fs.writeFileSync(targetFilePath, uploadedFileBuffer);
      } else {
        const file = findExistingFile(DEFAULT_CATALOG_PATHS);
        if (!file) {
          return NextResponse.json(
            {
              error: 'Catalog CSV file (1C_import.csv) not found in incoming directories',
              checkedPaths: DEFAULT_CATALOG_PATHS,
            },
            { status: 404 }
          );
        }
        targetFilePath = file;
      }

      try {
        const result = await syncFullCatalog(targetFilePath, { dryRun, createNew });

        // Если это был временный файл из POST тела, удаляем его
        if (uploadedFileBuffer && fs.existsSync(targetFilePath)) {
          fs.unlinkSync(targetFilePath);
        }

        return NextResponse.json({
          type: 'FULL_CATALOG_SYNC',
          ...result,
        });
      } catch (err: any) {
        if (uploadedFileBuffer && fs.existsSync(targetFilePath)) {
          fs.unlinkSync(targetFilePath);
        }
        throw err;
      }
    }

    return NextResponse.json(
      { error: `Invalid sync type: '${syncType}'. Expected 'stock' or 'catalog'` },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('[API 1C Sync Error]:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal Server Error during 1C synchronization',
      },
      { status: 500 }
    );
  }
}

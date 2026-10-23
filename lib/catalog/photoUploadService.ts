import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { prisma } from '../prisma';
import { formatProductName } from './productTitle';

export interface ProcessedUploadResult {
  filename: string;
  sku: string;
  slotIndex: number;
  productName: string;
  brand: string;
  imageUrl: string;
  wasActivated: boolean;
}

export interface RejectedUploadFile {
  filename: string;
  reason: string;
}

export interface PhotoUploadBatchResult {
  success: boolean;
  uploadedCount: number;
  updatedProductsCount: number;
  items: ProcessedUploadResult[];
  rejectedCount: number;
  rejectedFiles: RejectedUploadFile[];
  summaryMessage: string;
}

export interface PhotoUploadLogEntry {
  id: string;
  timestamp: string;
  dateFormatted: string;
  uploadedCount: number;
  updatedProductsCount: number;
  items: ProcessedUploadResult[];
  rejectedCount: number;
  rejectedFiles: RejectedUploadFile[];
}

const LOG_FILE_PATH = path.join(process.cwd(), 'storage', 'logs', 'photo_uploads.json');

// Canonical storage directories
const SERVER_CANONICAL_DIR = '/var/www/simona-bt.ru/data/www/simona-bt.ru/images/cms/data/photo_code';
const LOCAL_PUBLIC_DIR = path.join(process.cwd(), 'public', 'images', 'cms', 'data', 'photo_code');

/**
 * Validates filename against canonical 1C format:
 * Examples of valid names:
 *   - "89083.jpg" -> sku: 89083, slot: 1
 *   - "89083.png" -> sku: 89083, slot: 1
 *   - "89083_2.jpg" -> sku: 89083, slot: 2
 *   - "89083_3.webp" -> sku: 89083, slot: 3
 */
export function parsePhotoFileName(fileName: string): {
  valid: boolean;
  sku?: string;
  slotIndex?: number;
  error?: string;
} {
  const clean = (fileName || '').trim();
  const match = clean.match(/^([0-9]+)(?:_([0-9]+))?\.(jpe?g|png|webp)$/i);

  if (!match) {
    return {
      valid: false,
      error: 'Некорректное имя файла. Ожидается формат: {Код_1С}.jpg или {Код_1С}_2.jpg',
    };
  }

  const sku = match[1];
  const rawSlot = match[2];
  const slotIndex = rawSlot ? parseInt(rawSlot, 10) : 1;

  if (slotIndex < 1 || slotIndex > 20) {
    return {
      valid: false,
      error: 'Номер кадра должен быть в диапазоне от 1 до 20',
    };
  }

  return {
    valid: true,
    sku,
    slotIndex,
  };
}

/**
 * Ensures destination directories exist on disk
 */
function getDestinationDirectories(): string[] {
  const dirs: string[] = [];

  // 1. Local Next.js public directory
  if (!fs.existsSync(LOCAL_PUBLIC_DIR)) {
    try {
      fs.mkdirSync(LOCAL_PUBLIC_DIR, { recursive: true });
    } catch {
      // ignore
    }
  }
  dirs.push(LOCAL_PUBLIC_DIR);

  // 2. Production server canonical directory (served by Nginx directly)
  if (fs.existsSync(SERVER_CANONICAL_DIR)) {
    dirs.push(SERVER_CANONICAL_DIR);
  }

  return dirs;
}

/**
 * Converts image buffer to high quality WebP using Sharp
 */
export async function convertToWebP(inputBuffer: Buffer): Promise<Buffer> {
  return sharp(inputBuffer)
    .rotate() // auto-orient by EXIF
    .resize({
      width: 1600,
      height: 1600,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({
      quality: 88,
      effort: 4,
    })
    .toBuffer();
}

/**
 * Records an upload session into storage/logs/photo_uploads.json
 */
export function recordUploadLog(entry: Omit<PhotoUploadLogEntry, 'id' | 'timestamp' | 'dateFormatted'>) {
  try {
    const dir = path.dirname(LOG_FILE_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    let logs: PhotoUploadLogEntry[] = [];
    if (fs.existsSync(LOG_FILE_PATH)) {
      try {
        const content = fs.readFileSync(LOG_FILE_PATH, 'utf-8');
        logs = JSON.parse(content);
        if (!Array.isArray(logs)) logs = [];
      } catch {
        logs = [];
      }
    }

    const now = new Date();
    const dateFormatted = now.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newRecord: PhotoUploadLogEntry = {
      id: `upload-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: now.toISOString(),
      dateFormatted,
      uploadedCount: entry.uploadedCount,
      updatedProductsCount: entry.updatedProductsCount,
      items: entry.items,
      rejectedCount: entry.rejectedCount,
      rejectedFiles: entry.rejectedFiles,
    };

    logs.unshift(newRecord);
    // Keep last 100 upload sessions
    if (logs.length > 100) logs = logs.slice(0, 100);

    fs.writeFileSync(LOG_FILE_PATH, JSON.stringify(logs, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing photo upload log:', err);
  }
}

/**
 * Retrieves the photo upload logs
 */
export function getPhotoUploadLogs(): PhotoUploadLogEntry[] {
  try {
    if (!fs.existsSync(LOG_FILE_PATH)) return [];
    const content = fs.readFileSync(LOG_FILE_PATH, 'utf-8');
    const logs = JSON.parse(content);
    return Array.isArray(logs) ? logs : [];
  } catch {
    return [];
  }
}

/**
 * Processes a batch of uploaded files
 */
export async function processPhotoUploadBatch(
  files: Array<{ name: string; buffer: Buffer }>
): Promise<PhotoUploadBatchResult> {
  const destDirs = getDestinationDirectories();
  const successfulItems: ProcessedUploadResult[] = [];
  const rejectedFiles: RejectedUploadFile[] = [];
  const updatedProductIds = new Set<string>();

  for (const file of files) {
    const parsed = parsePhotoFileName(file.name);
    if (!parsed.valid || !parsed.sku || parsed.slotIndex === undefined) {
      rejectedFiles.push({
        filename: file.name,
        reason: parsed.error || 'Некорректное имя файла',
      });
      continue;
    }

    const sku = parsed.sku;
    const slotIndex = parsed.slotIndex;

    // 1. Look up product in database by 1C sku
    const product = await prisma.product.findFirst({
      where: { sku },
    });

    if (!product) {
      rejectedFiles.push({
        filename: file.name,
        reason: `Товар с кодом 1С "${sku}" не найден в базе данных сайта`,
      });
      continue;
    }

    try {
      // 2. Convert to WebP
      const webpBuffer = await convertToWebP(file.buffer);

      // 3. Save to disk (both canonical server dir and local public dir)
      const targetFileName = slotIndex === 1 ? `${sku}.webp` : `${sku}_${slotIndex}.webp`;

      for (const dir of destDirs) {
        try {
          const filePath = path.join(dir, targetFileName);
          fs.writeFileSync(filePath, webpBuffer);
        } catch (writeErr) {
          console.warn(`Could not write image to ${dir}/${targetFileName}:`, writeErr);
        }
      }

      const publicUrl = `/images/cms/data/photo_code/${targetFileName}`;

      // 4. Update product imagesJson gallery
      let currentImages: string[] = [];
      try {
        const parsedImages = JSON.parse(product.imagesJson || '[]');
        if (Array.isArray(parsedImages)) {
          currentImages = parsedImages.map(String).filter(Boolean);
        }
      } catch {
        currentImages = [];
      }

      const targetPos = slotIndex - 1;
      if (targetPos === 0) {
        // Main photo
        if (currentImages.length === 0) {
          currentImages.push(publicUrl);
        } else {
          currentImages[0] = publicUrl;
        }
      } else {
        // Additional gallery photo (_2, _3, ...)
        while (currentImages.length < targetPos) {
          currentImages.push(currentImages[0] || publicUrl);
        }
        currentImages[targetPos] = publicUrl;
      }

      // Deduplicate consecutive identical URLs if any
      const nextImages = currentImages;

      // 5. Activate product if it was hidden and has price > 0
      const wasHidden = !product.isActive;
      const shouldActivate = product.price > 0 && !product.noPrice;

      await prisma.product.update({
        where: { id: product.id },
        data: {
          imagesJson: JSON.stringify(nextImages),
          isActive: wasHidden && shouldActivate ? true : product.isActive,
        },
      });

      updatedProductIds.add(product.id);

      const canonicalName = formatProductName({
        name: product.name,
        brand: product.brand,
        category: product.category,
        sku: product.sku,
      });

      successfulItems.push({
        filename: file.name,
        sku,
        slotIndex,
        productName: canonicalName,
        brand: product.brand,
        imageUrl: publicUrl,
        wasActivated: wasHidden && shouldActivate,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ошибка обработки изображения';
      rejectedFiles.push({
        filename: file.name,
        reason: `Ошибка конвертации в WebP: ${msg}`,
      });
    }
  }

  // 6. Record upload session in log file
  recordUploadLog({
    uploadedCount: successfulItems.length,
    updatedProductsCount: updatedProductIds.size,
    items: successfulItems,
    rejectedCount: rejectedFiles.length,
    rejectedFiles,
  });

  const summaryMessage = `Успешно загружено и сопоставлено с товарами ${successfulItems.length} картинок (${updatedProductIds.size} товаров обновлено)`;

  return {
    success: true,
    uploadedCount: successfulItems.length,
    updatedProductsCount: updatedProductIds.size,
    items: successfulItems,
    rejectedCount: rejectedFiles.length,
    rejectedFiles,
    summaryMessage,
  };
}

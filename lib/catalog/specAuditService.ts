import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { prisma } from '../prisma';

export interface SpecProductSnapshot {
  sku: string;
  name: string;
  brand: string;
  features: Array<{ label: string; value: string }>;
  description: string;
  schematicPdfUrl?: string | null;
  dimensions?: string | null;
  color?: string | null;
}

export interface SpecAuditLogEntry {
  id: string;
  timestamp: string;
  dateFormatted: string;
  actionType: 'EXCEL_IMPORT' | 'MANUAL_EDIT' | 'AI_ENRICH';
  operator: string;
  subcategory?: string;
  details: string;
  affectedCount: number;
  beforeSnapshots: SpecProductSnapshot[];
  afterSnapshots: SpecProductSnapshot[];
  isRolledBack?: boolean;
  rolledBackAt?: string;
}

const LOGS_DIR = path.join(process.cwd(), 'storage', 'logs');
const LOG_FILE_PATH = path.join(LOGS_DIR, 'spec_audit_logs.json');
const MASTER_DUMP_PATH = path.join(process.cwd(), 'data', 'exported_catalog_products.json.gz');

function ensureLogDir(): void {
  if (!fs.existsSync(LOGS_DIR)) {
    try {
      fs.mkdirSync(LOGS_DIR, { recursive: true });
    } catch {
      // ignore
    }
  }
}

export async function getSpecAuditLogs(): Promise<SpecAuditLogEntry[]> {
  try {
    ensureLogDir();
    if (!fs.existsSync(LOG_FILE_PATH)) {
      return [];
    }
    const raw = fs.readFileSync(LOG_FILE_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Error reading spec audit logs:', err);
    return [];
  }
}

export async function recordSpecAuditLog(
  data: Omit<SpecAuditLogEntry, 'id' | 'timestamp' | 'dateFormatted'>
): Promise<SpecAuditLogEntry> {
  ensureLogDir();
  const existing = await getSpecAuditLogs();

  const now = new Date();
  const dateFormatted = new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(now);

  const entry: SpecAuditLogEntry = {
    id: `spec-log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: now.toISOString(),
    dateFormatted,
    ...data,
  };

  // Keep last 100 audit entries
  const updated = [entry, ...existing].slice(0, 100);

  try {
    fs.writeFileSync(LOG_FILE_PATH, JSON.stringify(updated, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving spec audit log:', err);
  }

  return entry;
}

/**
 * Rolls back an audit operation in 1 click, restoring the previous snapshot of affected products.
 */
export async function rollbackSpecAuditLog(
  logId: string
): Promise<{ success: boolean; restoredCount: number; error?: string }> {
  const logs = await getSpecAuditLogs();
  const target = logs.find((l) => l.id === logId);

  if (!target) {
    return { success: false, restoredCount: 0, error: 'Запись журнала не найдена' };
  }

  if (target.isRolledBack) {
    return { success: false, restoredCount: 0, error: 'Эта операция уже была откатана' };
  }

  if (!target.beforeSnapshots || target.beforeSnapshots.length === 0) {
    return { success: false, restoredCount: 0, error: 'Нет данных для отката (снимок пуст)' };
  }

  let restoredCount = 0;

  for (const snap of target.beforeSnapshots) {
    try {
      await prisma.product.updateMany({
        where: { sku: snap.sku },
        data: {
          featuresJson: JSON.stringify(snap.features || []),
          description: snap.description,
          schematicPdfUrl: snap.schematicPdfUrl || null,
          dimensions: snap.dimensions || null,
          color: snap.color || null,
        },
      });
      restoredCount++;
    } catch (err) {
      console.error(`Failed to rollback product SKU ${snap.sku}:`, err);
    }
  }

  // Mark log entry as rolled back
  target.isRolledBack = true;
  target.rolledBackAt = new Date().toISOString();

  try {
    fs.writeFileSync(LOG_FILE_PATH, JSON.stringify(logs, null, 2), 'utf8');
  } catch (err) {
    console.error('Error updating spec audit log status:', err);
  }

  // Trigger background sync to master dump
  syncProductsToMasterDump(target.beforeSnapshots.map((s) => s.sku)).catch((err) => {
    console.error('Error syncing rolled back products to master dump:', err);
  });

  return { success: true, restoredCount };
}

/**
 * Synchronizes updated products from SQLite to master dump data/exported_catalog_products.json.gz
 */
export async function syncProductsToMasterDump(skus: string[]): Promise<void> {
  if (!skus || skus.length === 0) return;
  if (!fs.existsSync(MASTER_DUMP_PATH)) return;

  try {
    const rawGz = fs.readFileSync(MASTER_DUMP_PATH);
    const unzipped = zlib.gunzipSync(rawGz).toString('utf8');
    const dumpProducts: Array<Record<string, unknown>> = JSON.parse(unzipped);

    const skuSet = new Set(skus);
    const dbProducts = await prisma.product.findMany({
      where: { sku: { in: skus } },
    });

    const dbMap = new Map<string, (typeof dbProducts)[0]>();
    dbProducts.forEach((p) => dbMap.set(p.sku, p));

    let updatedCount = 0;
    for (const dp of dumpProducts) {
      const s = String(dp.sku || dp.id || '');
      if (skuSet.has(s) && dbMap.has(s)) {
        const dbP = dbMap.get(s)!;
        let feats: unknown[] = [];
        try {
          feats = JSON.parse(dbP.featuresJson || '[]');
        } catch {
          feats = [];
        }

        dp.features = feats;
        dp.description = dbP.description;
        dp.dimensions = dbP.dimensions;
        dp.color = dbP.color;
        dp.schematicPdfUrl = dbP.schematicPdfUrl;
        updatedCount++;
      }
    }

    if (updatedCount > 0) {
      const newGz = zlib.gzipSync(Buffer.from(JSON.stringify(dumpProducts), 'utf8'));
      fs.writeFileSync(MASTER_DUMP_PATH, newGz);
      console.log(`✅ Master dump synced: ${updatedCount} products updated in exported_catalog_products.json.gz`);
    }
  } catch (err) {
    console.error('Failed to sync products to master dump:', err);
  }
}

/**
 * Calculates dimensions and color automatically from feature list:
 * "Ширина (см)", "Высота (см)", "Глубина (см)" -> dimensions: "Ш × В × Г см"
 * "Цвет" -> color
 */
export function deriveDimensionsAndColorFromFeatures(
  features: Array<{ label: string; value: string }>
): { dimensions: string | null; color: string | null } {
  let width = '';
  let height = '';
  let depth = '';
  let color: string | null = null;

  for (const f of features) {
    if (!f.label || !f.value || f.value === '-' || f.value.trim() === '') continue;
    const l = f.label.toLowerCase().trim();
    const v = f.value.trim();

    if (l === 'цвет') {
      color = v;
    } else if (l.includes('ширина')) {
      width = v;
    } else if (l.includes('высота')) {
      height = v;
    } else if (l.includes('глубина') || l.includes('длина')) {
      depth = v;
    }
  }

  let dimensions: string | null = null;
  if (width || height || depth) {
    dimensions = `${width || '?'} × ${height || '?'} × ${depth || '?'} см`;
  }

  return { dimensions, color };
}

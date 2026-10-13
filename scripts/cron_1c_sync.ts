import fs from 'fs';
import os from 'os';
import path from 'path';
import { syncFastStock, syncFullCatalog } from '../lib/sync/oneCSyncService';

// Директории поиска файлов выгрузки 1С (боевой сервер + локальный data/)
const INCOMING_DIRS = [
  '/var/www/simona-bt.ru/data/www/simona-bt.ru/159.253.20.27',
  '/var/www/simona-bt.ru/data/www/new.simona-bt.ru/storage/sync',
  path.join(process.cwd(), 'data'),
];

const BACKUP_DIR = path.join(process.cwd(), 'storage', 'sync_backups');
const LOG_FILE = path.join(process.cwd(), 'storage', 'logs', '1c_sync.log');
const LOCK_FILE = path.join(os.tmpdir(), 'simona_1c_sync.pid');

function findIncomingFile(fileName: string): string | null {
  for (const dir of INCOMING_DIRS) {
    const candidate = path.join(dir, fileName);
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return null;
}

function log(message: string) {
  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] ${message}`;
  console.log(line);

  try {
    const dir = path.dirname(LOG_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.appendFileSync(LOG_FILE, line + '\n');
  } catch {
    // Ignore logging errors
  }
}

function acquireLock(): boolean {
  try {
    if (fs.existsSync(LOCK_FILE)) {
      const stats = fs.statSync(LOCK_FILE);
      // Если лок старше 15 минут, считаем его устаревшим (dead lock)
      if (Date.now() - stats.mtimeMs > 15 * 60 * 1000) {
        log(`⚠️ Overriding stale lock file from ${stats.mtime.toISOString()}`);
        fs.unlinkSync(LOCK_FILE);
      } else {
        return false;
      }
    }
    fs.writeFileSync(LOCK_FILE, `${process.pid}\n${Date.now()}`);
    return true;
  } catch {
    return false;
  }
}

function releaseLock() {
  try {
    if (fs.existsSync(LOCK_FILE)) {
      fs.unlinkSync(LOCK_FILE);
    }
  } catch {
    // Ignore error
  }
}

async function main() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run');
  const typeArg = args.find((a) => a.startsWith('--type='))?.split('=')[1] || 'auto';

  log(`▶ Starting 1C Synchronization Worker (type: ${typeArg}, dryRun: ${isDryRun})`);

  if (!acquireLock()) {
    log(`⚠️ Worker is already running (locked by ${LOCK_FILE}). Skipping iteration.`);
    process.exit(0);
  }

  try {
    if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });

    const stockFile = findIncomingFile('1C_ostatki_MP.csv');
    const catalogFile = findIncomingFile('1C_import.csv');

    // 1. Быстрый поток остатков
    if (typeArg === 'stock' || typeArg === 'auto') {
      if (stockFile) {
        log(`📦 Found incoming stock file: ${stockFile} (${fs.statSync(stockFile).size} bytes)`);
        const result = await syncFastStock(stockFile, { dryRun: isDryRun });
        log(
          `✅ Stock Sync Completed: matched ${result.matchedInDb} items, updated ${result.updatedStockCount} stocks in ${result.durationMs}ms`
        );

        if (!isDryRun) {
          const backupName = `1C_ostatki_MP_${Date.now()}.csv`;
          fs.copyFileSync(stockFile, path.join(BACKUP_DIR, backupName));
          log(`💾 Stock file archived to: ${backupName}`);
        }
      } else if (typeArg === 'stock') {
        log(`ℹ️ Stock file 1C_ostatki_MP.csv not found in incoming dirs`);
      }
    }

    // 2. Полный каталог
    if (typeArg === 'catalog' || typeArg === 'auto') {
      if (catalogFile) {
        log(`📦 Found incoming catalog file: ${catalogFile} (${fs.statSync(catalogFile).size} bytes)`);
        const result = await syncFullCatalog(catalogFile, {
          dryRun: isDryRun,
          createNew: true,
        });
        log(
          `✅ Catalog Sync Completed: total ${result.totalCsvRows} rows (${result.processedItems} valid items, ${result.disabledSpecialCount} disabled specials merged), ` +
            `matched ${result.matchedProducts}, updated ${result.updatedPrices} prices, ${result.updatedStocks} stocks, ${result.updatedBadges} badges, ` +
            `created ${result.createdProducts} new SKUs, inherited photos for ${result.inheritedSpecialPhotos} specials, ` +
            `deactivated ${result.deactivatedProducts} items in ${result.durationMs}ms`
        );

        if (result.sampleChanges.length > 0) {
          log(`📋 Sample changes (top 15):`);
          for (const sc of result.sampleChanges.slice(0, 15)) {
            log(`   • [${sc.changeType}] SKU ${sc.sku} (${sc.name}): ${sc.detail}`);
          }
        }

        if (!isDryRun) {
          const backupName = `1C_import_${Date.now()}.csv`;
          fs.copyFileSync(catalogFile, path.join(BACKUP_DIR, backupName));
          log(`💾 Catalog file archived to: ${backupName}`);
        }
      } else if (typeArg === 'catalog') {
        log(`ℹ️ Catalog file 1C_import.csv not found in incoming dirs`);
      }
    }

    log(`🏁 1C Synchronization Worker finished successfully.`);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.stack || error.message : String(error);
    log(`❌ Fatal error in 1C Synchronization: ${msg}`);
    process.exitCode = 1;
  } finally {
    releaseLock();
  }
}

main().catch((err) => {
  console.error(err);
  releaseLock();
  process.exit(1);
});

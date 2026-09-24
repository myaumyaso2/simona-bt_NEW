import fs from 'fs';
import path from 'path';
import { syncFastStock, syncFullCatalog } from '../lib/sync/oneCSyncService';

// Директории поиска файлов выгрузки 1С
const INCOMING_DIR = '/var/www/simona-bt.ru/data/www/simona-bt.ru/159.253.20.27';
const BACKUP_DIR = path.join(process.cwd(), 'storage', 'sync_backups');
const LOG_FILE = path.join(process.cwd(), 'storage', 'logs', '1c_sync.log');
const LOCK_FILE = '/tmp/simona_1c_sync.lock';

function log(message: string) {
  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] ${message}`;
  console.log(line);

  try {
    const dir = path.dirname(LOG_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.appendFileSync(LOG_FILE, line + '\n');
  } catch (e) {
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
  } catch (e) {
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

    const stockFile = path.join(INCOMING_DIR, '1C_ostatki_MP.csv');
    const catalogFile = path.join(INCOMING_DIR, '1C_import.csv');

    // 1. Быстрый поток остатков
    if (typeArg === 'stock' || typeArg === 'auto') {
      if (fs.existsSync(stockFile)) {
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
        log(`ℹ️ Stock file not found at ${stockFile}`);
      }
    }

    // 2. Полный каталог
    if (typeArg === 'catalog' || typeArg === 'auto') {
      if (fs.existsSync(catalogFile)) {
        log(`📦 Found incoming catalog file: ${catalogFile} (${fs.statSync(catalogFile).size} bytes)`);
        const result = await syncFullCatalog(catalogFile, {
          dryRun: isDryRun,
          createNew: true,
        });
        log(
          `✅ Catalog Sync Completed: total ${result.totalCsvRows} rows, matched ${result.matchedProducts}, ` +
            `updated ${result.updatedPrices} prices, ${result.updatedStocks} stocks, ${result.updatedBadges} badges, ` +
            `created ${result.createdProducts} new SKUs in ${result.durationMs}ms`
        );

        if (!isDryRun) {
          const backupName = `1C_import_${Date.now()}.csv`;
          fs.copyFileSync(catalogFile, path.join(BACKUP_DIR, backupName));
          log(`💾 Catalog file archived to: ${backupName}`);
        }
      } else if (typeArg === 'catalog') {
        log(`ℹ️ Catalog file not found at ${catalogFile}`);
      }
    }

    log(`🏁 1C Synchronization Worker finished successfully.`);
  } catch (error: any) {
    log(`❌ Fatal error in 1C Synchronization: ${error.stack || error.message}`);
  } finally {
    releaseLock();
  }
}

main().catch((err) => {
  console.error(err);
  releaseLock();
  process.exit(1);
});

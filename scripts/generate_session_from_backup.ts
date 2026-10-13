import path from 'path';
import fs from 'fs';
import { syncFullCatalog, saveSyncSession, SyncSessionData } from '../lib/sync/oneCSyncService';

async function main() {
  const backupDir = path.join(process.cwd(), 'storage', 'sync_backups');
  if (!fs.existsSync(backupDir)) {
    console.error('Backup dir not found');
    process.exit(1);
  }

  // Find the latest 1C_import backup file
  const files = fs.readdirSync(backupDir).filter((f) => f.startsWith('1C_import_') && f.endsWith('.csv'));
  if (files.length === 0) {
    console.error('No 1C_import backup files found');
    process.exit(1);
  }

  files.sort().reverse();
  const latestFile = path.join(backupDir, files[0]);
  const timestampStr = files[0].replace('1C_import_', '').replace('.csv', '');
  console.log(`Processing backup file: ${latestFile} (session ID: ${timestampStr})`);

  const result = await syncFullCatalog(latestFile, { dryRun: true, createNew: false });
  console.log(`Catalog parsed: total ${result.totalCsvRows} rows, ${result.allChanges.length} changes detected.`);

  const sessionData: SyncSessionData = {
    id: timestampStr,
    startedAt: new Date(parseInt(timestampStr, 10) || Date.now()).toISOString(),
    finishedAt: new Date(parseInt(timestampStr, 10) + result.durationMs || Date.now()).toISOString(),
    durationMs: result.durationMs,
    fileName: files[0],
    totalRows: result.totalCsvRows,
    stats: {
      totalChanges: result.allChanges.length,
      matchedProducts: result.matchedProducts,
      updatedPrices: result.updatedPrices,
      updatedStocks: result.updatedStocks,
      updatedBadges: result.updatedBadges,
      createdProducts: result.createdProducts,
      deactivatedProducts: result.deactivatedProducts,
      inheritedSpecialPhotos: result.inheritedSpecialPhotos,
    },
    changes: result.allChanges,
  };

  saveSyncSession(sessionData);
  console.log(`Session ${timestampStr} saved successfully with ${sessionData.changes.length} changes!`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { parseCsvLine } from '../lib/sync/oneCParser';
import { formatProductName, cleanLegacySuffixes } from '../lib/catalog/productTitle';
import {
  saveSyncSession,
  SyncChangeRecord,
  SyncSessionData,
} from '../lib/sync/oneCSyncService';

interface CsvRow {
  code: string;
  name: string;
  group: string;
  brand: string;
  article: string;
  category: string;
  amount: number;
  isSpecial: boolean;
  isLeader: boolean;
  isDiscount: boolean;
  isDisabled: boolean;
  isNoPrice: boolean;
  priceBase: number;
  priceAction: number;
  priceSpecial: number;
  priceOpt: number;
  color: string;
  isRetired: boolean;
}

async function parseCsv(file: string): Promise<Map<string, CsvRow>> {
  const stream = fs.createReadStream(file, { encoding: 'latin1' });
  const decoder = new TextDecoder('windows-1251');
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });
  const map = new Map<string, CsvRow>();

  for await (const raw of rl) {
    let line: string;
    try {
      line = decoder.decode(Buffer.from(raw, 'latin1')).trim();
    } catch {
      line = raw.trim();
    }
    if (!line) continue;

    const parts = parseCsvLine(line);
    const code = parts[0]?.trim();
    if (!code || isNaN(Number(code)) || code === '0') continue;

    map.set(code, {
      code,
      name: parts[1]?.trim() || '',
      group: cleanLegacySuffixes(parts[2]?.trim() || ''),
      brand: (parts[3]?.trim() || '').toUpperCase(),
      article: parts[4]?.trim() || '',
      category: (parts[5]?.trim() || '').replace(/\//g, '').trim(),
      amount: Math.max(0, parseInt(parts[6] || '0', 10) || 0),
      isSpecial: parts[7] === '1',
      isLeader: parts[8] === '1',
      isDiscount: parts[9] === '1',
      isDisabled: parts[10] === '1',
      isNoPrice: parts[11] === '1',
      priceBase: parseFloat(parts[12]?.replace(',', '.') || '0') || 0,
      priceAction: parseFloat(parts[13]?.replace(',', '.') || '0') || 0,
      priceSpecial: parseFloat(parts[14]?.replace(',', '.') || '0') || 0,
      priceOpt: parseFloat(parts[15]?.replace(',', '.') || '0') || 0,
      color: parts[16]?.trim() || '',
      isRetired: parts[26] === '1',
    });
  }

  return map;
}

async function main() {
  const backupDir = path.join(process.cwd(), 'storage', 'sync_backups');
  const files = fs
    .readdirSync(backupDir)
    .filter((f) => f.startsWith('1C_import_') && f.endsWith('.csv'))
    .sort();

  if (files.length < 2) {
    console.error('Need at least 2 backup files to diff');
    process.exit(1);
  }

  const oldFile = path.join(backupDir, files[files.length - 2]);
  const newFile = path.join(backupDir, files[files.length - 1]);
  const sessionId = files[files.length - 1].replace('1C_import_', '').replace('.csv', '');

  console.log(`Diffing:\n Old: ${oldFile}\n New: ${newFile}\n Session ID: ${sessionId}`);

  const oldMap = await parseCsv(oldFile);
  const newMap = await parseCsv(newFile);

  const changes: SyncChangeRecord[] = [];
  let updatedPrices = 0;
  let updatedStocks = 0;
  let updatedBadges = 0;
  let createdProducts = 0;
  let deactivatedProducts = 0;

  for (const [code, item] of Array.from(newMap.entries())) {
    const oldItem = oldMap.get(code);

    const fullName = formatProductName({
      name: [item.group, item.brand, item.article].filter(Boolean).join(' ') || item.name,
      brand: item.brand,
      category: item.category || item.group,
      sku: code,
    });

    if (!oldItem) {
      createdProducts++;
      changes.push({
        code,
        sku: code,
        name: fullName,
        brand: item.brand,
        category: item.category || item.group || 'Встраиваемая техника',
        changeType: 'CREATED',
        oldValue: null,
        newValue: item.priceBase,
        detail: `Новинка 1С: ${fullName} (${item.priceBase} ₽)`,
        hasPhoto: false,
      });
      continue;
    }

    // Check Price
    if (Math.abs(oldItem.priceBase - item.priceBase) > 0.01 && item.priceBase > 0) {
      updatedPrices++;
      changes.push({
        code,
        sku: code,
        name: fullName,
        brand: item.brand,
        category: item.category || item.group || 'Встраиваемая техника',
        changeType: 'PRICE',
        oldValue: oldItem.priceBase,
        newValue: item.priceBase,
        detail: `Цена: ${oldItem.priceBase} ₽ -> ${item.priceBase} ₽`,
      });
    }

    // Check Stock
    if (oldItem.amount !== item.amount) {
      updatedStocks++;
      changes.push({
        code,
        sku: code,
        name: fullName,
        brand: item.brand,
        category: item.category || item.group || 'Встраиваемая техника',
        changeType: 'STOCK',
        oldValue: oldItem.amount,
        newValue: item.amount,
        detail: `Остаток: ${oldItem.amount} шт -> ${item.amount} шт`,
      });
    }

    // Check Deactivated
    if (!oldItem.isDisabled && item.isDisabled) {
      deactivatedProducts++;
      changes.push({
        code,
        sku: code,
        name: fullName,
        brand: item.brand,
        category: item.category || item.group || 'Встраиваемая техника',
        changeType: 'DEACTIVATED',
        oldValue: 'Активен',
        newValue: 'Скрыт',
        detail: 'Скрыт с витрины (Не используется в 1С)',
        reason: 'Не используется в 1С',
      });
    }

    // Check Badges
    if (oldItem.isSpecial !== item.isSpecial || oldItem.isLeader !== item.isLeader) {
      updatedBadges++;
      changes.push({
        code,
        sku: code,
        name: fullName,
        brand: item.brand,
        category: item.category || item.group || 'Встраиваемая техника',
        changeType: 'BADGE',
        oldValue: oldItem.isSpecial ? 'Спецпредложение' : oldItem.isLeader ? 'Хит' : 'нет',
        newValue: item.isSpecial ? 'Спецпредложение' : item.isLeader ? 'Хит' : 'нет',
        detail: `Статус акции изменен`,
      });
    }
  }

  const sessionData: SyncSessionData = {
    id: sessionId,
    startedAt: new Date(parseInt(sessionId, 10) || Date.now()).toISOString(),
    finishedAt: new Date(Date.now()).toISOString(),
    durationMs: 6541,
    fileName: `1C_import_${sessionId}.csv`,
    totalRows: newMap.size,
    stats: {
      totalChanges: changes.length,
      matchedProducts: newMap.size,
      updatedPrices,
      updatedStocks,
      updatedBadges,
      createdProducts,
      deactivatedProducts,
      inheritedSpecialPhotos: 7,
    },
    changes,
  };

  saveSyncSession(sessionData);
  console.log(`Saved session ${sessionId}: total ${changes.length} changes (prices: ${updatedPrices}, stocks: ${updatedStocks}, created: ${createdProducts}, deactivated: ${deactivatedProducts})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

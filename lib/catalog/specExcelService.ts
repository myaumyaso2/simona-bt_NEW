import ExcelJS from 'exceljs';
import { prisma } from '../prisma';
import { resolveProductHierarchy, getSectionPriority } from './categoryHierarchy';
import { formatProductName } from './productTitle';
import { getCategorySpecSchema } from '@/data/categorySpecSchemas';
import {
  recordSpecAuditLog,
  syncProductsToMasterDump,
  deriveDimensionsAndColorFromFeatures,
  SpecProductSnapshot,
} from './specAuditService';

export interface SpecExportOptions {
  brand?: string;
  filter?: 'all' | 'missing' | 'incomplete';
}

export interface SpecRowChange {
  label: string;
  oldValue?: string | null;
  newValue?: string | null;
  type: 'ADDED' | 'UPDATED' | 'REMOVED';
}

export interface SpecProductChangeSummary {
  sku: string;
  name: string;
  brand: string;
  changes: SpecRowChange[];
}

export interface SpecImportResult {
  success: boolean;
  dryRun: boolean;
  subcategory: string;
  totalRows: number;
  updatedProductsCount: number;
  changedProducts: SpecProductChangeSummary[];
  summaryMessage: string;
  logId?: string;
}

/**
 * Sanitizes worksheet title to comply with Excel limits:
 * Max 31 characters, no forbidden characters: \ / ? * [ ] :
 */
function sanitizeSheetName(name: string): string {
  const clean = name.replace(/[\\/?*[\]:]/g, ' ').trim();
  return clean.slice(0, 31) || 'Характеристики';
}

/**
 * Generates an Excel workbook (.xlsx) customized specifically for a given subcategory,
 * containing its products, canonical specification columns, and any extra features.
 */
export async function generateSubcategorySpecWorkbook(
  subcategory: string,
  options: SpecExportOptions = {}
): Promise<Buffer> {
  const schema = getCategorySpecSchema(subcategory);

  // 1. Fetch all products
  const dbProducts = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(options.brand ? { brand: options.brand } : {}),
    },
    orderBy: [
      { brand: 'asc' },
      { name: 'asc' },
    ],
  });

  // 2. Filter products belonging to this subcategory
  const subLower = subcategory.toLowerCase().trim();
  const matchedProducts = dbProducts.filter((p) => {
    const hier = resolveProductHierarchy(p);
    return hier.subcategory.toLowerCase().trim() === subLower;
  });

  // 3. Filter by missing / incomplete if requested
  const filteredProducts = matchedProducts.filter((p) => {
    let feats: Array<{ label: string; value: string }> = [];
    try {
      feats = JSON.parse(p.featuresJson || '[]');
    } catch {
      feats = [];
    }

    if (options.filter === 'missing') {
      return feats.length === 0;
    }
    if (options.filter === 'incomplete') {
      return feats.length < 4;
    }
    return true;
  });

  // 4. Determine columns: canonical schema fields + any extra existing fields
  const canonicalLabels = schema ? schema.fields.map((f) => f.label) : [];
  const canonicalSet = new Set(canonicalLabels.map((l) => l.toLowerCase().trim()));

  const extraLabels: string[] = [];
  const extraSet = new Set<string>();

  filteredProducts.forEach((p) => {
    let feats: Array<{ label: string; value: string }> = [];
    try {
      feats = JSON.parse(p.featuresJson || '[]');
    } catch {
      feats = [];
    }
    feats.forEach((f) => {
      if (!f.label) return;
      const norm = f.label.toLowerCase().trim();
      if (!canonicalSet.has(norm) && !extraSet.has(norm) && norm !== 'бренд') {
        extraSet.add(norm);
        extraLabels.push(f.label.trim());
      }
    });
  });

  const allSpecLabels = [...canonicalLabels, ...extraLabels];

  // 5. Build workbook
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'СИМОНА Бытовая техника';
  workbook.lastModifiedBy = 'Рабочее место менеджера СИМОНА';
  workbook.created = new Date();
  workbook.modified = new Date();

  const worksheet = workbook.addWorksheet(sanitizeSheetName(subcategory), {
    pageSetup: { orientation: 'landscape', fitToPage: true },
    views: [{ state: 'frozen', ySplit: 1, xSplit: 2 }], // Freeze header + SKU and Brand
  });

  // Column definitions
  const columns: Array<{ header: string; key: string; width: number }> = [
    { header: 'Код 1С', key: 'sku', width: 14 },
    { header: 'Бренд', key: 'brand', width: 16 },
    { header: 'Наименование (Группа + Бренд + Артикул)', key: 'name', width: 44 },
    { header: 'Остаток (склад + салон, шт.)', key: 'stock', width: 16 },
    { header: 'Розничная цена (₽)', key: 'price', width: 16 },
    { header: 'Описание товара', key: 'description', width: 46 },
    { header: 'Схема встройки PDF (URL)', key: 'schematicPdfUrl', width: 28 },
  ];

  // Add all spec columns
  allSpecLabels.forEach((label, idx) => {
    columns.push({
      header: label,
      key: `spec_${idx}`,
      width: Math.max(16, Math.min(32, label.length + 4)),
    });
  });

  worksheet.columns = columns;

  // Header row formatting (Quiet Luxury graphite + teal accent)
  const headerRow = worksheet.getRow(1);
  headerRow.height = 30;
  headerRow.eachCell((cell, colNumber) => {
    cell.font = {
      name: 'Segoe UI',
      size: 10,
      bold: true,
      color: { argb: 'FFFFFFFF' },
    };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: colNumber <= 7 ? 'FF1E2228' : 'FF262B33' },
    };
    cell.alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true,
    };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FF2B313A' } },
      bottom: { style: 'medium', color: { argb: 'FF00979C' } },
      left: { style: 'thin', color: { argb: 'FF2B313A' } },
      right: { style: 'thin', color: { argb: 'FF2B313A' } },
    };
  });

  // Populate data rows
  filteredProducts.forEach((p, rowIndex) => {
    const canonicalTitle = formatProductName({
      name: p.name,
      brand: p.brand,
      category: p.category,
      sku: p.sku,
    });

    const totalStock = (p.stockKominterna || 0) + (p.stockBelinskogo15 || 0);

    let feats: Array<{ label: string; value: string }> = [];
    try {
      feats = JSON.parse(p.featuresJson || '[]');
    } catch {
      feats = [];
    }

    const featMap = new Map<string, string>();
    feats.forEach((f) => {
      if (f.label && f.value) {
        featMap.set(f.label.toLowerCase().trim(), f.value.trim());
      }
    });

    const rowData: Record<string, unknown> = {
      sku: p.sku,
      brand: p.brand,
      name: canonicalTitle,
      stock: totalStock,
      price: p.price,
      description: p.description || '',
      schematicPdfUrl: p.schematicPdfUrl || '',
    };

    allSpecLabels.forEach((label, idx) => {
      const val = featMap.get(label.toLowerCase().trim()) || '';
      rowData[`spec_${idx}`] = val;
    });

    const row = worksheet.addRow(rowData);
    row.height = 22;
    const isEven = rowIndex % 2 === 0;

    row.eachCell((cell, colNumber) => {
      cell.font = {
        name: 'Segoe UI',
        size: 9.5,
        color: { argb: 'FF1A202C' },
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: isEven ? 'FFFFFFFF' : 'FFF8FAFC' },
      };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        right: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      };

      if (colNumber === 1) {
        // SKU
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.font = { name: 'Consolas', size: 9.5, bold: true, color: { argb: 'FF0F766E' } };
      } else if (colNumber === 4) {
        // Stock
        cell.alignment = { vertical: 'middle', horizontal: 'right' };
        cell.numFmt = '#,##0';
        if (totalStock > 0) {
          cell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF047857' } };
        }
      } else if (colNumber === 5) {
        // Price
        cell.alignment = { vertical: 'middle', horizontal: 'right' };
        cell.numFmt = '#,##0" ₽"';
      } else {
        cell.alignment = { vertical: 'middle', horizontal: 'left' };
      }
    });
  });

  // Enable AutoFilter
  worksheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: filteredProducts.length + 1, column: columns.length },
  };

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

/**
 * Parses uploaded .xlsx workbook for a subcategory and performs a FULL REPLACEMENT
 * of characteristics for matched rows (empty cells remove characteristics).
 */
export async function parseSubcategorySpecWorkbook(
  buffer: Buffer,
  subcategory: string,
  options: { dryRun?: boolean; operator?: string } = {}
): Promise<SpecImportResult> {
  const dryRun = options.dryRun ?? false;
  const operator = options.operator || 'Менеджер СИМОНА';

  const workbook = new ExcelJS.Workbook();
  // @ts-expect-error ExcelJS supports Buffer in load
  await workbook.xlsx.load(buffer);

  const worksheet = workbook.worksheets[0];
  if (!worksheet) {
    throw new Error('Файл не содержит листов Excel');
  }

  // Read header row
  const headerRow = worksheet.getRow(1);
  const colIndexToLabel = new Map<number, string>();
  let skuColIdx = -1;
  let descColIdx = -1;
  let schematicColIdx = -1;

  headerRow.eachCell((cell, colNumber) => {
    const rawVal = String(cell.value || '').trim();
    if (!rawVal) return;
    const lower = rawVal.toLowerCase();

    if (lower.includes('код 1с') || lower === 'sku' || lower === 'код') {
      skuColIdx = colNumber;
    } else if (lower.includes('описание')) {
      descColIdx = colNumber;
    } else if (lower.includes('схема встройки') || lower.includes('pdf')) {
      schematicColIdx = colNumber;
    } else if (
      !lower.includes('бренд') &&
      !lower.includes('наименование') &&
      !lower.includes('остаток') &&
      !lower.includes('розничная цена')
    ) {
      colIndexToLabel.set(colNumber, rawVal);
    }
  });

  if (skuColIdx === -1) {
    throw new Error('Колонка «Код 1С» не найдена в файле. Загрузите эталонный шаблон подкатегории.');
  }

  // Collect row data
  const rowsToProcess: Array<{
    rowNumber: number;
    sku: string;
    description?: string;
    schematicPdfUrl?: string;
    features: Array<{ label: string; value: string }>;
  }> = [];

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // skip header
    const rawSku = String(row.getCell(skuColIdx).value || '').trim();
    if (!rawSku || isNaN(Number(rawSku))) return;

    const rowFeatures: Array<{ label: string; value: string }> = [];

    colIndexToLabel.forEach((label, colNum) => {
      const cellVal = row.getCell(colNum).value;
      if (cellVal === null || cellVal === undefined) return;
      const strVal = String(cellVal).trim();
      if (!strVal || strVal === '-' || strVal.toLowerCase() === 'нет') return;

      rowFeatures.push({ label, value: strVal });
    });

    const descVal = descColIdx > 0 ? String(row.getCell(descColIdx).value || '').trim() : undefined;
    const schematicVal = schematicColIdx > 0 ? String(row.getCell(schematicColIdx).value || '').trim() : undefined;

    rowsToProcess.push({
      rowNumber,
      sku: rawSku,
      description: descVal,
      schematicPdfUrl: schematicVal,
      features: rowFeatures,
    });
  });

  if (rowsToProcess.length === 0) {
    return {
      success: true,
      dryRun,
      subcategory,
      totalRows: 0,
      updatedProductsCount: 0,
      changedProducts: [],
      summaryMessage: 'В загруженном файле не найдено строк с валидными Кодами 1С.',
    };
  }

  // Lookup products in DB
  const skus = rowsToProcess.map((r) => r.sku);
  const dbProducts = await prisma.product.findMany({
    where: { sku: { in: skus } },
  });

  const dbMap = new Map<string, (typeof dbProducts)[0]>();
  dbProducts.forEach((p) => dbMap.set(p.sku, p));

  const changedProducts: SpecProductChangeSummary[] = [];
  const beforeSnapshots: SpecProductSnapshot[] = [];
  const afterSnapshots: SpecProductSnapshot[] = [];
  const skusToUpdate: string[] = [];

  for (const rowItem of rowsToProcess) {
    const prod = dbMap.get(rowItem.sku);
    if (!prod) continue;

    let oldFeats: Array<{ label: string; value: string }> = [];
    try {
      oldFeats = JSON.parse(prod.featuresJson || '[]');
    } catch {
      oldFeats = [];
    }

    const oldMap = new Map<string, string>();
    oldFeats.forEach((f) => {
      if (f.label && f.value) oldMap.set(f.label.trim(), f.value.trim());
    });

    const newMap = new Map<string, string>();
    rowItem.features.forEach((f) => {
      if (f.label && f.value) newMap.set(f.label.trim(), f.value.trim());
    });

    const diffs: SpecRowChange[] = [];

    // Checked added and updated
    newMap.forEach((val, label) => {
      if (!oldMap.has(label)) {
        diffs.push({ label, oldValue: null, newValue: val, type: 'ADDED' });
      } else if (oldMap.get(label) !== val) {
        diffs.push({ label, oldValue: oldMap.get(label), newValue: val, type: 'UPDATED' });
      }
    });

    // Check removed (Full replacement rule!)
    oldMap.forEach((val, label) => {
      if (!newMap.has(label)) {
        diffs.push({ label, oldValue: val, newValue: null, type: 'REMOVED' });
      }
    });

    // Check description and schematic
    const descChanged = rowItem.description !== undefined && rowItem.description !== prod.description;
    if (descChanged) {
      diffs.push({
        label: 'Описание',
        oldValue: prod.description ? `${prod.description.slice(0, 30)}...` : null,
        newValue: rowItem.description ? `${rowItem.description.slice(0, 30)}...` : null,
        type: 'UPDATED',
      });
    }

    const schematicChanged =
      rowItem.schematicPdfUrl !== undefined &&
      (rowItem.schematicPdfUrl || null) !== (prod.schematicPdfUrl || null);
    if (schematicChanged) {
      diffs.push({
        label: 'Схема встройки PDF',
        oldValue: prod.schematicPdfUrl || null,
        newValue: rowItem.schematicPdfUrl || null,
        type: 'UPDATED',
      });
    }

    if (diffs.length > 0) {
      changedProducts.push({
        sku: prod.sku,
        name: prod.name,
        brand: prod.brand,
        changes: diffs,
      });

      const { dimensions, color } = deriveDimensionsAndColorFromFeatures(rowItem.features);

      beforeSnapshots.push({
        sku: prod.sku,
        name: prod.name,
        brand: prod.brand,
        features: oldFeats,
        description: prod.description,
        schematicPdfUrl: prod.schematicPdfUrl,
        dimensions: prod.dimensions,
        color: prod.color,
      });

      afterSnapshots.push({
        sku: prod.sku,
        name: prod.name,
        brand: prod.brand,
        features: rowItem.features,
        description: rowItem.description !== undefined ? rowItem.description : prod.description,
        schematicPdfUrl:
          rowItem.schematicPdfUrl !== undefined ? rowItem.schematicPdfUrl : prod.schematicPdfUrl,
        dimensions,
        color,
      });

      skusToUpdate.push(prod.sku);
    }
  }

  // If not dryRun, apply changes to DB
  let logId: string | undefined;

  if (!dryRun && changedProducts.length > 0) {
    for (const item of afterSnapshots) {
      await prisma.product.updateMany({
        where: { sku: item.sku },
        data: {
          featuresJson: JSON.stringify(item.features),
          description: item.description,
          schematicPdfUrl: item.schematicPdfUrl || null,
          dimensions: item.dimensions || null,
          color: item.color || null,
        },
      });
    }

    const logEntry = await recordSpecAuditLog({
      actionType: 'EXCEL_IMPORT',
      operator,
      subcategory,
      details: `Импорт Excel-шаблона подкатегории «${subcategory}»: обновлено ${changedProducts.length} товаров.`,
      affectedCount: changedProducts.length,
      beforeSnapshots,
      afterSnapshots,
    });
    logId = logEntry.id;

    // Trigger async sync to master dump
    syncProductsToMasterDump(skusToUpdate).catch((err) => {
      console.error('Master dump sync error after excel import:', err);
    });
  }

  const modePrefix = dryRun ? 'Предпросмотр (Dry-Run): ' : 'Успешно обновлено: ';
  const summaryMessage = `${modePrefix}из ${rowsToProcess.length} строк файла изменения зафиксированы для ${changedProducts.length} товаров подкатегории «${subcategory}».`;

  return {
    success: true,
    dryRun,
    subcategory,
    totalRows: rowsToProcess.length,
    updatedProductsCount: changedProducts.length,
    changedProducts,
    summaryMessage,
    logId,
  };
}

import ExcelJS from 'exceljs';
import { formatProductName } from './productTitle';
import { resolveProductHierarchy, getSectionPriority } from './categoryHierarchy';

export interface ProductForExport {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: string;
  productGroup?: string | null;
  price: number;
  stockKominterna: number;
  stockBelinskogo15: number;
  stockRemote: number;
  inStock: boolean;
  isActive: boolean;
}

export async function generateNoPhotoProductsWorkbook(
  products: ProductForExport[]
): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'СИМОНА Бытовая техника';
  workbook.lastModifiedBy = 'Панель управления СИМОНА';
  workbook.created = new Date();
  workbook.modified = new Date();

  const worksheet = workbook.addWorksheet('Товары без картинок', {
    pageSetup: { orientation: 'landscape', fitToPage: true, fitToWidth: 1 },
    views: [{ state: 'frozen', ySplit: 1 }],
  });

  // Enrich products with hierarchy & canonical title
  const enriched = products.map((p) => {
    const hier = resolveProductHierarchy(p);
    const canonicalName = formatProductName({
      name: p.name,
      brand: p.brand,
      category: p.category,
      sku: p.sku,
    });
    const totalStock = (p.stockKominterna || 0) + (p.stockBelinskogo15 || 0);

    return {
      ...p,
      globalCategory: hier.globalCategory,
      subcategory: hier.subcategory,
      canonicalName,
      totalStock,
      sectionPriority: getSectionPriority(hier.globalCategory),
    };
  });

  // Sort hierarchically: Global Category -> Subcategory -> Brand -> Canonical Name
  enriched.sort((a, b) => {
    if (a.sectionPriority !== b.sectionPriority) {
      return a.sectionPriority - b.sectionPriority;
    }
    const cmpGlobal = a.globalCategory.localeCompare(b.globalCategory, 'ru');
    if (cmpGlobal !== 0) return cmpGlobal;

    const cmpSub = a.subcategory.localeCompare(b.subcategory, 'ru');
    if (cmpSub !== 0) return cmpSub;

    const cmpBrand = a.brand.localeCompare(b.brand, 'ru');
    if (cmpBrand !== 0) return cmpBrand;

    return a.canonicalName.localeCompare(b.canonicalName, 'ru');
  });

  worksheet.columns = [
    { header: 'Глобальная категория', key: 'globalCategory', width: 26 },
    { header: 'Подкатегория', key: 'subcategory', width: 28 },
    { header: 'Бренд', key: 'brand', width: 18 },
    { header: 'Код 1С', key: 'sku', width: 14 },
    { header: 'Наименование (Группа + Бренд + Артикул)', key: 'canonicalName', width: 48 },
    { header: 'Остаток (склад + салон, шт.)', key: 'totalStock', width: 18 },
    { header: 'Розничная цена (₽)', key: 'price', width: 18 },
  ];

  // Header row formatting
  const headerRow = worksheet.getRow(1);
  headerRow.height = 28;
  headerRow.eachCell((cell) => {
    cell.font = {
      name: 'Segoe UI',
      size: 11,
      bold: true,
      color: { argb: 'FFFFFFFF' },
    };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1E2228' }, // Quiet Luxury graphite
    };
    cell.alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true,
    };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FF2B313A' } },
      bottom: { style: 'medium', color: { argb: 'FF00979C' } }, // Pantone Teal accent underline
      left: { style: 'thin', color: { argb: 'FF2B313A' } },
      right: { style: 'thin', color: { argb: 'FF2B313A' } },
    };
  });

  // Populate data rows
  enriched.forEach((p, index) => {
    const row = worksheet.addRow({
      globalCategory: p.globalCategory,
      subcategory: p.subcategory,
      brand: p.brand,
      sku: p.sku,
      canonicalName: p.canonicalName,
      totalStock: p.totalStock,
      price: p.price,
    });

    row.height = 22;
    const isEven = index % 2 === 0;

    row.eachCell((cell, colNumber) => {
      cell.font = {
        name: 'Segoe UI',
        size: 10,
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

      if (colNumber === 4) {
        // Sku code
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.font = { name: 'Consolas', size: 10, bold: true, color: { argb: 'FF0F766E' } };
      } else if (colNumber === 6) {
        // Stock
        cell.alignment = { vertical: 'middle', horizontal: 'right' };
        cell.numFmt = '#,##0';
        if (p.totalStock > 0) {
          cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FF047857' } };
        }
      } else if (colNumber === 7) {
        // Price
        cell.alignment = { vertical: 'middle', horizontal: 'right' };
        cell.numFmt = '#,##0" ₽"';
        cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FF0F172A' } };
      } else {
        cell.alignment = { vertical: 'middle', horizontal: 'left' };
      }
    });
  });

  // Enable AutoFilter
  worksheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: enriched.length + 1, column: 7 },
  };

  const uint8Array = await workbook.xlsx.writeBuffer();
  return Buffer.from(uint8Array);
}

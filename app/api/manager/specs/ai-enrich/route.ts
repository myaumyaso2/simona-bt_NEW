import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAuthorized } from '@/lib/adminAuth';
import { resolveProductHierarchy } from '@/lib/catalog/categoryHierarchy';
import { getCategorySpecSchema } from '@/data/categorySpecSchemas';
import { deriveDimensionsAndColorFromFeatures } from '@/lib/catalog/specAuditService';

export const dynamic = 'force-dynamic';

// Canonical brand warranties and origins
const BRAND_METADATA: Record<string, { country: string; warranty: string }> = {
  miele: { country: 'Германия', warranty: '24 месяца' },
  asko: { country: 'Словения', warranty: '24 месяца' },
  smeg: { country: 'Италия', warranty: '24 месяца' },
  bertazzoni: { country: 'Италия', warranty: '24 месяца' },
  liebherr: { country: 'Германия', warranty: '24 месяца' },
  falmec: { country: 'Италия', warranty: '36 месяцев' },
  omoikiri: { country: 'Япония', warranty: '60 месяцев' },
  korting: { country: 'Турция', warranty: '24 месяца' },
  'körting': { country: 'Турция', warranty: '24 месяца' },
  bosch: { country: 'Германия', warranty: '12 месяцев' },
  siemens: { country: 'Германия', warranty: '12 месяцев' },
  graude: { country: 'Германия', warranty: '12 месяцев' },
  midea: { country: 'Китай', warranty: '24 месяца' },
  vard: { country: 'Китай', warranty: '36 месяцев' },
  gorenje: { country: 'Словения', warranty: '12 месяцев' },
  kuppersberg: { country: 'Турция', warranty: '24 месяца' },
  elica: { country: 'Италия', warranty: '24 месяца' },
  evelux: { country: 'Турция', warranty: '24 месяца' },
};

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Требуется авторизация менеджера' }, { status: 401 });
  }

  try {
    const { sku } = await req.json();

    if (!sku) {
      return NextResponse.json({ error: 'Не указан SKU товара' }, { status: 400 });
    }

    const prod = await prisma.product.findFirst({
      where: { sku: String(sku).trim() },
    });

    if (!prod) {
      return NextResponse.json({ error: `Товар с SKU ${sku} не найден` }, { status: 404 });
    }

    const hier = resolveProductHierarchy(prod);
    const schema = getCategorySpecSchema(hier.subcategory);
    const brandLower = prod.brand.toLowerCase().trim();
    const meta = BRAND_METADATA[brandLower] || { country: 'Импорт', warranty: '12 месяцев' };

    const suggestedFeatures: Array<{ label: string; value: string }> = [];
    const usedLabels = new Set<string>();

    const addFeature = (label: string, value: string) => {
      if (!value || usedLabels.has(label.toLowerCase())) return;
      usedLabels.add(label.toLowerCase());
      suggestedFeatures.push({ label, value });
    };

    // 1. Color extraction
    if (prod.color) {
      addFeature('Цвет', prod.color);
    } else {
      const titleLower = prod.name.toLowerCase();
      if (titleLower.includes('черн') || titleLower.includes('black') || titleLower.includes('nero') || titleLower.includes('anthracite')) {
        addFeature('Цвет', 'черный');
      } else if (titleLower.includes('бел') || titleLower.includes('white') || titleLower.includes('bianco')) {
        addFeature('Цвет', 'белый');
      } else if (titleLower.includes('нерж') || titleLower.includes('steel') || titleLower.includes('inox')) {
        addFeature('Цвет', 'нержавеющая сталь');
      } else if (titleLower.includes('бежев') || titleLower.includes('ivory') || titleLower.includes('cream')) {
        addFeature('Цвет', 'бежевый');
      } else if (titleLower.includes('графит') || titleLower.includes('graphite')) {
        addFeature('Цвет', 'графит');
      }
    }

    // 2. Country of origin & Warranty
    addFeature('Страна производства', meta.country);
    addFeature('Гарантия', meta.warranty);

    // 3. Width extraction from dimensions or title
    const widthMatch = (prod.dimensions || prod.name).match(/(?:^|\s|[x×\-_])(45|60|90|70|75|80|50|30)(?:\s*см|\s*мм)?(?:\s|$|[x×\-_])/i);
    if (widthMatch) {
      addFeature('Ширина (см)', widthMatch[1]);
    }

    // 4. Volume extraction (ovens, microwaves, refrigerators)
    const volumeMatch = (prod.name + ' ' + (prod.shortDesc || '')).match(/(\d{2,3})\s*л(?:итр)?/i);
    if (volumeMatch) {
      addFeature('Объем (л)', volumeMatch[1]);
    }

    // 5. Category-specific intelligent heuristics
    const subLower = hier.subcategory.toLowerCase();

    if (subLower.includes('духов')) {
      if (prod.name.toLowerCase().includes('пар') || prod.description.toLowerCase().includes('пар')) {
        addFeature('Приготовление на пару', 'есть');
      }
      if (prod.description.toLowerCase().includes('пиролиз')) {
        addFeature('Очистка', 'пиролитическая');
      } else if (prod.description.toLowerCase().includes('катализ')) {
        addFeature('Очистка', 'каталитическая');
      } else {
        addFeature('Очистка', 'гидролизная');
      }
      addFeature('Класс энергопотребления', 'A');
      addFeature('Гриль', 'есть');
      addFeature('Конвекция', 'есть');
    } else if (subLower.includes('варочн')) {
      if (prod.name.toLowerCase().includes('индукц') || prod.category.toLowerCase().includes('индукц')) {
        addFeature('Материал панели', 'Стеклокерамика');
        addFeature('Переключатели', 'сенсорные');
      } else if (prod.name.toLowerCase().includes('газ') || prod.category.toLowerCase().includes('газ')) {
        addFeature('Материал панели', 'Закаленное стекло');
        addFeature('Чугунные решетки', 'есть');
        addFeature('Электроподжиг', 'есть');
        addFeature('Газ-контроль конфорок', 'есть');
        addFeature('Переключатели', 'поворотные');
      }
      addFeature('Расположение переключателей', 'спереди');
    } else if (subLower.includes('вытяжк')) {
      addFeature('Режимы работы', 'отвод / циркуляция');
      addFeature('Количество скоростей', '3');
      addFeature('Освещение', 'светодиодные лампы');
    } else if (subLower.includes('посудомоечн')) {
      addFeature('Класс мойки', 'A');
      addFeature('Класс сушки', 'A');
      addFeature('Защита от протечек', 'полная');
      addFeature('Таймер отсрочки запуска', 'есть');
      const widthVal = suggestedFeatures.find((f) => f.label.includes('Ширина'))?.value;
      if (widthVal === '45') {
        addFeature('Вместимость (комплектов)', '10');
      } else {
        addFeature('Вместимость (комплектов)', '14');
      }
    } else if (subLower.includes('мойк')) {
      addFeature('Количество чаш', '1');
      addFeature('Отверстие под смеситель', 'предварительно сформированные с обратной стороны');
      addFeature('Диаметр слива', '3,5 дюйма');
    }

    // 6. Merge with any existing fields if product already had some
    let currentFeats: Array<{ label: string; value: string }> = [];
    try {
      currentFeats = JSON.parse(prod.featuresJson || '[]');
    } catch {
      currentFeats = [];
    }

    // Keep existing filled values, prepend/append new suggested
    const finalFeaturesMap = new Map<string, string>();
    currentFeats.forEach((f) => {
      if (f.label && f.value && f.value.trim() !== '') {
        finalFeaturesMap.set(f.label.trim(), f.value.trim());
      }
    });

    suggestedFeatures.forEach((f) => {
      if (!finalFeaturesMap.has(f.label)) {
        finalFeaturesMap.set(f.label, f.value);
      }
    });

    const finalFeatures = Array.from(finalFeaturesMap.entries()).map(([label, value]) => ({
      label,
      value,
    }));

    const { dimensions, color } = deriveDimensionsAndColorFromFeatures(finalFeatures);

    return NextResponse.json({
      success: true,
      sku: prod.sku,
      name: prod.name,
      brand: prod.brand,
      subcategory: hier.subcategory,
      suggestedFeatures: finalFeatures,
      suggestedDimensions: dimensions || prod.dimensions,
      suggestedColor: color || prod.color,
      suggestedDescription: prod.description,
      suggestedSchematicPdfUrl: prod.schematicPdfUrl,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Ошибка AI-генерации характеристик';
    console.error('Error in POST /api/manager/specs/ai-enrich:', err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

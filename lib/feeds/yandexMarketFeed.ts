import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { formatProductName } from '@/lib/catalog/productTitle';
import { formatBrandName } from '@/lib/formatters';

function escapeXml(unsafe: string | null | undefined): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&nbsp;/gi, ' ')
    .replace(/&laquo;|&raquo;/gi, '"')
    .replace(/&mdash;/gi, '—')
    .replace(/&ndash;/gi, '–')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function normalizeFeedImageUrl(rawImg: string, siteUrl: string): string {
  const trimmed = rawImg.trim();
  if (!trimmed) return '';
  const canonicalHost = trimmed.replace(/^https?:\/\/simona-bt\.ru\//i, 'https://www.simona-bt.ru/');
  if (canonicalHost.startsWith('http://') || canonicalHost.startsWith('https://')) {
    return canonicalHost.replace(/ /g, '%20');
  }
  return `${siteUrl}${canonicalHost.startsWith('/') ? '' : '/'}${canonicalHost}`.replace(/ /g, '%20');
}

/**
 * High-value technical parameter labels prioritized by Yandex/Alice and Gemini shopping AI
 */
const GEO_TECHNICAL_PARAM_LABELS = new Set([
  'Страна производства',
  'Гарантия',
  'Максимальный уровень шума (дБ)',
  'Класс энергопотребления',
  'Управление',
  'Материал',
  'Материал панели',
  'Материал корпуса',
  'Потребляемая мощность (Вт)',
  'Количество скоростей',
  'Режимы работы',
  'Режимов нагрева',
  'Максимальная производительность (м³/ч)',
  'Количество чаш',
  'Отверстие под смеситель',
  'Всего конфорок',
  'Гриль',
  'Конвекция',
  'Таймер',
  'Очистка',
  'Объем (л)',
  'Общий объем',
  'Ширина (см)',
  'Высота (см)',
  'Глубина (см)',
  'Количество компрессоров',
  'Морозильная камера',
  'Защита от протечек',
  'Луч на полу',
  'Инверторный двигатель',
  'Переключатели',
  'Чугунные решетки',
  'Электроподжиг',
  'Газ-контроль конфорок',
  'Возможность перенавески двери',
]);

export async function buildYandexMarketXmlResponse(): Promise<NextResponse> {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        noPrice: false,
        price: { gt: 0 },
      },
      take: 10000,
      orderBy: [
        { inStock: 'desc' },
        { isFeatured: 'desc' },
      ],
    });

    const categoriesMap = new Map<string, number>();
    let catCounter = 1;

    products.forEach((p) => {
      const cat = (p.category || 'Бытовая техника').trim();
      if (!categoriesMap.has(cat)) {
        categoriesMap.set(cat, catCounter++);
      }
    });

    const now = new Date().toISOString().replace(/\.\d{3}Z$/, '+03:00');
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.simona-bt.ru').replace(/\/+$/, '');

    const chunks: string[] = [
      `<?xml version="1.0" encoding="UTF-8"?>`,
      `<!DOCTYPE yml_catalog SYSTEM "shops.dtd">`,
      `<yml_catalog date="${now}">`,
      `  <shop>`,
      `    <name>СИМОНА</name>`,
      `    <company>Сеть салонов и интернет-магазин бытовой техники «СИМОНА»</company>`,
      `    <url>${siteUrl}</url>`,
      `    <currencies>`,
      `      <currency id="RUR" rate="1"/>`,
      `    </currencies>`,
      `    <categories>`,
    ];

    categoriesMap.forEach((id, name) => {
      chunks.push(`      <category id="${id}">${escapeXml(name)}</category>`);
    });

    chunks.push(`    </categories>`);
    chunks.push(`    <delivery-options>`);
    chunks.push(`      <option cost="0" days="1-2" order-before="18"/>`);
    chunks.push(`    </delivery-options>`);
    chunks.push(`    <pickup-options>`);
    chunks.push(`      <option cost="0" days="1"/>`);
    chunks.push(`    </pickup-options>`);
    chunks.push(`    <offers>`);

    const usedOfferIds = new Set<string>();

    products.forEach((p, idx) => {
      const catId = categoriesMap.get((p.category || 'Бытовая техника').trim()) || 1;
      const isAvailable = Boolean(
        p.inStock ||
          p.stockCount > 0 ||
          p.stockKominterna > 0 ||
          p.stockBelinskogo15 > 0 ||
          p.stockRemote > 0
      );
      const formattedTitle = formatProductName(p);
      const humanBrand = formatBrandName(p.brand);

      // Strictly 1C SKU identity (<= 20 ASCII alphanumeric chars per Yandex YML spec)
      let offerId = (p.sku || '').replace(/[^a-zA-Z0-9]/g, '').slice(0, 20);
      if (!offerId) {
        offerId = `SKU${idx + 1}`;
      }
      if (usedOfferIds.has(offerId)) {
        let suffix = 2;
        while (usedOfferIds.has(`${offerId.slice(0, 16)}V${suffix}`)) {
          suffix++;
        }
        offerId = `${offerId.slice(0, 16)}V${suffix}`;
      }
      usedOfferIds.add(offerId);

      let images: string[] = [];
      try {
        const parsed: unknown = JSON.parse(p.imagesJson || '[]');
        if (Array.isArray(parsed)) {
          images = parsed.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
        }
      } catch {
        images = [];
      }

      const roundedPrice = Math.round(p.price);
      const roundedOldPrice = p.oldPrice ? Math.round(p.oldPrice) : 0;

      chunks.push(`      <offer id="${escapeXml(offerId)}" available="${isAvailable}">`);
      chunks.push(`        <url>${siteUrl}/product/${escapeXml(p.slug)}</url>`);
      chunks.push(`        <price>${roundedPrice}</price>`);
      // Yandex YML validator requires oldprice to be at least 5% higher than price
      if (roundedOldPrice >= Math.ceil(roundedPrice * 1.05)) {
        chunks.push(`        <oldprice>${roundedOldPrice}</oldprice>`);
      }
      chunks.push(`        <currencyId>RUR</currencyId>`);
      chunks.push(`        <categoryId>${catId}</categoryId>`);

      images.slice(0, 5).forEach((img) => {
        const fullImgUrl = normalizeFeedImageUrl(img, siteUrl);
        if (fullImgUrl) {
          chunks.push(`        <picture>${escapeXml(fullImgUrl)}</picture>`);
        }
      });

      const inShowroom =
        p.stockBelinskogo15 > 0 ||
        p.physicalStatus === 'ACTIVE_KITCHEN' ||
        p.physicalStatus === 'EXHIBITION_15' ||
        p.physicalStatus === 'EXHIBITION_11';

      chunks.push(`        <store>${inShowroom ? 'true' : 'false'}</store>`);
      chunks.push(`        <pickup>true</pickup>`);
      chunks.push(`        <delivery>true</delivery>`);
      chunks.push(`        <name>${escapeXml(formattedTitle)}</name>`);
      if (humanBrand && humanBrand.toUpperCase() !== 'СИМОНА') {
        chunks.push(`        <vendor>${escapeXml(humanBrand)}</vendor>`);
      }
      if (p.systemArticle || p.sku) {
        chunks.push(`        <vendorCode>${escapeXml(p.systemArticle || p.sku)}</vendorCode>`);
      }

      const rawDesc = (p.description || '')
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 1200);
      const fallbackDesc = `${formattedTitle} в сети салонов бытовой техники «СИМОНА» в Нижнем Новгороде (ул. Белинского 15 и 11/66, склад на ул. Коминтерна 27). Официальная гарантия и аккуратная доставка собственной службой.`;

      chunks.push(`        <description>${escapeXml(rawDesc || fallbackDesc)}</description>`);
      chunks.push(`        <sales_notes>Официальная гарантия. Карта, СБП, оплата по счету</sales_notes>`);
      chunks.push(`        <manufacturer_warranty>true</manufacturer_warranty>`);
      chunks.push(`        <param name="Код товара">${escapeXml(p.sku)}</param>`);
      if (p.color && p.color.trim()) {
        chunks.push(`        <param name="Цвет">${escapeXml(p.color.trim())}</param>`);
      }
      if (p.dimensions && p.dimensions.trim()) {
        chunks.push(`        <param name="Габариты">${escapeXml(p.dimensions.trim())}</param>`);
      }
      chunks.push(
        `        <param name="Наличие в Нижнем Новгороде">${
          p.stockKominterna > 0
            ? 'На складе (ул. Коминтерна, 27)'
            : inShowroom
              ? 'На экспозиции в салоне (ул. Белинского)'
              : 'Под заказ'
        }</param>`
      );

      // Deep technical parameters extraction for AI Shopping Graph (Alice / YandexGPT / Gemini)
      const addedParamLabels = new Set<string>(['Код товара', 'Цвет', 'Габариты', 'Наличие в Нижнем Новгороде']);
      try {
        const parsedFeat = JSON.parse(p.featuresJson || '[]');
        if (Array.isArray(parsedFeat)) {
          let extraCount = 0;
          for (const item of parsedFeat) {
            if (
              item &&
              typeof item.label === 'string' &&
              typeof item.value === 'string' &&
              item.label.trim() &&
              item.value.trim()
            ) {
              const label = item.label.trim();
              const val = item.value.trim();
              if (GEO_TECHNICAL_PARAM_LABELS.has(label) && !addedParamLabels.has(label)) {
                addedParamLabels.add(label);
                chunks.push(`        <param name="${escapeXml(label)}">${escapeXml(val)}</param>`);
                extraCount++;
                if (extraCount >= 15) break; // Limit to 15 top technical specs per item to optimize XML size
              }
            }
          }
        }
      } catch {
        // Safe fallback if JSON parse fails
      }

      chunks.push(`      </offer>`);
    });

    chunks.push(`    </offers>`);
    chunks.push(`  </shop>`);
    chunks.push(`</yml_catalog>`);

    return new NextResponse(chunks.join('\n'), {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (error: unknown) {
    console.error('YML feed generation error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

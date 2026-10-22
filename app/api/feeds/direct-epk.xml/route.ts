import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { formatProductName } from '@/lib/catalog/productTitle';

function escapeXml(unsafe: string | null | undefined): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&nbsp;/gi, ' ')
    .replace(/&laquo;|&raquo;/gi, '"')
    .replace(/&mdash;/gi, '—')
    .replace(/&ndash;/gi, '–')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export const dynamic = 'force-dynamic';
export const revalidate = 1800; // Кэширование 30 минут

/**
 * Специализированный YML-фид для рекламных кампаний Яндекс Директ (ЕПК и Товарная галерея).
 * Требования:
 * 1. Исключительно товары со статусом «На складе» (ул. Коминтерна, 27): stockKominterna > 0 или inStock = true.
 * 2. Чек от 30 000 ₽ (исключена мелочевка и дешевые расходники).
 * 3. Физическое наличие для быстрой доставки/самовывоза в Нижнем Новгороде.
 * 4. Канонический брендбук «Сеть салонов бытовой техники СИМОНА».
 */
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        price: { gte: 30000 },
        OR: [
          { stockKominterna: { gt: 0 } },
          { inStock: true, stockCount: { gt: 0 } },
        ],
      },
      take: 4000,
      orderBy: [{ isFeatured: 'desc' }, { price: 'desc' }],
    });

    const categoriesMap = new Map<string, number>();
    let catCounter = 1;

    products.forEach((p) => {
      const cat = p.category || 'Встраиваемая бытовая техника';
      if (!categoriesMap.has(cat)) {
        categoriesMap.set(cat, catCounter++);
      }
    });

    const now = new Date().toISOString().replace(/\.\d{3}Z$/, '+03:00');
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.simona-bt.ru';

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<!DOCTYPE yml_catalog SYSTEM "shops.dtd">\n`;
    xml += `<yml_catalog date="${now}">\n`;
    xml += `  <shop>\n`;
    xml += `    <name>СИМОНА</name>\n`;
    xml += `    <company>Сеть салонов бытовой техники «СИМОНА»</company>\n`;
    xml += `    <url>${siteUrl}</url>\n`;
    xml += `    <currencies>\n`;
    xml += `      <currency id="RUR" rate="1"/>\n`;
    xml += `    </currencies>\n`;
    xml += `    <categories>\n`;

    categoriesMap.forEach((id, name) => {
      xml += `      <category id="${id}">${escapeXml(name)}</category>\n`;
    });

    xml += `    </categories>\n`;
    xml += `    <offers>\n`;

    for (const p of products) {
      const catId = categoriesMap.get(p.category || 'Встраиваемая бытовая техника') || 1;
      const formattedTitle = formatProductName(p);

      let images: string[] = [];
      try {
        images = JSON.parse(p.imagesJson || '[]');
      } catch {
        images = [];
      }

      // UTM-разметка для атрибуции кликов из Товарной галереи
      const rawOfferUrl = `${siteUrl}/product/${p.slug}?utm_source=yandex&utm_medium=cpc&utm_campaign=direct_epk_feed&utm_content=${p.sku}`;

      xml += `      <offer id="${escapeXml(p.id)}" available="true">\n`;
      xml += `        <url>${escapeXml(rawOfferUrl)}</url>\n`;
      xml += `        <price>${p.price}</price>\n`;
      if (p.oldPrice && p.oldPrice > p.price) {
        xml += `        <oldprice>${p.oldPrice}</oldprice>\n`;
      }
      xml += `        <currencyId>RUR</currencyId>\n`;
      xml += `        <categoryId>${catId}</categoryId>\n`;

      if (images.length > 0) {
        images.slice(0, 5).forEach((img) => {
          const fullImgUrl = img.startsWith('http')
            ? img
            : `${siteUrl}${img.startsWith('/') ? '' : '/'}${img}`;
          xml += `        <picture>${escapeXml(fullImgUrl)}</picture>\n`;
        });
      }

      const cleanDesc = (p.description || '')
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 800);

      xml += `        <name>${escapeXml(formattedTitle)}</name>\n`;
      xml += `        <vendor>${escapeXml(p.brand)}</vendor>\n`;
      xml += `        <vendorCode>${escapeXml(p.sku)}</vendorCode>\n`;
      xml += `        <description>${escapeXml(cleanDesc)}</description>\n`;
      xml += `        <delivery>true</delivery>\n`;
      xml += `        <pickup>true</pickup>\n`;
      xml += `        <store>false</store>\n`;
      xml += `        <param name="Статус">На складе в Нижнем Новгороде</param>\n`;
      xml += `        <param name="Склад выдачи">Нижний Новгород, ул. Коминтерна, 27</param>\n`;
      xml += `        <param name="Срок доставки">1–2 дня собственной службой</param>\n`;
      xml += `        <param name="Сервис">Хранение до конца ремонта, профессиональная установка</param>\n`;
      xml += `      </offer>\n`;
    }

    xml += `    </offers>\n`;
    xml += `  </shop>\n`;
    xml += `</yml_catalog>\n`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
      },
    });
  } catch (e: any) {
    console.error('Direct EPK feed generation error:', e);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

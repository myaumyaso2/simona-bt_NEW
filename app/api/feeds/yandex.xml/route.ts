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
export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        price: { gt: 0 },
      },
      take: 8000,
      orderBy: { isFeatured: 'desc' },
    });

    const categoriesMap = new Map<string, number>();
    let catCounter = 1;

    products.forEach((p) => {
      const cat = p.category || 'Бытовая техника';
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
      const catId = categoriesMap.get(p.category || 'Бытовая техника') || 1;
      const isAvailable = p.inStock || p.stockCount > 0;
      const formattedTitle = formatProductName(p);

      let images: string[] = [];
      try {
        images = JSON.parse(p.imagesJson || '[]');
      } catch {
        images = [];
      }

      xml += `      <offer id="${escapeXml(p.id)}" available="${isAvailable}">\n`;
      xml += `        <url>${siteUrl}/product/${escapeXml(p.slug)}</url>\n`;
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
        .slice(0, 1000);

      xml += `        <name>${escapeXml(formattedTitle)}</name>\n`;
      xml += `        <vendor>${escapeXml(p.brand)}</vendor>\n`;
      xml += `        <vendorCode>${escapeXml(p.sku)}</vendorCode>\n`;
      xml += `        <description>${escapeXml(cleanDesc)}</description>\n`;
      xml += `        <delivery>true</delivery>\n`;
      xml += `        <pickup>true</pickup>\n`;
      xml += `        <store>${p.stockBelinskogo15 > 0 ? 'true' : 'false'}</store>\n`;
      xml += `        <param name="Наличие на складе Коминтерна 27">${p.stockKominterna > 0 ? 'Есть' : 'Под заказ'}</param>\n`;
      xml += `        <param name="Экспозиция в салоне">${p.stockBelinskogo15 > 0 ? 'ул. Белинского, 15' : 'Нет'}</param>\n`;
      xml += `      </offer>\n`;
    }

    xml += `    </offers>\n`;
    xml += `  </shop>\n`;
    xml += `</yml_catalog>\n`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (e: any) {
    console.error('YML feed generation error:', e);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

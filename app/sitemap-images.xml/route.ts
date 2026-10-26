import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { formatProductName } from '@/lib/catalog/productTitle';

export const dynamic = 'force-dynamic';
export const revalidate = 86400; // 24 hours

function escapeXml(unsafe: string | null | undefined): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.simona-bt.ru';

  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        imagesJson: { not: '[]' },
      },
      select: {
        id: true,
        slug: true,
        name: true,
        brand: true,
        productGroup: true,
        sku: true,
        imagesJson: true,
      },
      take: 8000,
      orderBy: { updatedAt: 'desc' },
    });

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

    for (const p of products) {
      let images: string[] = [];
      try {
        images = JSON.parse(p.imagesJson || '[]');
      } catch {
        images = [];
      }

      if (images.length === 0) continue;

      const title = formatProductName(p);
      const productUrl = `${siteUrl}/product/${p.slug}`;

      xml += `  <url>\n`;
      xml += `    <loc>${escapeXml(productUrl)}</loc>\n`;
      for (const img of images.slice(0, 5)) {
        const normalizedImg = img.replace(/^https?:\/\/simona-bt\.ru\//i, 'https://www.simona-bt.ru/');
        const fullImgUrl = normalizedImg.startsWith('http') ? normalizedImg : `${siteUrl}${normalizedImg}`;
        xml += `    <image:image>\n`;
        xml += `      <image:loc>${escapeXml(fullImgUrl)}</image:loc>\n`;
        xml += `      <image:title>${escapeXml(title)}</image:title>\n`;
        xml += `    </image:image>\n`;
      }
      xml += `  </url>\n`;
    }

    xml += `</urlset>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200',
      },
    });
  } catch (err) {
    console.error('Error generating image sitemap:', err);
    return new NextResponse('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>', {
      status: 500,
      headers: { 'Content-Type': 'application/xml; charset=utf-8' },
    });
  }
}

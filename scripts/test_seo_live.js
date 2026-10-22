const https = require('https');

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', reject);
  });
}

async function verifyAll() {
  console.log('=== VERIFYING PRODUCTION (https://www.simona-bt.ru) ===');

  // 1. Robots
  const robots = await fetchText('https://www.simona-bt.ru/robots.txt');
  console.log('1. robots.txt has sitemap-images.xml:', robots.data.includes('sitemap-images.xml'));
  console.log('   robots.txt Host is www:', robots.data.includes('Host: https://www.simona-bt.ru'));

  // 2. Image Sitemap
  const sitemapImgs = await fetchText('https://www.simona-bt.ru/sitemap-images.xml');
  console.log('2. sitemap-images.xml HTTP Status:', sitemapImgs.status);
  console.log('   sitemap-images.xml has image:loc:', sitemapImgs.data.includes('<image:loc>'));

  // 3. Category + Brand
  const catBrand = await fetchText('https://www.simona-bt.ru/catalog/varochnye-paneli?brand=Bosch');
  console.log('3. Category+Brand HTTP Status:', catBrand.status);
  console.log('   Has ItemList Schema:', catBrand.data.includes('"@type":"ItemList"'));
  console.log('   Has CategorySeoBlock:', catBrand.data.includes('Официальная гарантия и статус'));
  console.log('   Has dynamic minPrice in Title:', catBrand.data.includes('по цене от'));

  // 4. Product Schema AggregateRating
  const prod = await fetchText('https://www.simona-bt.ru/product/midea-mf-210w105wb-t');
  console.log('4. Product Page HTTP Status:', prod.status);
  console.log('   Product Schema has 4.9 rating:', prod.data.includes('"ratingValue":"4.9"'));
  console.log('   Product Schema has 184 reviews:', prod.data.includes('"reviewCount":"184"'));

  // 5. 404 Soft-404 protection
  const notFound = await fetchText('https://www.simona-bt.ru/shop/fake-nonexistent-sku-999');
  console.log('5. Discontinued item HTTP Status:', notFound.status);
  console.log('   Custom 404 text:', notFound.data.includes('Страница не найдена или прибор снят с производства'));
}

verifyAll();

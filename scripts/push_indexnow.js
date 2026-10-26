#!/usr/bin/env node
/**
 * IndexNow Automated URL Submitter for Yandex & Bing
 * Fetches canonical URLs from https://www.simona-bt.ru/sitemap.xml,
 * verifies key availability at https://www.simona-bt.ru/<KEY>.txt,
 * and pushes priority & catalog URLs in batches to Yandex IndexNow API.
 */

const https = require('https');

const HOST = 'www.simona-bt.ru';
const KEY = 'simona8f4c2a9e1b7d3f5a6c0e4b2d8a';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const SITEMAP_URL = `https://${HOST}/sitemap.xml`;

function requestUrl(url, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, { timeout: 25000, ...options }, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    });
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy(new Error(`Timeout requesting ${url}`));
    });
    if (body) req.write(body);
    req.end();
  });
}

async function submitBatch(endpoint, urlList) {
  const payload = JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  });

  const res = await requestUrl(
    endpoint,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(payload),
      },
    },
    payload
  );

  return res;
}

async function main() {
  console.log('1. Verifying IndexNow key file at:', KEY_LOCATION);
  const keyCheck = await requestUrl(KEY_LOCATION, { method: 'GET' });
  if (keyCheck.status !== 200 || keyCheck.body.trim() !== KEY) {
    console.error(`IndexNow key check failed! Status=${keyCheck.status}, Body="${keyCheck.body.slice(0, 80)}"`);
    process.exit(1);
  }
  console.log('   OK: Key verified.');

  console.log('2. Fetching live sitemap:', SITEMAP_URL);
  const sitemapRes = await requestUrl(SITEMAP_URL, { method: 'GET' });
  if (sitemapRes.status !== 200) {
    console.error(`Failed to fetch sitemap.xml: HTTP ${sitemapRes.status}`);
    process.exit(1);
  }

  const urls = [];
  const locRegex = /<loc>([^<]+)<\/loc>/g;
  let match;
  while ((match = locRegex.exec(sitemapRes.body)) !== null) {
    const decoded = match[1]
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .trim();
    if (decoded.startsWith(`https://${HOST}`)) {
      urls.push(decoded);
    }
  }

  console.log(`   Extracted ${urls.length} canonical URLs from sitemap.xml.`);
  if (urls.length === 0) {
    console.error('No URLs found in sitemap.xml!');
    process.exit(1);
  }

  // Submit in batches of 5000 (IndexNow allows up to 10,000 per POST)
  const BATCH_SIZE = 5000;
  const endpoints = ['https://yandex.com/indexnow', 'https://api.indexnow.org/indexnow'];

  for (const endpoint of endpoints) {
    console.log(`3. Submitting to ${endpoint}...`);
    for (let i = 0; i < urls.length; i += BATCH_SIZE) {
      const chunk = urls.slice(i, i + BATCH_SIZE);
      try {
        const res = await submitBatch(endpoint, chunk);
        console.log(`   Batch ${Math.floor(i / BATCH_SIZE) + 1} (${chunk.length} URLs) -> HTTP ${res.status} ${res.body.slice(0, 120)}`);
      } catch (err) {
        console.warn(`   Warning submitting to ${endpoint}:`, err.message);
      }
    }
  }
}

main().catch((err) => {
  console.error('IndexNow error:', err);
  process.exit(1);
});

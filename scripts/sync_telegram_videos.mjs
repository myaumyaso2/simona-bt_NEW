import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const DATA_FILE = path.join(PROJECT_ROOT, 'public', 'telegram_videos.json');
const THUMBS_DIR = path.join(PROJECT_ROOT, 'public', 'telegram_thumbs');
const CHANNEL_NAME = 'simona_sale';

// Batching & throttling settings
const CONCURRENCY = 4;
const DELAY_BETWEEN_BATCHES_MS = 250;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fetch channel HTML from t.me/s/simona_sale to discover latest posts
 */
async function fetchChannelPage(before = null) {
  let url = `https://t.me/s/${CHANNEL_NAME}`;
  if (before) {
    url += `?before=${before}`;
  }
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      });
      if (res.ok) {
        return await res.text();
      }
    } catch (err) {
      console.warn(`[Attempt ${attempt}] Failed fetching channel page:`, err.message);
      await sleep(1000);
    }
  }
  return '';
}

/**
 * Parse videos from channel page HTML
 */
function parseVideosFromChannelHtml(html) {
  const blocks = html.split('<div class="tgme_widget_message ');
  const parsed = [];

  for (const b of blocks.slice(1)) {
    const mId = b.match(new RegExp(`data-post="${CHANNEL_NAME}/(\\d+)"`));
    if (!mId) continue;
    const pid = parseInt(mId[1], 10);

    const hasVideo =
      b.includes('<video') ||
      b.includes('tgme_widget_message_video') ||
      b.includes('tgme_widget_message_roundvideo');
    if (!hasVideo) continue;

    // Description text
    const mText = b.match(/<div class="tgme_widget_message_text[^"]*"[^>]*>([\s\S]*?)<\/div>\s*(?:<div class="tgme_widget_message_reactions|<div class="tgme_widget_message_footer|<div class="message_footer)/);
    let cleanText = '';
    if (mText) {
      cleanText = mText[1]
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<[^>]+>/g, '')
        .replace(/Please open Telegram to view this post\s*VIEW IN TELEGRAM/gi, '')
        .trim();
    }

    // Views
    const mViews = b.match(/<span class="tgme_widget_message_views">([^<]+)<\/span>/);
    const views = mViews ? mViews[1].trim() : '1.2K';

    // Date
    const mDate = b.match(/<time datetime="([^"]+)"/);
    const dateStr = mDate ? mDate[1] : '';

    // Duration
    const mDur = b.match(/class="message_video_duration[^"]*">([^<]+)</);
    const duration = mDur ? mDur[1].trim() : '';

    // Title
    let firstLine = cleanText.split('\n')[0]?.trim() || 'Видеообзор техники СИМОНА';
    firstLine = firstLine.replace(/[\u{10000}-\u{10ffff}]/gu, '').trim();
    if (firstLine.length > 65) {
      firstLine = firstLine.slice(0, 62) + '...';
    }
    if (!firstLine) {
      firstLine = 'Видеообзор техники СИМОНА';
    }

    parsed.push({
      id: `tg-${pid}`,
      postId: pid,
      title: firstLine,
      description: cleanText,
      views,
      date: dateStr,
      duration,
      thumbnail: `/telegram_thumbs/${pid}.jpg`,
      videoSrc: '',
      telegramUrl: `https://t.me/${CHANNEL_NAME}/${pid}`,
    });
  }

  return parsed;
}

/**
 * Fetch post embed HTML to retrieve fresh working thumbnail URL
 */
async function fetchPostEmbedDetails(postId) {
  const url = `https://t.me/${CHANNEL_NAME}/${postId}?embed=1`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });
    if (!res.ok) return null;
    const html = await res.text();

    // Find thumbnail url (filter out telegram emojis)
    const bgMatches = html.match(/background-image:url\('([^']+)'\)/g);
    let thumbUrl = null;
    if (bgMatches) {
      const candidates = bgMatches
        .map((m) => {
          const match = m.match(/background-image:url\('([^']+)'\)/);
          return match ? match[1] : null;
        })
        .filter((u) => u && !u.includes('/emoji/'));
      if (candidates.length > 0) {
        thumbUrl = candidates[0];
      }
    }

    // Video duration
    const durMatch = html.match(/class="message_video_duration[^"]*">([^<]+)</);
    const duration = durMatch ? durMatch[1].trim() : null;

    // Views
    const viewsMatch = html.match(/<span class="tgme_widget_message_views">([^<]+)<\/span>/);
    const views = viewsMatch ? viewsMatch[1].trim() : null;

    return { thumbUrl, duration, views };
  } catch (err) {
    console.warn(`[Post ${postId}] Embed fetch error:`, err.message);
    return null;
  }
}

/**
 * Download an image and save locally
 */
async function downloadThumbnail(url, targetPath) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });
    if (!res.ok) {
      throw new Error(`HTTP status ${res.status}`);
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length < 500) {
      throw new Error(`Downloaded file too small (${buffer.length} bytes)`);
    }
    await fs.writeFile(targetPath, buffer);
    return true;
  } catch (err) {
    console.warn(`Failed downloading ${url} to ${targetPath}:`, err.message);
    return false;
  }
}

/**
 * Main synchronizer & thumbnail restore routine
 */
export async function syncTelegramVideos({ forceDownloadAll = false } = {}) {
  console.log(`[Sync] Starting Telegram sync for channel @${CHANNEL_NAME}...`);
  await fs.mkdir(THUMBS_DIR, { recursive: true });

  let existingVideos = [];
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    existingVideos = JSON.parse(raw);
  } catch (err) {
    console.warn('[Sync] No existing JSON found or parse error:', err.message);
  }

  const videoMap = new Map();
  for (const v of existingVideos) {
    videoMap.set(v.postId, v);
  }
  console.log(`[Sync] Found ${videoMap.size} existing videos in database.`);

  // 1. Scrape latest channel posts for any newly added videos
  try {
    const channelHtml = await fetchChannelPage();
    if (channelHtml) {
      const latest = parseVideosFromChannelHtml(channelHtml);
      let newCount = 0;
      for (const item of latest) {
        if (!videoMap.has(item.postId)) {
          videoMap.set(item.postId, item);
          newCount++;
          console.log(`  [NEW] Found post ${item.postId}: ${item.title}`);
        } else {
          // Update views or metadata
          const existing = videoMap.get(item.postId);
          if (item.views) existing.views = item.views;
          if (item.duration) existing.duration = item.duration;
        }
      }
      console.log(`[Sync] Discovered ${newCount} new posts from channel feed.`);
    }
  } catch (err) {
    console.warn('[Sync] Channel feed scrape failed, proceeding with known videos:', err.message);
  }

  const allVideos = Array.from(videoMap.values()).sort((a, b) => b.postId - a.postId);
  console.log(`[Sync] Total videos to check: ${allVideos.length}`);

  // 2. Identify videos needing thumbnails
  const queue = [];
  for (const v of allVideos) {
    const localFileName = `${v.postId}.jpg`;
    const localFilePath = path.join(THUMBS_DIR, localFileName);
    const localWebPath = `/telegram_thumbs/${localFileName}`;

    let fileExists = false;
    try {
      const stat = await fs.stat(localFilePath);
      if (stat.size > 500) {
        fileExists = true;
      }
    } catch {}

    const needsDownload = forceDownloadAll || !fileExists || v.thumbnail !== localWebPath;
    if (needsDownload) {
      queue.push(v);
    } else {
      // Ensure local path is set
      v.thumbnail = localWebPath;
    }
  }

  console.log(`[Sync] ${queue.length} videos need thumbnail download / restoration.`);

  // 3. Process queue in concurrent chunks with delay
  let downloadedCount = 0;
  let failedCount = 0;

  for (let i = 0; i < queue.length; i += CONCURRENCY) {
    const chunk = queue.slice(i, i + CONCURRENCY);
    const chunkPromises = chunk.map(async (v) => {
      const localFileName = `${v.postId}.jpg`;
      const localFilePath = path.join(THUMBS_DIR, localFileName);
      const localWebPath = `/telegram_thumbs/${localFileName}`;

      const details = await fetchPostEmbedDetails(v.postId);
      if (details) {
        if (details.duration) v.duration = details.duration;
        if (details.views) v.views = details.views;

        if (details.thumbUrl) {
          const ok = await downloadThumbnail(details.thumbUrl, localFilePath);
          if (ok) {
            v.thumbnail = localWebPath;
            downloadedCount++;
            return;
          }
        }
      }

      // If download failed or no thumbUrl found, check if local file existed previously
      try {
        const stat = await fs.stat(localFilePath);
        if (stat.size > 500) {
          v.thumbnail = localWebPath;
          return;
        }
      } catch {}

      v.thumbnail = localWebPath; // Point to local path anyway for fallback handling
      failedCount++;
    });

    await Promise.all(chunkPromises);

    const progress = Math.min(i + CONCURRENCY, queue.length);
    if (progress % 20 === 0 || progress === queue.length) {
      console.log(`[Progress] ${progress}/${queue.length} processed (${downloadedCount} saved, ${failedCount} missing/fallback)`);
    }

    if (i + CONCURRENCY < queue.length) {
      await sleep(DELAY_BETWEEN_BATCHES_MS);
    }
  }

  // 4. Save updated JSON
  await fs.writeFile(DATA_FILE, JSON.stringify(allVideos, null, 2), 'utf-8');
  console.log(`[Sync] Saved ${allVideos.length} videos to ${DATA_FILE}.`);
  console.log(`[Sync] Done! Downloaded ${downloadedCount} thumbnails. Fallback / missing: ${failedCount}.`);

  return {
    total: allVideos.length,
    downloaded: downloadedCount,
    failed: failedCount,
  };
}

// Direct execution from CLI
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const force = process.argv.includes('--force');
  syncTelegramVideos({ forceDownloadAll: force })
    .then((res) => {
      console.log('Sync finished successfully:', res);
      process.exit(0);
    })
    .catch((err) => {
      console.error('Sync failed:', err);
      process.exit(1);
    });
}

import fs from 'fs';
import path from 'path';
import { TelegramVideo } from '@/types';

const DATA_FILE = path.join(process.cwd(), 'public', 'telegram_videos.json');

export function getTelegramVideos(): TelegramVideo[] {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (error) {
    console.error('Failed to read telegram_videos.json:', error);
    return [];
  }
}

#!/usr/bin/env python3
"""
Automated Telegram Video Synchronizer for SIMONA-BT.
Scrapes latest video posts from https://t.me/s/simona_sale
and updates public/telegram_videos.json with zero video storage on server.
"""

import os
import sys
import json
import urllib.request
import re
import time

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
DATA_FILE = os.path.join(PROJECT_ROOT, 'public', 'telegram_videos.json')
CHANNEL_NAME = 'simona_sale'

def fetch_channel_page(before=None):
    url = f'https://t.me/s/{CHANNEL_NAME}'
    if before:
        url += f'?before={before}'
    for attempt in range(3):
        try:
            req = urllib.request.Request(
                url,
                headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
            )
            with urllib.request.urlopen(req, timeout=10) as resp:
                return resp.read().decode('utf-8', errors='ignore')
        except Exception as e:
            print(f'Attempt {attempt+1} failed: {e}', file=sys.stderr)
            time.sleep(1)
    return ''

def parse_videos_from_html(html):
    blocks = re.split(r'<div class="tgme_widget_message ', html)
    parsed = []
    
    for b in blocks[1:]:
        m_id = re.search(rf'data-post="{CHANNEL_NAME}/(\d+)"', b)
        if not m_id:
            continue
        pid = int(m_id.group(1))
        
        has_video = ('<video' in b) or ('tgme_widget_message_video' in b) or ('tgme_widget_message_roundvideo' in b)
        if not has_video:
            continue
            
        # Clean text
        m_text = re.search(r'<div class="tgme_widget_message_text[^"]*"[^>]*>(.*?)</div>\s*(?:<div class="tgme_widget_message_reactions|<div class="tgme_widget_message_footer|<div class="message_footer)', b, re.DOTALL)
        clean_text = ''
        if m_text:
            raw_text = m_text.group(1)
            clean_text = re.sub(r'<br\s*/?>', '\n', raw_text)
            clean_text = re.sub(r'<[^>]+>', '', clean_text)
            clean_text = re.sub(r'Please open Telegram to view this post\s*VIEW IN TELEGRAM', '', clean_text, flags=re.IGNORECASE).strip()
            
        # Views
        m_views = re.search(r'<span class="tgme_widget_message_views">([^<]+)</span>', b)
        views = m_views.group(1) if m_views else '1.2K'
        
        # Date
        m_date = re.search(r'<time datetime="([^"]+)"', b)
        date_str = m_date.group(1) if m_date else ''
        
        # Thumbnail
        m_thumb = re.search(r'background-image:url\(\'([^\']+)\'\)', b)
        thumb_url = m_thumb.group(1) if m_thumb else ''
        
        # Duration
        m_dur = re.search(r'class="message_video_duration[^"]*">([^<]+)<', b)
        duration = m_dur.group(1) if m_dur else ''
        
        # Video src
        m_src = re.search(r'<video[^>]+src="([^"]+)"', b)
        video_src = m_src.group(1) if m_src else ''
        
        # Generate clean short title
        first_line = clean_text.split('\n')[0].strip() if clean_text else 'Видеообзор техники СИМОНА'
        first_line = re.sub(r'[\U00010000-\U0010ffff]', '', first_line).strip()
        if len(first_line) > 65:
            first_line = first_line[:62] + '...'
        if not first_line:
            first_line = 'Видеообзор техники СИМОНА'
            
        parsed.append({
            'id': f'tg-{pid}',
            'postId': pid,
            'title': first_line,
            'description': clean_text,
            'views': views,
            'date': date_str,
            'duration': duration,
            'thumbnail': thumb_url,
            'videoSrc': video_src,
            'telegramUrl': f'https://t.me/{CHANNEL_NAME}/{pid}'
        })
    return parsed

def sync_videos():
    print(f'Starting sync for Telegram channel @{CHANNEL_NAME}...')
    existing_videos = []
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                existing_videos = json.load(f)
        except Exception as e:
            print(f'Warning reading existing JSON: {e}')
            
    existing_ids = {v['postId']: v for v in existing_videos}
    print(f'Currently have {len(existing_videos)} videos in database.')
    
    # Fetch first 2 pages of latest posts
    latest_html = fetch_channel_page()
    new_found = parse_videos_from_html(latest_html)
    
    added_count = 0
    updated_count = 0
    
    for v in new_found:
        pid = v['postId']
        if pid not in existing_ids:
            existing_ids[pid] = v
            added_count += 1
            print(f'  [NEW] Post {pid}: {v["title"]}')
        else:
            # Update views and date if changed
            existing_ids[pid]['views'] = v['views']
            if v.get('videoSrc'):
                existing_ids[pid]['videoSrc'] = v['videoSrc']
            if v.get('thumbnail'):
                existing_ids[pid]['thumbnail'] = v['thumbnail']
            updated_count += 1
            
    all_updated = list(existing_ids.values())
    all_updated.sort(key=lambda x: x['postId'], reverse=True)
    
    os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(all_updated, f, ensure_ascii=False, indent=2)
        
    print(f'Sync complete! Added {added_count} new videos, updated {updated_count}. Total: {len(all_updated)}')
    return len(all_updated)

if __name__ == '__main__':
    sync_videos()

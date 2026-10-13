#!/bin/bash
export PATH=/usr/local/bin:/usr/bin:/bin:$PATH
PROD_DIR="/var/www/simona-bt.ru/data/www/simona-prod"

if [ ! -d "$PROD_DIR" ]; then
  echo "Directory $PROD_DIR not found"
  exit 1
fi

cd "$PROD_DIR"

# Ensure storage directories exist
mkdir -p storage/logs storage/sync_backups storage/sync

# Run sync with flock to prevent concurrency
/usr/bin/flock -n /tmp/simona_1c_sync.lock /usr/local/bin/npx tsx scripts/cron_1c_sync.ts >> storage/logs/cron_output.log 2>&1

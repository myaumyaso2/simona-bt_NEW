#!/bin/bash
export PATH=/usr/local/bin:/usr/bin:/bin:$PATH
cd /var/www/simona-bt.ru/data/www/new.simona-bt.ru

# Создаем директорию логов, если еще нет
mkdir -p storage/logs

# Запуск синхронизации через flock с защитой от одновременного выполнения
/usr/bin/flock -n /tmp/simona_1c_sync.lock /usr/local/bin/npx tsx scripts/cron_1c_sync.ts >> storage/logs/cron_output.log 2>&1

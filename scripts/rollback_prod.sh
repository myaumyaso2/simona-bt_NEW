#!/usr/bin/env bash
set -e

SSH_HOST="simona_prod"

echo "=========================================================="
echo "⚠️ SIMONA-BT: Emergency Rollback to UMI.CMS (Apache :81)"
echo "=========================================================="

ssh "$SSH_HOST" bash << 'EOF'
set -e
CONF_DIR="/etc/nginx/fastpanel2-sites/simona-bt.ru"

# Find latest backup
LATEST_BACKUP=$(ls -t "$CONF_DIR"/simona-bt.ru.conf.backup_* 2>/dev/null | head -n 1)

if [ -n "$LATEST_BACKUP" ] && [ -f "$LATEST_BACKUP" ]; then
    echo "🔄 Restoring Nginx config from latest backup: $LATEST_BACKUP..."
    cp "$LATEST_BACKUP" "$CONF_DIR/simona-bt.ru.conf"
else
    echo "⚠️ No backup found. Generating canonical Apache UMI proxy config..."
    cat << 'APACHECONF' > "$CONF_DIR/simona-bt.ru.conf"
server {
    server_name simona-bt.ru www.simona-bt.ru;

    listen 5.188.30.184:80;
    listen [2a01:5a60:5::5a]:80;
    listen 5.188.30.184:443 ssl;
    listen [2a01:5a60:5::5a]:443 ssl;

    ssl_certificate "/var/www/httpd-cert/www.simona-bt.ru_2026-10-05-14-36_18.crt";
    ssl_certificate_key "/var/www/httpd-cert/www.simona-bt.ru_2026-10-05-14-36_18.key";
    charset utf-8;

    gzip on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/css image/x-ico application/pdf image/jpeg image/png image/gif application/javascript application/x-javascript application/x-pointplus;
    gzip_comp_level 5;

    set $root_path /var/www/simona-bt.ru/data/www/simona-bt.ru;
    root $root_path;
    disable_symlinks if_not_owner from=$root_path;

    location / {
        proxy_pass http://127.0.0.1:81;
        proxy_redirect http://127.0.0.1:81/ /;
        include /etc/nginx/proxy_params;
    }

    location ~* ^.+\.(jpg|jpeg|gif|png|svg|js|css|mp3|ogg|mpeg|avi|zip|gz|bz2|rar|swf|ico|7z|doc|docx|map|ogg|otf|pdf|tff|tif|txt|wav|webp|woff|woff2|xls|xlsx|xml)$ {
        try_files $uri $uri/ @fallback;
        expires 60d;
    }

    location @fallback {
        proxy_pass http://127.0.0.1:81;
        proxy_redirect http://127.0.0.1:81/ /;
        include /etc/nginx/proxy_params;
    }

    include "/etc/nginx/fastpanel2-sites/simona-bt.ru/simona-bt.ru.includes";
    include /etc/nginx/fastpanel2-includes/*.conf;

    error_log /var/www/simona-bt.ru/data/logs/simona-bt.ru-frontend.error.log;
    access_log /var/www/simona-bt.ru/data/logs/simona-bt.ru-frontend.access.log;
}
APACHECONF
fi

echo "🔍 Testing Nginx syntax..."
nginx -t

echo "🔄 Reloading Nginx..."
nginx -s reload

echo "🔍 Checking live response from Apache..."
curl -sI -k https://simona-bt.ru | head -n 5
EOF

echo "=========================================================="
echo "✅ ROLLBACK COMPLETE: Traffic reverted to Apache (:81)"
echo "=========================================================="

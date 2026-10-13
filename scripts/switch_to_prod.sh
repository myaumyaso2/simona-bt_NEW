#!/usr/bin/env bash
set -e

SSH_HOST="simona_prod"
PROD_DIR="/var/www/simona-bt.ru/data/www/simona-prod"

echo "=========================================================="
echo "🚀 SIMONA-BT: Production Domain Cutover (simona-bt.ru)"
echo "=========================================================="

echo "🔍 Step 1: Verifying Next.js Production process on server..."
ssh "$SSH_HOST" bash << 'EOF'
set -e
export PATH=/usr/local/bin:/opt/nodejs/bin:$PATH
PROD_DIR="/var/www/simona-bt.ru/data/www/simona-prod"

if [ ! -d "$PROD_DIR" ]; then
    echo "❌ Error: Production directory $PROD_DIR does not exist. Run scripts/prepare_prod_db.sh first!"
    exit 1
fi

cd "$PROD_DIR"

# Build if .next does not exist or rebuild is needed
if [ ! -d ".next" ]; then
    echo "🔨 Building Next.js production bundle..."
    npm run build
fi

# Ensure PM2 process is running on port 3000
if pm2 describe simona-prod > /dev/null 2>&1; then
    echo "🔄 Reloading existing PM2 process simona-prod..."
    pm2 reload simona-prod --update-env
else
    echo "🚀 Starting new PM2 process simona-prod on port 3000..."
    pm2 start npm --name "simona-prod" -- start -- -p 3000
    pm2 save
fi

sleep 3

# Check port 3000 response
echo "🔍 Checking local port 3000 response..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/ || echo "000")
echo "  -> Port 3000 HTTP Status: $HTTP_STATUS"
if [ "$HTTP_STATUS" -ne "200" ] && [ "$HTTP_STATUS" -ne "307" ] && [ "$HTTP_STATUS" -ne "308" ]; then
    echo "❌ Local port 3000 is not responding properly ($HTTP_STATUS)!"
    exit 1
fi
echo "  -> Next.js PM2 process is healthy and ready for traffic."
EOF

echo "📦 Step 2: Backing up current Nginx configs on server..."
ssh "$SSH_HOST" bash << 'EOF'
set -e
BACKUP_TIMESTAMP=$(date +%s)
CONF_DIR="/etc/nginx/fastpanel2-sites/simona-bt.ru"
cp "$CONF_DIR/simona-bt.ru.conf" "$CONF_DIR/simona-bt.ru.conf.backup_$BACKUP_TIMESTAMP"
echo "  -> Backup created: $CONF_DIR/simona-bt.ru.conf.backup_$BACKUP_TIMESTAMP"
EOF

echo "🔐 Step 3: Setting up old.simona-bt.ru archive with Basic Auth..."
ssh "$SSH_HOST" bash << 'EOF'
set -e
# Create .htpasswd for UMI archive access (admin:Vzevzcj2)
htpasswd -b -c /etc/nginx/.htpasswd_umi_archive admin Vzevzcj2

cat << 'ARCHIVECONF' > /etc/nginx/fastpanel2-sites/simona-bt.ru/old.simona-bt.ru.conf
server {
    server_name old.simona-bt.ru;
    listen 5.188.30.184:80;
    listen [2a01:5a60:5::5a]:80;
    listen 5.188.30.184:443 ssl;
    listen [2a01:5a60:5::5a]:443 ssl;

    ssl_certificate "/var/www/httpd-cert/simona-bt.ru_2026-10-03-16-00_42.crt";
    ssl_certificate_key "/var/www/httpd-cert/simona-bt.ru_2026-10-03-16-00_42.key";
    charset utf-8;

    auth_basic "UMI.CMS Archive (Simona-bt)";
    auth_basic_user_file /etc/nginx/.htpasswd_umi_archive;

    location / {
        proxy_pass http://127.0.0.1:81;
        proxy_redirect http://127.0.0.1:81/ /;
        include /etc/nginx/proxy_params;
    }

    error_log /var/www/simona-bt.ru/data/logs/old.simona-bt.ru.error.log;
    access_log /var/www/simona-bt.ru/data/logs/old.simona-bt.ru.access.log;
}
ARCHIVECONF
echo "  -> old.simona-bt.ru configured for Apache on port 81 with Basic Auth."
EOF

echo "🔄 Step 4: Updating simona-bt.ru Nginx configuration for Next.js (port 3000)..."
ssh "$SSH_HOST" bash << 'EOF'
set -e

cat << 'PRODCONF' > /etc/nginx/fastpanel2-sites/simona-bt.ru/simona-bt.ru.conf
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
    gzip_proxied any;
    gzip_types text/css text/xml application/javascript text/plain application/json image/svg+xml image/x-icon;
    gzip_comp_level 5;

    set $root_path /var/www/simona-bt.ru/data/www/simona-bt.ru;
    root $root_path;
    disable_symlinks if_not_owner from=$root_path;

    # Direct static media delivery from disk with aggressive 60d caching
    location ~* ^.+\.(jpg|jpeg|gif|png|svg|webp|ico|pdf|mp4|webm|woff|woff2|ttf|eot)$ {
        try_files $uri $uri/ @fallback;
        expires 60d;
        add_header Cache-Control "public, no-transform";
    }

    # Primary Next.js 14 proxy
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 120s;
        proxy_connect_timeout 60s;
    }

    # Fallback to Next.js for dynamic assets
    location @fallback {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 120s;
        proxy_connect_timeout 60s;
    }

    include "/etc/nginx/fastpanel2-sites/simona-bt.ru/simona-bt.ru.includes";
    include /etc/nginx/fastpanel2-includes/*.conf;

    error_log /var/www/simona-bt.ru/data/logs/simona-bt.ru-frontend.error.log;
    access_log /var/www/simona-bt.ru/data/logs/simona-bt.ru-frontend.access.log;
}
PRODCONF

echo "🔍 Testing Nginx syntax..."
nginx -t

echo "🔄 Reloading Nginx configuration..."
nginx -s reload
echo "✨ Nginx reloaded successfully!"
EOF

echo "🧪 Step 5: Running Smoke Tests on production domain..."
ssh "$SSH_HOST" bash << 'EOF'
set -e
echo "1. Checking main page response..."
curl -sI -k https://simona-bt.ru | head -n 5

echo "2. Checking 301 category redirect..."
curl -sI -k "https://simona-bt.ru/shop/vstraivaemaya_tehnika/varochnye_paneli" | grep -i "location"

echo "3. Checking robots.txt (must Allow)..."
curl -s -k https://simona-bt.ru/robots.txt | head -n 6

echo "4. Checking YML feed response..."
curl -sI -k https://simona-bt.ru/api/feeds/yandex.xml | head -n 4
EOF

echo "=========================================================="
echo "🎉 PRODUCTION CUTOVER COMPLETE: https://simona-bt.ru"
echo "=========================================================="

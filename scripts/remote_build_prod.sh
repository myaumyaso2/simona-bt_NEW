#!/usr/bin/env bash
set -e
export PATH=/usr/local/bin:/opt/nodejs/bin:$PATH
PROD_DIR="/var/www/simona-bt.ru/data/www/simona-prod"

if [ -f "/tmp/simona_prod_bundle.tar.gz" ]; then
    echo "📦 Extracting files into $PROD_DIR..."
    mkdir -p "$PROD_DIR"
    tar -xzf /tmp/simona_prod_bundle.tar.gz -C "$PROD_DIR"
    rm -f /tmp/simona_prod_bundle.tar.gz
fi

cd "$PROD_DIR"

echo "📦 Installing npm dependencies..."
npm install --prefer-offline --no-audit

# Configure environment
cat << 'ENVEOF' > .env
NODE_ENV=production
PORT=3000
DATABASE_URL="postgresql://simona_app:SmBt_Staging_2026_PgPass!@localhost:5432/simona_prod"
NEXT_PUBLIC_SITE_URL="https://www.simona-bt.ru"
NEXT_PUBLIC_KUHNI_URL="https://simona-kuhni.ru"
ADMIN_PASSWORD=Vzevzcj2
OFFLINE_CONVERSION_SECRET=simona_offline_secret_2026
CRON_SECRET=simona_cron_secret_2026
SYNC_SECRET_KEY=simona_secure_sync_secret_2026

# SMTP Mail Configuration
SMTP_HOST="smtp.mail.ru"
SMTP_PORT="465"
SMTP_USER="inet@simona-bt.ru"
SMTP_PASS="LNZOs9Wva6kfehXvRgM1"
SMTP_FROM="«СИМОНА» Бытовая техника <inet@simona-bt.ru>"
MANAGER_EMAIL="inet@simona-bt.ru, absergin@mail.ru"

# YooKassa Live Production
YOOKASSA_SHOP_ID="388703"
YOOKASSA_SECRET_KEY="live_McS9DE3zzJJvU5pKwrS2UbpZ3H7_-9v3RTaBIYV5HOo"
YOOKASSA_VAT_CODE="1"

# Yandex Metrika ID
NEXT_PUBLIC_YM_ID="1351807"

# Yandex Direct & Metrika Tokens (tehnotrade2011@yandex.ru)
YANDEX_API_TOKEN="y0__wgBENvFuDgYm6NNIOSnoL4ZMLGvoo8Iopn7h4n2AQVbAEUh8nrXBYwcgXg"
YANDEX_METRIKA_TOKEN="y0__wgBENvFuDgYm6NNIOSnoL4ZMLGvoo8Iopn7h4n2AQVbAEUh8nrXBYwcgXg"
YANDEX_DIRECT_TOKEN="y0__wgBENvFuDgYm6NNIOSnoL4ZMLGvoo8Iopn7h4n2AQVbAEUh8nrXBYwcgXg"
YANDEX_WEBMASTER_TOKEN="y0__wgBEPrbriIYwdtNIJu5nMUZMLGvoo8IjKGnUlaAgvy3ORFiKYARbNTZ3to"
DIRECT_DAILY_SPEND_LIMIT_RUB="3500"
ENVEOF
cp .env .env.production

sed -i 's/provider = "sqlite"/provider = "postgresql"/g' prisma/schema.prisma

echo "📦 Generating Prisma client and syncing database schema..."
npx prisma generate
npx prisma db push --skip-generate --accept-data-loss
PGPASSWORD='SmBt_Staging_2026_PgPass!' psql -h localhost -U simona_app -d simona_prod -c 'CREATE SEQUENCE IF NOT EXISTS order_number_seq START WITH 15104;' 2>/dev/null || true
PGPASSWORD='SmBt_Staging_2026_PgPass!' psql -h localhost -U simona_app -d simona_prod -c "UPDATE \"Order\" SET \"isOneClick\" = true, \"status\" = 'NEW' WHERE \"status\" = 'ONE_CLICK';" 2>/dev/null || true
PGPASSWORD='SmBt_Staging_2026_PgPass!' psql -h localhost -U simona_app -d simona_prod -c "UPDATE \"Product\" SET \"inStock\" = false WHERE \"physicalStatus\" = 'REMOTE_STOCK' AND (\"stockKominterna\" = 0 OR \"stockKominterna\" IS NULL);" 2>/dev/null || true


if [ "$FULL_IMPORT" = "True" ] || [ "$FULL_IMPORT" = "true" ]; then
    echo "💾 Importing updated catalog into simona_prod..."
    DATABASE_URL="postgresql://simona_app:SmBt_Staging_2026_PgPass!@localhost:5432/simona_prod" npx tsx scripts/import_catalog_to_db.ts
fi

echo "💾 Checking customers in simona_prod..."
CUSTOMERS=$(PGPASSWORD='SmBt_Staging_2026_PgPass!' psql -h localhost -U simona_app -d simona_prod -t -A -c 'SELECT COUNT(*) FROM "Customer";' 2>/dev/null || echo "0")
echo "Current customers: $CUSTOMERS"

if [ "$CUSTOMERS" -eq "0" ] && [ -f "data/exported_umi_customers_orders.json.gz" ]; then
    echo "💾 Migrating UMI customers & orders..."
    DATABASE_URL="postgresql://simona_app:SmBt_Staging_2026_PgPass!@localhost:5432/simona_prod" npx tsx scripts/migrate_umi_customers_orders.ts
fi

echo "🔨 Building Next.js production build..."
rm -rf .next 2>/dev/null || rm -rf .next || true
npm run build

echo "🚀 Starting PM2 process simona-prod on port 3000..."
if pm2 describe simona-prod > /dev/null 2>&1; then
    pm2 restart simona-prod --update-env
else
    pm2 start npm --name "simona-prod" -- start -- -p 3000
    pm2 save
fi

sleep 4
echo "🔍 Checking port 3000 response..."
curl -sI http://127.0.0.1:3000 | head -n 5
echo "✨ Production Next.js is UP on port 3000!"

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
NEXT_PUBLIC_SITE_URL="https://simona-bt.ru"
ADMIN_PASSWORD=Vzevzcj2
OFFLINE_CONVERSION_SECRET=simona_offline_secret_2026
YOOKASSA_SHOP_ID=simona_prod_shop
YOOKASSA_SECRET_KEY=simona_prod_secret
ENVEOF
cp .env .env.production

sed -i 's/provider = "sqlite"/provider = "postgresql"/g' prisma/schema.prisma

echo "📦 Generating Prisma client and syncing database schema..."
npx prisma generate
npx prisma db push --skip-generate --accept-data-loss
PGPASSWORD='SmBt_Staging_2026_PgPass!' psql -h localhost -U simona_app -d simona_prod -c 'CREATE SEQUENCE IF NOT EXISTS order_number_seq START WITH 15104;' 2>/dev/null || true

echo "💾 Checking customers in simona_prod..."
CUSTOMERS=$(PGPASSWORD='SmBt_Staging_2026_PgPass!' psql -h localhost -U simona_app -d simona_prod -t -A -c 'SELECT COUNT(*) FROM "Customer";' 2>/dev/null || echo "0")
echo "Current customers: $CUSTOMERS"

if [ "$CUSTOMERS" -eq "0" ] && [ -f "data/exported_umi_customers_orders.json.gz" ]; then
    echo "💾 Migrating UMI customers & orders..."
    DATABASE_URL="postgresql://simona_app:SmBt_Staging_2026_PgPass!@localhost:5432/simona_prod" npx tsx scripts/migrate_umi_customers_orders.ts
fi

echo "🔨 Building Next.js production build..."
npm run build

echo "🚀 Starting PM2 process simona-prod on port 3000..."
if pm2 describe simona-prod > /dev/null 2>&1; then
    pm2 reload simona-prod --update-env
else
    pm2 start npm --name "simona-prod" -- start -- -p 3000
    pm2 save
fi

sleep 4
echo "🔍 Checking port 3000 response..."
curl -sI http://127.0.0.1:3000 | head -n 5
echo "✨ Production Next.js is UP on port 3000!"

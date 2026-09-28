#!/bin/bash
set -e

export PATH=/usr/local/bin:/opt/nodejs/bin:$PATH
REMOTE_DIR="/var/www/simona-bt.ru/data/www/new.simona-bt.ru"

echo "📦 Extracting files into $REMOTE_DIR..."
mkdir -p "$REMOTE_DIR"
cd "$REMOTE_DIR"
tar -xzf /tmp/simona_staging_bundle.tar.gz -C "$REMOTE_DIR"
rm -f /tmp/simona_staging_bundle.tar.gz

echo "📝 Configuring environment..."
cat << 'ENVEOF' > .env
NODE_ENV=production
PORT=3005
DATABASE_URL="postgresql://simona_app:SmBt_Staging_2026_PgPass!@localhost:5432/simona_staging"
NEXT_PUBLIC_SITE_URL="https://new.simona-bt.ru"
SYNC_SECRET_KEY="simona_secure_sync_secret_2026"
ADMIN_PASSWORD="Vzevzcj2"
ENVEOF
cp .env .env.production

sed -i 's/provider = "sqlite"/provider = "postgresql"/g' prisma/schema.prisma

echo "📦 Installing npm dependencies..."
npm install --prefer-offline --no-audit

echo "🗄️ Initializing Prisma & PostgreSQL..."
npx prisma generate
npx prisma db push --skip-generate

echo "💾 Importing updated catalog and characteristics into PostgreSQL..."
npx tsx scripts/import_catalog_to_db.ts

echo "🔨 Building Next.js production build..."
npm run build

echo "🚀 Managing PM2 process..."
if pm2 describe simona-staging > /dev/null 2>&1; then
    pm2 reload simona-staging --update-env
else
    pm2 start npm --name "simona-staging" -- start -- -p 3005
    pm2 save
fi

echo "🔍 Verifying local port 3005 response..."
curl -sI http://127.0.0.1:3005 | head -n 5

echo "✨ Server deployment completed successfully!"

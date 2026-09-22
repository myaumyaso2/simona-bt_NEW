#!/bin/bash
set -e

SSH_HOST="simona_prod"
REMOTE_DIR="/var/www/simona-bt.ru/data/www/new.simona-bt.ru"
BUNDLE_PATH="./staging_bundle.tar.gz"

echo "=========================================================="
echo "🚀 SIMONA-BT: Deploying to Staging (https://new.simona-bt.ru)"
echo "=========================================================="

echo "🔍 Step 1: Running local TypeScript verification..."
npx tsc --noEmit
echo "  -> TypeScript check PASSED (0 errors)."

echo "📦 Step 2: Packaging project bundle..."
rm -f "$BUNDLE_PATH"
tar -czf "$BUNDLE_PATH" \
  --exclude="node_modules" \
  --exclude=".next" \
  --exclude=".git" \
  --exclude="*.log" \
  --exclude="staging_bundle.tar.gz" \
  --exclude="prisma/dev.db*" \
  .

echo "📤 Step 3: Uploading bundle to $SSH_HOST..."
scp "$BUNDLE_PATH" "${SSH_HOST}:/tmp/simona_staging_bundle.tar.gz"
rm -f "$BUNDLE_PATH"

echo "⚙️ Step 4: Executing remote deployment on server..."
ssh "$SSH_HOST" bash << 'REMOTESCRIPT'
set -e
export PATH=/usr/local/bin:/opt/nodejs/bin:$PATH
REMOTE_DIR="/var/www/simona-bt.ru/data/www/new.simona-bt.ru"
mkdir -p "$REMOTE_DIR"
cd "$REMOTE_DIR"

echo "📦 Extracting files..."
tar -xzf /tmp/simona_staging_bundle.tar.gz -C "$REMOTE_DIR"
rm -f /tmp/simona_staging_bundle.tar.gz

echo "📝 Configuring environment..."
cat << 'ENVEOF' > .env.production
NODE_ENV=production
PORT=3005
DATABASE_URL="postgresql://simona_app:SmBt_Staging_2026_PgPass!@localhost:5432/simona_staging"
NEXT_PUBLIC_SITE_URL="https://new.simona-bt.ru"
ENVEOF

sed -i 's/provider = "sqlite"/provider = "postgresql"/g' prisma/schema.prisma

echo "📦 Installing npm dependencies..."
npm install --prefer-offline --no-audit

echo "🗄️ Initializing Prisma & PostgreSQL..."
npx prisma generate
npx prisma db push --skip-generate

COUNT=$(PGPASSWORD='SmBt_Staging_2026_PgPass!' psql -h localhost -U simona_app -d simona_staging -t -A -c 'SELECT COUNT(*) FROM "Product";' 2>/dev/null || echo "0")
echo "Current products in DB: $COUNT"

if [ "$COUNT" -eq "0" ]; then
    echo "💾 Seeding products and 301-redirects into PostgreSQL..."
    npx tsx scripts/import_catalog_to_db.ts
fi

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
REMOTESCRIPT

echo "🌐 Step 5: Verifying live staging URL..."
curl -sI https://new.simona-bt.ru | head -n 8

echo "=========================================================="
echo "✅ DEPLOYMENT SUCCESSFUL: https://new.simona-bt.ru"
echo "=========================================================="

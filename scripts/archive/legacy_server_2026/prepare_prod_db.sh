#!/usr/bin/env bash
set -e

SSH_HOST="simona_prod"
DB_NAME="simona_prod"
DB_USER="simona_app"
DB_PASS="SmBt_Staging_2026_PgPass!"
PROD_DIR="/var/www/simona-bt.ru/data/www/simona-prod"

echo "=========================================================="
echo "🗄️ SIMONA-BT: Preparing Production Database ($DB_NAME)"
echo "=========================================================="

# 1. Create database on remote PostgreSQL if not exists
echo "🔍 Step 1: Checking PostgreSQL database $DB_NAME on server..."
ssh "$SSH_HOST" bash << EOF
set -e
if sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw "$DB_NAME"; then
    echo "  -> Database $DB_NAME already exists."
else
    echo "  -> Creating database $DB_NAME..."
    sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
    echo "  -> Database $DB_NAME created successfully."
fi
EOF

# 2. Deploy bundle to PROD_DIR if needed or run prisma migrations
echo "⚙️ Step 2: Running schema migration on remote database..."
ssh "$SSH_HOST" bash << EOF
set -e
export PATH=/usr/local/bin:/opt/nodejs/bin:\$PATH

# Ensure directory exists
mkdir -p "$PROD_DIR"
cd "$PROD_DIR"

# If repository files exist in staging, sync code to prod dir
if [ -d "/var/www/simona-bt.ru/data/www/new.simona-bt.ru" ]; then
    echo "📦 Syncing codebase from staging to production directory..."
    rsync -av --exclude 'node_modules' --exclude '.next' /var/www/simona-bt.ru/data/www/new.simona-bt.ru/ "$PROD_DIR/"
fi

# Configure production environment
cat << 'ENVEOF' > .env.production
NODE_ENV=production
PORT=3000
DATABASE_URL="postgresql://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME"
NEXT_PUBLIC_SITE_URL="https://simona-bt.ru"
ADMIN_PASSWORD=Vzevzcj2
OFFLINE_CONVERSION_SECRET=simona_offline_secret_2026
YOOKASSA_SHOP_ID=simona_prod_shop
YOOKASSA_SECRET_KEY=simona_prod_secret
ENVEOF

sed -i 's/provider = "sqlite"/provider = "postgresql"/g' prisma/schema.prisma

echo "📦 Installing production dependencies..."
npm install --prefer-offline --no-audit

echo "🗄️ Applying Prisma schema to PostgreSQL $DB_NAME..."
npx prisma generate
DATABASE_URL="postgresql://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME" npx prisma db push --skip-generate --accept-data-loss

COUNT=\$(PGPASSWORD='$DB_PASS' psql -h localhost -U $DB_USER -d $DB_NAME -t -A -c 'SELECT COUNT(*) FROM "Product";' 2>/dev/null || echo "0")
echo "  -> Products in $DB_NAME: \$COUNT"

if [ "\$COUNT" -eq "0" ]; then
    echo "💾 Seeding products into production database..."
    DATABASE_URL="postgresql://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME" npx tsx scripts/import_catalog_to_db.ts
fi

CUSTOMERS=\$(PGPASSWORD='$DB_PASS' psql -h localhost -U $DB_USER -d $DB_NAME -t -A -c 'SELECT COUNT(*) FROM "Customer";' 2>/dev/null || echo "0")
echo "  -> Customers in $DB_NAME: \$CUSTOMERS"

if [ "\$CUSTOMERS" -eq "0" ] && [ -f "data/exported_umi_customers_orders.json.gz" ]; then
    echo "💾 Migrating UMI customers & orders into production database..."
    DATABASE_URL="postgresql://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME" npx tsx scripts/migrate_umi_customers_orders.ts
fi

echo "✨ Production database preparation complete!"
EOF

echo "=========================================================="
echo "✅ PRODUCTION DATABASE READY: $DB_NAME"
echo "=========================================================="

#!/usr/bin/env bash
set -e

echo "=== CHECKING SMOKE ORDER SMB-261013-3280 IN POSTGRESQL ==="
sudo -u postgres psql -d simona_prod -x << 'EOF'
SELECT "id", "orderNumber", "customerName", "customerPhone", "customerEmail", "deliveryType", "totalAmount", "status", "paymentStatus", "createdAt"
FROM "Order"
WHERE "orderNumber" = 'SMB-261013-3280';
EOF

echo ""
echo "=== CHECKING ORDER ITEMS ==="
sudo -u postgres psql -d simona_prod -x << 'EOF'
SELECT "sku", "name", "price", "quantity", "physicalStatus"
FROM "OrderItem"
WHERE "orderId" = (SELECT "id" FROM "Order" WHERE "orderNumber" = 'SMB-261013-3280');
EOF

echo ""
echo "=== CHECKING PM2 RECENT LOGS (SMTP / MAIL / CHECKOUT) ==="
pm2 logs simona-prod --lines 30 --nostream

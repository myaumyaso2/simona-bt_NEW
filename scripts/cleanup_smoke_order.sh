#!/usr/bin/env bash
sudo -u postgres psql -d simona_prod << 'EOF'
UPDATE "Order"
SET status = 'CANCELLED',
    "deliveryComment" = 'АВТОМАТИЗИРОВАННАЯ ПРОВЕРКА РЕЛИЗА 100% УСПЕШНО ЗАВЕРШЕНА (АННУЛИРОВАН)'
WHERE "orderNumber" = 'SMB-261013-3280';
EOF

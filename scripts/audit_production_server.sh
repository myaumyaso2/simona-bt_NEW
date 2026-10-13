#!/usr/bin/env bash
set -e

SSH_HOST="simona_prod"

echo "=========================================================="
echo "🚀 SIMONA-BT: Running Production Server Console Audit"
echo "=========================================================="

ssh "$SSH_HOST" bash << 'EOF'
set -e
export PATH=/usr/local/bin:/opt/nodejs/bin:$PATH

echo -e "\n--- [1.1] System Services & Resource Health ---"
pm2 describe simona-prod | grep -E "status|uptime|restarts|memory|cpu" || true
nginx -t
sudo -u postgres psql -d simona_prod -c "SELECT 'PostgreSQL Connected' as status, COUNT(*) as products_count FROM \"Product\";"
sudo -u postgres psql -d simona_prod -c "SELECT COUNT(*) as customers_count FROM \"Customer\";"
sudo -u postgres psql -d simona_prod -c "SELECT COUNT(*) as orders_count FROM \"Order\";"
df -h / | awk 'NR==2 {print "Disk Space: Used " $3 " of " $2 " (" $5 ")"}'

echo -e "\n--- [1.2] Security & SSL Certificates ---"
curl -sI -k https://simona-bt.ru | grep -E "HTTP/|server|x-powered-by"
curl -sI -k https://www.simona-bt.ru | grep -E "HTTP/|location|server" || true

echo -e "\n--- [1.3] UMI.CMS Archive Basic Auth (old.simona-bt.ru) ---"
STATUS_NO_AUTH=$(curl -s -o /dev/null -w "%{http_code}" -k --resolve old.simona-bt.ru:443:5.188.30.184 https://old.simona-bt.ru/)
echo "Status without auth: $STATUS_NO_AUTH (Expected: 401)"
STATUS_WITH_AUTH=$(curl -s -o /dev/null -w "%{http_code}" -k -u admin:Vzevzcj2 --resolve old.simona-bt.ru:443:5.188.30.184 https://old.simona-bt.ru/)
echo "Status with auth (admin:Vzevzcj2): $STATUS_WITH_AUTH (Expected: 200)"

echo -e "\n--- [1.4] 301 Redirects: Product & Category & Brand Check ---"
# Product Redirect Test
PROD_LOC=$(curl -sI -k https://simona-bt.ru/shop/vstraivaemaya_tehnika/mikrovolnovye_pechi_vstroika/vard/vmc_355hk_duhovoj_shkaf/ | grep -i "location" | tr -d '\r')
echo "Product redirect: $PROD_LOC (Expected: /product/vard-vmc-355hk)"

# Category Redirect Test
CAT_LOC=$(curl -sI -k https://simona-bt.ru/shop/vstraivaemaya_tehnika/varochnye_paneli | grep -i "location" | tr -d '\r')
echo "Category redirect: $CAT_LOC (Expected: /catalog/varochnye-paneli)"

# Category with Brand Redirect Test
CAT_BRAND_LOC=$(curl -sI -k https://simona-bt.ru/shop/vstraivaemaya_tehnika/varochnye_paneli/korting | grep -i "location" | tr -d '\r')
echo "Category+Brand redirect: $CAT_BRAND_LOC (Expected: /catalog/varochnye-paneli?brand=K%C3%96RTING)"

# Tier-1 Brands Check (13 brands)
echo "Checking all 13 Tier-1 Brands (/brendy/:slug -> /brands/:slug):"
for B in miele asko smeg liebherr korting omoikiri falmec vard midea bosch elica gorenje evelux; do
    LOC=$(curl -sI -k "https://simona-bt.ru/brendy/$B" | grep -i "location" | tr -d '\r')
    echo "  Tier-1 $B: $LOC"
done

# Tier-2 Brands Check
echo "Checking Tier-2 Brands (/brendy/:slug -> /catalog?brand=:BRAND):"
for B in siemens neff gaggenau; do
    LOC=$(curl -sI -k "https://simona-bt.ru/brendy/$B" | grep -i "location" | tr -d '\r')
    echo "  Tier-2 $B: $LOC"
done

# Utility Routes Check
echo "Checking Legacy Utility Routes:"
for U in politika delivery_payment service_warranty return_exchange_warranty optovyj_otdel; do
    LOC=$(curl -sI -k "https://simona-bt.ru/$U" | grep -i "location" | tr -d '\r')
    echo "  Utility $U: $LOC"
done

echo -e "\n--- [1.5] SEO Search Documents (robots.txt, sitemap.xml, yandex.xml) ---"
echo "robots.txt output:"
curl -s -k https://simona-bt.ru/robots.txt | head -n 10

echo "sitemap.xml check:"
curl -sI -k https://simona-bt.ru/sitemap.xml | grep -E "HTTP/|content-type"

echo "yandex.xml feed check:"
curl -sI -k https://simona-bt.ru/api/feeds/yandex.xml | grep -E "HTTP/|content-type|cache-control"

echo -e "\n--- [1.6] Static File Caching in Nginx (60 days) ---"
curl -sI -k https://simona-bt.ru/images/cms/data/photo_code/89083.jpg | grep -E "HTTP/|content-type|expires|cache-control"

echo -e "\n--- [1.7] Staging Protection (new.simona-bt.ru must be Disallow) ---"
curl -s -k https://new.simona-bt.ru/robots.txt | head -n 4 || true

echo -e "\n✅ Production Server Console Audit Completed Successfully!"
EOF

echo "=========================================================="
echo "🎉 SERVER CONSOLE SUITE COMPLETED"
echo "=========================================================="

<?php
/**
 * Экспорт пользователей (type_id = 8), покупателей и заказов (type_id = 71 с number > 0)
 * вместе с товарными позициями (type_id = 69 + 1С код kod_new field_id=1328)
 * из базы данных UMI.CMS (vstroikaru_smbt) в сжатый JSON-дамп.
 */

ini_set('memory_limit', '1024M');
set_time_limit(0);

$dsn = 'mysql:host=127.0.0.1;dbname=vstroikaru_smbt;charset=utf8mb4';
$user = 'vstroikaru_smbt';
$pass = 'vzevzcj';

$pdo = new PDO($dsn, $user, $pass, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
]);

fwrite(STDERR, "[1/5] Loading registered users (type_id = 8)...\n");

$users = [];
$stmt = $pdo->query("SELECT id, name FROM cms3_objects WHERE type_id = 8");
while ($row = $stmt->fetch()) {
    $id = (int)$row['id'];
    $users[$id] = [
        'umiObjectId' => $id,
        'objName' => $row['name'],
        'login' => null,
        'password' => null,
        'email' => null,
        'lname' => null,
        'fname' => null,
        'fatherName' => null,
        'phone' => null,
        'bonusPoints' => 0,
        'registerDate' => null,
        'address' => null,
        'isPartner' => 0,
        'companyBrand' => null,
        'companyLegal' => null,
    ];
}

$userFieldsSql = "
    SELECT c.obj_id, c.field_id, c.int_val, c.varchar_val, c.text_val
    FROM cms3_object_content c
    INNER JOIN cms3_objects o ON o.id = c.obj_id
    WHERE o.type_id = 8
      AND c.field_id IN (30, 31, 32, 47, 48, 49, 863, 1010, 1386, 1460, 4767, 4785, 4786)
";
$stmt = $pdo->query($userFieldsSql);
while ($r = $stmt->fetch()) {
    $uid = (int)$r['obj_id'];
    if (!isset($users[$uid])) continue;
    $fid = (int)$r['field_id'];
    $val = $r['varchar_val'] !== null ? trim((string)$r['varchar_val']) : ($r['text_val'] !== null ? trim((string)$r['text_val']) : null);
    switch ($fid) {
        case 30: $users[$uid]['login'] = $val; break;
        case 31: $users[$uid]['password'] = $val; break;
        case 32: $users[$uid]['email'] = $val; break;
        case 47: $users[$uid]['lname'] = $val; break;
        case 48: $users[$uid]['fname'] = $val; break;
        case 49: $users[$uid]['fatherName'] = $val; break;
        case 863: $users[$uid]['phone'] = $val; break;
        case 1010: $users[$uid]['bonusPoints'] = (int)$r['int_val']; break;
        case 1386: $users[$uid]['registerDate'] = (int)$r['int_val']; break;
        case 1460: $users[$uid]['address'] = $val; break;
        case 4767: $users[$uid]['isPartner'] = (int)$r['int_val']; break;
        case 4785: $users[$uid]['companyBrand'] = $val; break;
        case 4786: $users[$uid]['companyLegal'] = $val; break;
    }
}
fwrite(STDERR, "Loaded " . count($users) . " registered users.\n");

fwrite(STDERR, "[2/5] Loading guest customers (type_id IN (70, 3201))...\n");
$guestCustomers = [];
$guestSql = "
    SELECT c.obj_id, c.field_id, c.varchar_val, c.text_val
    FROM cms3_object_content c
    INNER JOIN cms3_objects o ON o.id = c.obj_id
    WHERE o.type_id IN (70, 3201)
      AND c.field_id IN (18, 200, 201, 202, 204, 1457, 1338, 1339, 1340, 1341, 1065)
";
$stmt = $pdo->query($guestSql);
while ($r = $stmt->fetch()) {
    $gid = (int)$r['obj_id'];
    if (!isset($guestCustomers[$gid])) {
        $guestCustomers[$gid] = [
            'email' => null,
            'fname' => null,
            'lname' => null,
            'fatherName' => null,
            'phone' => null,
            'address' => null,
        ];
    }
    $fid = (int)$r['field_id'];
    $val = $r['varchar_val'] !== null ? trim((string)$r['varchar_val']) : ($r['text_val'] !== null ? trim((string)$r['text_val']) : null);
    if (!$val) continue;
    switch ($fid) {
        case 18:
        case 1341:
            $guestCustomers[$gid]['email'] = $val;
            break;
        case 200:
        case 1339:
            $guestCustomers[$gid]['fname'] = $val;
            break;
        case 201:
        case 1338:
            $guestCustomers[$gid]['lname'] = $val;
            break;
        case 202:
        case 1340:
            $guestCustomers[$gid]['fatherName'] = $val;
            break;
        case 204:
            $guestCustomers[$gid]['phone'] = $val;
            break;
        case 1457:
        case 1065:
            $guestCustomers[$gid]['address'] = $val;
            break;
    }
}
fwrite(STDERR, "Loaded " . count($guestCustomers) . " guest customer profiles.\n");

fwrite(STDERR, "[3/5] Loading hierarchy -> 1C SKU (kod_new field_id=1328) mapping...\n");
$hierarchySkuMap = [];
$skuSql = "
    SELECT h.id AS hierarchy_id, h.alt_name, c.varchar_val AS sku
    FROM cms3_hierarchy h
    INNER JOIN cms3_object_content c ON c.obj_id = h.obj_id AND c.field_id = 1328
    WHERE c.varchar_val IS NOT NULL AND c.varchar_val != ''
";
$stmt = $pdo->query($skuSql);
while ($r = $stmt->fetch()) {
    $hierarchySkuMap[(int)$r['hierarchy_id']] = [
        'sku' => trim((string)$r['sku']),
        'slug' => $r['alt_name'] ? trim((string)$r['alt_name']) : null,
    ];
}
fwrite(STDERR, "Loaded " . count($hierarchySkuMap) . " hierarchy SKU links.\n");

fwrite(STDERR, "[4/5] Loading real orders (type_id = 71 with field_id = 209 > 0)...\n");
$orders = [];
$orderNumbersStmt = $pdo->query("
    SELECT o.id, o.name, c.int_val AS order_number
    FROM cms3_objects o
    INNER JOIN cms3_object_content c ON c.obj_id = o.id AND c.field_id = 209
    WHERE o.type_id = 71 AND c.int_val > 0
    ORDER BY c.int_val ASC
");
while ($r = $orderNumbersStmt->fetch()) {
    $oid = (int)$r['id'];
    $orders[$oid] = [
        'umiOrderId' => $oid,
        'orderNumber' => (string)$r['order_number'],
        'customerRefId' => null,
        'oneClickRefId' => null,
        'itemIds' => [],
        'totalPrice' => 0.0,
        'statusRelId' => null,
        'paymentStatusRelId' => null,
        'paymentMethodRelId' => null,
        'deliveryRelId' => null,
        'orderDate' => null,
        'createDate' => null,
        'ymClientId' => null,
        'utmSource' => null,
        'utmMedium' => null,
        'utmTerm' => null,
        'utmCampaign' => null,
        'utmContent' => null,
        'comment' => null,
    ];
}

$orderFieldsSql = "
    SELECT c.obj_id, c.field_id, c.int_val, c.float_val, c.varchar_val, c.text_val, c.rel_val
    FROM cms3_object_content c
    INNER JOIN cms3_object_content num ON num.obj_id = c.obj_id AND num.field_id = 209 AND num.int_val > 0
    INNER JOIN cms3_objects o ON o.id = c.obj_id AND o.type_id = 71
    WHERE c.field_id IN (208, 210, 213, 215, 218, 220, 221, 225, 1361, 1362, 1363, 1364, 1365, 1366, 1380, 1458, 4894, 5116)
";
$stmt = $pdo->query($orderFieldsSql);
while ($r = $stmt->fetch()) {
    $oid = (int)$r['obj_id'];
    if (!isset($orders[$oid])) continue;
    $fid = (int)$r['field_id'];
    $val = $r['varchar_val'] !== null ? trim((string)$r['varchar_val']) : ($r['text_val'] !== null ? trim((string)$r['text_val']) : null);
    switch ($fid) {
        case 208:
            if ($r['rel_val']) {
                $orders[$oid]['itemIds'][] = (int)$r['rel_val'];
            }
            break;
        case 210:
            if ($r['rel_val']) $orders[$oid]['customerRefId'] = (int)$r['rel_val'];
            break;
        case 1380:
            if ($r['rel_val']) $orders[$oid]['oneClickRefId'] = (int)$r['rel_val'];
            break;
        case 215:
            $orders[$oid]['totalPrice'] = (float)$r['float_val'];
            break;
        case 213:
            if ($r['rel_val']) $orders[$oid]['statusRelId'] = (int)$r['rel_val'];
            break;
        case 221:
            if ($r['rel_val']) $orders[$oid]['paymentStatusRelId'] = (int)$r['rel_val'];
            break;
        case 220:
            if ($r['rel_val']) $orders[$oid]['paymentMethodRelId'] = (int)$r['rel_val'];
            break;
        case 225:
            if ($r['rel_val']) $orders[$oid]['deliveryRelId'] = (int)$r['rel_val'];
            break;
        case 218:
            if ($r['int_val']) $orders[$oid]['orderDate'] = (int)$r['int_val'];
            break;
        case 1366:
            if ($r['int_val']) $orders[$oid]['createDate'] = (int)$r['int_val'];
            break;
        case 5116:
            $orders[$oid]['ymClientId'] = $val;
            break;
        case 1361:
            $orders[$oid]['utmSource'] = $val;
            break;
        case 1362:
            $orders[$oid]['utmMedium'] = $val;
            break;
        case 1363:
            $orders[$oid]['utmTerm'] = $val;
            break;
        case 1364:
            $orders[$oid]['utmCampaign'] = $val;
            break;
        case 1365:
            $orders[$oid]['utmContent'] = $val;
            break;
        case 1458:
        case 4894:
            if ($val) {
                $orders[$oid]['comment'] = $orders[$oid]['comment']
                    ? $orders[$oid]['comment'] . ' | ' . $val
                    : $val;
            }
            break;
    }
}
fwrite(STDERR, "Loaded " . count($orders) . " orders.\n");

fwrite(STDERR, "[5/5] Loading order items (type_id = 69)...\n");
$orderItems = [];
$stmt = $pdo->query("SELECT id, name FROM cms3_objects WHERE type_id = 69");
while ($r = $stmt->fetch()) {
    $iid = (int)$r['id'];
    $orderItems[$iid] = [
        'name' => trim((string)$r['name']),
        'quantity' => 1,
        'price' => 0.0,
        'totalPrice' => 0.0,
        'sku' => null,
        'slug' => null,
    ];
}

$itemFieldsSql = "
    SELECT c.obj_id, c.field_id, c.int_val, c.float_val, c.tree_val
    FROM cms3_object_content c
    INNER JOIN cms3_objects o ON o.id = c.obj_id
    WHERE o.type_id = 69 AND c.field_id IN (192, 193, 195, 197)
";
$stmt = $pdo->query($itemFieldsSql);
while ($r = $stmt->fetch()) {
    $iid = (int)$r['obj_id'];
    if (!isset($orderItems[$iid])) continue;
    $fid = (int)$r['field_id'];
    switch ($fid) {
        case 192:
            $amt = (int)$r['int_val'];
            if ($amt > 0) $orderItems[$iid]['quantity'] = $amt;
            break;
        case 193:
            $orderItems[$iid]['price'] = (float)$r['float_val'];
            break;
        case 195:
            $orderItems[$iid]['totalPrice'] = (float)$r['float_val'];
            break;
        case 197:
            $hid = (int)$r['tree_val'];
            if ($hid && isset($hierarchySkuMap[$hid])) {
                $orderItems[$iid]['sku'] = $hierarchySkuMap[$hid]['sku'];
                $orderItems[$iid]['slug'] = $hierarchySkuMap[$hid]['slug'];
            }
            break;
    }
}

$exportOrders = [];
foreach ($orders as $oid => $ord) {
    $custUmiId = null;
    $custName = '';
    $custPhone = '';
    $custEmail = '';
    $custAddress = '';

    $refId = $ord['customerRefId'];
    $oneClickId = $ord['oneClickRefId'];

    if ($refId && isset($users[$refId])) {
        $u = $users[$refId];
        $custUmiId = $refId;
        $custName = trim(implode(' ', array_filter([$u['lname'], $u['fname'], $u['fatherName']])));
        if (!$custName) $custName = $u['objName'] ?: $u['login'] ?: '';
        $custPhone = (string)($u['phone'] ?? '');
        $custEmail = (string)($u['email'] ?? '');
        $custAddress = (string)($u['address'] ?? '');
    } elseif ($refId && isset($guestCustomers[$refId])) {
        $g = $guestCustomers[$refId];
        $custName = trim(implode(' ', array_filter([$g['lname'], $g['fname'], $g['fatherName']])));
        $custPhone = (string)($g['phone'] ?? '');
        $custEmail = (string)($g['email'] ?? '');
        $custAddress = (string)($g['address'] ?? '');
    }

    if ($oneClickId && isset($guestCustomers[$oneClickId])) {
        $oc = $guestCustomers[$oneClickId];
        $ocName = trim(implode(' ', array_filter([$oc['lname'], $oc['fname'], $oc['fatherName']])));
        if (!$custName && $ocName) $custName = $ocName;
        if (!$custPhone && $oc['phone']) $custPhone = (string)$oc['phone'];
        if (!$custEmail && $oc['email']) $custEmail = (string)$oc['email'];
        if (!$custAddress && $oc['address']) $custAddress = (string)$oc['address'];
    }

    $itemsList = [];
    $computedSum = 0.0;
    foreach (array_unique($ord['itemIds']) as $iid) {
        if (!isset($orderItems[$iid])) continue;
        $it = $orderItems[$iid];
        $price = $it['price'] > 0 ? $it['price'] : ($it['totalPrice'] > 0 && $it['quantity'] > 0 ? $it['totalPrice'] / $it['quantity'] : 0.0);
        $computedSum += $price * $it['quantity'];
        $itemsList[] = [
            'name' => $it['name'] ?: 'Товар СИМОНА',
            'quantity' => $it['quantity'],
            'price' => $price,
            'sku' => $it['sku'],
            'slug' => $it['slug'],
        ];
    }

    $totalAmount = $ord['totalPrice'] > 0 ? $ord['totalPrice'] : $computedSum;

    $exportOrders[] = [
        'umiOrderId' => $ord['umiOrderId'],
        'orderNumber' => $ord['orderNumber'],
        'customerUmiId' => $custUmiId,
        'customerName' => $custName ?: 'Покупатель СИМОНА',
        'customerPhone' => $custPhone,
        'customerEmail' => $custEmail ?: null,
        'deliveryAddress' => $custAddress ?: null,
        'totalAmount' => $totalAmount,
        'statusRelId' => $ord['statusRelId'],
        'paymentStatusRelId' => $ord['paymentStatusRelId'],
        'paymentMethodRelId' => $ord['paymentMethodRelId'],
        'deliveryRelId' => $ord['deliveryRelId'],
        'orderTimestamp' => $ord['orderDate'] ?: $ord['createDate'] ?: null,
        'ymClientId' => $ord['ymClientId'],
        'utmSource' => $ord['utmSource'],
        'utmMedium' => $ord['utmMedium'],
        'utmTerm' => $ord['utmTerm'],
        'utmCampaign' => $ord['utmCampaign'],
        'utmContent' => $ord['utmContent'],
        'comment' => $ord['comment'],
        'items' => $itemsList,
    ];
}

$outputData = [
    'exportedAt' => date('c'),
    'usersCount' => count($users),
    'ordersCount' => count($exportOrders),
    'users' => array_values($users),
    'orders' => $exportOrders,
];

$json = json_encode($outputData, JSON_UNESCAPED_UNICODE);
$gzFile = '/tmp/umi_customers_orders.json.gz';
file_put_contents($gzFile, gzencode($json, 6));
fwrite(STDERR, "Successfully wrote $gzFile (" . filesize($gzFile) . " bytes).\n");
echo "OK\n";

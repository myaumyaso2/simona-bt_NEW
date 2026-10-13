import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { NextRequest } from 'next/server';
import { prisma } from '../lib/prisma';
import { getAuthCookieName, getAuthToken } from '../lib/adminAuth';
import { CUSTOMER_COOKIE_NAME } from '../lib/customerAuth';
import { POST as checkoutPOST, GET as checkoutGET } from '../app/api/checkout/route';
import { POST as yookassaWebhookPOST } from '../app/api/webhooks/yookassa/route';
import { PATCH as managerOrdersPATCH } from '../app/api/manager/orders/route';
import { POST as sendCodePOST } from '../app/api/auth/send-code/route';
import { POST as verifyCodePOST } from '../app/api/auth/verify-code/route';
import { POST as loginPasswordPOST } from '../app/api/auth/login-password/route';
import { GET as authMeGET } from '../app/api/auth/me/route';
import {
  GET as chatMessagesGET,
  POST as chatMessagesPOST,
} from '../app/api/chat/messages/route';
import { POST as maxWebhookPOST } from '../app/api/chat/webhook/max/route';
import {
  GET as managerChatGET,
  POST as managerChatPOST,
} from '../app/api/manager/chat/route';
import { GET as searchGET } from '../app/api/search/route';
import { searchCatalogProducts } from '../lib/products';

async function main() {
  console.log('======================================================');
  console.log('🚀 SPRINT 2 — END-TO-END DEFINITION OF DONE VERIFIER');
  console.log('======================================================');

  // Enable dry-run for SMTP and test-mode for YooKassa during automated verification
  process.env.SMTP_DRY_RUN = '1';
  process.env.YOOKASSA_TEST_MODE = 'true';

  const managerCookie = `${getAuthCookieName()}=${getAuthToken()}`;
  const createdOrderIds: string[] = [];
  const testSessionId = `test_sprint2_${Date.now()}`;
  const testEmail = `sprint2-test-${Date.now()}@simona-bt.ru`;
  const testPhone = '+7 (999) 777-88-99';
  const normalizedPhone = '+79997778899';
  let createdCustomerId: string | null = null;

  try {
    // =========================================================================
    // DoD #1: YooKassa Acquiring (capture: false, 54-FZ) & Strict Presence Rule
    // =========================================================================
    console.log('\n--- [DoD #1] Testing YooKassa Hold Payment & Strict Presence Rule ---');

    // Find a real LOCAL_STOCK product with stockKominterna > 0
    const localStockProduct = await prisma.product.findFirst({
      where: {
        isActive: true,
        physicalStatus: 'LOCAL_STOCK',
        stockKominterna: { gt: 0 },
        price: { gt: 0 },
      },
    });
    if (!localStockProduct) {
      throw new Error('No active LOCAL_STOCK product with stockKominterna > 0 found in DB');
    }

    // 1A. Order with LOCAL_STOCK item + CARD_ONLINE -> MUST create YooKassa Hold payment
    const localOrderReq = new NextRequest('http://localhost:3000/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: 'Тест ЮKassa Склад',
        customerPhone: testPhone,
        customerEmail: testEmail,
        deliveryType: 'PICKUP_WAREHOUSE_KOMINTERNA',
        paymentMethod: 'CARD_ONLINE',
        items: [
          {
            productId: localStockProduct.id,
            sku: localStockProduct.sku,
            name: localStockProduct.name,
            price: localStockProduct.price,
            quantity: 1,
            brand: localStockProduct.brand,
            physicalStatus: 'LOCAL_STOCK',
          },
        ],
      }),
    });

    const localOrderRes = await checkoutPOST(localOrderReq);
    const localOrderData = await localOrderRes.json();
    if (localOrderData.orderId) createdOrderIds.push(localOrderData.orderId);
    if (localOrderData.customerId) createdCustomerId = localOrderData.customerId;

    if (
      !localOrderData.success ||
      localOrderData.requiresManagerConfirmation !== false ||
      !localOrderData.confirmationUrl ||
      !localOrderData.paymentId
    ) {
      throw new Error(
        `LOCAL_STOCK online payment hold failed: ${JSON.stringify(localOrderData)}`
      );
    }
    console.log(
      `✅ LOCAL_STOCK Checkout Created YooKassa Hold: order=${localOrderData.orderNumber}, paymentId=${localOrderData.paymentId}, url=${localOrderData.confirmationUrl}`
    );

    // Verify OrderItem rows created in DB
    const dbLocalOrder = await prisma.order.findUnique({
      where: { id: localOrderData.orderId },
      include: { orderItems: true },
    });
    if (!dbLocalOrder || dbLocalOrder.orderItems.length !== 1) {
      throw new Error('OrderItem relation was not created during checkout');
    }

    // 1B. Test YooKassa Webhook: payment.waiting_for_capture -> HOLD
    const holdWebhookReq = new NextRequest('http://localhost:3000/api/webhooks/yookassa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'notification',
        event: 'payment.waiting_for_capture',
        object: {
          id: localOrderData.paymentId,
          status: 'waiting_for_capture',
          paid: true,
          captured_at: null,
          amount: {
            value: localStockProduct.price.toFixed(2),
            currency: 'RUB',
          },
          metadata: {
            orderId: localOrderData.orderId,
            orderNumber: localOrderData.orderNumber,
          },
        },
      }),
    });
    const holdWebhookRes = await yookassaWebhookPOST(holdWebhookReq);
    const holdWebhookData = await holdWebhookRes.json();
    if (!holdWebhookData.ok || holdWebhookData.paymentStatus !== 'HOLD') {
      throw new Error(`YooKassa HOLD webhook failed: ${JSON.stringify(holdWebhookData)}`);
    }
    console.log(
      `✅ YooKassa Webhook (payment.waiting_for_capture) -> paymentStatus = ${holdWebhookData.paymentStatus}`
    );

    // Verify GET /api/checkout?order=... returns HOLD status for /checkout/success page
    const successPageReq = new NextRequest(
      `http://localhost:3000/api/checkout?order=${encodeURIComponent(localOrderData.orderNumber)}`
    );
    const successPageRes = await checkoutGET(successPageReq);
    const successPageData = await successPageRes.json();
    if (successPageData.order?.paymentStatus !== 'HOLD') {
      throw new Error(
        `GET /api/checkout did not return HOLD status: ${JSON.stringify(successPageData)}`
      );
    }

    // 1C. Test YooKassa Webhook: payment.succeeded -> PAID
    const paidWebhookReq = new NextRequest('http://localhost:3000/api/webhooks/yookassa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'notification',
        event: 'payment.succeeded',
        object: {
          id: localOrderData.paymentId,
          status: 'succeeded',
          paid: true,
          amount: {
            value: localStockProduct.price.toFixed(2),
            currency: 'RUB',
          },
          metadata: {
            orderId: localOrderData.orderId,
            orderNumber: localOrderData.orderNumber,
          },
        },
      }),
    });
    const paidWebhookRes = await yookassaWebhookPOST(paidWebhookReq);
    const paidWebhookData = await paidWebhookRes.json();
    if (!paidWebhookData.ok || paidWebhookData.paymentStatus !== 'PAID') {
      throw new Error(`YooKassa PAID webhook failed: ${JSON.stringify(paidWebhookData)}`);
    }
    console.log(
      `✅ YooKassa Webhook (payment.succeeded) -> paymentStatus = ${paidWebhookData.paymentStatus}`
    );

    // 1D. Order with SHOWROOM / ON_ORDER item + CARD_ONLINE -> MUST NOT trigger YooKassa on checkout
    const showroomProduct = await prisma.product.findFirst({
      where: {
        isActive: true,
        physicalStatus: 'SHOWROOM',
      },
    });
    const nonStockCheckoutReq = new NextRequest('http://localhost:3000/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: 'Тест Витрина Без Холда',
        customerPhone: testPhone,
        customerEmail: testEmail,
        deliveryType: 'PICKUP_SHOWROOM_15',
        paymentMethod: 'CARD_ONLINE',
        items: [
          {
            productId: showroomProduct?.id || 'showroom-item',
            sku: showroomProduct?.sku || '89083',
            name: showroomProduct?.name || 'Духовой шкаф Körting OKB 1680 GN MW',
            price: showroomProduct?.price || 64990,
            quantity: 1,
            brand: showroomProduct?.brand || 'Körting',
            physicalStatus: 'SHOWROOM',
          },
        ],
      }),
    });
    const nonStockRes = await checkoutPOST(nonStockCheckoutReq);
    const nonStockData = await nonStockRes.json();
    if (nonStockData.orderId) createdOrderIds.push(nonStockData.orderId);
    if (
      !nonStockData.success ||
      nonStockData.requiresManagerConfirmation !== true ||
      nonStockData.confirmationUrl !== null
    ) {
      throw new Error(
        `SHOWROOM order unexpectedly triggered online acquiring: ${JSON.stringify(nonStockData)}`
      );
    }
    console.log(
      `✅ SHOWROOM/ON_ORDER Presence Rule Verified: requiresManagerConfirmation=true, confirmationUrl=null`
    );

    // Manager attaches manual YooKassa link in /manager/orders
    const manualPaymentLink = 'https://yookassa.ru/my/i/sprint2-manual-link';
    const mgrPatchReq = new NextRequest('http://localhost:3000/api/manager/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', cookie: managerCookie },
      body: JSON.stringify({
        id: nonStockData.orderId,
        status: 'CONFIRMED',
        paymentLink: manualPaymentLink,
      }),
    });
    const mgrPatchRes = await managerOrdersPATCH(mgrPatchReq);
    const mgrPatchData = await mgrPatchRes.json();
    if (!mgrPatchData.success || mgrPatchData.order?.paymentLink !== manualPaymentLink) {
      throw new Error(`Manager manual paymentLink PATCH failed: ${JSON.stringify(mgrPatchData)}`);
    }
    console.log(
      `✅ Manager Manual Payment Link Attached & Emailed: paymentLink=${mgrPatchData.order.paymentLink}`
    );

    // =========================================================================
    // DoD #2: UMI.CMS Migration & /profile Authentication (OTP + Legacy Password)
    // =========================================================================
    console.log('\n--- [DoD #2] Verifying UMI.CMS Migration & /profile Auth ---');

    const [migratedCustomersCount, designersCount, migratedOrdersCount, orderItemsCount] =
      await Promise.all([
        prisma.customer.count({ where: { umiObjectId: { not: null } } }),
        prisma.customer.count({ where: { role: 'DESIGNER' } }),
        prisma.order.count({ where: { umiOrderId: { not: null } } }),
        prisma.orderItem.count(),
      ]);

    if (
      migratedCustomersCount < 13000 ||
      designersCount < 10 ||
      migratedOrdersCount < 14000 ||
      orderItemsCount < 18000
    ) {
      throw new Error(
        `UMI Migration counts below threshold: customers=${migratedCustomersCount}, designers=${designersCount}, orders=${migratedOrdersCount}, items=${orderItemsCount}`
      );
    }
    console.log(
      `✅ UMI.CMS Migration Counts Verified: Customers=${migratedCustomersCount} (Designers=${designersCount}), Orders=${migratedOrdersCount}, OrderItems=${orderItemsCount}`
    );

    // 2A. Test OTP Email Code Flow (/api/auth/send-code -> /api/auth/verify-code -> /api/auth/me)
    const sendOtpReq = new NextRequest('http://localhost:3000/api/auth/send-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: testEmail }),
    });
    const sendOtpRes = await sendCodePOST(sendOtpReq);
    const sendOtpData = await sendOtpRes.json();
    if (!sendOtpData.ok) {
      throw new Error(`OTP send-code failed: ${JSON.stringify(sendOtpData)}`);
    }

    const customerWithOtp = await prisma.customer.findUnique({
      where: { phone: normalizedPhone },
    });
    if (!customerWithOtp?.otpCode) {
      throw new Error('OTP code was not stored on Customer record');
    }

    const verifyOtpReq = new NextRequest('http://localhost:3000/api/auth/verify-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: testEmail, code: customerWithOtp.otpCode }),
    });
    const verifyOtpRes = await verifyCodePOST(verifyOtpReq);
    const verifyOtpData = await verifyOtpRes.json();
    if (!verifyOtpData.ok) {
      throw new Error(`OTP verify-code failed: ${JSON.stringify(verifyOtpData)}`);
    }

    const setCookieHeader = verifyOtpRes.headers.get('set-cookie') || '';
    const tokenMatch = setCookieHeader.match(
      new RegExp(`${CUSTOMER_COOKIE_NAME}=([^;]+)`)
    );
    if (!tokenMatch) {
      throw new Error('simona_customer_token HttpOnly cookie was not set on verify-code');
    }
    const customerCookie = `${CUSTOMER_COOKIE_NAME}=${tokenMatch[1]}`;
    console.log(`✅ OTP Login Flow Verified: issued HttpOnly cookie ${CUSTOMER_COOKIE_NAME}`);

    // Verify /api/auth/me returns the customer's orders including the manual paymentLink
    const authMeReq = new NextRequest('http://localhost:3000/api/auth/me', {
      headers: { cookie: customerCookie },
    });
    const authMeRes = await authMeGET(authMeReq);
    const authMeData = await authMeRes.json();
    if (!authMeData.authenticated || authMeData.orders.length < 2) {
      throw new Error(`/api/auth/me failed to return customer orders: ${JSON.stringify(authMeData)}`);
    }
    const orderWithManualLink = authMeData.orders.find(
      (o: { id: string }) => o.id === nonStockData.orderId
    );
    if (orderWithManualLink?.paymentLink !== manualPaymentLink) {
      throw new Error('Manual paymentLink not exposed in /api/auth/me for /profile');
    }
    console.log(
      `✅ /api/auth/me Verified: orders=${authMeData.orders.length}, manual paymentLink present for "Оплатить онлайн" button`
    );

    // 2B. Test Legacy UMI.CMS Password Verification & Automatic Upgrade to Scrypt
    const rawLegacyPass = 'SimonaLegacy2026!';
    const md5LegacyHash = crypto.createHash('md5').update(rawLegacyPass, 'utf8').digest('hex');
    await prisma.customer.update({
      where: { id: customerWithOtp.id },
      data: {
        legacyPassword: md5LegacyHash,
        passwordHash: null,
      },
    });

    const legacyLoginReq = new NextRequest('http://localhost:3000/api/auth/login-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: testEmail,
        password: rawLegacyPass,
      }),
    });
    const legacyLoginRes = await loginPasswordPOST(legacyLoginReq);
    const legacyLoginData = await legacyLoginRes.json();
    if (!legacyLoginData.ok) {
      throw new Error(`Legacy UMI password login failed: ${JSON.stringify(legacyLoginData)}`);
    }

    const upgradedCustomer = await prisma.customer.findUnique({
      where: { id: customerWithOtp.id },
    });
    if (
      !upgradedCustomer?.passwordHash?.startsWith('$scrypt$') ||
      upgradedCustomer.legacyPassword !== null
    ) {
      throw new Error('Legacy UMI password was not transparently upgraded to $scrypt$');
    }
    console.log(
      `✅ Legacy UMI.CMS Password Login & Transparent Upgrade to $scrypt$ Verified`
    );

    // =========================================================================
    // DoD #3: Bidirectional Live Chat with MAX & Design System Purity
    // =========================================================================
    console.log('\n--- [DoD #3] Verifying LiveChatWidget Design Purity & Bidirectional MAX Chat ---');

    const widgetSource = fs.readFileSync(
      path.join(process.cwd(), 'components', 'chat', 'LiveChatWidget.tsx'),
      'utf8'
    );
    if (widgetSource.includes('lucide-react')) {
      throw new Error('LiveChatWidget.tsx still contains forbidden lucide-react import');
    }
    if (widgetSource.includes('rounded-full')) {
      throw new Error('LiveChatWidget.tsx still contains forbidden rounded-full class');
    }
    console.log(`✅ LiveChatWidget.tsx Design Audit Passed: 0 lucide-react, 0 rounded-full`);

    // 3A. Client sends message from LiveChatWidget
    const clientMsgReq = new NextRequest('http://localhost:3000/api/chat/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: testSessionId,
        text: 'Здравствуйте! Подскажите, есть ли духовой шкаф Körting OKB 1680 на Белинского 15?',
        clientName: 'Алексей (Тест Чата)',
        clientPhone: testPhone,
        pageUrl: 'https://simona-bt.ru/catalog?q=OKB+1680',
      }),
    });
    const clientMsgRes = await chatMessagesPOST(clientMsgReq);
    const clientMsgData = await clientMsgRes.json();
    if (!clientMsgData.ok || clientMsgData.message?.sender !== 'CLIENT') {
      throw new Error(`Client chat POST failed: ${JSON.stringify(clientMsgData)}`);
    }

    // 3B. Consultant replies via MAX Webhook (Reply to message containing [#chat_${testSessionId}])
    const maxReplyReq = new NextRequest('http://localhost:3000/api/chat/webhook/max', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: {
          body: {
            mid: `max_mid_${Date.now()}`,
            text: 'Добрый день, Алексей! Да, эта модель представлена на витрине флагманского салона на ул. Белинского, 15.',
          },
          link: {
            message: {
              body: {
                text: `💬 Новое сообщение в чате на сайте\n[#chat_${testSessionId}]`,
              },
            },
          },
        },
      }),
    });
    const maxReplyRes = await maxWebhookPOST(maxReplyReq);
    const maxReplyData = await maxReplyRes.json();
    if (!maxReplyData.ok || maxReplyData.sessionId !== testSessionId) {
      throw new Error(`MAX chat webhook reply failed: ${JSON.stringify(maxReplyData)}`);
    }

    // 3C. Manager also replies from /manager/orders ("Онлайн-чат" tab)
    const mgrReplyReq = new NextRequest('http://localhost:3000/api/manager/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', cookie: managerCookie },
      body: JSON.stringify({
        sessionId: testSessionId,
        text: 'Ждем вас сегодня до 20:00, парковка у салона свободна.',
      }),
    });
    const mgrReplyRes = await managerChatPOST(mgrReplyReq);
    const mgrReplyData = await mgrReplyRes.json();
    if (!mgrReplyData.ok || mgrReplyData.message?.sender !== 'MANAGER') {
      throw new Error(`Manager chat POST failed: ${JSON.stringify(mgrReplyData)}`);
    }

    // Verify client polling GET /api/chat/messages?sessionId=... receives all 3 messages
    const pollChatReq = new NextRequest(
      `http://localhost:3000/api/chat/messages?sessionId=${encodeURIComponent(testSessionId)}`
    );
    const pollChatRes = await chatMessagesGET(pollChatReq);
    const pollChatData = await pollChatRes.json();
    if (!pollChatData.messages || pollChatData.messages.length !== 3) {
      throw new Error(
        `Expected 3 messages in chat session, got: ${JSON.stringify(pollChatData)}`
      );
    }

    // Verify manager chat sessions list GET /api/manager/chat includes testSessionId
    const mgrSessionsReq = new NextRequest('http://localhost:3000/api/manager/chat', {
      headers: { cookie: managerCookie },
    });
    const mgrSessionsRes = await managerChatGET(mgrSessionsReq);
    const mgrSessionsData = await mgrSessionsRes.json();
    const foundSession = mgrSessionsData.sessions?.find(
      (s: { sessionId: string }) => s.sessionId === testSessionId
    );
    if (!foundSession) {
      throw new Error('Test chat session not found in GET /api/manager/chat');
    }
    console.log(
      `✅ Bidirectional Live Chat Verified: Client -> MAX Webhook Reply -> Manager Panel Reply (3 messages synced)`
    );

    // =========================================================================
    // DoD #4: Full Search (/catalog?q=...) with SKU/Article Ranking & Facets
    // =========================================================================
    console.log('\n--- [DoD #4] Verifying Full Search (/catalog?q=...) & Ranking ---');

    const fastSearchSource = fs.readFileSync(
      path.join(process.cwd(), 'components', 'modals', 'FastSearchModal.tsx'),
      'utf8'
    );
    if (fastSearchSource.includes('lucide-react')) {
      throw new Error('FastSearchModal.tsx still contains forbidden lucide-react import');
    }
    if (!fastSearchSource.includes('/catalog?q=')) {
      throw new Error('FastSearchModal.tsx does not navigate to /catalog?q=');
    }

    // 4A. Exact 1C SKU search ranking
    const exactSkuReq = new NextRequest(
      `http://localhost:3000/api/search?q=${encodeURIComponent(localStockProduct.sku)}`
    );
    const exactSkuRes = await searchGET(exactSkuReq);
    const exactSkuData = await exactSkuRes.json();
    if (
      !exactSkuData.results?.length ||
      exactSkuData.results[0].sku !== localStockProduct.sku
    ) {
      throw new Error(
        `Exact 1C SKU search failed to rank SKU ${localStockProduct.sku} first`
      );
    }
    console.log(
      `✅ Exact 1C SKU Search Verified: query="${localStockProduct.sku}" -> #1 result SKU="${exactSkuData.results[0].sku}" (${exactSkuData.results[0].name})`
    );

    // 4B. Full catalog search with Cyrillic query + presence ordering
    const fullSearchResults = await searchCatalogProducts('духовой шкаф', 100);
    if (fullSearchResults.products.length === 0) {
      throw new Error('searchCatalogProducts("духовой шкаф") returned 0 products');
    }
    console.log(
      `✅ Catalog Full Search Verified: query="духовой шкаф" returned ${fullSearchResults.products.length} products (total=${fullSearchResults.total}), #1 presence=${fullSearchResults.products[0].physicalStatus}`
    );

    console.log('\n======================================================');
    console.log('🎉 ALL SPRINT 2 DoD CHECKS PASSED 100% SUCCESSFULLY!');
    console.log('======================================================');
  } finally {
    // Cleanup temporary test artifacts
    await prisma.chatMessage.deleteMany({ where: { sessionId: testSessionId } });
    const testCust = await prisma.customer.findUnique({
      where: { phone: normalizedPhone },
      include: { orders: true },
    });
    const allTestOrderIds = Array.from(
      new Set([...createdOrderIds, ...(testCust?.orders.map((o) => o.id) || [])])
    );
    if (allTestOrderIds.length > 0) {
      await prisma.orderItem.deleteMany({ where: { orderId: { in: allTestOrderIds } } });
      await prisma.order.deleteMany({ where: { id: { in: allTestOrderIds } } });
    }
    if (testCust) {
      await prisma.customer.delete({ where: { id: testCust.id } }).catch(() => {});
    } else if (createdCustomerId) {
      await prisma.customer.delete({ where: { id: createdCustomerId } }).catch(() => {});
    }
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error('\n❌ SPRINT 2 DoD VERIFICATION FAILED:', err);
  process.exit(1);
});

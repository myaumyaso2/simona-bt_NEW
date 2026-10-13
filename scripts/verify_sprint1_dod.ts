import * as fs from 'fs';
import * as path from 'path';
import { NextRequest } from 'next/server';
import { prisma } from '../lib/prisma';
import { verifySmtpConnection } from '../lib/mail/mailer';
import { getAuthCookieName, getAuthToken } from '../lib/adminAuth';
import { POST as checkoutPOST } from '../app/api/checkout/route';
import {
  GET as managerOrdersGET,
  PATCH as managerOrdersPATCH,
} from '../app/api/manager/orders/route';
import {
  GET as noPhotoGET,
  POST as noPhotoPOST,
} from '../app/api/manager/products-no-photo/route';
import { POST as leadsPOST } from '../app/api/leads/route';
import { GET as managerLeadsGET } from '../app/api/manager/leads/route';
import { GET as attachmentGET } from '../app/api/manager/leads/attachment/route';

async function main() {
  console.log('======================================================');
  console.log('🚀 SPRINT 1 — END-TO-END DEFINITION OF DONE VERIFIER');
  console.log('======================================================');

  // 0. Check SMTP connection to smtp.mail.ru:465
  const smtpCheck = await verifySmtpConnection();
  console.log(
    `[SMTP Verify] smtp.mail.ru:465 (inet@simona-bt.ru): ${
      smtpCheck.ok ? '✅ OK (Ready)' : `⚠️ Warning (${smtpCheck.error})`
    }`
  );

  // Enable SMTP_DRY_RUN so automated E2E tests do not spam live sales inbox
  process.env.SMTP_DRY_RUN = '1';

  const authCookie = `${getAuthCookieName()}=${getAuthToken()}`;
  const createdOrderIds: string[] = [];
  const createdLeadIds: string[] = [];
  const testPhone = '+7 (999) 000-11-22';
  const normalizedTestPhone = '+79990001122';
  const testSku = '999991';

  try {
    // =========================================================================
    // DoD #2: Checkout (Full + Quick 1-click in CartDrawer) + Attribution + Notifications
    // =========================================================================
    console.log('\n--- [DoD #2] Testing Full Checkout & Quick 1-Click Order ---');

    const fullCheckoutReq = new NextRequest('http://localhost:3000/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: 'Тестовый Покупатель (Full Checkout)',
        customerPhone: testPhone,
        customerEmail: 'test-client@simona-bt.ru',
        deliveryType: 'COURIER_DELIVERY',
        deliveryAddress: 'Нижний Новгород, ул. Белинского, д. 15, кв. 10',
        paymentMethod: 'CARD_ONLINE',
        items: [
          {
            productId: 'test-prod-1',
            sku: '89083',
            name: 'Духовой шкаф Körting OKB 1680 GN MW',
            price: 64990,
            quantity: 1,
            brand: 'Körting',
            physicalStatus: 'SHOWROOM',
          },
        ],
        utmSource: 'yandex',
        utmMedium: 'cpc',
        utmCampaign: 'nn_builtin_2026',
        utmContent: 'ad_1',
        utmTerm: 'духовой шкаф кортинг',
        ymClientId: '1728391029381029',
        yclid: '998877665544332211',
      }),
    });

    const fullCheckoutRes = await checkoutPOST(fullCheckoutReq);
    const fullCheckoutData = await fullCheckoutRes.json();
    if (!fullCheckoutData.success) {
      throw new Error(`Full checkout failed: ${JSON.stringify(fullCheckoutData)}`);
    }
    createdOrderIds.push(fullCheckoutData.orderId);
    console.log(
      `✅ Full Checkout Order Created: ${fullCheckoutData.orderNumber} (ID: ${fullCheckoutData.orderId})`
    );

    // Quick 1-click order from CartDrawer
    const quickCheckoutReq = new NextRequest('http://localhost:3000/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: 'Тестовый Покупатель (Быстрый заказ)',
        customerPhone: '8 999 000 11 22',
        deliveryType: 'PICKUP_WAREHOUSE_KOMINTERNA',
        paymentMethod: 'IN_SALON',
        items: [
          {
            productId: 'test-prod-2',
            sku: '90661',
            name: 'Встраиваемая посудомоечная машина MIDEA MID60S360i',
            price: 42990,
            quantity: 1,
            brand: 'MIDEA',
            physicalStatus: 'LOCAL_STOCK',
          },
        ],
        utmSource: 'google',
        ymClientId: '1728391029381029',
      }),
    });

    const quickCheckoutRes = await checkoutPOST(quickCheckoutReq);
    const quickCheckoutData = await quickCheckoutRes.json();
    if (!quickCheckoutData.success) {
      throw new Error(`Quick checkout failed: ${JSON.stringify(quickCheckoutData)}`);
    }
    createdOrderIds.push(quickCheckoutData.orderId);
    console.log(`✅ Quick 1-Click Order Created: ${quickCheckoutData.orderNumber}`);

    // Verify Customer record in DB linked by normalized phone
    const customer = await prisma.customer.findUnique({
      where: { phone: normalizedTestPhone },
      include: { orders: true },
    });
    if (!customer || customer.orders.length < 2) {
      throw new Error('Customer upsert or order relation failed');
    }
    console.log(
      `✅ Customer Upsert Verified: phone=${customer.phone}, linkedOrders=${customer.orders.length}`
    );

    // Verify /api/manager/orders returns the new orders with ymClientId and utm_*
    const mgrOrdersReq = new NextRequest('http://localhost:3000/api/manager/orders', {
      headers: { cookie: authCookie },
    });
    const mgrOrdersRes = await managerOrdersGET(mgrOrdersReq);
    const mgrOrdersData = await mgrOrdersRes.json();
    const foundOrder = mgrOrdersData.orders.find(
      (o: { id: string }) => o.id === fullCheckoutData.orderId
    );
    if (
      !foundOrder ||
      foundOrder.ymClientId !== '1728391029381029' ||
      foundOrder.utmSource !== 'yandex'
    ) {
      throw new Error('Order not found in /api/manager/orders or missing attribution');
    }
    console.log(
      `✅ Manager Panel Orders API Verified: ymClientId=${foundOrder.ymClientId}, utmSource=${foundOrder.utmSource}, asanaTaskId=${foundOrder.asanaTaskId}`
    );

    // =========================================================================
    // DoD #3: Changing Order Status in /manager/orders sends Client Email with Online Payment Link
    // =========================================================================
    console.log('\n--- [DoD #3] Testing Order Status Change & Payment Link Email ---');
    const patchOrderReq = new NextRequest('http://localhost:3000/api/manager/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', cookie: authCookie },
      body: JSON.stringify({
        id: fullCheckoutData.orderId,
        status: 'CONFIRMED',
        paymentLink: 'https://yookassa.ru/my/i/test-sprint1-hold',
      }),
    });
    const patchOrderRes = await managerOrdersPATCH(patchOrderReq);
    const patchOrderData = await patchOrderRes.json();
    if (!patchOrderData.success || !patchOrderData.emailResult?.sent) {
      throw new Error(`Order status PATCH failed: ${JSON.stringify(patchOrderData)}`);
    }
    console.log(
      `✅ Order Status Updated to CONFIRMED with paymentLink; Client Email Sent=${patchOrderData.emailResult.sent}`
    );

    // =========================================================================
    // DoD #4: Uploading Photo for No-Photo 1C Product activates isActive = true
    // =========================================================================
    console.log('\n--- [DoD #4] Testing Drag & Drop Photo Upload for 1C New Product ---');
    await prisma.product.upsert({
      where: { slug: 'test-1c-no-photo-999991' },
      update: {
        sku: testSku,
        isActive: false,
        imagesJson: '[]',
      },
      create: {
        sku: testSku,
        slug: 'test-1c-no-photo-999991',
        name: 'Духовой шкаф ASKO OCS8664S',
        brand: 'ASKO',
        category: 'Духовые шкафы',
        price: 189900,
        stockKominterna: 2,
        physicalStatus: 'LOCAL_STOCK',
        isActive: false,
        imagesJson: '[]',
        systemArticle: 'OCS8664S',
        description: 'Тестовая новинка 1С без фото',
      },
    });

    const listNoPhotoReq = new NextRequest('http://localhost:3000/api/manager/products-no-photo', {
      headers: { cookie: authCookie },
    });
    const listNoPhotoRes = await noPhotoGET(listNoPhotoReq);
    const listNoPhotoData = await listNoPhotoRes.json();
    const foundNoPhoto = listNoPhotoData.products.find(
      (p: { sku: string }) => p.sku === testSku
    );
    if (!foundNoPhoto) {
      throw new Error('Test no-photo product not listed in /api/manager/products-no-photo');
    }
    console.log(`✅ No-Photo Product Listed in Manager Tab: SKU=${foundNoPhoto.sku}`);

    // Create a minimal valid JPEG buffer and upload via FormData
    const dummyJpg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0xff, 0xd9]);
    const photoFormData = new FormData();
    photoFormData.append('sku', testSku);
    photoFormData.append(
      'file',
      new File([dummyJpg], `${testSku}.jpg`, { type: 'image/jpeg' })
    );

    const uploadPhotoReq = new NextRequest(
      'http://localhost:3000/api/manager/products-no-photo',
      {
        method: 'POST',
        headers: { cookie: authCookie },
        body: photoFormData,
      }
    );
    const uploadPhotoRes = await noPhotoPOST(uploadPhotoReq);
    const uploadPhotoData = await uploadPhotoRes.json();
    if (!uploadPhotoData.success || !uploadPhotoData.product?.isActive) {
      throw new Error(`Photo upload failed: ${JSON.stringify(uploadPhotoData)}`);
    }

    const savedDiskPath = path.join(
      process.cwd(),
      'public',
      'images',
      'cms',
      'data',
      'photo_code',
      `${testSku}.jpg`
    );
    if (!fs.existsSync(savedDiskPath)) {
      throw new Error(`Saved photo file missing at ${savedDiskPath}`);
    }
    console.log(
      `✅ Photo Saved to ${uploadPhotoData.imageUrl} & Product Activated: isActive=${uploadPhotoData.product.isActive}`
    );

    // Clean up temporary product & photo
    await prisma.product.delete({ where: { slug: 'test-1c-no-photo-999991' } });
    fs.unlinkSync(savedDiskPath);

    // =========================================================================
    // DoD #5: All 9 Lead Forms (including multipart/form-data file upload)
    // =========================================================================
    console.log('\n--- [DoD #5] Testing All 9 Lead Forms + Multipart File Upload ---');
    const leadTypes = [
      'ACTIVE_KITCHEN_TESTDRIVE',
      'SHOWROOM_VISIT',
      'PROJECT_MATCHING',
      'B2B_CLUB',
      'B2B_OPT',
      'KITCHEN_ESTIMATE',
      'QUICK_CONSULT',
      'EQUIPMENT_SELECTION',
      'PRICE_MATCH',
    ] as const;

    let uploadedAttachmentPath: string | null = null;
    let projectMatchingLeadId: string | null = null;

    for (const type of leadTypes) {
      let req: NextRequest;
      if (type === 'PROJECT_MATCHING') {
        const fd = new FormData();
        fd.append('type', type);
        fd.append('name', `Тест Лид ${type}`);
        fd.append('phone', '8 (999) 111-22-33');
        fd.append('email', 'lead-test@simona-bt.ru');
        fd.append('comment', 'Тестовый дизайн-проект кухни');
        fd.append('utmSource', 'yandex');
        fd.append('ymClientId', '1728391029381029');
        const pdfBytes = Buffer.from('%PDF-1.4\n%Test Design Project Specification\n%%EOF');
        fd.append(
          'file',
          new File([pdfBytes], 'kitchen_design_project.pdf', {
            type: 'application/pdf',
          })
        );
        req = new NextRequest('http://localhost:3000/api/leads', {
          method: 'POST',
          body: fd,
        });
      } else {
        req = new NextRequest('http://localhost:3000/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type,
            name: `Тест Лид ${type}`,
            phone: '+7 (999) 111-22-33',
            email: 'lead-test@simona-bt.ru',
            comment: `Автотест формы ${type}`,
            utmSource: 'direct',
            ymClientId: '1728391029381029',
          }),
        });
      }

      const res = await leadsPOST(req);
      const data = await res.json();
      if (!data.success || !data.leadId) {
        throw new Error(`Lead ${type} failed: ${JSON.stringify(data)}`);
      }
      createdLeadIds.push(data.leadId);

      if (type === 'PROJECT_MATCHING') {
        if (!data.attachmentPath) {
          throw new Error('PROJECT_MATCHING multipart file upload did not return attachmentPath');
        }
        uploadedAttachmentPath = data.attachmentPath;
        projectMatchingLeadId = data.leadId;
      }

      console.log(
        `✅ Lead [${type}] -> DB ID=${data.leadId}, Asana=${data.notifications.asanaTaskId}, MAX=${data.notifications.maxAlert}`
      );
    }

    // Verify Manager Leads API & Attachment Download API
    const mgrLeadsReq = new NextRequest('http://localhost:3000/api/manager/leads', {
      headers: { cookie: authCookie },
    });
    const mgrLeadsRes = await managerLeadsGET(mgrLeadsReq);
    const mgrLeadsData = await mgrLeadsRes.json();
    if (!mgrLeadsData.success || mgrLeadsData.leads.length < 9) {
      throw new Error('Manager leads API did not return all 9 created leads');
    }

    if (uploadedAttachmentPath && projectMatchingLeadId) {
      const dlReq = new NextRequest(
        `http://localhost:3000/api/manager/leads/attachment?id=${encodeURIComponent(
          projectMatchingLeadId
        )}`,
        {
          headers: { cookie: authCookie },
        }
      );
      const dlRes = await attachmentGET(dlReq);
      if (dlRes.status !== 200) {
        throw new Error(`Attachment download failed with status ${dlRes.status}`);
      }
      console.log(`✅ Attachment Download Verified: ${uploadedAttachmentPath}`);

      const fullUploadPath = path.join(process.cwd(), uploadedAttachmentPath);
      if (fs.existsSync(fullUploadPath)) {
        fs.unlinkSync(fullUploadPath);
      }
    }

    console.log('\n======================================================');
    console.log('🎉 ALL FUNCTIONAL SPRINT 1 DoD CHECKS PASSED 100%!');
    console.log('======================================================');
  } finally {
    // Cleanup test records from DB
    if (createdOrderIds.length > 0) {
      await prisma.order.deleteMany({ where: { id: { in: createdOrderIds } } });
    }
    if (createdLeadIds.length > 0) {
      await prisma.lead.deleteMany({ where: { id: { in: createdLeadIds } } });
    }
    await prisma.customer.deleteMany({ where: { phone: normalizedTestPhone } });
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});

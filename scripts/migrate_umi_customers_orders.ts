import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { PrismaClient } from '@prisma/client';
import { normalizeRussianPhone } from '../lib/utils';
import { formatProductName } from '../lib/catalog/productTitle';

const prisma = new PrismaClient();

interface ExportedUmiUser {
  umiObjectId: number;
  objName: string | null;
  login: string | null;
  password: string | null;
  email: string | null;
  lname: string | null;
  fname: string | null;
  fatherName: string | null;
  phone: string | null;
  bonusPoints: number;
  registerDate: number | null;
  address: string | null;
  isPartner: number;
  companyBrand: string | null;
  companyLegal: string | null;
}

interface ExportedUmiOrderItem {
  name: string;
  quantity: number;
  price: number;
  sku: string | null;
  slug: string | null;
}

interface ExportedUmiOrder {
  umiOrderId: number;
  orderNumber: string;
  customerUmiId: number | null;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  deliveryAddress: string | null;
  totalAmount: number;
  statusRelId: number | null;
  paymentStatusRelId: number | null;
  paymentMethodRelId: number | null;
  deliveryRelId: number | null;
  orderTimestamp: number | null;
  ymClientId: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmTerm: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  comment: string | null;
  items: ExportedUmiOrderItem[];
}

interface ExportedDump {
  exportedAt: string;
  usersCount: number;
  ordersCount: number;
  users: ExportedUmiUser[];
  orders: ExportedUmiOrder[];
}

function mapUmiOrderStatus(relId: number | null): string {
  switch (relId) {
    case 202:
      return 'CANCELLED';
    case 208:
      return 'DELIVERED';
    case 316:
      return 'READY_FOR_PICKUP';
    case 207:
    case 716009:
    case 1259009:
    case 203:
      return 'CONFIRMED';
    case 206:
    case 204:
    case 205:
    default:
      return 'NEW';
  }
}

function mapUmiPaymentStatus(relId: number | null): string {
  switch (relId) {
    case 215:
      return 'PAID';
    case 6694934:
      return 'HOLD';
    case 214:
      return 'CANCELLED';
    case 6694935:
      return 'REFUNDED';
    default:
      return 'PENDING';
  }
}

function mapUmiPaymentMethod(relId: number | null): string {
  switch (relId) {
    case 779:
    case 2875955:
    case 6694933:
      return 'CARD_ONLINE';
    case 778:
      return 'B2B_INVOICE';
    case 777:
      return 'ON_RECEIPT';
    default:
      return 'IN_SALON';
  }
}

function mapUmiDeliveryType(relId: number | null): string {
  switch (relId) {
    case 231:
    case 780:
      return 'PICKUP_BELINSKOGO_15';
    case 232:
    case 781:
      return 'COURIER_DELIVERY';
    default:
      return 'PICKUP_WAREHOUSE_KOMINTERNA';
  }
}

function normalizePhoneOrUniqueFallback(rawPhone: string | null | undefined, fallbackId: string): string {
  const cleaned = (rawPhone || '').replace(/\D/g, '');
  if (cleaned.length >= 10) {
    return normalizeRussianPhone(rawPhone!);
  }
  return `+7000${fallbackId.padStart(7, '0')}`;
}

async function main() {
  const dumpPath = path.join(process.cwd(), 'data', 'exported_umi_customers_orders.json.gz');
  if (!fs.existsSync(dumpPath)) {
    throw new Error(`Dump file not found: ${dumpPath}`);
  }

  console.log(`[Migration] Reading ${dumpPath}...`);
  const gzBuf = fs.readFileSync(dumpPath);
  const rawJson = zlib.gunzipSync(gzBuf).toString('utf8');
  const dump = JSON.parse(rawJson) as ExportedDump;

  console.log(
    `[Migration] Dump loaded: ${dump.users.length} users, ${dump.orders.length} real orders.`
  );

  // 1. Загружаем каталог товаров из Prisma для обогащения позиций заказа по 1С SKU
  const products = await prisma.product.findMany({
    select: {
      id: true,
      sku: true,
      name: true,
      brand: true,
      category: true,
      imagesJson: true,
      slug: true,
      physicalStatus: true,
    },
  });
  const productBySku = new Map(products.map((p) => [p.sku, p]));
  console.log(`[Migration] Indexed ${productBySku.size} catalog products by 1C SKU.`);

  // 2. Загружаем уже существующих покупателей для идемпотентности
  const existingCustomers = await prisma.customer.findMany({
    select: {
      id: true,
      phone: true,
      email: true,
      umiObjectId: true,
    },
  });

  const customerIdByPhone = new Map<string, string>();
  const customerIdByUmiId = new Map<number, string>();
  const customerIdByEmail = new Map<string, string>();

  for (const c of existingCustomers) {
    customerIdByPhone.set(c.phone, c.id);
    if (c.umiObjectId) customerIdByUmiId.set(c.umiObjectId, c.id);
    if (c.email) customerIdByEmail.set(c.email.toLowerCase(), c.id);
  }

  // Подготавливаем пользователей для вставки/обновления
  let importedCustomers = 0;
  let importedDesigners = 0;

  // Сортируем так, чтобы партнеры (isPartner === 1) и пользователи с реальным email/паролем обрабатывались первыми и получали основной номер телефона
  const sortedUsers = [...dump.users].sort((a, b) => {
    if (b.isPartner !== a.isPartner) return b.isPartner - a.isPartner;
    const aHasEmail = a.email ? 1 : 0;
    const bHasEmail = b.email ? 1 : 0;
    return bHasEmail - aHasEmail;
  });

  const userBatchSize = 500;
  for (let i = 0; i < sortedUsers.length; i += userBatchSize) {
    const slice = sortedUsers.slice(i, i + userBatchSize);
    const ops = [];

    for (const u of slice) {
      const fullName = [u.lname, u.fname, u.fatherName]
        .filter(Boolean)
        .join(' ')
        .trim();
      const emailCandidate =
        u.email && u.email.includes('@')
          ? u.email.trim().toLowerCase()
          : u.login && u.login.includes('@')
          ? u.login.trim().toLowerCase()
          : null;

      let phone = normalizePhoneOrUniqueFallback(u.phone, String(u.umiObjectId));
      // Если телефон нулевой (+70000000000) или уже занят другим umiObjectId, формируем уникальный технический ключ с сохранением email и umiObjectId
      const existingIdByUmi = customerIdByUmiId.get(u.umiObjectId);
      if (
        !existingIdByUmi &&
        (phone === '+70000000000' ||
          phone === '+71111111111' ||
          customerIdByPhone.has(phone))
      ) {
        phone = `+7000${String(u.umiObjectId).padStart(7, '0')}`;
      }

      const role = u.isPartner === 1 ? 'DESIGNER' : 'CLIENT';
      if (role === 'DESIGNER') importedDesigners++;

      const companyName = u.companyBrand || u.companyLegal || null;
      const createdAt =
        u.registerDate && u.registerDate > 946684800
          ? new Date(u.registerDate * 1000)
          : new Date();

      if (existingIdByUmi) {
        ops.push(
          prisma.customer.update({
            where: { id: existingIdByUmi },
            data: {
              name: fullName || u.objName || undefined,
              email: emailCandidate || undefined,
              legacyPassword: u.password || undefined,
              role,
              companyName: companyName || undefined,
              address: u.address || undefined,
              bonusPoints: u.bonusPoints || 0,
            },
          })
        );
      } else {
        customerIdByPhone.set(phone, `umi_${u.umiObjectId}`);
        customerIdByUmiId.set(u.umiObjectId, `umi_${u.umiObjectId}`);
        ops.push(
          prisma.customer.upsert({
            where: { phone },
            update: {
              umiObjectId: u.umiObjectId,
              name: fullName || u.objName || undefined,
              email: emailCandidate || undefined,
              legacyPassword: u.password || undefined,
              role,
              companyName: companyName || undefined,
              address: u.address || undefined,
              bonusPoints: u.bonusPoints || 0,
            },
            create: {
              umiObjectId: u.umiObjectId,
              phone,
              email: emailCandidate,
              name: fullName || u.objName || 'Покупатель СИМОНА',
              legacyPassword: u.password || null,
              role,
              companyName,
              address: u.address || null,
              bonusPoints: u.bonusPoints || 0,
              createdAt,
            },
          })
        );
      }
      importedCustomers++;
    }

    if (ops.length > 0) {
      await prisma.$transaction(ops);
    }
  }

  // Перезагружаем карту покупателей после импорта пользователей
  const allCustomers = await prisma.customer.findMany({
    select: { id: true, phone: true, email: true, umiObjectId: true },
  });
  customerIdByPhone.clear();
  customerIdByUmiId.clear();
  customerIdByEmail.clear();
  for (const c of allCustomers) {
    customerIdByPhone.set(c.phone, c.id);
    if (c.umiObjectId) customerIdByUmiId.set(c.umiObjectId, c.id);
    if (c.email) customerIdByEmail.set(c.email.toLowerCase(), c.id);
  }

  console.log(
    `[Migration] Customers synced: ${allCustomers.length} total in DB (${importedDesigners} B2B designers processed).`
  );

  // 3. Импортируем заказы (14 958 реальных заказов) и позиции OrderItem
  const existingOrders = await prisma.order.findMany({
    select: { id: true, orderNumber: true, umiOrderId: true },
  });
  const existingByUmiOrderId = new Set<number>();
  const existingByOrderNumber = new Set<string>();
  for (const o of existingOrders) {
    if (o.umiOrderId) existingByUmiOrderId.add(o.umiOrderId);
    existingByOrderNumber.add(o.orderNumber);
  }

  let createdOrdersCount = 0;
  let createdOrderItemsCount = 0;

  const orderBatchSize = 250;
  for (let i = 0; i < dump.orders.length; i += orderBatchSize) {
    const slice = dump.orders.slice(i, i + orderBatchSize);
    const ops = [];

    for (const ord of slice) {
      if (
        existingByUmiOrderId.has(ord.umiOrderId) ||
        existingByOrderNumber.has(ord.orderNumber)
      ) {
        continue;
      }

      existingByUmiOrderId.add(ord.umiOrderId);
      existingByOrderNumber.add(ord.orderNumber);

      const normalizedPhone = normalizePhoneOrUniqueFallback(
        ord.customerPhone,
        `9${ord.umiOrderId}`
      );
      const emailLower =
        ord.customerEmail && ord.customerEmail.includes('@')
          ? ord.customerEmail.trim().toLowerCase()
          : null;

      let customerId: string | null = null;
      if (ord.customerUmiId && customerIdByUmiId.has(ord.customerUmiId)) {
        customerId = customerIdByUmiId.get(ord.customerUmiId)!;
      } else if (customerIdByPhone.has(normalizedPhone)) {
        customerId = customerIdByPhone.get(normalizedPhone)!;
      } else if (emailLower && customerIdByEmail.has(emailLower)) {
        customerId = customerIdByEmail.get(emailLower)!;
      }

      const createdAt =
        ord.orderTimestamp && ord.orderTimestamp > 946684800
          ? new Date(ord.orderTimestamp * 1000)
          : new Date();

      const status = mapUmiOrderStatus(ord.statusRelId);
      const paymentStatus = mapUmiPaymentStatus(ord.paymentStatusRelId);
      const paymentMethod = mapUmiPaymentMethod(ord.paymentMethodRelId);
      const deliveryType = mapUmiDeliveryType(ord.deliveryRelId);

      const normalizedItems = ord.items.map((item) => {
        const sku = item.sku ? String(item.sku).trim() : null;
        const catalogProd = sku ? productBySku.get(sku) : undefined;
        let firstImage: string | null = null;
        if (catalogProd?.imagesJson) {
          try {
            const imgs = JSON.parse(catalogProd.imagesJson) as string[];
            if (Array.isArray(imgs) && imgs.length > 0) firstImage = imgs[0];
          } catch {
            firstImage = null;
          }
        }

        const canonicalName = catalogProd
          ? formatProductName({
              name: catalogProd.name,
              brand: catalogProd.brand,
              category: catalogProd.category,
            })
          : formatProductName({
              name: item.name || 'Товар СИМОНА',
              brand: '',
              category: '',
            });

        return {
          productId: catalogProd?.id || null,
          sku: sku || 'АРХИВ',
          name: canonicalName,
          brand: catalogProd?.brand || null,
          price: Number(item.price) || 0,
          quantity: Number(item.quantity) || 1,
          image: firstImage,
          slug: catalogProd?.slug || item.slug || null,
          physicalStatus: catalogProd?.physicalStatus || 'LOCAL_STOCK',
        };
      });

      createdOrdersCount++;
      createdOrderItemsCount += normalizedItems.length;

      ops.push(
        prisma.order.create({
          data: {
            umiOrderId: ord.umiOrderId,
            orderNumber: ord.orderNumber,
            customerId,
            customerName: ord.customerName || 'Покупатель СИМОНА',
            customerPhone: normalizedPhone,
            customerEmail: emailLower,
            deliveryType,
            deliveryAddress: ord.deliveryAddress,
            deliveryComment: ord.comment,
            totalAmount: Number(ord.totalAmount) || 0,
            status,
            paymentStatus,
            paymentMethod,
            itemsJson: JSON.stringify(normalizedItems),
            ymClientId: ord.ymClientId,
            utmSource: ord.utmSource,
            utmMedium: ord.utmMedium,
            utmTerm: ord.utmTerm,
            utmCampaign: ord.utmCampaign,
            utmContent: ord.utmContent,
            createdAt,
            orderItems:
              normalizedItems.length > 0
                ? {
                    create: normalizedItems,
                  }
                : undefined,
          },
        })
      );
    }

    if (ops.length > 0) {
      await prisma.$transaction(ops);
    }
    if ((i + orderBatchSize) % 2500 === 0 || i + orderBatchSize >= dump.orders.length) {
      console.log(
        `[Migration] Orders progress: ${Math.min(i + orderBatchSize, dump.orders.length)} / ${
          dump.orders.length
        } (created ${createdOrdersCount} orders, ${createdOrderItemsCount} items)`
      );
    }
  }

  const finalCustomers = await prisma.customer.count();
  const finalDesigners = await prisma.customer.count({ where: { role: 'DESIGNER' } });
  const finalOrders = await prisma.order.count();
  const finalOrderItems = await prisma.orderItem.count();

  console.log('====================================================');
  console.log('[Migration Complete]');
  console.log(`- Total Customers in DB:  ${finalCustomers}`);
  console.log(`- B2B Designers in DB:    ${finalDesigners}`);
  console.log(`- Total Orders in DB:     ${finalOrders}`);
  console.log(`- Total OrderItems in DB: ${finalOrderItems}`);
  console.log('====================================================');
}

main()
  .catch((err) => {
    console.error('[Migration Error]:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

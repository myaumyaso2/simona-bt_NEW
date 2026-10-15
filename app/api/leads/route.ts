import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { normalizeRussianPhone } from '@/lib/utils';
import { createAsanaLeadTask } from '@/lib/integrations/asana';
import { notifyNewLeadInMax } from '@/lib/integrations/maxMessenger';
import { sendLeadNotificationEmails } from '@/lib/mail/mailer';

export const dynamic = 'force-dynamic';

const leadSchema = z.object({
  type: z.enum([
    'ACTIVE_KITCHEN_TESTDRIVE',
    'SHOWROOM_VISIT',
    'PROJECT_MATCHING',
    'B2B_CLUB',
    'B2B_OPT',
    'KITCHEN_ESTIMATE',
    'QUICK_CONSULT',
    'EQUIPMENT_SELECTION',
    'PRICE_MATCH',
  ]),
  name: z
    .string()
    .optional()
    .transform((v) => (v && v.trim() ? v.trim() : 'Покупатель')),
  phone: z.string().min(6, 'Укажите номер телефона'),
  email: z.string().email('Некорректный email').optional().or(z.literal('')),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
  preferredShowroom: z.string().optional(),
  productId: z.string().optional(),
  productName: z.string().optional(),
  portfolioUrl: z.string().optional(),
  comment: z.string().optional(),
  attachmentPath: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmContent: z.string().optional(),
  utmTerm: z.string().optional(),
  ymClientId: z.string().optional(),
  yclid: z.string().optional(),
  pageUrl: z.string().optional(),
});

const ALLOWED_EXTENSIONS = new Set([
  '.pdf',
  '.dwg',
  '.zip',
  '.rar',
  '.7z',
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.xlsx',
  '.xls',
  '.doc',
  '.docx',
]);

async function saveUploadedProjectFile(file: File): Promise<string> {
  const ext = path.extname(file.name || '').toLowerCase() || '.pdf';
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    throw new Error(
      `Недопустимый формат файла (${ext}). Разрешены: PDF, DWG, ZIP, JPG, PNG, XLSX, DOCX.`
    );
  }

  const maxBytes = 50 * 1024 * 1024; // 50 MB
  if (file.size > maxBytes) {
    throw new Error('Размер файла превышает 50 МБ');
  }

  const uploadDir = path.join(process.cwd(), 'storage', 'uploads', 'leads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const safeBase = path
    .basename(file.name, ext)
    .replace(/[^a-zA-Z0-9а-яА-ЯёЁ_-]/g, '_')
    .slice(0, 60);
  const fileName = `${Date.now()}_${safeBase || 'project'}${ext}`;
  const fullPath = path.join(uploadDir, fileName);

  const arrayBuffer = await file.arrayBuffer();
  fs.writeFileSync(fullPath, Buffer.from(arrayBuffer));

  return `storage/uploads/leads/${fileName}`;
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let rawData: Record<string, string | undefined> = {};
    let uploadedAttachmentPath: string | undefined;

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      formData.forEach((value, key) => {
        if (typeof value === 'string') {
          rawData[key] = value;
        }
      });

      const fileEntry = formData.get('file') || formData.get('attachment');
      if (fileEntry && fileEntry instanceof File && fileEntry.size > 0) {
        uploadedAttachmentPath = await saveUploadedProjectFile(fileEntry);
      }
    } else {
      const body = (await req.json()) as Record<string, unknown>;
      for (const [k, v] of Object.entries(body)) {
        if (v !== null && v !== undefined) {
          rawData[k] = String(v);
        }
      }
    }

    if (uploadedAttachmentPath) {
      rawData.attachmentPath = uploadedAttachmentPath;
    }

    const validatedData = leadSchema.parse(rawData);
    const normalizedPhone = normalizeRussianPhone(validatedData.phone);

    // 1. Save Lead to Database
    const lead = await prisma.lead.create({
      data: {
        type: validatedData.type,
        name: validatedData.name,
        phone: normalizedPhone,
        email: validatedData.email || null,
        preferredDate: validatedData.preferredDate || null,
        preferredTime: validatedData.preferredTime || null,
        preferredShowroom: validatedData.preferredShowroom || null,
        productId: validatedData.productId || null,
        productName: validatedData.productName || null,
        portfolioUrl: validatedData.portfolioUrl || null,
        comment: validatedData.comment || null,
        attachmentPath: validatedData.attachmentPath || null,
        utmSource: validatedData.utmSource || null,
        utmMedium: validatedData.utmMedium || null,
        utmCampaign: validatedData.utmCampaign || null,
        utmContent: validatedData.utmContent || null,
        utmTerm: validatedData.utmTerm || null,
        ymClientId: validatedData.ymClientId || null,
        yclid: validatedData.yclid || null,
        pageUrl: validatedData.pageUrl || req.headers.get('referer') || null,
        status: 'NEW',
      },
    });

    // 2. Dispatch Email, Asana task, and MAX alert in parallel
    const [emailResult, asanaResult, maxResult] = await Promise.all([
      sendLeadNotificationEmails(lead),
      createAsanaLeadTask(lead),
      notifyNewLeadInMax(lead),
    ]);

    if (asanaResult.taskId) {
      await prisma.lead.update({
        where: { id: lead.id },
        data: { asanaTaskId: asanaResult.taskId },
      });
    }

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      attachmentPath: lead.attachmentPath,
      notifications: {
        email: emailResult,
        asanaTaskId: asanaResult.taskId,
        maxAlert: maxResult.deliveredMax || maxResult.mode === 'LOCAL_QUEUE',
      },
      message:
        'Заявка успешно принята. Эксперт салона СИМОНА свяжется с вами для консультации.',
    });
  } catch (error: unknown) {
    console.error('Lead submission error:', error);
    const msg = error instanceof Error ? error.message : 'Ошибка при сохранении заявки';
    return NextResponse.json(
      {
        success: false,
        error: msg,
      },
      { status: 400 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const leadSchema = z.object({
  type: z.enum([
    'ACTIVE_KITCHEN_TESTDRIVE',
    'SHOWROOM_VISIT',
    'PROJECT_MATCHING',
    'B2B_CLUB',
    'KITCHEN_ESTIMATE',
    'QUICK_CONSULT',
    'EQUIPMENT_SELECTION',
  ]),
  name: z.string().min(2, 'Укажите имя'),
  phone: z.string().min(6, 'Укажите номер телефона'),
  email: z.string().email('Некорректный email').optional().or(z.literal('')),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
  preferredShowroom: z.string().optional(),
  productId: z.string().optional(),
  productName: z.string().optional(),
  portfolioUrl: z.string().optional(),
  comment: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = leadSchema.parse(body);

    // 1. Save Lead to Database
    const lead = await prisma.lead.create({
      data: {
        type: validatedData.type,
        name: validatedData.name,
        phone: validatedData.phone,
        email: validatedData.email || null,
        preferredDate: validatedData.preferredDate || null,
        preferredTime: validatedData.preferredTime || null,
        preferredShowroom: validatedData.preferredShowroom || null,
        productId: validatedData.productId || null,
        productName: validatedData.productName || null,
        portfolioUrl: validatedData.portfolioUrl || null,
        comment: validatedData.comment || null,
        utmSource: validatedData.utmSource || null,
        utmMedium: validatedData.utmMedium || null,
        utmCampaign: validatedData.utmCampaign || null,
        status: 'NEW',
      },
    });

    console.log(`[Lead Created] ID: ${lead.id}, Type: ${lead.type}, Name: ${lead.name}, Phone: ${lead.phone}`);

    // 2. Mock Asana / Telegram Dispatcher (Logs task creation)
    const asanaTaskTitle = `[${lead.type}] — ${lead.name} — ${lead.phone}`;
    console.log(`[Asana Task Dispatched] Title: "${asanaTaskTitle}" to Project "Лиды с сайта simona-bt.ru"`);
    console.log(`[Telegram Alert Dispatched] New lead notification sent to manager group.`);

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      message: 'Заявка успешно принята. Эксперт салона СИМОНА свяжется с вами в течение 15 минут.',
    });
  } catch (error: any) {
    console.error('Lead submission error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Ошибка при сохранении заявки',
      },
      { status: 400 }
    );
  }
}

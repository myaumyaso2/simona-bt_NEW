import { prisma } from '@/lib/prisma';

export interface BrandCardData {
  name: string;
  slug: string;
  country: string;
  usp: string;
  count: number;
  countLabel: string;
  isPriority: boolean;
}

// Пул метаданных брендов: страна и уникальное позиционирование (Quiet Luxury)
const BRAND_METADATA: Record<string, { country: string; usp: string; displayName?: string }> = {
  BOSCH: { country: 'Германия', usp: 'Немецкая надежность', displayName: 'BOSCH' },
  ASKO: { country: 'Швеция', usp: 'Скандинавское качество', displayName: 'ASKO' },
  LIEBHERR: { country: 'Германия', usp: 'Холод и вино BioFresh', displayName: 'LIEBHERR' },
  SMEG: { country: 'Италия', usp: 'Дизайнерские серии', displayName: 'SMEG' },
  MIELE: { country: 'Германия', usp: 'Премиум стандарт', displayName: 'Miele' },
  OMOIKIRI: { country: 'Япония', usp: 'Мойки и смесители', displayName: 'OMOIKIRI' },
  ELICA: { country: 'Италия', usp: 'Премиум аспирация', displayName: 'elica' },
  MIDEA: { country: 'Инновации', usp: 'Встраиваемая техника', displayName: 'Midea' },
  KORTING: { country: 'Германия', usp: 'Салон 11/66', displayName: 'KÖRTING' },
  'KÖRTING': { country: 'Германия', usp: 'Салон 11/66', displayName: 'KÖRTING' },
  FALMEC: { country: 'Италия', usp: 'Тихая аспирация Circle.Tech', displayName: 'falmec' },
  BERTAZZONI: { country: 'Италия', usp: 'Кухонные блоки с 1882 г.', displayName: 'BERTAZZONI' },
  EVELUX: { country: 'Европа', usp: 'Современная встройка', displayName: 'EVELUX' },
  GRAUDE: { country: 'Германия', usp: 'Практичный комфорт', displayName: 'GRAUDE' },
  MEYVEL: { country: 'Италия', usp: 'Винные шкафы и холод', displayName: 'MEYVEL' },
  DUNAVOX: { country: 'Венгрия', usp: 'Премиальное винохранение', displayName: 'DUNAVOX' },
  FRANKE: { country: 'Швейцария', usp: 'Мойки и кухонные системы', displayName: 'FRANKE' },
  VARD: { country: 'Европа', usp: 'Гарантия 5 лет', displayName: 'VARD' },
  HIBERG: { country: 'Премиум', usp: 'Холодильники French Door', displayName: 'HIBERG' },
  SCHULTHESS: { country: 'Швейцария', usp: 'Швейцарский эталон', displayName: 'SCHULTHESS' },
  CASO: { country: 'Германия', usp: 'Вакууматоры и шкафы', displayName: 'CASO' },
  KUPPERSBERG: { country: 'Германия', usp: 'Встраиваемая техника', displayName: 'KUPPERSBERG' },
  GORENJE: { country: 'Европа', usp: 'Дизайн и функционал', displayName: 'gorenje' },
  NIVONA: { country: 'Швейцария', usp: 'Швейцарские кофемашины', displayName: 'NIVONA' },
  STEBA: { country: 'Германия', usp: 'Грили и су-вид', displayName: 'STEBA' },
  ROMMELSBACHER: { country: 'Германия', usp: 'Настольная кулинария', displayName: 'ROMMELSBACHER' },
  ALVEUS: { country: 'Словения', usp: 'Кухонные системы', displayName: 'ALVEUS' },
  BUGATTI: { country: 'Италия', usp: 'Малая арт-техника', displayName: 'BUGATTI' },
  EKO: { country: 'Сенсоры', usp: 'Сенсорные сортировщики', displayName: 'EKO' },
};

// 9 флагманских брендов СИМОНА в фиксированном приоритетном порядке
const PRIORITY_BRANDS = [
  'BOSCH',
  'ASKO',
  'LIEBHERR',
  'SMEG',
  'MIELE',
  'OMOIKIRI',
  'ELICA',
  'MIDEA',
  'KORTING',
];

// Русское склонение числительных для моделей
export function formatModelCount(n: number): string {
  const formattedNum = n.toLocaleString('ru-RU');
  const mod10 = n % 10;
  const mod100 = n % 100;

  if (mod100 >= 11 && mod100 <= 19) {
    return `${formattedNum} моделей`;
  }
  if (mod10 === 1) {
    return `${formattedNum} модель`;
  }
  if (mod10 >= 2 && mod10 <= 4) {
    return `${formattedNum} модели`;
  }
  return `${formattedNum} моделей`;
}

// Fallback на случай недоступности базы
const FALLBACK_COUNTS: Record<string, number> = {
  BOSCH: 139,
  ASKO: 241,
  LIEBHERR: 150,
  SMEG: 657,
  MIELE: 77,
  OMOIKIRI: 1421,
  ELICA: 459,
  MIDEA: 94,
  KORTING: 607,
  FALMEC: 338,
  BERTAZZONI: 189,
  EVELUX: 188,
  GRAUDE: 160,
  MEYVEL: 150,
  DUNAVOX: 121,
  FRANKE: 111,
  VARD: 101,
  KUPPERSBERG: 83,
  CASO: 80,
  GORENJE: 76,
  SCHULTHESS: 48,
  HIBERG: 45,
};

/**
 * Получает динамический список брендов с актуальными остатками из БД,
 * гарантируя приоритет топ-9 брендов на первых позициях.
 */
export async function getDynamicBrandAtlas(): Promise<BrandCardData[]> {
  const countsMap: Record<string, number> = { ...FALLBACK_COUNTS };

  try {
    const dbCounts = await prisma.product.groupBy({
      by: ['brand'],
      _count: { id: true },
    });

    for (const item of dbCounts) {
      if (item.brand) {
        const key = item.brand.trim().toUpperCase();
        countsMap[key] = item._count.id;
      }
    }
  } catch (error) {
    console.warn('[BrandAtlas] Could not query prisma product counts, using cached fallback:', error);
  }

  // 1. Формируем топ-9 приоритетных брендов
  const priorityList: BrandCardData[] = PRIORITY_BRANDS.map((brandKey) => {
    const meta = BRAND_METADATA[brandKey] || {
      country: 'Европа',
      usp: 'Премиум техника',
      displayName: brandKey,
    };
    const count = countsMap[brandKey] || countsMap['KÖRTING'] || 0;

    return {
      name: meta.displayName || brandKey,
      slug: brandKey === 'KORTING' ? 'KORTING' : brandKey,
      country: meta.country,
      usp: meta.usp,
      count,
      countLabel: formatModelCount(count),
      isPriority: true,
    };
  });

  // 2. Формируем остальные бренды из пула метаданных с товарами в каталоге
  const otherList: BrandCardData[] = [];
  const handled = new Set(PRIORITY_BRANDS.map((b) => b.toUpperCase()));
  handled.add('KÖRTING');

  for (const [key, meta] of Object.entries(BRAND_METADATA)) {
    const upperKey = key.toUpperCase();
    if (handled.has(upperKey)) continue;

    const count = countsMap[upperKey] || 0;
    // Включаем бренды, у которых есть товары в каталоге
    if (count > 0) {
      otherList.push({
        name: meta.displayName || key,
        slug: key,
        country: meta.country,
        usp: meta.usp,
        count,
        countLabel: formatModelCount(count),
        isPriority: false,
      });
      handled.add(upperKey);
    }
  }

  // Сортируем остальные бренды по убыванию количества моделей
  otherList.sort((a, b) => b.count - a.count);

  return [...priorityList, ...otherList];
}

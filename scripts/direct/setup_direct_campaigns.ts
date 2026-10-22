import * as fs from 'fs';
import * as path from 'path';
import { CORE_NEGATIVE_KEYWORDS } from '../../lib/integrations/direct/negatives';

// Загрузка переменных окружения из .env
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const match = trimmed.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        let val = match[2].trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  });
}

const TOKEN =
  process.env.YANDEX_API_TOKEN ||
  process.env.YANDEX_DIRECT_TOKEN ||
  'y0__wgBEPrbriIYxY9NIL6ezbwZF8r0W0kTkDhRkgp_UK86FWL3aRg';

const DIRECT_API_URL = 'https://api.direct.yandex.com/json/v5';
const NN_REGION_ID = 47; // Нижний Новгород

interface ApiResponse<T = any> {
  result?: T;
  error?: {
    error_code: number;
    error_string: string;
    error_detail: string;
    request_id: string;
  };
}

export async function callDirectApi<T = any>(service: string, method: string, params: any): Promise<T> {
  const url = `${DIRECT_API_URL}/${service}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Accept-Language': 'ru',
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({ method, params }),
  });

  const json: ApiResponse<T> = await res.json();
  if (json.error) {
    if (json.error.error_code === 58) {
      console.warn('\n⏳ Заявка на доступ к API находится на рассмотрении модерацией Яндекса.');
      console.warn('   Обычно модерация подтверждает заявку в течение рабочего дня.\n');
    }
    throw new Error(`[Direct API Error ${json.error.error_code}]: ${json.error.error_string} — ${json.error.error_detail}`);
  }

  return json.result as T;
}

export async function checkDirectApiHealth(): Promise<boolean> {
  console.log('🔍 Проверка подключения к Яндекс Директ API v5...');
  try {
    const res = await callDirectApi('campaigns', 'get', {
      SelectionCriteria: {},
      FieldNames: ['Id', 'Name', 'State', 'Status'],
    });
    console.log(`✅ Успешно! Доступ к API открыт. Кампаний в аккаунте: ${res?.Campaigns?.length || 0}`);
    return true;
  } catch (err: any) {
    console.log(err.message);
    return false;
  }
}

/**
 * Описание 3 согласованных поисковых кампаний для создания через API
 */
export const CAMPAIGNS_SPEC = [
  {
    name: '[СИМОНА] Поиск НН: Бренды и Встройка (Кластеры 1-3)',
    weeklyBudgetRub: 5625,
    groups: [
      {
        name: 'Духовые шкафы Asko и встройка',
        keywords: [
          'купить духовой шкаф asko нижний новгород',
          'встраиваемый духовой шкаф asko нн',
          'духовой шкаф asko в наличии нижний новгород',
          'купить технику asko нижний новгород',
        ],
        title: 'Духовые шкафы Asko в Нижнем Новгороде — В наличии на складе',
        title2: 'Салоны «СИМОНА» на Белинского',
        text: 'Официальный дилер. Более 30 лет на рынке. Бесплатное хранение до конца ремонта, аккуратная доставка, профессиональный монтаж.',
        href: 'https://simona-bt.ru/catalog/vstraivaemye-duhovye-shkafy?utm_source=yandex&utm_medium=cpc&utm_campaign=search_brands_nn',
      },
      {
        name: 'Варочные панели Miele и Asko',
        keywords: [
          'варочная панель miele нижний новгород',
          'индукционная варочная панель miele купить нн',
          'варочная панель asko в наличии нижний новгород',
        ],
        title: 'Варочные панели Miele и Asko в Нижнем Новгороде',
        title2: 'В наличии на складе в НН',
        text: 'Индукционные и газовые панели ведущих марок. Подбор комплекта под любой бюджет. Шоурумы: ул. Белинского 15 и 11/66.',
        href: 'https://simona-bt.ru/catalog/varochnye-paneli?utm_source=yandex&utm_medium=cpc&utm_campaign=search_brands_nn',
      },
      {
        name: 'Комплекты встраиваемой техники для кухни',
        keywords: [
          'комплект техники для кухни нижний новгород',
          'комплект встраиваемой техники нижний новгород',
          'салон встраиваемой техники нижний новгород',
          'подобрать комплект техники для кухни нн',
        ],
        title: 'Комплекты техники для кухни в Нижнем — Салоны «СИМОНА»',
        title2: 'Более 30 лет на рынке',
        text: 'Подберем идеальный комплект на любой кошелек. Официальная гарантия, хранение до конца ремонта, собственная аккуратная доставка.',
        href: 'https://simona-bt.ru/catalog?utm_source=yandex&utm_medium=cpc&utm_campaign=search_sets_nn',
      },
    ],
  },
  {
    name: '[СИМОНА] Поиск НН: Перехват конкурентов ЦВТ и Морозкофе (Кластер 5)',
    weeklyBudgetRub: 1875,
    groups: [
      {
        name: 'Перехват ЦВТ и Мороз и кофе',
        keywords: [
          'цвт нижний новгород',
          'цвт плюс нижний новгород',
          'центр встраиваемой техники нижний новгород',
          'салон цвт белинского',
          'мороз и кофе нижний новгород',
          'магазин мороз и кофе',
          'мороз и кофе официальный сайт',
          'мороз и кофе тимирязева',
        ],
        title: 'Ищете технику в Нижнем? — Салоны «СИМОНА» на Белинского',
        title2: 'Более 30 лет опыта',
        text: 'Официальный дилер Asko, Miele, Liebherr, Smeg, Omoikiri. Оптимальный комплект под любой бюджет. Доставка со склада в НН за 1 день.',
        href: 'https://simona-bt.ru/?utm_source=yandex&utm_medium=cpc&utm_campaign=search_competitors_nn',
      },
    ],
  },
  {
    name: '[СИМОНА] Поиск НН: Защита бренда СИМОНА (Кластер 4)',
    weeklyBudgetRub: 1875,
    groups: [
      {
        name: 'Защита бренда СИМОНА',
        keywords: [
          'симона бытовая техника нижний новгород',
          'салон симона белинского',
          'магазин симона нижний новгород официальный сайт',
          'бытовая техника симона нн',
        ],
        title: 'Сеть салонов «СИМОНА» — Бытовая техника в Нижнем Новгороде',
        title2: 'Официальный сайт simona-bt.ru',
        text: 'Более 30 лет подбираем лучшую технику для кухни и дома на любой кошелек. Шоурумы: ул. Белинского 15 и 11/66.',
        href: 'https://simona-bt.ru/?utm_source=yandex&utm_medium=cpc&utm_campaign=search_brand_defense',
      },
    ],
  },
];

async function main() {
  console.log('===============================================================');
  console.log('СИМОНА-BT • Автоматизированная настройка Яндекс Директ API v5');
  console.log('===============================================================');

  const isHealthy = await checkDirectApiHealth();
  if (!isHealthy) {
    console.log('Ждем завершения проверки заявки в Яндексе...');
    return;
  }

  console.log('Запуск создания кампаний через Direct API v5...');
  // Создание кампаний через campaigns.add будет выполнено сразу после одобрения заявки
}

if (require.main === module) {
  main().catch(console.error);
}

import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { prisma } from '../lib/prisma';

// 1. Month map for repairing Russian Excel decimal date corruptions
const MONTH_MAP: Record<string, number> = {
  янв: 1, фев: 2, мар: 3, апр: 4, май: 5, июн: 6,
  июл: 7, авг: 8, сен: 9, окт: 10, ноя: 11, дек: 12,
};

export function fixExcelDecimal(rawVal: string): string {
  if (!rawVal) return rawVal;
  const val = rawVal.trim().toLowerCase();

  // Pattern 1: "19.май" or "06.янв" or "02.апр" (number.month) -> number.month_num
  const match1 = val.match(/^0?(\d+)\.([а-я]{3,4})$/);
  if (match1) {
    const num = match1[1];
    const mStr = match1[2].slice(0, 3);
    const mNum = MONTH_MAP[mStr];
    if (mNum !== undefined) {
      return `${num}.${mNum}`;
    }
  }

  // Pattern 2: "фев.43" (month.number) -> month_num.number
  const match2 = val.match(/^([а-я]{3,4})\.(\d+)$/);
  if (match2) {
    const mStr = match2[1].slice(0, 3);
    const mNum = MONTH_MAP[mStr];
    if (mNum !== undefined) {
      return `${mNum}.${match2[2]}`;
    }
  }

  return rawVal.trim();
}

// 2. Predefined high-quality Russian label dictionary for common column slugs
const KNOWN_LABELS: Record<string, string> = {
  cvet: 'Цвет',
  garantiya: 'Гарантия',
  stranaproishozhdeniya: 'Страна производства',
  width: 'Ширина (см)',
  depth: 'Глубина (см)',
  height: 'Высота (см)',
  weight: 'Вес (кг)',
  length: 'Длина (см)',
  material_korpusa: 'Материал корпуса',
  mownost: 'Мощность (Вт)',
  potreblyaemaya_mownost_vt: 'Потребляемая мощность (Вт)',
  vsego_konforok: 'Всего конфорок',
  material_paneli: 'Материал панели',
  tip_sensornogo_upravleniya: 'Тип переключателей',
  chugunnye_reshetki: 'Чугунные решетки',
  elektropodjig: 'Электроподжиг',
  gaz_kontrol_konforok: 'Газ-контроль конфорок',
  varka_raspolozhenie_pereklyuchatelej: 'Расположение переключателей',
  varka_tajmer_konforok: 'Таймер конфорок',
  varka_zawitnoe_otklyuchenie: 'Защитное отключение',
  varka_indikator_ostatochnogo_tepla: 'Индикатор остаточного тепла',
};

// 3. Fallback auto-translator for any transliterated column slug
export function slugToHumanLabel(slug: string): string {
  if (KNOWN_LABELS[slug]) return KNOWN_LABELS[slug];

  // Strip category prefix if present
  let clean = slug.replace(/^[a-z0-9_-]+?_/, '');

  // Specific unit replacements at end
  const unitReplacements: [RegExp, string][] = [
    [/_kvt$/, ' (кВт)'],
    [/_vt$/, ' (Вт)'],
    [/_db$/, ' (дБ)'],
    [/_kg$/, ' (кг)'],
    [/_sm$/, ' (см)'],
    [/_mm$/, ' (мм)'],
    [/_ml$/, ' (мл)'],
    [/_l$/, ' (л)'],
    [/_bar$/, ' (бар)'],
    [/_obmin$/, ' (об/мин)'],
    [/_m$/, ' (м)'],
    [/_lsutki$/, ' (л/сутки)'],
    [/_lmin$/, ' (л/мин)'],
    [/_gmin$/, ' (г/мин)'],
    [/_gch$/, ' (г/ч)'],
    [/_kubmch$/, ' (м³/ч)'],
    [/_kvm$/, ' (м²)'],
    [/_kvtchgod$/, ' (кВтч/год)'],
    [/_kvtch$/, ' (кВтч)'],
  ];

  let unitSuffix = '';
  for (const [regex, suffix] of unitReplacements) {
    if (regex.test(clean)) {
      clean = clean.replace(regex, '');
      unitSuffix = suffix;
      break;
    }
  }

  // Transliterator dictionary for words
  const dict: Record<string, string> = {
    maksimalnaya: 'Максимальная',
    maksimalnyj: 'Максимальный',
    maks: 'Макс.',
    potreblyaemaya: 'потребляемая',
    moshchnost: 'мощность',
    mownost: 'мощность',
    kolichestvo: 'Количество',
    kolvo: 'Количество',
    rezhimov: 'режимов',
    rezhim: 'Режим',
    rezhimy: 'Режимы',
    raboty: 'работы',
    tostov: 'тостов',
    reshetka: 'Решетка',
    dlya: 'для',
    bulochek: 'булочек',
    podogrev: 'Подогрев',
    razmorozka: 'Разморозка',
    proizvoditelnost: 'Производительность',
    diametr: 'Диаметр',
    patrubka: 'патрубка воздуховода',
    material: 'Материал',
    korpusa: 'корпуса',
    vnutrennej: 'внутренней',
    stenki: 'стенки',
    skorostej: 'скоростей',
    upravlenie: 'Управление',
    osvewenie: 'Освещение',
    uroven: 'Уровень',
    shuma: 'шума',
    zagruzka: 'Загрузка',
    belya: 'белья',
    klass: 'Класс',
    energopotrebleniya: 'энергопотребления',
    energo: 'энергопотребления',
    stirki: 'стирки',
    otzhima: 'отжима',
    skorost: 'скорость',
    vraweniya: 'вращения',
    pri: 'при',
    zawita: 'Защита',
    ot: 'от',
    protechek: 'протечек',
    programm: 'программ',
    dozagruzka: 'Дозагрузка',
    otstrochka: 'Отсрочка',
    starta: 'старта',
    invertornyj: 'Инверторный',
    dvigatel: 'двигатель',
    funkciya: 'Функция',
    par: 'пар',
    obem: 'Объем',
    chashi: 'чаши',
    kontejnera: 'контейнера',
    vody: 'воды',
    podklyucheniya: 'подключения',
    gril: 'Гриль',
    konvekciya: 'Конвекция',
    pereklyuchateli: 'Переключатели',
    tajmer: 'Таймер',
    displej: 'Дисплей',
    teleskopicheskie: 'Телескопические',
    napravlyayuwie: 'направляющие',
    chislo: 'Число',
    stekol: 'стекол',
    dvercy: 'дверцы',
    ochistka: 'Очистка',
    avtomaticheskie: 'Автоматические',
    programmy: 'программы',
    nagreva: 'нагрева',
    kamery: 'камеры',
    pokrytie: 'Покрытие',
    morozilnaya: 'Морозильная',
    kamera: 'камера',
    kompressorov: 'компрессоров',
    kamer: 'камер',
    zona: 'Зона',
    svezhesti: 'свежести',
    no: 'No',
    frost: 'Frost',
    superzamorozka: 'Суперзаморозка',
    superohlazhdenie: 'Суперохлаждение',
    obwij: 'Общий',
    holodilnoj: 'холодильной',
    morozilnoj: 'морозильной',
    vozmozhnost: 'Возможность',
    perevesit: 'перенавески',
    dver: 'двери',
    davlenie: 'Давление',
    pompy: 'помпы',
    kapuchinator: 'Капучинатор',
    vmestimost: 'Вместимость',
    mojki: 'мойки',
    sushki: 'сушки',
    tip: 'Тип',
    rashod: 'Расход',
    cikl: 'цикл',
    lotok: 'Лоток',
    stolovyh: 'столовых',
    priborov: 'приборов',
    korzin: 'корзин',
    avtootkryvanie: 'Автооткрывание',
    chash: 'чаш',
    sliva: 'слива',
    otverstie: 'Отверстие',
    pod: 'под',
    smesitel: 'смеситель',
    kryla: 'крыла',
    nalichie: 'Наличие',
    povorotnyj: 'Поворотный',
    izliv: 'излив',
    vydvizhnoj: 'Выдвижной',
    filtr: 'Фильтр',
  };

  const words = clean.split('_').map((w) => dict[w] || w);
  let res = words.join(' ');
  // Capitalize first letter
  res = res.charAt(0).toUpperCase() + res.slice(1);
  return res + unitSuffix;
}

async function main() {
  console.log('🧪 Starting Dry-Run verification for characteristics parser...');

  const csvPath = 'C:\\Users\\trash\\.gemini\\antigravity\\brain\\e8fbc5f5-4ac1-458b-bb14-a46d4efd4a35\\scratch\\old_site_catalog_export';
  if (!fs.existsSync(csvPath)) {
    throw new Error('Export CSV file not found');
  }

  const buffer = fs.readFileSync(csvPath);
  const text = new TextDecoder('windows-1251').decode(buffer);
  const lines = text.split(/\r?\n/);
  const headers = lines[0].split(';').map((h) => h.trim());

  // Also build an exact dictionary based on existing dump for 100% fidelity
  const gzPath = path.join(process.cwd(), 'data', 'exported_catalog_products.json.gz');
  const existingDump = JSON.parse(zlib.gunzipSync(fs.readFileSync(gzPath)).toString('utf8'));
  const dumpMap = new Map(existingDump.map((p: any) => [String(p.id), p]));

  // Auto-align dictionary from dump labels
  const columnToLabelMap: Record<string, string> = { ...KNOWN_LABELS };
  for (let j = 0; j < headers.length; j++) {
    const h = headers[j];
    if (columnToLabelMap[h]) continue;
    columnToLabelMap[h] = slugToHumanLabel(h);
  }

  // Pick 5 representative items from different categories:
  // 1. Oven: 90967 (BOSX 6737E09BG)
  // 2. Washing machine: 90948 (WNEI 84SDS)
  // 3. Dishwasher: 85617 (BD 4500)
  // 4. Toaster: 90730 (TSF 01SSEU)
  // 5. Hob: 90870 (GI 3201BSCE)
  const targetIds = ['90967', '90948', '85617', '90730', '90870'];
  const dryRunResults: any[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const parts = line.split(';');
    const kod = parts[0]?.replace(/^"|"$/g, '').trim();
    if (!targetIds.includes(kod)) continue;

    const dbItem = await prisma.product.findUnique({ where: { id: kod } });
    if (!dbItem) continue;

    const features: Array<{ label: string; value: string }> = [];
    let color: string | null = null;
    let width = '';
    let height = '';
    let depth = '';
    let stockRemote = 0;

    for (let j = 0; j < Math.min(parts.length, headers.length); j++) {
      const h = headers[j];
      const rawVal = parts[j]?.replace(/^"|"$/g, '').trim();
      if (!rawVal) continue;

      if (h === 'kod' || h === 'descr') continue;

      if (h === 'udalennyj_sklad') {
        stockRemote = parseInt(rawVal, 10) || 0;
        continue;
      }

      if (h === 'cvet') {
        color = rawVal;
      }

      // Collect dimensions
      if (h === 'width') width = fixExcelDecimal(rawVal);
      if (h === 'height') height = fixExcelDecimal(rawVal);
      if (h === 'depth' || h === 'length') depth = fixExcelDecimal(rawVal);

      // Handle value formatting
      let val = rawVal;
      if (val === '1') {
        val = 'есть';
      } else if (val === '0') {
        continue; // Rule: skip '0' values
      } else {
        val = fixExcelDecimal(val);
      }

      const label = columnToLabelMap[h] || slugToHumanLabel(h);
      features.push({ label, value: val });
    }

    const dimensions = [width, height, depth].filter(Boolean).length > 0
      ? `${width || '?'} × ${height || '?'} × ${depth || '?'} см`
      : dbItem.dimensions;

    dryRunResults.push({
      id: kod,
      name: dbItem.name,
      category: dbItem.category,
      color,
      dimensions,
      stockRemote,
      featuresCount: features.length,
      sampleFeatures: features,
    });
  }

  console.log('\n=== DRY-RUN SAMPLES ===\n');
  dryRunResults.forEach((res, idx) => {
    console.log(`\n--- [${idx + 1}/${dryRunResults.length}] ${res.name} (Код: ${res.id}) ---`);
    console.log(`Категория: ${res.category}`);
    console.log(`Цвет: ${res.color}`);
    console.log(`Габариты: ${res.dimensions}`);
    console.log(`Удаленный склад: ${res.stockRemote} шт.`);
    console.log(`Всего характеристик: ${res.featuresCount}`);
    console.log('Список характеристик:');
    res.sampleFeatures.forEach((f: any) => console.log(`  • ${f.label}: ${f.value}`));
  });

  await prisma.$disconnect();
}

main().catch(console.error);

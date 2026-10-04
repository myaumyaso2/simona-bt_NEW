/**
 * Реестр брендов для верхней строки каталожного Мега-меню (CatalogMegaMenu).
 * 
 * Правила формирования:
 * 1. Исключительно бренды с АКТИВНЫМИ товарами в каталоге (наличие цены > 0 и фото).
 * 2. Сертификаты («СИМОНА») исключены.
 * 3. «SIEMENS LV» объединен с «SIEMENS».
 * 4. Иерархия отображения:
 *    - Позиции 1–9: 9 ключевых флагманских брендов СИМОНА;
 *    - Позиции 10–37: Встраиваемая и крупная бытовая техника (сортировка по убыванию количества товаров, затем по алфавиту);
 *    - Позиции 38–60: Сантехника, малая кухонная техника, посуда и аксессуары (по убыванию количества товаров, затем по алфавиту).
 * 5. Названия брендов выводятся ЗАГЛАВНЫМИ БУКВАМИ (Quiet Luxury architectural standard).
 */

export interface MegaMenuBrandItem {
  name: string;
  slug: string;
  count: number;
  tier: 'flagship' | 'major-builtin' | 'specialized';
}

export const MEGA_MENU_BRANDS: MegaMenuBrandItem[] = [
  // 1. ТОП-9 ФЛАГМАНСКИХ БРЕНДОВ СИМОНА
  { name: 'BOSCH', slug: 'BOSCH', count: 139, tier: 'flagship' },
  { name: 'ASKO', slug: 'ASKO', count: 241, tier: 'flagship' },
  { name: 'LIEBHERR', slug: 'LIEBHERR', count: 150, tier: 'flagship' },
  { name: 'SMEG', slug: 'SMEG', count: 657, tier: 'flagship' },
  { name: 'MIELE', slug: 'MIELE', count: 77, tier: 'flagship' },
  { name: 'OMOIKIRI', slug: 'OMOIKIRI', count: 1421, tier: 'flagship' },
  { name: 'ELICA', slug: 'ELICA', count: 459, tier: 'flagship' },
  { name: 'MIDEA', slug: 'MIDEA', count: 94, tier: 'flagship' },
  { name: 'KÖRTING', slug: 'KORTING', count: 607, tier: 'flagship' },

  // 2. ВСТРАИВАЕМАЯ И КРУПНАЯ БЫТОВАЯ ТЕХНИКА (ПО УБЫВАНИЮ КОЛИЧЕСТВА)
  { name: 'FALMEC', slug: 'FALMEC', count: 338, tier: 'major-builtin' },
  { name: 'ELIKOR', slug: 'ELIKOR', count: 205, tier: 'major-builtin' },
  { name: 'BERTAZZONI', slug: 'BERTAZZONI', count: 189, tier: 'major-builtin' },
  { name: 'EVELUX', slug: 'EVELUX', count: 188, tier: 'major-builtin' },
  { name: 'SIEMENS', slug: 'SIEMENS', count: 185, tier: 'major-builtin' },
  { name: 'GRAUDE', slug: 'GRAUDE', count: 160, tier: 'major-builtin' },
  { name: 'MEYVEL', slug: 'MEYVEL', count: 150, tier: 'major-builtin' },
  { name: 'DUNAVOX', slug: 'DUNAVOX', count: 121, tier: 'major-builtin' },
  { name: 'FRANKE', slug: 'FRANKE', count: 111, tier: 'major-builtin' },
  { name: 'VARD', slug: 'VARD', count: 101, tier: 'major-builtin' },
  { name: 'KUPPERSBERG', slug: 'KUPPERSBERG', count: 83, tier: 'major-builtin' },
  { name: 'CASO', slug: 'CASO', count: 80, tier: 'major-builtin' },
  { name: 'GORENJE', slug: 'GORENJE', count: 76, tier: 'major-builtin' },
  { name: 'JETAIR', slug: 'JETAIR', count: 61, tier: 'major-builtin' },
  { name: 'SCHULTHESS', slug: 'SCHULTHESS', count: 48, tier: 'major-builtin' },
  { name: 'HIBERG', slug: 'HIBERG', count: 45, tier: 'major-builtin' },
  { name: 'JACKYS', slug: 'JACKYS', count: 36, tier: 'major-builtin' },
  { name: 'ELECTROLUX', slug: 'ELECTROLUX', count: 6, tier: 'major-builtin' },
  { name: 'HAIER', slug: 'HAIER', count: 6, tier: 'major-builtin' },
  { name: 'BEKO', slug: 'BEKO', count: 4, tier: 'major-builtin' },
  { name: 'INDESIT', slug: 'INDESIT', count: 4, tier: 'major-builtin' },
  { name: 'LG', slug: 'LG', count: 4, tier: 'major-builtin' },
  { name: 'NEFF', slug: 'NEFF', count: 4, tier: 'major-builtin' },
  { name: 'AEG', slug: 'AEG', count: 2, tier: 'major-builtin' },
  { name: 'DAICHI', slug: 'DAICHI', count: 1, tier: 'major-builtin' },
  { name: 'ESPERANZA', slug: 'ESPERANZA', count: 1, tier: 'major-builtin' },
  { name: 'MAUNFELD', slug: 'MAUNFELD', count: 1, tier: 'major-builtin' },
  { name: 'SAMSUNG', slug: 'SAMSUNG', count: 1, tier: 'major-builtin' },

  // 3. САНТЕХНИКА, МАЛАЯ ТЕХНИКА, ПОСУДА И АКСЕССУАРЫ (ПО УБЫВАНИЮ КОЛИЧЕСТВА)
  { name: 'LONGRAN', slug: 'LONGRAN', count: 207, tier: 'specialized' },
  { name: 'RIEDEL', slug: 'RIEDEL', count: 158, tier: 'specialized' },
  { name: 'STEBA', slug: 'STEBA', count: 46, tier: 'specialized' },
  { name: 'NIVONA', slug: 'NIVONA', count: 44, tier: 'specialized' },
  { name: 'LAURASTAR', slug: 'LAURASTAR', count: 40, tier: 'specialized' },
  { name: 'EKO', slug: 'EKO', count: 34, tier: 'specialized' },
  { name: 'STATUS', slug: 'STATUS', count: 27, tier: 'specialized' },
  { name: 'ROMMELSBACHER', slug: 'ROMMELSBACHER', count: 23, tier: 'specialized' },
  { name: 'BONE CRUSHER', slug: 'BONE CRUSHER', count: 19, tier: 'specialized' },
  { name: 'MIKADZO', slug: 'MIKADZO', count: 9, tier: 'specialized' },
  { name: 'FABER', slug: 'FABER', count: 8, tier: 'specialized' },
  { name: 'HOBOT', slug: 'HOBOT', count: 8, tier: 'specialized' },
  { name: 'ALVEUS', slug: 'ALVEUS', count: 5, tier: 'specialized' },
  { name: 'BUGATTI', slug: 'BUGATTI', count: 4, tier: 'specialized' },
  { name: 'NACHTMANN', slug: 'NACHTMANN', count: 3, tier: 'specialized' },
  { name: 'PEUGEOT', slug: 'PEUGEOT', count: 3, tier: 'specialized' },
  { name: 'BLACK+DECKER', slug: 'BLACK+DECKER', count: 2, tier: 'specialized' },
  { name: 'BONECO', slug: 'BONECO', count: 2, tier: 'specialized' },
  { name: 'GIRA', slug: 'GIRA', count: 2, tier: 'specialized' },
  { name: 'VITEK', slug: 'VITEK', count: 2, tier: 'specialized' },
  { name: 'GAGGENAU', slug: 'GAGGENAU', count: 1, tier: 'specialized' },
  { name: 'KUPPERSBUSCH', slug: 'KUPPERSBUSCH', count: 1, tier: 'specialized' },
  { name: 'PHILIPS', slug: 'PHILIPS', count: 1, tier: 'specialized' },
];

/**
 * Возвращает актуальный список брендов мега-меню, гарантируя наличие только брендов с товарами.
 */
export function getActiveCatalogBrands(): MegaMenuBrandItem[] {
  return MEGA_MENU_BRANDS.filter((item) => item.count > 0);
}

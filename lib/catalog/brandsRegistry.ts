/**
 * Unified Brand Registry for SEO Routing, Middleware 301 Redirects, Sitemap, and Brand Atlas.
 * Pure TypeScript (Edge-compatible for middleware.ts).
 */

export interface BrandRegistryEntry {
  slug: string;          // Canonical URL slug for /brands/[slug], e.g. 'korting', 'neff', 'bone-crusher'
  dbBrand: string;       // Canonical brand filter param used in catalog queries, e.g. 'KORTING', 'NEFF', 'BONE CRUSHER'
  displayName: string;   // Human-friendly Anti-Caps display name per DESIGN.md, e.g. 'Körting', 'Neff', 'Bone Crusher'
  country: string;       // Brand origin country for honest brand cards
  aliases: string[];     // Lowercase tokens/slugs used in old UMI.CMS URLs or DB variants
  isPremiumFlagship?: boolean; // Only true for genuine premium flagship brands per PRODUCT.md
}

export const BRAND_REGISTRY: BrandRegistryEntry[] = [
  { slug: 'miele', dbBrand: 'MIELE', displayName: 'Miele', country: 'Германия', aliases: ['miele'], isPremiumFlagship: true },
  { slug: 'asko', dbBrand: 'ASKO', displayName: 'Asko', country: 'Швеция', aliases: ['asko'], isPremiumFlagship: true },
  { slug: 'smeg', dbBrand: 'SMEG', displayName: 'Smeg', country: 'Италия', aliases: ['smeg'], isPremiumFlagship: true },
  { slug: 'liebherr', dbBrand: 'LIEBHERR', displayName: 'Liebherr', country: 'Германия', aliases: ['liebherr'], isPremiumFlagship: true },
  { slug: 'omoikiri', dbBrand: 'OMOIKIRI', displayName: 'Omoikiri', country: 'Япония', aliases: ['omoikiri'], isPremiumFlagship: true },
  { slug: 'korting', dbBrand: 'KORTING', displayName: 'Körting', country: 'Германия', aliases: ['korting', 'koerting', 'körting'] },
  { slug: 'falmec', dbBrand: 'FALMEC', displayName: 'Falmec', country: 'Италия', aliases: ['falmec'], isPremiumFlagship: true },
  { slug: 'vard', dbBrand: 'VARD', displayName: 'Vard', country: 'Европа', aliases: ['vard'] },
  { slug: 'midea', dbBrand: 'MIDEA', displayName: 'Midea', country: 'Международный бренд', aliases: ['midea'] },
  { slug: 'bosch', dbBrand: 'BOSCH', displayName: 'Bosch', country: 'Германия', aliases: ['bosch'] },
  { slug: 'elica', dbBrand: 'ELICA', displayName: 'Elica', country: 'Италия', aliases: ['elica'] },
  { slug: 'gorenje', dbBrand: 'GORENJE', displayName: 'Gorenje', country: 'Словения', aliases: ['gorenje'] },
  { slug: 'evelux', dbBrand: 'EVELUX', displayName: 'Evelux', country: 'Европа', aliases: ['evelux'] },
  { slug: 'bertazzoni', dbBrand: 'BERTAZZONI', displayName: 'Bertazzoni', country: 'Италия', aliases: ['bertazzoni'], isPremiumFlagship: true },
  { slug: 'gaggenau', dbBrand: 'GAGGENAU', displayName: 'Gaggenau', country: 'Германия', aliases: ['gaggenau'], isPremiumFlagship: true },
  { slug: 'neff', dbBrand: 'NEFF', displayName: 'Neff', country: 'Германия', aliases: ['neff'] },
  { slug: 'siemens-lv', dbBrand: 'SIEMENS LV', displayName: 'Siemens LV', country: 'Германия', aliases: ['siemens-lv', 'siemens_lv', 'siemens lv', 'siemens_elektro'] },
  { slug: 'siemens', dbBrand: 'SIEMENS', displayName: 'Siemens', country: 'Германия', aliases: ['siemens'] },
  { slug: 'kuppersbusch', dbBrand: 'KUPPERSBUSCH', displayName: 'Küppersbusch', country: 'Германия', aliases: ['kuppersbusch', 'küppersbusch'], isPremiumFlagship: true },
  { slug: 'kuppersberg', dbBrand: 'KUPPERSBERG', displayName: 'Kuppersberg', country: 'Германия', aliases: ['kuppersberg'] },
  { slug: 'schulthess', dbBrand: 'SCHULTHESS', displayName: 'Schulthess', country: 'Швейцария', aliases: ['schulthess'], isPremiumFlagship: true },
  { slug: 'laurastar', dbBrand: 'LAURASTAR', displayName: 'Laurastar', country: 'Швейцария', aliases: ['laurastar'], isPremiumFlagship: true },
  { slug: 'riedel', dbBrand: 'RIEDEL', displayName: 'Riedel', country: 'Австрия', aliases: ['riedel'], isPremiumFlagship: true },
  { slug: 'nachtmann', dbBrand: 'NACHTMANN', displayName: 'Nachtmann', country: 'Германия', aliases: ['nachtmann'] },
  { slug: 'franke', dbBrand: 'FRANKE', displayName: 'Franke', country: 'Швейцария', aliases: ['franke'] },
  { slug: 'longran', dbBrand: 'LONGRAN', displayName: 'Longran', country: 'Великобритания', aliases: ['longran'] },
  { slug: 'alveus', dbBrand: 'ALVEUS', displayName: 'Alveus', country: 'Словения', aliases: ['alveus'] },
  { slug: 'elikor', dbBrand: 'ELIKOR', displayName: 'Elikor', country: 'Россия', aliases: ['elikor'] },
  { slug: 'graude', dbBrand: 'GRAUDE', displayName: 'Graude', country: 'Германия', aliases: ['graude'] },
  { slug: 'meyvel', dbBrand: 'MEYVEL', displayName: 'Meyvel', country: 'Италия', aliases: ['meyvel'] },
  { slug: 'dunavox', dbBrand: 'DUNAVOX', displayName: 'Dunavox', country: 'Венгрия', aliases: ['dunavox'] },
  { slug: 'caso', dbBrand: 'CASO', displayName: 'Caso', country: 'Германия', aliases: ['caso'] },
  { slug: 'jetair', dbBrand: 'JETAIR', displayName: 'Jetair', country: 'Италия', aliases: ['jetair'] },
  { slug: 'faber', dbBrand: 'FABER', displayName: 'Faber', country: 'Италия', aliases: ['faber'] },
  { slug: 'steba', dbBrand: 'STEBA', displayName: 'Steba', country: 'Германия', aliases: ['steba'] },
  { slug: 'rommelsbacher', dbBrand: 'ROMMELSBACHER', displayName: 'Rommelsbacher', country: 'Германия', aliases: ['rommelsbacher'] },
  { slug: 'hiberg', dbBrand: 'HIBERG', displayName: 'Hiberg', country: 'Международный бренд', aliases: ['hiberg'] },
  { slug: 'nivona', dbBrand: 'NIVONA', displayName: 'Nivona', country: 'Германия', aliases: ['nivona'] },
  { slug: 'jackys', dbBrand: 'JACKYS', displayName: 'Jacky’s', country: 'Великобритания', aliases: ['jackys', "jacky's"] },
  { slug: 'bone-crusher', dbBrand: 'BONE CRUSHER', displayName: 'Bone Crusher', country: 'США', aliases: ['bone-crusher', 'bone_crusher', 'bonecrusher', 'bone crusher'] },
  { slug: 'status', dbBrand: 'STATUS', displayName: 'Status', country: 'Словения / Италия', aliases: ['status'] },
  { slug: 'mikadzo', dbBrand: 'MIKADZO', displayName: 'Mikadzo', country: 'Япония', aliases: ['mikadzo'] },
  { slug: 'hobot', dbBrand: 'HOBOT', displayName: 'Hobot', country: 'Тайвань', aliases: ['hobot'] },
  { slug: 'haier', dbBrand: 'HAIER', displayName: 'Haier', country: 'Международный бренд', aliases: ['haier'] },
  { slug: 'electrolux', dbBrand: 'ELECTROLUX', displayName: 'Electrolux', country: 'Швеция', aliases: ['electrolux'] },
  { slug: 'aeg', dbBrand: 'AEG', displayName: 'AEG', country: 'Германия', aliases: ['aeg'] },
  { slug: 'beko', dbBrand: 'BEKO', displayName: 'Beko', country: 'Турция', aliases: ['beko'] },
  { slug: 'eko', dbBrand: 'EKO', displayName: 'EKO', country: 'Международный бренд', aliases: ['eko'] },
  { slug: 'bugatti', dbBrand: 'BUGATTI', displayName: 'Bugatti', country: 'Италия', aliases: ['bugatti'] },
  { slug: 'indesit', dbBrand: 'INDESIT', displayName: 'Indesit', country: 'Италия', aliases: ['indesit'] },
  { slug: 'lg', dbBrand: 'LG', displayName: 'LG', country: 'Южная Корея', aliases: ['lg'] },
  { slug: 'samsung', dbBrand: 'SAMSUNG', displayName: 'Samsung', country: 'Южная Корея', aliases: ['samsung'] },
  { slug: 'peugeot', dbBrand: 'PEUGEOT', displayName: 'Peugeot', country: 'Франция', aliases: ['peugeot'] },
  { slug: 'gira', dbBrand: 'GIRA', displayName: 'Gira', country: 'Германия', aliases: ['gira'] },
  { slug: 'black-decker', dbBrand: 'BLACK+DECKER', displayName: 'Black+Decker', country: 'США', aliases: ['black-decker', 'black_decker', 'black+decker', 'blackdecker'] },
  { slug: 'boneco', dbBrand: 'BONECO', displayName: 'Boneco', country: 'Швейцария', aliases: ['boneco'] },
  { slug: 'vitek', dbBrand: 'VITEK', displayName: 'Vitek', country: 'Россия', aliases: ['vitek'] },
  { slug: 'philips', dbBrand: 'PHILIPS', displayName: 'Philips', country: 'Нидерланды', aliases: ['philips'] },
  { slug: 'esperanza', dbBrand: 'ESPERANZA', displayName: 'Esperanza', country: 'Европа', aliases: ['esperanza'] },
  { slug: 'daichi', dbBrand: 'DAICHI', displayName: 'Daichi', country: 'Япония / Россия', aliases: ['daichi'] },
  { slug: 'maunfeld', dbBrand: 'MAUNFELD', displayName: 'Maunfeld', country: 'Великобритания', aliases: ['maunfeld'] },
  // Legacy / archival brands that may appear in old UMI links
  { slug: 'de-dietrich', dbBrand: 'DE DIETRICH', displayName: 'De Dietrich', country: 'Франция', aliases: ['de-dietrich', 'de_dietrich', 'dedietrich', 'de dietrich'] },
  { slug: 'teka', dbBrand: 'TEKA', displayName: 'Teka', country: 'Германия / Испания', aliases: ['teka'] },
  { slug: 'whirlpool', dbBrand: 'WHIRLPOOL', displayName: 'Whirlpool', country: 'США / Европа', aliases: ['whirlpool'] },
  { slug: 'hitachi', dbBrand: 'HITACHI', displayName: 'Hitachi', country: 'Япония', aliases: ['hitachi'] },
  { slug: 'karcher', dbBrand: 'KARCHER', displayName: 'Kärcher', country: 'Германия', aliases: ['karcher', 'kärcher'] },
  { slug: 'kitchenaid', dbBrand: 'KITCHENAID', displayName: 'KitchenAid', country: 'США', aliases: ['kitchenaid', 'kitchen_aid', 'kitchen-aid'] },
  { slug: 'blanco', dbBrand: 'BLANCO', displayName: 'Blanco', country: 'Германия', aliases: ['blanco'] },
  { slug: 'zigmund-shtain', dbBrand: 'ZIGMUND & SHTAIN', displayName: 'Zigmund & Shtain', country: 'Германия', aliases: ['zigmund-shtain', 'zigmund_shtain', 'zigmund & shtain'] },
  { slug: 'kaiser', dbBrand: 'KAISER', displayName: 'Kaiser', country: 'Германия', aliases: ['kaiser'] },
  { slug: 'big-green-egg', dbBrand: 'BIG GREEN EGG', displayName: 'Big Green Egg', country: 'США', aliases: ['big-green-egg', 'big_green_egg', 'biggreenegg'] },
];

const ALIAS_TO_ENTRY = new Map<string, BrandRegistryEntry>();
for (const entry of BRAND_REGISTRY) {
  ALIAS_TO_ENTRY.set(entry.slug.toLowerCase(), entry);
  ALIAS_TO_ENTRY.set(entry.dbBrand.toLowerCase(), entry);
  ALIAS_TO_ENTRY.set(entry.displayName.toLowerCase(), entry);
  for (const alias of entry.aliases) {
    ALIAS_TO_ENTRY.set(alias.toLowerCase(), entry);
  }
}

// Pre-sorted alias pairs (longest first so 'kuppersbusch' beats 'kuppersberg', 'beko' beats 'eko', 'siemens_elektro' beats 'siemens')
const SORTED_TOKEN_MATCHERS: Array<{ token: string; entry: BrandRegistryEntry; regex: RegExp }> = [];
for (const entry of BRAND_REGISTRY) {
  for (const alias of entry.aliases) {
    if (alias.includes(' ')) continue;
    const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Match token bounded by start/end or underscore/hyphen, allowing trailing digits in UMI slugs like bosch1, smeg1, franke2
    const regex = new RegExp(`(?:^|[_-])${escaped}[0-9]*(?:$|[_-])`, 'i');
    SORTED_TOKEN_MATCHERS.push({ token: alias, entry, regex });
  }
}
SORTED_TOKEN_MATCHERS.sort((a, b) => b.token.length - a.token.length);

export function resolveBrandEntry(raw?: string | null): BrandRegistryEntry | null {
  if (!raw) return null;
  const cleaned = raw.trim().toLowerCase();
  if (!cleaned || cleaned === 'симона' || cleaned === 'simona') return null;

  const direct = ALIAS_TO_ENTRY.get(cleaned);
  if (direct) return direct;

  const normalized = cleaned.replace(/[_\s+]+/g, '-').replace(/-+/g, '-');
  const normHit = ALIAS_TO_ENTRY.get(normalized);
  if (normHit) return normHit;

  return null;
}

export function brandNameToSlug(rawBrand?: string | null): string | null {
  if (!rawBrand) return null;
  const trimmed = rawBrand.trim();
  if (!trimmed || trimmed.toUpperCase() === 'СИМОНА') return null;

  const known = resolveBrandEntry(trimmed);
  if (known) return known.slug;

  // Fallback deterministic ASCII slug
  const fallback = trimmed
    .toLowerCase()
    .replace(/ö/g, 'o')
    .replace(/ü/g, 'u')
    .replace(/ä/g, 'a')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return fallback || null;
}

export function getBrandDbVariants(entryOrRaw: BrandRegistryEntry | string): string[] {
  const entry = typeof entryOrRaw === 'string' ? resolveBrandEntry(entryOrRaw) : entryOrRaw;
  if (!entry) {
    const raw = typeof entryOrRaw === 'string' ? entryOrRaw.trim() : '';
    if (!raw) return [];
    return Array.from(
      new Set([
        raw,
        raw.toUpperCase(),
        raw.toLowerCase(),
        raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase(),
      ])
    );
  }

  const variants = new Set<string>([
    entry.dbBrand,
    entry.dbBrand.toUpperCase(),
    entry.dbBrand.toLowerCase(),
    entry.displayName,
    entry.displayName.toUpperCase(),
    entry.displayName.toLowerCase(),
    entry.slug,
    entry.slug.toUpperCase(),
  ]);

  if (entry.slug === 'korting') {
    variants.add('KORTING');
    variants.add('KÖRTING');
    variants.add('Korting');
    variants.add('Körting');
  }

  return Array.from(variants);
}

/**
 * Extracts a canonical BrandRegistryEntry from UMI.CMS path segments,
 * including compound segments such as `varochnye_paneli_bosch1`, `stiralnye_mashiny_solo_asko`,
 * `holodil_niki_solo_smeg1`, `vstrojka_liebherr`, `mojki_franke2`.
 */
export function extractBrandFromUmiSegments(segments: string[]): BrandRegistryEntry | null {
  // 1. Check exact segment match first
  for (const seg of segments) {
    const clean = seg.trim().toLowerCase().replace(/[0-9]+$/, '');
    const exact = resolveBrandEntry(seg) || (clean.length >= 2 ? resolveBrandEntry(clean) : null);
    if (exact) return exact;
  }

  // 2. Check compound segment token boundaries (e.g. varochnye_paneli_bosch1)
  for (const seg of segments) {
    if (!seg) continue;
    for (const matcher of SORTED_TOKEN_MATCHERS) {
      if (matcher.regex.test(seg)) {
        return matcher.entry;
      }
    }
  }

  return null;
}

/**
 * Infers canonical catalog category slug from transliterated UMI.CMS product/outlet URLs
 * (e.g. `bos_6737e09wg_duhovoj_shkaf_ucenka` -> `vstraivaemye-duhovye-shkafy`).
 */
export function inferCategorySlugFromUmiSlug(rawPath: string): string | null {
  const s = rawPath.toLowerCase();

  if (/duhovoj_shkaf|duhovye_shkafy|duhovka/.test(s)) return 'vstraivaemye-duhovye-shkafy';
  if (/varochnaya_panel|varochnye_paneli|varochnaya_poverhnost/.test(s)) return 'varochnye-paneli';
  if (/vytyazhk/.test(s)) return 'vytyazhki';
  if (/posudomoechn/.test(s)) {
    return /solo/.test(s) ? 'posudomoechnye-mashiny' : 'vstraivaemye-posudomoechnye-mashiny';
  }
  if (/sushil_n|sushiln/.test(s)) return 'sushilnye-mashiny';
  if (/stiral_n|stiraln/.test(s)) {
    return /vstro/.test(s) ? 'vstraivaemye-stiralnye-mashiny' : 'stiralnye-mashiny';
  }
  if (/vinnyj_shkaf|vinnye_shkafy/.test(s)) {
    return /vstro/.test(s) ? 'vstraivaemye-vinnye-shkafy' : 'vinnye-shkafy';
  }
  if (/holodil_n|holodiln|morozil/.test(s)) {
    return /vstro/.test(s) ? 'vstraivaemye-holodilniki' : 'holodilniki';
  }
  if (/mikrovolnov|svch/.test(s)) {
    return /solo/.test(s) ? 'mikrovolnovye-pechi' : 'vstraivaemye-mikrovolnovye-pechi';
  }
  if (/kofemashin/.test(s)) {
    return /vstro/.test(s) ? 'vstraivaemye-kofemashiny' : 'kofemashiny';
  }
  if (/kofevark/.test(s)) return 'kofevarki';
  if (/chajnik|chainik/.test(s)) return 'chajniki';
  if (/toster/.test(s)) return 'tostery';
  if (/blender/.test(s)) return 'blendery';
  if (/mikser/.test(s)) return 'miksery';
  if (/myasorubk/.test(s)) return 'myasorubki';
  if (/sokovyzhimalk/.test(s)) return 'sokovyzhimalki';
  if (/kombajn|kombain/.test(s)) return 'kuhonnye-kombajny';
  if (/pylesos/.test(s)) return 'pylesosy';
  if (/robot.*okon|mojki_okon/.test(s)) return 'roboty-dlya-mojki-okon';
  if (/mojka|mojki/.test(s)) return 'mojki-dlya-kuhni';
  if (/smesitel/.test(s)) return 'smesiteli-dlya-kuhni';
  if (/izmelchitel/.test(s)) return 'izmelchiteli-pishchevyh-othodov';
  if (/dozator/.test(s)) return 'dozatory-dlya-moyushchih-sredstv';
  if (/plita|plity/.test(s)) return 'kuhonnye-plity';
  if (/gladiln|parogenerator/.test(s)) return 'gladilnye-sistemy';
  if (/utyug/.test(s)) return 'utyugi';
  if (/podogrevatel/.test(s)) return 'podogrevateli-posudy';
  if (/vakuumator/.test(s)) return 'vakuumatory';
  if (/bokal/.test(s)) return 'bokaly-riedel';
  if (/dekanter/.test(s)) return 'dekantery-riedel';
  if (/kondicioner|split/.test(s)) return 'kondicionery';
  if (/vodonagrevatel/.test(s)) return 'vodonagrevateli';

  return null;
}

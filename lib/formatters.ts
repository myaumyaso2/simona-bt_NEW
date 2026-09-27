/**
 * Typography and Brand formatting utilities adhering to DESIGN.md
 * (Anti-Caps / Human Typography Standard)
 */

const KNOWN_BRANDS: Record<string, string> = {
  smeg: 'Smeg',
  miele: 'Miele',
  asko: 'Asko',
  bosch: 'Bosch',
  siemens: 'Siemens',
  neff: 'Neff',
  gaggenau: 'Gaggenau',
  liebherr: 'Liebherr',
  omoikiri: 'Omoikiri',
  körting: 'Körting',
  korting: 'Körting',
  bertazzoni: 'Bertazzoni',
  falmec: 'Falmec',
  vard: 'Vard',
  schulthess: 'Schulthess',
  elica: 'Elica',
  faber: 'Faber',
  kuppersbusch: 'Kuppersbusch',
  küppersbusch: 'Küppersbusch',
  bora: 'Bora',
  blanco: 'Blanco',
  franke: 'Franke',
  aeg: 'AEG',
  whirlpool: 'Whirlpool',
  electrolux: 'Electrolux',
  graude: 'Graude',
  krona: 'Krona',
  de_dietrich: 'De Dietrich',
  'de dietrich': 'De Dietrich',
};

/**
 * Formats brand name to natural title-case according to DESIGN.md 3.3:
 * Strict ban on all-caps (BOSCH, ASKO, SMEG -> Bosch, Asko, Smeg).
 */
export function formatBrandName(rawBrand?: string | null): string {
  if (!rawBrand) return '';
  const trimmed = rawBrand.trim();
  const lower = trimmed.toLowerCase();

  if (KNOWN_BRANDS[lower]) {
    return KNOWN_BRANDS[lower];
  }

  // Capitalize first letter, lowercase the rest
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
}

import QRCode from 'qrcode';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import jsQR from 'jsqr';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// Authentic Simona Diamond Emblem paths from Figma node 4350-92 (viewBox 0 0 333 241)
const SIMONA_SIGN_PATHS = [
  "M228.461 0.0394778H228.067C223.571 0.0394778 219.903 3.71013 219.903 8.20964V8.2491V43.7321V43.7715C219.903 48.1921 223.452 51.7444 227.83 51.9022V51.9417C261.431 53.0074 270.58 64.6508 270.58 99.6997V141.419C270.58 178.283 260.484 189.69 222.348 189.69H166.426H110.504C72.3676 189.69 62.2717 178.283 62.2717 141.419V99.6602C62.2717 64.6508 71.4212 53.0074 105.022 51.9022V51.8628C109.399 51.7444 112.949 48.1921 112.949 43.7321V43.6926V8.20964V8.17016C112.949 3.67065 109.281 0 104.785 0H104.391C25.4371 0 0 25.4578 0 89.1219V152.312C0 215.976 25.4371 241 104.391 241H166.465H228.54C307.494 241 332.931 215.976 332.931 152.312V89.1219C332.852 25.4972 307.415 0.0394778 228.461 0.0394778Z",
  "M189.537 0.0393506H143.237C138.82 0.0393506 135.231 3.63106 135.231 8.05163V26.7601V117.342V136.051C135.231 140.471 138.82 144.063 143.237 144.063H189.537C193.954 144.063 197.542 140.471 197.542 136.051V117.342V26.7206V8.01215C197.542 3.63105 193.954 0.0393506 189.537 0.0393506Z"
];

// Color tokens
const BRAND_TEAL = '#00979C'; // Pantone 7716 C
const CHARCOAL = '#111315';   // Simona Deep Charcoal
const WHITE = '#FFFFFF';

export function buildSimonaQrSvg(text, options = {}) {
  const {
    variant = 'classic', // 'classic' | 'teal'
    margin = 4,
    canvasSize = 1024,
    badgeRatio = 0.23, // badge width relative to matrix width (~5% area)
  } = options;

  const isTeal = variant === 'teal';
  const moduleColor = isTeal ? BRAND_TEAL : CHARCOAL;
  const logoColor = BRAND_TEAL;
  const borderColor = isTeal ? BRAND_TEAL : '#00979C';
  const borderOpacity = isTeal ? '0.85' : '0.4';

  const qr = QRCode.create(text, { errorCorrectionLevel: 'H' });
  const matrixSize = qr.modules.size;
  const totalGrid = matrixSize + margin * 2;
  const cellSize = canvasSize / totalGrid;

  // Center of matrix in canvas pixels
  const centerPx = canvasSize / 2;

  // Badge dimensions (aspect ratio ~1.38 to fit logo nicely)
  // Badge width in modules:
  const badgeWidthPx = canvasSize * badgeRatio;
  const badgeHeightPx = badgeWidthPx * (241 / 333) * 1.15; // slightly taller for breathing room
  const badgeX = centerPx - badgeWidthPx / 2;
  const badgeY = centerPx - badgeHeightPx / 2;
  const cornerRadius = badgeHeightPx * 0.18; // rounded-xl geometry

  // Logo dimensions inside badge
  const logoPadding = badgeHeightPx * 0.16;
  const logoHeightPx = badgeHeightPx - logoPadding * 2;
  const logoWidthPx = logoHeightPx * (333 / 241);
  const logoX = centerPx - logoWidthPx / 2;
  const logoY = centerPx - logoHeightPx / 2;
  const logoScale = logoWidthPx / 333;

  // Build module paths, skipping modules that fall under the badge
  const pathCommands = [];
  const badgeModuleMargin = 0.5 * cellSize; // safety clear zone
  const clearLeft = badgeX - badgeModuleMargin;
  const clearRight = badgeX + badgeWidthPx + badgeModuleMargin;
  const clearTop = badgeY - badgeModuleMargin;
  const clearBottom = badgeY + badgeHeightPx + badgeModuleMargin;

  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      if (qr.modules.get(r, c)) {
        const x = (c + margin) * cellSize;
        const y = (r + margin) * cellSize;
        const cx = x + cellSize / 2;
        const cy = y + cellSize / 2;

        // Skip modules covered by badge
        if (cx >= clearLeft && cx <= clearRight && cy >= clearTop && cy <= clearBottom) {
          continue;
        }

        // Draw crisp cell
        pathCommands.push(`M${x.toFixed(2)},${y.toFixed(2)}h${cellSize.toFixed(2)}v${cellSize.toFixed(2)}h-${cellSize.toFixed(2)}z`);
      }
    }
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${canvasSize} ${canvasSize}" width="${canvasSize}" height="${canvasSize}">
  <defs>
    <filter id="badge-shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000000" flood-opacity="0.08" />
    </filter>
  </defs>

  <!-- Clean Background -->
  <rect width="${canvasSize}" height="${canvasSize}" fill="${WHITE}" />

  <!-- QR Modules -->
  <path d="${pathCommands.join(' ')}" fill="${moduleColor}" />

  <!-- Center Badge (Quiet Luxury Rounded-XL) -->
  <g filter="url(#badge-shadow)">
    <rect
      x="${badgeX.toFixed(2)}"
      y="${badgeY.toFixed(2)}"
      width="${badgeWidthPx.toFixed(2)}"
      height="${badgeHeightPx.toFixed(2)}"
      rx="${cornerRadius.toFixed(2)}"
      ry="${cornerRadius.toFixed(2)}"
      fill="${WHITE}"
      stroke="${borderColor}"
      stroke-width="2.5"
      stroke-opacity="${borderOpacity}"
    />
  </g>

  <!-- Simona Diamond Emblem (Brandbook node 4350-92) -->
  <g transform="translate(${logoX.toFixed(2)}, ${logoY.toFixed(2)}) scale(${logoScale.toFixed(4)})">
    <path d="${SIMONA_SIGN_PATHS[0]}" fill="${logoColor}" />
    <path d="${SIMONA_SIGN_PATHS[1]}" fill="${logoColor}" />
  </g>
</svg>`;

  return {
    svg,
    matrixSize,
    qrVersion: qr.version,
    badgeWidthPx,
    badgeHeightPx,
  };
}

export async function verifyQrScannability(pngBuffer) {
  const { data, info } = await sharp(pngBuffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const clampedArray = new Uint8ClampedArray(data.buffer, data.byteOffset, data.length);
  const code = jsQR(clampedArray, info.width, info.height);
  return code ? code.data : null;
}

export async function generateQrFiles(text, options = {}) {
  const {
    name = 'simona-qr',
    outDir = path.join(ROOT_DIR, 'public', 'qr'),
    size = 1024,
    variants = ['classic', 'teal'],
  } = options;

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const results = [];

  for (const variant of variants) {
    const filenamePrefix = `${name}-${variant}`;
    const svgPath = path.join(outDir, `${filenamePrefix}.svg`);
    const pngPath = path.join(outDir, `${filenamePrefix}.png`);

    const { svg, qrVersion, matrixSize } = buildSimonaQrSvg(text, {
      variant,
      canvasSize: size,
    });

    // Save SVG
    fs.writeFileSync(svgPath, svg, 'utf-8');

    // Render PNG via Sharp
    const pngBuffer = await sharp(Buffer.from(svg))
      .png({ quality: 100, compressionLevel: 9 })
      .toBuffer();

    fs.writeFileSync(pngPath, pngBuffer);

    // Verify scannability with jsQR
    const decoded = await verifyQrScannability(pngBuffer);
    const isScanValid = decoded === text;

    results.push({
      variant,
      qrVersion,
      matrixSize,
      svgPath,
      pngPath,
      svgSizeKb: (fs.statSync(svgPath).size / 1024).toFixed(1),
      pngSizeKb: (fs.statSync(pngPath).size / 1024).toFixed(1),
      isScanValid,
      decodedMatch: isScanValid ? '100% MATCH' : 'FAIL',
    });
  }

  return results;
}

// CLI Support
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  let text = '';
  let name = 'simona-qr';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--text' || args[i] === '-t') {
      text = args[i + 1] || '';
      i++;
    } else if (args[i] === '--name' || args[i] === '-n') {
      name = args[i + 1] || 'simona-qr';
      i++;
    }
  }

  if (!text) {
    text = "Здравствуйте! СИМОНА дарит вам персональные скидки на избранный ассортимент встраиваемой бытовой техники. Ваш менеджер — Ильдар Зарипов. Получить специальные цены можно только в розничном салоне по адресу ул. Белинского, 15. Ждем вас! Наш сайт: https://simona-bt.ru/";
  }

  console.log('Generating QR codes for text:');
  console.log(`"${text}"\n`);

  generateQrFiles(text, { name })
    .then((results) => {
      console.log('Result:');
      console.table(results);
    })
    .catch((err) => {
      console.error('Error generating QR:', err);
      process.exit(1);
    });
}

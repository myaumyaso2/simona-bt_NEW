const fs = require('fs');
const zlib = require('zlib');

function unfilterPNG(buf) {
  const w = buf.readUInt32BE(16);
  const h = buf.readUInt32BE(20);
  let idat = [];
  let offset = 8;
  while (offset < buf.length) {
    const len = buf.readUInt32BE(offset);
    const type = buf.toString('ascii', offset + 4, offset + 8);
    if (type === 'IDAT') idat.push(buf.slice(offset + 8, offset + 8 + len));
    offset += 12 + len;
  }
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const bpp = 4;
  const rowSize = w * bpp;
  const out = Buffer.alloc(w * h * bpp);

  let prevRow = Buffer.alloc(rowSize);
  for (let y = 0; y < h; y++) {
    const filter = raw[y * (rowSize + 1)];
    const currRaw = raw.slice(y * (rowSize + 1) + 1, (y + 1) * (rowSize + 1));
    const currRow = Buffer.alloc(rowSize);

    for (let x = 0; x < rowSize; x++) {
      const a = x >= bpp ? currRow[x - bpp] : 0;
      const b = prevRow[x];
      const c = x >= bpp ? prevRow[x - bpp] : 0;
      let val = currRaw[x];

      if (filter === 1) val = (val + a) & 0xff;
      else if (filter === 2) val = (val + b) & 0xff;
      else if (filter === 3) val = (val + Math.floor((a + b) / 2)) & 0xff;
      else if (filter === 4) {
        const p = a + b - c;
        const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
        let pr = c;
        if (pa <= pb && pa <= pc) pr = a;
        else if (pb <= pc) pr = b;
        val = (val + pr) & 0xff;
      }
      currRow[x] = val;
    }
    currRow.copy(out, y * rowSize);
    prevRow = currRow;
  }
  return { w, h, pixels: out };
}

function savePng(w, h, rgbaBuf, outputPath) {
  const rawScanlines = Buffer.alloc(h * (w * 4 + 1));
  for (let y = 0; y < h; y++) {
    rawScanlines[y * (w * 4 + 1)] = 0;
    rgbaBuf.copy(rawScanlines, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4);
  }

  const idatData = zlib.deflateSync(rawScanlines);
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(w, 0);
  ihdrData.writeUInt32BE(h, 4);
  ihdrData[8] = 8;
  ihdrData[9] = 6;
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;
  
  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const typeAndData = Buffer.concat([typeBuf, data]);
    const crc = zlib.crc32(typeAndData);
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc, 0);
    return Buffer.concat([len, typeAndData, crcBuf]);
  }

  const finalPng = Buffer.concat([
    sig,
    makeChunk('IHDR', ihdrData),
    makeChunk('IDAT', idatData),
    makeChunk('IEND', Buffer.alloc(0))
  ]);
  fs.writeFileSync(outputPath, finalPng);
  console.log('Saved', outputPath, 'w:', w, 'h:', h, 'size:', finalPng.length);
}

// Read v2 logo (241x43)
const src = unfilterPNG(fs.readFileSync('public/brand/email-logo-v2.png'));
// Scale 2x to 482x86
const targetW = src.w * 2;
const targetH = src.h * 2;
const scaled = Buffer.alloc(targetW * targetH * 4);

for (let y = 0; y < targetH; y++) {
  const srcY = Math.min(Math.floor(y / 2), src.h - 1);
  for (let x = 0; x < targetW; x++) {
    const srcX = Math.min(Math.floor(x / 2), src.w - 1);
    const srcIdx = (srcY * src.w + srcX) * 4;
    const dstIdx = (y * targetW + x) * 4;
    scaled[dstIdx] = src.pixels[srcIdx];
    scaled[dstIdx + 1] = src.pixels[srcIdx + 1];
    scaled[dstIdx + 2] = src.pixels[srcIdx + 2];
    scaled[dstIdx + 3] = src.pixels[srcIdx + 3];
  }
}

savePng(targetW, targetH, scaled, 'public/brand/email-logo-v3.png');
// Also save as email-logo-2x.png
fs.copyFileSync('public/brand/email-logo-v3.png', 'public/brand/email-logo-2x.png');
console.log('Done 2x logo scaling');

// Run once: node generate-icons.js
// Draws a magnifying glass logo in Scout Orange — no extra dependencies.

const zlib = require('zlib');
const fs   = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'icons');
if (!fs.existsSync(dir)) fs.mkdirSync(dir);

// ── PNG encoder (RGB) ────────────────────────────────────────────────────────

function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let j = 0; j < 8; j++) c = c & 1 ? (c >>> 1) ^ 0xEDB88320 : c >>> 1;
  }
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function pngChunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const tb  = Buffer.from(type);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(Buffer.concat([tb, data])));
  return Buffer.concat([len, tb, data, crc]);
}

function encodePNG(size, pixels) {
  const sig  = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = pngChunk('IHDR', Buffer.from([0,0,0,size, 0,0,0,size, 8, 2, 0, 0, 0]));

  const rows = Buffer.alloc(size * (1 + size * 3));
  for (let y = 0; y < size; y++) {
    rows[y * (1 + size * 3)] = 0;
    for (let x = 0; x < size; x++) {
      const s = (y * size + x) * 3;
      const d = y * (1 + size * 3) + 1 + x * 3;
      rows[d] = pixels[s]; rows[d+1] = pixels[s+1]; rows[d+2] = pixels[s+2];
    }
  }
  return Buffer.concat([sig, ihdr, pngChunk('IDAT', zlib.deflateSync(rows)), pngChunk('IEND', Buffer.alloc(0))]);
}

// ── Math helpers ─────────────────────────────────────────────────────────────

const lerp = (a, b, t) => a + (b - a) * t;

function smoothstep(e0, e1, x) {
  const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
}

const distPt  = (x1, y1, x2, y2) => Math.sqrt((x2-x1)**2 + (y2-y1)**2);

function distSeg(px, py, ax, ay, bx, by) {
  const dx = bx-ax, dy = by-ay, l2 = dx*dx + dy*dy;
  if (l2 === 0) return distPt(px, py, ax, ay);
  const t = Math.max(0, Math.min(1, ((px-ax)*dx + (py-ay)*dy) / l2));
  return distPt(px, py, ax + t*dx, ay + t*dy);
}

// Rounded-rect SDF (signed distance; negative = inside)
function roundedRectSDF(x, y, w, h, r) {
  const qx = Math.abs(x - w/2) - w/2 + r;
  const qy = Math.abs(y - h/2) - h/2 + r;
  return Math.sqrt(Math.max(qx,0)**2 + Math.max(qy,0)**2) + Math.min(Math.max(qx,qy),0) - r;
}

// ── Logo renderer ─────────────────────────────────────────────────────────────
// All design values are in a 128×128 space; scaled by `s = size / 128`.

function renderLogo(size) {
  const pixels = new Uint8Array(size * size * 3);
  const s  = size / 128;
  const aa = Math.max(0.8, 1.5 * s); // anti-alias feather

  // Colors
  const [bgR, bgG, bgB] = [0xFF, 0x72, 0x35]; // Scout Orange
  const [fgR, fgG, fgB] = [0xFF, 0xFF, 0xFF]; // white glass

  // Background rounded square
  const bgR2 = 22 * s;

  // Lens
  const lx = 52 * s, ly = 50 * s;
  const lr = Math.max(4.5 * s, 28 * s);          // lens outer radius
  const lw = Math.max(2,       7   * s);          // ring stroke width

  // Handle — starts at the 45° point of the lens ring, goes to lower-right
  const ang = Math.PI * 0.25;
  const hax = lx + Math.cos(ang) * (lr - lw * 0.3);
  const hay = ly + Math.sin(ang) * (lr - lw * 0.3);
  const hbx = 97 * s, hby = 96 * s;
  const hw  = Math.max(2, 7 * s);                 // handle thickness

  // Cap: filled circle at the end of the handle
  const capR = hw * 0.6;

  // Inner lens shine — subtle highlight at upper-left of lens
  const shx = lx - lr * 0.3, shy = ly - lr * 0.3;
  const shR = lr * 0.2;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 3;

      // Background SDF — negative means inside
      const bgDist = roundedRectSDF(x + 0.5, y + 0.5, size, size, bgR2);
      const bgAlpha = 1 - smoothstep(-aa, aa, bgDist);

      if (bgAlpha < 0.01) {
        // Outside background — fill with white (looks like transparency on most surfaces)
        pixels[idx] = 0xFF; pixels[idx+1] = 0xFF; pixels[idx+2] = 0xFF;
        continue;
      }

      // Start with orange
      let r = bgR, g = bgG, b = bgB;

      // Lens ring
      const cx = x + 0.5, cy = y + 0.5;
      const dRing = Math.abs(distPt(cx, cy, lx, ly) - lr);
      const ringA = 1 - smoothstep(lw/2 - aa, lw/2 + aa, dRing);

      // Handle
      const dHandle = distSeg(cx, cy, hax, hay, hbx, hby);
      const handleA = 1 - smoothstep(hw/2 - aa, hw/2 + aa, dHandle);

      // Round cap at handle end
      const capA = 1 - smoothstep(capR - aa, capR + aa, distPt(cx, cy, hbx, hby));

      // Inner shine (inside lens only)
      const insideLens = distPt(cx, cy, lx, ly) < lr - lw / 2 - 1;
      const shineA = insideLens
        ? (1 - smoothstep(shR - aa, shR + aa, distPt(cx, cy, shx, shy))) * 0.3
        : 0;

      const glassA = Math.min(1, ringA + handleA + capA + shineA);

      // Blend white glass over orange bg, then composite with bg alpha
      const pr = Math.round(lerp(bgR, lerp(r, fgR, glassA), bgAlpha));
      const pg = Math.round(lerp(bgG, lerp(g, fgG, glassA), bgAlpha));
      const pb = Math.round(lerp(bgB, lerp(b, fgB, glassA), bgAlpha));

      pixels[idx] = pr; pixels[idx+1] = pg; pixels[idx+2] = pb;
    }
  }

  return pixels;
}

// ── Generate ─────────────────────────────────────────────────────────────────

for (const size of [16, 48, 128]) {
  const file = path.join(dir, `icon${size}.png`);
  fs.writeFileSync(file, encodePNG(size, renderLogo(size)));
  console.log(`Created ${file}  (${size}×${size})`);
}

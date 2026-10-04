// Bakes the animated layers of the hero illustration into small WebP sprites with
// alpha, so the browser never has to mask a full-frame image at runtime.
// Usage: node scripts/bake-sprites.mjs
import sharp from "sharp";

const SRC = "assets/dudu-hero.png";
const OUT = "public/images/sprites";
const W = 1600;
const H = 1067;

// Same regions the v1 CSS masks used (percent of the illustration).
const DUDU = {
  head: { cx: 39.5, cy: 47, rx: 20, ry: 29, core: 0.7 },
  paw: { cx: 49, cy: 72, rx: 9, ry: 7, core: 0.6 },
};
const BUBU = { cx: 86, cy: 50, rx: 8, ry: 10, core: 0.62 };
const EYES = {
  left: { x: 26.4, y: 46.3, w: 3.6, h: 7.2, dy: 7.3 },
  right: { x: 38.2, y: 47.0, w: 4.5, h: 8.0, dy: 8.2 },
};

const px = (pct, total) => (pct / 100) * total;

function falloff(d, core) {
  if (d <= core) return 1;
  if (d >= 1) return 0;
  return (1 - d) / (1 - core);
}

async function bake({ left, top, width, height, alphaAt, name, scales }) {
  const { data } = await sharp(SRC)
    .extract({ left, top, width, height })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const a = alphaAt(left + x, top + y);
      data[(y * width + x) * 4 + 3] = Math.round(a * 255);
    }
  }
  const base = sharp(data, { raw: { width, height, channels: 4 } });
  for (const [suffix, scale] of scales) {
    const info = await base
      .clone()
      .resize({ width: Math.round(width * scale), kernel: "lanczos3" })
      .webp({ quality: 90, alphaQuality: 100 })
      .toFile(`${OUT}/${name}${suffix}.webp`);
    console.log(`${name}${suffix}`, info.width, "x", info.height, Math.round(info.size / 1024) + "KB");
  }
  return { left, top, width, height };
}

const ellipseAlpha = (e) => (x, y) => {
  const dx = (x - px(e.cx, W)) / px(e.rx, W);
  const dy = (y - px(e.cy, H)) / px(e.ry, H);
  return falloff(Math.hypot(dx, dy), e.core);
};

const boxes = {};

// Dudu
{
  const a = ellipseAlpha(DUDU.head);
  const b = ellipseAlpha(DUDU.paw);
  const x0 = Math.floor(px(DUDU.head.cx - DUDU.head.rx, W));
  const x1 = Math.ceil(px(DUDU.head.cx + DUDU.head.rx, W));
  const y0 = Math.floor(px(DUDU.head.cy - DUDU.head.ry, H));
  const y1 = Math.ceil(px(DUDU.paw.cy + DUDU.paw.ry, H));
  boxes.dudu = await bake({
    left: x0, top: y0, width: x1 - x0, height: y1 - y0,
    alphaAt: (x, y) => Math.max(a(x, y), b(x, y)),
    name: "dudu",
    scales: [["", 1], ["-sm", 0.625]],
  });
}

// Bubu
{
  const x0 = Math.floor(px(BUBU.cx - BUBU.rx, W));
  const x1 = Math.ceil(px(BUBU.cx + BUBU.rx, W));
  const y0 = Math.floor(px(BUBU.cy - BUBU.ry, H));
  const y1 = Math.ceil(px(BUBU.cy + BUBU.ry, H));
  boxes.bubu = await bake({
    left: x0, top: y0, width: x1 - x0, height: y1 - y0,
    alphaAt: ellipseAlpha(BUBU),
    name: "bubu",
    scales: [["", 1], ["-sm", 0.625]],
  });
}

// Eyelids: fur from just above the eye slid down over it, feathered, with a closed-eye arc.
for (const [side, e] of Object.entries(EYES)) {
  // The lid patch is a little bigger than the eye and sits slightly low, so the
  // feather lands on fur and the lower rim of the open eye is fully covered.
  const w = px(e.w, W) * 1.5;
  const h = px(e.h, H) * 1.55;
  const cx = px(e.x + e.w / 2, W);
  const cy = px(e.y + e.h / 2, H) + px(e.h, H) * 0.04;
  const dy = h * 1.02; // sample entirely above the patch, so the open eye never shows through
  const left = Math.round(cx - w / 2);
  const top = Math.round(cy - h / 2 - dy); // sample the fur above
  const width = Math.round(w);
  const height = Math.round(h);
  const rx = width / 2;
  const ry = height / 2;
  const { data } = await sharp(SRC)
    .extract({ left, top, width, height })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  // Colour-match: the fur above an eye is a bit lighter than the fur around it.
  // Compare the median colour of the patch core with a ring just outside the eye
  // (median, so the blush and headphone do not skew it) and apply a per-channel gain.
  const eyeRx = px(e.w, W) / 2;
  const eyeRy = px(e.h, H) / 2;
  const ecx = px(e.x + e.w / 2, W);
  const ecy = px(e.y + e.h / 2, H);
  const ringBox = {
    left: Math.round(ecx - eyeRx * 1.6),
    top: Math.round(ecy - eyeRy * 1.6),
    width: Math.round(eyeRx * 3.2),
    height: Math.round(eyeRy * 3.2),
  };
  const ring = await sharp(SRC).extract(ringBox).removeAlpha().raw().toBuffer();
  const median = (a) => a.sort((m, n) => m - n)[Math.floor(a.length / 2)];
  const ringVals = [[], [], []];
  for (let y = 0; y < ringBox.height; y++) {
    for (let x = 0; x < ringBox.width; x++) {
      const d = Math.hypot((x + 0.5 - ringBox.width / 2) / eyeRx, (y + 0.5 - ringBox.height / 2) / eyeRy);
      if (d >= 1.12 && d <= 1.5) for (let c = 0; c < 3; c++) ringVals[c].push(ring[(y * ringBox.width + x) * 3 + c]);
    }
  }
  const patchVals = [[], [], []];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const d = Math.hypot((x + 0.5 - rx) / rx, (y + 0.5 - ry) / ry);
      if (d < 0.6) for (let c = 0; c < 3; c++) patchVals[c].push(data[(y * width + x) * 4 + c]);
    }
  }
  const gain = [0, 1, 2].map((c) => median(ringVals[c]) / median(patchVals[c]));
  console.log(`eyelid-${side} gain`, gain.map((g) => g.toFixed(3)).join(" "));
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      for (let c = 0; c < 3; c++) data[i + c] = Math.min(255, Math.round(data[i + c] * gain[c]));
      const d = Math.hypot((x + 0.5 - rx) / rx, (y + 0.5 - ry) / ry);
      data[i + 3] = Math.round(falloff(d, 0.78) * 255);
    }
  }
  const stroke = Math.max(3, Math.round(width * 0.075));
  const arc = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
       <path d="M ${width * 0.2} ${height * 0.48} Q ${width * 0.5} ${height * 0.78} ${width * 0.8} ${height * 0.48}"
             fill="none" stroke="#2a1245" stroke-width="${stroke}" stroke-linecap="round"/>
     </svg>`,
  );
  const info = await sharp(data, { raw: { width, height, channels: 4 } })
    .composite([{ input: arc, blend: "over" }])
    .webp({ quality: 92, alphaQuality: 100 })
    .toFile(`${OUT}/eyelid-${side}.webp`);
  boxes[`eye-${side}`] = {
    left: Math.round(cx - w / 2),
    top: Math.round(cy - h / 2),
    width,
    height,
  };
  console.log(`eyelid-${side}`, info.width, "x", info.height, Math.round(info.size / 1024) + "KB");
}

// Positions in percent of the illustration, to paste into src/lib/scene.ts.
const pct = ({ left, top, width, height }) => ({
  x: +((left / W) * 100).toFixed(3),
  y: +((top / H) * 100).toFixed(3),
  w: +((width / W) * 100).toFixed(3),
  h: +((height / H) * 100).toFixed(3),
});
console.log(JSON.stringify(Object.fromEntries(Object.entries(boxes).map(([k, v]) => [k, pct(v)])), null, 2));

// ---------------------------------------------------------------------------
// Angry Bubu. Her sleeping eyes and mouth are painted over with fur that is
// interpolated from the clean fur around them (so no outline or rim light is
// copied in), everything is clipped to her head, then angry eyes, brows, a pout
// and puffed cheeks go on top. Same box as the bubu sprite.
// ---------------------------------------------------------------------------
{
  const L = Math.floor(px(BUBU.cx - BUBU.rx, W));
  const T = Math.floor(px(BUBU.cy - BUBU.ry, H));
  const BW = Math.ceil(px(BUBU.cx + BUBU.rx, W)) - L;
  const BH = Math.ceil(px(BUBU.cy + BUBU.ry, H)) - T;
  const { data: src } = await sharp(SRC)
    .extract({ left: L, top: T, width: BW, height: BH })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const luma = (i) => 0.299 * src[i * 4] + 0.587 * src[i * 4 + 1] + 0.114 * src[i * 4 + 2];

  // Head silhouette: flood fill over fur-bright pixels from a point on her forehead,
  // then a morphological closing so the sleeping eyes (dark notches) are inside it.
  const FUR = 115;
  let head = new Uint8Array(BW * BH);
  {
    const stack = [[108, 80]];
    while (stack.length) {
      const [x, y] = stack.pop();
      if (x < 0 || y < 0 || x >= BW || y >= BH) continue;
      const i = y * BW + x;
      if (head[i] || luma(i) < FUR) continue;
      head[i] = 1;
      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }
  }
  const morph = (m, r, pick) => {
    const pass = (inp, horizontal) => {
      const out = new Uint8Array(BW * BH);
      for (let y = 0; y < BH; y++) {
        for (let x = 0; x < BW; x++) {
          let v = pick === "max" ? 0 : 1;
          for (let k = -r; k <= r; k++) {
            const xx = horizontal ? x + k : x;
            const yy = horizontal ? y : y + k;
            const t = xx < 0 || yy < 0 || xx >= BW || yy >= BH ? 0 : inp[yy * BW + xx];
            v = pick === "max" ? Math.max(v, t) : Math.min(v, t);
          }
          out[y * BW + x] = v;
        }
      }
      return out;
    };
    return pass(pass(m, true), false);
  };
  head = morph(morph(head, 14, "max"), 14, "min"); // closing
  const inner = morph(head, 6, "min"); // fur safely away from the rim
  // soft version of the silhouette for feathering
  const soft = new Float32Array(BW * BH);
  for (let y = 0; y < BH; y++) {
    for (let x = 0; x < BW; x++) {
      let s = 0;
      let n = 0;
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          const xx = x + dx;
          const yy = y + dy;
          s += xx < 0 || yy < 0 || xx >= BW || yy >= BH ? 0 : head[yy * BW + xx];
          n++;
        }
      }
      soft[y * BW + x] = s / n;
    }
  }

  const out = Buffer.alloc(BW * BH * 4); // transparent
  const over = (i, rgb, a) => {
    const a0 = out[i + 3] / 255;
    const ao = a + a0 * (1 - a);
    if (ao <= 0) return;
    for (let c = 0; c < 3; c++) out[i + c] = Math.round((rgb[c] * a + out[i + c] * a0 * (1 - a)) / ao);
    out[i + 3] = Math.round(ao * 255);
  };

  // Sleeping eyes and mouth, in sprite pixels.
  const patches = [
    { cx: 79, cy: 94, rx: 25, ry: 21 },
    { cx: 138, cy: 118, rx: 25, ry: 21 },
    { cx: 102, cy: 111, rx: 21, ry: 12 },
  ];
  for (const pt of patches) {
    // clean fur samples just outside the patch, inside the head and clear of the rim
    const pts = [];
    for (let y = 0; y < BH; y += 2) {
      for (let x = 0; x < BW; x += 2) {
        const i = y * BW + x;
        const d = Math.hypot((x - pt.cx) / pt.rx, (y - pt.cy) / pt.ry);
        if (d >= 1.05 && d <= 1.7 && inner[i] && luma(i) >= 135) pts.push([x, y, src[i * 4], src[i * 4 + 1], src[i * 4 + 2]]);
      }
    }
    if (!pts.length) continue;
    for (let y = 0; y < BH; y++) {
      for (let x = 0; x < BW; x++) {
        const d = Math.hypot((x - pt.cx) / pt.rx, (y - pt.cy) / pt.ry);
        if (d >= 1) continue;
        // keep the original blush: pink pixels are not painted over
        const si = (y * BW + x) * 4;
        const pink = Math.min(1, Math.max(0, (src[si] - src[si + 1] - 35) / 40));
        const a = falloff(d, 0.82) * soft[y * BW + x] * (1 - pink);
        if (a <= 0) continue;
        let wsum = 0;
        const rgb = [0, 0, 0];
        for (const q of pts) {
          const w = 1 / ((x - q[0]) ** 2 + (y - q[1]) ** 2 + 1);
          wsum += w;
          for (let c = 0; c < 3; c++) rgb[c] += q[2 + c] * w;
        }
        over((y * BW + x) * 4, rgb.map((v) => v / wsum), a);
      }
    }
  }

  // Puffed cheeks, clipped to the head so no pink spills onto the blanket.
  const cheeks = [
    { cx: 61, cy: 102, rx: 21, ry: 17 },
    { cx: 146, cy: 139, rx: 23, ry: 18 },
  ];
  for (const ch of cheeks) {
    for (let y = 0; y < BH; y++) {
      for (let x = 0; x < BW; x++) {
        const d = Math.hypot((x - ch.cx) / ch.rx, (y - ch.cy) / ch.ry);
        if (d >= 1) continue;
        const a = (0.8 * (1 - d * d * 0.5) * (1 - d ** 4)) * soft[y * BW + x];
        if (a > 0) over((y * BW + x) * 4, [255, 143, 168], a);
      }
    }
  }

  const ink = "#2b1730";
  const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${BW}" height="${BH}">
    <g transform="translate(108.5 106) rotate(22.2)" stroke-linecap="round" stroke-linejoin="round">
      <ellipse cx="-30.9" cy="0" rx="7.4" ry="9" fill="${ink}"/>
      <circle cx="-32.8" cy="-3.2" r="2.6" fill="#fff"/><circle cx="-28.6" cy="3.4" r="1.2" fill="#fff" opacity=".8"/>
      <ellipse cx="30.9" cy="0" rx="7.4" ry="9" fill="${ink}"/>
      <circle cx="29" cy="-3.2" r="2.6" fill="#fff"/><circle cx="33.2" cy="3.4" r="1.2" fill="#fff" opacity=".8"/>
      <path d="M-47 -15 L-19 -9.5" stroke="${ink}" stroke-width="4.6" fill="none"/>
      <path d="M19 -8 L45 -30" stroke="${ink}" stroke-width="4.6" fill="none"/>
      <path d="M-9.6 9.6 Q-4.1 3.4 1.4 9.6" stroke="${ink}" stroke-width="3" fill="none"/>
    </g>
  </svg>`);
  const info = await sharp(out, { raw: { width: BW, height: BH, channels: 4 } })
    .composite([{ input: svg, blend: "over" }])
    .webp({ quality: 92, alphaQuality: 100 })
    .toFile(`${OUT}/bubu-angry.webp`);
  console.log("bubu-angry", info.width, "x", info.height, Math.round(info.size / 1024) + "KB");
}

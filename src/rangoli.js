// A rangoli "poured" from coloured powder, grain by grain, centre outwards — like it is being drawn by hand.

const TAU = Math.PI * 2;
const rnd = (a, b) => a + Math.random() * (b - a);

function jitter(hex, j = 18) {
  const n = parseInt(hex.slice(1), 16);
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => Math.max(0, Math.min(255, v + rnd(-j, j))));
  return `rgb(${c[0] | 0},${c[1] | 0},${c[2] | 0})`;
}

// point inside a petal (pointed ellipse) centred at (cx,cy), rotated by a
function inPetal(px, py, len, wid) {
  // petal: |y| along axis 0..len, width tapers at both ends
  if (py < 0 || py > len) return false;
  const t = py / len; const half = wid * Math.sin(Math.PI * Math.pow(t, 0.85)) * 0.5;
  return Math.abs(px) <= half;
}

function buildShapes(R) {
  const S = []; // each: {grains:[[x,y,r,col]], order}
  const petalRing = (n, r0, len, wid, col, edge, order, off = 0) => {
    for (let k = 0; k < n; k++) {
      const a = (k / n) * TAU + off; const g = [];
      const area = len * wid * 0.7; const count = Math.round(area * 1.25);
      for (let i = 0; i < count; i++) {
        const px = rnd(-wid / 2, wid / 2); const py = rnd(0, len);
        if (!inPetal(px, py, len, wid)) { i--; continue; }
        const x = Math.cos(a) * (r0 + py) - Math.sin(a) * px; const y = Math.sin(a) * (r0 + py) + Math.cos(a) * px;
        g.push([x, y, rnd(0.5, 1.25), jitter(col), py]);
      }
      // crisp powder outline traced along the petal edge
      for (let i = 0; i <= 120; i++) {
        const t = i / 120; const py = t * len; const half = wid * Math.sin(Math.PI * Math.pow(t, 0.85)) * 0.5;
        for (const s of [-1, 1]) {
          const px = s * half + rnd(-0.6, 0.6);
          const x = Math.cos(a) * (r0 + py) - Math.sin(a) * px; const y = Math.sin(a) * (r0 + py) + Math.cos(a) * px;
          g.push([x, y, rnd(0.6, 1.2), jitter(edge, 10), py]);
        }
      }
      g.sort((p, q) => p[4] - q[4]);
      S.push({ g, order: order + k * 0.02 });
    }
  };
  const dotRing = (n, r, rad, col, order) => {
    for (let k = 0; k < n; k++) {
      const a = (k / n) * TAU; const cx = Math.cos(a) * r; const cy = Math.sin(a) * r; const g = [];
      for (let i = 0; i < rad * rad * 3.2; i++) { const rr = Math.sqrt(Math.random()) * rad; const aa = rnd(0, TAU); g.push([cx + Math.cos(aa) * rr, cy + Math.sin(aa) * rr, rnd(0.5, 1.1), jitter(col)]); }
      S.push({ g, order: order + k * 0.01 });
    }
  };
  const lineRing = (r, col, order, dashed) => {
    const g = []; const n = Math.round(TAU * r * 3);
    for (let i = 0; i < n; i++) { const a = (i / n) * TAU; if (dashed && Math.floor(a * r / 6) % 2) continue; const rr = r + rnd(-0.9, 0.9); g.push([Math.cos(a) * rr, Math.sin(a) * rr, rnd(0.55, 1.1), jitter(col, 8), a]); }
    S.push({ g, order });
  };
  const k = R / 200;
  lineRing(64 * k, '#ffffff', 0, false);
  petalRing(8, 66 * k, 46 * k, 28 * k, '#c8102e', '#ffffff', 1);
  petalRing(8, 70 * k, 30 * k, 14 * k, '#ffcf3a', '#ffffff', 1.4, TAU / 16);
  lineRing(116 * k, '#ffffff', 2, false);
  petalRing(16, 118 * k, 40 * k, 22 * k, '#f07a10', '#ffffff', 3);
  petalRing(16, 122 * k, 22 * k, 9 * k, '#2f7d3a', '#ffffff', 3.6, TAU / 32);
  lineRing(160 * k, '#ffffff', 4, false);
  petalRing(24, 162 * k, 26 * k, 15 * k, '#ffc21a', '#e05a00', 5);
  dotRing(48, 194 * k, 3.2 * k, '#ffffff', 6);
  // stray grains spilled around, as with real powder
  const spill = []; for (let i = 0; i < 900; i++) { const a = rnd(0, TAU); const r = rnd(60, 200) * k; spill.push([Math.cos(a) * r, Math.sin(a) * r, rnd(0.4, 0.8), jitter(['#c8102e', '#f07a10', '#ffc21a', '#ffffff'][i % 4])]); }
  S.push({ g: spill, order: 7, faint: true });
  return S.sort((a, b) => a.order - b.order);
}

export function mountRangoli(canvas, { reduce = false } = {}) {
  const ctx = canvas.getContext('2d');
  let shapes = null; let drawn = false;
  const setup = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2); const css = canvas.clientWidth || 360;
    canvas.width = css * dpr; canvas.height = css * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    shapes = buildShapes(css / 2 - 4);
    return css;
  };
  const floor = (css) => {
    // a swept red-oxide floor patch with a soft, uneven edge — powder pops on it like real muggu
    const c = css / 2; const g = ctx.createRadialGradient(c, c, css * 0.1, c, c, css * 0.5);
    g.addColorStop(0, '#9b4a32'); g.addColorStop(0.82, '#8a3c27'); g.addColorStop(0.97, 'rgba(138,60,39,.35)'); g.addColorStop(1, 'rgba(138,60,39,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(c, c, css * 0.5, 0, TAU); ctx.fill();
    for (let i = 0; i < 2600; i++) { const a = rnd(0, TAU); const r = Math.sqrt(Math.random()) * css * 0.47; ctx.globalAlpha = rnd(0.05, 0.16); ctx.fillStyle = Math.random() < 0.5 ? '#3d140a' : '#d59a7c'; ctx.fillRect(c + Math.cos(a) * r, c + Math.sin(a) * r, rnd(1, 2.4), rnd(1, 2.4)); }
    ctx.globalAlpha = 1;
  };
  const paint = (all) => {
    const css = setup(); const c = css / 2;
    ctx.clearRect(0, 0, css, css); floor(css);
    if (all) { for (const s of shapes) for (const p of s.g) dot(c, p, s.faint); return; }
    // pour shape after shape, each one grain-run at a time
    const queue = shapes.flatMap((s) => s.g.map((p) => [p, s.faint]));
    const total = queue.length; const dur = 5200; let i = 0; const t0 = performance.now();
    const ease = (x) => 1 - Math.pow(1 - x, 1.6);
    const frame = (now) => {
      const upto = Math.floor(ease(Math.min(1, (now - t0) / dur)) * total);
      for (; i < upto; i++) dot(c, queue[i][0], queue[i][1]);
      if (i < total) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  };
  function dot(c, p, faint) {
    ctx.globalAlpha = faint ? 0.35 : rnd(0.75, 1);
    ctx.fillStyle = p[3]; ctx.beginPath(); ctx.arc(c + p[0], c + p[1], p[2], 0, TAU); ctx.fill();
  }
  return {
    draw() { if (drawn) return; drawn = true; paint(reduce); },
    still() { drawn = true; paint(true); },
  };
}

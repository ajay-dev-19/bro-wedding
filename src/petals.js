// Realistic falling petals: pre-rendered shaded petal sprites, 3D tumble, depth layers, soft wind.

const TAU = Math.PI * 2;

function rosePetal(c, w, h, base, edge) {
  const g = c.createRadialGradient(w * 0.5, h * 0.95, 2, w * 0.5, h * 0.55, h * 0.75);
  g.addColorStop(0, base); g.addColorStop(0.55, edge); g.addColorStop(1, base);
  c.fillStyle = g;
  c.beginPath();
  c.moveTo(w * 0.5, h * 0.98);
  c.bezierCurveTo(w * 0.05, h * 0.75, w * 0.0, h * 0.25, w * 0.28, h * 0.06);
  c.bezierCurveTo(w * 0.42, h * 0.0, w * 0.48, h * 0.1, w * 0.5, h * 0.08);
  c.bezierCurveTo(w * 0.52, h * 0.1, w * 0.58, h * 0.0, w * 0.72, h * 0.06);
  c.bezierCurveTo(w * 1.0, h * 0.25, w * 0.95, h * 0.75, w * 0.5, h * 0.98);
  c.fill();
  // soft veins + curled edge highlight
  c.globalAlpha = 0.18; c.strokeStyle = '#fff'; c.lineWidth = 0.8;
  for (let i = -2; i <= 2; i++) { c.beginPath(); c.moveTo(w * 0.5, h * 0.95); c.quadraticCurveTo(w * (0.5 + i * 0.08), h * 0.5, w * (0.5 + i * 0.13), h * 0.12); c.stroke(); }
  c.globalAlpha = 0.35; c.strokeStyle = 'rgba(255,255,255,.7)'; c.lineWidth = 1.2;
  c.beginPath(); c.moveTo(w * 0.2, h * 0.12); c.bezierCurveTo(w * 0.35, h * 0.02, w * 0.45, h * 0.1, w * 0.5, h * 0.09); c.stroke();
  c.globalAlpha = 1;
}

function marigoldPetal(c, w, h, base, tip) {
  const g = c.createLinearGradient(0, h, 0, 0);
  g.addColorStop(0, base); g.addColorStop(1, tip);
  c.fillStyle = g;
  c.beginPath();
  c.moveTo(w * 0.42, h);
  c.bezierCurveTo(w * 0.1, h * 0.7, w * 0.02, h * 0.3, w * 0.08, h * 0.12);
  // ruffled top edge
  const n = 5;
  for (let i = 0; i < n; i++) {
    const x0 = w * (0.08 + (0.84 * i) / n); const x1 = w * (0.08 + (0.84 * (i + 1)) / n);
    c.quadraticCurveTo((x0 + x1) / 2, i % 2 ? h * 0.0 : h * 0.08, x1, h * 0.1);
  }
  c.bezierCurveTo(w * 0.98, h * 0.3, w * 0.9, h * 0.7, w * 0.58, h);
  c.closePath(); c.fill();
  c.globalAlpha = 0.25; c.strokeStyle = '#7a3000'; c.lineWidth = 0.7;
  for (let i = 0; i < 4; i++) { c.beginPath(); c.moveTo(w * 0.5, h * 0.95); c.lineTo(w * (0.22 + i * 0.19), h * 0.18); c.stroke(); }
  c.globalAlpha = 1;
}

function sprite(kind, colors, blur) {
  const s = 64; const cv = document.createElement('canvas'); cv.width = s; cv.height = s;
  const c = cv.getContext('2d');
  if (blur) c.filter = `blur(${blur}px)`;
  c.translate(8, 6);
  if (kind === 'rose') rosePetal(c, 48, 52, colors[0], colors[1]); else marigoldPetal(c, 40, 50, colors[0], colors[1]);
  return cv;
}

const PALETTE = [
  ['rose', ['#8e0f22', '#d3324a']], ['rose', ['#a8173a', '#e8577a']], ['rose', ['#b0102a', '#e0423e']],
  ['mari', ['#d9620c', '#ffa62b']], ['mari', ['#e88a00', '#ffd04a']], ['mari', ['#c84d08', '#ff8a1e']],
];

export function createPetals(canvas, { reduce = false } = {}) {
  const ctx = canvas.getContext('2d');
  const sharp = PALETTE.map(([k, c]) => sprite(k, c, 0));
  const soft = PALETTE.map(([k, c]) => sprite(k, c, 2.2));
  let W = 0, H = 0, dpr = 1, list = [], target = 0, running = false, last = 0, t = 0, wind = 0, gust = 0;

  const size = () => { dpr = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight; canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
  const spawn = (y) => {
    const z = 0.45 + Math.random() * 0.85; // depth: small & slow far away, big & quick up close
    const i = Math.floor(Math.random() * PALETTE.length);
    return {
      x: Math.random() * W, y: y ?? -40 - Math.random() * 60, z, i,
      img: z > 1.15 || z < 0.6 ? soft[i] : sharp[i],
      size: (14 + Math.random() * 10) * z,
      vy: (22 + Math.random() * 16) * z,          // px per second
      rot: Math.random() * TAU, vrot: (Math.random() - 0.5) * 1.2,
      flip: Math.random() * TAU, vflip: 1.4 + Math.random() * 2.2,
      sw: Math.random() * TAU, vsw: 0.6 + Math.random() * 0.8, amp: 18 + Math.random() * 26,
    };
  };
  const step = (now) => {
    if (!running) return;
    const dt = Math.min(0.05, (now - (last || now)) / 1000); last = now; t += dt;
    // slow drifting breeze + occasional gusts
    wind = Math.sin(t * 0.23) * 10 + Math.sin(t * 0.07 + 1) * 6 + gust; gust *= 0.985;
    while (list.length < target) list.push(spawn());
    ctx.clearRect(0, 0, W, H);
    list.sort((a, b) => a.z - b.z);
    for (const p of list) {
      p.sw += p.vsw * dt; p.flip += p.vflip * dt; p.rot += p.vrot * dt;
      const flutter = Math.cos(p.flip);
      p.y += p.vy * dt * (0.75 + 0.35 * Math.abs(flutter));      // falls faster edge-on
      p.x += (Math.sin(p.sw) * p.amp * 0.9 + wind) * dt * p.z;
      const sx = 0.35 + 0.65 * Math.abs(flutter);
      ctx.save();
      ctx.translate(p.x, p.y); ctx.rotate(p.rot + Math.sin(p.sw) * 0.4); ctx.scale(sx, 1);
      ctx.globalAlpha = Math.min(1, 0.55 + 0.45 * p.z) * (flutter < 0 ? 0.82 : 1);   // back side a touch darker
      ctx.drawImage(p.img, -p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    }
    list = list.filter((p) => p.y < H + 50 && p.x > -80 && p.x < W + 80);
    requestAnimationFrame(step);
  };
  const start = () => { if (reduce || running) return; size(); running = true; last = 0; requestAnimationFrame(step); };

  addEventListener('resize', () => running && size());
  document.addEventListener('visibilitychange', () => { if (document.hidden) running = false; else if (!reduce && target) { running = true; last = 0; requestAnimationFrame(step); } });

  return {
    start,
    ambient(n) { target = n; start(); },
    // a gentle shower from above (no explosions)
    shower(n = 40, over = 2.5) {
      if (reduce) return; start();
      for (let i = 0; i < n; i++) setTimeout(() => list.push(spawn(-30 - Math.random() * 40)), (i / n) * over * 1000);
    },
    gust(v = 40) { gust += v; },
  };
}

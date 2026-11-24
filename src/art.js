// Hand-built SVG decorations: toran, rangoli, diya, lotus divider, kalash.

export function toran(n = 13) {
  // realistic marigold + mango-leaf toran; strands swing on their own (see main.js)
  const w = 1000; const step = w / (n - 1);
  const rope = (x) => 10 + Math.sin((x / w) * Math.PI) * 26;
  let s = `<svg class="toran-svg" viewBox="0 0 ${w} 190" preserveAspectRatio="xMidYMin slice" aria-hidden="true">
  <defs>
    <radialGradient id="mgO" cx=".38" cy=".32" r=".75"><stop offset="0" stop-color="#ffc04a"/><stop offset=".55" stop-color="#f0780c"/><stop offset="1" stop-color="#a83e04"/></radialGradient>
    <radialGradient id="mgY" cx=".38" cy=".32" r=".75"><stop offset="0" stop-color="#ffe680"/><stop offset=".55" stop-color="#f6b412"/><stop offset="1" stop-color="#b06d02"/></radialGradient>
    <linearGradient id="lf" x1="0" x2="1"><stop offset="0" stop-color="#2f5f18"/><stop offset=".5" stop-color="#5d9a2e"/><stop offset="1" stop-color="#2a5214"/></linearGradient>
    <symbol id="mgo" viewBox="-14 -14 28 28"><circle r="12.5" fill="url(#mgO)"/>${frills('#ffb43a', '#c75406')}<circle r="12.5" fill="url(#shade)"/></symbol>
    <symbol id="mgy" viewBox="-14 -14 28 28"><circle r="12.5" fill="url(#mgY)"/>${frills('#ffe27a', '#c98a04')}<circle r="12.5" fill="url(#shade)"/></symbol>
    <radialGradient id="shade" cx=".35" cy=".3" r=".8"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#3a1000" stop-opacity=".45"/></radialGradient>
    <symbol id="leaf" viewBox="-12 0 24 80"><path d="M0 0 C-11 14 -10 52 0 80 C10 52 11 14 0 0Z" fill="url(#lf)"/>
      <path d="M0 3 V76" stroke="#c9e29a" stroke-opacity=".55" stroke-width="1"/>
      <g stroke="#1f3f0e" stroke-opacity=".35" stroke-width=".6" fill="none">${[16, 26, 36, 46, 56].map((y) => `<path d="M0 ${y} L-6 ${y - 7} M0 ${y} L6 ${y - 7}"/>`).join('')}</g>
      <path d="M-4 10 C-7 24 -6 40 -2 58" stroke="#fff" stroke-opacity=".18" stroke-width="2" fill="none"/></symbol>
  </defs>
  <path d="M-10 ${rope(0)} Q${w / 2} ${rope(w / 2) * 2 - 10} ${w + 10} ${rope(w)}" fill="none" stroke="#6b3c10" stroke-width="3.5"/>
  <path d="M-10 ${rope(0) - 1} Q${w / 2} ${rope(w / 2) * 2 - 11} ${w + 10} ${rope(w) - 1}" fill="none" stroke="#c48a3a" stroke-width="1" stroke-opacity=".6"/>`;
  for (let i = 0; i < n; i++) {
    const x = i * step; const y = rope(x);
    s += `<g class="strand" data-x="${x}" data-y="${y}">`;
    if (i % 2) {
      // a pair of mango leaves
      s += `<use href="#leaf" x="${x - 18}" y="${y}" width="24" height="84" transform="rotate(14 ${x} ${y})"/>
            <use href="#leaf" x="${x - 6}" y="${y}" width="24" height="84" transform="rotate(-10 ${x} ${y})"/>`;
    } else {
      const len = 4 + (i % 4 === 0 ? 1 : 0);
      s += `<path d="M${x} ${y} V${y + 10 + len * 22}" stroke="#7a4a12" stroke-width="1.3"/>`;
      for (let k = 0; k < len; k++) s += `<use href="${k % 2 ? '#mgy' : '#mgo'}" x="${x - 13}" y="${y + 6 + k * 22}" width="26" height="26" transform="rotate(${(k * 47) % 360} ${x} ${y + 19 + k * 22})"/>`;
      s += `<use href="#leaf" x="${x - 6}" y="${y + 8 + len * 22}" width="12" height="34"/>`;
    }
    s += '</g>';
  }
  return s + '</svg>';
}
function frills(light, dark) {
  let o = '';
  for (let r = 0; r < 3; r++) {
    const n = 10 + r * 4; const rad = 10 - r * 3.2;
    for (let k = 0; k < n; k++) {
      const a = (k / n) * 360 + r * 11;
      o += `<ellipse cx="0" cy="${-rad}" rx="${3.4 - r * 0.6}" ry="${4.6 - r * 0.8}" fill="${k % 2 ? light : dark}" fill-opacity="${0.75 - r * 0.12}" transform="rotate(${a})"/>`;
    }
  }
  return o + '<circle r="2.4" fill="#8a3a02" fill-opacity=".7"/>';
}

export function rangoli() {
  const c = 200; let s = `<svg class="rangoli-svg" viewBox="0 0 400 400" aria-hidden="true"><g class="rg-spin" style="transform-origin:200px 200px">`;
  const ring = (n, r, rx, ry, fill, stroke) => {
    let o = '';
    for (let i = 0; i < n; i++) o += `<ellipse class="rg-p" cx="${c}" cy="${c - r}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${stroke}" stroke-width="2" transform="rotate(${(360 / n) * i} ${c} ${c})"/>`;
    return o;
  };
  s += ring(24, 172, 12, 22, '#f4b41a', '#b86a0a');
  s += ring(16, 138, 16, 30, '#e8731d', '#9a3d06');
  s += ring(12, 98, 16, 30, '#b3261e', '#6a0f12');
  s += ring(8, 62, 14, 26, '#f6dfa0', '#b88a2e');
  s += `<circle class="rg-c" cx="${c}" cy="${c}" r="190" fill="none" stroke="#c69a4a" stroke-width="2" stroke-dasharray="3 7"/>
        <circle class="rg-c" cx="${c}" cy="${c}" r="120" fill="none" stroke="#7a1626" stroke-width="1.5"/>`;
  for (let i = 0; i < 36; i++) s += `<circle cx="${c}" cy="${c - 190}" r="4" fill="#4f7a2a" transform="rotate(${i * 10} ${c} ${c})"/>`;
  s += `</g><circle cx="${c}" cy="${c}" r="58" fill="#fffaf0" stroke="#c69a4a" stroke-width="2"/></svg>`;
  return s;
}

export function diya(cls = '') {
  return `<svg class="diya-svg ${cls}" viewBox="0 0 60 70" aria-hidden="true">
    <ellipse cx="30" cy="30" rx="18" ry="22" fill="url(#glow)" class="halo"/>
    <path class="flame" d="M30 8C37 20 37 30 30 36C23 30 23 20 30 8Z" fill="#ffb21e"/>
    <path class="flame" d="M30 18C33 24 33 29 30 32C27 29 27 24 30 18Z" fill="#fff3c4"/>
    <path d="M4 40h52c-4 16-14 24-26 24S8 56 4 40z" fill="#b8541e"/>
    <path d="M4 40h52" stroke="#f6dfa0" stroke-width="3"/>
    <path d="M14 50h32" stroke="#f6dfa0" stroke-width="1.5" stroke-dasharray="2 4"/>
    <defs><radialGradient id="glow"><stop offset="0" stop-color="#ffd76a" stop-opacity=".8"/><stop offset="1" stop-color="#ffd76a" stop-opacity="0"/></radialGradient></defs>
  </svg>`;
}

export function lotusRule() {
  return `<svg class="lotus-rule" viewBox="0 0 240 40" aria-hidden="true"><g fill="none" stroke="#c69a4a" stroke-width="1.4">
    <path d="M0 26 H84 M156 26 H240"/><path d="M120 6 C110 16 110 26 120 32 C130 26 130 16 120 6Z"/>
    <path d="M120 32 C104 30 96 22 94 14 C104 16 114 22 120 32Z"/><path d="M120 32 C136 30 144 22 146 14 C136 16 126 22 120 32Z"/>
    <path d="M120 32 C100 34 88 30 82 24 C96 22 110 26 120 32Z"/><path d="M120 32 C140 34 152 30 158 24 C144 22 130 26 120 32Z"/></g>
    <circle cx="120" cy="26" r="2" fill="#c69a4a"/></svg>`;
}

export function kalash() {
  return `<svg class="kalash" viewBox="0 0 120 140" aria-hidden="true">
    <path d="M60 4c-9 8-12 16-6 24h12c6-8 3-16-6-24z" fill="#e8731d"/>
    <g fill="#4f7a2a"><path d="M54 30c-14-6-28-4-36 4 12 4 26 4 36-4z"/><path d="M66 30c14-6 28-4 36 4-12 4-26 4-36-4z"/><path d="M58 30c-8-10-20-14-30-12 6 8 18 12 30 12z"/><path d="M62 30c8-10 20-14 30-12-6 8-18 12-30 12z"/></g>
    <circle cx="60" cy="30" r="12" fill="#c69a4a"/><path d="M48 26 Q60 20 72 26" stroke="#7a4a12" stroke-width="2" fill="none"/>
    <path d="M40 44h40l-4 8c18 6 26 24 22 44-4 20-24 34-38 34S26 116 22 96c-4-20 4-38 22-44z" fill="#c69a4a"/>
    <path d="M30 80h60M26 96h68" stroke="#7a1626" stroke-width="3"/>
    <text x="60" y="122" text-anchor="middle" font-size="16" fill="#7a1626" font-family="serif">ॐ</text>
  </svg>`;
}

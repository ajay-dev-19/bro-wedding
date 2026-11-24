// Hand-built SVG decorations: toran, rangoli, diya, lotus divider, kalash.

export function toran(n = 13) {
  const w = 1000; const step = w / (n - 1);
  let s = `<svg class="toran-svg" viewBox="0 0 ${w} 150" preserveAspectRatio="none" aria-hidden="true">
  <path d="M0 14 Q${w / 2} 44 ${w} 14" fill="none" stroke="#7a4a12" stroke-width="3"/>`;
  for (let i = 0; i < n; i++) {
    const x = i * step; const y = 14 + Math.sin((i / (n - 1)) * Math.PI) * 30 * 0.98;
    const len = i % 2 ? 70 : 96;
    s += `<g class="sway" style="transform-origin:${x}px ${y}px;animation-delay:${(i % 4) * -0.7}s">`;
    if (i % 2) {
      // mango leaf
      s += `<path d="M${x} ${y} C${x - 18} ${y + 30} ${x - 12} ${y + len - 10} ${x} ${y + len} C${x + 12} ${y + len - 10} ${x + 18} ${y + 30} ${x} ${y}Z" fill="#4f7a2a"/>
            <path d="M${x} ${y + 4} L${x} ${y + len - 6}" stroke="#2f4f16" stroke-width="1.5"/>`;
    } else {
      // marigold string
      s += `<path d="M${x} ${y} V${y + len}" stroke="#7a4a12" stroke-width="1.5"/>`;
      for (let k = 0; k < 4; k++) {
        const cy = y + 18 + k * 20; const c = k % 2 ? '#f4b41a' : '#e8731d';
        s += `<circle cx="${x}" cy="${cy}" r="10" fill="${c}"/><circle cx="${x}" cy="${cy}" r="10" fill="url(#mg)" opacity=".55"/>`;
      }
      s += `<path d="M${x - 5} ${y + len} l5 10 5 -10z" fill="#b3261e"/>`;
    }
    s += '</g>';
  }
  s += `<defs><radialGradient id="mg"><stop offset="0" stop-color="#fff3b0"/><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#7a3000" stop-opacity=".5"/></radialGradient></defs></svg>`;
  return s;
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

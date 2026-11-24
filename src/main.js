import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { events, rituals, muhurtham, phones } from './data.js';

gsap.registerPlugin(ScrollTrigger);

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ------------------------------------------------------------------ content */
const icon = {
  pin: '<svg viewBox="0 0 24 24"><path d="M12 21s-7-6.5-7-12a7 7 0 0114 0c0 5.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>',
  cal: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
  tel: '<svg viewBox="0 0 24 24"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2"/></svg>',
};

$('#timeline').innerHTML = '<div class="spine"><i></i></div>' + events.map((e) => {
  if (e.done) {
    return `<div class="ev done"><span class="dot"></span><div class="card">
      <p class="tel">${esc(e.te)}</p><h3>${esc(e.name)}</h3><p class="when">${esc(e.day)}</p><span class="badge">Blessed &amp; done</span></div></div>`;
  }
  const map = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(e.map);
  const cal = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent(`${e.name} · Srinivas Teja & Srilekha`) +
    `&dates=${e.start}/${e.end}&ctz=Asia/Kolkata&location=` + encodeURIComponent(e.venue);
  return `<div class="ev${e.main ? ' main' : ''}"><span class="dot"></span><div class="card">
    <p class="tel">${esc(e.te)}</p><h3>${esc(e.name)}</h3><p class="when">${esc(e.day)}</p>
    <p class="meta"><b>${esc(e.time)}</b>${e.lunch ? ` · Lunch ${esc(e.lunch)}` : ''}<br>${esc(e.venue)}</p>
    <div class="btns"><a class="btn fill" href="${map}" target="_blank" rel="noopener">${icon.pin}Directions</a>
    <a class="btn" href="${cal}" target="_blank" rel="noopener">${icon.cal}Save date</a></div></div></div>`;
}).join('');

$('#ritTrack').innerHTML = rituals.map((r, i) => `<article class="rit"><p class="n">${String(i + 1).padStart(2, '0')} / ${String(rituals.length).padStart(2, '0')}</p>
  <h3>${esc(r[0])}</h3><p class="en">${esc(r[1])}</p><p>${esc(r[2])}</p></article>`).join('');

$('#phones').innerHTML = phones.map((p, i) => `<a class="btn${i ? '' : ' fill'}" href="tel:+91${p}">${icon.tel}${p.slice(0, 5)} ${p.slice(5)}</a>`).join('');

// mandala behind the monogram
let m = '';
for (let i = 0; i < 24; i++) m += `<ellipse cx="100" cy="18" rx="5" ry="13" fill="none" stroke="#c99a45" stroke-width="1" transform="rotate(${i * 15} 100 100)"/>`;
for (let i = 0; i < 48; i++) m += `<circle cx="100" cy="5" r="1.6" fill="#c99a45" transform="rotate(${i * 7.5} 100 100)"/>`;
$('#mandala').innerHTML = m + '<circle cx="100" cy="100" r="62" fill="none" stroke="#c99a45" stroke-width="1"/><circle cx="100" cy="100" r="56" fill="none" stroke="#c99a45" stroke-width=".6" stroke-dasharray="2 4"/>';

// split text into letters / lines
$$('[data-split]').forEach((el) => {
  el.setAttribute('aria-label', el.textContent);
  el.innerHTML = [...el.textContent].map((c) => `<span class="ch" aria-hidden="true">${c === ' ' ? '&nbsp;' : esc(c)}</span>`).join('');
});
$$('[data-lines]').forEach((el) => {
  el.innerHTML = el.textContent.trim().split('\n').map((l) => `<span class="line">${esc(l.trim())}</span>`).join('');
});

/* ------------------------------------------------------------------ countdown */
const pad = (n) => String(n);
const tick = () => {
  const s = Math.max(0, Math.floor((muhurtham - Date.now()) / 1000));
  $('#cdD').textContent = pad(Math.floor(s / 86400));
  $('#cdH').textContent = pad(Math.floor((s % 86400) / 3600));
  $('#cdM').textContent = pad(Math.floor((s % 3600) / 60));
  $('#cdS').textContent = pad(s % 60);
};
tick(); setInterval(tick, 1000);

/* ------------------------------------------------------------------ gold dust */
const cv = $('#dust'); const cx = cv.getContext('2d');
let W, H, dots = [], dustOn = false;
const size = () => { const r = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight; cv.width = W * r; cv.height = H * r; cx.setTransform(r, 0, 0, r, 0, 0); };
const mk = (y) => ({ x: Math.random() * W, y: y ?? H + 10, r: 0.5 + Math.random() * 1.8, v: 0.15 + Math.random() * 0.5, w: Math.random() * 6.3, a: 0.25 + Math.random() * 0.55 });
const draw = () => {
  if (!dustOn) return;
  cx.clearRect(0, 0, W, H);
  for (const d of dots) {
    d.y -= d.v; d.w += 0.015; d.x += Math.sin(d.w) * 0.35;
    if (d.y < -10) Object.assign(d, mk());
    const g = cx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r * 4);
    g.addColorStop(0, `rgba(255,236,170,${d.a})`); g.addColorStop(1, 'rgba(255,236,170,0)');
    cx.fillStyle = g; cx.beginPath(); cx.arc(d.x, d.y, d.r * 4, 0, 6.29); cx.fill();
  }
  requestAnimationFrame(draw);
};
const startDust = () => { if (reduce || dustOn) return; size(); dots = Array.from({ length: Math.min(60, Math.round(W / 9)) }, () => mk(Math.random() * H)); dustOn = true; draw(); };
addEventListener('resize', () => dustOn && size());

/* ------------------------------------------------------------------ music (optional file at public/audio/music.mp3) */
const bgm = $('#bgm'); const mBtn = $('#music');
let hasMusic = false;
fetch(bgm.src, { method: 'HEAD' }).then((r) => { if (r.ok && (r.headers.get('content-type') || '').includes('audio')) { hasMusic = true; } }).catch(() => {});
const playMusic = () => { if (!hasMusic) return; bgm.volume = 0.6; bgm.play().then(() => { mBtn.hidden = false; mBtn.classList.add('on'); mBtn.setAttribute('aria-label', 'Pause music'); }).catch(() => { mBtn.hidden = false; }); };
mBtn.addEventListener('click', () => {
  if (bgm.paused) { bgm.play().catch(() => {}); mBtn.classList.add('on'); mBtn.setAttribute('aria-label', 'Pause music'); }
  else { bgm.pause(); mBtn.classList.remove('on'); mBtn.setAttribute('aria-label', 'Play music'); }
});

/* ------------------------------------------------------------------ intro */
const env = $('#envelope'); const temple = $('#temple');
gsap.set(['.stage', '.seal'], { xPercent: -50, yPercent: -50, x: 0, y: 0 });
gsap.set(temple, { autoAlpha: 0 });
gsap.set('.seal', { scale: 0.6, autoAlpha: 0 });
gsap.timeline({ delay: 0.3 })
  .from('#envelope .stage', { scale: 1.08, duration: 2.4, ease: 'power2.out' })
  .to('.seal', { scale: 1, autoAlpha: 1, duration: 1.1, ease: 'back.out(1.6)' }, 0.6)
  .from('.env-hint', { autoAlpha: 0, y: 10, duration: 0.8 }, 1.4);
// soft idle pulse on the seal
const sealPulse = gsap.to('.seal', { scale: 1.04, duration: 1.4, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.8 });

let finished = false;
const showSite = () => {
  if (finished) return; finished = true;
  document.body.classList.remove('is-locked');
  env.remove();
  gsap.to(temple, { autoAlpha: 0, duration: reduce ? 0 : 1.2, ease: 'power1.out', onComplete: () => temple.remove() });
  startDust();
  heroIn();
  ScrollTrigger.refresh();
};

const openTemple = () => {
  gsap.set(temple, { autoAlpha: 1 });
  const diyas = $$('.diya');
  diyas.forEach((d) => gsap.to(d, { opacity: () => 0.55 + Math.random() * 0.45, scale: () => 0.9 + Math.random() * 0.25, duration: () => 0.12 + Math.random() * 0.2, repeat: -1, yoyo: true, repeatRefresh: true, ease: 'none' }));
  const tl = gsap.timeline({ onComplete: showSite });
  tl.from('#templeStage', { scale: 1.12, duration: 4.6, ease: 'power2.out' }, 0)
    .to('.flash', { opacity: 0, duration: 1.6, ease: 'power2.out' }, 0)
    .to('.temple-bless', { opacity: 1, y: 0, duration: 1.4, ease: 'power2.out' }, 0.7)
    .to('.skip', { opacity: 1, duration: 0.6 }, 1)
    // doors creak open slowly
    .to('.leaf-l', { rotateY: -104, duration: 3.6, ease: 'power2.inOut' }, 2.0)
    .to('.leaf-r', { rotateY: 104, duration: 3.6, ease: 'power2.inOut' }, 2.0)
    .fromTo('.sanctum img', { scale: 1.35 }, { scale: 1.1, duration: 4, ease: 'power2.out' }, 2.0)
    .to('.rays', { opacity: 1, rotate: 25, duration: 4, ease: 'power1.out' }, 2.6)
    .to('.temple-bless', { opacity: 0, duration: 0.8 }, 5.2)
    // walk through the doorway into the light
    .to('#templeStage', { scale: 3.4, transformOrigin: '50% 53%', duration: 2.2, ease: 'power3.in' }, 5.3)
    .to('.flash', { opacity: 1, duration: 1.0, ease: 'power2.in' }, 6.4);
  $('#skip').addEventListener('click', () => { tl.progress(1); });
};

$('#seal').addEventListener('click', () => {
  sealPulse.kill();
  playMusic();
  if (reduce) { showSite(); return; }
  gsap.set('.flash', { opacity: 1 });
  gsap.timeline({ onComplete: openTemple })
    .to('.env-hint', { autoAlpha: 0, duration: 0.3 }, 0)
    .to('.seal', { scale: 1.18, duration: 0.25, ease: 'power2.out' }, 0)
    .to('.seal', { scale: 0, rotate: 35, autoAlpha: 0, duration: 0.55, ease: 'back.in(2)' }, 0.25)
    .to('.env-light', { opacity: 1, scale: 0.35, duration: 0.6, ease: 'power2.out' }, 0.45)
    .to('.flap-t', { yPercent: -62, rotateX: 28, duration: 1.7, ease: 'power3.inOut' }, 0.7)
    .to('.flap-b', { yPercent: 62, rotateX: -28, duration: 1.7, ease: 'power3.inOut' }, 0.7)
    .to('.flap-l', { xPercent: -60, duration: 1.7, ease: 'power3.inOut' }, 0.8)
    .to('.flap-r', { xPercent: 60, duration: 1.7, ease: 'power3.inOut' }, 0.8)
    .to('.env-light', { scale: 2.6, duration: 1.8, ease: 'power2.in' }, 0.8)
    .to('#envelope', { backgroundColor: '#fff6dc', duration: 0.6 }, 1.8)
    .to('#envelope', { autoAlpha: 0, duration: 0.5 }, 2.4);
}, { once: true });

/* ------------------------------------------------------------------ hero + scroll reveals */
function heroIn() {
  const h = gsap.timeline({ delay: 0.5 });
  h.from('.arch-frame', { scaleY: 0.85, autoAlpha: 0, duration: 1.6, ease: 'power3.out' })
    .from('.hero .om', { autoAlpha: 0, y: 20, filter: 'blur(8px)', duration: 1.1 }, 0.3)
    .from('.monogram', { autoAlpha: 0, scale: 0.6, rotate: -40, duration: 1.4, ease: 'power3.out' }, 0.5)
    .from('.hero .fam', { autoAlpha: 0, y: 24, filter: 'blur(8px)', duration: 1.1 }, 0.9);
  $$('.hero .nm').forEach((nm, i) => {
    h.from($$('.ch', nm), { autoAlpha: 0, y: 40, rotateX: -80, filter: 'blur(10px)', duration: 1.1, ease: 'power3.out', stagger: 0.06 }, 1.3 + i * 0.9);
  });
  h.from('.hero .weds', { autoAlpha: 0, letterSpacing: '1.2em', duration: 1.2 }, 1.9)
    .from('.hero .hdate', { autoAlpha: 0, y: 24, duration: 1.1 }, 2.9)
    .from('.cue', { autoAlpha: 0, duration: 1 }, 3.6);
  gsap.to('#mandala', { rotate: 360, transformOrigin: '50% 50%', duration: 60, ease: 'none', repeat: -1 });
}

if (!reduce) {
  // generic reveals (skip anything inside the hero; it has its own timeline)
  $$('main [data-a]').filter((el) => !el.closest('.hero')).forEach((el) => {
    const kind = el.dataset.a;
    const from = kind === 'zoom' ? { autoAlpha: 0, scale: 0.7, filter: 'blur(10px)' }
      : kind === 'wipe' ? { clipPath: 'inset(0 100% 0 0)' }
        : { autoAlpha: 0, y: 40, filter: 'blur(8px)' };
    gsap.from(el, { ...from, duration: kind === 'wipe' ? 1.6 : 1.3, ease: kind === 'wipe' ? 'power3.inOut' : 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' } });
  });
  // letters on the shubhalekha names
  $$('main [data-split]').filter((el) => !el.closest('.hero')).forEach((el) => {
    gsap.from($$('.ch', el), { autoAlpha: 0, y: 30, rotateX: -70, filter: 'blur(8px)', duration: 1, stagger: 0.05, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' } });
  });
  // line-by-line (sloka, brother note)
  $$('[data-lines]').forEach((el) => {
    gsap.from($$('.line', el), { autoAlpha: 0, y: 30, filter: 'blur(10px)', duration: 1.3, stagger: 0.45, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 80%' } });
  });
  // parallax temple behind the sloka
  gsap.fromTo('.parallax img', { yPercent: -10, scale: 1.15 }, { yPercent: 10, scale: 1, ease: 'none',
    scrollTrigger: { trigger: '.sloka-band', start: 'top bottom', end: 'bottom top', scrub: true } });
  // muhurtham glow breathes as you pass
  gsap.fromTo('.time', { textShadow: '0 0 0px rgba(244,220,154,0)' }, { textShadow: '0 0 60px rgba(244,220,154,.6)', ease: 'none',
    scrollTrigger: { trigger: '.muhurtham', start: 'top 60%', end: 'center center', scrub: true } });
  // timeline spine draws, cards rise one by one
  gsap.to('.timeline .spine i', { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.timeline', start: 'top 70%', end: 'bottom 70%', scrub: true } });
  $$('.ev').forEach((ev) => {
    gsap.from(ev.querySelector('.card'), { autoAlpha: 0, x: 40, y: 20, filter: 'blur(8px)', duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: ev, start: 'top 85%' } });
    gsap.from(ev.querySelector('.dot'), { scale: 0, duration: 0.6, ease: 'back.out(2)', scrollTrigger: { trigger: ev, start: 'top 85%' } });
  });
  // rituals: pin and slide sideways
  const track = $('#ritTrack');
  const dist = () => Math.max(0, track.scrollWidth - innerWidth + 26);
  gsap.to(track, { x: () => -dist(), ease: 'none',
    scrollTrigger: { trigger: '#rituals', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 0.6, invalidateOnRefresh: true } });
} else {
  $$('.rit-track').forEach((t) => { t.style.width = 'auto'; t.style.flexWrap = 'wrap'; });
}

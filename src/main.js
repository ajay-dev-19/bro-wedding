import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { events, rituals, muhurtham, phones } from './data.js';

gsap.registerPlugin(ScrollTrigger);

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ------------------------------------------------------------ content */
const icon = {
  pin: '<svg viewBox="0 0 24 24"><path d="M12 21s-7-6.5-7-12a7 7 0 0114 0c0 5.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>',
  cal: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
  tel: '<svg viewBox="0 0 24 24"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2"/></svg>',
};
const upcoming = events.filter((e) => !e.done);
const done = events.find((e) => e.done);
$('#arches').innerHTML = upcoming.map((e) => {
  const map = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(e.map);
  const cal = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent(`${e.name} · Srinivas Teja & Srilekha`) +
    `&dates=${e.start}/${e.end}&ctz=Asia/Kolkata&location=` + encodeURIComponent(e.venue);
  return `<article class="ac${e.main ? ' main' : ''}">
    <p class="tel">${esc(e.te)}</p><h3>${esc(e.name)}</h3><p class="when">${esc(e.day)}</p>
    <p class="meta"><b>${esc(e.time)}</b>${e.lunch ? `<br>Lunch ${esc(e.lunch)}` : ''}<br>${esc(e.venue)}</p>
    <div class="btns"><a class="btn fill" href="${map}" target="_blank" rel="noopener">${icon.pin}Directions</a>
    <a class="btn" href="${cal}" target="_blank" rel="noopener">${icon.cal}Save date</a></div></article>`;
}).join('');
if (done) $('#doneNote').textContent = `${done.name} celebrated on ${done.day.replace(/^\w+, /, '')} — blessed and done.`;

$('#ritTrack').innerHTML = rituals.map((r, i) => `<article class="rit"><p class="n">${String(i + 1).padStart(2, '0')} / ${String(rituals.length).padStart(2, '0')}</p>
  <h3>${esc(r[0])}</h3><p class="en">${esc(r[1])}</p><p>${esc(r[2])}</p></article>`).join('');
$('#phones').innerHTML = phones.map((p, i) => `<a class="btn${i ? '' : ' fill'}" href="tel:+91${p}">${icon.tel}${p.slice(0, 5)} ${p.slice(5)}</a>`).join('');

$$('[data-split]').forEach((el) => {
  el.setAttribute('aria-label', el.textContent);
  el.innerHTML = [...el.textContent].map((c) => `<span class="ch" aria-hidden="true">${c === ' ' ? '&nbsp;' : esc(c)}</span>`).join('');
});
$$('[data-lines]').forEach((el) => {
  el.innerHTML = el.textContent.trim().split('\n').map((l) => `<span class="line">${esc(l.trim())}</span>`).join('');
});

/* ------------------------------------------------------------ countdown */
const tick = () => {
  const s = Math.max(0, Math.floor((muhurtham - Date.now()) / 1000));
  $('#cdD').textContent = Math.floor(s / 86400);
  $('#cdH').textContent = Math.floor((s % 86400) / 3600);
  $('#cdM').textContent = Math.floor((s % 3600) / 60);
  $('#cdS').textContent = s % 60;
};
tick(); setInterval(tick, 1000);

/* ------------------------------------------------------------ gold dust */
const cv = $('#dust'); const cx = cv.getContext('2d');
let W, H, dots = [], dustOn = false;
const size = () => { const r = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight; cv.width = W * r; cv.height = H * r; cx.setTransform(r, 0, 0, r, 0, 0); };
const mk = (y) => ({ x: Math.random() * W, y: y ?? H + 10, r: 0.5 + Math.random() * 1.6, v: 0.12 + Math.random() * 0.4, w: Math.random() * 6.3, a: 0.2 + Math.random() * 0.5 });
const draw = () => {
  if (!dustOn) return;
  cx.clearRect(0, 0, W, H);
  for (const d of dots) {
    d.y -= d.v; d.w += 0.015; d.x += Math.sin(d.w) * 0.3;
    if (d.y < -10) Object.assign(d, mk());
    const g = cx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r * 4);
    g.addColorStop(0, `rgba(255,236,170,${d.a})`); g.addColorStop(1, 'rgba(255,236,170,0)');
    cx.fillStyle = g; cx.beginPath(); cx.arc(d.x, d.y, d.r * 4, 0, 6.29); cx.fill();
  }
  requestAnimationFrame(draw);
};
const startDust = () => { if (reduce || dustOn) return; size(); dots = Array.from({ length: Math.min(50, Math.round(W / 10)) }, () => mk(Math.random() * H)); dustOn = true; draw(); };
addEventListener('resize', () => dustOn && size());

/* ------------------------------------------------------------ music (optional: public/audio/music.mp3) */
const bgm = $('#bgm'); const mBtn = $('#music');
let hasMusic = false;
fetch(bgm.src, { method: 'HEAD' }).then((r) => { hasMusic = r.ok && (r.headers.get('content-type') || '').includes('audio'); }).catch(() => {});
const setOn = (on) => { mBtn.classList.toggle('on', on); mBtn.setAttribute('aria-label', on ? 'Pause music' : 'Play music'); };
const playMusic = () => { if (!hasMusic) return; mBtn.hidden = false; bgm.volume = 0.6; bgm.play().then(() => setOn(true)).catch(() => setOn(false)); };
mBtn.addEventListener('click', () => { if (bgm.paused) { bgm.play().then(() => setOn(true)).catch(() => {}); } else { bgm.pause(); setOn(false); } });

/* ------------------------------------------------------------ intro: temple doors */
gsap.set(['.stage'], { xPercent: -50, yPercent: -50, x: 0, y: 0 });
gsap.set('.enter', { xPercent: -50, x: 0 });
const intro = $('#intro');
$$('.diya').forEach((d) => gsap.to(d, { opacity: () => 0.5 + Math.random() * 0.5, scale: () => 0.9 + Math.random() * 0.25, duration: () => 0.12 + Math.random() * 0.2,
  repeat: -1, yoyo: true, repeatRefresh: true, ease: 'none' }));
gsap.timeline()
  .from('#doorStage', { scale: 1.1, duration: 3.5, ease: 'power2.out' })
  .from('.intro-top', { autoAlpha: 0, y: -16, duration: 1.2 }, 0.6)
  .from('.enter', { autoAlpha: 0, y: 20, duration: 1 }, 1.2);

let opened = false;
const reveal = () => {
  document.body.classList.remove('is-locked');
  startDust();
  ScrollTrigger.refresh();
  gsap.timeline()
    .from('#walkStage', { scale: 1.1165, duration: 2.6, ease: 'power2.inOut' }, 0)
    .to(intro, { autoAlpha: 0, duration: 0.45, ease: 'power1.out', onComplete: () => intro.remove() }, 0)
    .from('.w-fam', { autoAlpha: 0, y: 18, filter: 'blur(8px)', duration: 1.4, ease: 'power2.out' }, 0.6)
    .from('.w-cue', { autoAlpha: 0, duration: 1 }, 1.4);
};
const openDoors = () => {
  if (opened) return; opened = true;
  playMusic();
  if (reduce) { reveal(); return; }
  gsap.timeline({ onComplete: reveal })
    .to('.enter', { autoAlpha: 0, y: 10, duration: 0.5 }, 0)
    .to('.seam', { opacity: 1, duration: 0.6, ease: 'power2.out' }, 0.1)
    .to('.leaf-l', { rotateY: -100, duration: 3.6, ease: 'power2.inOut' }, 0.6)
    .to('.leaf-r', { rotateY: 100, duration: 3.6, ease: 'power2.inOut' }, 0.6)
    .to('.seam', { opacity: 0, duration: 0.8 }, 1.4)
    .fromTo('.beyond img', { scale: 1.25, filter: 'brightness(1.6)' }, { scale: 1, filter: 'brightness(1)', duration: 4, ease: 'power2.out' }, 0.6)
    .to('.intro-top', { autoAlpha: 0, duration: 0.8 }, 3.2)
    // step through the doorway
    .to('#doorStage', { scale: 2.45, transformOrigin: '50% 53%', duration: 2.2, ease: 'power3.inOut' }, 3.4);
};
$('#enter').addEventListener('click', openDoors);

/* ------------------------------------------------------------ scene 1: the couple walks to the mandir */
if (!reduce) {
  const w = gsap.timeline({ defaults: { ease: 'none' },
    scrollTrigger: { trigger: '#walk', start: 'top top', end: 'bottom bottom', scrub: 1.2 } });
  w.to('.w-cue', { autoAlpha: 0, duration: 0.6 }, 0)
    // camera drifts forward
    .to('.plate', { scale: 1.14, transformOrigin: '50% 48%', duration: 8 }, 0)
    // the couple walk up the path towards the steps
    .to('.couple', { yPercent: -68, scale: 0.58, duration: 8, ease: 'sine.inOut' }, 0)
    .to('.couple img', { y: '-2.2%', rotate: 0.8, duration: 0.4, ease: 'sine.inOut', repeat: 19, yoyo: true }, 0)
    .to('.sunflare', { scale: 1.3, opacity: 0.9, duration: 8 }, 0)
    // names appear in the sky
    .from('.w-names .w-nm:first-child .ch', { autoAlpha: 0, y: 40, rotateX: -80, filter: 'blur(10px)', stagger: 0.12, duration: 1.2 }, 1.2)
    .from('.w-weds', { autoAlpha: 0, letterSpacing: '1.4em', duration: 1 }, 2.6)
    .from('.w-names .w-nm:last-child .ch', { autoAlpha: 0, y: 40, rotateX: -80, filter: 'blur(10px)', stagger: 0.12, duration: 1.2 }, 3.0)
    .from('.w-date', { autoAlpha: 0, y: 20, filter: 'blur(8px)', duration: 1 }, 4.6)
    // hold, then soft fade into the invitation
    .to('.walk-text', { autoAlpha: 0, y: -30, duration: 1 }, 8.4)
    .to('.walk-fade', { opacity: 1, duration: 1.4 }, 8.6);
}

/* ------------------------------------------------------------ scroll reveals */
if (!reduce) {
  const st = (el, start = 'top 86%') => ({ trigger: el, start });
  $$('main [data-a]').forEach((el) => {
    const k = el.dataset.a;
    if (k === 'draw') { gsap.from(el, { scaleX: 0, duration: 1.4, ease: 'power3.inOut', scrollTrigger: st(el) }); return; }
    const from = k === 'zoom' ? { autoAlpha: 0, scale: 0.7, filter: 'blur(10px)' } : { autoAlpha: 0, y: 36, filter: 'blur(8px)' };
    gsap.from(el, { ...from, duration: 1.3, ease: 'power3.out', scrollTrigger: st(el) });
  });
  $$('.invite [data-split]').forEach((el) => {
    gsap.from($$('.ch', el), { autoAlpha: 0, y: 50, filter: 'blur(10px)', duration: 1.2, stagger: 0.06, ease: 'power3.out', scrollTrigger: st(el) });
  });
  $$('[data-lines]').forEach((el) => {
    gsap.from($$('.line', el), { autoAlpha: 0, y: 26, filter: 'blur(10px)', duration: 1.3, stagger: 0.4, ease: 'power2.out', scrollTrigger: st(el, 'top 82%') });
  });
  // the arch draws itself
  const arch = $('.arch-path');
  const len = 2000; arch.style.strokeDasharray = len; arch.style.strokeDashoffset = len;
  gsap.to(arch, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '.invite', start: 'top 70%', end: 'center center', scrub: 1 } });
  // sanctum parallax + glowing time
  gsap.fromTo('.m-bg img', { yPercent: -8, scale: 1.12 }, { yPercent: 8, scale: 1, ease: 'none', scrollTrigger: { trigger: '.muhurtham', start: 'top bottom', end: 'bottom top', scrub: true } });
  // arched event cards rise one after another
  gsap.from('.ac', { autoAlpha: 0, y: 80, scale: 0.94, filter: 'blur(8px)', duration: 1.3, stagger: 0.22, ease: 'power3.out', scrollTrigger: st('#arches', 'top 82%') });
  // rituals slide sideways while pinned
  const track = $('#ritTrack');
  const dist = () => Math.max(0, track.scrollWidth - innerWidth);
  gsap.to(track, { x: () => -dist(), ease: 'none',
    scrollTrigger: { trigger: '#rituals', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 0.6, invalidateOnRefresh: true } });
  // finale: slow push into the mandir
  gsap.fromTo('.f-bg img', { scale: 1.2 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.finale', start: 'top bottom', end: 'bottom bottom', scrub: true } });
} else {
  const t = $('#ritTrack'); t.style.width = 'auto'; t.style.flexWrap = 'wrap'; t.style.justifyContent = 'center';
  $('.rituals').style.height = 'auto';
}

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { events, story, gallery, phones, rsvpTo, muhurtham, couple } from './data.js';
import { toran, diya, lotusRule, kalash } from './art.js';
import { createPetals } from './petals.js';
import { mountRangoli } from './rangoli.js';

gsap.registerPlugin(ScrollTrigger);
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ico = {
  pin: '<svg viewBox="0 0 24 24"><path d="M12 21s-7-6.5-7-12a7 7 0 0114 0c0 5.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>',
  cal: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
  tel: '<svg viewBox="0 0 24 24"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2"/></svg>',
  wa: '<svg viewBox="0 0 24 24"><path d="M4 20l1.3-4A8 8 0 1112 20a8 8 0 01-3.9-1z"/><path d="M9 9c0 3 2 5 5 6l1-1.5-2-1-1 1c-1-.5-1.5-1-2-2l1-1-1-2z"/></svg>',
};

/* =========================================================== render */
$$('[data-toran]').forEach((el) => { el.innerHTML = toran(innerWidth < 600 ? 11 : 17); });
$('[data-rgdiyas]').innerHTML = [[50, 2], [98, 50], [50, 98], [2, 50]].map(([x, y]) => diya().replace('class="diya-svg "', `class="diya-svg" style="left:${x}%;top:${y}%"`)).join('');
$$('[data-kalash]').forEach((el) => { el.innerHTML = kalash(); });
$$('[data-lotus]').forEach((el) => { el.innerHTML = lotusRule(); });
$('[data-diyas]').innerHTML = diya() + diya() + diya();
$$('[data-ico]').forEach((el) => el.insertAdjacentHTML('afterbegin', ico[el.dataset.ico]));

const gcal = (e) => 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent(`${e.name} · ${couple.groom} & ${couple.bride}`) +
  `&dates=${e.start}/${e.end}&ctz=Asia/Kolkata&location=` + encodeURIComponent(e.venue);
const maps = (q) => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q);

$('#evList').innerHTML = events.map((e) => `<article class="ev${e.main ? ' main' : ''}" style="--c1:${e.band}">
  <div class="ev-top"><p class="te">${esc(e.te)}</p></div>
  <div class="ev-b"><h3>${esc(e.name)}</h3><p class="when">${esc(e.date)}</p>
    <p class="t">${esc(e.time)}</p><p class="note">${esc(e.note)}</p><p class="v">${esc(e.venue)}</p>
    <div class="btns center"><a class="btn fill" href="${maps(e.map)}" target="_blank" rel="noopener">${ico.pin}Directions</a>
    <a class="btn" href="${gcal(e)}" target="_blank" rel="noopener">${ico.cal}Save date</a></div></div></article>`).join('');

$('#storyLine').innerHTML = '<i class="bar"></i>' + story.map((s, i) => `<li><span class="dot">${i + 1}</span><h3>${esc(s[0])}</h3><p class="d">${esc(s[1])}</p><p>${esc(s[2])}</p></li>`).join('');

$('#jharokhas').innerHTML = gallery.map((g, i) => `<figure class="jh" style="margin:0">${diya('a')}${diya('b')}
  <div class="jh-frame"><div class="jh-win"><img src="${esc(g[0])}" alt="${esc(g[1])}" loading="lazy" style="object-position:${i % 2 ? '50% 30%' : '50% 60%'}">
  <i class="shutter l"></i><i class="shutter r"></i></div></div><figcaption class="jh-cap">${esc(g[1])}</figcaption></figure>`).join('');

$('#phones').innerHTML = phones.map(([n, p], i) => `<a class="btn${i ? '' : ' fill'}" href="tel:+91${p}" aria-label="Call ${esc(n)}">${ico.tel}${p.slice(0, 5)} ${p.slice(5)}</a>`).join('');

// calendar: Google per event + one .ics for Apple / Outlook
const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//bro-wedding//EN',
  ...events.flatMap((e) => ['BEGIN:VEVENT', `UID:${e.key}@tejawedssrilekha`, `DTSTART;TZID=Asia/Kolkata:${e.start}`, `DTEND;TZID=Asia/Kolkata:${e.end}`,
    `SUMMARY:${e.name} · ${couple.groom} & ${couple.bride}`, `LOCATION:${e.venue.replace(/,/g, '\\,')}`, 'END:VEVENT']), 'END:VCALENDAR'].join('\r\n');
$('#calBtns').innerHTML = events.map((e) => `<a class="btn" href="${gcal(e)}" target="_blank" rel="noopener">${ico.cal}${esc(e.name)}</a>`).join('') +
  `<a class="btn fill" href="data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}" download="teja-srilekha-wedding.ics">${ico.cal}Apple / iCal</a>`;

const rangoli = mountRangoli($('#rangoli'), { reduce });

/* toran: every strand is a little pendulum; scrolling gives them a push */
const strands = $$('.strand').map((g) => {
  const o = `${g.dataset.x} ${g.dataset.y}`;
  const amp = 1.4 + Math.random() * 1.8; const dur = 2.2 + Math.random() * 1.6;
  if (!reduce) gsap.fromTo(g, { rotation: -amp, svgOrigin: o }, { rotation: amp, svgOrigin: o, duration: dur, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: -Math.random() * dur });
  return g;
});
if (!reduce) {
  const push = $$('.toran-svg');
  const settle = gsap.delayedCall(0.18, () => gsap.to(push, { skewX: 0, duration: 2.2, ease: 'elastic.out(1, .28)', overwrite: true })).pause();
  ScrollTrigger.create({ onUpdate: (self) => {
    const k = Math.max(-5, Math.min(5, self.getVelocity() / -400));
    gsap.to(push, { skewX: k, transformOrigin: '50% 0%', duration: 0.6, ease: 'power2.out', overwrite: true });
    settle.restart(true);
  } });
}

/* =========================================================== countdown */
const tick = () => {
  const s = Math.max(0, Math.floor((muhurtham - Date.now()) / 1000));
  $('#cdD').textContent = Math.floor(s / 86400); $('#cdH').textContent = Math.floor((s % 86400) / 3600);
  $('#cdM').textContent = Math.floor((s % 3600) / 60); $('#cdS').textContent = s % 60;
};
tick(); setInterval(tick, 1000);

/* =========================================================== petals */
const petals = createPetals($('#petals'), { reduce });
const burst = (n) => petals.shower(n, 2.2);
const startPetals = () => petals.start();
let lastY = scrollY;
addEventListener('scroll', () => { const d = scrollY - lastY; lastY = scrollY; if (Math.abs(d) > 30) petals.gust(Math.sign(d) * Math.min(30, Math.abs(d) * 0.3)); }, { passive: true });

/* =========================================================== music */
const bgm = $('#bgm'); const mBtn = $('#music');
let hasMusic = false;
fetch(bgm.src, { method: 'HEAD' }).then((r) => { hasMusic = r.ok && (r.headers.get('content-type') || '').includes('audio'); }).catch(() => {});
const setOn = (on) => { mBtn.classList.toggle('on', on); mBtn.setAttribute('aria-label', on ? 'Pause music' : 'Play music'); };
const playMusic = () => { if (!hasMusic) return; mBtn.hidden = false; bgm.volume = 0.55; bgm.play().then(() => setOn(true)).catch(() => setOn(false)); };
mBtn.addEventListener('click', () => { if (bgm.paused) bgm.play().then(() => setOn(true)).catch(() => {}); else { bgm.pause(); setOn(false); } });

/* =========================================================== knock to open */
gsap.set('.stage', { xPercent: -50, yPercent: -50, x: 0, y: 0 });
const intro = $('#intro');
$$('.diya-glow').forEach((d) => gsap.to(d, { opacity: () => 0.5 + Math.random() * 0.5, scale: () => 0.9 + Math.random() * 0.25, duration: () => 0.12 + Math.random() * 0.2, repeat: -1, yoyo: true, repeatRefresh: true, ease: 'none' }));
gsap.timeline()
  .from('#doorStage', { scale: 1.12, duration: 3.6, ease: 'power2.out' })
  .from('.intro-top', { autoAlpha: 0, y: -16, duration: 1.2 }, 0.5)
  .from('.knock-ui > *', { autoAlpha: 0, y: 16, stagger: 0.15, duration: 0.9 }, 1.1);
// idle hint: the doors breathe until knocked
const hint = gsap.to('.leaf-l, .leaf-r', { x: (i) => (i ? 1.5 : -1.5), duration: 0.12, repeat: 5, yoyo: true, repeatDelay: 0, delay: 3, ease: 'none', paused: reduce });
const hintLoop = setInterval(() => !reduce && hint.restart(true), 4200);

let actx = null;
const thud = () => {
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const t = actx.currentTime;
    const o = actx.createOscillator(); const g = actx.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(48, t + 0.18);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.9, t + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.32);
    o.connect(g).connect(actx.destination); o.start(t); o.stop(t + 0.35);
    const len = actx.sampleRate * 0.06; const buf = actx.createBuffer(1, len, actx.sampleRate); const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
    const n = actx.createBufferSource(); const ng = actx.createGain(); const lp = actx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = 900; ng.gain.value = 0.5; n.buffer = buf; n.connect(lp).connect(ng).connect(actx.destination); n.start(t);
  } catch (e) { /* sound is optional */ }
};

let opened = false;
$('#knock').addEventListener('click', (ev) => {
  if (opened) return;
  thud(); if (navigator.vibrate) navigator.vibrate(25);
  clearInterval(hintLoop); hint.kill();
  const ring = document.createElement('i'); ring.className = 'knock-ring';
  ring.style.left = (ev.clientX || innerWidth / 2) + 'px'; ring.style.top = (ev.clientY || innerHeight / 2) + 'px'; intro.appendChild(ring);
  gsap.fromTo(ring, { scale: 0.3, opacity: 1 }, { scale: 2.2, opacity: 0, duration: 0.8, ease: 'power2.out', onComplete: () => ring.remove() });
  openDoors();
});

function openDoors() {
  opened = true; playMusic();
  $('#welcome').textContent = 'స్వాగతం · Welcome';
  if (reduce) { handoff(); return; }
  gsap.timeline({ onComplete: handoff })
    .to('.knock-ui', { autoAlpha: 0, y: 12, duration: 0.6 }, 0)
    .to('#welcome', { opacity: 1, y: -10, duration: 1.2, ease: 'power2.out' }, 0.2)
    .to('.seam', { opacity: 1, duration: 0.6 }, 0.3)
    .to('.leaf-l', { rotateY: -100, duration: 3.4, ease: 'power2.inOut' }, 0.7)
    .to('.leaf-r', { rotateY: 100, duration: 3.4, ease: 'power2.inOut' }, 0.7)
    .to('.seam', { opacity: 0, duration: 0.8 }, 1.4)
    .call(() => burst(36), null, 1.6)
    .fromTo('.beyond img', { filter: 'brightness(1.6)' }, { filter: 'brightness(1)', duration: 3.6, ease: 'power2.out' }, 0.7)
    .to(['#welcome', '.intro-top'], { autoAlpha: 0, duration: 0.8 }, 3.2)
    .to('#doorStage', { scale: 2.45, transformOrigin: '50% 53%', duration: 2.4, ease: 'power2.inOut' }, 3.3);
}

// Place the hero image exactly where the picture in the doorway is, then cross over with no jump.
function handoff() {
  scrollTo(0, 0);
  const r = $('.beyond').getBoundingClientRect();
  const s = Math.max(r.width / 1080, r.height / 1920); const imgW = 1080 * s;
  const hero = $('#heroStage'); const hr = $('.hero').getBoundingClientRect();
  const stageW = hero.offsetWidth; const k = imgW / stageW;
  const dx = (r.left + r.width / 2) - (hr.left + hr.width / 2); const dy = (r.top + r.height / 2) - (hr.top + hr.height / 2);
  gsap.set(hero, { scale: k, x: dx, y: dy });
  gsap.set('.hero-shade', { opacity: 0 });
  document.body.classList.remove('is-locked');
  petals.ambient(innerWidth < 600 ? 9 : 16);
  ScrollTrigger.refresh();
  const t = gsap.timeline();
  t.to(intro, { autoAlpha: 0, duration: 0.6, ease: 'none', onComplete: () => intro.remove() }, 0)
    .to(hero, { scale: 1, x: 0, y: 0, duration: 2.4, ease: 'power2.inOut' }, 0)
    .to('.hero-shade', { opacity: 1, duration: 2, ease: 'power1.inOut' }, 0.6)
    .to(hero, { scale: 1.05, duration: 18, ease: 'sine.inOut', yoyo: true, repeat: -1 }, 2.4);
  if (reduce) return;
  t.from('.hero .toran', { yPercent: -110, duration: 2, ease: 'power3.out' }, 1.2)
    .from('.h-gan, .h-inv', { autoAlpha: 0, y: 24, filter: 'blur(8px)', stagger: 0.3, duration: 1.4, ease: 'power3.out' }, 1.6)
    .from('.nm', { clipPath: 'inset(0 100% 0 0)', duration: 1.8, stagger: 0.8, ease: 'power2.inOut' }, 2.3)
    .from('.amp', { autoAlpha: 0, duration: 1 }, 3.0)
    .from('.h-date, .h-venue, .h-tag', { autoAlpha: 0, y: 20, filter: 'blur(6px)', stagger: 0.22, duration: 1.2 }, 4.0)
    .from('.cue', { autoAlpha: 0, duration: 1.2 }, 5);
}

/* =========================================================== scroll animation */
if (!reduce) {
  const st = (el, start = 'top 86%') => ({ trigger: el, start });
  $$('[data-r]').forEach((el) => gsap.from(el, { autoAlpha: 0, y: 40, filter: 'blur(8px)', duration: 1.25, ease: 'power3.out', scrollTrigger: st(el) }));
  $$('[data-lines]').forEach((el) => {
    el.innerHTML = el.textContent.trim().split('\n').map((l) => `<span class="line">${esc(l.trim())}</span>`).join('');
    gsap.from($$('.line', el), { autoAlpha: 0, y: 20, filter: 'blur(8px)', stagger: 0.4, duration: 1.2, scrollTrigger: st(el) });
  });
  // hero text drifts up and fades as you leave
  gsap.to('.hero-in', { y: -80, autoAlpha: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom 35%', scrub: true } });
  // rangoli is poured grain by grain when it comes into view
  ScrollTrigger.create({ trigger: '[data-rangoli]', start: 'top 75%', once: true, onEnter: () => rangoli.draw() });
  gsap.from('.rg-date', { autoAlpha: 0, scale: 0.85, duration: 1.4, delay: 3.6, ease: 'power2.out', scrollTrigger: st('[data-rangoli]', 'top 75%') });
  gsap.from('.rg-diyas .diya-svg', { autoAlpha: 0, duration: 0.8, stagger: 0.25, delay: 4.6, scrollTrigger: st('[data-rangoli]', 'top 75%') });
  // invitation card unfolds
  gsap.from('.card-in', { y: 120, rotateX: 14, transformPerspective: 1200, autoAlpha: 0, duration: 1.6, ease: 'power3.out', scrollTrigger: st('.vivaham', 'top 75%') });
  gsap.from('.kalash', { y: -40, autoAlpha: 0, duration: 1.2, ease: 'bounce.out', scrollTrigger: st('.card-in', 'top 70%') });
  // events cards rise one by one
  gsap.from('.ev', { y: 90, autoAlpha: 0, rotate: (i) => (i - 1) * 3, duration: 1.3, stagger: 0.2, ease: 'power3.out', scrollTrigger: st('#evList', 'top 82%') });
  // story line draws as you read
  gsap.from('.story-line .bar', { scaleY: 0, ease: 'none', scrollTrigger: { trigger: '.story-line', start: 'top 70%', end: 'bottom 60%', scrub: true } });
  $$('.story-line li').forEach((li) => {
    gsap.from(li.querySelector('.dot'), { scale: 0, duration: 0.6, ease: 'back.out(2.5)', scrollTrigger: st(li, 'top 80%') });
    gsap.from($$('h3, p', li), { x: 30, autoAlpha: 0, stagger: 0.12, duration: 1, ease: 'power3.out', scrollTrigger: st(li, 'top 80%') });
  });
  // jharokha shutters swing open
  $$('.jh').forEach((jh) => {
    const tl = gsap.timeline({ scrollTrigger: st(jh, 'top 72%') });
    tl.from(jh, { y: 60, autoAlpha: 0, duration: 1, ease: 'power3.out' })
      .to(jh.querySelector('.shutter.l'), { rotateY: -110, duration: 1.6, ease: 'power3.inOut' }, 0.5)
      .to(jh.querySelector('.shutter.r'), { rotateY: 110, duration: 1.6, ease: 'power3.inOut' }, 0.5)
      .fromTo(jh.querySelector('img'), { scale: 1.3 }, { scale: 1, duration: 2.4, ease: 'power2.out' }, 0.5);
  });
  // a little petal shower when the RSVP form appears
} else {
  $$('.shutter').forEach((s) => { s.style.display = 'none'; });
  rangoli.still();
}

/* =========================================================== RSVP */
let guests = 2;
const setG = (n) => { guests = Math.min(6, Math.max(1, n)); $('#rCount').textContent = guests; };
$('#minus').addEventListener('click', () => setG(guests - 1));
$('#plus').addEventListener('click', () => setG(guests + 1));
$$('input[name="att"]').forEach((r) => r.addEventListener('change', () => { $('#countFld').style.display = r.value === 'no' && r.checked ? 'none' : ''; }));
$('#rsvpForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = $('#rName').value.trim();
  if (!name) { $('#rErr').textContent = 'Please add your name.'; $('#rName').focus(); return; }
  $('#rErr').textContent = '';
  const yes = $('input[name="att"]:checked').value === 'yes';
  const lines = [`🙏 RSVP — ${couple.groom} & ${couple.bride}`, `Name: ${name}`, yes ? `Attending: Yes, ${guests} ${guests > 1 ? 'guests' : 'guest'}` : 'Attending: Sorry, can’t make it — sending blessings'];
  const ph = $('#rPhone').value.trim(); if (ph) lines.push(`Phone: ${ph}`);
  const note = $('#rNote').value.trim(); if (note) lines.push(`Note: ${note}`);
  const url = `https://wa.me/${rsvpTo}?text=${encodeURIComponent(lines.join('\n'))}`;
  const a = document.createElement('a'); a.href = url; a.target = '_blank'; a.rel = 'noopener'; document.body.appendChild(a); a.click(); a.remove();
  const d = $('#rDone'); d.hidden = false; d.innerHTML = `Thank you! If WhatsApp didn’t open, <a href="${url}" target="_blank" rel="noopener" style="color:inherit">tap here to send</a>.`;
  burst(30);
});

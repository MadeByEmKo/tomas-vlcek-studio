/* ============================================================
   main.js — Navigation, i18n, Animations, Parallax, Lightbox
   ============================================================ */
'use strict';

// ── i18n ────────────────────────────────────────────────────
const T = {
  cs: {
    'nav.about':'O mně','nav.services':'Služby','nav.projects':'Ukázky prací',
    'nav.articles':'Zajímavosti','nav.inspiration':'Inspirace','nav.contact':'Kontakt','nav.cta':'Kontaktujte mě',
    'hero.eyebrow':'Od roku 1998','hero.w1':'Navrhuji','hero.w2':'a realizuji','hero.w3':'interiéry',
    'hero.sub':'Pro zlepšení vašeho životního komfortu s dodržením vašeho životního stylu.',
    'hero.cta1':'Ukázky prací','hero.cta2':'Chci 3D návrh',
    'hero.s1':'let praxe','hero.s2':'realizací','hero.s3':'spokojených klientů',
    'about.eyebrow':'O mně','about.badge':'let zkušeností',
    'about.h':'Práce s interiérovým designem je pro mě prací <em>i koníčkem</em>',
    'about.p1':'Vystudoval jsem obor technologie, konstrukce a design nábytku, což mi poskytlo pevný základ pro mou kariéru. Dlouholetá praxe nejen v oblasti interiérové tvorby, ale také na vedoucích obchodních pozicích při řízení týmů architektů, mě opravňuje k tomu, abych vám pomohl realizovat nové podoby vašich domovů.',
    'about.p2':'Každý projekt je pro mě výzvou, zejména ve snaze sladit mé nápady s potřebami a přáními klienta. Při tvorbě interiérů kladu důraz na detail a kvalitu použitých materiálů.',
    'about.v1h':'Design','about.v1p':'Podoba odpovídající potřebám klienta',
    'about.v2h':'Výkon','about.v2p':'Kvalita materiálů a provedení',
    'about.v3h':'Cena','about.v3p':'Investice odpovídající představě',
    'about.cta':'Začněme spolupracovat',
    'srv.eyebrow':'Co nabízím','srv.h':'Komplexní <em>návrhářská</em> činnost',
    'srv.sub':'Vyberte si pouze potřebné fáze nebo komplexní realizaci od konzultace po finální předání.',
    'srv.s1':'Konzultace','srv.s2':'Návrhářská činnost','srv.s3':'Vytvoření materiálové skladby',
    'srv.s4':'Výkresová dokumentace','srv.s5':'Zadání objednávek dodavatelům',
    'srv.s6':'Logistické plánování realizace','srv.s7':'Kontrolní činnost procesu','srv.s8':'Finalizace a přebírka',
    'srv.cta':'Poslat poptávku',
    'srv.p1':'Analýza potřeb','srv.p2':'Návrh koncepce','srv.p3':'Prezentace',
    'srv.p4':'Konzultace detailů & nacenění','srv.p5':'Příprava profesních podkladů',
    'srv.p6':'Objednání všech profesí','srv.p7':'Stavební příprava',
    'srv.p8':'Realizace — montáž interiérů','srv.p9':'Předávka — ukončení',
    'proj.eyebrow':'Realizace','proj.h':'Ukázky <em>prací</em>',
    'art.eyebrow':'Zajímavosti','art.h':'Ze světa <em>interiérového</em> designu',
    'ins.eyebrow':'Inspirace','ins.h':'Inspirace pro váš <em>domov</em>',
    'con.eyebrow':'Kontakt','con.h':'Pojďme <em>spolupracovat</em>',
    'con.sub':'Rád si s vámi promluvím o vašem projektu. Neváhejte mě kontaktovat.',
    'con.email':'E-mail','con.phone':'Telefon','con.addr':'Adresa',
    'con.name':'Jméno','con.emailF':'E-mail','con.phoneF':'Telefon (nepovinné)',
    'con.msg':'Váš dotaz nebo požadavek','con.send':'Odeslat zprávu',
    'footer.tagline':'Navrhuji interiéry, které odrážejí váš životní styl.',
    'footer.cookies':'Cookies','footer.privacy':'Ochrana osobních údajů',
  },
  en: {
    'nav.about':'About','nav.services':'Services','nav.projects':'Projects',
    'nav.articles':'Insights','nav.inspiration':'Inspiration','nav.contact':'Contact','nav.cta':'Contact Me',
    'hero.eyebrow':'Since 1998','hero.w1':'I design','hero.w2':'and realize','hero.w3':'interiors',
    'hero.sub':'Enhancing your quality of life while respecting your personal lifestyle.',
    'hero.cta1':'View Projects','hero.cta2':'Request 3D Design',
    'hero.s1':'years experience','hero.s2':'projects','hero.s3':'satisfied clients',
    'about.eyebrow':'About Me','about.badge':'years of experience',
    'about.h':'Working with interior design is both my <em>profession and passion</em>',
    'about.p1':'I studied furniture technology, construction and design, which gave me a strong foundation for my career. Years of experience in interior design, as well as leadership positions managing teams of architects, enable me to help you realize new visions for your home.',
    'about.p2':'Every project is a challenge — especially in balancing my ideas with the needs and wishes of the client. I place great emphasis on detail and the quality of materials used.',
    'about.v1h':'Design','about.v1p':'Appearance tailored to client needs',
    'about.v2h':'Performance','about.v2p':'Quality of materials and execution',
    'about.v3h':'Price','about.v3p':'Investment aligned with expectations',
    'about.cta':"Let's Collaborate",
    'srv.eyebrow':'What I Offer','srv.h':'Comprehensive <em>design</em> services',
    'srv.sub':'Choose only the phases you need, or opt for complete realization from consultation to final handover.',
    'srv.s1':'Consultation','srv.s2':'Design work','srv.s3':'Material selection',
    'srv.s4':'Technical documentation','srv.s5':'Supplier coordination',
    'srv.s6':'Logistics planning','srv.s7':'Process supervision','srv.s8':'Finalization & handover',
    'srv.cta':'Send Inquiry',
    'srv.p1':'Needs analysis','srv.p2':'Concept design','srv.p3':'Presentation',
    'srv.p4':'Detail consultation & pricing','srv.p5':'Professional documentation',
    'srv.p6':'Ordering all trades','srv.p7':'Site preparation',
    'srv.p8':'Realization — interior assembly','srv.p9':'Handover — completion',
    'proj.eyebrow':'Portfolio','proj.h':'Our <em>work</em>',
    'art.eyebrow':'Insights','art.h':'From the world of <em>interior</em> design',
    'ins.eyebrow':'Inspiration','ins.h':'Inspiration for your <em>home</em>',
    'con.eyebrow':'Contact','con.h':"Let's <em>collaborate</em>",
    'con.sub':"I'd love to discuss your project. Don't hesitate to reach out.",
    'con.email':'E-mail','con.phone':'Phone','con.addr':'Address',
    'con.name':'Name','con.emailF':'E-mail','con.phoneF':'Phone (optional)',
    'con.msg':'Your inquiry or request','con.send':'Send Message',
    'footer.tagline':'Designing interiors that reflect your lifestyle.',
    'footer.cookies':'Cookies','footer.privacy':'Privacy Policy',
  }
};

let lang = localStorage.getItem('tv_lang') || 'cs';

function applyLang(l) {
  lang = l;
  localStorage.setItem('tv_lang', l);
  document.documentElement.lang = l;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const v = T[l][el.dataset.i18n];
    if (v !== undefined) el.innerHTML = v;
  });
  document.querySelectorAll('[data-lang]').forEach(el => el.textContent = l === 'cs' ? 'EN' : 'CS');
  if (window.renderCMS) window.renderCMS(l);
}

// ── Navbar ────────────────────────────────────────────────────
const navbar = document.getElementById('navbar');
const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 40);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ── Smooth scroll with nav offset ────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    closeMobileMenu();
    const top = target.getBoundingClientRect().top + window.scrollY - parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  });
});

// ── Mobile menu ───────────────────────────────────────────────
const hamburger    = document.getElementById('hamburger');
const mobileOverlay = document.getElementById('mobileOverlay');

function openMobileMenu() {
  mobileOverlay.classList.add('open');
  mobileOverlay.removeAttribute('aria-hidden');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}
function closeMobileMenu() {
  mobileOverlay.classList.remove('open');
  mobileOverlay.setAttribute('aria-hidden', 'true');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () =>
  mobileOverlay.classList.contains('open') ? closeMobileMenu() : openMobileMenu()
);
document.getElementById('mobileClose').addEventListener('click', closeMobileMenu);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMobileMenu(); });

// ── Language buttons ──────────────────────────────────────────
function toggleLang() { applyLang(lang === 'cs' ? 'en' : 'cs'); }
document.getElementById('langBtn').addEventListener('click', toggleLang);
document.getElementById('langBtnMobile').addEventListener('click', toggleLang);

// Update button labels
function updateLangLabels() {
  document.querySelectorAll('[data-lang]').forEach(el => el.textContent = lang === 'cs' ? 'EN' : 'CS');
}

// ── Cursor dot ────────────────────────────────────────────────
const cursor = document.getElementById('cursor');
if (cursor && window.matchMedia('(hover: hover)').matches) {
  let mx = 0, my = 0, cx = 0, cy = 0;
  cursor.style.opacity = '1';
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  (function raf() {
    cx += (mx - cx) * 0.15; cy += (my - cy) * 0.15;
    cursor.style.transform = `translate(calc(-50% + ${cx}px), calc(-50% + ${cy}px))`;
    requestAnimationFrame(raf);
  })();
  // Simplify: set position absolute from top/left
  cursor.style.left = '0'; cursor.style.top = '0';
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  (function raf2() {
    cx += (mx - cx) * 0.15; cy += (my - cy) * 0.15;
    cursor.style.transform = `translate(${cx - 5}px, ${cy - 5}px)`;
    requestAnimationFrame(raf2);
  })();
  document.querySelectorAll('a, button, .proj-card, .art-card, .ins-item').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.style.width = '26px'; cursor.style.height = '26px'; cursor.style.opacity = '.45'; });
    el.addEventListener('mouseleave', () => { cursor.style.width = '10px'; cursor.style.height = '10px'; cursor.style.opacity = '1'; });
  });
}

// ── Parallax hero ─────────────────────────────────────────────
const heroBgImg = document.querySelector('.hero-bg img');
if (heroBgImg) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight * 1.5) {
      heroBgImg.style.transform = `translateY(${y * 0.3}px)`;
    }
  }, { passive: true });
}

// ── Hero entrance ─────────────────────────────────────────────
window.addEventListener('load', () => {
  document.querySelectorAll('.hero-anim').forEach((el, i) => {
    setTimeout(() => el.classList.add('in'), 150 + i * 160);
  });
});

// ── Scroll reveal (IntersectionObserver) ─────────────────────
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); revObs.unobserve(e.target); }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .reveal-r').forEach(el => revObs.observe(el));

// Re-observe after CMS renders
window.observeNew = () => {
  document.querySelectorAll('.reveal:not(.in), .reveal-r:not(.in)').forEach(el => revObs.observe(el));
};

// ── Counter animation ─────────────────────────────────────────
function countUp(el) {
  const target = +el.dataset.target || 0;
  const dur = 1600;
  const t0 = performance.now();
  (function tick(now) {
    const p = Math.min((now - t0) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(ease * target);
    if (p < 1) requestAnimationFrame(tick);
  })(t0);
}
const statsEl = document.querySelector('.hero-stats');
if (statsEl) {
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { statsEl.querySelectorAll('.stat-n').forEach(countUp); }
  }, { threshold: 0.5 }).observe(statsEl);
}

// ── Modal (project + article) ─────────────────────────────────
const modal    = document.getElementById('modal');
const modalBg  = document.getElementById('modalBg');
const modalClose = document.getElementById('modalClose');
const modalBody  = document.getElementById('modalBody');

window.openModal = function(html) {
  modalBody.innerHTML = html;
  modal.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
  modalClose.focus();
};
function closeModal() {
  modal.setAttribute('hidden', '');
  document.body.style.overflow = '';
  modalBody.innerHTML = '';
}
modalClose.addEventListener('click', closeModal);
modalBg.addEventListener('click', closeModal);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (!document.getElementById('lightbox').hasAttribute('hidden')) closeLightbox();
    else closeModal();
  }
});

// ── Lightbox ──────────────────────────────────────────────────
const lightbox = document.getElementById('lightbox');
const lbImg    = document.getElementById('lbImg');
const lbCap    = document.getElementById('lbCaption');
let _lbPhotos = [], _lbIdx = 0;

window.openLightbox = function(photos, startIdx, caption) {
  _lbPhotos = photos;
  _lbIdx    = startIdx || 0;
  _updateLb();
  lightbox.removeAttribute('hidden');
  document.getElementById('lbClose').focus();
};
function closeLightbox() { lightbox.setAttribute('hidden', ''); }
function _updateLb() {
  lbImg.src = _lbPhotos[_lbIdx] || '';
  if (lbCap) lbCap.textContent = `${_lbIdx + 1} / ${_lbPhotos.length}`;
}
document.getElementById('lbClose').addEventListener('click', closeLightbox);
document.getElementById('lbBg').addEventListener('click', closeLightbox);
document.getElementById('lbPrev').addEventListener('click', () => { _lbIdx = (_lbIdx - 1 + _lbPhotos.length) % _lbPhotos.length; _updateLb(); });
document.getElementById('lbNext').addEventListener('click', () => { _lbIdx = (_lbIdx + 1) % _lbPhotos.length; _updateLb(); });
document.addEventListener('keydown', e => {
  if (lightbox.hasAttribute('hidden')) return;
  if (e.key === 'ArrowLeft')  { _lbIdx = (_lbIdx - 1 + _lbPhotos.length) % _lbPhotos.length; _updateLb(); }
  if (e.key === 'ArrowRight') { _lbIdx = (_lbIdx + 1) % _lbPhotos.length; _updateLb(); }
});

// Swipe support for lightbox
let _tsX = 0;
lightbox.addEventListener('touchstart', e => { _tsX = e.touches[0].clientX; }, { passive: true });
lightbox.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - _tsX;
  if (Math.abs(dx) > 50) {
    _lbIdx = dx < 0 ? (_lbIdx + 1) % _lbPhotos.length : (_lbIdx - 1 + _lbPhotos.length) % _lbPhotos.length;
    _updateLb();
  }
}, { passive: true });

// ── Footer year ───────────────────────────────────────────────
document.getElementById('year').textContent = new Date().getFullYear();

// ── Init ──────────────────────────────────────────────────────
// Set data-lang attributes
document.getElementById('langBtn').setAttribute('data-lang', '');
document.getElementById('langBtnMobile').setAttribute('data-lang', '');
applyLang(lang);

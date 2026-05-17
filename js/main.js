/* ============================================================
   main.js — Animations, i18n, Navigation, Parallax
   ============================================================ */

'use strict';

// ── i18n ────────────────────────────────────────────────────
const TRANSLATIONS = {
  cs: {
    'nav.about':'O mně','nav.services':'Služby','nav.projects':'Ukázky prací',
    'nav.inspiration':'Inspirace','nav.reviews':'Recenze','nav.contact':'Kontakt','nav.cta':'Kontaktujte mě',
    'hero.eyebrow':'Od roku 1998','hero.w1':'Navrhuji','hero.w2':'a realizuji','hero.w3':'interiéry',
    'hero.sub':'Pro zlepšení vašeho životního komfortu s dodržením vašeho životního stylu.',
    'hero.cta1':'Ukázky prací','hero.cta2':'Chci 3D návrh',
    'hero.s1':'let praxe','hero.s2':'realizací','hero.s3':'spokojených klientů','hero.scroll':'Scroll',
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
    'proj.back':'Zpět na ukázky','proj.all':'Vše','proj.res':'Rezidenční','proj.com':'Komerční',
    
    'rev.eyebrow':'Reference','rev.h':'Co říkají <em>klienti</em>',
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
    'nav.articles':'Insights','nav.inspiration':'Inspiration','nav.reviews':'Reviews','nav.contact':'Contact','nav.cta':'Contact Me',
    'hero.eyebrow':'Since 1998','hero.w1':'I design','hero.w2':'and realize','hero.w3':'interiors',
    'hero.sub':'Enhancing your quality of life while respecting your personal lifestyle.',
    'hero.cta1':'View Projects','hero.cta2':'Request 3D Design',
    'hero.s1':'years experience','hero.s2':'projects','hero.s3':'satisfied clients','hero.scroll':'Scroll',
    'about.eyebrow':'About Me','about.badge':'years of experience',
    'about.h':'Working with interior design is both my <em>profession and passion</em>',
    'about.p1':'I studied furniture technology, construction and design, which gave me a strong foundation for my career. Years of experience in interior design, as well as leadership positions managing teams of architects, enable me to help you realize new visions for your home.',
    'about.p2':'Every project is a challenge — especially in balancing my ideas with the needs and wishes of the client. I place great emphasis on detail and the quality of materials used.',
    'about.v1h':'Design','about.v1p':'Appearance tailored to client\'s needs',
    'about.v2h':'Performance','about.v2p':'Quality of materials and execution',
    'about.v3h':'Price','about.v3p':'Investment aligned with client\'s budget',
    'about.cta':'Let\'s Collaborate',
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
    'proj.back':'Back to projects','proj.all':'All','proj.res':'Residential','proj.com':'Commercial',
    
    'rev.eyebrow':'Testimonials','rev.h':'What our <em>clients</em> say',
    'con.eyebrow':'Contact','con.h':'Let\'s <em>collaborate</em>',
    'con.sub':'I\'d love to discuss your project. Don\'t hesitate to reach out.',
    'con.email':'E-mail','con.phone':'Phone','con.addr':'Address',
    'con.name':'Name','con.emailF':'E-mail','con.phoneF':'Phone (optional)',
    'con.msg':'Your inquiry or request','con.send':'Send Message',
    'footer.tagline':'Designing interiors that reflect your lifestyle.',
    'footer.cookies':'Cookies','footer.privacy':'Privacy Policy',
  }
};

let currentLang = localStorage.getItem('tv_lang') || 'cs';

function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem('tv_lang', lang);
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const val = TRANSLATIONS[lang][key];
    if (val !== undefined) el.innerHTML = val;
  });

  document.querySelectorAll('[data-lang-label]').forEach(el => {
    el.textContent = lang === 'cs' ? 'EN' : 'CS';
  });
  document.querySelectorAll('[data-lang-label-mobile]').forEach(el => {
    el.textContent = lang === 'cs' ? 'EN' : 'CS';
  });

  // Re-render dynamic content in new language
  if (window.renderCMS) window.renderCMS(lang);
  if (window.renderProjectDetail) window.renderProjectDetail(lang);
}

// ── Navbar scroll ────────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── Mobile menu ──────────────────────────────────────────────
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');

function openMenu()  { mobileMenu.classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeMenu() { mobileMenu.classList.remove('open'); document.body.style.overflow = ''; }

hamburger.addEventListener('click', openMenu);
mobileClose.addEventListener('click', closeMenu);
mobileMenu.querySelectorAll('.mobile-link').forEach(a => a.addEventListener('click', closeMenu));

// ── Language toggle ──────────────────────────────────────────
document.getElementById('langToggle').addEventListener('click', () => applyLang(currentLang === 'cs' ? 'en' : 'cs'));
document.getElementById('langToggleMobile').addEventListener('click', () => applyLang(currentLang === 'cs' ? 'en' : 'cs'));

// ── Cursor dot ───────────────────────────────────────────────
const dot = document.getElementById('cursorDot');
if (dot && window.matchMedia('(hover: hover)').matches) {
  let mx = 0, my = 0, cx = 0, cy = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  (function raf() {
    cx += (mx - cx) * 0.18;
    cy += (my - cy) * 0.18;
    dot.style.left = cx + 'px';
    dot.style.top  = cy + 'px';
    requestAnimationFrame(raf);
  })();
  document.querySelectorAll('a, button, .proj-card, .art-card').forEach(el => {
    el.addEventListener('mouseenter', () => { dot.style.width = '28px'; dot.style.height = '28px'; dot.style.opacity = '.5'; });
    el.addEventListener('mouseleave', () => { dot.style.width = '10px'; dot.style.height = '10px'; dot.style.opacity = '1'; });
  });
}

// ── Parallax hero ────────────────────────────────────────────
const heroBg = document.getElementById('heroBg');
if (heroBg) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      heroBg.style.transform = `translateY(${y * 0.35}px)`;
    }
  }, { passive: true });
}

// ── Hero entrance animation ──────────────────────────────────
function animateHero() {
  const els = document.querySelectorAll('.reveal-hero');
  els.forEach((el, i) => {
    setTimeout(() => {
      el.style.transition = 'opacity .9s ease, transform .9s ease';
      el.style.opacity = '1';
      el.style.transform = 'none';
    }, 200 + i * 180);
  });
}
window.addEventListener('load', animateHero);

// ── Scroll reveal ────────────────────────────────────────────
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal, .reveal-right').forEach(el => revealObs.observe(el));

// ── Counter animation ────────────────────────────────────────
function animateCounter(el) {
  const target = +el.dataset.target;
  const duration = 1800;
  const start = performance.now();
  (function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(ease * target);
    if (t < 1) requestAnimationFrame(tick);
  })(start);
}
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.stat-num').forEach(animateCounter);
      counterObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
const heroStats = document.querySelector('.hero-stats');
if (heroStats) counterObs.observe(heroStats);

// ── Project filter ───────────────────────────────────────────
document.getElementById('projFilters')?.addEventListener('click', e => {
  const btn = e.target.closest('.filter-btn');
  if (!btn) return;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const filter = btn.dataset.filter;
  document.querySelectorAll('.proj-card').forEach(card => {
    const match = filter === 'all' || card.dataset.category === filter;
    card.style.display = match ? '' : 'none';
  });
});

// ── Reviews slider ───────────────────────────────────────────
let revIdx = 0;
function goToRev(i) {
  const slider = document.querySelector('.reviews-slider');
  const dots   = document.querySelectorAll('.rev-dot');
  if (!slider) return;
  const count = slider.children.length;
  revIdx = (i + count) % count;
  slider.style.transform = `translateX(-${revIdx * 100}%)`;
  dots.forEach((d, j) => d.classList.toggle('active', j === revIdx));
}
document.getElementById('revPrev')?.addEventListener('click', () => goToRev(revIdx - 1));
document.getElementById('revNext')?.addEventListener('click', () => goToRev(revIdx + 1));

// Auto-advance reviews
setInterval(() => {
  if (document.querySelector('.reviews-slider')) goToRev(revIdx + 1);
}, 6000);

// ── Smooth scroll offset for fixed nav ──────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── Modal ─────────────────────────────────────────────────────
const modal        = document.getElementById('articleModal');
const modalContent = document.getElementById('modalContent');
const modalClose   = document.getElementById('modalClose');
const modalOverlay = document.getElementById('modalOverlay');

window.openModal = function(html) {
  modalContent.innerHTML = html;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
};
function closeModal() { modal.classList.remove('open'); document.body.style.overflow = ''; }
modalClose?.addEventListener('click', closeModal);
modalOverlay?.addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ── Footer year ──────────────────────────────────────────────
document.getElementById('year').textContent = new Date().getFullYear();

// ── Init language ────────────────────────────────────────────
applyLang(currentLang);

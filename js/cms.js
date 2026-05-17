/* ============================================================
   cms.js — Lokální alba + Google Sheets fallback
   ============================================================ */
'use strict';

const CMS_API_URL = 'https://script.google.com/macros/s/AKfycbw2nek2df3jPkD2Su9vvMOMEBnAEMn0eM2MvEc3PmIJxtqSv1HnSV9MZzKQgd3Bql05aQ/exec';

// ── Lokální projektová alba (reálné fotky z assets/) ────────
const PROJECTS = [
  {
    id: 1, num: '01',
    nazev: 'V klidu a pohodově', nazev_en: 'In Peace and Comfort',
    kategorie: 'rezidenční',
    popis: 'Majitel domu již má něco odžito – a právě díky tomu přesně ví, co očekává od svého domova. V rozsáhlém projektu vybavení této rodinné rezidence se odráží nejen jeho životní zkušenosti, ale i touha po harmonii, pohodlí a estetické vyváženosti. Dominantním prvkem je dotek přírodních dřevin na nábytku a obkladech, který v kombinaci se zemitými tóny v ultramatu vytváří hřejivou a nadčasovou atmosféru.',
    popis_en: 'The homeowner has lived enough to know exactly what he expects from his home. This comprehensive project reflects not only his life experience but also a desire for harmony, comfort and aesthetic balance. The dominant element is the touch of natural wood on furniture and cladding, which in combination with earthy tones in ultra-matte finish creates a warm and timeless atmosphere.',
    navrh: 'Ing. arch. Jiří Vlček / klient',
    realizace: 'Tomáš Vlček',
    vyroba: 'INFINI a.s.',
    folder: '4. realizace V klidu',
    photos: [
      '1_KUCHYNĚ BRNO.png','2_KUCHYNĚ BRNO.png','3_KUCHYNĚ BRNO.png',
      '4_KUCHYNĚ DETAIL DESKA.png','5_KUCHYNĚ DETAIL SKŘÍNĚ.png','6_KUCHYNĚ DETAIL.png',
      '9_JÍDELNÍ STŮL.png','10_JÍDELNÍ STŮL DETAIL.png','11_HOSTOVSKÝ POKOJ BRNO.png',
      '16_KNIHOVNA BRNO.png','19_KOUPELNA MASTER BRNO.png','21_KLUB BRNO.png'
    ]
  },
  {
    id: 2, num: '02',
    nazev: 'Bílá nebo Bílá', nazev_en: 'White or White',
    kategorie: 'rezidenční',
    popis: 'Čistota, světlo a vzdušnost. Projekt postavený na monochromní bílé paletě, která díky různým texturám a povrchům získává hloubku a charakter. Každý detail je promyšlený — od výběru materiálů po rozmístění nábytku.',
    popis_en: 'Purity, light and airiness. A project built on a monochromatic white palette that gains depth and character through different textures and surfaces. Every detail is carefully considered — from material selection to furniture placement.',
    navrh: 'Tomáš Vlček',
    realizace: 'Tomáš Vlček',
    folder: '2. realizace Bílá nebo Bílá',
    subfolder: 'Orig',
    photos: ['1_SR.jpg','2_SR.jpg','3_SR.jpg','4_SR.jpg','5_SR.jpg']
  },
  {
    id: 3, num: '03',
    nazev: 'Černobílá realizace', nazev_en: 'Black & White',
    kategorie: 'rezidenční',
    popis: 'Kontrast jako designový princip. Projekt využívá dramatické napětí mezi černou a bílou — dvěma barvami, které spolu vytvářejí elegantní a nadčasový interiér s výraznou osobností.',
    popis_en: 'Contrast as a design principle. The project uses the dramatic tension between black and white — two colours that together create an elegant and timeless interior with a distinct personality.',
    navrh: 'Tomáš Vlček',
    realizace: 'Tomáš Vlček',
    folder: '3. realizace Černobilá realizace',
    photos: ['1_MB.jpg','2_MB.jpg','3_MB.jpg','4_MB.jpg','5_MB.jpg']
  },
  {
    id: 4, num: '04',
    nazev: 'Rekonstrukce staršího domu', nazev_en: 'Older House Renovation',
    kategorie: 'rezidenční',
    popis: 'Přeměna staršího rodinného domu v moderní a funkční domov. Při zachování původního charakteru stavby byly doplněny moderní prvky, kvalitní materiály a chytrá úložná řešení.',
    popis_en: 'Transformation of an older family house into a modern and functional home. While preserving the original character of the building, modern elements, quality materials and smart storage solutions were added.',
    navrh: 'Tomáš Vlček',
    realizace: 'Tomáš Vlček',
    folder: '5. realizace Rek staršího domu',
    photos: ['1_BŘEVNOV.jpg','2_BŘEVNOV.jpg','3_BŘEVNOV.jpg','4_BŘEVNOV.jpg','5_BŘEVNOV.jpg']
  },
  {
    id: 5, num: '05',
    nazev: 'Malý byt s velkým efektem', nazev_en: 'Small Flat, Big Impact',
    kategorie: 'rezidenční',
    popis: 'Důkaz, že i na malém prostoru lze dosáhnout velkého designového efektu. Každý centimetr je využit s rozmyslem — inteligentní dispozice, multifunkční nábytek a promyšlená barevná paleta.',
    popis_en: 'Proof that even a small space can achieve a big design impact. Every centimetre is used thoughtfully — intelligent layout, multifunctional furniture and a carefully chosen colour palette.',
    navrh: 'Tomáš Vlček',
    realizace: 'Tomáš Vlček',
    folder: '6. realizace Malý byt s velkým efektem',
    photos: ['1_BRNO BYT.jpg','2_BRNO BYT.jpg','3_BRNO BYT.jpg','4_BRNO BYT.jpg']
  },
  {
    id: 6, num: '06',
    nazev: 'Nájem', nazev_en: 'Rental Apartment',
    kategorie: 'rezidenční',
    popis: 'Nájem nemusí znamenat kompromis na designu. Tento projekt ukazuje, jak lze i pronajatý byt proměnit ve stylový a osobitý domov s minimálními zásahy do původní dispozice.',
    popis_en: 'Renting does not have to mean compromising on design. This project shows how even a rented flat can be transformed into a stylish and distinctive home with minimal changes to the original layout.',
    navrh: 'Tomáš Vlček',
    realizace: 'Tomáš Vlček',
    folder: '7. realizace Nájem',
    photos: ['1_RUZYNĚ.jpg','2_RUZYNĚ.jpg','3_RUZYNĚ.jpg']
  },
  {
    id: 7, num: '07',
    nazev: 'Dětský pokoj', nazev_en: 'Children\'s Room',
    kategorie: 'rezidenční',
    popis: 'Hravý, bezpečný a zároveň estetický dětský pokoj, který poroste s dítětem. Flexibilní nábytek, stimulující prostředí a dostatek místa pro hraní i odpočinek.',
    popis_en: 'A playful, safe and aesthetically pleasing children\'s room that grows with the child. Flexible furniture, a stimulating environment and plenty of space for play and rest.',
    navrh: 'Tomáš Vlček',
    realizace: 'Tomáš Vlček',
    folder: '9. realizace Dětský pokoj',
    photos: ['1-edit.jpg','2-edit.jpg','3-edit.jpg','4-edit.jpg']
  },
  {
    id: 8, num: '08',
    nazev: 'Kuchyň jako srdce domu', nazev_en: 'Kitchen as the Heart of Home',
    kategorie: 'rezidenční',
    popis: 'Kuchyň je srdcem každého domova. Tento projekt klade důraz na propojení estetiky a funkčnosti — pracovní prostor, který raduje oko i usnadňuje každodenní vaření.',
    popis_en: 'The kitchen is the heart of every home. This project emphasises the connection between aesthetics and functionality — a workspace that pleases the eye and makes everyday cooking easier.',
    navrh: 'Tomáš Vlček',
    realizace: 'Tomáš Vlček',
    folder: '10. realizace Kuchyň jako srdce',
    photos: ['1_KUCHYNĚ CHMELÍK.jpg','2_CHMELÍK.jpg','3_CHMELÍK.jpg','4_CHMELÍK.jpg']
  },
  {
    id: 9, num: '09',
    nazev: 'Kuchyň s duší', nazev_en: 'Kitchen with Soul',
    kategorie: 'rezidenční',
    popis: 'Každá kuchyň má svůj příběh. Tento projekt vytváří prostor, kde se vaří s radostí a kde se rodina ráda setkává — teplé materiály, kvalitní zpracování a promyšlené detaily.',
    popis_en: 'Every kitchen has its own story. This project creates a space where cooking is a joy and where the family loves to gather — warm materials, quality craftsmanship and thoughtful details.',
    navrh: 'Tomáš Vlček',
    realizace: 'Tomáš Vlček',
    folder: '11. realizace Kuchyň s duší',
    photos: ['1_Šafr.jpg','2_Šafr.jpg','3_Šafr.jpg']
  },
  {
    id: 10, num: '10',
    nazev: 'Studentský pokoj', nazev_en: 'Student Room',
    kategorie: 'rezidenční',
    popis: 'Funkční a stylové zázemí pro studenta. Projekt řeší chytré využití prostoru, dostatek úložných míst a příjemné prostředí pro studium i relaxaci.',
    popis_en: 'Functional and stylish accommodation for a student. The project addresses smart use of space, sufficient storage and a pleasant environment for study and relaxation.',
    navrh: 'Tomáš Vlček',
    realizace: 'Tomáš Vlček',
    folder: '12. realizace Studentsky pokoj',
    photos: ['1_POKOJ.jpg','2_POKOJ.jpg','3_POKOJ.jpg']
  },
  {
    id: 11, num: '11',
    nazev: 'Výstava Miele 2008', nazev_en: 'Miele Exhibition 2008',
    kategorie: 'komerční',
    popis: 'Návrh a realizace výstavního prostoru pro značku Miele. Projekt kladl důraz na prezentaci produktů v atraktivním a funkčním designovém prostředí.',
    popis_en: 'Design and realization of an exhibition space for the Miele brand. The project focused on presenting products in an attractive and functional design environment.',
    navrh: 'Tomáš Vlček',
    realizace: 'Tomáš Vlček',
    folder: '8. realizace Výstava 2008 Miele',
    photos: ['P9290018[W].jpg','P9290019[W].jpg','P9290020[W].jpg']
  }
];

// ── Inspirace album ──────────────────────────────────────────
const INSPIRATION_PHOTOS = [
  'assets/Inspirace Dům 6/01_12.jpg',
  'assets/Inspirace Dům 6/02_12.jpg',
  'assets/Inspirace Dům 6/03_12.jpg',
  'assets/Inspirace Dům 6/04_12.jpg',
  'assets/Inspirace Dům 6/05_12.jpg',
  'assets/Inspirace Dům 6/06_12.jpg',
];

// ── Static article fallback ──────────────────────────────────
const STATIC_ARTICLES = [
  { id:1, nadpis:'Nápady pro dětský svět', nadpis_en:"Ideas for Children's Spaces", perex:'Jak navrhnout dětský pokoj, který poroste s vaším dítětem a zůstane funkční i hravý.', perex_en:"How to design a children's room that grows with your child.", foto:'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80', stitek:'Design', stitek_en:'Design', obsah:'Dětský pokoj je jedním z nejdůležitějších prostorů v domě. Měl by být bezpečný, stimulující a zároveň schopný adaptace s rostoucími potřebami dítěte. Klíčem je flexibilní nábytek a neutrální barevná paleta doplněná hravými akcenty.', obsah_en:'A children\'s room is one of the most important spaces in the home. It should be safe, stimulating and adaptable to a child\'s growing needs. The key is flexible furniture and a neutral colour palette with playful accents.' },
  { id:2, nadpis:'Mini Caffè Concept', nadpis_en:'Mini Caffè Concept', perex:'Inspirace pro tvorbu útulné kavárny s velkým designovým nápadem.', perex_en:'Inspiration for creating a cosy café with bold design ideas.', foto:'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80', stitek:'Komerční', stitek_en:'Commercial', obsah:'Malé kavárny a bistro koncepty zažívají velký boom. Úspěchem je dokonalé využití každého centimetru prostoru, konzistentní vizuální identita a materiály, které mluví samy za sebe.', obsah_en:'Small cafés and bistro concepts are booming. Success lies in the perfect use of every centimetre of space and materials that speak for themselves.' },
  { id:3, nadpis:'Barvy v interiéru a exteriéru', nadpis_en:'Colours in Interior & Exterior', perex:'Jak správně kombinovat barvy interiéru s exteriérem stavby a okolní krajinou.', perex_en:'How to harmoniously combine interior colours with the building exterior.', foto:'https://images.unsplash.com/photo-1560185127-6a6ed65f59f5?w=800&q=80', stitek:'Inspirace', stitek_en:'Inspiration', obsah:'Barevné schéma bytu nebo domu by mělo vycházet z přirozeného světla v prostoru a harmonovat s exteriérem. Neutrální základna dává svobodu ve výběru doplňků a nábytku.', obsah_en:'The colour scheme should stem from the natural light in the space and harmonise with the exterior. A neutral base gives freedom in choosing accessories and furniture.' },
  { id:4, nadpis:'Dekton — materiál budoucnosti', nadpis_en:'Dekton — Material of the Future', perex:'Inovativní povrchový materiál Dekton a jeho využití v moderním designu.', perex_en:'The innovative Dekton surface material and its applications in modern design.', foto:'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80', stitek:'Materiály', stitek_en:'Materials', obsah:'Deskovina Dekton je nový inovativní materiál na bázi přírodního skla, keramiky a křemene. Je extrémně pevný, odolný proti poškrábání, tepelně odolný a neuvěřitelně nízkoúdržbový.', obsah_en:'Dekton is based on natural glass, ceramics and quartz. It is extremely strong, scratch-resistant, heat-resistant and incredibly low-maintenance.' },
];

// ── Helper: get photo path ───────────────────────────────────
function photoPath(p, filename) {
  const sub = p.subfolder ? `/${p.subfolder}` : '';
  return encodeURI(`assets/${p.folder}${sub}/${filename}`);
}

// ── Render: Projects grid ─────────────────────────────────────
function renderProjects(lang) {
  const grid = document.getElementById('projectGrid');
  if (!grid) return;
  grid.innerHTML = PROJECTS.map(p => {
    const name  = lang === 'en' && p.nazev_en ? p.nazev_en : p.nazev;
    const cover = photoPath(p, p.photos[0]);
    const viewTxt = lang === 'en' ? 'View project →' : 'Zobrazit realizaci →';
    return `
    <a href="project.html?id=${p.id}" class="proj-card reveal" data-id="${p.id}">
      <img src="${cover}" alt="${name}" loading="lazy" onerror="this.src='assets/hero.jpg'">
      <div class="proj-overlay">
        <p class="proj-cat">${p.num} — ${p.kategorie}</p>
        <p class="proj-name">${name}</p>
        <p class="proj-arrow">${viewTxt}</p>
      </div>
    </a>`;
  }).join('');
  grid.querySelectorAll('.reveal').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 80 * i);
  });
  window._currentLang = lang;
}

// ── Render: Project Modal ─────────────────────────────────────
window.openProject = function(id) {
  const lang = window._currentLang || 'cs';
  const p = PROJECTS.find(x => x.id === id);
  if (!p) return;
  const name  = lang === 'en' && p.nazev_en ? p.nazev_en : p.nazev;
  const desc  = lang === 'en' && p.popis_en ? p.popis_en : p.popis;
  const lbl   = { navrh: lang==='en'?'Design':'Návrh', real: lang==='en'?'Realization':'Realizace', vyr: lang==='en'?'Production':'Výroba', ctaL: lang==='en'?'Request similar project':'Poptejte podobný projekt' };

  const photos = p.photos.map(f => photoPath(p, f));
  const thumbsHtml = photos.map((src, i) =>
    `<img src="${src}" class="modal-thumb${i===0?' active':''}" data-idx="${i}" alt="" loading="lazy" onerror="this.style.display='none'">`
  ).join('');

  document.getElementById('modalInner').innerHTML = `
    <div class="modal-gallery">
      <img id="modalMainImg" class="modal-main-img" src="${photos[0]}" alt="${name}" onclick="openLightbox(${id}, 0)">
      <div class="modal-thumbs">${thumbsHtml}</div>
    </div>
    <div class="modal-info">
      <p class="modal-num">${p.num}</p>
      <h2 class="modal-title">${name}</h2>
      <div class="modal-meta">
        <div class="modal-meta-row"><span class="modal-meta-key">${lbl.navrh}</span><span>${p.navrh || 'Tomáš Vlček'}</span></div>
        <div class="modal-meta-row"><span class="modal-meta-key">${lbl.real}</span><span>${p.realizace || 'Tomáš Vlček'}</span></div>
        ${p.vyroba ? `<div class="modal-meta-row"><span class="modal-meta-key">${lbl.vyr}</span><span>${p.vyroba}</span></div>` : ''}
      </div>
      <p class="modal-desc">${desc}</p>
      <a href="#kontakt" class="btn-primary modal-cta" onclick="closeProjectModal()">${lbl.ctaL}</a>
    </div>`;

  // Thumb click → change main image
  document.querySelectorAll('.modal-thumb').forEach(th => {
    th.addEventListener('click', () => {
      document.querySelectorAll('.modal-thumb').forEach(t => t.classList.remove('active'));
      th.classList.add('active');
      document.getElementById('modalMainImg').src = photos[+th.dataset.idx];
      document.getElementById('modalMainImg').onclick = () => openLightbox(id, +th.dataset.idx);
    });
  });

  const modal = document.getElementById('projectModal');
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  window._activeLightboxPhotos = photos;
};

window.closeProjectModal = function() {
  document.getElementById('projectModal').classList.remove('open');
  document.body.style.overflow = '';
};
document.getElementById('modalClose')?.addEventListener('click', closeProjectModal);
document.getElementById('modalOverlay')?.addEventListener('click', closeProjectModal);

// ── Lightbox ─────────────────────────────────────────────────
let lbPhotos = [], lbIdx = 0;

window.openLightbox = function(projectId, startIdx) {
  const p = PROJECTS.find(x => x.id === projectId);
  if (!p) return;
  lbPhotos = p.photos.map(f => photoPath(p, f));
  lbIdx = startIdx || 0;
  updateLightbox();
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
};

function updateLightbox() {
  document.getElementById('lbImg').src = lbPhotos[lbIdx];
  document.getElementById('lbCounter').textContent = `${lbIdx + 1} / ${lbPhotos.length}`;
}

document.getElementById('lbClose')?.addEventListener('click', () => {
  document.getElementById('lightbox').classList.remove('open');
});
document.getElementById('lbOverlay')?.addEventListener('click', () => {
  document.getElementById('lightbox').classList.remove('open');
});
document.getElementById('lbPrev')?.addEventListener('click', () => {
  lbIdx = (lbIdx - 1 + lbPhotos.length) % lbPhotos.length;
  updateLightbox();
});
document.getElementById('lbNext')?.addEventListener('click', () => {
  lbIdx = (lbIdx + 1) % lbPhotos.length;
  updateLightbox();
});
document.addEventListener('keydown', e => {
  if (!document.getElementById('lightbox').classList.contains('open')) return;
  if (e.key === 'ArrowLeft')  { lbIdx = (lbIdx - 1 + lbPhotos.length) % lbPhotos.length; updateLightbox(); }
  if (e.key === 'ArrowRight') { lbIdx = (lbIdx + 1) % lbPhotos.length; updateLightbox(); }
  if (e.key === 'Escape') document.getElementById('lightbox').classList.remove('open');
});

// ── Render: Articles ─────────────────────────────────────────
function renderArticles(data, lang) {
  const grid = document.getElementById('articlesGrid');
  if (!grid) return;
  grid.innerHTML = data.map(a => {
    const title   = lang === 'en' && a.nadpis_en ? a.nadpis_en : a.nadpis;
    const excerpt = lang === 'en' && a.perex_en  ? a.perex_en  : a.perex;
    const tag     = lang === 'en' && a.stitek_en ? a.stitek_en : a.stitek;
    const more    = lang === 'en' ? 'Read more' : 'Číst více';
    return `
    <div class="art-card reveal" onclick="openArticleModal(${a.id})">
      <div class="art-thumb"><img src="${a.foto || a.foto_url || ''}" alt="${title}" loading="lazy"></div>
      <div class="art-body">
        <p class="art-tag">${tag || ''}</p>
        <h3 class="art-title">${title}</h3>
        <p class="art-excerpt">${excerpt}</p>
        <span class="art-more">${more} →</span>
      </div>
    </div>`;
  }).join('');
  window._articleData = data;
}

window.openArticleModal = function(id) {
  const lang = window._currentLang || 'cs';
  const a = (window._articleData || STATIC_ARTICLES).find(x => x.id === id);
  if (!a) return;
  const title   = lang === 'en' && a.nadpis_en ? a.nadpis_en : a.nadpis;
  const content = lang === 'en' && a.obsah_en  ? a.obsah_en  : a.obsah;
  const tag     = lang === 'en' && a.stitek_en ? a.stitek_en : a.stitek;
  document.getElementById('modalInner').innerHTML = `
    <div style="grid-column:1/-1">
      ${a.foto ? `<img src="${a.foto || a.foto_url}" alt="${title}" style="width:100%;max-height:340px;object-fit:cover;">` : ''}
      <div style="padding:2.5rem">
        <p class="modal-num">${tag || ''}</p>
        <h2 class="modal-title">${title}</h2>
        <p class="modal-desc">${content || ''}</p>
      </div>
    </div>`;
  document.getElementById('projectModal').classList.add('open');
  document.body.style.overflow = 'hidden';
};

// ── Render: Inspiration ──────────────────────────────────────
function renderInspiration() {
  const grid = document.getElementById('inspirationGrid');
  if (!grid) return;
  // Try to list the inspiration folder photos
  const photos = INSPIRATION_PHOTOS;
  grid.innerHTML = photos.map((src, i) => `
    <div class="ins-item reveal" onclick="openInspirationLightbox(${i})">
      <img src="${src}" alt="Inspirace ${i+1}" loading="lazy" onerror="this.parentElement.style.display='none'">
    </div>`).join('');
}

window.openInspirationLightbox = function(startIdx) {
  lbPhotos = INSPIRATION_PHOTOS;
  lbIdx = startIdx;
  updateLightbox();
  document.getElementById('lightbox').classList.add('open');
};

// ── Main render ──────────────────────────────────────────────
window.renderCMS = function(lang) {
  lang = lang || 'cs';
  window._currentLang = lang;

  // Projects always from local albums
  renderProjects(lang);

  // Inspiration
  renderInspiration();

  // Articles: try API first, fallback to static
  if (CMS_API_URL && CMS_API_URL !== 'YOUR_APPS_SCRIPT_URL_HERE') {
    fetch(`${CMS_API_URL}?action=articles`)
      .then(r => r.json())
      .then(data => {
        const arts = (data.articles || []).map(o => ({ ...o, foto: o.foto || o.foto_url || '' }));
        renderArticles(arts.length ? arts : STATIC_ARTICLES, lang);
      })
      .catch(() => renderArticles(STATIC_ARTICLES, lang));
  } else {
    renderArticles(STATIC_ARTICLES, lang);
  }
};

window.renderCMS(localStorage.getItem('tv_lang') || 'cs');

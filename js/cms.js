/* ============================================================
   cms.js — Google Sheets data + static fallback
   ============================================================ */

'use strict';

// ── CONFIG — replace with your Apps Script Web App URL ──────
const CMS_API_URL = 'YOUR_APPS_SCRIPT_URL_HERE';

// ── Static fallback data (used until Google Sheets is set up)
const STATIC = {
  projects: [
    { id:1, nazev:'Vila Průhonice', nazev_en:'Průhonice Villa', popis:'Komplexní realizace rezidenčního interiéru rodinné vily.', popis_en:'Complete residential interior realization of a family villa.', kategorie:'rezidenční', foto:'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80' },
    { id:2, nazev:'Penthouse Praha', nazev_en:'Prague Penthouse', popis:'Luxusní penthouse s výhledem na Prahu. Otevřený prostor, přírodní materiály.', popis_en:'Luxury penthouse overlooking Prague. Open space, natural materials.', kategorie:'rezidenční', foto:'https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=800&q=80' },
    { id:3, nazev:'Mini Caffè Concept', nazev_en:'Mini Caffè Concept', popis:'Návrh a realizace moderní kavárny s důrazem na materiálovou autenticitu.', popis_en:'Design and realization of a modern café with emphasis on material authenticity.', kategorie:'komerční', foto:'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80' },
    { id:4, nazev:'Apartmán Beroun', nazev_en:'Beroun Apartment', popis:'Přeměna staršího bytu v moderní vzdušný apartmán pro mladou rodinu.', popis_en:'Transformation of an older apartment into a modern airy space for a young family.', kategorie:'rezidenční', foto:'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80' },
    { id:5, nazev:'Kancelářský prostor', nazev_en:'Office Space', popis:'Moderní kancelářský interiér pro kreativní agenturu.', popis_en:'Modern office interior for a creative agency.', kategorie:'komerční', foto:'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80' },
    { id:6, nazev:'Dům u lesa', nazev_en:'House by the Forest', popis:'Venkovský dům s přirozeným propojením s okolní přírodou.', popis_en:'Country house with a natural connection to the surrounding nature.', kategorie:'rezidenční', foto:'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80' },
  ],
  articles: [
    { id:1, nadpis:'Nápady pro dětský svět', nadpis_en:'Ideas for Children\'s Spaces', perex:'Jak navrhnout dětský pokoj, který poroste s vaším dítětem a zůstane funkční i hravý.', perex_en:'How to design a children\'s room that grows with your child and remains functional and playful.', foto:'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80', stitek:'Design', stitek_en:'Design', obsah:'Dětský pokoj je jedním z nejdůležitějších prostorů v domě. Měl by být bezpečný, stimulující a zároveň schopný adaptace s rostoucími potřebami dítěte. Klíčem je flexibilní nábytek a neutrální barevná paleta doplněná hravými akcenty. Pamatujte, že děti potřebují prostor nejen ke hraní, ale i ke studiu a odpočinku — dobré uspořádání zón je základem.', obsah_en:'A children\'s room is one of the most important spaces in the home. It should be safe, stimulating and adaptable to a child\'s growing needs. The key is flexible furniture and a neutral color palette accented with playful touches. Remember that children need space not only for play but also for study and rest — good zone arrangement is fundamental.' },
    { id:2, nadpis:'Mini Caffè Concept', nadpis_en:'Mini Caffè Concept', perex:'Inspirace pro tvorbu útulné kavárny nebo malého pohostinského prostoru s velkým designovým nápadem.', perex_en:'Inspiration for creating a cosy café or small hospitality space with big design ideas.', foto:'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80', stitek:'Komerční', stitek_en:'Commercial', obsah:'Malé kavárny a bistro koncepty zažívají velký boom. Úspěchem je dokonalé využití každého centimetru prostoru, konzistentní vizuální identita a materiály, které mluví samy za sebe. Autentičnost je klíčová — hosté chtějí zažít příběh místa, ne jen vypít kávu.', obsah_en:'Small cafés and bistro concepts are experiencing a major boom. Success lies in perfect use of every centimeter, consistent visual identity and materials that speak for themselves. Authenticity is key — guests want to experience the story of a place, not just drink coffee.' },
    { id:3, nadpis:'Barvy v interiéru a exteriéru', nadpis_en:'Colours in Interior & Exterior', perex:'Jak správně kombinovat barvy interiéru s exteriérem stavby a okolní krajinou.', perex_en:'How to correctly combine interior colours with the building exterior and surrounding landscape.', foto:'https://images.unsplash.com/photo-1560185127-6a6ed65f59f5?w=800&q=80', stitek:'Inspirace', stitek_en:'Inspiration', obsah:'Barevné schéma bytu nebo domu by mělo vycházet z přirozeného světla v prostoru a harmonovat s exteriérem. Neutrální základna — bílá, béžová, šedá — dává svobodu ve výběru doplňků a nábytku. Akcenty v barvách přírody přinesou harmonii a nadčasovost.', obsah_en:'The color scheme of an apartment or house should stem from the natural light in the space and harmonize with the exterior. A neutral base — white, beige, gray — gives freedom in choosing accessories and furniture. Accents in natural colors bring harmony and timelessness.' },
    { id:4, nadpis:'Dekton — materiál budoucnosti', nadpis_en:'Dekton — Material of the Future', perex:'Inovativní povrchový materiál Dekton a jeho využití v moderním interiérovém designu.', perex_en:'Innovative Dekton surface material and its use in modern interior design.', foto:'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80', stitek:'Materiály', stitek_en:'Materials', obsah:'Dekton je ultrakompatní povrch vyrobený pokročilou technologií slinování. Je odolný vůči škrábancům, teplu, UV záření i vlhkosti. Ideální volba pro kuchyňské pracovní desky, obklady koupelen i venkovní fasády. Jeho estetika soupeří s přírodním kamenem, ale nabízí výrazně vyšší odolnost.', obsah_en:'Dekton is an ultra-compact surface made with advanced sintering technology. It is resistant to scratches, heat, UV radiation and moisture. The ideal choice for kitchen worktops, bathroom cladding and exterior facades. Its aesthetics rival natural stone but offer significantly higher durability.' },
  ],
  reviews: [
    { jmeno:'Martina K.', text:'Tomáš přeměnil náš starý byt v krásný moderní domov. Jeho přístup k detailu a trpělivost při konzultacích jsou výjimečné. Výsledek předčil naše očekávání.', text_en:'Tomáš transformed our old apartment into a beautiful modern home. His attention to detail and patience during consultations are exceptional. The result exceeded our expectations.', hodnoceni:5 },
    { jmeno:'Petr & Jana V.', text:'Profesionální přístup od prvního setkání až po předání hotového interiéru. Tomáš rozumí klientovým potřebám a umí je proměnit ve funkční a estetický celek.', text_en:'Professional approach from the first meeting to the handover of the finished interior. Tomáš understands client needs and can turn them into a functional and aesthetic whole.', hodnoceni:5 },
    { jmeno:'Radek M.', text:'Spolupráce na komerčním projektu probíhala hladce a v termínu. Výsledný interiér je přesně to, co jsme si přáli — moderní, elegantní a funkční.', text_en:'Collaboration on the commercial project ran smoothly and on time. The resulting interior is exactly what we wanted — modern, elegant and functional.', hodnoceni:5 },
  ]
};

// ── Render functions ──────────────────────────────────────────
function renderProjects(data, lang) {
  const grid = document.getElementById('projectGrid');
  if (!grid) return;
  grid.innerHTML = data.map(p => {
    const name = lang === 'en' && p.nazev_en ? p.nazev_en : p.nazev;
    return `
    <div class="proj-card reveal" data-category="${p.kategorie}" onclick="openProjectModal(${p.id})">
      <img src="${p.foto}" alt="${name}" loading="lazy">
      <div class="proj-overlay">
        <p class="proj-cat">${p.kategorie}</p>
        <p class="proj-name">${name}</p>
      </div>
    </div>`;
  }).join('');
  // Re-observe for reveal
  grid.querySelectorAll('.reveal').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(40px)';
    setTimeout(() => { el.classList.add('visible'); }, 100);
  });
  window._projectData = data;
  window._currentLang = lang;
}

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
      <div class="art-thumb"><img src="${a.foto}" alt="${title}" loading="lazy"></div>
      <div class="art-body">
        <p class="art-tag">${tag}</p>
        <h3 class="art-title">${title}</h3>
        <p class="art-excerpt">${excerpt}</p>
        <span class="art-more">${more} →</span>
      </div>
    </div>`;
  }).join('');
  grid.querySelectorAll('.reveal').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(40px)';
    setTimeout(() => { el.classList.add('visible'); }, 150);
  });
  window._articleData = data;
}

function renderReviews(data, lang) {
  const track = document.getElementById('reviewsTrack');
  const dotsEl = document.getElementById('revDots');
  if (!track) return;

  const slider = document.createElement('div');
  slider.className = 'reviews-slider';
  slider.innerHTML = data.map(r => {
    const text = lang === 'en' && r.text_en ? r.text_en : r.text;
    const stars = '★'.repeat(r.hodnoceni || 5);
    return `
    <div class="rev-card">
      <div class="rev-stars">${stars}</div>
      <p class="rev-text">"${text}"</p>
      <p class="rev-author">— ${r.jmeno}</p>
    </div>`;
  }).join('');
  track.innerHTML = '';
  track.appendChild(slider);

  if (dotsEl) {
    dotsEl.innerHTML = data.map((_, i) =>
      `<span class="rev-dot${i===0?' active':''}" onclick="goToRev(${i})"></span>`
    ).join('');
  }
  // expose goToRev globally (defined in main.js) after slider is ready
  window.goToRev && window.goToRev(0);
}

// ── Modal openers ────────────────────────────────────────────
window.openProjectModal = function(id) {
  const lang = window._currentLang || 'cs';
  const p = (window._projectData || STATIC.projects).find(x => x.id === id);
  if (!p || !window.openModal) return;
  const name = lang === 'en' && p.nazev_en ? p.nazev_en : p.nazev;
  const desc = lang === 'en' && p.popis_en  ? p.popis_en  : p.popis;
  window.openModal(`
    <img src="${p.foto}" alt="${name}">
    <span class="art-tag">${p.kategorie}</span>
    <h2>${name}</h2>
    <p>${desc}</p>
  `);
};

window.openArticleModal = function(id) {
  const lang = window._currentLang || 'cs';
  const a = (window._articleData || STATIC.articles).find(x => x.id === id);
  if (!a || !window.openModal) return;
  const title   = lang === 'en' && a.nadpis_en ? a.nadpis_en : a.nadpis;
  const content = lang === 'en' && a.obsah_en  ? a.obsah_en  : a.obsah;
  const tag     = lang === 'en' && a.stitek_en ? a.stitek_en : a.stitek;
  window.openModal(`
    <img src="${a.foto}" alt="${title}">
    <span class="art-tag">${tag}</span>
    <h2>${title}</h2>
    <p>${content}</p>
  `);
};

// ── Main render (called on load and lang switch) ─────────────
window.renderCMS = function(lang) {
  lang = lang || 'cs';
  if (CMS_API_URL === 'YOUR_APPS_SCRIPT_URL_HERE') {
    // Use static data
    renderProjects(STATIC.projects, lang);
    renderArticles(STATIC.articles, lang);
    renderReviews(STATIC.reviews, lang);
    return;
  }
  // Fetch from Google Sheets API
  fetch(`${CMS_API_URL}?action=all`)
    .then(r => r.json())
    .then(data => {
      if (data.projects) renderProjects(data.projects, lang);
      else renderProjects(STATIC.projects, lang);
      if (data.articles) renderArticles(data.articles, lang);
      else renderArticles(STATIC.articles, lang);
      if (data.reviews)  renderReviews(data.reviews, lang);
      else renderReviews(STATIC.reviews, lang);
    })
    .catch(() => {
      renderProjects(STATIC.projects, lang);
      renderArticles(STATIC.articles, lang);
      renderReviews(STATIC.reviews, lang);
    });
};

// Initial render
window.renderCMS(localStorage.getItem('tv_lang') || 'cs');

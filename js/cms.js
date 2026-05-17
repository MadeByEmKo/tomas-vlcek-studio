/* ============================================================
   cms.js — Lokální alba + Google Sheets fallback
   ============================================================ */
'use strict';

const CMS_API_URL = 'https://script.google.com/macros/s/AKfycbw2nek2df3jPkD2Su9vvMOMEBnAEMn0eM2MvEc3PmIJxtqSv1HnSV9MZzKQgd3Bql05aQ/exec';
const ASSET_MANIFEST_URL = 'assets/asset-manifest.json';

window.PROJECTS = [];
window.INSPIRATIONS = [];
window.assetManifestPromise = null;

async function loadAssetManifest() {
  if (!window.assetManifestPromise) {
    window.assetManifestPromise = fetch(ASSET_MANIFEST_URL)
      .then(response => {
        if (!response.ok) throw new Error(`Unable to load asset manifest: ${response.status}`);
        return response.json();
      })
      .then(data => {
        const projects = (data.projects || []).map(p => ({
          id: p.id,
          num: p.num,
          folder: p.folder,
          nazev: p.title || p.folder,
          nazev_en: p.title || p.folder,
          popis: p.description || '',
          popis_en: p.description || '',
          kategorie: p.category || 'Realizace',
          navrh: p.design || '',
          realizace: p.realizace || '',
          vyroba: p.vyroba || '',
          photos: p.photos || [],
        }));
        window.PROJECTS = projects;
        window.INSPIRATIONS = data.inspirations || [];
        return { projects: window.PROJECTS, inspirations: window.INSPIRATIONS };
      })
      .catch(error => {
        console.warn('Asset manifest loading failed:', error);
        window.PROJECTS = [];
        window.INSPIRATIONS = [];
        return { projects: [], inspirations: [] };
      });
  }
  return window.assetManifestPromise;
}

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
        <p class="proj-cat">${p.num} — ${p.kategorie || 'Realizace'}</p>
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

function renderInspiration(lang) {
  const grid = document.getElementById('inspirationGrid');
  if (!grid) return;
  grid.innerHTML = INSPIRATIONS.map((album, idx) => {
    const title = album.title || album.folder;
    const desc = album.description ? album.description.split('\n')[0] : '';
    const cover = album.photos[0] ? photoPath(album, album.photos[0]) : 'assets/hero.jpg';
    const viewTxt = lang === 'en' ? 'View inspiration →' : 'Zobrazit inspiraci →';
    return `
      <button type="button" class="insp-card reveal" onclick="openInspirationLightbox(${idx})">
        <img src="${cover}" alt="${title}" loading="lazy" onerror="this.src='assets/hero.jpg'">
        <div class="insp-overlay">
          <p class="insp-title">${title}</p>
          ${desc ? `<p class="insp-desc">${desc}</p>` : ''}
          <span class="insp-arrow">${viewTxt}</span>
        </div>
      </button>`;
  }).join('');
  grid.querySelectorAll('.reveal').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 80 * i);
  });
}

window.openInspirationLightbox = function(albumIndex) {
  const album = INSPIRATIONS[albumIndex];
  if (!album) return;
  lbPhotos = album.photos.map(f => photoPath(album, f));
  lbIdx = 0;
  updateLightbox();
  document.getElementById('lightbox').classList.add('open');
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

// ── Main render ──────────────────────────────────────────────
window.renderCMS = async function(lang) {
  lang = lang || 'cs';
  window._currentLang = lang;

  await loadAssetManifest();

  // Projects always from local albums
  renderProjects(lang);

  // Inspiration
  renderInspiration(lang);

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

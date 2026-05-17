/* ============================================================
   cms.js — Načítání z asset-manifest.json + Google Sheets
   Fotky rozděleny do záložek: Realizace / Původní / 3D
   ============================================================ */
'use strict';

const CMS_API_URL = 'https://script.google.com/macros/s/AKfycbw2nek2df3jPkD2Su9vvMOMEBnAEMn0eM2MvEc3PmIJxtqSv1HnSV9MZzKQgd3Bql05aQ/exec';
const MANIFEST_URL = 'assets/asset-manifest.json';

// Globální stav
let PROJECTS = [];
let INSPIRATIONS = { folder: '', photos: [] };
let _manifestLoaded = false;
let _manifestPromise = null;

// ── Načti manifest ────────────────────────────────────────────
function loadManifest() {
  if (_manifestPromise) return _manifestPromise;
  _manifestPromise = fetch(MANIFEST_URL)
    .then(r => { if (!r.ok) throw new Error('Manifest not found'); return r.json(); })
    .then(data => {
      // Seřaď projekty podle num (01, 02, ...)
      PROJECTS = (data.projects || []).sort((a, b) => a.num.localeCompare(b.num));
      INSPIRATIONS = data.inspirations || { folder: '', photos: [] };
      _manifestLoaded = true;
      return data;
    })
    .catch(err => {
      console.warn('asset-manifest.json se nepodařilo načíst:', err);
      _manifestLoaded = true;
      return {};
    });
  return _manifestPromise;
}

// ── Statické záložní články ───────────────────────────────────
const STATIC_ARTICLES = [
  { id:1, nadpis:'Nápady pro dětský svět', nadpis_en:"Ideas for Children's Spaces",
    perex:'Jak navrhnout dětský pokoj, který poroste s vaším dítětem.', perex_en:"How to design a children's room that grows with your child.",
    foto:'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80', stitek:'Design', stitek_en:'Design',
    obsah:'Dětský pokoj je jedním z nejdůležitějších prostorů v domě. Měl by být bezpečný, stimulující a zároveň schopný adaptace s rostoucími potřebami dítěte. Klíčem je flexibilní nábytek a neutrální barevná paleta doplněná hravými akcenty.',
    obsah_en:"A children's room should be safe, stimulating and adaptable. The key is flexible furniture and a neutral colour palette with playful accents." },
  { id:2, nadpis:'Mini Caffè Concept', nadpis_en:'Mini Caffè Concept',
    perex:'Inspirace pro tvorbu útulné kavárny s velkým designovým nápadem.', perex_en:'Inspiration for creating a cosy café with bold design ideas.',
    foto:'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80', stitek:'Komerční', stitek_en:'Commercial',
    obsah:'Malé kavárny a bistro koncepty zažívají velký boom. Úspěchem je dokonalé využití každého centimetru prostoru, konzistentní vizuální identita a materiály, které mluví samy za sebe.',
    obsah_en:'Small cafés are booming. Success lies in perfect use of every centimetre of space and materials that speak for themselves.' },
  { id:3, nadpis:'Barvy v interiéru a exteriéru', nadpis_en:'Colours in Interior & Exterior',
    perex:'Jak správně kombinovat barvy interiéru s exteriérem stavby.', perex_en:'How to harmoniously combine interior colours with the exterior.',
    foto:'https://images.unsplash.com/photo-1560185127-6a6ed65f59f5?w=800&q=80', stitek:'Inspirace', stitek_en:'Inspiration',
    obsah:'Barevné schéma bytu nebo domu by mělo vycházet z přirozeného světla v prostoru a harmonovat s exteriérem. Neutrální základna dává svobodu ve výběru doplňků a nábytku.',
    obsah_en:'The colour scheme should stem from natural light and harmonise with the exterior. A neutral base gives freedom in choosing accessories.' },
  { id:4, nadpis:'Dekton — materiál budoucnosti', nadpis_en:'Dekton — Material of the Future',
    perex:'Inovativní povrchový materiál Dekton a jeho využití v designu.', perex_en:'The innovative Dekton surface material in modern design.',
    foto:'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80', stitek:'Materiály', stitek_en:'Materials',
    obsah:'Deskovina Dekton je materiál na bázi přírodního skla, keramiky a křemene. Je extrémně pevný, odolný proti škrábancům, tepelně odolný a nízkoúdržbový.',
    obsah_en:'Dekton is based on natural glass, ceramics and quartz. Extremely strong, scratch-resistant, heat-resistant and low-maintenance.' },
];

// ── Helper: URL cesta k fotce ─────────────────────────────────
function photoUrl(project, groupName, filename) {
  const base = `assets/${project.folder}`;
  // Zkontroluj jestli je skupina (Realizace je přímo v root nebo ve složce)
  const hasGroup = project.photoGroups && project.photoGroups[groupName] !== undefined;
  if (hasGroup && groupName !== 'Realizace') {
    return encodeURI(`${base}/${groupName}/${filename}`);
  }
  // Realizace: zkus root, pak složku
  return encodeURI(`${base}/${filename}`);
}

// ── Render: Projects grid ─────────────────────────────────────
function renderProjects(lang) {
  const grid = document.getElementById('projectGrid');
  if (!grid || !PROJECTS.length) { if(grid) grid.innerHTML = '<p style="text-align:center;color:#aaa;padding:3rem">Projekty se načítají...</p>'; return; }

  grid.innerHTML = PROJECTS.map(p => {
    const name  = lang === 'en' && p.title_en ? p.title_en : p.title;
    // Titulní foto — z Realizace, nebo z kořene
    const groups = p.photoGroups || {};
    const realPhotos = groups['Realizace'] || groups['realizace'] || [];
    const firstPhoto = realPhotos[0] || Object.values(groups).flat()[0];
    const coverSrc = firstPhoto ? photoUrl(p, 'Realizace', firstPhoto) : 'assets/hero.jpg';
    const viewTxt  = lang === 'en' ? 'View project →' : 'Zobrazit realizaci →';
    const catLabel = p.category === 'komerční' ? (lang==='en'?'Commercial':'Komerční') : (lang==='en'?'Residential':'Rezidenční');

    return `
    <div class="proj-card reveal" data-id="${p.id}" onclick="openProject(${p.id})">
      <img src="${coverSrc}" alt="${name}" loading="lazy" onerror="this.src='assets/hero.jpg'">
      <div class="proj-overlay">
        <p class="proj-cat">${p.num} — ${catLabel}</p>
        <p class="proj-name">${name}</p>
        <p class="proj-arrow">${viewTxt}</p>
      </div>
    </div>`;
  }).join('');

  grid.querySelectorAll('.reveal').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 60 * i);
  });
  window._currentLang = lang;
}

// ── Render: Project Modal (záložky Realizace / Původní / 3D) ──
window.openProject = function(id) {
  const lang = window._currentLang || 'cs';
  const p = PROJECTS.find(x => x.id === id);
  if (!p) return;

  const name = lang === 'en' && p.title_en ? p.title_en : p.title;
  const desc = lang === 'en' && p.description_en ? p.description_en : p.description || '';

  const lbl = {
    navrh:  lang==='en' ? 'Design'       : 'Návrh',
    real:   lang==='en' ? 'Realization'  : 'Realizace',
    vyr:    lang==='en' ? 'Production'   : 'Výroba nábytku',
    stav:   lang==='en' ? 'Construction' : 'Stavební příprava',
    cta:    lang==='en' ? 'Request similar project' : 'Poptejte podobný projekt',
    tabs: { 'Realizace': lang==='en'?'Realization':'Realizace', 'Původní': lang==='en'?'Before':'Původní stav', '3D': '3D vizualizace' }
  };

  const groups = p.photoGroups || {};
  // Záložky — jen ty které mají fotky, vždy Realizace první
  const tabOrder = ['Realizace', 'Původní', '3D'];
  const availTabs = tabOrder.filter(t => groups[t] && groups[t].length > 0);
  if (availTabs.length === 0) { console.warn('No photos for project', p.id); return; }

  const firstTab  = availTabs[0];
  const firstPhotos = groups[firstTab];
  const firstSrc  = photoUrl(p, firstTab, firstPhotos[0]);

  // Záložky HTML
  const tabsHtml = availTabs.length > 1
    ? `<div class="modal-tabs">${availTabs.map((t,i) => `<button class="modal-tab${i===0?' active':''}" data-tab="${t}">${lbl.tabs[t] || t}</button>`).join('')}</div>`
    : '';

  // Thumbnaily (první záložka)
  const thumbsHtml = firstPhotos.map((f, i) => {
    const src = photoUrl(p, firstTab, f);
    return `<img src="${src}" class="modal-thumb${i===0?' active':''}" data-idx="${i}" data-tab="${firstTab}" alt="" loading="lazy" onerror="this.style.display='none'">`;
  }).join('');

  // Meta info
  const metaRows = [
    p.design    ? `<div class="modal-meta-row"><span class="modal-meta-key">${lbl.navrh}</span><span>${p.design}</span></div>` : '',
    p.realizace ? `<div class="modal-meta-row"><span class="modal-meta-key">${lbl.real}</span><span>${p.realizace}</span></div>` : '',
    p.vyroba    ? `<div class="modal-meta-row"><span class="modal-meta-key">${lbl.vyr}</span><span>${p.vyroba}</span></div>` : '',
    p.stavebni  ? `<div class="modal-meta-row"><span class="modal-meta-key">${lbl.stav}</span><span>${p.stavebni}</span></div>` : '',
  ].filter(Boolean).join('');

  document.getElementById('modalInner').innerHTML = `
    <div class="modal-gallery">
      ${tabsHtml}
      <img id="modalMainImg" class="modal-main-img" src="${firstSrc}" alt="${name}" onclick="openLightbox(${p.id}, '${firstTab}', 0)" style="cursor:zoom-in">
      <div class="modal-thumbs" id="modalThumbs">${thumbsHtml}</div>
    </div>
    <div class="modal-info">
      <p class="modal-num">${p.num}</p>
      <h2 class="modal-title">${name}</h2>
      ${metaRows ? `<div class="modal-meta">${metaRows}</div>` : ''}
      ${desc ? `<p class="modal-desc">${desc}</p>` : ''}
      <a href="#kontakt" class="btn-primary modal-cta" onclick="closeProjectModal()">${lbl.cta}</a>
    </div>`;

  // Záložky — přepínání
  document.querySelectorAll('.modal-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      document.querySelectorAll('.modal-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tabPhotos = groups[tab] || [];
      const newThumbs = tabPhotos.map((f, i) => {
        const src = photoUrl(p, tab, f);
        return `<img src="${src}" class="modal-thumb${i===0?' active':''}" data-idx="${i}" data-tab="${tab}" alt="" loading="lazy" onerror="this.style.display='none'">`;
      }).join('');
      document.getElementById('modalThumbs').innerHTML = newThumbs;
      if (tabPhotos[0]) {
        document.getElementById('modalMainImg').src = photoUrl(p, tab, tabPhotos[0]);
        document.getElementById('modalMainImg').onclick = () => openLightbox(p.id, tab, 0);
      }
      attachThumbEvents(p, groups);
    });
  });

  attachThumbEvents(p, groups);

  document.getElementById('projectModal').classList.add('open');
  document.body.style.overflow = 'hidden';
};

function attachThumbEvents(p, groups) {
  document.querySelectorAll('.modal-thumb').forEach(th => {
    th.addEventListener('click', () => {
      document.querySelectorAll('.modal-thumb').forEach(t => t.classList.remove('active'));
      th.classList.add('active');
      const tab = th.dataset.tab;
      const idx = +th.dataset.idx;
      const photos = groups[tab] || [];
      const src = photoUrl(p, tab, photos[idx]);
      document.getElementById('modalMainImg').src = src;
      document.getElementById('modalMainImg').onclick = () => openLightbox(p.id, tab, idx);
    });
  });
}

window.closeProjectModal = function() {
  document.getElementById('projectModal').classList.remove('open');
  document.body.style.overflow = '';
};
document.getElementById('modalClose')?.addEventListener('click', closeProjectModal);
document.getElementById('modalOverlay')?.addEventListener('click', closeProjectModal);

// ── Lightbox ─────────────────────────────────────────────────
let lbPhotos = [], lbIdx = 0;

window.openLightbox = function(projectId, tabName, startIdx) {
  const p = PROJECTS.find(x => x.id === projectId);
  if (!p) return;
  const groups = p.photoGroups || {};
  const tabPhotos = groups[tabName] || [];
  lbPhotos = tabPhotos.map(f => photoUrl(p, tabName, f));
  lbIdx = startIdx || 0;
  updateLightbox();
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.openInspirationLightbox = function(startIdx) {
  const folder = INSPIRATIONS.folder || 'Inspirace Dům 6';
  lbPhotos = (INSPIRATIONS.photos || []).map(f => encodeURI(`assets/${folder}/${f}`));
  lbIdx = startIdx;
  updateLightbox();
  document.getElementById('lightbox').classList.add('open');
};

function updateLightbox() {
  document.getElementById('lbImg').src = lbPhotos[lbIdx] || '';
  document.getElementById('lbCounter').textContent = lbPhotos.length > 0 ? `${lbIdx + 1} / ${lbPhotos.length}` : '';
}

document.getElementById('lbClose')?.addEventListener('click', () => { document.getElementById('lightbox').classList.remove('open'); document.body.style.overflow = ''; });
document.getElementById('lbOverlay')?.addEventListener('click', () => { document.getElementById('lightbox').classList.remove('open'); document.body.style.overflow = ''; });
document.getElementById('lbPrev')?.addEventListener('click', () => { lbIdx = (lbIdx - 1 + lbPhotos.length) % lbPhotos.length; updateLightbox(); });
document.getElementById('lbNext')?.addEventListener('click', () => { lbIdx = (lbIdx + 1) % lbPhotos.length; updateLightbox(); });
document.addEventListener('keydown', e => {
  const lb = document.getElementById('lightbox');
  if (!lb?.classList.contains('open')) return;
  if (e.key === 'ArrowLeft')  { lbIdx = (lbIdx - 1 + lbPhotos.length) % lbPhotos.length; updateLightbox(); }
  if (e.key === 'ArrowRight') { lbIdx = (lbIdx + 1) % lbPhotos.length; updateLightbox(); }
  if (e.key === 'Escape') { lb.classList.remove('open'); document.body.style.overflow = ''; }
});

// ── Render: Articles ──────────────────────────────────────────
function renderArticles(data, lang) {
  const grid = document.getElementById('articlesGrid');
  if (!grid) return;
  grid.innerHTML = data.map(a => {
    const title   = lang === 'en' && a.nadpis_en ? a.nadpis_en : a.nadpis;
    const excerpt = lang === 'en' && a.perex_en  ? a.perex_en  : a.perex;
    const tag     = lang === 'en' && a.stitek_en ? a.stitek_en : a.stitek;
    const more    = lang === 'en' ? 'Read more' : 'Číst více';
    const foto    = a.foto || a.foto_url || '';
    return `
    <div class="art-card reveal" onclick="openArticleModal(${a.id})">
      <div class="art-thumb">${foto ? `<img src="${foto}" alt="${title}" loading="lazy">` : '<div style="background:var(--bg-soft);height:100%"></div>'}</div>
      <div class="art-body">
        <p class="art-tag">${tag || ''}</p>
        <h3 class="art-title">${title}</h3>
        <p class="art-excerpt">${excerpt}</p>
        <span class="art-more">${more} →</span>
      </div>
    </div>`;
  }).join('');
  window._articleData = data;
  grid.querySelectorAll('.reveal').forEach((el, i) => setTimeout(() => el.classList.add('visible'), 80 * i));
}

window.openArticleModal = function(id) {
  const lang = window._currentLang || 'cs';
  const a = (window._articleData || STATIC_ARTICLES).find(x => x.id === id);
  if (!a) return;
  const title   = lang === 'en' && a.nadpis_en ? a.nadpis_en : a.nadpis;
  const content = lang === 'en' && a.obsah_en  ? a.obsah_en  : a.obsah || '';
  const tag     = lang === 'en' && a.stitek_en ? a.stitek_en : a.stitek;
  const foto    = a.foto || a.foto_url || '';
  document.getElementById('modalInner').innerHTML = `
    <div style="grid-column:1/-1">
      ${foto ? `<img src="${foto}" alt="${title}" style="width:100%;max-height:360px;object-fit:cover;">` : ''}
      <div style="padding:2.5rem 2rem">
        <p class="modal-num">${tag || ''}</p>
        <h2 class="modal-title">${title}</h2>
        <p class="modal-desc">${content}</p>
      </div>
    </div>`;
  document.getElementById('projectModal').classList.add('open');
  document.body.style.overflow = 'hidden';
};

// ── Render: Inspiration ───────────────────────────────────────
function renderInspiration() {
  const grid = document.getElementById('inspirationGrid');
  if (!grid) return;
  const folder  = INSPIRATIONS.folder || 'Inspirace Dům 6';
  const photos  = INSPIRATIONS.photos || [];
  if (!photos.length) { grid.style.display = 'none'; return; }
  grid.innerHTML = photos.map((f, i) => {
    const src = encodeURI(`assets/${folder}/${f}`);
    return `<div class="ins-item reveal" onclick="openInspirationLightbox(${i})">
      <img src="${src}" alt="Inspirace ${i+1}" loading="lazy" onerror="this.parentElement.style.display='none'">
    </div>`;
  }).join('');
  grid.querySelectorAll('.reveal').forEach((el, i) => setTimeout(() => el.classList.add('visible'), 60 * i));
}

// ── Main renderCMS (voláno z main.js při změně jazyka) ────────
window.renderCMS = function(lang) {
  lang = lang || 'cs';
  window._currentLang = lang;

  loadManifest().then(() => {
    renderProjects(lang);
    renderInspiration();
  });

  // Články: nejdřív API, fallback statické
  if (CMS_API_URL && !CMS_API_URL.includes('YOUR_APPS_SCRIPT')) {
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

// Spuštění
window.renderCMS(localStorage.getItem('tv_lang') || 'cs');

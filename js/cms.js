/* ============================================================
   cms.js — Loads asset-manifest.json, renders projects,
             inspiration, articles (API or static fallback)
   ============================================================ */
'use strict';

const API_URL      = 'https://script.google.com/macros/s/AKfycbw2nek2df3jPkD2Su9vvMOMEBnAEMn0eM2MvEc3PmIJxtqSv1HnSV9MZzKQgd3Bql05aQ/exec';
const MANIFEST_URL = 'assets/asset-manifest.json';

let PROJECTS = [], INSPIRATIONS = { folder: '', photos: [] };

// ── Manifest loader ───────────────────────────────────────────
const manifestPromise = fetch(MANIFEST_URL)
  .then(r => r.ok ? r.json() : Promise.reject('Manifest not found'))
  .then(data => {
    PROJECTS = (data.projects || []).sort((a, b) => a.num.localeCompare(b.num));
    INSPIRATIONS = data.inspirations || { folder: '', photos: [] };
  })
  .catch(err => console.warn('[CMS] manifest error:', err));

// ── Static articles fallback ──────────────────────────────────
const ARTICLES = [
  { id:1, nadpis:'Nápady pro dětský svět', nadpis_en:"Ideas for Children's Spaces",
    perex:'Jak navrhnout dětský pokoj, který poroste s vaším dítětem.', perex_en:"How to design a children's room that grows with your child.",
    foto:'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80', stitek:'Design', stitek_en:'Design',
    obsah:'Dětský pokoj by měl být bezpečný, stimulující a zároveň schopný adaptace s rostoucími potřebami dítěte. Klíčem je flexibilní nábytek a neutrální barevná paleta doplněná hravými akcenty.',
    obsah_en:"A children's room should be safe, stimulating and adaptable. Flexible furniture and a neutral colour palette with playful accents are key." },
  { id:2, nadpis:'Mini Caffè Concept', nadpis_en:'Mini Caffè Concept',
    perex:'Inspirace pro tvorbu útulné kavárny s velkým designovým nápadem.', perex_en:'Inspiration for creating a cosy café with bold design ideas.',
    foto:'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80', stitek:'Komerční', stitek_en:'Commercial',
    obsah:'Malé kavárny a bistro koncepty zažívají velký boom. Úspěchem je dokonalé využití každého centimetru prostoru a konzistentní vizuální identita.',
    obsah_en:'Small cafés are booming. Success lies in perfect use of every centimetre of space and consistent visual identity.' },
  { id:3, nadpis:'Barvy v interiéru a exteriéru', nadpis_en:'Colours in Interior & Exterior',
    perex:'Jak správně kombinovat barvy interiéru s exteriérem stavby.', perex_en:'How to harmoniously combine interior colours with the building exterior.',
    foto:'https://images.unsplash.com/photo-1560185127-6a6ed65f59f5?w=800&q=80', stitek:'Inspirace', stitek_en:'Inspiration',
    obsah:'Barevné schéma bytu nebo domu by mělo vycházet z přirozeného světla a harmonovat s exteriérem. Neutrální základna dává svobodu ve výběru doplňků.',
    obsah_en:'The colour scheme should stem from natural light and harmonise with the exterior. A neutral base gives freedom in choosing accessories.' },
  { id:4, nadpis:'Dekton — materiál budoucnosti', nadpis_en:'Dekton — Material of the Future',
    perex:'Inovativní povrchový materiál Dekton a jeho využití v designu.', perex_en:'The innovative Dekton surface material in modern design.',
    foto:'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80', stitek:'Materiály', stitek_en:'Materials',
    obsah:'Dekton je materiál na bázi přírodního skla, keramiky a křemene. Extrémně pevný, odolný proti škrábancům, tepelně odolný a nízkoúdržbový.',
    obsah_en:'Dekton is based on natural glass, ceramics and quartz. Extremely strong, scratch-resistant, heat-resistant and low-maintenance.' },
];

// ── Helpers ───────────────────────────────────────────────────
function photoUrl(project, group, filename) {
  const base = `assets/${project.folder}`;
  const inSubfolder = group && group !== 'Realizace' && project.photoGroups[group];
  return encodeURI(inSubfolder ? `${base}/${group}/${filename}` : `${base}/${filename}`);
}

function t(obj, key, lang) {
  const enKey = key + '_en';
  return (lang === 'en' && obj[enKey]) ? obj[enKey] : obj[key] || '';
}

// ── Render: Projects grid ─────────────────────────────────────
function renderProjects(lang) {
  const grid = document.getElementById('projectGrid');
  if (!grid) return;

  grid.innerHTML = PROJECTS.map(p => {
    const groups     = p.photoGroups || {};
    const realPhotos = groups['Realizace'] || Object.values(groups).flat();
    const cover      = realPhotos[0] ? photoUrl(p, 'Realizace', realPhotos[0]) : 'assets/hero.jpg';
    const name       = t(p, 'title', lang);
    const catLabel   = p.category === 'komerční'
      ? (lang === 'en' ? 'Commercial' : 'Komerční')
      : (lang === 'en' ? 'Residential' : 'Rezidenční');

    return `<div class="proj-card reveal" role="listitem" tabindex="0"
               data-id="${p.id}" onclick="openProject(${p.id})"
               onkeydown="if(event.key==='Enter')openProject(${p.id})">
      <img src="${cover}" alt="${name}" loading="lazy" onerror="this.src='assets/hero.jpg'">
      <div class="proj-info">
        <p class="proj-num">${p.num} — ${catLabel}</p>
        <p class="proj-name">${name}</p>
        <p class="proj-arrow">${lang === 'en' ? 'View project →' : 'Zobrazit realizaci →'}</p>
      </div>
    </div>`;
  }).join('');

  if (window.observeNew) window.observeNew();
}

// ── Render: Project modal ─────────────────────────────────────
window.openProject = function(id) {
  const lang = localStorage.getItem('tv_lang') || 'cs';
  const p    = PROJECTS.find(x => x.id === id);
  if (!p) return;

  const groups   = p.photoGroups || {};
  const tabOrder = ['Realizace', 'Původní', '3D'];
  const tabs     = tabOrder.filter(tb => groups[tb]?.length);
  if (!tabs.length) return;

  const tabLabels = { 'Realizace': lang==='en'?'Realization':'Realizace', 'Původní': lang==='en'?'Before':'Původní stav', '3D': '3D vizualizace' };

  function buildGallery(tab) {
    const photos = groups[tab] || [];
    const urls   = photos.map(f => photoUrl(p, tab, f));
    const main   = urls[0] || '';
    return { urls, html: `
      ${tabs.length > 1 ? `<div class="modal-tabs">${tabs.map(tb =>
        `<button class="modal-tab${tb===tab?' active':''}" data-tab="${tb}">${tabLabels[tb]}</button>`
      ).join('')}</div>` : ''}
      <img id="mMainImg" class="modal-main-img" src="${main}" alt="${t(p,'title',lang)}" style="cursor:zoom-in"
           onclick="openLightbox(window._lbUrls,window._lbIdx)">
      <div class="modal-thumbs" id="mThumbs">${urls.map((u,i)=>
        `<img src="${u}" class="modal-thumb${i===0?' active':''}" data-idx="${i}" alt="" loading="lazy" onerror="this.style.display='none'">`
      ).join('')}</div>` };
  }

  const firstTab = tabs[0];
  const { urls: firstUrls, html: galleryHtml } = buildGallery(firstTab);
  window._lbUrls = firstUrls;
  window._lbIdx  = 0;

  const lbl = {
    navrh: lang==='en'?'Design':'Návrh', real: lang==='en'?'Realization':'Realizace',
    vyr: lang==='en'?'Production':'Výroba', stav: lang==='en'?'Construction':'Stavba',
    cta: lang==='en'?'Request similar project':'Poptejte podobný projekt'
  };
  const metaRows = [
    p.design     ? `<div class="modal-meta-row"><span class="modal-meta-key">${lbl.navrh}</span>${p.design}</div>` : '',
    p.realizace  ? `<div class="modal-meta-row"><span class="modal-meta-key">${lbl.real}</span>${p.realizace}</div>` : '',
    p.vyroba     ? `<div class="modal-meta-row"><span class="modal-meta-key">${lbl.vyr}</span>${p.vyroba}</div>` : '',
    p.stavebni   ? `<div class="modal-meta-row"><span class="modal-meta-key">${lbl.stav}</span>${p.stavebni}</div>` : '',
  ].filter(Boolean).join('');

  window.openModal(`
    <div class="modal-gallery">${galleryHtml}</div>
    <div class="modal-info">
      <p class="modal-num">${p.num}</p>
      <h2 class="modal-title">${t(p,'title',lang)}</h2>
      ${metaRows ? `<div class="modal-meta">${metaRows}</div>` : ''}
      <p class="modal-desc">${t(p,'description',lang)}</p>
      <a href="#kontakt" class="btn-primary" onclick="document.getElementById('modal').setAttribute('hidden','')">${lbl.cta}</a>
    </div>`);

  // Attach tab switching
  document.querySelectorAll('.modal-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      const { urls, html } = buildGallery(tab);
      window._lbUrls = urls; window._lbIdx = 0;
      document.querySelector('.modal-gallery').innerHTML = html;
      // Re-attach tabs and thumbs
      attachModalEvents(groups, p, lang, tabs, tabLabels, buildGallery);
    });
  });
  attachThumbEvents();
};

function attachModalEvents(groups, p, lang, tabs, tabLabels, buildGallery) {
  document.querySelectorAll('.modal-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      const { urls, html } = buildGallery(tab);
      window._lbUrls = urls; window._lbIdx = 0;
      document.querySelector('.modal-gallery').innerHTML = html;
      attachModalEvents(groups, p, lang, tabs, tabLabels, buildGallery);
    });
  });
  attachThumbEvents();
}

function attachThumbEvents() {
  const mainImg = document.getElementById('mMainImg');
  if (!mainImg) return;
  document.querySelectorAll('.modal-thumb').forEach(th => {
    th.addEventListener('click', () => {
      document.querySelectorAll('.modal-thumb').forEach(t => t.classList.remove('active'));
      th.classList.add('active');
      const idx = +th.dataset.idx;
      mainImg.src = window._lbUrls[idx];
      window._lbIdx = idx;
    });
  });
}

// ── Render: Articles ─────────────────────────────────────────
function renderArticles(arts, lang) {
  const grid = document.getElementById('articlesGrid');
  if (!grid) return;
  grid.innerHTML = arts.map(a => `
    <div class="art-card reveal" onclick="openArticle(${a.id})" tabindex="0" onkeydown="if(event.key==='Enter')openArticle(${a.id})">
      <div class="art-thumb">${a.foto ? `<img src="${a.foto}" alt="${t(a,'nadpis',lang)}" loading="lazy">` : ''}</div>
      <div class="art-body">
        <p class="art-tag">${t(a,'stitek',lang) || ''}</p>
        <h3 class="art-title">${t(a,'nadpis',lang)}</h3>
        <p class="art-excerpt">${t(a,'perex',lang)}</p>
        <span class="art-more">${lang==='en'?'Read more':'Číst více'} →</span>
      </div>
    </div>`).join('');
  window._articles = arts;
  if (window.observeNew) window.observeNew();
}

window.openArticle = function(id) {
  const lang = localStorage.getItem('tv_lang') || 'cs';
  const a = (window._articles || ARTICLES).find(x => x.id === id);
  if (!a) return;
  const foto = a.foto || '';
  window.openModal(`
    <div class="modal-gallery" style="min-height:200px">
      ${foto ? `<img class="modal-main-img" src="${foto}" alt="${t(a,'nadpis',lang)}" style="cursor:default;object-fit:cover">` : ''}
    </div>
    <div class="modal-info">
      <p class="modal-num">${t(a,'stitek',lang) || ''}</p>
      <h2 class="modal-title">${t(a,'nadpis',lang)}</h2>
      <p class="modal-desc">${t(a,'obsah',lang)}</p>
    </div>`);
};

// ── Render: Inspiration ───────────────────────────────────────
function renderInspiration() {
  const grid = document.getElementById('inspirationGrid');
  if (!grid) return;
  const { folder, photos } = INSPIRATIONS;
  if (!photos?.length) { grid.style.display = 'none'; return; }
  const urls = photos.map(f => encodeURI(`assets/${folder}/${f}`));
  grid.innerHTML = urls.map((src, i) =>
    `<div class="ins-item reveal" onclick="openLightbox(window._insUrls,${i})" tabindex="0" onkeydown="if(event.key==='Enter')openLightbox(window._insUrls,${i})" role="button" aria-label="Otevřít fotografii ${i+1}">
       <img src="${src}" alt="Inspirace ${i+1}" loading="lazy" onerror="this.parentElement.style.display='none'">
     </div>`).join('');
  window._insUrls = urls;
  if (window.observeNew) window.observeNew();
}

// ── Main entry ────────────────────────────────────────────────
window.renderCMS = function(lang) {
  lang = lang || localStorage.getItem('tv_lang') || 'cs';

  manifestPromise.then(() => {
    renderProjects(lang);
    renderInspiration();
  });

  // Articles: try API, fallback to static
  fetch(`${API_URL}?action=articles`)
    .then(r => r.ok ? r.json() : Promise.reject())
    .then(data => {
      const arts = (data.articles || []).map(o => ({ ...o, foto: o.foto || o.foto_url || '' }));
      renderArticles(arts.length ? arts : ARTICLES, lang);
    })
    .catch(() => renderArticles(ARTICLES, lang));
};

window.renderCMS(localStorage.getItem('tv_lang') || 'cs');

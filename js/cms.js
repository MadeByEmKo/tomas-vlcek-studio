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
      .then(async data => {
        const rawProjects = (data.projects || []);
        const projects = rawProjects.map(p => ({
          id: p.id,
          num: p.num,
          folder: p.folder,
          // manifest title is fallback; we'll try to override from text file
          nazev: p.title || p.folder,
          nazev_en: p.title || p.folder,
          popis: p.description || '',
          popis_en: p.description || '',
          kategorie: p.category || 'Realizace',
          navrh: p.design || '',
          realizace: p.realizace || '',
          vyroba: p.vyroba || '',
          photos: p.photos || [],
          textFile: p.textFile || null,
        }));

        // If a project provides a textFile, fetch and parse it for 'Název projektu' and 'Typ realizace'
        await Promise.all(projects.map(async proj => {
          if (!proj.textFile) return;
          try {
            const url = encodeURI(`assets/${proj.folder}/${proj.textFile}`);
            const r = await fetch(url);
            if (!r.ok) return;
            const txt = await r.text();
            const lines = txt.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
            lines.forEach(line => {
              const parts = line.split(':');
              if (parts.length < 2) return;
              const key = parts[0].trim().toLowerCase();
              const value = parts.slice(1).join(':').trim();
              if (key.includes('název') || key.includes('nazev')) {
                proj.nazev_txt = value;
              }
              if (key.includes('typ') || key.includes('druh') || key.includes('kategorie')) {
                proj.typ_realizace = value;
              }
            });
          } catch (err) {
            console.warn('Failed to load textFile for', proj.folder, err);
          }
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

// Articles removed — no static fallback

// ── Helper: get photo path ───────────────────────────────────
function photoPath(p, photo) {
  // photo can be a string filename or an object {file, thumb}
  const sub = p.subfolder ? `/${p.subfolder}` : '';
  const filename = (typeof photo === 'string') ? photo : (photo && photo.file ? photo.file : '');
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
// Articles removed — functions no longer needed

// ── Main render ──────────────────────────────────────────────
window.renderCMS = async function(lang) {
  lang = lang || 'cs';
  window._currentLang = lang;

  await loadAssetManifest();

  // Projects always from local albums
  renderProjects(lang);

  // Inspiration
  renderInspiration(lang);

  // Articles removed — no remote fetch or rendering
};

window.renderCMS(localStorage.getItem('tv_lang') || 'cs');

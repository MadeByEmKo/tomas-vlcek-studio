/* ============================================================
   project.js — Projektová detailní stránka
   ============================================================ */
'use strict';

function getProjectIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  return id ? Number(id) : null;
}

function buildPreviewGroups(project) {
  const lower = filename => filename.toLowerCase();
  const beforeWords = ['před', 'pred', 'puvod', 'původ', 'stare', 'stará', 'old', 'before', 'orig', 'původní'];
  const renderWords = ['3d', 'render', 'viz', 'vizualiz', 'vizualizace', 'model', 'rendering', 'rend'];

  const beforePhotos = project.photos.filter(f => beforeWords.some(w => lower(f).includes(w)));
  const renderPhotos = project.photos.filter(f => renderWords.some(w => lower(f).includes(w)));
  const realizationPhotos = project.photos.filter(f => !beforePhotos.includes(f) && !renderPhotos.includes(f));

  return [
    { key: 'realizace', label: 'Realizace', photos: realizationPhotos.length ? realizationPhotos : project.photos },
    { key: 'puvodni', label: 'Původní stav', photos: beforePhotos },
    { key: '3d', label: '3D návrh', photos: renderPhotos }
  ];
}

function renderProjectPreviewTabs(groups, activeKey) {
  const container = document.getElementById('projectPreviewTabs');
  if (!container) return;
  container.innerHTML = groups.map(group => {
    const disabled = !group.photos.length ? ' disabled' : '';
    const active = group.key === activeKey ? ' active' : '';
    return `<button type="button" class="project-preview-tab${active}${disabled}" data-preview="${group.key}"${disabled ? ' tabindex="-1"' : ''}>${group.label}</button>`;
  }).join('');

  container.querySelectorAll('.project-preview-tab').forEach(button => {
    if (button.classList.contains('disabled')) return;
    button.addEventListener('click', () => {
      const key = button.dataset.preview;
      switchProjectPreview(key);
    });
  });
}

function updateProjectPreview(project, groups, key, selectedIndex = 0) {
  const group = groups.find(g => g.key === key) || groups[0];
  const photos = group.photos.length ? group.photos : project.photos;
  const mainImg = document.getElementById('projectMainImg');
  const thumbs = document.getElementById('projectThumbs');
  const name = localStorage.getItem('tv_lang') === 'en' && project.nazev_en ? project.nazev_en : project.nazev;

  window.projectPreviewState = { project, groups, activeKey: group.key, photos };

  renderProjectPreviewTabs(groups, group.key);

  if (!photos.length) {
    mainImg.src = 'assets/hero.jpg';
    mainImg.alt = `${name} — ${group.label}`;
    thumbs.innerHTML = '<p class="project-no-photos">Pro tuto kategorii nejsou dostupné žádné fotografie.</p>';
    document.getElementById('projectLightboxBtn').onclick = null;
    mainImg.onclick = null;
    return;
  }

  const thumbHtml = photos.map((filename, idx) => {
    const src = photoPath(project, filename);
    return `
      <button type="button" class="project-thumb${idx === selectedIndex ? ' active' : ''}" data-idx="${idx}">
        <img src="${src}" alt="${name} ${idx + 1}" loading="lazy">
      </button>`;
  }).join('');

  thumbs.innerHTML = thumbHtml;
  const selectedSrc = photoPath(project, photos[selectedIndex]);
  mainImg.src = selectedSrc;
  mainImg.alt = `${name} ${selectedIndex + 1}`;
  document.getElementById('projectLightboxBtn').onclick = () => openProjectPreviewLightbox(photos, selectedIndex);
  mainImg.onclick = () => openProjectPreviewLightbox(photos, selectedIndex);

  thumbs.querySelectorAll('.project-thumb').forEach(button => {
    button.addEventListener('click', () => {
      thumbs.querySelectorAll('.project-thumb').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      const idx = Number(button.dataset.idx);
      mainImg.src = photoPath(project, photos[idx]);
      mainImg.alt = `${name} ${idx + 1}`;
      document.getElementById('projectLightboxBtn').onclick = () => openProjectPreviewLightbox(photos, idx);
      mainImg.onclick = () => openProjectPreviewLightbox(photos, idx);
    });
  });
}

function switchProjectPreview(key) {
  const state = window.projectPreviewState || {};
  if (!state.project || !Array.isArray(state.groups)) return;
  if (state.activeKey === key) return;
  updateProjectPreview(state.project, state.groups, key);
}

function openProjectPreviewLightbox(photos, index) {
  const project = window.projectPreviewState?.project;
  if (!project || !photos?.length) return;
  lbPhotos = photos.map(filename => photoPath(project, filename));
  lbIdx = index;
  updateLightbox();
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function renderProjectDetail(lang) {
  const id = getProjectIdFromUrl();
  const project = PROJECTS.find(p => p.id === id);
  if (!project) {
    const main = document.querySelector('.project-detail');
    if (main) main.innerHTML = '<p>Projekt nebyl nalezen. <a href="index.html#projekty">Zpět na ukázky prací</a></p>';
    return;
  }

  const name = lang === 'en' && project.nazev_en ? project.nazev_en : project.nazev;
  const desc = lang === 'en' && project.popis_en ? project.popis_en : project.popis;
  const designLabel = lang === 'en' ? 'Design' : 'Návrh';
  const realLabel = lang === 'en' ? 'Realization' : 'Realizace';
  const prodLabel = lang === 'en' ? 'Production' : 'Výroba';
  const ctaLabel = lang === 'en' ? 'Request a similar project' : 'Poptat podobný projekt';
  const nextLabel = lang === 'en' ? 'Next project' : 'Další projekt';

  document.title = `${name} — Tomáš Vlček`;
  document.getElementById('projectPageTitle').textContent = name;
  document.getElementById('projectPageSubtitle').textContent = project.kategorie || '';
  document.getElementById('projectNum').textContent = project.num || '';
  document.getElementById('projectDescription').textContent = desc;
  document.getElementById('projectCta').textContent = ctaLabel;
  document.getElementById('projectHeroBg').style.backgroundImage = `url('${photoPath(project, project.photos[0])}')`;

  const currentIndex = PROJECTS.findIndex(p => p.id === id);
  const nextProject = PROJECTS[(currentIndex + 1) % PROJECTS.length];
  const nextLink = document.getElementById('projectNextLink');
  if (nextLink) {
    nextLink.textContent = nextLabel;
    nextLink.href = `project.html?id=${nextProject.id}`;
  }

  const metaRows = [
    { key: designLabel, value: project.navrh || 'Tomáš Vlček' },
    { key: realLabel, value: project.realizace || 'Tomáš Vlček' }
  ];
  if (project.vyroba) metaRows.push({ key: prodLabel, value: project.vyroba });

  document.getElementById('projectMeta').innerHTML = metaRows.map(row => `
    <div class="project-meta-row">
      <span>${row.key}</span>
      <p>${row.value}</p>
    </div>
  `).join('');

  const groups = buildPreviewGroups(project);
  updateProjectPreview(project, groups, 'realizace');
}

window.addEventListener('load', async () => {
  if (window.loadAssetManifest) await window.loadAssetManifest();
  renderProjectDetail(localStorage.getItem('tv_lang') || 'cs');
});

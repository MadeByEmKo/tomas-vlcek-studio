/* ============================================================
   project.js — Projektová detailní stránka
   ============================================================ */
'use strict';

function getProjectIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  return id ? Number(id) : null;
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

  document.title = `${name} — Tomáš Vlček`;
  document.getElementById('projectPageTitle').textContent = name;
  document.getElementById('projectPageBreadcrumb').textContent = name;
  document.getElementById('projectPageSubtitle').textContent = project.kategorie || '';
  document.getElementById('projectNum').textContent = project.num || '';
  document.getElementById('projectName').textContent = name;
  document.getElementById('projectDescription').textContent = desc;
  document.getElementById('projectCta').textContent = ctaLabel;
  document.getElementById('projectHeroBg').style.backgroundImage = `url('${photoPath(project, project.photos[0])}')`;

  const currentIndex = PROJECTS.findIndex(p => p.id === id);
  const nextProject = PROJECTS[(currentIndex + 1) % PROJECTS.length];
  const nextLabel = lang === 'en' ? 'Next project' : 'Další projekt';
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

  const photos = project.photos.map(filename => photoPath(project, filename));
  const thumbsHtml = photos.map((src, idx) => `
    <button type="button" class="project-thumb${idx === 0 ? ' active' : ''}" data-idx="${idx}">
      <img src="${src}" alt="${name} ${idx + 1}" loading="lazy">
    </button>
  `).join('');
  document.getElementById('projectThumbs').innerHTML = thumbsHtml;
  document.getElementById('projectMainImg').src = photos[0];
  document.getElementById('projectMainImg').alt = name;

  document.getElementById('projectLightboxBtn').onclick = () => openLightbox(project.id, currentThumbIndex());
  document.getElementById('projectMainImg').onclick = () => openLightbox(project.id, currentThumbIndex());

  document.querySelectorAll('.project-thumb').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.project-thumb').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      const idx = Number(button.dataset.idx);
      document.getElementById('projectMainImg').src = photos[idx];
      document.getElementById('projectMainImg').alt = `${name} ${idx + 1}`;
      document.getElementById('projectLightboxBtn').onclick = () => openLightbox(project.id, idx);
      document.getElementById('projectMainImg').onclick = () => openLightbox(project.id, idx);
    });
  });

  function currentThumbIndex() {
    const active = document.querySelector('.project-thumb.active');
    return active ? Number(active.dataset.idx) : 0;
  }
}

window.addEventListener('load', () => renderProjectDetail(localStorage.getItem('tv_lang') || 'cs'));

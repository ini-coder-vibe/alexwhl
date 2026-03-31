/* ═══════════════════════════════════════
   APEX WHOLESALE — careers.js
═══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', async () => {

  const grid        = document.getElementById('jobsGrid');
  const filterLabel = document.getElementById('filterLabel');
  const statTotal   = document.getElementById('statTotal');
  const statLmia    = document.getElementById('statLmia');
  const filterTags  = document.querySelectorAll('.filter-tag');

  /* ── dept → filter category map ── */
  const DEPT_CAT = {
    'Sales & Business Development':  'Sales',
    'Operations & Merchandising':    'Operations',
    'Logistics & Distribution':      'Logistics',
    'Warehouse & Fulfilment':        'Warehouse',
    'Security & Facilities':         'Security',
  };

  /* driver jobs identified by id prefix */
  function getCategory(job) {
    if (job.id.includes('driver')) return 'Driver';
    return DEPT_CAT[job.dept] || 'Other';
  }

  /* ── build a single card's HTML ── */
  function buildCard(job, index) {
    const cat      = getCategory(job);
    const vacLabel = job.vacancies === 1 ? '1 vacancy' : `${job.vacancies} vacancies`;
    const isNew    = index < 2; // mark first two as "New" — adjust as needed

    const lmiaBadge = job.lmia
      ? `<span class="badge badge--lmia">🇨🇦 LMIA Required</span>` : '';
    const newBadge  = isNew
      ? `<span class="badge badge--new">New</span>` : '';

    const tags = job.tags
      .map(t => `<span class="job-tag">${t}</span>`)
      .join('');

    return `
      <article class="job-card" data-cat="${cat}" style="animation-delay:${index * 0.08}s">
        <div class="job-card__header">
          <div class="job-card__badges">
            ${lmiaBadge}
            ${newBadge}
          </div>
        </div>

        <div class="job-card__body">
          <p class="job-card__dept">${job.dept}</p>
          <h2 class="job-card__title">${job.title}</h2>
          <p class="job-card__summary">${job.summary}</p>

          <ul class="job-card__meta">
            <li><i class="ph ph-map-pin"></i><span>${job.location}</span></li>
            <li><i class="ph ph-currency-dollar"></i><span>${job.salary}</span></li>
            <li><i class="ph ph-users"></i><span>${vacLabel}</span></li>
            <li><i class="ph ph-clock"></i><span>${job.type}</span></li>
          </ul>
        </div>

        <div class="job-card__footer">
          <div class="job-card__tags">${tags}</div>
          <a href="job.html?id=${job.id}" class="job-card__cta">
            View Role <i class="ph ph-arrow-right"></i>
          </a>
        </div>
      </article>`;
  }

  /* ── fetch & render ── */
  let allJobs = [];

  try {
    const res  = await fetch('jobs.json');
    allJobs    = await res.json();
  } catch (err) {
    grid.innerHTML = `<p style="color:var(--light-muted);grid-column:1/-1">Failed to load jobs. Please try again later.</p>`;
    return;
  }

  /* update header stats */
  const lmiaCount = allJobs.filter(j => j.lmia).length;
  statTotal.textContent = allJobs.length;
  statLmia.textContent  = lmiaCount;

  /* render all cards */
  function renderJobs(jobs) {
    grid.innerHTML = jobs.map((job, i) => buildCard(job, i)).join('');
    const count = jobs.length;
    filterLabel.textContent = `${count} position${count !== 1 ? 's' : ''} available`;
  }

  renderJobs(allJobs);

  /* ── filter logic ── */
  filterTags.forEach(btn => {
    btn.addEventListener('click', () => {
      filterTags.forEach(b => b.classList.remove('filter-tag--active'));
      btn.classList.add('filter-tag--active');

      const cat = btn.textContent.trim();
      const filtered = cat === 'All'
        ? allJobs
        : allJobs.filter(j => getCategory(j) === cat);

      renderJobs(filtered);
    });
  });

  /* ── nav hamburger ── */
  const hamburger = document.getElementById('navHamburger');
  const navLinks  = document.getElementById('navLinks');
  const navClose  = document.getElementById('navClose');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    if (navClose) {
      navClose.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    }
  }

});

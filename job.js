/* ═══════════════════════════════════════
   APEX WHOLESALE — job.js
═══════════════════════════════════════ */

/* ── API config — loaded from config.js ── */

document.addEventListener('DOMContentLoaded', async () => {

  const API_URL = CONFIG.API_URL;

  /* ── Read job id from URL ── */
  const params = new URLSearchParams(window.location.search);
  const jobId  = params.get('id');

  const jobPage  = document.getElementById('jobPage');
  const notFound = document.getElementById('notFound');

  if (!jobId) { showNotFound(); return; }

  /* ── Fetch jobs.json ── */
  let job;
  try {
    const res  = await fetch('jobs.json');
    const jobs = await res.json();
    job = jobs.find(j => j.id === jobId);
  } catch (e) {
    showNotFound(); return;
  }

  if (!job) { showNotFound(); return; }

  /* ── Update page title ── */
  document.title = `${job.title} — APEX Wholesale`;

  /* ── Render job details ── */
  setText('jDept',       job.dept);
  setText('jTitle',      job.title);
  setText('jLocation',   job.location);
  setText('jSalary',     job.salary);
  setText('jVacancies',  `${job.vacancies} vacanc${job.vacancies === 1 ? 'y' : 'ies'}`);
  setText('jType',       job.type);
  setText('jClosing',    job.closing);
  setText('jSummary',    job.summary);
  setText('aTitle',      job.title);

  // LMIA badge
  if (!job.lmia) document.getElementById('jLmia').style.display = 'none';

  // Tags
  const tagsEl = document.getElementById('jTags');
  tagsEl.innerHTML = job.tags.map(t => `<span class="job-tag">${t}</span>`).join('');

  // Responsibilities
  const respEl = document.getElementById('jResponsibilities');
  respEl.innerHTML = job.responsibilities.map(r => `<li>${r}</li>`).join('');

  // Requirements
  const reqEl = document.getElementById('jRequirements');
  reqEl.innerHTML = job.requirements.map(r => `<li>${r}</li>`).join('');

  /* ── Application form ── */
  const form        = document.getElementById('applyForm');
  const applyBtn    = document.getElementById('applyBtn');
  const applyLabel  = document.getElementById('applyBtnLabel');
  const applyIcon   = document.getElementById('applyBtnIcon');
  const applySuccess = document.getElementById('applySuccess');
  const applyRef    = document.getElementById('applyRef');

  // Validation helpers
  function setErr(id, msg) {
    const el = document.getElementById(id);
    if (el) el.textContent = msg;
    const inputId = 'a' + id.slice(1);
    const inp = document.getElementById(inputId);
    if (inp && msg) inp.classList.add('error');
  }
  function clearErr(id) {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
    const inputId = 'a' + id.slice(1);
    const inp = document.getElementById(inputId);
    if (inp) inp.classList.remove('error');
  }

  // Live clear
  [['aFirst','eFirst'],['aLast','eLast'],['aEmail','eEmail'],
   ['aPhone','ePhone'],['aCountry','eCountry'],['aStatus','eStatus'],
   ['aExperience','eExperience'],['aCover','eCover']
  ].forEach(([inp, err]) => {
    document.getElementById(inp)?.addEventListener('input', () => clearErr(err));
    document.getElementById(inp)?.addEventListener('change', () => clearErr(err));
  });

  function validate() {
    let ok = true;

    const required = [
      ['aFirst',      'eFirst',      'First name is required.'],
      ['aLast',       'eLast',       'Last name is required.'],
      ['aPhone',      'ePhone',      'Phone number is required.'],
      ['aCountry',    'eCountry',    'Please select your country.'],
      ['aStatus',     'eStatus',     'Please select your immigration status.'],
      ['aExperience', 'eExperience', 'Please select your experience level.'],
      ['aCover',      'eCover',      'Please write a brief cover note.'],
    ];

    required.forEach(([inp, err, msg]) => {
      const val = document.getElementById(inp)?.value.trim();
      if (!val) { setErr(err, msg); ok = false; }
      else clearErr(err);
    });

    // email
    const email = document.getElementById('aEmail')?.value.trim();
    if (!email) {
      setErr('eEmail', 'Email is required.'); ok = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErr('eEmail', 'Enter a valid email address.'); ok = false;
    } else {
      clearErr('eEmail');
    }

    // consent
    if (!document.getElementById('aConsent')?.checked) {
      setErr('eConsent', 'You must consent to proceed.'); ok = false;
    } else {
      clearErr('eConsent');
    }

    return ok;
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validate()) return;

    // — Submitting state —
    applyBtn.disabled = true;
    applyLabel.textContent = 'Submitting application…';
    applyIcon.className = '';
    const spinner = document.createElement('span');
    spinner.className = 'apply-btn__spinner';
    applyBtn.appendChild(spinner);

    // — Build payload —
    const ref     = 'APX-' + Date.now().toString(36).toUpperCase().slice(-7);
    const payload = {
      ref,
      job_id:              jobId,
      job_title:           job.title,
      first_name:          document.getElementById('aFirst').value.trim(),
      last_name:           document.getElementById('aLast').value.trim(),
      email:               document.getElementById('aEmail').value.trim(),
      phone:               document.getElementById('aPhone').value.trim(),
      country:             document.getElementById('aCountry').value,
      immigration_status:  document.getElementById('aStatus').value,
      experience:          document.getElementById('aExperience').value,
      cover_note:          document.getElementById('aCover').value.trim(),
      submitted_at:        new Date().toISOString(),
    };

    // — Insert into Supabase —
    try {
      const res = await fetch(`${API_URL}/api/applications`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${res.status}`);
      }

      // — Success —
      applyRef.textContent  = ref;
      form.style.opacity    = '0';
      form.style.transition = 'opacity 0.3s ease';
      setTimeout(() => {
        form.style.display  = 'none';
        document.querySelector('.apply-panel__eyebrow').style.display = 'none';
        document.querySelector('.apply-panel__title').style.display   = 'none';
        applySuccess.classList.add('visible');
      }, 300);

    } catch (err) {
      // — Error state — re-enable button, show message —
      applyBtn.disabled     = false;
      applyLabel.textContent = 'Submit Application';
      spinner.remove();
      applyIcon.className   = 'ph ph-arrow-right';

      let errMsg = document.getElementById('submitError');
      if (!errMsg) {
        errMsg = document.createElement('p');
        errMsg.id        = 'submitError';
        errMsg.className = 'submit-error';
        form.appendChild(errMsg);
      }
      errMsg.textContent = 'Something went wrong. Please try again or email us directly at alex@bimp.me.';
      console.error('Supabase insert error:', err);
    }
  });

  /* ── Helper ── */
  function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  function showNotFound() {
    notFound.classList.add('visible');
    jobPage.style.display = 'none';
  }

});

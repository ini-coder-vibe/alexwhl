/* ═══════════════════════════════════════════════
   ALEX WHOLESALE — admin.js
   Auth: token verified server-side by Worker
   Token never stored in any file — memory only
════════════════════════════════════════════════ */

/* ── API config — loaded from config.js ── */

document.addEventListener('DOMContentLoaded', () => {

  const API_URL   = CONFIG.API_URL;

  /* ── In-memory token — never written to any file ── */
  let adminToken = null;

  /* ── DOM refs ── */
  const authGate  = document.getElementById('authGate');
  const dashboard = document.getElementById('dashboard');
  const authForm  = document.getElementById('authForm');
  const authBtn   = document.getElementById('authBtn');
  const authLabel = document.getElementById('authLabel');
  const authError = document.getElementById('authError');

  /* ── Auth form submit — verifies token against Worker ── */
  authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = document.getElementById('authToken').value.trim();

    if (!token) {
      authError.textContent = 'Please enter your token.';
      return;
    }

    authBtn.disabled    = true;
    authLabel.textContent = 'Verifying…';
    authError.textContent = '';

    try {
      const res = await fetch(`${API_URL}/api/auth`, {
        method:  'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type':  'application/json',
        },
      });

      if (res.status === 401) {
        authError.textContent = 'Invalid token. Access denied.';
        document.getElementById('authToken').value = '';
        authBtn.disabled      = false;
        authLabel.textContent = 'Authenticate';
        return;
      }

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      /* ── Valid — store in memory only, never in storage ── */
      adminToken            = token;
      authBtn.disabled      = false;
      authLabel.textContent = 'Authenticate';
      showDashboard();

    } catch (err) {
      authError.textContent = 'Connection error. Check your network.';
      authBtn.disabled      = false;
      authLabel.textContent = 'Authenticate';
    }
  });

  /* ── Sign out — wipe token from memory ── */
  document.getElementById('signOutBtn').addEventListener('click', () => {
    adminToken = null;
    location.reload();
  });

  /* ─────────────────────────────────────────
     SUPABASE FETCH HELPER
  ───────────────────────────────────────── */
  async function supabaseFetch(table) {
    const res = await fetch(`${API_URL}/api/${table}`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type':  'application/json',
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  /* ─────────────────────────────────────────
     SHOW DASHBOARD
  ───────────────────────────────────────── */
  function showDashboard() {
    authGate.style.display  = 'none';
    dashboard.style.display = 'block';
    loadApplications();
    loadContacts();
  }

  /* ─────────────────────────────────────────
     TABS
  ───────────────────────────────────────── */
  document.querySelectorAll('.dash-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.dash-tab').forEach(t => t.classList.remove('dash-tab--active'));
      document.querySelectorAll('.dash-panel').forEach(p => p.classList.add('dash-panel--hidden'));
      tab.classList.add('dash-tab--active');
      document.getElementById('panel' + capitalise(tab.dataset.tab)).classList.remove('dash-panel--hidden');
    });
  });

  function capitalise(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  /* ─────────────────────────────────────────
     APPLICATIONS
  ───────────────────────────────────────── */
  let allApplications = [];

  async function loadApplications() {
    showLoading('app', true);
    try {
      allApplications = await supabaseFetch('applications', 'select=*');
      document.getElementById('statApplications').textContent = allApplications.length;
      renderApplications(allApplications);
    } catch (e) {
      console.error('Failed to load applications:', e);
      showEmpty('app', true, 'Failed to load data.');
    } finally {
      showLoading('app', false);
    }
  }

  function renderApplications(data) {
    const body = document.getElementById('appBody');
    if (!data.length) { showEmpty('app', true); body.innerHTML = ''; return; }
    showEmpty('app', false);
    body.innerHTML = data.map(row => `
      <tr data-id="${row.id}" data-type="application">
        <td class="td-ref">${row.ref || '—'}</td>
        <td class="td-name">${row.first_name} ${row.last_name}</td>
        <td>${row.email}</td>
        <td class="td-job">${row.job_title || '—'}</td>
        <td>${row.country || '—'}</td>
        <td><span class="status-badge status-badge--${row.status || 'pending'}">${row.status || 'pending'}</span></td>
        <td>${row.experience || '—'}</td>
        <td class="td-date">${formatDate(row.submitted_at)}</td>
        <td><button class="view-btn" data-id="${row.id}" data-type="application">View</button></td>
      </tr>`).join('');
    bindViewBtns();
  }

  /* Search & filter */
  document.getElementById('appSearch').addEventListener('input', filterApplications);
  document.getElementById('appJobFilter').addEventListener('change', filterApplications);

  function filterApplications() {
    const q   = document.getElementById('appSearch').value.toLowerCase();
    const job = document.getElementById('appJobFilter').value;
    const filtered = allApplications.filter(r => {
      const matchQ = !q ||
        `${r.first_name} ${r.last_name}`.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        (r.job_title || '').toLowerCase().includes(q) ||
        (r.ref || '').toLowerCase().includes(q);
      const matchJob = !job || r.job_title === job;
      return matchQ && matchJob;
    });
    renderApplications(filtered);
  }

  /* ─────────────────────────────────────────
     CONTACTS
  ───────────────────────────────────────── */
  let allContacts = [];

  async function loadContacts() {
    showLoading('msg', true);
    try {
      allContacts = await supabaseFetch('contacts', 'select=*');
      document.getElementById('statContacts').textContent = allContacts.length;
      renderContacts(allContacts);
    } catch (e) {
      console.error('Failed to load contacts:', e);
      showEmpty('msg', true, 'Failed to load data.');
    } finally {
      showLoading('msg', false);
    }
  }

  function renderContacts(data) {
    const body = document.getElementById('msgBody');
    if (!data.length) { showEmpty('msg', true); body.innerHTML = ''; return; }
    showEmpty('msg', false);
    body.innerHTML = data.map(row => `
      <tr data-id="${row.id}" data-type="contact">
        <td class="td-name">${row.full_name}</td>
        <td>${row.email}</td>
        <td class="td-msg">${row.message}</td>
        <td class="td-date">${formatDate(row.submitted_at)}</td>
      </tr>`).join('');
    bindViewBtns();
  }

  document.getElementById('msgSearch').addEventListener('input', () => {
    const q = document.getElementById('msgSearch').value.toLowerCase();
    const filtered = allContacts.filter(r =>
      r.full_name.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.message.toLowerCase().includes(q)
    );
    renderContacts(filtered);
  });

  /* ─────────────────────────────────────────
     DETAIL DRAWER
  ───────────────────────────────────────── */
  const drawerOverlay = document.getElementById('drawerOverlay');
  const drawerTitle   = document.getElementById('drawerTitle');
  const drawerBody    = document.getElementById('drawerBody');

  function bindViewBtns() {
    /* row click */
    document.querySelectorAll('.data-table tbody tr').forEach(row => {
      row.addEventListener('click', (e) => {
        if (e.target.classList.contains('view-btn')) return;
        openDrawer(row.dataset.id, row.dataset.type);
      });
    });
    /* view button click */
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openDrawer(btn.dataset.id, btn.dataset.type);
      });
    });
  }

  function openDrawer(id, type) {
    const record = type === 'application'
      ? allApplications.find(r => String(r.id) === String(id))
      : allContacts.find(r => String(r.id) === String(id));
    if (!record) return;

    drawerTitle.textContent = type === 'application' ? record.job_title || 'Application' : 'Message';

    const fields = type === 'application'
      ? [
          ['Reference',          record.ref,                      true],
          ['Full Name',          `${record.first_name} ${record.last_name}`],
          ['Email',              record.email],
          ['Phone',              record.phone || '—'],
          ['Position',           record.job_title || '—'],
          ['Country',            record.country || '—'],
          ['Immigration Status', record.immigration_status || '—'],
          ['Experience',         record.experience || '—'],
          ['Status',             record.status || 'pending'],
          ['Cover Note',         record.cover_note || '—'],
          ['Submitted',          formatDate(record.submitted_at)],
        ]
      : [
          ['Full Name',  record.full_name],
          ['Email',      record.email],
          ['Message',    record.message],
          ['Submitted',  formatDate(record.submitted_at)],
        ];

    drawerBody.innerHTML = fields.map(([label, val, orange]) => `
      <div class="drawer-row">
        <span class="drawer-row__label">${label}</span>
        <span class="drawer-row__val${orange ? ' drawer-row__val--orange' : ''}">${val}</span>
      </div>`).join('');

    drawerOverlay.classList.add('open');
  }

  document.getElementById('drawerClose').addEventListener('click', closeDrawer);
  drawerOverlay.addEventListener('click', (e) => { if (e.target === drawerOverlay) closeDrawer(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDrawer(); });
  function closeDrawer() { drawerOverlay.classList.remove('open'); }

  /* ─────────────────────────────────────────
     HELPERS
  ───────────────────────────────────────── */
  function formatDate(iso) {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function showLoading(prefix, show) {
    const el = document.getElementById(prefix + 'Loading');
    if (el) el.classList.toggle('visible', show);
    const wrap = document.getElementById(prefix + 'TableWrap');
    if (wrap) wrap.style.display = show ? 'none' : '';
  }

  function showEmpty(prefix, show, msg) {
    const el = document.getElementById(prefix + 'Empty');
    if (!el) return;
    el.classList.toggle('visible', show);
    if (msg) el.textContent = msg;
  }

});

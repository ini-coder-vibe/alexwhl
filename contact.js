/* ═══════════════════════════════════════
   ALEX WHOLESALE — contact.js
═══════════════════════════════════════ */

/* ── Supabase config — replace with your real values ── */
const SUPABASE_URL = CONFIG.SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = CONFIG.SUPABASE_PUBLISHABLE_KEY;

document.addEventListener('DOMContentLoaded', () => {

  const form          = document.getElementById('contactForm');
  const submitBtn     = document.getElementById('submitBtn');
  const submitLabel   = document.getElementById('submitLabel');
  const submitIcon    = document.getElementById('submitIcon');
  const submitError   = document.getElementById('submitError');
  const contactSuccess = document.getElementById('contactSuccess');

  /* ── Validation helpers ── */
  function setError(inputId, errId, msg) {
    const el = document.getElementById(errId);
    if (el) el.textContent = msg;
    const inp = document.getElementById(inputId);
    if (inp) inp.classList.add('error');
  }
  function clearError(inputId, errId) {
    const el = document.getElementById(errId);
    if (el) el.textContent = '';
    const inp = document.getElementById(inputId);
    if (inp) inp.classList.remove('error');
  }

  /* ── Live clear on input ── */
  [['cName', 'eName'], ['cEmail', 'eEmail'], ['cMessage', 'eMessage']].forEach(([inp, err]) => {
    document.getElementById(inp)?.addEventListener('input', () => clearError(inp, err));
  });

  /* ── Validate ── */
  function validate() {
    let ok = true;

    const name = document.getElementById('cName')?.value.trim();
    if (!name) { setError('cName', 'eName', 'Full name is required.'); ok = false; }
    else clearError('cName', 'eName');

    const email = document.getElementById('cEmail')?.value.trim();
    if (!email) { setError('cEmail', 'eEmail', 'Email address is required.'); ok = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('cEmail', 'eEmail', 'Enter a valid email address.'); ok = false; }
    else clearError('cEmail', 'eEmail');

    const message = document.getElementById('cMessage')?.value.trim();
    if (!message) { setError('cMessage', 'eMessage', 'Please enter a message.'); ok = false; }
    else clearError('cMessage', 'eMessage');

    return ok;
  }

  /* ── Submit ── */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate()) return;

    /* — Submitting state — */
    submitBtn.disabled = true;
    submitLabel.textContent = 'Sending…';
    submitIcon.className = '';
    const spinner = document.createElement('span');
    spinner.className = 'submit-btn__spinner';
    submitBtn.appendChild(spinner);
    submitError.style.display = 'none';

    /* — Build payload — */
    const payload = {
      full_name:    document.getElementById('cName').value.trim(),
      email:        document.getElementById('cEmail').value.trim(),
      message:      document.getElementById('cMessage').value.trim(),
      submitted_at: new Date().toISOString(),
    };

    /* — Insert into Supabase — */
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/contacts`, {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'apikey':         SUPABASE_PUBLISHABLE_KEY,
          'Authorization': `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
          'Prefer':        'return=minimal',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${res.status}`);
      }

      /* — Success — */
      form.style.opacity    = '0';
      form.style.transition = 'opacity 0.3s ease';
      setTimeout(() => {
        form.style.display = 'none';
        contactSuccess.classList.add('visible');
      }, 300);

    } catch (err) {
      /* — Error state — */
      submitBtn.disabled = false;
      submitLabel.textContent = 'Send Message';
      spinner.remove();
      submitIcon.className = 'ph ph-arrow-right';
      submitError.textContent = 'Something went wrong. Please try again or email us directly at alex@bimp.me.';
      submitError.style.display = 'block';
      console.error('Supabase insert error:', err);
    }
  });

});

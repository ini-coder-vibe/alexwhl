/* ═══════════════════════════════════════════
   APEX WHOLESALE — quotation.js
═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Load items from sessionStorage ── */
  let items = [];
  try {
    const raw = sessionStorage.getItem('quotationItems');
    if (raw) {
      const parsed = JSON.parse(raw);
      // Deduplicate: merge duplicate product ids into qty
      const map = {};
      parsed.forEach(p => {
        if (map[p.id]) { map[p.id].qty++; }
        else           { map[p.id] = { ...p, qty: 1 }; }
      });
      items = Object.values(map);
    }
  } catch (e) { items = []; }

  /* ── DOM refs ── */
  const summaryBody     = document.getElementById('summaryBody');
  const emptyState      = document.getElementById('emptyState');
  const orderTotals     = document.getElementById('orderTotals');
  const summaryTableWrap = document.getElementById('summaryTableWrap');
  const itemCountEl     = document.getElementById('itemCount');
  const subtotalEl      = document.getElementById('subtotalVal');
  const totalEl         = document.getElementById('totalVal');

  /* ── Render summary table ── */
  function renderSummary() {
    const totalItems = items.reduce((s, i) => s + i.qty, 0);
    itemCountEl.textContent = `${totalItems} item${totalItems !== 1 ? 's' : ''}`;

    if (items.length === 0) {
      summaryTableWrap.style.display = 'none';
      orderTotals.classList.add('hidden');
      emptyState.classList.add('visible');
      return;
    }

    summaryTableWrap.style.display = '';
    orderTotals.classList.remove('hidden');
    emptyState.classList.remove('visible');

    summaryBody.innerHTML = items.map((p, idx) => {
      const unitPrice = p.prices ? p.prices[2] : p.price;
      const subtotal  = (unitPrice * p.qty).toFixed(2);
      return `
        <tr data-idx="${idx}">
          <td>
            <div class="td-product">
              <img class="td-img" src="${p.img}" alt="${p.name}" loading="lazy" />
              <div>
                <div class="td-name">${p.name}</div>
                <div class="td-cat">${p.cat}</div>
              </div>
            </div>
          </td>
          <td><span class="td-sku">${p.sku}</span></td>
          <td class="td-price">$${unitPrice.toFixed(2)}</td>
          <td>
            <input class="qty-input" type="number" min="1" max="9999"
              value="${p.qty}" data-idx="${idx}" />
          </td>
          <td class="td-subtotal" id="sub-${idx}">$${subtotal}</td>
          <td><button class="remove-btn" data-idx="${idx}" title="Remove">✕</button></td>
        </tr>`;
    }).join('');

    updateTotals();
    bindTableEvents();
  }

  function updateTotals() {
    const subtotal = items.reduce((s, p) => {
      const unitPrice = p.prices ? p.prices[2] : p.price;
      return s + unitPrice * p.qty;
    }, 0);
    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    totalEl.textContent    = `$${subtotal.toFixed(2)}`;
  }

  function bindTableEvents() {
    // qty change
    summaryBody.querySelectorAll('.qty-input').forEach(input => {
      input.addEventListener('change', () => {
        const idx = +input.dataset.idx;
        const val = Math.max(1, parseInt(input.value) || 1);
        input.value = val;
        items[idx].qty = val;
        const unitPrice = items[idx].prices ? items[idx].prices[2] : items[idx].price;
        document.getElementById(`sub-${idx}`).textContent = `$${(unitPrice * val).toFixed(2)}`;
        updateTotals();
      });
    });

    // remove
    summaryBody.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = +btn.dataset.idx;
        items.splice(idx, 1);
        renderSummary();
      });
    });
  }

  renderSummary();

  /* ── Form validation & submit ── */
  const form         = document.getElementById('quoteForm');
  const submitBtn    = document.getElementById('submitBtn');
  const inlineSuccess = document.getElementById('inlineSuccess');
  const refNumber    = document.getElementById('refNumber');
  const submittedBy  = document.getElementById('submittedBy');
  const submittedCo  = document.getElementById('submittedCompany');

  function setError(id, msg) {
    const el = document.getElementById(id);
    if (el) el.textContent = msg;
    if (msg) {
      const input = id.replace('err', '').replace(/^(.)/, c => c.toLowerCase());
      const field = document.getElementById(input);
      if (field) field.classList.add('error');
    }
  }
  function clearError(id) {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
    const input = id.replace('err', '').replace(/^(.)/, c => c.toLowerCase());
    const field = document.getElementById(input);
    if (field) field.classList.remove('error');
  }

  // Live clear on input
  ['firstName','lastName','company','email','country','bizType'].forEach(id => {
    const el = document.getElementById(id);
    el?.addEventListener('input', () => clearError('err' + id.charAt(0).toUpperCase() + id.slice(1)));
    el?.addEventListener('change', () => clearError('err' + id.charAt(0).toUpperCase() + id.slice(1)));
  });

  function validate() {
    let valid = true;

    const rules = [
      { id: 'firstName',  err: 'errFirstName', msg: 'First name is required.' },
      { id: 'lastName',   err: 'errLastName',  msg: 'Last name is required.' },
      { id: 'company',    err: 'errCompany',   msg: 'Company name is required.' },
      { id: 'country',    err: 'errCountry',   msg: 'Please select a country.' },
      { id: 'bizType',    err: 'errBizType',   msg: 'Please select a business type.' },
    ];

    rules.forEach(({ id, err, msg }) => {
      const val = document.getElementById(id)?.value.trim();
      if (!val) { setError(err, msg); valid = false; }
      else clearError(err);
    });

    // email
    const emailVal = document.getElementById('email')?.value.trim();
    if (!emailVal) {
      setError('errEmail', 'Email is required.'); valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      setError('errEmail', 'Enter a valid email address.'); valid = false;
    } else {
      clearError('errEmail');
    }

    // terms
    if (!document.getElementById('agreeTerms')?.checked) {
      setError('errTerms', 'You must agree to the terms.'); valid = false;
    } else {
      clearError('errTerms');
    }

    return valid;
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validate()) return;

    // — Submitting state —
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="submit-btn__spinner"></span> Submitting quotation request…';

    setTimeout(() => {
      // — Populate success meta —
      const ref   = 'AQR-' + Date.now().toString(36).toUpperCase().slice(-6);
      const first = document.getElementById('firstName')?.value.trim();
      const last  = document.getElementById('lastName')?.value.trim();
      const co    = document.getElementById('company')?.value.trim();

      refNumber.textContent   = ref;
      submittedBy.textContent = `${first} ${last}`;
      submittedCo.textContent = co;

      sessionStorage.removeItem('quotationItems');

      // — Hide form, show inline success —
      form.style.opacity    = '0';
      form.style.transition = 'opacity 0.3s ease';
      setTimeout(() => {
        form.style.display      = 'none';
        document.querySelector('.section-head').style.display = 'none';
        inlineSuccess.classList.add('visible');
      }, 300);

    }, 2000);
  });

});

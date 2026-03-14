/* ═══════════════════════════════════════════
   APEX WHOLESALE — catalog.js
   Full interactivity: filter, search, sort,
   pagination, quick-view modal, order tray
═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────
     DATA — all products
  ────────────────────────────────────── */
  const PRODUCTS = [
    {
      id: 1, cat: 'streetwear', name: 'Dropped-Shoulder Oversized Tee',
      sku: 'APX-ST-1042', fabric: '100% Cotton', moq: 6,
      prices: [8.50, 7.20, 5.90], sizes: 'XS · S · M · L · XL · 2XL',
      gender: 'unisex', price: 8.50,
      colors: ['#1a1a1a','#f5f3ef','#c0392b','#3498db'],
      extraColors: 3,
      badges: ['new','in-stock'],
      img: 'https://images.pexels.com/photos/3764154/pexels-photo-3764154.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 2, cat: 'denim', name: 'Slim-Fit Indigo Wash Jeans',
      sku: 'APX-DN-2187', fabric: '98% Cotton, 2% Elastane', moq: 12,
      prices: [21.00, 18.50, 15.75], sizes: '28 · 30 · 32 · 34 · 36',
      gender: 'men', price: 21.00,
      colors: ['#2c3e6b','#7f8c8d','#1a1a1a'],
      extraColors: 1,
      badges: ['best-seller','in-stock'],
      img: 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 3, cat: 'outerwear', name: 'Utility Field Jacket',
      sku: 'APX-OW-3054', fabric: '65% Poly / 35% Cotton', moq: 6,
      prices: [38.00, 33.50, 28.00], sizes: 'S · M · L · XL · 2XL',
      gender: 'unisex', price: 38.00,
      colors: ['#556b2f','#4a3728','#1a1a1a'],
      extraColors: 0,
      badges: ['hot','low-stock'],
      img: 'https://images.pexels.com/photos/7691168/pexels-photo-7691168.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 4, cat: 'basics', name: 'Essential Crewneck Sweatshirt',
      sku: 'APX-BS-0881', fabric: '100% Combed Cotton', moq: 6,
      prices: [6.50, 5.40, 4.20], sizes: 'XS · S · M · L · XL · 2XL · 3XL',
      gender: 'unisex', price: 6.50,
      colors: ['#f5f3ef','#1a1a1a','#7f8c8d','#d4a76a'],
      extraColors: 8,
      badges: ['in-stock'],
      img: 'https://images.pexels.com/photos/6311387/pexels-photo-6311387.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 5, cat: 'activewear', name: 'Motion Jogger Co-ord Set',
      sku: 'APX-AT-4412', fabric: '80% Poly / 20% Spandex', moq: 6,
      prices: [19.00, 16.00, 13.50], sizes: 'XS · S · M · L · XL',
      gender: 'unisex', price: 19.00,
      colors: ['#1a1a1a','#2c3e50','#b0b0b0'],
      extraColors: 2,
      badges: ['new','in-stock'],
      img: 'https://images.pexels.com/photos/3764154/pexels-photo-3764154.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 6, cat: 'accessories', name: 'Structured Canvas Tote',
      sku: 'APX-AC-7031', fabric: '100% Canvas', moq: 6,
      prices: [11.50, 9.80, 7.90], sizes: 'One Size',
      gender: 'unisex', price: 11.50,
      colors: ['#d4a76a','#1a1a1a','#c0392b'],
      extraColors: 0,
      badges: ['in-stock'],
      img: 'https://images.pexels.com/photos/6786706/pexels-photo-6786706.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 7, cat: 'smart-casual', name: 'Slim-Cut Chino Trouser',
      sku: 'APX-WW-5512', fabric: '97% Cotton / 3% Elastane', moq: 6,
      prices: [16.00, 13.50, 10.90], sizes: '28 · 30 · 32 · 34 · 36 · 38',
      gender: 'men', price: 16.00,
      colors: ['#b5a99a','#1a1a1a','#2c3e50','#556b2f'],
      extraColors: 0,
      badges: ['best-seller','in-stock'],
      img: 'https://images.pexels.com/photos/6311610/pexels-photo-6311610.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 8, cat: 'dresses', name: 'Wrap-Front Midi Dress',
      sku: 'APX-DR-6204', fabric: '100% Viscose', moq: 6,
      prices: [22.00, 18.50, 15.00], sizes: 'XS · S · M · L · XL',
      gender: 'women', price: 22.00,
      colors: ['#e8d5b7','#c0392b','#2c3e50'],
      extraColors: 4,
      badges: ['new','pre-order'],
      img: 'https://images.pexels.com/photos/6765162/pexels-photo-6765162.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 9, cat: 'streetwear', name: 'Heavyweight Drop-Shoulder Hoodie',
      sku: 'APX-ST-1098', fabric: '80% Cotton / 20% Polyester', moq: 6,
      prices: [17.50, 14.90, 11.80], sizes: 'S · M · L · XL · 2XL · 3XL',
      gender: 'unisex', price: 17.50,
      colors: ['#1a1a1a','#7f8c8d','#c0392b','#f56200'],
      extraColors: 2,
      badges: ['hot','in-stock'],
      img: 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 10, cat: 'denim', name: 'Oversized Trucker Denim Jacket',
      sku: 'APX-DN-2244', fabric: '100% Cotton Denim', moq: 12,
      prices: [31.00, 27.00, 22.50], sizes: 'XS · S · M · L · XL · 2XL',
      gender: 'unisex', price: 31.00,
      colors: ['#2c3e6b','#1a1a1a','#b0b0b0'],
      extraColors: 0,
      badges: ['low-stock'],
      img: 'https://images.pexels.com/photos/17029537/pexels-photo-17029537.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 11, cat: 'basics', name: 'Fitted Ribbed-Knit Tank Top',
      sku: 'APX-BS-0934', fabric: '95% Cotton / 5% Elastane', moq: 6,
      prices: [5.50, 4.60, 3.75], sizes: 'XS · S · M · L · XL',
      gender: 'women', price: 5.50,
      colors: ['#f5f3ef','#1a1a1a','#d4a76a','#c0392b'],
      extraColors: 6,
      badges: ['best-seller','in-stock'],
      img: 'https://images.pexels.com/photos/6503007/pexels-photo-6503007.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 12, cat: 'outerwear', name: 'Sherpa-Lined Varsity Bomber',
      sku: 'APX-OW-3102', fabric: 'Shell: 100% Nylon', moq: 6,
      prices: [44.00, 38.50, 32.00], sizes: 'S · M · L · XL · 2XL',
      gender: 'unisex', price: 44.00,
      colors: ['#4a3728','#1a1a1a'],
      extraColors: 0,
      badges: ['new','in-stock'],
      img: 'https://images.pexels.com/photos/10365759/pexels-photo-10365759.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 13, cat: 'activewear', name: 'Seamless Racerback Sports Bra',
      sku: 'APX-AT-4508', fabric: '70% Nylon / 30% Spandex', moq: 6,
      prices: [9.50, 8.00, 6.50], sizes: 'XS · S · M · L · XL',
      gender: 'women', price: 9.50,
      colors: ['#1a1a1a','#f56200','#7f8c8d'],
      extraColors: 3,
      badges: ['new','in-stock'],
      img: 'https://images.pexels.com/photos/6740747/pexels-photo-6740747.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 14, cat: 'smart-casual', name: 'Oxford Cloth Button-Down Shirt',
      sku: 'APX-WW-5680', fabric: '100% Oxford Cotton', moq: 6,
      prices: [14.50, 12.00, 9.90], sizes: 'S · M · L · XL · 2XL',
      gender: 'men', price: 14.50,
      colors: ['#f5f3ef','#2c3e50','#7f8c8d','#c0392b'],
      extraColors: 2,
      badges: ['best-seller','in-stock'],
      img: 'https://images.pexels.com/photos/7550421/pexels-photo-7550421.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 15, cat: 'streetwear', name: 'Relaxed-Fit Cargo Shorts',
      sku: 'APX-ST-1154', fabric: '100% Cotton Twill', moq: 6,
      prices: [13.00, 11.00, 8.80], sizes: 'XS · S · M · L · XL · 2XL',
      gender: 'unisex', price: 13.00,
      colors: ['#556b2f','#1a1a1a','#4a3728'],
      extraColors: 1,
      badges: ['hot','in-stock'],
      img: 'https://images.pexels.com/photos/32085519/pexels-photo-32085519.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 16, cat: 'dresses', name: 'Bias-Cut Satin Slip Maxi Dress',
      sku: 'APX-DR-6311', fabric: '100% Satin Polyester', moq: 6,
      prices: [26.00, 22.50, 18.00], sizes: 'XS · S · M · L · XL',
      gender: 'women', price: 26.00,
      colors: ['#1a1a1a','#c0392b','#2c3e50','#d4a76a'],
      extraColors: 2,
      badges: ['new','in-stock'],
      img: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=600'
    }
  ];

  const ITEMS_PER_PAGE = 12;

  /* ──────────────────────────────────────
     STATE
  ────────────────────────────────────── */
  let state = {
    activeCat: 'all',
    search: '',
    sortBy: 'newest',
    view: 'grid',
    page: 1,
    orderItems: [],   // array of product ids
    priceMin: 4,
    priceMax: 120,
  };

  /* ──────────────────────────────────────
     HELPERS
  ────────────────────────────────────── */
  function badgeHTML(badges) {
    const map = {
      'new':         '<span class="badge badge--new">New</span>',
      'best-seller': '<span class="badge badge--best">Best Seller</span>',
      'hot':         '<span class="badge badge--hot">Hot</span>',
      'in-stock':    '<span class="badge badge--stock badge--green">In Stock</span>',
      'low-stock':   '<span class="badge badge--stock badge--amber">Low Stock</span>',
      'pre-order':   '<span class="badge badge--stock badge--blue">Pre-Order</span>',
    };
    return badges.map(b => map[b] || '').join('');
  }

  function colorDotsHTML(colors, extra) {
    const dots = colors.slice(0, 4).map(c =>
      `<span class="color-dot" style="background:${c}" title="${c}"></span>`
    ).join('');
    const more = extra > 0 ? `<span class="color-more">+${extra}</span>` : '';
    return dots + more;
  }

  function cardHTML(p) {
    return `
      <article class="product-card" data-id="${p.id}" data-cat="${p.cat}" data-price="${p.price}">
        <div class="product-card__img-wrap">
          <img src="${p.img}" alt="${p.name}" loading="lazy" />
          <div class="product-card__badges">${badgeHTML(p.badges)}</div>
          <div class="product-card__actions">
            <button class="card-btn js-quick-view" data-id="${p.id}">Quick View</button>
            <button class="card-btn card-btn--primary js-add-to-order" data-id="${p.id}">Add to Order</button>
          </div>
        </div>
        <div class="product-card__body">
          <div class="product-card__top">
            <span class="product-card__sku">${p.sku}</span>
            <span class="product-card__cat">${p.cat}</span>
          </div>
          <h3 class="product-card__name">${p.name}</h3>
          <div class="product-card__colors">${colorDotsHTML(p.colors, p.extraColors)}</div>
          <div class="product-card__sizes">${p.sizes}</div>
          <div class="pricing-tiers">
            <div class="tier"><span>6–11</span><strong>$${p.prices[0].toFixed(2)}</strong></div>
            <div class="tier"><span>12–23</span><strong>$${p.prices[1].toFixed(2)}</strong></div>
            <div class="tier tier--best"><span>24+</span><strong>$${p.prices[2].toFixed(2)}</strong></div>
          </div>
          <div class="product-card__footer">
            <span class="moq">MOQ: ${p.moq} units</span>
            <span class="fabric">${p.fabric}</span>
          </div>
        </div>
      </article>`;
  }

  /* ──────────────────────────────────────
     FILTER + SORT
  ────────────────────────────────────── */
  function getFiltered() {
    let list = PRODUCTS.filter(p => {
      if (state.activeCat !== 'all' && p.cat !== state.activeCat) return false;
      if (state.search) {
        const q = state.search.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.sku.toLowerCase().includes(q)) return false;
      }
      if (p.price < state.priceMin || p.price > state.priceMax) return false;
      return true;
    });

    switch (state.sortBy) {
      case 'price-asc':  list.sort((a,b) => a.price - b.price); break;
      case 'price-desc': list.sort((a,b) => b.price - a.price); break;
      case 'alpha':      list.sort((a,b) => a.name.localeCompare(b.name)); break;
      case 'best':       list.sort((a,b) => (b.badges.includes('best-seller')?1:0) - (a.badges.includes('best-seller')?1:0)); break;
      // 'newest' = original order (id desc)
      default: list.sort((a,b) => b.id - a.id); break;
    }
    return list;
  }

  /* ──────────────────────────────────────
     RENDER GRID + PAGINATION
  ────────────────────────────────────── */
  const grid       = document.getElementById('productGrid');
  const countEl    = document.getElementById('resultCount');
  const paginationEl = document.getElementById('pagination');

  function render() {
    const filtered = getFiltered();
    const total    = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));

    // clamp page
    if (state.page > totalPages) state.page = totalPages;

    const start  = (state.page - 1) * ITEMS_PER_PAGE;
    const paged  = filtered.slice(start, start + ITEMS_PER_PAGE);

    countEl.textContent = total;

    if (paged.length === 0) {
      grid.innerHTML = `<div class="no-results"><span style="font-size:2rem">🔍</span><p>No styles match your filters.</p></div>`;
    } else {
      grid.innerHTML = paged.map(cardHTML).join('');
    }

    renderPagination(totalPages);
    bindCardEvents();
  }

  function renderPagination(totalPages) {
    if (totalPages <= 1) { paginationEl.innerHTML = ''; return; }

    let html = `<button class="page-btn page-btn--prev" id="prevBtn" ${state.page === 1 ? 'disabled' : ''}>← Prev</button>`;

    const delta = 1; // pages around current
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= state.page - delta && i <= state.page + delta)) {
        html += `<button class="page-btn ${i === state.page ? 'active' : ''}" data-page="${i}">${i}</button>`;
      } else if (i === state.page - delta - 1 || i === state.page + delta + 1) {
        html += `<span class="page-ellipsis">…</span>`;
      }
    }

    html += `<button class="page-btn page-btn--next" id="nextBtn" ${state.page === totalPages ? 'disabled' : ''}>Next →</button>`;
    paginationEl.innerHTML = html;

    // bind
    paginationEl.querySelector('#prevBtn')?.addEventListener('click', () => { state.page--; scrollToTop(); render(); });
    paginationEl.querySelector('#nextBtn')?.addEventListener('click', () => { state.page++; scrollToTop(); render(); });
    paginationEl.querySelectorAll('[data-page]').forEach(btn => {
      btn.addEventListener('click', () => { state.page = +btn.dataset.page; scrollToTop(); render(); });
    });
  }

  function scrollToTop() {
    document.querySelector('.product-area')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ──────────────────────────────────────
     CARD EVENT BINDING (re-bound each render)
  ────────────────────────────────────── */
  function bindCardEvents() {
    grid.querySelectorAll('.js-add-to-order').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = +btn.dataset.id;
        addToOrder(id, btn);
      });
    });

    grid.querySelectorAll('.js-quick-view').forEach(btn => {
      btn.addEventListener('click', () => openModal(+btn.dataset.id));
    });
  }

  /* ──────────────────────────────────────
     CATEGORY TABS
  ────────────────────────────────────── */
  document.querySelectorAll('.cat-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      state.activeCat = tab.dataset.cat;
      state.page = 1;
      render();
    });
  });

  /* ──────────────────────────────────────
     SEARCH
  ────────────────────────────────────── */
  document.getElementById('searchInput').addEventListener('input', e => {
    state.search = e.target.value.trim();
    state.page = 1;
    render();
  });

  /* ──────────────────────────────────────
     SORT
  ────────────────────────────────────── */
  document.getElementById('sortSelect').addEventListener('change', e => {
    state.sortBy = e.target.value;
    state.page = 1;
    render();
  });

  /* ──────────────────────────────────────
     VIEW TOGGLE
  ────────────────────────────────────── */
  document.getElementById('gridView').addEventListener('click', function () {
    state.view = 'grid';
    grid.classList.remove('product-grid--list');
    document.getElementById('listView').classList.remove('active');
    this.classList.add('active');
  });
  document.getElementById('listView').addEventListener('click', function () {
    state.view = 'list';
    grid.classList.add('product-grid--list');
    document.getElementById('gridView').classList.remove('active');
    this.classList.add('active');
  });

  /* ──────────────────────────────────────
     PRICE RANGE SLIDER
  ────────────────────────────────────── */
  const rMin = document.getElementById('rangeMin');
  const rMax = document.getElementById('rangeMax');
  const fill = document.getElementById('priceFill');
  const priceMinEl = document.getElementById('priceMin');
  const priceMaxEl = document.getElementById('priceMax');
  const thumbMin   = document.getElementById('thumbMin');
  const thumbMax   = document.getElementById('thumbMax');

  function updateRange() {
    let lo = +rMin.value, hi = +rMax.value;
    if (lo > hi) { [lo, hi] = [hi, lo]; }
    priceMinEl.textContent = lo;
    priceMaxEl.textContent = hi;
    const pct = v => ((v - 4) / (120 - 4)) * 100;
    fill.style.left  = pct(lo) + '%';
    fill.style.width = (pct(hi) - pct(lo)) + '%';
    thumbMin.style.left = pct(lo) + '%';
    thumbMax.style.left = pct(hi) + '%';
    state.priceMin = lo;
    state.priceMax = hi;
    state.page = 1;
    render();
  }
  rMin.addEventListener('input', updateRange);
  rMax.addEventListener('input', updateRange);
  updateRange();

  /* ──────────────────────────────────────
     SIDEBAR FILTER TOGGLE (mobile)
  ────────────────────────────────────── */
  const filterToggle = document.getElementById('filterToggle');
  const sidebar      = document.querySelector('.sidebar');
  filterToggle?.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    filterToggle.classList.toggle('open');
    filterToggle.querySelector('.filter-toggle__label').textContent =
      sidebar.classList.contains('open') ? 'Hide Filters' : 'Show Filters';
  });

  /* ──────────────────────────────────────
     RESET FILTERS
  ────────────────────────────────────── */
  document.querySelector('.sidebar__reset')?.addEventListener('click', () => {
    state.activeCat = 'all';
    state.search    = '';
    state.priceMin  = 4;
    state.priceMax  = 120;
    state.page      = 1;
    document.getElementById('searchInput').value = '';
    rMin.value = 4; rMax.value = 120; updateRange();
    document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
    document.querySelector('.cat-tab[data-cat="all"]').classList.add('active');
    document.querySelectorAll('.sidebar input[type=checkbox]').forEach(cb => {
      cb.checked = false;
    });
    render();
  });

  /* ──────────────────────────────────────
     FILTER CHIPS — remove individual
  ────────────────────────────────────── */
  document.querySelectorAll('.filter-chip button').forEach(btn => {
    btn.addEventListener('click', () => btn.closest('.filter-chip').remove());
  });
  document.querySelector('.active-filters__clear')?.addEventListener('click', () => {
    document.querySelectorAll('.filter-chip:not(.active-filters__clear)').forEach(c => c.remove());
  });

  /* ──────────────────────────────────────
     ORDER TRAY
  ────────────────────────────────────── */
  const trayCount  = document.getElementById('trayCount');
  const trayHint   = document.getElementById('trayHint');
  const submitBtn  = document.getElementById('submitOrderBtn');

  function updateTray() {
    const n = state.orderItems.length;
    trayCount.innerHTML = `<strong>${n}</strong> item${n !== 1 ? 's' : ''} in your order`;
    if (n === 0) {
      trayHint.textContent = 'Browse the catalog and add styles above';
      submitBtn.disabled = true;
    } else {
      const total = state.orderItems.reduce((sum, id) => {
        const p = PRODUCTS.find(x => x.id === id);
        return sum + (p ? p.prices[2] : 0);
      }, 0);
      trayHint.textContent = `Est. unit cost (24+ rate): $${total.toFixed(2)}`;
      submitBtn.disabled = false;
    }
  }

  function addToOrder(id, btn) {
    state.orderItems.push(id);
    updateTray();
    // visual feedback on button
    const orig = btn.textContent;
    btn.textContent = '✓ Added';
    btn.classList.add('card-btn--added');
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = orig;
      btn.classList.remove('card-btn--added');
      btn.disabled = false;
    }, 1500);
  }

  document.getElementById('saveDraftBtn')?.addEventListener('click', () => {
    if (state.orderItems.length === 0) return;
    alert(`Draft saved! ${state.orderItems.length} item(s) saved to your draft order.`);
  });

  submitBtn?.addEventListener('click', () => {
    if (state.orderItems.length === 0) return;
    // Build quotation payload and pass via sessionStorage
    const items = state.orderItems.map(id => PRODUCTS.find(x => x.id === id)).filter(Boolean);
    sessionStorage.setItem('quotationItems', JSON.stringify(items));
    window.location.href = 'quotation.html';
  });

  /* ──────────────────────────────────────
     QUICK VIEW MODAL
  ────────────────────────────────────── */
  const modalOverlay = document.getElementById('modalOverlay');
  const modalImg     = document.getElementById('modalImg');
  const modalSku     = document.getElementById('modalSku');
  const modalName    = document.getElementById('modalName');
  const modalDetails = document.getElementById('modalDetails');
  const modalAddBtn  = document.getElementById('modalAddBtn');

  function openModal(id) {
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) return;

    modalImg.src = p.img.replace('w=600','w=800');
    modalImg.alt = p.name;
    modalSku.textContent  = p.sku;
    modalName.textContent = p.name;

    modalDetails.innerHTML = `
      <div class="modal__detail-row"><span>Category</span><span>${p.cat.charAt(0).toUpperCase()+p.cat.slice(1)}</span></div>
      <div class="modal__detail-row"><span>Fabric</span><span>${p.fabric}</span></div>
      <div class="modal__detail-row"><span>Sizes</span><span>${p.sizes}</span></div>
      <div class="modal__detail-row"><span>MOQ</span><span>${p.moq} units</span></div>
      <div class="modal__detail-row"><span>6–11 units</span><span>$${p.prices[0].toFixed(2)} / unit</span></div>
      <div class="modal__detail-row"><span>12–23 units</span><span>$${p.prices[1].toFixed(2)} / unit</span></div>
      <div class="modal__detail-row"><span>24+ units</span><span style="color:var(--orange)">$${p.prices[2].toFixed(2)} / unit</span></div>
    `;

    modalAddBtn.onclick = () => {
      addToOrder(id, modalAddBtn);
      closeModal();
    };

    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.getElementById('modalClose')?.addEventListener('click', closeModal);
  modalOverlay?.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  /* ──────────────────────────────────────
     INITIAL RENDER
  ────────────────────────────────────── */
  updateTray();
  render();

});


/* ═══════════════════════════════════════
   APEX WHOLESALE — careers.js
═══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  const filterTags = document.querySelectorAll('.filter-tag');
  const jobCards   = document.querySelectorAll('.job-card');

  filterTags.forEach(btn => {
    btn.addEventListener('click', () => {
      filterTags.forEach(b => b.classList.remove('filter-tag--active'));
      btn.classList.add('filter-tag--active');

      const cat = btn.textContent.trim();

      jobCards.forEach(card => {
        const match = cat === 'All' || card.dataset.cat === cat;
        card.style.display = match ? '' : 'none';
      });
    });
  });

});

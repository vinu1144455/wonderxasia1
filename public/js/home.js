/* Homepage product showcase — plain JavaScript (replaces the old React/Babel build) */
(function () {
  var root = document.getElementById('home-products');
  if (!root) return;

  var TABS = [
    { id: 'all',    label: 'Flagship Range',      cats: null },
    { id: 'spices', label: 'Spices',              cats: ['whole-spices', 'ground-spices'] },
    { id: 'blends', label: 'Masala Blends',       cats: ['blended-masalas'] },
    { id: 'staples',label: 'Rice & Pulses',       cats: ['basmati-rice', 'grains', 'pulses-lentils'] }
  ];
  var products = [], active = 'all';

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function render() {
    var tab = TABS.filter(function (t) { return t.id === active; })[0];
    var list = products.filter(function (p) { return !tab.cats || tab.cats.indexOf(p.category) > -1; }).slice(0, 8);

    var html = '<div class="commodities-filter-tabs">' + TABS.map(function (t) {
      return '<button class="filter-tab-pill' + (t.id === active ? ' active' : '') + '" data-tab="' + t.id + '">' + t.label + '</button>';
    }).join('') + '</div><div class="interactive-product-grid">' + list.map(function (p) {
      return '<div class="interactive-card-wrapper in-view"><div class="interactive-card">' +
        '<div class="card-media"><img src="' + esc(p.image) + '" alt="' + esc(p.name) + '" loading="lazy" width="400" height="300" />' +
        '<span class="card-cat-badge">' + esc(p.categoryName) + '</span></div>' +
        '<div class="card-body"><h3 class="card-title"><a href="/product/' + esc(p.slug) + '">' + esc(p.name) + '</a></h3>' +
        '<div class="card-specs-row"><span>Origin: <strong>' + esc(p.origin ? p.origin.split(',')[0] : 'India') + '</strong></span></div>' +
        '<div class="card-footer-actions"><a href="/product/' + esc(p.slug) + '" class="btn btn-outline btn-sm">Details</a>' +
        '<a href="/rfq?product=' + encodeURIComponent(p.name) + '" class="btn btn-primary btn-sm">Inquire</a></div></div></div></div>';
    }).join('') + '</div>';
    root.innerHTML = html;
  }

  root.addEventListener('click', function (e) {
    var tabBtn = e.target.closest('[data-tab]');
    if (tabBtn) { active = tabBtn.getAttribute('data-tab'); render(); return; }
  });

  fetch('/api/products')
    .then(function (r) { return r.json(); })
    .then(function (d) { products = d.products || []; render(); })
    .catch(function () { root.innerHTML = '<p style="text-align:center;">Products are temporarily unavailable. <a href="/products">Open the full catalog</a>.</p>'; });
})();

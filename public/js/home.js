/* Homepage product showcase & direct inquiry handling */
(function () {
  // Handle direct inquiry form on homepage
  var inquiryForm = document.getElementById('wx-direct-inquiry-form');
  if (inquiryForm) {
    inquiryForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = inquiryForm.querySelector('[name="name"]').value.trim();
      var email = inquiryForm.querySelector('[name="email"]').value.trim();
      var code = inquiryForm.querySelector('[name="code"]') ? inquiryForm.querySelector('[name="code"]').value.trim() : '+91';
      var phone = inquiryForm.querySelector('[name="phone"]').value.trim();
      var subjectSelect = inquiryForm.querySelector('[name="subject"]');
      var subject = subjectSelect ? subjectSelect.value : 'Product Enquiry';
      var message = inquiryForm.querySelector('[name="message"]').value.trim();

      if (!name || (!email && !phone)) {
        alert('Please provide your name and contact details (email or phone).');
        return;
      }

      var fullPhone = (code + ' ' + phone).trim();
      var submitBtn = inquiryForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Submitting...</span>';
      }

      fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          email: email,
          phone: fullPhone,
          subject: subject,
          products: [subject],
          message: message
        })
      })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data.success) {
          var card = document.getElementById('home-reachout-card') || inquiryForm;
          card.innerHTML = 
            '<div style="text-align: center; padding: 40px 16px;">' +
              '<div style="width: 64px; height: 64px; border-radius: 50%; background: rgba(254, 204, 0, 0.15); border: 2px solid #fecc00; display: grid; place-items: center; margin: 0 auto 20px; color: #fecc00;">' +
                '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>' +
              '</div>' +
              '<span style="display: inline-block; padding: 4px 14px; background: rgba(254, 204, 0, 0.15); color: #fecc00; border: 1px solid rgba(254, 204, 0, 0.4); border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-bottom: 12px;">Reference: ' + (data.inquiryId || 'CONFIRMED') + '</span>' +
              '<h3 style="font-family: var(--font-marcellus, serif); font-size: 26px; color: #ffffff; margin-bottom: 12px;">Inquiry Successfully Transmitted</h3>' +
              '<p style="font-size: 14.5px; color: rgba(255, 255, 255, 0.85); margin: 0 auto 24px; max-width: 480px; line-height: 1.6;">' +
                'Thank you, <strong style="color: #fecc00;">' + name + '</strong>. Your requirement has been registered. Our international trade managers will connect with you within 24 business hours.' +
              '</p>' +
              '<a href="/products" class="btn btn-primary" style="padding: 10px 20px; font-size: 12px; font-weight: 700;">Explore Product Catalog</a>' +
            '</div>';
        } else {
          alert(data.message || 'Error transmitting inquiry.');
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Submit Now</span> ↗';
          }
        }
      })
      .catch(function () {
        alert('Network error. Please try again.');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Submit Now</span> ↗';
        }
      });
    });
  }

  var root = document.getElementById('home-products');
  if (!root) return;

  var TABS = [
    { id: 'all',    label: 'Flagship Range',      cats: null },
    { id: 'whole',  label: 'Whole Spices',        cats: ['whole-spices'] },
    { id: 'spices', label: 'Spices',              cats: ['spices'] },
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
        '<a href="/rfq?product=' + encodeURIComponent(p.name) + '" class="btn btn-primary btn-sm">Enquire</a></div></div></div></div>';
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

/**
 * WONDERXASIA - PRODUCT SPECIFICATION VIEW
 * Fetches single product details and related recommendations
 */

let currentProduct = null;

async function initProductDetail() {
  const container = document.querySelector('#product-detail-container');
  if (!container) return;

  // Extract slug from URL path: /product/:slug
  let slug = window.location.pathname.split('/').filter(Boolean).pop();
  if (!slug || slug === 'product' || slug === 'product.html') {
    const params = new URLSearchParams(window.location.search);
    slug = params.get('slug') || 'cumin-seeds';
  }

  try {
    const res = await fetch(`/api/products/${slug}`);
    const data = await res.json();

    if (!data.success || !data.product) {
      container.innerHTML = `
        <div class="container section-padding" style="text-align: center;">
          <h2 class="heading-primary">Product Not Found</h2>
          <p class="body-lead" style="margin-bottom: 24px;">The export spice or pantry item requested is unavailable or has been archived.</p>
          <a href="/products" class="btn btn-primary">Return to Catalog</a>
        </div>
      `;
      return;
    }

    currentProduct = data.product;
    const { product, related } = data;

    // Set page title
    document.title = `${product.name} — Indian Origin Export Specification | Wonderxasia`;

    // Populate Breadcrumb
    const bcCat = document.querySelector('#p-bc-category');
    if (bcCat) {
      bcCat.textContent = product.categoryName;
      bcCat.href = `/category/${product.category}`;
    }
    const bcProd = document.querySelector('#p-bc-product');
    if (bcProd) bcProd.textContent = product.name;

    // Populate Visual & Main Details
    const imgEl = document.querySelector('#p-main-img');
    if (imgEl) {
      imgEl.src = `/${product.image}`;
      imgEl.alt = product.name;
    }

    document.querySelector('#p-title').textContent = product.name;
    document.querySelector('#p-hindi').textContent = product.hindiName || '';
    document.querySelector('#p-category-badge').textContent = product.categoryName;
    document.querySelector('#p-form-badge').textContent = product.form;
    document.querySelector('#p-description').textContent = product.description;

    // Specifications Table
    const specsTable = document.querySelector('#p-specs-tbody');
    if (specsTable) {
      specsTable.innerHTML = `
        <tr><th>Commodity / English</th><td>${product.name}</td></tr>
        <tr><th>Indian Name</th><td>${product.hindiName || '—'}</td></tr>
        <tr><th>Form &amp; Physical State</th><td>${product.form}</td></tr>
        <tr><th>Primary Origin</th><td>${product.origin || 'Gujarat / Rajasthan / Kerala, India'}</td></tr>
        <tr><th>Available Grades</th><td>${product.grades || 'Export Standard / Machine Cleaned / Sortex'}</td></tr>
        <tr><th>Purity Standard</th><td>${product.purity || '99.0% - 99.5% Sortex Clean'}</td></tr>
        <tr><th>Moisture Limit</th><td>${product.moisture || 'Max 10%'}</td></tr>
        <tr><th>Export HS Code</th><td>${product.hsCode || '—'}</td></tr>
        <tr><th>Shelf Life</th><td>${product.shelfLife || '18 - 24 Months'}</td></tr>
        <tr><th>Packaging Formats</th><td>${product.packingOptions || '25kg / 50kg PP Bags / Multi-wall Paper Bags'}</td></tr>
        <tr><th>Minimum Order Target</th><td>${product.minOrder || 'Per buyer requirement / Trial FCL'}</td></tr>
      `;
    }

    // Action buttons
    const addBasketBtn = document.querySelector('#p-add-basket-btn');
    if (addBasketBtn) {
      addBasketBtn.addEventListener('click', () => {
        const qtyInput = document.querySelector('#p-qty-input');
        const quantity = qtyInput ? qtyInput.value : '5 Metric Tonnes';
        BasketStore.add({
          id: product.id,
          slug: product.slug,
          name: product.name,
          categoryName: product.categoryName,
          form: product.form,
          quantity: quantity
        });
      });
    }

    const quickQuoteBtn = document.querySelector('#p-direct-rfq-btn');
    if (quickQuoteBtn) {
      quickQuoteBtn.addEventListener('click', () => {
        BasketStore.add({
          id: product.id,
          slug: product.slug,
          name: product.name,
          categoryName: product.categoryName,
          form: product.form
        });
        window.location.href = '/rfq';
      });
    }

    // CoA Spec Downloader Handler
    const coaBtn = document.querySelector('#p-download-coa-btn');
    if (coaBtn) {
      coaBtn.addEventListener('click', () => {
        if (window.downloadCoASpecSheet) {
          window.downloadCoASpecSheet(product.name, product.hsCode, product.purity);
        }
      });
    }

    // Direct WhatsApp Trade Desk Link
    const waLink = document.querySelector('#p-whatsapp-link');
    if (waLink) {
      const waText = encodeURIComponent(`Hello Wonderxasia Export Desk, I would like to request an immediate FOB/CIF quote for ${product.name} (${product.form}) with HS Code ${product.hsCode || ''}.`);
      waLink.href = `https://wa.me/919876543210?text=${waText}`;
    }

    // Related Products Grid
    const relatedGrid = document.querySelector('#p-related-grid');
    if (relatedGrid && related && related.length > 0) {
      relatedGrid.innerHTML = related.map((rel, i) => {
        const imgSrc = rel.image.startsWith('/') ? rel.image : '/' + rel.image;
        return `
        <article class="product-card in-view">
          <div class="product-thumb">
            <img src="${imgSrc}" alt="${rel.name}" loading="lazy" />
            <span class="product-category-tag">${rel.form}</span>
          </div>
          <div class="product-info">
            <h4 class="product-title"><a href="/product/${rel.slug}">${rel.name}</a></h4>
            <span class="product-hindi">${rel.hindiName || ''}</span>
            <div class="product-actions" style="margin-top: 12px; gap: 8px;">
              <a href="/product/${rel.slug}" class="explore-btn" style="flex: 1; justify-content: center; font-size: 11px; padding: 7px 10px;">
                Specs
                <svg width="10" height="10" viewBox="0 0 12 12"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.1865 1.06237L0 11.2484L0.751627 12L10.9376 1.81347V8.85645H12V0H3.14355V1.06237H10.1865Z" /></svg>
              </a>
              <button class="primary-btn1" onclick="window.BasketStore && window.BasketStore.add({ id: '${rel.id}', slug: '${rel.slug}', name: '${rel.name.replace(/'/g, "\\'")}', categoryName: '${rel.categoryName.replace(/'/g, "\\'")}', form: '${rel.form}' })" style="flex: 1; justify-content: center; font-size: 11px; padding: 7px 10px;">
                + RFQ
                <svg width="10" height="10" viewBox="0 0 12 12"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.1865 1.06237L0 11.2484L0.751627 12L10.9376 1.81347V8.85645H12V0H3.14355V1.06237H10.1865Z" /></svg>
              </button>
            </div>
          </div>
        </article>
      `}).join('');
    }

  } catch (err) {
    console.error('Error fetching product details:', err);
  }
}

document.addEventListener('DOMContentLoaded', initProductDetail);

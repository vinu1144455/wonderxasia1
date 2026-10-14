/**
 * WONDERXASIA - CATEGORY VIEW CONTROLLER
 * Fetches single category and its matching products
 */

async function initCategoryPage() {
  const container = document.querySelector('#category-page-container');
  if (!container) return;

  // Extract slug from URL path: /category/:slug
  let slug = window.location.pathname.split('/').filter(Boolean).pop();
  if (!slug || slug === 'category' || slug === 'category.html') {
    // Check search param fallback
    const params = new URLSearchParams(window.location.search);
    slug = params.get('slug') || 'whole-spices';
  }

  try {
    const res = await fetch(`/api/categories/${slug}`);
    const data = await res.json();

    if (!data.success || !data.category) {
      container.innerHTML = `
        <div class="container section-padding" style="text-align: center;">
          <h2 class="heading-primary">Category Not Found</h2>
          <p class="body-lead" style="margin-bottom: 24px;">The spice or pantry category you requested could not be located.</p>
          <a href="/categories" class="btn btn-primary">Browse All Categories</a>
        </div>
      `;
      return;
    }

    const { category, products } = data;

    // Update document title
    document.title = `${category.name} Export Specifications — Wonderxasia`;

    // Populate Category Hero Banner
    document.querySelector('#cat-title').textContent = category.name;
    document.querySelector('#cat-hindi').textContent = category.hindiName || '';
    document.querySelector('#cat-desc').textContent = category.description;
    document.querySelector('#cat-breadcrumb-curr').textContent = category.name;
    document.querySelector('#cat-badge-count').textContent = `${products.length} Export Items`;
    
    // Background visual
    const heroBg = document.querySelector('#cat-hero-bg');
    if (heroBg && category.image) {
      heroBg.style.backgroundImage = `url('/${category.image}')`;
    }

    // Origin and grades chips
    const specsEl = document.querySelector('#cat-specs-chips');
    if (specsEl) {
      specsEl.innerHTML = `
        <div style="display: flex; flex-wrap: wrap; gap: 12px; margin-top: 20px;">
          <div class="badge badge-gold" style="font-size: 12px; padding: 6px 14px;">
            🌾 Origin: ${category.originHighlights}
          </div>
          ${(category.gradesAvailable || []).map(g => `
            <div class="badge" style="font-size: 12px; padding: 6px 14px;">
              ✓ ${g}
            </div>
          `).join('')}
        </div>
      `;
    }

    // Render Product Cards
    const grid = document.querySelector('#cat-products-grid');
    if (grid) {
      window.currentCategoryProducts = products;
      grid.innerHTML = products.map((product, i) => {
        const imgSrc = product.image.startsWith('/') ? product.image : '/' + product.image;
        return `
        <article class="product-card in-view" style="animation-delay: ${Math.min(i * 30, 300)}ms">
          <div class="product-thumb">
            <img src="${imgSrc}" alt="${product.name}" loading="lazy" />
            <span class="product-category-tag">${product.form}</span>
          </div>
          <div class="product-info">
            <h3 class="product-title"><a href="/product/${product.slug}">${product.name}</a></h3>
            <span class="product-hindi">${product.hindiName || ''}</span>
            
            <div class="product-meta-row">
              <span class="product-meta-item">Purity: <strong>${product.purity || '99%'}</strong></span>
              <span class="product-meta-item">HS Code: <strong>${product.hsCode || '—'}</strong></span>
            </div>

            <p class="product-desc">${product.description}</p>
            
            <div class="product-actions" style="flex-wrap: wrap; gap: 8px;">
              <a href="/product/${product.slug}" class="explore-btn" style="flex: 1; justify-content: center; font-size: 11px; padding: 8px 10px;">
                Details &amp; Specs
                <svg width="10" height="10" viewBox="0 0 12 12"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.1865 1.06237L0 11.2484L0.751627 12L10.9376 1.81347V8.85645H12V0H3.14355V1.06237H10.1865Z" /></svg>
              </a>
              <button class="primary-btn1" onclick="window.BasketStore && window.BasketStore.add({ id: '${product.id}', slug: '${product.slug}', name: '${product.name.replace(/'/g, "\\'")}', categoryName: '${category.name.replace(/'/g, "\\'")}', form: '${product.form}' })" title="Add to RFQ Basket" style="flex: 1; justify-content: center; font-size: 11px; padding: 8px 10px;">
                + RFQ
                <svg width="10" height="10" viewBox="0 0 12 12"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.1865 1.06237L0 11.2484L0.751627 12L10.9376 1.81347V8.85645H12V0H3.14355V1.06237H10.1865Z" /></svg>
              </button>
            </div>

            <div style="display: flex; gap: 8px; margin-top: 8px;">
              <button class="btn-coa-download" style="flex: 1; justify-content: center;" onclick="window.downloadCoASpecSheet && window.downloadCoASpecSheet('${product.name.replace(/'/g, "\\'")}', '${product.hsCode || '0909'}', '${product.purity || '99.5% Sortex Clean'}')">
                📄 Spec / CoA
              </button>
              <a href="https://wa.me/919876543210?text=Inquiry%20for%20${encodeURIComponent(product.name)}%20(${product.form})%20from%20Wonderxasia" 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 class="btn btn-sm" 
                 style="background: rgba(37, 211, 102, 0.15); color: #047857; border: 1px solid rgba(37, 211, 102, 0.3); font-size: 11px; padding: 6px 10px;"
                 title="Instant WhatsApp Quote">
                💬 WhatsApp
              </a>
            </div>
          </div>
        </article>
      `}).join('');
    }

  } catch (err) {
    console.error('Error loading category:', err);
  }
}

document.addEventListener('DOMContentLoaded', initCategoryPage);

/**
 * WONDERXASIA - CATALOG CONTROLLER
 * Live category switching, search, and dynamic product rendering
 */

let allProducts = [];
let activeCategory = 'all';
let searchQuery = '';
let currentSort = 'default';

async function initCatalog() {
  const grid = document.querySelector('#catalog-grid');
  if (!grid) return;

  // Read URL params (e.g. ?category=whole-spices&search=cumin)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('category')) {
    activeCategory = urlParams.get('category');
  }
  if (urlParams.has('search')) {
    searchQuery = urlParams.get('search');
    const input = document.querySelector('#catalog-search-input');
    if (input) input.value = searchQuery;
  }

  // Fetch products from Express backend
  try {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
        <div style="display: inline-block; width: 36px; height: 36px; border: 3px solid var(--c-border-gold); border-top-color: var(--c-saffron-500); border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
        <p style="margin-top: 14px; font-weight: 600; color: var(--c-ink-700);">Loading export catalog from server...</p>
      </div>
    `;

    const res = await fetch('/api/products');
    const data = await res.json();
    if (data.success && data.products) {
      allProducts = data.products;
      setupCategoryPills();
      setupSearchAndSort();
      renderCatalog();
    }
  } catch (err) {
    grid.innerHTML = `<p style="grid-column: 1/-1; color: red; text-align: center;">Failed to load products from server. Please refresh.</p>`;
  }
}

function setupCategoryPills() {
  const container = document.querySelector('#category-pills-bar');
  if (!container) return;

  // Add click handlers to pills
  container.querySelectorAll('.category-pill').forEach(pill => {
    const cat = pill.dataset.category;
    if (cat === activeCategory) {
      pill.classList.add('active');
    } else {
      pill.classList.remove('active');
    }

    pill.addEventListener('click', () => {
      container.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeCategory = pill.dataset.category;
      
      // Update browser URL without reload
      const newUrl = new URL(window.location);
      if (activeCategory === 'all') {
        newUrl.searchParams.delete('category');
      } else {
        newUrl.searchParams.set('category', activeCategory);
      }
      window.history.pushState({}, '', newUrl);

      renderCatalog();
    });
  });
}

function setupSearchAndSort() {
  const searchInput = document.querySelector('#catalog-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      renderCatalog();
    });
  }

  const sortSelect = document.querySelector('#catalog-sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      renderCatalog();
    });
  }
}

window.addToBasketById = function(productId) {
  const prod = allProducts.find(p => p.id === productId || p.slug === productId);
  if (prod && window.BasketStore) {
    window.BasketStore.add({
      id: prod.id,
      slug: prod.slug,
      name: prod.name,
      categoryName: prod.categoryName,
      form: prod.form
    });
  }
};

window.downloadCoAById = function(productId) {
  const prod = allProducts.find(p => p.id === productId || p.slug === productId);
  if (prod && window.downloadCoASpecSheet) {
    window.downloadCoASpecSheet(prod.name, prod.hsCode || '0909', prod.purity || '99.5% Sortex Clean');
  }
};

function renderCatalog() {
  const grid = document.querySelector('#catalog-grid');
  const countEl = document.querySelector('#catalog-result-count');
  if (!grid) return;

  let filtered = allProducts.filter(p => {
    const matchCat = activeCategory === 'all' || p.category === activeCategory;
    const matchSearch = !searchQuery || 
      `${p.name} ${p.hindiName || ''} ${p.categoryName || ''} ${p.origin || ''} ${p.description || ''} ${p.hsCode || ''}`.toLowerCase().includes(searchQuery);
    return matchCat && matchSearch;
  });

  // Apply sorting
  if (currentSort === 'name-asc') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (currentSort === 'name-desc') {
    filtered.sort((a, b) => b.name.localeCompare(a.name));
  } else if (currentSort === 'featured') {
    filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }

  if (countEl) {
    countEl.textContent = `${filtered.length} products found`;
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 80px 20px; background: #ffffff; border-radius: 12px; border: 1px dashed var(--c-border-medium);">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin: 0 auto 12px; color: var(--c-ink-400);">
          <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <h3 style="font-family: var(--font-serif); font-size: 22px; color: var(--c-forest-950); margin-bottom: 6px;">No products match your criteria</h3>
        <p style="color: var(--c-ink-500); font-size: 14px; margin-bottom: 20px;">Try clearing search keywords or selecting another category.</p>
        <button class="btn btn-outline btn-sm" onclick="clearCatalogFilters()">Reset All Filters</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map((product, i) => {
    const imgSrc = product.image.startsWith('/') ? product.image : '/' + product.image;
    return `
    <article class="product-card in-view" style="animation-delay: ${Math.min(i * 30, 300)}ms">
      <div class="product-thumb">
        <img src="${imgSrc}" alt="${product.name}" loading="lazy" />
        <span class="product-category-tag">${product.categoryName}</span>
      </div>
      <div class="product-info">
        <h3 class="product-title"><a href="/product/${product.slug}">${product.name}</a></h3>
        <span class="product-hindi">${product.hindiName || ''}</span>
        
        <div class="product-meta-row">
          <span class="product-meta-item">Form: <strong>${product.form}</strong></span>
          <span class="product-meta-item">HS Code: <strong>${product.hsCode || '—'}</strong></span>
        </div>

        <p class="product-desc">${product.description}</p>
        
        <div class="product-actions" style="flex-wrap: wrap; gap: 8px;">
          <a href="/product/${product.slug}" class="explore-btn" style="flex: 1; justify-content: center; font-size: 11px; padding: 8px 10px;">
            Details &amp; Specs
            <svg width="10" height="10" viewBox="0 0 12 12"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.1865 1.06237L0 11.2484L0.751627 12L10.9376 1.81347V8.85645H12V0H3.14355V1.06237H10.1865Z" /></svg>
          </a>
          <button class="primary-btn1" onclick="window.addToBasketById('${product.id}')" title="Add to RFQ Basket" style="flex: 1; justify-content: center; font-size: 11px; padding: 8px 10px;">
            + RFQ
            <svg width="10" height="10" viewBox="0 0 12 12"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.1865 1.06237L0 11.2484L0.751627 12L10.9376 1.81347V8.85645H12V0H3.14355V1.06237H10.1865Z" /></svg>
          </button>
        </div>
        
        <div style="display: flex; gap: 8px; margin-top: 8px;">
          <button class="btn-coa-download" style="flex: 1; justify-content: center;" onclick="window.downloadCoAById('${product.id}')">
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

function clearCatalogFilters() {
  activeCategory = 'all';
  searchQuery = '';
  const input = document.querySelector('#catalog-search-input');
  if (input) input.value = '';
  const pills = document.querySelectorAll('.category-pill');
  pills.forEach(p => p.classList.toggle('active', p.dataset.category === 'all'));
  window.history.pushState({}, '', window.location.pathname);
  renderCatalog();
}

document.addEventListener('DOMContentLoaded', initCatalog);

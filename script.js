const products = [
  { name: 'Cumin Seeds / Jeera', category: 'whole', form: 'Whole seed', image: 'images/products/cumin-seeds.jpg', description: 'A warm, earthy whole spice for seasoning, blends and food manufacturing.' },
  { name: 'Cumin Powder', category: 'ground', form: 'Ground spice', image: 'images/products/cumin-powder.jpg', description: 'Ground cumin for seasoning blends, food preparation and ingredient applications.' },
  { name: 'Red Chilli Powder', category: 'ground', form: 'Ground spice', image: 'images/products/red-chilli-powder.jpg', description: 'Red chilli in powder form. Discuss heat profile, colour preference and specification for your market.' },
  { name: 'Whole Dry Red Chilli', category: 'whole', form: 'Whole dried', image: 'images/products/whole-dry-red-chilli.jpg', description: 'Dried whole chillies for further processing, retail packs or foodservice use.' },
  { name: 'Turmeric Powder', category: 'ground', form: 'Ground spice', image: 'images/products/turmeric-powder.jpg', description: 'A golden turmeric powder for food production, seasoning and pantry ranges.' },
  { name: 'Turmeric Fingers', category: 'whole', form: 'Dried whole rhizome', image: 'images/products/turmeric-fingers.jpg', description: 'Whole dried turmeric fingers for grinding or further processing.' },
  { name: 'Coriander Powder', category: 'ground', form: 'Ground spice', image: 'images/products/coriander-powder.jpg', description: 'Milled coriander seed, suited to seasoning, culinary and ingredient use.' },
  { name: 'Coriander Seeds', category: 'whole', form: 'Whole seed', image: 'images/products/coriander-seeds.jpg', description: 'A citrus-scented whole seed used in spice blends, pickling and food preparation.' },
  { name: 'Black Pepper', category: 'whole', form: 'Whole peppercorn', image: 'images/products/black-pepper.jpg', description: 'Whole black peppercorns for grinding, blending and culinary applications.' },
  { name: 'Green Cardamom', category: 'whole', form: 'Whole pod', image: 'images/products/green-cardamom.jpg', description: 'Aromatic green cardamom pods for sweet, savoury and beverage applications.' },
  { name: 'Fennel Seeds', category: 'whole', form: 'Whole seed', image: 'images/products/fennel-seeds.jpg', description: 'Sweet, aromatic fennel seeds used in seasonings, blends and culinary products.' },
  { name: 'Fenugreek Seeds', category: 'whole', form: 'Whole seed', image: 'images/products/fenugreek-seeds.jpg', description: 'Whole fenugreek seed for traditional seasoning, spice blends and food use.' },
  { name: 'Ginger Powder', category: 'ground', form: 'Ground spice', image: 'images/products/ginger-powder.jpg', description: 'Dried ginger in powder form for spice mixes, beverages and food manufacturing.' },
  { name: 'Garam Masala', category: 'blends', form: 'Blended masala', image: 'images/products/garam-masala.jpg', description: 'Aromatic mixed spice blend. Blend composition and profile can be discussed to specification.' },
  { name: 'Biryani Masala', category: 'blends', form: 'Blended masala', image: 'images/products/biryani-masala.jpg', description: 'A spice blend for biryani and rice dishes. Talk to us about your preferred profile.' },
  { name: 'Meat / Chicken Masala', category: 'blends', form: 'Blended masala', image: 'images/products/meat-chicken-masala.jpg', description: 'A savoury blend for meat and poultry recipes. Final ingredients and labelling are confirmed per order.' },
  { name: 'Chilli Flakes', category: 'ground', form: 'Crushed dried spice', image: 'images/products/chilli-flakes.jpg', description: 'Crushed dried red chilli for seasoning mixes, foodservice and packaged foods.' },
  { name: 'Black Mustard Seeds', category: 'whole', form: 'Whole seed', image: 'images/products/black-mustard-seeds.jpg', description: 'Pungent whole mustard seeds used in tempering, pickling and spice preparations.' },
  { name: 'White Pepper', category: 'whole', form: 'Whole peppercorn', image: 'images/products/white-pepper.jpg', description: 'Whole white pepper for milder, lighter-coloured seasoning applications.' },
  { name: 'Cardamom Powder', category: 'ground', form: 'Ground spice', image: 'images/products/cardamom-powder.jpg', description: 'Ground cardamom for bakery, beverage, confectionery and spice applications.' },
  { name: 'Cloves', category: 'whole', form: 'Whole bud', image: 'images/products/cloves.jpg', description: 'Whole aromatic cloves for seasoning, blends and food processing.' },
  { name: 'Cinnamon / Cassia', category: 'whole', form: 'Bark or powder', image: 'images/products/cinnamon-cassia.jpg', description: 'Cinnamon-family spice formats can be discussed by cut, form and intended use.' },
  { name: 'Star Anise', category: 'whole', form: 'Whole pod', image: 'images/products/star-anise.jpg', description: 'Distinctive whole pods for spice blends, extracts and culinary applications.' },
  { name: 'Carom Seeds / Ajwain', category: 'whole', form: 'Whole seed', image: 'images/products/carom-seeds-ajwain.jpg', description: 'An aromatic Indian seed spice for bakery, savoury foods and traditional blends.' },
  { name: 'Chaat Masala', category: 'blends', form: 'Blended masala', image: 'images/products/chaat-masala.jpg', description: 'A tangy seasoning blend for snack, fruit-style and street-food inspired products.' },
  { name: 'Tandoori Masala', category: 'blends', form: 'Blended masala', image: 'images/products/tandoori-masala.jpg', description: 'A spice blend for marinades and savoury dishes. Discuss heat, colour and ingredients for your market.' },
  { name: 'Basmati Rice', category: 'rice', form: 'Long-grain rice', image: 'images/products/basmati-rice.jpg', description: 'Premium aged Basmati rice with exceptional elongation and floral aroma.' },
  { name: 'Wheat Grain', category: 'grains', form: 'Whole grain', image: 'images/staples-selection.jpg', description: 'Premium Indian wheat varieties for flour mills, bakeries, and bulk importers.' },
  { name: 'Maize / Corn', category: 'grains', form: 'Whole grain', image: 'images/staples-selection.jpg', description: 'Yellow maize for feed, starch manufacturing, and food processing.' },
  { name: 'Pearl Millet / Bajra', category: 'grains', form: 'Whole grain', image: 'images/staples-selection.jpg', description: 'Nutrient-dense superfood millet for flour, health food, and brewery applications.' },
  { name: 'Red Lentils / Masoor Dal', category: 'pulses', form: 'Dry pulse', image: 'images/products/red-lentils-masoor-dal.jpg', description: 'Shelf-stable red lentils for wholesale, foodservice and food manufacturing.' },
  { name: 'Chickpeas / Chana', category: 'pulses', form: 'Dry pulse', image: 'images/products/chickpeas-chana.jpg', description: 'Dry chickpeas for retail, foodservice and ingredient use.' },
  { name: 'Kidney Beans / Rajma', category: 'pulses', form: 'Dry pulse', image: 'images/products/kidney-beans-rajma.jpg', description: 'Shelf-stable kidney beans for global pantry ranges and food manufacturing.' },
  { name: 'Green Gram / Moong', category: 'pulses', form: 'Dry pulse', image: 'images/products/green-gram-moong.jpg', description: 'Dry green gram in whole or processed formats, subject to supply confirmation.' },
  { name: 'Black Gram / Urad Dal', category: 'pulses', form: 'Dry pulse', image: 'images/products/black-gram-urad-dal.jpg', description: 'Shelf-stable black gram and urad formats for culinary and wholesale use.' },
  { name: 'Cashews', category: 'nuts', form: 'Dry fruit / nut', image: 'images/products/cashews.jpg', description: 'Export-grade cashew kernels for snack, ingredient and food applications.' },
  { name: 'Almonds', category: 'nuts', form: 'Dry fruit / nut', image: 'images/products/almonds.jpg', description: 'Almond supply options can be discussed by grade, format and destination.' },
  { name: 'Raisins', category: 'nuts', form: 'Dried fruit', image: 'images/products/raisins.jpg', description: 'Dried raisins for bakery, snack mixes and pantry products.' },
  { name: 'Sesame Oil', category: 'oils', form: 'Edible oil', image: 'images/products/sesame-oil.jpg', description: 'Cold-pressed virgin sesame oil with natural antioxidants and nutty finish.' },
  { name: 'Mustard Oil', category: 'oils', form: 'Edible oil', image: 'images/products/mustard-oil.jpg', description: 'Traditional Kachi Ghani mustard oil with authentic spicy pungency.' },
  { name: 'Jaggery (Gud)', category: 'sweeteners', form: 'Natural sweetener', image: 'images/products/jaggery.jpg', description: 'Traditional unrefined cane sweetener, chemical-free with natural minerals.' },
  { name: 'Mustard Oil Cake', category: 'cattle-feed', form: 'Feed ingredient', image: 'images/products/mustard-oil-cake.jpg', description: 'High-protein dairy feed ingredient from mustard seed oil extraction (34-38% protein).' },
  { name: 'Soybean Meal', category: 'cattle-feed', form: 'Feed ingredient', image: 'images/products/soybean-meal.jpg', description: 'Premium protein ingredient (46-48% protein) for feed manufacturers and livestock nutrition.' },
  { name: 'Maize DDGS', category: 'cattle-feed', form: 'Feed ingredient', image: 'images/products/maize-ddgs.jpg', description: 'Bulk feed ingredient from corn ethanol distillation, high in protein and energy.' },
  { name: 'Cottonseed Meal', category: 'cattle-feed', form: 'Feed ingredient', image: 'images/products/cottonseed-meal.jpg', description: 'Protein feed ingredient (38-42% protein) for ruminant livestock nutrition.' },
  { name: 'Compound Cattle Feed', category: 'cattle-feed', form: 'Compound feed', image: 'images/products/compound-cattle-feed.jpg', description: 'Complete nutritionally balanced compound feed for dairy farms and livestock.' },
  { name: 'Piston & Cylinder Kit', category: 'auto-parts', form: 'Engine component', image: 'images/products/piston-cylinder-kit.jpg', description: 'Precision-machined piston and cylinder kit for 2-wheeler and 3-wheeler engines.' },
  { name: 'Brake Disc Rotor', category: 'auto-parts', form: 'Brake component', image: 'images/products/brake-disc-rotor.jpg', description: 'Stainless steel brake disc rotors with ventilation holes for superior heat dissipation.' },
  { name: 'Chain & Sprocket Set', category: 'auto-parts', form: 'Drive train component', image: 'images/products/chain-sprocket-set.jpg', description: 'Heavy-duty roller chain with hardened steel sprockets for motorcycles and rickshaws.' },
  { name: 'Shock Absorbers', category: 'auto-parts', form: 'Suspension component', image: 'images/products/shock-absorbers.jpg', description: 'Hydraulic rear shock absorbers with adjustable spring preload for 2 & 3 wheelers.' },
  { name: 'Clutch Plate Set', category: 'auto-parts', form: 'Transmission component', image: 'images/products/clutch-plate-set.jpg', description: 'Complete friction and steel plate clutch set for wet-type multi-plate clutches.' },
  { name: 'Headlight Assembly', category: 'auto-parts', form: 'Lighting component', image: 'images/products/headlight-assembly.jpg', description: 'Complete headlight unit with reflector and lens for motorcycles and auto-rickshaws.' },
  { name: 'Engine Valve Set', category: 'auto-parts', form: 'Engine component', image: 'images/products/engine-valve-set.jpg', description: 'Precision-ground intake and exhaust valves with Stellite-tipped exhaust valves.' },
  { name: 'Carburetor Assembly', category: 'auto-parts', form: 'Fuel system component', image: 'images/products/carburetor-assembly.jpg', description: 'Die-cast aluminum carburetor for motorcycles, scooters, and 3-wheeler rickshaws.' },
  { name: 'Alloy Wheel Rim', category: 'auto-parts', form: 'Wheel component', image: 'images/products/wheel-rim-alloy.jpg', description: 'Lightweight die-cast aluminum alloy wheel rims with powder-coated finish.' },
  { name: 'Engine Oil Filter', category: 'auto-parts', form: 'Filter component', image: 'images/products/oil-filter.jpg', description: 'Multi-layered oil filter element capturing particles down to 10 microns.' },
  { name: 'Stator Coil / Magneto', category: 'auto-parts', form: 'Electrical component', image: 'images/products/stator-coil-magneto.jpg', description: 'Copper-wound stator coil for motorcycle and 3-wheeler charging systems.' },
  { name: 'Bolts, Nuts & Fasteners', category: 'auto-parts', form: 'Hardware / Fasteners', image: 'images/products/bolts-nuts-fasteners.jpg', description: 'Zinc-plated and SS automotive fasteners — hex bolts, nuts, washers, and screws.' },
  { name: 'Tail Light Assembly', category: 'auto-parts', form: 'Lighting component', image: 'images/products/tail-light-assembly.jpg', description: 'Rear tail light and brake light assembly with LED and incandescent options.' },
  { name: 'Starter Motor', category: 'auto-parts', form: 'Electrical component', image: 'images/products/starter-motor.jpg', description: '12V DC electric starter motor for motorcycle and 3-wheeler self-start systems.' },
  { name: 'Wheel & Engine Bearings', category: 'auto-parts', form: 'Precision component', image: 'images/products/bearing-set.jpg', description: 'Deep groove ball bearings and tapered roller bearings to ABEC precision standards.' },
  { name: 'Brake Shoe Set', category: 'auto-parts', form: 'Brake component', image: 'images/products/brake-shoe-set.jpg', description: 'Non-asbestos organic drum brake shoes for motorcycles and 3-wheelers.' },
  { name: 'Speedometer Cable', category: 'auto-parts', form: 'Control cable', image: 'images/products/speedometer-cable.jpg', description: 'Flexible speedometer, clutch, accelerator, and brake cables for 2 & 3 wheelers.' }
];

const categoryLabels = { whole: 'Whole spices', ground: 'Ground & dried', blends: 'Blended masalas', rice: 'Basmati Rice', grains: 'Grains', pulses: 'Pulses & Lentils', nuts: 'Nuts & Dry Fruits', oils: 'Edible Oils', sweeteners: 'Natural Sweeteners', 'cattle-feed': 'Cattle Feed', 'auto-parts': 'Auto Parts' };
const grid = document.querySelector('#product-grid');
const resultCount = document.querySelector('#result-count');
const searchInput = document.querySelector('#product-search');
const emptyState = document.querySelector('#empty-state');
let activeCategory = 'all';
let selectedProduct = null;

function renderProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const visible = products.filter((product) => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesQuery = !query || `${product.name} ${categoryLabels[product.category]} ${product.form}`.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });
  resultCount.textContent = String(visible.length);
  emptyState.hidden = visible.length > 0;
  grid.hidden = visible.length === 0;
  grid.innerHTML = visible.map((product, index) => {
    const itemNumber = String(products.indexOf(product) + 1).padStart(2, '0');
    return `<article class="product-card" data-cat="${product.category}" style="animation-delay:${Math.min(index * 22, 260)}ms">
      <div class="product-card-top">
        <span class="product-type">${categoryLabels[product.category]}</span>
        <span class="product-index">${itemNumber}</span>
      </div>
      <div class="product-thumb">
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
      </div>
      <h3>${product.name}</h3>
      <div class="product-card-foot">
        <span class="product-form-label">${product.form}</span>
        <button class="product-view" type="button" data-product="${product.name}">View details <span aria-hidden="true">↗</span></button>
      </div>
    </article>`;
  }).join('');
}

renderProducts();
searchInput.addEventListener('input', renderProducts);
document.querySelectorAll('.filter-chip').forEach((button) => {
  button.addEventListener('click', () => {
    activeCategory = button.dataset.filter;
    document.querySelectorAll('.filter-chip').forEach((chip) => {
      const active = chip === button;
      chip.classList.toggle('is-active', active);
      chip.setAttribute('aria-pressed', String(active));
    });
    renderProducts();
  });
});
document.querySelector('.reset-filter').addEventListener('click', () => {
  searchInput.value = '';
  activeCategory = 'all';
  document.querySelectorAll('.filter-chip').forEach((chip) => {
    const active = chip.dataset.filter === 'all';
    chip.classList.toggle('is-active', active);
    chip.setAttribute('aria-pressed', String(active));
  });
  renderProducts();
  searchInput.focus();
});

const dialog = document.querySelector('#product-dialog');
const closeDialog = () => {
  dialog.close();
  document.body.classList.remove('dialog-open');
};
grid.addEventListener('click', (event) => {
  const button = event.target.closest('[data-product]');
  if (!button) return;
  selectedProduct = products.find((product) => product.name === button.dataset.product);
  if (!selectedProduct) return;
  document.querySelector('#dialog-title').textContent = selectedProduct.name;
  document.querySelector('#dialog-category').textContent = categoryLabels[selectedProduct.category].toUpperCase();
  document.querySelector('#dialog-description').textContent = selectedProduct.description;
  const dialogImg = document.querySelector('#dialog-image');
  if (dialogImg) {
    dialogImg.src = selectedProduct.image;
    dialogImg.alt = selectedProduct.name;
  }
  document.body.classList.add('dialog-open');
  dialog.showModal();
});
document.querySelector('.dialog-close').addEventListener('click', closeDialog);
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) closeDialog();
});
dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
document.querySelector('.dialog-request').addEventListener('click', () => {
  if (selectedProduct) {
    const select = document.querySelector('#interest-select');
    const categoryValue = {
      whole: 'Whole spices',
      ground: 'Ground & dried spices',
      blends: 'Blended masalas',
      rice: 'Basmati Rice',
      grains: 'Grains',
      pulses: 'Pulses & Lentils',
      nuts: 'Nuts & Dry Fruits',
      oils: 'Edible Oils',
      sweeteners: 'Natural Sweeteners',
      'cattle-feed': 'Cattle Feed',
      'auto-parts': 'Auto Parts — 2 Wheeler & 3 Wheeler'
    }[selectedProduct.category];
    const option = Array.from(select.options).find((item) => item.textContent === categoryValue);
    if (option) select.value = option.value;
    document.querySelector('#rfq-form [name="requirements"]').value = `Product of interest: ${selectedProduct.name}. `;
    showToast(`Added ${selectedProduct.name} to brief`);
  }
  closeDialog();
  document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
  window.setTimeout(() => document.querySelector('#rfq-form [name="name"]').focus({ preventScroll: true }), 450);
});

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#primary-nav');
menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  nav.classList.toggle('is-open', open);
});
nav.addEventListener('click', (event) => {
  if (event.target.closest('a')) {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    nav.classList.remove('is-open');
  }
});
document.querySelector('#current-year').textContent = new Date().getFullYear();

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
document.querySelectorAll('[data-reveal]').forEach((element) => revealObserver.observe(element));

const form = document.querySelector('#rfq-form');
const errorMessage = document.querySelector('#form-error');
const formSuccess = document.querySelector('#form-success');
const enquiryPreview = document.querySelector('#enquiry-preview');
const copyStatus = document.querySelector('#copy-status');
let preparedEnquiry = '';
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const name = String(data.get('name') || '').trim();
  const email = String(data.get('email') || '').trim();
  const country = String(data.get('country') || '').trim();
  const product = String(data.get('product') || '').trim();
  const requirements = String(data.get('requirements') || '').trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let issue = '';
  if (name.length < 2) issue = 'Please enter your name so the buyer brief is useful.';
  else if (!emailPattern.test(email)) issue = 'Please enter a valid work email address.';
  else if (!country) issue = 'Please tell us the destination country.';
  else if (!product) issue = 'Please select a product or category.';
  else if (requirements.length < 12) issue = 'Add a little more detail about what you need (at least 12 characters).';
  if (issue) {
    errorMessage.textContent = issue;
    errorMessage.hidden = false;
    document.querySelector('#rfq-form input:invalid, #rfq-form select:invalid, #rfq-form textarea:invalid')?.focus();
    return;
  }
  errorMessage.hidden = true;
  const lines = [
    'WONDERXASIA — BUYER ENQUIRY',
    '',
    `Name: ${name}`,
    `Business: ${String(data.get('business') || '').trim() || 'Not provided'}`,
    `Work email: ${email}`,
    `Destination country: ${country}`,
    `Products of interest: ${product}`,
    `Approx. quantity: ${String(data.get('quantity') || '').trim() || 'To be discussed'}`,
    `Preferred packaging: ${String(data.get('packaging') || '').trim() || 'To be discussed'}`,
    '',
    'Requirements:',
    requirements,
    '',
    'Prepared using the Wonderxasia frontend enquiry builder. This is not an order or a message transmitted by the website.'
  ];
  preparedEnquiry = lines.join('\n');
  enquiryPreview.textContent = preparedEnquiry;
  form.hidden = true;
  formSuccess.hidden = false;
  copyStatus.textContent = '';
  showToast('Brief created! Ready to copy & share.');
});
document.querySelector('#copy-enquiry').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(preparedEnquiry);
    copyStatus.textContent = 'Copied. You can now paste it into your chosen contact channel.';
    showToast('Enquiry copied to clipboard!');
  } catch {
    const temporary = document.createElement('textarea');
    temporary.value = preparedEnquiry;
    temporary.setAttribute('readonly', '');
    temporary.style.position = 'fixed';
    temporary.style.opacity = '0';
    document.body.append(temporary);
    temporary.select();
    const copied = document.execCommand('copy');
    temporary.remove();
    copyStatus.textContent = copied ? 'Copied. You can now paste it into your chosen contact channel.' : 'Select the enquiry text above and copy it manually.';
    if (copied) showToast('Enquiry copied to clipboard!');
  }
});
document.querySelector('#edit-brief').addEventListener('click', () => {
  formSuccess.hidden = true;
  form.hidden = false;
  copyStatus.textContent = '';
  document.querySelector('#rfq-form [name="name"]').focus();
});

// --- TOAST NOTIFICATIONS & SCROLL INTERACTIONS ---
const toastEl = document.querySelector('#toast-notice');
let toastTimer = null;
function showToast(message) {
  if (!toastEl) return;
  const msgSpan = toastEl.querySelector('.toast-msg');
  if (msgSpan) msgSpan.textContent = message;
  toastEl.classList.add('is-active');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.classList.remove('is-active');
  }, 2800);
}

const progressBar = document.querySelector('#scroll-progress');
const header = document.querySelector('.site-header');
const fab = document.querySelector('#floating-fab');
const fabTopBtn = document.querySelector('#fab-top');

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? scrollTop / docHeight : 0;
  
  if (progressBar) {
    progressBar.style.transform = `scaleX(${progress})`;
  }
  if (header) {
    header.classList.toggle('is-scrolled', scrollTop > 60);
  }
  if (fab) {
    fab.classList.toggle('is-visible', scrollTop > 380);
  }
}, { passive: true });

if (fabTopBtn) {
  fabTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// --- STEP ACCORDION INTERACTIONS ---
const stepDropdowns = document.querySelectorAll('.step-dropdown');
stepDropdowns.forEach((dropdown) => {
  dropdown.addEventListener('toggle', () => {
    if (dropdown.open) {
      stepDropdowns.forEach((other) => {
        if (other !== dropdown && other.open) {
          other.open = false;
        }
      });
    }
  });
});

// --- WONDERXASIA HERO SLIDER & PROMO BAR CONTROLLER ---
document.addEventListener('DOMContentLoaded', () => {
  initHeroSlider();
  initPromoAnnouncementBar();
});

function initPromoAnnouncementBar() {
  const bar = document.querySelector('.promo-top-bar');
  if (!bar) return;
  if (sessionStorage.getItem('wxa_promo_closed') === 'true') {
    bar.classList.add('hidden');
    return;
  }
  const closeBtn = bar.querySelector('.promo-top-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      bar.classList.add('hidden');
      sessionStorage.setItem('wxa_promo_closed', 'true');
    });
  }
}

function initHeroSlider() {
  const container = document.getElementById('wx-hero-slideshow') || document.querySelector('.hero-slider-container');
  if (!container) return;
  const slides = container.querySelectorAll('.wx-slide, .hero-slide');
  if (!slides || slides.length === 0) return;

  const prevBtn = container.querySelector('.wx-arrow-prev, .hero-slider-nav.prev');
  const nextBtn = container.querySelector('.wx-arrow-next, .hero-slider-nav.next');
  const dots = container.querySelectorAll('.wx-dot, .hero-slider-dot');
  const progressBar = document.getElementById('wx-slider-progress-bar');
  const counterEl = container.querySelector('.hero-slider-counter');

  let currentIndex = 0;
  let autoTimer = null;
  let progressTimer = null;
  let progressStart = 0;
  let isPaused = false;
  const slideCount = slides.length;
  const slideDuration = 4500; // Medium speed: 4.5 seconds

  function updateSlide(index) {
    currentIndex = (index + slideCount) % slideCount;
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentIndex);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
    if (counterEl) {
      counterEl.textContent = `0${currentIndex + 1} / 0${slideCount}`;
    }
    resetProgress();
  }

  function nextSlide() { updateSlide(currentIndex + 1); }
  function prevSlide() { updateSlide(currentIndex - 1); }

  function resetProgress() {
    if (progressBar) {
      progressBar.style.transition = 'none';
      progressBar.style.width = '0%';
    }
    progressStart = Date.now();
  }

  function tickProgress() {
    if (!isPaused && progressBar) {
      const elapsed = Date.now() - progressStart;
      const pct = Math.min((elapsed / slideDuration) * 100, 100);
      progressBar.style.transition = 'width 0.1s linear';
      progressBar.style.width = `${pct}%`;
    }
  }

  function startAutoplay() {
    stopAutoplay();
    resetProgress();
    autoTimer = setInterval(() => {
      if (!isPaused) nextSlide();
    }, slideDuration);
    progressTimer = setInterval(tickProgress, 100);
  }

  function stopAutoplay() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
    if (progressTimer) {
      clearInterval(progressTimer);
      progressTimer = null;
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      prevSlide();
      startAutoplay();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      nextSlide();
      startAutoplay();
    });
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      const targetIdx = parseInt(dot.getAttribute('data-slide') ?? idx, 10);
      updateSlide(targetIdx);
      startAutoplay();
    });
  });

  let startX = 0;
  let endX = 0;
  container.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    stopAutoplay();
  }, { passive: true });
  container.addEventListener('touchend', (e) => {
    endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
    startAutoplay();
  }, { passive: true });

  container.addEventListener('mouseenter', stopAutoplay);
  container.addEventListener('mouseleave', startAutoplay);

  updateSlide(0);
  startAutoplay();
}



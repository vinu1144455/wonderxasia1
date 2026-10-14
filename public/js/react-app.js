/**
 * WONDERXASIA - REACT DYNAMIC ENGINE (V3 PRO)
 * Dynamic slideshows, interactive 3D cards, live mandi ticker,
 * real-time container freight estimator, quick sample modal, and dynamic FAQ.
 */

const { useState, useEffect, useRef } = React;

/* ==========================================================================
   COMPONENT 1: ULTRA-MODERN HERO DYNAMIC SLIDESHOW
   ========================================================================== */

function HeroDynamicSlideshow() {
  const slides = [
    {
      title: "Direct From Indian Mandis",
      highlight: "To 38+ Global Ports.",
      subtitle: "Unadulterated Sortex-cleaned whole spices, pods, and seeds harvested from Gujarat, Rajasthan & Kerala with zero middlemen markup.",
      image: "/images/hero-spice-origin.jpg",
      badge: "Harvest Reserve 2026",
      ctaText: "Explore Whole Spices",
      ctaLink: "/category/whole-spices",
      statNumber: "99.5%",
      statLabel: "Sortex Clean Purity"
    },
    {
      title: "Cryo-Milled Spice Powders",
      highlight: "With Intact Essential Oils.",
      subtitle: "Ultra-fine turmeric, Kashmiri red chilli, and roasted cumin milled at low temperatures without synthetic dyes or heavy metal impurities.",
      image: "/images/products/turmeric-powder.jpg",
      badge: "100% Pure · Zero Sudan Dye",
      ctaText: "Inspect Ground Spices",
      ctaLink: "/category/ground-spices",
      statNumber: "4.5%+",
      statLabel: "Active Curcumin Grade"
    },
    {
      title: "Aged Himalayan Basmati",
      highlight: "Exquisite Aroma & Elongation.",
      subtitle: "2+ years naturally aged traditional long-grain rice and giant Kabuli chickpeas tailored for supermarkets, food distributors and catering.",
      image: "/images/staples-selection.jpg",
      badge: "APEDA Certified Grains",
      ctaText: "View Grains & Pulses",
      ctaLink: "/category/basmati-rice",
      statNumber: "22mm",
      statLabel: "Cooked Grain Length"
    },
    {
      title: "Bespoke Masalas & Blends",
      highlight: "Crafted for Global Palates.",
      subtitle: "Authentic Dum Biryani, Royal Garam Masala, and Tandoori formulations calibrated for custom heat indexes and private label retail cartons.",
      image: "/images/masala-selection.jpg",
      badge: "Custom OEM Formulations",
      ctaText: "Explore Culinary Blends",
      ctaLink: "/category/blended-masalas",
      statNumber: "100%",
      statLabel: "Natural Spices (No Fillers)"
    }
  ];

  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  return (
    <div 
      className="react-hero-slideshow"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {slides.map((slide, idx) => (
        <div 
          key={idx}
          className={`hero-slide-pane ${idx === current ? 'active' : ''}`}
          style={{ backgroundImage: `url('${slide.image}')` }}
        >
          <div className="hero-slide-overlay" />
          
          <div className="container hero-slide-inner">
            <div className="hero-slide-content">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <span className="eyebrow eyebrow-light">{slide.badge}</span>
                <span className="slide-counter-pill">{idx + 1} / {slides.length}</span>
              </div>
              
              <h1 className="hero-slide-title">
                {slide.title}<br />
                <em>{slide.highlight}</em>
              </h1>
              <p className="hero-slide-desc">{slide.subtitle}</p>
              
              <div className="hero-slide-actions">
                <a href={slide.ctaLink} className="btn btn-primary">
                  {slide.ctaText} →
                </a>
                <a href="/rfq" className="btn btn-outline-light">
                  Build Custom RFQ ↗
                </a>
              </div>
            </div>

            {/* Slide Highlight Stat Box */}
            <div className="hero-slide-stat-card">
              <div className="slide-stat-val">{slide.statNumber}</div>
              <div className="slide-stat-lbl">{slide.statLabel}</div>
              <div className="slide-stat-bar">
                <div className="slide-stat-fill" style={{ width: idx === current ? '100%' : '0%' }} />
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Progress Dots */}
      <div className="hero-slide-indicators">
        {slides.map((_, idx) => (
          <button
            key={idx}
            className={`hero-dot ${idx === current ? 'active' : ''}`}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button 
        className="hero-arrow hero-arrow-prev"
        onClick={() => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)}
        aria-label="Previous Slide"
      >
        ❮
      </button>
      <button 
        className="hero-arrow hero-arrow-next"
        onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
        aria-label="Next Slide"
      >
        ❯
      </button>
    </div>
  );
}

/* ==========================================================================
   COMPONENT 2: LIVE COMMODITY MANDI BENCHMARK TICKER
   ========================================================================== */

function LiveMandiTicker() {
  const [rates, setRates] = useState([]);
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    fetch('/api/market-rates')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setRates(data.rates);
          setLastUpdated(data.lastUpdated);
        }
      })
      .catch(() => {});
  }, []);

  if (rates.length === 0) return null;

  return (
    <div className="live-mandi-ticker-bar">
      <div className="ticker-label-badge">
        <span className="live-pulsing-dot" />
        <span>LIVE MANDI INDEX ({lastUpdated})</span>
      </div>
      <div className="ticker-scroll-wrapper">
        <div className="ticker-scroll-track">
          {rates.concat(rates).map((rate, i) => (
            <div key={i} className="mandi-rate-item">
              <span className="rate-commodity">{rate.commodity}</span>
              <span className="rate-mandi">[{rate.mandi}]</span>
              <span className="rate-price">{rate.pricePerMT}</span>
              <span className={`rate-trend ${rate.change}`}>
                {rate.change === 'up' ? '▲' : rate.change === 'down' ? '▼' : '●'} {rate.trend}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   COMPONENT 3: INTERACTIVE 3D COMMODITY CAROUSEL WITH QUICK VIEW
   ========================================================================== */

function FeaturedCommoditiesShowcase() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProducts(data.products);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = products.filter(p => {
    if (activeTab === 'all') return p.featured || true;
    if (activeTab === 'spices') return p.category === 'whole-spices' || p.category === 'ground-spices';
    if (activeTab === 'blends') return p.category === 'blended-masalas';
    if (activeTab === 'staples') return p.category === 'basmati-rice' || p.category === 'grains' || p.category === 'pulses-lentils';
    if (activeTab === 'industrial') return p.category === 'cattle-feed' || p.category === 'auto-parts';
    return true;
  }).slice(0, 8);

  return (
    <div className="react-commodities-showcase">
      <div className="commodities-filter-tabs">
        <button 
          className={`filter-tab-pill ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          🌟 Flagship Export Range
        </button>
        <button 
          className={`filter-tab-pill ${activeTab === 'spices' ? 'active' : ''}`}
          onClick={() => setActiveTab('spices')}
        >
          🌶️ Whole &amp; Ground Spices
        </button>
        <button 
          className={`filter-tab-pill ${activeTab === 'blends' ? 'active' : ''}`}
          onClick={() => setActiveTab('blends')}
        >
          🍲 Master Masala Blends
        </button>
        <button 
          className={`filter-tab-pill ${activeTab === 'staples' ? 'active' : ''}`}
          onClick={() => setActiveTab('staples')}
        >
          🌾 Basmati &amp; Legumes
        </button>
        <button 
          className={`filter-tab-pill ${activeTab === 'industrial' ? 'active' : ''}`}
          onClick={() => setActiveTab('industrial')}
        >
          🔧 Cattle Feed &amp; Auto Parts
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px 0', color: 'var(--c-ink-500)' }}>
          <div className="spinner-border" />
          <p style={{ marginTop: 12 }}>Connecting to live export inventory API...</p>
        </div>
      ) : (
        <div className="interactive-product-grid">
          {filtered.map((item) => (
            <div key={item.id} className="interactive-card-wrapper in-view">
              <div className="interactive-card">
                <div className="card-media">
                  <img src={item.image} alt={item.name} loading="lazy" />
                  <span className="card-cat-badge">{item.categoryName}</span>
                  <button 
                    className="quick-preview-overlay-btn"
                    onClick={() => setQuickViewProduct(item)}
                    title="Quick Technical Specification"
                  >
                    Quick Specs 🔍
                  </button>
                </div>
                <div className="card-body">
                  <h3 className="card-title">
                    <a href={`/product/${item.slug}`}>{item.name}</a>
                  </h3>
                  <div className="card-hindi">{item.hindiName || ''}</div>
                  
                  <div className="card-specs-row">
                    <span>Origin: <strong>{item.origin ? item.origin.split(',')[0] : 'India'}</strong></span>
                    <span>HS: <strong>{item.hsCode || '—'}</strong></span>
                  </div>

                  <p className="card-desc">{item.description}</p>
                  
                  <div className="card-footer-actions">
                    <a href={`/product/${item.slug}`} className="btn btn-outline btn-sm">
                      Full Specs ↗
                    </a>
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        if (window.BasketStore) {
                          window.BasketStore.add({
                            id: item.id,
                            slug: item.slug,
                            name: item.name,
                            categoryName: item.categoryName,
                            form: item.form
                          });
                        }
                      }}
                    >
                      + RFQ
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Specs Modal Popup */}
      {quickViewProduct && (
        <div className="quick-specs-modal-backdrop" onClick={() => setQuickViewProduct(null)}>
          <div className="quick-specs-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close-x" onClick={() => setQuickViewProduct(null)}>✕</button>
            <div className="modal-grid">
              <div className="modal-image-side">
                <img src={quickViewProduct.image} alt={quickViewProduct.name} />
                <span className="badge badge-gold" style={{ marginTop: 14 }}>
                  {quickViewProduct.categoryName}
                </span>
              </div>
              <div className="modal-info-side">
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, margin: '0 0 4px', color: 'var(--c-forest-950)' }}>
                  {quickViewProduct.name}
                </h3>
                <div style={{ color: 'var(--c-saffron-600)', fontWeight: 700, fontSize: 13, marginBottom: 14 }}>
                  {quickViewProduct.hindiName}
                </div>
                <p style={{ fontSize: 13, color: 'var(--c-ink-700)', lineHeight: 1.6, marginBottom: 16 }}>
                  {quickViewProduct.description}
                </p>

                <div className="modal-specs-mini-table">
                  <div><strong>Origin:</strong> {quickViewProduct.origin}</div>
                  <div><strong>Available Grades:</strong> {quickViewProduct.grades}</div>
                  <div><strong>Purity Standard:</strong> {quickViewProduct.purity}</div>
                  <div><strong>Moisture Limit:</strong> {quickViewProduct.moisture}</div>
                  <div><strong>HS Code:</strong> {quickViewProduct.hsCode}</div>
                  <div><strong>Packaging:</strong> {quickViewProduct.packingOptions}</div>
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap' }}>
                  <button 
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1 }}
                    onClick={() => {
                      if (window.BasketStore) {
                        window.BasketStore.add({
                          id: quickViewProduct.id,
                          slug: quickViewProduct.slug,
                          name: quickViewProduct.name,
                          categoryName: quickViewProduct.categoryName,
                          form: quickViewProduct.form
                        });
                        setQuickViewProduct(null);
                      }
                    }}
                  >
                    + Add to RFQ Basket
                  </button>
                  <a href={`/product/${quickViewProduct.slug}`} className="btn btn-outline btn-sm" style={{ flex: 1, textAlign: 'center' }}>
                    Full Specs Page ↗
                  </a>
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                  <button 
                    className="btn-coa-download" 
                    style={{ flex: 1, justifyContent: 'center' }}
                    onClick={() => {
                      if (window.downloadCoASpecSheet) {
                        window.downloadCoASpecSheet(quickViewProduct.name, quickViewProduct.hsCode, quickViewProduct.purity);
                      }
                    }}
                  >
                    📄 Verified CoA Sheet
                  </button>
                  <a 
                    href={`https://wa.me/919876543210?text=${encodeURIComponent(`Inquiry for ${quickViewProduct.name} (${quickViewProduct.form}) - Wonderxasia Export Desk`)}`}
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="whatsapp-trade-btn"
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    💬 WhatsApp Quote
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   COMPONENT 4: LIVE OCEAN FREIGHT & CONTAINER ESTIMATOR
   ========================================================================== */

function OceanFreightEstimator() {
  const [port, setPort] = useState('Jebel Ali, Dubai');
  const [container, setContainer] = useState('20ft FCL');
  const [estimate, setEstimate] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchEstimate = (p = port, c = container) => {
    setLoading(true);
    fetch('/api/freight-estimate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ destinationPort: p, containerSize: c })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setEstimate(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchEstimate();
  }, []);

  return (
    <div className="freight-calculator-widget">
      <div className="freight-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="freight-icon-bubble">🚢</div>
          <div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 20, margin: 0, color: 'var(--c-forest-950)' }}>
              Live Ocean Freight &amp; Transit Estimator
            </h3>
            <span style={{ fontSize: 12, color: 'var(--c-ink-400)' }}>
              Port of Origin: Nhava Sheva (JNPT) / Mundra Port, India
            </span>
          </div>
        </div>
        <span className="badge badge-green">Carrier Sync Active</span>
      </div>

      <div className="freight-controls-grid">
        <div className="form-group">
          <label className="form-label">Destination Discharge Port</label>
          <select 
            className="form-select"
            value={port} 
            onChange={(e) => {
              setPort(e.target.value);
              fetchEstimate(e.target.value, container);
            }}
          >
            <option value="Jebel Ali, Dubai">Jebel Ali, Dubai (UAE / Middle East)</option>
            <option value="Hamburg, Germany">Hamburg, Germany (Europe Hub)</option>
            <option value="Rotterdam, Netherlands">Rotterdam, Netherlands (EU Gateway)</option>
            <option value="New York / New Jersey, USA">New York / New Jersey (East Coast US)</option>
            <option value="Singapore">Singapore (Southeast Asia)</option>
            <option value="Sydney, Australia">Sydney, Australia (Oceania)</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Container Configuration</label>
          <select 
            className="form-select"
            value={container}
            onChange={(e) => {
              setContainer(e.target.value);
              fetchEstimate(port, e.target.value);
            }}
          >
            <option value="20ft FCL">20ft Heavy FCL (~18-24 Metric Tonnes payload)</option>
            <option value="40ft HC">40ft High Cube Container (~26-28 MT payload)</option>
          </select>
        </div>
      </div>

      {/* Dynamic Maritime Voyage Route Map Simulation */}
      <div className="freight-route-visual">
        <div className="freight-port-node">
          <div className="node-icon">🇮🇳</div>
          <div style={{ fontWeight: 800, fontSize: 12.5, color: 'var(--c-forest-950)' }}>Nhava Sheva / Mundra</div>
          <div style={{ fontSize: 11, color: 'var(--c-ink-500)' }}>Origin Port (India)</div>
        </div>

        <div className="freight-line-track">
          <div className="freight-moving-vessel" title="Live Container Vessel Route">🚢</div>
        </div>

        <div className="freight-port-node">
          <div className="node-icon">
            {port.includes('Dubai') ? '🇦🇪' : 
             port.includes('Hamburg') ? '🇩🇪' : 
             port.includes('Rotterdam') ? '🇳🇱' : 
             port.includes('New York') ? '🇺🇸' : 
             port.includes('Singapore') ? '🇸🇬' : 
             port.includes('Sydney') ? '🇦🇺' : '🌐'}
          </div>
          <div style={{ fontWeight: 800, fontSize: 12.5, color: 'var(--c-forest-950)' }}>{port}</div>
          <div style={{ fontSize: 11, color: 'var(--c-ink-500)' }}>
            {estimate ? `Transit: ${estimate.transitDays}` : 'Discharge Port'}
          </div>
        </div>
      </div>

      {estimate && (
        <div className="freight-result-card">
          <div className="freight-stat-block">
            <span className="label">Estimated Ocean Freight</span>
            <span className="value" style={{ color: 'var(--c-saffron-600)' }}>
              {estimate.estimatedOceanFreight}
            </span>
          </div>
          <div className="freight-stat-block">
            <span className="label">Maritime Transit Window</span>
            <span className="value" style={{ color: 'var(--c-forest-800)' }}>
              {estimate.transitDays}
            </span>
          </div>
          <div className="freight-stat-block">
            <span className="label">Export Documentation Included</span>
            <span className="value" style={{ fontSize: 13, color: 'var(--c-emerald)' }}>
              Phyto + COO + Fumigation + B/L
            </span>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, flexWrap: 'wrap', gap: 10 }}>
        <span style={{ fontSize: 11, color: 'var(--c-ink-400)' }}>
          * Rates subject to bunker adjustment factors (BAF) and carrier sailing schedules.
        </span>
        <a href="/rfq" className="btn btn-primary btn-sm">
          Lock Rate in Formal RFQ →
        </a>
      </div>
    </div>
  );
}

// Global modal stub redirecting to rfq if invoked
if (typeof window !== 'undefined') {
  window.openSampleModal = () => { window.location.href = '/rfq'; };
}


/* ==========================================================================
   COMPONENT 6: DYNAMIC FAQ ACCORDION WITH LIVE SEARCH
   ========================================================================== */

function DynamicExportFaq() {
  const faqs = [
    {
      q: "What are your standard Minimum Order Quantities (MOQs)?",
      a: "For full container loads (FCL), standard minimums are 1x 20ft container (18-24 Metric Tonnes depending on bulk density). For high-value commodities such as Green Cardamom or Cloves, we accommodate consolidated pallet consignments (LCL) starting from 500 KGs.",
      cat: "Orders"
    },
    {
      q: "How do you ensure zero Sudan dye and pesticide compliance for EU/US imports?",
      a: "Every procurement batch undergoes stringent third-party HPLC & LC-MS/MS testing at NABL-accredited facilities (SGS, Geo-Chem, or Spice Board QEL). We certify non-detection of synthetic coloring agents (Sudan I to IV) and strict conformity to EU Maximum Residue Limits (MRLs).",
      cat: "Quality"
    },
    {
      q: "Can you provide private labeling, retail barcodes, and custom pouch packing?",
      a: "Yes. In addition to standard 25kg / 50kg multi-wall Kraft and PP woven bags, we operate nitrogen-flushed form-fill-seal lines that produce 100g to 1kg stand-up pouches, zipper barrier bags, and PET jars carrying your custom brand artwork and EAN/UPC barcodes.",
      cat: "Packaging"
    },
    {
      q: "Which Indian export ports do you dispatch containers from?",
      a: "Our prime maritime gateways are Nhava Sheva (JNPT) and Mundra Port for western and northern farming belts, and Cochin Port or Chennai for southern spices (Black Pepper, Cardamom). Air freight consignments are cleared out of Mumbai (BOM) and Delhi (DEL).",
      cat: "Shipping"
    },
    {
      q: "What payment and trade terms are supported?",
      a: "We support standard international commercial terms (Incoterms 2020) including FOB (Free on Board Indian port), CFR, and CIF (Cost, Insurance & Freight to your destination port). Standard trade financing includes 30% advance with 70% against scanned Bill of Lading, or 100% Irrevocable Confirmed Letter of Credit (L/C at sight).",
      cat: "Finance"
    }
  ];

  const [openIdx, setOpenIdx] = useState(0);
  const [filterText, setFilterText] = useState('');

  const filteredFaqs = faqs.filter(f => 
    f.q.toLowerCase().includes(filterText.toLowerCase()) || 
    f.a.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="dynamic-faq-container">
      <div style={{ marginBottom: 20 }}>
        <input 
          type="text" 
          className="form-input" 
          placeholder="Filter trade &amp; export questions..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          style={{ maxWidth: 400 }}
        />
      </div>

      <div className="faq-accordion-list">
        {filteredFaqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div key={idx} className={`faq-card-item ${isOpen ? 'open' : ''}`}>
              <button 
                className="faq-question-btn"
                onClick={() => setOpenIdx(isOpen ? -1 : idx)}
              >
                <span className="faq-question-text">{faq.q}</span>
                <span className="faq-icon">{isOpen ? '−' : '+'}</span>
              </button>
              {isOpen && (
                <div className="faq-answer-panel">
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ==========================================================================
   MOUNT REACT APPS TO TARGET DOM CONTAINERS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Mount Hero Slideshow
  const heroRoot = document.getElementById('react-hero-root');
  if (heroRoot) {
    const root = ReactDOM.createRoot(heroRoot);
    root.render(<HeroDynamicSlideshow />);
  }

  // Mount Mandi Index Ticker
  const tickerRoot = document.getElementById('react-mandi-ticker-root');
  if (tickerRoot) {
    const root = ReactDOM.createRoot(tickerRoot);
    root.render(<LiveMandiTicker />);
  }

  // Mount Featured Commodities
  const commoditiesRoot = document.getElementById('react-commodities-root');
  if (commoditiesRoot) {
    const root = ReactDOM.createRoot(commoditiesRoot);
    root.render(<FeaturedCommoditiesShowcase />);
  }

  // Mount Freight Estimator
  const freightRoot = document.getElementById('react-freight-root');
  if (freightRoot) {
    const root = ReactDOM.createRoot(freightRoot);
    root.render(<OceanFreightEstimator />);
  }

  // Mount Dynamic FAQs
  const faqRoot = document.getElementById('react-faq-root');
  if (faqRoot) {
    const root = ReactDOM.createRoot(faqRoot);
    root.render(<DynamicExportFaq />);
  }
});

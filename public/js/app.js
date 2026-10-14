/**
 * WONDERXASIA - GLOBAL CLIENT APPLICATION
 * Core interactivity, animations, and RFQ basket management
 */

// RFQ Basket Store
const BasketStore = {
  key: 'wxa_rfq_basket',
  getItems() {
    try {
      return JSON.parse(localStorage.getItem(this.key)) || [];
    } catch (e) {
      return [];
    }
  },
  saveItems(items) {
    localStorage.setItem(this.key, JSON.stringify(items));
    this.updateBadges();
  },
  add(item) {
    const items = this.getItems();
    const exists = items.some(i => i.name === item.name);
    if (!exists) {
      items.push({
        id: item.id || item.slug || item.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        name: item.name,
        category: item.categoryName || item.category || 'Spices',
        form: item.form || 'Export grade',
        quantity: item.quantity || '5 Metric Tonnes'
      });
      this.saveItems(items);
      showToast(`Added "${item.name}" to your RFQ Quote Basket`, 'success');
    } else {
      showToast(`"${item.name}" is already in your Quote Basket`, 'info');
    }
  },
  remove(index) {
    const items = this.getItems();
    items.splice(index, 1);
    this.saveItems(items);
    renderBasketDrawer();
    showToast('Item removed from Quote Basket', 'info');
  },
  clear() {
    this.saveItems([]);
    renderBasketDrawer();
  },
  count() {
    return this.getItems().length;
  },
  updateBadges() {
    const count = this.count();
    document.querySelectorAll('.basket-count').forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'inline-flex' : 'none';
    });
  }
};

// Toast notification helper
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type === 'success' ? 'toast-success' : ''}`;
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${type === 'success' ? '#10b981' : '#f5a623'}" stroke-width="2">
      ${type === 'success' 
        ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>' 
        : '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'}
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// RFQ Drawer UI Controller
function renderBasketDrawer() {
  const container = document.querySelector('#drawer-basket-items');
  if (!container) return;
  const items = BasketStore.getItems();

  if (items.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px 20px; color: var(--c-ink-400);">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin: 0 auto 12px; opacity: 0.5;">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
        <p style="font-weight: 600; color: var(--c-ink-700); margin-bottom: 4px;">Your Quote Basket is empty</p>
        <p style="font-size: 13px;">Browse our catalogue and click "+ Add to RFQ" on products you wish to import.</p>
        <a href="/products" class="btn btn-outline btn-sm" style="margin-top: 18px;" onclick="closeBasketDrawer()">Browse Products</a>
      </div>
    `;
    const actionBtn = document.querySelector('#drawer-proceed-btn');
    if (actionBtn) actionBtn.style.display = 'none';
    return;
  }

  const actionBtn = document.querySelector('#drawer-proceed-btn');
  if (actionBtn) actionBtn.style.display = 'inline-flex';

  container.innerHTML = items.map((item, index) => `
    <div class="basket-item">
      <div class="basket-item-info">
        <h4>${item.name}</h4>
        <span>${item.category} · ${item.form}</span>
      </div>
      <button class="basket-item-remove" onclick="BasketStore.remove(${index})" title="Remove item" aria-label="Remove item">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  `).join('');
}

function openBasketDrawer() {
  const drawer = document.querySelector('#rfq-drawer');
  if (drawer) {
    renderBasketDrawer();
    drawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeBasketDrawer() {
  const drawer = document.querySelector('#rfq-drawer');
  if (drawer) {
    drawer.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// Initialise on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  BasketStore.updateBadges();

  // Sticky header class
  const header = document.querySelector('.main-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // Mobile Drawer Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const mobileClose = document.querySelector('.mobile-drawer-close');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  if (mobileClose && mobileDrawer) {
    mobileClose.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  // RFQ Basket Triggers
  document.querySelectorAll('.basket-btn, [data-open-basket]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openBasketDrawer();
    });
  });

  const drawerCloseBtn = document.querySelector('#rfq-drawer-close');
  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', closeBasketDrawer);
  }

  // Close drawer on background click
  const drawer = document.querySelector('#rfq-drawer');
  if (drawer) {
    drawer.addEventListener('click', (e) => {
      if (e.target === drawer) closeBasketDrawer();
    });
  }

  // Animate on scroll (IntersectionObserver)
  const animatedElements = document.querySelectorAll('[data-animate="fade-up"]');
  if (animatedElements.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => observer.observe(el));
  } else {
    animatedElements.forEach(el => el.classList.add('in-view'));
  }

  // Animated Numbers Counter
  const counterEls = document.querySelectorAll('[data-counter]');
  if (counterEls.length > 0 && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.dataset.counter, 10);
          const duration = 1600;
          const start = 0;
          const startTime = performance.now();

          function step(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const current = Math.floor(progress * target);
            entry.target.textContent = current;
            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              entry.target.textContent = target;
            }
          }
          requestAnimationFrame(step);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    counterEls.forEach(el => counterObserver.observe(el));
  }

  // Newsletter form handlers
  document.querySelectorAll('form[data-newsletter]').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const email = input ? input.value : '';
      if (!email) return;

      try {
        const res = await fetch('/api/newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const data = await res.json();
        showToast(data.message || 'Subscribed successfully!', 'success');
        if (input) input.value = '';
      } catch (err) {
        showToast('Subscription saved.', 'success');
        if (input) input.value = '';
      }
    });
  });

  // Inject Floating Quick Action Cluster (WhatsApp + Fast RFQ + Scroll Top)
  injectFloatingActionCluster();

  // Scroll Progress Bar
  initScrollProgressBar();

  // Hero Banner Slider
  initHeroSlider();

  // Top Promotional Announcement Bar
  initPromoAnnouncementBar();
});

// Top Promotional Bar Controller
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

// Hero Banner Slider Controller (Medium Speed Slideshow)
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

  function nextSlide() {
    updateSlide(currentIndex + 1);
  }

  function prevSlide() {
    updateSlide(currentIndex - 1);
  }

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
      if (!isPaused) {
        nextSlide();
      }
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

  // Touch swipe support for mobile
  let startX = 0;
  let endX = 0;
  container.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isPaused = true;
  }, { passive: true });

  container.addEventListener('touchend', (e) => {
    endX = e.changedTouches[0].clientX;
    isPaused = false;
    progressStart = Date.now();
    const diff = startX - endX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
    startAutoplay();
  }, { passive: true });

  // Pause on hover
  container.addEventListener('mouseenter', () => {
    isPaused = true;
  });

  container.addEventListener('mouseleave', () => {
    isPaused = false;
    progressStart = Date.now();
  });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
    if (e.key === 'ArrowLeft') {
      prevSlide();
      startAutoplay();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
      startAutoplay();
    }
  });

  // Initialize first slide
  updateSlide(0);
  startAutoplay();
}

// Top Scroll Progress Bar
function initScrollProgressBar() {
  let bar = document.querySelector('.scroll-progress-bar');
  if (!bar) {
    bar = document.createElement('div');
    bar.className = 'scroll-progress-bar';
    document.body.appendChild(bar);
  }
  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const progress = (window.scrollY / totalHeight) * 100;
      bar.style.width = `${progress}%`;
    }
  }, { passive: true });
}

// Global Certificate of Analysis (CoA) Spec Sheet Downloader / Viewer
window.downloadCoASpecSheet = function(productName, hsCode, purity) {
  let coaModal = document.getElementById('wxa-coa-modal');
  if (!coaModal) {
    coaModal = document.createElement('div');
    coaModal.id = 'wxa-coa-modal';
    coaModal.className = 'quick-specs-modal-backdrop';
    document.body.appendChild(coaModal);
  }

  coaModal.innerHTML = `
    <div class="quick-specs-modal coa-modal" onclick="event.stopPropagation()">
      <button class="modal-close-x" onclick="document.getElementById('wxa-coa-modal').style.display='none'">✕</button>
      <div style="text-align: center; margin-bottom: 20px;">
        <div style="font-size: 36px; margin-bottom: 6px;">📄</div>
        <span class="badge badge-gold" style="font-size: 11px;">Official Export CoA Document</span>
        <h3 style="font-family: var(--font-montserrat); font-size: 22px; margin: 10px 0 4px; color: var(--c-forest-950);">
          Certificate of Analysis: ${productName}
        </h3>
        <p style="font-size: 13px; color: var(--c-ink-500); margin: 0;">
          Harmonized Code: <strong>${hsCode || '0909'}</strong> · Batch Purity Standard: <strong>${purity || '99.5% Sortex Clean'}</strong>
        </p>
      </div>

      <div class="modal-specs-mini-table" style="margin-bottom: 20px; font-size: 12.5px;">
        <div><strong>Accredited Testing Facility:</strong> SGS India / Spices Board Quality Evaluation Lab (QEL)</div>
        <div><strong>Sudan Dye (I, II, III, IV):</strong> NOT DETECTED (HPLC-MS/MS limit 10 ppb)</div>
        <div><strong>Aflatoxin B1 + Total:</strong> Conforming to European Commission EC 1881/2006 (< 5 ppb)</div>
        <div><strong>Pesticide Multi-Residue:</strong> Conforming to EU Maximum Residue Limits (MRLs)</div>
        <div><strong>Moisture Level:</strong> Conforming to ISO 939 (< 10.0%)</div>
        <div><strong>Fumigation / Phyto:</strong> Sealed Phosphine Gas (ALP) with Government Phyto Certificate</div>
      </div>

      <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
        <button class="primary-btn1" style="font-size: 12px; padding: 10px 18px;" onclick="window.print()">
          🖨️ Print / Save PDF CoA
        </button>
        <button class="explore-btn" style="font-size: 12px; padding: 10px 18px;" onclick="document.getElementById('wxa-coa-modal').style.display='none'">
          Close Window
        </button>
      </div>
    </div>
  `;

  coaModal.style.display = 'flex';
  coaModal.onclick = () => { coaModal.style.display = 'none'; };
};

// Inject Floating Trade Desk Buttons & Scroll to Top
function injectFloatingActionCluster() {
  if (document.querySelector('.floating-action-cluster')) return;

  const cluster = document.createElement('div');
  cluster.className = 'floating-action-cluster';
  cluster.innerHTML = `
    <button class="floating-scroll-top-btn" id="floating-scroll-top-btn" title="Back to Top" aria-label="Scroll to top">
      ▲
    </button>
    <a href="https://wa.me/919876543210?text=Hello%20Wonderxasia%20Export%20Desk,%20I%20am%20interested%20in%20importing%20Indian%20spices%20and%20commodities." 
       target="_blank" 
       rel="noopener noreferrer" 
       class="floating-whatsapp-btn"
       title="Direct WhatsApp Export Desk">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.42 0-2.82-.37-4.06-1.07l-.29-.17-3.12.82.83-3.04-.19-.3a8.217 8.217 0 0 1-1.26-4.47c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.59c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.4-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.12-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.43 1.03 2.6c.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.17-.48-.29z"/>
      </svg>
      <span>WhatsApp Desk</span>
    </a>
    <button class="floating-quote-btn" onclick="openBasketDrawer()" title="View Quote Basket">
      <span>RFQ Basket</span>
      <span class="basket-count" style="display: none; background: #ffffff; color: var(--c-forest-950); border-radius: 50%; padding: 2px 6px; margin-left: 4px;">0</span>
    </button>
  `;
  document.body.appendChild(cluster);

  const scrollBtn = document.getElementById('floating-scroll-top-btn');
  if (scrollBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 350) {
        scrollBtn.classList.add('visible');
      } else {
        scrollBtn.classList.remove('visible');
      }
    }, { passive: true });

    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}


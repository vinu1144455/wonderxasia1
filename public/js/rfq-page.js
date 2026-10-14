/**
 * WONDERXASIA - INTERACTIVE RFQ BUILDER
 * Multi-step quotation workflow connected to Express backend
 */

let currentStep = 1;
const rfqData = {
  products: [],
  targetQuantity: '',
  packingFormat: '25kg PP Woven Bags',
  privateLabel: 'No, Standard Exporter Packing',
  country: '',
  port: '',
  incoterm: 'CIF',
  name: '',
  company: '',
  email: '',
  phone: '',
  message: ''
};

async function initRfqPage() {
  const form = document.querySelector('#rfq-wizard-form');
  if (!form) return;

  // Preload products from basket
  const basketItems = BasketStore.getItems();
  const selectedContainer = document.querySelector('#rfq-selected-products');
  
  if (basketItems.length > 0) {
    rfqData.products = basketItems.map(b => b.name);
    renderSelectedProducts();
  }

  // Also load full products catalog for quick-add dropdown
  try {
    const res = await fetch('/api/products');
    const data = await res.json();
    if (data.success && data.products) {
      const select = document.querySelector('#rfq-add-product-select');
      if (select) {
        data.products.forEach(p => {
          const opt = document.createElement('option');
          opt.value = p.name;
          opt.textContent = `${p.name} (${p.categoryName})`;
          select.appendChild(opt);
        });

        select.addEventListener('change', (e) => {
          if (e.target.value && !rfqData.products.includes(e.target.value)) {
            rfqData.products.push(e.target.value);
            renderSelectedProducts();
            e.target.value = '';
          }
        });
      }
    }
  } catch (err) {
    console.error('Error fetching products for RFQ select:', err);
  }

  // Step Navigation Buttons
  setupWizardControls();

  // Form Submission
  form.addEventListener('submit', handleRfqSubmit);
}

function renderSelectedProducts() {
  const container = document.querySelector('#rfq-selected-products');
  if (!container) return;

  if (rfqData.products.length === 0) {
    container.innerHTML = `
      <div style="padding: 16px; background: var(--c-cream-200); border-radius: 8px; font-size: 13px; color: var(--c-ink-500); text-align: center;">
        No items currently selected. Please choose a product from the dropdown below or from our catalog.
      </div>
    `;
    return;
  }

  container.innerHTML = rfqData.products.map((item, idx) => `
    <div style="display: inline-flex; align-items: center; gap: 8px; background: var(--c-forest-900); color: var(--c-saffron-300); padding: 6px 14px; border-radius: 20px; font-size: 13px; margin: 4px;">
      <span>${item}</span>
      <button type="button" onclick="removeRfqProduct(${idx})" style="color: #ffffff; cursor: pointer; padding: 2px;">✕</button>
    </div>
  `).join('');
}

window.removeRfqProduct = function(idx) {
  rfqData.products.splice(idx, 1);
  renderSelectedProducts();
};

function setupWizardControls() {
  const nextBtn = document.querySelector('#rfq-next-btn');
  const prevBtn = document.querySelector('#rfq-prev-btn');
  const submitBtn = document.querySelector('#rfq-submit-btn');

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (validateStep(currentStep)) {
        goToStep(currentStep + 1);
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      goToStep(currentStep - 1);
    });
  }
}

function validateStep(step) {
  if (step === 1) {
    if (rfqData.products.length === 0) {
      showToast('Please select at least one spice or pantry product.', 'info');
      return false;
    }
    const qty = document.querySelector('#rfq-quantity-input');
    if (qty && qty.value) {
      rfqData.targetQuantity = qty.value;
    } else {
      rfqData.targetQuantity = 'Per trial order / 1 FCL';
    }
    return true;
  }
  
  if (step === 2) {
    const packing = document.querySelector('#rfq-packing-select');
    if (packing) rfqData.packingFormat = packing.value;
    const pLabel = document.querySelector('#rfq-privatelabel-select');
    if (pLabel) rfqData.privateLabel = pLabel.value;
    return true;
  }

  if (step === 3) {
    const country = document.querySelector('#rfq-country-input');
    const port = document.querySelector('#rfq-port-input');
    const incoterm = document.querySelector('#rfq-incoterm-select');
    
    if (!country || !country.value.trim()) {
      showToast('Please specify your destination country.', 'info');
      if (country) country.focus();
      return false;
    }
    rfqData.country = country.value.trim();
    rfqData.port = port ? port.value.trim() : '';
    rfqData.incoterm = incoterm ? incoterm.value : 'CIF';
    return true;
  }

  return true;
}

function goToStep(step) {
  currentStep = step;
  
  // Toggle step panels
  document.querySelectorAll('.wizard-step-panel').forEach(panel => {
    panel.style.display = parseInt(panel.dataset.step, 10) === currentStep ? 'block' : 'none';
  });

  // Update step indicators
  document.querySelectorAll('.step-indicator').forEach(ind => {
    const num = parseInt(ind.dataset.step, 10);
    ind.classList.remove('active', 'done');
    if (num === currentStep) ind.classList.add('active');
    else if (num < currentStep) ind.classList.add('done');
  });

  // Toggle buttons
  const prevBtn = document.querySelector('#rfq-prev-btn');
  const nextBtn = document.querySelector('#rfq-next-btn');
  const submitBtn = document.querySelector('#rfq-submit-btn');

  if (prevBtn) prevBtn.style.display = currentStep > 1 ? 'inline-flex' : 'none';
  if (nextBtn) nextBtn.style.display = currentStep < 4 ? 'inline-flex' : 'none';
  if (submitBtn) submitBtn.style.display = currentStep === 4 ? 'inline-flex' : 'none';

  // Scroll to top of card
  const wizardCard = document.querySelector('#rfq-wizard-card');
  if (wizardCard) {
    wizardCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

async function handleRfqSubmit(e) {
  e.preventDefault();

  const nameInput = document.querySelector('#rfq-name-input');
  const emailInput = document.querySelector('#rfq-email-input');
  const phoneInput = document.querySelector('#rfq-phone-input');
  const companyInput = document.querySelector('#rfq-company-input');
  const messageInput = document.querySelector('#rfq-message-input');

  if (!nameInput || !nameInput.value.trim()) {
    showToast('Please provide your name or procurement representative name.', 'info');
    if (nameInput) nameInput.focus();
    return;
  }

  if ((!emailInput || !emailInput.value.trim()) && (!phoneInput || !phoneInput.value.trim())) {
    showToast('Please provide an email or phone number for quote dispatch.', 'info');
    if (emailInput) emailInput.focus();
    return;
  }

  rfqData.name = nameInput.value.trim();
  rfqData.email = emailInput ? emailInput.value.trim() : '';
  rfqData.phone = phoneInput ? phoneInput.value.trim() : '';
  rfqData.company = companyInput ? companyInput.value.trim() : '';
  rfqData.message = messageInput ? messageInput.value.trim() : '';

  const submitBtn = document.querySelector('#rfq-submit-btn');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `Submitting to Export Desk...`;
  }

  try {
    const res = await fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rfqData)
    });

    const result = await res.json();

    if (result.success) {
      // Clear basket if they checked out
      BasketStore.clear();

      // Show Success State
      const wizardCard = document.querySelector('#rfq-wizard-card');
      wizardCard.innerHTML = `
        <div style="text-align: center; padding: 48px 24px;">
          <div style="width: 72px; height: 72px; border-radius: 50%; background: rgba(16, 185, 129, 0.15); border: 2px solid var(--c-emerald); display: grid; place-items: center; margin: 0 auto 24px; color: var(--c-emerald);">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <span class="badge badge-gold" style="font-size: 13px; margin-bottom: 12px;">RFQ Reference: ${result.inquiryId}</span>
          <h2 class="heading-primary" style="margin-bottom: 14px;">Requirement Received</h2>
          <p class="body-lead" style="margin: 0 auto 24px; max-width: 600px;">
            Thank you, <strong>${rfqData.name}</strong>. Your export quotation request for <strong>${rfqData.products.join(', ')}</strong> has been registered in our Node.js export coordination desk.
          </p>
          <div style="background: var(--c-cream-100); border: 1px solid var(--c-border-medium); border-radius: 12px; max-width: 500px; margin: 0 auto 32px; padding: 20px; text-align: left; font-size: 13px;">
            <div style="margin-bottom: 8px;"><strong>Destination:</strong> ${rfqData.country} (${rfqData.port || 'Port to be agreed'})</div>
            <div style="margin-bottom: 8px;"><strong>Incoterm:</strong> ${rfqData.incoterm}</div>
            <div style="margin-bottom: 8px;"><strong>Target Volume:</strong> ${rfqData.targetQuantity}</div>
            <div><strong>Next Step:</strong> Formal proforma specification and indicative pricing will be transmitted to <em>${rfqData.email || rfqData.phone}</em> within 24 business hours.</div>
          </div>
          <div style="display: flex; justify-content: center; gap: 16px; flex-wrap: wrap;">
            <a href="/products" class="btn btn-outline">Explore More Products</a>
            <a href="/" class="btn btn-primary">Return to Home</a>
          </div>
        </div>
      `;
    } else {
      showToast(result.message || 'Error registering inquiry.', 'info');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Formal RFQ →';
      }
    }
  } catch (err) {
    showToast('Failed to connect to export server. Please check connection.', 'info');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Formal RFQ →';
    }
  }
}

document.addEventListener('DOMContentLoaded', initRfqPage);

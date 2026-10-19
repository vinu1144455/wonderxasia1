/**
 * WONDERXASIA - REACH OUT / REQUIREMENT INQUIRY FORM
 * Direct export requirement submission connected to Express backend
 */

async function initRfqPage() {
  const form = document.querySelector('#rfq-inquiry-form');
  if (!form) return;

  const nameInput = document.querySelector('#req-name');
  const emailInput = document.querySelector('#req-email');
  const countryCodeInput = document.querySelector('#req-country-code');
  const phoneInput = document.querySelector('#req-phone');
  const subjectSelect = document.querySelector('#req-subject');
  const messageInput = document.querySelector('#req-message');
  const submitBtn = document.querySelector('#req-submit-btn');

  // Pre-fill from URL query parameters (e.g. /rfq?product=Turmeric%20Fingers&quantity=10%20Metric%20Tonnes)
  const urlParams = new URLSearchParams(window.location.search);
  const paramProduct = urlParams.get('product');
  const paramQuantity = urlParams.get('quantity');

  if (paramProduct && messageInput) {
    let prefill = `Product: ${paramProduct}`;
    if (paramQuantity) {
      prefill += `\nQuantity: ${paramQuantity}`;
    }
    prefill += `\nRequirements: `;
    messageInput.value = prefill;
    if (subjectSelect) {
      subjectSelect.value = 'Product Quotation & Requirements';
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const code = countryCodeInput ? countryCodeInput.value.trim() : '+91';
    const rawPhone = phoneInput ? phoneInput.value.trim() : '';
    const fullPhone = `${code} ${rawPhone}`.trim();
    const subject = subjectSelect ? subjectSelect.value : 'General Trade Inquiry';
    const message = messageInput ? messageInput.value.trim() : '';

    if (!name) {
      showToast('Please enter your name.', 'info');
      if (nameInput) nameInput.focus();
      return;
    }
    if (!email) {
      showToast('Please enter your business email.', 'info');
      if (emailInput) emailInput.focus();
      return;
    }
    if (!rawPhone) {
      showToast('Please enter your phone/WhatsApp number.', 'info');
      if (phoneInput) phoneInput.focus();
      return;
    }
    if (!subject) {
      showToast('Please select a subject.', 'info');
      if (subjectSelect) subjectSelect.focus();
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Submitting...</span>`;
    }

    try {
      const payload = {
        name: name,
        email: email,
        phone: fullPhone,
        company: 'Buyer via Inquiry Form',
        country: code,
        port: '',
        incoterm: 'FOB / CIF',
        targetQuantity: 'Per requirement',
        products: [subject + (message ? ': ' + message : '')],
        message: `Subject: ${subject}\n\nRequirements / Message:\n${message || 'N/A'}`
      };

      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (result.success) {
        const formContainer = form.parentElement;
        formContainer.innerHTML = `
          <div style="text-align: center; padding: 48px 20px;">
            <div style="width: 72px; height: 72px; border-radius: 50%; background: rgba(254, 204, 0, 0.15); border: 2px solid #fecc00; display: grid; place-items: center; margin: 0 auto 24px; color: #fecc00;">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <span style="display: inline-block; background: #fecc00; color: #0a0a0a; font-size: 13px; font-weight: 700; padding: 4px 14px; border-radius: 20px; margin-bottom: 16px;">
              Ref: ${result.inquiryId || 'WXA-REQ'}
            </span>
            <h2 style="font-family: var(--font-marcellus, 'Marcellus', serif); color: #ffffff; font-size: 32px; margin-bottom: 14px;">
              Inquiry Successfully Received!
            </h2>
            <p style="color: rgba(255, 255, 255, 0.85); font-size: 15px; max-width: 560px; margin: 0 auto 28px; line-height: 1.6;">
              Thank you, <strong>${name}</strong>. Your requirement has been sent directly to our Export Desk. Our trade managers will respond to <strong>${email}</strong> / <strong>${fullPhone}</strong> within 24 business hours.
            </p>
            <div style="display: flex; justify-content: center; gap: 14px; flex-wrap: wrap;">
              <a href="/products" class="btn btn-outline" style="color: #ffffff; border-color: rgba(255,255,255,0.3);">Explore Products</a>
              <a href="/" class="btn btn-primary" style="background: #fecc00; color: #0a0a0a;">Return to Home</a>
            </div>
          </div>
        `;
      } else {
        showToast(result.message || 'Error submitting inquiry.', 'info');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<span>Submit Now</span> <span>↗</span>`;
        }
      }
    } catch (err) {
      console.error('Submission error:', err);
      showToast('Server connection failed. Please try again.', 'info');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Submit Now</span> <span>↗</span>`;
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', initRfqPage);

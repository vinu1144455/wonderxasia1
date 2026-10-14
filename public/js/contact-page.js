/**
 * WONDERXASIA - CONTACT & TRADE DESK CONTROLLER
 */

document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.querySelector('#contact-desk-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.querySelector('#contact-name').value.trim();
    const company = document.querySelector('#contact-company').value.trim();
    const email = document.querySelector('#contact-email').value.trim();
    const phone = document.querySelector('#contact-phone').value.trim();
    const country = document.querySelector('#contact-country').value.trim();
    const products = document.querySelector('#contact-interest').value.trim();
    const message = document.querySelector('#contact-message').value.trim();

    if (!name || (!email && !phone)) {
      showToast('Please provide your name and contact details (email or phone).', 'info');
      return;
    }

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Transmitting Message...';
    }

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          company,
          email,
          phone,
          country,
          products: products ? [products] : ['General Trade Inquiry'],
          message
        })
      });

      const data = await res.json();
      if (data.success) {
        contactForm.innerHTML = `
          <div style="text-align: center; padding: 40px 16px;">
            <div style="width: 64px; height: 64px; border-radius: 50%; background: rgba(16, 185, 129, 0.15); border: 2px solid var(--c-emerald); display: grid; place-items: center; margin: 0 auto 20px; color: var(--c-emerald);">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <span class="badge badge-gold" style="margin-bottom: 12px;">Reference: ${data.inquiryId}</span>
            <h3 class="heading-secondary" style="margin-bottom: 12px;">Message Successfully Dispatched</h3>
            <p class="body-lead" style="font-size: 15px; margin: 0 auto 24px; max-width: 480px;">
              Thank you, <strong>${name}</strong>. Your communication has been routed directly to our international trade managers. We will connect with you within 24 business hours.
            </p>
            <a href="/products" class="btn btn-outline btn-sm">Explore Our Product Catalog</a>
          </div>
        `;
        showToast('Trade message received. Reference: ' + data.inquiryId, 'success');
      } else {
        showToast(data.message || 'Error transmitting inquiry.', 'info');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Trade Inquiry →';
        }
      }
    } catch (err) {
      showToast('Network error while transmitting. Please retry.', 'info');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Trade Inquiry →';
      }
    }
  });
});

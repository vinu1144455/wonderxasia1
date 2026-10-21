/**
 * WONDERXASIA - CONTACT & TRADE DESK CONTROLLER
 */

document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.querySelector('#contact-desk-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameInput = document.querySelector('#contact-name');
    const emailInput = document.querySelector('#contact-email');
    const codeInput = document.querySelector('#contact-code');
    const phoneInput = document.querySelector('#contact-phone');
    const subjectSelect = document.querySelector('#contact-subject');
    const messageInput = document.querySelector('#contact-message');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const code = codeInput ? codeInput.value.trim() : '+91';
    const phone = phoneInput ? phoneInput.value.trim() : '';
    const subject = subjectSelect ? subjectSelect.value : 'General Enquiry';
    const message = messageInput ? messageInput.value.trim() : '';

    if (!name || (!email && !phone)) {
      alert('Please provide your name and contact details (email or phone).');
      return;
    }

    const fullPhone = `${code} ${phone}`.trim();
    const submitBtn = document.querySelector('#contact-submit-btn');
    const originalBtnHtml = submitBtn ? submitBtn.innerHTML : 'Submit Now ↗';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Submitting...</span>';
    }

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone: fullPhone,
          subject,
          products: [subject],
          message
        })
      });

      const data = await res.json();
      if (data.success) {
        const card = document.querySelector('#contact-reachout-card') || contactForm;
        card.innerHTML = `
          <div style="text-align: center; padding: 40px 16px;">
            <div style="width: 64px; height: 64px; border-radius: 50%; background: rgba(254, 204, 0, 0.15); border: 2px solid #fecc00; display: grid; place-items: center; margin: 0 auto 20px; color: #fecc00;">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <span style="display: inline-block; padding: 4px 14px; background: rgba(254, 204, 0, 0.15); color: #fecc00; border: 1px solid rgba(254, 204, 0, 0.4); border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-bottom: 12px;">Reference: ${data.inquiryId}</span>
            <h3 style="font-family: var(--font-marcellus, serif); font-size: 26px; color: #ffffff; margin-bottom: 12px;">Message Successfully Dispatched</h3>
            <p style="font-size: 14.5px; color: rgba(255, 255, 255, 0.85); margin: 0 auto 24px; max-width: 480px; line-height: 1.6;">
              Thank you, <strong style="color: #fecc00;">${name}</strong>. Your communication has been routed directly to our international trade managers. We will connect with you at <em>${email || fullPhone}</em> within 24 business hours.
            </p>
            <a href="/products" class="btn btn-primary" style="padding: 10px 20px; font-size: 12px; font-weight: 700;">Explore Product Catalog</a>
          </div>
        `;
      } else {
        alert(data.message || 'Error transmitting inquiry.');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
        }
      }
    } catch (err) {
      alert('Network error while transmitting. Please retry.');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }
    }
  });
});

/**
 * WONDERXASIA - REACH OUT REQUIREMENT & INQUIRY CONTROLLER
 * Connects direct requirement form to Express export desk API
 */

document.addEventListener('DOMContentLoaded', initReachoutForm);

function initReachoutForm() {
  const form = document.querySelector('#reachout-enquiry-form');
  if (!form) return;

  const urlParams = new URLSearchParams(window.location.search);
  const nameInput = document.querySelector('#reachout-name');
  const subjectSelect = document.querySelector('#reachout-subject');
  const messageTextarea = document.querySelector('#reachout-message');

  // Pre-fill from URL params (e.g. clicked "Enquire Now" on product or category)
  if (urlParams.has('product')) {
    const product = urlParams.get('product');
    const category = urlParams.get('category') || '';
    const formType = urlParams.get('form') || '';
    const quantity = urlParams.get('quantity') || '';

    if (subjectSelect) {
      subjectSelect.value = 'Product Enquiry';
    }

    if (messageTextarea) {
      let text = `Product Required: ${product}`;
      if (category) text += ` (${category})`;
      if (formType) text += `\nGrade / Form: ${formType}`;
      if (quantity) text += `\nTarget Volume: ${quantity}`;
      text += `\n\nAdditional Requirements / Packaging / Destination Port:\n`;
      messageTextarea.value = text;
    }
  } else if (urlParams.has('category')) {
    const category = urlParams.get('category');
    if (subjectSelect) {
      subjectSelect.value = 'Bulk Mandi / FCL Container Order';
    }
    if (messageTextarea) {
      messageTextarea.value = `Interested in commodity family: ${category}\nTarget Port / Requirements:\n`;
    }
  }

  // Handle Form Submission
  form.addEventListener('submit', handleReachoutSubmit);
}

async function handleReachoutSubmit(e) {
  e.preventDefault();

  const nameInput = document.querySelector('#reachout-name');
  const emailInput = document.querySelector('#reachout-email');
  const codeInput = document.querySelector('#reachout-code');
  const phoneInput = document.querySelector('#reachout-phone');
  const subjectSelect = document.querySelector('#reachout-subject');
  const messageTextarea = document.querySelector('#reachout-message');
  const submitBtn = document.querySelector('#reachout-submit-btn');

  const name = nameInput ? nameInput.value.trim() : '';
  const email = emailInput ? emailInput.value.trim() : '';
  const code = codeInput ? codeInput.value.trim() : '+91';
  const phone = phoneInput ? phoneInput.value.trim() : '';
  const subject = subjectSelect ? subjectSelect.value : 'General Enquiry';
  const message = messageTextarea ? messageTextarea.value.trim() : '';

  if (!name) {
    alert('Please enter your name.');
    if (nameInput) nameInput.focus();
    return;
  }

  if (!email && !phone) {
    alert('Please provide an email or phone number.');
    if (emailInput) emailInput.focus();
    return;
  }

  const fullPhone = `${code} ${phone}`.trim();

  // Loading state
  const originalBtnHtml = submitBtn ? submitBtn.innerHTML : 'Submit Now ↗';
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    submitBtn.innerHTML = `<span>Submitting...</span>`;
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
        message,
        products: [subject, message.split('\n')[0].substring(0, 80)].filter(Boolean)
      })
    });

    const data = await res.json();

    if (data.success) {
      const card = document.querySelector('#reachout-form-card');
      if (card) {
        card.innerHTML = `
          <div style="text-align: center; padding: 32px 16px;">
            <div style="width: 68px; height: 68px; border-radius: 50%; background: rgba(254, 204, 0, 0.15); border: 2px solid #fecc00; display: grid; place-items: center; margin: 0 auto 24px; color: #fecc00;">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            
            <span style="display: inline-block; padding: 4px 14px; background: rgba(254, 204, 0, 0.15); color: #fecc00; border: 1px solid rgba(254, 204, 0, 0.4); border-radius: 20px; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 16px;">
              Enquiry Reference: ${data.inquiryId || 'WXA-REQ-CONFIRMED'}
            </span>
            
            <h2 style="font-family: var(--font-marcellus, serif); font-size: clamp(26px, 3.5vw, 36px); color: #ffffff; margin-bottom: 12px;">
              Requirement Received!
            </h2>
            
            <p style="color: rgba(255, 255, 255, 0.85); font-size: 14.5px; max-width: 580px; margin: 0 auto 24px; line-height: 1.6;">
              Thank you, <strong style="color: #fecc00;">${name}</strong>. Your requirement has been registered with the Wonderxasia Export Desk. Our export coordination team will review your specifications and contact you at <em>${email || fullPhone}</em> within 24 business hours.
            </p>

            <div style="background: #1e1e1e; border: 1px solid #333333; border-radius: 12px; padding: 18px 24px; max-width: 520px; margin: 0 auto 32px; text-align: left; font-size: 13px; color: rgba(255, 255, 255, 0.85);">
              <div style="margin-bottom: 6px;"><strong style="color: #ffffff;">Subject:</strong> ${subject}</div>
              <div style="margin-bottom: 6px;"><strong style="color: #ffffff;">Contact:</strong> ${email || fullPhone}</div>
              <div><strong style="color: #ffffff;">Immediate Support:</strong> WhatsApp +91 98765 43210</div>
            </div>

            <div style="display: flex; justify-content: center; gap: 14px; flex-wrap: wrap;">
              <a href="/products" class="btn btn-outline-light" style="padding: 12px 24px; font-weight: 700; font-size: 13px;">
                Explore Products Catalog
              </a>
              <a href="/" class="btn btn-primary" style="padding: 12px 24px; font-weight: 700; font-size: 13px;">
                Return to Home
              </a>
            </div>
          </div>
        `;
        card.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      alert(data.message || 'Error submitting enquiry. Please try again.');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        submitBtn.innerHTML = originalBtnHtml;
      }
    }
  } catch (err) {
    console.error('Submission error:', err);
    alert('Network error. Please try again or contact us directly via WhatsApp.');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
      submitBtn.innerHTML = originalBtnHtml;
    }
  }
}

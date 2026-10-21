// Wonderxasia Export CRM Portal Controller
// B2B Indian Agri-Commodities & Auto Parts Export Trading System

let allProducts = [];
let crmData = {
  inquiries: [],
  quotations: [],
  customers: [],
  shipments: [],
  mandi: [],
  samples: [],
  config: null
};

// =============================================================================
// INITIALIZATION
// =============================================================================
document.addEventListener('DOMContentLoaded', () => {
  initClocks();
  initNavListeners();
  initSearchAndFilters();
  loadAllProducts();
  refreshAllCrmData();
});

// Live IST & UTC Clocks
function initClocks() {
  function update() {
    const now = new Date();
    const istStr = now.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour12: false });
    const utcStr = now.toLocaleTimeString('en-US', { timeZone: 'UTC', hour12: false });
    const istEl = document.getElementById('clock-ist');
    const utcEl = document.getElementById('clock-utc');
    if (istEl) istEl.textContent = istStr;
    if (utcEl) utcEl.textContent = utcStr;
  }
  update();
  setInterval(update, 1000);
}

// Sidebar Navigation
function initNavListeners() {
  const navBtns = document.querySelectorAll('.crm-nav-item button[data-view]');
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.dataset.view;
      switchView(view);
    });
  });
}

function switchView(viewName) {
  // Update nav buttons
  document.querySelectorAll('.crm-nav-item button[data-view]').forEach(btn => {
    if (btn.dataset.view === viewName) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Update panels
  document.querySelectorAll('.crm-view-panel').forEach(panel => {
    panel.classList.remove('active');
  });

  const targetPanel = document.getElementById(`view-${viewName}`);
  if (targetPanel) {
    targetPanel.classList.add('active');
  }

  // Update title
  const titleEl = document.getElementById('crm-page-title');
  const titleMap = {
    dashboard: 'Executive Dashboard & Agri Export Stream',
    inquiries: 'Global Buyer Enquiries & Lead Pipeline',
    quotations: 'Proforma Invoices (PI) & Contract Drafting',
    customers: 'Overseas Importers & Consignee Directory',
    shipments: 'Container Logistics, BL & Vessel Tracking',
    mandi: 'APMC Mandi Farmgate Procurement Log',
    samples: 'Air Courier Sample Dispatch Tracker',
    config: 'Official Indian Export Entity Profile'
  };
  if (titleEl && titleMap[viewName]) {
    titleEl.textContent = titleMap[viewName];
  }
}

// Fetch products for dropdowns
async function loadAllProducts() {
  try {
    const res = await fetch('/api/products');
    if (res.ok) {
      const data = await res.json();
      allProducts = Array.isArray(data) ? data : (data.products || []);
    }
  } catch (err) {
    console.error('Failed to load products for CRM line items:', err);
  }
}

// Central Data Refresh
async function refreshAllCrmData() {
  await Promise.allSettled([
    loadStats(),
    loadInquiries(),
    loadQuotations(),
    loadCustomers(),
    loadShipments(),
    loadMandiLots(),
    loadSamples(),
    loadExportConfig()
  ]);
}

// Search and Filter Listeners
function initSearchAndFilters() {
  const inqSearch = document.getElementById('inquiries-search-input');
  const inqFilter = document.getElementById('inquiries-status-filter');
  if (inqSearch) inqSearch.addEventListener('input', () => renderInquiriesTable());
  if (inqFilter) inqFilter.addEventListener('change', () => renderInquiriesTable());

  const quoteSearch = document.getElementById('quotes-search-input');
  const quoteFilter = document.getElementById('quotes-status-filter');
  if (quoteSearch) quoteSearch.addEventListener('input', () => renderQuotationsTable());
  if (quoteFilter) quoteFilter.addEventListener('change', () => renderQuotationsTable());

  const custSearch = document.getElementById('customers-search-input');
  if (custSearch) custSearch.addEventListener('input', () => renderCustomersTable());

  const shpSearch = document.getElementById('shipments-search-input');
  if (shpSearch) shpSearch.addEventListener('input', () => renderShipmentsTable());

  const mndSearch = document.getElementById('mandi-search-input');
  if (mndSearch) mndSearch.addEventListener('input', () => renderMandiTable());

  const smpSearch = document.getElementById('samples-search-input');
  if (smpSearch) smpSearch.addEventListener('input', () => renderSamplesTable());
}

// =============================================================================
// 1. STATS & DASHBOARD
// =============================================================================
async function loadStats() {
  try {
    const res = await fetch('/api/crm/stats');
    if (!res.ok) return;
    const { stats } = await res.json();

    // KPIs
    document.getElementById('kpi-total-inquiries').textContent = stats.totalInquiries || 0;
    document.getElementById('kpi-new-leads').textContent = stats.newLeadsCount || 0;
    document.getElementById('kpi-total-quotes').textContent = stats.totalQuotations || 0;
    document.getElementById('kpi-active-quotes').textContent = stats.activeQuotesCount || 0;
    document.getElementById('kpi-pipeline-value').textContent = '$' + (stats.pipelineValueUSD || 0).toLocaleString();
    document.getElementById('kpi-in-transit').textContent = stats.inTransitCount || 0;
    document.getElementById('kpi-total-shipments').textContent = stats.totalShipments || 0;

    // Badges
    document.getElementById('badge-inquiries-count').textContent = stats.totalInquiries || 0;
    document.getElementById('badge-quotes-count').textContent = stats.totalQuotations || 0;
    document.getElementById('badge-customers-count').textContent = stats.totalCustomers || 0;
    document.getElementById('badge-shipments-count').textContent = stats.totalShipments || 0;

    // Top Commodities
    renderDashboardTopCommodities(stats.topCommodities || []);
    renderDashboardMandiTicker();
  } catch (err) {
    console.error('Error loading stats:', err);
  }
}

function renderDashboardTopCommodities(commodities) {
  const container = document.getElementById('dashboard-top-commodities-list');
  if (!container) return;

  if (!commodities || commodities.length === 0) {
    container.innerHTML = `
      <div style="padding: 24px; text-align: center; color: var(--crm-text-muted); font-size: 13px;">
        No buyer commodity inquiries registered yet.
      </div>
    `;
    return;
  }

  container.innerHTML = commodities.map(item => `
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--crm-card-border); font-size: 13px;">
      <span style="font-weight: 600; color: #ffffff;">${escapeHtml(item.commodity)}</span>
      <span class="crm-badge crm-badge-gold">${item.count} Requests</span>
    </div>
  `).join('');
}

function renderDashboardMandiTicker() {
  const container = document.getElementById('dashboard-mandi-rates-list');
  if (!container) return;

  const benchmarkItems = [
    { hub: 'Unjha Mandi, Gujarat', item: 'Cumin (Jeera) Machine Clean', rate: '₹24,800 / Qtl', trend: '▲ +1.4%' },
    { hub: 'Guntur Mandi, AP', item: 'Red Chilli Sannam S4 Stemless', rate: '₹19,500 / Qtl', trend: '▼ -0.8%' },
    { hub: 'Nizamabad Mandi, TS', item: 'Turmeric Finger Selam Polished', rate: '₹14,200 / Qtl', trend: '▲ +2.1%' },
    { hub: 'Bikaner Mandi, RJ', item: 'White Sesame Seeds 99.9% Sortex', rate: '₹16,400 / Qtl', trend: '▲ +0.5%' },
    { hub: 'Patan Mandi, Gujarat', item: 'Castor Seed APMC Grade', rate: '₹6,150 / Qtl', trend: '― Stable' }
  ];

  container.innerHTML = benchmarkItems.map(b => `
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: rgba(255,255,255,0.02); border-radius: 8px; border: 1px solid rgba(255,255,255,0.04);">
      <div>
        <div style="font-size: 12.5px; font-weight: 600; color: #fff;">${b.item}</div>
        <div style="font-size: 11px; color: var(--crm-text-muted);">${b.hub}</div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 13px; font-weight: 700; color: var(--crm-gold);">${b.rate}</div>
        <div style="font-size: 10.5px; color: ${b.trend.includes('▲') ? 'var(--crm-emerald)' : b.trend.includes('▼') ? 'var(--crm-red)' : 'var(--crm-text-muted)'};">${b.trend}</div>
      </div>
    </div>
  `).join('');
}

// =============================================================================
// 2. INQUIRIES & LEADS
// =============================================================================
async function loadInquiries() {
  try {
    const res = await fetch('/api/crm/inquiries');
    if (!res.ok) return;
    const data = await res.json();
    crmData.inquiries = data.inquiries || [];
    renderInquiriesTable();
    renderDashboardRecentInquiries();
  } catch (err) {
    console.error('Error loading inquiries:', err);
  }
}

function renderDashboardRecentInquiries() {
  const tbody = document.getElementById('dashboard-recent-inquiries-tbody');
  if (!tbody) return;

  const recent = crmData.inquiries.slice(0, 5);
  if (recent.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 36px; color: var(--crm-text-muted);">
          No active inquiries in the database. When buyers submit an inquiry on the public catalog, it streams here instantly.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = recent.map(lead => `
    <tr>
      <td><span style="font-family: monospace; font-size: 11px; color: var(--crm-gold);">${lead.id || 'N/A'}</span></td>
      <td>
        <strong style="color: #fff; font-size: 13px;">${escapeHtml(lead.name || '')}</strong>
        <div style="font-size: 11px; color: var(--crm-text-muted);">${escapeHtml(lead.company || '')}</div>
      </td>
      <td>
        <div>${escapeHtml(lead.country || 'International')}</div>
        <div style="font-size: 11px; color: var(--crm-text-muted);">${escapeHtml(lead.port || '')}</div>
      </td>
      <td>
        <div style="max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 12px; color: #ddd;">
          ${escapeHtml(lead.subject || lead.message || 'Product Inquiry')}
        </div>
      </td>
      <td>${getStatusBadge(lead.status || 'New Lead')}</td>
      <td>
        <button class="crm-btn crm-btn-secondary crm-btn-sm" onclick="viewLeadDetail('${lead.id}')">
          Review →
        </button>
      </td>
    </tr>
  `).join('');
}

function renderInquiriesTable() {
  const tbody = document.getElementById('inquiries-table-tbody');
  if (!tbody) return;

  const searchInput = document.getElementById('inquiries-search-input');
  const statusFilter = document.getElementById('inquiries-status-filter');
  const searchVal = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const filterVal = statusFilter ? statusFilter.value : 'all';

  let filtered = crmData.inquiries.filter(i => {
    const matchesStatus = filterVal === 'all' || (i.status && i.status.toLowerCase() === filterVal.toLowerCase());
    const textBlob = `${i.id} ${i.name} ${i.company} ${i.email} ${i.phone} ${i.country} ${i.subject} ${i.message}`.toLowerCase();
    const matchesSearch = !searchVal || textBlob.includes(searchVal);
    return matchesStatus && matchesSearch;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" style="text-align: center; padding: 48px; color: var(--crm-text-muted);">
          No leads matching current filters.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(lead => {
    const dateStr = lead.timestamp ? new Date(lead.timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
    const cleanPhone = (lead.phone || '').replace(/[^0-9]/g, '');
    const waLink = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hello ${lead.name}, thank you for contacting Wonderx Innovations regarding your commodity requirement.`)}` : null;

    return `
      <tr>
        <td style="font-size: 11.5px; color: var(--crm-text-muted); white-space: nowrap;">${dateStr}</td>
        <td><span style="font-family: monospace; font-size: 11px; color: var(--crm-gold);">${lead.id}</span></td>
        <td><strong style="color: #fff; font-size: 13px;">${escapeHtml(lead.name || '')}</strong></td>
        <td>${escapeHtml(lead.company || '—')}</td>
        <td>
          <div style="font-size: 12px; color: #fff;">${escapeHtml(lead.email || '—')}</div>
          <div style="font-size: 11.5px; display: flex; align-items: center; gap: 6px; margin-top: 3px;">
            <span>${escapeHtml(lead.phone || '—')}</span>
            ${waLink ? `<a href="${waLink}" target="_blank" title="Open WhatsApp Chat" style="color: #25D366; text-decoration: none;">💬</a>` : ''}
          </div>
        </td>
        <td>${escapeHtml(lead.country || '—')}</td>
        <td>
          <div style="max-width: 240px; font-size: 12px; color: #ddd;">
            <strong>${escapeHtml(lead.subject || 'Commodity Request')}</strong>
            <div style="color: var(--crm-text-muted); font-size: 11px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${escapeHtml(lead.message || '')}</div>
          </div>
        </td>
        <td>
          <select class="crm-select" style="font-size: 11px; padding: 4px 8px;" onchange="updateInquiryStatus('${lead.id}', this.value)">
            <option value="New Lead" ${lead.status === 'New Lead' ? 'selected' : ''}>New Lead</option>
            <option value="Reviewing Specification" ${lead.status === 'Reviewing Specification' ? 'selected' : ''}>Reviewing Spec</option>
            <option value="Contacted" ${lead.status === 'Contacted' ? 'selected' : ''}>Contacted</option>
            <option value="Quotation Sent" ${lead.status === 'Quotation Sent' ? 'selected' : ''}>Quotation Sent</option>
            <option value="Contract Signed" ${lead.status === 'Contract Signed' ? 'selected' : ''}>Contract Signed</option>
            <option value="Archived" ${lead.status === 'Archived' ? 'selected' : ''}>Archived</option>
          </select>
        </td>
        <td>
          <div style="display: flex; gap: 6px;">
            <button class="crm-btn crm-btn-secondary crm-btn-sm" onclick="viewLeadDetail('${lead.id}')">View</button>
            <button class="crm-btn crm-btn-primary crm-btn-sm" title="Generate Proforma from this Lead" onclick="convertInquiryToQuotation('${lead.id}')">PI ↗</button>
            <button class="crm-btn crm-btn-danger crm-btn-sm" title="Delete" onclick="deleteInquiry('${lead.id}')">🗑️</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function openNewLeadModal() {
  document.getElementById('form-new-lead').reset();
  openModal('modal-new-lead');
}

async function handleCreateLead(event) {
  event.preventDefault();
  const payload = {
    name: document.getElementById('newlead-name').value,
    company: document.getElementById('newlead-company').value,
    email: document.getElementById('newlead-email').value,
    phone: document.getElementById('newlead-phone').value,
    country: document.getElementById('newlead-country').value,
    port: document.getElementById('newlead-port').value,
    subject: document.getElementById('newlead-subject').value,
    message: document.getElementById('newlead-message').value
  };

  try {
    const res = await fetch('/api/crm/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      closeModal('modal-new-lead');
      await refreshAllCrmData();
      alert('Trade lead saved successfully!');
    } else {
      const err = await res.json();
      alert(err.message || 'Failed to save lead');
    }
  } catch (err) {
    console.error('Error creating lead:', err);
  }
}

function viewLeadDetail(id) {
  const lead = crmData.inquiries.find(i => i.id === id);
  if (!lead) return;

  const bodyEl = document.getElementById('lead-modal-body');
  const titleEl = document.getElementById('lead-modal-title');
  const convertBtn = document.getElementById('lead-modal-convert-btn');

  if (titleEl) titleEl.textContent = `Enquiry Dossier — ${lead.id}`;
  if (convertBtn) {
    convertBtn.onclick = () => {
      closeModal('modal-lead-detail');
      convertInquiryToQuotation(lead.id);
    };
  }

  const cleanPhone = (lead.phone || '').replace(/[^0-9]/g, '');
  const waLink = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hello ${lead.name}, regarding your trade inquiry with Wonderx Innovations.`)}` : null;

  bodyEl.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
      <div>
        <label style="font-size: 11px; text-transform: uppercase; color: var(--crm-text-muted); font-weight: 700;">Consignee / Buyer</label>
        <div style="font-size: 15px; font-weight: 700; color: #fff; margin-top: 2px;">${escapeHtml(lead.name || '')}</div>
        <div style="font-size: 13px; color: var(--crm-gold);">${escapeHtml(lead.company || 'Direct Importer')}</div>
      </div>
      <div>
        <label style="font-size: 11px; text-transform: uppercase; color: var(--crm-text-muted); font-weight: 700;">Destination &amp; Port</label>
        <div style="font-size: 14px; font-weight: 600; color: #fff; margin-top: 2px;">${escapeHtml(lead.country || 'International')}</div>
        <div style="font-size: 12px; color: var(--crm-text-muted);">Port: ${escapeHtml(lead.port || 'TBA')}</div>
      </div>
      <div>
        <label style="font-size: 11px; text-transform: uppercase; color: var(--crm-text-muted); font-weight: 700;">Contact Coordinates</label>
        <div style="font-size: 13px; color: #fff; margin-top: 2px;">✉️ ${escapeHtml(lead.email || '—')}</div>
        <div style="font-size: 13px; color: #fff; margin-top: 3px;">
          📞 ${escapeHtml(lead.phone || '—')}
          ${waLink ? ` &bull; <a href="${waLink}" target="_blank" style="color: #25D366; font-weight: 600; text-decoration: none;">Launch WhatsApp</a>` : ''}
        </div>
      </div>
      <div>
        <label style="font-size: 11px; text-transform: uppercase; color: var(--crm-text-muted); font-weight: 700;">Status &amp; Submission Date</label>
        <div style="margin-top: 4px;">${getStatusBadge(lead.status || 'New Lead')}</div>
        <div style="font-size: 11.5px; color: var(--crm-text-muted); margin-top: 4px;">
          Received: ${lead.timestamp ? new Date(lead.timestamp).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }) + ' IST' : '—'}
        </div>
      </div>
    </div>

    <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--crm-card-border); border-radius: 8px; padding: 14px 16px; margin-bottom: 20px;">
      <label style="font-size: 11px; text-transform: uppercase; color: var(--crm-gold); font-weight: 700;">Subject &amp; Specification Requirements</label>
      <div style="font-size: 13.5px; font-weight: 600; color: #fff; margin: 4px 0 8px;">${escapeHtml(lead.subject || 'Agri Commodity Inquiries')}</div>
      <div style="font-size: 13px; line-height: 1.6; color: #ddd; white-space: pre-wrap;">${escapeHtml(lead.message || 'No additional notes specified.')}</div>
    </div>
  `;

  openModal('modal-lead-detail');
}

async function updateInquiryStatus(id, newStatus) {
  try {
    const res = await fetch(`/api/crm/inquiries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    if (res.ok) {
      const idx = crmData.inquiries.findIndex(i => i.id === id);
      if (idx !== -1) crmData.inquiries[idx].status = newStatus;
      loadStats();
    }
  } catch (err) {
    console.error('Error updating status:', err);
  }
}

async function deleteInquiry(id) {
  if (!confirm(`Are you sure you want to delete inquiry ${id}?`)) return;
  try {
    const res = await fetch(`/api/crm/inquiries/${id}`, { method: 'DELETE' });
    if (res.ok) {
      crmData.inquiries = crmData.inquiries.filter(i => i.id !== id);
      renderInquiriesTable();
      renderDashboardRecentInquiries();
      loadStats();
    }
  } catch (err) {
    console.error('Error deleting inquiry:', err);
  }
}

// Convert Inquiry to Proforma
function convertInquiryToQuotation(leadId) {
  const lead = crmData.inquiries.find(i => i.id === leadId);
  if (!lead) return;

  openNewQuotationModal();
  document.getElementById('pi-buyerName').value = lead.name || '';
  document.getElementById('pi-buyerCompany').value = lead.company || '';
  document.getElementById('pi-buyerEmail').value = lead.email || '';
  document.getElementById('pi-buyerPhone').value = lead.phone || '';
  document.getElementById('pi-country').value = lead.country || '';
  document.getElementById('pi-portOfDischarge').value = lead.port || '';
}

// =============================================================================
// 3. PROFORMA INVOICES (PI) & QUOTATIONS
// =============================================================================
async function loadQuotations() {
  try {
    const res = await fetch('/api/crm/quotations');
    if (!res.ok) return;
    const data = await res.json();
    crmData.quotations = data.quotations || [];
    renderQuotationsTable();
  } catch (err) {
    console.error('Error loading quotations:', err);
  }
}

function renderQuotationsTable() {
  const tbody = document.getElementById('quotes-table-tbody');
  if (!tbody) return;

  const searchInput = document.getElementById('quotes-search-input');
  const statusFilter = document.getElementById('quotes-status-filter');
  const searchVal = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const filterVal = statusFilter ? statusFilter.value : 'all';

  let filtered = crmData.quotations.filter(q => {
    const matchesStatus = filterVal === 'all' || (q.status && q.status.toLowerCase() === filterVal.toLowerCase());
    const textBlob = `${q.id} ${q.buyerName} ${q.buyerCompany} ${q.country} ${q.portOfDischarge}`.toLowerCase();
    const matchesSearch = !searchVal || textBlob.includes(searchVal);
    return matchesStatus && matchesSearch;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" style="text-align: center; padding: 48px; color: var(--crm-text-muted);">
          No Proforma Invoices issued yet. Click "+ Create New PI / Quote" above to generate your first export contract.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(quote => {
    const dateStr = quote.date ? new Date(quote.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
    const totalUSD = Number(quote.totalAmountUSD) || 0;

    return `
      <tr>
        <td style="font-size: 11.5px; color: var(--crm-text-muted);">${dateStr}</td>
        <td><strong style="font-family: monospace; color: var(--crm-gold); font-size: 12px;">${quote.id}</strong></td>
        <td>
          <div style="font-weight: 700; color: #fff; font-size: 13px;">${escapeHtml(quote.buyerCompany || quote.buyerName)}</div>
          <div style="font-size: 11.5px; color: var(--crm-text-muted);">${escapeHtml(quote.buyerName)} &bull; ${escapeHtml(quote.country)}</div>
        </td>
        <td>${escapeHtml(quote.portOfDischarge || '—')}</td>
        <td><span class="crm-badge crm-badge-gold">${escapeHtml(quote.incoterm || 'CIF')}</span></td>
        <td style="font-size: 12px; color: #ccc;">${escapeHtml(quote.containerType || '1x 20ft FCL')}</td>
        <td>
          <span style="font-size: 14px; font-weight: 800; color: var(--crm-gold);">$${totalUSD.toLocaleString()} USD</span>
        </td>
        <td>
          <select class="crm-select" style="font-size: 11px; padding: 4px 8px;" onchange="updateQuotationStatus('${quote.id}', this.value)">
            <option value="Issued" ${quote.status === 'Issued' ? 'selected' : ''}>Issued</option>
            <option value="Negotiation" ${quote.status === 'Negotiation' ? 'selected' : ''}>Negotiation</option>
            <option value="Accepted / Contract Signed" ${quote.status === 'Accepted / Contract Signed' ? 'selected' : ''}>Accepted / Signed</option>
            <option value="Declined" ${quote.status === 'Declined' ? 'selected' : ''}>Declined</option>
          </select>
        </td>
        <td>
          <div style="display: flex; gap: 6px;">
            <button class="crm-btn crm-btn-secondary crm-btn-sm" title="Preview Printable PI" onclick="previewProformaInvoice('${quote.id}')">
              📄 View PI
            </button>
            <button class="crm-btn crm-btn-danger crm-btn-sm" title="Delete PI" onclick="deleteQuotation('${quote.id}')">
              🗑️
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function openNewQuotationModal() {
  document.getElementById('form-quotation-builder').reset();
  const tbody = document.getElementById('pi-items-tbody');
  if (tbody) tbody.innerHTML = '';
  // Add first default row
  addQuotationItemRow();
  calculatePiTotals();
  openModal('modal-quotation-builder');
}

function addQuotationItemRow(preset = {}) {
  const tbody = document.getElementById('pi-items-tbody');
  if (!tbody) return;

  const tr = document.createElement('tr');

  // Generate options from allProducts
  let productOptions = '';
  if (allProducts && allProducts.length > 0) {
    productOptions = allProducts.map(p => {
      const selected = preset.product === p.name ? 'selected' : '';
      return `<option value="${escapeHtml(p.name)}" ${selected}>${escapeHtml(p.name)} (${p.category || 'Agri'})</option>`;
    }).join('');
  } else {
    productOptions = `
      <option value="Cumin Seeds (Jeera)">Cumin Seeds (Jeera)</option>
      <option value="Turmeric Finger (Selam)">Turmeric Finger (Selam)</option>
      <option value="Red Chilli Whole (Sannam S4)">Red Chilli Whole (Sannam S4)</option>
      <option value="Coriander Seeds (Eagle Quality)">Coriander Seeds (Eagle Quality)</option>
      <option value="Natural White Sesame Seeds 99.9%">Natural White Sesame Seeds 99.9%</option>
      <option value="Green Cardamom (8mm Bold)">Green Cardamom (8mm Bold)</option>
      <option value="Automotive Radiator Assemblies">Automotive Radiator Assemblies</option>
    `;
  }

  tr.innerHTML = `
    <td>
      <select class="crm-form-select pi-item-product" style="font-size: 12px; padding: 6px 8px;">
        ${productOptions}
      </select>
    </td>
    <td>
      <input type="text" class="crm-form-input pi-item-grade" value="${escapeHtml(preset.grade || 'Sortex Clean Grade 99.5%')}" style="font-size: 12px; padding: 6px 8px;" />
    </td>
    <td>
      <input type="text" class="crm-form-input pi-item-packaging" value="${escapeHtml(preset.packaging || '25kg PP Bags with Liner')}" style="font-size: 12px; padding: 6px 8px;" />
    </td>
    <td>
      <input type="number" class="crm-form-input pi-item-qty" value="${preset.quantity || 18}" step="0.5" min="0.1" style="font-size: 12px; padding: 6px 8px;" oninput="calculatePiTotals()" />
    </td>
    <td>
      <input type="number" class="crm-form-input pi-item-rate" value="${preset.ratePerUnitUSD || 3200}" step="10" min="1" style="font-size: 12px; padding: 6px 8px;" oninput="calculatePiTotals()" />
    </td>
    <td>
      <button type="button" class="crm-btn crm-btn-danger crm-btn-sm" style="padding: 4px 7px;" onclick="removeQuotationItemRow(this)">✕</button>
    </td>
  `;

  tbody.appendChild(tr);
  calculatePiTotals();
}

function removeQuotationItemRow(btn) {
  const row = btn.closest('tr');
  const tbody = document.getElementById('pi-items-tbody');
  if (tbody && tbody.children.length > 1) {
    row.remove();
    calculatePiTotals();
  } else {
    alert('At least one line item is required.');
  }
}

function calculatePiTotals() {
  const rows = document.querySelectorAll('#pi-items-tbody tr');
  let itemsSubtotal = 0;

  rows.forEach(r => {
    const qty = parseFloat(r.querySelector('.pi-item-qty')?.value) || 0;
    const rate = parseFloat(r.querySelector('.pi-item-rate')?.value) || 0;
    itemsSubtotal += (qty * rate);
  });

  const freight = parseFloat(document.getElementById('pi-freightChargesUSD')?.value) || 0;
  const insurance = parseFloat(document.getElementById('pi-insuranceUSD')?.value) || 0;
  const grandTotal = itemsSubtotal + freight + insurance;

  const displayEl = document.getElementById('pi-calculated-total-display');
  if (displayEl) {
    displayEl.textContent = `$${Math.round(grandTotal).toLocaleString()} USD`;
  }

  return { itemsSubtotal, freight, insurance, grandTotal };
}

async function handleCreateQuotation(event) {
  event.preventDefault();

  const rows = document.querySelectorAll('#pi-items-tbody tr');
  const items = [];
  rows.forEach(r => {
    items.push({
      product: r.querySelector('.pi-item-product').value,
      grade: r.querySelector('.pi-item-grade').value,
      packaging: r.querySelector('.pi-item-packaging').value,
      quantity: parseFloat(r.querySelector('.pi-item-qty').value) || 1,
      ratePerUnitUSD: parseFloat(r.querySelector('.pi-item-rate').value) || 0
    });
  });

  if (items.length === 0) {
    alert('Please add at least one line item.');
    return;
  }

  const payload = {
    buyerName: document.getElementById('pi-buyerName').value,
    buyerCompany: document.getElementById('pi-buyerCompany').value,
    buyerEmail: document.getElementById('pi-buyerEmail').value,
    buyerPhone: document.getElementById('pi-buyerPhone').value,
    country: document.getElementById('pi-country').value,
    portOfDischarge: document.getElementById('pi-portOfDischarge').value,
    portOfLoading: document.getElementById('pi-portOfLoading').value,
    incoterm: document.getElementById('pi-incoterm').value,
    containerType: document.getElementById('pi-containerType').value,
    paymentTerms: document.getElementById('pi-paymentTerms').value,
    validityDays: parseInt(document.getElementById('pi-validityDays').value) || 7,
    freightChargesUSD: parseFloat(document.getElementById('pi-freightChargesUSD').value) || 0,
    insuranceUSD: parseFloat(document.getElementById('pi-insuranceUSD').value) || 0,
    items
  };

  try {
    const res = await fetch('/api/crm/quotations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const { quotation } = await res.json();
      closeModal('modal-quotation-builder');
      await refreshAllCrmData();
      previewProformaInvoice(quotation.id);
    } else {
      const err = await res.json();
      alert(err.message || 'Failed to create quotation');
    }
  } catch (err) {
    console.error('Error creating quotation:', err);
  }
}

async function updateQuotationStatus(id, newStatus) {
  try {
    const res = await fetch(`/api/crm/quotations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    if (res.ok) {
      const idx = crmData.quotations.findIndex(q => q.id === id);
      if (idx !== -1) crmData.quotations[idx].status = newStatus;
      loadStats();
    }
  } catch (err) {
    console.error('Error updating quote status:', err);
  }
}

async function deleteQuotation(id) {
  if (!confirm(`Are you sure you want to delete Proforma Invoice ${id}?`)) return;
  try {
    const res = await fetch(`/api/crm/quotations/${id}`, { method: 'DELETE' });
    if (res.ok) {
      crmData.quotations = crmData.quotations.filter(q => q.id !== id);
      renderQuotationsTable();
      loadStats();
    }
  } catch (err) {
    console.error('Error deleting quote:', err);
  }
}

// Print / View PI Modal
function previewProformaInvoice(id) {
  const quote = crmData.quotations.find(q => q.id === id);
  if (!quote) return;

  const cfg = crmData.config || {
    companyName: 'Wonderx Innovations Private Limited',
    division: 'International Agri-Commodities & Auto Parts Export Division',
    corporateAddress: 'A-402, Export Business Hub, Surat - 395007, Gujarat, India',
    iecNumber: '0823489102',
    apedaRegistration: 'APEDA/REG/AGRI/2024/9182',
    gstin: '24AAACW8912P1ZS',
    bankName: 'State Bank of India — Commercial Branch',
    swiftCode: 'SBININBBXXX',
    accountName: 'Wonderx Innovations Pvt Ltd (Export Proceeds)',
    accountNumber: '409182749102'
  };

  const container = document.getElementById('pi-preview-container');
  if (!container) return;

  const issueDate = quote.date ? new Date(quote.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '';
  const validUntil = quote.validUntil ? new Date(quote.validUntil).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '7 Days from Issue';

  const rowsHtml = (quote.items || []).map((it, idx) => `
    <tr>
      <td style="text-align: center;">${idx + 1}</td>
      <td>
        <strong>${escapeHtml(it.product)}</strong>
        <div style="font-size: 11px; color: #555;">Spec: ${escapeHtml(it.grade || 'Sortex Clean')} &bull; Pkg: ${escapeHtml(it.packaging || '25kg Bags')}</div>
      </td>
      <td style="text-align: center;">${it.quantity} MT</td>
      <td style="text-align: right;">$${Number(it.ratePerUnitUSD).toLocaleString()}</td>
      <td style="text-align: right; font-weight: bold;">$${Number(it.totalAmountUSD).toLocaleString()}</td>
    </tr>
  `).join('');

  container.innerHTML = `
    <!-- Letterhead -->
    <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #000; padding-bottom: 14px; margin-bottom: 18px;">
      <div>
        <h1 style="font-family: 'Marcellus', serif; font-size: 24px; color: #111; margin: 0; text-transform: uppercase; letter-spacing: 1px;">
          ${escapeHtml(cfg.companyName)}
        </h1>
        <div style="font-size: 11px; font-weight: 700; color: #666; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px;">
          ${escapeHtml(cfg.division)}
        </div>
        <div style="font-size: 11px; color: #444; margin-top: 4px; max-width: 440px;">
          ${escapeHtml(cfg.corporateAddress)}
        </div>
        <div style="font-size: 11px; color: #222; margin-top: 4px; font-weight: 600;">
          IEC: ${escapeHtml(cfg.iecNumber)} &bull; APEDA: ${escapeHtml(cfg.apedaRegistration)} &bull; GSTIN: ${escapeHtml(cfg.gstin)}
        </div>
      </div>
      <div style="text-align: right;">
        <div style="background: #000; color: #fff; padding: 4px 12px; font-size: 14px; font-weight: 800; letter-spacing: 1px; display: inline-block;">
          PROFORMA INVOICE
        </div>
        <div style="font-size: 14px; font-weight: 800; color: #b8860b; margin-top: 6px; font-family: monospace;">
          ${escapeHtml(quote.id)}
        </div>
        <div style="font-size: 11px; color: #555; margin-top: 2px;">
          <strong>Date:</strong> ${issueDate}
        </div>
        <div style="font-size: 11px; color: #b8860b; margin-top: 2px;">
          <strong>Validity:</strong> ${validUntil}
        </div>
      </div>
    </div>

    <!-- Consignee & Shipping Grid -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 18px; font-size: 11.5px; background: #fdfdfd; padding: 12px; border: 1px solid #e0e0e0;">
      <div>
        <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #888; margin-bottom: 4px;">CONSIGNEE / BUYER (APPLICANT):</div>
        <div style="font-size: 13px; font-weight: 700; color: #000;">${escapeHtml(quote.buyerCompany || quote.buyerName)}</div>
        <div style="color: #333;">Attn: ${escapeHtml(quote.buyerName)}</div>
        <div style="color: #444;">${escapeHtml(quote.country)}</div>
        <div style="color: #444;">Email: ${escapeHtml(quote.buyerEmail || '—')} &bull; Tel: ${escapeHtml(quote.buyerPhone || '—')}</div>
      </div>
      <div>
        <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #888; margin-bottom: 4px;">SHIPMENT &amp; TRADE TERMS:</div>
        <div style="color: #222;"><strong>Incoterm (2020):</strong> ${escapeHtml(quote.incoterm || 'CIF')} — ${escapeHtml(quote.portOfDischarge)}</div>
        <div style="color: #222;"><strong>Port of Loading:</strong> ${escapeHtml(quote.portOfLoading || 'Nhava Sheva (JNPT, Mumbai)')}</div>
        <div style="color: #222;"><strong>Container Allocation:</strong> ${escapeHtml(quote.containerType || '1x 20ft FCL')}</div>
        <div style="color: #222;"><strong>Payment Terms:</strong> ${escapeHtml(quote.paymentTerms)}</div>
      </div>
    </div>

    <!-- Commercial Items Table -->
    <table style="width: 100%; border-collapse: collapse; font-size: 11.5px; margin-bottom: 14px;">
      <thead>
        <tr style="background: #f0f0f0; border-top: 1px solid #000; border-bottom: 1px solid #000;">
          <th style="padding: 7px; text-align: center; width: 5%;">#</th>
          <th style="padding: 7px; text-align: left; width: 45%;">Commodity Description &amp; Export Grade</th>
          <th style="padding: 7px; text-align: center; width: 15%;">Quantity</th>
          <th style="padding: 7px; text-align: right; width: 15%;">Unit Rate (USD)</th>
          <th style="padding: 7px; text-align: right; width: 20%;">Total Amount (USD)</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
      <tfoot>
        <tr style="border-top: 1px solid #ccc;">
          <td colspan="4" style="text-align: right; padding: 6px; font-weight: 600;">Items FOB Subtotal:</td>
          <td style="text-align: right; padding: 6px; font-weight: bold;">$${Number(quote.subtotalUSD || 0).toLocaleString()}</td>
        </tr>
        <tr>
          <td colspan="4" style="text-align: right; padding: 4px 6px; color: #555;">Ocean Freight Surcharge:</td>
          <td style="text-align: right; padding: 4px 6px;">$${Number(quote.freightChargesUSD || 0).toLocaleString()}</td>
        </tr>
        <tr>
          <td colspan="4" style="text-align: right; padding: 4px 6px; color: #555;">Marine Cargo All-Risk Insurance:</td>
          <td style="text-align: right; padding: 4px 6px;">$${Number(quote.insuranceUSD || 0).toLocaleString()}</td>
        </tr>
        <tr style="border-top: 2px solid #000; border-bottom: 2px solid #000; background: #fafafa;">
          <td colspan="4" style="text-align: right; padding: 8px; font-size: 13px; font-weight: 800; text-transform: uppercase;">Total Contract Value (USD):</td>
          <td style="text-align: right; padding: 8px; font-size: 14px; font-weight: 800; color: #b8860b;">$${Number(quote.totalAmountUSD || 0).toLocaleString()}</td>
        </tr>
      </tfoot>
    </table>

    <!-- Wire & Bank Instructions -->
    <div style="display: grid; grid-template-columns: 1.3fr 1fr; gap: 20px; font-size: 11px; margin-top: 14px; border-top: 1px solid #ddd; padding-top: 12px;">
      <div>
        <div style="font-size: 10.5px; font-weight: 800; text-transform: uppercase; color: #000; margin-bottom: 4px;">OFFICIAL INWARD REMITTANCE BANK COORDINATES:</div>
        <div style="color: #333;"><strong>Bank Name:</strong> ${escapeHtml(cfg.bankName)}</div>
        <div style="color: #333;"><strong>SWIFT / BIC Code:</strong> <span style="font-family: monospace; font-weight: 700;">${escapeHtml(cfg.swiftCode)}</span></div>
        <div style="color: #333;"><strong>Account Beneficiary:</strong> ${escapeHtml(cfg.accountName)}</div>
        <div style="color: #333;"><strong>Export A/C Number:</strong> <span style="font-family: monospace; font-weight: 700;">${escapeHtml(cfg.accountNumber)}</span></div>
        <div style="margin-top: 6px; color: #666; font-size: 10px;">* Please quote Proforma Invoice number in wire transfer payment remarks.</div>
      </div>
      <div style="text-align: right; display: flex; flex-direction: column; justify-content: flex-end; align-items: flex-end;">
        <div style="border-top: 1px solid #333; width: 190px; text-align: center; padding-top: 6px; margin-top: 40px;">
          <div style="font-size: 11px; font-weight: 700; color: #000;">Authorized Signatory</div>
          <div style="font-size: 10px; color: #666;">For ${escapeHtml(cfg.companyName)}</div>
        </div>
      </div>
    </div>
  `;

  openModal('modal-pi-preview');
}

// =============================================================================
// 4. OVERSEAS BUYERS & CUSTOMERS
// =============================================================================
async function loadCustomers() {
  try {
    const res = await fetch('/api/crm/customers');
    if (!res.ok) return;
    const data = await res.json();
    crmData.customers = data.customers || [];
    renderCustomersTable();
  } catch (err) {
    console.error('Error loading customers:', err);
  }
}

function renderCustomersTable() {
  const tbody = document.getElementById('customers-table-tbody');
  if (!tbody) return;

  const searchInput = document.getElementById('customers-search-input');
  const searchVal = searchInput ? searchInput.value.toLowerCase().trim() : '';

  let filtered = crmData.customers.filter(c => {
    const textBlob = `${c.id} ${c.company} ${c.name} ${c.country} ${c.primaryPort} ${c.email} ${c.phone}`.toLowerCase();
    return !searchVal || textBlob.includes(searchVal);
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="10" style="text-align: center; padding: 48px; color: var(--crm-text-muted);">
          No buyer accounts logged yet. Buyers are automatically recorded here when you generate a Proforma Invoice, or you can add one manually.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(c => `
    <tr>
      <td><span style="font-family: monospace; font-size: 11px; color: var(--crm-gold);">${c.id}</span></td>
      <td><strong style="color: #fff; font-size: 13px;">${escapeHtml(c.company)}</strong></td>
      <td>${escapeHtml(c.name)}</td>
      <td>${escapeHtml(c.country)}</td>
      <td>${escapeHtml(c.primaryPort || '—')}</td>
      <td>
        <div style="font-size: 11.5px; color: #ddd;">${escapeHtml(c.email || '—')}</div>
        <div style="font-size: 11px; color: var(--crm-text-muted);">${escapeHtml(c.phone || '')}</div>
      </td>
      <td><span style="font-size: 11px; color: var(--crm-text-muted);">${escapeHtml(c.businessType || 'Importer')}</span></td>
      <td style="font-size: 11px; color: #aaa;">${escapeHtml(c.paymentTermsPreference || 'T/T against BL')}</td>
      <td><span class="crm-badge crm-badge-emerald">${escapeHtml(c.status || 'Active')}</span></td>
      <td>
        <button class="crm-btn crm-btn-danger crm-btn-sm" onclick="deleteCustomer('${c.id}')">🗑️</button>
      </td>
    </tr>
  `).join('');
}

function openNewCustomerModal() {
  document.getElementById('form-customer').reset();
  openModal('modal-customer');
}

async function handleCreateCustomer(event) {
  event.preventDefault();
  const payload = {
    company: document.getElementById('cust-company').value,
    name: document.getElementById('cust-name').value,
    email: document.getElementById('cust-email').value,
    phone: document.getElementById('cust-phone').value,
    country: document.getElementById('cust-country').value,
    primaryPort: document.getElementById('cust-port').value,
    businessType: document.getElementById('cust-businessType').value,
    taxId: document.getElementById('cust-taxId').value
  };

  try {
    const res = await fetch('/api/crm/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      closeModal('modal-customer');
      await refreshAllCrmData();
    } else {
      const err = await res.json();
      alert(err.message || 'Failed to save buyer');
    }
  } catch (err) {
    console.error('Error creating customer:', err);
  }
}

async function deleteCustomer(id) {
  if (!confirm(`Delete buyer record ${id}?`)) return;
  try {
    const res = await fetch(`/api/crm/customers/${id}`, { method: 'DELETE' });
    if (res.ok) {
      crmData.customers = crmData.customers.filter(c => c.id !== id);
      renderCustomersTable();
      loadStats();
    }
  } catch (err) {
    console.error('Error deleting customer:', err);
  }
}

// =============================================================================
// 5. SHIPMENTS & CONTAINER LOGISTICS
// =============================================================================
async function loadShipments() {
  try {
    const res = await fetch('/api/crm/shipments');
    if (!res.ok) return;
    const data = await res.json();
    crmData.shipments = data.shipments || [];
    renderShipmentsTable();
  } catch (err) {
    console.error('Error loading shipments:', err);
  }
}

function renderShipmentsTable() {
  const tbody = document.getElementById('shipments-table-tbody');
  if (!tbody) return;

  const searchInput = document.getElementById('shipments-search-input');
  const searchVal = searchInput ? searchInput.value.toLowerCase().trim() : '';

  let filtered = crmData.shipments.filter(s => {
    const textBlob = `${s.id} ${s.bookingNumber} ${s.containerNumber} ${s.buyerCompany} ${s.loadingPort} ${s.destinationPort} ${s.blNumber}`.toLowerCase();
    return !searchVal || textBlob.includes(searchVal);
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="10" style="text-align: center; padding: 48px; color: var(--crm-text-muted);">
          No container bookings logged yet. Click "+ Log New Container Booking" above to track export container dispatches.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(shp => `
    <tr>
      <td>
        <strong style="font-family: monospace; color: var(--crm-gold); font-size: 12px;">${escapeHtml(shp.bookingNumber)}</strong>
        <div style="font-size: 11px; color: var(--crm-text-muted);">${shp.id}</div>
      </td>
      <td><span style="font-family: monospace; font-size: 12px; color: #fff;">${escapeHtml(shp.containerNumber || 'TBA')}</span></td>
      <td>
        <div style="font-weight: 600; color: #fff; font-size: 12px;">${escapeHtml(shp.shippingLine)}</div>
        <div style="font-size: 11px; color: var(--crm-text-muted);">${escapeHtml(shp.vesselName || 'TBA Vessel')}</div>
      </td>
      <td><strong>${escapeHtml(shp.buyerCompany)}</strong></td>
      <td>
        <div style="font-size: 12px; color: #fff;">${escapeHtml(shp.loadingPort)}</div>
        <div style="font-size: 11px; color: var(--crm-gold);">↓ to ${escapeHtml(shp.destinationPort)}</div>
      </td>
      <td>
        <div style="font-size: 12px; color: #ddd;">${escapeHtml(shp.commoditiesDescription || 'Commodities')}</div>
        <div style="font-size: 11px; color: var(--crm-text-muted);">${shp.netWeightMT || 20} MT Payload</div>
      </td>
      <td style="font-size: 11.5px; white-space: nowrap;">
        <div>ETD: ${shp.etd || '—'}</div>
        <div style="color: var(--crm-text-muted);">ETA: ${shp.eta || '—'}</div>
      </td>
      <td><span style="font-family: monospace; font-size: 11px; color: #aaa;">${escapeHtml(shp.blNumber || 'Draft')}</span></td>
      <td>
        <select class="crm-select" style="font-size: 11px; padding: 4px 8px;" onchange="updateShipmentStatus('${shp.id}', this.value)">
          <option value="Booking Confirmed" ${shp.status === 'Booking Confirmed' ? 'selected' : ''}>Booking Confirmed</option>
          <option value="Mandi Procured" ${shp.status === 'Mandi Procured' ? 'selected' : ''}>Mandi Procured</option>
          <option value="Sortex Lab Passed" ${shp.status === 'Sortex Lab Passed' ? 'selected' : ''}>Sortex Lab Passed</option>
          <option value="Stuffing at CFS" ${shp.status === 'Stuffing at CFS' ? 'selected' : ''}>Stuffing at CFS</option>
          <option value="Vessel In-Transit" ${shp.status === 'Vessel In-Transit' ? 'selected' : ''}>Vessel In-Transit</option>
          <option value="Arrived at Destination" ${shp.status === 'Arrived at Destination' ? 'selected' : ''}>Arrived Destination</option>
          <option value="Delivered" ${shp.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
        </select>
      </td>
      <td>
        <button class="crm-btn crm-btn-danger crm-btn-sm" onclick="deleteShipment('${shp.id}')">🗑️</button>
      </td>
    </tr>
  `).join('');
}

function openNewShipmentModal() {
  document.getElementById('form-shipment').reset();
  openModal('modal-shipment');
}

async function handleCreateShipment(event) {
  event.preventDefault();
  const payload = {
    bookingNumber: document.getElementById('shp-bookingNumber').value,
    containerNumber: document.getElementById('shp-containerNumber').value,
    shippingLine: document.getElementById('shp-shippingLine').value,
    buyerCompany: document.getElementById('shp-buyerCompany').value,
    loadingPort: document.getElementById('shp-loadingPort').value,
    destinationPort: document.getElementById('shp-destinationPort').value,
    etd: document.getElementById('shp-etd').value,
    eta: document.getElementById('shp-eta').value,
    commoditiesDescription: document.getElementById('shp-commoditiesDescription').value,
    netWeightMT: parseFloat(document.getElementById('shp-netWeightMT').value) || 20,
    status: document.getElementById('shp-status').value
  };

  try {
    const res = await fetch('/api/crm/shipments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      closeModal('modal-shipment');
      await refreshAllCrmData();
    } else {
      const err = await res.json();
      alert(err.message || 'Failed to save booking');
    }
  } catch (err) {
    console.error('Error creating shipment:', err);
  }
}

async function updateShipmentStatus(id, newStatus) {
  try {
    const res = await fetch(`/api/crm/shipments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    if (res.ok) {
      const idx = crmData.shipments.findIndex(s => s.id === id);
      if (idx !== -1) crmData.shipments[idx].status = newStatus;
      loadStats();
    }
  } catch (err) {
    console.error('Error updating shipment status:', err);
  }
}

async function deleteShipment(id) {
  if (!confirm(`Delete shipment booking ${id}?`)) return;
  try {
    const res = await fetch(`/api/crm/shipments/${id}`, { method: 'DELETE' });
    if (res.ok) {
      crmData.shipments = crmData.shipments.filter(s => s.id !== id);
      renderShipmentsTable();
      loadStats();
    }
  } catch (err) {
    console.error('Error deleting shipment:', err);
  }
}

// =============================================================================
// 6. MANDI SOURCING
// =============================================================================
async function loadMandiLots() {
  try {
    const res = await fetch('/api/crm/mandi');
    if (!res.ok) return;
    const data = await res.json();
    crmData.mandi = data.lots || [];
    renderMandiTable();
  } catch (err) {
    console.error('Error loading mandi lots:', err);
  }
}

function renderMandiTable() {
  const tbody = document.getElementById('mandi-table-tbody');
  if (!tbody) return;

  const searchInput = document.getElementById('mandi-search-input');
  const searchVal = searchInput ? searchInput.value.toLowerCase().trim() : '';

  let filtered = crmData.mandi.filter(m => {
    const textBlob = `${m.id} ${m.mandiHub} ${m.commodity} ${m.brokerName}`.toLowerCase();
    return !searchVal || textBlob.includes(searchVal);
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="10" style="text-align: center; padding: 48px; color: var(--crm-text-muted);">
          No mandi purchase lots logged. Record farmgate purchases directly from APMC Unjha, Guntur, Nizamabad, or Rajkot.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(lot => `
    <tr>
      <td><span style="font-family: monospace; font-size: 11px; color: var(--crm-gold);">${lot.id}</span></td>
      <td style="font-size: 11.5px; color: var(--crm-text-muted);">${lot.date || '—'}</td>
      <td><strong style="color: #fff; font-size: 12.5px;">${escapeHtml(lot.mandiHub)}</strong></td>
      <td>${escapeHtml(lot.commodity)}</td>
      <td><span class="crm-badge crm-badge-gold" style="font-size: 11px;">${escapeHtml(lot.varietyGrade || 'Standard')}</span></td>
      <td><strong>${lot.quantityMT || 0} MT</strong></td>
      <td><span style="color: var(--crm-emerald); font-weight: 700;">₹${Number(lot.purchasePriceINRPerQuintal || 0).toLocaleString()}</span> / Qtl</td>
      <td style="font-size: 12px; color: #ddd;">${escapeHtml(lot.brokerName || 'Direct APMC')}</td>
      <td>
        <select class="crm-select" style="font-size: 11px; padding: 4px 8px;" onchange="updateMandiStatus('${lot.id}', this.value)">
          <option value="Procured at Mandi" ${lot.status === 'Procured at Mandi' ? 'selected' : ''}>Procured at Mandi</option>
          <option value="In-Transit to Warehouse" ${lot.status === 'In-Transit to Warehouse' ? 'selected' : ''}>In-Transit Warehouse</option>
          <option value="Sortex Cleaning in Progress" ${lot.status === 'Sortex Cleaning in Progress' ? 'selected' : ''}>Sortex Cleaning</option>
          <option value="Bagged & Quality Certified" ${lot.status === 'Bagged & Quality Certified' ? 'selected' : ''}>Quality Certified</option>
        </select>
      </td>
      <td>
        <button class="crm-btn crm-btn-danger crm-btn-sm" onclick="deleteMandiLot('${lot.id}')">🗑️</button>
      </td>
    </tr>
  `).join('');
}

function openNewMandiModal() {
  document.getElementById('form-mandi').reset();
  openModal('modal-mandi');
}

async function handleCreateMandi(event) {
  event.preventDefault();
  const payload = {
    mandiHub: document.getElementById('mnd-mandiHub').value,
    commodity: document.getElementById('mnd-commodity').value,
    varietyGrade: document.getElementById('mnd-varietyGrade').value,
    quantityMT: parseFloat(document.getElementById('mnd-quantityMT').value) || 10,
    purchasePriceINRPerQuintal: parseFloat(document.getElementById('mnd-purchasePriceINRPerQuintal').value) || 0,
    brokerName: document.getElementById('mnd-brokerName').value,
    status: document.getElementById('mnd-status').value
  };

  try {
    const res = await fetch('/api/crm/mandi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      closeModal('modal-mandi');
      await refreshAllCrmData();
    } else {
      const err = await res.json();
      alert(err.message || 'Failed to save mandi lot');
    }
  } catch (err) {
    console.error('Error creating mandi lot:', err);
  }
}

async function updateMandiStatus(id, newStatus) {
  try {
    await fetch(`/api/crm/mandi/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
  } catch (err) {
    console.error('Error updating mandi status:', err);
  }
}

async function deleteMandiLot(id) {
  if (!confirm(`Delete mandi purchase lot ${id}?`)) return;
  try {
    const res = await fetch(`/api/crm/mandi/${id}`, { method: 'DELETE' });
    if (res.ok) {
      crmData.mandi = crmData.mandi.filter(m => m.id !== id);
      renderMandiTable();
    }
  } catch (err) {
    console.error('Error deleting lot:', err);
  }
}

// =============================================================================
// 7. COURIER SAMPLE DISPATCH
// =============================================================================
async function loadSamples() {
  try {
    const res = await fetch('/api/crm/samples');
    if (!res.ok) return;
    const data = await res.json();
    crmData.samples = data.samples || [];
    renderSamplesTable();
  } catch (err) {
    console.error('Error loading samples:', err);
  }
}

function renderSamplesTable() {
  const tbody = document.getElementById('samples-table-tbody');
  if (!tbody) return;

  const searchInput = document.getElementById('samples-search-input');
  const searchVal = searchInput ? searchInput.value.toLowerCase().trim() : '';

  let filtered = crmData.samples.filter(s => {
    const textBlob = `${s.id} ${s.recipientName} ${s.company} ${s.country} ${s.awbNumber}`.toLowerCase();
    return !searchVal || textBlob.includes(searchVal);
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" style="text-align: center; padding: 48px; color: var(--crm-text-muted);">
          No courier sample dispatches logged. When international buyers request samples on the website, they stream directly here.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(smp => {
    const itemsStr = Array.isArray(smp.items) ? smp.items.join(', ') : (smp.items || 'Agri Sample Pack');
    return `
      <tr>
        <td><span style="font-family: monospace; font-size: 11px; color: var(--crm-gold);">${smp.id}</span></td>
        <td style="font-size: 11.5px; color: var(--crm-text-muted);">${smp.dispatchDate || '—'}</td>
        <td>
          <strong style="color: #fff; font-size: 13px;">${escapeHtml(smp.recipientName)}</strong>
          <div style="font-size: 11px; color: var(--crm-text-muted);">${escapeHtml(smp.company || '')}</div>
        </td>
        <td>${escapeHtml(smp.country)}</td>
        <td>
          <div style="max-width: 240px; font-size: 12px; color: #ddd; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
            ${escapeHtml(itemsStr)}
          </div>
        </td>
        <td><span class="crm-badge crm-badge-gold" style="font-size: 11px;">${escapeHtml(smp.courierService || 'DHL Express')}</span></td>
        <td><span style="font-family: monospace; font-size: 12px; color: #fff;">${escapeHtml(smp.awbNumber || 'Pending')}</span></td>
        <td>
          <select class="crm-select" style="font-size: 11px; padding: 4px 8px;" onchange="updateSampleStatus('${smp.id}', this.value)">
            <option value="Dispatched" ${smp.status === 'Dispatched' ? 'selected' : ''}>Dispatched</option>
            <option value="In-Transit" ${smp.status === 'In-Transit' ? 'selected' : ''}>In-Transit</option>
            <option value="Delivered to Buyer" ${smp.status === 'Delivered to Buyer' ? 'selected' : ''}>Delivered</option>
            <option value="Approved for FCL Order" ${smp.status === 'Approved for FCL Order' ? 'selected' : ''}>Sample Approved</option>
          </select>
        </td>
        <td>
          <button class="crm-btn crm-btn-danger crm-btn-sm" onclick="deleteSample('${smp.id}')">🗑️</button>
        </td>
      </tr>
    `;
  }).join('');
}

function openNewSampleModal() {
  document.getElementById('form-sample').reset();
  openModal('modal-sample');
}

async function handleCreateSample(event) {
  event.preventDefault();
  const payload = {
    recipientName: document.getElementById('smp-recipientName').value,
    company: document.getElementById('smp-company').value,
    country: document.getElementById('smp-country').value,
    courierService: document.getElementById('smp-courierService').value,
    awbNumber: document.getElementById('smp-awbNumber').value,
    items: document.getElementById('smp-items').value
  };

  try {
    const res = await fetch('/api/crm/samples', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      closeModal('modal-sample');
      await refreshAllCrmData();
    } else {
      const err = await res.json();
      alert(err.message || 'Failed to dispatch sample');
    }
  } catch (err) {
    console.error('Error creating sample:', err);
  }
}

async function updateSampleStatus(id, newStatus) {
  try {
    await fetch(`/api/crm/samples/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
  } catch (err) {
    console.error('Error updating sample status:', err);
  }
}

async function deleteSample(id) {
  if (!confirm(`Delete sample record ${id}?`)) return;
  try {
    const res = await fetch(`/api/crm/samples/${id}`, { method: 'DELETE' });
    if (res.ok) {
      crmData.samples = crmData.samples.filter(s => s.id !== id);
      renderSamplesTable();
    }
  } catch (err) {
    console.error('Error deleting sample:', err);
  }
}

// =============================================================================
// 8. EXPORT CONFIGURATION
// =============================================================================
async function loadExportConfig() {
  try {
    const res = await fetch('/api/crm/config');
    if (!res.ok) return;
    const { config } = await res.json();
    crmData.config = config;

    if (config) {
      document.getElementById('cfg-companyName').value = config.companyName || '';
      document.getElementById('cfg-division').value = config.division || '';
      document.getElementById('cfg-iecNumber').value = config.iecNumber || '';
      document.getElementById('cfg-apedaRegistration').value = config.apedaRegistration || '';
      document.getElementById('cfg-spicesBoardLicense').value = config.spicesBoardLicense || '';
      document.getElementById('cfg-gstin').value = config.gstin || '';
      document.getElementById('cfg-corporateAddress').value = config.corporateAddress || '';
      document.getElementById('cfg-bankName').value = config.bankName || '';
      document.getElementById('cfg-swiftCode').value = config.swiftCode || '';
      document.getElementById('cfg-accountName').value = config.accountName || '';
      document.getElementById('cfg-accountNumber').value = config.accountNumber || '';
    }
  } catch (err) {
    console.error('Error loading export config:', err);
  }
}

async function saveExportConfig() {
  const payload = {
    companyName: document.getElementById('cfg-companyName').value,
    division: document.getElementById('cfg-division').value,
    iecNumber: document.getElementById('cfg-iecNumber').value,
    apedaRegistration: document.getElementById('cfg-apedaRegistration').value,
    spicesBoardLicense: document.getElementById('cfg-spicesBoardLicense').value,
    gstin: document.getElementById('cfg-gstin').value,
    corporateAddress: document.getElementById('cfg-corporateAddress').value,
    bankName: document.getElementById('cfg-bankName').value,
    swiftCode: document.getElementById('cfg-swiftCode').value,
    accountName: document.getElementById('cfg-accountName').value,
    accountNumber: document.getElementById('cfg-accountNumber').value
  };

  try {
    const res = await fetch('/api/crm/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      const data = await res.json();
      crmData.config = data.config;
      alert('Official Indian Export Profile coordinates updated successfully!');
    }
  } catch (err) {
    console.error('Error saving export config:', err);
  }
}

// =============================================================================
// MODAL & UTILITY HELPERS
// =============================================================================
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

// Close on backdrop click
document.addEventListener('click', (e) => {
  if (e.target.classList && e.target.classList.contains('crm-modal-backdrop')) {
    e.target.classList.remove('active');
  }
});

function getStatusBadge(status) {
  const s = (status || '').toLowerCase();
  if (s.includes('new') || s.includes('received')) {
    return `<span class="crm-badge crm-badge-gold">● ${escapeHtml(status)}</span>`;
  }
  if (s.includes('contacted') || s.includes('reviewing') || s.includes('negotiation') || s.includes('issued')) {
    return `<span class="crm-badge crm-badge-amber">● ${escapeHtml(status)}</span>`;
  }
  if (s.includes('contract') || s.includes('accepted') || s.includes('signed') || s.includes('delivered') || s.includes('approved')) {
    return `<span class="crm-badge crm-badge-emerald">✓ ${escapeHtml(status)}</span>`;
  }
  if (s.includes('declined') || s.includes('archived')) {
    return `<span class="crm-badge crm-badge-red">✕ ${escapeHtml(status)}</span>`;
  }
  return `<span class="crm-badge crm-badge-blue">● ${escapeHtml(status)}</span>`;
}

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

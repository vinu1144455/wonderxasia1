const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, 'data');

function readJson(file) {
  try {
    const raw = fs.readFileSync(path.join(dataDir, file), 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

function writeJson(file, data) {
  try {
    fs.writeFileSync(path.join(dataDir, file), JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error(`Error saving ${file}:`, err);
    return false;
  }
}

// ==========================================
// 1. CRM EXECUTIVE STATS & OVERVIEW
// ==========================================
router.get('/api/crm/stats', (req, res) => {
  const inquiries = readJson('inquiries.json');
  const quotations = readJson('quotations.json');
  const customers = readJson('customers.json');
  const shipments = readJson('shipments.json');
  const mandiLots = readJson('mandi_procurement.json');
  const samples = readJson('sample_requests.json');

  const newLeads = inquiries.filter(i => !i.status || i.status.includes('Received') || i.status.includes('New'));
  const activeQuotes = quotations.filter(q => q.status === 'Issued' || q.status === 'Negotiation');
  const inTransitShipments = shipments.filter(s => s.status === 'Vessel In-Transit' || s.status === 'Stuffing at CFS');
  
  const pipelineValueUSD = quotations.reduce((sum, q) => sum + (Number(q.totalAmountUSD) || 0), 0);

  // Commodity demand tally
  const commodityMap = {};
  inquiries.forEach(i => {
    const prods = Array.isArray(i.products) ? i.products : [i.products || 'General Inquiries'];
    prods.forEach(p => {
      const name = typeof p === 'string' ? p : (p && p.name ? p.name : 'Indian Spices');
      commodityMap[name] = (commodityMap[name] || 0) + 1;
    });
  });

  const topCommodities = Object.entries(commodityMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([commodity, count]) => ({ commodity, count }));

  res.json({
    success: true,
    stats: {
      totalInquiries: inquiries.length,
      newLeadsCount: newLeads.length,
      totalQuotations: quotations.length,
      activeQuotesCount: activeQuotes.length,
      pipelineValueUSD,
      totalCustomers: customers.length,
      totalShipments: shipments.length,
      inTransitCount: inTransitShipments.length,
      totalMandiLots: mandiLots.length,
      totalSamples: samples.length,
      topCommodities
    }
  });
});

// ==========================================
// 2. INQUIRIES & LEADS MANAGEMENT
// ==========================================
router.get('/api/crm/inquiries', (req, res) => {
  let inquiries = readJson('inquiries.json');
  const { status, search } = req.query;

  if (status && status !== 'all') {
    inquiries = inquiries.filter(i => i.status === status);
  }

  if (search) {
    const q = search.toLowerCase();
    inquiries = inquiries.filter(i => 
      (i.name && i.name.toLowerCase().includes(q)) ||
      (i.company && i.company.toLowerCase().includes(q)) ||
      (i.email && i.email.toLowerCase().includes(q)) ||
      (i.phone && i.phone.toLowerCase().includes(q)) ||
      (i.country && i.country.toLowerCase().includes(q)) ||
      (i.id && i.id.toLowerCase().includes(q))
    );
  }

  res.json({ success: true, count: inquiries.length, inquiries });
});

router.post('/api/crm/inquiries', (req, res) => {
  const { name, company, email, phone, country, port, subject, message, targetQuantity, incoterm } = req.body;

  if (!name || (!email && !phone)) {
    return res.status(400).json({ success: false, message: 'Lead Name and Email or Phone are required.' });
  }

  const inquiries = readJson('inquiries.json');
  const id = `WXA-LEAD-${Math.floor(1000 + Math.random() * 9000)}`;

  const newLead = {
    id,
    timestamp: new Date().toISOString(),
    name: name.trim(),
    company: (company || 'Independent Importer').trim(),
    email: (email || '').trim(),
    phone: (phone || '').trim(),
    country: (country || 'International').trim(),
    port: (port || 'Not specified').trim(),
    subject: subject || 'Product Enquiry',
    message: (message || '').trim(),
    targetQuantity: targetQuantity || 'Per trial specification',
    incoterm: incoterm || 'FOB / CIF',
    status: 'New Lead',
    notes: []
  };

  inquiries.unshift(newLead);
  writeJson('inquiries.json', inquiries);

  res.status(201).json({ success: true, lead: newLead });
});

router.put('/api/crm/inquiries/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const inquiries = readJson('inquiries.json');
  const index = inquiries.findIndex(i => i.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Inquiry not found.' });
  }

  if (updates.note) {
    const notes = inquiries[index].notes || [];
    notes.push({
      timestamp: new Date().toISOString(),
      text: updates.note
    });
    updates.notes = notes;
    delete updates.note;
  }

  inquiries[index] = { ...inquiries[index], ...updates };
  writeJson('inquiries.json', inquiries);

  res.json({ success: true, inquiry: inquiries[index] });
});

router.delete('/api/crm/inquiries/:id', (req, res) => {
  const { id } = req.params;
  let inquiries = readJson('inquiries.json');
  const initialLen = inquiries.length;
  inquiries = inquiries.filter(i => i.id !== id);

  if (inquiries.length === initialLen) {
    return res.status(404).json({ success: false, message: 'Inquiry not found.' });
  }

  writeJson('inquiries.json', inquiries);
  res.json({ success: true, message: 'Inquiry deleted successfully.' });
});

// ==========================================
// 3. PROFORMA INVOICES & QUOTATIONS
// ==========================================
router.get('/api/crm/quotations', (req, res) => {
  const quotations = readJson('quotations.json');
  res.json({ success: true, count: quotations.length, quotations });
});

router.post('/api/crm/quotations', (req, res) => {
  const {
    buyerName,
    buyerCompany,
    buyerEmail,
    buyerPhone,
    buyerAddress,
    country,
    portOfLoading,
    portOfDischarge,
    incoterm,
    paymentTerms,
    validityDays,
    containerType,
    items,
    freightChargesUSD,
    insuranceUSD,
    specialTerms
  } = req.body;

  if (!buyerName || !items || !items.length) {
    return res.status(400).json({ success: false, message: 'Buyer name and at least one line item are required.' });
  }

  const quotations = readJson('quotations.json');
  const piNumber = `WXA-PI-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  // Calculate items totals
  const processedItems = items.map(item => {
    const qty = Number(item.quantity) || 1;
    const rate = Number(item.ratePerUnitUSD) || 0;
    const amount = qty * rate;
    return {
      product: item.product || 'Agri Commodity',
      grade: item.grade || 'Export Standard Sortex',
      packaging: item.packaging || '25kg PP Bags with Liner',
      quantity: qty,
      unit: item.unit || 'Metric Tonnes',
      ratePerUnitUSD: rate,
      totalAmountUSD: amount
    };
  });

  const subtotalUSD = processedItems.reduce((acc, it) => acc + it.totalAmountUSD, 0);
  const freight = Number(freightChargesUSD) || 0;
  const insurance = Number(insuranceUSD) || 0;
  const totalAmountUSD = subtotalUSD + freight + insurance;

  const newQuote = {
    id: piNumber,
    date: new Date().toISOString(),
    validUntil: new Date(Date.now() + (Number(validityDays) || 7) * 24 * 60 * 60 * 1000).toISOString(),
    buyerName: buyerName.trim(),
    buyerCompany: (buyerCompany || 'Consignee').trim(),
    buyerEmail: (buyerEmail || '').trim(),
    buyerPhone: (buyerPhone || '').trim(),
    buyerAddress: (buyerAddress || '').trim(),
    country: (country || 'International').trim(),
    portOfLoading: portOfLoading || 'Nhava Sheva (JNPT, Mumbai)',
    portOfDischarge: portOfDischarge || 'Destination Port',
    incoterm: incoterm || 'CIF',
    paymentTerms: paymentTerms || '30% Advance T/T, 70% against Scanned B/L Copy',
    containerType: containerType || '1x 20ft FCL (Approx 18-20 MT)',
    items: processedItems,
    subtotalUSD,
    freightChargesUSD: freight,
    insuranceUSD: insurance,
    totalAmountUSD,
    specialTerms: specialTerms || 'Pre-shipment SGS / Geo-Chem Inspection Certificate included.',
    status: 'Issued'
  };

  quotations.unshift(newQuote);
  writeJson('quotations.json', quotations);

  // Auto-sync or create buyer in customers directory if not exists
  const customers = readJson('customers.json');
  if (buyerCompany && !customers.some(c => c.company.toLowerCase() === buyerCompany.toLowerCase())) {
    customers.push({
      id: `WXA-CUST-${Math.floor(1000 + Math.random() * 9000)}`,
      name: buyerName,
      company: buyerCompany,
      email: buyerEmail,
      phone: buyerPhone,
      country: country,
      primaryPort: portOfDischarge,
      status: 'Active Prospect',
      createdAt: new Date().toISOString()
    });
    writeJson('customers.json', customers);
  }

  res.status(201).json({ success: true, quotation: newQuote });
});

router.put('/api/crm/quotations/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const quotations = readJson('quotations.json');
  const index = quotations.findIndex(q => q.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Quotation not found.' });
  }

  quotations[index] = { ...quotations[index], ...updates };
  writeJson('quotations.json', quotations);

  res.json({ success: true, quotation: quotations[index] });
});

router.delete('/api/crm/quotations/:id', (req, res) => {
  const { id } = req.params;
  let quotations = readJson('quotations.json');
  const initialLen = quotations.length;
  quotations = quotations.filter(q => q.id !== id);

  if (quotations.length === initialLen) {
    return res.status(404).json({ success: false, message: 'Quotation not found.' });
  }

  writeJson('quotations.json', quotations);
  res.json({ success: true, message: 'Quotation deleted successfully.' });
});

// ==========================================
// 4. OVERSEAS BUYERS & CUSTOMERS DIRECTORY
// ==========================================
router.get('/api/crm/customers', (req, res) => {
  const customers = readJson('customers.json');
  res.json({ success: true, count: customers.length, customers });
});

router.post('/api/crm/customers', (req, res) => {
  const { name, company, email, phone, country, primaryPort, businessType, taxId, paymentTermsPreference } = req.body;

  if (!company || !name) {
    return res.status(400).json({ success: false, message: 'Company Name and Contact Person are required.' });
  }

  const customers = readJson('customers.json');
  const id = `WXA-CUST-${Math.floor(1000 + Math.random() * 9000)}`;

  const newCustomer = {
    id,
    name: name.trim(),
    company: company.trim(),
    email: (email || '').trim(),
    phone: (phone || '').trim(),
    country: (country || 'International').trim(),
    primaryPort: (primaryPort || 'Global Port').trim(),
    businessType: businessType || 'Wholesale Importer / Distributor',
    taxId: (taxId || 'VAT / Tax Exempted').trim(),
    paymentTermsPreference: paymentTermsPreference || '30% T/T Advance, 70% B/L',
    status: 'Verified Buyer',
    totalTonnageImported: 0,
    createdAt: new Date().toISOString()
  };

  customers.unshift(newCustomer);
  writeJson('customers.json', customers);

  res.status(201).json({ success: true, customer: newCustomer });
});

router.put('/api/crm/customers/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const customers = readJson('customers.json');
  const index = customers.findIndex(c => c.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Customer not found.' });
  }

  customers[index] = { ...customers[index], ...updates };
  writeJson('customers.json', customers);

  res.json({ success: true, customer: customers[index] });
});

router.delete('/api/crm/customers/:id', (req, res) => {
  const { id } = req.params;
  let customers = readJson('customers.json');
  const initialLen = customers.length;
  customers = customers.filter(c => c.id !== id);

  if (customers.length === initialLen) {
    return res.status(404).json({ success: false, message: 'Customer not found.' });
  }

  writeJson('customers.json', customers);
  res.json({ success: true, message: 'Customer deleted successfully.' });
});

// ==========================================
// 5. SHIPMENTS & CONTAINER LOGISTICS
// ==========================================
router.get('/api/crm/shipments', (req, res) => {
  const shipments = readJson('shipments.json');
  res.json({ success: true, count: shipments.length, shipments });
});

router.post('/api/crm/shipments', (req, res) => {
  const {
    bookingNumber,
    containerNumber,
    shippingLine,
    buyerCompany,
    destinationPort,
    loadingPort,
    vesselName,
    voyageNumber,
    etd,
    eta,
    blNumber,
    commoditiesDescription,
    netWeightMT,
    inspectionAgency,
    status
  } = req.body;

  if (!bookingNumber || !destinationPort) {
    return res.status(400).json({ success: false, message: 'Booking Number and Destination Port are required.' });
  }

  const shipments = readJson('shipments.json');
  const id = `WXA-SHP-${Math.floor(1000 + Math.random() * 9000)}`;

  const newShipment = {
    id,
    bookingNumber: bookingNumber.trim(),
    containerNumber: (containerNumber || 'TBA - Assigned at Yard').trim(),
    shippingLine: shippingLine || 'Maersk Line',
    buyerCompany: (buyerCompany || 'Consignee').trim(),
    loadingPort: loadingPort || 'Nhava Sheva (JNPT, Mumbai)',
    destinationPort: destinationPort.trim(),
    vesselName: (vesselName || 'TBA').trim(),
    voyageNumber: (voyageNumber || 'TBA').trim(),
    etd: etd || new Date().toISOString().split('T')[0],
    eta: eta || new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    blNumber: (blNumber || 'Draft BL Pending').trim(),
    commoditiesDescription: commoditiesDescription || 'Graded Indian Agro Commodities',
    netWeightMT: Number(netWeightMT) || 20,
    inspectionAgency: inspectionAgency || 'SGS India Accredited Inspection',
    status: status || 'Booking Confirmed',
    createdAt: new Date().toISOString()
  };

  shipments.unshift(newShipment);
  writeJson('shipments.json', shipments);

  res.status(201).json({ success: true, shipment: newShipment });
});

router.put('/api/crm/shipments/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const shipments = readJson('shipments.json');
  const index = shipments.findIndex(s => s.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Shipment not found.' });
  }

  shipments[index] = { ...shipments[index], ...updates };
  writeJson('shipments.json', shipments);

  res.json({ success: true, shipment: shipments[index] });
});

router.delete('/api/crm/shipments/:id', (req, res) => {
  const { id } = req.params;
  let shipments = readJson('shipments.json');
  const initialLen = shipments.length;
  shipments = shipments.filter(s => s.id !== id);

  if (shipments.length === initialLen) {
    return res.status(404).json({ success: false, message: 'Shipment not found.' });
  }

  writeJson('shipments.json', shipments);
  res.json({ success: true, message: 'Shipment deleted successfully.' });
});

// ==========================================
// 6. MANDI PROCUREMENT & SOURCING LOG
// ==========================================
router.get('/api/crm/mandi', (req, res) => {
  const lots = readJson('mandi_procurement.json');
  res.json({ success: true, count: lots.length, lots });
});

router.post('/api/crm/mandi', (req, res) => {
  const { mandiHub, commodity, varietyGrade, quantityMT, purchasePriceINRPerQuintal, brokerName, labPurityPercent, moisturePercent, status } = req.body;

  if (!mandiHub || !commodity) {
    return res.status(400).json({ success: false, message: 'Mandi Hub and Commodity are required.' });
  }

  const lots = readJson('mandi_procurement.json');
  const id = `WXA-MND-${Math.floor(1000 + Math.random() * 9000)}`;

  const newLot = {
    id,
    date: new Date().toISOString().split('T')[0],
    mandiHub: mandiHub.trim(),
    commodity: commodity.trim(),
    varietyGrade: (varietyGrade || 'Sortex Clean Grade A').trim(),
    quantityMT: Number(quantityMT) || 10,
    purchasePriceINRPerQuintal: Number(purchasePriceINRPerQuintal) || 0,
    brokerName: (brokerName || 'Direct APMC Mandi Sourcing').trim(),
    labPurityPercent: Number(labPurityPercent) || 99.5,
    moisturePercent: Number(moisturePercent) || 9.2,
    status: status || 'Procured at Mandi',
    createdAt: new Date().toISOString()
  };

  lots.unshift(newLot);
  writeJson('mandi_procurement.json', lots);

  res.status(201).json({ success: true, lot: newLot });
});

router.put('/api/crm/mandi/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const lots = readJson('mandi_procurement.json');
  const index = lots.findIndex(l => l.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Mandi lot not found.' });
  }

  lots[index] = { ...lots[index], ...updates };
  writeJson('mandi_procurement.json', lots);

  res.json({ success: true, lot: lots[index] });
});

router.delete('/api/crm/mandi/:id', (req, res) => {
  const { id } = req.params;
  let lots = readJson('mandi_procurement.json');
  const initialLen = lots.length;
  lots = lots.filter(l => l.id !== id);

  if (lots.length === initialLen) {
    return res.status(404).json({ success: false, message: 'Lot not found.' });
  }

  writeJson('mandi_procurement.json', lots);
  res.json({ success: true, message: 'Lot deleted successfully.' });
});

// ==========================================
// 7. COURIER SAMPLE DISPATCH TRACKER
// ==========================================
router.get('/api/crm/samples', (req, res) => {
  const samples = readJson('sample_requests.json');
  res.json({ success: true, count: samples.length, samples });
});

router.post('/api/crm/samples', (req, res) => {
  const { recipientName, company, country, items, courierService, awbNumber, status } = req.body;

  if (!recipientName || !country) {
    return res.status(400).json({ success: false, message: 'Recipient name and country are required.' });
  }

  const samples = readJson('sample_requests.json');
  const id = `WXA-SMP-${Math.floor(1000 + Math.random() * 9000)}`;

  const newSample = {
    id,
    dispatchDate: new Date().toISOString().split('T')[0],
    recipientName: recipientName.trim(),
    company: (company || 'Prospective Buyer').trim(),
    country: country.trim(),
    items: Array.isArray(items) ? items : [items || 'Spice Origin Sample Kit'],
    courierService: courierService || 'DHL Express Worldwide',
    awbNumber: (awbNumber || 'Pending Courier Pickup').trim(),
    status: status || 'Dispatched',
    createdAt: new Date().toISOString()
  };

  samples.unshift(newSample);
  writeJson('sample_requests.json', samples);

  res.status(201).json({ success: true, sample: newSample });
});

router.put('/api/crm/samples/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const samples = readJson('sample_requests.json');
  const index = samples.findIndex(s => s.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Sample record not found.' });
  }

  samples[index] = { ...samples[index], ...updates };
  writeJson('sample_requests.json', samples);

  res.json({ success: true, sample: samples[index] });
});

router.delete('/api/crm/samples/:id', (req, res) => {
  const { id } = req.params;
  let samples = readJson('sample_requests.json');
  const initialLen = samples.length;
  samples = samples.filter(s => s.id !== id);

  if (samples.length === initialLen) {
    return res.status(404).json({ success: false, message: 'Sample record not found.' });
  }

  writeJson('sample_requests.json', samples);
  res.json({ success: true, message: 'Sample record deleted successfully.' });
});

// ==========================================
// 8. EXPORT CONFIGURATION & SETTINGS
// ==========================================
router.get('/api/crm/config', (req, res) => {
  try {
    const raw = fs.readFileSync(path.join(dataDir, 'export_config.json'), 'utf8');
    res.json({ success: true, config: JSON.parse(raw) });
  } catch (err) {
    res.json({ success: false, message: 'Config not available' });
  }
});

router.put('/api/crm/config', (req, res) => {
  const updates = req.body;
  try {
    const raw = fs.readFileSync(path.join(dataDir, 'export_config.json'), 'utf8');
    const config = { ...JSON.parse(raw), ...updates };
    fs.writeFileSync(path.join(dataDir, 'export_config.json'), JSON.stringify(config, null, 2), 'utf8');
    res.json({ success: true, config });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not update configuration.' });
  }
});

module.exports = router;

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static images and assets
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname)));

// Helper to load JSON safely
function loadData(file) {
  try {
    const raw = fs.readFileSync(path.join(__dirname, 'data', file), 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${file}:`, err);
    return [];
  }
}

// Helper to save JSON
function saveData(file, data) {
  try {
    fs.writeFileSync(path.join(__dirname, 'data', file), JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error(`Error writing ${file}:`, err);
    return false;
  }
}

/* =========================================================
   REST API ENDPOINTS (MERN Service Layer)
   ========================================================= */

// Health & System Info
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'Wonderxasia MERN Agri-Export Engine',
    version: '3.0.0',
    framework: 'Node.js Express + React Dynamic UI',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()) + 's'
  });
});

// Categories list
app.get('/api/categories', (req, res) => {
  const categories = loadData('categories.json');
  res.json({ success: true, count: categories.length, categories });
});

// Single Category + its Products
app.get('/api/categories/:slug', (req, res) => {
  const { slug } = req.params;
  const categories = loadData('categories.json');
  const products = loadData('products.json');

  const category = categories.find(c => c.slug === slug || c.id === slug);
  if (!category) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }

  const categoryProducts = products.filter(p => p.category === category.slug || p.category === category.id);
  res.json({
    success: true,
    category,
    productCount: categoryProducts.length,
    products: categoryProducts
  });
});

// Products catalog with search, category & featured filters
app.get('/api/products', (req, res) => {
  const products = loadData('products.json');
  let filtered = [...products];
  const { category, search, featured, limit } = req.query;

  if (category && category !== 'all') {
    filtered = filtered.filter(p => p.category === category);
  }

  if (featured === 'true') {
    filtered = filtered.filter(p => p.featured === true);
  }

  if (search) {
    const query = search.trim().toLowerCase();
    filtered = filtered.filter(p => {
      const haystack = `${p.name} ${p.hindiName || ''} ${p.categoryName || ''} ${p.form || ''} ${p.origin || ''} ${p.description || ''} ${p.hsCode || ''}`.toLowerCase();
      return haystack.includes(query);
    });
  }

  const total = filtered.length;
  if (limit) {
    filtered = filtered.slice(0, parseInt(limit, 10));
  }

  res.json({
    success: true,
    total,
    returned: filtered.length,
    products: filtered
  });
});

// Single Product Details + Related Products
app.get('/api/products/:slug', (req, res) => {
  const { slug } = req.params;
  const products = loadData('products.json');
  const product = products.find(p => p.slug === slug || p.id === slug);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  const related = products
    .filter(p => p.category === product.category && p.slug !== product.slug)
    .slice(0, 4);

  res.json({
    success: true,
    product,
    related
  });
});

// Trade Inquiries & RFQs Submission
app.post('/api/inquiries', (req, res) => {
  const { name, company, email, phone, country, port, products, message, incoterm, targetQuantity } = req.body;

  if (!name || (!email && !phone)) {
    return res.status(400).json({
      success: false,
      message: 'Buyer name and contact email or phone are required.'
    });
  }

  const inquiries = loadData('inquiries.json');
  const inquiryId = `WXA-RFQ-${Math.floor(1000 + Math.random() * 9000)}`;

  const newInquiry = {
    id: inquiryId,
    timestamp: new Date().toISOString(),
    name: name.trim(),
    company: (company || 'Independent Importer').trim(),
    email: (email || '').trim(),
    phone: (phone || '').trim(),
    country: (country || 'International').trim(),
    port: (port || 'Not specified').trim(),
    incoterm: incoterm || 'FOB / CIF',
    targetQuantity: targetQuantity || 'Per specification',
    products: Array.isArray(products) ? products : (products ? [products] : []),
    message: (message || '').trim(),
    status: 'Received - Sourcing Team Assigned'
  };

  inquiries.unshift(newInquiry);
  saveData('inquiries.json', inquiries);

  res.status(201).json({
    success: true,
    inquiryId: inquiryId,
    message: 'Your export requirement has been registered. Our export desk will review your specifications and supply details within 24 business hours.',
    inquiry: newInquiry
  });
});

// Trade Inquiries List (for dashboard / statistics)
app.get('/api/inquiries', (req, res) => {
  const inquiries = loadData('inquiries.json');
  res.json({ success: true, count: inquiries.length, inquiries: inquiries.slice(0, 10) });
});

// Stats endpoint for dynamic counters & live ticker
app.get('/api/inquiries/stats', (req, res) => {
  const inquiries = loadData('inquiries.json');
  const products = loadData('products.json');
  const categories = loadData('categories.json');

  res.json({
    success: true,
    stats: {
      totalCategories: categories.length,
      totalProducts: products.length,
      activeExportMarkets: 38,
      inquiriesProcessed: 1420 + inquiries.length,
      recentInquiries: inquiries.slice(0, 5).map(i => ({
        id: i.id,
        country: i.country,
        productSample: i.products && i.products.length ? (typeof i.products[0] === 'string' ? i.products[0] : i.products[0].name) : 'Indian Spices',
        timeAgo: 'Recently'
      }))
    }
  });
});

// Live Commodity Mandi Benchmark Price Index (Daily Market Indicative Rates)
app.get('/api/market-rates', (req, res) => {
  const rates = [
    { commodity: 'Cumin Seeds (Jeera)', mandi: 'Unjha, Gujarat', grade: 'Sortex 99.5%', pricePerMT: '$3,850 - $4,100', trend: '+1.8%', change: 'up' },
    { commodity: 'Turmeric Fingers (Curcumin 4%+)', mandi: 'Nizamabad, Telangana', grade: 'Double Polished', pricePerMT: '$1,920 - $2,150', trend: '+0.5%', change: 'up' },
    { commodity: 'Dry Red Chilli (Teja / S17)', mandi: 'Guntur, AP', grade: 'Stemless Pure', pricePerMT: '$2,750 - $2,980', trend: '-0.8%', change: 'down' },
    { commodity: 'Tellicherry Black Pepper', mandi: 'Kochi / Idukki, Kerala', grade: 'TGSEB 570GL', pricePerMT: '$7,200 - $7,650', trend: '+2.4%', change: 'up' },
    { commodity: 'Green Cardamom (8mm Bold)', mandi: 'Bodinayakanur, TN', grade: 'Alleppey Green', pricePerMT: '$28,500 - $32,000', trend: '+3.1%', change: 'up' },
    { commodity: 'Traditional Aged Basmati Rice', mandi: 'Karnal / Amritsar', grade: 'Aged 2 Yrs', pricePerMT: '$1,280 - $1,450', trend: '0.0%', change: 'neutral' },
    { commodity: 'Kabuli Chickpeas (42-44 count)', mandi: 'Indore, MP', grade: 'Sortex 12mm', pricePerMT: '$1,480 - $1,620', trend: '+1.2%', change: 'up' },
    { commodity: 'Cashew Kernels (W240 Jumbo)', mandi: 'Mangalore / Goa', grade: 'White Whole', pricePerMT: '$7,900 - $8,350', trend: '-0.4%', change: 'down' }
  ];

  res.json({
    success: true,
    lastUpdated: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    currency: 'USD ($) / Metric Tonne (FOB Indian Port)',
    marketStatus: 'Active Bullion Mandi Trading Cycle',
    rates
  });
});

// Express Sample Request API
app.post('/api/sample-request', (req, res) => {
  const { name, company, email, phone, country, address, requestedCommodities, courierAccount } = req.body;
  if (!name || !email || !country) {
    return res.status(400).json({ success: false, message: 'Name, email, and destination country are required.' });
  }

  const sampleId = `WXA-SMP-${Math.floor(1000 + Math.random() * 9000)}`;
  res.status(201).json({
    success: true,
    sampleId,
    message: 'Certified courier sample request lodged successfully. Sourcing team will dispatch DHL/FedEx tracking details within 24 hours.',
    details: { sampleId, name, country, items: requestedCommodities }
  });
});

// Instant Freight Estimation API
app.post('/api/freight-estimate', (req, res) => {
  const { destinationPort, containerSize, commodityType } = req.body;
  const rates = {
    'Jebel Ali, Dubai': { '20ft FCL': '$1,150 - $1,350', '40ft HC': '$1,850 - $2,100', transitDays: '4-6 Days' },
    'Hamburg, Germany': { '20ft FCL': '$2,400 - $2,750', '40ft HC': '$3,600 - $4,100', transitDays: '22-26 Days' },
    'Rotterdam, Netherlands': { '20ft FCL': '$2,350 - $2,700', '40ft HC': '$3,550 - $4,050', transitDays: '21-25 Days' },
    'New York / New Jersey, USA': { '20ft FCL': '$3,100 - $3,500', '40ft HC': '$4,400 - $4,950', transitDays: '28-32 Days' },
    'Singapore': { '20ft FCL': '$950 - $1,200', '40ft HC': '$1,500 - $1,800', transitDays: '6-9 Days' },
    'Sydney, Australia': { '20ft FCL': '$2,100 - $2,450', '40ft HC': '$3,200 - $3,700', transitDays: '18-22 Days' }
  };

  const matched = rates[destinationPort] || {
    '20ft FCL': '$1,800 - $2,400 (Indicative)',
    '40ft HC': '$2,900 - $3,600 (Indicative)',
    transitDays: '14-25 Days depending on carrier'
  };

  res.json({
    success: true,
    originPort: 'Nhava Sheva (JNPT) / Mundra, India',
    destinationPort: destinationPort || 'Global Port',
    container: containerSize || '20ft FCL',
    estimatedOceanFreight: matched[containerSize] || matched['20ft FCL'],
    transitDays: matched.transitDays,
    validity: 'Valid for current shipping cycle. Final booking subject to carrier confirmation.'
  });
});

// Newsletter subscription
app.post('/api/newsletter', (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, message: 'Valid email required' });
  }
  res.json({
    success: true,
    message: 'Thank you for subscribing to Wonderxasia Global Agri-Market Trade Bulletins.'
  });
});

/* =========================================================
   MULTI-PAGE WEB ROUTES
   ========================================================= */

const servePage = (pageName) => (req, res) => {
  const file = path.join(__dirname, 'public', pageName);
  if (fs.existsSync(file)) {
    return res.sendFile(file);
  }
  const rootFile = path.join(__dirname, pageName);
  if (fs.existsSync(rootFile)) {
    return res.sendFile(rootFile);
  }
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
};

app.get('/', servePage('index.html'));
app.get('/home', servePage('index.html'));
app.get('/about', servePage('about.html'));
app.get('/categories', servePage('categories.html'));
app.get('/category/:slug', servePage('category.html'));
app.get('/products', servePage('products.html'));
app.get('/product/:slug', servePage('product.html'));
app.get('/process', servePage('process.html'));
app.get('/quality', servePage('quality.html'));
app.get('/rfq', servePage('rfq.html'));
app.get('/contact', servePage('contact.html'));

// 404 handler
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Wonderxasia MERN Agri-Export Engine running on port ${PORT}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`📦 REST API: http://localhost:${PORT}/api/products`);
  console.log(`🚢 Freight API: http://localhost:${PORT}/api/freight-estimate`);
  console.log(`=======================================================`);
});

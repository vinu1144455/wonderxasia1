# Wonderxasia — Global Agri-Export Platform

An Indian B2B agricultural export web platform connecting overseas food importers with Sortex-cleaned whole spices, cryogenic milled powders, authentic culinary masalas, aged Himalayan Basmati rice, and certified pulses.

## Tech Stack
- **Backend:** Node.js (v18+) with Express.js REST API
- **Frontend:** Vanilla HTML5, CSS3, JavaScript ES6+ & React 18 Dynamic Engine (Babel Standalone)
- **Styling:** Custom Corporate Montserrat & DM Sans typography with luxury B2B export design accents
- **Storage:** File-based JSON database (`data/products.json`, `data/categories.json`, `data/inquiries.json`)

---

## Deploy to Render (Step-by-Step)

### Option A: Via GitHub (Recommended)
1. Push this project folder to your GitHub repository.
2. Sign in to [Render.com](https://render.com).
3. Click **New +** and select **Web Service**.
4. Connect your GitHub repository.
5. Configure the deployment settings:
   - **Name:** `wonderxasia` (or any preferred name)
   - **Region:** Singapore, Frankfurt, or Oregon (choose closest to your audience)
   - **Branch:** `main` (or `master`)
   - **Root Directory:** *(leave blank)*
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Instance Type:** `Free`
6. Click **Deploy Web Service**.
7. Your site will be live at `https://wonderxasia.onrender.com`!

### Option B: Health Check Endpoint
- Render Health Check Path: `/api/health`

---

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Run local server
npm start
# or with file watching:
npm run dev

# 3. Open in browser:
# http://localhost:3000
```

---

## Project Structure
```
wonderxasia/
├── data/
│   ├── categories.json      # 8 master commodity categories
│   ├── products.json        # 40+ export commodities
│   └── inquiries.json       # Live buyer inquiry store
├── images/
│   ├── products/            # 40 commodity images
│   ├── wonderx-logo.png     # Registered corporate brand logo
│   └── ...                  # Section backgrounds & banners
├── public/
│   ├── css/main.css         # Complete corporate theme styles
│   ├── js/
│   │   ├── app.js           # Navigation, drawers, floating cluster
│   │   ├── catalog.js       # Dynamic product filtering & search
│   │   ├── category-page.js # Single category product loader
│   │   ├── product-detail.js# Single product specs & CoA downloader
│   │   └── react-app.js     # Hero slider & ocean freight simulator
│   ├── index.html           # Homepage
│   ├── categories.html      # All categories hub
│   ├── category.html        # Single category view
│   ├── products.html        # 40+ products catalog
│   ├── product.html         # Single product spec view
│   ├── about.html           # Corporate profile
│   ├── process.html         # 4-stage export logistics
│   ├── quality.html         # SGS/Geo-Chem lab testing
│   ├── rfq.html             # Multi-commodity RFQ builder
│   ├── contact.html         # Global export desk
│   └── 404.html             # 404 handler
├── server.js                # Express REST API & static routing
└── package.json             # Node dependencies and scripts
```

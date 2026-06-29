if (window.__amazonScout) { /* already injected */ } else { window.__amazonScout = true;

function getASIN() {
  // URL is the most reliable source
  const urlMatch = window.location.pathname.match(/\/dp\/([A-Z0-9]{10})/);
  if (urlMatch) return urlMatch[1];
  // Fallback: meta tag
  const meta = document.querySelector('input[name="ASIN"], input#ASIN');
  return meta ? meta.value : null;
}

function getTitle() {
  const selectors = ['#productTitle', 'h1.a-size-large', 'h1[data-automation-id="title"]'];
  for (const sel of selectors) {
    const el = document.querySelector(sel);
    if (el && el.textContent.trim()) return el.textContent.trim();
  }
  return null;
}

function getPrice() {
  const selectors = [
    '.a-price .a-offscreen',
    '.apexPriceToPay .a-offscreen',
    '#corePrice_feature_div .a-offscreen',
    '#price_inside_buybox',
    '#priceblock_ourprice',
    '#priceblock_dealprice',
    '#priceblock_saleprice',
    '.priceToPay .a-offscreen',
  ];
  for (const sel of selectors) {
    const el = document.querySelector(sel);
    if (el) {
      const price = parseFloat(el.textContent.replace(/[^0-9.]/g, ''));
      if (!isNaN(price) && price > 0) return price;
    }
  }
  return null;
}

// ── BSR ──────────────────────────────────────────────────────────────────────

function parseBSR(text) {
  // Matches "#1,234" or "No. 1,234"
  const m = text.match(/#([\d,]+)/) || text.match(/No\.\s*([\d,]+)/);
  return m ? parseInt(m[1].replace(/,/g, ''), 10) : null;
}

function getBSR() {
  // 1. Legacy dedicated element
  const legacy = document.querySelector('#SalesRank');
  if (legacy) { const v = parseBSR(legacy.textContent); if (v) return v; }

  // 2. All product-detail table rows (multiple possible IDs Amazon uses)
  const tableRows = document.querySelectorAll([
    '#productDetails_feature_div tr',
    '#productDetails_db_sections tr',
    '#productDetails_detailBullets_sections1 tr',
    '#prodDetails tr',
    '#detailBullets_feature_div li',
    '#detailBulletsWrapper_feature_div li',
  ].join(','));
  for (const el of tableRows) {
    if (el.textContent.includes('Best Sellers Rank')) {
      const v = parseBSR(el.textContent); if (v) return v;
    }
  }

  // 3. Broad sweep — any li or tr on the page
  for (const el of document.querySelectorAll('li, tr')) {
    if (el.textContent.includes('Best Sellers Rank')) {
      const v = parseBSR(el.textContent); if (v) return v;
    }
  }

  // 4. Last resort: scan all visible text for the BSR pattern
  const bodyText = document.body.innerText;
  const m = bodyText.match(/Best Sellers Rank[^#]*#([\d,]+)/);
  return m ? parseInt(m[1].replace(/,/g, ''), 10) : null;
}

// ── Rating ────────────────────────────────────────────────────────────────────

function getRating() {
  // 1. #acrPopover title attribute — "4.5 out of 5 stars" (most reliable)
  const popover = document.querySelector('#acrPopover');
  if (popover) {
    const src = popover.getAttribute('title') || popover.textContent;
    const m = src.match(/([\d.]+)\s+out\s+of/);
    if (m) return parseFloat(m[1]);
  }

  // 2. averageCustomerReviews section
  for (const sel of [
    '#averageCustomerReviews .a-icon-alt',
    '#averageCustomerReviews_feature_div .a-icon-alt',
    '[data-hook="average-star-rating"] .a-icon-alt',
    '[data-hook="rating-out-of-text"]',
  ]) {
    const el = document.querySelector(sel);
    if (el) {
      const m = el.textContent.match(/([\d.]+)/);
      if (m) return parseFloat(m[1]);
    }
  }

  // 3. Any .a-icon-alt containing "out of 5"
  for (const el of document.querySelectorAll('.a-icon-alt')) {
    const m = el.textContent.match(/([\d.]+)\s+out\s+of\s+5/);
    if (m) return parseFloat(m[1]);
  }

  return null;
}

// ── Reviews ───────────────────────────────────────────────────────────────────

function getReviews() {
  const selectors = [
    '#acrCustomerReviewText',
    '[data-hook="total-review-count"]',
    '#ratings-count',
  ];
  for (const sel of selectors) {
    const el = document.querySelector(sel);
    if (el) {
      const m = el.textContent.match(/([\d,]+)/);
      if (m) return parseInt(m[1].replace(/,/g, ''), 10);
    }
  }

  // Fallback: review links often contain the count
  for (const el of document.querySelectorAll('a[href*="customerReviews"], a[href*="product-reviews"]')) {
    const m = el.textContent.trim().match(/^([\d,]+)/);
    if (m) return parseInt(m[1].replace(/,/g, ''), 10);
  }

  // Last resort: find any span near the star rating containing a number
  const avgSection = document.querySelector('#averageCustomerReviews, #averageCustomerReviews_feature_div');
  if (avgSection) {
    const m = avgSection.textContent.match(/([\d,]+)\s+(?:global\s+)?ratings?/i);
    if (m) return parseInt(m[1].replace(/,/g, ''), 10);
  }

  return null;
}

// ── Category ──────────────────────────────────────────────────────────────────

function getCategory() {
  // 1. Extract from BSR text — "#1,234 in Kitchen & Dining ("
  for (const el of document.querySelectorAll('li, tr')) {
    if (el.textContent.includes('Best Sellers Rank')) {
      const m = el.textContent.match(/#[\d,]+\s+in\s+([^(#\n]+)/);
      if (m) {
        const cat = m[1].trim().replace(/\s+/g, ' ');
        if (cat) return cat;
      }
    }
  }

  // 2. Breadcrumb navigation
  for (const sel of [
    '#wayfinding-breadcrumbs_container li a',
    '.a-breadcrumb li a',
    '#searchPathBreadcrumbs a',
    'ul.a-unordered-list.a-horizontal.a-size-small li a',
  ]) {
    const els = document.querySelectorAll(sel);
    if (els.length) return els[0].textContent.trim();
  }

  return null;
}

// ── Message listener ──────────────────────────────────────────────────────────

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === 'scrape') {
    sendResponse({
      asin:     getASIN(),
      title:    getTitle(),
      price:    getPrice(),
      bsr:      getBSR(),
      reviews:  getReviews(),
      rating:   getRating(),
      category: getCategory(),
      url:      window.location.href,
    });
  }
  return true;
});

} // end guard
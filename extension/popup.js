// ── State ──
let productData = null;
let userIsPro = false;
let currentUser = null;

// ── DOM helpers ──
const $ = id => document.getElementById(id);
const show = el => el && el.classList.remove('hidden');
const hide = el => el && el.classList.add('hidden');

function showScreen(name) {
  ['auth', 'loading', 'no-product', 'main'].forEach(s => {
    const el = $(`screen-${s}`);
    if (el) el.classList.toggle('hidden', s !== name);
  });
}

// ── Analytics ──
function estimateMonthlySales(bsr) {
  if (!bsr) return null;
  if (bsr <= 10)     return 50000;
  if (bsr <= 100)    return 8000;
  if (bsr <= 500)    return 2500;
  if (bsr <= 1000)   return 1200;
  if (bsr <= 3000)   return 600;
  if (bsr <= 5000)   return 350;
  if (bsr <= 10000)  return 180;
  if (bsr <= 20000)  return 80;
  if (bsr <= 50000)  return 35;
  if (bsr <= 100000) return 15;
  return 5;
}

function calcOpportunityScore(bsr, reviews, price) {
  let total = 0, weight = 0;
  if (bsr != null) {
    const s = bsr <= 1000 ? 100 : bsr <= 5000 ? 80 : bsr <= 20000 ? 60 : bsr <= 50000 ? 40 : 20;
    total += s * 0.4; weight += 0.4;
  }
  if (reviews != null) {
    const s = reviews < 50 ? 100 : reviews < 200 ? 80 : reviews < 500 ? 60 : reviews < 1500 ? 40 : 20;
    total += s * 0.4; weight += 0.4;
  }
  if (price != null) {
    const s = price >= 50 ? 100 : price >= 30 ? 80 : price >= 20 ? 60 : price >= 10 ? 40 : 20;
    total += s * 0.2; weight += 0.2;
  }
  return weight > 0 ? Math.round(total / weight) : null;
}

function scoreColor(s) {
  return s >= 70 ? '#16A34A' : s >= 40 ? '#D97706' : '#DC2626';
}

function fmt(n) { return n != null ? n.toLocaleString('en-US') : '—'; }
function fmtUSD(n) { return n != null ? '$' + n.toFixed(2) : '—'; }

// ── Populate product data ──
function populateData() {
  const { asin, title, price, bsr, reviews, rating, category } = productData;
  const sales = estimateMonthlySales(bsr);
  const score = calcOpportunityScore(bsr, reviews, price);

  // Overview
  function setTip(id, text, tip) {
    const el = $(id);
    el.textContent = text;
    if (tip) el.setAttribute('data-tip', tip); else el.removeAttribute('data-tip');
  }

  setTip('m-bsr',   bsr   ? '#' + fmt(bsr) : '—', bsr   ? null : 'Not yet ranked');
  setTip('m-sales', sales ? fmt(sales)      : '—', sales ? null : 'Requires BSR ranking');
  setTip('m-score', score != null ? score   : '—', score != null ? null : 'Insufficient data');
  if (score != null) $('m-score').style.color = scoreColor(score);

  $('p-title').textContent = title || 'Title not available';
  $('p-asin').textContent  = asin  || '—';

  // Financials
  const referral = price ? +(price * 0.15).toFixed(2) : null;
  const fbaFee   = 4.00;
  const profit   = price ? +(price - referral - fbaFee).toFixed(2) : null;
  const revenue  = sales && price ? sales * price : null;

  $('f-price').textContent  = fmtUSD(price);
  $('f-fees').textContent   = referral ? fmtUSD(+(referral + fbaFee).toFixed(2)) : '—';
  $('f-profit').textContent = fmtUSD(profit);
  if (profit != null) $('f-profit').style.color = profit > 0 ? '#16A34A' : '#DC2626';

  $('fd-price').textContent    = fmtUSD(price);
  $('fd-referral').textContent = fmtUSD(referral);
  $('fd-total').textContent    = fmtUSD(profit);
  setTip('fd-revenue', revenue ? '$' + fmt(Math.round(revenue)) : '—', revenue ? null : 'Requires BSR ranking');

  // Listing
  setTip('l-rating',  rating  != null ? rating + ' ⭐' : '—', rating  != null ? null : 'No ratings yet');
  setTip('l-reviews', reviews != null ? fmt(reviews)   : '—', reviews != null ? null : 'No reviews yet');
  $('l-category').textContent = category || '—';
  $('l-asin').textContent     = asin    || '—';
  $('l-price').textContent    = fmtUSD(price);
}

// ── Header badges ──
function updateHeaderBadges() {
  const badge = userIsPro
    ? '<span class="badge-pro">PRO</span>'
    : '<span class="badge-free">FREE</span>';

  ['main-pro-badge', 'np-pro-badge'].forEach(id => {
    const el = $(id);
    if (el) el.innerHTML = badge;
  });

  if ($('footer-email') && currentUser) {
    $('footer-email').textContent = currentUser.email;
  }

  // Save button vs upgrade nudge
  if (userIsPro) {
    show($('btn-save'));
    hide($('save-pro-note'));
  } else {
    hide($('btn-save'));
    show($('save-pro-note'));
  }

  // Saved tab gate
  if (userIsPro) {
    hide($('saved-pro-gate'));
    show($('saved-list'));
  } else {
    show($('saved-pro-gate'));
    hide($('saved-list'));
  }
}

// ── Saved products ──
async function loadSaved() {
  if (!userIsPro) return;
  const items = await getSavedProducts();
  const container = $('saved-items');
  const empty = $('saved-empty');

  if (!items.length) { show(empty); container.innerHTML = ''; return; }

  hide(empty);
  container.innerHTML = items.map(p => `
    <div class="product-row">
      <div class="product-row-info">
        <span class="product-row-title">${p.title || p.asin}</span>
        <span class="product-row-meta">ASIN: ${p.asin}${p.price ? ' · $' + p.price : ''}</span>
      </div>
      <button class="btn-delete" data-id="${p.id}" title="Remove">✕</button>
    </div>
  `).join('');

  container.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', async () => {
      await deleteProduct(btn.dataset.id);
      loadSaved();
    });
  });
}

// ── Tab switching ──
function switchTab(name) {
  document.querySelectorAll('.tab').forEach(t =>
    t.classList.toggle('active', t.dataset.tab === name)
  );
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.add('hidden'));
  const pane = $(`tab-${name}`);
  if (pane) pane.classList.remove('hidden');
  if (name === 'saved') loadSaved();
}

// ── Auth screen ──
function setupAuth() {
  // Switch between Sign In / Sign Up tabs
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      $('form-login').classList.toggle('hidden', tab.dataset.tab !== 'login');
      $('form-register').classList.toggle('hidden', tab.dataset.tab !== 'register');
    });
  });

  async function doLogin() {
    const email = $('login-email').value.trim();
    const pwd   = $('login-password').value;
    const errEl = $('login-error');
    hide(errEl);
    $('btn-login').disabled = true;
    $('btn-login').textContent = 'Signing in…';
    try {
      await login(email, pwd);
      init();
    } catch (e) {
      errEl.textContent = e.message; show(errEl);
      $('btn-login').disabled = false;
      $('btn-login').textContent = 'Sign In';
    }
  }

  async function doRegister() {
    const email = $('reg-email').value.trim();
    const pwd   = $('reg-password').value;
    const errEl = $('reg-error');
    hide(errEl);
    $('btn-register').disabled = true;
    $('btn-register').textContent = 'Creating account…';
    try {
      await register(email, pwd);
      init();
    } catch (e) {
      errEl.textContent = e.message; show(errEl);
      $('btn-register').disabled = false;
      $('btn-register').textContent = 'Create Account';
    }
  }

  $('btn-login').addEventListener('click', doLogin);
  $('btn-register').addEventListener('click', doRegister);

  [$('login-email'), $('login-password')].forEach(el =>
    el.addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); })
  );
  [$('reg-email'), $('reg-password')].forEach(el =>
    el.addEventListener('keydown', e => { if (e.key === 'Enter') doRegister(); })
  );
}

// ── Upgrade handler ──
async function startUpgrade() {
  try {
    const url = await createCheckout();
    chrome.tabs.create({ url });
  } catch (e) {
    console.error('Checkout error:', e.message);
  }
}

// ── Scrape with retry + programmatic injection fallback ──
async function scrapeWithRetry(tabId) {
  for (let i = 0; i < 3; i++) {
    try {
      const data = await chrome.tabs.sendMessage(tabId, { action: 'scrape' });
      if (data?.asin) return data;
    } catch {
      if (i === 0) {
        try {
          await chrome.scripting.executeScript({ target: { tabId }, files: ['content.js'] });
        } catch {}
      }
    }
    if (i < 2) await new Promise(r => setTimeout(r, 500));
  }
  return null;
}

// ── Main init ──
async function init() {
  showScreen('loading');

  // 1. Check token locally — no network call
  const token = await getToken();
  if (!token || isTokenExpired(token)) {
    await logout();
    showScreen('auth');
    setupAuth();
    return;
  }

  // 2. Load stored user — no network call
  const { user } = await chrome.storage.local.get('user');
  currentUser = user;

  // 3. Tab query + Pro status in parallel — at most 1 network call (cache miss)
  const [[tab], pro] = await Promise.all([
    chrome.tabs.query({ active: true, currentWindow: true }),
    checkProCached(),
  ]);
  userIsPro = pro;

  const onProductPage = tab?.url &&
    /amazon\.(com|co\.uk|de|fr|it|es|ca|co\.jp)\//.test(tab.url) &&
    /\/dp\/[A-Z0-9]{10}/.test(tab.url);

  if (!onProductPage) {
    updateHeaderBadges();
    showScreen('no-product');
    $('np-logout').addEventListener('click', async () => { await logout(); init(); });
    // Re-validate token silently in background — won't block UI
    validate().then(u => { if (!u) { logout(); init(); } });
    return;
  }

  // 4. Scrape content script (retries + programmatic injection on failure)
  if (onProductPage) {
    productData = await scrapeWithRetry(tab.id);
  }

  if (!productData?.asin) {
    updateHeaderBadges();
    if (onProductPage) {
      $('np-title').setAttribute('data-tip', 'Page may still be loading');
      $('np-sub').textContent = 'Product data could not be read from this page.';
      show($('btn-retry'));
      $('btn-retry').onclick = init;
    } else {
      $('np-title').removeAttribute('data-tip');
      $('np-sub').textContent = 'Navigate to an Amazon product page to start scouting';
      hide($('btn-retry'));
    }
    showScreen('no-product');
    $('np-logout').addEventListener('click', async () => { await logout(); init(); });
    return;
  }

  populateData();
  updateHeaderBadges();
  showScreen('main');

  // Re-validate token silently in background — won't block UI
  validate().then(u => { if (!u) { logout(); init(); } });

  // Tab switching
  document.querySelectorAll('.tab').forEach(t =>
    t.addEventListener('click', () => switchTab(t.dataset.tab))
  );

  // Logout — header button and footer link both work
  const doLogout = async () => { await logout(); init(); };
  $('main-logout').addEventListener('click', doLogout);
  $('footer-logout').addEventListener('click', doLogout);

  // Save product
  $('btn-save').addEventListener('click', async () => {
    const btn = $('btn-save');
    btn.disabled = true;
    btn.textContent = 'Saving…';
    try {
      await saveProduct({
        asin: productData.asin,
        title: productData.title,
        price: productData.price,
        bsr: productData.bsr,
        reviews: productData.reviews,
        opportunity_score: calcOpportunityScore(productData.bsr, productData.reviews, productData.price),
      });
      btn.textContent = '✓ Saved!';
    } catch (e) {
      btn.textContent = e.message === 'Product already saved' ? 'Already saved' : 'Error';
    }
    setTimeout(() => { btn.textContent = 'Save Product'; btn.disabled = false; }, 2000);
  });

  // Invalidate Pro cache after upgrade so next open re-checks
  const handleUpgrade = async () => { await startUpgrade(); await invalidateProCache(); };
  $('btn-upgrade')?.addEventListener('click', handleUpgrade);
  $('btn-upgrade-save')?.addEventListener('click', handleUpgrade);
}

document.addEventListener('DOMContentLoaded', init);

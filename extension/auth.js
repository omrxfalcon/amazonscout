const API_BASE = 'https://amazonscout-production.up.railway.app/api';
const PRO_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Decode JWT expiry locally — no network call needed
function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return Date.now() / 1000 >= payload.exp;
  } catch {
    return true;
  }
}

async function register(email, password) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  await chrome.storage.local.set({ token: data.token, user: data.user });
  return data;
}

async function login(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  await chrome.storage.local.set({ token: data.token, user: data.user });
  return data;
}

async function logout() {
  await chrome.storage.local.remove(['token', 'user']);
}

async function getToken() {
  const { token } = await chrome.storage.local.get('token');
  return token || null;
}

async function validate() {
  const token = await getToken();
  if (!token) return null;
  try {
    const res = await fetch(`${API_BASE}/auth/validate`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) { await logout(); return null; }
    return (await res.json()).user;
  } catch {
    return null;
  }
}

async function checkPro() {
  const token = await getToken();
  if (!token) return false;
  try {
    const res = await fetch(`${API_BASE}/products`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok;
  } catch {
    return false;
  }
}

// Returns cached Pro status if fresh, otherwise fetches and caches it
async function checkProCached() {
  const { proStatus, proCheckedAt } = await chrome.storage.local.get(['proStatus', 'proCheckedAt']);
  if (proCheckedAt && Date.now() - proCheckedAt < PRO_CACHE_TTL && proStatus !== undefined) {
    return proStatus;
  }
  const fresh = await checkPro();
  await chrome.storage.local.set({ proStatus: fresh, proCheckedAt: Date.now() });
  return fresh;
}

// Invalidate Pro cache — call after a successful Stripe checkout
async function invalidateProCache() {
  await chrome.storage.local.remove(['proStatus', 'proCheckedAt']);
}

async function createCheckout() {
  const token = await getToken();
  const res = await fetch(`${API_BASE}/stripe/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data.url;
}

async function saveProduct(product) {
  const token = await getToken();
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(product),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

async function getSavedProducts() {
  const token = await getToken();
  if (!token) return [];
  try {
    const res = await fetch(`${API_BASE}/products`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok ? res.json() : [];
  } catch { return []; }
}

async function deleteProduct(id) {
  const token = await getToken();
  await fetch(`${API_BASE}/products/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}

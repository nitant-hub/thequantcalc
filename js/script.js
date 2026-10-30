(function () {
  'use strict';

  // Optional: point this at your serverless endpoint that returns
  // { "prices": { "Amazon": 54999, "Flipkart": 53499, ... } } for ?q=<query>
  const PRICE_API_URL = '';
  const API_TIMEOUT_MS = 8000;
  const MAX_WORDS = 12;

  const SHORT_HOSTS = /(^|\.)(amzn\.in|amzn\.to|a\.co|dl\.flipkart\.com|fkrt\.it|fkrt\.cc)$/i;
  const NOISE = /take a look at this|check out|buy online|buy now|on flipkart|on amazon|flipkart\.com|amazon\.in|price in india|best price|online at/gi;

  const STORES = [
    { name: 'Amazon', url: q => `https://www.amazon.in/s?k=${q}` },
    { name: 'Flipkart', url: q => `https://www.flipkart.com/search?q=${q}` },
    { name: 'Croma', url: q => `https://www.croma.com/searchB?q=${q}&text=${q}` },
    { name: 'Reliance Digital', url: q => `https://www.reliancedigital.in/search?q=${q}` },
    { name: 'Tata CLiQ', url: q => `https://www.tatacliq.com/search/?searchCategory=all&text=${q}` },
    { name: 'Vijay Sales', url: q => `https://www.vijaysales.com/search/${q}` },
    { name: 'JioMart', url: q => `https://www.jiomart.com/search?q=${q}` },
    { name: 'Snapdeal', url: q => `https://www.snapdeal.com/search?keyword=${q}` },
    { name: 'Meesho', url: q => `https://www.meesho.com/search?q=${q}` },
    { name: 'Google Shopping', url: q => `https://www.google.com/search?tbm=shop&q=${q}` }
  ];

  function parseUrl(text) {
    try { return new URL(text); } catch (e) { return null; }
  }

  function clean(text) {
    return text
      .replace(NOISE, ' ')
      .replace(/[-_+]+/g, ' ')
      .replace(/[^\p{L}\p{N}\s.]/gu, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .slice(0, MAX_WORDS)
      .join(' ');
  }

  function safeDecode(s) {
    try { return decodeURIComponent(s); } catch (e) { return s; }
  }

  // Returns { query } or { error }
  function extractQuery(raw) {
    const input = (raw || '').trim();
    if (!input) return { error: 'Paste a product link or type a product name.' };

    const match = input.match(/https?:\/\/[^\s]+/i);
    if (!match) {
      const q = clean(input);
      return q.length >= 2 ? { query: q } : { error: 'That looks too short. Try the full product name.' };
    }

    const url = parseUrl(match[0]);
    if (!url) return { error: 'That link looks broken. Paste it again.' };

    // Share text often carries the product title outside the URL.
    const outside = clean(input.replace(match[0], ' '));
    if (outside.length >= 6) return { query: outside };

    if (SHORT_HOSTS.test(url.hostname)) {
      return { error: 'Short links can\'t be read here. Open the link, then copy the full address from the browser, or type the product name.' };
    }

    for (const key of ['q', 'k', 'text', 'query', 'keyword']) {
      const v = url.searchParams.get(key);
      if (v && clean(v).length >= 2) return { query: clean(v) };
    }

    const segments = url.pathname.split('/').filter(Boolean).map(safeDecode);
    const slug = segments.find(seg =>
      seg.includes('-') && seg.length > 8 && !/^[A-Z0-9]{10}$/.test(seg) && !/^itm[a-z0-9]+$/i.test(seg)
    );
    if (slug) {
      const q = clean(slug);
      if (q.length >= 2) return { query: q };
    }

    return { error: 'Couldn\'t find a product name in that link. Type the product name instead.' };
  }

  if (typeof module !== 'undefined') module.exports = { extractQuery };
  if (typeof document === 'undefined') return;

  const searchBox = document.getElementById('link-input-a');
  const resultsContainer = document.getElementById('price-results');
  if (!searchBox || !resultsContainer) return;

  let compareBtn = document.getElementById('compare-btn');
  if (!compareBtn) {
    compareBtn = document.createElement('button');
    compareBtn.id = 'compare-btn';
    compareBtn.type = 'button';
    compareBtn.textContent = 'Compare prices';
    searchBox.insertAdjacentElement('afterend', compareBtn);
  }

  const status = document.createElement('p');
  status.className = 'qc-status';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  resultsContainer.insertAdjacentElement('beforebegin', status);

  const style = document.createElement('style');
  style.textContent = `
    #compare-btn{margin-top:.75rem;padding:.7rem 1.2rem;border-radius:12px;border:1px solid rgba(255,255,255,.2);background:rgba(37,99,235,.9);color:#fff;font-weight:600;cursor:pointer}
    #compare-btn:disabled{opacity:.6;cursor:progress}
    .qc-status{min-height:1.4em;margin:.75rem 0 0;font-size:.9rem;opacity:.85}
    .qc-status.qc-error{color:#f87171;opacity:1}
    .qc-card{flex:0 0 160px;scroll-snap-align:start;padding:14px;border-radius:16px;text-align:center;color:inherit;
      background:var(--card-bg,rgba(255,255,255,.08));border:1px solid var(--card-border,rgba(255,255,255,.18));
      -webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px)}
    .qc-card.qc-best{border:2px solid #22c55e}
    .qc-badge{display:inline-block;margin-bottom:6px;padding:2px 8px;border-radius:8px;font-size:.7rem;font-weight:600;background:#22c55e;color:#052e16}
    .qc-store{font-weight:600;margin-bottom:6px}
    .qc-price{font-size:1.15rem;font-weight:700;margin-bottom:10px}
    .qc-link{display:inline-block;padding:6px 12px;border-radius:8px;background:#2563eb;color:#fff;text-decoration:none;font-size:.85rem;font-weight:500}
    .qc-link:focus-visible{outline:2px solid #fff;outline-offset:2px}
  `;
  document.head.appendChild(style);

  const fmt = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
  let lastQuery = '';
  let runId = 0;

  function setStatus(msg, isError) {
    status.textContent = msg;
    status.classList.toggle('qc-error', !!isError);
  }

  async function fetchPrices(query) {
    if (!PRICE_API_URL) return null;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), API_TIMEOUT_MS);
    try {
      const res = await fetch(`${PRICE_API_URL}?q=${encodeURIComponent(query)}`, { signal: ctrl.signal });
      if (!res.ok) throw new Error('bad status');
      const data = await res.json();
      return data && typeof data.prices === 'object' ? data.prices : null;
    } catch (e) {
      return null;
    } finally {
      clearTimeout(timer);
    }
  }

  function buildCard(store, query, price, isBest) {
    const card = document.createElement('div');
    card.className = 'qc-card' + (isBest ? ' qc-best' : '');

    if (isBest) {
      const badge = document.createElement('span');
      badge.className = 'qc-badge';
      badge.textContent = 'Lowest';
      card.appendChild(badge);
    }

    const name = document.createElement('div');
    name.className = 'qc-store';
    name.textContent = store.name;

    const priceEl = document.createElement('div');
    priceEl.className = 'qc-price';
    priceEl.textContent = typeof price === 'number' ? fmt.format(price) : 'Check price';

    const link = document.createElement('a');
    link.className = 'qc-link';
    link.href = store.url(encodeURIComponent(query));
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'View deal';
    link.setAttribute('aria-label', `View ${query} on ${store.name}`);

    card.append(name, priceEl, link);
    return card;
  }

  async function render() {
    const { query, error } = extractQuery(searchBox.value);
    if (error) {
      resultsContainer.replaceChildren();
      lastQuery = '';
      setStatus(error, true);
      return;
    }
    if (query === lastQuery && resultsContainer.children.length) return;
    lastQuery = query;

    const myRun = ++runId;
    compareBtn.disabled = true;
    setStatus(PRICE_API_URL ? `Finding prices for "${query}"…` : `Showing stores for "${query}"`, false);

    const prices = await fetchPrices(query);
    if (myRun !== runId) return;

    let list = STORES.map(s => ({ store: s, price: prices && Number.isFinite(prices[s.name]) ? prices[s.name] : null }));
    let best = null;
    if (prices) {
      const priced = list.filter(x => x.price !== null);
      if (priced.length) best = Math.min(...priced.map(x => x.price));
      list.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
      setStatus(priced.length ? `Lowest price found: ${fmt.format(best)}` : `No live prices for "${query}". Use the store links.`, !priced.length);
    } else if (PRICE_API_URL) {
      setStatus('Live prices are unavailable right now. Use the store links.', true);
    }

    const frag = document.createDocumentFragment();
    list.forEach(x => frag.appendChild(buildCard(x.store, query, x.price, best !== null && x.price === best)));
    resultsContainer.replaceChildren(frag);
    resultsContainer.scrollLeft = 0;
    compareBtn.disabled = false;
  }

  compareBtn.addEventListener('click', render);
  searchBox.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); render(); } });
  searchBox.addEventListener('paste', () => setTimeout(render, 0));
})();

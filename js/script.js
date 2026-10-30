(function () {
  'use strict';

  // Optional: point this at your serverless endpoint that returns
  // { "prices": { "Amazon": 54999, "Flipkart": 53499, ... } } for ?q=<query>
  const PRICE_API_URL = '';
  const API_TIMEOUT_MS = 8000;
  const MAX_WORDS = 12;

  const SHORT_HOSTS = /(^|\.)(amzn\.in|amzn\.to|a\.co|dl\.flipkart\.com|fkrt\.it|fkrt\.cc)$/i;
  const NOISE = /take a look at this|check out|buy online|buy now|on flipkart|on amazon|flipkart\.com|amazon\.in|price in india|best price|online at/gi;

  // Croma's own search page is a JS app that often renders blank from outside links,
  // so it goes through a Google site: search, which always loads.
  const STORES = [
    { name: 'Amazon', domain: 'amazon.in', url: q => `https://www.amazon.in/s?k=${q}` },
    { name: 'Flipkart', domain: 'flipkart.com', url: q => `https://www.flipkart.com/search?q=${q}` },
    { name: 'Croma', domain: 'croma.com', url: q => `https://www.google.com/search?q=site%3Acroma.com+${q}` },
    { name: 'Reliance Digital', domain: 'reliancedigital.in', url: q => `https://www.reliancedigital.in/search?q=${q}` },
    { name: 'Tata CLiQ', domain: 'tatacliq.com', url: q => `https://www.tatacliq.com/search/?searchCategory=all&text=${q}` },
    { name: 'Vijay Sales', domain: 'vijaysales.com', url: q => `https://www.vijaysales.com/search/${q}` },
    { name: 'JioMart', domain: 'jiomart.com', url: q => `https://www.jiomart.com/search?q=${q}` },
    { name: 'Snapdeal', domain: 'snapdeal.com', url: q => `https://www.snapdeal.com/search?keyword=${q}` },
    { name: 'Meesho', domain: 'meesho.com', url: q => `https://www.meesho.com/search?q=${q}` },
    { name: 'Google Shopping', domain: 'google.com', url: q => `https://www.google.com/search?tbm=shop&q=${q}` }
  ];

  const COLORS = new Set(['black','white','blue','red','green','yellow','pink','purple','orange','grey','gray','silver','gold','golden','titanium','midnight','starlight','graphite','natural','desert','cream','violet','lavender','mint','teal','navy','beige','brown','bronze','phantom','onyx','obsidian']);
  const FILLER = new Set(['smartphone','mobile','phone','phones','latest','new','with','and','for','the','ram','rom','storage','gb','tb','mb','upto','off','sale','deal','buy','online','original','genuine']);

  // Keeps brand + model, drops colour / storage / filler so stores find the same product.
  function coreQuery(text) {
    const words = text.split(' ').filter(Boolean);
    const kept = [];
    for (let i = 0; i < words.length; i++) {
      const w = words[i].toLowerCase();
      const next = (words[i + 1] || '').toLowerCase();
      if (/^\d+$/.test(w) && /^(gb|tb|mb)$/.test(next)) { i++; continue; }
      if (/^\d+(gb|tb|mb)$/.test(w)) continue;
      if (COLORS.has(w) || FILLER.has(w)) continue;
      kept.push(words[i]);
    }
    const core = kept.slice(0, 7).join(' ').trim();
    return core.length >= 3 ? core : text;
  }

  function findAsin(url) {
    const m = url.pathname.match(/\/(?:dp|gp\/product|product)\/([A-Z0-9]{10})(?:[/?]|$)/i);
    return m ? m[1].toUpperCase() : '';
  }

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
      const q = coreQuery(clean(input));
      return q.length >= 2 ? { query: q } : { error: 'That looks too short. Try the full product name.' };
    }

    const url = parseUrl(match[0]);
    if (!url) return { error: 'That link looks broken. Paste it again.' };

    // Share text often carries the product title outside the URL.
    const asin = findAsin(url);
    const outside = clean(input.replace(match[0], ' '));
    if (outside.length >= 6) return { query: coreQuery(outside), asin };

    if (SHORT_HOSTS.test(url.hostname)) {
      return { error: 'Short links can\'t be read here. Open the link, then copy the full address from the browser, or type the product name.' };
    }

    for (const key of ['q', 'k', 'text', 'query', 'keyword']) {
      const v = url.searchParams.get(key);
      if (v && clean(v).length >= 2) return { query: coreQuery(clean(v)), asin };
    }

    const segments = url.pathname.split('/').filter(Boolean).map(safeDecode);
    const slug = segments.find(seg =>
      seg.includes('-') && seg.length > 8 && !/^[A-Z0-9]{10}$/.test(seg) && !/^itm[a-z0-9]+$/i.test(seg)
    );
    if (slug) {
      const q = coreQuery(clean(slug));
      if (q.length >= 2) return { query: q, asin };
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
    .qc-img{width:100%;height:84px;margin-bottom:10px;border-radius:10px;background:rgba(255,255,255,.9);display:flex;align-items:center;justify-content:center;overflow:hidden}
    .qc-img img{max-width:100%;max-height:100%;object-fit:contain}
    .qc-img img.qc-logo{width:36px;height:36px}
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
      return data && typeof data.prices === 'object' ? data : null;
    } catch (e) {
      return null;
    } finally {
      clearTimeout(timer);
    }
  }

  function buildImage(store, productImg) {
    const box = document.createElement('div');
    box.className = 'qc-img';
    const img = document.createElement('img');
    img.loading = 'lazy';
    img.alt = productImg ? 'Product image' : `${store.name} logo`;
    img.referrerPolicy = 'no-referrer';
    const showLogo = () => {
      img.onerror = null;
      img.className = 'qc-logo';
      img.alt = `${store.name} logo`;
      img.src = `https://www.google.com/s2/favicons?domain=${store.domain}&sz=64`;
    };
    if (productImg) {
      img.onerror = showLogo;
      img.src = productImg;
    } else {
      showLogo();
    }
    box.appendChild(img);
    return box;
  }

  function buildCard(store, query, price, isBest, productImg) {
    const card = document.createElement('div');
    card.className = 'qc-card' + (isBest ? ' qc-best' : '');
    card.appendChild(buildImage(store, productImg));

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
    const { query, error, asin } = extractQuery(searchBox.value);
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

    const data = await fetchPrices(query);
    if (myRun !== runId) return;
    const prices = data ? data.prices : null;
    const images = (data && data.images) || {};
    const sharedImg = (data && data.image) || (asin ? `https://m.media-amazon.com/images/P/${asin}.01._SCLZZZZZZZ_.jpg` : '');

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
    list.forEach(x => frag.appendChild(buildCard(x.store, query, x.price, best !== null && x.price === best, images[x.store.name] || sharedImg)));
    resultsContainer.replaceChildren(frag);
    resultsContainer.scrollLeft = 0;
    compareBtn.disabled = false;
  }

  compareBtn.addEventListener('click', render);
  searchBox.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); render(); } });
  searchBox.addEventListener('paste', () => setTimeout(render, 0));
})();

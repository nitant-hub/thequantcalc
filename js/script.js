(function () {
  'use strict';

  // Optional: point this at your serverless endpoint that returns
  // { "prices": { "Amazon": 54999, "Flipkart": 53499, ... } } for ?q=<query>
  const PRICE_API_URL = '';
  const API_TIMEOUT_MS = 8000;
  const MAX_WORDS = 12;

  const SHORT_HOSTS = /(^|\.)(amzn\.in|amzn\.to|a\.co|dl\.flipkart\.com|fkrt\.it|fkrt\.cc)$/i;
  const NOISE = /take a look at this|check out this|check out|buy online|buy now|on flipkart(\.com)?|on amazon(\.in|\.com)?|flipkart\.com|amazon\.in|price in india|best price|online at|at best price/gi;

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

  const COLORS = new Set(['black','white','blue','red','green','yellow','pink','purple','orange','grey','gray','silver','gold','golden','titanium','midnight','starlight','graphite','desert','violet','lavender','teal','navy','beige','brown','bronze','phantom','onyx','obsidian']);
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
      if (w.length === 1 && /[a-z]/.test(w)) continue;
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
    const slugs = segments.filter(seg =>
      seg.includes('-') && seg.length > 8 && !/^[A-Z0-9]{10}$/.test(seg) && !/^itm[a-z0-9]+$/i.test(seg)
    );
    const slug = slugs.sort((a, b) => b.length - a.length)[0];
    if (slug) {
      let tokens = clean(slug).split(' ');
      const last = tokens[tokens.length - 1] || '';
      if (tokens.length >= 4 && /^(?=.*\d)(?=.*[a-z])[a-z0-9]{6,}$/i.test(last)) tokens = tokens.slice(0, -1);
      const q = coreQuery(tokens.join(' '));
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

  if (!document.querySelector('.qc-hint')) {
    const hint = document.createElement('p');
    hint.className = 'qc-hint';
    hint.textContent = 'Paste an Amazon or Flipkart link, or type a product name.';
    compareBtn.insertAdjacentElement('afterend', hint);
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
    .qc-hint{margin:.5rem 0 0;font-size:.85rem;opacity:.7}
    .qc-status{min-height:1.4em;margin:.75rem 0 0;font-size:.9rem;opacity:.85}
    .qc-status.qc-error{color:#f87171;opacity:1}
    #price-results{display:flex;flex-direction:column;gap:.6rem;overflow:visible}
    .qc-hero{display:flex;gap:14px;align-items:center;padding:12px;border-radius:16px;
      background:var(--card-bg,rgba(255,255,255,.08));border:1px solid var(--card-border,rgba(255,255,255,.18))}
    .qc-img{width:96px;height:96px;flex:0 0 96px;border-radius:12px;background:#fff;display:flex;align-items:center;justify-content:center;overflow:hidden}
    .qc-img img{max-width:100%;max-height:100%;object-fit:contain}
    .qc-icon{font-size:2.6rem;line-height:1}
    .qc-title{font-weight:600;line-height:1.3;overflow-wrap:anywhere}
    .qc-sub{font-size:.8rem;opacity:.7;margin-top:4px}
    .qc-row{display:flex;align-items:center;gap:12px;padding:12px;border-radius:14px;text-decoration:none;color:inherit;
      background:var(--card-bg,rgba(255,255,255,.08));border:1px solid var(--card-border,rgba(255,255,255,.18));
      -webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px)}
    .qc-row.qc-best{border:2px solid #22c55e}
    .qc-row:focus-visible{outline:2px solid #60a5fa;outline-offset:2px}
    .qc-logo{width:38px;height:38px;flex:0 0 38px;border-radius:50%;background:#fff;color:#334155;font-weight:700;
      display:flex;align-items:center;justify-content:center;overflow:hidden}
    .qc-logo img{width:24px;height:24px}
    .qc-mid{flex:1;min-width:0}
    .qc-store{font-weight:600}
    .qc-note{font-size:.8rem;opacity:.7}
    .qc-right{text-align:right}
    .qc-price{font-weight:700;font-size:1.05rem}
    .qc-rel{font-size:.8rem;font-weight:600}
    .qc-rel.cheap{color:#22c55e}
    .qc-rel.high{color:#f87171}
    .qc-rel.same{opacity:.7}
    .qc-arrow{opacity:.6;font-size:1.2rem}
  `;
  document.head.appendChild(style);

  const fmt = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
  const CATEGORY_ICONS = [
    [/earbuds|airdopes|buds|headphone|earphone|neckband|headset|wh 1000/i, '\uD83C\uDFA7'],
    [/\btv\b|television|qled|oled|smart tv/i, '\uD83D\uDCFA'],
    [/laptop|macbook|notebook|thinkpad|vivobook|ideapad|chromebook/i, '\uD83D\uDCBB'],
    [/monitor|series|\binch\b|\bcm\b|display/i, '\uD83D\uDDA5\uFE0F'],
    [/smartwatch|watch|band|fitbit/i, '\u231A'],
    [/camera|gopro|canon|nikon|dslr/i, '\uD83D\uDCF7'],
    [/speaker|soundbar|echo|alexa/i, '\uD83D\uDD0A'],
    [/refrigerator|fridge/i, '\uD83E\uDDCA'],
    [/washing machine/i, '\uD83E\uDDFA'],
    [/air conditioner|\bac\b|split ac/i, '\u2744\uFE0F'],
    [/iphone|phone|galaxy|redmi|realme|oneplus|pixel|vivo|oppo|poco|tablet|ipad|\btab\b/i, '\uD83D\uDCF1']
  ];

  function categoryIcon(query) {
    for (const [re, ch] of CATEGORY_ICONS) if (re.test(query)) return ch;
    return '\uD83D\uDECD\uFE0F';
  }

  // Free Wikipedia lookup. Accepts a photo only when the article title closely matches the query.
  async function wikiImage(query) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 5000);
    try {
      const u = 'https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrlimit=1&prop=pageimages&piprop=thumbnail&pithumbsize=300&format=json&origin=*&gsrsearch=' + encodeURIComponent(query);
      const res = await fetch(u, { signal: ctrl.signal });
      if (!res.ok) return '';
      const data = await res.json();
      const pages = data.query && data.query.pages;
      if (!pages) return '';
      const page = Object.values(pages)[0];
      if (!page || !page.thumbnail) return '';
      const qWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 1);
      const tWords = new Set(page.title.toLowerCase().split(/[^a-z0-9]+/));
      const overlap = qWords.filter(w => tWords.has(w)).length;
      const need = Math.min(3, Math.max(2, Math.ceil(qWords.length / 2)));
      return overlap >= need ? page.thumbnail.source : '';
    } catch (e) {
      return '';
    } finally {
      clearTimeout(timer);
    }
  }

  let lastQuery = '';
  let runId = 0;

  function setStatus(msg, isError) {
    status.textContent = msg;
    status.classList.toggle('qc-error', !!isError);
  }

  async function fetchPrices(query, link) {
    if (!PRICE_API_URL) return null;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), API_TIMEOUT_MS);
    try {
      const extra = link ? `&url=${encodeURIComponent(link)}` : '';
      const res = await fetch(`${PRICE_API_URL}?q=${encodeURIComponent(query)}${extra}`, { signal: ctrl.signal });
      if (!res.ok) throw new Error('bad status');
      const data = await res.json();
      return data && typeof data.prices === 'object' ? data : null;
    } catch (e) {
      return null;
    } finally {
      clearTimeout(timer);
    }
  }

  function storeFromHost(host) {
    const h = (host || '').toLowerCase();
    if (/amazon|amzn|(^|\.)a\.co$/.test(h)) return 'Amazon';
    if (/flipkart|fkrt/.test(h)) return 'Flipkart';
    const hit = STORES.find(st => h === st.domain || h.endsWith('.' + st.domain));
    return hit ? hit.name : '';
  }

  function median(nums) {
    const a = nums.slice().sort((x, y) => x - y);
    const m = Math.floor(a.length / 2);
    return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
  }

  function loadImage(box, candidates) {
    let i = 0;
    const tryNext = () => {
      if (i >= candidates.length) return;
      const img = new Image();
      img.referrerPolicy = 'no-referrer';
      img.alt = 'Product image';
      img.onload = () => {
        if (img.naturalWidth <= 1) return tryNext();
        box.replaceChildren(img);
      };
      img.onerror = tryNext;
      img.src = candidates[i++];
    };
    tryNext();
  }

  function buildHero(title, candidates, iconChar, sub) {
    const hero = document.createElement('div');
    hero.className = 'qc-hero';
    const box = document.createElement('div');
    box.className = 'qc-img';
    const icon = document.createElement('span');
    icon.className = 'qc-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = iconChar;
    box.appendChild(icon);
    loadImage(box, candidates);

    const text = document.createElement('div');
    const t = document.createElement('div');
    t.className = 'qc-title';
    t.textContent = title;
    const st = document.createElement('div');
    st.className = 'qc-sub';
    st.textContent = sub;
    text.append(t, st);
    hero.append(box, text);
    return hero;
  }

  function buildLogo(store) {
    const logo = document.createElement('div');
    logo.className = 'qc-logo';
    logo.textContent = store.name.charAt(0);
    const img = new Image();
    img.alt = '';
    img.referrerPolicy = 'no-referrer';
    img.onload = () => { if (img.naturalWidth > 1) logo.replaceChildren(img); };
    img.src = `https://www.google.com/s2/favicons?domain=${store.domain}&sz=64`;
    return logo;
  }

  function buildRow(store, query, price, ref, isBest, isPasted) {
    const row = document.createElement('a');
    row.className = 'qc-row' + (isBest ? ' qc-best' : '');
    row.href = store.url(encodeURIComponent(query));
    row.target = '_blank';
    row.rel = 'noopener noreferrer';
    row.setAttribute('aria-label', `View ${query} on ${store.name}`);

    const mid = document.createElement('div');
    mid.className = 'qc-mid';
    const name = document.createElement('div');
    name.className = 'qc-store';
    name.textContent = store.name;
    const note = document.createElement('div');
    note.className = 'qc-note';
    note.textContent = isBest ? 'Lowest price' : (isPasted ? 'Your link' : 'View on store');
    mid.append(name, note);

    const right = document.createElement('div');
    right.className = 'qc-right';
    const priceEl = document.createElement('div');
    priceEl.className = 'qc-price';
    const has = typeof price === 'number';
    priceEl.textContent = has ? fmt.format(price) : 'Check price';
    right.appendChild(priceEl);

    if (has && ref && !isPasted) {
      const pct = Math.round(((price - ref) / ref) * 100);
      const rel = document.createElement('div');
      rel.className = 'qc-rel ' + (pct < 0 ? 'cheap' : pct > 0 ? 'high' : 'same');
      rel.textContent = pct === 0 ? 'Same price' : `${Math.abs(pct)}% ${pct < 0 ? 'Cheaper' : 'Higher'}`;
      right.appendChild(rel);
    }

    const arrow = document.createElement('span');
    arrow.className = 'qc-arrow';
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '›';

    row.append(buildLogo(store), mid, right, arrow);
    return row;
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

    const linkMatch = searchBox.value.match(/https?:\/\/[^\s]+/i);
    const pastedUrl = linkMatch ? linkMatch[0] : '';
    let pastedStore = '';
    try { pastedStore = pastedUrl ? storeFromHost(new URL(pastedUrl).hostname) : ''; } catch (e) { /* ignore */ }

    const [data, wiki] = await Promise.all([fetchPrices(query, pastedUrl), wikiImage(query)]);
    if (myRun !== runId) return;

    const prices = data ? data.prices : null;
    const images = (data && data.images) || {};
    const amazonGuess = asin ? `https://m.media-amazon.com/images/P/${asin}.01._SCLZZZZZZZ_.jpg` : '';
    const photos = [data && data.image, ...Object.values(images), amazonGuess, wiki].filter(Boolean);
    const iconChar = categoryIcon(query);
    const title = (data && data.title) || query;

    const list = STORES.map((s, idx) => ({
      store: s, idx,
      price: prices && Number.isFinite(prices[s.name]) ? prices[s.name] : null
    }));
    list.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity) || a.idx - b.idx);

    const priced = list.filter(x => x.price !== null);
    const best = priced.length ? priced[0].price : null;
    let ref = null;
    if (priced.length) {
      const pastedPrice = pastedStore && prices ? prices[pastedStore] : null;
      ref = Number.isFinite(pastedPrice) ? pastedPrice : median(priced.map(x => x.price));
    }

    if (prices) {
      setStatus(priced.length ? `Lowest price found: ${fmt.format(best)}` : `No live prices for "${query}". Use the store links.`, !priced.length);
    } else if (PRICE_API_URL) {
      setStatus('Live prices are unavailable right now. Use the store links.', true);
    }

    const sub = priced.length
      ? `Compared with ${pastedStore && prices && Number.isFinite(prices[pastedStore]) ? pastedStore : 'the middle price'}`
      : `Search ${STORES.length} stores`;

    const frag = document.createDocumentFragment();
    frag.appendChild(buildHero(title, photos, iconChar, sub));
    list.forEach(x => frag.appendChild(
      buildRow(x.store, query, x.price, ref, best !== null && x.price === best, !!pastedStore && x.store.name === pastedStore)
    ));
    resultsContainer.replaceChildren(frag);
    compareBtn.disabled = false;
  }

  compareBtn.addEventListener('click', render);
  searchBox.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); render(); } });
  searchBox.addEventListener('paste', () => setTimeout(render, 0));
})();

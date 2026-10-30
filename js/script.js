const searchBox = document.getElementById('link-input-a');
const compareBtn = document.getElementById('compare-btn');
const resultsContainer = document.getElementById('price-results');

const stores = ['Amazon', 'Flipkart', 'Croma', 'Tata Neu'];

function renderCards() {
  const rawInput = searchBox.value.trim();

  if (rawInput.length > 0) {
    resultsContainer.innerHTML = ''; // Clear old results

    let cleanQuery = rawInput;
    if (rawInput.includes('http')) {
      try {
        const urlObj = new URL(rawInput);
        const segments = urlObj.pathname.split('/').filter(Boolean);
        const textSegment = segments.find(seg => seg.length > 10 && !seg.includes('dp') && !seg.includes('p')) || '';
        cleanQuery = textSegment ? textSegment.replace(/[-_]/g, ' ') : rawInput;
      } catch (e) {
        cleanQuery = rawInput;
      }
    }

    cleanQuery = cleanQuery
      .replace(/take a look at this|check out|buy online|on flipkart|on amazon|price in india/gi, '')
      .replace(/https?:\/\/[^\s]+/gi, '')
      .replace(/[^\w\s]/gi, ' ')
      .trim();

    if (!cleanQuery || cleanQuery.length < 3) {
      cleanQuery = rawInput.replace(/https?:\/\/[^\s]+/gi, '').trim() || "electronics";
    }

    const encodedQuery = encodeURIComponent(cleanQuery);

    stores.forEach(store => {
      const card = document.createElement('div');
      card.style.cssText = `
        min-width: 150px;
        padding: 14px;
        background: #ffffff;
        border: 2px solid #cbd5e1;
        border-radius: 12px;
        text-align: center;
        flex-shrink: 0;
        color: #0f172a;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      `;

      let storeUrl = "#";
      if (store === 'Amazon') {
        storeUrl = `https://www.amazon.in/s?k=${encodedQuery}`;
      } else if (store === 'Flipkart') {
        storeUrl = `https://www.flipkart.com/search?q=${encodedQuery}`;
      } else if (store === 'Croma') {
        storeUrl = `https://www.croma.com/search/?text=${encodedQuery}`; // Fixed Croma search query string
      } else {
        storeUrl = `https://www.google.com/search?q=${encodeURIComponent(store + ' ' + cleanQuery)}`;
      }
      
      card.innerHTML = `
        <div style="width: 100%; height: 70px; background: #f1f5f9; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-bottom: 10px; font-size: 0.75rem; color: #64748b; font-weight: 600;">Product View</div>
        <div style="font-weight: bold; margin-bottom: 6px; color: #0f172a; font-size: 0.95rem;">${store}</div>
        <div style="color: #16a34a; font-size: 1.1rem; font-weight: bold; margin-bottom: 10px;">₹---</div>
        <a href="${storeUrl}" target="_blank" style="background: #2563eb; color: white; padding: 5px 10px; border-radius: 6px; text-decoration: none; font-size: 0.8rem; display: inline-block; font-weight: 500;">View Deal</a>
      `;
      
      resultsContainer.appendChild(card);
    });
  }
}

if (compareBtn) {
  compareBtn.addEventListener('click', renderCards);
}

if (searchBox) {
  searchBox.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      renderCards();
    }
  });
}

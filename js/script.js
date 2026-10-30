const searchBox = document.getElementById('link-input-a');
const compareBtn = document.getElementById('compare-btn');
const resultsContainer = document.getElementById('price-results');

const stores = ['Amazon', 'Flipkart', 'Croma', 'Tata Neu'];

function renderCards() {
  const rawInput = searchBox.value.trim();

  if (rawInput.length > 0) {
    resultsContainer.innerHTML = ''; // Clear old results

    // Smart cleaning: remove promotional phrases and long URL parameters if a URL was pasted
    let cleanQuery = rawInput;
    
    // If it's a URL, try to pull a readable search slug or fallback to cleaning text
    if (rawInput.includes('http')) {
      try {
        const urlObj = new URL(rawInput);
        // Extract meaningful path segments if possible, or use standard text cleanup
        const segments = urlObj.pathname.split('/').filter(Boolean);
        const textSegment = segments.find(seg => seg.length > 10 && !seg.includes('dp') && !seg.includes('p')) || '';
        cleanQuery = textSegment ? textSegment.replace(/[-_]/g, ' ') : rawInput;
      } catch (e) {
        cleanQuery = rawInput;
      }
    }

    // Clean up conversational filler words
    cleanQuery = cleanQuery
      .replace(/take a look at this|check out|buy online|on flipkart|on amazon|price in india/gi, '')
      .replace(/https?:\/\/[^\s]+/gi, '') // remove raw URLs if mixed in
      .replace(/[^\w\s]/gi, ' ') // Replace symbols with spaces
      .trim();

    if (!cleanQuery || cleanQuery.length < 3) {
      cleanQuery = rawInput.replace(/https?:\/\/[^\s]+/gi, '').trim() || "electronics";
    }

    const encodedQuery = encodeURIComponent(cleanQuery);

    stores.forEach(store => {
      const card = document.createElement('div');
      card.style.cssText = `
        min-width: 140px;
        padding: 16px;
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
        storeUrl = `https://www.croma.com/searchB?q=${encodedQuery}`;
      } else {
        storeUrl = `https://www.google.com/search?q=${encodeURIComponent(store + ' ' + cleanQuery)}`;
      }
      
      card.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 8px; color: #0f172a; font-size: 1rem;">${store}</div>
        <div style="color: #16a34a; font-size: 1.2rem; font-weight: bold; margin-bottom: 12px;">₹---</div>
        <a href="${storeUrl}" target="_blank" style="background: #2563eb; color: white; padding: 6px 12px; border-radius: 6px; text-decoration: none; font-size: 0.85rem; display: inline-block; font-weight: 500;">View Deal</a>
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

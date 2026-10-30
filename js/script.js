const searchBox = document.getElementById('link-input-a');
const compareBtn = document.getElementById('compare-btn');
const resultsContainer = document.getElementById('price-results');

const stores = ['Amazon', 'Flipkart', 'Croma', 'Tata Neu'];

function renderCards() {
  const pastedUrl = searchBox.value.trim();

  if (pastedUrl.length > 0) {
    resultsContainer.innerHTML = ''; // Clear old results

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

      // Generate a smart deep-link search fallback URL for each store
      let storeUrl = "#";
      const encodedQuery = encodeURIComponent(pastedUrl);
      
      if (store === 'Amazon') {
        storeUrl = `https://www.amazon.in/s?k=${encodedQuery}`;
      } else if (store === 'Flipkart') {
        storeUrl = `https://www.flipkart.com/search?q=${encodedQuery}`;
      } else if (store === 'Croma') {
        storeUrl = `https://www.croma.com/searchB?q=${encodedQuery}`;
      } else {
        storeUrl = `https://www.google.com/search?q=${encodeURIComponent(store + ' ' + pastedUrl)}`;
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

// Trigger when clicking the button
if (compareBtn) {
  compareBtn.addEventListener('click', renderCards);
}

// Also trigger when pressing Enter on mobile keyboard
if (searchBox) {
  searchBox.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      renderCards();
    }
  });
}

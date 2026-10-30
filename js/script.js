async function initializeStores() {
  try {
    const response = await fetch('/location');
    const data = await response.json();
    return data.stores;
  } catch (error) {
    console.error("Location API failed, falling back to default.", error);
    return ['Amazon', 'Flipkart', 'Croma', 'Tata Neu']; 
  }
}

initializeStores();

const searchBox = document.getElementById('link-input-a');
const resultsContainer = document.getElementById('price-results');

if (searchBox && resultsContainer) {
  searchBox.addEventListener('input', async (event) => {
    const pastedUrl = event.target.value.trim();

    if (pastedUrl.includes('http')) {
      resultsContainer.innerHTML = ''; 

      const stores = await initializeStores();

      stores.forEach(store => {
        const card = document.createElement('div');
        // Added solid background, strong border, and clear text color
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
        
        card.innerHTML = `
          <div style="font-weight: bold; margin-bottom: 8px; color: #0f172a; font-size: 1rem;">${store}</div>
          <div style="color: #16a34a; font-size: 1.2rem; font-weight: bold; margin-bottom: 12px;">₹---</div>
          <a href="#" style="background: #2563eb; color: white; padding: 6px 12px; border-radius: 6px; text-decoration: none; font-size: 0.85rem; display: inline-block; font-weight: 500;">View Deal</a>
        `;
        
        resultsContainer.appendChild(card);
      });
    }
  });
}

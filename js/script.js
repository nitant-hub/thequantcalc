// 1. Fetch regional stores using Cloudflare Geo-Location backend
async function initializeStores() {
  try {
    const response = await fetch('/location');
    const data = await response.json();
    console.log("User Country:", data.country);
    console.log("Active Stores:", data.stores);
    return data.stores;
  } catch (error) {
    console.error("Location API failed, falling back to default.", error);
    return ['Amazon', 'Flipkart', 'Croma', 'Tata Neu']; 
  }
}

// Execute location check on load
initializeStores();

// 2. Listen for link paste input and render Bento cards
const searchBox = document.getElementById('link-input-a');
const resultsContainer = document.getElementById('price-results');

if (searchBox && resultsContainer) {
  searchBox.addEventListener('input', async (event) => {
    const pastedUrl = event.target.value.trim();

    // Trigger when a valid URL is pasted
    if (pastedUrl.includes('http')) {
      resultsContainer.innerHTML = ''; // Clear old results

      // Get active stores for the user's region
      const stores = await initializeStores();

      // Create a clean dark-mode Bento card for each store
      stores.forEach(store => {
        const card = document.createElement('div');
        card.style.cssText = `
          min-width: 140px;
          padding: 16px;
          background: #1e293b;
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          text-align: center;
          flex-shrink: 0;
          color: #ffffff;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        `;
        
        card.innerHTML = `
          <div style="font-weight: bold; margin-bottom: 8px; color: #ffffff;">${store}</div>
          <div style="color: #4ade80; font-size: 1.1rem; font-weight: bold; margin-bottom: 12px;">₹---</div>
          <a href="#" style="background: #3b82f6; color: white; padding: 6px 12px; border-radius: 6px; text-decoration: none; font-size: 0.9rem; display: inline-block;">View Deal</a>
        `;
        
        resultsContainer.appendChild(card);
      });
    }
  });
}

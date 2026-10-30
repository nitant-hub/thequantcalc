async function initializeStores() {
  try {
    // 1. Call your Cloudflare function
    const response = await fetch('/location');
    const data = await response.json();
    
    // 2. See the result in the browser console (for testing)
    console.log("User Country:", data.country);
    console.log("Active Stores:", data.stores);
    
    // 3. Return the array to build your Bento grid later
    return data.stores;
    
  } catch (error) {
    console.error("Location API failed, falling back to default.", error);
    // Global fallback if the fetch fails
    return ['Amazon', 'Flipkart', 'Croma']; 
  }
}

// Execute the check as soon as the file loads
initializeStores();

// --- ADD THIS BELOW YOUR EXISTING CODE ---

const searchBox = document.getElementById('link-input-a');
const resultsContainer = document.getElementById('price-results');

if (searchBox) {
  searchBox.addEventListener('input', async (event) => {
    const pastedUrl = event.target.value.trim();

    if (pastedUrl.includes('http')) {
      resultsContainer.innerHTML = ''; // Clear old cards

      // Get the stores (either from Cloudflare or the fallback)
      const stores = await initializeStores();

      // Create a Bento card for each store
      stores.forEach(store => {
        const card = document.createElement('div');
        card.style.cssText = `
          min-width: 120px;
          padding: 15px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          text-align: center;
          flex-shrink: 0;
          backdrop-filter: blur(10px);
          color: white;
        `;
        
        card.innerHTML = `
          <div style="font-weight: bold; margin-bottom: 8px;">${store}</div>
          <div style="color: #4ade80; font-size: 1.1rem; margin-bottom: 12px;">₹---</div>
          <a href="#" style="background: rgba(255,255,255,0.1); padding: 5px 10px; border-radius: 6px; text-decoration: none; color: white; display: inline-block;">View Deal</a>
        `;
        
        resultsContainer.appendChild(card);
      });
    }
  });
}

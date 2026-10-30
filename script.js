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
    return ['Amazon']; 
  }
}

// Execute the check as soon as the file loads
initializeStores();

export async function onRequest(context) {
  const country = context.request.cf?.country || 'IN';
  let stores = [];

  if (country === 'IN') {
    stores = ['Amazon', 'Flipkart', 'Croma'];
  } else if (country === 'US') {
    stores = ['Amazon', 'BestBuy', 'Walmart'];
  } else {
    stores = ['Amazon'];
  }

  return new Response(JSON.stringify({ country: country, stores: stores }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

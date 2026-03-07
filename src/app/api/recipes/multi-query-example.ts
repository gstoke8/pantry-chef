// Example: Fetch recipes from multiple queries
async function fetchDiverseRecipes(pantryItems: string[]) {
  const queries = [
    buildSearchQuery(pantryItems), // Your current query
    'chicken dinner',              // Generic chicken
    'pasta',                       // Pasta dishes
    'rice bowl',                   // Rice dishes
    'salad',                       // Salads
    'soup',                        // Soups
    'stir fry',                    // Stir fry
    'curry',                       // Curries
  ];
  
  const allRecipes = [];
  
  for (const query of queries.slice(0, 3)) { // Limit to 3 queries to save API calls
    const params = new URLSearchParams({
      type: 'public',
      q: query,
      app_id: EDAMAM_APP_ID,
      app_key: EDAMAM_APP_KEY,
      from: '0',
      to: '20', // 20 per query
    });
    
    const response = await fetch(`${EDAMAM_BASE_URL}?${params}`);
    const data = await response.json();
    allRecipes.push(...(data.hits || []));
  }
  
  // Remove duplicates and calculate match
  const uniqueRecipes = removeDuplicates(allRecipes);
  return uniqueRecipes;
}

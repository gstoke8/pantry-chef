import { NextRequest, NextResponse } from 'next/server';

const EDAMAM_BASE_URL = 'https://api.edamam.com/api/recipes/v2';

// Priority categories for broad search query
const HIGH_PRIORITY_KEYWORDS = [
  // Proteins
  'chicken', 'beef', 'pork', 'fish', 'salmon', 'tuna', 'shrimp', 'tofu', 'eggs',
  // Starches
  'rice', 'pasta', 'noodles', 'potato', 'bread', 'quinoa', 'couscous',
  // Produce (vegetables and fruits)
  'tomato', 'onion', 'garlic', 'pepper', 'carrot', 'broccoli', 'spinach', 'lettuce',
  'mushroom', 'zucchini', 'cucumber', 'celery', 'corn', 'beans', 'apple', 'banana',
  'lemon', 'lime', 'orange', 'berry', 'strawberry', 'blueberry', 'avocado',
];

// Get pantry items for reverse matching
function getPantrySet(pantryItems: string[]): Set<string> {
  return new Set(pantryItems.map(item => item.toLowerCase().trim()));
}

// Check if recipe ingredient matches pantry item (fuzzy matching)
function ingredientInPantry(ingredientName: string, pantrySet: Set<string>): boolean {
  const lowerIng = ingredientName.toLowerCase().trim();
  
  // Direct match
  if (pantrySet.has(lowerIng)) return true;
  
  // Check if any pantry item contains this ingredient or vice versa
  for (const pantryItem of pantrySet) {
    // Check for partial matches (e.g., "chicken breast" matches "chicken")
    if (lowerIng.includes(pantryItem) || pantryItem.includes(lowerIng)) {
      return true;
    }
    
    // Check for common variations
    const variations: Record<string, string[]> = {
      'chicken': ['chicken breast', 'chicken thighs', 'rotisserie chicken'],
      'eggs': ['egg', 'large eggs'],
      'butter': ['unsalted butter', 'salted butter'],
      'oil': ['olive oil', 'vegetable oil', 'cooking oil'],
      'garlic': ['garlic cloves', 'minced garlic'],
      'onion': ['yellow onion', 'red onion', 'onions'],
    };
    
    for (const [base, variants] of Object.entries(variations)) {
      if ((lowerIng === base || variants.some(v => lowerIng.includes(v))) &&
          (pantryItem === base || variants.some(v => pantryItem.includes(v)))) {
        return true;
      }
    }
  }
  
  return false;
}

// Calculate match percentage between recipe and pantry
function calculateMatchPercentage(
  recipeIngredients: Array<{ food: string }>,
  pantrySet: Set<string>
): { percentage: number; matched: string[]; missing: string[] } {
  const matched: string[] = [];
  const missing: string[] = [];
  
  for (const ing of recipeIngredients) {
    const food = ing.food || '';
    if (ingredientInPantry(food, pantrySet)) {
      matched.push(food);
    } else {
      missing.push(food);
    }
  }
  
  const percentage = recipeIngredients.length > 0 
    ? Math.round((matched.length / recipeIngredients.length) * 100)
    : 0;
  
  return { percentage, matched, missing };
}

// Build broad search query from pantry (proteins, starches, and produce)
function buildSearchQuery(pantryItems: string[]): string {
  // Map specific items to broader base terms for better search results
  const broadenedItems = pantryItems.map(item => {
    const lower = item.toLowerCase();
    // Simplify specific items to base ingredients
    if (lower.includes('chicken')) return 'chicken';
    if (lower.includes('beef')) return 'beef';
    if (lower.includes('pork')) return 'pork';
    if (lower.includes('egg')) return 'eggs';
    if (lower.includes('broth') || lower.includes('stock')) return null; // Skip broths/stocks
    if (lower.includes('breadcrumbs') || lower.includes('panko')) return null; // Skip breadcrumbs
    return item;
  }).filter((item): item is string => item !== null);
  
  const prioritizedItems = broadenedItems.filter(item => {
    const lower = item.toLowerCase();
    return HIGH_PRIORITY_KEYWORDS.some(keyword => lower.includes(keyword));
  });
  
  // Take top 4-5 items for broader, more diverse search
  // Use unique values only
  const uniqueItems = [...new Set(prioritizedItems)];
  return uniqueItems.slice(0, 5).join(' ') || 'dinner';
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const ingredients = searchParams.get('ingredients');
  const number = searchParams.get('number') || '20';
  const minMatchPercentage = parseInt(searchParams.get('minMatch') || '30');
  
  // Get env vars at request time (not module load)
  const EDAMAM_APP_ID = process.env.NEXT_PUBLIC_EDAMAM_APP_ID || '';
  const EDAMAM_APP_KEY = process.env.NEXT_PUBLIC_EDAMAM_APP_KEY || '';

  console.log('API Request received:', { 
    ingredients: ingredients?.substring(0, 50),
    number,
    minMatchPercentage,
    hasAppId: !!EDAMAM_APP_ID,
    hasAppKey: !!EDAMAM_APP_KEY,
  });

  if (!ingredients) {
    return NextResponse.json(
      { error: 'Ingredients parameter is required' },
      { status: 400 }
    );
  }

  // Check if API keys are configured
  if (!EDAMAM_APP_ID || !EDAMAM_APP_KEY) {
    console.error('API keys not configured');
    return NextResponse.json(
      { 
        error: 'Edamam API keys not configured',
        debug: {
          hasAppId: !!EDAMAM_APP_ID,
          hasAppKey: !!EDAMAM_APP_KEY,
        }
      },
      { status: 503 }
    );
  }

  try {
    // Parse pantry ingredients
    const pantryItems = ingredients.split(',').map(i => i.trim()).filter(i => i.length > 0);
    const pantrySet = getPantrySet(pantryItems);
    
    // Build BROAD search query (not specific ingredients)
    const searchQuery = buildSearchQuery(pantryItems);
    
    console.log('Pantry items:', pantryItems.length);
    console.log('Search query:', searchQuery);
    
    // Request more recipes to filter down
    const requestedCount = Math.min(parseInt(number) || 20, 100);
    
    const params = new URLSearchParams({
      type: 'public',
      q: searchQuery,
      app_id: EDAMAM_APP_ID,
      app_key: EDAMAM_APP_KEY,
      from: '0',
      to: requestedCount.toString(),
    });

    const apiUrl = `${EDAMAM_BASE_URL}?${params}`;
    console.log('Fetching from Edamam:', apiUrl);

    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Edamam API error:', response.status, errorText);
      return NextResponse.json(
        { 
          error: `Edamam API error: ${response.status}`, 
          details: errorText,
          status: response.status,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Edamam returned', data.hits?.length || 0, 'recipes');
    
    // Calculate match percentages for all recipes
    const scoredRecipes = data.hits?.map((hit: any) => {
      const recipe = hit.recipe;
      const nutrients = recipe.totalNutrients || {};
      const yield_ = recipe.yield || 1;
      
      // Calculate pantry match
      const matchInfo = calculateMatchPercentage(recipe.ingredients || [], pantrySet);
      
      return {
        id: recipe.uri.split('#')[1] || Math.random().toString(),
        title: recipe.label,
        image: recipe.image,
        url: recipe.url,
        source: recipe.source,
        // Full ingredient info for display
        ingredients: recipe.ingredients.map((ing: any) => ({
          name: ing.food,
          amount: ing.quantity || 1,
          unit: ing.measure || 'item',
          original: ing.text,
          inPantry: ingredientInPantry(ing.food, pantrySet),
        })),
        ingredientLines: recipe.ingredientLines,
        // Match information
        matchInfo: {
          percentage: matchInfo.percentage,
          matchedCount: matchInfo.matched.length,
          totalCount: matchInfo.matched.length + matchInfo.missing.length,
          matchedIngredients: matchInfo.matched.slice(0, 5),
          missingIngredients: matchInfo.missing.slice(0, 5),
        },
        // Nutrition
        nutrition: {
          calories: Math.round((recipe.calories || 0) / yield_),
          protein: Math.round((nutrients.PROCNT?.quantity || 0) / yield_ * 10) / 10,
          carbs: Math.round((nutrients.CHOCDF?.quantity || 0) / yield_ * 10) / 10,
          fat: Math.round((nutrients.FAT?.quantity || 0) / yield_ * 10) / 10,
        },
        // Labels
        dietLabels: recipe.dietLabels || [],
        healthLabels: recipe.healthLabels || [],
        cuisineType: recipe.cuisineType || [],
        mealType: recipe.mealType || [],
        prep_time: recipe.totalTime || null,
        servings: yield_,
        source_id: 'edamam',
      };
    }) || [];

    // Sort by match percentage (highest first)
    scoredRecipes.sort((a: any, b: any) => b.matchInfo.percentage - a.matchInfo.percentage);
    
    // Filter to only show recipes above minimum match threshold
    const filteredRecipes = scoredRecipes.filter((r: any) => r.matchInfo.percentage >= minMatchPercentage);
    
    console.log(`Returning ${filteredRecipes.length} recipes (filtered from ${scoredRecipes.length}, min ${minMatchPercentage}% match)`);

    return NextResponse.json({ 
      recipes: filteredRecipes, 
      count: filteredRecipes.length,
      totalFetched: scoredRecipes.length,
      source: 'edamam',
      query: searchQuery,
      pantryItems: pantryItems.length,
      matchThreshold: minMatchPercentage,
      // Show match distribution
      matchStats: {
        '90%+': scoredRecipes.filter((r: any) => r.matchInfo.percentage >= 90).length,
        '70-89%': scoredRecipes.filter((r: any) => r.matchInfo.percentage >= 70 && r.matchInfo.percentage < 90).length,
        '50-69%': scoredRecipes.filter((r: any) => r.matchInfo.percentage >= 50 && r.matchInfo.percentage < 70).length,
        '<50%': scoredRecipes.filter((r: any) => r.matchInfo.percentage < 50).length,
      },
    });

  } catch (error) {
    console.error('Error fetching recipes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recipes', details: (error as Error).message },
      { status: 500 }
    );
  }
}

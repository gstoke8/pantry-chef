import { NextRequest, NextResponse } from 'next/server';

const EDAMAM_BASE_URL = 'https://api.edamam.com/api/recipes/v2';

// Priority categories for ingredient selection
// We want to pick ingredients that are most likely to appear together in recipes
const HIGH_PRIORITY_KEYWORDS = [
  // Proteins
  'chicken', 'beef', 'pork', 'fish', 'salmon', 'tuna', 'shrimp', 'tofu', 'eggs',
  // Starches
  'rice', 'pasta', 'noodles', 'potato', 'bread', 'quinoa', 'couscous',
  // Main vegetables
  'tomato', 'onion', 'garlic', 'pepper', 'carrot', 'broccoli', 'spinach',
  // Common bases
  'cheese', 'milk', 'cream', 'yogurt', 'butter'
];

const LOW_PRIORITY_KEYWORDS = [
  // Oils and vinegars (too generic, won't help matching)
  'oil', 'vinegar', 'sauce', 'salt', 'pepper', 'sugar', 'water',
  // Very specific items that rarely match
  'blood orange', 'relish', 'glaze', 'chili oil', 'hot sauce'
];

// Score ingredients by how likely they are to yield good recipe matches
function scoreIngredient(name: string): number {
  const lower = name.toLowerCase();
  
  // High priority
  for (const keyword of HIGH_PRIORITY_KEYWORDS) {
    if (lower.includes(keyword)) return 10;
  }
  
  // Medium priority (most vegetables, common items)
  if (lower.length > 3) return 5;
  
  // Low priority
  for (const keyword of LOW_PRIORITY_KEYWORDS) {
    if (lower.includes(keyword)) return 1;
  }
  
  return 3; // Default
}

// Smart ingredient selection - pick the best 8-10 ingredients
function selectBestIngredients(ingredients: string[]): string[] {
  // Score and sort
  const scored = ingredients.map(name => ({
    name,
    score: scoreIngredient(name)
  }));
  
  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);
  
  // Take top 8 (better to use fewer high-quality ingredients than many low-quality ones)
  const selected = scored.slice(0, 8).map(i => i.name);
  
  console.log('Ingredient selection:', {
    total: ingredients.length,
    selected: selected,
    topScores: scored.slice(0, 10).map(i => `${i.name}(${i.score})`)
  });
  
  return selected;
}

// Edamam paid tier features:
// - Up to 100 results per call (vs 20 on free)
// - Advanced filters: cuisineType, mealType, diet, health, dishType
// - 100k+ calls/month (vs 10k on free)

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const ingredients = searchParams.get('ingredients');
  const number = searchParams.get('number') || '20'; // Increased default for paid tier
  
  // New paid tier filters
  const cuisineType = searchParams.get('cuisineType');
  const mealType = searchParams.get('mealType');
  const diet = searchParams.get('diet');
  const health = searchParams.get('health');
  const dishType = searchParams.get('dishType');
  const time = searchParams.get('time'); // max cooking time in minutes
  const calories = searchParams.get('calories'); // max calories per serving

  // Get env vars at request time (not module load)
  const EDAMAM_APP_ID = process.env.NEXT_PUBLIC_EDAMAM_APP_ID || '';
  const EDAMAM_APP_KEY = process.env.NEXT_PUBLIC_EDAMAM_APP_KEY || '';

  console.log('API Request received:', { 
    ingredients: ingredients?.substring(0, 50),
    number,
    cuisineType,
    mealType,
    diet,
    health,
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
    console.error('API keys not configured:', {
      appIdPresent: !!EDAMAM_APP_ID,
      appKeyPresent: !!EDAMAM_APP_KEY,
      appIdValue: EDAMAM_APP_ID ? `${EDAMAM_APP_ID.substring(0, 4)}...` : 'empty',
      allEnvVars: Object.keys(process.env).filter(k => k.includes('EDAMAM') || k.includes('PUBLIC')),
    });
    return NextResponse.json(
      { 
        error: 'Edamam API keys not configured in Vercel environment variables',
        debug: {
          hasAppId: !!EDAMAM_APP_ID,
          hasAppKey: !!EDAMAM_APP_KEY,
          availableEnvVars: Object.keys(process.env).filter(k => k.includes('EDAMAM')),
          help: 'Go to Vercel Dashboard → Settings → Environment Variables and add NEXT_PUBLIC_EDAMAM_APP_ID and NEXT_PUBLIC_EDAMAM_APP_KEY',
        }
      },
      { status: 503 }
    );
  }

  try {
    // Parse ingredients - they come as comma-separated from the frontend
    const ingredientArray = ingredients.split(',').map(i => i.trim()).filter(i => i.length > 0);
    
    // Use smart selection to pick the best ingredients
    const selectedIngredients = selectBestIngredients(ingredientArray);
    const ingredientList = selectedIngredients.join(' ');
    
    console.log('Ingredient debug:', {
      raw: ingredients.substring(0, 100),
      parsed: ingredientArray,
      selected: selectedIngredients,
      query: ingredientList,
      count: ingredientArray.length,
    });
    
    // Request more recipes (paid tier supports up to 100)
    const requestedCount = Math.min(parseInt(number) || 20, 100);
    
    // Build params - note: random param may not work on all Edamam tiers
    const params = new URLSearchParams({
      type: 'public',
      q: ingredientList,
      app_id: EDAMAM_APP_ID,
      app_key: EDAMAM_APP_KEY,
      from: '0',
      to: requestedCount.toString(),
    });
    
    // Only add random if not using filters (some tiers restrict this)
    if (!cuisineType && !mealType && !diet && !health) {
      params.append('random', 'true');
    }

    // Add paid tier filter parameters
    if (cuisineType) params.append('cuisineType', cuisineType);
    if (mealType) params.append('mealType', mealType);
    if (diet) params.append('diet', diet);
    if (health) params.append('health', health);
    if (dishType) params.append('dishType', dishType);
    if (time) params.append('time', `0-${time}`); // Range format: 0-30 for under 30 min
    if (calories) params.append('calories', `0-${calories}`); // Range format

    const apiUrl = `${EDAMAM_BASE_URL}?${params}`;
    console.log('Fetching from Edamam:', apiUrl.substring(0, 200));

    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'Edamam-Account-User': 'pantry-chef-user',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Edamam API error:', response.status, errorText);
      
      // Provide helpful error messages for common issues
      let userMessage = `Edamam API error: ${response.status}`;
      let troubleshooting = 'Visit /api/debug/simple to check your configuration';
      
      if (response.status === 401) {
        const isHeaderIssue = errorText.includes('userID') || errorText.includes('Edamam-Account-User');
        if (isHeaderIssue) {
          userMessage = 'Edamam API: User header issue. The app may need a different header configuration.';
        } else {
          userMessage = 'Edamam API authentication failed. The API keys may be incorrect or the Developer plan is not active.';
        }
        troubleshooting += `. Error details: ${errorText.substring(0, 100)}`;
      } else if (response.status === 403) {
        userMessage = 'Edamam API access denied. Your plan may have expired or rate limit exceeded.';
      } else if (response.status === 429) {
        userMessage = 'Edamam API rate limit exceeded. Please wait a moment and try again.';
      }
      
      return NextResponse.json(
        { 
          error: userMessage, 
          details: errorText,
          status: response.status,
          troubleshooting,
          appIdPrefix: EDAMAM_APP_ID.substring(0, 4) + '...',
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Edamam response:', {
      hitsCount: data.hits?.length || 0,
      totalResults: data.count || 0,
      query: data.q,
    });
    
    // If no hits, try with simpler query (just top 3 ingredients)
    if (!data.hits || data.hits.length === 0) {
      console.log('No recipes found with selected ingredients, trying simpler query...');
      
      const simpleQuery = selectedIngredients.slice(0, 3).join(' ');
      const simpleParams = new URLSearchParams({
        type: 'public',
        q: simpleQuery,
        app_id: EDAMAM_APP_ID,
        app_key: EDAMAM_APP_KEY,
        from: '0',
        to: requestedCount.toString(),
      });
      
      const simpleResponse = await fetch(`${EDAMAM_BASE_URL}?${simpleParams}`, {
        headers: {
          'Accept': 'application/json',
          'Edamam-Account-User': 'pantry-chef-user',
        },
      });
      
      if (simpleResponse.ok) {
        const simpleData = await simpleResponse.json();
        if (simpleData.hits && simpleData.hits.length > 0) {
          console.log(`Found ${simpleData.hits.length} recipes with simpler query:`, simpleQuery);
          // Use these results instead
          data.hits = simpleData.hits;
          data.count = simpleData.count;
        }
      }
    }
    
    // If still no hits, return debug info
    if (!data.hits || data.hits.length === 0) {
      console.log('No recipes found for query:', ingredientList);
      return NextResponse.json({
        recipes: [],
        count: 0,
        source: 'edamam',
        query: ingredientList,
        rawQuery: ingredients,
        parsedIngredients: ingredientArray,
        selectedIngredients: selectedIngredients,
        filters: { cuisineType, mealType, diet, health, time, calories },
        debug: {
          edamamTotal: data.count || 0,
          message: 'No recipes found. Try adding more common ingredients like chicken, rice, pasta, or eggs.',
          suggestion: 'The app selected these ingredients for search: ' + selectedIngredients.join(', '),
        },
      });
    }

    // Convert to our recipe format with enhanced nutrition data (paid tier has more nutrients)
    const recipes = data.hits?.map((hit: any) => {
      const recipe = hit.recipe;
      const nutrients = recipe.totalNutrients || {};
      const yield_ = recipe.yield || 1;
      
      return {
        id: recipe.uri.split('#')[1] || Math.random().toString(),
        title: recipe.label,
        image: recipe.image,
        url: recipe.url,
        source: recipe.source,
        // Paid tier: more detailed ingredient info
        ingredients: recipe.ingredients.map((ing: any) => ({
          name: ing.food,
          amount: ing.quantity || 1,
          unit: ing.measure || 'item',
          original: ing.text,
          weight: ing.weight, // Paid tier includes weight
          category: ing.foodCategory, // Paid tier includes category
        })),
        ingredientLines: recipe.ingredientLines, // Full ingredient text list
        // Enhanced nutrition with more micronutrients (paid tier)
        nutrition: {
          calories: Math.round((recipe.calories || 0) / yield_),
          protein: Math.round((nutrients.PROCNT?.quantity || 0) / yield_ * 10) / 10,
          carbs: Math.round((nutrients.CHOCDF?.quantity || 0) / yield_ * 10) / 10,
          fat: Math.round((nutrients.FAT?.quantity || 0) / yield_ * 10) / 10,
          fiber: Math.round((nutrients.FIBTG?.quantity || 0) / yield_ * 10) / 10,
          sugar: Math.round((nutrients.SUGAR?.quantity || 0) / yield_ * 10) / 10,
          sodium: Math.round((nutrients.NA?.quantity || 0) / yield_),
          // Additional micronutrients available on paid tier
          cholesterol: Math.round((nutrients.CHOLE?.quantity || 0) / yield_ * 10) / 10,
          saturated_fat: Math.round((nutrients.FASAT?.quantity || 0) / yield_ * 10) / 10,
          vitamin_a: Math.round((nutrients.VITA_RAE?.quantity || 0) / yield_ * 10) / 10,
          vitamin_c: Math.round((nutrients.VITC?.quantity || 0) / yield_ * 10) / 10,
          calcium: Math.round((nutrients.CA?.quantity || 0) / yield_),
          iron: Math.round((nutrients.FE?.quantity || 0) / yield_ * 10) / 10,
          potassium: Math.round((nutrients.K?.quantity || 0) / yield_),
        },
        // Paid tier: diet and health labels
        dietLabels: recipe.dietLabels || [],
        healthLabels: recipe.healthLabels || [],
        cautions: recipe.cautions || [],
        cuisineType: recipe.cuisineType || [],
        mealType: recipe.mealType || [],
        dishType: recipe.dishType || [],
        prep_time: recipe.totalTime || null,
        servings: yield_,
        // Source info
        source_id: 'edamam',
      };
    }) || [];

    return NextResponse.json({ 
      recipes, 
      count: recipes.length,
      source: 'edamam',
      query: ingredientList,
      selectedIngredients: selectedIngredients,
      filters: {
        cuisineType,
        mealType,
        diet,
        health,
        time,
        calories,
      },
      // Paid tier info
      tier: 'paid',
      nextPage: data._links?.next?.href || null,
    });

  } catch (error) {
    console.error('Error fetching recipes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recipes', details: (error as Error).message },
      { status: 500 }
    );
  }
}

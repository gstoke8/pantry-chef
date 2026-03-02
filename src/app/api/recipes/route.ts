import { NextRequest, NextResponse } from 'next/server';

const EDAMAM_BASE_URL = 'https://api.edamam.com/api/recipes/v2';

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
    // Build query from ingredients - use more ingredients for better results (paid tier allows more complex queries)
    const ingredientList = ingredients.split(',').slice(0, 10).join(' '); // Increased to 10 for paid tier
    
    // Request more recipes (paid tier supports up to 100)
    const requestedCount = Math.min(parseInt(number) || 20, 100);
    
    const params = new URLSearchParams({
      type: 'public',
      q: ingredientList,
      app_id: EDAMAM_APP_ID,
      app_key: EDAMAM_APP_KEY,
      from: '0',
      to: requestedCount.toString(),
      // Add randomness to get different recipes on each call
      random: 'true',
    });

    // Add paid tier filter parameters
    if (cuisineType) params.append('cuisineType', cuisineType);
    if (mealType) params.append('mealType', mealType);
    if (diet) params.append('diet', diet);
    if (health) params.append('health', health);
    if (dishType) params.append('dishType', dishType);
    if (time) params.append('time', `0-${time}`); // Range format: 0-30 for under 30 min
    if (calories) params.append('calories', `0-${calories}`); // Range format

    const apiUrl = `${EDAMAM_BASE_URL}?${params}`;
    console.log('Fetching from Edamam with filters:', { cuisineType, mealType, diet, health, time, calories });

    const response = await fetch(apiUrl, {
      headers: {
        // Edamam requires this header for all apps
        'Edamam-Account-User': 'pantry-chef-user',
        // Optional: Add these for better rate limit tracking on paid tier
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Edamam API error:', response.status, errorText);
      
      // Provide helpful error messages for common issues
      let userMessage = `Edamam API error: ${response.status}`;
      if (response.status === 401) {
        userMessage = 'Edamam API authentication failed. Check that your API keys are set in Vercel Dashboard (Settings → Environment Variables) and that your Developer plan is active.';
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
          troubleshooting: 'Visit /api/debug/env to check your configuration',
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Edamam returned', data.hits?.length || 0, 'recipes');
    
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

import { NextRequest, NextResponse } from 'next/server';

const EDAMAM_APP_ID = process.env.NEXT_PUBLIC_EDAMAM_APP_ID || '';
const EDAMAM_APP_KEY = process.env.NEXT_PUBLIC_EDAMAM_APP_KEY || '';
const EDAMAM_BASE_URL = 'https://api.edamam.com/api/recipes/v2';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const ingredients = searchParams.get('ingredients');
  const number = searchParams.get('number') || '12';

  if (!ingredients) {
    return NextResponse.json(
      { error: 'Ingredients parameter is required' },
      { status: 400 }
    );
  }

  // Check if API keys are configured
  if (!EDAMAM_APP_ID || !EDAMAM_APP_KEY) {
    return NextResponse.json(
      { 
        error: 'Edamam API keys not configured',
        envCheck: {
          hasAppId: !!EDAMAM_APP_ID,
          hasAppKey: !!EDAMAM_APP_KEY,
          appIdLength: EDAMAM_APP_ID.length,
          appKeyLength: EDAMAM_APP_KEY.length
        }
      },
      { status: 503 }
    );
  }

  try {
    // Build query from ingredients
    const ingredientList = ingredients.split(',').slice(0, 5).join(' ');
    
    const params = new URLSearchParams({
      type: 'public',
      q: ingredientList,
      app_id: EDAMAM_APP_ID,
      app_key: EDAMAM_APP_KEY,
      from: '0',
      to: number,
    });

    const response = await fetch(`${EDAMAM_BASE_URL}?${params}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Edamam API error:', response.status, errorText);
      return NextResponse.json(
        { error: `Edamam API error: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Convert to our recipe format
    const recipes = data.hits?.map((hit: any) => ({
      id: hit.recipe.uri.split('#')[1] || Math.random().toString(),
      title: hit.recipe.label,
      image: hit.recipe.image,
      ingredients: hit.recipe.ingredients.map((ing: any) => ({
        name: ing.food,
        amount: ing.quantity || 1,
        unit: ing.measure || 'item',
        original: ing.text,
      })),
      nutrition: {
        calories: hit.recipe.calories / hit.recipe.yield,
        protein: (hit.recipe.totalNutrients?.PROCNT?.quantity || 0) / hit.recipe.yield,
        carbs: (hit.recipe.totalNutrients?.CHOCDF?.quantity || 0) / hit.recipe.yield,
        fat: (hit.recipe.totalNutrients?.FAT?.quantity || 0) / hit.recipe.yield,
        fiber: (hit.recipe.totalNutrients?.FIBTG?.quantity || 0) / hit.recipe.yield,
        sugar: (hit.recipe.totalNutrients?.SUGAR?.quantity || 0) / hit.recipe.yield,
        sodium: (hit.recipe.totalNutrients?.NA?.quantity || 0) / hit.recipe.yield,
      },
      prep_time: hit.recipe.totalTime || null,
      servings: hit.recipe.yield,
      source: 'edamam',
    })) || [];

    return NextResponse.json({ 
      recipes, 
      count: recipes.length,
      source: 'edamam',
      query: ingredientList
    });

  } catch (error) {
    console.error('Error fetching recipes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recipes', details: (error as Error).message },
      { status: 500 }
    );
  }
}

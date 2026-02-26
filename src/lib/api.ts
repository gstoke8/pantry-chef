import { SpoonacularRecipe, SpoonacularRecipeDetail, EdamamRecipe, Recipe } from './types';

// Note: In a real app, these API calls should be made from a server-side API route
// to protect API keys. For demo purposes, we're calling directly from the browser
// with a public key (limited permissions) or using a proxy.
const SPOONACULAR_API_KEY = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY || '';
const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com';

// Check if API key is configured
if (!SPOONACULAR_API_KEY) {
  console.warn('Spoonacular API key not configured. Recipes will not load.');
}

const EDAMAM_APP_ID = process.env.EDAMAM_APP_ID!;
const EDAMAM_APP_KEY = process.env.EDAMAM_APP_KEY!;
const EDAMAM_BASE_URL = 'https://api.edamam.com/api/recipes/v2';

// Spoonacular API
export async function findRecipesByIngredients(
  ingredients: string[],
  number: number = 10
): Promise<SpoonacularRecipe[]> {
  const ingredientString = ingredients.join(',');
  
  const response = await fetch(
    `${SPOONACULAR_BASE_URL}/recipes/findByIngredients?` +
    `ingredients=${encodeURIComponent(ingredientString)}&` +
    `number=${number}&` +
    `ranking=1&` +
    `ignorePantry=true&` +
    `apiKey=${SPOONACULAR_API_KEY}`
  );

  if (!response.ok) {
    throw new Error(`Spoonacular API error: ${response.status}`);
  }

  return response.json();
}

export async function getRecipeDetails(id: number): Promise<SpoonacularRecipeDetail> {
  const response = await fetch(
    `${SPOONACULAR_BASE_URL}/recipes/${id}/information?` +
    `includeNutrition=true&` +
    `apiKey=${SPOONACULAR_API_KEY}`
  );

  if (!response.ok) {
    throw new Error(`Spoonacular API error: ${response.status}`);
  }

  return response.json();
}

export async function searchRecipes(
  query: string,
  diet?: string,
  intolerances?: string[],
  number: number = 10
) {
  const params = new URLSearchParams({
    query,
    number: number.toString(),
    addRecipeNutrition: 'true',
    apiKey: SPOONACULAR_API_KEY,
  });

  if (diet) params.append('diet', diet);
  if (intolerances) params.append('intolerances', intolerances.join(','));

  const response = await fetch(
    `${SPOONACULAR_BASE_URL}/recipes/complexSearch?${params}`
  );

  if (!response.ok) {
    throw new Error(`Spoonacular API error: ${response.status}`);
  }

  return response.json();
}

// Edamam API
export async function searchEdamamRecipes(
  query: string,
  ingredients?: string[],
  diet?: string[],
  health?: string[],
  from: number = 0,
  to: number = 20
): Promise<{ hits: EdamamRecipe[] }> {
  const params = new URLSearchParams({
    type: 'public',
    q: query,
    app_id: EDAMAM_APP_ID,
    app_key: EDAMAM_APP_KEY,
    from: from.toString(),
    to: to.toString(),
  });

  if (ingredients) {
    params.append('ingr', ingredients.length.toString());
  }
  
  if (diet) {
    diet.forEach(d => params.append('diet', d));
  }
  
  if (health) {
    health.forEach(h => params.append('health', h));
  }

  const response = await fetch(`${EDAMAM_BASE_URL}?${params}`);

  if (!response.ok) {
    throw new Error(`Edamam API error: ${response.status}`);
  }

  return response.json();
}

// Convert Spoonacular recipe to our Recipe type
export function convertSpoonacularToRecipe(
  spoonacularRecipe: SpoonacularRecipeDetail,
  userId?: string
): Recipe {
  const nutrition = spoonacularRecipe.nutrition?.nutrients || [];
  
  const nutritionInfo = {
    calories: nutrition.find((n: { name: string }) => n.name === 'Calories')?.amount || 0,
    protein: nutrition.find((n: { name: string }) => n.name === 'Protein')?.amount || 0,
    carbs: nutrition.find((n: { name: string }) => n.name === 'Carbohydrates')?.amount || 0,
    fat: nutrition.find((n: { name: string }) => n.name === 'Fat')?.amount || 0,
    fiber: nutrition.find((n: { name: string }) => n.name === 'Fiber')?.amount || 0,
    sugar: nutrition.find((n: { name: string }) => n.name === 'Sugar')?.amount || 0,
    sodium: nutrition.find((n: { name: string }) => n.name === 'Sodium')?.amount || 0,
  };

  const ingredients = spoonacularRecipe.extendedIngredients.map(ing => ({
    name: ing.name,
    amount: ing.amount,
    unit: ing.unit,
    original: ing.original,
  }));

  const instructions = spoonacularRecipe.analyzedInstructions[0]?.steps.map(
    (step: { step: string }) => step.step
  ) || [];

  return {
    id: '', // Will be set by database
    user_id: userId || null,
    spoonacular_id: spoonacularRecipe.id,
    title: spoonacularRecipe.title,
    image: spoonacularRecipe.image,
    ingredients,
    instructions,
    nutrition: nutritionInfo,
    prep_time: spoonacularRecipe.preparationMinutes || null,
    cook_time: spoonacularRecipe.cookingMinutes || null,
    servings: spoonacularRecipe.servings,
    source: 'spoonacular',
    is_favorite: false,
    created_at: new Date().toISOString(),
  };
}
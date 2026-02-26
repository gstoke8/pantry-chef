import { SpoonacularRecipe, SpoonacularRecipeDetail, EdamamRecipe, Recipe } from './types';

// Edamam API Configuration
// Edamam allows client-side calls with app ID and key
const EDAMAM_APP_ID = process.env.NEXT_PUBLIC_EDAMAM_APP_ID || '';
const EDAMAM_APP_KEY = process.env.NEXT_PUBLIC_EDAMAM_APP_KEY || '';
const EDAMAM_BASE_URL = 'https://api.edamam.com/api/recipes/v2';

// Spoonacular API Configuration
const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY || '';
const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com';

// Check if API keys are configured
if (!EDAMAM_APP_ID || !EDAMAM_APP_KEY) {
  console.warn('Edamam API keys not configured. Using sample recipes.');
}

// Search recipes by ingredients using Edamam
export async function findRecipesByIngredients(
  ingredients: string[],
  number: number = 10
): Promise<EdamamRecipe[]> {
  if (!EDAMAM_APP_ID || !EDAMAM_APP_KEY) {
    throw new Error('Edamam API keys not configured');
  }

  // Build query from ingredients
  const query = ingredients.slice(0, 5).join(' '); // Use top 5 ingredients
  
  const params = new URLSearchParams({
    type: 'public',
    q: query,
    app_id: EDAMAM_APP_ID,
    app_key: EDAMAM_APP_KEY,
    from: '0',
    to: number.toString(),
  });

  const response = await fetch(`${EDAMAM_BASE_URL}?${params}`);

  if (!response.ok) {
    throw new Error(`Edamam API error: ${response.status}`);
  }

  const data = await response.json();
  return data.hits || [];
}

// Spoonacular API - Find recipes by ingredients
export async function findRecipesByIngredientsSpoonacular(
  ingredients: string[],
  number: number = 10
): Promise<SpoonacularRecipe[]> {
  if (!SPOONACULAR_API_KEY) {
    throw new Error('Spoonacular API key not configured');
  }

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

// Get detailed recipe information from Spoonacular
export async function getRecipeDetails(id: number): Promise<SpoonacularRecipeDetail> {
  if (!SPOONACULAR_API_KEY) {
    throw new Error('Spoonacular API key not configured');
  }

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

// Search recipes with complex query
export async function searchRecipes(
  query: string,
  diet?: string,
  intolerances?: string[],
  number: number = 10
) {
  if (!SPOONACULAR_API_KEY) {
    throw new Error('Spoonacular API key not configured');
  }

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

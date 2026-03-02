// Type definitions for Pantry Chef App

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface PantryItem {
  id: string;
  user_id: string | null;
  name: string;
  category: IngredientCategory;
  quantity: number;
  unit: string;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export type IngredientCategory = 
  | 'produce'
  | 'protein'
  | 'dairy'
  | 'pantry'
  | 'spices'
  | 'oils'
  | 'frozen'
  | 'beverages'
  | 'other';

export interface Recipe {
  id: string;
  user_id: string | null;
  spoonacular_id: number | null;
  title: string;
  image: string | null;
  url: string | null; // Source URL for full recipe
  source_name?: string; // e.g., "BBC Good Food", "All Recipes"
  ingredients: RecipeIngredient[];
  ingredientLines?: string[]; // Full ingredient text from Edamam
  instructions: string[] | null;
  nutrition: NutritionInfo | null;
  prep_time: number | null;
  cook_time: number | null;
  servings: number;
  source: 'spoonacular' | 'edamam' | 'ai-generated' | 'user-created';
  // Paid tier fields from Edamam
  dietLabels?: string[]; // e.g., "balanced", "high-protein"
  healthLabels?: string[]; // e.g., "vegan", "gluten-free"
  cautions?: string[];
  cuisineType?: string[]; // e.g., "italian", "mexican"
  mealType?: string[]; // e.g., "lunch", "dinner"
  dishType?: string[]; // e.g., "main course", "starter"
  is_favorite: boolean;
  created_at: string;
}

export interface RecipeIngredient {
  name: string;
  amount: number;
  unit: string;
  original?: string;
  // Paid tier fields from Edamam
  weight?: number; // Weight in grams
  category?: string; // Food category
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  cholesterol?: number;
  saturated_fat?: number;
  // Micronutrients
  vitamin_a?: number;
  vitamin_c?: number;
  calcium?: number;
  iron?: number;
  potassium?: number;
}

export interface MealPlan {
  id: string;
  user_id: string;
  week_start: string;
  meals: WeeklyMeals;
  nutrition_totals: NutritionInfo | null;
  created_at: string;
  updated_at: string;
}

export interface WeeklyMeals {
  monday: DailyMeals;
  tuesday: DailyMeals;
  wednesday: DailyMeals;
  thursday: DailyMeals;
  friday: DailyMeals;
  saturday: DailyMeals;
  sunday: DailyMeals;
}

export interface DailyMeals {
  breakfast: string | null; // recipe id
  lunch: string | null;
  dinner: string | null;
}

export type DayOfWeek = keyof WeeklyMeals;
export type MealType = keyof DailyMeals;

// Edamam paid tier filter options
export type CuisineType = 
  | 'american' | 'asian' | 'british' | 'caribbean' | 'central europe' 
  | 'chinese' | 'eastern europe' | 'french' | 'greek' | 'indian' 
  | 'italian' | 'japanese' | 'korean' | 'kosher' | 'mediterranean' 
  | 'mexican' | 'middle eastern' | 'nordic' | 'south american' 
  | 'south east asian' | 'world';

export type EdamamMealType = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'teatime';

export type DietType = 
  | 'balanced' | 'high-fiber' | 'high-protein' | 'low-carb' 
  | 'low-fat' | 'low-sodium';

export type HealthLabel = 
  | 'alcohol-cocktail' | 'alcohol-free' | 'celery-free' | 'crustacean-free' 
  | 'dairy-free' | 'dash' | 'egg-free' | 'fish-free' | 'fodmap-free' 
  | 'gluten-free' | 'immuno-supportive' | 'keto-friendly' | 'kidney-friendly' 
  | 'kosher' | 'low-fat-abs' | 'low-potassium' | 'low-sugar' | 'lupine-free' 
  | 'mediterranean' | 'mollusk-free' | 'mustard-free' | 'no-oil-added' 
  | 'paleo' | 'peanut-free' | 'pescatarian' | 'pork-free' | 'red-meat-free' 
  | 'sesame-free' | 'shellfish-free' | 'soy-free' | 'sugar-conscious' 
  | 'sulfite-free' | 'tree-nut-free' | 'vegan' | 'vegetarian' | 'wheat-free';

export interface RecipeFilters {
  cuisineType?: CuisineType;
  mealType?: EdamamMealType;
  diet?: DietType;
  health?: HealthLabel;
  maxTime?: number; // in minutes
  maxCalories?: number;
}

export interface ShoppingList {
  id: string;
  user_id: string;
  meal_plan_id: string;
  items: ShoppingItem[];
  is_complete: boolean;
  created_at: string;
  updated_at: string;
}

export interface ShoppingItem {
  name: string;
  category: IngredientCategory;
  amount: number;
  unit: string;
  checked: boolean;
  recipe_source: string[]; // which recipes need this ingredient
}

// API Response types
export interface SpoonacularRecipe {
  id: number;
  title: string;
  image: string;
  imageType: string;
  usedIngredientCount: number;
  missedIngredientCount: number;
  missedIngredients: SpoonacularIngredient[];
  usedIngredients: SpoonacularIngredient[];
  unusedIngredients: SpoonacularIngredient[];
  likes: number;
}

export interface SpoonacularIngredient {
  id: number;
  amount: number;
  unit: string;
  unitLong: string;
  unitShort: string;
  aisle: string;
  name: string;
  original: string;
  originalName: string;
  meta: string[];
  extendedName?: string;
  image: string;
}

export interface SpoonacularRecipeDetail {
  id: number;
  title: string;
  image: string;
  servings: number;
  readyInMinutes: number;
  preparationMinutes?: number;
  cookingMinutes?: number;
  extendedIngredients: SpoonacularIngredient[];
  analyzedInstructions: {
    name: string;
    steps: {
      number: number;
      step: string;
      ingredients: { id: number; name: string }[];
    }[];
  }[];
  nutrition: {
    nutrients: {
      name: string;
      amount: number;
      unit: string;
      percentOfDailyNeeds?: number;
    }[];
  };
}

export interface EdamamRecipe {
  recipe: {
    uri: string;
    label: string;
    image: string;
    source: string;
    url: string;
    yield: number;
    dietLabels: string[];
    healthLabels: string[];
    cautions: string[];
    ingredientLines: string[];
    ingredients: {
      text: string;
      quantity: number;
      measure: string;
      food: string;
      weight: number;
      foodCategory: string;
      foodId: string;
      image: string;
    }[];
    calories: number;
    totalWeight: number;
    totalTime: number;
    cuisineType: string[];
    mealType: string[];
    dishType: string[];
    totalNutrients: Record<string, { label: string; quantity: number; unit: string }>;
    totalDaily: Record<string, { label: string; quantity: number; unit: string }>;
  };
}

// Component prop types
export interface RecipeCardProps {
  recipe: Recipe;
  onAddToMealPlan?: (recipeId: string) => void;
  onToggleFavorite?: (recipeId: string) => void;
  showNutrition?: boolean;
}

export interface PantryItemCardProps {
  item: PantryItem;
  onUpdate: (id: string, updates: Partial<PantryItem>) => void;
  onDelete: (id: string) => void;
}

export interface ShoppingListItemProps {
  item: ShoppingItem;
  onToggle: (name: string) => void;
}
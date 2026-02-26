'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { PantryItem, Recipe } from '@/lib/types';
import { findRecipesByIngredients, EdamamRecipe } from '@/lib/api';
import { Search, ChefHat, Clock, Users, Heart, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function RecipesPage() {
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [apiStatus, setApiStatus] = useState<'checking' | 'connected' | 'fallback'>('checking');

  useEffect(() => {
    fetchPantryItems();
  }, []);

  async function fetchPantryItems() {
    const { data, error } = await supabase
      .from('pantry_items')
      .select('*');

    if (error) {
      console.error('Error fetching pantry items:', error);
    } else {
      setPantryItems(data || []);
      if (data && data.length > 0) {
        findRecipes(data);
      }
    }
  }

  // Sample recipes for demo when API is not configured
  const sampleRecipes: Recipe[] = [
    {
      id: '1',
      user_id: null,
      spoonacular_id: 1,
      title: 'Honey Garlic Chicken Stir-Fry',
      image: 'https://spoonacular.com/recipeImages/716429-556x370.jpg',
      ingredients: [
        { name: 'chicken breast', amount: 1, unit: 'lb', original: '1 lb chicken breast' },
        { name: 'garlic', amount: 4, unit: 'cloves', original: '4 cloves garlic' },
        { name: 'honey', amount: 2, unit: 'tbsp', original: '2 tbsp honey' },
        { name: 'soy sauce', amount: 2, unit: 'tbsp', original: '2 tbsp soy sauce' },
      ],
      instructions: null,
      nutrition: { calories: 320, protein: 28, carbs: 18, fat: 12, fiber: 1, sugar: 14, sodium: 680 },
      prep_time: 10,
      cook_time: 15,
      servings: 4,
      source: 'spoonacular',
      is_favorite: false,
      created_at: new Date().toISOString(),
    },
    {
      id: '2',
      user_id: null,
      spoonacular_id: 2,
      title: 'Mediterranean Chickpea Salad',
      image: 'https://spoonacular.com/recipeImages/782585-556x370.jpg',
      ingredients: [
        { name: 'chickpeas', amount: 1, unit: 'can', original: '1 can chickpeas' },
        { name: 'cucumber', amount: 1, unit: 'item', original: '1 cucumber' },
        { name: 'tomatoes', amount: 2, unit: 'item', original: '2 tomatoes' },
        { name: 'olive oil', amount: 2, unit: 'tbsp', original: '2 tbsp olive oil' },
      ],
      instructions: null,
      nutrition: { calories: 245, protein: 8, carbs: 32, fat: 10, fiber: 9, sugar: 6, sodium: 420 },
      prep_time: 15,
      cook_time: 0,
      servings: 4,
      source: 'spoonacular',
      is_favorite: false,
      created_at: new Date().toISOString(),
    },
    {
      id: '3',
      user_id: null,
      spoonacular_id: 3,
      title: 'One-Pan Chicken and Sweet Potatoes',
      image: 'https://spoonacular.com/recipeImages/715538-556x370.jpg',
      ingredients: [
        { name: 'chicken breast', amount: 1.5, unit: 'lb', original: '1.5 lb chicken breast' },
        { name: 'sweet potatoes', amount: 3, unit: 'item', original: '3 sweet potatoes' },
        { name: 'olive oil', amount: 2, unit: 'tbsp', original: '2 tbsp olive oil' },
        { name: 'paprika', amount: 1, unit: 'tsp', original: '1 tsp paprika' },
      ],
      instructions: null,
      nutrition: { calories: 385, protein: 32, carbs: 35, fat: 14, fiber: 5, sugar: 8, sodium: 520 },
      prep_time: 15,
      cook_time: 30,
      servings: 4,
      source: 'spoonacular',
      is_favorite: false,
      created_at: new Date().toISOString(),
    },
    {
      id: '4',
      user_id: null,
      spoonacular_id: 4,
      title: 'Thai Peanut Noodles',
      image: 'https://spoonacular.com/recipeImages/715424-556x370.jpg',
      ingredients: [
        { name: 'noodles', amount: 8, unit: 'oz', original: '8 oz noodles' },
        { name: 'peanut butter', amount: 0.5, unit: 'cup', original: '1/2 cup peanut butter' },
        { name: 'soy sauce', amount: 3, unit: 'tbsp', original: '3 tbsp soy sauce' },
        { name: 'ginger', amount: 1, unit: 'tbsp', original: '1 tbsp ginger' },
      ],
      instructions: null,
      nutrition: { calories: 425, protein: 16, carbs: 52, fat: 18, fiber: 4, sugar: 8, sodium: 780 },
      prep_time: 10,
      cook_time: 10,
      servings: 4,
      source: 'spoonacular',
      is_favorite: false,
      created_at: new Date().toISOString(),
    },
    {
      id: '5',
      user_id: null,
      spoonacular_id: 5,
      title: 'Chicken Parmesan with Basil',
      image: 'https://spoonacular.com/recipeImages/715467-556x370.jpg',
      ingredients: [
        { name: 'chicken breast', amount: 2, unit: 'lb', original: '2 lb chicken breast' },
        { name: 'mozzarella cheese', amount: 8, unit: 'oz', original: '8 oz mozzarella' },
        { name: 'tomato paste', amount: 6, unit: 'oz', original: '6 oz tomato paste' },
        { name: 'basil', amount: 0.5, unit: 'cup', original: '1/2 cup basil' },
      ],
      instructions: null,
      nutrition: { calories: 485, protein: 42, carbs: 22, fat: 26, fiber: 3, sugar: 10, sodium: 890 },
      prep_time: 20,
      cook_time: 25,
      servings: 4,
      source: 'spoonacular',
      is_favorite: false,
      created_at: new Date().toISOString(),
    },
    {
      id: '6',
      user_id: null,
      spoonacular_id: 6,
      title: 'Loaded Baked Sweet Potato',
      image: 'https://spoonacular.com/recipeImages/782600-556x370.jpg',
      ingredients: [
        { name: 'sweet potatoes', amount: 4, unit: 'item', original: '4 sweet potatoes' },
        { name: 'black beans', amount: 1, unit: 'can', original: '1 can black beans' },
        { name: 'cheddar cheese', amount: 1, unit: 'cup', original: '1 cup cheddar cheese' },
        { name: 'greek yogurt', amount: 0.5, unit: 'cup', original: '1/2 cup greek yogurt' },
      ],
      instructions: null,
      nutrition: { calories: 365, protein: 14, carbs: 48, fat: 14, fiber: 10, sugar: 8, sodium: 420 },
      prep_time: 10,
      cook_time: 45,
      servings: 4,
      source: 'spoonacular',
      is_favorite: false,
      created_at: new Date().toISOString(),
    },
  ];

  async function findRecipes(items: PantryItem[]) {
    setLoading(true);
    setApiStatus('checking');
    try {
      const ingredientNames = items.map(item => item.name);
      
      // Check if API keys are available
      const hasEdamamKeys = process.env.NEXT_PUBLIC_EDAMAM_APP_ID && process.env.NEXT_PUBLIC_EDAMAM_APP_KEY;
      console.log('Edamam API check:', { 
        hasAppId: !!process.env.NEXT_PUBLIC_EDAMAM_APP_ID, 
        hasAppKey: !!process.env.NEXT_PUBLIC_EDAMAM_APP_KEY 
      });
      
      if (!hasEdamamKeys) {
        console.log('Using sample recipes (Edamam API keys not configured)');
        setApiStatus('fallback');
        // Filter sample recipes based on pantry items
        const filteredSamples = sampleRecipes.filter(recipe => 
          recipe.ingredients.some(ing => 
            items.some(pantryItem => 
              pantryItem.name.toLowerCase().includes(ing.name.toLowerCase()) ||
              ing.name.toLowerCase().includes(pantryItem.name.toLowerCase())
            )
          )
        );
        setRecipes(filteredSamples.length > 0 ? filteredSamples : sampleRecipes);
        return;
      }
      
      const edamamRecipes = await findRecipesByIngredients(ingredientNames, 12);
      console.log('Edamam API returned', edamamRecipes.length, 'recipes');
      setApiStatus('connected');
      
      // Convert Edamam recipes to our Recipe format
      const convertedRecipes: Recipe[] = edamamRecipes.map((hit: EdamamRecipe) => ({
        id: hit.recipe.uri.split('#')[1] || Math.random().toString(),
        user_id: null,
        spoonacular_id: null,
        title: hit.recipe.label,
        image: hit.recipe.image,
        ingredients: hit.recipe.ingredients.map(ing => ({
          name: ing.food,
          amount: ing.quantity || 1,
          unit: ing.measure || 'item',
          original: ing.text,
        })),
        instructions: null, // Edamam doesn't provide instructions in free tier
        nutrition: {
          calories: hit.recipe.calories / hit.recipe.yield,
          protein: (hit.recipe.totalNutrients.PROCNT?.quantity || 0) / hit.recipe.yield,
          carbs: (hit.recipe.totalNutrients.CHOCDF?.quantity || 0) / hit.recipe.yield,
          fat: (hit.recipe.totalNutrients.FAT?.quantity || 0) / hit.recipe.yield,
          fiber: (hit.recipe.totalNutrients.FIBTG?.quantity || 0) / hit.recipe.yield,
          sugar: (hit.recipe.totalNutrients.SUGAR?.quantity || 0) / hit.recipe.yield,
          sodium: (hit.recipe.totalNutrients.NA?.quantity || 0) / hit.recipe.yield,
        },
        prep_time: hit.recipe.totalTime || null,
        cook_time: null,
        servings: hit.recipe.yield,
        source: 'edamam',
        is_favorite: false,
        created_at: new Date().toISOString(),
      }));

      setRecipes(convertedRecipes);
    } catch (error) {
      console.error('Error finding recipes:', error);
      setApiStatus('fallback');
      // Fallback to sample recipes on error
      setRecipes(sampleRecipes);
    } finally {
      setLoading(false);
    }
  }

  async function toggleFavorite(recipeId: string) {
    // Implementation for saving favorites
    console.log('Toggle favorite:', recipeId);
  }

  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Recipe Finder</h1>
            <p className="text-sm sm:text-base text-gray-600">
              {pantryItems.length > 0 
                ? `Found recipes using your ${pantryItems.length} pantry ingredients`
                : 'Add ingredients to your pantry to get personalized recipe suggestions'}
            </p>
          </div>
          {pantryItems.length > 0 && (
            <button
              onClick={() => findRecipes(pantryItems)}
              disabled={loading}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center space-x-1 flex-shrink-0"
            >
              <span>Refresh</span>
              {loading && <Loader2 className="h-3 w-3 animate-spin" />}
            </button>
          )}
        </div>
        
        {/* API Status Indicator */}
        <div className="mt-2 flex items-center space-x-2">
          <span className="text-xs text-gray-500">API:</span>
          {apiStatus === 'checking' && (
            <span className="text-xs text-gray-500 flex items-center">
              <Loader2 className="h-3 w-3 animate-spin mr-1" />
              Checking...
            </span>
          )}
          {apiStatus === 'connected' && (
            <span className="text-xs text-emerald-600 font-medium flex items-center">
              <span className="w-2 h-2 bg-emerald-500 rounded-full mr-1"></span>
              Edamam API
            </span>
          )}
          {apiStatus === 'fallback' && (
            <span className="text-xs text-amber-600 font-medium flex items-center">
              <span className="w-2 h-2 bg-amber-500 rounded-full mr-1"></span>
              Sample recipes (API keys not configured)
            </span>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4 sm:mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 placeholder-gray-500 text-base"
        />
      </div>

      {/* Pantry Items Quick View */}
      {pantryItems.length > 0 && (
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {pantryItems.slice(0, 8).map((item) => (
              <span
                key={item.id}
                className="px-2 sm:px-3 py-0.5 sm:py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs sm:text-sm"
              >
                {item.name}
              </span>
            ))}
            {pantryItems.length > 8 && (
              <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-gray-100 text-gray-600 rounded-full text-xs sm:text-sm">
                +{pantryItems.length - 8} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          <span className="ml-2 text-gray-600 text-sm sm:text-base">Finding recipes...</span>
        </div>
      )}

      {/* Recipes Grid */}
      {!loading && (
        <>
          {filteredRecipes.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
              <ChefHat className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-base sm:text-lg">No recipes found</p>
              <p className="text-gray-400 text-sm mt-1">
                {pantryItems.length === 0 
                  ? 'Add ingredients to your pantry first'
                  : 'Try searching with different terms'}
              </p>
              <Link
                href="/pantry"
                className="inline-block mt-4 text-emerald-600 hover:text-emerald-700 font-medium text-sm sm:text-base"
              >
                Go to Pantry →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative">
                    {recipe.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full h-40 sm:h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-40 sm:h-48 bg-gray-200 flex items-center justify-center">
                        <ChefHat className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
                      </div>
                    )}
                    <button
                      onClick={() => toggleFavorite(recipe.id)}
                      className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                    >
                      <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${recipe.is_favorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                    </button>
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm sm:text-base">
                      {recipe.title}
                    </h3>
                    <div className="flex items-center space-x-3 sm:space-x-4 text-xs sm:text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                        {recipe.prep_time || recipe.cook_time 
                          ? `${(recipe.prep_time || 0) + (recipe.cook_time || 0)} min`
                          : '30 min'}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                        {recipe.servings} servings
                      </div>
                    </div>
                    <div className="mt-2 sm:mt-3 flex flex-wrap gap-1">
                      {recipe.ingredients.slice(0, 2).map((ing, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 sm:px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                        >
                          {ing.name}
                        </span>
                      ))}
                      {recipe.ingredients.length > 2 && (
                        <span className="px-1.5 sm:px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                          +{recipe.ingredients.length - 2}
                        </span>
                      )}
                    </div>
                    <button
                      className="mt-3 sm:mt-4 w-full bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 transition-colors text-sm sm:text-base"
                      onClick={() => alert('Recipe detail view coming soon!')}
                    >
                      View Recipe
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

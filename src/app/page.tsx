'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { PantryItem, Recipe } from '@/lib/types';
import { findRecipesByIngredients, convertSpoonacularToRecipe } from '@/lib/api';
import { Search, ChefHat, Clock, Users, Heart, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function RecipesPage() {
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

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

  async function findRecipes(items: PantryItem[]) {
    setLoading(true);
    try {
      const ingredientNames = items.map(item => item.name);
      const spoonacularRecipes = await findRecipesByIngredients(ingredientNames, 12);
      
      // Convert to our Recipe format
      const convertedRecipes: Recipe[] = spoonacularRecipes.map(recipe => ({
        id: recipe.id.toString(),
        user_id: null,
        spoonacular_id: recipe.id,
        title: recipe.title,
        image: recipe.image,
        ingredients: recipe.usedIngredients.map(ing => ({
          name: ing.name,
          amount: ing.amount,
          unit: ing.unit,
          original: ing.original,
        })),
        instructions: null,
        nutrition: null,
        prep_time: null,
        cook_time: null,
        servings: 4,
        source: 'spoonacular',
        is_favorite: false,
        created_at: new Date().toISOString(),
      }));

      setRecipes(convertedRecipes);
    } catch (error) {
      console.error('Error finding recipes:', error);
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
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Recipe Finder</h1>
        <p className="text-gray-600">
          {pantryItems.length > 0 
            ? `Found recipes using your ${pantryItems.length} pantry ingredients`
            : 'Add ingredients to your pantry to get personalized recipe suggestions'}
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* Pantry Items Quick View */}
      {pantryItems.length > 0 && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {pantryItems.slice(0, 10).map((item) => (
              <span
                key={item.id}
                className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm"
              >
                {item.name}
              </span>
            ))}
            {pantryItems.length > 10 && (
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                +{pantryItems.length - 10} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          <span className="ml-2 text-gray-600">Finding recipes...</span>
        </div>
      )}

      {/* Recipes Grid */}
      {!loading && (
        <>
          {filteredRecipes.length === 0 ? (
            <div className="text-center py-12">
              <ChefHat className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No recipes found</p>
              <p className="text-gray-400 mt-1">
                {pantryItems.length === 0 
                  ? 'Add ingredients to your pantry first'
                  : 'Try searching with different terms'}
              </p>
              <Link
                href="/pantry"
                className="inline-block mt-4 text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Go to Pantry →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative">
                    {recipe.image ? (
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <ChefHat className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    <button
                      onClick={() => toggleFavorite(recipe.id)}
                      className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                    >
                      <Heart className={`h-5 w-5 ${recipe.is_favorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {recipe.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {recipe.prep_time || recipe.cook_time 
                          ? `${(recipe.prep_time || 0) + (recipe.cook_time || 0)} min`
                          : '30 min'}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {recipe.servings} servings
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {recipe.ingredients.slice(0, 3).map((ing, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                        >
                          {ing.name}
                        </span>
                      ))}
                      {recipe.ingredients.length > 3 && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                          +{recipe.ingredients.length - 3}
                        </span>
                      )}
                    </div>
                    <button
                      className="mt-4 w-full bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 transition-colors"
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

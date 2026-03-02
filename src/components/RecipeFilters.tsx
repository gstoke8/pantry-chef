'use client';

import { useState } from 'react';
import { RecipeFilters, CuisineType, EdamamMealType, DietType, HealthLabel } from '@/lib/types';
import { SlidersHorizontal, X, Clock, Flame, UtensilsCrossed, Leaf, Heart } from 'lucide-react';

interface RecipeFiltersProps {
  filters: RecipeFilters;
  onFiltersChange: (filters: RecipeFilters) => void;
  onApplyFilters: () => void;
  disabled?: boolean;
}

const cuisineOptions: { value: CuisineType; label: string }[] = [
  { value: 'american', label: 'American' },
  { value: 'asian', label: 'Asian' },
  { value: 'chinese', label: 'Chinese' },
  { value: 'french', label: 'French' },
  { value: 'greek', label: 'Greek' },
  { value: 'indian', label: 'Indian' },
  { value: 'italian', label: 'Italian' },
  { value: 'japanese', label: 'Japanese' },
  { value: 'korean', label: 'Korean' },
  { value: 'mediterranean', label: 'Mediterranean' },
  { value: 'mexican', label: 'Mexican' },
  { value: 'middle eastern', label: 'Middle Eastern' },
  { value: 'thai', label: 'Thai' },
  { value: 'vietnamese', label: 'Vietnamese' },
];

const mealTypeOptions: { value: EdamamMealType; label: string }[] = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'snack', label: 'Snack' },
];

const dietOptions: { value: DietType; label: string }[] = [
  { value: 'balanced', label: 'Balanced' },
  { value: 'high-protein', label: 'High Protein' },
  { value: 'low-carb', label: 'Low Carb' },
  { value: 'low-fat', label: 'Low Fat' },
  { value: 'high-fiber', label: 'High Fiber' },
];

const healthOptions: { value: HealthLabel; label: string }[] = [
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'gluten-free', label: 'Gluten Free' },
  { value: 'dairy-free', label: 'Dairy Free' },
  { value: 'keto-friendly', label: 'Keto' },
  { value: 'paleo', label: 'Paleo' },
  { value: 'peanut-free', label: 'Peanut Free' },
  { value: 'tree-nut-free', label: 'Tree Nut Free' },
  { value: 'shellfish-free', label: 'Shellfish Free' },
  { value: 'soy-free', label: 'Soy Free' },
  { value: 'egg-free', label: 'Egg Free' },
];

const timeOptions = [
  { value: 15, label: 'Under 15 min' },
  { value: 30, label: 'Under 30 min' },
  { value: 45, label: 'Under 45 min' },
  { value: 60, label: 'Under 1 hour' },
];

const calorieOptions = [
  { value: 300, label: 'Under 300 cal' },
  { value: 500, label: 'Under 500 cal' },
  { value: 800, label: 'Under 800 cal' },
  { value: 1000, label: 'Under 1000 cal' },
];

export function RecipeFiltersPanel({ filters, onFiltersChange, onApplyFilters, disabled }: RecipeFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const hasActiveFilters = Object.values(filters).some(v => v !== undefined);

  const clearFilters = () => {
    onFiltersChange({});
  };

  const updateFilter = <K extends keyof RecipeFilters>(key: K, value: RecipeFilters[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const removeFilter = (key: keyof RecipeFilters) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    onFiltersChange(newFilters);
  };

  return (
    <div className="w-full">
      {/* Filter Button & Active Tags */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            isOpen
              ? 'bg-emerald-100 text-emerald-700'
              : hasActiveFilters
              ? 'bg-emerald-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="bg-white text-emerald-600 text-xs px-1.5 py-0.5 rounded-full">
              {Object.keys(filters).length}
            </span>
          )}
        </button>

        {/* Active Filter Tags */}
        {filters.cuisineType && (
          <FilterTag
            icon={<UtensilsCrossed className="h-3 w-3" />}
            label={cuisineOptions.find(c => c.value === filters.cuisineType)?.label || filters.cuisineType}
            onRemove={() => removeFilter('cuisineType')}
          />
        )}
        {filters.mealType && (
          <FilterTag
            label={mealTypeOptions.find(m => m.value === filters.mealType)?.label || filters.mealType}
            onRemove={() => removeFilter('mealType')}
          />
        )}
        {filters.diet && (
          <FilterTag
            icon={<Leaf className="h-3 w-3" />}
            label={dietOptions.find(d => d.value === filters.diet)?.label || filters.diet}
            onRemove={() => removeFilter('diet')}
          />
        )}
        {filters.health && (
          <FilterTag
            icon={<Heart className="h-3 w-3" />}
            label={healthOptions.find(h => h.value === filters.health)?.label || filters.health}
            onRemove={() => removeFilter('health')}
          />
        )}
        {filters.maxTime && (
          <FilterTag
            icon={<Clock className="h-3 w-3" />}
            label={timeOptions.find(t => t.value === filters.maxTime)?.label || `${filters.maxTime} min`}
            onRemove={() => removeFilter('maxTime')}
          />
        )}
        {filters.maxCalories && (
          <FilterTag
            icon={<Flame className="h-3 w-3" />}
            label={calorieOptions.find(c => c.value === filters.maxCalories)?.label || `${filters.maxCalories} cal`}
            onRemove={() => removeFilter('maxCalories')}
          />
        )}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-gray-500 hover:text-gray-700 underline"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {isOpen && (
        <div className="mt-3 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Cuisine Type */}
            <FilterSelect
              label="Cuisine"
              icon={<UtensilsCrossed className="h-4 w-4" />}
              value={filters.cuisineType || ''}
              onChange={(v) => updateFilter('cuisineType', v as CuisineType || undefined)}
              options={cuisineOptions}
              placeholder="Any cuisine"
            />

            {/* Meal Type */}
            <FilterSelect
              label="Meal Type"
              value={filters.mealType || ''}
              onChange={(v) => updateFilter('mealType', v as EdamamMealType || undefined)}
              options={mealTypeOptions}
              placeholder="Any meal"
            />

            {/* Diet */}
            <FilterSelect
              label="Diet"
              icon={<Leaf className="h-4 w-4" />}
              value={filters.diet || ''}
              onChange={(v) => updateFilter('diet', v as DietType || undefined)}
              options={dietOptions}
              placeholder="Any diet"
            />

            {/* Health Labels */}
            <FilterSelect
              label="Dietary Restrictions"
              icon={<Heart className="h-4 w-4" />}
              value={filters.health || ''}
              onChange={(v) => updateFilter('health', v as HealthLabel || undefined)}
              options={healthOptions}
              placeholder="No restrictions"
            />

            {/* Max Time */}
            <FilterSelect
              label="Max Cooking Time"
              icon={<Clock className="h-4 w-4" />}
              value={filters.maxTime?.toString() || ''}
              onChange={(v) => updateFilter('maxTime', v ? parseInt(v) : undefined)}
              options={timeOptions.map(t => ({ value: t.value.toString(), label: t.label }))}
              placeholder="Any time"
            />

            {/* Max Calories */}
            <FilterSelect
              label="Max Calories/Serving"
              icon={<Flame className="h-4 w-4" />}
              value={filters.maxCalories?.toString() || ''}
              onChange={(v) => updateFilter('maxCalories', v ? parseInt(v) : undefined)}
              options={calorieOptions.map(c => ({ value: c.value.toString(), label: c.label }))}
              placeholder="Any calories"
            />
          </div>

          {/* Apply Button */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                onApplyFilters();
                setIsOpen(false);
              }}
              disabled={disabled}
              className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterTag({ icon, label, onRemove }: { icon?: React.ReactNode; label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center space-x-1 px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full">
      {icon && <span className="text-emerald-500">{icon}</span>}
      <span>{label}</span>
      <button
        onClick={onRemove}
        className="ml-1 text-emerald-400 hover:text-emerald-600"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

interface FilterSelectProps {
  label: string;
  icon?: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
}

function FilterSelect({ label, icon, value, onChange, options, placeholder }: FilterSelectProps) {
  return (
    <div>
      <label className="flex items-center space-x-1.5 text-sm font-medium text-gray-700 mb-1.5">
        {icon && <span className="text-gray-400">{icon}</span>}
        <span>{label}</span>
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { PantryItem, IngredientCategory } from '@/lib/types';
import { autoCategorize, formatCategory } from '@/lib/auto-categorize';
import { Plus, Trash2, Edit2, Search, X, Sparkles } from 'lucide-react';

const categories: IngredientCategory[] = [
  'produce', 'protein', 'dairy', 'pantry', 'spices', 'oils', 'frozen', 'beverages', 'other'
];

// Common units for auto-suggestion
const commonUnits = ['item', 'lb', 'oz', 'cup', 'tbsp', 'tsp', 'bunch', 'can', 'bottle', 'bag', 'box', 'jar'];

export default function PantryPage() {
  const [items, setItems] = useState<PantryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<PantryItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState<IngredientCategory>('other');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('item');
  const [autoDetected, setAutoDetected] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  // Auto-categorize when name changes
  useEffect(() => {
    if (name.trim()) {
      const detected = autoCategorize(name);
      setCategory(detected);
      setAutoDetected(true);
    } else {
      setCategory('other');
      setAutoDetected(false);
    }
  }, [name]);

  async function fetchItems() {
    const { data, error } = await supabase
      .from('pantry_items')
      .select('*')
      .order('category', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching items:', error);
    } else {
      setItems(data || []);
    }
    setLoading(false);
  }

  async function addItem(e: React.FormEvent) {
    e.preventDefault();
    
    const { error } = await supabase
      .from('pantry_items')
      .insert([{ name, category, quantity, unit }]);

    if (error) {
      console.error('Error adding item:', error);
    } else {
      setName('');
      setQuantity(1);
      setUnit('item');
      setCategory('other');
      setAutoDetected(false);
      setShowAddForm(false);
      fetchItems();
    }
  }

  async function updateItem(e: React.FormEvent) {
    e.preventDefault();
    if (!editingItem) return;

    const { error } = await supabase
      .from('pantry_items')
      .update({ name, category, quantity, unit })
      .eq('id', editingItem.id);

    if (error) {
      console.error('Error updating item:', error);
    } else {
      setEditingItem(null);
      setShowAddForm(false);
      fetchItems();
    }
  }

  async function deleteItem(id: string) {
    if (!confirm('Are you sure you want to delete this item?')) return;

    const { error } = await supabase
      .from('pantry_items')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting item:', error);
    } else {
      fetchItems();
    }
  }

  function startEditing(item: PantryItem) {
    setEditingItem(item);
    setName(item.name);
    setCategory(item.category);
    setQuantity(item.quantity);
    setUnit(item.unit);
    setAutoDetected(false);
    setShowAddForm(true);
  }

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, PantryItem[]>);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">My Pantry</h1>
        <button
          onClick={() => {
            setEditingItem(null);
            setName('');
            setCategory('other');
            setQuantity(1);
            setUnit('item');
            setAutoDetected(false);
            setShowAddForm(true);
          }}
          className="flex items-center justify-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors w-full sm:w-auto"
        >
          <Plus className="h-5 w-5" />
          <span>Add Item</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4 sm:mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
        <input
          type="text"
          placeholder="Search pantry items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 placeholder-gray-500 text-base"
        />
      </div>

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-5 sm:p-6 w-full max-w-sm mx-4 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                {editingItem ? 'Edit Item' : 'Add Item'}
              </h2>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingItem(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={editingItem ? updateItem : addItem} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Chicken breast, Apples..."
                  required
                  autoFocus
                  className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 placeholder-gray-400 text-base"
                />
              </div>
              
              {/* Auto-detected Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value as IngredientCategory);
                      setAutoDetected(false);
                    }}
                    className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 text-base appearance-none cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {formatCategory(cat)}
                      </option>
                    ))}
                  </select>
                  {autoDetected && !editingItem && (
                    <div className="absolute right-8 top-1/2 transform -translate-y-1/2 flex items-center text-emerald-600">
                      <Sparkles className="h-4 w-4 mr-1" />
                      <span className="text-xs font-medium">Auto</span>
                    </div>
                  )}
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {autoDetected && !editingItem && (
                  <p className="text-xs text-emerald-600 mt-1">
                    Category automatically detected. Change if needed.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    min="0"
                    step="0.1"
                    required
                    className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit
                  </label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="item, lb, cup"
                    list="units"
                    required
                    className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 placeholder-gray-400 text-base"
                  />
                  <datalist id="units">
                    {commonUnits.map(u => <option key={u} value={u} />)}
                  </datalist>
                </div>
              </div>
              <div className="flex space-x-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 text-white py-2.5 rounded-md hover:bg-emerald-700 transition-colors font-medium"
                >
                  {editingItem ? 'Update' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingItem(null);
                  }}
                  className="flex-1 bg-gray-200 text-gray-800 py-2.5 rounded-md hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Items List */}
      {items.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-600 text-lg">Your pantry is empty.</p>
          <p className="text-gray-500 text-sm mt-1 mb-4">Add ingredients to get recipe suggestions!</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Add your first item →
          </button>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {Object.entries(groupedItems).map(([category, categoryItems]) => (
            <div key={category}>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3 capitalize px-1">
                {category}
              </h3>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-100">
                {categoryItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 sm:p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0 pr-3">
                      <p className="font-medium text-gray-900 truncate">{item.name}</p>
                      <p className="text-sm text-gray-600">{item.quantity} {item.unit}</p>
                    </div>
                    <div className="flex space-x-1 sm:space-x-2 flex-shrink-0">
                      <button
                        onClick={() => startEditing(item)}
                        className="p-2 text-gray-500 hover:text-emerald-600 transition-colors"
                        aria-label={`Edit ${item.name}`}
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                        aria-label={`Delete ${item.name}`}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

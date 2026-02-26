'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { autoCategorize, formatCategory } from '@/lib/auto-categorize';
import { ShoppingCart, Trash2, Plus, X, Sparkles } from 'lucide-react';

interface ShoppingItem {
  id: string;
  name: string;
  category: string;
  amount: string;
  user_id?: string | null;
  created_at?: string;
}

const categories = ['Produce', 'Protein', 'Dairy', 'Pantry', 'Frozen', 'Other'];

export default function ShoppingPage() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Other');
  const [newItemAmount, setNewItemAmount] = useState('');
  const [autoDetected, setAutoDetected] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  // Auto-categorize when name changes
  useEffect(() => {
    if (newItemName.trim()) {
      const detected = autoCategorize(newItemName);
      // Capitalize first letter to match shopping list format
      const formatted = detected.charAt(0).toUpperCase() + detected.slice(1);
      // Check if the detected category is in our shopping list categories
      if (categories.includes(formatted)) {
        setNewItemCategory(formatted);
      } else {
        setNewItemCategory('Other');
      }
      setAutoDetected(true);
    } else {
      setNewItemCategory('Other');
      setAutoDetected(false);
    }
  }, [newItemName]);

  async function fetchItems() {
    setLoading(true);
    const { data, error } = await supabase
      .from('shopping_list')
      .select('*')
      .order('category', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching shopping items:', error);
      // Fallback to localStorage if DB fails
      const localItems = localStorage.getItem('shopping_list');
      if (localItems) {
        setItems(JSON.parse(localItems));
      }
    } else {
      setItems(data || []);
      // Sync to localStorage as backup
      localStorage.setItem('shopping_list', JSON.stringify(data || []));
    }
    setLoading(false);
  }

  async function addItem(e: React.FormEvent) {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem = {
      name: newItemName.trim(),
      category: newItemCategory,
      amount: newItemAmount.trim() || '1 item',
    };

    // Try to save to database first
    const { data, error } = await supabase
      .from('shopping_list')
      .insert([newItem])
      .select()
      .single();

    if (error) {
      console.error('Error adding item to DB:', error);
      // Fallback: add to local state and localStorage
      const fallbackItem: ShoppingItem = {
        id: Date.now().toString(),
        ...newItem,
      };
      const updatedItems = [...items, fallbackItem];
      setItems(updatedItems);
      localStorage.setItem('shopping_list', JSON.stringify(updatedItems));
    } else if (data) {
      setItems([...items, data]);
    }

    // Reset form
    setNewItemName('');
    setNewItemAmount('');
    setNewItemCategory('Other');
    setAutoDetected(false);
    setShowAddForm(false);
  }

  async function deleteItem(id: string) {
    // Try to delete from database
    const { error } = await supabase
      .from('shopping_list')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting item from DB:', error);
    }

    // Update local state regardless
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
    localStorage.setItem('shopping_list', JSON.stringify(updatedItems));
  }

  const groupedItems = categories.reduce((acc, category) => {
    const categoryItems = items.filter(item => item.category === category);
    if (categoryItems.length > 0) {
      acc[category] = categoryItems;
    }
    return acc;
  }, {} as Record<string, ShoppingItem[]>);

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
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Shopping List</h1>
          <p className="text-sm text-gray-600 mt-1">{items.length} items</p>
        </div>
        <button
          onClick={() => {
            setNewItemName('');
            setNewItemAmount('');
            setNewItemCategory('Other');
            setAutoDetected(false);
            setShowAddForm(true);
          }}
          className="flex items-center justify-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors w-full sm:w-auto"
        >
          <Plus className="h-5 w-5" />
          <span>Add Item</span>
        </button>
      </div>

      {/* Add Item Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-5 sm:p-6 w-full max-w-sm mx-4 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">Add Item</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={addItem} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name
                </label>
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="e.g., Chicken breast"
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
                    value={newItemCategory}
                    onChange={(e) => {
                      setNewItemCategory(e.target.value);
                      setAutoDetected(false);
                    }}
                    className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 text-base appearance-none cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {autoDetected && (
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
                {autoDetected && (
                  <p className="text-xs text-emerald-600 mt-1">
                    Category automatically detected. Change if needed.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="text"
                  value={newItemAmount}
                  onChange={(e) => setNewItemAmount(e.target.value)}
                  placeholder="e.g., 2 lbs, 1 bottle"
                  className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 placeholder-gray-400 text-base"
                />
              </div>
              <div className="flex space-x-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 text-white py-2.5 rounded-md hover:bg-emerald-700 transition-colors font-medium"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2.5 rounded-md hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Empty State */}
      {items.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <ShoppingCart className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Your shopping list is empty</p>
          <p className="text-gray-500 text-sm mt-1 mb-4">
            Add items manually or generate from your meal plan
          </p>
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
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3 px-1">
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
                      <p className="text-sm text-gray-600">{item.amount}</p>
                    </div>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="p-2 text-gray-500 hover:text-red-600 transition-colors flex-shrink-0"
                      aria-label={`Delete ${item.name}`}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
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

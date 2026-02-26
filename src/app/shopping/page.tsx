'use client';

import { useState } from 'react';
import { Check, ShoppingCart, Trash2 } from 'lucide-react';

interface ShoppingItem {
  id: string;
  name: string;
  category: string;
  amount: string;
  checked: boolean;
}

const categories = ['Produce', 'Protein', 'Dairy', 'Pantry', 'Frozen', 'Other'];

export default function ShoppingPage() {
  const [items, setItems] = useState<ShoppingItem[]>([
    { id: '1', name: 'Chicken breast', category: 'Protein', amount: '2 lbs', checked: false },
    { id: '2', name: 'Sweet potatoes', category: 'Produce', amount: '4', checked: false },
    { id: '3', name: 'Greek yogurt', category: 'Dairy', amount: '32 oz', checked: true },
    { id: '4', name: 'Soy sauce', category: 'Pantry', amount: '1 bottle', checked: false },
  ]);

  const toggleItem = (id: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const groupedItems = categories.reduce((acc, category) => {
    const categoryItems = items.filter(item => item.category === category);
    if (categoryItems.length > 0) {
      acc[category] = categoryItems;
    }
    return acc;
  }, {} as Record<string, ShoppingItem[]>);

  const progress = items.length > 0
    ? Math.round((items.filter(i => i.checked).length / items.length) * 100)
    : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Shopping List</h1>
        <div className="flex items-center space-x-4">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
              className="bg-emerald-600 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm text-gray-600">{progress}%</span>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Your shopping list is empty</p>
          <p className="text-gray-400 text-sm mt-1">
            Generate a list from your meal plan
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedItems).map(([category, categoryItems]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">{category}</h3>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-100">
                {categoryItems.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-4 transition-colors ${
                      item.checked ? 'bg-gray-50' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <button
                        onClick={() => toggleItem(item.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          item.checked
                            ? 'bg-emerald-600 border-emerald-600'
                            : 'border-gray-300 hover:border-emerald-500'
                        }`}
                      >
                        {item.checked && <Check className="h-4 w-4 text-white" />}
                      </button>
                      <div className={`flex-1 ${item.checked ? 'line-through text-gray-400' : ''}`}>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.amount}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
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

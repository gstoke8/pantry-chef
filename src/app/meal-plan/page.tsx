'use client';

import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const mealTypes = ['breakfast', 'lunch', 'dinner'];

export default function MealPlanPage() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [mealPlan, setMealPlan] = useState<Record<string, Record<string, string | null>>>({});

  const weekStart = new Date(currentWeek);
  weekStart.setDate(currentWeek.getDate() - currentWeek.getDay() + 1);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getDayDate = (dayIndex: number) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + dayIndex);
    return formatDate(date);
  };

  const addMeal = (day: string, mealType: string) => {
    alert(`Add meal for ${day} ${mealType} - Recipe selection coming soon!`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Meal Plan</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              const newDate = new Date(currentWeek);
              newDate.setDate(currentWeek.getDate() - 7);
              setCurrentWeek(newDate);
            }}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-emerald-600" />
            <span className="font-medium">
              Week of {formatDate(weekStart)}
            </span>
          </div>
          <button
            onClick={() => {
              const newDate = new Date(currentWeek);
              newDate.setDate(currentWeek.getDate() + 7);
              setCurrentWeek(newDate);
            }}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Weekly View */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-8 border-b border-gray-200">
          <div className="p-4 font-medium text-gray-500">Meal</div>
          {days.map((day, idx) => (
            <div key={day} className="p-4 text-center border-l border-gray-200">
              <div className="font-medium capitalize text-gray-900">{day}</div>
              <div className="text-sm text-gray-500">{getDayDate(idx)}</div>
            </div>
          ))}
        </div>

        {mealTypes.map((mealType) => (
          <div key={mealType} className="grid grid-cols-8 border-b border-gray-200 last:border-b-0">
            <div className="p-4 font-medium text-gray-700 capitalize bg-gray-50">
              {mealType}
            </div>
            {days.map((day) => (
              <div
                key={`${day}-${mealType}`}
                className="p-2 border-l border-gray-200 min-h-[100px]"
              >
                {mealPlan[day]?.[mealType] ? (
                  <div className="bg-emerald-50 p-2 rounded text-sm">
                    {mealPlan[day][mealType]}
                  </div>
                ) : (
                  <button
                    onClick={() => addMeal(day, mealType)}
                    className="w-full h-full flex items-center justify-center text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Shopping List Button */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => alert('Generate shopping list - Coming soon!')}
          className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
        >
          Generate Shopping List
        </button>
      </div>
    </div>
  );
}

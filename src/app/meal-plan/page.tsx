'use client';

import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const daysShort = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const mealTypes = ['breakfast', 'lunch', 'dinner'];

export default function MealPlanPage() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [mealPlan] = useState<Record<string, Record<string, string | null>>>({});

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
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Meal Plan</h1>
        <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-4">
          <button
            onClick={() => {
              const newDate = new Date(currentWeek);
              newDate.setDate(currentWeek.getDate() - 7);
              setCurrentWeek(newDate);
            }}
            className="p-2 hover:bg-gray-100 rounded-full"
            aria-label="Previous week"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-emerald-600 flex-shrink-0" />
            <span className="font-medium text-sm sm:text-base">
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
            aria-label="Next week"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Desktop Weekly View */}
      <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
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

      {/* Mobile Daily View */}
      <div className="md:hidden space-y-4">
        {days.map((day, idx) => (
          <div key={day} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <div className="font-medium capitalize text-gray-900">
                {day} <span className="text-gray-500 font-normal">· {getDayDate(idx)}</span>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {mealTypes.map((mealType) => (
                <div key={`${day}-${mealType}`} className="flex items-center justify-between p-3">
                  <span className="font-medium text-gray-700 capitalize text-sm w-20">
                    {mealType}
                  </span>
                  {mealPlan[day]?.[mealType] ? (
                    <div className="flex-1 bg-emerald-50 px-3 py-2 rounded text-sm ml-2">
                      {mealPlan[day][mealType]}
                    </div>
                  ) : (
                    <button
                      onClick={() => addMeal(day, mealType)}
                      className="flex-1 flex items-center justify-center text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded py-2 ml-2 transition-colors border border-dashed border-gray-300"
                    >
                      <Plus className="h-4 w-4" />
                      <span className="text-xs ml-1">Add</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Shopping List Button */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => alert('Generate shopping list - Coming soon!')}
          className="bg-emerald-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm sm:text-base w-full sm:w-auto"
        >
          Generate Shopping List
        </button>
      </div>
    </div>
  );
}

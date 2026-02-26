'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ChefHat, 
  ShoppingBasket, 
  Calendar, 
  ListTodo, 
  User 
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Recipes', icon: ChefHat },
  { href: '/pantry', label: 'Pantry', icon: ShoppingBasket },
  { href: '/meal-plan', label: 'Meal Plan', icon: Calendar },
  { href: '/shopping', label: 'Shopping', icon: ListTodo },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <ChefHat className="h-8 w-8 text-emerald-600" />
                <span className="text-xl font-bold text-gray-900">Pantry Chef</span>
              </Link>
            </div>
            <div className="flex items-center space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-emerald-600 bg-emerald-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? 'text-emerald-600'
                    : 'text-gray-600'
                }`}
              >
                <Icon className="h-6 w-6 mb-1" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Spacer for fixed header on desktop */}
      <div className="hidden md:block h-16" />
    </>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User, LogOut, ChefHat } from 'lucide-react';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    setLoading(false);
  }

  async function signInWithEmail() {
    const email = prompt('Enter your email:');
    if (!email) return;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      alert('Error signing in: ' + error.message);
    } else {
      alert('Check your email for the login link!');
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile</h1>

      {user ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-emerald-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{user.email}</p>
              <p className="text-sm text-gray-500">Signed in</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Data sync</span>
              <span className="text-emerald-600 text-sm font-medium">Enabled</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Pantry items</span>
              <span className="text-gray-900 font-medium">Coming soon</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Saved recipes</span>
              <span className="text-gray-900 font-medium">Coming soon</span>
            </div>
          </div>

          <button
            onClick={signOut}
            className="mt-6 w-full flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ChefHat className="h-10 w-10 text-emerald-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Sign in to sync your data
          </h2>
          <p className="text-gray-600 mb-6">
            Create an account to save your pantry, recipes, and meal plans across devices.
          </p>
          <button
            onClick={signInWithEmail}
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
          >
            Sign In with Email
          </button>
          <p className="text-sm text-gray-500 mt-4">
            Or continue using the app without signing in. Your data will be stored locally.
          </p>
        </div>
      )}
    </div>
  );
}

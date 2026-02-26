'use client';

import { useState, useEffect, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { User, LogOut, ChefHat, AlertCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

// Helper to get the correct site URL for auth redirects
function getSiteUrl(): string {
  // Check for environment variable first (set in production)
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  
  // Fallback to window location (works in browser)
  if (typeof window !== 'undefined') {
    // Check if we're on localhost
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return window.location.origin;
    }
    
    // In production, use the current origin
    return window.location.origin;
  }
  
  return 'http://localhost:3000';
}

function ProfileContent() {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    checkUser();
    
    // Check for error or success messages in URL
    const error = searchParams.get('error');
    if (error) {
      if (error === 'auth_failed') {
        setMessage('Sign in failed. Please try again.');
      } else if (error === 'unexpected') {
        setMessage('An unexpected error occurred. Please try again.');
      }
    }
  }, [searchParams]);

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    setLoading(false);
  }

  async function signInWithEmail() {
    const email = prompt('Enter your email:');
    if (!email) return;

    const siteUrl = getSiteUrl();
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${siteUrl}/auth/callback`,
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
    <div className="max-w-2xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Profile</h1>

      {/* Error Message */}
      {message && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700 text-sm">{message}</p>
        </div>
      )}

      {user ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="h-7 w-7 sm:h-8 sm:w-8 text-emerald-600" />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-gray-900 truncate">{user.email}</p>
              <p className="text-sm text-gray-500">Signed in</p>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-100">
              <span className="text-gray-600 text-sm sm:text-base">Data sync</span>
              <span className="text-emerald-600 text-xs sm:text-sm font-medium">Enabled</span>
            </div>
            <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-100">
              <span className="text-gray-600 text-sm sm:text-base">Pantry items</span>
              <span className="text-gray-900 text-xs sm:text-sm font-medium">Coming soon</span>
            </div>
            <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-100">
              <span className="text-gray-600 text-sm sm:text-base">Saved recipes</span>
              <span className="text-gray-900 text-xs sm:text-sm font-medium">Coming soon</span>
            </div>
          </div>

          <button
            onClick={signOut}
            className="mt-5 sm:mt-6 w-full flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 sm:p-8 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ChefHat className="h-8 w-8 sm:h-10 sm:w-10 text-emerald-600" />
          </div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
            Sign in to sync your data
          </h2>
          <p className="text-gray-600 mb-5 sm:mb-6 text-sm sm:text-base">
            Create an account to save your pantry, recipes, and meal plans across devices.
          </p>
          <button
            onClick={signInWithEmail}
            className="bg-emerald-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium w-full sm:w-auto"
          >
            Sign In with Email
          </button>
          <p className="text-xs sm:text-sm text-gray-500 mt-4">
            Or continue using the app without signing in. Your data will be stored locally.
          </p>
        </div>
      )}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    }>
      <ProfileContent />
    </Suspense>
  );
}

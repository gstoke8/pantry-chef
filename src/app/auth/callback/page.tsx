'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Get the hash fragment or query params
      const hash = window.location.hash;
      const query = window.location.search;

      try {
        // Supabase handles the OAuth/token exchange automatically
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Auth callback error:', error);
          router.push('/profile?error=auth_failed');
          return;
        }

        if (session) {
          // Successfully authenticated
          router.push('/profile');
        } else {
          // No session, redirect to profile
          router.push('/profile');
        }
      } catch (err) {
        console.error('Unexpected error in auth callback:', err);
        router.push('/profile?error=unexpected');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
      <p className="text-gray-600">Completing sign in...</p>
    </div>
  );
}

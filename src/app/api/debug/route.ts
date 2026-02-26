import { NextResponse } from 'next/server';

export async function GET() {
  // Check environment variables (safely)
  const envCheck = {
    EDAMAM_APP_ID: {
      exists: !!process.env.NEXT_PUBLIC_EDAMAM_APP_ID,
      length: process.env.NEXT_PUBLIC_EDAMAM_APP_ID?.length || 0,
      first4: process.env.NEXT_PUBLIC_EDAMAM_APP_ID?.substring(0, 4) || 'none',
    },
    EDAMAM_APP_KEY: {
      exists: !!process.env.NEXT_PUBLIC_EDAMAM_APP_KEY,
      length: process.env.NEXT_PUBLIC_EDAMAM_APP_KEY?.length || 0,
      first4: process.env.NEXT_PUBLIC_EDAMAM_APP_KEY?.substring(0, 4) || 'none',
    },
    SUPABASE_URL: {
      exists: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    },
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
  };

  // Test Edamam API connection
  let apiTest = { success: false, error: null as string | null, status: null as number | null };
  
  if (process.env.NEXT_PUBLIC_EDAMAM_APP_ID && process.env.NEXT_PUBLIC_EDAMAM_APP_KEY) {
    try {
      const params = new URLSearchParams({
        type: 'public',
        q: 'chicken',
        app_id: process.env.NEXT_PUBLIC_EDAMAM_APP_ID,
        app_key: process.env.NEXT_PUBLIC_EDAMAM_APP_KEY,
        from: '0',
        to: '1',
      });

      const response = await fetch(`https://api.edamam.com/api/recipes/v2?${params}`);
      apiTest.status = response.status;
      apiTest.success = response.ok;
      
      if (!response.ok) {
        const errorText = await response.text();
        apiTest.error = errorText.substring(0, 200);
      }
    } catch (err) {
      apiTest.error = (err as Error).message;
    }
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    environment: envCheck,
    apiTest,
  });
}

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Check which env vars are set (without exposing values)
  const envStatus = {
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_EDAMAM_APP_ID: !!process.env.NEXT_PUBLIC_EDAMAM_APP_ID,
    NEXT_PUBLIC_EDAMAM_APP_KEY: !!process.env.NEXT_PUBLIC_EDAMAM_APP_KEY,
    SPOONACULAR_API_KEY: !!process.env.SPOONACULAR_API_KEY,
  };

  // Test Edamam API connection
  let edamamTest = { status: 'not_tested', error: null as string | null };
  
  const appId = process.env.NEXT_PUBLIC_EDAMAM_APP_ID;
  const appKey = process.env.NEXT_PUBLIC_EDAMAM_APP_KEY;
  
  if (appId && appKey) {
    try {
      const testUrl = `https://api.edamam.com/api/recipes/v2?type=public&q=test&app_id=${appId}&app_key=${appKey}&from=0&to=1`;
      const response = await fetch(testUrl, {
        headers: { 'Edamam-Account-User': 'diagnostic' },
      });
      
      edamamTest = {
        status: response.status === 200 ? 'ok' : `error_${response.status}`,
        error: response.status !== 200 ? await response.text() : null,
      };
    } catch (e) {
      edamamTest = {
        status: 'exception',
        error: (e as Error).message,
      };
    }
  } else {
    edamamTest = {
      status: 'missing_keys',
      error: 'EDAMAM_APP_ID or EDAMAM_APP_KEY not set',
    };
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown',
    envVarsConfigured: envStatus,
    edamamConnection: edamamTest,
    // Safe to expose partial key ID for debugging
    edamamAppIdPrefix: appId ? `${appId.substring(0, 4)}...` : 'not_set',
  });
}

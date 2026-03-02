import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Get env vars
  const appId = process.env.NEXT_PUBLIC_EDAMAM_APP_ID || '';
  const appKey = process.env.NEXT_PUBLIC_EDAMAM_APP_KEY || '';
  
  // Log for debugging (these appear in Vercel logs)
  console.log('Debug env check:', {
    appIdLength: appId.length,
    appKeyLength: appKey.length,
    appIdPrefix: appId.substring(0, 4),
    nodeEnv: process.env.NODE_ENV,
  });
  
  // Test API call
  let apiTest = { status: 'not_tested', error: null as string | null };
  
  if (appId && appKey) {
    try {
      const testUrl = `https://api.edamam.com/api/recipes/v2?type=public&q=test&app_id=${appId}&app_key=${appKey}&from=0&to=1`;
      const response = await fetch(testUrl, {
        headers: { 'Edamam-Account-User': 'test-user' },
      });
      
      const responseText = await response.text();
      
      apiTest = {
        status: response.status === 200 ? 'ok' : `error_${response.status}`,
        error: response.status !== 200 ? responseText.substring(0, 200) : null,
      };
    } catch (e) {
      apiTest = {
        status: 'exception',
        error: (e as Error).message,
      };
    }
  } else {
    apiTest = {
      status: 'missing_credentials',
      error: 'APP_ID or APP_KEY not set in environment',
    };
  }
  
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown',
    credentials: {
      appIdConfigured: !!appId,
      appIdLength: appId.length,
      appIdPrefix: appId ? `${appId.substring(0, 4)}...` : 'not_set',
      appKeyConfigured: !!appKey,
      appKeyLength: appKey.length,
    },
    apiTest,
    message: apiTest.status === 'ok' 
      ? '✅ API credentials are working!' 
      : '❌ API credentials not working. Check Vercel Dashboard.',
  });
}

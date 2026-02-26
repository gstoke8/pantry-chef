import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET() {
  const results: any = {
    timestamp: new Date().toISOString(),
    env: {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasEdamamAppId: !!process.env.NEXT_PUBLIC_EDAMAM_APP_ID,
      hasEdamamAppKey: !!process.env.NEXT_PUBLIC_EDAMAM_APP_KEY,
    },
    tests: {}
  };

  // Test 1: Check Supabase connection
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: pantryItems, error } = await supabase
      .from('pantry_items')
      .select('*')
      .limit(10);
    
    results.tests.supabase = {
      success: !error,
      itemCount: pantryItems?.length || 0,
      items: pantryItems?.map((i: any) => i.name) || [],
      error: error?.message || null
    };
  } catch (e) {
    results.tests.supabase = { success: false, error: (e as Error).message };
  }

  // Test 2: Check Edamam API
  if (process.env.NEXT_PUBLIC_EDAMAM_APP_ID && process.env.NEXT_PUBLIC_EDAMAM_APP_KEY) {
    try {
      const params = new URLSearchParams({
        type: 'public',
        q: 'chicken',
        app_id: process.env.NEXT_PUBLIC_EDAMAM_APP_ID,
        app_key: process.env.NEXT_PUBLIC_EDAMAM_APP_KEY,
        from: '0',
        to: '2',
      });

      const response = await fetch(`https://api.edamam.com/api/recipes/v2?${params}`, {
        headers: { 'Edamam-Account-User': 'pantry-chef-user' },
      });

      const responseText = await response.text();
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch {
        responseData = responseText;
      }

      results.tests.edamam = {
        status: response.status,
        ok: response.ok,
        recipeCount: responseData?.hits?.length || 0,
        firstRecipe: responseData?.hits?.[0]?.recipe?.label || null,
        error: response.ok ? null : responseData
      };
    } catch (e) {
      results.tests.edamam = { success: false, error: (e as Error).message };
    }
  } else {
    results.tests.edamam = { success: false, error: 'Missing API keys' };
  }

  return NextResponse.json(results);
}

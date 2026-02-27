import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    status: 'ok',
    message: 'Debug endpoint working',
    env: {
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      edamamAppId: !!process.env.NEXT_PUBLIC_EDAMAM_APP_ID,
      edamamAppKey: !!process.env.NEXT_PUBLIC_EDAMAM_APP_KEY,
    }
  });
}

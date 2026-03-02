# Edamam API 401 Error Troubleshooting

## Problem
Getting "API Error: Edamam API error: 401" on the deployed app.

## Common Causes & Fixes

### 1. Environment Variables Not Set in Vercel (Most Likely)

The `.env.local` file only works for local development. **You MUST set the env vars in Vercel Dashboard:**

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Find your `pantry-chef` project
3. Click **Settings** → **Environment Variables**
4. Add these 4 variables:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://quweqhyauybchwvbavtx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_S7qVPYPmkILwvL2uS8sVQg_T-0IaczI` |
| `NEXT_PUBLIC_EDAMAM_APP_ID` | `c3ee7bf2` |
| `NEXT_PUBLIC_EDAMAM_APP_KEY` | `c93a076c000aaa8c3ab0e66d67bbda7c` |

5. Click **Save**
6. **Redeploy** the project (Vercel will auto-redeploy on next push, or manually trigger)

### 2. Test Your Edamam API Keys

Run this curl command to verify your keys work:

```bash
curl "https://api.edamam.com/api/recipes/v2?type=public&q=chicken&app_id=c3ee7bf2&app_key=c93a076c000aaa8c3ab0e66d67bbda7c&from=0&to=1" \
  -H "Edamam-Account-User: test"
```

**Expected:** JSON response with recipes  
**401 Error:** Keys are invalid or tier mismatch

### 3. Check Your Edamam Plan Status

1. Log in to [developer.edamam.com](https://developer.edamam.com)
2. Go to **Dashboard** → **Applications**
3. Check if your app shows "Developer" or "Free"
4. If still on Free tier:
   - Click **Plans & Pricing**
   - Select **Developer** ($29/mo)
   - Your existing keys will gain paid features immediately

### 4. Test Locally First

```bash
cd ~/.openclaw/workspace/pantry-chef-app
npm run dev
```

Then open http://localhost:3000 and check if recipes load. If they work locally but not on Vercel → definitely an env var issue.

## Quick Diagnostic Script

I can add a debug endpoint to verify what's happening. Should I do that?

## Checklist

- [ ] Env vars set in Vercel Dashboard
- [ ] Edamam Developer plan activated
- [ ] API keys tested with curl
- [ ] App redeployed after env changes

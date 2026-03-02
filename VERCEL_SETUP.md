# Vercel Environment Variables Setup

## ⚠️ CRITICAL: You MUST add these to Vercel Dashboard

The `.env.local` file in your repo **only works for local development**. For the deployed app to work, you need to add these in Vercel's dashboard.

## Step-by-Step Instructions

### 1. Go to Vercel Dashboard
Open: https://vercel.com/dashboard

### 2. Find Your Project
Click on the `pantry-chef` project

### 3. Open Settings
Click the **Settings** tab at the top

### 4. Add Environment Variables
In the left sidebar, click **Environment Variables**

### 5. Add These 6 Variables

Click **Add** for each one:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://quweqhyauybchwvbavtx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_S7qVPYPmkILwvL2uS8sVQg_T-0IaczI` |
| `NEXT_PUBLIC_EDAMAM_APP_ID` | `c3ee7bf2` |
| `NEXT_PUBLIC_EDAMAM_APP_KEY` | `c93a076c000aaa8c3ab0e66d67bbda7c` |
| `SPOONACULAR_API_KEY` | `f8fc8e2443ea495cb26648598654e957` |
| `NEXT_PUBLIC_SITE_URL` | `https://pantry-chef.vercel.app` |

### 6. Save and Redeploy

1. After adding all variables, scroll down and click **Save**
2. Go to the **Deployments** tab
3. Find the latest deployment
4. Click the three dots (⋯) on the right
5. Select **Redeploy**

### 7. Wait for Redeploy

Wait ~1 minute for the new deployment to finish.

### 8. Test

Hard refresh your app (Cmd+Shift+R) and try searching for recipes.

---

## Quick Check

After redeploying, visit this URL to verify:
```
https://pantry-chef.vercel.app/api/debug/env
```

You should see:
```json
{
  "envVarsConfigured": {
    "NEXT_PUBLIC_EDAMAM_APP_ID": true,
    "NEXT_PUBLIC_EDAMAM_APP_KEY": true,
    ...
  },
  "edamamConnection": {
    "status": "ok"
  }
}
```

If `edamamConnection.status` is NOT "ok", the env vars aren't set correctly.

---

## Why This Happens

Vercel deployments don't read from `.env.local` for security reasons. You must explicitly set env vars in their dashboard so they're injected into the serverless functions at runtime.

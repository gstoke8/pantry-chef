# Edamam API Troubleshooting

## Problem: 401 Error

Getting "API Error: Edamam API error: 401" on the deployed app.

### Fix: Environment Variables Not Set in Vercel

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
6. **Redeploy** the project

---

## Problem: "No recipes found for your ingredients (0 returned)"

The API is working but returning zero recipes for your pantry items.

### Common Causes

1. **Too many filters applied** — Try removing filters
2. **Uncommon ingredient combinations** — Edamam may not have recipes for exotic mixes
3. **Single ingredient search** — Try adding more common ingredients (chicken, rice, pasta, eggs)
4. **Filters + random conflict** — Some Edamam tiers don't support `random=true` with filters

### Solutions

1. **Click "Try without filters"** button when it appears
2. **Add more common ingredients** to your pantry
3. **Check the diagnostic endpoint** to see exactly what's being sent:
   ```
   https://pantry-chef.vercel.app/api/debug/env
   ```

### Test Your Ingredients

Visit this URL directly to test (replace INGREDIENTS with your items):
```
https://api.edamam.com/api/recipes/v2?type=public&q=chicken+rice+garlic&app_id=YOUR_ID&app_key=YOUR_KEY&from=0&to=5
```

---

## Diagnostic Tools

### 1. Environment Check
Visit: `https://pantry-chef.vercel.app/api/debug/env`

Shows:
- Which environment variables are configured
- Live Edamam API test result
- Specific error details

### 2. Test with curl

```bash
# Test basic connectivity
curl "https://api.edamam.com/api/recipes/v2?type=public&q=chicken&app_id=c3ee7bf2&app_key=c93a076c000aaa8c3ab0e66d67bbda7c&from=0&to=1" \
  -H "Edamam-Account-User: test"
```

**Expected:** JSON response with recipes  
**401 Error:** Keys are invalid or tier mismatch

---

## Check Your Edamam Plan Status

1. Log in to [developer.edamam.com](https://developer.edamam.com)
2. Go to **Dashboard** → **Applications**
3. Check if your app shows "Developer" or "Free"
4. If still on Free tier:
   - Click **Plans & Pricing**
   - Select **Developer** ($29/mo)
   - Your existing keys will gain paid features immediately

---

## Test Locally First

```bash
cd ~/.openclaw/workspace/pantry-chef-app
npm run dev
```

Then open http://localhost:3000 and check if recipes load. If they work locally but not on Vercel → env var issue.

---

## Checklist

- [ ] Env vars set in Vercel Dashboard
- [ ] Edamam Developer plan activated
- [ ] API keys tested with curl
- [ ] App redeployed after env changes
- [ ] Tried "Try without filters" when getting 0 results
- [ ] Added common ingredients (chicken, rice, pasta) to pantry

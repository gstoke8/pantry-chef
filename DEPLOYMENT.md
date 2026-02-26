# 🚀 Deployment Guide

## Quick Start

Your Pantry Chef app is now on GitHub! Here's how to deploy it:

---

## Step 1: Get API Keys

### 1. Supabase (Database)
1. Go to [supabase.com](https://supabase.com)
2. Create a free account
3. Create a new project
4. Go to Project Settings → API
5. Copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `Project API Keys` (anon/public) → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Go to SQL Editor and run the schema from `supabase-schema.sql`

### 2. Spoonacular (Recipes)
1. Go to [spoonacular.com/food-api](https://spoonacular.com/food-api)
2. Sign up for free account
3. Get your API key from dashboard
4. Copy → `SPOONACULAR_API_KEY`

### 3. Edamam (Nutrition)
1. Go to [developer.edamam.com](https://developer.edamam.com)
2. Create free account
3. Create a new app
4. Get:
   - Application ID → `NEXT_PUBLIC_EDAMAM_APP_ID`
   - Application Keys → `NEXT_PUBLIC_EDAMAM_APP_KEY`

---

## Step 2: Connect to Vercel (Easiest Method)

### Deploy from Vercel Dashboard (Recommended)

**This is the simplest and most reliable method:**

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Sign in with your GitHub account
3. Click **"Add New Project"**
4. Find and select your `pantry-chef` repository
5. Click **"Import"**
6. In the configuration screen, add these Environment Variables:

| Variable | Value | Required? |
|----------|-------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | ✅ Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | ✅ Yes |
| `NEXT_PUBLIC_SITE_URL` | Your production URL (e.g., https://pantry-chef.vercel.app) | ✅ Yes |
| `SPOONACULAR_API_KEY` | Your Spoonacular API key | ⚠️ Optional |
| `NEXT_PUBLIC_EDAMAM_APP_ID` | Your Edamam app ID | ⚠️ Optional |
| `NEXT_PUBLIC_EDAMAM_APP_KEY` | Your Edamam app key | ⚠️ Optional |

7. Click **"Deploy"**

**That's it!** Vercel will automatically:
- Build your app
- Deploy it to a global CDN
- Give you a URL like `https://pantry-chef.vercel.app`
- Auto-deploy on every push to GitHub

### Why Not GitHub Actions?

The GitHub Actions approach requires storing Vercel tokens as secrets, which is more complex. The Vercel Dashboard method is:
- ✅ Easier to set up
- ✅ More reliable
- ✅ Auto-configures webhooks
- ✅ Better error messages

Use the Dashboard method unless you need advanced CI/CD features.

### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add NEXT_PUBLIC_SITE_URL
vercel env add SPOONACULAR_API_KEY
vercel env add NEXT_PUBLIC_EDAMAM_APP_ID
vercel env add NEXT_PUBLIC_EDAMAM_APP_KEY
```

---

## Step 3: Set Up GitHub Secrets (Optional)

For automatic deployments via GitHub Actions:

1. Go to your GitHub repo → Settings → Secrets and variables → Actions
2. Add these secrets:

```
VERCEL_TOKEN          # From vercel.com/account/tokens
VERCEL_ORG_ID         # From .vercel/project.json after first deploy
VERCEL_PROJECT_ID     # From .vercel/project.json after first deploy
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_SITE_URL
SPOONACULAR_API_KEY
NEXT_PUBLIC_EDAMAM_APP_ID
NEXT_PUBLIC_EDAMAM_APP_KEY
```

---

## Step 4: Update Supabase Schema

After deploying, make sure to update your Supabase database schema:

1. Go to your Supabase project dashboard
2. Open the SQL Editor
3. Run the updated schema from `supabase-schema.sql` (includes new `shopping_list` table)
4. Verify all tables are created:
   - `pantry_items`
   - `recipes`
   - `meal_plans`
   - `shopping_lists`
   - `shopping_list`

---

## Step 5: Verify Deployment

Once deployed, check:

- ✅ App loads without errors
- ✅ Can add items to pantry
- ✅ Recipe search works
- ✅ Supabase database connected
- ✅ Shopping list add/delete works
- ✅ Mobile layout looks good
- ✅ Email sign-in redirects correctly

---

## 📊 Usage Limits (Free Tiers)

| Service | Free Limit | Cost if Exceeded |
|---------|-----------|------------------|
| Vercel | 100GB bandwidth | $20/mo |
| Supabase | 500MB storage | $25/mo |
| Spoonacular | 150 calls/day | $29/mo |
| Edamam | 10K calls/month | $29/mo |

For personal use, you'll likely stay on free tiers for months/years.

---

## 🔧 Custom Domain (Optional)

1. Buy domain (e.g., Namecheap, Cloudflare)
2. Go to Vercel Dashboard → Project → Settings → Domains
3. Add your domain
4. Update DNS records as instructed
5. **Important**: Update `NEXT_PUBLIC_SITE_URL` env var to your custom domain

---

## 🐛 Troubleshooting

**Build fails?**
- Check all environment variables are set
- Verify API keys are correct

**Database errors?**
- Ensure Supabase schema is set up (run `supabase-schema.sql`)
- Check RLS policies are configured

**Recipe search not working?**
- Verify Edamam API keys are set correctly
- Check browser console for errors

**Email sign-in redirects to localhost?**
- Make sure `NEXT_PUBLIC_SITE_URL` is set to your production URL
- Update the Site URL in Supabase Auth settings

**Shopping list not persisting?**
- Verify the `shopping_list` table exists in Supabase
- Check that RLS policies allow inserts

---

## 📱 Next Steps

After deployment:

1. Test on mobile (it's PWA-ready!)
2. Add your pantry items
3. Try recipe search
4. Plan your first week of meals
5. Generate a shopping list

---

## 🔄 Recent Updates

### Feb 26, 2026
- ✅ Mobile responsive layout fixes
- ✅ Shopping list now persists to Supabase
- ✅ Added add/delete functionality to shopping list
- ✅ Removed check-off functionality (per request)
- ✅ Fixed email confirmation redirect
- ✅ Added auth callback handler
- ✅ Fixed duplicate API variable declarations

---

**Your app is ready to deploy! 🎉**

GitHub Repo: https://github.com/gstoke8/pantry-chef

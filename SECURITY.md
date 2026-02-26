# 🔐 API Key Security Guide

## Where to Store Your API Keys

### ✅ SECURE: Local Environment File

**File:** `.env.local` (already created in your project)

**Why it's safe:**
- Listed in `.gitignore` - won't be committed to GitHub
- Stays on your local machine only
- Loaded automatically by Next.js
- Not visible in browser or bundled code

**How to use:**
```bash
# 1. Copy the template
cp .env.local.example .env.local

# 2. Edit with your real keys
nano .env.local
# or use any text editor

# 3. Save and restart dev server
npm run dev
```

---

### ✅ SECURE: Password Manager

**For backup/storage:**
- 1Password
- LastPass
- Bitwarden
- Apple Keychain

**Create a secure note:**
```
Title: Pantry Chef API Keys

Supabase:
- URL: https://...supabase.co
- Key: eyJ...

Spoonacular:
- Key: 123...

Edamam:
- App ID: abc...
- Key: def...
```

---

### ⚠️  WARNING: What NOT to Do

❌ **Don't commit keys to GitHub**
```bash
# BAD - Never do this
git add .env.local
git commit -m "add keys"
```

❌ **Don't share keys in messages**
```
# BAD - Never share in chat/email
"Hey, my API key is: abc123..."
```

❌ **Don't hardcode in source files**
```javascript
// BAD - Never do this
const API_KEY = "abc123..."; // in your code
```

❌ **Don't screenshot and share**
- Screenshots of code often show API keys
- Crop carefully or blur sensitive data

---

## How to Check If Keys Are Safe

### Test 1: Git Status
```bash
git status
```
**Should NOT see:** `.env.local`

### Test 2: Git Log
```bash
git log --all --full-history -- .env.local
```
**Should see:** No commits of this file

### Test 3: GitHub Repo
Go to your repo on GitHub → Browse files
**Should NOT see:** `.env.local`

---

## What To Do If Keys Are Exposed

### 🚨 Step 1: Revoke Immediately

**Supabase:**
- Go to Project Settings → API
- Click "Generate new anon key"

**Spoonacular:**
- Go to Dashboard → API Key
- Click "Regenerate"

**Edamam:**
- Go to Dashboard → Applications
- Delete old app, create new one

### 🚨 Step 2: Update Local File

```bash
# Edit .env.local with new keys
nano .env.local

# Restart your app
npm run dev
```

### 🚨 Step 3: Update Production

If deployed to Vercel:
- Go to Vercel Dashboard → Project → Settings → Environment Variables
- Delete old keys, add new ones
- Redeploy

---

## Quick Reference

### File Locations

| File | Purpose | Safe to Commit? |
|------|---------|----------------|
| `.env.local` | Your real keys | ❌ NO |
| `.env.local.example` | Template with placeholders | ✅ YES |
| `src/lib/api.ts` | API code (no keys) | ✅ YES |

### Key Rotation Schedule

| Service | Rotate When | How |
|---------|-------------|-----|
| Supabase | Every 6 months | Dashboard → Generate new key |
| Spoonacular | If limit exceeded | Dashboard → Regenerate |
| Edamam | If limit exceeded | Dashboard → New app |

---

## Questions?

**Q: Can I share my app without sharing keys?**
A: Yes! The code is public, keys stay private. Each developer uses their own keys.

**Q: What if I lose my keys?**
A: Generate new ones from the dashboard. Free tier allows this.

**Q: Can someone steal keys from my deployed app?**
A: No - server-side keys stay on Vercel servers, never sent to browser.

---

**Remember: Your keys = Your responsibility! 🔒**

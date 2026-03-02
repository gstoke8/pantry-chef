# Pantry Chef

A mobile-first web app for managing your pantry, finding recipes based on available ingredients, planning meals, and generating shopping lists.

## Features

- **Pantry Management** — Add, edit, and organize your ingredients by category
- **Recipe Finder** — Get personalized recipe suggestions based on your pantry
- **Advanced Filters** — Filter by cuisine, meal type, diet, health labels, cooking time, and calories (paid tier)
- **Meal Planner** — Plan your weekly meals with an intuitive calendar view
- **Shopping Lists** — Auto-generate shopping lists from your meal plan
- **Nutritional Info** — Detailed nutrition data with full micronutrient profiles (paid tier)
- **Dietary Labels** — Vegan, keto, gluten-free, and 40+ health labels (paid tier)
- **Optional Accounts** — Sync across devices or use locally

## Tech Stack

- **Frontend:** Next.js 14 + TypeScript + Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **APIs:** Spoonacular + Edamam (recipe data)
- **Deployment:** Vercel (via GitHub Actions)
- **Mobile:** PWA support for iOS/Android

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Free accounts on:
  - [Supabase](https://supabase.com)
  - [Spoonacular](https://spoonacular.com/food-api)
  - [Edamam](https://developer.edamam.com/)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/pantry-chef.git
cd pantry-chef
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.local.example .env.local
```

4. Fill in your API keys in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
SPOONACULAR_API_KEY=your_spoonacular_key
EDAMAM_APP_ID=your_edamam_id
EDAMAM_APP_KEY=your_edamam_key
```

5. Set up the database:
   - Go to Supabase Dashboard → SQL Editor
   - Copy contents of `src/lib/database-schema.ts`
   - Run the SQL to create tables

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000)

### Deploy to Vercel

1. Push to GitHub:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. Connect to Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables from `.env.local`
   - Deploy!

## API Rate Limits

- **Spoonacular:** 150 calls/day (free tier)
- **Edamam:** 10,000 calls/month (free tier) → **100,000+ with paid tier**
- **Supabase:** 500MB storage (free tier)

### Edamam Paid Tier Benefits

The app supports Edamam's paid tier with enhanced features:

| Feature | Free | Paid (Developer) |
|---------|------|------------------|
| Monthly calls | 10,000 | 100,000 |
| Results per search | 20 | Up to 100 |
| Cuisine filters | ❌ | ✅ |
| Meal type filters | ❌ | ✅ |
| Diet/health filters | ❌ | ✅ 40+ labels |
| Time/calorie filters | ❌ | ✅ |
| Micronutrients | Basic | Full profile |
| Cost | Free | $29/month |

**To upgrade:**
1. Go to [developer.edamam.com](https://developer.edamam.com)
2. Navigate to "Plans & Pricing"
3. Select "Developer" plan
4. Your existing API keys will automatically gain access to paid features

## Folder Structure

```
pantry-chef/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   ├── lib/             # Utilities, API, types
│   └── ...
├── public/              # Static assets
├── .env.local.example   # Environment template
└── README.md
```

## Roadmap

- [ ] Recipe detail view with full instructions
- [ ] Favorites and saved recipes
- [ ] Barcode scanning for pantry items
- [ ] Meal plan templates
- [ ] Cost tracking per recipe
- [ ] Dark mode

## License

MIT

## Credits

- Recipe data from [Spoonacular](https://spoonacular.com)
- Nutrition data from [Edamam](https://edamam.com)

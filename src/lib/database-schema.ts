// Database schema for Pantry Chef App
// Supabase PostgreSQL

export const databaseSchema = `
-- Enable Row Level Security
alter table if exists public.profiles enable row level security;
alter table if exists public.pantry_items enable row level security;
alter table if exists public.recipes enable row level security;
alter table if exists public.meal_plans enable row level security;
alter table if exists public.shopping_lists enable row level security;

-- Profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique,
  full_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Pantry items table
create table if not exists public.pantry_items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  name text not null,
  category text not null, -- produce, protein, pantry, dairy, etc.
  quantity numeric default 1,
  unit text default 'item', -- item, lb, oz, cup, etc.
  expires_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Recipes table (cached from APIs or user-created)
create table if not exists public.recipes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  spoonacular_id integer,
  title text not null,
  image text,
  ingredients jsonb not null, -- array of {name, amount, unit}
  instructions jsonb, -- array of steps
  nutrition jsonb, -- {calories, protein, carbs, fat, fiber, sugar, sodium}
  prep_time integer, -- minutes
  cook_time integer, -- minutes
  servings integer default 4,
  source text default 'spoonacular', -- spoonacular, edamam, ai-generated
  is_favorite boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Meal plans table
create table if not exists public.meal_plans (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  week_start date not null,
  meals jsonb not null, -- {monday: {breakfast: recipeId, lunch: recipeId, dinner: recipeId}, ...}
  nutrition_totals jsonb, -- aggregated nutrition for the week
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Shopping lists table
create table if not exists public.shopping_lists (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  meal_plan_id uuid references public.meal_plans on delete cascade,
  items jsonb not null, -- array of {name, category, amount, unit, checked, recipe_source}
  is_complete boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for better performance
create index if not exists idx_pantry_items_user_id on public.pantry_items(user_id);
create index if not exists idx_pantry_items_category on public.pantry_items(category);
create index if not exists idx_recipes_user_id on public.recipes(user_id);
create index if not exists idx_meal_plans_user_id on public.meal_plans(user_id);
create index if not exists idx_shopping_lists_user_id on public.shopping_lists(user_id);

-- Row Level Security policies
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Users can view own pantry items" on public.pantry_items
  for select using (auth.uid() = user_id);

create policy "Users can manage own pantry items" on public.pantry_items
  for all using (auth.uid() = user_id);

create policy "Users can view own recipes" on public.recipes
  for select using (auth.uid() = user_id or user_id is null);

create policy "Users can manage own recipes" on public.recipes
  for all using (auth.uid() = user_id);

create policy "Users can view own meal plans" on public.meal_plans
  for select using (auth.uid() = user_id);

create policy "Users can manage own meal plans" on public.meal_plans
  for all using (auth.uid() = user_id);

create policy "Users can view own shopping lists" on public.shopping_lists
  for select using (auth.uid() = user_id);

create policy "Users can manage own shopping lists" on public.shopping_lists
  for all using (auth.uid() = user_id);

-- Function to handle user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
`;

export default databaseSchema;
-- Pantry Chef Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create pantry_items table
CREATE TABLE IF NOT EXISTS public.pantry_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity NUMERIC DEFAULT 1,
  unit TEXT DEFAULT 'item',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create recipes table
CREATE TABLE IF NOT EXISTS public.recipes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID,
  spoonacular_id INTEGER,
  title TEXT NOT NULL,
  image TEXT,
  ingredients JSONB DEFAULT '[]',
  instructions JSONB DEFAULT '[]',
  nutrition JSONB,
  prep_time INTEGER,
  cook_time INTEGER,
  servings INTEGER DEFAULT 4,
  source TEXT DEFAULT 'spoonacular',
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create meal_plans table
CREATE TABLE IF NOT EXISTS public.meal_plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL,
  week_start DATE NOT NULL,
  meals JSONB DEFAULT '{}',
  nutrition_totals JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create shopping_lists table (for generated lists from meal plans)
CREATE TABLE IF NOT EXISTS public.shopping_lists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL,
  meal_plan_id UUID,
  items JSONB DEFAULT '[]',
  is_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create shopping_list table (for individual items)
CREATE TABLE IF NOT EXISTS public.shopping_list (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Other',
  amount TEXT DEFAULT '1 item',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.pantry_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_lists ENABLE ROW LEVEL SECURITY;

-- Create policies for pantry_items
CREATE POLICY "Allow all" ON public.pantry_items
  FOR ALL USING (true) WITH CHECK (true);

-- Create policies for recipes
CREATE POLICY "Allow all" ON public.recipes
  FOR ALL USING (true) WITH CHECK (true);

-- Create policies for meal_plans
CREATE POLICY "Allow all" ON public.meal_plans
  FOR ALL USING (true) WITH CHECK (true);

-- Create policies for shopping_lists
CREATE POLICY "Allow all" ON public.shopping_lists
  FOR ALL USING (true) WITH CHECK (true);

-- Create policies for shopping_list
CREATE POLICY "Allow all" ON public.shopping_list
  FOR ALL USING (true) WITH CHECK (true);

-- Create indexes
CREATE INDEX idx_pantry_items_category ON public.pantry_items(category);
CREATE INDEX idx_pantry_items_name ON public.pantry_items(name);
CREATE INDEX idx_recipes_user_id ON public.recipes(user_id);
CREATE INDEX idx_meal_plans_week_start ON public.meal_plans(week_start);
CREATE INDEX idx_shopping_list_category ON public.shopping_list(category);
CREATE INDEX idx_shopping_list_created ON public.shopping_list(created_at);

-- Confirm tables created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
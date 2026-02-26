export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      pantry_items: {
        Row: {
          id: string;
          user_id: string | null;
          name: string;
          category: string;
          quantity: number;
          unit: string;
          expires_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          name: string;
          category: string;
          quantity?: number;
          unit?: string;
          expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          name?: string;
          category?: string;
          quantity?: number;
          unit?: string;
          expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      recipes: {
        Row: {
          id: string;
          user_id: string | null;
          spoonacular_id: number | null;
          title: string;
          image: string | null;
          ingredients: Json;
          instructions: Json | null;
          nutrition: Json | null;
          prep_time: number | null;
          cook_time: number | null;
          servings: number;
          source: string;
          is_favorite: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          spoonacular_id?: number | null;
          title: string;
          image?: string | null;
          ingredients: Json;
          instructions?: Json | null;
          nutrition?: Json | null;
          prep_time?: number | null;
          cook_time?: number | null;
          servings?: number;
          source?: string;
          is_favorite?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          spoonacular_id?: number | null;
          title?: string;
          image?: string | null;
          ingredients?: Json;
          instructions?: Json | null;
          nutrition?: Json | null;
          prep_time?: number | null;
          cook_time?: number | null;
          servings?: number;
          source?: string;
          is_favorite?: boolean;
          created_at?: string;
        };
      };
      meal_plans: {
        Row: {
          id: string;
          user_id: string;
          week_start: string;
          meals: Json;
          nutrition_totals: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          week_start: string;
          meals: Json;
          nutrition_totals?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          week_start?: string;
          meals?: Json;
          nutrition_totals?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      shopping_lists: {
        Row: {
          id: string;
          user_id: string;
          meal_plan_id: string;
          items: Json;
          is_complete: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          meal_plan_id: string;
          items: Json;
          is_complete?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          meal_plan_id?: string;
          items?: Json;
          is_complete?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

const pantryItems = [
  // Fresh Produce
  { name: 'Tomatoes', category: 'produce', quantity: 4, unit: 'item' },
  { name: 'Potatoes', category: 'produce', quantity: 2, unit: 'large' },
  { name: 'Carrot', category: 'produce', quantity: 1, unit: 'item' },
  { name: 'Cucumbers', category: 'produce', quantity: 2, unit: 'item' },
  { name: 'Apples', category: 'produce', quantity: 4, unit: 'item' },
  { name: 'Strawberries', category: 'produce', quantity: 1, unit: 'container' },
  { name: 'Oranges', category: 'produce', quantity: 2, unit: 'item' },
  { name: 'Blood oranges', category: 'produce', quantity: 2, unit: 'item' },
  { name: 'Sweet potatoes', category: 'produce', quantity: 4, unit: 'item' },
  { name: 'Green onions', category: 'produce', quantity: 6, unit: 'item' },
  { name: 'Basil', category: 'produce', quantity: 1, unit: 'bunch' },
  { name: 'Lettuce', category: 'produce', quantity: 1, unit: 'head' },
  { name: 'Yellow onions', category: 'produce', quantity: 2, unit: 'item' },
  { name: 'Garlic', category: 'produce', quantity: 1, unit: 'head' },
  { name: 'Ginger', category: 'produce', quantity: 1, unit: 'piece' },
  { name: 'Lemon', category: 'produce', quantity: 1, unit: 'item' },
  
  // Proteins
  { name: 'Chicken breasts', category: 'protein', quantity: 2, unit: 'lb' },
  { name: 'Eggs', category: 'protein', quantity: 12, unit: 'item' },
  
  // Starches
  { name: 'Rice', category: 'pantry', quantity: 2, unit: 'lb' },
  { name: 'Noodles', category: 'pantry', quantity: 1, unit: 'lb' },
  
  // Oils & Fats
  { name: 'Olive oil', category: 'oils', quantity: 1, unit: 'bottle' },
  { name: 'Avocado oil', category: 'oils', quantity: 1, unit: 'bottle' },
  { name: 'Sesame oil', category: 'oils', quantity: 1, unit: 'bottle' },
  { name: 'Butter', category: 'dairy', quantity: 1, unit: 'lb' },
  
  // Vinegars
  { name: 'White vinegar', category: 'pantry', quantity: 1, unit: 'bottle' },
  { name: 'Apple cider vinegar', category: 'pantry', quantity: 1, unit: 'bottle' },
  { name: 'White wine vinegar', category: 'pantry', quantity: 1, unit: 'bottle' },
  { name: 'Balsamic vinegar', category: 'pantry', quantity: 1, unit: 'bottle' },
  { name: 'Red wine vinegar', category: 'pantry', quantity: 1, unit: 'bottle' },
  { name: 'Balsamic glaze', category: 'pantry', quantity: 1, unit: 'bottle' },
  
  // Sauces & Condiments
  { name: 'Soy sauce', category: 'pantry', quantity: 1, unit: 'bottle' },
  { name: 'Tomato paste', category: 'pantry', quantity: 1, unit: 'can' },
  { name: 'Worcestershire sauce', category: 'pantry', quantity: 1, unit: 'bottle' },
  { name: 'Relish', category: 'pantry', quantity: 1, unit: 'jar' },
  { name: 'Sweet Thai chili sauce', category: 'pantry', quantity: 1, unit: 'bottle' },
  { name: 'Miso', category: 'pantry', quantity: 1, unit: 'container' },
  { name: 'Oyster sauce', category: 'pantry', quantity: 1, unit: 'bottle' },
  { name: 'Mirin', category: 'pantry', quantity: 1, unit: 'bottle' },
  { name: 'Mayo', category: 'pantry', quantity: 1, unit: 'jar' },
  { name: 'Hoisin', category: 'pantry', quantity: 1, unit: 'bottle' },
  { name: 'Ketchup', category: 'pantry', quantity: 1, unit: 'bottle' },
  { name: 'Chili oil', category: 'pantry', quantity: 1, unit: 'bottle' },
  { name: 'Sriracha', category: 'pantry', quantity: 1, unit: 'bottle' },
  { name: 'Hot sauce', category: 'pantry', quantity: 1, unit: 'bottle' },
  { name: 'Yellow mustard', category: 'pantry', quantity: 1, unit: 'bottle' },
  
  // Canned Goods
  { name: 'Chicken broth', category: 'pantry', quantity: 2, unit: 'carton' },
  { name: 'Beef broth', category: 'pantry', quantity: 1, unit: 'carton' },
  { name: 'Chickpeas', category: 'pantry', quantity: 1, unit: 'can' },
  { name: 'Black beans', category: 'pantry', quantity: 1, unit: 'can' },
  { name: 'Lima beans', category: 'pantry', quantity: 1, unit: 'can' },
  { name: 'Corn', category: 'pantry', quantity: 1, unit: 'can' },
  
  // Dairy
  { name: 'Milk', category: 'dairy', quantity: 1, unit: 'gallon' },
  { name: 'Heavy cream', category: 'dairy', quantity: 1, unit: 'pint' },
  { name: 'Greek yogurt', category: 'dairy', quantity: 1, unit: 'container' },
  { name: 'Parmesan cheese', category: 'dairy', quantity: 1, unit: 'block' },
  { name: 'Provolone cheese', category: 'dairy', quantity: 1, unit: 'block' },
  { name: 'Mozzarella cheese', category: 'dairy', quantity: 1, unit: 'block' },
  { name: 'Cheddar cheese', category: 'dairy', quantity: 1, unit: 'block' },
  
  // Baking & Pantry
  { name: 'Flour', category: 'pantry', quantity: 2, unit: 'lb' },
  { name: 'Breadcrumbs', category: 'pantry', quantity: 1, unit: 'container' },
  { name: 'Panko', category: 'pantry', quantity: 1, unit: 'container' },
  { name: 'Honey', category: 'pantry', quantity: 1, unit: 'bottle' },
  { name: 'Sugar', category: 'pantry', quantity: 1, unit: 'lb' },
  { name: 'Salt', category: 'pantry', quantity: 1, unit: 'container' },
  { name: 'Pepper', category: 'pantry', quantity: 1, unit: 'container' },
  
  // Fresh Herbs
  { name: 'Parsley', category: 'produce', quantity: 1, unit: 'bunch' },
  
  // Spices
  { name: 'Cumin', category: 'spices', quantity: 1, unit: 'container' },
  { name: 'Paprika', category: 'spices', quantity: 1, unit: 'container' },
  { name: 'Chili powder', category: 'spices', quantity: 1, unit: 'container' },
  { name: 'Turmeric', category: 'spices', quantity: 1, unit: 'container' },
];

async function populatePantry() {
  console.log(`Adding ${pantryItems.length} items to your pantry...`);
  
  const { data, error } = await supabase
    .from('pantry_items')
    .insert(pantryItems);
  
  if (error) {
    console.error('Error adding items:', error);
    process.exit(1);
  }
  
  console.log('✅ Successfully added all pantry items!');
  console.log('You can now view them in the app at http://localhost:3000/pantry');
}

populatePantry();
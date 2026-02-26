// Auto-categorization logic for food items
export type IngredientCategory = 
  | 'produce' 
  | 'protein' 
  | 'dairy' 
  | 'pantry' 
  | 'spices' 
  | 'oils' 
  | 'frozen' 
  | 'beverages' 
  | 'other';

// Keyword mappings for auto-categorization
const categoryKeywords: Record<IngredientCategory, string[]> = {
  produce: [
    // Vegetables
    'asparagus', 'avocado', 'beet', 'broccoli', 'cabbage', 'carrot', 'cauliflower', 
    'celery', 'corn', 'cucumber', 'eggplant', 'garlic', 'ginger', 'kale', 'leek', 
    'lettuce', 'mushroom', 'onion', 'pepper', 'potato', 'pumpkin', 'radish', 'spinach', 
    'squash', 'tomato', 'zucchini', 'bean sprout', 'bok choy', 'brussels sprout',
    // Fruits
    'apple', 'apricot', 'banana', 'berry', 'blackberry', 'blueberry', 'cherry', 
    'coconut', 'cranberry', 'date', 'fig', 'grape', 'grapefruit', 'kiwi', 'lemon', 
    'lime', 'mango', 'melon', 'nectarine', 'orange', 'papaya', 'peach', 'pear', 
    'pineapple', 'plum', 'pomegranate', 'raspberry', 'strawberry', 'tangerine', 'watermelon',
    // Herbs
    'basil', 'cilantro', 'dill', 'mint', 'oregano', 'parsley', 'rosemary', 'sage', 
    'tarragon', 'thyme', 'chive', 'scallion', 'green onion', 'shallot'
  ],
  protein: [
    // Meats
    'beef', 'chicken', 'pork', 'lamb', 'turkey', 'duck', 'venison', 'bacon', 'ham', 
    'sausage', 'steak', 'ground beef', 'meatball', 'rib', 'tenderloin', 'brisket',
    // Seafood
    'fish', 'salmon', 'tuna', 'cod', 'halibut', 'tilapia', 'trout', 'catfish', 
    'shrimp', 'prawn', 'crab', 'lobster', 'scallop', 'clam', 'mussel', 'oyster', 
    'squid', 'octopus', 'calamari',
    // Plant proteins
    'tofu', 'tempeh', 'seitan', 'edamame',
    // Eggs
    'egg'
  ],
  dairy: [
    'milk', 'cream', 'butter', 'cheese', 'cheddar', 'mozzarella', 'parmesan', 'feta', 
    'brie', 'gouda', 'swiss', 'provolone', 'ricotta', 'cream cheese', 'sour cream', 
    'yogurt', 'yoghurt', 'greek yogurt', 'kefir', 'whipped cream', 'half and half', 
    'buttermilk', 'custard', 'ice cream'
  ],
  pantry: [
    // Grains
    'rice', 'pasta', 'noodle', 'spaghetti', 'penne', 'fusilli', 'macaroni', 'couscous', 
    'quinoa', 'oats', 'oatmeal', 'cereal', 'bread', 'flour', 'cornmeal', 'polenta',
    // Canned/Jarred
    'bean', 'black bean', 'kidney bean', 'pinto bean', 'chickpea', 'garbanzo', 'lentil', 
    'tomato sauce', 'tomato paste', 'salsa', 'soup', 'broth', 'stock', 'tuna can',
    // Baking
    'sugar', 'brown sugar', 'powdered sugar', 'baking powder', 'baking soda', 'yeast', 
    'cocoa', 'chocolate', 'vanilla', 'honey', 'syrup', 'maple syrup', 'molasses',
    // Sauces/Condiments
    'ketchup', 'mustard', 'mayonnaise', 'mayo', 'soy sauce', 'hot sauce', 'sriracha', 
    'vinegar', 'olive oil', 'vegetable oil', 'sesame oil', 'peanut butter', 'jam', 
    'jelly', 'nutella'
  ],
  spices: [
    'salt', 'pepper', 'cumin', 'coriander', 'turmeric', 'paprika', 'cayenne', 'chili powder', 
    'red pepper', 'black pepper', 'garlic powder', 'onion powder', 'cinnamon', 'nutmeg', 
    'clove', 'allspice', 'cardamom', 'cumin', 'curry', 'garam masala', 'five spice', 
    'oregano', 'basil', 'thyme', 'rosemary', 'bay leaf', 'saffron', 'vanilla extract'
  ],
  oils: [
    'oil', 'olive oil', 'vegetable oil', 'canola oil', 'sunflower oil', 'coconut oil', 
    'sesame oil', 'peanut oil', 'grapeseed oil', 'avocado oil', 'cooking spray'
  ],
  frozen: [
    'frozen', 'ice', 'pizza', 'frozen dinner', 'frozen meal', 'fries', 'french fries', 
    'hash brown', 'waffle', 'popsicle', 'ice cream', 'sorbet', 'gelato', 'frozen vegetable',
    'frozen fruit', 'frozen berry', 'frozen pea', 'frozen corn', 'frozen spinach'
  ],
  beverages: [
    'water', 'soda', 'juice', 'coffee', 'tea', 'milk', 'wine', 'beer', 'liquor', 
    'vodka', 'rum', 'whiskey', 'bourbon', 'gin', 'champagne', 'sparkling water', 
    'energy drink', 'sports drink', 'kombucha', 'smoothie'
  ],
  other: []
};

/**
 * Auto-categorize an ingredient based on its name
 */
export function autoCategorize(name: string): IngredientCategory {
  const lowerName = name.toLowerCase();
  
  // Check each category for matching keywords
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    for (const keyword of keywords) {
      // Check if the name contains the keyword as a whole word or partial match
      if (lowerName.includes(keyword.toLowerCase())) {
        return category as IngredientCategory;
      }
    }
  }
  
  // Default to 'other' if no match found
  return 'other';
}

/**
 * Get all available categories
 */
export function getCategories(): IngredientCategory[] {
  return ['produce', 'protein', 'dairy', 'pantry', 'spices', 'oils', 'frozen', 'beverages', 'other'];
}

/**
 * Format category name for display
 */
export function formatCategory(category: IngredientCategory): string {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

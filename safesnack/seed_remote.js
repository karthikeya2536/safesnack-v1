const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

function uuidv4() {
  return crypto.randomUUID();
}

const supabaseUrl = 'https://qshhmpvfqfoygqodrsnq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzaGhtcHZmcWZveWdxb2Ryc25xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjI5Mjc5MSwiZXhwIjoyMDk3ODY4NzkxfQ.kJHlgCez_VKUo2zit7r4de0Oech0nKEXqobUQLakTx4';
const sb = createClient(supabaseUrl, supabaseKey);

const rawData = {
  "BREADS AND BAKERY": [
    { name: "CHOCO WALNUT BROWNIE", weight: "50 g", price: 150 },
    { name: "Nutella Hazelnut Brownie", weight: "50 g", price: 150 },
    { name: "Quinoa and jaggery cake tub", weight: "50 g", price: 250 }
  ],
  "COOKIES": [
    { name: "Multimillet Cookies", weight: "80 g", price: 80 }
  ],
  "DARK CHOCOLATES": [
    { name: "Amul SUGAR FREE 55% Dark chocolate", weight: "150 g", price: 180, brand: "Amul" },
    { name: "ANUTTAMA Dark chocolate 55%", weight: "50 g", price: 235, brand: "ANUTTAMA" },
    { name: "ANUTTAMA Dark chocolate 70%Dark,30% Dates", weight: "50 g", price: 215, brand: "ANUTTAMA" },
    { name: "Lindt Excellence 99% Dark Cocoa", weight: "100 g", price: 550, brand: "Lindt" }
  ],
  "HEALTHY CHIPS": [
    { name: "Makhana Chips(cheese and herbs)", weight: "40 g", price: 95 },
    { name: "Zesty Masala Mix Veggie Chips", weight: "70 g", price: 65 },
    { name: "BEETROOT CHIPS", weight: "100 g", price: 130 },
    { name: "Broccoli chips", weight: "100 g", price: 160 },
    { name: "Healthify Mung Dal Chips (100g)", weight: "100 g", price: 150, brand: "Healthify" },
    { name: "Healthify Soya Chips (100g)", weight: "100 g", price: 150, brand: "Healthify" },
    { name: "INDIAN MASALA", weight: "100 g", price: 40 },
    { name: "Masala Punch Ragi Chips", weight: "70 g", price: 65 },
    { name: "Moong Dal Chips (Tangy Tomato)", weight: "60 g", price: 65 },
    { name: "Palak Butter Murukku", weight: "100 g", price: 130 },
    { name: "SOYA CHIPS", weight: "100 g", price: 130 },
    { name: "SuperYou Multigrain Chips - Cheese & Tomato", weight: "40 g", price: 40, brand: "SuperYou" },
    { name: "SuperYou Multigrain Chips - Pudina Punch", weight: "40 g", price: 40, brand: "SuperYou" },
    { name: "TANGY TOMATO", weight: "100 g", price: 40 },
    { name: "Traditional Ragi Chips", weight: "100 g", price: 130 }
  ],
  "HEALTHY SNACKS": [
    { name: "Cheese & Herbs Protein Puffs", weight: "40 g", price: 38 },
    { name: "Tangy Tomato Protein Puffs", weight: "40 g", price: 38 }
  ],
  "ICE CREAM": [
    { name: "Minus Thirty Espresso Mini Stick", weight: "237 ml", price: 120, brand: "Minus Thirty" },
    { name: "MINUS THIRTY Coconut Ice Cream Cup", weight: "115 ml", price: 280, brand: "Minus Thirty" },
    { name: "MINUS THIRTY Coconut Ice Cream Mini Sticks", weight: "40 g", price: 120, brand: "Minus Thirty" },
    { name: "MINUS THIRTY Coconut Ice Cream Tub", weight: "500 ml", price: 925, brand: "Minus Thirty" },
    { name: "MINUS THIRTY Double Chocolate Ice Cream Sticks", weight: "40 g", price: 120, brand: "Minus Thirty" },
    { name: "MINUS THIRTY Espresso Ice Cream Stick", weight: "40 ml", price: 120, brand: "Minus Thirty" },
    { name: "MINUS THIRTY Hazelnut Ice Cream Mini Sticks", weight: "40 g", price: 120, brand: "Minus Thirty" },
    { name: "MINUS THIRTY Mint Choco Chip Ice Cream Mini Stick", weight: "40 g", price: 120, brand: "Minus Thirty" },
    { name: "Minus Thirty Pistachio Mini Stick", weight: "40 g", price: 120, brand: "Minus Thirty" },
    { name: "MINUS THIRTY Strawberry Ice Cream Sticks", weight: "40 g", price: 120, brand: "Minus Thirty" },
    { name: "MINUS THIRTY Vanilla Ice Cream Sticks", weight: "40 ml", price: 120, brand: "Minus Thirty" }
  ],
  "KETCHUP": [
    { name: "Tomato Ketchup", weight: "340 g", price: 165 }
  ],
  "MILK CHOCOLATES": [
    { name: "A2 milk 48% ( Milk Chocolate)", weight: "100 g", price: 215 }
  ],
  "NATURAL CHEWING GUMS": [
    { name: "Charcoal+spearmint Natural Chewing Gums", weight: "10 g", price: 90 },
    { name: "Mellow Mint Dental Chewing Gums", weight: "22 g", price: 200 },
    { name: "Mint Caffeinated Chewing Gums", weight: "21 g", price: 150 },
    { name: "Raspberry Caffeinated Chewing Gum", weight: "20 g", price: 150 },
    { name: "Raspberry Natural Chewing Gums", weight: "21 g", price: 99 },
    { name: "Sicilian Lemon Chewing Gums", weight: "21 g", price: 90 },
    { name: "Strawberry Natural Chewing Gums", weight: "4.71 g", price: 99 }
  ],
  "NOODLES": [
    { name: "Multi millet noodles", weight: "180 g", price: 149 },
    { name: "Yu Veg Hakka Noodles -Small Pack", weight: "150 g", price: 45, brand: "Yu" },
    { name: "YU Veg Hakka Noodles-FamilyPack", weight: "600 g", price: 150, brand: "Yu" },
    { name: "YU Whole Wheat Noodles - Family Pack", weight: "600 g", price: 199, brand: "Yu" },
    { name: "Yu Whole Wheat Noodles - Jalapeno Cheese", weight: "70 g", price: 45, brand: "Yu" },
    { name: "YU Whole Wheat Noodles - Small Pack", weight: "150 g", price: 55, brand: "Yu" }
  ],
  "PASTAS": [
    { name: "YU ITALIAN CHEESE SAUCE PASTA", weight: "65 g", price: 55, brand: "Yu" },
    { name: "YU Italian Pink Sauce Pasta", weight: "65 g", price: 55, brand: "Yu" },
    { name: "Yu Three Cheese Instant Cup Pasta", weight: "65 g", price: 59, compare: 95, brand: "Yu" }
  ],
  "PROTEIN MILKSHAKES": [
    { name: "Epigamia chocolate Turbo protein milkshake", weight: "250 ml", price: 141, brand: "Epigamia" },
    { name: "Epigamia Coffee Turbo Protein Milkshake", weight: "250 ml", price: 141, brand: "Epigamia" }
  ],
  "PROTEIN OATS": [
    { name: "Chocolate Super Oats high protein", weight: "1 kg", price: 519 }
  ],
  "SUGAR FREE POPS": [
    { name: "V-SUGARFREE POPS", weight: "10 g", price: 39 }
  ]
};

const stockImages = {
  "BREADS AND BAKERY": [
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=1000&auto=format&fit=crop"
  ],
  "COOKIES": [
    "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?q=80&w=1000&auto=format&fit=crop"
  ],
  "DARK CHOCOLATES": [
    "https://images.unsplash.com/photo-1511381939415-e44015466834?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?q=80&w=1000&auto=format&fit=crop"
  ],
  "HEALTHY CHIPS": [
    "https://images.unsplash.com/photo-1560008511-11c63416e52d?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1484723091739-30a097e8f929?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop"
  ],
  "HEALTHY SNACKS": [
    "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=1000&auto=format&fit=crop"
  ],
  "ICE CREAM": [
    "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1534080564583-6be75777b70a?q=80&w=1000&auto=format&fit=crop"
  ],
  "KETCHUP": [
    "https://images.unsplash.com/photo-1585238342024-78d387f4a707?q=80&w=1000&auto=format&fit=crop"
  ],
  "MILK CHOCOLATES": [
    "https://images.unsplash.com/photo-1511381939415-e44015466834?q=80&w=1000&auto=format&fit=crop"
  ],
  "NATURAL CHEWING GUMS": [
    "https://images.unsplash.com/photo-1559181567-c3190ca9959b?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?q=80&w=1000&auto=format&fit=crop"
  ],
  "NOODLES": [
    "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=1000&auto=format&fit=crop"
  ],
  "PASTAS": [
    "https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=1000&auto=format&fit=crop"
  ],
  "PROTEIN MILKSHAKES": [
    "https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=1000&auto=format&fit=crop"
  ],
  "PROTEIN OATS": [
    "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?q=80&w=1000&auto=format&fit=crop"
  ],
  "SUGAR FREE POPS": [
    "https://images.unsplash.com/photo-1534080564583-6be75777b70a?q=80&w=1000&auto=format&fit=crop"
  ],
  "DEFAULT": [
    "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?q=80&w=1000&auto=format&fit=crop"
  ]
};

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

function getDietaryTags(catName) {
  switch (catName) {
    case "DARK CHOCOLATES":
    case "MILK CHOCOLATES":
      return ["sugar-free", "diabetic", "keto"];
    case "BREADS AND BAKERY":
      return ["sugar-free", "keto"];
    case "COOKIES":
      return ["sugar-free", "diabetic", "keto"];
    case "HEALTHY CHIPS":
    case "HEALTHY SNACKS":
      return ["vegan", "sugar-free"];
    case "ICE CREAM":
      return ["sugar-free", "keto", "diabetic"];
    case "NATURAL CHEWING GUMS":
      return ["vegan", "sugar-free"];
    case "NOODLES":
    case "PASTAS":
      return ["vegan"];
    default:
      return ["sugar-free"];
  }
}

async function run() {
  console.log("Starting seed on remote database...");

  // clear existing data
  await sb.from('bundle_item').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await sb.from('bundle').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await sb.from('product_image').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await sb.from('variant').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await sb.from('product').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await sb.from('category').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await sb.from('brand').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  const categories = {};
  const brands = {};
  
  console.log("Seeding categories...");
  for (const catName of Object.keys(rawData)) {
    const id = uuidv4();
    categories[catName] = id;
    await sb.from('category').insert({ id, name: catName, slug: slugify(catName) });
  }

  console.log("Seeding brands...");
  const brandNames = new Set(["SafeSnack Originals"]);
  for (const cat of Object.values(rawData)) {
    for (const item of cat) {
      if (item.brand) brandNames.add(item.brand);
    }
  }
  for (const brandName of brandNames) {
    const id = uuidv4();
    brands[brandName] = id;
    await sb.from('brand').insert({ id, name: brandName, slug: slugify(brandName), is_house_brand: brandName === 'SafeSnack Originals' });
  }

  let skuCounter = 1000;
  console.log("Seeding products...");
  
  const variantMap = {};

  for (const [catName, items] of Object.entries(rawData)) {
    const catId = categories[catName];
    const imgUrls = stockImages[catName] || stockImages["DEFAULT"];
    let imgIdx = 0;
    
    for (const item of items) {
      const productId = uuidv4();
      const variantId = uuidv4();
      const brandId = brands[item.brand || "SafeSnack Originals"];
      const slug = slugify(item.name) + '-' + Math.floor(Math.random() * 10000);
      const imgUrl = imgUrls[imgIdx % imgUrls.length];
      imgIdx++;
      
      variantMap[item.name] = variantId;

      await sb.from('product').insert({
        id: productId, name: item.name, slug, description: 'Delicious ' + item.name,
        brand_id: brandId, category_id: catId, dietary_tags: getDietaryTags(catName),
        ingredients: 'Real ingredients', benefits: 'Healthy and tasty',
        story: 'A staple for any diet', featured_ingredients: 'Best ingredients',
        serving_suggestions: 'Enjoy anytime'
      });
      
      await sb.from('variant').insert({
        id: variantId, product_id: productId, label: item.weight,
        price: item.price, compare_at_price: item.compare || null, sku: 'SKU-' + (skuCounter++)
      });
      
      await sb.from('product_image').insert({
        id: uuidv4(), product_id: productId, url: imgUrl, type: 'PRIMARY', sort_order: 0
      });
    }
  }

  console.log("Seeding bundles...");
  const bundleData = [
    {
      name: "Choco Lovers Delight",
      description: "A curated bundle of our best sugar-free and diabetic-friendly chocolates and brownies.",
      price: 250,
      items: [
        { label: "CHOCO WALNUT BROWNIE", qty: 1 },
        { label: "Amul SUGAR FREE 55% Dark chocolate", qty: 1 }
      ]
    },
    {
      name: "Keto Snack Starter Pack",
      description: "Kickstart your keto journey with delicious low-carb cookies and chips.",
      price: 150,
      items: [
        { label: "Multimillet Cookies", qty: 1 },
        { label: "Makhana Chips(cheese and herbs)", qty: 1 }
      ]
    },
    {
      name: "Italian Pasta & Ketchup Kit",
      description: "Quick and healthy wheat pasta and ketchup kit for family dinner.",
      price: 220,
      items: [
        { label: "Yu Three Cheese Instant Cup Pasta", qty: 2 },
        { label: "Tomato Ketchup", qty: 1 }
      ]
    }
  ];

  for (const b of bundleData) {
    const bundleId = uuidv4();
    await sb.from('bundle').insert({
      id: bundleId,
      name: b.name,
      slug: slugify(b.name),
      description: b.description,
      price: b.price,
      is_active: true
    });
    
    for (const bItem of b.items) {
      const variantId = variantMap[bItem.label];
      if (variantId) {
        await sb.from('bundle_item').insert({
          id: uuidv4(),
          bundle_id: bundleId,
          variant_id: variantId,
          qty: bItem.qty
        });
      }
    }
  }

  console.log("Done seeding!");
}

run().catch(console.error);

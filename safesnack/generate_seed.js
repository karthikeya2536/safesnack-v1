const fs = require('fs');
const crypto = require('crypto');

function uuidv4() {
  return crypto.randomUUID();
}

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
  "BREADS AND BAKERY": "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000&auto=format&fit=crop",
  "COOKIES": "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=1000&auto=format&fit=crop",
  "DARK CHOCOLATES": "https://images.unsplash.com/photo-1548883354-94cb862d64a2?q=80&w=1000&auto=format&fit=crop",
  "HEALTHY CHIPS": "https://images.unsplash.com/photo-1566478989037-e924e525bb13?q=80&w=1000&auto=format&fit=crop",
  "HEALTHY SNACKS": "https://images.unsplash.com/photo-1600180766465-4f40f04c622a?q=80&w=1000&auto=format&fit=crop",
  "ICE CREAM": "https://images.unsplash.com/photo-1570197781417-0a5237505ed6?q=80&w=1000&auto=format&fit=crop",
  "KETCHUP": "https://images.unsplash.com/photo-1528751505234-45330e2ea854?q=80&w=1000&auto=format&fit=crop",
  "MILK CHOCOLATES": "https://images.unsplash.com/photo-1614088656111-e40636d10c26?q=80&w=1000&auto=format&fit=crop",
  "NATURAL CHEWING GUMS": "https://images.unsplash.com/photo-1582260384405-b0b92d6e355c?q=80&w=1000&auto=format&fit=crop",
  "NOODLES": "https://images.unsplash.com/photo-1612929633738-8fe01f7467c1?q=80&w=1000&auto=format&fit=crop",
  "PASTAS": "https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=1000&auto=format&fit=crop",
  "PROTEIN MILKSHAKES": "https://images.unsplash.com/photo-1577805947697-89e18249d767?q=80&w=1000&auto=format&fit=crop",
  "PROTEIN OATS": "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?q=80&w=1000&auto=format&fit=crop",
  "SUGAR FREE POPS": "https://images.unsplash.com/photo-1518114093931-e175d713c774?q=80&w=1000&auto=format&fit=crop",
  "DEFAULT": "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?q=80&w=1000&auto=format&fit=crop"
};

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

const categories = {};
const brands = {};
let output = '';

// Generate categories
output += '-- CATEGORIES\n';
output += 'insert into category(id, name, slug) values\n';
const catInserts = [];
for (const catName of Object.keys(rawData)) {
  const id = uuidv4();
  categories[catName] = id;
  catInserts.push(` ('${id}', '${catName.replace(/'/g, "''")}', '${slugify(catName)}')`);
}
output += catInserts.join(',\n') + ';\n\n';

// Extract and generate brands
const brandNames = new Set(["SafeSnack Originals"]);
for (const cat of Object.values(rawData)) {
  for (const item of cat) {
    if (item.brand) brandNames.add(item.brand);
  }
}

output += '-- BRANDS\n';
output += 'insert into brand(id, name, slug, is_house_brand) values\n';
const brandInserts = [];
for (const brandName of brandNames) {
  const id = uuidv4();
  brands[brandName] = id;
  brandInserts.push(` ('${id}', '${brandName.replace(/'/g, "''")}', '${slugify(brandName)}', ${brandName === 'SafeSnack Originals'})`);
}
output += brandInserts.join(',\n') + ';\n\n';

// Generate products, variants, images, batches
let productInserts = [];
let variantInserts = [];
let batchInserts = [];
let imageInserts = [];

let skuCounter = 1000;

for (const [catName, items] of Object.entries(rawData)) {
  const catId = categories[catName];
  const imgUrl = stockImages[catName] || stockImages["DEFAULT"];
  
  for (const item of items) {
    const productId = uuidv4();
    const variantId = uuidv4();
    const brandId = brands[item.brand || "SafeSnack Originals"];
    const slug = slugify(item.name) + '-' + Math.floor(Math.random() * 10000); // ensure unique
    
    productInserts.push(` ('${productId}', '${item.name.replace(/'/g, "''")}', '${slug}', 'Delicious ${item.name.replace(/'/g, "''")}', '${brandId}', '${catId}', '{sugar-free}', 'Real ingredients', 'Healthy and tasty', 'A staple for any diet', 'Best ingredients', 'Enjoy anytime')`);
    
    const comparePrice = item.compare ? item.compare : 'null';
    variantInserts.push(` ('${variantId}', '${productId}', '${item.weight}', ${item.price}, ${comparePrice}, 'SKU-${skuCounter++}')`);
    
    imageInserts.push(` ('${uuidv4()}', '${productId}', '${imgUrl}', 'PRIMARY', 0)`);
    
    batchInserts.push(` ('${uuidv4()}', '${variantId}', 'B-SKU-${skuCounter-1}', date '2026-05-01', date '2026-12-01', 100)`);
  }
}

output += '-- PRODUCTS\n';
output += 'insert into product(id, name, slug, description, brand_id, category_id, dietary_tags, ingredients, benefits, story, featured_ingredients, serving_suggestions) values\n';
output += productInserts.join(',\n') + ';\n\n';

output += '-- VARIANTS\n';
output += 'insert into variant(id, product_id, label, price, compare_at_price, sku) values\n';
output += variantInserts.join(',\n') + ';\n\n';

output += '-- PRODUCT IMAGES\n';
output += 'insert into product_image(id, product_id, url, type, sort_order) values\n';
output += imageInserts.join(',\n') + ';\n\n';

output += '-- BATCHES\n';
output += 'insert into batch(id, variant_id, batch_number, mfg_date, expiry_date, quantity) values\n';
output += batchInserts.join(',\n') + ';\n\n';

// Static homepage content & bundles & delivery zones
output += `-- MISCELLANEOUS
insert into bundle(name,slug,description,price) values
 ('Diabetic Starter Pack','diabetic-starter-pack','Curated sugar-free essentials for blood-sugar control.',699),
 ('Weight Management Pack','weight-management-pack','High-fiber, high-protein snacks to stay full.',749),
 ('Kids Healthy Snack Pack','kids-healthy-snack-pack','Tasty snacks parents can trust.',599),
 ('Office Snack Box','office-snack-box','Desk-friendly variety for the work week.',899),
 ('High Protein Pack','high-protein-pack','Protein-forward picks for active days.',799);

insert into delivery_zone(area,pincode,delivery_fee,min_order,eta_minutes) values
 ('Gachibowli','500032',29,199,40),
 ('Madhapur','500081',29,199,35),
 ('Banjara Hills','500034',39,249,45);

insert into coupon(code,type,value,min_order,active) values
 ('WELCOME10','PERCENT',10,199,true),
 ('FLAT50','FLAT',50,499,true);

insert into homepage_content(id,hero_title,hero_subtitle,hero_cta) values
 (1,'Guilt-Free Snacks, Delivered Fast','Sugar-free treats your body will thank you for.','Shop Originals');
`;

fs.writeFileSync('d:/safe snack/safesnack/supabase/seed.sql', output);
console.log('Successfully generated seed.sql with demo products!');

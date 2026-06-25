const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://qshhmpvfqfoygqodrsnq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzaGhtcHZmcWZveWdxb2Ryc25xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjI5Mjc5MSwiZXhwIjoyMDk3ODY4NzkxfQ.kJHlgCez_VKUo2zit7r4de0Oech0nKEXqobUQLakTx4';
const sb = createClient(supabaseUrl, supabaseKey);

async function run() {
  const PRODUCT_SELECT =
    "id,name,slug,brand:brand_id(name,slug,is_house_brand)";

  const { data, error } = await sb.from('product').select(PRODUCT_SELECT).eq('is_active', true).limit(2);
  console.log(JSON.stringify(data, null, 2));
}
run();

const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://qshhmpvfqfoygqodrsnq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzaGhtcHZmcWZveWdxb2Ryc25xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjI5Mjc5MSwiZXhwIjoyMDk3ODY4NzkxfQ.kJHlgCez_VKUo2zit7r4de0Oech0nKEXqobUQLakTx4';
const sb = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await sb.from('product').select('id, name, is_active').limit(5);
  console.log("Products:", data, error);
}
run();

const { createClient } = require('@supabase/supabase-js');
const sb = createClient(
  'https://qshhmpvfqfoygqodrsnq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzaGhtcHZmcWZveWdxb2Ryc25xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyOTI3OTEsImV4cCI6MjA5Nzg2ODc5MX0.AI59Q-v9pgkso_sLXJgqjEX-daATUSb0VaUua_68ZzQ'
);

async function main() {
  const { data, error } = await sb.from('product').select('id, name').limit(5);
  console.log("Products:", data);
  if (error) console.error("Error:", error);
}
main();

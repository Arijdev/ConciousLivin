import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { config } from 'dotenv';
config({ path: path.resolve(__dirname, '../.env.local') });

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function verifySync() {
  const { data, error } = await supabase
    .from('health_resources')
    .select('id, title, category, pages, reading_time, subtitle, is_free, price, badge')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error:', error.message);
    return;
  }

  console.log(`Found ${data.length} resources in database:\n`);
  
  for (const resource of data) {
    console.log(`Title: ${resource.title}`);
    console.log(`  ID: ${resource.id}`);
    console.log(`  Category: ${resource.category}`);
    console.log(`  Pages: ${resource.pages}`);
    console.log(`  Reading Time: ${resource.reading_time}`);
    console.log(`  Subtitle: ${resource.subtitle}`);
    console.log(`  Free: ${resource.is_free}, Price: $${resource.price}`);
    console.log(`  Badge: ${resource.badge}`);
    console.log('');
  }
}

verifySync().catch(console.error);
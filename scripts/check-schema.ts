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

async function checkSchema() {
  // Try to insert with minimal fields to see what columns are required
  const { data, error } = await supabase
    .from('health_resources')
    .insert({ 
      title: 'Test',
      category: 'nutrition',
      is_free: false,
      price: 0,
      original_price: 0,
      pages: 0,
      reading_time: '0 hours',
      cover_image_url: '',
      pdf_url: '',
      badge: '',
      badge_color: '',
      description: '',
      highlights: [],
      table_of_contents: [],
      full_content: {},
      uploaded_by: null,
      is_active: true,
    })
    .select('*')
    .single();

  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log('Success! Columns in health_resources table:');
    console.log(Object.keys(data).join(', '));
    // Clean up
    await supabase.from('health_resources').delete().eq('id', data.id);
  }
}

checkSchema().catch(console.error);
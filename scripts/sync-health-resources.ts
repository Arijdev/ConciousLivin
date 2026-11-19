import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { config } from 'dotenv';
config({ path: path.resolve(__dirname, '../.env.local') });

import { createClient } from '@supabase/supabase-js';
import { HEALTH_RESOURCES } from '../src/data/healthData';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Map categories to database-allowed values
const categoryMap: Record<string, string> = {
  'biohacking': 'mental',
  'sleep': 'mental',
};

async function syncResources() {
  console.log(`Syncing ${HEALTH_RESOURCES.length} health resources to Supabase...`);

  // First, clear existing resources (they'll get new UUIDs)
  console.log('Clearing existing resources...');
  const { error: deleteError } = await supabase
    .from('health_resources')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

  if (deleteError) {
    console.error('Error clearing table:', deleteError.message);
  } else {
    console.log('Cleared existing resources.');
  }

  for (const resource of HEALTH_RESOURCES) {
    const dbResource = {
      title: resource.title,
      subtitle: resource.subtitle,
      category: categoryMap[resource.category] || resource.category,
      is_free: resource.isFree,
      price: resource.price,
      original_price: resource.originalPrice,
      rating: resource.rating,
      review_count: resource.reviewCount,
      pages: resource.pages,
      reading_time: resource.readingTime,
      cover_image_url: resource.coverImage,
      pdf_url: resource.pdfFileName,
      badge: resource.badge,
      badge_color: resource.badgeColor,
      description: resource.description,
      highlights: resource.highlights,
      table_of_contents: resource.tableOfContents,
      full_content: resource.fullContent,
      uploaded_by: null,
      is_active: true,
      published_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('health_resources')
      .insert(dbResource)
      .select('id')
      .single();

    if (error) {
      console.error(`Failed to sync ${resource.title}:`, error.message);
    } else {
      console.log(`✓ Synced: ${resource.title} (${resource.pages} pages, ${resource.readingTime}) [ID: ${data.id}]`);
    }
  }

  console.log('Sync complete!');
}

syncResources().catch(console.error);
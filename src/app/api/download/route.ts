import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import {
  boundedString,
  isRateLimited,
  isSafeMediaUrl,
  isSameOriginRequest,
  rateLimitResponse,
  readJsonObject,
} from '@/lib/api-security';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: NextRequest) {
  try {
    if (!isSameOriginRequest(request)) {
      return NextResponse.json({ error: 'Request origin is not allowed.' }, { status: 403 });
    }

    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (isRateLimited(`download:${user.id}`, 60)) {
      return rateLimitResponse();
    }

    const body = await readJsonObject(request, 4_096);
    if (!body) {
      return NextResponse.json(
        { error: 'Resource title and category are required' },
        { status: 400 }
      );
    }

    const resourceId = typeof body.resourceId === 'string' && UUID_PATTERN.test(body.resourceId)
      ? body.resourceId
      : null;
    let resourceTitle = boundedString(body.resourceTitle, 200);
    let resourceCategory = boundedString(body.resourceCategory, 64);
    let coverImageUrl = isSafeMediaUrl(body.coverImageUrl) ? body.coverImageUrl : null;
    let isFree = body.isFree === true;

    if (resourceId) {
      const { data: resource } = await supabase
        .from('health_resources')
        .select('title, category, cover_image_url, is_free')
        .eq('id', resourceId)
        .maybeSingle();

      // Prefer database metadata so history rows cannot be forged with
      // arbitrary titles, categories, or "free" flags from the browser.
      if (resource) {
        resourceTitle = resource.title;
        resourceCategory = resource.category;
        coverImageUrl = isSafeMediaUrl(resource.cover_image_url) ? resource.cover_image_url : null;
        isFree = resource.is_free === true;
      }
    }

    if (!resourceTitle || !resourceCategory) {
      return NextResponse.json(
        { error: 'Resource title and category are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('download_history')
      .insert({
        user_id: user.id,
        resource_id: resourceId,
        resource_title: resourceTitle,
        resource_category: resourceCategory,
        cover_image_url: coverImageUrl,
        is_free: isFree,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Increment download count on resource if it exists
    if (resourceId) {
      const { error: incrementError } = await supabase.rpc('increment_download_count', { resource_id: resourceId });
      if (incrementError) {
        console.warn('Download count increment skipped:', incrementError.message);
      }
    }

    return NextResponse.json({ download: data });
  } catch (error) {
    console.error('Download record error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

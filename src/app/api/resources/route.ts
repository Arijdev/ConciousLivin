import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient, createSupabaseServerClient } from '@/lib/supabase-server';
import {
  boundedString,
  isSafeMediaUrl,
  isSameOriginRequest,
  readJsonObject,
} from '@/lib/api-security';

const CATEGORIES = new Set(['nutrition', 'longevity', 'heart', 'fasting', 'detox', 'mental']);
const MAX_PRICE = 10_000;

function previewContent(value: unknown) {
  const content = value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
  const chapters = Array.isArray(content.chapters) ? content.chapters.slice(0, 1) : [];
  return {
    introduction: typeof content.introduction === 'string' ? content.introduction : '',
    chapters,
    protocolSummary: Array.isArray(content.protocolSummary) ? content.protocolSummary : [],
  };
}

function purchasedResourceIds(items: unknown): Set<string> {
  const ids = new Set<string>();
  if (!Array.isArray(items)) return ids;
  for (const item of items) {
    if (item && typeof item === 'object' && typeof (item as { resourceId?: unknown }).resourceId === 'string') {
      ids.add((item as { resourceId: string }).resourceId);
    }
  }
  return ids;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const isFree = searchParams.get('isFree');
    const requestedLimit = Number.parseInt(searchParams.get('limit') || '50', 10);
    const requestedOffset = Number.parseInt(searchParams.get('offset') || '0', 10);
    const limit = Number.isFinite(requestedLimit) ? Math.min(Math.max(requestedLimit, 1), 100) : 50;
    const offset = Number.isFinite(requestedOffset) ? Math.max(requestedOffset, 0) : 0;

    // Service-role reader: paid book text is revoked from anon/authenticated
    // column privileges, so the catalogue must be projected on the server.
    const reader = process.env.SUPABASE_SERVICE_ROLE_KEY
      ? createSupabaseAdminClient()
      : supabase;

    let query = reader
      .from('health_resources')
      .select(
        'id, title, subtitle, category, is_free, price, original_price, rating, review_count, pages, reading_time, cover_image_url, thumbnail_url, badge, badge_color, description, highlights, table_of_contents, full_content, pdf_url, published_at',
      )
      .eq('is_active', true)
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (category && CATEGORIES.has(category)) {
      query = query.eq('category', category);
    }

    if (isFree === 'true' || isFree === 'false') {
      query = query.eq('is_free', isFree === 'true');
    }

    const { data, error } = await query;

    if (error) {
      console.warn('Supabase health_resources table query notice:', error.message);
      return NextResponse.json({ resources: [], total: 0 });
    }

    const { data: { user } } = await supabase.auth.getUser();
    let owned = new Set<string>();
    let isDoctor = false;
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();
      isDoctor = profile?.role === 'doctor';

      if (!isDoctor && data && data.some((resource) => !resource.is_free)) {
        const { data: purchases } = await supabase
          .from('purchases')
          .select('items')
          .eq('user_id', user.id)
          .eq('status', 'completed');
        owned = purchasedResourceIds((purchases || []).flatMap((purchase) => purchase.items));
      }
    }

    // Paid book text is only returned to buyers (and to the doctor who author
    // guides); anonymous and unpaid visitors receive catalogue metadata so the
    // library and checkout keep working.
    const resources = (data || []).map((resource) => {
      if (resource.is_free || owned.has(resource.id) || isDoctor) return resource;
      return { ...resource, full_content: previewContent(resource.full_content) };
    });

    return NextResponse.json({ resources, total: resources.length });
  } catch (error) {
    console.error('Resources fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'doctor') {
      return NextResponse.json({ error: 'Forbidden: Doctors only' }, { status: 403 });
    }

    const body = await readJsonObject(request, 131_072);
    if (!body) {
      return NextResponse.json({ error: 'Invalid resource payload.' }, { status: 400 });
    }

    const title = boundedString(body.title, 200);
    const subtitle = typeof body.subtitle === 'string' ? body.subtitle.trim().slice(0, 300) : null;
    const category = typeof body.category === 'string' && CATEGORIES.has(body.category) ? body.category : null;
    const description = boundedString(body.description, 5_000);
    const price = typeof body.price === 'number' && Number.isFinite(body.price) ? body.price : 0;
    const originalPrice = typeof body.original_price === 'number' && Number.isFinite(body.original_price)
      ? body.original_price
      : null;

    if (!title || !category || !description || price < 0 || price > MAX_PRICE ||
        (originalPrice !== null && (originalPrice < 0 || originalPrice > MAX_PRICE))) {
      return NextResponse.json({ error: 'Resource details are invalid.' }, { status: 400 });
    }

    const coverImageUrl = isSafeMediaUrl(body.cover_image_url) ? body.cover_image_url : null;
    const pdfUrl = isSafeMediaUrl(body.pdf_url) ? body.pdf_url : null;
    const thumbnailUrl = isSafeMediaUrl(body.thumbnail_url) ? body.thumbnail_url : null;
    const highlights = Array.isArray(body.highlights)
      ? body.highlights.filter((item): item is string => typeof item === 'string').slice(0, 30)
      : [];
    const tableOfContents = Array.isArray(body.table_of_contents)
      ? body.table_of_contents.filter((item): item is string => typeof item === 'string').slice(0, 60)
      : [];

    const { data, error } = await supabase
      .from('health_resources')
      .insert({
        title,
        subtitle,
        category,
        is_free: body.is_free === true,
        price: body.is_free === true ? 0 : price,
        original_price: originalPrice,
        cover_image_url: coverImageUrl,
        pdf_url: pdfUrl,
        thumbnail_url: thumbnailUrl,
        badge: typeof body.badge === 'string' ? body.badge.trim().slice(0, 80) : null,
        badge_color: typeof body.badge_color === 'string' ? body.badge_color.trim().slice(0, 32) : 'emerald',
        description,
        highlights,
        table_of_contents: tableOfContents,
        full_content: body.full_content && typeof body.full_content === 'object' && !Array.isArray(body.full_content)
          ? body.full_content
          : {},
        uploaded_by: user.id,
      })
      .select('id')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ resource: data });
  } catch (error) {
    console.error('Resource creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient, createSupabaseAdminClient } from '@/lib/supabase-server';
import {
  isSameOriginRequest,
  readJsonObject,
} from '@/lib/api-security';

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

    const body = await readJsonObject(request, 65_536);
    if (!body) {
      return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 });
    }

    const resourceId = typeof body.resourceId === 'string' ? body.resourceId.trim() : '';
    const claimedFrom = typeof body.claimedFrom === 'string' ? body.claimedFrom.trim() : 'website';

    if (!resourceId) {
      return NextResponse.json({ error: 'Resource ID is required.' }, { status: 400 });
    }

    // Validate resource exists and is active
    const adminClient = process.env.SUPABASE_SERVICE_ROLE_KEY
      ? createSupabaseAdminClient()
      : supabase;

    const { data: resource, error: resourceError } = await adminClient
      .from('health_resources')
      .select('id, is_free, is_active')
      .eq('id', resourceId)
      .single();

    if (resourceError || !resource) {
      return NextResponse.json({ error: 'Resource not found.' }, { status: 404 });
    }

    if (!resource.is_active) {
      return NextResponse.json({ error: 'This resource is no longer available.' }, { status: 400 });
    }

    // Check if already claimed
    const { data: existing } = await supabase
      .from('user_library')
      .select('id')
      .eq('user_id', user.id)
      .eq('resource_id', resourceId)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ 
        success: true, 
        message: 'Book already in your library.',
        alreadyClaimed: true 
      });
    }

    // For paid books, user must have purchased or be doctor
    if (!resource.is_free) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      const isDoctor = profile?.role === 'doctor';

      if (!isDoctor) {
        const { data: purchases } = await supabase
          .from('purchases')
          .select('items')
          .eq('user_id', user.id)
          .eq('status', 'completed');

        const owned = new Set<string>();
        if (purchases) {
          for (const purchase of purchases) {
            if (purchase.items && Array.isArray(purchase.items)) {
              for (const item of purchase.items) {
                if (item.resourceId) owned.add(item.resourceId);
              }
            }
          }
        }

        if (!owned.has(resourceId)) {
          return NextResponse.json({ 
            error: 'You must purchase this book before claiming it.' 
          }, { status: 403 });
        }
      }
    }

    // Claim the book
    const { data: libraryItem, error: claimError } = await supabase
      .from('user_library')
      .insert({
        user_id: user.id,
        resource_id: resourceId,
        claimed_from: claimedFrom,
      })
      .select()
      .single();

    if (claimError) {
      console.error('Claim book error:', claimError);
      return NextResponse.json({ error: 'Failed to claim book.' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Book added to your library!',
      libraryItem 
    });

  } catch (error) {
    console.error('Claim book error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const resourceId = searchParams.get('resourceId');

    if (!resourceId) {
      return NextResponse.json({ error: 'Resource ID is required.' }, { status: 400 });
    }

    const { error } = await supabase
      .from('user_library')
      .delete()
      .eq('user_id', user.id)
      .eq('resource_id', resourceId);

    if (error) {
      return NextResponse.json({ error: 'Failed to remove from library.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Removed from library.' });
  } catch (error) {
    console.error('Remove from library error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const resourceId = searchParams.get('resourceId');

    if (resourceId) {
      // Check specific resource
      const { data, error } = await supabase
        .from('user_library')
        .select('*')
        .eq('user_id', user.id)
        .eq('resource_id', resourceId)
        .maybeSingle();

      if (error) {
        return NextResponse.json({ error: 'Failed to check library.' }, { status: 500 });
      }

      return NextResponse.json({ inLibrary: !!data, libraryItem: data });
    }

    // Get all library items with resource details
    const { data, error } = await supabase
      .from('user_library')
      .select(`
        *,
        health_resources (
          id, title, subtitle, category, is_free, price, cover_image_url,
          pdf_url, pages, reading_time, badge, badge_color, description,
          highlights, table_of_contents
        )
      `)
      .eq('user_id', user.id)
      .order('claimed_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch library.' }, { status: 500 });
    }

    return NextResponse.json({ library: data || [] });
  } catch (error) {
    console.error('Fetch library error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
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

    const body = await readJsonObject(request, 65_536);
    if (!body) {
      return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 });
    }

    const resourceId = typeof body.resourceId === 'string' ? body.resourceId.trim() : '';
    const lastReadChapter = typeof body.lastReadChapter === 'number' ? body.lastReadChapter : undefined;
    const readingProgress = body.readingProgress && typeof body.readingProgress === 'object' ? body.readingProgress : undefined;

    if (!resourceId) {
      return NextResponse.json({ error: 'Resource ID is required.' }, { status: 400 });
    }

    const updates: Record<string, unknown> = {
      last_read_at: new Date().toISOString(),
    };

    if (lastReadChapter !== undefined) {
      updates.last_read_chapter = lastReadChapter;
    }

    if (readingProgress !== undefined) {
      updates.reading_progress = readingProgress;
    }

    const { data, error } = await supabase
      .from('user_library')
      .update(updates)
      .eq('user_id', user.id)
      .eq('resource_id', resourceId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'Failed to update reading progress.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, libraryItem: data });
  } catch (error) {
    console.error('Update reading progress error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { createSupabaseAdminClient } from '@/lib/supabase-server';
import { generateThumbnail } from '@/lib/pdf-thumbnail';
import {
  isRateLimited,
  isSameOriginRequest,
  rateLimitResponse,
} from '@/lib/api-security';

const MAX_PDF_BYTES = 25 * 1024 * 1024;
const MAX_THUMBNAIL_BYTES = 5 * 1024 * 1024;
const MAX_TITLE_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 5_000;
const MAX_PRICE = 10_000;
const CATEGORIES = new Set(['nutrition', 'longevity', 'heart', 'fasting', 'detox', 'mental']);
const THUMBNAIL_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

function sanitizedFileName(name: string, maxLength = 120) {
  return name.replace(/[^a-zA-Z0-9.-]/g, '_').slice(-maxLength);
}

async function hasPdfSignature(file: File): Promise<boolean> {
  const header = new Uint8Array(await file.slice(0, 5).arrayBuffer());
  return header.length === 5 && header[0] === 0x25 && header[1] === 0x50 && header[2] === 0x44 && header[3] === 0x46 && header[4] === 0x2d;
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

    if (isRateLimited(`upload:${user.id}`, 10, 3_600_000)) {
      return rateLimitResponse(3_600);
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'doctor') {
      return NextResponse.json({ error: 'Forbidden: Doctors only' }, { status: 403 });
    }

    const contentLength = Number(request.headers.get('content-length') || 0);
    if (contentLength > MAX_PDF_BYTES + MAX_THUMBNAIL_BYTES + 1_000_000) {
      return NextResponse.json({ error: 'Upload is too large.' }, { status: 413 });
    }

    const formData = await request.formData();
    const pdfFile = formData.get('pdf');
    const thumbnailFile = formData.get('thumbnail');
    const title = typeof formData.get('title') === 'string' ? String(formData.get('title')).trim() : '';
    const category = typeof formData.get('category') === 'string' ? String(formData.get('category')) : '';
    const isFree = formData.get('isFree') === 'true';
    const rawPrice = Number.parseFloat(String(formData.get('price') || '0'));
    const price = Number.isFinite(rawPrice) ? Math.round(rawPrice * 100) / 100 : 0;
    const description = typeof formData.get('description') === 'string'
      ? String(formData.get('description')).trim().slice(0, MAX_DESCRIPTION_LENGTH)
      : '';

    if (!(pdfFile instanceof File) || !title || !CATEGORIES.has(category)) {
      return NextResponse.json(
        { error: 'PDF file, title, and a valid category are required' },
        { status: 400 }
      );
    }

    if (title.length > MAX_TITLE_LENGTH) {
      return NextResponse.json({ error: 'Title is too long.' }, { status: 400 });
    }

    if (price < 0 || price > MAX_PRICE) {
      return NextResponse.json({ error: 'Price is out of range.' }, { status: 400 });
    }

    if (pdfFile.size === 0 || pdfFile.size > MAX_PDF_BYTES) {
      return NextResponse.json({ error: 'PDF must be smaller than 25 MB.' }, { status: 413 });
    }

    if (pdfFile.type !== 'application/pdf' || !(await hasPdfSignature(pdfFile))) {
      return NextResponse.json({ error: 'File must be a PDF' }, { status: 400 });
    }

    const adminClient = createSupabaseAdminClient();
    const timestamp = Date.now();
    const pdfFileName = `${user.id}/${timestamp}-${sanitizedFileName(pdfFile.name)}`;

    const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer());
    const { data: pdfData, error: pdfError } = await adminClient.storage
      .from('pdfs')
      .upload(pdfFileName, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: false,
      });

    if (pdfError) {
      return NextResponse.json({ error: pdfError.message }, { status: 400 });
    }

    const { data: pdfUrlData } = adminClient.storage.from('pdfs').getPublicUrl(pdfData.path);
    const pdfUrl = pdfUrlData.publicUrl;

    let thumbnailUrl: string | null = null;

    if (thumbnailFile instanceof File) {
      if (!THUMBNAIL_TYPES.includes(thumbnailFile.type)) {
        return NextResponse.json({ error: 'Thumbnail must be an image' }, { status: 400 });
      }

      if (thumbnailFile.size === 0 || thumbnailFile.size > MAX_THUMBNAIL_BYTES) {
        return NextResponse.json({ error: 'Thumbnail must be smaller than 5 MB.' }, { status: 413 });
      }

      const thumbnailFileName = `${user.id}/${timestamp}-thumb-${sanitizedFileName(thumbnailFile.name)}`;
      const thumbnailBuffer = Buffer.from(await thumbnailFile.arrayBuffer());

      const { data: thumbData, error: thumbError } = await adminClient.storage
        .from('thumbnails')
        .upload(thumbnailFileName, thumbnailBuffer, {
          contentType: thumbnailFile.type,
          upsert: false,
        });

      if (thumbError) {
        return NextResponse.json({ error: thumbError.message }, { status: 400 });
      }

      const { data: thumbUrlData } = adminClient.storage.from('thumbnails').getPublicUrl(thumbData.path);
      thumbnailUrl = thumbUrlData.publicUrl;
    } else {
      try {
        const generatedThumbnail = await generateThumbnail(pdfBuffer);
        if (generatedThumbnail) {
          const thumbnailFileName = `${user.id}/${timestamp}-thumb-generated.png`;
          const { data: thumbData, error: thumbError } = await adminClient.storage
            .from('thumbnails')
            .upload(thumbnailFileName, generatedThumbnail, {
              contentType: 'image/png',
              upsert: false,
            });

          if (!thumbError && thumbData) {
            const { data: thumbUrlData } = adminClient.storage.from('thumbnails').getPublicUrl(thumbData.path);
            thumbnailUrl = thumbUrlData.publicUrl;
          }
        }
      } catch (thumbError) {
        console.error('Thumbnail generation failed:', thumbError);
      }
    }

    const { data: resource, error: resourceError } = await supabase
      .from('health_resources')
      .insert({
        title,
        category,
        is_free: isFree,
        price: isFree ? 0 : price,
        cover_image_url: thumbnailUrl,
        pdf_url: pdfUrl,
        thumbnail_url: thumbnailUrl,
        description,
        uploaded_by: user.id,
      })
      .select('id, title, category, is_free, price, pdf_url, thumbnail_url')
      .single();

    if (resourceError) {
      await adminClient.storage.from('pdfs').remove([pdfData.path]);
      if (thumbnailUrl) {
        const thumbPath = thumbnailUrl.split('/thumbnails/')[1];
        if (thumbPath) {
          await adminClient.storage.from('thumbnails').remove([thumbPath]);
        }
      }
      return NextResponse.json({ error: resourceError.message }, { status: 400 });
    }

    return NextResponse.json({
      message: 'PDF uploaded successfully',
      resource,
      pdfUrl,
      thumbnailUrl,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

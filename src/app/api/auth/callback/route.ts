import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { safeRedirectPath } from '@/lib/api-security';

function siteBase(request: NextRequest): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) {
    try {
      return new URL(configured).origin;
    } catch {
      // Fall back to the origin that served this request.
    }
  }
  return request.nextUrl.origin;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = safeRedirectPath(searchParams.get('next'), '/');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  const base = siteBase(request);

  // Handle OAuth errors from provider
  if (error) {
    console.error('OAuth error:', error, errorDescription);
    return NextResponse.redirect(
      `${base}/login?error=${encodeURIComponent(errorDescription || error)}`
    );
  }

  if (code) {
    try {
      const supabase = await createSupabaseServerClient();
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

      if (!exchangeError) {
        // Success - redirect to the same-origin path validated above.
        return NextResponse.redirect(`${base}${next}`);
      }

      console.error('Code exchange failed:', exchangeError);
    } catch (err) {
      console.error('Callback error:', err);
    }
  }

  // Fallback: redirect to login with error
  return NextResponse.redirect(
    `${base}/login?error=${encodeURIComponent('Authentication failed')}`
  );
}

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import {
  getClientIp,
  isRateLimited,
  isSameOriginRequest,
  rateLimitResponse,
  readJsonObject,
} from '@/lib/api-security';

const EMAIL_PATTERN = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/;
const OTP_TYPES = new Set(['signup', 'recovery', 'magic_link']);

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

export async function POST(request: NextRequest) {
  try {
    if (!isSameOriginRequest(request)) {
      return NextResponse.json({ error: 'Request origin is not allowed.' }, { status: 403 });
    }

    const ip = getClientIp(request);
    if (isRateLimited(`otp:${ip}`, 5, 300_000)) {
      return rateLimitResponse(300);
    }

    const body = await readJsonObject(request, 2_048);
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
    const type = typeof body?.type === 'string' ? body.type : '';

    if (!email || email.length > 254 || !EMAIL_PATTERN.test(email)) {
      return NextResponse.json(
        { error: 'A valid email is required.' },
        { status: 400 }
      );
    }

    if (!OTP_TYPES.has(type)) {
      return NextResponse.json(
        { error: 'Invalid OTP type' },
        { status: 400 }
      );
    }

    if (isRateLimited(`otp-account:${email}`, 3, 300_000)) {
      return rateLimitResponse(300);
    }

    const base = siteBase(request);
    const supabase = await createSupabaseServerClient();

    if (type === 'signup') {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${base}/auth/callback`,
        },
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({
        message: 'Verification email sent. Please check your inbox.',
      });
    }

    if (type === 'recovery') {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        // Land on the site root — the browser client detects the recovery
        // token from the URL and opens the reset form automatically.
        redirectTo: `${base}/`,
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({
        message: 'Password reset email sent. Please check your inbox.',
      });
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${base}/auth/callback`,
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      message: 'Magic link sent. Please check your email.',
    });
  } catch (error) {
    console.error('OTP error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

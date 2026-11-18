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

export async function POST(request: NextRequest) {
  try {
    if (!isSameOriginRequest(request)) {
      return NextResponse.json({ error: 'Request origin is not allowed.' }, { status: 403 });
    }

    if (isRateLimited(`resend-otp:${getClientIp(request)}`, 5, 300_000)) {
      return rateLimitResponse(300);
    }

    const body = await readJsonObject(request, 2_048);
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';

    if (!email || email.length > 254 || !EMAIL_PATTERN.test(email)) {
      return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
    }

    if (isRateLimited(`resend-otp-account:${email}`, 3, 300_000)) {
      return rateLimitResponse(300);
    }

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });

    if (error) {
      if (/rate limit|too many requests/i.test(error.message)) {
        return NextResponse.json(
          { error: 'A code was requested recently. Wait at least 60 seconds before trying again.' },
          { status: 429 },
        );
      }
      if (/error sending confirmation email|failed to send/i.test(error.message)) {
        console.error('Supabase signup OTP resend delivery failed:', {
          message: error.message,
          status: error.status,
          code: error.code,
          name: error.name,
        });
        return NextResponse.json(
          { error: 'Supabase could not deliver the code. Check your SMTP provider logs and sender verification.' },
          { status: 503 },
        );
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'A new verification code was requested. Check your inbox and spam folder.' });
  } catch (error) {
    console.error('Signup OTP resend failed:', error);
    return NextResponse.json({ error: 'Could not request another code. Please try again later.' }, { status: 500 });
  }
}

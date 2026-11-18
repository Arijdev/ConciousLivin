import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { validatePasswordStrength } from '@/lib/password-utils';
import {
  boundedString,
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
    if (isRateLimited(`signup:${getClientIp(request)}`, 10)) {
      return rateLimitResponse();
    }

    const body = await readJsonObject(request);
    if (!body) {
      return NextResponse.json({ error: 'Invalid signup request.' }, { status: 400 });
    }

    const email = boundedString(body.email, 254)?.toLowerCase();
    const password = typeof body.password === 'string' && body.password.length <= 128 ? body.password : null;
    const fullName = typeof body.fullName === 'string' ? body.fullName.trim().slice(0, 120) : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim().slice(0, 32) : '';

    if (!email || !EMAIL_PATTERN.test(email) || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: passwordValidation.message, errors: passwordValidation.errors },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient();

    // Send OTP for email verification (6-digit code)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || email.split('@')[0],
          phone,
          // Privileges are never taken from user input; doctors are promoted
          // manually against the profiles table by an administrator.
          role: 'customer',
        },
      },
    });

    if (error) {
      if (/rate limit|too many requests/i.test(error.message)) {
        return NextResponse.json(
          {
            error: 'Supabase temporarily limited signup emails. Wait at least 60 seconds before retrying. Its built-in email service allows only 2 emails per hour; configure custom SMTP in Supabase Auth settings for continued testing or production.',
          },
          { status: 429 },
        );
      }
      if (/error sending confirmation email|failed to send/i.test(error.message)) {
        console.error('Supabase signup email delivery failed:', {
          message: error.message,
          status: error.status,
          code: error.code,
          name: error.name,
        });
        return NextResponse.json(
          {
            error: 'Supabase could not deliver the signup code, so no OTP email was sent. Check that custom SMTP is enabled and saved, the sender address is verified with your provider, and the SMTP credentials are current. Check your SMTP provider logs for the rejected message.',
          },
          { status: 503 },
        );
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      message: 'A 6-digit verification code has been sent to your email. Enter the code to activate your account.',
      needsOtp: true,
      email,
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

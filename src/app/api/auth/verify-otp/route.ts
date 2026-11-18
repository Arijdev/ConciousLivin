import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import {
  boundedString,
  getClientIp,
  isRateLimited,
  isSameOriginRequest,
  rateLimitResponse,
  readJsonObject,
} from '@/lib/api-security';

export async function POST(request: NextRequest) {
  try {
    if (!isSameOriginRequest(request)) {
      return NextResponse.json({ error: 'Request origin is not allowed.' }, { status: 403 });
    }

    const ip = getClientIp(request);
    if (isRateLimited(`verify-otp:${ip}`, 20)) {
      return rateLimitResponse();
    }

    const body = await readJsonObject(request, 4_096);
    if (!body) {
      return NextResponse.json(
        { error: 'Email and verification code are required' },
        { status: 400 }
      );
    }

    const email = boundedString(body.email, 254)?.toLowerCase();
    const token = typeof body.token === 'string' ? body.token.trim() : '';
    const fullName = typeof body.fullName === 'string' ? body.fullName.trim().slice(0, 120) : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim().slice(0, 32) : '';

    if (!email || !/^\d{6}$/.test(token)) {
      return NextResponse.json(
        { error: 'Email and verification code are required' },
        { status: 400 }
      );
    }

    if (isRateLimited(`verify-otp-account:${email}`, 10, 300_000)) {
      return rateLimitResponse(300);
    }

    const supabase = await createSupabaseServerClient();

    // Verify the OTP
    const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'signup',
    });

    if (verifyError) {
      return NextResponse.json({ error: verifyError.message }, { status: 400 });
    }

    // Set optional profile fields after Supabase confirms the signup code.
    if (verifyData.user && (fullName || phone)) {
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          full_name: fullName || email.split('@')[0],
          phone,
          role: 'customer',
        },
      });

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 400 });
      }
    }

    return NextResponse.json({
      message: 'Account verified and created successfully',
      user: verifyData.user ? { id: verifyData.user.id, email: verifyData.user.email } : null,
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

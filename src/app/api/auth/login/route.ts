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
    if (isRateLimited(`login:${ip}`, 15)) {
      return rateLimitResponse();
    }

    const body = await readJsonObject(request, 4_096);
    if (!body) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const email = boundedString(body.email, 254)?.toLowerCase();
    const password = typeof body.password === 'string' && body.password.length <= 128 ? body.password : null;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (isRateLimited(`login-account:${email}`, 10, 300_000)) {
      return rateLimitResponse(300);
    }

    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 400 });
    }

    // Session cookies are set by Supabase on the response; never echo tokens
    // back in the JSON body where client scripts could read them.
    return NextResponse.json({
      message: 'Login successful',
      user: data.user ? { id: data.user.id, email: data.user.email } : null,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

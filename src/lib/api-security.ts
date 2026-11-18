import { NextRequest, NextResponse } from 'next/server';

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_ENTRIES = 5_000;

type RateLimitEntry = { count: number; resetAt: number };

const globalForRateLimit = globalThis as unknown as {
  __conciouslivinRateLimit?: Map<string, RateLimitEntry>;
};

const rateLimitStore =
  globalForRateLimit.__conciouslivinRateLimit ??
  (globalForRateLimit.__conciouslivinRateLimit = new Map<string, RateLimitEntry>());

export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  return request.headers.get('x-real-ip')?.trim() || 'unknown';
}

export function isRateLimited(key: string, limit: number, windowMs = RATE_LIMIT_WINDOW_MS): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || entry.resetAt <= now) {
    if (rateLimitStore.size >= RATE_LIMIT_MAX_ENTRIES) {
      for (const [staleKey, staleEntry] of rateLimitStore) {
        if (staleEntry.resetAt <= now) rateLimitStore.delete(staleKey);
      }
    }
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  entry.count += 1;
  return entry.count > limit;
}

export function rateLimitResponse(retryAfterSeconds = 60) {
  return NextResponse.json(
    { error: 'Too many requests. Please wait a moment and try again.' },
    { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } },
  );
}

export function isSameOriginRequest(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return true;

  const allowed = new Set<string>();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl) {
    try {
      allowed.add(new URL(siteUrl).origin);
    } catch {
      // Ignore malformed site URL configuration.
    }
  }
  try {
    allowed.add(request.nextUrl.origin);
  } catch {
    // Ignore unparsable request origins.
  }

  return allowed.has(origin);
}

export async function readJsonObject(
  request: NextRequest,
  maxBytes = 16_384,
): Promise<Record<string, unknown> | null> {
  const contentType = request.headers.get('content-type') || '';
  if (!contentType.toLowerCase().includes('application/json')) return null;

  const raw = await request.text();
  if (raw.length > maxBytes) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;
    return parsed as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function boundedString(value: unknown, maxLength: number): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > maxLength) return null;
  return trimmed;
}

export function isSafeHttpUrl(value: unknown, maxLength = 2048): value is string {
  if (typeof value !== 'string' || value.length > maxLength) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

export function isSafeMediaUrl(value: unknown, maxLength = 2048): value is string {
  if (typeof value !== 'string' || !value || value.length > maxLength) return false;
  if (value.startsWith('/')) return !value.startsWith('//') && !value.includes('\\');
  return isSafeHttpUrl(value, maxLength);
}

export function safeRedirectPath(value: unknown, fallback = '/'): string {
  if (typeof value !== 'string' || !value.startsWith('/')) return fallback;
  if (value.startsWith('//') || value.includes('\\') || value.includes('@')) return fallback;
  if (/[\r\n]/.test(value)) return fallback;
  if (/^\/[a-zA-Z][a-zA-Z0-9+.-]*:/.test(value)) return fallback;
  return value;
}

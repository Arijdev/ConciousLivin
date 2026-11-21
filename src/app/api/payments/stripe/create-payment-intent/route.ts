import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient, createSupabaseServerClient } from '@/lib/supabase-server';
import { getStripeInstance } from '@/lib/stripe';
import { CONSULTATION_PACKAGES, DISCOUNT_COUPONS, HEALTH_RESOURCES } from '@/data/healthData';
import { isSameOriginRequest, readJsonObject } from '@/lib/api-security';

type ItemRequest = { resourceId: string; quantity: number };

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function availableSlots(durationMinutes: number) {
  return [11 * 60, 15 * 60].flatMap((start) => {
    const end = start + 120;
    const slots: string[] = [];
    for (let minute = start; minute + durationMinutes <= end; minute += durationMinutes) {
      const hour = Math.floor(minute / 60);
      const period = hour >= 12 ? 'PM' : 'AM';
      slots.push(`${hour % 12 || 12}:${String(minute % 60).padStart(2, '0')} ${period} IST`);
    }
    return slots;
  });
}

export async function POST(request: NextRequest) {
  try {
    if (!isSameOriginRequest(request)) {
      return NextResponse.json({ error: 'Request origin is not allowed.' }, { status: 403 });
    }

    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Sign in before starting a payment.' }, { status: 401 });

    const body = await readJsonObject(request, 32_768);
    if (!body) return NextResponse.json({ error: 'Unsupported payment type.' }, { status: 400 });
    let kind: 'resources' | 'consultation';
    let amount = 0;
    let description = '';
    let details: Record<string, unknown>;
    let metadata: Record<string, string> = {};

    if (body.kind === 'consultation') {
      const pkg = CONSULTATION_PACKAGES.find((item) => item.id === body.packageId);
      const appointmentDate = String(body.appointmentDate || '');
      const appointmentTime = String(body.appointmentTime || '');
      const fullName = String(body.fullName || '').trim();
      const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });

      if (!pkg || !/^\d{4}-\d{2}-\d{2}$/.test(appointmentDate) || appointmentDate < today ||
          !availableSlots(pkg.durationMinutes).includes(appointmentTime) || !fullName || !user.email) {
        return NextResponse.json({ error: 'The selected consultation details are invalid.' }, { status: 400 });
      }

      kind = 'consultation';
      amount = pkg.price;
      description = pkg.title;
      details = {
        packageId: pkg.id,
        packageTitle: pkg.title,
        fullName,
        email: user.email,
        phone: String(body.phone || '').trim(),
        primaryConcern: String(body.primaryConcern || '').trim(),
        appointmentDate,
        appointmentTime,
      };
    } else if (body.kind === 'resources') {
      if (!Array.isArray(body.items) || body.items.length === 0 || body.items.length > 20) {
        return NextResponse.json({ error: 'Your cart is empty or invalid.' }, { status: 400 });
      }

      const requestedItems = body.items as ItemRequest[];
      if (requestedItems.some((item) => typeof item.resourceId !== 'string' || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 10)) {
        return NextResponse.json({ error: 'One or more cart quantities are invalid.' }, { status: 400 });
      }

      const knownResources = new Map(HEALTH_RESOURCES.map((resource) => [resource.id, resource]));
      const databaseIds = requestedItems.map((item) => item.resourceId).filter((id) => isUuid(id));
      if (databaseIds.length > 0) {
        const supabaseAdmin = createSupabaseAdminClient();
        const { data: databaseResources, error } = await supabaseAdmin
          .from('health_resources')
          .select('id, title, price, is_free')
          .in('id', databaseIds)
          .eq('is_active', true);
        if (error) throw error;
        for (const resource of databaseResources || []) {
          knownResources.set(resource.id, {
            ...HEALTH_RESOURCES[0],
            id: resource.id,
            title: resource.title,
            price: Number(resource.price),
            isFree: resource.is_free,
          });
        }
      }

      const lineItems = requestedItems.map(({ resourceId, quantity }) => {
        const resource = knownResources.get(resourceId);
        if (!resource || resource.isFree || !Number.isFinite(resource.price) || resource.price <= 0) {
          throw new Error('A paid guide in your cart is no longer available. Refresh your cart and try again.');
        }
        return { resourceId, title: resource.title, unitPrice: resource.price, quantity };
      });
      const subtotal = lineItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
      const couponCode = String(body.couponCode || '').trim().toUpperCase();
      const coupon = DISCOUNT_COUPONS.find((item) => item.code === couponCode);
      if (couponCode && !coupon) {
        return NextResponse.json({ error: 'This coupon is no longer valid. Remove it and try again.' }, { status: 400 });
      }
      let discount = 0;
      if (coupon) {
        discount = coupon.discountPercent
          ? subtotal * coupon.discountPercent / 100
          : Math.min(coupon.discountAmount || 0, subtotal);
      }
      amount = Math.max(0.01, Math.round((subtotal - discount) * 100) / 100);
      kind = 'resources';
      description = `${lineItems.length} digital health guide${lineItems.length === 1 ? '' : 's'}`;
      details = { items: lineItems, couponCode: coupon ? coupon.code : null };
    } else {
      return NextResponse.json({ error: 'Unsupported payment type.' }, { status: 400 });
    }

    const admin = createSupabaseAdminClient();
    const { data: paymentDraft, error: draftError } = await admin
      .from('payment_orders')
      .insert({ user_id: user.id, payment_type: kind, details, amount_usd: amount, status: 'pending' })
      .select('id')
      .single();
    if (draftError || !paymentDraft) throw draftError || new Error('Could not start payment.');

    // Create Stripe PaymentIntent
    const stripeInstance = getStripeInstance();
    if (!stripeInstance) {
      throw new Error('Stripe not configured. Please set STRIPE_SECRET_KEY environment variable.');
    }
    const paymentIntent = await stripeInstance.paymentIntents.create({
      amount: Math.round(amount * 100), // Amount in cents
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: {
        userId: user.id,
        paymentDraftId: paymentDraft.id,
        kind,
        description: description.slice(0, 500),
      },
      receipt_email: user.email,
    });

    // Update payment draft with Stripe payment intent ID
    const { error: updateError } = await admin
      .from('payment_orders')
      .update({ stripe_payment_intent_id: paymentIntent.id })
      .eq('id', paymentDraft.id)
      .eq('user_id', user.id);
    if (updateError) throw updateError;

    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret,
      paymentDraftId: paymentDraft.id,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not start card checkout.';
    console.error('Stripe payment intent creation failed:', message);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
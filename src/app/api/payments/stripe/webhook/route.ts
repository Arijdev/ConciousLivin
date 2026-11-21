import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase-server';
import { getStripeInstance } from '@/lib/stripe';
import { HEALTH_RESOURCES } from '@/data/healthData';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET not configured');
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    const stripeInstance = getStripeInstance();
    if (!stripeInstance) {
      console.error('Stripe not configured');
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
    }

    let event;
    try {
      event = stripeInstance.webhooks.constructEvent(body, signature!, webhookSecret);
    } catch (err) {
      console.error('Stripe webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Handle successful payment
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const paymentDraftId = paymentIntent.metadata.paymentDraftId;
      const userId = paymentIntent.metadata.userId;
      const kind = paymentIntent.metadata.kind;

      const admin = createSupabaseAdminClient();

      // Update payment order status
      const { error: updateError } = await admin
        .from('payment_orders')
        .update({ 
          status: 'completed',
          stripe_payment_intent_id: paymentIntent.id,
          completed_at: new Date().toISOString(),
        })
        .eq('id', paymentDraftId)
        .eq('user_id', paymentIntent.metadata.userId);

      if (updateError) {
        console.error('Failed to update payment order:', updateError);
      }

      // If resources, unlock them for the user
      if (paymentIntent.metadata.kind === 'resources') {
        // This would be handled by the payment_orders table and the unlock logic
        // You can add specific unlock logic here if needed
      }

      console.log(`Payment succeeded for draft ${paymentDraftId}, user ${paymentIntent.metadata.userId}`);
    }

    // Handle failed payment
    if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object;
      const paymentDraftId = paymentIntent.metadata.paymentDraftId;

      const admin = createSupabaseAdminClient();
      
      await admin
        .from('payment_orders')
        .update({ 
          status: 'failed',
          failed_at: new Date().toISOString(),
        })
        .eq('id', paymentDraftId);

      console.log(`Payment failed for draft ${paymentDraftId}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
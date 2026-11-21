import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase-server';
import { verifyRazorpaySignature } from '@/lib/razorpay';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const signature = request.headers.get('x-razorpay-signature');
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('RAZORPAY_WEBHOOK_SECRET not configured');
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    // Verify signature
    const payload = JSON.stringify(body);
    const expectedSignature = require('crypto')
      .createHmac('sha256', webhookSecret)
      .update(payload)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.error('Razorpay webhook signature verification failed');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Handle payment captured
    if (body.event === 'payment.captured') {
      const payment = body.payload.payment.entity;
      const orderId = payment.order_id;
      const paymentId = payment.id;

      // Find payment draft by razorpay_order_id
      const admin = createSupabaseAdminClient();
      const { data: paymentDraft, error: findError } = await admin
        .from('payment_orders')
        .select('id, user_id, kind, details')
        .eq('razorpay_order_id', orderId)
        .single();

      if (findError || !paymentDraft) {
        console.error('Payment draft not found for Razorpay order:', orderId);
        return NextResponse.json({ error: 'Payment draft not found' }, { status: 404 });
      }

      // Update payment order status
      const { error: updateError } = await admin
        .from('payment_orders')
        .update({ 
          status: 'completed',
          razorpay_payment_id: paymentId,
          completed_at: new Date().toISOString(),
        })
        .eq('id', paymentDraft.id)
        .eq('user_id', paymentDraft.user_id);

      if (updateError) {
        console.error('Failed to update payment order:', updateError);
      }

      // If resources, unlock them for the user
      if (paymentDraft.kind === 'resources') {
        // Resources unlocking logic would go here
        // The payment_orders table tracks this
      }

      console.log(`UPI payment captured for draft ${paymentDraft.id}, payment ${paymentId}`);
    }

    // Handle failed payment
    if (body.event === 'payment.failed') {
      const payment = body.payload.payment.entity;
      const orderId = payment.order_id;

      const admin = createSupabaseAdminClient();
      
      await admin
        .from('payment_orders')
        .update({ 
          status: 'failed',
          failed_at: new Date().toISOString(),
        })
        .eq('razorpay_order_id', orderId);

      console.log(`UPI payment failed for order ${orderId}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Razorpay webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
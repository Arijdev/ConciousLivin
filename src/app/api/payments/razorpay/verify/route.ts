import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase-server';
import { verifyRazorpaySignature } from '@/lib/razorpay';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      paymentDraftId,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !paymentDraftId) {
      return NextResponse.json({ error: 'Missing required payment verification fields.' }, { status: 400 });
    }

    // Verify signature
    const isValid = verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid payment signature.' }, { status: 400 });
    }

    // Find payment draft
    const admin = createSupabaseAdminClient();
    const { data: paymentDraft, error: findError } = await admin
      .from('payment_orders')
      .select('id, user_id, kind, details')
      .eq('id', paymentDraftId)
      .single();

    if (findError || !paymentDraft) {
      return NextResponse.json({ error: 'Payment draft not found.' }, { status: 404 });
    }

    // Update payment order status
    const { error: updateError } = await admin
      .from('payment_orders')
      .update({ 
        status: 'completed',
        razorpay_payment_id: razorpay_payment_id,
        razorpay_order_id: razorpay_order_id,
        completed_at: new Date().toISOString(),
      })
      .eq('id', paymentDraftId);

    if (updateError) {
      console.error('Failed to update payment order:', updateError);
    }

    console.log(`UPI payment verified for draft ${paymentDraftId}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Razorpay verification error:', error);
    return NextResponse.json({ error: 'Payment verification failed.' }, { status: 500 });
  }
}
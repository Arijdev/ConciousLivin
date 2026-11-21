import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

export function getStripeInstance(): Stripe | null {
  if (!stripeInstance && process.env.STRIPE_SECRET_KEY) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2024-06-20' as any,
    });
  }
  return stripeInstance;
}
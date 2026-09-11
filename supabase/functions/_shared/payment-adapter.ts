import { StripeAdapter } from "../../../src/adapters/payment/stripe-adapter.ts";

export { StripeAdapter };

export function createPaymentAdapter(): StripeAdapter {
  return new StripeAdapter({
    stripeSecretKey: Deno.env.get("STRIPE_SECRET_KEY")!,
    platformFeePercentage: 0.07,
  });
}

import Stripe from "https://esm.sh/stripe@16?target=deno";

export class StripeAdapter {
  private stripe: Stripe;
  private fee: number;

  constructor(cfg: { stripeSecretKey: string; platformFeePercentage: number }) {
    this.stripe = new Stripe(cfg.stripeSecretKey, { apiVersion: "2024-09-30.acacia" as any });
    this.fee = cfg.platformFeePercentage;
  }

  async holdPayment(_paymentIntentId: string): Promise<void> {
    // MVP: no-op. Em produção, usar manual capture.
  }

  async releaseEscrowPayment(
    paymentIntentId: string,
    stripeAccountId: string,
    score: number,
    maxScore: number
  ): Promise<{ payoutId: string; amount: number; platformFee: number }> {
    const pi = await this.stripe.paymentIntents.retrieve(paymentIntentId);
    const releaseAmount = Math.round((pi.amount * score) / maxScore);
    const platformFee = Math.round(releaseAmount * this.fee);
    const payout = releaseAmount - platformFee;

    const transfer = await this.stripe.transfers.create({
      amount: payout,
      currency: "brl",
      destination: stripeAccountId,
      transfer_group: paymentIntentId,
      metadata: { score: score.toString(), platformFee: platformFee.toString() },
    });

    return { payoutId: transfer.id, amount: payout, platformFee };
  }
}

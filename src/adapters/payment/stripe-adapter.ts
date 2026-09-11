import Stripe from "stripe";

export interface StripeConfig {
  stripeSecretKey: string;
  platformFeePercentage: number;
}

export interface Payout {
  payoutId: string;
  paymentIntentId: string;
  recipientId: string;
  amount: number;
  status: string;
  createdAt: string;
}

export class StripeAdapter {
  private stripe: Stripe;
  private platformFeePercentage: number;

  constructor(config: StripeConfig) {
    this.stripe = new Stripe(config.stripeSecretKey, {
      apiVersion: "2024-09-30.acacia" as any,
    });
    this.platformFeePercentage = config.platformFeePercentage;
  }

  async createEscrowPayment(
    challengeId: string,
    projectId: string,
    amount: number,
    sourceToken: string
  ): Promise<any> {
    const platformFee = Math.round(amount * this.platformFeePercentage);
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount,
      currency: "brl",
      payment_method: sourceToken,
      confirm: true,
      transfer_group: challengeId,
      metadata: { challengeId, projectId, platformFee: String(platformFee) },
    });
    return {
      paymentIntentId: paymentIntent.id,
      challengeId,
      amount,
      platformFee,
      status: "pending",
    };
  }

  async releaseEscrowPayment(
    paymentIntentId: string,
    lancerAccountId: string,
    score: number,
    maxScore: number
  ): Promise<Payout> {
    const paymentIntent =
      await this.stripe.paymentIntents.retrieve(paymentIntentId);
    const releaseAmount = Math.round(
      (paymentIntent.amount * score) / maxScore
    );
    const platformFee = Math.round(
      releaseAmount * this.platformFeePercentage
    );
    const lancerPayout = releaseAmount - platformFee;

    if (lancerPayout <= 0) {
      return {
        payoutId: "zero-payout",
        paymentIntentId,
        recipientId: lancerAccountId,
        amount: 0,
        status: "paid",
        createdAt: new Date().toISOString(),
      };
    }

    const transfer = await this.stripe.transfers.create({
      amount: lancerPayout,
      currency: "brl",
      destination: lancerAccountId,
      transfer_group: paymentIntent.metadata.challengeId,
      metadata: { score: String(score), platformFee: String(platformFee) },
    });

    return {
      payoutId: transfer.id,
      paymentIntentId,
      recipientId: lancerAccountId,
      amount: lancerPayout,
      status: "paid",
      createdAt: new Date().toISOString(),
    };
  }

  async holdPayment(paymentIntentId: string): Promise<void> {
    await this.stripe.paymentIntents.update(paymentIntentId, {
      metadata: { held: "true" },
    });
  }

  async releaseHeldPayment(paymentIntentId: string): Promise<Payout> {
    const pi = await this.stripe.paymentIntents.retrieve(paymentIntentId);
    return {
      payoutId: "released-" + paymentIntentId,
      paymentIntentId,
      recipientId: pi.metadata.lancerAccountId || "",
      amount: pi.amount,
      status: "paid",
      createdAt: new Date().toISOString(),
    };
  }
}

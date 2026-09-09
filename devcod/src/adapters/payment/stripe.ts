import Stripe from 'stripe';

export interface PaymentIntentResult {
  clientSecret: string;
  paymentIntentId: string;
}

export interface RefundResult {
  refundId: string;
  amount: number;
  status: 'succeeded' | 'pending' | 'failed';
}

export class StripeService {
  private stripe: Stripe;

  constructor(secretKey: string) {
    this.stripe = new Stripe(secretKey);
  }

  async createPaymentIntent(
    amount: number,
    currency: string = 'usd',
    metadata?: Record<string, string>
  ): Promise<PaymentIntentResult> {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount, // Amount in cents
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret!,
      paymentIntentId: paymentIntent.id,
    };
  }

  async retrievePaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    return this.stripe.paymentIntents.retrieve(paymentIntentId);
  }

  async confirmPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    return this.stripe.paymentIntents.confirm(paymentIntentId);
  }

  async createRefund(
    paymentIntentId: string,
    amount?: number,
    reason: 'duplicate' | 'fraudulent' | 'requested_by_customer' = 'requested_by_customer'
  ): Promise<RefundResult> {
    const refund = await this.stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount,
      reason,
    });

    return {
      refundId: refund.id,
      amount: refund.amount!,
      status: refund.status as 'succeeded' | 'pending' | 'failed',
    };
  }

  async createCustomer(email: string, name?: string): Promise<Stripe.Customer> {
    return this.stripe.customers.create({
      email,
      name,
    });
  }

  async retrieveCustomer(customerId: string): Promise<Stripe.Customer> {
    return this.stripe.customers.retrieve(customerId) as Promise<Stripe.Customer>;
  }

  async createWebhookEndpoint(
    url: string,
    events: Stripe.WebhookEndpointCreateParams.EnabledEvent[] = ['payment_intent.succeeded', 'payment_intent.canceled']
  ): Promise<Stripe.WebhookEndpoint> {
    return this.stripe.webhookEndpoints.create({
      url,
      enabled_events: events,
    });
  }

  verifyWebhookSignature(
    payload: Buffer,
    signature: string,
    webhookSecret: string
  ): Stripe.Event {
    return this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  }

  async listCharges(customerId?: string): Promise<Stripe.Charge[]> {
    const params: Stripe.ChargeListParams = customerId ? { customer: customerId } : {};
    const charges = await this.stripe.charges.list(params);
    return charges.data;
  }
}

// Factory function
export function createStripeService(secretKey: string): StripeService {
  return new StripeService(secretKey);
}

import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }
    this.stripe = new Stripe(secretKey);
  }

  /**
   * Create Stripe customer for user if not exists
   * Returns Stripe customer ID
   */
  async getOrCreateCustomer(userId: string, email: string): Promise<string> {
    // In a real app, we'd look up the customer in Supabase first
    // For now, create a new one with user ID as metadata
    const customer = await this.stripe.customers.create({
      email,
      metadata: {
        user_id: userId,
      },
    });

    return customer.id;
  }

  /**
   * Create PaymentIntent for order
   * Handles platform commission via application_fee
   * Transfers funds to restaurant's connected account
   */
  async createPaymentIntent(
    orderId: string,
    userId: string,
    restaurantStripeAccountId: string,
    amountCents: number, // Amount in cents (e.g., 1000 for €10.00)
    description: string,
  ): Promise<{ client_secret: string; payment_intent_id: string }> {
    // Calculate platform fee: 7% (5% commission + 2% service fee)
    // For Stripe Connect: application_fee is platform commission only (5% of order)
    const platformFeeCents = Math.round(amountCents * 0.05); // 5% commission to platform

    // Amount for restaurant (95% of order)
    const restaurantAmountCents = amountCents - platformFeeCents;

    // Create PaymentIntent with transfer to connected account
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amountCents,
      currency: 'eur',
      description: description,
      application_fee_amount: platformFeeCents,
      transfer_data: {
        destination: restaurantStripeAccountId,
        amount: restaurantAmountCents,
      },
      metadata: {
        order_id: orderId,
        user_id: userId,
      },
    });

    return {
      client_secret: paymentIntent.client_secret!,
      payment_intent_id: paymentIntent.id,
    };
  }

  /**
   * Confirm PaymentIntent (after 3DS)
   */
  async confirmPaymentIntent(paymentIntentId: string) {
    return await this.stripe.paymentIntents.retrieve(paymentIntentId);
  }

  /**
   * Create SetupIntent for saving card
   */
  async createSetupIntent(customerId: string): Promise<string> {
    const setupIntent = await this.stripe.setupIntents.create({
      customer: customerId,
      usage: 'off_session',
    });

    return setupIntent.client_secret!;
  }

  /**
   * Get payment methods for customer
   */
  async getPaymentMethods(customerId: string) {
    const methods = await this.stripe.customers.listPaymentMethods(customerId, {
      type: 'card',
    });

    return methods.data;
  }

  /**
   * Delete payment method
   */
  async deletePaymentMethod(paymentMethodId: string) {
    return await this.stripe.paymentMethods.detach(paymentMethodId);
  }
}

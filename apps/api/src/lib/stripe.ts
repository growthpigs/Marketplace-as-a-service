import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe | null = null;
  private isConfigured = false;

  constructor() {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (secretKey) {
      this.stripe = new Stripe(secretKey);
      this.isConfigured = true;
    } else {
      console.warn(
        '[StripeService] STRIPE_SECRET_KEY not configured. Stripe operations will be mocked. This is expected for MVP - client will configure when ready.',
      );
      this.isConfigured = false;
    }
  }

  /**
   * Create Stripe customer for user if not exists
   * Returns Stripe customer ID
   *
   * If Stripe is not configured (MVP mode), returns mock customer ID
   */
  async getOrCreateCustomer(userId: string, email: string): Promise<string> {
    // If Stripe is not configured, return mock customer ID
    if (!this.isConfigured) {
      console.log(
        `[StripeService] Mocking customer creation for ${email} (Stripe not configured)`,
      );
      return `cus_mock_${userId}`;
    }

    // In a real app, we'd look up the customer in Supabase first
    // For now, create a new one with user ID as metadata
    const customer = await this.stripe!.customers.create({
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
   *
   * If Stripe is not configured (MVP mode), returns mock payment intent
   */
  async createPaymentIntent(
    orderId: string,
    userId: string,
    restaurantStripeAccountId: string,
    amountCents: number, // Amount in cents (e.g., 1000 for €10.00)
    subtotalCents: number, // Subtotal in cents (for commission calculation - food order only)
    description: string,
  ): Promise<{ client_secret: string; payment_intent_id: string }> {
    // If Stripe is not configured, return mock payment intent
    if (!this.isConfigured) {
      console.log(
        `[StripeService] Mocking PaymentIntent creation for order ${orderId} (Stripe not configured)`,
      );
      return {
        client_secret: `pi_secret_mock_${orderId}`,
        payment_intent_id: `pi_mock_${orderId}`,
      };
    }

    // Calculate platform fee: 5% of SUBTOTAL ONLY (not including delivery/service fees)
    // For Stripe Connect: application_fee is platform commission only (5% of food order)
    const platformFeeCents = Math.round(subtotalCents * 0.05); // 5% commission on subtotal only

    // Amount for restaurant (95% of food order subtotal + delivery fee + service fee)
    const restaurantAmountCents = amountCents - platformFeeCents;

    // Create PaymentIntent with transfer to connected account
    const paymentIntent = await this.stripe!.paymentIntents.create({
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
    if (!this.isConfigured) {
      return { status: 'succeeded', client_secret: null };
    }
    return await this.stripe!.paymentIntents.retrieve(paymentIntentId);
  }

  /**
   * Create SetupIntent for saving card
   */
  async createSetupIntent(customerId: string): Promise<string> {
    if (!this.isConfigured) {
      return `si_secret_mock_${customerId}`;
    }
    const setupIntent = await this.stripe!.setupIntents.create({
      customer: customerId,
      usage: 'off_session',
    });

    return setupIntent.client_secret!;
  }

  /**
   * Get payment methods for customer
   */
  async getPaymentMethods(customerId: string) {
    if (!this.isConfigured) {
      return [];
    }
    const methods = await this.stripe!.customers.listPaymentMethods(
      customerId,
      {
        type: 'card',
      },
    );

    return methods.data;
  }

  /**
   * Delete payment method
   */
  async deletePaymentMethod(paymentMethodId: string) {
    if (!this.isConfigured) {
      return { id: paymentMethodId };
    }
    return await this.stripe!.paymentMethods.detach(paymentMethodId);
  }
}

import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../lib/supabase';
import { StripeService } from '../lib/stripe';

export interface CreateOrderRequest {
  restaurant_id: string;
  items: Array<{
    menu_item_id: string;
    name: string;
    quantity: number;
    unit_price: number;
    options_price?: number;
    options?: unknown;
    special_instructions?: string;
  }>;
  delivery_address: {
    formatted: string;
    placeId: string;
    streetAddress: string;
    city: string;
    postalCode: string;
    coordinates: { lat: number; lng: number };
  };
  delivery_instructions?: string;
  tips?: number;
  customer_notes?: string;
  wallet_amount_to_apply?: number;
  promo_code?: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  restaurant_id: string;
  delivery_address: unknown;
  delivery_instructions: string | null;
  subtotal: number;
  delivery_fee: number;
  service_fee: number;
  promo_discount: number;
  wallet_credit_used: number;
  total: number;
  cashback_rate: number;
  cashback_amount: number;
  status: string;
  payment_method: string | null;
  payment_status: string;
  stripe_payment_intent_id: string | null;
  estimated_delivery_at: string;
  created_at: string;
}

export interface CreateOrderResponse extends Order {
  client_secret: string;
  payment_intent_id: string;
}

@Injectable()
export class OrdersService {
  constructor(
    private supabaseService: SupabaseService,
    private stripeService: StripeService,
  ) {}

  /**
   * Create an order from cart
   * Calculates totals, fees, creates order in database, and initializes Stripe payment
   *
   * Returns client_secret for frontend Payment Sheet
   */
  async createOrder(
    userId: string,
    userEmail: string,
    request: CreateOrderRequest,
  ): Promise<CreateOrderResponse> {
    const supabase = this.supabaseService.getAdmin();

    // Validate restaurant exists
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { data: restaurant, error: restaurantError } = await supabase
      .from('restaurants')
      .select('id, delivery_fee, commission_rate, stripe_account_id')
      .eq('id', request.restaurant_id)
      .single();

    if (restaurantError || !restaurant) {
      throw new Error('Restaurant not found');
    }

    // Validate restaurant has Stripe account for payments
    const stripeAccountId = (restaurant as Record<string, unknown>).stripe_account_id as string;
    if (!stripeAccountId) {
      throw new Error('Restaurant does not have Stripe account configured');
    }

    // Calculate order totals
    const subtotal = request.items.reduce((sum, item) => {
      return (
        sum + (item.unit_price + (item.options_price || 0)) * item.quantity
      );
    }, 0);

    // Platform fee: 5% commission + 2% service fee = 7%
    // (commission is separate for Stripe transfer, service fee is charged to customer)

    // Delivery fee (from restaurant settings)
    const deliveryFee =
      ((restaurant as Record<string, unknown>).delivery_fee as number) || 0;

    // Service fee (2% of subtotal, already in platformFee calculation)
    const serviceFee = Math.round(subtotal * 0.02 * 100) / 100;

    // Cashback: 10% of subtotal
    const cashbackRate = 10.0;
    const cashbackAmount =
      Math.round(subtotal * (cashbackRate / 100) * 100) / 100;

    // Apply wallet credit
    const walletAmountToApply = request.wallet_amount_to_apply || 0;
    const walletCreditUsed = Math.min(
      walletAmountToApply,
      subtotal + deliveryFee,
    );

    // Total: subtotal + delivery + service fee (2%) - wallet credit
    // Note: commission is separate (transferred to restaurant)
    const total = subtotal + deliveryFee + serviceFee - walletCreditUsed;

    // Create order in database
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        restaurant_id: request.restaurant_id,
        delivery_address: request.delivery_address,
        delivery_instructions: request.delivery_instructions || null,
        subtotal: subtotal,
        delivery_fee: deliveryFee,
        service_fee: serviceFee,
        wallet_credit_used: walletCreditUsed,
        total: total,
        cashback_rate: cashbackRate,
        cashback_amount: cashbackAmount,
        status: 'pending',
        payment_status: 'pending',
        estimated_delivery_at: this.calculateEstimatedDelivery(),
      })
      .select()
      .single();

    if (error || !order) {
      console.error('Order creation error:', error);
      throw new Error(
        `Failed to create order: ${error?.message || 'Unknown error'}`,
      );
    }

    // Insert order items
    const orderId = (order as Record<string, unknown>).id as string;
    const orderItems = request.items.map((item) => ({
      order_id: orderId,
      menu_item_id: item.menu_item_id,
      name: item.name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      options_price: item.options_price || 0,
      total_price:
        (item.unit_price + (item.options_price || 0)) * item.quantity,
      options: item.options || null,
      special_instructions: item.special_instructions || null,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Order items creation error:', itemsError);
      throw new Error(`Failed to create order items: ${itemsError.message}`);
    }

    // Create Stripe PaymentIntent for this order
    // Amount in cents (total price + service fee, excluding wallet credit)
    const amountCents = Math.round(total * 100);
    const orderNumber = (order as Record<string, unknown>).order_number as string;

    let paymentIntentId: string;
    let clientSecret: string;

    try {
      // Get or create Stripe customer for user
      const stripeCustomerId = await this.stripeService.getOrCreateCustomer(
        userId,
        userEmail,
      );

      // Update user profile with Stripe customer ID
      await supabase
        .from('user_profiles')
        .update({ stripe_customer_id: stripeCustomerId })
        .eq('id', userId);

      // Create PaymentIntent with restaurant transfer
      const paymentData = await this.stripeService.createPaymentIntent(
        orderId,
        userId,
        stripeAccountId,
        amountCents,
        `Order ${orderNumber} from TurkEats`,
      );

      clientSecret = paymentData.client_secret;
      paymentIntentId = paymentData.payment_intent_id;

      // Update order with Stripe payment intent ID
      await supabase
        .from('orders')
        .update({ stripe_payment_intent_id: paymentIntentId })
        .eq('id', orderId);
    } catch (stripeError) {
      console.error('Stripe payment setup error:', stripeError);
      throw new Error(
        stripeError instanceof Error
          ? `Payment setup failed: ${stripeError.message}`
          : 'Failed to setup payment',
      );
    }

    const orderData = order as Record<string, unknown>;
    return {
      id: orderData.id as string,
      order_number: orderData.order_number as string,
      user_id: orderData.user_id as string,
      restaurant_id: orderData.restaurant_id as string,
      delivery_address: orderData.delivery_address,
      delivery_instructions: orderData.delivery_instructions as string | null,
      subtotal: orderData.subtotal as number,
      delivery_fee: orderData.delivery_fee as number,
      service_fee: orderData.service_fee as number,
      promo_discount: orderData.promo_discount as number,
      wallet_credit_used: orderData.wallet_credit_used as number,
      total: orderData.total as number,
      cashback_rate: orderData.cashback_rate as number,
      cashback_amount: orderData.cashback_amount as number,
      status: orderData.status as string,
      payment_method: orderData.payment_method as string | null,
      payment_status: orderData.payment_status as string,
      stripe_payment_intent_id: paymentIntentId,
      estimated_delivery_at: orderData.estimated_delivery_at as string,
      created_at: orderData.created_at as string,
      client_secret: clientSecret,
      payment_intent_id: paymentIntentId,
    };
  }

  /**
   * Get order by ID
   */
  async getOrder(orderId: string, userId: string): Promise<Order> {
    const supabase = this.supabaseService.getAdmin();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('user_id', userId)
      .single();

    if (error || !order) {
      throw new Error('Order not found');
    }

    return order as Order;
  }

  /**
   * Calculate estimated delivery time
   * Default: 30-45 minutes from now
   */
  private calculateEstimatedDelivery(): string {
    const now = new Date();
    const deliveryTime = new Date(now.getTime() + 35 * 60000); // 35 minutes
    return deliveryTime.toISOString();
  }
}

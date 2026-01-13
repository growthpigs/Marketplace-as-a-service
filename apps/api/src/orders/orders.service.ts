import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../lib/supabase';

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

@Injectable()
export class OrdersService {
  constructor(private supabaseService: SupabaseService) {}

  /**
   * Create an order from cart
   * Calculates totals, fees, and creates order in database
   *
   * Current state: Creates order without payment processing
   * Next: Task 1.3 will add Stripe PaymentIntent creation
   */
  async createOrder(
    userId: string,
    request: CreateOrderRequest,
  ): Promise<Order> {
    const supabase = this.supabaseService.getAdmin();

    // Validate restaurant exists
    const { data: restaurant, error: restaurantError } = await supabase
      .from('restaurants')
      .select('id, delivery_fee, commission_rate')
      .eq('id', request.restaurant_id)
      .single();

    if (restaurantError || !restaurant) {
      throw new Error('Restaurant not found');
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

    return order as Order;
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

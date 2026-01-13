import {
  Controller,
  Post,
  Body,
  BadRequestException,
  UnauthorizedException,
  Headers,
} from '@nestjs/common';
import type { CreateOrderRequest, CreateOrderResponse } from './orders.service';
import { OrdersService } from './orders.service';
import { SupabaseService } from '../lib/supabase';

@Controller('orders')
export class OrdersController {
  constructor(
    private ordersService: OrdersService,
    private supabaseService: SupabaseService,
  ) {}

  /**
   * POST /api/orders
   * Create a new order from cart items
   *
   * Request body:
   * {
   *   restaurant_id: string,
   *   items: [{ menu_item_id, name, quantity, unit_price, options_price?, ... }],
   *   delivery_address: { formatted, placeId, streetAddress, city, postalCode, coordinates },
   *   delivery_instructions?: string,
   *   tips?: number,
   *   customer_notes?: string,
   *   wallet_amount_to_apply?: number,
   *   promo_code?: string
   * }
   *
   * Response (201):
   * {
   *   id: string,
   *   order_number: "TK-2026-000001",
   *   user_id: string,
   *   restaurant_id: string,
   *   subtotal: number,
   *   delivery_fee: number,
   *   service_fee: number,
   *   total: number,
   *   status: "pending",
   *   estimated_delivery_at: ISO8601,
   *   client_secret: string (for Stripe payment sheet - added in Task 1.3)
   * }
   */
  @Post()
  async createOrder(
    @Body() request: CreateOrderRequest,
    @Headers('authorization') authHeader: string,
  ) {
    // Verify authorization header
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Missing or invalid authorization header',
      );
    }

    const token = authHeader.substring(7);

    // Verify user with Supabase
    let user;
    try {
      user = await this.supabaseService.verifyUser(token);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    // SECURITY: Validate user_id in request matches authenticated user
    if (!request.user_id) {
      throw new BadRequestException('user_id is required in request body');
    }
    if (request.user_id !== user.id) {
      throw new UnauthorizedException(
        `User mismatch: request claims ${request.user_id}, token claims ${user.id}`,
      );
    }

    // Validate request
    if (!request.restaurant_id) {
      throw new BadRequestException('restaurant_id is required');
    }

    if (!request.items || request.items.length === 0) {
      throw new BadRequestException(
        'items array is required and cannot be empty',
      );
    }

    if (!request.delivery_address) {
      throw new BadRequestException('delivery_address is required');
    }

    // Validate each item
    for (const item of request.items) {
      if (
        !item.menu_item_id ||
        !item.name ||
        !item.quantity ||
        item.unit_price === undefined
      ) {
        throw new BadRequestException(
          'Each item must have menu_item_id, name, quantity, and unit_price',
        );
      }
    }

    // Create order
    let orderResponse: CreateOrderResponse;
    try {
      orderResponse = await this.ordersService.createOrder(
        user.id,
        user.email || '',
        request,
      );
    } catch (error) {
      console.error('Order creation failed:', error);
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Failed to create order',
      );
    }

    // Response includes order details and payment setup
    return {
      id: orderResponse.id,
      order_number: orderResponse.order_number,
      user_id: orderResponse.user_id,
      restaurant_id: orderResponse.restaurant_id,
      subtotal: orderResponse.subtotal,
      delivery_fee: orderResponse.delivery_fee,
      service_fee: orderResponse.service_fee,
      wallet_credit_used: orderResponse.wallet_credit_used,
      total: orderResponse.total,
      status: orderResponse.status,
      payment_status: orderResponse.payment_status,
      estimated_delivery_at: orderResponse.estimated_delivery_at,
      created_at: orderResponse.created_at,
      client_secret: orderResponse.client_secret,
      payment_intent_id: orderResponse.payment_intent_id,
    };
  }
}

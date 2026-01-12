import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side client for API routes (with service role key)
export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}

// Types for restaurant dashboard operations
export type RestaurantOrder = {
  id: string;
  order_number: string;
  customer_name: string;
  items: OrderItem[];
  subtotal: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled';
  placed_at: string;
  delivery_address: {
    street: string;
    city: string;
    postal_code: string;
    instructions?: string;
  };
};

export type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  unit_price: number;
  options?: Record<string, string[]>;
  special_instructions?: string;
};

export type MenuItem = {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
  is_popular: boolean;
};

export type RestaurantSettings = {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  delivery_fee: number;
  minimum_order: number;
  delivery_radius_km: number;
  opening_hours: Record<string, { open: string; close: string; is_closed: boolean }>;
};

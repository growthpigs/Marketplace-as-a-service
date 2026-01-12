import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// Custom storage adapter using Expo SecureStore
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key);
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Types for database operations
export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          phone: string | null;
          display_name: string | null;
          email: string | null;
          avatar_url: string | null;
          referral_code: string;
          referred_by: string | null;
          wallet_balance: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['user_profiles']['Row'], 'id' | 'referral_code' | 'wallet_balance' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['user_profiles']['Insert']>;
      };
      restaurants: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          address: string;
          phone: string | null;
          rating: number;
          review_count: number;
          delivery_fee: number;
          minimum_order: number;
          delivery_time_min: number;
          delivery_time_max: number;
          status: string;
          created_at: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          user_id: string;
          restaurant_id: string;
          status: string;
          subtotal: number;
          delivery_fee: number;
          service_fee: number;
          total: number;
          created_at: string;
        };
      };
    };
  };
};

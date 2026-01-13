import { createClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

// Standalone client for quick usage (lazy initialization via function)
// Use SupabaseService for NestJS dependency injection instead
export function getSupabaseAdmin(): ReturnType<typeof createClient> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase configuration not available (SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing)');
  }
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Injectable service for NestJS
@Injectable()
export class SupabaseService {
  private client;

  constructor(private configService: ConfigService) {
    this.client = createClient(
      this.configService.get<string>('SUPABASE_URL')!,
      this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY')!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );
  }

  // Get the admin client (bypasses RLS)
  getAdmin() {
    return this.client;
  }

  // Create a client scoped to a specific user (respects RLS)
  getClientForUser(accessToken: string) {
    return createClient(
      this.configService.get<string>('SUPABASE_URL')!,
      this.configService.get<string>('SUPABASE_ANON_KEY')!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      },
    );
  }

  // Verify JWT and get user
  // For MVP with mock tokens: returns mock user data
  async verifyUser(accessToken: string) {
    // MVP mode: support mock token for development
    if (accessToken === 'mock-jwt-token-placeholder') {
      return {
        id: 'mock-user-id',
        email: 'mock@example.com',
        user_metadata: {},
      };
    }

    // Production: verify real JWT token with Supabase
    const { data, error } = await this.client.auth.getUser(accessToken);
    if (error) throw error;
    return data.user;
  }
}

// Module for NestJS DI
import { Module, Global } from '@nestjs/common';

@Global()
@Module({
  providers: [SupabaseService],
  exports: [SupabaseService],
})
export class SupabaseModule {}

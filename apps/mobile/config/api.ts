/**
 * API Configuration - Single source of truth for API settings
 *
 * ARCHITECTURE STANDARD: No hardcoded URLs or tokens
 * All values come from environment variables.
 */

// API Base URL - REQUIRED in production, optional in demo mode
export const getApiUrl = (): string | null => {
  const url = process.env.EXPO_PUBLIC_API_URL;

  if (!url) {
    // Demo mode - no API available
    console.log('[API Config] No EXPO_PUBLIC_API_URL set - running in demo mode');
    return null;
  }

  return url;
};

// Check if we're in demo mode (no backend)
export const isDemoMode = (): boolean => {
  const env = process.env.EXPO_PUBLIC_ENV;
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  return env === 'demo' || env === 'development' || !apiUrl;
};

// Auth token - MVP uses placeholder, production uses secure storage
// TODO: Replace with real auth (Supabase Auth, AsyncStorage for tokens)
export const getAuthToken = (): string => {
  // In production, this should come from secure storage after login
  // For MVP demo, we use a placeholder that the backend recognizes
  const storedToken = null; // TODO: AsyncStorage.getItem('auth_token')

  if (storedToken) {
    return storedToken;
  }

  // MVP placeholder - backend accepts this for demo purposes
  // This MUST be removed before production launch
  if (isDemoMode()) {
    return 'mock-jwt-token-placeholder';
  }

  // Production without token = not authenticated
  throw new Error('Authentication required. Please log in.');
};

// Standard fetch wrapper with auth
export const apiFetch = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const apiUrl = getApiUrl();

  if (!apiUrl) {
    throw new Error('API not configured. Running in demo mode.');
  }

  const token = getAuthToken();

  return fetch(`${apiUrl}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });
};

// Export config summary for debugging
export const getConfigSummary = () => ({
  apiUrl: getApiUrl(),
  isDemoMode: isDemoMode(),
  env: process.env.EXPO_PUBLIC_ENV || 'not set',
});

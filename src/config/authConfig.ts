export interface AuthConfig {
  provider: 'supabase' | 'auth0' | 'custom';
  // Auth0 config
  auth0Domain?: string;
  auth0ClientId?: string;
  // Supabase config
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  // Custom config
  customApiUrl?: string;
}

export const getAuthConfig = (): AuthConfig => {
  return {
    provider: 'supabase',
    // Auth0
    auth0Domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN,
    auth0ClientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
    // Supabase
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    // Custom
    customApiUrl: process.env.NEXT_PUBLIC_CUSTOM_AUTH_API_URL,
  };
};
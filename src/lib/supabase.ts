import { createClient } from '@supabase/supabase-js';

// Validate required environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    url: !supabaseUrl ? 'NEXT_PUBLIC_SUPABASE_URL' : null,
    key: !supabaseAnonKey ? 'NEXT_PUBLIC_SUPABASE_ANON_KEY' : null,
  });
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Missing required Supabase environment variables');
  }
}

// Initialize Supabase client
// Default to local Supabase CLI ports (use supabase start to get actual keys)
export const supabase = createClient(
  supabaseUrl || 'http://localhost:54321',
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      // Clear session if user doesn't exist
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    },
  }
);

// Helper function to clear invalid sessions
export async function clearInvalidSession() {
  try {
    await supabase.auth.signOut();
    if (typeof window !== 'undefined') {
      // Clear any cached auth data
      localStorage.removeItem('sb-' + (supabaseUrl || 'localhost') + '-auth-token');
    }
  } catch (error) {
    console.error('Error clearing invalid session:', error);
  }
}


import { useState, useEffect, useMemo } from 'react';
import { AuthService, AuthUser } from '../services/authService';
import { SupabaseProfileService, Profile } from '../services/supabaseProfileService';

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial user
    const initializeAuth = async () => {
      try {
        // Initialize the auth provider first
        await AuthService.initializeProvider();
        
        const currentUser = await AuthService.getCurrentUser();
        setUser(currentUser);
        
        if (currentUser) {
          try {
            const profile = await SupabaseProfileService.getOrCreateProfile(
              currentUser.id, 
              currentUser.email || '', 
              currentUser.displayName || ''
            );
            setUserProfile(profile);
          } catch (error) {
            console.error("Failed to get or create user profile:", error);
          }
        } else {
          setUserProfile(null);
        }
      } catch (error: any) {
        console.error("Failed to initialize auth:", error);
        
        // If user doesn't exist error, clear the session
        if (error?.message?.includes('does not exist') || error?.message?.includes('JWT')) {
          console.warn('Invalid session detected, clearing...');
          try {
            const { clearInvalidSession } = await import('../lib/supabase');
            await clearInvalidSession();
          } catch (clearError) {
            console.error('Error clearing session:', clearError);
          }
        }
        
        // Set loading to false even on error so UI can render
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes (after provider is initialized)
    let unsubscribe: (() => void) | null = null;
    
    const setupAuthListener = async () => {
      try {
        // Ensure provider is initialized
        await AuthService.initializeProvider();
        
        // Now set up the listener
        unsubscribe = AuthService.onAuthStateChange(async (user) => {
      setUser(user);
      
      if (user) {
        try {
          const profile = await SupabaseProfileService.getOrCreateProfile(
            user.id, 
            user.email || '', 
            user.displayName || ''
          );
          setUserProfile(profile);
        } catch (error) {
          console.error("Failed to update user profile on auth change:", error);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });
      } catch (error) {
        console.error("Failed to set up auth state listener:", error);
      }
    };

    setupAuthListener();

    return () => {
      if (unsubscribe) {
      unsubscribe();
      }
    };
  }, []);

  return useMemo(() => ({
    user,
    userProfile,
    loading,
    isAuthenticated: !!user
  }), [user, userProfile, loading]);
};
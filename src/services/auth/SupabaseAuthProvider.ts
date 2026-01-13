import { supabase } from '../../lib/supabase';
import { 
  AuthProvider, 
  AuthUser, 
  SignUpData, 
  SignInData, 
  PasswordChangeData, 
  ProfileUpdateData,
  PasswordResetData
} from '../authService';

export class SupabaseAuthProvider implements AuthProvider {
  private convertUser(user: any): AuthUser {
    return {
      id: user.id,
      email: user.email,
      displayName: user.user_metadata?.full_name || user.user_metadata?.display_name || null,
      phoneNumber: user.phone || null,
      emailVerified: user.email_confirmed_at !== null,
    };
  }

  async signUp(data: SignUpData): Promise<AuthUser> {
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName || '',
            phone: data.phone || '',
          },
        },
      });

      if (error) {
        throw new Error(error.message || 'Failed to create account');
      }

      if (!authData.user) {
        throw new Error('Failed to create account');
      }

      // Store additional user data in the users table
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('users')
          .upsert({
            id: authData.user.id,
            email: data.email,
            full_name: data.fullName || '',
            phone: data.phone || '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }, { onConflict: 'id' });

        if (profileError) {
          console.error('Failed to create user profile:', profileError);
        }
      }

      return this.convertUser(authData.user);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create account');
    }
  }

  async signIn(data: SignInData): Promise<AuthUser> {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        throw new Error(error.message || 'Failed to sign in');
      }

      if (!authData.user) {
        throw new Error('Failed to sign in');
      }

      return this.convertUser(authData.user);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign in');
    }
  }

  async signOut(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new Error(error.message || 'Failed to sign out');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign out');
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('Error getting current user:', error);
        
        // If user doesn't exist in auth.users, clear the session
        if (error.message?.includes('does not exist') || error.message?.includes('JWT')) {
          console.warn('User from JWT does not exist, clearing session...');
          await supabase.auth.signOut();
        }
        
        return null;
      }

      return user ? this.convertUser(user) : null;
    } catch (error: any) {
      console.error('Error getting current user:', error);
      
      // If user doesn't exist, clear the session
      if (error?.message?.includes('does not exist') || error?.message?.includes('JWT')) {
        console.warn('User from JWT does not exist, clearing session...');
        try {
          await supabase.auth.signOut();
        } catch (signOutError) {
          console.error('Error signing out:', signOutError);
        }
      }
      
      return null;
    }
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw new Error(error.message || 'Failed to send password reset email');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to send password reset email');
    }
  }

  async sendPasswordResetSMS(phoneNumber: string): Promise<void> {
    // Supabase supports SMS OTP, but requires phone auth setup
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: phoneNumber,
      });

      if (error) {
        throw new Error(error.message || 'Failed to send password reset SMS');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to send password reset SMS');
    }
  }

  async sendPasswordReset(data: PasswordResetData): Promise<void> {
    if (data.method === 'email' && data.email) {
      return this.sendPasswordResetEmail(data.email);
    } else if (data.method === 'sms' && data.phoneNumber) {
      return this.sendPasswordResetSMS(data.phoneNumber);
    } else {
      throw new Error('Invalid password reset data');
    }
  }

  async verifyPasswordResetCode(code: string, identifier: string): Promise<boolean> {
    // For Supabase, password reset is handled via email links
    // For SMS OTP, you would verify the code here
    try {
      // This is a placeholder - actual implementation depends on your flow
      const { data, error } = await supabase.auth.verifyOtp({
        phone: identifier,
        token: code,
        type: 'sms',
      });

      return !error && !!data;
    } catch (error) {
      return false;
    }
  }

  async changePassword(data: PasswordChangeData): Promise<void> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword,
      });

      if (error) {
        throw new Error(error.message || 'Failed to update password');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update password');
    }
  }

  async updateProfile(updates: ProfileUpdateData): Promise<AuthUser> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('No user is signed in');
      }

      // Update Supabase Auth metadata
      const metadata: any = {};
      if (updates.displayName) {
        metadata.full_name = updates.displayName;
        metadata.display_name = updates.displayName;
      }
      if (updates.phone) {
        metadata.phone = updates.phone;
      }

      const { error: authError } = await supabase.auth.updateUser({
        data: metadata,
      });

      if (authError) {
        throw new Error(authError.message || 'Failed to update profile');
      }

      // Update users table
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      if (updates.phone) updateData.phone = updates.phone;
      if (updates.displayName) updateData.full_name = updates.displayName;

      const { error: profileError } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', user.id);

      if (profileError) {
        console.error('Failed to update user profile:', profileError);
      }

      // Get updated user
      const { data: { user: updatedUser } } = await supabase.auth.getUser();
      if (!updatedUser) {
        throw new Error('Failed to get updated user');
      }

      return this.convertUser(updatedUser);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update profile');
    }
  }

  onAuthStateChange(callback: (user: AuthUser | null) => void): () => void {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Handle token refresh and user validation
      if (event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN') {
        // Verify the user still exists
        if (session?.user) {
          try {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error || !user) {
              console.warn('User validation failed, clearing session');
              await supabase.auth.signOut();
              callback(null);
              return;
            }
            callback(this.convertUser(user));
          } catch (error: any) {
            console.error('Error validating user:', error);
            if (error?.message?.includes('does not exist') || error?.message?.includes('JWT')) {
              await supabase.auth.signOut();
              callback(null);
              return;
            }
            callback(session?.user ? this.convertUser(session.user) : null);
          }
        } else {
          callback(null);
        }
      } else if (event === 'SIGNED_OUT') {
        callback(null);
      } else {
      callback(session?.user ? this.convertUser(session.user) : null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }

  async sendEmailVerification(): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('No user is signed in');
      }

      // Supabase sends verification email automatically on signup
      // To resend, we can trigger a password reset or use a custom flow
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email!,
      });

      if (error) {
        throw new Error(error.message || 'Failed to send email verification');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to send email verification');
    }
  }

  async verifyEmail(token: string): Promise<void> {
    // Supabase handles email verification through links, not tokens
    // This would typically be handled by the email link callback
    throw new Error('Email verification with token not implemented for Supabase provider');
  }
}


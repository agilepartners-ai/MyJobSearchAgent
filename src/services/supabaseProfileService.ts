import { supabase } from '../lib/supabase';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  location?: string;
  bio?: string;
  skills?: string[];
  resume_url?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  created_at?: string;
}

export class SupabaseProfileService {
  static async getOrCreateProfile(
    uid: string,
    email: string,
    fullName: string
  ): Promise<Profile> {
    try {
      // Try to get existing profile
      const { data: existingProfile, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', uid)
        .single();

      if (existingProfile && !fetchError) {
        return { ...existingProfile, id: uid } as Profile;
      }

      // Create new profile if it doesn't exist
      const newProfile: Profile = {
        id: uid,
        email,
        full_name: fullName,
        created_at: new Date().toISOString(),
      };

      const { error: insertError } = await supabase
        .from('users')
        .insert(newProfile);

      if (insertError) {
        console.error('Failed to create profile:', insertError);
        // Return the profile object anyway for development
        return newProfile;
      }

      return newProfile;
    } catch (error) {
      console.error('Error in getOrCreateProfile:', error);
      // Return a mock profile for development
      return {
        id: uid,
        email,
        full_name: fullName,
        created_at: new Date().toISOString(),
      };
    }
  }
}


import { SupabaseDBService } from './supabaseDBService';

export interface JobPreferences {
  id: string;
  job_titles?: string[];
  locations?: string[];
  salary_expectation?: number | null;
  employment_types?: string[];
  remote_only?: boolean;
  skills?: string[];
  updated_at?: string;
}

export class SupabaseJobPreferencesService {
  private static basePath(userId: string) {
    return `jobPreferences/${userId}`;
  }

  static async getUserJobPreferences(userId: string): Promise<JobPreferences | null> {
    return SupabaseDBService.read<JobPreferences>(this.basePath(userId));
  }

  static async saveJobPreferences(userId: string, preferences: Omit<JobPreferences, 'id' | 'updated_at'>): Promise<void> {
    const fullPreferences = {
      ...preferences,
      id: userId,
      updated_at: new Date().toISOString(),
    };
    return SupabaseDBService.set(this.basePath(userId), fullPreferences);
  }

  static async deleteJobPreferences(userId: string): Promise<void> {
    return SupabaseDBService.delete(this.basePath(userId));
  }
}


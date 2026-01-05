import { SupabaseDBService } from './supabaseDBService';

export interface WorkExperience {
  id: string;
  job_title: string;
  company: string;
  duration: string;
  description?: string;
  created_at: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  graduation_year: string;
  description?: string;
  created_at: string;
}

export class SupabaseProfileExtrasService {
  // Work Experience Methods
  private static workExperiencePath(userId: string) {
    return `users/${userId}/workExperience`;
  }

  static async getWorkExperience(userId: string): Promise<WorkExperience[]> {
    return SupabaseDBService.getList<WorkExperience>(this.workExperiencePath(userId));
  }

  static async addWorkExperience(userId: string, experience: Omit<WorkExperience, 'id' | 'created_at'>): Promise<string> {
    const fullExperience = { ...experience, created_at: new Date().toISOString() };
    return SupabaseDBService.create(this.workExperiencePath(userId), fullExperience);
  }

  static async updateWorkExperience(userId: string, experienceId: string, updates: Partial<WorkExperience>): Promise<void> {
    return SupabaseDBService.update(`${this.workExperiencePath(userId)}/${experienceId}`, updates);
  }

  static async deleteWorkExperience(userId: string, experienceId: string): Promise<void> {
    return SupabaseDBService.delete(`${this.workExperiencePath(userId)}/${experienceId}`);
  }

  // Education Methods
  private static educationPath(userId: string) {
    return `users/${userId}/education`;
  }

  static async getEducation(userId: string): Promise<Education[]> {
    return SupabaseDBService.getList<Education>(this.educationPath(userId));
  }

  static async addEducation(userId: string, education: Omit<Education, 'id' | 'created_at'>): Promise<string> {
    const fullEducation = { ...education, created_at: new Date().toISOString() };
    return SupabaseDBService.create(this.educationPath(userId), fullEducation);
  }

  static async updateEducation(userId: string, educationId: string, updates: Partial<Education>): Promise<void> {
    return SupabaseDBService.update(`${this.educationPath(userId)}/${educationId}`, updates);
  }

  static async deleteEducation(userId: string, educationId: string): Promise<void> {
    return SupabaseDBService.delete(`${this.educationPath(userId)}/${educationId}`);
  }
}


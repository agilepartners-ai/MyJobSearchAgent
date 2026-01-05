import { supabase } from '@/lib/supabase';
import { ResumeDocument, ResumeDocumentSummary } from '@/types/resumeDocument';

export class ResumeDocumentService {
  /**
   * Create a new resume document
   */
  static async createResume(
    userId: string,
    resumeData: Omit<ResumeDocument, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'version'>
  ): Promise<ResumeDocument> {
    try {
      // If this is set as active, ensure it's the only active one
      const resumeDocument: Partial<ResumeDocument> = {
        ...resumeData,
        user_id: userId,
        version: 1,
        is_active: resumeData.is_active ?? false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('resumes')
        .insert({
          user_id: userId,
          resume_data: resumeDocument,
          version: 1,
          is_active: resumeDocument.is_active,
          tags: resumeData.tags || [],
          notes: resumeData.notes || null,
        })
        .select()
        .single();

      if (error) throw error;

      return this.mapToResumeDocument(data);
    } catch (error) {
      console.error('Error creating resume document:', error);
      throw new Error(`Failed to create resume: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get a resume document by ID
   */
  static async getResumeById(resumeId: string, userId: string): Promise<ResumeDocument | null> {
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('id', resumeId)
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }

      return data ? this.mapToResumeDocument(data) : null;
    } catch (error) {
      console.error('Error getting resume document:', error);
      throw new Error(`Failed to get resume: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get all resumes for a user
   */
  static async getUserResumes(userId: string): Promise<ResumeDocumentSummary[]> {
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('id, user_id, version, is_active, resume_data, tags, created_at, updated_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map((row) => ({
        id: row.id,
        user_id: row.user_id,
        version: row.version,
        is_active: row.is_active,
        personal: {
          name: row.resume_data?.personal?.name || '',
          email: row.resume_data?.personal?.email || '',
        },
        created_at: row.created_at,
        updated_at: row.updated_at,
        tags: row.tags || [],
      }));
    } catch (error) {
      console.error('Error getting user resumes:', error);
      throw new Error(`Failed to get resumes: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get the active resume for a user
   */
  static async getActiveResume(userId: string): Promise<ResumeDocument | null> {
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }

      return data ? this.mapToResumeDocument(data) : null;
    } catch (error) {
      console.error('Error getting active resume:', error);
      throw new Error(`Failed to get active resume: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Update a resume document
   */
  static async updateResume(
    resumeId: string,
    userId: string,
    updates: Partial<ResumeDocument>
  ): Promise<ResumeDocument> {
    try {
      // Get current resume
      const currentResume = await this.getResumeById(resumeId, userId);
      if (!currentResume) {
        throw new Error('Resume not found');
      }

      // Merge updates with current resume data
      const updatedResume: ResumeDocument = {
        ...currentResume,
        ...updates,
        id: resumeId,
        user_id: userId,
        updated_at: new Date().toISOString(),
        version: updates.version || currentResume.version + 1,
      };

      const { data, error } = await supabase
        .from('resumes')
        .update({
          resume_data: updatedResume,
          version: updatedResume.version,
          is_active: updatedResume.is_active,
          tags: updatedResume.tags || [],
          notes: updatedResume.notes || null,
          updated_at: updatedResume.updated_at,
        })
        .eq('id', resumeId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      return this.mapToResumeDocument(data);
    } catch (error) {
      console.error('Error updating resume document:', error);
      throw new Error(`Failed to update resume: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Set a resume as active (deactivates others)
   */
  static async setActiveResume(resumeId: string, userId: string): Promise<ResumeDocument> {
    try {
      const { data, error } = await supabase
        .from('resumes')
        .update({ is_active: true })
        .eq('id', resumeId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      return this.mapToResumeDocument(data);
    } catch (error) {
      console.error('Error setting active resume:', error);
      throw new Error(`Failed to set active resume: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Delete a resume document
   */
  static async deleteResume(resumeId: string, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', resumeId)
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting resume document:', error);
      throw new Error(`Failed to delete resume: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Search resumes by content (using JSONB queries)
   */
  static async searchResumes(
    userId: string,
    query: string,
    tags?: string[]
  ): Promise<ResumeDocumentSummary[]> {
    try {
      let queryBuilder = supabase
        .from('resumes')
        .select('id, user_id, version, is_active, resume_data, tags, created_at, updated_at')
        .eq('user_id', userId);

      // Full-text search in resume_data JSONB
      if (query) {
        queryBuilder = queryBuilder.or(
          `resume_data->personal->>name.ilike.%${query}%,resume_data->personal->>email.ilike.%${query}%`
        );
      }

      // Filter by tags
      if (tags && tags.length > 0) {
        queryBuilder = queryBuilder.contains('tags', tags);
      }

      const { data, error } = await queryBuilder.order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map((row) => ({
        id: row.id,
        user_id: row.user_id,
        version: row.version,
        is_active: row.is_active,
        personal: {
          name: row.resume_data?.personal?.name || '',
          email: row.resume_data?.personal?.email || '',
        },
        created_at: row.created_at,
        updated_at: row.updated_at,
        tags: row.tags || [],
      }));
    } catch (error) {
      console.error('Error searching resumes:', error);
      throw new Error(`Failed to search resumes: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Map database row to ResumeDocument
   */
  private static mapToResumeDocument(row: any): ResumeDocument {
    return {
      ...row.resume_data,
      id: row.id,
      user_id: row.user_id,
      version: row.version,
      is_active: row.is_active,
      tags: row.tags || [],
      notes: row.notes || undefined,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  }

  /**
   * Convert extracted resume JSON to ResumeDocument format
   */
  static normalizeExtractedResume(
    extractedData: any,
    userId: string,
    fileReferences?: { original_file_url?: string; original_file_name?: string; extracted_text?: string }
  ): Omit<ResumeDocument, 'id' | 'created_at' | 'updated_at'> {
    return {
      user_id: userId,
      version: 1,
      is_active: false,
      personal: {
        name: extractedData.personal?.name || '',
        email: extractedData.personal?.email || '',
        phone: extractedData.personal?.phone || undefined,
        location: extractedData.personal?.location || undefined,
        linkedin: extractedData.personal?.linkedin || undefined,
        website: extractedData.personal?.website || undefined,
        summary: extractedData.personal?.summary || undefined,
        objective: extractedData.personal?.objective || undefined,
      },
      education: (extractedData.education || []).map((edu: any) => ({
        institution: edu.school || edu.institution || '',
        degree: edu.degree || '',
        field_of_study: edu.field || edu.major || undefined,
        gpa: edu.gpa || undefined,
        start_date: edu.start_date || undefined,
        end_date: edu.end_date || undefined,
        graduation_date: edu.end_date || undefined,
        location: edu.location || undefined,
        honors: edu.honors || [],
        relevant_coursework: edu.relevant_coursework || [],
        thesis: edu.thesis || undefined,
        activities: edu.activities || [],
      })),
      experience: (extractedData.experience || []).map((exp: any) => ({
        company: exp.company || '',
        position: exp.position || '',
        start_date: exp.start_date || '',
        end_date: exp.end_date || undefined,
        location: exp.location || undefined,
        is_current: exp.is_current || false,
        description: exp.description || undefined,
        highlights: exp.highlights || [],
        achievements: exp.achievements || [],
        technologies_used: exp.technologies || [],
      })),
      skills: {
        technical: extractedData.skills || [],
        soft: extractedData.soft_skills || [],
        languages: extractedData.languages || [],
        certifications: extractedData.certifications || [],
      },
      projects: extractedData.projects || [],
      awards: extractedData.awards || [],
      volunteer_work: extractedData.volunteer_work || [],
      publications: extractedData.publications || [],
      file_references: fileReferences,
    };
  }
}


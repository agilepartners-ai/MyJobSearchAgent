/**
 * Resume Document Schema - JSON Document Structure
 * Each resume is stored as a complete JSON document object
 */
export interface ResumeDocument {
  // Document metadata
  id: string; // UUID
  user_id: string; // UUID - references auth.users
  version: number; // Version number for tracking changes
  is_active: boolean; // Whether this is the active resume
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  
  // Personal Information
  personal: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zip_code?: string;
      country?: string;
    };
    linkedin?: string;
    website?: string;
    portfolio?: string;
    github?: string;
    summary?: string; // Professional summary
    objective?: string;
  };

  // Education
  education: Array<{
    id?: string;
    institution: string;
    degree: string;
    field_of_study?: string;
    gpa?: string;
    start_date?: string;
    end_date?: string;
    graduation_date?: string;
    location?: string;
    honors?: string[];
    relevant_coursework?: string[];
    thesis?: string;
    activities?: string[];
    is_current?: boolean;
  }>;

  // Work Experience
  experience: Array<{
    id?: string;
    company: string;
    position: string;
    start_date: string;
    end_date?: string;
    location?: string;
    is_current?: boolean;
    description?: string;
    highlights?: string[];
    achievements?: string[];
    technologies_used?: string[];
    quantified_results?: string[];
    key_responsibilities?: string[];
  }>;

  // Skills
  skills: {
    technical?: string[];
    soft?: string[];
    languages?: Array<{
      name: string;
      proficiency: 'Basic' | 'Intermediate' | 'Advanced' | 'Native' | 'Fluent';
    }>;
    certifications?: Array<{
      name: string;
      issuing_organization: string;
      issue_date: string;
      expiration_date?: string;
      credential_id?: string;
      credential_url?: string;
    }>;
  };

  // Projects
  projects?: Array<{
    id?: string;
    name: string;
    description: string;
    url?: string;
    technologies: string[];
    achievements?: string[];
    duration?: string;
    team_size?: string;
    role?: string;
    start_date?: string;
    end_date?: string;
  }>;

  // Awards & Recognition
  awards?: Array<{
    id?: string;
    title: string;
    issuing_organization: string;
    date: string;
    description?: string;
  }>;

  // Volunteer Work
  volunteer_work?: Array<{
    id?: string;
    organization: string;
    role: string;
    duration: string;
    description?: string;
    achievements?: string[];
  }>;

  // Publications
  publications?: Array<{
    id?: string;
    title: string;
    publication: string;
    date: string;
    authors: string[];
    description?: string;
    url?: string;
  }>;

  // Additional Sections
  additional_sections?: Array<{
    id?: string;
    title: string;
    content: string | string[];
    type: 'text' | 'list' | 'timeline';
  }>;

  // AI Enhancement Metadata (when enhanced)
  ai_enhancement?: {
    enhanced_at?: string;
    job_description?: string;
    match_score?: number;
    model_used?: string;
    enhancements_applied?: string[];
  };

  // File References
  file_references?: {
    original_file_url?: string;
    original_file_name?: string;
    pdf_url?: string;
    extracted_text?: string;
  };

  // Tags and Organization
  tags?: string[];
  notes?: string;
}

/**
 * Resume Document Summary - Lightweight version for listings
 */
export interface ResumeDocumentSummary {
  id: string;
  user_id: string;
  version: number;
  is_active: boolean;
  personal: {
    name: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
  tags?: string[];
}


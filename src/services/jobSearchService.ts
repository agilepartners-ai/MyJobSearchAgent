// TypeScript Job Search Service
export interface JobSearchParams {
  jobProfile: string;
  experience: 'Fresher' | 'Experienced';
  location: string;
  numPages?: number;
}

export interface JobResult {
  job_title: string;
  employer_name: string;
  job_city?: string;
  job_state?: string;
  job_country?: string;
  job_is_remote?: boolean;
  job_apply_link?: string;
  job_employment_type?: string;
  job_posted_at_datetime_utc?: string;
  job_salary_currency?: string;
  job_min_salary?: number;
  job_max_salary?: number;
  job_salary_period?: string;
  job_experience_in_place_of_education?: boolean;
  job_description?: string;
  job_url?: string;
  location?: string;
}

export interface JobSearchResponse {
  message: string;
  jobs: JobResult[];
  search_criteria: {
    job_profile: string;
    experience: string;
    location: string;
  };
  success: boolean;
}

export class JobSearchService {
  private static readonly SUPABASE_FUNCTION_URL = '/functions/v1/job-search';
  
  static async searchJobs(params: JobSearchParams): Promise<JobSearchResponse> {
    try {

      // Get Supabase client for authenticated requests
      const { supabase } = await import('@/lib/supabase');
      const { data: { session } } = await supabase.auth.getSession();

      // Ensure we have a valid token
      const accessToken = session?.access_token || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      const apiKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!accessToken || !apiKey) {
        throw new Error('Authentication required. Please ensure NEXT_PUBLIC_SUPABASE_ANON_KEY is configured.');
      }

      // Call Supabase Edge Function
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}${this.SUPABASE_FUNCTION_URL}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'apikey': apiKey
          },
          body: JSON.stringify({
            jobProfile: params.jobProfile,
            experience: params.experience,
            location: params.location,
            numPages: params.numPages || 1
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Job search API error response:', errorText);
        throw new Error(`Job search API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      // Handle response from Supabase function (already formatted)
      if (data.success && Array.isArray(data.jobs)) {
        return data;
      }

      // Fallback for old format
      if (!data.jobs || !Array.isArray(data.jobs)) {
        console.warn('No jobs data found in response:', data);
        return {
          message: 'No jobs found',
          jobs: [],
          search_criteria: {
            job_profile: params.jobProfile,
            experience: params.experience,
            location: params.location
          },
          success: true
        };
      }

      return data;

    } catch (error) {
      console.error('Error searching jobs:', error);
      throw new Error(`Error searching jobs: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Helper method to validate job search parameters
  static validateSearchParams(params: JobSearchParams): { isValid: boolean; error?: string } {
    if (!params.jobProfile || params.jobProfile.trim().length === 0) {
      return { isValid: false, error: 'Job profile is required' };
    }

    if (!params.location || params.location.trim().length === 0) {
      return { isValid: false, error: 'Location is required' };
    }

    if (!['Fresher', 'Experienced'].includes(params.experience)) {
      return { isValid: false, error: 'Experience must be either "Fresher" or "Experienced"' };
    }

    return { isValid: true };
  }

  // Helper method to get popular job locations
  static getPopularLocations(): string[] {
    return [
      'New York, NY',
      'San Francisco, CA',
      'Chicago, IL',
      'Austin, TX',
      'Seattle, WA',
      'Boston, MA',
      'Denver, CO',
      'Atlanta, GA',
      'Los Angeles, CA',
      'Remote'
    ];
  }

  // Helper method to get common job profiles
  static getCommonJobProfiles(): string[] {
    return [
      'Software Developer',
      'Data Scientist',
      'Frontend Developer',
      'Backend Developer',
      'Full Stack Developer',
      'DevOps Engineer',
      'Product Manager',
      'UI/UX Designer',
      'Quality Assurance Engineer',
      'Machine Learning Engineer'
    ];
  }
}
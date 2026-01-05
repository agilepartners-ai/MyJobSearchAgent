/**
 * Education Class
 * Represents a single education entry in a resume
 */
export class Education {
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

  constructor(data: Partial<Education> = {}) {
    this.id = data.id;
    this.institution = data.institution || '';
    this.degree = data.degree || '';
    this.field_of_study = data.field_of_study;
    this.gpa = data.gpa;
    this.start_date = data.start_date;
    this.end_date = data.end_date;
    this.graduation_date = data.graduation_date || data.end_date;
    this.location = data.location;
    this.honors = data.honors || [];
    this.relevant_coursework = data.relevant_coursework || [];
    this.thesis = data.thesis;
    this.activities = data.activities || [];
    this.is_current = data.is_current || false;
  }

  /**
   * Get duration in a human-readable format
   */
  getDuration(): string {
    if (this.start_date && this.end_date) {
      return `${this.start_date} - ${this.end_date}`;
    }
    if (this.graduation_date) {
      return `Graduated: ${this.graduation_date}`;
    }
    return '';
  }

  /**
   * Get full degree name with field of study
   */
  getFullDegree(): string {
    if (this.field_of_study) {
      return `${this.degree} in ${this.field_of_study}`;
    }
    return this.degree;
  }

  /**
   * Validate the education object
   */
  validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.institution || this.institution.trim().length === 0) {
      errors.push('Institution name is required');
    }

    if (!this.degree || this.degree.trim().length === 0) {
      errors.push('Degree is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Convert to plain object for JSON serialization
   */
  toJSON(): Record<string, any> {
    return {
      id: this.id,
      institution: this.institution,
      degree: this.degree,
      field_of_study: this.field_of_study,
      gpa: this.gpa,
      start_date: this.start_date,
      end_date: this.end_date,
      graduation_date: this.graduation_date,
      location: this.location,
      honors: this.honors,
      relevant_coursework: this.relevant_coursework,
      thesis: this.thesis,
      activities: this.activities,
      is_current: this.is_current,
    };
  }

  /**
   * Create from plain object
   */
  static fromJSON(data: any): Education {
    return new Education(data);
  }
}


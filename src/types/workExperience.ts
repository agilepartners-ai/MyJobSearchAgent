/**
 * Work Experience Class
 * Represents a single work experience entry in a resume
 */
export class WorkExperience {
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

  constructor(data: Partial<WorkExperience> = {}) {
    this.id = data.id;
    this.company = data.company || '';
    this.position = data.position || '';
    this.start_date = data.start_date || '';
    this.end_date = data.end_date;
    this.location = data.location;
    this.is_current = data.is_current || false;
    this.description = data.description;
    this.highlights = data.highlights || [];
    this.achievements = data.achievements || [];
    this.technologies_used = data.technologies_used || [];
    this.quantified_results = data.quantified_results || [];
    this.key_responsibilities = data.key_responsibilities || [];
  }

  /**
   * Get duration in a human-readable format
   */
  getDuration(): string {
    if (this.is_current) {
      return `${this.start_date} - Present`;
    }
    if (this.end_date) {
      return `${this.start_date} - ${this.end_date}`;
    }
    return this.start_date;
  }

  /**
   * Validate the work experience object
   */
  validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.company || this.company.trim().length === 0) {
      errors.push('Company name is required');
    }

    if (!this.position || this.position.trim().length === 0) {
      errors.push('Position is required');
    }

    if (!this.start_date || this.start_date.trim().length === 0) {
      errors.push('Start date is required');
    }

    if (!this.is_current && !this.end_date) {
      errors.push('End date is required if not current position');
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
      company: this.company,
      position: this.position,
      start_date: this.start_date,
      end_date: this.end_date,
      location: this.location,
      is_current: this.is_current,
      description: this.description,
      highlights: this.highlights,
      achievements: this.achievements,
      technologies_used: this.technologies_used,
      quantified_results: this.quantified_results,
      key_responsibilities: this.key_responsibilities,
    };
  }

  /**
   * Create from plain object
   */
  static fromJSON(data: any): WorkExperience {
    return new WorkExperience(data);
  }
}


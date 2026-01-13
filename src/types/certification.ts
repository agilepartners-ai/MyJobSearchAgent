/**
 * Certification Class
 * Represents a single certification entry in a resume
 */
export class Certification {
  id?: string;
  name: string;
  issuing_organization: string;
  issue_date: string;
  expiration_date?: string;
  credential_id?: string;
  credential_url?: string;
  description?: string;

  constructor(data: Partial<Certification> = {}) {
    this.id = data.id;
    this.name = data.name || '';
    this.issuing_organization = data.issuing_organization || '';
    this.issue_date = data.issue_date || '';
    this.expiration_date = data.expiration_date;
    this.credential_id = data.credential_id;
    this.credential_url = data.credential_url;
    this.description = data.description;
  }

  /**
   * Check if certification is expired
   */
  isExpired(): boolean {
    if (!this.expiration_date) {
      return false; // No expiration date means it doesn't expire
    }
    const expiration = new Date(this.expiration_date);
    return expiration < new Date();
  }

  /**
   * Get validity period
   */
  getValidityPeriod(): string {
    if (!this.expiration_date) {
      return `Issued: ${this.issue_date} (No expiration)`;
    }
    return `${this.issue_date} - ${this.expiration_date}`;
  }

  /**
   * Get days until expiration (if applicable)
   */
  getDaysUntilExpiration(): number | null {
    if (!this.expiration_date) {
      return null;
    }
    const expiration = new Date(this.expiration_date);
    const today = new Date();
    const diffTime = expiration.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Validate the certification object
   */
  validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.name || this.name.trim().length === 0) {
      errors.push('Certification name is required');
    }

    if (!this.issuing_organization || this.issuing_organization.trim().length === 0) {
      errors.push('Issuing organization is required');
    }

    if (!this.issue_date || this.issue_date.trim().length === 0) {
      errors.push('Issue date is required');
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
      name: this.name,
      issuing_organization: this.issuing_organization,
      issue_date: this.issue_date,
      expiration_date: this.expiration_date,
      credential_id: this.credential_id,
      credential_url: this.credential_url,
      description: this.description,
    };
  }

  /**
   * Create from plain object
   */
  static fromJSON(data: any): Certification {
    return new Certification(data);
  }
}


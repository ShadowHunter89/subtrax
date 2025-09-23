/**
 * Input validation utilities for security and data integrity
 */

export const ValidationUtils = {
  /**
   * Validate email format
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  },

  /**
   * Validate password strength
   */
  isValidPassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  /**
   * Sanitize input to prevent XSS
   */
  sanitizeInput(input: string): string {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  },

  /**
   * Validate subscription name
   */
  isValidSubscriptionName(name: string): boolean {
    return name.length >= 1 && name.length <= 100 && /^[a-zA-Z0-9\s\-_]+$/.test(name);
  },

  /**
   * Validate currency amount
   */
  isValidAmount(amount: number): boolean {
    return Number.isFinite(amount) && amount >= 0 && amount <= 999999.99;
  },

  /**
   * Validate URL format
   */
  isValidURL(url: string): boolean {
    try {
      const urlObject = new URL(url);
      return urlObject.protocol === 'http:' || urlObject.protocol === 'https:';
    } catch {
      return false;
    }
  },

  /**
   * Validate phone number (basic international format)
   */
  isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,15}$/;
    return phoneRegex.test(phone);
  },

  /**
   * Validate date format and range
   */
  isValidDate(date: string | Date): boolean {
    const dateObj = new Date(date);
    return dateObj instanceof Date && !isNaN(dateObj.getTime());
  },

  /**
   * Check for SQL injection patterns
   */
  hasSQLInjection(input: string): boolean {
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
      /(--|\/\*|\*\/|;)/,
      /(\b(OR|AND)\b.*=.*)/i
    ];
    
    return sqlPatterns.some(pattern => pattern.test(input));
  },

  /**
   * Check for script injection patterns
   */
  hasScriptInjection(input: string): boolean {
    const scriptPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/i,
      /on\w+\s*=/i,
      /<iframe/i,
      /<object/i,
      /<embed/i
    ];
    
    return scriptPatterns.some(pattern => pattern.test(input));
  },

  /**
   * Comprehensive input validation
   */
  validateInput(input: string, type: 'email' | 'password' | 'text' | 'url' | 'phone'): {
    isValid: boolean;
    sanitized: string;
    errors: string[];
  } {
    const errors: string[] = [];
    
    // Check for malicious patterns
    if (this.hasSQLInjection(input)) {
      errors.push('Input contains potentially malicious SQL patterns');
    }
    
    if (this.hasScriptInjection(input)) {
      errors.push('Input contains potentially malicious script patterns');
    }
    
    // Sanitize input
    const sanitized = this.sanitizeInput(input);
    
    // Type-specific validation
    switch (type) {
      case 'email':
        if (!this.isValidEmail(sanitized)) {
          errors.push('Invalid email format');
        }
        break;
      case 'password':
        const passwordValidation = this.isValidPassword(input); // Don't sanitize passwords
        if (!passwordValidation.isValid) {
          errors.push(...passwordValidation.errors);
        }
        break;
      case 'url':
        if (!this.isValidURL(sanitized)) {
          errors.push('Invalid URL format');
        }
        break;
      case 'phone':
        if (!this.isValidPhoneNumber(sanitized)) {
          errors.push('Invalid phone number format');
        }
        break;
      case 'text':
        if (sanitized.length === 0) {
          errors.push('Input cannot be empty');
        }
        break;
    }
    
    return {
      isValid: errors.length === 0,
      sanitized: type === 'password' ? input : sanitized,
      errors
    };
  }
};

export default ValidationUtils;
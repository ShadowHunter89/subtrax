/**
 * Environment Variables Validator
 * Ensures all required environment variables are present and valid
 */

interface RequiredEnvVars {
  [key: string]: string | undefined;
}

const requiredVars: RequiredEnvVars = {
  REACT_APP_FIREBASE_API_KEY: process.env.REACT_APP_FIREBASE_API_KEY,
  REACT_APP_FIREBASE_AUTH_DOMAIN: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  REACT_APP_FIREBASE_PROJECT_ID: process.env.REACT_APP_FIREBASE_PROJECT_ID,
};

const optionalVars: RequiredEnvVars = {
  REACT_APP_STRIPE_PUBLISHABLE_KEY: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY,
  REACT_APP_PAYPAL_CLIENT_ID: process.env.REACT_APP_PAYPAL_CLIENT_ID,
  REACT_APP_GOOGLE_ANALYTICS_ID: process.env.REACT_APP_GOOGLE_ANALYTICS_ID,
};

export function validateEnvironment(): { isValid: boolean; missing: string[]; warnings: string[] } {
  const missing: string[] = [];
  const warnings: string[] = [];

  // Check required variables
  Object.entries(requiredVars).forEach(([key, value]) => {
    if (!value || value.trim() === '') {
      missing.push(key);
    }
  });

  // Check optional variables (warnings only)
  Object.entries(optionalVars).forEach(([key, value]) => {
    if (!value || value.trim() === '') {
      warnings.push(`Optional: ${key} is not set - some features may be disabled`);
    }
  });

  const isValid = missing.length === 0;

  if (!isValid && process.env.NODE_ENV === 'development') {
    // Only log in development mode
  }

  if (warnings.length > 0 && process.env.NODE_ENV === 'development') {
    // Only warn in development mode
  }

  return { isValid, missing, warnings };
}

export function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key];
  if (!value && !defaultValue) {
    throw new Error(`Environment variable ${key} is required but not set`);
  }
  return value || defaultValue || '';
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}
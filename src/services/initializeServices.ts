import { AuthService } from './authService';
import { EmailService } from './emailService';

/**
 * Initialize all services on application startup
 * This should be called in the root layout or _app.tsx
 */
export async function initializeServices(): Promise<void> {
  try {
    // Initialize authentication service
    await AuthService.initializeProvider();
    console.log('[Services] Auth service initialized');
  } catch (error) {
    console.error('[Services] Failed to initialize auth service:', error);
    // Don't throw in development to allow app to continue
    if (process.env.NODE_ENV === 'production') {
      throw error;
    }
  }

  try {
    // Initialize email service
    EmailService.initializeProvider();
    console.log('[Services] Email service initialized');
  } catch (error) {
    console.error('[Services] Failed to initialize email service:', error);
    // Don't throw in development to allow app to continue
    if (process.env.NODE_ENV === 'production') {
      throw error;
    }
  }
}

/**
 * Check if services are initialized
 */
export function areServicesInitialized(): boolean {
  try {
    AuthService.getProvider();
    return true;
  } catch {
    return false;
  }
}


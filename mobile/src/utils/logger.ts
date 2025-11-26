/**
 * Production-safe logger
 *
 * Automatically disables logs in production environment
 * to improve performance and prevent sensitive data leakage
 */

const isDevelopment = process.env.APP_ENV !== 'production';

export const logger = {
  /**
   * Log general information (disabled in production)
   */
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log('[INFO]', ...args);
    }
  },

  /**
   * Log warnings (disabled in production)
   */
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn('[WARN]', ...args);
    }
  },

  /**
   * Log errors (always enabled, but sanitized)
   * Never log sensitive user data in errors
   */
  error: (...args: any[]) => {
    // In production, only log error messages, not full objects
    if (isDevelopment) {
      console.error('[ERROR]', ...args);
    } else {
      // In production, only log error messages
      const sanitizedArgs = args.map(arg => {
        if (arg instanceof Error) {
          return arg.message;
        }
        if (typeof arg === 'object') {
          return '[Object]';
        }
        return arg;
      });
      console.error('[ERROR]', ...sanitizedArgs);
    }
  },

  /**
   * Log debug information (only in development)
   */
  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.debug('[DEBUG]', ...args);
    }
  }
};

export default logger;

/**
 * Production-safe structured logger
 *
 * Outputs JSON format with required fields: level, env, timestamp.
 * Automatically disables verbose logs in production.
 * Never logs PII or sensitive data.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  env: string;
  timestamp: string;
  message: string;
  stack?: string;
  context?: Record<string, unknown>;
}

const env = __DEV__ ? 'development' : 'production';
const isDevelopment = __DEV__;

const formatEntry = (level: LogLevel, args: unknown[]): LogEntry => {
  let stack: string | undefined;

  const message = args
    .map((arg) => {
      if (arg instanceof Error) {
        if (!stack) stack = arg.stack;
        return arg.message;
      }
      if (typeof arg === 'string') return arg;
      if (typeof arg === 'number' || typeof arg === 'boolean') return String(arg);
      return '[Object]';
    })
    .join(' ');

  const entry: LogEntry = {
    level,
    env,
    timestamp: new Date().toISOString(),
    message,
  };

  // Dolacz stack trace dla error level
  if (level === 'error' && stack) {
    entry.stack = stack;
  }

  return entry;
};

export const logger = {
  /**
   * Log general information (disabled in production)
   */
  log: (...args: unknown[]) => {
    if (isDevelopment) {
      const entry = formatEntry('info', args);
      console.log(JSON.stringify(entry));
    }
  },

  /**
   * Log warnings (disabled in production)
   */
  warn: (...args: unknown[]) => {
    if (isDevelopment) {
      const entry = formatEntry('warn', args);
      console.warn(JSON.stringify(entry));
    }
  },

  /**
   * Log errors (always enabled, includes stack trace)
   */
  error: (...args: unknown[]) => {
    const entry = formatEntry('error', args);
    console.error(JSON.stringify(entry));
  },

  /**
   * Log debug information (only in development)
   */
  debug: (...args: unknown[]) => {
    if (isDevelopment) {
      const entry = formatEntry('debug', args);
      console.debug(JSON.stringify(entry));
    }
  },
};

export default logger;

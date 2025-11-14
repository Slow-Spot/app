/**
 * Custom Session Configuration Types
 * Defines user-created meditation session configurations
 */

/**
 * Chime point during meditation session
 */
export interface ChimePoint {
  /** Time in seconds when chime should sound */
  timeInSeconds: number;
  /** Optional label for this chime point */
  label?: string;
}

/**
 * User-defined meditation session configuration
 */
export interface CustomSessionConfig {
  /** Unique identifier */
  id: string;
  /** User-defined name for this configuration */
  name: string;
  /** Total duration in seconds */
  durationSeconds: number;
  /** Array of chime points */
  chimePoints: ChimePoint[];
  /** When this configuration was created */
  createdAt: string;
  /** When this configuration was last modified */
  updatedAt: string;
  /** Optional description */
  description?: string;
  /** Number of times this configuration has been used */
  useCount: number;
}

/**
 * Template for creating new custom session
 */
export interface CreateCustomSessionInput {
  name: string;
  durationSeconds: number;
  chimePoints: ChimePoint[];
  description?: string;
}

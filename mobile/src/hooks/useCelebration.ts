/**
 * useCelebration Hook
 *
 * Re-exports the celebration hook from CelebrationContext.
 * Provides convenient access to celebration functionality.
 *
 * Usage:
 * ```tsx
 * const { triggerCelebration, checkMilestones } = useCelebration();
 *
 * // After completing a session
 * await checkMilestones();
 *
 * // Manual celebration trigger
 * triggerCelebration({ type: 'confetti' });
 * ```
 */

export { useCelebration } from '../contexts/CelebrationContext';
export type {
  CelebrationType,
  ActiveCelebration,
} from '../contexts/CelebrationContext';

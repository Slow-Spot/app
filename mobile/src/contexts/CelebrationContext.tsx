/**
 * CelebrationContext
 *
 * Global context for managing celebration states and milestone tracking.
 * Handles confetti triggers, welcome modals, and milestone celebrations.
 */

import type {
  ReactNode} from 'react';
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect
} from 'react';
import type {
  MilestoneId} from '../services/userProfileService';
import {
  recordAppOpen,
  hasCelebratedMilestone,
  markMilestoneCelebrated,
} from '../services/userProfileService';
import { getProgressStats, getTotalStreak } from '../services/progressTracker';
import { logger } from '../utils/logger';

/**
 * Celebration types
 */
export type CelebrationType =
  | 'confetti'
  | 'welcome_returning'
  | 'milestone';

/**
 * Active celebration state
 */
export interface ActiveCelebration {
  type: CelebrationType;
  milestoneId?: MilestoneId;
  message?: string;
}

/**
 * Context value interface
 */
interface CelebrationContextValue {
  /** Currently active celebration (null if none) */
  activeCelebration: ActiveCelebration | null;
  /** Whether a welcome modal should be shown */
  showWelcomeModal: boolean;
  /** Whether this is the user's first launch */
  isFirstLaunch: boolean;
  /** Whether user is returning after >4h absence */
  isReturningUser: boolean;
  /** Trigger a celebration */
  triggerCelebration: (celebration: ActiveCelebration) => void;
  /** Clear the current celebration */
  clearCelebration: () => void;
  /** Dismiss welcome modal */
  dismissWelcomeModal: () => void;
  /** Check and trigger milestone celebrations based on current stats */
  checkMilestones: () => Promise<void>;
  /** Mark first launch celebration as done */
  completeFirstLaunch: () => Promise<void>;
}

const defaultContextValue: CelebrationContextValue = {
  activeCelebration: null,
  showWelcomeModal: false,
  isFirstLaunch: false,
  isReturningUser: false,
  triggerCelebration: () => {},
  clearCelebration: () => {},
  dismissWelcomeModal: () => {},
  checkMilestones: async () => {},
  completeFirstLaunch: async () => {},
};

const CelebrationContext = createContext<CelebrationContextValue>(defaultContextValue);

interface CelebrationProviderProps {
  children: ReactNode;
}

/**
 * Milestone thresholds
 */
const MILESTONE_THRESHOLDS: {
  sessions: { count: number; id: MilestoneId }[];
  streak: { days: number; id: MilestoneId }[];
} = {
  sessions: [
    { count: 1, id: 'first_session' },
    { count: 10, id: 'sessions_10' },
    { count: 25, id: 'sessions_25' },
    { count: 50, id: 'sessions_50' },
    { count: 100, id: 'sessions_100' },
  ],
  streak: [
    { days: 7, id: 'streak_7' },
    { days: 14, id: 'streak_14' },
    { days: 30, id: 'streak_30' },
    { days: 100, id: 'streak_100' },
  ],
};

export const CelebrationProvider: React.FC<CelebrationProviderProps> = ({
  children,
}) => {
  const [activeCelebration, setActiveCelebration] = useState<ActiveCelebration | null>(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [isFirstLaunch, setIsFirstLaunch] = useState(false);
  const [isReturningUser, setIsReturningUser] = useState(false);

  /**
   * Initialize on mount - check app open status
   */
  useEffect(() => {
    const initCelebrations = async () => {
      try {
        const { isFirstLaunch, isReturningAfterLongAbsence } = await recordAppOpen();

        setIsFirstLaunch(isFirstLaunch);
        setIsReturningUser(isReturningAfterLongAbsence);

        // Show welcome modal for returning users (not first launch)
        if (!isFirstLaunch && isReturningAfterLongAbsence) {
          setShowWelcomeModal(true);
        }
      } catch (error) {
        logger.error('Failed to init celebrations:', error);
      }
    };

    initCelebrations();
  }, []);

  /**
   * Trigger a celebration
   */
  const triggerCelebration = useCallback((celebration: ActiveCelebration) => {
    setActiveCelebration(celebration);
  }, []);

  /**
   * Clear current celebration
   */
  const clearCelebration = useCallback(() => {
    setActiveCelebration(null);
  }, []);

  /**
   * Dismiss welcome modal
   */
  const dismissWelcomeModal = useCallback(() => {
    setShowWelcomeModal(false);
  }, []);

  /**
   * Complete first launch celebration
   */
  const completeFirstLaunch = useCallback(async () => {
    try {
      await markMilestoneCelebrated('first_launch');
      setIsFirstLaunch(false);
    } catch (error) {
      logger.error('Failed to complete first launch:', error);
    }
  }, []);

  /**
   * Check and trigger milestone celebrations
   */
  const checkMilestones = useCallback(async () => {
    try {
      const stats = await getProgressStats();
      const { total: streak } = await getTotalStreak();

      // Check session milestones (in reverse order to get highest uncelebrated)
      for (let i = MILESTONE_THRESHOLDS.sessions.length - 1; i >= 0; i--) {
        const milestone = MILESTONE_THRESHOLDS.sessions[i];
        if (!milestone) continue;
        if (stats.totalSessions >= milestone.count) {
          const alreadyCelebrated = await hasCelebratedMilestone(milestone.id);
          if (!alreadyCelebrated) {
            await markMilestoneCelebrated(milestone.id);
            triggerCelebration({
              type: 'milestone',
              milestoneId: milestone.id,
            });
            return; // Only trigger one milestone at a time
          }
        }
      }

      // Check streak milestones
      for (let i = MILESTONE_THRESHOLDS.streak.length - 1; i >= 0; i--) {
        const milestone = MILESTONE_THRESHOLDS.streak[i];
        if (!milestone) continue;
        if (streak >= milestone.days) {
          const alreadyCelebrated = await hasCelebratedMilestone(milestone.id);
          if (!alreadyCelebrated) {
            await markMilestoneCelebrated(milestone.id);
            triggerCelebration({
              type: 'milestone',
              milestoneId: milestone.id,
            });
            return;
          }
        }
      }
    } catch (error) {
      logger.error('Failed to check milestones:', error);
    }
  }, [triggerCelebration]);

  const value: CelebrationContextValue = {
    activeCelebration,
    showWelcomeModal,
    isFirstLaunch,
    isReturningUser,
    triggerCelebration,
    clearCelebration,
    dismissWelcomeModal,
    checkMilestones,
    completeFirstLaunch,
  };

  return (
    <CelebrationContext.Provider value={value}>
      {children}
    </CelebrationContext.Provider>
  );
};

/**
 * Hook to access celebration context
 */
export const useCelebration = (): CelebrationContextValue => {
  const context = useContext(CelebrationContext);
  if (!context) {
    throw new Error('useCelebration must be used within a CelebrationProvider');
  }
  return context;
};

export default CelebrationContext;

// ══════════════════════════════════════════════════════════════
// Quick Start Mode
// Skip instructions for experienced users who know the session
// ══════════════════════════════════════════════════════════════

import type { MeditationSession } from '../services/api';
import type { UserMeditationProgress } from '../types/userProgress';

// ══════════════════════════════════════════════════════════════
// ELIGIBILITY CHECKS
// ══════════════════════════════════════════════════════════════

export interface QuickStartEligibility {
  canQuickStart: boolean;
  reason?: string;
  confidence: 'high' | 'medium' | 'low';
}

/**
 * Check if user is eligible for quick start
 */
export const checkQuickStartEligibility = (
  session: MeditationSession,
  progress: UserMeditationProgress
): QuickStartEligibility => {
  // User preference: always skip instructions
  if (progress.alwaysSkipInstructions) {
    return {
      canQuickStart: true,
      reason: 'User prefers to skip instructions',
      confidence: 'high',
    };
  }

  // User preference: no instructions
  if (progress.preferredInstructionStyle === 'none') {
    return {
      canQuickStart: true,
      reason: 'Instruction style set to none',
      confidence: 'high',
    };
  }

  // Experienced with this specific session
  const sessionCompletions = progress.completedSessions.filter(
    c => c.sessionId === session.id
  );

  if (sessionCompletions.length >= 3) {
    return {
      canQuickStart: true,
      reason: `Completed this session ${sessionCompletions.length} times`,
      confidence: 'high',
    };
  }

  // Experienced with similar sessions
  const similarCompletions = progress.completedSessions.filter(
    c =>
      (c.cultureTag && c.cultureTag === session.cultureTag) ||
      (c.purposeTag && c.purposeTag === session.purposeTag)
  );

  if (similarCompletions.length >= 10 && progress.currentLevel >= 3) {
    return {
      canQuickStart: true,
      reason: 'Experienced with similar sessions',
      confidence: 'medium',
    };
  }

  // Advanced user with high completion rate
  const avgCompletionRate =
    progress.completedSessions.length > 0
      ? progress.completedSessions.reduce(
          (sum, c) => sum + c.completionPercentage,
          0
        ) / progress.completedSessions.length
      : 0;

  if (
    progress.currentLevel >= 4 &&
    avgCompletionRate >= 90 &&
    progress.totalSessions >= 50
  ) {
    return {
      canQuickStart: true,
      reason: 'Advanced practitioner',
      confidence: 'medium',
    };
  }

  // Long meditation streak (dedicated practitioner)
  if (progress.currentStreak >= 30 && progress.currentLevel >= 3) {
    return {
      canQuickStart: true,
      reason: `${progress.currentStreak}-day streak`,
      confidence: 'medium',
    };
  }

  // Not eligible
  return {
    canQuickStart: false,
    confidence: 'low',
  };
};

/**
 * Simplified check - just returns boolean
 */
export const canUserQuickStart = (
  session: MeditationSession,
  progress: UserMeditationProgress
): boolean => {
  const eligibility = checkQuickStartEligibility(session, progress);
  return eligibility.canQuickStart;
};

// ══════════════════════════════════════════════════════════════
// QUICK START SUGGESTIONS
// ══════════════════════════════════════════════════════════════

export interface QuickStartSuggestion {
  shouldSuggest: boolean;
  messageKey: string; // i18n key
  ctaKey: string; // Call to action i18n key
  icon: string;
}

/**
 * Determine if quick start should be suggested to user
 */
export const getQuickStartSuggestion = (
  session: MeditationSession,
  progress: UserMeditationProgress
): QuickStartSuggestion | null => {
  const eligibility = checkQuickStartEligibility(session, progress);

  if (!eligibility.canQuickStart) return null;

  // Already prefers to skip - no need to suggest
  if (progress.alwaysSkipInstructions || progress.preferredInstructionStyle === 'none') {
    return null;
  }

  // High confidence - show prominent suggestion
  if (eligibility.confidence === 'high') {
    return {
      shouldSuggest: true,
      messageKey: 'quickStart.suggestion.experienced.message',
      ctaKey: 'quickStart.suggestion.experienced.cta',
      icon: '⚡',
    };
  }

  // Medium confidence - show subtle suggestion
  if (eligibility.confidence === 'medium') {
    return {
      shouldSuggest: true,
      messageKey: 'quickStart.suggestion.ready.message',
      ctaKey: 'quickStart.suggestion.ready.cta',
      icon: '🚀',
    };
  }

  return null;
};

// ══════════════════════════════════════════════════════════════
// TIME SAVED CALCULATION
// ══════════════════════════════════════════════════════════════

/**
 * Calculate time saved by quick start
 */
export const calculateTimeSaved = (
  session: MeditationSession,
  progress: UserMeditationProgress
): number => {
  // Estimate instruction time
  const baseInstructionTime = 30; // seconds
  const breathingPrepTime = progress.breathingPrepDuration || 60;
  const physicalSetupTime = 20;

  const totalInstructionTime = baseInstructionTime + breathingPrepTime + physicalSetupTime;

  return totalInstructionTime; // seconds
};

/**
 * Format time saved for display
 */
export const formatTimeSaved = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds}s`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (remainingSeconds === 0) {
    return `${minutes}m`;
  }

  return `${minutes}m ${remainingSeconds}s`;
};

// ══════════════════════════════════════════════════════════════
// QUICK START STATISTICS
// ══════════════════════════════════════════════════════════════

export interface QuickStartStats {
  timesUsedQuickStart: number;
  totalTimeSaved: number; // seconds
  quickStartRate: number; // percentage (0-100)
  favoriteQuickStartSessions: number[]; // session IDs
}

/**
 * Calculate quick start statistics
 */
export const calculateQuickStartStats = (
  progress: UserMeditationProgress,
  quickStartUsageHistory: Array<{ sessionId: number; timeSaved: number }>
): QuickStartStats => {
  const totalTimeSaved = quickStartUsageHistory.reduce(
    (sum, usage) => sum + usage.timeSaved,
    0
  );

  const quickStartRate =
    progress.totalSessions > 0
      ? Math.round((quickStartUsageHistory.length / progress.totalSessions) * 100)
      : 0;

  // Find sessions where quick start is used most often
  const sessionCounts = new Map<number, number>();
  quickStartUsageHistory.forEach(usage => {
    sessionCounts.set(usage.sessionId, (sessionCounts.get(usage.sessionId) || 0) + 1);
  });

  const favoriteQuickStartSessions = Array.from(sessionCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([sessionId]) => sessionId);

  return {
    timesUsedQuickStart: quickStartUsageHistory.length,
    totalTimeSaved,
    quickStartRate,
    favoriteQuickStartSessions,
  };
};

// ══════════════════════════════════════════════════════════════
// PERSISTENT PREFERENCES
// ══════════════════════════════════════════════════════════════

/**
 * Check if user wants to always quick start this session
 */
export const hasSessionQuickStartPreference = (
  sessionId: number,
  sessionPreferences: Record<number, { alwaysQuickStart: boolean }>
): boolean => {
  return sessionPreferences[sessionId]?.alwaysQuickStart ?? false;
};

/**
 * Set quick start preference for a session
 */
export const setSessionQuickStartPreference = (
  sessionId: number,
  alwaysQuickStart: boolean,
  sessionPreferences: Record<number, { alwaysQuickStart: boolean }>
): Record<number, { alwaysQuickStart: boolean }> => {
  return {
    ...sessionPreferences,
    [sessionId]: {
      alwaysQuickStart,
    },
  };
};

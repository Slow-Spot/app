// ══════════════════════════════════════════════════════════════
// Adaptive Instructions System
// Intelligently adjust instructions based on user experience
// ══════════════════════════════════════════════════════════════

import type { MeditationSession } from '../services/api';
import type { UserMeditationProgress } from '../types/userProgress';
import type { PreSessionInstruction } from '../types/instructions';
import { getInstructionWithFallback } from './instructionHelpers';

// ══════════════════════════════════════════════════════════════
// EXPERIENCE LEVEL DETECTION
// ══════════════════════════════════════════════════════════════

export interface UserExperienceMetrics {
  // Overall experience
  totalSessions: number;
  totalMinutes: number;
  currentStreak: number;
  level: number;

  // Session-specific experience
  timesCompletedThisSession: number;
  timesCompletedSimilarSessions: number; // Same culture/purpose
  averageCompletionRate: number; // 0-100
  recentSuccessRate: number; // Last 5 sessions

  // Skill indicators
  completesFullSessions: boolean;
  engagesWithInstructions: boolean; // Based on time spent on instruction screen
  needsReminders: boolean;
}

/**
 * Analyze user's experience with meditation
 */
export const analyzeUserExperience = (
  session: MeditationSession,
  progress: UserMeditationProgress
): UserExperienceMetrics => {
  const sessionCompletions = progress.completedSessions.filter(
    c => c.sessionId === session.id
  );

  const similarSessions = progress.completedSessions.filter(
    c =>
      c.cultureTag === session.cultureTag || c.purposeTag === session.purposeTag
  );

  const last5Sessions = progress.completedSessions.slice(-5);

  const averageCompletionRate =
    progress.completedSessions.length > 0
      ? progress.completedSessions.reduce(
          (sum, c) => sum + c.completionPercentage,
          0
        ) / progress.completedSessions.length
      : 0;

  const recentSuccessRate =
    last5Sessions.length > 0
      ? last5Sessions.filter(c => c.completedFully).length / last5Sessions.length
      : 0;

  return {
    totalSessions: progress.completedSessions.length,
    totalMinutes: progress.totalMeditationMinutes,
    currentStreak: progress.currentStreak,
    level: progress.currentLevel,
    timesCompletedThisSession: sessionCompletions.length,
    timesCompletedSimilarSessions: similarSessions.length,
    averageCompletionRate,
    recentSuccessRate,
    completesFullSessions: averageCompletionRate >= 80,
    engagesWithInstructions: progress.preferredInstructionStyle !== 'none',
    needsReminders: progress.reminderFrequency !== 'none',
  };
};

// ══════════════════════════════════════════════════════════════
// INSTRUCTION ADAPTATION
// ══════════════════════════════════════════════════════════════

export type AdaptationLevel = 'full' | 'simplified' | 'minimal' | 'skip';

/**
 * Determine appropriate instruction level
 */
export const determineInstructionLevel = (
  metrics: UserExperienceMetrics
): AdaptationLevel => {
  // Always skip if user preference is set
  if (!metrics.engagesWithInstructions) {
    return 'skip';
  }

  // First time with this session -> Full instructions
  if (metrics.timesCompletedThisSession === 0) {
    return 'full';
  }

  // Completed this session 1-3 times -> Simplified
  if (metrics.timesCompletedThisSession >= 1 && metrics.timesCompletedThisSession <= 3) {
    return 'simplified';
  }

  // Completed this session 4-9 times -> Minimal
  if (metrics.timesCompletedThisSession >= 4 && metrics.timesCompletedThisSession < 10) {
    return 'minimal';
  }

  // Completed 10+ times -> Skip (they know it)
  if (metrics.timesCompletedThisSession >= 10) {
    return 'skip';
  }

  // Advanced users with high success rate -> Minimal
  if (metrics.level >= 4 && metrics.recentSuccessRate >= 0.8) {
    return 'minimal';
  }

  // Beginners -> Full
  if (metrics.level <= 2 || metrics.totalSessions < 10) {
    return 'full';
  }

  // Default to simplified
  return 'simplified';
};

/**
 * Adapt instructions based on user experience
 */
export const adaptInstruction = (
  baseInstruction: PreSessionInstruction,
  adaptationLevel: AdaptationLevel
): PreSessionInstruction => {
  switch (adaptationLevel) {
    case 'skip':
      // Return empty instruction (will be handled by UI)
      return {
        ...baseInstruction,
        physicalSetup: [],
        breathingPrep: undefined,
        mentalPreparation: {
          intention: '',
          focusPoint: '',
          commonChallenges: [],
        },
        duringSessionReminders: [],
      };

    case 'minimal':
      // Keep only essential physical setup and one reminder
      return {
        ...baseInstruction,
        physicalSetup: baseInstruction.physicalSetup?.slice(0, 1) || [],
        breathingPrep: undefined, // Skip breathing prep
        mentalPreparation: baseInstruction.mentalPreparation,
        duringSessionReminders: baseInstruction.duringSessionReminders.slice(0, 1),
      };

    case 'simplified':
      // Reduce number of steps and reminders
      return {
        ...baseInstruction,
        physicalSetup: baseInstruction.physicalSetup
          ? baseInstruction.physicalSetup.slice(0, 3)
          : [],
        breathingPrep: baseInstruction.breathingPrep
          ? {
              ...baseInstruction.breathingPrep,
              duration: Math.round(
                baseInstruction.breathingPrep.duration / 2
              ), // Half duration
            }
          : undefined,
        duringSessionReminders: baseInstruction.duringSessionReminders.slice(
          0,
          Math.ceil(baseInstruction.duringSessionReminders.length / 2)
        ),
      };

    case 'full':
    default:
      // Return full instructions
      return baseInstruction;
  }
};

/**
 * Get adaptive instruction for a session
 */
export const getAdaptiveInstruction = (
  session: MeditationSession,
  progress: UserMeditationProgress
): PreSessionInstruction | null => {
  // Get base instruction
  const baseInstruction = getInstructionWithFallback(
    session.instructionId,
    session.level
  );

  if (!baseInstruction) return null;

  // Analyze user experience
  const metrics = analyzeUserExperience(session, progress);

  // Determine adaptation level
  const adaptationLevel = determineInstructionLevel(metrics);

  // Return adapted instruction
  return adaptInstruction(baseInstruction, adaptationLevel);
};

// ══════════════════════════════════════════════════════════════
// SMART REMINDERS
// ══════════════════════════════════════════════════════════════

export interface AdaptiveReminder {
  time: number; // Seconds into session
  message: string;
  type: 'encouragement' | 'technique' | 'refocus' | 'progress';
  priority: 'high' | 'normal' | 'low';
}

/**
 * Generate adaptive reminders based on user's history
 */
export const generateAdaptiveReminders = (
  session: MeditationSession,
  progress: UserMeditationProgress
): AdaptiveReminder[] => {
  const reminders: AdaptiveReminder[] = [];
  const metrics = analyzeUserExperience(session, progress);
  const duration = Number(session.durationSeconds || 0);

  // Check recent session history for patterns
  const recentQuits = progress.completedSessions
    .filter(c => c.sessionId === session.id)
    .slice(-3)
    .filter(c => !c.completedFully);

  // If user often quits early, add encouragement reminders
  if (recentQuits.length >= 2) {
    reminders.push(
      {
        time: Math.round(duration * 0.3),
        message: "You're doing great. Just breathe.",
        type: 'encouragement',
        priority: 'high',
      },
      {
        time: Math.round(duration * 0.6),
        message: 'Almost there. Stay present.',
        type: 'encouragement',
        priority: 'high',
      }
    );
  }

  // Progress markers for longer sessions
  if (duration >= 600) {
    // 10+ minutes
    reminders.push({
      time: Math.round(duration * 0.5),
      message: 'Halfway there. Notice your breath.',
      type: 'progress',
      priority: 'normal',
    });
  }

  // Technique reminders for beginners
  if (metrics.level <= 2) {
    reminders.push({
      time: Math.round(duration * 0.25),
      message: "Notice when your mind wanders. That's normal.",
      type: 'technique',
      priority: 'normal',
    });
  }

  // Refocus reminder for mid-session
  if (duration >= 300 && metrics.needsReminders) {
    reminders.push({
      time: Math.round(duration * 0.5),
      message: 'Return to your breath.',
      type: 'refocus',
      priority: 'normal',
    });
  }

  // Sort by time
  return reminders.sort((a, b) => a.time - b.time);
};

// ══════════════════════════════════════════════════════════════
// PERSONALIZED RECOMMENDATIONS
// ══════════════════════════════════════════════════════════════

export interface SessionRecommendation {
  session: MeditationSession;
  reason: string;
  score: number;
}

/**
 * Recommend sessions based on user's history and preferences
 */
export const getPersonalizedRecommendations = (
  allSessions: MeditationSession[],
  progress: UserMeditationProgress,
  limit: number = 3
): SessionRecommendation[] => {
  const recommendations: SessionRecommendation[] = [];
  const completedSessionIds = new Set(
    progress.completedSessions.map(c => String(c.sessionId))
  );

  for (const session of allSessions) {
    let score = 0;
    const reasons: string[] = [];

    // Prefer sessions at user's level
    if (session.level === progress.currentLevel) {
      score += 30;
      reasons.push('matches your level');
    } else if (session.level === progress.currentLevel + 1) {
      score += 20;
      reasons.push('slight challenge');
    }

    // Prefer favorite cultures/purposes
    if (
      session.cultureTag &&
      progress.preferredCultures.includes(session.cultureTag)
    ) {
      score += 25;
      reasons.push('favorite tradition');
    }

    if (
      session.purposeTag &&
      progress.preferredOccasions.includes(session.purposeTag)
    ) {
      score += 25;
      reasons.push('aligns with your goals');
    }

    // Boost sessions with high mood improvement in past
    const pastCompletions = progress.completedSessions.filter(
      c => c.sessionId === session.id
    );
    if (pastCompletions.length > 0) {
      const avgMoodChange =
        pastCompletions.reduce((sum, c) => {
          if (c.moodBefore && c.moodAfter) {
            return sum + (c.moodAfter - c.moodBefore);
          }
          return sum;
        }, 0) / pastCompletions.length;

      if (avgMoodChange > 0) {
        score += avgMoodChange * 10;
        reasons.push('improved your mood before');
      }
    }

    // Penalize sessions completed very recently
    const lastCompletion = pastCompletions
      .sort(
        (a, b) =>
          new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
      )[0];
    if (lastCompletion) {
      const daysSince =
        (Date.now() - new Date(lastCompletion.completedAt).getTime()) /
        (1000 * 60 * 60 * 24);
      if (daysSince < 1) {
        score -= 20;
      }
    }

    // Slight bonus for unexplored sessions
    if (!completedSessionIds.has(String(session.id))) {
      score += 5;
      reasons.push('new to you');
    }

    if (score > 0) {
      recommendations.push({
        session,
        reason: reasons.join(', '),
        score,
      });
    }
  }

  // Sort by score and return top N
  return recommendations
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};

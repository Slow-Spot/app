// ══════════════════════════════════════════════════════════════
// Insights Dashboard Utilities
// Advanced analytics, patterns, and insights from meditation data
// ══════════════════════════════════════════════════════════════

import {
  UserMeditationProgress,
  SessionCompletion,
  MoodEntry,
} from '../types/userProgress';
import { formatDateKey, parseISO, getWeekKey } from './dateUtils';

// ══════════════════════════════════════════════════════════════
// OVERALL STATISTICS
// ══════════════════════════════════════════════════════════════

export interface OverallStats {
  // Time & practice
  totalMinutes: number;
  totalSessions: number;
  averageSessionDuration: number; // minutes
  longestSession: number; // minutes
  shortestSession: number; // minutes

  // Streaks & consistency
  currentStreak: number;
  longestStreak: number;
  meditationDays: number; // Total days meditated
  consistencyScore: number; // 0-100

  // Success metrics
  completionRate: number; // Percentage (0-100)
  averageMoodImprovement: number; // -4 to +4
  successfulSessions: number;
  totalXP: number;
  currentLevel: number;

  // Favorites
  favoriteCulture?: string;
  favoritePurpose?: string;
  favoriteTimeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
}

/**
 * Calculate overall meditation statistics
 */
export const calculateOverallStats = (
  progress: UserMeditationProgress
): OverallStats => {
  const completions = progress.completedSessions;

  // Time & practice
  const durations = completions.map(c => c.actualDurationSeconds / 60);
  const averageSessionDuration =
    durations.length > 0
      ? durations.reduce((sum, d) => sum + d, 0) / durations.length
      : 0;
  const longestSession = durations.length > 0 ? Math.max(...durations) : 0;
  const shortestSession = durations.length > 0 ? Math.min(...durations) : 0;

  // Consistency
  const uniqueDays = new Set(
    completions.map(c => new Date(c.completedAt).toDateString())
  ).size;
  const daysSinceStart =
    completions.length > 0
      ? Math.ceil(
          (Date.now() - new Date(completions[0].completedAt).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0;
  const consistencyScore =
    daysSinceStart > 0 ? Math.min(100, Math.round((uniqueDays / daysSinceStart) * 100)) : 0;

  // Success metrics
  const completionRate =
    completions.length > 0
      ? Math.round(
          (completions.filter(c => c.completedFully).length / completions.length) * 100
        )
      : 0;

  const moodImprovements = completions
    .filter(c => c.moodBefore && c.moodAfter)
    .map(c => (c.moodAfter! - c.moodBefore!));
  const averageMoodImprovement =
    moodImprovements.length > 0
      ? moodImprovements.reduce((sum, i) => sum + i, 0) / moodImprovements.length
      : 0;

  const successfulSessions = completions.filter(
    c => c.completedFully && c.moodAfter && c.moodBefore && c.moodAfter >= c.moodBefore
  ).length;

  // Favorites
  const cultureCounts = new Map<string, number>();
  const purposeCounts = new Map<string, number>();
  const timeOfDayCounts = new Map<string, number>();

  completions.forEach(c => {
    if (c.cultureTag) {
      cultureCounts.set(c.cultureTag, (cultureCounts.get(c.cultureTag) || 0) + 1);
    }
    if (c.purposeTag) {
      purposeCounts.set(c.purposeTag, (purposeCounts.get(c.purposeTag) || 0) + 1);
    }

    const hour = new Date(c.completedAt).getHours();
    let timeOfDay: string;
    if (hour >= 5 && hour < 12) timeOfDay = 'morning';
    else if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
    else if (hour >= 17 && hour < 21) timeOfDay = 'evening';
    else timeOfDay = 'night';

    timeOfDayCounts.set(timeOfDay, (timeOfDayCounts.get(timeOfDay) || 0) + 1);
  });

  const favoriteCulture =
    cultureCounts.size > 0
      ? Array.from(cultureCounts.entries()).sort((a, b) => b[1] - a[1])[0][0]
      : undefined;

  const favoritePurpose =
    purposeCounts.size > 0
      ? Array.from(purposeCounts.entries()).sort((a, b) => b[1] - a[1])[0][0]
      : undefined;

  const favoriteTimeOfDay =
    timeOfDayCounts.size > 0
      ? (Array.from(timeOfDayCounts.entries()).sort((a, b) => b[1] - a[1])[0][0] as OverallStats['favoriteTimeOfDay'])
      : undefined;

  return {
    totalMinutes: progress.totalMeditationMinutes,
    totalSessions: progress.totalSessions,
    averageSessionDuration,
    longestSession,
    shortestSession,
    currentStreak: progress.currentStreak,
    longestStreak: progress.longestStreak,
    meditationDays: uniqueDays,
    consistencyScore,
    completionRate,
    averageMoodImprovement,
    successfulSessions,
    totalXP: progress.experiencePoints,
    currentLevel: progress.currentLevel,
    favoriteCulture,
    favoritePurpose,
    favoriteTimeOfDay,
  };
};

// ══════════════════════════════════════════════════════════════
// MOOD TRENDS
// ══════════════════════════════════════════════════════════════

export interface MoodTrend {
  date: string; // ISO date
  avgBefore: number;
  avgAfter: number;
  avgChange: number;
  sessionCount: number;
}

/**
 * Calculate mood trends over time (daily aggregation)
 */
export const calculateMoodTrends = (
  moodEntries: MoodEntry[],
  days: number = 30
): MoodTrend[] => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const dailyData = new Map<string, MoodEntry[]>();

  moodEntries.forEach(entry => {
    const entryDate = parseISO(entry.date);
    if (entryDate >= startDate) {
      const dateKey = formatDateKey(entryDate);
      if (!dailyData.has(dateKey)) {
        dailyData.set(dateKey, []);
      }
      dailyData.get(dateKey)!.push(entry);
    }
  });

  const trends: MoodTrend[] = [];

  dailyData.forEach((entries, date) => {
    const avgBefore =
      entries.reduce((sum, e) => sum + e.beforeMeditation, 0) / entries.length;
    const avgAfter =
      entries.reduce((sum, e) => sum + e.afterMeditation, 0) / entries.length;
    const avgChange = avgAfter - avgBefore;

    trends.push({
      date,
      avgBefore,
      avgAfter,
      avgChange,
      sessionCount: entries.length,
    });
  });

  return trends.sort((a, b) => a.date.localeCompare(b.date));
};

// ══════════════════════════════════════════════════════════════
// TIME PATTERNS
// ══════════════════════════════════════════════════════════════

export interface TimePattern {
  hour: number;
  sessionCount: number;
  avgCompletionRate: number;
  avgMoodImprovement: number;
}

/**
 * Analyze patterns by time of day
 */
export const analyzeTimePatterns = (
  completions: SessionCompletion[]
): TimePattern[] => {
  const hourlyData = new Map<number, SessionCompletion[]>();

  completions.forEach(completion => {
    const hour = new Date(completion.completedAt).getHours();
    if (!hourlyData.has(hour)) {
      hourlyData.set(hour, []);
    }
    hourlyData.get(hour)!.push(completion);
  });

  const patterns: TimePattern[] = [];

  hourlyData.forEach((sessions, hour) => {
    const sessionCount = sessions.length;
    const avgCompletionRate =
      sessions.reduce((sum, s) => sum + s.completionPercentage, 0) / sessions.length;

    const moodImprovements = sessions
      .filter(s => s.moodBefore && s.moodAfter)
      .map(s => s.moodAfter! - s.moodBefore!);
    const avgMoodImprovement =
      moodImprovements.length > 0
        ? moodImprovements.reduce((sum, i) => sum + i, 0) / moodImprovements.length
        : 0;

    patterns.push({
      hour,
      sessionCount,
      avgCompletionRate,
      avgMoodImprovement,
    });
  });

  return patterns.sort((a, b) => a.hour - b.hour);
};

// ══════════════════════════════════════════════════════════════
// WEEKLY PATTERNS
// ══════════════════════════════════════════════════════════════

export interface WeeklyPattern {
  dayOfWeek: number; // 0-6 (Sunday to Saturday)
  sessionCount: number;
  avgCompletionRate: number;
  avgMoodImprovement: number;
}

/**
 * Analyze patterns by day of week
 */
export const analyzeWeeklyPatterns = (
  completions: SessionCompletion[]
): WeeklyPattern[] => {
  const weeklyData = new Map<number, SessionCompletion[]>();

  completions.forEach(completion => {
    const dayOfWeek = new Date(completion.completedAt).getDay();
    if (!weeklyData.has(dayOfWeek)) {
      weeklyData.set(dayOfWeek, []);
    }
    weeklyData.get(dayOfWeek)!.push(completion);
  });

  const patterns: WeeklyPattern[] = [];

  for (let day = 0; day < 7; day++) {
    const sessions = weeklyData.get(day) || [];
    const sessionCount = sessions.length;

    if (sessionCount === 0) {
      patterns.push({
        dayOfWeek: day,
        sessionCount: 0,
        avgCompletionRate: 0,
        avgMoodImprovement: 0,
      });
      continue;
    }

    const avgCompletionRate =
      sessions.reduce((sum, s) => sum + s.completionPercentage, 0) / sessions.length;

    const moodImprovements = sessions
      .filter(s => s.moodBefore && s.moodAfter)
      .map(s => s.moodAfter! - s.moodBefore!);
    const avgMoodImprovement =
      moodImprovements.length > 0
        ? moodImprovements.reduce((sum, i) => sum + i, 0) / moodImprovements.length
        : 0;

    patterns.push({
      dayOfWeek: day,
      sessionCount,
      avgCompletionRate,
      avgMoodImprovement,
    });
  }

  return patterns;
};

// ══════════════════════════════════════════════════════════════
// INSIGHTS GENERATION
// ══════════════════════════════════════════════════════════════

export interface GeneratedInsight {
  id: string;
  type: 'pattern' | 'achievement' | 'suggestion' | 'milestone';
  titleKey: string;
  descriptionKey: string;
  priority: 'high' | 'medium' | 'low';
  data?: Record<string, any>;
}

/**
 * Generate insights from user data
 */
export const generateInsights = (
  progress: UserMeditationProgress
): GeneratedInsight[] => {
  const insights: GeneratedInsight[] = [];
  const stats = calculateOverallStats(progress);
  const timePatterns = analyzeTimePatterns(progress.completedSessions);

  // Milestone insights
  if (stats.currentStreak >= 7 && stats.currentStreak < 14) {
    insights.push({
      id: 'streak_7',
      type: 'milestone',
      titleKey: 'insights.streak7.title',
      descriptionKey: 'insights.streak7.description',
      priority: 'high',
      data: { streak: stats.currentStreak },
    });
  }

  if (stats.totalMinutes >= 1000 && stats.totalMinutes < 1500) {
    insights.push({
      id: 'minutes_1000',
      type: 'milestone',
      titleKey: 'insights.minutes1000.title',
      descriptionKey: 'insights.minutes1000.description',
      priority: 'high',
      data: { minutes: stats.totalMinutes },
    });
  }

  // Pattern insights
  if (stats.favoriteTimeOfDay) {
    insights.push({
      id: 'time_pattern',
      type: 'pattern',
      titleKey: 'insights.timePattern.title',
      descriptionKey: 'insights.timePattern.description',
      priority: 'medium',
      data: { timeOfDay: stats.favoriteTimeOfDay },
    });
  }

  // Best time insight
  const bestTime = timePatterns.sort(
    (a, b) => b.avgMoodImprovement - a.avgMoodImprovement
  )[0];
  if (bestTime && bestTime.sessionCount >= 3) {
    insights.push({
      id: 'best_time',
      type: 'pattern',
      titleKey: 'insights.bestTime.title',
      descriptionKey: 'insights.bestTime.description',
      priority: 'medium',
      data: { hour: bestTime.hour, improvement: bestTime.avgMoodImprovement },
    });
  }

  // Mood improvement insight
  if (stats.averageMoodImprovement >= 1) {
    insights.push({
      id: 'mood_improvement',
      type: 'achievement',
      titleKey: 'insights.moodImprovement.title',
      descriptionKey: 'insights.moodImprovement.description',
      priority: 'high',
      data: { improvement: stats.averageMoodImprovement.toFixed(1) },
    });
  }

  // Consistency suggestion
  if (stats.consistencyScore < 50 && stats.totalSessions >= 10) {
    insights.push({
      id: 'consistency_suggestion',
      type: 'suggestion',
      titleKey: 'insights.consistencySuggestion.title',
      descriptionKey: 'insights.consistencySuggestion.description',
      priority: 'medium',
      data: { score: stats.consistencyScore },
    });
  }

  // Completion rate suggestion
  if (stats.completionRate < 70 && stats.totalSessions >= 10) {
    insights.push({
      id: 'completion_suggestion',
      type: 'suggestion',
      titleKey: 'insights.completionSuggestion.title',
      descriptionKey: 'insights.completionSuggestion.description',
      priority: 'medium',
      data: { rate: stats.completionRate },
    });
  }

  return insights.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
};

// ══════════════════════════════════════════════════════════════
// PROGRESS OVER TIME
// ══════════════════════════════════════════════════════════════

export interface ProgressOverTime {
  date: string;
  cumulativeMinutes: number;
  cumulativeSessions: number;
  level: number;
  xp: number;
}

/**
 * Calculate progress over time (weekly aggregation)
 */
export const calculateProgressOverTime = (
  completions: SessionCompletion[],
  weeks: number = 12
): ProgressOverTime[] => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - weeks * 7);

  const weeklyData: ProgressOverTime[] = [];
  let cumulativeMinutes = 0;
  let cumulativeSessions = 0;
  let xp = 0;

  // Sort completions by date
  const sorted = [...completions].sort(
    (a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
  );

  const weeklyGroups = new Map<string, SessionCompletion[]>();

  sorted.forEach(completion => {
    const date = parseISO(completion.completedAt);
    if (date >= startDate) {
      const weekKeyValue = getWeekKey(date);

      if (!weeklyGroups.has(weekKeyValue)) {
        weeklyGroups.set(weekKeyValue, []);
      }
      weeklyGroups.get(weekKeyValue)!.push(completion);
    }
  });

  const sortedWeeks = Array.from(weeklyGroups.keys()).sort();

  sortedWeeks.forEach(weekKey => {
    const weekCompletions = weeklyGroups.get(weekKey)!;

    weekCompletions.forEach(c => {
      cumulativeMinutes += c.actualDurationSeconds / 60;
      cumulativeSessions += 1;
      xp += c.xpEarned;
    });

    // Estimate level from XP (simplified)
    const level = Math.floor(Math.sqrt(xp / 100)) + 1;

    weeklyData.push({
      date: weekKey,
      cumulativeMinutes: Math.round(cumulativeMinutes),
      cumulativeSessions,
      level: Math.min(5, level),
      xp,
    });
  });

  return weeklyData;
};

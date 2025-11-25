// ══════════════════════════════════════════════════════════════
// Session Filtering & Sorting Utilities
// Advanced filtering, sorting, and searching for meditation sessions
// ══════════════════════════════════════════════════════════════

import { MeditationSession } from '../services/api';
import { UserMeditationProgress } from '../types/userProgress';
import {
  SessionFilters,
  SortBy,
  SortOrder,
  AvailableFilters,
  FILTER_PRESETS,
} from '../types/filters';

// ══════════════════════════════════════════════════════════════
// FILTERING FUNCTIONS
// ══════════════════════════════════════════════════════════════

/**
 * Filter sessions based on filter criteria
 */
const toNumber = (value: string | number | undefined): number =>
  typeof value === 'number' ? value : Number(value || 0);

export const filterSessions = (
  sessions: MeditationSession[],
  filters: SessionFilters,
  userProgress?: UserMeditationProgress
): MeditationSession[] => {
  let filtered = [...sessions];

  // Text search
  if (filters.searchQuery && filters.searchQuery.trim().length > 0) {
    const query = filters.searchQuery.toLowerCase().trim();
    filtered = filtered.filter(session =>
      session.title.toLowerCase().includes(query) ||
      (session.description || '').toLowerCase().includes(query) ||
      session.cultureTag?.toLowerCase().includes(query) ||
      session.purposeTag?.toLowerCase().includes(query)
    );
  }

  // Duration filters
  if (filters.durations && filters.durations.length > 0) {
    filtered = filtered.filter(session => {
      const durationMinutes = Math.round(toNumber(session.durationSeconds) / 60);
      return filters.durations!.includes(durationMinutes);
    });
  }

  if (filters.durationRange) {
    const { min, max } = filters.durationRange;
    filtered = filtered.filter(session => {
      const durationMinutes = Math.round(toNumber(session.durationSeconds) / 60);
      if (min !== undefined && durationMinutes < min) return false;
      if (max !== undefined && durationMinutes > max) return false;
      return true;
    });
  }

  // Level filters
  if (filters.levels && filters.levels.length > 0) {
    filtered = filtered.filter(session =>
      filters.levels!.includes(session.level)
    );
  }

  // Culture tags
  if (filters.cultureTags && filters.cultureTags.length > 0) {
    filtered = filtered.filter(session =>
      session.cultureTag && filters.cultureTags!.includes(session.cultureTag)
    );
  }

  // Purpose tags
  if (filters.purposes && filters.purposes.length > 0) {
    filtered = filtered.filter(session =>
      session.purposeTag && filters.purposes!.includes(session.purposeTag)
    );
  }

  // Favorites filter
  if (filters.showFavoritesOnly && userProgress) {
    const favoriteIds = new Set((userProgress.favoriteSessions || []).map(String));
    filtered = filtered.filter(session => favoriteIds.has(String(session.id)));
  }

  // Hidden sessions filter
  if (!filters.showHiddenSessions && userProgress) {
    const hiddenIds = new Set((userProgress.hiddenSessions || []).map(String));
    filtered = filtered.filter(session => !hiddenIds.has(String(session.id)));
  }

  // Custom sessions filter
  if (filters.showCustomSessionsOnly) {
    filtered = filtered.filter(session => 'isCustom' in session && session.isCustom);
  }

  // Completed/uncompleted filters
  if (userProgress) {
    const completedIds = new Set(
      userProgress.completedSessions.map(s => String(s.sessionId))
    );

    if (filters.showCompletedOnly) {
      filtered = filtered.filter(session => completedIds.has(String(session.id)));
    }

    if (filters.showUncompletedOnly) {
      filtered = filtered.filter(session => !completedIds.has(String(session.id)));
    }
  }

  // Instructions filter
  if (filters.hasInstructions !== undefined) {
    filtered = filtered.filter(session => {
      const hasInstructions = !!session.instructionId;
      return hasInstructions === filters.hasInstructions;
    });
  }

  if (filters.instructionTypes && filters.instructionTypes.length > 0) {
    filtered = filtered.filter(session =>
      session.instructionId && filters.instructionTypes!.includes(session.instructionId)
    );
  }

  return filtered;
};

// ══════════════════════════════════════════════════════════════
// SORTING FUNCTIONS
// ══════════════════════════════════════════════════════════════

/**
 * Sort sessions based on sort criteria
 */
export const sortSessions = (
  sessions: MeditationSession[],
  sortBy: SortBy = 'title',
  sortOrder: SortOrder = 'asc',
  userProgress?: UserMeditationProgress
): MeditationSession[] => {
  const sorted = [...sessions];

  sorted.sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;

      case 'duration':
        comparison = toNumber(a.durationSeconds) - toNumber(b.durationSeconds);
        break;

      case 'level':
        comparison = a.level - b.level;
        break;

      case 'recent':
        if (userProgress) {
          const aRecent = getLastCompletionTime(a.id, userProgress);
          const bRecent = getLastCompletionTime(b.id, userProgress);
          comparison = bRecent - aRecent; // Most recent first
        }
        break;

      case 'popular':
        if (userProgress) {
          const aCount = getCompletionCount(a.id, userProgress);
          const bCount = getCompletionCount(b.id, userProgress);
          comparison = bCount - aCount; // Most completed first
        }
        break;

      case 'recommended':
        if (userProgress) {
          const aScore = getRecommendationScore(a, userProgress);
          const bScore = getRecommendationScore(b, userProgress);
          comparison = bScore - aScore; // Higher score first
        }
        break;

      default:
        comparison = 0;
    }

    // Apply sort order
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return sorted;
};

/**
 * Filter AND sort sessions in one go
 */
export const filterAndSortSessions = (
  sessions: MeditationSession[],
  filters: SessionFilters,
  userProgress?: UserMeditationProgress
): MeditationSession[] => {
  let result = filterSessions(sessions, filters, userProgress);

  if (filters.sortBy) {
    result = sortSessions(
      result,
      filters.sortBy,
      filters.sortOrder || 'asc',
      userProgress
    );
  }

  return result;
};

// ══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ══════════════════════════════════════════════════════════════

/**
 * Get last completion time for a session (timestamp)
 */
const getLastCompletionTime = (
  sessionId: number | string,
  progress: UserMeditationProgress
): number => {
  const completions = progress.completedSessions.filter(
    s => s.sessionId === sessionId
  );

  if (completions.length === 0) return 0;

  const latest = completions.reduce((latest, current) => {
    const currentTime = new Date(current.completedAt).getTime();
    const latestTime = new Date(latest.completedAt).getTime();
    return currentTime > latestTime ? current : latest;
  });

  return new Date(latest.completedAt).getTime();
};

/**
 * Get completion count for a session
 */
const getCompletionCount = (
  sessionId: number | string,
  progress: UserMeditationProgress
): number => {
  return progress.completedSessions.filter(
    s => s.sessionId === sessionId
  ).length;
};

/**
 * Calculate recommendation score for a session
 * Based on:
 * - User's level vs session level (match is good)
 * - Recent completions (boost if completed recently)
 * - Mood improvement (boost if session improved mood in past)
 * - Cultural preferences
 */
const getRecommendationScore = (
  session: MeditationSession,
  progress: UserMeditationProgress
): number => {
  let score = 0;

  // Level matching (prefer sessions at or slightly above user level)
  const levelDiff = session.level - progress.currentLevel;
  if (levelDiff === 0) score += 50; // Perfect match
  else if (levelDiff === 1) score += 30; // Slightly challenging
  else if (levelDiff === -1) score += 20; // Slightly easier
  else score -= Math.abs(levelDiff) * 10; // Too easy or too hard

  // Recent completion boost (if completed recently, boost slightly)
  const lastCompletion = getLastCompletionTime(session.id, progress);
  const daysSinceCompletion = (Date.now() - lastCompletion) / (1000 * 60 * 60 * 24);
  if (daysSinceCompletion > 0 && daysSinceCompletion < 7) {
    score += 15;
  }

  // Mood improvement boost
  const sessionCompletions = progress.completedSessions.filter(
    s => s.sessionId === session.id && s.moodBefore && s.moodAfter
  );
  if (sessionCompletions.length > 0) {
    const avgMoodImprovement = sessionCompletions.reduce((sum, s) => {
      return sum + ((s.moodAfter || 0) - (s.moodBefore || 0));
    }, 0) / sessionCompletions.length;

    score += avgMoodImprovement * 10;
  }

  // Cultural preference boost
  if (session.cultureTag && progress.favoriteInstructionIds) {
    // If user has completed sessions from this culture before
    const sameCultureCount = progress.completedSessions.filter(
      s => s.cultureTag === session.cultureTag
    ).length;

    if (sameCultureCount > 0) {
      score += Math.min(20, sameCultureCount * 2);
    }
  }

  // Purpose preference boost
  if (session.purposeTag && progress.sessionNotes) {
    // Check if user has notes/completions for this purpose
    const samePurposeCount = progress.completedSessions.filter(
      s => s.purposeTag === session.purposeTag
    ).length;

    if (samePurposeCount > 0) {
      score += Math.min(15, samePurposeCount * 2);
    }
  }

  return score;
};

// ══════════════════════════════════════════════════════════════
// AVAILABLE FILTERS ANALYSIS
// ══════════════════════════════════════════════════════════════

/**
 * Analyze sessions to get available filter options
 */
export const getAvailableFilters = (
  sessions: MeditationSession[]
): AvailableFilters => {
  const durations = new Set<number>();
  const levels = new Set<number>();
  const cultureCounts = new Map<string, number>();
  const purposeCounts = new Map<string, number>();

  sessions.forEach(session => {
    // Durations
    const durationMinutes = Math.round(session.durationSeconds / 60);
    durations.add(durationMinutes);

    // Levels
    levels.add(session.level);

    // Culture tags
    if (session.cultureTag) {
      cultureCounts.set(
        session.cultureTag,
        (cultureCounts.get(session.cultureTag) || 0) + 1
      );
    }

    // Purpose tags
    if (session.purposeTag) {
      purposeCounts.set(
        session.purposeTag,
        (purposeCounts.get(session.purposeTag) || 0) + 1
      );
    }
  });

  return {
    durations: Array.from(durations).sort((a, b) => a - b),
    levels: Array.from(levels).sort((a, b) => a - b),
    cultureTags: Array.from(cultureCounts.entries())
      .map(([tag, count]) => ({
        tag,
        count,
        nameKey: `cultures.${tag}.name`,
      }))
      .sort((a, b) => b.count - a.count),
    purposes: Array.from(purposeCounts.entries())
      .map(([purpose, count]) => ({
        purpose,
        count,
        nameKey: `purposes.${purpose}.name`,
      }))
      .sort((a, b) => b.count - a.count),
  };
};

// ══════════════════════════════════════════════════════════════
// FILTER PRESETS
// ══════════════════════════════════════════════════════════════

/**
 * Apply a filter preset
 */
export const applyFilterPreset = (presetId: string): SessionFilters => {
  const preset = FILTER_PRESETS.find(p => p.id === presetId);
  return preset?.filters || {};
};

/**
 * Check if filters are empty (no active filters)
 */
export const areFiltersEmpty = (filters: SessionFilters): boolean => {
  return (
    !filters.searchQuery &&
    (!filters.durations || filters.durations.length === 0) &&
    !filters.durationRange &&
    (!filters.levels || filters.levels.length === 0) &&
    (!filters.cultureTags || filters.cultureTags.length === 0) &&
    (!filters.purposes || filters.purposes.length === 0) &&
    !filters.showFavoritesOnly &&
    !filters.showCustomSessionsOnly &&
    !filters.showCompletedOnly &&
    !filters.showUncompletedOnly &&
    filters.hasInstructions === undefined &&
    (!filters.instructionTypes || filters.instructionTypes.length === 0)
  );
};

/**
 * Clear all filters
 */
export const clearFilters = (): SessionFilters => {
  return {
    sortBy: 'title',
    sortOrder: 'asc',
  };
};

/**
 * Count active filters
 */
export const countActiveFilters = (filters: SessionFilters): number => {
  let count = 0;

  if (filters.searchQuery) count++;
  if (filters.durations && filters.durations.length > 0) count++;
  if (filters.durationRange) count++;
  if (filters.levels && filters.levels.length > 0) count++;
  if (filters.cultureTags && filters.cultureTags.length > 0) count++;
  if (filters.purposes && filters.purposes.length > 0) count++;
  if (filters.showFavoritesOnly) count++;
  if (filters.showCustomSessionsOnly) count++;
  if (filters.showCompletedOnly) count++;
  if (filters.showUncompletedOnly) count++;
  if (filters.hasInstructions !== undefined) count++;
  if (filters.instructionTypes && filters.instructionTypes.length > 0) count++;

  return count;
};

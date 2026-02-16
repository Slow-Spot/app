import { logger } from './logger';
// ══════════════════════════════════════════════════════════════
// Achievement Helper Functions
// Check, unlock, and track achievement progress
// ══════════════════════════════════════════════════════════════

import {
  Achievement,
  UnlockedAchievement,
  AchievementProgress,
  AchievementStats,
  AchievementCategory,
  AchievementRarity,
} from '../types/achievements';
import { UserMeditationProgress } from '../types/userProgress';
import { ALL_ACHIEVEMENTS, ACHIEVEMENTS_MAP, ACHIEVEMENTS_BY_CATEGORY } from '../data/achievements';

// ══════════════════════════════════════════════════════════════
// CORE FUNCTIONS
// ══════════════════════════════════════════════════════════════

/**
 * Check for newly unlocked achievements
 * @param progress Current user progress
 * @param unlockedAchievements Previously unlocked achievements
 * @returns Array of newly unlocked achievements
 */
export const checkNewAchievements = (
  progress: UserMeditationProgress,
  unlockedAchievements: UnlockedAchievement[] = []
): Achievement[] => {
  const unlockedIds = new Set(unlockedAchievements.map(ua => ua.achievementId));
  const newAchievements: Achievement[] = [];

  for (const achievement of ALL_ACHIEVEMENTS) {
    // Skip if already unlocked (and not repeatable)
    if (unlockedIds.has(achievement.id) && !achievement.repeatable) {
      continue;
    }

    // Check if requirement is met
    try {
      if (achievement.requirement(progress)) {
        newAchievements.push(achievement);
      }
    } catch (error) {
      logger.error(`Error checking achievement ${achievement.id}:`, error);
    }
  }

  return newAchievements;
};

/**
 * Get all unlocked achievements for a user
 * @param progress Current user progress
 * @returns Array of unlocked achievements with metadata
 */
export const getUnlockedAchievements = (
  progress: UserMeditationProgress
): Achievement[] => {
  const unlocked: Achievement[] = [];

  for (const achievement of ALL_ACHIEVEMENTS) {
    try {
      if (achievement.requirement(progress)) {
        unlocked.push(achievement);
      }
    } catch (error) {
      logger.error(`Error checking achievement ${achievement.id}:`, error);
    }
  }

  return unlocked;
};

/**
 * Get progress toward an achievement (0-100%)
 * @param achievement Achievement to check
 * @param progress User progress
 * @returns Progress percentage (0-100) or null if not trackable
 */
export const getProgressTowardAchievement = (
  achievement: Achievement,
  progress: UserMeditationProgress
): AchievementProgress | null => {
  if (!achievement.progressTracker) {
    return null;
  }

  try {
    const tracker = achievement.progressTracker(progress);
    const percentage = Math.min(100, Math.round((tracker.current / tracker.target) * 100));

    return {
      achievementId: achievement.id,
      current: tracker.current,
      target: tracker.target,
      unit: tracker.unit,
      percentage,
    };
  } catch (error) {
    logger.error(`Error tracking progress for ${achievement.id}:`, error);
    return null;
  }
};

/**
 * Calculate total XP earned from achievements
 * @param progress User progress
 * @returns Total XP earned
 */
export const calculateTotalXP = (progress: UserMeditationProgress): number => {
  const unlockedAchievements = getUnlockedAchievements(progress);
  return unlockedAchievements.reduce((total, achievement) => {
    return total + achievement.rewardXP;
  }, 0);
};

/**
 * Calculate XP needed for next level
 * Uses exponential formula: XP = 100 * (level^2)
 */
export const getXPForLevel = (level: number): number => {
  return 100 * Math.pow(level, 2);
};

/**
 * Calculate user level based on total XP
 */
export const calculateLevelFromXP = (totalXP: number): number => {
  let level = 1;
  let xpRequired = 0;

  while (xpRequired <= totalXP) {
    level++;
    xpRequired = getXPForLevel(level);
  }

  return level - 1;
};

/**
 * Get progress to next level
 */
export const getProgressToNextLevel = (
  currentXP: number,
  currentLevel: number
): { current: number; needed: number; percentage: number } => {
  const xpForCurrentLevel = getXPForLevel(currentLevel);
  const xpForNextLevel = getXPForLevel(currentLevel + 1);

  const xpInCurrentLevel = currentXP - xpForCurrentLevel;
  const xpNeededForNext = xpForNextLevel - xpForCurrentLevel;

  const percentage = Math.min(100, Math.round((xpInCurrentLevel / xpNeededForNext) * 100));

  return {
    current: xpInCurrentLevel,
    needed: xpNeededForNext,
    percentage,
  };
};

// ══════════════════════════════════════════════════════════════
// STATISTICS & ANALYTICS
// ══════════════════════════════════════════════════════════════

/**
 * Get comprehensive achievement statistics
 */
export const getAchievementStats = (
  progress: UserMeditationProgress
): AchievementStats => {
  const unlockedAchievements = getUnlockedAchievements(progress);
  const unlockedIds = new Set(unlockedAchievements.map(a => a.id));

  // Total stats
  const totalAchievements = ALL_ACHIEVEMENTS.length;
  const unlockedCount = unlockedAchievements.length;
  const totalXP = ALL_ACHIEVEMENTS.reduce((sum, a) => sum + a.rewardXP, 0);
  const earnedXP = calculateTotalXP(progress);
  const completionPercentage = Math.round((unlockedCount / totalAchievements) * 100);

  // By category
  const categories: AchievementCategory[] = [
    'practice',
    'streak',
    'cultural',
    'mastery',
    'time',
    'special',
    'social',
  ];

  const byCategory = categories.reduce((stats, category) => {
    const categoryAchievements = ACHIEVEMENTS_BY_CATEGORY[category as keyof typeof ACHIEVEMENTS_BY_CATEGORY] || [];
    const unlockedInCategory = categoryAchievements.filter((a) =>
      unlockedIds.has(a.id)
    ).length;

    stats[category] = {
      total: categoryAchievements.length,
      unlocked: unlockedInCategory,
    };

    return stats;
  }, {} as Record<string, { total: number; unlocked: number }>);

  // By rarity
  const rarities: AchievementRarity[] = ['common', 'uncommon', 'rare', 'epic', 'legendary'];

  const byRarity = rarities.reduce((stats, rarity) => {
    const rarityAchievements = ALL_ACHIEVEMENTS.filter(a => a.rarity === rarity);
    const unlockedInRarity = rarityAchievements.filter(a =>
      unlockedIds.has(a.id)
    ).length;

    stats[rarity] = {
      total: rarityAchievements.length,
      unlocked: unlockedInRarity,
    };

    return stats;
  }, {} as Record<AchievementRarity, { total: number; unlocked: number }>);

  return {
    totalAchievements,
    unlockedCount,
    totalXP,
    earnedXP,
    completionPercentage,
    byCategory,
    byRarity,
  };
};

/**
 * Get achievements close to unlocking (>50% progress)
 */
export const getAlmostUnlockedAchievements = (
  progress: UserMeditationProgress
): Array<{ achievement: Achievement; progress: AchievementProgress }> => {
  const unlockedIds = new Set(
    getUnlockedAchievements(progress).map(a => a.id)
  );

  const almost: Array<{ achievement: Achievement; progress: AchievementProgress }> = [];

  for (const achievement of ALL_ACHIEVEMENTS) {
    // Skip unlocked
    if (unlockedIds.has(achievement.id)) continue;

    // Skip non-trackable
    if (!achievement.progressTracker) continue;

    const progressData = getProgressTowardAchievement(achievement, progress);
    if (progressData && progressData.percentage >= 50) {
      almost.push({
        achievement,
        progress: progressData,
      });
    }
  }

  // Sort by progress (closest to 100% first)
  almost.sort((a, b) => b.progress.percentage - a.progress.percentage);

  return almost;
};

/**
 * Get recommended achievements for user to work on
 * Based on current progress and achievability
 */
export const getRecommendedAchievements = (
  progress: UserMeditationProgress,
  limit: number = 3
): Achievement[] => {
  const unlockedIds = new Set(
    getUnlockedAchievements(progress).map(a => a.id)
  );

  const recommendations: Array<{
    achievement: Achievement;
    score: number;
  }> = [];

  for (const achievement of ALL_ACHIEVEMENTS) {
    // Skip unlocked
    if (unlockedIds.has(achievement.id)) continue;

    // Skip hidden achievements (let them be surprises)
    if (achievement.hidden) continue;

    let score = 0;

    // Factor 1: Progress (if trackable)
    if (achievement.progressTracker) {
      const progressData = getProgressTowardAchievement(achievement, progress);
      if (progressData) {
        score += progressData.percentage;
      }
    }

    // Factor 2: Rarity (easier achievements score higher)
    const rarityScore = {
      common: 50,
      uncommon: 40,
      rare: 30,
      epic: 20,
      legendary: 10,
    };
    score += rarityScore[achievement.rarity];

    // Factor 3: XP reward (higher rewards score higher)
    score += Math.min(50, achievement.rewardXP / 20);

    recommendations.push({ achievement, score });
  }

  // Sort by score and return top N
  recommendations.sort((a, b) => b.score - a.score);

  return recommendations.slice(0, limit).map(r => r.achievement);
};

// ══════════════════════════════════════════════════════════════
// LOOKUP & FILTERING
// ══════════════════════════════════════════════════════════════

/**
 * Get achievement by ID
 */
export const getAchievementById = (achievementId: string): Achievement | null => {
  return ACHIEVEMENTS_MAP[achievementId] || null;
};

/**
 * Filter achievements by category
 */
export const getAchievementsByCategory = (
  category: AchievementCategory
): Achievement[] => {
  return ACHIEVEMENTS_BY_CATEGORY[category as keyof typeof ACHIEVEMENTS_BY_CATEGORY] || [];
};

/**
 * Filter achievements by rarity
 */
export const getAchievementsByRarity = (rarity: AchievementRarity): Achievement[] => {
  return ALL_ACHIEVEMENTS.filter(a => a.rarity === rarity);
};

/**
 * Search achievements by title/description (requires i18n)
 * This is a simple implementation - enhance with actual i18n lookup
 */
export const searchAchievements = (query: string): Achievement[] => {
  const lowerQuery = query.toLowerCase();

  return ALL_ACHIEVEMENTS.filter(achievement => {
    // Search in ID, titleKey, descriptionKey
    return (
      achievement.id.toLowerCase().includes(lowerQuery) ||
      achievement.titleKey.toLowerCase().includes(lowerQuery) ||
      achievement.descriptionKey.toLowerCase().includes(lowerQuery) ||
      achievement.category.toLowerCase().includes(lowerQuery)
    );
  });
};

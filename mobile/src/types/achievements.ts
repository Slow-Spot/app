// ══════════════════════════════════════════════════════════════
// Achievement System Types
// Gamification & motivation through achievements and rewards
// ══════════════════════════════════════════════════════════════

import type { UserMeditationProgress } from './userProgress';

export type AchievementCategory =
  | 'practice'      // Session completion milestones
  | 'streak'        // Daily practice consistency
  | 'cultural'      // Cultural tradition exploration
  | 'mastery'       // Skill progression & expertise
  | 'special'       // Unique/fun achievements
  | 'time'          // Time-based achievements
  | 'social';       // Sharing & community (future)

export type AchievementRarity =
  | 'common'        // Easy to achieve
  | 'uncommon'      // Requires some effort
  | 'rare'          // Significant achievement
  | 'epic'          // Major milestone
  | 'legendary';    // Ultimate achievements

export interface Achievement {
  id: string;

  // Display
  titleKey: string;           // i18n key: achievements.firstSession.title
  descriptionKey: string;     // i18n key: achievements.firstSession.description
  icon: string;               // Emoji or icon name

  // Categorization
  category: AchievementCategory;
  rarity: AchievementRarity;

  // Requirements
  requirement: (progress: UserMeditationProgress) => boolean;

  // Rewards
  rewardXP: number;

  // Special properties
  hidden?: boolean;           // Secret achievement (show ??? until unlocked)
  repeatable?: boolean;       // Can be earned multiple times

  // Progress tracking (for incremental achievements)
  progressTracker?: (progress: UserMeditationProgress) => {
    current: number;
    target: number;
    unit?: string;            // e.g., "sessions", "minutes", "days"
  };
}

export interface UnlockedAchievement {
  achievementId: string;
  unlockedAt: Date;
  timesUnlocked?: number;     // For repeatable achievements
}

export interface AchievementProgress {
  achievementId: string;
  current: number;
  target: number;
  unit?: string;
  percentage: number;         // 0-100
}

// ══════════════════════════════════════════════════════════════
// Helper Types
// ══════════════════════════════════════════════════════════════

export interface AchievementNotification {
  achievement: Achievement;
  unlockedAt: Date;
  showConfetti?: boolean;
}

export interface AchievementStats {
  totalAchievements: number;
  unlockedCount: number;
  totalXP: number;
  earnedXP: number;
  completionPercentage: number;

  byCategory: Record<AchievementCategory, {
    total: number;
    unlocked: number;
  }>;

  byRarity: Record<AchievementRarity, {
    total: number;
    unlocked: number;
  }>;
}

// ══════════════════════════════════════════════════════════════
// Achievements Data
// 30+ achievements across all categories
// ══════════════════════════════════════════════════════════════

import { Achievement } from '../types/achievements';
import { UserMeditationProgress } from '../types/userProgress';

// ══════════════════════════════════════════════════════════════
// PRACTICE ACHIEVEMENTS - Session completion milestones
// ══════════════════════════════════════════════════════════════

const PRACTICE_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_session',
    titleKey: 'achievements.firstSession.title',
    descriptionKey: 'achievements.firstSession.description',
    icon: '🌟',
    category: 'practice',
    rarity: 'common',
    rewardXP: 10,
    requirement: (p) => p.completedSessions.length >= 1,
  },
  {
    id: 'ten_sessions',
    titleKey: 'achievements.tenSessions.title',
    descriptionKey: 'achievements.tenSessions.description',
    icon: '⭐',
    category: 'practice',
    rarity: 'common',
    rewardXP: 50,
    requirement: (p) => p.completedSessions.length >= 10,
    progressTracker: (p) => ({
      current: p.completedSessions.length,
      target: 10,
      unit: 'sessions',
    }),
  },
  {
    id: 'fifty_sessions',
    titleKey: 'achievements.fiftySessions.title',
    descriptionKey: 'achievements.fiftySessions.description',
    icon: '💫',
    category: 'practice',
    rarity: 'uncommon',
    rewardXP: 200,
    requirement: (p) => p.completedSessions.length >= 50,
    progressTracker: (p) => ({
      current: p.completedSessions.length,
      target: 50,
      unit: 'sessions',
    }),
  },
  {
    id: 'hundred_sessions',
    titleKey: 'achievements.hundredSessions.title',
    descriptionKey: 'achievements.hundredSessions.description',
    icon: '🏆',
    category: 'practice',
    rarity: 'rare',
    rewardXP: 500,
    requirement: (p) => p.completedSessions.length >= 100,
    progressTracker: (p) => ({
      current: p.completedSessions.length,
      target: 100,
      unit: 'sessions',
    }),
  },
  {
    id: 'thousand_sessions',
    titleKey: 'achievements.thousandSessions.title',
    descriptionKey: 'achievements.thousandSessions.description',
    icon: '👑',
    category: 'practice',
    rarity: 'legendary',
    rewardXP: 5000,
    requirement: (p) => p.completedSessions.length >= 1000,
    progressTracker: (p) => ({
      current: p.completedSessions.length,
      target: 1000,
      unit: 'sessions',
    }),
  },
];

// ══════════════════════════════════════════════════════════════
// STREAK ACHIEVEMENTS - Daily consistency
// ══════════════════════════════════════════════════════════════

const STREAK_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'streak_3',
    titleKey: 'achievements.streak3.title',
    descriptionKey: 'achievements.streak3.description',
    icon: '🔥',
    category: 'streak',
    rarity: 'common',
    rewardXP: 30,
    requirement: (p) => p.currentStreak >= 3,
  },
  {
    id: 'streak_7',
    titleKey: 'achievements.streak7.title',
    descriptionKey: 'achievements.streak7.description',
    icon: '🔥🔥',
    category: 'streak',
    rarity: 'uncommon',
    rewardXP: 100,
    requirement: (p) => p.currentStreak >= 7,
  },
  {
    id: 'streak_14',
    titleKey: 'achievements.streak14.title',
    descriptionKey: 'achievements.streak14.description',
    icon: '🔥🔥🔥',
    category: 'streak',
    rarity: 'rare',
    rewardXP: 250,
    requirement: (p) => p.currentStreak >= 14,
  },
  {
    id: 'streak_30',
    titleKey: 'achievements.streak30.title',
    descriptionKey: 'achievements.streak30.description',
    icon: '🌋',
    category: 'streak',
    rarity: 'epic',
    rewardXP: 600,
    requirement: (p) => p.currentStreak >= 30,
  },
  {
    id: 'streak_100',
    titleKey: 'achievements.streak100.title',
    descriptionKey: 'achievements.streak100.description',
    icon: '☀️',
    category: 'streak',
    rarity: 'legendary',
    rewardXP: 2000,
    requirement: (p) => p.currentStreak >= 100,
  },
  {
    id: 'streak_365',
    titleKey: 'achievements.streak365.title',
    descriptionKey: 'achievements.streak365.description',
    icon: '🎆',
    category: 'streak',
    rarity: 'legendary',
    rewardXP: 10000,
    requirement: (p) => p.currentStreak >= 365,
  },
];

// ══════════════════════════════════════════════════════════════
// CULTURAL ACHIEVEMENTS - Tradition exploration
// ══════════════════════════════════════════════════════════════

const CULTURAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'zen_explorer',
    titleKey: 'achievements.zenExplorer.title',
    descriptionKey: 'achievements.zenExplorer.description',
    icon: '🧘',
    category: 'cultural',
    rarity: 'uncommon',
    rewardXP: 150,
    requirement: (p) => {
      const zenSessions = p.completedSessions.filter(
        s => s.cultureTag === 'zen'
      );
      return zenSessions.length >= 5;
    },
    progressTracker: (p) => {
      const zenSessions = p.completedSessions.filter(
        s => s.cultureTag === 'zen'
      );
      return { current: zenSessions.length, target: 5, unit: 'Zen sessions' };
    },
  },
  {
    id: 'vipassana_practitioner',
    titleKey: 'achievements.vipassanaPractitioner.title',
    descriptionKey: 'achievements.vipassanaPractitioner.description',
    icon: '🕉️',
    category: 'cultural',
    rarity: 'uncommon',
    rewardXP: 150,
    requirement: (p) => {
      const vipassanaSessions = p.completedSessions.filter(
        s => s.cultureTag === 'vipassana'
      );
      return vipassanaSessions.length >= 5;
    },
    progressTracker: (p) => {
      const vipassanaSessions = p.completedSessions.filter(
        s => s.cultureTag === 'vipassana'
      );
      return { current: vipassanaSessions.length, target: 5, unit: 'Vipassana sessions' };
    },
  },
  {
    id: 'vedic_master',
    titleKey: 'achievements.vedicMaster.title',
    descriptionKey: 'achievements.vedicMaster.description',
    icon: '📿',
    category: 'cultural',
    rarity: 'rare',
    rewardXP: 200,
    requirement: (p) => {
      const vedicSessions = p.completedSessions.filter(
        s => s.cultureTag === 'vedic'
      );
      return vedicSessions.length >= 10;
    },
    progressTracker: (p) => {
      const vedicSessions = p.completedSessions.filter(
        s => s.cultureTag === 'vedic'
      );
      return { current: vedicSessions.length, target: 10, unit: 'Vedic sessions' };
    },
  },
  {
    id: 'taoist_sage',
    titleKey: 'achievements.taoistSage.title',
    descriptionKey: 'achievements.taoistSage.description',
    icon: '☯️',
    category: 'cultural',
    rarity: 'rare',
    rewardXP: 200,
    requirement: (p) => {
      const taoistSessions = p.completedSessions.filter(
        s => s.cultureTag === 'taoist'
      );
      return taoistSessions.length >= 10;
    },
  },
  {
    id: 'sufi_mystic',
    titleKey: 'achievements.sufiMystic.title',
    descriptionKey: 'achievements.sufiMystic.description',
    icon: '🌙',
    category: 'cultural',
    rarity: 'rare',
    rewardXP: 200,
    requirement: (p) => {
      const sufiSessions = p.completedSessions.filter(
        s => s.cultureTag === 'sufi'
      );
      return sufiSessions.length >= 10;
    },
  },
  {
    id: 'christian_contemplative',
    titleKey: 'achievements.christianContemplative.title',
    descriptionKey: 'achievements.christianContemplative.description',
    icon: '✝️',
    category: 'cultural',
    rarity: 'rare',
    rewardXP: 200,
    requirement: (p) => {
      const christianSessions = p.completedSessions.filter(
        s => s.cultureTag === 'christian'
      );
      return christianSessions.length >= 10;
    },
  },
  {
    id: 'world_traveler',
    titleKey: 'achievements.worldTraveler.title',
    descriptionKey: 'achievements.worldTraveler.description',
    icon: '🌍',
    category: 'cultural',
    rarity: 'epic',
    rewardXP: 1000,
    requirement: (p) => {
      const cultures = new Set(
        p.completedSessions.map(s => s.cultureTag).filter(Boolean)
      );
      return cultures.size >= 6; // All 6 cultural traditions
    },
    progressTracker: (p) => {
      const cultures = new Set(
        p.completedSessions.map(s => s.cultureTag).filter(Boolean)
      );
      return { current: cultures.size, target: 6, unit: 'traditions' };
    },
  },
];

// ══════════════════════════════════════════════════════════════
// MASTERY ACHIEVEMENTS - Skill progression
// ══════════════════════════════════════════════════════════════

const MASTERY_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'level_up',
    titleKey: 'achievements.levelUp.title',
    descriptionKey: 'achievements.levelUp.description',
    icon: '⬆️',
    category: 'mastery',
    rarity: 'common',
    rewardXP: 50,
    requirement: (p) => p.currentLevel >= 2,
  },
  {
    id: 'intermediate',
    titleKey: 'achievements.intermediate.title',
    descriptionKey: 'achievements.intermediate.description',
    icon: '📈',
    category: 'mastery',
    rarity: 'uncommon',
    rewardXP: 200,
    requirement: (p) => p.currentLevel >= 3,
  },
  {
    id: 'advanced',
    titleKey: 'achievements.advanced.title',
    descriptionKey: 'achievements.advanced.description',
    icon: '🎓',
    category: 'mastery',
    rarity: 'rare',
    rewardXP: 500,
    requirement: (p) => p.currentLevel >= 4,
  },
  {
    id: 'master',
    titleKey: 'achievements.master.title',
    descriptionKey: 'achievements.master.description',
    icon: '👨‍🏫',
    category: 'mastery',
    rarity: 'epic',
    rewardXP: 1000,
    requirement: (p) => p.currentLevel >= 5,
  },
  {
    id: 'time_dedication_100',
    titleKey: 'achievements.timeDedication100.title',
    descriptionKey: 'achievements.timeDedication100.description',
    icon: '⏱️',
    category: 'mastery',
    rarity: 'uncommon',
    rewardXP: 100,
    requirement: (p) => p.totalMeditationMinutes >= 100,
    progressTracker: (p) => ({
      current: p.totalMeditationMinutes,
      target: 100,
      unit: 'minutes',
    }),
  },
  {
    id: 'time_dedication_1000',
    titleKey: 'achievements.timeDedication1000.title',
    descriptionKey: 'achievements.timeDedication1000.description',
    icon: '⏳',
    category: 'mastery',
    rarity: 'rare',
    rewardXP: 1000,
    requirement: (p) => p.totalMeditationMinutes >= 1000,
    progressTracker: (p) => ({
      current: p.totalMeditationMinutes,
      target: 1000,
      unit: 'minutes',
    }),
  },
  {
    id: 'time_dedication_10000',
    titleKey: 'achievements.timeDedication10000.title',
    descriptionKey: 'achievements.timeDedication10000.description',
    icon: '♾️',
    category: 'mastery',
    rarity: 'legendary',
    rewardXP: 10000,
    requirement: (p) => p.totalMeditationMinutes >= 10000,
    progressTracker: (p) => ({
      current: p.totalMeditationMinutes,
      target: 10000,
      unit: 'minutes',
    }),
  },
];

// ══════════════════════════════════════════════════════════════
// TIME ACHIEVEMENTS - Time-based practices
// ══════════════════════════════════════════════════════════════

const TIME_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'early_bird',
    titleKey: 'achievements.earlyBird.title',
    descriptionKey: 'achievements.earlyBird.description',
    icon: '🌅',
    category: 'time',
    rarity: 'uncommon',
    rewardXP: 100,
    requirement: (p) => {
      const morningSessions = p.completedSessions.filter(s => {
        const hour = new Date(s.completedAt).getHours();
        return hour >= 5 && hour < 7;
      });
      return morningSessions.length >= 5;
    },
    progressTracker: (p) => {
      const morningSessions = p.completedSessions.filter(s => {
        const hour = new Date(s.completedAt).getHours();
        return hour >= 5 && hour < 7;
      });
      return {
        current: morningSessions.length,
        target: 5,
        unit: 'morning sessions',
      };
    },
  },
  {
    id: 'night_owl',
    titleKey: 'achievements.nightOwl.title',
    descriptionKey: 'achievements.nightOwl.description',
    icon: '🦉',
    category: 'time',
    rarity: 'uncommon',
    rewardXP: 100,
    requirement: (p) => {
      const nightSessions = p.completedSessions.filter(s => {
        const hour = new Date(s.completedAt).getHours();
        return hour >= 22 || hour < 5;
      });
      return nightSessions.length >= 5;
    },
  },
  {
    id: 'weekend_warrior',
    titleKey: 'achievements.weekendWarrior.title',
    descriptionKey: 'achievements.weekendWarrior.description',
    icon: '🏖️',
    category: 'time',
    rarity: 'uncommon',
    rewardXP: 80,
    requirement: (p) => {
      const weekendSessions = p.completedSessions.filter(s => {
        const day = new Date(s.completedAt).getDay();
        return day === 0 || day === 6; // Sunday or Saturday
      });
      return weekendSessions.length >= 10;
    },
  },
  {
    id: 'midday_refresh',
    titleKey: 'achievements.middayRefresh.title',
    descriptionKey: 'achievements.middayRefresh.description',
    icon: '☀️',
    category: 'time',
    rarity: 'uncommon',
    rewardXP: 80,
    requirement: (p) => {
      const middaySessions = p.completedSessions.filter(s => {
        const hour = new Date(s.completedAt).getHours();
        return hour >= 11 && hour < 14;
      });
      return middaySessions.length >= 10;
    },
  },
];

// ══════════════════════════════════════════════════════════════
// SPECIAL ACHIEVEMENTS - Fun & unique
// ══════════════════════════════════════════════════════════════

const SPECIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'perfectionist',
    titleKey: 'achievements.perfectionist.title',
    descriptionKey: 'achievements.perfectionist.description',
    icon: '💯',
    category: 'special',
    rarity: 'rare',
    rewardXP: 300,
    requirement: (p) => {
      const last10 = p.completedSessions.slice(-10);
      return (
        last10.length >= 10 &&
        last10.every(s => s.completedFully)
      );
    },
    hidden: true,
  },
  {
    id: 'mood_improver',
    titleKey: 'achievements.moodImprover.title',
    descriptionKey: 'achievements.moodImprover.description',
    icon: '😊',
    category: 'special',
    rarity: 'uncommon',
    rewardXP: 150,
    requirement: (p) => {
      const sessionsWithMoodBoost = p.completedSessions.filter(
        s =>
          s.moodBefore !== undefined &&
          s.moodAfter !== undefined &&
          s.moodAfter > s.moodBefore
      );
      return sessionsWithMoodBoost.length >= 20;
    },
  },
  {
    id: 'marathon_meditator',
    titleKey: 'achievements.marathonMeditator.title',
    descriptionKey: 'achievements.marathonMeditator.description',
    icon: '🏃',
    category: 'special',
    rarity: 'epic',
    rewardXP: 500,
    requirement: (p) => {
      const longSessions = p.completedSessions.filter(
        s => (s.durationSeconds ?? s.actualDurationSeconds ?? 0) >= 1200 // 20+ minutes
      );
      return longSessions.length >= 10;
    },
    hidden: true,
  },
  {
    id: 'explorer',
    titleKey: 'achievements.explorer.title',
    descriptionKey: 'achievements.explorer.description',
    icon: '🗺️',
    category: 'special',
    rarity: 'rare',
    rewardXP: 250,
    requirement: (p) => {
      const uniqueSessions = new Set(
        p.completedSessions.map(s => s.sessionId)
      );
      return uniqueSessions.size >= 20; // Tried 20 different sessions
    },
    progressTracker: (p) => {
      const uniqueSessions = new Set(
        p.completedSessions.map(s => s.sessionId)
      );
      return {
        current: uniqueSessions.size,
        target: 20,
        unit: 'unique sessions',
      };
    },
  },
  {
    id: 'completionist',
    titleKey: 'achievements.completionist.title',
    descriptionKey: 'achievements.completionist.description',
    icon: '🎯',
    category: 'special',
    rarity: 'legendary',
    rewardXP: 5000,
    requirement: (p) => {
      const uniqueSessions = new Set(
        p.completedSessions.map(s => s.sessionId)
      );
      return uniqueSessions.size >= 40; // Completed all 40 sessions
    },
    progressTracker: (p) => {
      const uniqueSessions = new Set(
        p.completedSessions.map(s => s.sessionId)
      );
      return {
        current: uniqueSessions.size,
        target: 40,
        unit: 'sessions',
      };
    },
  },
  {
    id: 'reflection_master',
    titleKey: 'achievements.reflectionMaster.title',
    descriptionKey: 'achievements.reflectionMaster.description',
    icon: '📝',
    category: 'special',
    rarity: 'uncommon',
    rewardXP: 100,
    requirement: (p) => {
      const sessionsWithNotes = p.completedSessions.filter(
        s => s.notes && s.notes.length > 0
      );
      return sessionsWithNotes.length >= 25;
    },
  },
];

// ══════════════════════════════════════════════════════════════
// EXPORT ALL ACHIEVEMENTS
// ══════════════════════════════════════════════════════════════

export const ALL_ACHIEVEMENTS: Achievement[] = [
  ...PRACTICE_ACHIEVEMENTS,
  ...STREAK_ACHIEVEMENTS,
  ...CULTURAL_ACHIEVEMENTS,
  ...MASTERY_ACHIEVEMENTS,
  ...TIME_ACHIEVEMENTS,
  ...SPECIAL_ACHIEVEMENTS,
];

// Create lookup map for fast access
export const ACHIEVEMENTS_MAP = ALL_ACHIEVEMENTS.reduce(
  (map, achievement) => {
    map[achievement.id] = achievement;
    return map;
  },
  {} as Record<string, Achievement>
);

// Export by category for easier filtering
export const ACHIEVEMENTS_BY_CATEGORY = {
  practice: PRACTICE_ACHIEVEMENTS,
  streak: STREAK_ACHIEVEMENTS,
  cultural: CULTURAL_ACHIEVEMENTS,
  mastery: MASTERY_ACHIEVEMENTS,
  time: TIME_ACHIEVEMENTS,
  special: SPECIAL_ACHIEVEMENTS,
};

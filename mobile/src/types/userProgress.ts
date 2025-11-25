// ══════════════════════════════════════════════════════════════
// User Progress Tracking Types
// Complete system for tracking meditation practice & growth
// ══════════════════════════════════════════════════════════════

export type MoodRating = 1 | 2 | 3 | 4 | 5;
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'master';
export type InstructionStyle = 'detailed' | 'moderate' | 'minimal' | 'none';

// ══════════════════════════════════════════════════════════════
// Main User Progress Interface
// ══════════════════════════════════════════════════════════════

export interface UserMeditationProgress {
  userId: string;
  createdAt: string;
  lastUpdated: string;

  // ─────────────────────────────────────────────────────────────
  // Session History & Statistics
  // ─────────────────────────────────────────────────────────────
  completedSessions: SessionCompletion[];
  totalMeditationMinutes: number;
  totalSessions: number;

  // Streaks
  currentStreak: number; // Days
  longestStreak: number; // Days
  lastMeditationDate: string; // ISO date

  // ─────────────────────────────────────────────────────────────
  // Skill Progression
  // ─────────────────────────────────────────────────────────────
  currentLevel: 1 | 2 | 3 | 4 | 5;
  experiencePoints: number;
  experienceLevel: ExperienceLevel;
  unlockedSessions: number[]; // Session IDs unlocked by progress

  // ─────────────────────────────────────────────────────────────
  // Preferences & Customization
  // ─────────────────────────────────────────────────────────────
  preferredInstructionStyle: InstructionStyle;
  alwaysSkipInstructions: boolean;
  voiceGuidanceEnabled: boolean;
  hapticFeedbackEnabled: boolean;

  // Favorites & Custom
  favoriteSessions: number[]; // Session IDs
  hiddenSessions: number[]; // Session IDs user wants to hide
  customSessions: CustomSession[]; // User-created sessions
  favoriteInstructionIds: string[];

  // ─────────────────────────────────────────────────────────────
  // Cultural & Technique Preferences
  // ─────────────────────────────────────────────────────────────
  preferredCultures: string[]; // 'zen', 'vipassana', etc.
  preferredOccasions: string[]; // 'morning', 'stress', etc.

  // ─────────────────────────────────────────────────────────────
  // Reflections & Insights
  // ─────────────────────────────────────────────────────────────
  sessionNotes: SessionNote[];
  moodTracker: MoodEntry[];
  insights: Insight[];

  // ─────────────────────────────────────────────────────────────
  // Achievements & Gamification
  // ─────────────────────────────────────────────────────────────
  unlockedAchievements: string[]; // Achievement IDs
  badges: Badge[];

  // ─────────────────────────────────────────────────────────────
  // Advanced Settings
  // ─────────────────────────────────────────────────────────────
  breathingPrepDuration: number; // Seconds (0 = skip)
  reminderFrequency: 'frequent' | 'normal' | 'rare' | 'none';
  preferredBreathingPattern: 'box' | '4-7-8' | 'equal' | 'calm';
}

// ══════════════════════════════════════════════════════════════
// Session Completion Tracking
// ══════════════════════════════════════════════════════════════

export interface SessionCompletion {
  id: string; // Unique completion ID
  sessionId: number | string;
  sessionTitle: string;

  // Session metadata (for filtering/sorting completed sessions)
  cultureTag?: string;
  purposeTag?: string;
  level: number;

  // Timing
  startedAt: string; // ISO datetime
  completedAt: string; // ISO datetime
  plannedDurationSeconds: number;
  actualDurationSeconds: number;
  durationSeconds?: number;

  // Completion status
  completedFully: boolean; // Did they finish or quit early?
  quitReason?: 'distracted' | 'uncomfortable' | 'time' | 'other';
  completionPercentage: number; // 0-100

  // Mood & Reflection
  moodBefore?: MoodRating;
  moodAfter?: MoodRating;
  energyBefore?: MoodRating;
  energyAfter?: MoodRating;

  // Quick feedback
  difficulty?: 'too_easy' | 'just_right' | 'too_hard';
  enjoyment?: MoodRating;
  helpfulness?: MoodRating;

  // Optional notes for achievements and reflection
  notes?: string;

  // Experience points earned
  xpEarned: number;
}

// ══════════════════════════════════════════════════════════════
// Session Notes & Reflections
// ══════════════════════════════════════════════════════════════

export interface SessionNote {
  id: string;
  sessionId: number;
  sessionCompletionId: string;
  date: string; // ISO datetime

  // Free-form reflection
  note: string;

  // Structured insights
  insights?: string[]; // Pre-selected tags like "More calm", "Less stressed"
  challenges?: string[]; // "Mind wandering", "Physical discomfort", etc.
  breakthroughs?: string[]; // Moments of clarity or understanding

  // Future intentions
  wantToTryAgain: boolean;
  suggestedImprovements?: string;
}

// ══════════════════════════════════════════════════════════════
// Mood Tracking
// ══════════════════════════════════════════════════════════════

export interface MoodEntry {
  id: string;
  date: string; // ISO datetime
  sessionCompletionId: string;
  sessionId: number;

  // Mood metrics
  beforeMeditation: MoodRating;
  afterMeditation: MoodRating;
  moodChange: number; // Calculated: afterMeditation - beforeMeditation

  // Energy metrics
  energyBefore?: MoodRating;
  energyAfter?: MoodRating;
  energyChange?: number;

  // Context
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  dayOfWeek: number; // 0-6
}

// ══════════════════════════════════════════════════════════════
// Insights & Patterns
// ══════════════════════════════════════════════════════════════

export interface Insight {
  id: string;
  date: string;
  type: 'pattern' | 'achievement' | 'suggestion' | 'milestone';

  titleKey: string; // Translation key
  descriptionKey: string; // Translation key

  // Data backing the insight
  data?: Record<string, any>;

  // User interaction
  acknowledged: boolean;
  helpful?: boolean;
}

// ══════════════════════════════════════════════════════════════
// Achievements & Badges
// ══════════════════════════════════════════════════════════════

export interface Badge {
  id: string;
  achievementId: string;
  earnedAt: string; // ISO datetime
  seen: boolean; // Has user seen the celebration?
}

// ══════════════════════════════════════════════════════════════
// Custom Sessions (User-Created)
// ══════════════════════════════════════════════════════════════

export interface CustomSession {
  id: number; // Custom ID (starts from 10000 to avoid conflicts)
  baseSessionId?: number; // If cloned from existing session

  // Basic info
  title: string;
  description: string;
  durationSeconds: number;
  level: 1 | 2 | 3 | 4 | 5;

  // Customization
  instructionId?: string;
  ambientFrequency?: number;
  chimeFrequency?: number;

  // Custom tags
  customTags: string[];
  cultureTag?: string;

  // Metadata
  createdAt: string;
  lastModified: string;
  timesCompleted: number;
  isFavorite: boolean;
}

// ══════════════════════════════════════════════════════════════
// Experience Point System
// ══════════════════════════════════════════════════════════════

export const XP_REWARDS = {
  SESSION_COMPLETED: 10,
  SESSION_COMPLETED_FULLY: 20,
  FIRST_SESSION_OF_DAY: 5,
  STREAK_MAINTAINED: 15,
  REFLECTION_ADDED: 5,
  NEW_SESSION_TYPE: 10,
  LEVEL_UP_BONUS: 100,
} as const;

export const LEVEL_XP_REQUIREMENTS = {
  1: 0,
  2: 100,
  3: 300,
  4: 600,
  5: 1000,
} as const;

// ══════════════════════════════════════════════════════════════
// Helper Types
// ══════════════════════════════════════════════════════════════

export interface StreakInfo {
  current: number;
  longest: number;
  daysUntilNextMilestone: number;
  nextMilestone: number; // 7, 14, 30, etc.
}

export interface ProgressSummary {
  totalMinutes: number;
  totalSessions: number;
  currentStreak: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
  favoriteSessionCount: number;
  mostFrequentTime: 'morning' | 'afternoon' | 'evening' | 'night';
  averageMoodImprovement: number;
}

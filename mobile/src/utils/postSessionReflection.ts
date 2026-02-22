// ══════════════════════════════════════════════════════════════
// Post-Session Reflection Utilities
// Help users reflect on their practice and track mood/insights
// ══════════════════════════════════════════════════════════════

import { v4 as uuidv4 } from 'uuid';
import type {
  SessionCompletion,
  SessionNote,
  MoodEntry,
  MoodRating,
} from '../types/userProgress';
import type { MeditationSession } from '../services/api';

// ══════════════════════════════════════════════════════════════
// QUICK INSIGHTS
// Pre-defined insight tags users can select
// ══════════════════════════════════════════════════════════════

export const INSIGHT_TAGS = {
  positive: [
    'more_calm',
    'less_stressed',
    'more_focused',
    'more_present',
    'more_energized',
    'more_patient',
    'more_grateful',
    'deeper_relaxation',
    'mental_clarity',
    'emotional_release',
  ],
  challenges: [
    'mind_wandering',
    'physical_discomfort',
    'restlessness',
    'drowsiness',
    'difficulty_focusing',
    'time_dragged',
    'external_distractions',
    'emotional_difficulty',
  ],
  breakthroughs: [
    'deep_stillness',
    'moment_of_clarity',
    'emotional_insight',
    'physical_release',
    'new_understanding',
    'letting_go',
    'acceptance',
    'connection',
  ],
} as const;

// ══════════════════════════════════════════════════════════════
// REFLECTION PROMPTS
// Thoughtful questions to guide reflection
// ══════════════════════════════════════════════════════════════

export const REFLECTION_PROMPTS = [
  {
    id: 'mood_change',
    questionKey: 'reflection.prompts.moodChange.question',
    applicable: (before?: MoodRating, after?: MoodRating) =>
      before !== undefined && after !== undefined && after !== before,
  },
  {
    id: 'difficulty_notice',
    questionKey: 'reflection.prompts.difficultyNotice.question',
    applicable: (before?: MoodRating, after?: MoodRating, difficulty?: string) =>
      difficulty !== 'just_right',
  },
  {
    id: 'what_noticed',
    questionKey: 'reflection.prompts.whatNoticed.question',
    applicable: () => true, // Always applicable
  },
  {
    id: 'carry_forward',
    questionKey: 'reflection.prompts.carryForward.question',
    applicable: () => true,
  },
  {
    id: 'tomorrow_different',
    questionKey: 'reflection.prompts.tomorrowDifferent.question',
    applicable: () => true,
  },
];

// ══════════════════════════════════════════════════════════════
// REFLECTION CREATION
// ══════════════════════════════════════════════════════════════

/**
 * Create a session completion record
 */
export const createSessionCompletion = (
  session: MeditationSession,
  params: {
    startedAt: Date;
    completedAt: Date;
    completedFully: boolean;
    actualDurationSeconds: number;
    moodBefore?: MoodRating;
    moodAfter?: MoodRating;
    energyBefore?: MoodRating;
    energyAfter?: MoodRating;
    difficulty?: 'too_easy' | 'just_right' | 'too_hard';
    enjoyment?: MoodRating;
    helpfulness?: MoodRating;
    quitReason?: 'distracted' | 'uncomfortable' | 'time' | 'other';
  }
): SessionCompletion => {
  const completionPercentage = Math.min(
    100,
    Math.round((params.actualDurationSeconds / session.durationSeconds) * 100)
  );

  // Calculate XP earned
  let xpEarned = 10; // Base XP
  if (params.completedFully) xpEarned += 10;
  if (completionPercentage >= 100) xpEarned += 5;
  if (params.moodAfter && params.moodBefore && params.moodAfter > params.moodBefore) {
    xpEarned += 5; // Bonus for mood improvement
  }

  return {
    id: uuidv4(),
    sessionId: session.id,
    sessionTitle: session.title,
    cultureTag: session.cultureTag,
    purposeTag: session.purposeTag,
    level: session.level,
    startedAt: params.startedAt.toISOString(),
    completedAt: params.completedAt.toISOString(),
    plannedDurationSeconds: Number(session.durationSeconds || 0),
    actualDurationSeconds: params.actualDurationSeconds,
    completedFully: params.completedFully,
    quitReason: params.quitReason,
    completionPercentage,
    moodBefore: params.moodBefore,
    moodAfter: params.moodAfter,
    energyBefore: params.energyBefore,
    energyAfter: params.energyAfter,
    difficulty: params.difficulty,
    enjoyment: params.enjoyment,
    helpfulness: params.helpfulness,
    xpEarned,
  };
};

/**
 * Create a session note/reflection
 */
export const createSessionNote = (
  sessionId: number,
  sessionCompletionId: string,
  params: {
    note?: string;
    insights?: string[];
    challenges?: string[];
    breakthroughs?: string[];
    wantToTryAgain?: boolean;
    suggestedImprovements?: string;
  }
): SessionNote => {
  return {
    id: uuidv4(),
    sessionId,
    sessionCompletionId,
    date: new Date().toISOString(),
    note: params.note || '',
    insights: params.insights,
    challenges: params.challenges,
    breakthroughs: params.breakthroughs,
    wantToTryAgain: params.wantToTryAgain ?? true,
    suggestedImprovements: params.suggestedImprovements,
  };
};

/**
 * Create a mood entry
 */
export const createMoodEntry = (
  sessionId: number,
  sessionCompletionId: string,
  beforeMeditation: MoodRating,
  afterMeditation: MoodRating,
  energyBefore?: MoodRating,
  energyAfter?: MoodRating
): MoodEntry => {
  const now = new Date();
  const hour = now.getHours();
  const dayOfWeek = now.getDay();

  let timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  if (hour >= 5 && hour < 12) timeOfDay = 'morning';
  else if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
  else if (hour >= 17 && hour < 21) timeOfDay = 'evening';
  else timeOfDay = 'night';

  return {
    id: uuidv4(),
    date: now.toISOString(),
    sessionCompletionId,
    sessionId,
    beforeMeditation,
    afterMeditation,
    moodChange: afterMeditation - beforeMeditation,
    energyBefore,
    energyAfter,
    energyChange: energyBefore && energyAfter ? energyAfter - energyBefore : undefined,
    timeOfDay,
    dayOfWeek,
  };
};

// ══════════════════════════════════════════════════════════════
// INSIGHTS & ANALYSIS
// ══════════════════════════════════════════════════════════════

/**
 * Calculate mood improvement percentage
 */
export const calculateMoodImprovement = (
  before: MoodRating,
  after: MoodRating
): number => {
  const change = after - before;
  return Math.round((change / 4) * 100); // 4 is max possible change (1 to 5)
};

/**
 * Determine if session was successful based on metrics
 */
export const wasSessionSuccessful = (completion: SessionCompletion): boolean => {
  let successScore = 0;

  // Completed fully
  if (completion.completedFully) successScore += 30;

  // Mood improvement
  if (
    completion.moodBefore &&
    completion.moodAfter &&
    completion.moodAfter > completion.moodBefore
  ) {
    successScore += 30;
  }

  // High enjoyment
  if (completion.enjoyment && completion.enjoyment >= 4) {
    successScore += 20;
  }

  // High helpfulness
  if (completion.helpfulness && completion.helpfulness >= 4) {
    successScore += 20;
  }

  return successScore >= 50; // Success threshold
};

/**
 * Get suggested next session based on current completion
 */
export const getSuggestedNextSession = (
  completion: SessionCompletion,
  allSessions: MeditationSession[]
): MeditationSession | null => {
  // If session was successful and user enjoyed it
  if (wasSessionSuccessful(completion)) {
    // Find sessions with similar attributes
    const similarSessions = allSessions.filter(
      s =>
        s.id !== completion.sessionId &&
        (s.cultureTag === completion.cultureTag ||
          s.purposeTag === completion.purposeTag ||
          s.level === completion.level)
    );

    if (similarSessions.length > 0) {
      return similarSessions[Math.floor(Math.random() * similarSessions.length)] ?? null;
    }
  }

  // If session was too easy, suggest higher level
  if (completion.difficulty === 'too_easy') {
    const harderSessions = allSessions.filter(
      s =>
        s.id !== completion.sessionId &&
        s.level > completion.level &&
        s.purposeTag === completion.purposeTag
    );

    if (harderSessions.length > 0) {
      return harderSessions[0] ?? null;
    }
  }

  // If session was too hard, suggest easier
  if (completion.difficulty === 'too_hard') {
    const easierSessions = allSessions.filter(
      s =>
        s.id !== completion.sessionId &&
        s.level < completion.level &&
        s.purposeTag === completion.purposeTag
    );

    if (easierSessions.length > 0) {
      return easierSessions[0] ?? null;
    }
  }

  return null;
};

/**
 * Get applicable reflection prompts for this session
 */
export const getApplicablePrompts = (
  completion: SessionCompletion
): Array<{ id: string; questionKey: string }> => {
  return REFLECTION_PROMPTS.filter(prompt =>
    prompt.applicable(
      completion.moodBefore,
      completion.moodAfter,
      completion.difficulty
    )
  );
};

// ══════════════════════════════════════════════════════════════
// STREAKS & CONSISTENCY
// ══════════════════════════════════════════════════════════════

/**
 * Calculate current meditation streak
 */
export const calculateStreak = (completions: SessionCompletion[]): number => {
  if (completions.length === 0) return 0;

  // Sort by date (most recent first)
  const sorted = [...completions].sort(
    (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );

  let streak = 0;
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (const completion of sorted) {
    const completionDate = new Date(completion.completedAt);
    completionDate.setHours(0, 0, 0, 0);

    const daysDiff = Math.floor(
      (currentDate.getTime() - completionDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff === streak) {
      streak++;
    } else if (daysDiff > streak) {
      break; // Streak broken
    }
  }

  return streak;
};

/**
 * Check if user meditated today
 */
export const hasMeditatedToday = (completions: SessionCompletion[]): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return completions.some(completion => {
    const completionDate = new Date(completion.completedAt);
    completionDate.setHours(0, 0, 0, 0);
    return completionDate.getTime() === today.getTime();
  });
};

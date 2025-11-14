/**
 * Well-being Assessment Types
 * Defines types for pre/post session questionnaires
 */

/**
 * Question types for well-being assessment
 */
export type QuestionType = 'scale' | 'emotion' | 'text';

/**
 * Single question in well-being assessment
 */
export interface WellbeingQuestion {
  id: string;
  text: string;
  type: QuestionType;
  /** For scale type: min and max values */
  scaleRange?: { min: number; max: number; minLabel: string; maxLabel: string };
  /** For emotion type: available emotions */
  emotions?: string[];
}

/**
 * Answer to a well-being question
 */
export interface WellbeingAnswer {
  questionId: string;
  /** For scale: number, for emotion: string, for text: string */
  value: number | string;
  timestamp: string;
}

/**
 * Complete well-being assessment
 */
export interface WellbeingAssessment {
  id: string;
  sessionId?: string;
  customSessionId?: string;
  type: 'pre' | 'post';
  answers: WellbeingAnswer[];
  completedAt: string;
}

/**
 * Pre-defined questions
 */
export const PRE_SESSION_QUESTIONS: WellbeingQuestion[] = [
  {
    id: 'pre_mood',
    text: 'How are you feeling right now?',
    type: 'emotion',
    emotions: ['😊 Calm', '😌 Content', '😐 Neutral', '😟 Anxious', '😔 Sad', '😤 Stressed'],
  },
  {
    id: 'pre_energy',
    text: 'What is your energy level?',
    type: 'scale',
    scaleRange: { min: 1, max: 10, minLabel: 'Very Low', maxLabel: 'Very High' },
  },
  {
    id: 'pre_focus',
    text: 'How focused do you feel?',
    type: 'scale',
    scaleRange: { min: 1, max: 10, minLabel: 'Scattered', maxLabel: 'Very Focused' },
  },
];

export const POST_SESSION_QUESTIONS: WellbeingQuestion[] = [
  {
    id: 'post_mood',
    text: 'How do you feel after the session?',
    type: 'emotion',
    emotions: ['😊 Calm', '😌 Content', '😐 Neutral', '😟 Anxious', '😔 Sad', '😴 Relaxed'],
  },
  {
    id: 'post_helpful',
    text: 'How helpful was this session?',
    type: 'scale',
    scaleRange: { min: 1, max: 10, minLabel: 'Not Helpful', maxLabel: 'Very Helpful' },
  },
  {
    id: 'post_peace',
    text: 'How peaceful do you feel?',
    type: 'scale',
    scaleRange: { min: 1, max: 10, minLabel: 'Restless', maxLabel: 'Very Peaceful' },
  },
  {
    id: 'post_notes',
    text: 'Any notes or reflections? (optional)',
    type: 'text',
  },
];

/**
 * Well-being Service
 * Manages pre/post session questionnaire data
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { WellbeingAssessment, WellbeingAnswer } from '../types/wellbeing';

const STORAGE_KEY = '@wellbeing_assessments';

/**
 * Generate unique ID for assessment
 */
const generateId = (): string => {
  return `wellbeing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Save a well-being assessment
 */
export const saveAssessment = async (
  type: 'pre' | 'post',
  answers: WellbeingAnswer[],
  sessionId?: string,
  customSessionId?: string
): Promise<WellbeingAssessment> => {
  const assessments = await getAssessments();

  const newAssessment: WellbeingAssessment = {
    id: generateId(),
    type,
    sessionId,
    customSessionId,
    answers,
    completedAt: new Date().toISOString(),
  };

  assessments.push(newAssessment);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(assessments));

  return newAssessment;
};

/**
 * Get all assessments
 */
export const getAssessments = async (): Promise<WellbeingAssessment[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading assessments:', error);
    return [];
  }
};

/**
 * Get assessments for a specific session
 */
export const getSessionAssessments = async (
  sessionId?: string,
  customSessionId?: string
): Promise<{ pre?: WellbeingAssessment; post?: WellbeingAssessment }> => {
  const assessments = await getAssessments();

  const filtered = assessments.filter(
    (a) =>
      (sessionId && a.sessionId === sessionId) ||
      (customSessionId && a.customSessionId === customSessionId)
  );

  return {
    pre: filtered.find((a) => a.type === 'pre'),
    post: filtered.find((a) => a.type === 'post'),
  };
};

/**
 * Get recent assessments
 */
export const getRecentAssessments = async (
  limit: number = 10
): Promise<WellbeingAssessment[]> => {
  const assessments = await getAssessments();
  return assessments
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .slice(0, limit);
};

/**
 * Calculate average scores for scale questions
 */
export const calculateAverageScores = async (
  questionId: string,
  days: number = 30
): Promise<number> => {
  const assessments = await getAssessments();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const relevantAnswers = assessments
    .filter((a) => new Date(a.completedAt) >= cutoffDate)
    .flatMap((a) => a.answers)
    .filter((ans) => ans.questionId === questionId && typeof ans.value === 'number');

  if (relevantAnswers.length === 0) return 0;

  const sum = relevantAnswers.reduce((acc, ans) => acc + (ans.value as number), 0);
  return sum / relevantAnswers.length;
};

/**
 * Get mood trends over time
 */
export const getMoodTrends = async (
  days: number = 30
): Promise<{ date: string; preScore: number; postScore: number }[]> => {
  const assessments = await getAssessments();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const recent = assessments.filter((a) => new Date(a.completedAt) >= cutoffDate);

  const byDate: { [key: string]: { pre: number[]; post: number[] } } = {};

  recent.forEach((assessment) => {
    const date = new Date(assessment.completedAt).toISOString().split('T')[0];

    if (!byDate[date]) {
      byDate[date] = { pre: [], post: [] };
    }

    const moodQuestion = assessment.answers.find((a) =>
      a.questionId.includes('mood')
    );

    if (moodQuestion && typeof moodQuestion.value === 'string') {
      // Convert emotion to numeric score (simplified)
      const emotionScore = getEmotionScore(moodQuestion.value);
      if (assessment.type === 'pre') {
        byDate[date].pre.push(emotionScore);
      } else {
        byDate[date].post.push(emotionScore);
      }
    }
  });

  return Object.entries(byDate).map(([date, scores]) => ({
    date,
    preScore: scores.pre.length > 0 ? average(scores.pre) : 0,
    postScore: scores.post.length > 0 ? average(scores.post) : 0,
  }));
};

/**
 * Convert emotion string to numeric score
 */
const getEmotionScore = (emotion: string): number => {
  const emotionMap: { [key: string]: number } = {
    Calm: 5,
    Content: 4,
    Neutral: 3,
    Anxious: 2,
    Sad: 1,
    Stressed: 1,
    Relaxed: 5,
  };

  for (const [key, value] of Object.entries(emotionMap)) {
    if (emotion.includes(key)) {
      return value;
    }
  }

  return 3; // Default neutral
};

/**
 * Calculate average
 */
const average = (numbers: number[]): number => {
  return numbers.reduce((a, b) => a + b, 0) / numbers.length;
};

import { logger } from '../utils/logger';
/**
 * Well-being Questionnaire Screen
 * Pre or post session well-being assessment
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../theme';
import { brandColors } from '../theme/colors';
import {
  WellbeingQuestion as QuestionType,
  WellbeingAnswer,
  PRE_SESSION_QUESTIONS,
  POST_SESSION_QUESTIONS,
} from '../types/wellbeing';
import { saveAssessment } from '../services/wellbeingService';
import WellbeingQuestion from '../components/WellbeingQuestion';

interface Props {
  navigation: { goBack: () => void };
  route: {
    params: {
      type: 'pre' | 'post';
      sessionId?: string;
      customSessionId?: string;
      onComplete?: () => void;
    };
  };
}

const WellbeingQuestionnaireScreen: React.FC<Props> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { type, sessionId, customSessionId, onComplete } = route.params;
  const questions = type === 'pre' ? PRE_SESSION_QUESTIONS : POST_SESSION_QUESTIONS;

  const [answers, setAnswers] = useState<{ [key: string]: number | string }>({});
  const [loading, setLoading] = useState(false);

  const handleAnswer = (questionId: string, value: number | string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    // Validate required questions (all except optional text)
    const requiredQuestions = questions.filter((q) => q.type !== 'text');
    const missingAnswers = requiredQuestions.filter((q) => !answers[q.id]);

    if (missingAnswers.length > 0) {
      Alert.alert(t('wellbeing.missingAnswersTitle'), t('wellbeing.missingAnswersMessage'));
      return;
    }

    setLoading(true);
    try {
      const answerArray: WellbeingAnswer[] = Object.entries(answers).map(
        ([questionId, value]) => ({
          questionId,
          value,
          timestamp: new Date().toISOString(),
        })
      );

      await saveAssessment(type, answerArray, sessionId, customSessionId);

      if (onComplete) {
        onComplete();
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert(t('wellbeing.errorTitle'), t('wellbeing.errorSaveMessage'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.neutral.white, theme.colors.neutral.offWhite]}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {type === 'pre' ? t('wellbeing.preTitle') : t('wellbeing.postTitle')}
            </Text>
            <Text style={styles.subtitle}>
              {type === 'pre'
                ? t('wellbeing.preSubtitle')
                : t('wellbeing.postSubtitle')}
            </Text>
          </View>

          {questions.map((question) => (
            <WellbeingQuestion
              key={question.id}
              question={question}
              value={answers[question.id]}
              onChange={(value) => handleAnswer(question.id, value)}
            />
          ))}

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.submitButtonText}>
                {loading ? t('wellbeing.saving') : type === 'pre' ? t('wellbeing.continue') : t('wellbeing.complete')}
              </Text>
            </TouchableOpacity>

            {type === 'pre' && (
              <TouchableOpacity
                style={styles.skipButton}
                onPress={() => {
                  if (onComplete) {
                    onComplete();
                  }
                  navigation.goBack();
                }}
              >
                <Text style={styles.skipButtonText}>{t('wellbeing.skip')}</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.fontSizes.xxl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.neutral.charcoal[100],
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.neutral.gray[600],
  },
  footer: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xxl,
  },
  submitButton: {
    backgroundColor: brandColors.purple.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: theme.colors.text.inverse,
  },
  skipButton: {
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  skipButtonText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.neutral.gray[600],
  },
});

export default WellbeingQuestionnaireScreen;

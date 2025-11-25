import { logger } from '../utils/logger';
/**
 * Wellbeing Question Component
 * Displays a single question in well-being assessment
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import theme from '../theme';
import { WellbeingQuestion as QuestionType } from '../types/wellbeing';

interface Props {
  question: QuestionType;
  value?: number | string;
  onChange: (value: number | string) => void;
}

export const WellbeingQuestion: React.FC<Props> = ({ question, value, onChange }) => {
  const [textValue, setTextValue] = useState(typeof value === 'string' ? value : '');

  const renderScaleQuestion = () => {
    const { scaleRange } = question;
    if (!scaleRange) return null;

    const currentValue = typeof value === 'number' ? value : scaleRange.min;

    return (
      <View style={styles.scaleContainer}>
        <View style={styles.scaleLabels}>
          <Text style={styles.scaleLabel}>{scaleRange.minLabel}</Text>
          <Text style={styles.scaleLabel}>{scaleRange.maxLabel}</Text>
        </View>

        <View style={styles.scaleButtons}>
          {Array.from(
            { length: scaleRange.max - scaleRange.min + 1 },
            (_, i) => scaleRange.min + i
          ).map((num) => (
            <TouchableOpacity
              key={num}
              style={[
                styles.scaleButton,
                currentValue === num && styles.scaleButtonActive,
              ]}
              onPress={() => onChange(num)}
            >
              <Text
                style={[
                  styles.scaleButtonText,
                  currentValue === num && styles.scaleButtonTextActive,
                ]}
              >
                {num}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderEmotionQuestion = () => {
    const { emotions } = question;
    if (!emotions) return null;

    return (
      <View style={styles.emotionContainer}>
        {emotions.map((emotion) => (
          <TouchableOpacity
            key={emotion}
            style={[
              styles.emotionButton,
              value === emotion && styles.emotionButtonActive,
            ]}
            onPress={() => onChange(emotion)}
          >
            <Text
              style={[
                styles.emotionButtonText,
                value === emotion && styles.emotionButtonTextActive,
              ]}
            >
              {emotion}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderTextQuestion = () => {
    return (
      <TextInput
        style={styles.textInput}
        value={textValue}
        onChangeText={(text) => {
          setTextValue(text);
          onChange(text);
        }}
        placeholder="Your thoughts..."
        placeholderTextColor={theme.colors.neutral.gray[400]}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>{question.text}</Text>

      {question.type === 'scale' && renderScaleQuestion()}
      {question.type === 'emotion' && renderEmotionQuestion()}
      {question.type === 'text' && renderTextQuestion()}
    </View>
  );
};

const styles = StyleSheet.create<any>({
  container: {
    marginBottom: theme.spacing.xl,
  },
  questionText: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.neutral.charcoal[100],
    marginBottom: theme.spacing.md,
  },
  scaleContainer: {
    width: '100%',
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  scaleLabel: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.neutral.gray[600],
  },
  scaleButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scaleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.neutral.gray[200],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.neutral.gray[300],
  },
  scaleButtonActive: {
    backgroundColor: theme.colors.accent.blue[500],
    borderColor: theme.colors.accent.blue[600],
  },
  scaleButtonText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.neutral.gray[700],
    fontWeight: theme.typography.fontWeights.medium,
  },
  scaleButtonTextActive: {
    color: theme.colors.text.inverse,
  },
  emotionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  emotionButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.neutral.gray[100],
    borderWidth: 1,
    borderColor: theme.colors.neutral.gray[300],
  },
  emotionButtonActive: {
    backgroundColor: theme.colors.accent.blue[100],
    borderColor: theme.colors.accent.blue[500],
  },
  emotionButtonText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.neutral.gray[700],
  },
  emotionButtonTextActive: {
    color: theme.colors.accent.blue[600],
    fontWeight: theme.typography.fontWeights.medium,
  },
  textInput: {
    backgroundColor: theme.colors.neutral.gray[100],
    borderWidth: 1,
    borderColor: theme.colors.neutral.gray[300],
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text.primary,
    minHeight: 100,
  },
});

export default WellbeingQuestion;

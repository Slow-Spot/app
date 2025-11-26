import { logger } from '../utils/logger';
/**
 * Instructions Screen
 * Meditation techniques and session building guides
 */

import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import theme, { getThemeColors, getThemeGradients } from '../theme';

interface Technique {
  id: string;
  name: string;
  description: string;
  steps: string[];
  duration: string;
}

const MEDITATION_TECHNIQUES: Technique[] = [
  {
    id: 'body_scan',
    name: 'Body Scan',
    description: 'Progressive relaxation technique moving attention through the body',
    duration: '10-20 minutes',
    steps: [
      'Lie down comfortably or sit in a relaxed position',
      'Close your eyes and take a few deep breaths',
      'Bring attention to your toes, notice any sensations',
      'Slowly move attention up through feet, ankles, calves',
      'Continue scanning upward: thighs, hips, abdomen',
      'Move through chest, shoulders, arms, hands',
      'Scan neck, face, and top of head',
      'Hold awareness of your whole body for a moment',
      'Gently open your eyes when ready',
    ],
  },
  {
    id: 'breath_focus',
    name: 'Breath Focus',
    description: 'Concentration practice using the breath as an anchor',
    duration: '5-15 minutes',
    steps: [
      'Sit comfortably with a straight back',
      'Close your eyes or soften your gaze',
      'Notice the natural rhythm of your breathing',
      'Feel the breath at your nostrils, chest, or belly',
      'When mind wanders, gently return to the breath',
      'Count breaths if helpful (1-10, then repeat)',
      'Continue for your chosen duration',
      'End with a few deeper breaths',
    ],
  },
  {
    id: 'loving_kindness',
    name: 'Loving Kindness (Metta)',
    description: 'Cultivating compassion and goodwill toward self and others',
    duration: '10-20 minutes',
    steps: [
      'Sit comfortably and close your eyes',
      'Begin with yourself: "May I be happy, may I be healthy"',
      'Visualize someone you love, send them kindness',
      'Think of a neutral person, extend kindness to them',
      'Consider someone difficult, wish them well',
      'Expand to all beings everywhere',
      'Rest in the feeling of universal compassion',
    ],
  },
  {
    id: 'mindful_observation',
    name: 'Mindful Observation',
    description: 'Present moment awareness through sensory observation',
    duration: '5-10 minutes',
    steps: [
      'Choose an object (flower, candle flame, etc.)',
      'Sit comfortably and bring full attention to the object',
      'Notice colors, shapes, textures in detail',
      'Observe without judgment or analysis',
      'When mind wanders, return to observing',
      'Expand awareness to sounds and sensations',
      'Conclude with gratitude for the present moment',
    ],
  },
];

const SESSION_GUIDES = [
  {
    title: 'Simple 12-Minute Practice',
    description: 'Recommended structure from "Sharpen Your Mind"',
    structure: [
      '2 min - Settle in, breath awareness',
      '3 min - Body scan (quick version)',
      '5 min - Focus on breath',
      '2 min - Loving kindness',
    ],
  },
  {
    title: 'Deep Relaxation Session',
    description: 'For stress relief and deep rest',
    structure: [
      '3 min - Breathing exercises',
      '10 min - Full body scan',
      '5 min - Rest in stillness',
      '2 min - Gradual return',
    ],
  },
];

interface Props {
  isDark?: boolean;
  navigation: any;
}

const InstructionsScreen: React.FC<Props> = ({ isDark = false, navigation }) => {
  // Theme-aware colors and gradients
  const colors = useMemo(() => getThemeColors(isDark), [isDark]);
  const themeGradients = useMemo(() => getThemeGradients(isDark), [isDark]);

  // Dynamic styles based on theme
  const dynamicStyles = useMemo(() => ({
    title: { color: colors.text.primary },
    subtitle: { color: colors.text.secondary },
    sectionTitle: { color: colors.text.primary },
    card: {
      backgroundColor: isDark ? colors.neutral.charcoal[200] : colors.neutral.white,
      shadowColor: isDark ? '#000' : '#000',
      shadowOpacity: isDark ? 0.3 : 0.1,
    },
    cardTitle: { color: colors.accent.blue[600] },
    cardDescription: { color: colors.text.secondary },
    duration: { color: colors.text.tertiary },
    stepNumber: {
      backgroundColor: isDark ? colors.accent.blue[900] : colors.accent.blue[100],
    },
    stepNumberText: { color: colors.accent.blue[600] },
    stepText: { color: colors.text.primary },
    buildingIntro: { color: colors.text.secondary },
    structureText: { color: colors.text.primary },
  }), [colors, isDark]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={themeGradients.screen.home.colors}
        start={themeGradients.screen.home.start}
        end={themeGradients.screen.home.end}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={[styles.title, dynamicStyles.title]}>Meditation Guides</Text>
            <Text style={[styles.subtitle, dynamicStyles.subtitle]}>
              Learn techniques and how to build your practice
            </Text>
          </View>

          {/* Techniques Section */}
          <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>Techniques</Text>
          {MEDITATION_TECHNIQUES.map((technique) => (
            <View key={technique.id} style={[styles.card, dynamicStyles.card]}>
              <Text style={[styles.cardTitle, dynamicStyles.cardTitle]}>{technique.name}</Text>
              <Text style={[styles.cardDescription, dynamicStyles.cardDescription]}>{technique.description}</Text>
              <Text style={[styles.duration, dynamicStyles.duration]}>Duration: {technique.duration}</Text>

              <View style={styles.stepsContainer}>
                {technique.steps.map((step, index) => (
                  <View key={index} style={styles.stepRow}>
                    <View style={[styles.stepNumber, dynamicStyles.stepNumber]}>
                      <Text style={[styles.stepNumberText, dynamicStyles.stepNumberText]}>{index + 1}</Text>
                    </View>
                    <Text style={[styles.stepText, dynamicStyles.stepText]}>{step}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}

          {/* Session Building Section */}
          <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle, { marginTop: theme.spacing.xl }]}>
            How to Build a Session
          </Text>
          <Text style={[styles.buildingIntro, dynamicStyles.buildingIntro]}>
            Combine techniques to create a complete meditation session.
            Start with settling, move through a main technique, and end with integration.
          </Text>

          {SESSION_GUIDES.map((guide, index) => (
            <View key={index} style={[styles.card, dynamicStyles.card]}>
              <Text style={[styles.cardTitle, dynamicStyles.cardTitle]}>{guide.title}</Text>
              <Text style={[styles.cardDescription, dynamicStyles.cardDescription]}>{guide.description}</Text>

              {guide.structure.map((item, idx) => (
                <View key={idx} style={styles.structureItem}>
                  <Text style={[styles.structureText, dynamicStyles.structureText]}>• {item}</Text>
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create<any>({
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
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.neutral.gray[600],
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: theme.colors.neutral.charcoal[100],
    marginBottom: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.neutral.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: theme.colors.accent.blue[600],
    marginBottom: theme.spacing.xs,
  },
  cardDescription: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.neutral.gray[600],
    marginBottom: theme.spacing.sm,
  },
  duration: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.neutral.gray[500],
    fontStyle: 'italic',
    marginBottom: theme.spacing.md,
  },
  stepsContainer: {
    marginTop: theme.spacing.sm,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.accent.blue[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  stepNumberText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.accent.blue[600],
    fontWeight: theme.typography.fontWeights.semiBold,
  },
  stepText: {
    flex: 1,
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.neutral.gray[700],
    lineHeight: 22,
  },
  buildingIntro: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.neutral.gray[600],
    marginBottom: theme.spacing.lg,
    lineHeight: 22,
  },
  structureItem: {
    marginTop: theme.spacing.xs,
  },
  structureText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.neutral.gray[700],
    lineHeight: 22,
  },
});

export default InstructionsScreen;

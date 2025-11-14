import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { MeditationSession } from '../services/api';
import { GradientCard } from './GradientCard';
import { getGradientForLevel } from '../theme/gradients';
import theme from '../theme';

interface SessionCardProps {
  session: MeditationSession;
  onPress: () => void;
}

const getLevelLabel = (level: number): string => {
  const levels = ['beginner', 'intermediate', 'advanced', 'expert', 'master'];
  return levels[level - 1] || 'beginner';
};

const getGuidanceText = (level: number, t: any): string => {
  // Beginners: Detailed step-by-step instructions
  if (level === 1) {
    return t('meditation.beginnerGuidance') || '1. Find a quiet space\n2. Sit comfortably\n3. Close your eyes\n4. Follow the voice guidance';
  }
  // Intermediate: Brief reminders
  if (level === 2) {
    return t('meditation.intermediateGuidance') || 'Find your comfortable position, breathe naturally';
  }
  // Advanced+: Minimal or no text (just ambient)
  return t('meditation.advancedGuidance') || 'Settle into stillness';
};

const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  return `${minutes} min`;
};

// ✨ React.memo for performance optimization - Prevents unnecessary re-renders
export const SessionCard = React.memo<SessionCardProps>(({ session, onPress }) => {
  const { t } = useTranslation();
  const gradient = getGradientForLevel(getLevelLabel(session.level));

  // Use translation keys if available, otherwise fall back to direct values
  const title = session.titleKey ? t(session.titleKey) : session.title;
  const description = session.descriptionKey ? t(session.descriptionKey) : session.description;

  return (
    <GradientCard gradient={gradient} onPress={onPress} style={styles.card}>
      {/* Card Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {description && (
          <Text style={styles.description}>{description}</Text>
        )}

        {/* Guidance for beginners */}
        {session.level === 1 && (
          <View style={styles.guidanceBox}>
            <Text style={styles.guidanceText}>{getGuidanceText(session.level, t)}</Text>
          </View>
        )}

        {/* Minimal guidance for intermediate+ */}
        {session.level > 1 && (
          <Text style={styles.minimalGuidance}>{getGuidanceText(session.level, t)}</Text>
        )}
      </View>

      {/* Card Footer */}
      <View style={styles.footer}>
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.label}>{t('meditation.duration')}:</Text>
            <Text style={styles.value}>{formatDuration(session.durationSeconds)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>{t('meditation.level')}:</Text>
            <Text style={styles.value}>{t(`meditation.${getLevelLabel(session.level)}`)}</Text>
          </View>
        </View>

        <View style={styles.startBadge}>
          <Text style={styles.startBadgeText}>▶ {t('meditation.start')}</Text>
        </View>
      </View>
    </GradientCard>
  );
});

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.md,
  },
  header: {
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  description: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.sm,
  },
  guidanceBox: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  guidanceText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.primary,
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.sm,
  },
  minimalGuidance: {
    marginTop: theme.spacing.sm,
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  detailsContainer: {
    gap: theme.spacing.xs,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  label: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.fontWeights.medium,
  },
  value: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeights.semiBold,
  },
  startBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  startBadgeText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.semiBold,
  },
});

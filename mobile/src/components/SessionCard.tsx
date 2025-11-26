import { logger } from '../utils/logger';
import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { MeditationSession } from '../services/api';
import { SavedCustomSession } from '../services/customSessionStorage';
import { GradientCard } from './GradientCard';
import { getThemeGradients } from '../theme/gradients';
import theme, { getThemeColors } from '../theme';

interface SessionCardProps {
  session: MeditationSession;
  onPress: () => void;
  onLongPress?: () => void;
  isCustom?: boolean;
  isDark?: boolean;
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

/**
 * Generate localized description for custom sessions
 */
const getCustomSessionDescription = (session: SavedCustomSession, t: any): string => {
  const minutes = Math.floor(session.durationSeconds / 60);
  const ambientSound = session.config?.ambientSound || 'silence';

  // Get translated ambient sound name
  const soundKey = `custom.ambient${ambientSound.charAt(0).toUpperCase() + ambientSound.slice(1)}`;
  const soundName = t(soundKey) || ambientSound;

  // Use translation template: "X min meditation with Y"
  return t('custom.sessionDescription', {
    minutes,
    ambientSound: soundName
  }) || `${minutes} min meditation with ${soundName}`;
};

// ✨ React.memo for performance optimization - Prevents unnecessary re-renders
export const SessionCard = React.memo<SessionCardProps>(({ session, onPress, onLongPress, isCustom, isDark = false }) => {
  const { t } = useTranslation();

  // Theme-aware colors and gradients
  const colors = useMemo(() => getThemeColors(isDark), [isDark]);
  const themeGradients = useMemo(() => getThemeGradients(isDark), [isDark]);
  const gradient = themeGradients.getGradientForLevel(getLevelLabel(session.level));

  // Dynamic styles based on theme
  const dynamicStyles = useMemo(() => ({
    title: { color: colors.text.primary },
    description: { color: colors.text.secondary },
    guidanceText: { color: colors.text.primary },
    minimalGuidance: { color: colors.text.secondary },
    label: { color: colors.text.secondary },
    value: { color: colors.text.primary },
    startBadgeText: { color: colors.text.primary },
    customBadgeIconColor: colors.accent.blue[600],
    // Theme-aware semi-transparent backgrounds
    guidanceBoxBg: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)',
    startBadgeBg: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.4)',
    customBadgeBg: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)',
  }), [colors, isDark]);

  // Use translation keys if available, otherwise fall back to direct values
  const title = session.titleKey ? t(session.titleKey) : session.title;

  // For custom sessions, generate localized description dynamically
  const description = useMemo(() => {
    if (isCustom && (session as SavedCustomSession).config) {
      return getCustomSessionDescription(session as SavedCustomSession, t);
    }
    return session.descriptionKey ? t(session.descriptionKey) : session.description;
  }, [session, isCustom, t]);

  return (
    <GradientCard gradient={gradient} onPress={onPress} onLongPress={onLongPress} style={styles.card} isDark={isDark}>
      {/* Card Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, dynamicStyles.title]}>{title}</Text>
          {isCustom && (
            <View style={[styles.customBadge, { backgroundColor: dynamicStyles.customBadgeBg }]}>
              <Ionicons name="star" size={16} color={dynamicStyles.customBadgeIconColor} />
            </View>
          )}
        </View>
        {description && (
          <Text style={[styles.description, dynamicStyles.description]}>{description}</Text>
        )}

        {/* Guidance for beginners */}
        {session.level === 1 && (
          <View style={[styles.guidanceBox, { backgroundColor: dynamicStyles.guidanceBoxBg }]}>
            <Text style={[styles.guidanceText, dynamicStyles.guidanceText]}>{getGuidanceText(session.level, t)}</Text>
          </View>
        )}

        {/* Minimal guidance for intermediate+ */}
        {session.level > 1 && (
          <Text style={[styles.minimalGuidance, dynamicStyles.minimalGuidance]}>{getGuidanceText(session.level, t)}</Text>
        )}
      </View>

      {/* Card Footer */}
      <View style={styles.footer}>
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={[styles.label, dynamicStyles.label]}>{t('meditation.duration')}:</Text>
            <Text style={[styles.value, dynamicStyles.value]}>{formatDuration(session.durationSeconds)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.label, dynamicStyles.label]}>{t('meditation.level')}:</Text>
            <Text style={[styles.value, dynamicStyles.value]}>{t(`meditation.${getLevelLabel(session.level)}`)}</Text>
          </View>
        </View>

        <View style={[styles.startBadge, { backgroundColor: dynamicStyles.startBadgeBg }]}>
          <Text style={[styles.startBadgeText, dynamicStyles.startBadgeText]}>▶ {t('meditation.start')}</Text>
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  title: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: theme.colors.text.primary,
    flex: 1,
  },
  customBadge: {
    borderRadius: theme.borderRadius.full,
    padding: theme.spacing.xs,
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

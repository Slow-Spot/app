/**
 * AchievementBadge Component
 * Displays individual achievement with icon, title, and progress
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Achievement, AchievementProgress } from '../types/achievements';
import theme from '../theme';

interface AchievementBadgeProps {
  achievement: Achievement;
  unlocked: boolean;
  progress?: AchievementProgress | null;
  compact?: boolean;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  achievement,
  unlocked,
  progress,
  compact = false,
}) => {
  const { t } = useTranslation();

  // Get rarity color
  const rarityColors = {
    common: theme.colors.text.tertiary,
    uncommon: theme.colors.accent.mint[600],
    rare: theme.colors.accent.blue[600],
    epic: theme.colors.accent.purple[600],
    legendary: '#FFB02E', // Gold color for legendary achievements
  };

  const rarityColor = rarityColors[achievement.rarity];

  // Get display text
  const title = achievement.hidden && !unlocked
    ? '???'
    : t(achievement.titleKey) || achievement.titleKey;

  const description = achievement.hidden && !unlocked
    ? t('achievements.hidden') || 'Secret achievement'
    : t(achievement.descriptionKey) || achievement.descriptionKey;

  if (compact) {
    return (
      <View style={[styles.compactContainer, !unlocked && styles.locked]}>
        <Text style={styles.compactIcon}>{achievement.icon}</Text>
        {progress && !unlocked && (
          <View style={styles.progressBadge}>
            <Text style={styles.progressText}>{progress.percentage}%</Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={[styles.container, !unlocked && styles.locked]}>
      <View style={[styles.iconContainer, { borderColor: rarityColor }]}>
        <Text style={styles.icon}>{achievement.icon}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
        {progress && !unlocked && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${progress.percentage}%`,
                    backgroundColor: rarityColor,
                  },
                ]}
              />
            </View>
            <Text style={styles.progressLabel}>
              {progress.current}/{progress.target} {progress.unit || ''}
            </Text>
          </View>
        )}
        {unlocked && (
          <View style={styles.unlockedBadge}>
            <Text style={styles.xpText}>+{achievement.rewardXP} XP</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    gap: theme.spacing.md,
  },
  locked: {
    opacity: 0.5,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.primary,
  },
  icon: {
    fontSize: 32,
  },
  content: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  title: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: theme.colors.text.primary,
  },
  description: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.fontSizes.sm * 1.4,
  },
  progressContainer: {
    marginTop: theme.spacing.xs,
    gap: theme.spacing.xs,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: theme.colors.border.light,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressLabel: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.text.tertiary,
  },
  unlockedBadge: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.accent.mint[100],
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: theme.borderRadius.sm,
    marginTop: theme.spacing.xs,
  },
  xpText: {
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: theme.colors.accent.mint[700],
  },
  // Compact variant styles
  compactContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary,
    borderWidth: 2,
    borderColor: theme.colors.border.light,
    position: 'relative',
  },
  compactIcon: {
    fontSize: 32,
  },
  progressBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: theme.colors.accent.blue[600],
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  progressText: {
    fontSize: 10,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.neutral.white,
  },
});

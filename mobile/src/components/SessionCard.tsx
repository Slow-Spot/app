import React, { useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated as RNAnimated } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import Animated from 'react-native-reanimated';
import { screenElementAnimation } from '../utils/animations';
import { MeditationSession } from '../services/api';
import { CustomSession } from '../services/customSessionStorage';
import { AnimatedPressable } from './AnimatedPressable';
import theme, { getThemeColors, getCardStyles, getSwipeActionColors } from '../theme';
import { getSectionColors, featureColorPalettes } from '../theme/colors';
import { usePersonalization } from '../contexts/PersonalizationContext';

interface SessionCardProps {
  session: MeditationSession;
  onPress: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isCustom?: boolean;
  isDark?: boolean;
  /** Index for staggered entry animation (starts at 0) */
  animationIndex?: number;
}

const formatDuration = (seconds: number, t: any): string => {
  const minutes = Math.floor(seconds / 60);
  return t('meditation.minutes', '{{count}} min', { count: minutes });
};

/**
 * Get breathing pattern display name
 */
const getBreathingPatternName = (pattern: string | undefined, t: any): string => {
  if (!pattern || pattern === 'none') return '';
  const patterns: Record<string, string> = {
    'box': t('custom.breathingBox', 'Box Breathing'),
    '4-7-8': t('custom.breathing478', '4-7-8'),
    'equal': t('custom.breathingEqual', 'Equal Breathing'),
    'calm': t('custom.breathingCalm', 'Calm Breathing'),
    'custom': t('custom.breathingCustom', 'Custom'),
  };
  return patterns[pattern] || '';
};

/**
 * Get ambient sound display name
 */
const getAmbientSoundName = (sound: string | undefined, t: any): string => {
  if (!sound || sound === 'silence') return t('custom.ambientSilence', 'Silence');
  const sounds: Record<string, string> = {
    'nature': t('custom.ambientNature', 'Nature'),
    'ocean': t('custom.ambientOcean', 'Ocean'),
    'forest': t('custom.ambientForest', 'Forest'),
    'rain': t('custom.ambientRain', 'Rain'),
    'fire': t('custom.ambientFire', 'Fire'),
    'wind': t('custom.ambientWind', 'Wind'),
    'custom': t('custom.ambientCustom', 'Custom'),
  };
  return sounds[sound] || sound;
};

// SessionCard with swipe-to-reveal actions
export const SessionCard = React.memo<SessionCardProps>(({
  session,
  onPress,
  onEdit,
  onDelete,
  isCustom,
  isDark = false,
  animationIndex = 0
}) => {
  const { t } = useTranslation();
  const { currentTheme, settings } = usePersonalization();
  const swipeableRef = useRef<Swipeable>(null);

  // Theme-aware colors and styles from global theme
  const colors = useMemo(() => getThemeColors(isDark), [isDark]);
  const sectionColors = useMemo(() => getSectionColors(isDark), [isDark]);
  const globalCardStyles = useMemo(() => getCardStyles(isDark), [isDark]);
  const swipeColors = useMemo(() => getSwipeActionColors(isDark), [isDark]);

  // Default session uses rose palette (flower theme)
  const defaultSessionColors = useMemo(() => ({
    icon: isDark ? featureColorPalettes.rose.darkIcon : featureColorPalettes.rose.lightIcon,
    background: isDark ? featureColorPalettes.rose[800] : featureColorPalettes.rose.light,
  }), [isDark]);

  // Get custom session config for displaying details
  const customConfig = isCustom ? (session as CustomSession).config : null;

  // Check if this is the default evidence-based session
  const isDefaultSession = session.id === 'default-mindful-breathing';

  // Use translation keys if available, otherwise fall back to direct values
  const title = session.titleKey ? t(session.titleKey) : session.title;

  // Get ambient sound name for display
  const ambientSound = customConfig?.ambientSound
    ? getAmbientSoundName(customConfig.ambientSound, t)
    : '';

  // Get breathing pattern for display
  const breathingPattern = customConfig?.breathingPattern
    ? getBreathingPatternName(customConfig.breathingPattern, t)
    : '';

  // Get interval bell info for display
  const intervalBellInfo = customConfig?.intervalBellEnabled
    ? `${customConfig.intervalBellMinutes} min`
    : '';

  // Close swipeable after action
  const closeSwipeable = () => {
    swipeableRef.current?.close();
  };

  // Handle edit with haptic
  const handleEdit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    closeSwipeable();
    onEdit?.();
  };

  // Handle delete with haptic
  const handleDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    closeSwipeable();
    onDelete?.();
  };

  // Render right swipe actions (Edit + Delete)
  const renderRightActions = (
    progress: RNAnimated.AnimatedInterpolation<number>,
    dragX: RNAnimated.AnimatedInterpolation<number>
  ) => {
    // Only show actions for custom sessions
    if (!isCustom || (!onEdit && !onDelete)) return null;

    const translateX = dragX.interpolate({
      inputRange: [-120, 0],
      outputRange: [0, 120],
      extrapolate: 'clamp',
    });

    return (
      <RNAnimated.View
        style={[
          styles.actionsContainer,
          { transform: [{ translateX }] }
        ]}
      >
        {onEdit && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: swipeColors.edit.background }]}
            onPress={handleEdit}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={t('custom.edit', 'Edit')}
            accessibilityHint={t('accessibility.editSessionHint', 'Edit this meditation session')}
          >
            <Ionicons name="pencil" size={20} color={swipeColors.edit.icon} />
            <Text style={[styles.actionText, { color: swipeColors.edit.text }]}>{t('custom.edit', 'Edit')}</Text>
          </TouchableOpacity>
        )}
        {onDelete && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: swipeColors.delete.background }]}
            onPress={handleDelete}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={t('custom.delete', 'Delete')}
            accessibilityHint={t('accessibility.deleteSessionHint', 'Delete this meditation session')}
          >
            <Ionicons name="trash-outline" size={20} color={swipeColors.delete.icon} />
            <Text style={[styles.actionText, { color: swipeColors.delete.text }]}>{t('custom.delete', 'Delete')}</Text>
          </TouchableOpacity>
        )}
      </RNAnimated.View>
    );
  };

  // Card content component - uses global cardStyles.secondary
  // Style structure matches HomeScreen secondaryCard for consistent shadows
  const CardContent = (
    <AnimatedPressable
      onPress={onPress}
      style={[styles.card, globalCardStyles.secondary]}
      pressScale={0.98}
      hapticType="light"
      accessibilityLabel={`${title}, ${formatDuration(session.durationSeconds, t)}`}
    >
      {/* Icon Section */}
      <View style={[
        styles.iconContainer,
        {
          backgroundColor: isDefaultSession
            ? defaultSessionColors.background
            : sectionColors.meditation.background
        }
      ]}>
        <Ionicons
          name={isDefaultSession ? 'flower-outline' : 'leaf-outline'}
          size={22}
          color={isDefaultSession ? defaultSessionColors.icon : sectionColors.meditation.icon}
        />
      </View>

      {/* Middle Section - Title and Tags */}
      <View style={styles.infoSection}>
        <Text style={[styles.title, { color: colors.text.primary }]} numberOfLines={1}>
          {title}
        </Text>

        {/* Tags Row - compact info */}
        <View style={styles.tagsRow}>
          <Text style={[styles.tagText, { color: colors.text.secondary }]}>
            {formatDuration(session.durationSeconds, t)}
          </Text>
          {ambientSound && (
            <>
              <Text style={[styles.tagSeparator, { color: colors.text.secondary }]}>•</Text>
              <Text style={[styles.tagText, { color: colors.text.secondary }]}>
                {ambientSound}
              </Text>
            </>
          )}
          {breathingPattern && (
            <>
              <Text style={[styles.tagSeparator, { color: colors.text.secondary }]}>•</Text>
              <Text style={[styles.tagText, { color: colors.text.secondary }]}>
                {breathingPattern}
              </Text>
            </>
          )}
          {intervalBellInfo && (
            <>
              <Text style={[styles.tagSeparator, { color: colors.text.secondary }]}>•</Text>
              <Ionicons name="notifications-outline" size={12} color={colors.text.secondary} style={{ marginRight: 3 }} />
              <Text style={[styles.tagText, { color: colors.text.secondary }]}>
                {intervalBellInfo}
              </Text>
            </>
          )}
        </View>
      </View>

      {/* Chevron */}
      <Ionicons name="chevron-forward" size={18} color={colors.text.tertiary} />
    </AnimatedPressable>
  );

  // Animation offset: cards start after header items (which use indices 0, 1, 2)
  const cardAnimationIndex = animationIndex + 3;

  // If swipe actions available, wrap in Swipeable
  if (isCustom && (onEdit || onDelete)) {
    return (
      <Animated.View
        entering={settings.animationsEnabled ? screenElementAnimation(cardAnimationIndex) : undefined}
      >
        <View style={styles.swipeableWrapper}>
          <Swipeable
            ref={swipeableRef}
            renderRightActions={renderRightActions}
            friction={2}
            rightThreshold={40}
            overshootRight={false}
            containerStyle={styles.swipeableContainer}
            childrenContainerStyle={styles.swipeableContent}
            onSwipeableOpen={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          >
            {CardContent}
          </Swipeable>
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      entering={settings.animationsEnabled ? screenElementAnimation(cardAnimationIndex) : undefined}
    >
      {CardContent}
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  // Swipeable wrapper and container styles
  // IMPORTANT: overflow: 'visible' is required to show shadows outside card bounds
  swipeableWrapper: {
    width: '100%',
    overflow: 'visible',
  },
  swipeableContainer: {
    width: '100%',
    overflow: 'visible',
  },
  swipeableContent: {
    width: '100%',
    overflow: 'visible',
  },
  // Card style - matches HomeScreen secondaryCard structure
  // backgroundColor, borderRadius, and shadows come from globalCardStyles.secondary
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoSection: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.medium,
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  tagText: {
    fontSize: theme.typography.fontSizes.sm,
  },
  tagSeparator: {
    marginHorizontal: 6,
  },
  // Swipe actions
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: theme.spacing.sm,
  },
  actionButton: {
    width: 56,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginLeft: theme.spacing.xs,
    gap: 4,
  },
  actionText: {
    // color is set dynamically from swipeColors
    fontSize: 10,
    fontWeight: '600',
  },
});

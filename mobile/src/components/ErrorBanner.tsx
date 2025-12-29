/**
 * ErrorBanner Component
 *
 * A beautiful animated error notification banner.
 * Slides in from the top with smooth animations and auto-dismiss.
 */

import React, { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, useColorScheme } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { usePersonalization } from '../contexts/PersonalizationContext';
import { spacing, borderRadius, typography } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ErrorBannerProps {
  /** Error message to display */
  message: string;
  /** Whether the banner is visible */
  visible: boolean;
  /** Callback when banner is dismissed */
  onDismiss: () => void;
  /** Optional retry action */
  onRetry?: () => void;
  /** Auto-dismiss duration in ms (0 = no auto-dismiss) */
  autoDismissMs?: number;
  /** Error type for styling */
  type?: 'error' | 'warning' | 'info';
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  message,
  visible,
  onDismiss,
  onRetry,
  autoDismissMs = 5000,
  type = 'error',
}) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const { settings } = usePersonalization();
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(-150);
  const opacity = useSharedValue(0);

  const colors = {
    error: {
      bg: isDarkMode ? '#3D1F1F' : '#FEE2E2',
      border: isDarkMode ? '#7F1D1D' : '#FECACA',
      text: isDarkMode ? '#FCA5A5' : '#991B1B',
      icon: isDarkMode ? '#F87171' : '#DC2626',
    },
    warning: {
      bg: isDarkMode ? '#3D2F1F' : '#FEF3C7',
      border: isDarkMode ? '#78350F' : '#FDE68A',
      text: isDarkMode ? '#FCD34D' : '#92400E',
      icon: isDarkMode ? '#FBBF24' : '#D97706',
    },
    info: {
      bg: isDarkMode ? '#1F2937' : '#DBEAFE',
      border: isDarkMode ? '#1E40AF' : '#BFDBFE',
      text: isDarkMode ? '#93C5FD' : '#1E40AF',
      icon: isDarkMode ? '#60A5FA' : '#2563EB',
    },
  };

  const currentColors = colors[type];

  const triggerHaptic = useCallback(() => {
    if (settings.hapticEnabled) {
      Haptics.notificationAsync(
        type === 'error'
          ? Haptics.NotificationFeedbackType.Error
          : type === 'warning'
          ? Haptics.NotificationFeedbackType.Warning
          : Haptics.NotificationFeedbackType.Success
      );
    }
  }, [settings.hapticEnabled, type]);

  const show = useCallback(() => {
    translateY.value = withSpring(0, {
      damping: 15,
      stiffness: 150,
    });
    opacity.value = withTiming(1, { duration: 200 });
    triggerHaptic();
  }, []);

  const hide = useCallback(() => {
    translateY.value = withTiming(-150, { duration: 250 }, (finished) => {
      if (finished) {
        runOnJS(onDismiss)();
      }
    });
    opacity.value = withTiming(0, { duration: 200 });
  }, [onDismiss]);

  useEffect(() => {
    if (visible) {
      show();

      if (autoDismissMs > 0) {
        const timer = setTimeout(() => {
          hide();
        }, autoDismissMs);

        return () => clearTimeout(timer);
      }
    } else {
      translateY.value = -150;
      opacity.value = 0;
    }
  }, [visible, autoDismissMs]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const progressStyle = useAnimatedStyle(() => {
    const progress = interpolate(
      opacity.value,
      [0, 1],
      [100, 0],
      Extrapolate.CLAMP
    );
    return {
      width: `${progress}%`,
    };
  });

  const iconName =
    type === 'error'
      ? 'alert-circle'
      : type === 'warning'
      ? 'warning'
      : 'information-circle';

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          paddingTop: insets.top + spacing.sm,
          backgroundColor: currentColors.bg,
          borderColor: currentColors.border,
        },
        animatedStyle,
      ]}
    >
      <View style={styles.content}>
        <Ionicons
          name={iconName}
          size={24}
          color={currentColors.icon}
          style={styles.icon}
        />
        <Text
          style={[styles.message, { color: currentColors.text }]}
          numberOfLines={2}
        >
          {message}
        </Text>
        <View style={styles.actions}>
          {onRetry && (
            <TouchableOpacity
              onPress={onRetry}
              style={[styles.retryButton, { borderColor: currentColors.text }]}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name="refresh"
                size={16}
                color={currentColors.text}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={hide}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name="close"
              size={22}
              color={currentColors.text}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Progress bar for auto-dismiss */}
      {autoDismissMs > 0 && (
        <View style={[styles.progressTrack, { backgroundColor: currentColors.border }]}>
          <Animated.View
            style={[
              styles.progressBar,
              { backgroundColor: currentColors.icon },
              progressStyle,
            ]}
          />
        </View>
      )}
    </Animated.View>
  );
};

/**
 * Hook for managing error banner state
 */
export const useErrorBanner = () => {
  const [state, setState] = React.useState<{
    visible: boolean;
    message: string;
    type: 'error' | 'warning' | 'info';
    onRetry?: () => void;
  }>({
    visible: false,
    message: '',
    type: 'error',
  });

  const showError = useCallback((message: string, onRetry?: () => void) => {
    setState({ visible: true, message, type: 'error', onRetry });
  }, []);

  const showWarning = useCallback((message: string, onRetry?: () => void) => {
    setState({ visible: true, message, type: 'warning', onRetry });
  }, []);

  const showInfo = useCallback((message: string) => {
    setState({ visible: true, message, type: 'info' });
  }, []);

  const dismiss = useCallback(() => {
    setState((prev) => ({ ...prev, visible: false }));
  }, []);

  return {
    ...state,
    showError,
    showWarning,
    showInfo,
    dismiss,
  };
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: spacing.sm,
  },
  message: {
    flex: 1,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
    lineHeight: typography.fontSizes.sm * 1.4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.sm,
    gap: spacing.sm,
  },
  retryButton: {
    padding: spacing.xs,
    borderWidth: 1,
    borderRadius: borderRadius.sm,
  },
  progressTrack: {
    height: 2,
    marginTop: spacing.sm,
    borderRadius: 1,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
});

export default ErrorBanner;

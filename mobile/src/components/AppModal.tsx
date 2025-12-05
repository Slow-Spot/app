/**
 * AppModal - Beautiful styled modal to replace native Alert.alert()
 *
 * Premium looking modal with:
 * - Glassmorphism backdrop
 * - Smooth animations
 * - Theme-aware styling
 * - Customizable buttons
 */

import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  useColorScheme,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import theme, { getThemeColors } from '../theme';
import { usePersonalization } from '../contexts/PersonalizationContext';
import { semanticColors } from '../theme/colors';

export interface AppModalButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

export interface AppModalProps {
  visible: boolean;
  title: string;
  message?: string;
  buttons?: AppModalButton[];
  onDismiss?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
}

export const AppModal: React.FC<AppModalProps> = ({
  visible,
  title,
  message,
  buttons = [{ text: 'OK', style: 'default' }],
  onDismiss,
  icon,
  iconColor,
}) => {
  const systemColorScheme = useColorScheme();
  const isDark = systemColorScheme === 'dark';
  const colors = getThemeColors(isDark);
  const { currentTheme } = usePersonalization();

  const handleButtonPress = async (button: AppModalButton) => {
    if (button.style === 'destructive') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } else {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    button.onPress?.();
    onDismiss?.();
  };

  const getButtonStyle = (button: AppModalButton, index: number) => {
    const baseStyle: object[] = [styles.button];

    if (buttons.length === 2 && index === 0) {
      baseStyle.push(styles.buttonLeft);
    }
    if (buttons.length === 2 && index === 1) {
      baseStyle.push(styles.buttonRight);
    }
    if (buttons.length === 1) {
      baseStyle.push(styles.buttonFull);
    }

    return baseStyle;
  };

  const getButtonTextStyle = (button: AppModalButton) => {
    switch (button.style) {
      case 'destructive':
        return { color: semanticColors.error.default };
      case 'cancel':
        return { color: colors.text.secondary };
      default:
        return { color: currentTheme.primary };
    }
  };

  const getButtonBackgroundStyle = (button: AppModalButton) => {
    switch (button.style) {
      case 'destructive':
        return { backgroundColor: isDark ? 'rgba(255, 59, 48, 0.15)' : 'rgba(255, 59, 48, 0.1)' };
      case 'cancel':
        return { backgroundColor: isDark ? 'rgba(142, 142, 147, 0.15)' : 'rgba(142, 142, 147, 0.1)' };
      default:
        return { backgroundColor: isDark ? `${currentTheme.primary}26` : `${currentTheme.primary}15` };
    }
  };

  const resolvedIconColor = iconColor || currentTheme.primary;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onDismiss}
      statusBarTranslucent
    >
      <Animated.View
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(150)}
        style={styles.overlay}
      >
        <Pressable style={styles.backdrop} onPress={onDismiss}>
          <BlurView
            intensity={isDark ? 40 : 20}
            tint={isDark ? 'dark' : 'light'}
            style={StyleSheet.absoluteFillObject}
          />
        </Pressable>

        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(150)}
          style={[
            styles.modalContainer,
            {
              backgroundColor: isDark ? colors.neutral.charcoal[100] : colors.neutral.white,
              shadowColor: isDark ? '#000' : colors.neutral.gray[900],
            },
          ]}
        >
          {/* Icon */}
          {icon && (
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: isDark ? `${resolvedIconColor}20` : `${resolvedIconColor}15` },
              ]}
            >
              <Ionicons name={icon} size={32} color={resolvedIconColor} />
            </View>
          )}

          {/* Title */}
          <Text style={[styles.title, { color: colors.text.primary }]}>{title}</Text>

          {/* Message */}
          {message && (
            <Text style={[styles.message, { color: colors.text.secondary }]}>{message}</Text>
          )}

          {/* Buttons */}
          <View style={[styles.buttonsContainer, buttons.length === 2 && styles.buttonsRow]}>
            {buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={[...getButtonStyle(button, index), getButtonBackgroundStyle(button)]}
                onPress={() => handleButtonPress(button)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.buttonText,
                    getButtonTextStyle(button),
                    button.style === 'cancel' && styles.buttonTextCancel,
                    button.style === 'destructive' && styles.buttonTextDestructive,
                  ]}
                >
                  {button.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContainer: {
    width: '100%',
    maxWidth: 340,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.semiBold,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  message: {
    fontSize: theme.typography.fontSizes.md,
    textAlign: 'center',
    lineHeight: theme.typography.fontSizes.md * 1.5,
    marginBottom: theme.spacing.xl,
  },
  buttonsContainer: {
    width: '100%',
    gap: theme.spacing.sm,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  button: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLeft: {
    flex: 1,
  },
  buttonRight: {
    flex: 1,
  },
  buttonFull: {
    width: '100%',
  },
  buttonText: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semiBold,
  },
  buttonTextCancel: {
    fontWeight: theme.typography.fontWeights.medium,
  },
  buttonTextDestructive: {
    fontWeight: theme.typography.fontWeights.semiBold,
  },
});

export default AppModal;

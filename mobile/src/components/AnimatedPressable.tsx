/**
 * AnimatedPressable Component
 *
 * A beautiful touchable component with spring animations.
 * Provides subtle scale feedback on press for a premium feel.
 */

import React, { useCallback } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { usePersonalization } from '../contexts/PersonalizationContext';

interface AnimatedPressableProps {
  children: React.ReactNode;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  /** Scale when pressed (0.95 = subtle, 0.9 = noticeable) */
  pressScale?: number;
  /** Enable haptic feedback on press */
  hapticFeedback?: boolean;
  /** Type of haptic feedback */
  hapticType?: 'light' | 'medium' | 'heavy' | 'selection';
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Accessibility hint */
  accessibilityHint?: string;
  /** Accessibility role */
  accessibilityRole?: 'button' | 'link' | 'none' | 'text' | 'search' | 'image' | 'imagebutton' | 'adjustable' | 'header' | 'summary' | 'alert' | 'checkbox' | 'combobox' | 'menu' | 'menubar' | 'menuitem' | 'progressbar' | 'radio' | 'radiogroup' | 'scrollbar' | 'spinbutton' | 'switch' | 'tab' | 'tablist' | 'timer' | 'toolbar';
  /** Spring configuration - stiffness */
  springStiffness?: number;
  /** Spring configuration - damping */
  springDamping?: number;
}

export const AnimatedPressable: React.FC<AnimatedPressableProps> = ({
  children,
  onPress,
  style,
  disabled = false,
  pressScale = 0.97,
  hapticFeedback = true,
  hapticType = 'light',
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = 'button',
  springStiffness = 400,
  springDamping = 20,
}) => {
  const scale = useSharedValue(1);
  const { settings } = usePersonalization();

  const triggerHaptic = useCallback(() => {
    if (!hapticFeedback || !settings.hapticEnabled) return;

    switch (hapticType) {
      case 'light':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'medium':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'heavy':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      case 'selection':
        Haptics.selectionAsync();
        break;
    }
  }, [hapticFeedback, hapticType, settings.hapticEnabled]);

  const handlePress = useCallback(() => {
    if (!disabled) {
      onPress();
    }
  }, [disabled, onPress]);

  const gesture = Gesture.Tap()
    .enabled(!disabled)
    .onBegin(() => {
      'worklet';
      scale.value = withSpring(pressScale, {
        stiffness: springStiffness,
        damping: springDamping,
      });
      runOnJS(triggerHaptic)();
    })
    .onFinalize(() => {
      'worklet';
      scale.value = withSpring(1, {
        stiffness: springStiffness,
        damping: springDamping,
      });
    })
    .onEnd(() => {
      'worklet';
      runOnJS(handlePress)();
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: disabled ? 0.5 : 1,
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[style, animatedStyle]}
        accessible={true}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityRole={accessibilityRole}
        accessibilityState={{ disabled }}
      >
        {children}
      </Animated.View>
    </GestureDetector>
  );
};

export default AnimatedPressable;

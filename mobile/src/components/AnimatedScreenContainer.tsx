import React, { useEffect, useRef, useMemo } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { DURATION_SCREEN } from '../utils/animations';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;
const SWIPE_VELOCITY_THRESHOLD = 500;

// Tab order for swipe navigation
const TAB_ORDER = ['home', 'meditation', 'quotes', 'settings'] as const;
type TabScreen = (typeof TAB_ORDER)[number];

interface AnimatedScreenContainerProps {
  children: React.ReactNode;
  screenKey: string;
  onNavigate?: (screen: string) => void;
  enableSwipe?: boolean;
  transitionDuration?: number;
}

export const AnimatedScreenContainer: React.FC<AnimatedScreenContainerProps> = ({
  children,
  screenKey,
  onNavigate,
  enableSwipe = true,
  transitionDuration = DURATION_SCREEN,
}) => {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(0);
  const prevScreenKey = useRef(screenKey);

  // Pre-calculate adjacent screens on JS thread
  const currentIndex = TAB_ORDER.indexOf(screenKey as TabScreen);
  const isSwipeable = currentIndex !== -1;
  const canSwipeLeft = isSwipeable && currentIndex < TAB_ORDER.length - 1;
  const canSwipeRight = isSwipeable && currentIndex > 0;
  const leftScreen = canSwipeLeft ? TAB_ORDER[currentIndex + 1] : null;
  const rightScreen = canSwipeRight ? TAB_ORDER[currentIndex - 1] : null;

  // Trigger fade-in animation when screen changes
  useEffect(() => {
    if (prevScreenKey.current !== screenKey) {
      // Instant hide, then fade in
      opacity.value = 0;
      translateX.value = 0;

      // Smooth fade in
      opacity.value = withTiming(1, {
        duration: transitionDuration,
        easing: Easing.out(Easing.cubic),
      });

      prevScreenKey.current = screenKey;
    } else {
      // Initial mount - fade in
      opacity.value = withTiming(1, {
        duration: transitionDuration,
        easing: Easing.out(Easing.cubic),
      });
    }
  }, [screenKey, transitionDuration]);

  // Navigate to screen - called from JS thread via runOnJS
  const navigateToScreen = (screen: string) => {
    if (onNavigate && screen) {
      onNavigate(screen);
    }
  };

  // Memoized gesture to prevent recreation
  const panGesture = useMemo(() => {
    return Gesture.Pan()
      .enabled(enableSwipe && isSwipeable)
      .activeOffsetX([-20, 20])
      .failOffsetY([-15, 15])
      .onUpdate((event) => {
        'worklet';
        // Visual feedback during swipe - only if there's a screen to go to
        if (event.translationX > 0 && canSwipeRight) {
          translateX.value = Math.min(event.translationX * 0.3, SCREEN_WIDTH * 0.15);
        } else if (event.translationX < 0 && canSwipeLeft) {
          translateX.value = Math.max(event.translationX * 0.3, -SCREEN_WIDTH * 0.15);
        } else {
          // No valid direction - slight resistance
          translateX.value = event.translationX * 0.05;
        }
      })
      .onEnd((event) => {
        'worklet';
        const velocity = event.velocityX;
        const translation = event.translationX;

        // Check if we should navigate right (swipe right = go to previous)
        const shouldNavigateRight =
          canSwipeRight &&
          rightScreen &&
          (translation > SWIPE_THRESHOLD || velocity > SWIPE_VELOCITY_THRESHOLD);

        // Check if we should navigate left (swipe left = go to next)
        const shouldNavigateLeft =
          canSwipeLeft &&
          leftScreen &&
          (translation < -SWIPE_THRESHOLD || velocity < -SWIPE_VELOCITY_THRESHOLD);

        if (shouldNavigateRight && rightScreen) {
          // Animate out to the right, then navigate
          translateX.value = withTiming(
            SCREEN_WIDTH * 0.3,
            {
              duration: 150,
              easing: Easing.out(Easing.cubic),
            },
            () => {
              runOnJS(navigateToScreen)(rightScreen);
            }
          );
          opacity.value = withTiming(0, {
            duration: 150,
            easing: Easing.out(Easing.cubic),
          });
        } else if (shouldNavigateLeft && leftScreen) {
          // Animate out to the left, then navigate
          translateX.value = withTiming(
            -SCREEN_WIDTH * 0.3,
            {
              duration: 150,
              easing: Easing.out(Easing.cubic),
            },
            () => {
              runOnJS(navigateToScreen)(leftScreen);
            }
          );
          opacity.value = withTiming(0, {
            duration: 150,
            easing: Easing.out(Easing.cubic),
          });
        } else {
          // Spring back to original position
          translateX.value = withTiming(0, {
            duration: 200,
            easing: Easing.out(Easing.cubic),
          });
        }
      });
  }, [enableSwipe, isSwipeable, canSwipeLeft, canSwipeRight, leftScreen, rightScreen]);

  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: opacity.value,
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.container, animatedStyle]}>{children}</Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

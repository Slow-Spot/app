import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import type { TFunction } from 'i18next';
import { styles } from './preSessionStyles';
import type { PreSessionDynamicStyles } from './preSessionTypes';

type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'rest';

const PATTERN_CONFIGS = {
  'box': {
    phases: ['inhale', 'hold', 'exhale', 'rest'] as const,
    durations: [4000, 4000, 4000, 4000],
  },
  '4-7-8': {
    phases: ['inhale', 'hold', 'exhale'] as const,
    durations: [4000, 7000, 8000],
  },
  'equal': {
    phases: ['inhale', 'exhale'] as const,
    durations: [4000, 4000],
  },
  'calm': {
    phases: ['inhale', 'exhale'] as const,
    durations: [4000, 4000],
  },
} as const;

interface AnimatedBreathingCircleProps {
  isRunning: boolean;
  pattern: 'box' | '4-7-8' | 'equal' | 'calm';
  t: TFunction;
  isDark?: boolean;
  dynamicStyles: PreSessionDynamicStyles;
}

export const AnimatedBreathingCircle: React.FC<AnimatedBreathingCircleProps> = ({
  isRunning, pattern, t, isDark: _isDark, dynamicStyles,
}) => {
  const scale = useSharedValue(1);
  const [breathingPhase, setBreathingPhase] = useState<BreathingPhase>('inhale');

  useEffect(() => {
    if (isRunning) {
      const config = PATTERN_CONFIGS[pattern] || PATTERN_CONFIGS['equal'];

      let phaseIndex = 0;
      let timeoutId: NodeJS.Timeout;

      const animatePhase = (phase: string, duration: number) => {
        if (phase === 'inhale') {
          scale.value = withTiming(1.5, { duration, easing: Easing.inOut(Easing.ease) });
        } else if (phase === 'exhale') {
          scale.value = withTiming(1, { duration, easing: Easing.inOut(Easing.ease) });
        }
      };

      const scheduleNextPhase = () => {
        const currentPhase = config.phases[phaseIndex] ?? 'inhale';
        const currentPhaseDuration = config.durations[phaseIndex] ?? 4000;

        setBreathingPhase(currentPhase as BreathingPhase);
        animatePhase(currentPhase, currentPhaseDuration);

        timeoutId = setTimeout(() => {
          phaseIndex = (phaseIndex + 1) % config.phases.length;
          scheduleNextPhase();
        }, currentPhaseDuration);
      };

      scheduleNextPhase();
      return () => clearTimeout(timeoutId);
    } else {
      scale.value = withTiming(1, { duration: 500 });
      setBreathingPhase('inhale');
    }
  }, [isRunning, pattern]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getPhaseText = () => {
    switch (breathingPhase) {
      case 'inhale':
        return t('meditation.breatheIn', 'Breathe in');
      case 'hold':
        return t('instructions.breathingPrep.hold', 'Hold');
      case 'exhale':
        return t('meditation.breatheOut', 'Breathe out');
      case 'rest':
        return t('instructions.breathingPrep.hold', 'Hold');
      default:
        return t('instructions.breathingPrep.breathe', 'Breathe');
    }
  };

  return (
    <View style={styles.breathingContainer}>
      <Reanimated.View style={[styles.breathingCircleWrapper, animatedStyle]}>
        <View style={styles.breathingCircle} />
      </Reanimated.View>
      {isRunning && (
        <Text style={[styles.breathingText, dynamicStyles.breathingText]}>
          {getPhaseText()}
        </Text>
      )}
    </View>
  );
};

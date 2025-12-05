import { logger } from '../utils/logger';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Pressable } from 'react-native';
import { useKeepAwake } from 'expo-keep-awake';
import { useTranslation } from 'react-i18next';
import { createAudioPlayer, AudioPlayer } from 'expo-audio';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import theme, { getThemeColors } from '../theme';
import { brandColors } from '../theme/colors';
import { ChimePoint } from '../types/customSession';
import { usePersonalization } from '../contexts/PersonalizationContext';
import { ConfirmationModal } from './ConfirmationModal';
import { BreathingPattern, BreathingTiming } from '../services/customSessionStorage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Predefined breathing patterns in seconds [inhale, hold1, exhale, hold2]
// Based on scientific research on breathing techniques
const BREATHING_PATTERNS_CONFIG: Record<BreathingPattern, [number, number, number, number]> = {
  'none': [0, 0, 0, 0], // No breathing guidance
  'box': [4, 4, 4, 4], // Box breathing: 4s inhale, 4s hold, 4s exhale, 4s hold - activates parasympathetic system
  '4-7-8': [4, 7, 8, 0], // 4-7-8 relaxation: natural sedative for nervous system (Dr. Andrew Weil)
  'equal': [4, 0, 4, 0], // Equal breathing (Sama Vritti): balances nervous system, increases focus
  'calm': [4, 0, 6, 0], // Calm breathing: longer exhale (1:1.5 ratio) activates relaxation response
  'custom': [4, 4, 4, 4], // Will be overridden by customBreathing
};

interface MeditationTimerProps {
  totalSeconds: number;
  onComplete: () => void;
  onCancel: () => void;
  chimePoints?: ChimePoint[];
  onAudioToggle?: (enabled: boolean) => void;
  ambientSoundName?: string;
  isDark?: boolean;
  breathingPattern?: BreathingPattern;
  customBreathing?: BreathingTiming;
  /** Hide the timer for a distraction-free meditation experience */
  hideTimer?: boolean;
  /** Haptic feedback at session start and end */
  sessionHaptics?: boolean;
  /** Haptic feedback synchronized with breathing phases */
  breathingHaptics?: boolean;
  /** Haptic feedback for interval bells */
  intervalBellHaptics?: boolean;
}

export const MeditationTimer: React.FC<MeditationTimerProps> = ({
  totalSeconds,
  onComplete,
  onCancel,
  chimePoints = [],
  onAudioToggle,
  ambientSoundName,
  isDark = false,
  breathingPattern = 'box',
  customBreathing,
  hideTimer = true,
  sessionHaptics = true,
  breathingHaptics = true,
  intervalBellHaptics = true,
}) => {
  const { t } = useTranslation();
  const { currentTheme, settings } = usePersonalization();

  // Haptic feedback for breathing phase transitions
  // Uses both prop and global settings
  const isBreathingHapticEnabled = breathingHaptics && settings.hapticEnabled;
  const lastBreathingPhaseRef = useRef<string>('');
  const hapticIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hapticPulseCountRef = useRef<number>(0);

  /**
   * Enhanced haptic feedback system for breathing phases
   *
   * Accessibility feature: Provides tactile guidance for users who:
   * - Are visually impaired
   * - Meditate with closed eyes
   * - Prefer kinesthetic learning
   *
   * Haptic patterns:
   * - INHALE: Rising intensity pulses (Light → Medium → Heavy)
   *   Simulates the feeling of lungs expanding
   * - HOLD: Soft, steady pulses at regular intervals
   *   Gentle reminder to maintain breath retention
   * - EXHALE: Decreasing intensity pulses (Heavy → Medium → Light)
   *   Follows the natural release of breath
   * - REST: Very light, occasional pulses
   *   Subtle presence without distraction
   */
  const stopContinuousHaptic = useCallback(() => {
    if (hapticIntervalRef.current) {
      clearInterval(hapticIntervalRef.current);
      hapticIntervalRef.current = null;
    }
    hapticPulseCountRef.current = 0;
  }, []);

  const startContinuousHaptic = useCallback((phase: string, phaseDuration: number) => {
    if (!isBreathingHapticEnabled) return;

    // Stop any existing haptic pattern
    stopContinuousHaptic();

    // Calculate pulse interval based on phase duration
    // Aim for 3-6 pulses per phase for comfortable feedback
    const pulseCount = Math.max(3, Math.min(6, Math.floor(phaseDuration / 1000)));
    const pulseInterval = Math.floor(phaseDuration / pulseCount);

    hapticPulseCountRef.current = 0;

    const executeHapticPulse = () => {
      hapticPulseCountRef.current++;
      const progress = hapticPulseCountRef.current / pulseCount; // 0 to 1

      switch (phase) {
        case 'inhale':
          // Rising intensity: Light → Medium → Heavy
          // Simulates lungs expanding, building energy
          if (progress < 0.33) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          } else if (progress < 0.66) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          } else {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          }
          break;

        case 'hold':
          // Steady, soft pulses - calm presence
          // Like a heartbeat reminder to stay present
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
          break;

        case 'exhale':
          // Decreasing intensity: Heavy → Medium → Light
          // Follows natural release and relaxation
          if (progress < 0.33) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          } else if (progress < 0.66) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          } else {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
          break;

        case 'rest':
          // Very gentle, occasional reminder
          // Only pulse every other time to be less intrusive
          if (hapticPulseCountRef.current % 2 === 0) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
          }
          break;
      }
    };

    // Trigger initial pulse immediately
    executeHapticPulse();

    // Set up interval for remaining pulses
    if (pulseCount > 1) {
      hapticIntervalRef.current = setInterval(() => {
        if (hapticPulseCountRef.current < pulseCount) {
          executeHapticPulse();
        } else {
          stopContinuousHaptic();
        }
      }, pulseInterval);
    }
  }, [isBreathingHapticEnabled, stopContinuousHaptic]);

  const triggerBreathingHaptic = useCallback((phase: string, phaseDuration?: number) => {
    if (!isBreathingHapticEnabled) return;

    // Only trigger if phase actually changed
    if (phase === lastBreathingPhaseRef.current) return;
    lastBreathingPhaseRef.current = phase;

    // Use continuous haptic if duration is provided and long enough
    if (phaseDuration && phaseDuration >= 1500) {
      startContinuousHaptic(phase, phaseDuration);
    } else {
      // Fallback to single pulse for very short phases
      switch (phase) {
        case 'inhale':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'hold':
        case 'rest':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
          break;
        case 'exhale':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
      }
    }
  }, [isBreathingHapticEnabled, startContinuousHaptic]);

  // Cleanup haptic interval on unmount
  useEffect(() => {
    return () => {
      stopContinuousHaptic();
    };
  }, [stopContinuousHaptic]);

  // Keep screen awake during meditation
  useKeepAwake();

  // Get breathing timing from pattern or custom config
  const breathingTiming = useMemo(() => {
    if (breathingPattern === 'none') {
      return null; // No breathing guidance
    }
    if (breathingPattern === 'custom' && customBreathing) {
      return [
        customBreathing.inhale * 1000,
        customBreathing.hold1 * 1000,
        customBreathing.exhale * 1000,
        customBreathing.hold2 * 1000,
      ] as [number, number, number, number];
    }
    const config = BREATHING_PATTERNS_CONFIG[breathingPattern];
    return [
      config[0] * 1000,
      config[1] * 1000,
      config[2] * 1000,
      config[3] * 1000,
    ] as [number, number, number, number];
  }, [breathingPattern, customBreathing]);

  // Check if breathing guidance should be shown
  const showBreathingGuide = breathingPattern !== 'none' && breathingTiming !== null;

  // Theme-aware colors
  const colors = useMemo(() => getThemeColors(isDark), [isDark]);

  // Dynamic styles based on theme
  const dynamicStyles = useMemo(() => ({
    audioButton: {
      backgroundColor: isDark ? colors.neutral.charcoal[200] : theme.colors.neutral.white,
    },
    audioButtonMuted: {
      backgroundColor: isDark ? colors.neutral.charcoal[100] : theme.colors.neutral.lightGray[100],
    },
    audioIconColor: isDark ? colors.neutral.white : theme.colors.neutral.gray[700],
    audioIconMutedColor: isDark ? colors.neutral.gray[500] : theme.colors.neutral.gray[400],
    ambientBadge: {
      backgroundColor: isDark ? colors.neutral.charcoal[200] : theme.colors.neutral.white,
    },
    ambientBadgeMuted: {
      backgroundColor: isDark ? colors.neutral.charcoal[100] : theme.colors.neutral.lightGray[100],
    },
    ambientText: {
      color: isDark ? colors.neutral.white : theme.colors.neutral.gray[700],
    },
    ambientTextMuted: {
      color: isDark ? colors.neutral.gray[500] : theme.colors.neutral.gray[400],
    },
    ambientIconColor: isDark ? colors.neutral.white : theme.colors.neutral.gray[600],
    ambientIconMutedColor: isDark ? colors.neutral.gray[500] : theme.colors.neutral.gray[400],
    instructionLabel: {
      color: isDark ? colors.neutral.gray[400] : theme.colors.neutral.gray[400],
    },
    breathingText: {
      color: isDark ? colors.neutral.white : theme.colors.neutral.gray[800],
    },
    breathingCircleGradient: isDark
      ? ['rgba(139, 92, 246, 0.15)', 'rgba(139, 92, 246, 0.05)'] as const
      : ['rgba(139, 92, 246, 0.12)', 'rgba(139, 92, 246, 0.03)'] as const,
    progressTrack: {
      backgroundColor: isDark ? colors.neutral.charcoal[100] : theme.colors.neutral.lightGray[300],
    },
    progressFill: {
      backgroundColor: isDark ? colors.neutral.gray[300] : theme.colors.neutral.gray[400],
    },
    progressRingBg: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    progressRingFg: currentTheme.primary,
    timerText: {
      color: isDark ? colors.neutral.white : theme.colors.neutral.gray[700],
    },
    chimeLabel: {
      backgroundColor: isDark ? colors.neutral.charcoal[200] : theme.colors.neutral.white,
      color: isDark ? colors.neutral.white : theme.colors.neutral.gray[500],
    },
    chimeLabelPassed: {
      backgroundColor: isDark ? colors.neutral.gray[300] : theme.colors.neutral.gray[600],
      color: isDark ? colors.neutral.charcoal[200] : theme.colors.neutral.white,
    },
    secondaryButton: {
      backgroundColor: isDark ? colors.neutral.charcoal[200] : theme.colors.neutral.white,
      borderColor: isDark ? colors.neutral.charcoal[100] : theme.colors.neutral.lightGray[300],
    },
    secondaryButtonText: {
      color: isDark ? colors.neutral.white : theme.colors.neutral.gray[600],
    },
  }), [colors, isDark]);
  const [remainingSeconds, setRemainingSeconds] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const [adjustableChimes, setAdjustableChimes] = useState<ChimePoint[]>(chimePoints);
  const [showEndConfirmation, setShowEndConfirmation] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const playedChimes = useRef<Set<number>>(new Set());
  const chimeSound = useRef<AudioPlayer | null>(null);
  const hideControlsTimeout = useRef<NodeJS.Timeout | null>(null);

  // Focus Mode: Animated opacity for controls
  const controlsOpacity = useSharedValue(1);

  // Auto-hide controls after 5 seconds of inactivity when running
  const CONTROLS_HIDE_DELAY = 5000;

  // Reset hide timer on any interaction
  const resetHideTimer = useCallback(() => {
    if (hideControlsTimeout.current) {
      clearTimeout(hideControlsTimeout.current);
    }

    // Show controls immediately
    setControlsVisible(true);
    controlsOpacity.value = withTiming(1, { duration: 200 });

    // Only auto-hide if meditation is running
    if (isRunning) {
      hideControlsTimeout.current = setTimeout(() => {
        setControlsVisible(false);
        controlsOpacity.value = withTiming(0.15, { duration: 500 });
      }, CONTROLS_HIDE_DELAY);
    }
  }, [isRunning, controlsOpacity]);

  // Handle screen touch to show controls
  const handleScreenTouch = useCallback(() => {
    if (!controlsVisible) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    resetHideTimer();
  }, [controlsVisible, resetHideTimer]);

  // Manage auto-hide based on running state
  useEffect(() => {
    if (isRunning) {
      resetHideTimer();
    } else {
      // When paused, always show controls
      if (hideControlsTimeout.current) {
        clearTimeout(hideControlsTimeout.current);
      }
      setControlsVisible(true);
      controlsOpacity.value = withTiming(1, { duration: 200 });
    }

    return () => {
      if (hideControlsTimeout.current) {
        clearTimeout(hideControlsTimeout.current);
      }
    };
  }, [isRunning, resetHideTimer, controlsOpacity]);

  // Animated style for controls
  const controlsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: controlsOpacity.value,
  }));

  // Handle end session button press
  const handleEndSessionPress = () => {
    setIsRunning(false); // Pause while showing modal
    setShowEndConfirmation(true);
  };

  // Confirm ending session
  const handleConfirmEnd = () => {
    setShowEndConfirmation(false);
    onCancel();
  };

  // Cancel ending session (continue meditation)
  const handleCancelEnd = () => {
    setShowEndConfirmation(false);
    setIsRunning(true); // Resume meditation
  };

  // Breathing animation - subtle, stays inside the ring
  const breathingScale = useSharedValue(0.7);
  const breathingOpacity = useSharedValue(0.3);
  const breathingGlow = useSharedValue(0);

  // Load chime sound
  useEffect(() => {
    let isMounted = true;

    const loadChimeSound = async () => {
      try {
        const player = createAudioPlayer(
          require('../../assets/sounds/meditation-bell.mp3')
        );
        player.loop = false;
        if (isMounted) {
          chimeSound.current = player;
        }
      } catch (error) {
        logger.error('Error loading chime sound:', error);
      }
    };

    loadChimeSound();

    return () => {
      isMounted = false;
      if (chimeSound.current) {
        chimeSound.current.release();
      }
    };
  }, []);

  // Breathing animation - synchronized with text, using dynamic timing from pattern
  useEffect(() => {
    // Skip animation if breathing is disabled
    if (!showBreathingGuide || !breathingTiming) {
      return;
    }

    const [inhaleDuration, hold1Duration, exhaleDuration, hold2Duration] = breathingTiming;

    if (isRunning) {
      let timeoutId: NodeJS.Timeout;

      const animateBreathing = () => {
        // INHALE - grow but stay inside the ring
        setBreathingPhase('inhale');
        triggerBreathingHaptic('inhale', inhaleDuration);
        breathingScale.value = withTiming(0.95, {
          duration: inhaleDuration,
          easing: Easing.inOut(Easing.ease),
        });
        breathingOpacity.value = withTiming(0.5, {
          duration: inhaleDuration,
          easing: Easing.inOut(Easing.ease),
        });
        breathingGlow.value = withTiming(1, {
          duration: inhaleDuration,
          easing: Easing.inOut(Easing.ease),
        });

        timeoutId = setTimeout(() => {
          // HOLD 1 - maintain (only if duration > 0)
          if (hold1Duration > 0) {
            setBreathingPhase('hold');
            triggerBreathingHaptic('hold', hold1Duration);
          }

          timeoutId = setTimeout(() => {
            // EXHALE - shrink
            setBreathingPhase('exhale');
            triggerBreathingHaptic('exhale', exhaleDuration);
            breathingScale.value = withTiming(0.7, {
              duration: exhaleDuration,
              easing: Easing.inOut(Easing.ease),
            });
            breathingOpacity.value = withTiming(0.3, {
              duration: exhaleDuration,
              easing: Easing.inOut(Easing.ease),
            });
            breathingGlow.value = withTiming(0, {
              duration: exhaleDuration,
              easing: Easing.inOut(Easing.ease),
            });

            timeoutId = setTimeout(() => {
              // REST / HOLD 2 (only if duration > 0)
              if (hold2Duration > 0) {
                setBreathingPhase('rest');
                triggerBreathingHaptic('rest', hold2Duration);
              }

              timeoutId = setTimeout(() => {
                animateBreathing();
              }, hold2Duration > 0 ? hold2Duration : 100); // Small delay to prevent infinite loop
            }, exhaleDuration);
          }, hold1Duration > 0 ? hold1Duration : 100); // Small delay for smooth transition
        }, inhaleDuration);
      };

      animateBreathing();

      return () => {
        clearTimeout(timeoutId);
        cancelAnimation(breathingScale);
        cancelAnimation(breathingOpacity);
        cancelAnimation(breathingGlow);
      };
    } else {
      cancelAnimation(breathingScale);
      cancelAnimation(breathingOpacity);
      cancelAnimation(breathingGlow);
      if (chimeSound.current) {
        chimeSound.current.pause();
      }
    }
  }, [isRunning, breathingScale, breathingOpacity, breathingGlow, showBreathingGuide, breathingTiming, triggerBreathingHaptic]);

  const breathingAnimatedStyle = useAnimatedStyle(() => ({
    opacity: breathingOpacity.value,
    transform: [{ scale: breathingScale.value }],
  }));

  // Play chime with appropriate haptic feedback
  // isIntervalChime: true for interval bells, false for session end chime
  const playChime = async (isIntervalChime: boolean = true) => {
    // Determine which haptic setting to use
    const shouldVibrate = isIntervalChime
      ? (intervalBellHaptics && settings.hapticEnabled)
      : (sessionHaptics && settings.hapticEnabled);

    if (shouldVibrate) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    if (audioEnabled && chimeSound.current) {
      try {
        chimeSound.current.seekTo(0);
        chimeSound.current.play();
      } catch (error) {
        logger.error('Error playing chime:', error);
      }
    }
  };

  // Check and play interval chimes
  useEffect(() => {
    const elapsedSeconds = totalSeconds - remainingSeconds;

    for (const chime of adjustableChimes) {
      if (
        elapsedSeconds >= chime.timeInSeconds &&
        !playedChimes.current.has(chime.timeInSeconds)
      ) {
        playedChimes.current.add(chime.timeInSeconds);
        playChime(true); // Interval bell - use intervalBellHaptics
      }
    }
  }, [remainingSeconds, adjustableChimes, totalSeconds]);

  // Timer countdown
  useEffect(() => {
    if (!isRunning || remainingSeconds <= 0) return;

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, remainingSeconds, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((totalSeconds - remainingSeconds) / totalSeconds) * 100;

  // Circle calculations
  const size = Math.min(SCREEN_WIDTH * 0.7, 280);
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * progress) / 100;
  // Extended size to fit chime markers outside the ring
  const svgSize = size + 50; // Extra space for markers
  const svgOffset = 25; // Center offset

  return (
    <Pressable style={styles.container} onPress={handleScreenTouch}>
      {/* Top controls - Audio & Ambient - Animated for Focus Mode */}
      <Animated.View style={[styles.topControls, controlsAnimatedStyle]}>
        <TouchableOpacity
          style={[styles.audioButton, dynamicStyles.audioButton, !audioEnabled && dynamicStyles.audioButtonMuted]}
          onPress={() => {
            resetHideTimer();
            const newState = !audioEnabled;
            setAudioEnabled(newState);
            if (onAudioToggle) onAudioToggle(newState);
          }}
          accessibilityLabel={audioEnabled ? 'Audio enabled' : 'Audio disabled'}
        >
          {/* Subtle glow ring behind icon when enabled */}
          {audioEnabled && (
            <View style={styles.audioButtonGlow} />
          )}
          <Ionicons
            name={audioEnabled ? 'volume-high' : 'volume-mute'}
            size={20}
            color={audioEnabled ? dynamicStyles.audioIconColor : dynamicStyles.audioIconMutedColor}
          />
        </TouchableOpacity>

        {ambientSoundName && (
          <View style={[styles.ambientBadge, dynamicStyles.ambientBadge, !audioEnabled && dynamicStyles.ambientBadgeMuted]}>
            <Ionicons
              name="musical-notes"
              size={12}
              color={audioEnabled ? dynamicStyles.ambientIconColor : dynamicStyles.ambientIconMutedColor}
            />
            <Text style={[styles.ambientText, dynamicStyles.ambientText, !audioEnabled && dynamicStyles.ambientTextMuted]}>
              {ambientSoundName}
            </Text>
          </View>
        )}
      </Animated.View>

      {/* Breathing guidance - only show if breathing pattern is enabled */}
      {showBreathingGuide ? (
        <View style={styles.breathingSection}>
          <Text style={[styles.instructionLabel, dynamicStyles.instructionLabel]}>
            {t('meditation.focusOnBreath', 'FOCUS ON YOUR BREATH')}
          </Text>
          <Animated.Text style={[styles.breathingText, dynamicStyles.breathingText]}>
            {breathingPhase === 'inhale' && t('meditation.breatheIn', 'Inhale')}
            {breathingPhase === 'hold' && t('meditation.hold', 'Hold')}
            {breathingPhase === 'exhale' && t('meditation.breatheOut', 'Exhale')}
            {breathingPhase === 'rest' && t('meditation.hold', 'Hold')}
          </Animated.Text>
        </View>
      ) : (
        <View style={styles.breathingSection}>
          <Text style={[styles.instructionLabel, dynamicStyles.instructionLabel]}>
            {t('meditation.meditationInProgress', 'MEDITATION IN PROGRESS')}
          </Text>
          <Text style={[styles.breathingText, dynamicStyles.breathingText]}>
            {t('meditation.breatheNaturally', 'Breathe naturally')}
          </Text>
        </View>
      )}

      {/* Main circle with timer */}
      <View style={styles.circleWrapper}>
        {/* Breathing circle with gradient glow - only show if breathing pattern is enabled */}
        {showBreathingGuide && (
          <Animated.View style={[styles.breathingCircleWrapper, breathingAnimatedStyle, { width: size, height: size }]}>
            <LinearGradient
              colors={dynamicStyles.breathingCircleGradient}
              style={styles.breathingCircle}
              start={{ x: 0.5, y: 0.5 }}
              end={{ x: 1, y: 1 }}
            />
          </Animated.View>
        )}

        {/* Progress ring */}
        <Svg width={svgSize} height={svgSize} style={styles.progressRing}>
          {/* Background circle */}
          <Circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            stroke={dynamicStyles.progressRingBg}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <Circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            stroke={dynamicStyles.progressRingFg}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation="-90"
            origin={`${svgSize / 2}, ${svgSize / 2}`}
          />
          {/* Chime markers on the ring */}
          {adjustableChimes.map((chime, index) => {
            // Calculate position on circle (starting from top, going clockwise)
            const angle = (chime.timeInSeconds / totalSeconds) * 360 - 90; // -90 to start from top
            const angleRad = (angle * Math.PI) / 180;
            const markerRadius = radius + 20; // Position outside the ring
            const markerX = svgSize / 2 + markerRadius * Math.cos(angleRad);
            const markerY = svgSize / 2 + markerRadius * Math.sin(angleRad);
            const isPassed = (totalSeconds - remainingSeconds) >= chime.timeInSeconds;

            return (
              <G key={index}>
                {/* Musical note icon */}
                <SvgText
                  x={markerX}
                  y={markerY + 4}
                  fontSize={16}
                  fontWeight="600"
                  textAnchor="middle"
                  fill={isPassed ? dynamicStyles.progressRingFg : (isDark ? colors.neutral.gray[400] : theme.colors.neutral.gray[400])}
                >
                  ♪
                </SvgText>
              </G>
            );
          })}
        </Svg>

        {/* Timer display in center - conditionally hidden for distraction-free meditation */}
        <View style={styles.timerCenter}>
          {!hideTimer && (
            <Text style={[styles.timerText, dynamicStyles.timerText]}>{formatTime(remainingSeconds)}</Text>
          )}
        </View>
      </View>

      {/* Progress bar with chime markers */}
      {adjustableChimes.length > 0 && (
        <View style={styles.progressSection}>
          <View style={[styles.progressTrack, dynamicStyles.progressTrack]}>
            <View style={[styles.progressFill, dynamicStyles.progressFill, { width: `${progress}%` }]} />

            {/* Chime markers */}
            {adjustableChimes.map((chime, index) => {
              const position = (chime.timeInSeconds / totalSeconds) * 100;
              const isPassed = (totalSeconds - remainingSeconds) >= chime.timeInSeconds;

              return (
                <View
                  key={index}
                  style={[styles.chimeMarker, { left: `${position}%` }, isPassed && styles.chimeMarkerPassed]}
                >
                  <Text style={[styles.chimeLabel, dynamicStyles.chimeLabel, isPassed && dynamicStyles.chimeLabelPassed]}>
                    {chime.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* Bottom controls - Animated for Focus Mode */}
      <Animated.View style={[styles.controls, controlsAnimatedStyle]}>
        <TouchableOpacity
          style={[styles.secondaryButton, dynamicStyles.secondaryButton]}
          onPress={() => {
            resetHideTimer();
            handleEndSessionPress();
          }}
          accessibilityRole="button"
          accessibilityLabel={t('meditation.finish')}
          accessibilityHint={t('accessibility.finishMeditationHint', 'Ends the current meditation session')}
        >
          <Text style={[styles.secondaryButtonText, dynamicStyles.secondaryButtonText]}>{t('meditation.finish')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryButtonWrapper}
          onPress={() => {
            resetHideTimer();
            setIsRunning(!isRunning);
          }}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={isRunning ? t('meditation.pause') : t('meditation.resume')}
          accessibilityHint={isRunning
            ? t('accessibility.pauseMeditationHint', 'Pauses the meditation timer')
            : t('accessibility.resumeMeditationHint', 'Resumes the meditation timer')}
        >
          <LinearGradient
            colors={currentTheme.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>
              {isRunning ? t('meditation.pause') : t('meditation.resume')}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {/* Focus mode hint - shown when controls are hidden */}
      {!controlsVisible && isRunning && (
        <Animated.View style={[styles.focusModeHint, controlsAnimatedStyle]}>
          <Text style={[styles.focusModeHintText, { color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)' }]}>
            {t('meditation.tapToShowControls', 'Tap to show controls')}
          </Text>
        </Animated.View>
      )}

      {/* End Session Confirmation Modal */}
      <ConfirmationModal
        visible={showEndConfirmation}
        title={t('meditation.endSessionTitle', 'End session?')}
        message={t('meditation.endSessionMessage', 'Your progress will be saved. Are you sure you want to end the meditation?')}
        confirmText={t('meditation.endSessionConfirm', 'End')}
        cancelText={t('meditation.endSessionCancel', 'Continue')}
        onConfirm={handleConfirmEnd}
        onCancel={handleCancelEnd}
        icon="pause-circle-outline"
        isDark={isDark}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },

  // Top controls
  topControls: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    gap: 8,
  },
  audioButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.neutral.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  audioButtonGlow: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(139, 92, 246, 0.25)',
  },
  audioButtonMuted: {
    backgroundColor: theme.colors.neutral.lightGray[100],
  },
  ambientBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.neutral.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  ambientBadgeMuted: {
    backgroundColor: theme.colors.neutral.lightGray[100],
  },
  ambientText: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.colors.neutral.gray[700],
  },
  ambientTextMuted: {
    color: theme.colors.neutral.gray[400],
  },

  // Breathing section
  breathingSection: {
    alignItems: 'center',
    gap: 8,
  },
  instructionLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2,
    color: theme.colors.neutral.gray[400],
    textTransform: 'uppercase',
  },
  breathingText: {
    fontSize: 36,
    fontWeight: '300',
    color: theme.colors.neutral.gray[800],
    letterSpacing: 1,
  },

  // Circle
  circleWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  breathingCircleWrapper: {
    position: 'absolute',
    borderRadius: 999,
    overflow: 'hidden',
  },
  breathingCircle: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
  },
  progressRing: {
    transform: [{ rotate: '0deg' }],
  },
  timerCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: 48,
    fontWeight: '200',
    color: theme.colors.neutral.gray[700],
    fontVariant: ['tabular-nums'],
  },

  // Progress bar
  progressSection: {
    width: '100%',
    paddingHorizontal: 16,
  },
  progressTrack: {
    position: 'relative',
    width: '100%',
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.neutral.lightGray[300],
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    borderRadius: 2,
    backgroundColor: theme.colors.neutral.gray[400],
  },
  chimeMarker: {
    position: 'absolute',
    top: -24,
    transform: [{ translateX: -20 }],
    alignItems: 'center',
  },
  chimeMarkerPassed: {
    // no change needed
  },
  chimeLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.neutral.gray[500],
    backgroundColor: theme.colors.neutral.white,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 1,
  },
  chimeLabelPassed: {
    backgroundColor: theme.colors.neutral.gray[600],
    color: theme.colors.neutral.white,
  },

  // Controls
  controls: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.neutral.white,
    borderWidth: 1,
    borderColor: theme.colors.neutral.lightGray[300],
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.neutral.gray[600],
  },
  primaryButtonWrapper: {
    flex: 1,
    shadowColor: '#8B5CF6', // Use a neutral shadow color
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryButton: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.neutral.white,
  },

  // Focus Mode hint
  focusModeHint: {
    position: 'absolute',
    bottom: 120,
    alignSelf: 'center',
  },
  focusModeHintText: {
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0.5,
    opacity: 0.7,
  },
});

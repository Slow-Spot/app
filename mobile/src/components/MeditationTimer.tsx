import { logger } from '../utils/logger';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  withSequence,
  cancelAnimation,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import theme from '../theme';
import { ChimePoint } from '../types/customSession';

interface MeditationTimerProps {
  totalSeconds: number;
  onComplete: () => void;
  onCancel: () => void;
  chimePoints?: ChimePoint[];
  onAudioToggle?: (enabled: boolean) => void; // Callback to control ambient sound
  ambientSoundName?: string; // Name of the ambient sound (e.g., "Nature", "Ocean", "Silence")
}

export const MeditationTimer: React.FC<MeditationTimerProps> = ({
  totalSeconds,
  onComplete,
  onCancel,
  chimePoints = [],
  onAudioToggle,
  ambientSoundName,
}) => {
  const { t } = useTranslation();
  const [remainingSeconds, setRemainingSeconds] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(true); // Auto-start enabled
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const [adjustableChimes, setAdjustableChimes] = useState<ChimePoint[]>(chimePoints);
  const [showChimeControls, setShowChimeControls] = useState(false);
  const playedChimes = useRef<Set<number>>(new Set());
  const chimeSound = useRef<Audio.Sound | null>(null);

  // Reanimated 4 - Smooth 60fps breathing animation
  // 4 seconds inhale, 4 seconds exhale - more visible animation
  const breathingScale = useSharedValue(0.7);
  const breathingOpacity = useSharedValue(0.4);

  // Load chime sound on mount
  useEffect(() => {
    let isMounted = true;

    const loadChimeSound = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../../assets/sounds/meditation-bell.mp3'),
          {
            shouldPlay: false,
            isLooping: false, // IMPORTANT: Disable looping!
          }
        );
        if (isMounted) {
          chimeSound.current = sound;
          // Ensure looping is disabled
          await sound.setIsLoopingAsync(false);
          logger.log('Chime sound loaded successfully (looping disabled)');
        }
      } catch (error) {
        logger.error('Error loading chime sound:', error);
      }
    };

    loadChimeSound();

    return () => {
      isMounted = false;
      if (chimeSound.current) {
        chimeSound.current.stopAsync().catch(() => {});
        chimeSound.current.unloadAsync().catch((error) => {
          logger.error('Error unloading chime sound:', error);
        });
      }
    };
  }, []);

  // Start breathing animation loop - SYNCHRONIZED with text
  useEffect(() => {
    if (isRunning) {
      let timeoutId: NodeJS.Timeout;

      const animateBreathing = () => {
        // BOX BREATHING: Inhale (4s) → Hold (4s) → Exhale (4s) → Hold (4s)

        // STEP 1: INHALE - grow
        setBreathingPhase('inhale');
        breathingScale.value = withTiming(1.3, {
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
        });
        breathingOpacity.value = withTiming(0.8, {
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
        });

        timeoutId = setTimeout(() => {
          // STEP 2: HOLD (full) - stay big
          setBreathingPhase('hold');
          // Keep current size

          timeoutId = setTimeout(() => {
            // STEP 3: EXHALE - shrink
            setBreathingPhase('exhale');
            breathingScale.value = withTiming(0.7, {
              duration: 4000,
              easing: Easing.inOut(Easing.ease),
            });
            breathingOpacity.value = withTiming(0.4, {
              duration: 4000,
              easing: Easing.inOut(Easing.ease),
            });

            timeoutId = setTimeout(() => {
              // STEP 4: HOLD (empty) - stay small
              setBreathingPhase('rest');
              // Keep current size

              timeoutId = setTimeout(() => {
                // Loop to next cycle
                animateBreathing();
              }, 4000);
            }, 4000);
          }, 4000);
        }, 4000);
      };

      // Start the cycle
      animateBreathing();

      return () => {
        clearTimeout(timeoutId);
        cancelAnimation(breathingScale);
        cancelAnimation(breathingOpacity);
      };
    } else {
      // Stop animations when paused
      cancelAnimation(breathingScale);
      cancelAnimation(breathingOpacity);

      // Stop any playing chime sound
      if (chimeSound.current) {
        chimeSound.current.stopAsync().catch(err => logger.error('Error stopping chime:', err));
      }
    }
  }, [isRunning, breathingScale, breathingOpacity]);

  // Animated style for breathing circle
  const breathingAnimatedStyle = useAnimatedStyle(() => ({
    opacity: breathingOpacity.value,
    transform: [{ scale: breathingScale.value }],
  }));

  // Play chime at designated time
  const playChime = async () => {
    // Always provide haptic feedback for interval bells (works in silent mode too)
    // This is crucial for meditation in crowded places like metro
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (audioEnabled && chimeSound.current) {
      try {
        const status = await chimeSound.current.getStatusAsync();
        if (status.isLoaded) {
          // Stop if playing, reset position, ensure no looping
          await chimeSound.current.stopAsync();
          await chimeSound.current.setPositionAsync(0);
          await chimeSound.current.setIsLoopingAsync(false);
          // Play once
          await chimeSound.current.playAsync();
        }
      } catch (error) {
        logger.error('Error playing chime:', error);
      }
    }
  };

  // Check and play chimes
  useEffect(() => {
    const elapsedSeconds = totalSeconds - remainingSeconds;

    for (const chime of adjustableChimes) {
      if (
        elapsedSeconds >= chime.timeInSeconds &&
        !playedChimes.current.has(chime.timeInSeconds)
      ) {
        playedChimes.current.add(chime.timeInSeconds);
        playChime();
      }
    }
  }, [remainingSeconds, adjustableChimes, totalSeconds]);

  // Adjust chime time (±30 seconds)
  const adjustChimeTime = (index: number, delta: number) => {
    const newChimes = [...adjustableChimes];
    const newTime = Math.max(30, Math.min(totalSeconds - 30, newChimes[index].timeInSeconds + delta));
    newChimes[index] = {
      ...newChimes[index],
      timeInSeconds: newTime,
      label: `${Math.floor(newTime / 60)} min ${newTime % 60}s`,
    };
    setAdjustableChimes(newChimes);
    // Clear played chimes so adjusted ones can play again if needed
    playedChimes.current.clear();
  };

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
  const size = 280;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * progress) / 100;

  return (
    <View style={styles.container}>
      {/* Audio Toggle with Ambient Info */}
      <View style={styles.audioControlContainer}>
        <TouchableOpacity
          style={styles.audioToggle}
          onPress={() => {
            const newState = !audioEnabled;
            setAudioEnabled(newState);
            // Also control ambient sound via callback
            if (onAudioToggle) {
              onAudioToggle(newState);
            }
          }}
          accessibilityLabel={audioEnabled ? 'Audio enabled' : 'Audio disabled'}
          accessibilityRole="button"
        >
          <Ionicons
            name={audioEnabled ? 'volume-high' : 'volume-mute'}
            size={28}
            color={audioEnabled ? theme.colors.accent.mint[600] : theme.colors.neutral.gray[400]}
          />
        </TouchableOpacity>
        {ambientSoundName && (
          <View style={[
            styles.ambientLabelContainer,
            !audioEnabled && styles.ambientLabelContainerMuted
          ]}>
            <Ionicons
              name={audioEnabled ? 'musical-notes' : 'musical-notes-outline'}
              size={12}
              color={audioEnabled ? theme.colors.accent.mint[600] : theme.colors.neutral.gray[400]}
            />
            <Text style={[
              styles.ambientLabel,
              !audioEnabled && styles.ambientLabelMuted
            ]}>
              {ambientSoundName}
            </Text>
          </View>
        )}
      </View>

      {/* Breathing Guidance */}
      <View style={styles.breathingGuidance}>
        <Text style={styles.instructionText}>
          {t('meditation.focusOnBreath', 'SKUP SIĘ NA ODDECHU')}
        </Text>
        <Animated.Text style={[
          styles.breathingText,
          breathingPhase === 'inhale' && styles.breathingTextInhale,
          breathingPhase === 'exhale' && styles.breathingTextExhale,
          (breathingPhase === 'hold' || breathingPhase === 'rest') && styles.breathingTextHold,
        ]}>
          {breathingPhase === 'inhale' && (t('meditation.breatheIn', 'Wdech'))}
          {breathingPhase === 'hold' && 'Trzymaj'}
          {breathingPhase === 'exhale' && (t('meditation.breatheOut', 'Wydech'))}
          {breathingPhase === 'rest' && 'Trzymaj'}
        </Animated.Text>
      </View>

      {/* Circular Progress */}
      <View style={styles.circleContainer}>
        {/* Breathing Circle Animation - Powered by Reanimated 4 */}
        <Animated.View style={[styles.breathingCircle, breathingAnimatedStyle]}>
          <View style={styles.breathingCircleInner} />
        </Animated.View>

        <Svg width={size} height={size} style={styles.svg}>
          {/* Background Circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.3)"
            strokeWidth={strokeWidth}
            fill="none"
          />

          {/* Progress Circle - Enhanced with glow */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={theme.colors.accent.mint[500]}
            strokeWidth={strokeWidth + 1}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
            opacity={0.6}
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={theme.colors.accent.mint[600]}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
          />
        </Svg>

        {/* Simple indicator - Focus on breathing, not time */}
        <View style={styles.timerOverlay}>
          <Text style={styles.minutesText}>
            {t('meditation.inProgress', 'W TRAKCIE')}
          </Text>
        </View>
      </View>

      {/* Progress Bar with Chime Markers */}
      <View style={styles.progressBarContainer}>
        {adjustableChimes.length > 0 && !isRunning && (
          <TouchableOpacity
            style={styles.adjustButton}
            onPress={() => setShowChimeControls(!showChimeControls)}
            accessibilityLabel="Toggle chime adjustment controls"
            accessibilityRole="button"
          >
            <Ionicons
              name={showChimeControls ? 'lock-closed' : 'lock-open'}
              size={16}
              color="rgba(255, 255, 255, 0.8)"
            />
            <Text style={styles.adjustButtonText}>
              {showChimeControls ? 'Lock' : 'Adjust'}
            </Text>
          </TouchableOpacity>
        )}

        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressIndicator,
              { width: `${progress}%` }
            ]}
          />

          {/* Chime markers - larger and more visible */}
          {adjustableChimes.map((chime, index) => {
            const position = (chime.timeInSeconds / totalSeconds) * 100;
            const isPassed = (totalSeconds - remainingSeconds) >= chime.timeInSeconds;

            return (
              <View
                key={index}
                style={[
                  styles.chimeMarkerContainer,
                  { left: `${position}%` },
                ]}
              >
                <View style={[
                  styles.chimeMarker,
                  isPassed && styles.chimeMarkerPassed,
                ]}>
                  <Ionicons
                    name="musical-note"
                    size={16}
                    color={isPassed ? theme.colors.neutral.white : theme.colors.accent.blue[600]}
                  />
                </View>
                {chime.label && (
                  <Text style={[
                    styles.chimeLabel,
                    isPassed && styles.chimeLabelPassed,
                  ]}>
                    {chime.label}
                  </Text>
                )}

                {/* Adjustment controls - shown when paused and controls enabled */}
                {!isRunning && showChimeControls && (
                  <View style={styles.chimeAdjustControls}>
                    <TouchableOpacity
                      style={styles.chimeAdjustButton}
                      onPress={() => adjustChimeTime(index, -30)}
                      accessibilityLabel="Move chime earlier by 30 seconds"
                      accessibilityRole="button"
                    >
                      <Ionicons name="remove-circle" size={20} color={theme.colors.accent.mint[400]} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.chimeAdjustButton}
                      onPress={() => adjustChimeTime(index, 30)}
                      accessibilityLabel="Move chime later by 30 seconds"
                      accessibilityRole="button"
                    >
                      <Ionicons name="add-circle" size={20} color={theme.colors.accent.mint[400]} />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={onCancel}
        >
          <Text style={styles.buttonText}>
            {t('meditation.finish')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={() => {
            setIsRunning(!isRunning);
          }}
        >
          <Text style={styles.primaryButtonText}>
            {isRunning
              ? t('meditation.pause')
              : t('meditation.resume')
            }
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xl,
  },
  audioControlContainer: {
    position: 'absolute',
    top: theme.spacing.lg,
    right: theme.spacing.lg,
    alignItems: 'flex-end',
    gap: theme.spacing.xs,
    zIndex: 10,
  },
  audioToggle: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.neutral.white,
    borderWidth: 2,
    borderColor: theme.colors.accent.blue[400],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  ambientLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(42, 168, 124, 0.12)',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(42, 168, 124, 0.3)',
    shadowColor: theme.colors.accent.mint[600],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  ambientLabelContainerMuted: {
    backgroundColor: 'rgba(200, 200, 200, 0.15)',
    borderColor: 'rgba(200, 200, 200, 0.3)',
    shadowColor: '#000',
    shadowOpacity: 0.08,
  },
  ambientLabel: {
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.accent.mint[700],
    letterSpacing: 0.3,
  },
  ambientLabelMuted: {
    color: theme.colors.neutral.gray[500],
  },
  breathingGuidance: {
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  instructionText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.accent.blue[700],
    fontWeight: theme.typography.fontWeights.semiBold,
    letterSpacing: 1,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  breathingText: {
    fontSize: 48,
    fontWeight: theme.typography.fontWeights.bold,
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  breathingTextInhale: {
    color: theme.colors.accent.mint[600],
  },
  breathingTextExhale: {
    color: theme.colors.accent.blue[600],
  },
  breathingTextHold: {
    color: theme.colors.accent.lavender[600],
  },
  circleContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 280,
    height: 280,
  },
  breathingCircle: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 280,
    height: 280,
  },
  breathingCircleInner: {
    width: '100%',
    height: '100%',
    borderRadius: 140,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  svg: {
    transform: [{ rotate: '0deg' }],
  },
  timerOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    fontSize: 64,
    fontWeight: theme.typography.fontWeights.light,
    color: theme.colors.accent.blue[600],
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  minutesText: {
    fontSize: theme.typography.fontSizes.xs,
    marginTop: theme.spacing.xs,
    color: theme.colors.accent.blue[600],
    textTransform: 'uppercase',
    letterSpacing: 2.5,
    fontWeight: theme.typography.fontWeights.semiBold,
    opacity: 0.85,
  },
  progressBarContainer: {
    width: '80%',
    paddingVertical: theme.spacing.md,
  },
  progressBar: {
    position: 'relative',
    width: '100%',
    height: 6,
    borderRadius: theme.borderRadius.sm,
    overflow: 'visible',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  progressIndicator: {
    height: '100%',
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.accent.mint[400],
  },
  controls: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    gap: theme.spacing.md,
  },
  button: {
    flex: 1,
    maxWidth: 180,
    minWidth: 140,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: theme.colors.accent.mint[600],
    shadowColor: theme.colors.accent.mint[700],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  secondaryButton: {
    backgroundColor: theme.colors.neutral.white,
    borderWidth: 2.5,
    borderColor: theme.colors.accent.blue[600],
    shadowColor: theme.colors.accent.blue[500],
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  primaryButtonText: {
    color: theme.colors.neutral.white,
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.bold,
    letterSpacing: 0.5,
  },
  buttonText: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.accent.blue[700],
    letterSpacing: 0.5,
  },
  chimeMarkerContainer: {
    position: 'absolute',
    top: -15,
    alignItems: 'center',
    transform: [{ translateX: -12 }],
  },
  chimeMarker: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.neutral.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: theme.colors.accent.blue[500],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  },
  chimeMarkerPassed: {
    backgroundColor: theme.colors.accent.mint[500],
    borderColor: theme.colors.accent.mint[600],
  },
  chimeLabel: {
    position: 'absolute',
    top: -26,
    fontSize: 9,
    color: theme.colors.accent.blue[700],
    backgroundColor: theme.colors.neutral.white,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    fontWeight: theme.typography.fontWeights.semiBold,
    textAlign: 'center',
    minWidth: 32,
    letterSpacing: 0.3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.15,
    shadowRadius: 1,
    elevation: 1,
  },
  chimeLabelPassed: {
    color: theme.colors.accent.mint[700],
    backgroundColor: theme.colors.accent.mint[100],
  },
  adjustButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.xs,
  },
  adjustButtonText: {
    fontSize: theme.typography.fontSizes.xs,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: theme.typography.fontWeights.medium,
  },
  chimeAdjustControls: {
    position: 'absolute',
    top: 30,
    flexDirection: 'row',
    gap: theme.spacing.xs,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.xs,
  },
  chimeAdjustButton: {
    padding: theme.spacing.xs,
  },
});

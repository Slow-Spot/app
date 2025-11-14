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
}

export const MeditationTimer: React.FC<MeditationTimerProps> = ({
  totalSeconds,
  onComplete,
  onCancel,
  chimePoints = [],
}) => {
  const { t } = useTranslation();
  const [remainingSeconds, setRemainingSeconds] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(true); // Auto-start enabled
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'exhale'>('inhale');
  const [adjustableChimes, setAdjustableChimes] = useState<ChimePoint[]>(chimePoints);
  const [showChimeControls, setShowChimeControls] = useState(false);
  const playedChimes = useRef<Set<number>>(new Set());
  const chimeSound = useRef<Audio.Sound | null>(null);

  // Reanimated 4 - Smooth 60fps breathing animation
  // 4 seconds inhale, 4 seconds exhale
  const breathingScale = useSharedValue(0.85);
  const breathingOpacity = useSharedValue(0.3);

  // Load chime sound on mount
  useEffect(() => {
    let isMounted = true;

    const loadChimeSound = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../../assets/sounds/meditation-bell.mp3'),
          { shouldPlay: false }
        );
        if (isMounted) {
          chimeSound.current = sound;
          console.log('Chime sound loaded successfully');
        }
      } catch (error) {
        console.error('Error loading chime sound:', error);
      }
    };

    loadChimeSound();

    return () => {
      isMounted = false;
      if (chimeSound.current) {
        chimeSound.current.unloadAsync().catch((error) => {
          console.error('Error unloading chime sound:', error);
        });
      }
    };
  }, []);

  // Start breathing animation loop
  useEffect(() => {
    if (isRunning) {
      // Inhale and exhale sequence with infinite repeat
      breathingScale.value = withRepeat(
        withSequence(
          withTiming(1.0, {
            duration: 4000,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(0.85, {
            duration: 4000,
            easing: Easing.inOut(Easing.ease),
          })
        ),
        -1, // infinite repeat
        false
      );

      breathingOpacity.value = withRepeat(
        withSequence(
          withTiming(0.6, {
            duration: 4000,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(0.3, {
            duration: 4000,
            easing: Easing.inOut(Easing.ease),
          })
        ),
        -1, // infinite repeat
        false
      );
    } else {
      // Cancel animations when paused
      cancelAnimation(breathingScale);
      cancelAnimation(breathingOpacity);
    }

    return () => {
      cancelAnimation(breathingScale);
      cancelAnimation(breathingOpacity);
    };
  }, [isRunning, breathingScale, breathingOpacity]);

  // Track breathing phase for guidance text
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setBreathingPhase((prev) => (prev === 'inhale' ? 'exhale' : 'inhale'));
    }, 4000); // Switch every 4 seconds

    return () => clearInterval(interval);
  }, [isRunning]);

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
          await chimeSound.current.setPositionAsync(0); // Reset to start
          await chimeSound.current.playAsync();
        }
      } catch (error) {
        console.error('Error playing chime:', error);
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
      {/* Audio Toggle */}
      <TouchableOpacity
        style={styles.audioToggle}
        onPress={() => setAudioEnabled(!audioEnabled)}
        accessibilityLabel={audioEnabled ? 'Audio enabled' : 'Audio disabled'}
        accessibilityRole="button"
      >
        <Ionicons
          name={audioEnabled ? 'volume-high' : 'volume-mute'}
          size={24}
          color="rgba(255, 255, 255, 0.8)"
        />
      </TouchableOpacity>

      {/* Breathing Guidance */}
      <View style={styles.breathingGuidance}>
        <Text style={styles.instructionText}>
          {t('meditation.focusOnBreath', 'Focus on your breath')}
        </Text>
        <Animated.Text style={styles.breathingText}>
          {breathingPhase === 'inhale'
            ? t('meditation.breatheIn', 'Breathe In')
            : t('meditation.breatheOut', 'Breathe Out')}
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

          {/* Progress Circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={theme.colors.accent.mint[400]}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
          />
        </Svg>

        {/* Progress Indicator - No exact time shown */}
        <View style={styles.timerOverlay}>
          <Text style={styles.progressText}>
            {Math.round(progress)}%
          </Text>
          <Text style={styles.minutesText}>
            {t('meditation.inProgress', 'In Progress')}
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
                    name={audioEnabled ? 'musical-note' : 'musical-note-outline'}
                    size={14}
                    color={isPassed ? theme.colors.accent.mint[300] : 'rgba(255, 255, 255, 0.9)'}
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
  audioToggle: {
    position: 'absolute',
    top: theme.spacing.lg,
    right: theme.spacing.lg,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.round,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    zIndex: 10,
  },
  breathingGuidance: {
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  instructionText: {
    fontSize: theme.typography.fontSizes.sm,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: theme.typography.fontWeights.medium,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  breathingText: {
    fontSize: theme.typography.fontSizes.xxxl,
    fontWeight: theme.typography.fontWeights.light,
    color: theme.colors.text.inverse,
    letterSpacing: 2,
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
    color: theme.colors.text.inverse,
  },
  minutesText: {
    fontSize: theme.typography.fontSizes.sm,
    marginTop: theme.spacing.xs,
    color: 'rgba(255, 255, 255, 0.85)',
    textTransform: 'uppercase',
    letterSpacing: 1,
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
    maxWidth: 150,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.round,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: theme.colors.accent.mint[500],
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  primaryButtonText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semiBold,
    letterSpacing: 0.5,
  },
  buttonText: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: theme.colors.text.inverse,
    letterSpacing: 0.5,
  },
  chimeMarkerContainer: {
    position: 'absolute',
    top: -15,
    alignItems: 'center',
    transform: [{ translateX: -12 }],
  },
  chimeMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  },
  chimeMarkerPassed: {
    backgroundColor: theme.colors.accent.mint[400],
    borderColor: theme.colors.accent.mint[300],
  },
  chimeLabel: {
    position: 'absolute',
    top: -20,
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: theme.typography.fontWeights.semiBold,
    textAlign: 'center',
    minWidth: 50,
    letterSpacing: 0.5,
  },
  chimeLabelPassed: {
    color: theme.colors.accent.mint[200],
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

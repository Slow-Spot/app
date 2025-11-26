import { logger } from '../utils/logger';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Audio } from 'expo-av';
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
import theme, { getThemeColors } from '../theme';
import { ChimePoint } from '../types/customSession';
import { ConfirmationModal } from './ConfirmationModal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface MeditationTimerProps {
  totalSeconds: number;
  onComplete: () => void;
  onCancel: () => void;
  chimePoints?: ChimePoint[];
  onAudioToggle?: (enabled: boolean) => void;
  ambientSoundName?: string;
  isDark?: boolean;
}

export const MeditationTimer: React.FC<MeditationTimerProps> = ({
  totalSeconds,
  onComplete,
  onCancel,
  chimePoints = [],
  onAudioToggle,
  ambientSoundName,
  isDark = false,
}) => {
  const { t } = useTranslation();

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
    breathingCircle: {
      backgroundColor: isDark ? colors.neutral.charcoal[100] : theme.colors.neutral.lightGray[200],
    },
    progressTrack: {
      backgroundColor: isDark ? colors.neutral.charcoal[100] : theme.colors.neutral.lightGray[300],
    },
    progressFill: {
      backgroundColor: isDark ? colors.neutral.gray[300] : theme.colors.neutral.gray[400],
    },
    progressRingBg: isDark ? colors.neutral.charcoal[100] : theme.colors.neutral.lightGray[300],
    progressRingFg: isDark ? colors.neutral.gray[300] : theme.colors.neutral.gray[500],
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
    primaryButton: {
      backgroundColor: isDark ? colors.accent.blue[600] : theme.colors.neutral.gray[800],
    },
    primaryButtonText: {
      color: colors.neutral.white,
    },
  }), [colors, isDark]);
  const [remainingSeconds, setRemainingSeconds] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const [adjustableChimes, setAdjustableChimes] = useState<ChimePoint[]>(chimePoints);
  const [showEndConfirmation, setShowEndConfirmation] = useState(false);
  const playedChimes = useRef<Set<number>>(new Set());
  const chimeSound = useRef<Audio.Sound | null>(null);

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

  // Breathing animation - very subtle
  const breathingScale = useSharedValue(0.95);
  const breathingOpacity = useSharedValue(0.3);

  // Load chime sound
  useEffect(() => {
    let isMounted = true;

    const loadChimeSound = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../../assets/sounds/meditation-bell.mp3'),
          { shouldPlay: false, isLooping: false }
        );
        if (isMounted) {
          chimeSound.current = sound;
          await sound.setIsLoopingAsync(false);
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
        chimeSound.current.unloadAsync().catch(() => {});
      }
    };
  }, []);

  // Breathing animation - synchronized with text
  useEffect(() => {
    if (isRunning) {
      let timeoutId: NodeJS.Timeout;

      const animateBreathing = () => {
        // INHALE - grow
        setBreathingPhase('inhale');
        breathingScale.value = withTiming(1.05, {
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
        });
        breathingOpacity.value = withTiming(0.5, {
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
        });

        timeoutId = setTimeout(() => {
          // HOLD
          setBreathingPhase('hold');

          timeoutId = setTimeout(() => {
            // EXHALE - shrink
            setBreathingPhase('exhale');
            breathingScale.value = withTiming(0.95, {
              duration: 4000,
              easing: Easing.inOut(Easing.ease),
            });
            breathingOpacity.value = withTiming(0.3, {
              duration: 4000,
              easing: Easing.inOut(Easing.ease),
            });

            timeoutId = setTimeout(() => {
              // REST
              setBreathingPhase('rest');

              timeoutId = setTimeout(() => {
                animateBreathing();
              }, 4000);
            }, 4000);
          }, 4000);
        }, 4000);
      };

      animateBreathing();

      return () => {
        clearTimeout(timeoutId);
        cancelAnimation(breathingScale);
        cancelAnimation(breathingOpacity);
      };
    } else {
      cancelAnimation(breathingScale);
      cancelAnimation(breathingOpacity);
      if (chimeSound.current) {
        chimeSound.current.stopAsync().catch(() => {});
      }
    }
  }, [isRunning, breathingScale, breathingOpacity]);

  const breathingAnimatedStyle = useAnimatedStyle(() => ({
    opacity: breathingOpacity.value,
    transform: [{ scale: breathingScale.value }],
  }));

  // Play chime
  const playChime = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (audioEnabled && chimeSound.current) {
      try {
        const status = await chimeSound.current.getStatusAsync();
        if (status.isLoaded) {
          await chimeSound.current.stopAsync();
          await chimeSound.current.setPositionAsync(0);
          await chimeSound.current.setIsLoopingAsync(false);
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
    <View style={styles.container}>
      {/* Top controls - Audio & Ambient */}
      <View style={styles.topControls}>
        <TouchableOpacity
          style={[styles.audioButton, dynamicStyles.audioButton, !audioEnabled && dynamicStyles.audioButtonMuted]}
          onPress={() => {
            const newState = !audioEnabled;
            setAudioEnabled(newState);
            if (onAudioToggle) onAudioToggle(newState);
          }}
          accessibilityLabel={audioEnabled ? 'Audio enabled' : 'Audio disabled'}
        >
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
      </View>

      {/* Breathing guidance - minimal */}
      <View style={styles.breathingSection}>
        <Text style={[styles.instructionLabel, dynamicStyles.instructionLabel]}>
          {t('meditation.focusOnBreath', 'SKUP SIĘ NA ODDECHU')}
        </Text>
        <Animated.Text style={[styles.breathingText, dynamicStyles.breathingText]}>
          {breathingPhase === 'inhale' && t('meditation.breatheIn', 'Wdech')}
          {breathingPhase === 'hold' && t('meditation.hold', 'Trzymaj')}
          {breathingPhase === 'exhale' && t('meditation.breatheOut', 'Wydech')}
          {breathingPhase === 'rest' && t('meditation.hold', 'Trzymaj')}
        </Animated.Text>
      </View>

      {/* Main circle with timer */}
      <View style={styles.circleWrapper}>
        {/* Subtle breathing background */}
        <Animated.View style={[styles.breathingCircle, dynamicStyles.breathingCircle, breathingAnimatedStyle, { width: size, height: size }]} />

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

        {/* Timer display in center */}
        <View style={styles.timerCenter}>
          <Text style={[styles.timerText, dynamicStyles.timerText]}>{formatTime(remainingSeconds)}</Text>
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

      {/* Bottom controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={[styles.secondaryButton, dynamicStyles.secondaryButton]} onPress={handleEndSessionPress}>
          <Text style={[styles.secondaryButtonText, dynamicStyles.secondaryButtonText]}>{t('meditation.finish')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.primaryButton, dynamicStyles.primaryButton]}
          onPress={() => setIsRunning(!isRunning)}
        >
          <Text style={[styles.primaryButtonText, dynamicStyles.primaryButtonText]}>
            {isRunning ? t('meditation.pause') : t('meditation.resume')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* End Session Confirmation Modal */}
      <ConfirmationModal
        visible={showEndConfirmation}
        title={t('meditation.endSessionTitle', 'Zakończyć sesję?')}
        message={t('meditation.endSessionMessage', 'Twój postęp zostanie zapisany. Czy na pewno chcesz zakończyć medytację?')}
        confirmText={t('meditation.endSessionConfirm', 'Zakończ')}
        cancelText={t('meditation.endSessionCancel', 'Kontynuuj')}
        onConfirm={handleConfirmEnd}
        onCancel={handleCancelEnd}
        icon="pause-circle-outline"
        isDark={isDark}
      />
    </View>
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
  breathingCircle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: theme.colors.neutral.lightGray[200],
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
  primaryButton: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.neutral.gray[800],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.neutral.white,
  },
});

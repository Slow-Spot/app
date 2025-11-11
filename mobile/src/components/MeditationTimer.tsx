import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { useTranslation } from 'react-i18next';
import Svg, { Circle } from 'react-native-svg';

interface MeditationTimerProps {
  totalSeconds: number;
  onComplete: () => void;
  onCancel: () => void;
}

export const MeditationTimer: React.FC<MeditationTimerProps> = ({
  totalSeconds,
  onComplete,
  onCancel,
}) => {
  const { t } = useTranslation();
  const [remainingSeconds, setRemainingSeconds] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

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
      {/* Circular Progress */}
      <View style={styles.circleContainer}>
        <Svg width={size} height={size} style={styles.svg}>
          {/* Background Circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={isDark ? '#3A3A3C' : '#E5E5E5'}
            strokeWidth={strokeWidth}
            fill="none"
          />

          {/* Progress Circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={isDark ? '#0A84FF' : '#007AFF'}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
          />
        </Svg>

        {/* Timer Display */}
        <View style={styles.timerOverlay}>
          <Text style={[styles.timeText, isDark ? styles.darkText : styles.lightText]}>
            {formatTime(remainingSeconds)}
          </Text>
          <Text style={[styles.minutesText, isDark ? styles.darkPlaceholder : styles.lightPlaceholder]}>
            {t('meditation.minutes', { count: Math.ceil(remainingSeconds / 60) })}
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={[styles.progressBar, isDark ? styles.darkProgressBg : styles.lightProgressBg]}>
        <View
          style={[
            styles.progressIndicator,
            isDark ? styles.darkProgress : styles.lightProgress,
            { width: `${progress}%` }
          ]}
        />
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton, isDark ? styles.darkSecondaryButton : styles.lightSecondaryButton]}
          onPress={onCancel}
        >
          <Text style={[styles.buttonText, isDark ? styles.darkText : styles.lightText]}>
            {t('meditation.finish')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.primaryButton, isDark ? styles.darkPrimaryButton : styles.lightPrimaryButton]}
          onPress={() => setIsRunning(!isRunning)}
        >
          <Text style={styles.primaryButtonText}>
            {isRunning ? t('meditation.pause') : t('meditation.resume')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 48,
  },
  circleContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 280,
    height: 280,
  },
  svg: {
    transform: [{ rotate: '0deg' }],
  },
  timerOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 72,
    fontWeight: '300',
  },
  minutesText: {
    fontSize: 16,
    marginTop: 8,
  },
  lightText: {
    color: '#000000',
  },
  darkText: {
    color: '#FFFFFF',
  },
  lightPlaceholder: {
    color: '#8E8E93',
  },
  darkPlaceholder: {
    color: '#8E8E93',
  },
  progressBar: {
    width: '80%',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  lightProgressBg: {
    backgroundColor: '#E5E5E5',
  },
  darkProgressBg: {
    backgroundColor: '#3A3A3C',
  },
  progressIndicator: {
    height: '100%',
    borderRadius: 4,
  },
  lightProgress: {
    backgroundColor: '#007AFF',
  },
  darkProgress: {
    backgroundColor: '#0A84FF',
  },
  controls: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    gap: 16,
  },
  button: {
    flex: 1,
    maxWidth: 150,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButton: {
    // Primary button specific styles
  },
  lightPrimaryButton: {
    backgroundColor: '#007AFF',
  },
  darkPrimaryButton: {
    backgroundColor: '#0A84FF',
  },
  secondaryButton: {
    borderWidth: 1,
  },
  lightSecondaryButton: {
    backgroundColor: '#F2F2F7',
    borderColor: '#E5E5E5',
  },
  darkSecondaryButton: {
    backgroundColor: '#2C2C2E',
    borderColor: '#3A3A3C',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '500',
  },
});

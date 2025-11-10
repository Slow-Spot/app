import React, { useState, useEffect } from 'react';
import { YStack, XStack, Text, Button, Circle, Progress } from 'tamagui';
import { useTranslation } from 'react-i18next';

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

  return (
    <YStack gap="$6" alignItems="center" justifyContent="center" flex={1} p="$6">
      {/* Circular Progress */}
      <YStack alignItems="center" justifyContent="center" position="relative">
        <Circle size={280} borderWidth={8} borderColor="$borderColor" />

        <Circle
          size={280}
          borderWidth={8}
          borderColor="$primary"
          position="absolute"
          style={{
            strokeDasharray: 880,
            strokeDashoffset: 880 - (880 * progress) / 100,
            transform: [{ rotate: '-90deg' }],
          }}
        />

        <YStack
          position="absolute"
          alignItems="center"
          justifyContent="center"
        >
          <Text fontSize={72} fontWeight="300" color="$color">
            {formatTime(remainingSeconds)}
          </Text>
          <Text fontSize={16} color="$placeholderColor" mt="$2">
            {t('meditation.minutes', { count: Math.ceil(remainingSeconds / 60) })}
          </Text>
        </YStack>
      </YStack>

      {/* Progress Bar */}
      <Progress size="$2" value={progress} width="80%">
        <Progress.Indicator animation="bouncy" background="$primary" />
      </Progress>

      {/* Controls */}
      <XStack gap="$4" justifyContent="center" width="100%">
        <Button
          size="$5"
          background="$backgroundPress"
          color="$color"
          br="$round"
          flex={1}
          maxWidth={150}
          onPress={onCancel}
        >
          {t('meditation.finish')}
        </Button>

        <Button
          size="$5"
          background="$primary"
          color="$background"
          br="$round"
          flex={1}
          maxWidth={150}
          onPress={() => setIsRunning(!isRunning)}
        >
          {isRunning ? t('meditation.pause') : t('meditation.resume')}
        </Button>
      </XStack>
    </YStack>
  );
};

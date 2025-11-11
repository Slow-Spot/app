import React from 'react';
import { Card, YStack, XStack, H4, Paragraph, Text, Button } from 'tamagui';
import { useTranslation } from 'react-i18next';
import { MeditationSession } from '../services/api';

interface SessionCardProps {
  session: MeditationSession;
  onPress: () => void;
}

const getLevelLabel = (level: number): string => {
  const levels = ['beginner', 'intermediate', 'advanced', 'expert', 'master'];
  return levels[level - 1] || 'beginner';
};

const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  return `${minutes} min`;
};

export const SessionCard: React.FC<SessionCardProps> = ({ session, onPress }) => {
  const { t } = useTranslation();

  return (
    <Card
      elevate
      size="$4"
      bordered
      animation="bouncy"
      scale={0.9}
      hoverStyle={{ scale: 0.925 }}
      pressStyle={{ scale: 0.875 }}
      p="$4"
      background="$background"
      borderColor="$borderColor"
      borderRadius="$4"
      onPress={onPress}
    >
      <Card.Header padded>
        <YStack gap="$2">
          <H4 size="$6" fontWeight="500" color="$color">
            {session.title}
          </H4>
          {session.description && (
            <Paragraph size="$3" color="$placeholderColor">
              {session.description}
            </Paragraph>
          )}
        </YStack>
      </Card.Header>

      <Card.Footer padded>
        <XStack jc="space-between" ai="center" width="100%">
          <YStack gap="$1">
            <XStack gap="$2" ai="center">
              <Text fontSize="$2" color="$color">
                {t('meditation.duration')}:
              </Text>
              <Text fontSize="$3" fontWeight="600" color="$color">
                {formatDuration(session.durationSeconds)}
              </Text>
            </XStack>
            <XStack gap="$2" ai="center">
              <Text fontSize="$2" color="$color">
                {t('meditation.level')}:
              </Text>
              <Text fontSize="$3" fontWeight="600" color="$color">
                {t(`meditation.${getLevelLabel(session.level)}`)}
              </Text>
            </XStack>
          </YStack>

          <Button
            size="$3"
            background="$primary"
            color="$background"
            borderRadius="$round"
            px="$4"
          >
            {t('meditation.start')}
          </Button>
        </XStack>
      </Card.Footer>
    </Card>
  );
};

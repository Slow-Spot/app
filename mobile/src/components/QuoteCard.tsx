import React from 'react';
import { YStack, Text, Card, H3, Paragraph } from 'tamagui';
import { Quote } from '../services/api';

interface QuoteCardProps {
  quote: Quote;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({ quote }) => {
  return (
    <Card
      elevate
      size="$4"
      bordered
      animation="bouncy"
      scale={0.9}
      hoverStyle={{ scale: 0.925 }}
      pressStyle={{ scale: 0.875 }}
      padding="$4"
      background="$background"
      borderColor="$borderColor"
      borderRadius="$4"
    >
      <Card.Header padded>
        <YStack gap="$2" ai="center">
          <H3 size="$7" fontWeight="300" color="$color" ta="center">
            "{quote.text}"
          </H3>
          {quote.author && (
            <Paragraph
              size="$3"
              color="$placeholderColor"
              ta="center"
              fontStyle="italic"
            >
              — {quote.author}
            </Paragraph>
          )}
        </YStack>
      </Card.Header>

      {(quote.category || quote.cultureTag) && (
        <Card.Footer padded>
          <YStack gap="$1" ai="center">
            {quote.category && (
              <Text fontSize="$2" color="$color" ta="center">
                {quote.category}
              </Text>
            )}
            {quote.cultureTag && (
              <Text fontSize="$2" color="$placeholderColor" ta="center">
                {quote.cultureTag}
              </Text>
            )}
          </YStack>
        </Card.Footer>
      )}
    </Card>
  );
};

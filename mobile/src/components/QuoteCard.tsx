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
      backgroundColor="$background"
      borderColor="$borderColor"
      borderRadius="$lg"
    >
      <Card.Header padded>
        <YStack gap="$2">
          <H3 size="$7" fontWeight="300" color="$color" textAlign="center">
            "{quote.text}"
          </H3>
          {quote.author && (
            <Paragraph
              size="$3"
              color="$placeholderColor"
              textAlign="center"
              fontStyle="italic"
            >
              — {quote.author}
            </Paragraph>
          )}
        </YStack>
      </Card.Header>

      {(quote.category || quote.cultureTag) && (
        <Card.Footer padded>
          <YStack gap="$1">
            {quote.category && (
              <Text size="$2" color="$secondary" textAlign="center">
                {quote.category}
              </Text>
            )}
            {quote.cultureTag && (
              <Text size="$2" color="$placeholderColor" textAlign="center">
                {quote.cultureTag}
              </Text>
            )}
          </YStack>
        </Card.Footer>
      )}
    </Card>
  );
};

/**
 * Meditation Timer Android Widget
 *
 * Widget na home screen Android pokazujący aktualną sesję medytacji.
 * Używa react-native-android-widget dla natywnego renderingu.
 *
 * UWAGA: Android widgets nie mogą używać React Native theme system w runtime.
 * Kolory muszą być hardcoded jako stringi hex.
 * Wartości poniżej są zsynchronizowane z design system (src/theme/colors.ts).
 */

import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

// ===========================================
// KOLORY WIDGETU - zsynchronizowane z design system
// Źródło: src/theme/colors.ts
// ===========================================

// Brand colors (brandColors.purple)
const WIDGET_COLORS = {
  // Główny kolor brandu - brandColors.purple.primary
  brandPrimary: '#8B5CF6',

  // Kolory tekstu
  white: '#FFFFFF',                    // neutralColors.white
  whiteAlpha80: '#FFFFFFCC',           // rgba(255, 255, 255, 0.8)
  whiteAlpha70: '#FFFFFFB3',           // rgba(255, 255, 255, 0.7)
  whiteAlpha30: '#FFFFFF4D',           // rgba(255, 255, 255, 0.3)
  whiteAlpha20: '#FFFFFF33',           // rgba(255, 255, 255, 0.2)

  // Kolory tekstu na jasnym tle
  textPrimary: '#1F2937',              // neutralColors.charcoal[100] zbliżony
  textSecondary: '#6B7280',            // neutralColors.gray[500]

  // Tło karty
  cardBackground: '#FFFFFF',           // backgrounds.card
} as const;

export interface MeditationTimerWidgetProps {
  // Czy sesja jest aktywna
  isActive: boolean;
  // Pozostały czas w sekundach (jeśli sesja aktywna)
  remainingSeconds?: number;
  // Czy sesja jest spauzowana
  isPaused?: boolean;
  // Całkowity czas sesji w sekundach
  totalSeconds?: number;
}

/**
 * Formatuje sekundy do formatu MM:SS
 */
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Formatuje sekundy do formatu "X min"
 */
function formatMinutes(seconds: number): string {
  const mins = Math.ceil(seconds / 60);
  return `${mins} min`;
}

/**
 * Widget pokazujący timer medytacji - stan aktywnej sesji
 */
function ActiveSessionWidget({
  remainingSeconds = 0,
  isPaused = false,
  totalSeconds = 0,
}: Omit<MeditationTimerWidgetProps, 'isActive'>) {
  const progress = totalSeconds > 0 ? Math.round(((totalSeconds - remainingSeconds) / totalSeconds) * 100) : 0;
  const progressWidth = Math.max(1, progress);

  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: WIDGET_COLORS.brandPrimary,
        borderRadius: 24,
        padding: 16,
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
      clickAction="OPEN_APP"
    >
      {/* Header */}
      <FlexWidget
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: 'match_parent',
        }}
      >
        <TextWidget
          text="Slow Spot"
          style={{
            fontSize: 14,
            color: WIDGET_COLORS.whiteAlpha80,
          }}
        />
        <FlexWidget
          style={{
            backgroundColor: WIDGET_COLORS.whiteAlpha20,
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
          }}
        >
          <TextWidget
            text={isPaused ? 'PAUSED' : 'IN SESSION'}
            style={{
              fontSize: 12,
              color: WIDGET_COLORS.white,
            }}
          />
        </FlexWidget>
      </FlexWidget>

      {/* Timer */}
      <FlexWidget
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: 'match_parent',
        }}
      >
        <TextWidget
          text={formatTime(remainingSeconds)}
          style={{
            fontSize: 48,
            color: WIDGET_COLORS.white,
          }}
        />
        <TextWidget
          text={`${formatMinutes(remainingSeconds)} remaining`}
          style={{
            fontSize: 14,
            color: WIDGET_COLORS.whiteAlpha70,
          }}
        />
      </FlexWidget>

      {/* Progress bar */}
      <FlexWidget
        style={{
          width: 'match_parent',
          height: 4,
          backgroundColor: WIDGET_COLORS.whiteAlpha30,
          borderRadius: 2,
          flexDirection: 'row',
        }}
      >
        <FlexWidget
          style={{
            width: progressWidth,
            height: 'match_parent',
            backgroundColor: WIDGET_COLORS.white,
            borderRadius: 2,
          }}
        />
      </FlexWidget>
    </FlexWidget>
  );
}

/**
 * Widget pokazujący stan nieaktywny - zachęta do medytacji
 */
function InactiveWidget() {
  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: WIDGET_COLORS.cardBackground,
        borderRadius: 24,
        padding: 16,
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
      clickAction="OPEN_APP"
    >
      {/* Header */}
      <FlexWidget
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <FlexWidget
          style={{
            width: 32,
            height: 32,
            backgroundColor: WIDGET_COLORS.brandPrimary,
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <TextWidget
            text="S"
            style={{
              fontSize: 16,
              color: WIDGET_COLORS.white,
            }}
          />
        </FlexWidget>
        <TextWidget
          text="  Slow Spot"
          style={{
            fontSize: 16,
            color: WIDGET_COLORS.textPrimary,
          }}
        />
      </FlexWidget>

      {/* Content */}
      <FlexWidget
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: 'match_parent',
        }}
      >
        <TextWidget
          text="Time to breathe"
          style={{
            fontSize: 20,
            color: WIDGET_COLORS.textPrimary,
          }}
        />
        <TextWidget
          text="Tap to start a meditation"
          style={{
            fontSize: 14,
            color: WIDGET_COLORS.textSecondary,
          }}
        />
      </FlexWidget>

      {/* CTA */}
      <FlexWidget
        style={{
          width: 'match_parent',
          backgroundColor: WIDGET_COLORS.brandPrimary,
          borderRadius: 12,
          paddingVertical: 12,
          alignItems: 'center',
        }}
        clickAction="OPEN_APP"
      >
        <TextWidget
          text="Start Session"
          style={{
            fontSize: 14,
            color: WIDGET_COLORS.white,
          }}
        />
      </FlexWidget>
    </FlexWidget>
  );
}

/**
 * Główny komponent widgetu
 */
export function MeditationTimerWidget(props: MeditationTimerWidgetProps) {
  if (props.isActive) {
    return (
      <ActiveSessionWidget
        remainingSeconds={props.remainingSeconds}
        isPaused={props.isPaused}
        totalSeconds={props.totalSeconds}
      />
    );
  }

  return <InactiveWidget />;
}

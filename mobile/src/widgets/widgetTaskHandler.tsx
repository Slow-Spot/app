/**
 * Widget Task Handler
 *
 * Obsługuje akcje widgetu Android (dodanie, aktualizacja, kliknięcie).
 * Renderuje widget z danymi z AsyncStorage.
 */

import React from 'react';
import type { WidgetTaskHandlerProps } from 'react-native-android-widget';
import { Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { z } from 'zod';
import { logger } from '../utils/logger';
import type { MeditationTimerWidgetProps } from './MeditationTimerWidget';
import { MeditationTimerWidget } from './MeditationTimerWidget';

/**
 * Zod schema dla walidacji MeditationTimerWidgetProps z AsyncStorage
 */
const WidgetStateSchema = z.object({
  isActive: z.boolean(),
  remainingSeconds: z.number().optional(),
  isPaused: z.boolean().optional(),
  totalSeconds: z.number().optional(),
});

// Klucz do persystencji stanu widgetu
const WIDGET_STATE_KEY = '@slowspot/widget_state';

// Mapowanie nazwy widgetu na komponent
const nameToWidget = {
  MeditationTimer: MeditationTimerWidget,
};

/**
 * Pobiera stan widgetu z AsyncStorage
 */
async function getWidgetState(): Promise<MeditationTimerWidgetProps> {
  try {
    const json = await AsyncStorage.getItem(WIDGET_STATE_KEY);
    if (json) {
      const parsed = WidgetStateSchema.safeParse(JSON.parse(json));
      if (parsed.success) {
        return parsed.data;
      }
      logger.warn('Invalid widget state data in storage, using defaults');
    }
  } catch (error) {
    logger.warn('Failed to get widget state:', error);
  }

  // Domyślny stan - brak aktywnej sesji
  return {
    isActive: false,
  };
}

/**
 * Zapisuje stan widgetu do AsyncStorage
 */
export async function setWidgetState(state: MeditationTimerWidgetProps): Promise<void> {
  try {
    await AsyncStorage.setItem(WIDGET_STATE_KEY, JSON.stringify(state));
  } catch (error) {
    logger.warn('Failed to set widget state:', error);
  }
}

/**
 * Czyści stan widgetu
 */
export async function clearWidgetState(): Promise<void> {
  try {
    await AsyncStorage.removeItem(WIDGET_STATE_KEY);
  } catch (error) {
    logger.warn('Failed to clear widget state:', error);
  }
}

/**
 * Task handler dla widgetu Android
 */
export async function widgetTaskHandler(props: WidgetTaskHandlerProps): Promise<void> {
  const { widgetInfo, widgetAction, clickAction, renderWidget } = props;

  // Pobierz komponent widgetu na podstawie nazwy
  const Widget = nameToWidget[widgetInfo.widgetName as keyof typeof nameToWidget];

  if (!Widget) {
    logger.warn(`Unknown widget: ${widgetInfo.widgetName}`);
    return;
  }

  switch (widgetAction) {
    case 'WIDGET_ADDED':
    case 'WIDGET_UPDATE':
    case 'WIDGET_RESIZED': {
      // Pobierz aktualny stan i renderuj widget
      const state = await getWidgetState();
      renderWidget(<Widget {...state} />);
      break;
    }

    case 'WIDGET_CLICK': {
      // Obsługa kliknięcia w widget
      if (clickAction === 'OPEN_APP') {
        // Otwórz aplikację przez deep link
        try {
          const canOpen = await Linking.canOpenURL('slowspot://meditation');
          if (canOpen) {
            await Linking.openURL('slowspot://meditation');
          } else {
            // Fallback - otwórz bez deep link
            await Linking.openURL('slowspot://');
          }
        } catch (error) {
          logger.warn('Failed to open app:', error);
        }
      }
      break;
    }

    case 'WIDGET_DELETED': {
      // Widget usunięty - można wyczyścić dane jeśli potrzeba
      break;
    }

    default:
      break;
  }
}

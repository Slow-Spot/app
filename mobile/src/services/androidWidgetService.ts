/**
 * Android Widget Service
 *
 * Serwis do aktualizacji stanu widgetu Android z poziomu aplikacji.
 * Używa react-native-android-widget do requestowania update widgetów.
 */

import React from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from '../utils/logger';
import type { MeditationTimerWidgetProps } from '../widgets/MeditationTimerWidget';
import { MeditationTimerWidget } from '../widgets/MeditationTimerWidget';

// Klucz do persystencji stanu widgetu (musi być taki sam jak w widgetTaskHandler)
const WIDGET_STATE_KEY = '@slowspot/widget_state';

class AndroidWidgetService {
  /**
   * Sprawdza czy Android widget jest wspierany
   */
  isSupported(): boolean {
    return Platform.OS === 'android';
  }

  /**
   * Aktualizuje stan widgetu i requestuje odświeżenie
   */
  async updateWidget(state: MeditationTimerWidgetProps): Promise<boolean> {
    if (!this.isSupported()) {
      return false;
    }

    try {
      // Zapisz stan do AsyncStorage
      await AsyncStorage.setItem(WIDGET_STATE_KEY, JSON.stringify(state));

      // Dynamiczny import i request update
      const { requestWidgetUpdate } = await import('react-native-android-widget');

      await requestWidgetUpdate({
        widgetName: 'MeditationTimer',
        renderWidget: () => React.createElement(MeditationTimerWidget, state),
        widgetNotFound: () => {
          logger.log('MeditationTimer widget not found');
        },
      });

      logger.log('Android widget update requested');
      return true;
    } catch (error) {
      logger.error('Failed to update Android widget:', error);
      return false;
    }
  }

  /**
   * Ustawia widget w stan aktywnej sesji
   */
  async startSession(totalSeconds: number): Promise<boolean> {
    return this.updateWidget({
      isActive: true,
      remainingSeconds: totalSeconds,
      totalSeconds,
      isPaused: false,
    });
  }

  /**
   * Aktualizuje pozostały czas w widgecie
   */
  async updateRemainingTime(
    remainingSeconds: number,
    totalSeconds: number,
    isPaused: boolean = false
  ): Promise<boolean> {
    return this.updateWidget({
      isActive: true,
      remainingSeconds,
      totalSeconds,
      isPaused,
    });
  }

  /**
   * Ustawia widget w stan pauzy
   */
  async pauseSession(remainingSeconds: number, totalSeconds: number): Promise<boolean> {
    return this.updateWidget({
      isActive: true,
      remainingSeconds,
      totalSeconds,
      isPaused: true,
    });
  }

  /**
   * Wznawia sesję w widgecie
   */
  async resumeSession(remainingSeconds: number, totalSeconds: number): Promise<boolean> {
    return this.updateWidget({
      isActive: true,
      remainingSeconds,
      totalSeconds,
      isPaused: false,
    });
  }

  /**
   * Kończy sesję w widgecie (wraca do stanu nieaktywnego)
   */
  async endSession(): Promise<boolean> {
    return this.updateWidget({
      isActive: false,
    });
  }

  /**
   * Czyści stan widgetu
   */
  async clearState(): Promise<boolean> {
    if (!this.isSupported()) {
      return false;
    }

    try {
      await AsyncStorage.removeItem(WIDGET_STATE_KEY);

      const { requestWidgetUpdate } = await import('react-native-android-widget');

      await requestWidgetUpdate({
        widgetName: 'MeditationTimer',
        renderWidget: () => React.createElement(MeditationTimerWidget, { isActive: false }),
      });

      return true;
    } catch (error) {
      logger.error('Failed to clear Android widget state:', error);
      return false;
    }
  }
}

// Singleton instance
export const androidWidgetService = new AndroidWidgetService();

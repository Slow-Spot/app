/**
 * Watch Connectivity Service
 *
 * Serwis do komunikacji z Apple Watch przez WatchConnectivity.
 * Synchronizuje dane sesji miedzy iPhone a Watch.
 *
 * UWAGA: Ten serwis wymaga natywnego modulu Expo.
 * Na iOS komunikacja z Watch jest automatycznie obslugiwana przez
 * natywny kod Swift w targets/SlowSpotWatch.
 *
 * Ten plik sluzy jako placeholder dla przyszlej integracji
 * i dokumentuje interfejs komunikacji.
 */

import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from '../utils/logger';

// Klucze do przechowywania danych synchronizowanych z Watch
const WATCH_SYNC_KEYS = {
  todayMindfulMinutes: '@slowspot/today_mindful_minutes',
  currentStreak: '@slowspot/current_streak',
  lastSyncDate: '@slowspot/watch_last_sync',
} as const;

// Interfejs wiadomosci od Watch
interface WatchMessage {
  type: 'session_completed' | 'session_started' | 'session_paused' | 'session_resumed' | 'sync_sessions';
  duration?: number;
  remainingSeconds?: number;
  date?: number; // Unix timestamp
  sessions?: Array<{ duration: number; date: number }>;
}

class WatchConnectivityService {
  private isInitialized = false;

  /**
   * Sprawdza czy Watch connectivity jest wspierane
   */
  isSupported(): boolean {
    return Platform.OS === 'ios';
  }

  /**
   * Inicjalizuje serwis (placeholder dla natywnego modulu)
   */
  async initialize(): Promise<void> {
    if (!this.isSupported()) {
      logger.log('Watch connectivity not supported on this platform');
      return;
    }

    if (this.isInitialized) {
      return;
    }

    // W przyszlosci tutaj bedzie inicjalizacja natywnego modulu
    // Obecnie dane sa synchronizowane przez shared App Group
    this.isInitialized = true;
    logger.log('Watch connectivity service initialized');
  }

  /**
   * Aktualizuje dane do synchronizacji z Watch
   * Dane sa zapisywane do AsyncStorage i beda dostepne przez App Group
   */
  async updateWatchData(data: {
    todayMindfulMinutes?: number;
    currentStreak?: number;
  }): Promise<void> {
    if (!this.isSupported()) {
      return;
    }

    try {
      if (data.todayMindfulMinutes !== undefined) {
        await AsyncStorage.setItem(
          WATCH_SYNC_KEYS.todayMindfulMinutes,
          String(data.todayMindfulMinutes)
        );
      }

      if (data.currentStreak !== undefined) {
        await AsyncStorage.setItem(
          WATCH_SYNC_KEYS.currentStreak,
          String(data.currentStreak)
        );
      }

      await AsyncStorage.setItem(
        WATCH_SYNC_KEYS.lastSyncDate,
        new Date().toISOString()
      );

      logger.log('Watch data updated:', data);
    } catch (error) {
      logger.error('Failed to update watch data:', error);
    }
  }

  /**
   * Pobiera ostatnia date synchronizacji
   */
  async getLastSyncDate(): Promise<Date | null> {
    try {
      const dateStr = await AsyncStorage.getItem(WATCH_SYNC_KEYS.lastSyncDate);
      return dateStr ? new Date(dateStr) : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Obsluguje wiadomosc od Watch (placeholder)
   * W przyszlosci bedzie wywolywane przez natywny modul
   */
  handleWatchMessage(message: WatchMessage): void {
    logger.log('Received message from Watch:', message);

    switch (message.type) {
      case 'session_completed':
        // Sesja zakonczona na Watch - dodaj do statystyk
        if (message.duration) {
          this.handleSessionCompleted(message.duration, message.date);
        }
        break;

      case 'session_started':
        // Sesja rozpoczeta na Watch
        logger.log('Session started on Watch:', message.duration);
        break;

      case 'session_paused':
        logger.log('Session paused on Watch');
        break;

      case 'session_resumed':
        logger.log('Session resumed on Watch');
        break;

      case 'sync_sessions':
        // Synchronizacja wielu sesji z Watch
        if (message.sessions) {
          message.sessions.forEach((session) => {
            this.handleSessionCompleted(session.duration, session.date);
          });
        }
        break;
    }
  }

  /**
   * Obsluguje zakonczenie sesji z Watch
   */
  private async handleSessionCompleted(duration: number, timestamp?: number): Promise<void> {
    // W przyszlosci tutaj bedzie logika dodawania sesji do statystyk
    // i aktualizacji streak
    logger.log('Session completed on Watch:', { duration, timestamp });
  }

  /**
   * Wysyla wiadomosc do Watch (placeholder)
   */
  async sendMessageToWatch(message: Record<string, unknown>): Promise<boolean> {
    if (!this.isSupported()) {
      return false;
    }

    // W przyszlosci tutaj bedzie wywolanie natywnego modulu
    logger.log('Would send message to Watch:', message);
    return true;
  }

  /**
   * Sprawdza czy Watch jest polaczony (placeholder)
   */
  async isWatchConnected(): Promise<boolean> {
    if (!this.isSupported()) {
      return false;
    }

    // W przyszlosci tutaj bedzie sprawdzenie przez natywny modul
    return false;
  }
}

// Singleton instance
export const watchConnectivityService = new WatchConnectivityService();

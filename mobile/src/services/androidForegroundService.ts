/**
 * Android Foreground Service
 *
 * Zarzadza foreground service na Androidzie podczas sesji medytacji.
 * Wyswietla ongoing notification z timerem odliczajacym w dol,
 * przyciskami Pause/Resume i Stop, oraz progress bar.
 *
 * Uzywane jako oficjalny mechanizm Androida do utrzymywania procesow w tle.
 * Silent audio (backgroundTimer) dziala rownolegle jako secondary keep-alive.
 *
 * Wymaga:
 * - @notifee/react-native
 * - Uprawnienia: FOREGROUND_SERVICE, FOREGROUND_SERVICE_MEDIA_PLAYBACK
 * - Config plugin: plugins/withForegroundService.js
 */

import { Platform } from 'react-native';
import { logger } from '../utils/logger';
import i18n from '../i18n';

// Stale konfiguracji kanalu
const CHANNEL_ID = 'meditation-session';
const CHANNEL_NAME = 'Meditation Session';
const NOTIFICATION_ID = 'meditation-foreground';

// Brand color
const ACCENT_COLOR = '#8B5CF6';

// Typ notifee importowany dynamicznie
type NotifeeModule = typeof import('@notifee/react-native');

// Callbacki akcji z powiadomienia
export type NotificationActionId = 'pause' | 'resume' | 'stop';
type NotificationActionCallback = (action: NotificationActionId) => void;

class AndroidForegroundServiceManager {
  private notifeeLoadPromise: Promise<NotifeeModule | null> | null = null;
  private isActive = false;
  private channelCreated = false;
  private sessionStartTimestamp = 0;
  private totalDuration = 0;
  private actionCallback: NotificationActionCallback | null = null;
  private foregroundEventUnsubscribe: (() => void) | null = null;
  private eventListenerRegistered = false;

  /**
   * Sprawdza czy foreground service jest wspierany
   */
  isSupported(): boolean {
    return Platform.OS === 'android';
  }

  /**
   * Laduje modul notifee dynamicznie (tylko na Androidzie).
   * Uzywa cached promise zeby uniknac race condition przy rownoczesnych callach.
   */
  private loadNotifee(): Promise<NotifeeModule | null> {
    if (this.notifeeLoadPromise) return this.notifeeLoadPromise;

    if (!this.isSupported()) {
      return Promise.resolve(null);
    }

    this.notifeeLoadPromise = import('@notifee/react-native').catch((error) => {
      logger.error('Failed to load @notifee/react-native:', error);
      this.notifeeLoadPromise = null;
      return null;
    });

    return this.notifeeLoadPromise;
  }

  /**
   * Tworzy kanal powiadomien dla sesji medytacji (Android 8.0+)
   * LOW importance = brak dzwieku/wibracji, cichy kanal
   */
  private async ensureChannel(): Promise<boolean> {
    if (this.channelCreated) return true;

    const notifee = await this.loadNotifee();
    if (!notifee) return false;

    try {
      await notifee.default.createChannel({
        id: CHANNEL_ID,
        name: CHANNEL_NAME,
        importance: notifee.AndroidImportance.LOW,
        vibration: false,
        sound: '',
      });
      this.channelCreated = true;
      return true;
    } catch (error) {
      logger.error('Failed to create notification channel:', error);
      return false;
    }
  }

  /**
   * Rejestruje callback wywoływany gdy uzytkownik nacisnie przycisk w powiadomieniu.
   * MeditationTimer rejestruje swoj handler tutaj.
   */
  setActionCallback(callback: NotificationActionCallback | null): void {
    this.actionCallback = callback;
    if (callback) {
      this.registerEventListener();
    }
  }

  /**
   * Obsluguje akcje z powiadomienia (wywoywane z onBackgroundEvent w index.ts)
   */
  handleBackgroundAction(action: NotificationActionId): void {
    if (this.actionCallback) {
      this.actionCallback(action);
    }
  }

  /**
   * Rejestruje foreground event listener (jednorazowo).
   * Przechowuje unsubscribe function dla cleanup.
   * UWAGA: onBackgroundEvent jest rejestrowany w index.ts na poziomie modulu.
   */
  private async registerEventListener(): Promise<void> {
    if (this.eventListenerRegistered) return;

    const notifee = await this.loadNotifee();
    if (!notifee) return;

    this.foregroundEventUnsubscribe = notifee.default.onForegroundEvent(
      ({ type, detail }) => {
        if (type === notifee.EventType.ACTION_PRESS && detail.pressAction) {
          const actionId = detail.pressAction.id;
          if (
            this.actionCallback &&
            (actionId === 'pause' || actionId === 'resume' || actionId === 'stop')
          ) {
            this.actionCallback(actionId);
          }
        }
      }
    );

    this.eventListenerRegistered = true;
    logger.log('Notifee foreground event listener registered');
  }

  /**
   * Formatuje sekundy na MM:SS
   */
  private formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Rozpoczyna foreground service z ongoing notification
   */
  async startSession(totalSeconds: number, sessionTitle?: string): Promise<boolean> {
    const notifee = await this.loadNotifee();
    if (!notifee) return false;

    const channelReady = await this.ensureChannel();
    if (!channelReady) return false;

    this.totalDuration = totalSeconds;
    this.sessionStartTimestamp = Date.now();

    const title = sessionTitle || i18n.t('meditation.title', 'Meditation');

    try {
      await notifee.default.displayNotification({
        id: NOTIFICATION_ID,
        title,
        body: `${i18n.t('meditation.inProgress', 'In progress')} - ${this.formatTime(totalSeconds)}`,
        android: {
          channelId: CHANNEL_ID,
          asForegroundService: true,
          ongoing: true,
          autoCancel: false,
          smallIcon: 'notification_icon',
          color: ACCENT_COLOR,
          colorized: true,
          progress: {
            max: totalSeconds,
            current: 0,
            indeterminate: false,
          },
          timestamp: this.sessionStartTimestamp + totalSeconds * 1000,
          showTimestamp: true,
          showChronometer: true,
          chronometerDirection: 'down',
          pressAction: {
            id: 'default',
            launchActivity: 'default',
          },
          actions: [
            {
              title: i18n.t('meditation.pause', 'Pause'),
              pressAction: { id: 'pause' },
            },
            {
              title: i18n.t('meditation.stop', 'Stop'),
              pressAction: { id: 'stop' },
            },
          ],
        },
      });

      this.isActive = true;
      logger.log('Android foreground service started');
      return true;
    } catch (error) {
      logger.error('Failed to start foreground service:', error);
      return false;
    }
  }

  /**
   * Aktualizuje notification przy pauzie
   */
  async pauseSession(remainingSeconds: number): Promise<boolean> {
    if (!this.isActive) return false;

    const notifee = await this.loadNotifee();
    if (!notifee) return false;

    const elapsed = this.totalDuration - remainingSeconds;

    try {
      await notifee.default.displayNotification({
        id: NOTIFICATION_ID,
        title: i18n.t('meditation.paused', 'Paused'),
        body: `${i18n.t('meditation.remaining', 'Remaining')}: ${this.formatTime(remainingSeconds)}`,
        android: {
          channelId: CHANNEL_ID,
          asForegroundService: true,
          ongoing: true,
          autoCancel: false,
          smallIcon: 'notification_icon',
          color: ACCENT_COLOR,
          colorized: true,
          progress: {
            max: this.totalDuration,
            current: elapsed,
            indeterminate: false,
          },
          showChronometer: false,
          pressAction: {
            id: 'default',
            launchActivity: 'default',
          },
          actions: [
            {
              title: i18n.t('meditation.resume', 'Resume'),
              pressAction: { id: 'resume' },
            },
            {
              title: i18n.t('meditation.stop', 'Stop'),
              pressAction: { id: 'stop' },
            },
          ],
        },
      });

      logger.log('Foreground notification updated: paused');
      return true;
    } catch (error) {
      logger.error('Failed to update foreground notification (pause):', error);
      return false;
    }
  }

  /**
   * Aktualizuje notification przy wznowieniu
   */
  async resumeSession(remainingSeconds: number): Promise<boolean> {
    if (!this.isActive) return false;

    const notifee = await this.loadNotifee();
    if (!notifee) return false;

    const elapsed = this.totalDuration - remainingSeconds;
    const title = i18n.t('meditation.title', 'Meditation');

    try {
      await notifee.default.displayNotification({
        id: NOTIFICATION_ID,
        title,
        body: `${i18n.t('meditation.inProgress', 'In progress')} - ${this.formatTime(remainingSeconds)}`,
        android: {
          channelId: CHANNEL_ID,
          asForegroundService: true,
          ongoing: true,
          autoCancel: false,
          smallIcon: 'notification_icon',
          color: ACCENT_COLOR,
          colorized: true,
          progress: {
            max: this.totalDuration,
            current: elapsed,
            indeterminate: false,
          },
          timestamp: Date.now() + remainingSeconds * 1000,
          showTimestamp: true,
          showChronometer: true,
          chronometerDirection: 'down',
          pressAction: {
            id: 'default',
            launchActivity: 'default',
          },
          actions: [
            {
              title: i18n.t('meditation.pause', 'Pause'),
              pressAction: { id: 'pause' },
            },
            {
              title: i18n.t('meditation.stop', 'Stop'),
              pressAction: { id: 'stop' },
            },
          ],
        },
      });

      logger.log('Foreground notification updated: resumed');
      return true;
    } catch (error) {
      logger.error('Failed to update foreground notification (resume):', error);
      return false;
    }
  }

  /**
   * Zatrzymuje foreground service.
   * Ustawia isActive=false optymistycznie przed async operacja
   * zeby uniknac race condition przy podwojnym wywolaniu.
   */
  async stopSession(): Promise<boolean> {
    if (!this.isActive) return false;

    // Optymistyczny reset - zapobiega double-stop race condition
    this.isActive = false;
    this.totalDuration = 0;
    this.sessionStartTimestamp = 0;

    const notifee = await this.loadNotifee();
    if (!notifee) return false;

    try {
      await notifee.default.stopForegroundService();
      logger.log('Android foreground service stopped');
      return true;
    } catch (error) {
      logger.error('Failed to stop foreground service:', error);
      return false;
    }
  }

  /**
   * Sprawdza czy foreground service jest aktywny
   */
  isServiceActive(): boolean {
    return this.isActive;
  }

  /**
   * Cleanup - zwalnia event listenery
   */
  destroy(): void {
    this.foregroundEventUnsubscribe?.();
    this.foregroundEventUnsubscribe = null;
    this.eventListenerRegistered = false;
    this.actionCallback = null;
  }
}

// Singleton instance
export const androidForegroundService = new AndroidForegroundServiceManager();

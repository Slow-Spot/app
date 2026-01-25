/**
 * Live Activity Service
 *
 * Wrapper dla iOS Live Activities - pokazuje timer na lock screen i Dynamic Island.
 * Używa expo-live-activity dla natywnej integracji.
 *
 * Ograniczenia:
 * - Tylko iOS 16.1+
 * - Max 8 godzin aktywności
 * - Wymaga obrazków w assets/liveActivity/
 */

import { Platform } from 'react-native';
import { logger } from '../utils/logger';

// Brand colors dla Slow Spot
const BRAND_COLORS = {
  primary: '#8B5CF6',
  primaryDark: '#7C3AED',
  background: '#1F2937',
  backgroundLight: '#374151',
  text: '#FFFFFF',
  textSecondary: '#D1D5DB',
};

export interface MeditationActivityState {
  title: string;
  subtitle: string;
  endTime: number;
  progress?: number;
  isPaused?: boolean;
}

// Cache dla ostatniego stanu
interface CachedState {
  title: string;
  subtitle?: string;
  imageName?: string;
  dynamicIslandImageName?: string;
}
let lastCachedState: CachedState | null = null;

class LiveActivityService {
  private currentActivityId: string | null = null;

  /**
   * Sprawdza czy Live Activities są wspierane na urządzeniu
   */
  isSupported(): boolean {
    return Platform.OS === 'ios';
  }

  /**
   * Rozpoczyna Live Activity dla sesji medytacji
   */
  async startMeditationActivity(
    totalSeconds: number,
    sessionTitle: string = 'Meditation'
  ): Promise<string | null> {
    if (!this.isSupported()) {
      logger.log('Live Activities not supported on this platform');
      return null;
    }

    // Dynamiczny import expo-live-activity
    let LiveActivity;
    try {
      LiveActivity = await import('expo-live-activity');
    } catch (error) {
      logger.warn('expo-live-activity not available:', error);
      return null;
    }

    // Zakończ poprzednią aktywność jeśli istnieje
    if (this.currentActivityId) {
      await this.endActivity();
    }

    const endTime = Date.now() + totalSeconds * 1000;
    const minutes = Math.ceil(totalSeconds / 60);

    try {
      const state: import('expo-live-activity').LiveActivityState = {
        title: sessionTitle,
        subtitle: `${minutes} min session`,
        progressBar: {
          date: endTime,
        },
        imageName: 'meditation_timer',
        dynamicIslandImageName: 'meditation_small',
      };

      const config: import('expo-live-activity').LiveActivityConfig = {
        backgroundColor: BRAND_COLORS.background,
        titleColor: BRAND_COLORS.text,
        subtitleColor: BRAND_COLORS.textSecondary,
        progressViewTint: BRAND_COLORS.primary,
        progressViewLabelColor: BRAND_COLORS.text,
        deepLinkUrl: 'slowspot://meditation',
        timerType: 'circular',
        padding: 16,
        imagePosition: 'left',
        imageSize: { width: 60, height: 60 },
        imageAlign: 'center',
      };

      const activityId = LiveActivity.startActivity(state, config);

      if (activityId) {
        this.currentActivityId = activityId;
        lastCachedState = {
          title: sessionTitle,
          subtitle: `${minutes} min session`,
          imageName: 'meditation_timer',
          dynamicIslandImageName: 'meditation_small',
        };
        logger.log(`Live Activity started: ${activityId}`);
        return activityId;
      } else {
        logger.warn('Failed to start Live Activity - no ID returned');
        return null;
      }
    } catch (error) {
      logger.error('Error starting Live Activity:', error);
      return null;
    }
  }

  /**
   * Aktualizuje pozostały czas w Live Activity
   */
  async updateRemainingTime(remainingSeconds: number, isPaused: boolean = false): Promise<boolean> {
    if (!this.currentActivityId || !lastCachedState) {
      return false;
    }

    let LiveActivity;
    try {
      LiveActivity = await import('expo-live-activity');
    } catch {
      return false;
    }

    try {
      const minutes = Math.ceil(remainingSeconds / 60);
      const subtitle = isPaused ? 'Paused' : `${minutes} min remaining`;
      const endTime = Date.now() + remainingSeconds * 1000;

      const updateState: import('expo-live-activity').LiveActivityState = {
        title: lastCachedState.title,
        subtitle,
        progressBar: isPaused ? { progress: 0 } : { date: endTime },
        imageName: lastCachedState.imageName,
        dynamicIslandImageName: lastCachedState.dynamicIslandImageName,
      };

      LiveActivity.updateActivity(this.currentActivityId, updateState);
      lastCachedState.subtitle = subtitle;
      return true;
    } catch (error) {
      logger.error('Error updating Live Activity time:', error);
      return false;
    }
  }

  /**
   * Kończy Live Activity
   */
  async endActivity(showCompletionState: boolean = false): Promise<boolean> {
    if (!this.currentActivityId) {
      return false;
    }

    let LiveActivity;
    try {
      LiveActivity = await import('expo-live-activity');
    } catch {
      this.currentActivityId = null;
      lastCachedState = null;
      return false;
    }

    try {
      const completionState: import('expo-live-activity').LiveActivityState = {
        title: showCompletionState ? 'Session Complete' : (lastCachedState?.title || 'Meditation'),
        subtitle: showCompletionState ? 'Well done!' : (lastCachedState?.subtitle || ''),
        progressBar: { progress: 1 },
        imageName: lastCachedState?.imageName || 'meditation_timer',
        dynamicIslandImageName: lastCachedState?.dynamicIslandImageName || 'meditation_small',
      };

      LiveActivity.stopActivity(this.currentActivityId, completionState);
      logger.log(`Live Activity ended: ${this.currentActivityId}`);
      this.currentActivityId = null;
      lastCachedState = null;
      return true;
    } catch (error) {
      logger.error('Error ending Live Activity:', error);
      this.currentActivityId = null;
      lastCachedState = null;
      return false;
    }
  }

  /**
   * Pobiera ID aktualnej aktywności
   */
  getCurrentActivityId(): string | null {
    return this.currentActivityId;
  }

  /**
   * Sprawdza czy jest aktywna Live Activity
   */
  hasActiveActivity(): boolean {
    return this.currentActivityId !== null;
  }
}

// Singleton instance
export const liveActivityService = new LiveActivityService();

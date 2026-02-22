import type { TFunction } from 'i18next';
import type { MeditationSession } from '../../services/api';
import type { CustomSession, BreathingPattern, BreathingTiming } from '../../services/customSessionStorage';
import type { ChimePoint } from '../../types/customSession';
import type { ActiveMeditationState } from '../../../App';

export type FlowState = 'list' | 'intention' | 'meditation' | 'celebration';

export interface MeditationScreenProps {
  isDark?: boolean;
  onEditSession?: (sessionId: string, sessionConfig: CustomSession['config']) => void;
  onNavigateToCustom?: () => void;
  activeMeditationState: ActiveMeditationState | null;
  onMeditationStateChange: (state: ActiveMeditationState | null) => void;
  pendingSessionConfig?: CustomSession['config'] | null;
  onClearPendingSession?: () => void;
}

/**
 * Generate chime points from custom session config
 */
export const getChimePointsFromSession = (session: MeditationSession | CustomSession): ChimePoint[] => {
  const customSession = session as CustomSession;

  if (!customSession.isCustom || !customSession.config?.intervalBellEnabled) {
    return [];
  }

  const { intervalBellMinutes, durationMinutes } = customSession.config;
  const chimePoints: ChimePoint[] = [];

  for (let minutes = intervalBellMinutes; minutes < durationMinutes; minutes += intervalBellMinutes) {
    chimePoints.push({
      timeInSeconds: minutes * 60,
      label: `${minutes} min`,
    });
  }

  return chimePoints;
};

/**
 * Extract session haptics setting from custom config
 */
export const getSessionHaptics = (session: MeditationSession | CustomSession | null): boolean => {
  if (session && 'config' in session) {
    return session.config?.haptics?.session ?? true;
  }
  return true;
};

/**
 * Extract breathing haptics setting from custom config
 */
export const getBreathingHaptics = (session: MeditationSession | CustomSession | null): boolean => {
  if (session && 'config' in session) {
    return session.config?.haptics?.breathing ?? true;
  }
  return true;
};

/**
 * Extract interval bell haptics setting from custom config
 */
export const getIntervalBellHaptics = (session: MeditationSession | CustomSession | null): boolean => {
  if (session && 'config' in session) {
    return session.config?.haptics?.intervalBell ?? true;
  }
  return true;
};

/**
 * Get localized ambient sound name
 */
export const getAmbientSoundName = (
  session: MeditationSession | CustomSession | null,
  t: TFunction
): string => {
  if (!session?.ambientUrl) return t('custom.ambientSilence');

  if ('config' in session && session.config) {
    const sound = session.config.ambientSound;
    const key = `custom.ambient${sound.charAt(0).toUpperCase() + sound.slice(1)}`;
    return t(key);
  }

  return session.ambientUrl ? t('custom.ambientNature') : t('custom.ambientSilence');
};

/**
 * Extract breathing pattern from session config
 */
export const getBreathingPattern = (session: MeditationSession | CustomSession | null): BreathingPattern => {
  if (session && 'config' in session && session.config?.breathingPattern) {
    return session.config.breathingPattern;
  }
  return 'box';
};

/**
 * Extract custom breathing timing from session config
 */
export const getCustomBreathing = (session: MeditationSession | CustomSession | null): BreathingTiming | undefined => {
  if (session && 'config' in session && session.config?.customBreathing) {
    return session.config.customBreathing;
  }
  return undefined;
};

/**
 * Extract hideTimer setting from session config
 */
export const getHideTimer = (session: MeditationSession | CustomSession | null): boolean => {
  if (session && 'config' in session && session.config?.hideTimer !== undefined) {
    return session.config.hideTimer;
  }
  return false;
};

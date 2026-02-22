/**
 * Testy dla czystych funkcji w meditationHelpers.ts
 */

import {
  getChimePointsFromSession,
  getSessionHaptics,
  getBreathingHaptics,
  getIntervalBellHaptics,
  getBreathingPattern,
  getCustomBreathing,
  getHideTimer,
} from '../meditationHelpers';

// Minimalne typy mockowe - unikamy importu ciezkich modulow
interface MockCustomSession {
  isCustom: boolean;
  ambientUrl?: string;
  config: {
    durationMinutes: number;
    intervalBellEnabled?: boolean;
    intervalBellMinutes?: number;
    haptics?: {
      session?: boolean;
      breathing?: boolean;
      intervalBell?: boolean;
    };
    breathingPattern?: string;
    customBreathing?: { inhale: number; exhale: number; hold?: number };
    hideTimer?: boolean;
    ambientSound?: string;
  };
}

interface MockMeditationSession {
  id: number;
  title: string;
  ambientUrl?: string;
}

const createCustomSession = (overrides: Partial<MockCustomSession['config']> = {}): MockCustomSession => ({
  isCustom: true,
  config: {
    durationMinutes: 10,
    intervalBellEnabled: false,
    intervalBellMinutes: 5,
    haptics: { session: true, breathing: true, intervalBell: true },
    breathingPattern: 'box',
    hideTimer: false,
    ambientSound: 'nature',
    ...overrides,
  },
});

const createPresetSession = (): MockMeditationSession => ({
  id: 1,
  title: 'Mindfulness',
});

describe('meditationHelpers', () => {
  describe('getChimePointsFromSession', () => {
    it('zwraca pusta tablice dla sesji preset (non-custom)', () => {
      const session = createPresetSession();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(getChimePointsFromSession(session as any)).toEqual([]);
    });

    it('zwraca pusta tablice gdy interval bell jest wylaczony', () => {
      const session = createCustomSession({ intervalBellEnabled: false });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(getChimePointsFromSession(session as any)).toEqual([]);
    });

    it('generuje punkty dzwiekowe co N minut', () => {
      const session = createCustomSession({
        intervalBellEnabled: true,
        intervalBellMinutes: 3,
        durationMinutes: 10,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const points = getChimePointsFromSession(session as any);

      expect(points).toHaveLength(3); // 3min, 6min, 9min
      expect(points[0]).toEqual({ timeInSeconds: 180, label: '3 min' });
      expect(points[1]).toEqual({ timeInSeconds: 360, label: '6 min' });
      expect(points[2]).toEqual({ timeInSeconds: 540, label: '9 min' });
    });

    it('nie generuje punktu na koncu sesji', () => {
      const session = createCustomSession({
        intervalBellEnabled: true,
        intervalBellMinutes: 5,
        durationMinutes: 10,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const points = getChimePointsFromSession(session as any);

      expect(points).toHaveLength(1); // tylko 5min, nie 10min
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(points[0]!.timeInSeconds).toBe(300);
    });
  });

  describe('getSessionHaptics', () => {
    it('zwraca true domyslnie dla null', () => {
      expect(getSessionHaptics(null)).toBe(true);
    });

    it('zwraca true domyslnie dla sesji preset', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(getSessionHaptics(createPresetSession() as any)).toBe(true);
    });

    it('zwraca wartosc z konfiguracji custom session', () => {
      const session = createCustomSession({ haptics: { session: false, breathing: true, intervalBell: true } });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(getSessionHaptics(session as any)).toBe(false);
    });

    it('zwraca true gdy haptics nie jest zdefiniowany', () => {
      const session = createCustomSession();
      delete (session.config as Record<string, unknown>).haptics;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(getSessionHaptics(session as any)).toBe(true);
    });
  });

  describe('getBreathingHaptics', () => {
    it('zwraca true domyslnie', () => {
      expect(getBreathingHaptics(null)).toBe(true);
    });

    it('zwraca wartosc z konfiguracji', () => {
      const session = createCustomSession({ haptics: { session: true, breathing: false, intervalBell: true } });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(getBreathingHaptics(session as any)).toBe(false);
    });
  });

  describe('getIntervalBellHaptics', () => {
    it('zwraca true domyslnie', () => {
      expect(getIntervalBellHaptics(null)).toBe(true);
    });

    it('zwraca wartosc z konfiguracji', () => {
      const session = createCustomSession({ haptics: { session: true, breathing: true, intervalBell: false } });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(getIntervalBellHaptics(session as any)).toBe(false);
    });
  });

  describe('getBreathingPattern', () => {
    it('zwraca "box" domyslnie', () => {
      expect(getBreathingPattern(null)).toBe('box');
    });

    it('zwraca "box" dla sesji preset', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(getBreathingPattern(createPresetSession() as any)).toBe('box');
    });

    it('zwraca pattern z konfiguracji', () => {
      const session = createCustomSession({ breathingPattern: '4-7-8' });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(getBreathingPattern(session as any)).toBe('4-7-8');
    });
  });

  describe('getCustomBreathing', () => {
    it('zwraca undefined domyslnie', () => {
      expect(getCustomBreathing(null)).toBeUndefined();
    });

    it('zwraca timing z konfiguracji', () => {
      const timing = { inhale: 4, exhale: 6, hold: 2 };
      const session = createCustomSession({ customBreathing: timing });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(getCustomBreathing(session as any)).toEqual(timing);
    });
  });

  describe('getHideTimer', () => {
    it('zwraca false domyslnie', () => {
      expect(getHideTimer(null)).toBe(false);
    });

    it('zwraca wartosc z konfiguracji', () => {
      const session = createCustomSession({ hideTimer: true });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(getHideTimer(session as any)).toBe(true);
    });
  });
});

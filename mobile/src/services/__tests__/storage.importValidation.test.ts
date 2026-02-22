/**
 * Testy walidacji importu danych (Zod schema) w storage.ts
 * Weryfikujemy ze .strict() odrzuca nieoczekiwane pola
 * i ze poprawne dane przechodza walidacje.
 */

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn().mockResolvedValue(null),
    setItem: jest.fn().mockResolvedValue(undefined),
    multiSet: jest.fn().mockResolvedValue(undefined),
    removeItem: jest.fn().mockResolvedValue(undefined),
    multiRemove: jest.fn().mockResolvedValue(undefined),
  },
}));

// Mock logger
jest.mock('../../utils/logger', () => ({
  logger: {
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  },
}));

import AsyncStorage from '@react-native-async-storage/async-storage';
import { importData } from '../storage';

describe('storage - importData validation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('importuje poprawne dane bez bledow', async () => {
    const validData = JSON.stringify({
      version: '1.1',
      schemaVersion: 1,
      exportDate: '2026-01-01T00:00:00.000Z',
      configurations: [
        {
          id: 'config-1',
          name: 'Morning Meditation',
          durationMinutes: 10,
          ambientSound: 'rain',
          endChimeEnabled: true,
        },
      ],
      preferences: {
        chimeVolume: 0.7,
        ambientVolume: 0.3,
        enableHaptics: true,
        displayMode: 'auto',
      },
    });

    await expect(importData(validData)).resolves.not.toThrow();
    expect(AsyncStorage.multiSet).toHaveBeenCalled();
  });

  it('importuje pelny backup z sessions i importedStreak', async () => {
    const fullBackup = JSON.stringify({
      version: '1.1',
      schemaVersion: 1,
      exportDate: '2026-02-20T12:00:00.000Z',
      configurations: [
        { id: 'c1', name: 'Quick', durationMinutes: 5 },
      ],
      preferences: { chimeVolume: 0.5 },
      sessions: [
        {
          id: 1,
          title: 'Morning session',
          date: '2026-02-20T08:00:00.000Z',
          durationSeconds: 600,
          languageCode: 'pl',
        },
      ],
      progressStats: {
        totalSessions: 10,
        totalMinutes: 100,
        currentStreak: 3,
        longestStreak: 7,
        lastSessionDate: '2026-02-20T08:00:00.000Z',
      },
      importedStreak: {
        days: 30,
        importedAt: '2026-01-15T10:00:00.000Z',
        sourceApp: 'Headspace',
      },
    });

    await expect(importData(fullBackup)).resolves.not.toThrow();
    const pairs = (AsyncStorage.multiSet as jest.Mock).mock.calls[0][0] as [string, string][];
    const keys = pairs.map(([k]: [string, string]) => k);
    expect(keys).toContain('@meditation:configurations');
    expect(keys).toContain('@meditation:preferences');
    expect(keys).toContain('completed_sessions');
    expect(keys).toContain('imported_streak');
  });

  it('odrzuca dane z nieoczekiwanymi polami (strict mode)', async () => {
    const dataWithExtraFields = JSON.stringify({
      version: '1.1',
      maliciousField: 'injection attempt',
    });

    await expect(importData(dataWithExtraFields)).rejects.toThrow(
      'Import data validation failed'
    );
  });

  it('odrzuca konfiguracje z nieoczekiwanymi polami', async () => {
    const dataWithExtraConfig = JSON.stringify({
      configurations: [
        {
          id: 'config-1',
          name: 'Test',
          durationMinutes: 10,
          hackField: true,
        },
      ],
    });

    await expect(importData(dataWithExtraConfig)).rejects.toThrow(
      'Import data validation failed'
    );
  });

  it('odrzuca preferences z nieoczekiwanymi polami', async () => {
    const dataWithExtraPrefs = JSON.stringify({
      preferences: {
        chimeVolume: 0.5,
        adminAccess: true,
      },
    });

    await expect(importData(dataWithExtraPrefs)).rejects.toThrow(
      'Import data validation failed'
    );
  });

  it('odrzuca nieprawidlowy JSON', async () => {
    await expect(importData('not json {')).rejects.toThrow(
      'Invalid JSON format'
    );
  });

  it('odrzuca dane przekraczajace limit rozmiaru', async () => {
    const hugeData = 'x'.repeat(10 * 1024 * 1024 + 1);

    await expect(importData(hugeData)).rejects.toThrow(
      'exceeds maximum allowed size'
    );
  });

  it('odrzuca durationMinutes > 1440 (24h)', async () => {
    const data = JSON.stringify({
      configurations: [
        {
          id: 'test',
          name: 'Test',
          durationMinutes: 2000,
        },
      ],
    });

    await expect(importData(data)).rejects.toThrow(
      'Import data validation failed'
    );
  });

  it('odrzuca chimeVolume > 1', async () => {
    const data = JSON.stringify({
      preferences: {
        chimeVolume: 5.0,
      },
    });

    await expect(importData(data)).rejects.toThrow(
      'Import data validation failed'
    );
  });

  it('odrzuca nieprawidlowy displayMode', async () => {
    const data = JSON.stringify({
      preferences: {
        displayMode: 'hacker',
      },
    });

    await expect(importData(data)).rejects.toThrow(
      'Import data validation failed'
    );
  });

  it('odrzuca pusty obiekt (brak danych do importu)', async () => {
    const minimalData = JSON.stringify({});

    await expect(importData(minimalData)).rejects.toThrow(
      'No valid data found in import file'
    );
  });

  it('akceptuje dane tylko z preferencjami', async () => {
    const data = JSON.stringify({
      preferences: {
        enableHaptics: false,
        keepScreenOn: false,
      },
    });

    await expect(importData(data)).resolves.not.toThrow();
    expect(AsyncStorage.multiSet).toHaveBeenCalled();
  });

  it('odrzuca sessions z ujemnym durationSeconds', async () => {
    const data = JSON.stringify({
      sessions: [
        {
          id: 1,
          title: 'Test',
          date: '2026-01-01T00:00:00.000Z',
          durationSeconds: -100,
          languageCode: 'pl',
        },
      ],
    });

    await expect(importData(data)).rejects.toThrow(
      'Import data validation failed'
    );
  });

  it('odrzuca wiecej niz 100 konfiguracji', async () => {
    const configs = Array.from({ length: 101 }, (_, i) => ({
      id: `config-${i}`,
      name: `Config ${i}`,
      durationMinutes: 10,
    }));

    const data = JSON.stringify({
      configurations: configs,
    });

    await expect(importData(data)).rejects.toThrow(
      'Import data validation failed'
    );
  });
});

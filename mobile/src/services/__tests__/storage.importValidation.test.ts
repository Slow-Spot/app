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
          totalDuration: 600,
          phases: [
            { type: 'breathing', duration: 120 },
            { type: 'meditation', duration: 480 },
          ],
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
    expect(AsyncStorage.setItem).toHaveBeenCalled();
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
          totalDuration: 600,
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

  it('odrzuca totalDuration > 86400 (24h)', async () => {
    const data = JSON.stringify({
      configurations: [
        {
          id: 'test',
          name: 'Test',
          totalDuration: 100000,
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

  it('akceptuje minimalne poprawne dane (pusty obiekt)', async () => {
    const minimalData = JSON.stringify({});

    await expect(importData(minimalData)).resolves.not.toThrow();
  });

  it('akceptuje dane tylko z preferencjami', async () => {
    const data = JSON.stringify({
      preferences: {
        enableHaptics: false,
        keepScreenOn: false,
      },
    });

    await expect(importData(data)).resolves.not.toThrow();
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });

  it('odrzuca phases z duration ujemna', async () => {
    const data = JSON.stringify({
      configurations: [
        {
          id: 'test',
          name: 'Test',
          totalDuration: 600,
          phases: [
            { type: 'breathing', duration: -10 },
          ],
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
      totalDuration: 600,
    }));

    const data = JSON.stringify({
      configurations: configs,
    });

    await expect(importData(data)).rejects.toThrow(
      'Import data validation failed'
    );
  });
});

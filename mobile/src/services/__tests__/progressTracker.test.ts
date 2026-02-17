/**
 * Testy dla czystych funkcji w progressTracker.
 * calculateCurrentStreak i calculateLongestStreak nie wymagaja AsyncStorage.
 */

// Mock AsyncStorage przed importem modulow
jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn().mockResolvedValue(null),
    setItem: jest.fn().mockResolvedValue(undefined),
    removeItem: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock('../../utils/logger', () => ({
  logger: {
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  },
}));

import {
  calculateCurrentStreak,
  calculateLongestStreak,
  CompletedSession,
} from '../progressTracker';
import { subDays } from 'date-fns';

// Helper - tworzy sesje na dana date
const makeSession = (date: Date, durationSeconds = 600): CompletedSession => ({
  id: Math.random(),
  title: 'Test Session',
  date: date.toISOString(),
  durationSeconds,
  languageCode: 'pl',
});

// Helper - tworzy sesje na dzis minus N dni
const sessionDaysAgo = (daysAgo: number, durationSeconds = 600): CompletedSession =>
  makeSession(subDays(new Date(), daysAgo), durationSeconds);

describe('progressTracker - calculateCurrentStreak', () => {
  it('zwraca 0 dla pustej tablicy sesji', () => {
    expect(calculateCurrentStreak([])).toBe(0);
  });

  it('zwraca 1 gdy jedyna sesja jest dzisiaj', () => {
    const sessions = [sessionDaysAgo(0)];
    expect(calculateCurrentStreak(sessions)).toBe(1);
  });

  it('zwraca 1 gdy jedyna sesja jest wczoraj', () => {
    const sessions = [sessionDaysAgo(1)];
    expect(calculateCurrentStreak(sessions)).toBe(1);
  });

  it('zwraca 0 gdy ostatnia sesja byla 2 dni temu', () => {
    const sessions = [sessionDaysAgo(2)];
    expect(calculateCurrentStreak(sessions)).toBe(0);
  });

  it('liczy ciag kolejnych dni wstecz od dzisiaj', () => {
    const sessions = [
      sessionDaysAgo(2),
      sessionDaysAgo(1),
      sessionDaysAgo(0),
    ];
    expect(calculateCurrentStreak(sessions)).toBe(3);
  });

  it('liczy ciag kolejnych dni wstecz od wczoraj', () => {
    const sessions = [
      sessionDaysAgo(3),
      sessionDaysAgo(2),
      sessionDaysAgo(1),
    ];
    expect(calculateCurrentStreak(sessions)).toBe(3);
  });

  it('przerywa ciag przy przerwie', () => {
    const sessions = [
      sessionDaysAgo(4), // przerwa miedzy 3 a 1
      sessionDaysAgo(1),
      sessionDaysAgo(0),
    ];
    expect(calculateCurrentStreak(sessions)).toBe(2);
  });

  it('ignoruje duplikaty sesji tego samego dnia', () => {
    const sessions = [
      sessionDaysAgo(1, 300),
      sessionDaysAgo(1, 600),
      sessionDaysAgo(0, 450),
      sessionDaysAgo(0, 300),
    ];
    expect(calculateCurrentStreak(sessions)).toBe(2);
  });
});

describe('progressTracker - calculateLongestStreak', () => {
  it('zwraca 0 dla pustej tablicy', () => {
    expect(calculateLongestStreak([])).toBe(0);
  });

  it('zwraca 1 dla jednej sesji', () => {
    const sessions = [sessionDaysAgo(10)];
    expect(calculateLongestStreak(sessions)).toBe(1);
  });

  it('oblicza najdluzszy ciag z wielu grup', () => {
    // Grupa 1: 10-8 dni temu (3 dni)
    // Grupa 2: 5-3 dni temu (3 dni)
    // Grupa 3: dzisiaj (1 dzien)
    const sessions = [
      sessionDaysAgo(10),
      sessionDaysAgo(9),
      sessionDaysAgo(8),
      sessionDaysAgo(5),
      sessionDaysAgo(4),
      sessionDaysAgo(3),
      sessionDaysAgo(0),
    ];
    expect(calculateLongestStreak(sessions)).toBe(3);
  });

  it('rozpoznaje dluzszy ciag na poczatku', () => {
    const sessions = [
      sessionDaysAgo(20),
      sessionDaysAgo(19),
      sessionDaysAgo(18),
      sessionDaysAgo(17),
      sessionDaysAgo(10),
      sessionDaysAgo(9),
    ];
    expect(calculateLongestStreak(sessions)).toBe(4);
  });
});

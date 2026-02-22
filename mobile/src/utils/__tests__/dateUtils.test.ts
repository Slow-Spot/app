import {
  formatDateKey,
  formatDisplayDate,
  formatShortDate,
  formatTime,
  formatDateTime,
  formatRelativeDate,
  formatDuration,
  formatSeconds,
  parseDate,
  areSameDay,
  isDateBefore,
  isDateAfter,
  isDateInRange,
  getDaysBetween,
  getCalendarDaysBetween,
  getMinutesBetween,
  areConsecutiveDays,
  getTimeOfDay,
  getDayOfWeek,
  getDayName,
  getShortDayName,
  getUniqueDateKeys,
  calculateLongestStreak,
  getWeekKey,
} from '../dateUtils';

// Stale daty do testow - unikamy zaleznosci od biezacego czasu
const JAN_1 = new Date(2026, 0, 1, 10, 30, 0); // czwartek
const JAN_2 = new Date(2026, 0, 2, 14, 0, 0);  // piatek
const JAN_3 = new Date(2026, 0, 3, 8, 0, 0);   // sobota
const JAN_5 = new Date(2026, 0, 5, 19, 0, 0);   // poniedzialek

describe('dateUtils', () => {
  // ════════════════════════════════════════════════════════
  // DATE FORMATTING
  // ════════════════════════════════════════════════════════

  describe('formatDateKey', () => {
    it('formatuje date jako YYYY-MM-DD', () => {
      expect(formatDateKey(JAN_1)).toBe('2026-01-01');
      expect(formatDateKey(JAN_5)).toBe('2026-01-05');
    });

    it('poprawnie formatuje daty z roznymi miesiacami', () => {
      const dec = new Date(2025, 11, 31);
      expect(formatDateKey(dec)).toBe('2025-12-31');
    });
  });

  describe('formatDisplayDate', () => {
    it('formatuje date w formacie czytelnym', () => {
      expect(formatDisplayDate(JAN_1)).toBe('January 1, 2026');
    });
  });

  describe('formatShortDate', () => {
    it('formatuje krotka date', () => {
      expect(formatShortDate(JAN_1)).toBe('Jan 1');
      expect(formatShortDate(JAN_5)).toBe('Jan 5');
    });
  });

  describe('formatTime', () => {
    it('formatuje czas w formacie 12h', () => {
      expect(formatTime(JAN_1)).toBe('10:30 AM');
      expect(formatTime(JAN_2)).toBe('2:00 PM');
    });
  });

  describe('formatDateTime', () => {
    it('formatuje date i czas razem', () => {
      expect(formatDateTime(JAN_1)).toBe('Jan 1, 2026 at 10:30 AM');
    });
  });

  describe('formatRelativeDate', () => {
    it('zwraca "Today" dla dzisiejszej daty', () => {
      const today = new Date();
      expect(formatRelativeDate(today)).toBe('Today');
    });

    it('zwraca "Yesterday" dla wczorajszej daty', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(formatRelativeDate(yesterday)).toBe('Yesterday');
    });

    it('zwraca krotka date dla starszych dat', () => {
      const oldDate = new Date(2020, 5, 15);
      expect(formatRelativeDate(oldDate)).toBe('Jun 15');
    });
  });

  describe('formatDuration', () => {
    it('formatuje minuty ponizej godziny', () => {
      expect(formatDuration(30)).toBe('30m');
      expect(formatDuration(1)).toBe('1m');
      expect(formatDuration(59)).toBe('59m');
    });

    it('formatuje pelne godziny', () => {
      expect(formatDuration(60)).toBe('1h');
      expect(formatDuration(120)).toBe('2h');
    });

    it('formatuje godziny z minutami', () => {
      expect(formatDuration(65)).toBe('1h 5m');
      expect(formatDuration(90)).toBe('1h 30m');
      expect(formatDuration(150)).toBe('2h 30m');
    });
  });

  describe('formatSeconds', () => {
    it('formatuje sekundy jako MM:SS', () => {
      expect(formatSeconds(0)).toBe('0:00');
      expect(formatSeconds(5)).toBe('0:05');
      expect(formatSeconds(65)).toBe('1:05');
      expect(formatSeconds(125)).toBe('2:05');
    });

    it('formatuje sekundy jako HH:MM:SS gdy > 1h', () => {
      expect(formatSeconds(3600)).toBe('1:00:00');
      expect(formatSeconds(3665)).toBe('1:01:05');
      expect(formatSeconds(7200)).toBe('2:00:00');
    });
  });

  // ════════════════════════════════════════════════════════
  // DATE PARSING
  // ════════════════════════════════════════════════════════

  describe('parseDate', () => {
    it('parsuje string ISO na obiekt Date', () => {
      const result = parseDate('2026-01-04T14:30:00.000Z');
      expect(result).toBeInstanceOf(Date);
      expect(result.getUTCHours()).toBe(14);
      expect(result.getUTCMinutes()).toBe(30);
    });
  });

  // ════════════════════════════════════════════════════════
  // DATE COMPARISONS
  // ════════════════════════════════════════════════════════

  describe('areSameDay', () => {
    it('zwraca true dla tego samego dnia', () => {
      const morning = new Date(2026, 0, 1, 8, 0, 0);
      const evening = new Date(2026, 0, 1, 20, 0, 0);
      expect(areSameDay(morning, evening)).toBe(true);
    });

    it('zwraca false dla roznych dni', () => {
      expect(areSameDay(JAN_1, JAN_2)).toBe(false);
    });
  });

  describe('isDateBefore / isDateAfter', () => {
    it('poprawnie porownuje daty', () => {
      expect(isDateBefore(JAN_1, JAN_2)).toBe(true);
      expect(isDateBefore(JAN_2, JAN_1)).toBe(false);
      expect(isDateAfter(JAN_2, JAN_1)).toBe(true);
      expect(isDateAfter(JAN_1, JAN_2)).toBe(false);
    });
  });

  describe('isDateInRange', () => {
    it('zwraca true dla daty w zakresie', () => {
      expect(isDateInRange(JAN_2, JAN_1, JAN_3)).toBe(true);
    });

    it('zwraca true dla daty na granicy zakresu', () => {
      expect(isDateInRange(JAN_1, JAN_1, JAN_3)).toBe(true);
      expect(isDateInRange(JAN_3, JAN_1, JAN_3)).toBe(true);
    });

    it('zwraca false dla daty poza zakresem', () => {
      expect(isDateInRange(JAN_5, JAN_1, JAN_3)).toBe(false);
    });
  });

  // ════════════════════════════════════════════════════════
  // DATE CALCULATIONS
  // ════════════════════════════════════════════════════════

  describe('getDaysBetween', () => {
    it('zwraca absolutna roznice w pelnych 24h okresach', () => {
      // differenceInDays liczy pelne 24h, nie dni kalendarzowe
      // JAN_1 10:30 -> JAN_3 8:00 = ~45.5h = 1 pelny 24h okres
      expect(getDaysBetween(JAN_1, JAN_3)).toBe(1);
      expect(getDaysBetween(JAN_3, JAN_1)).toBe(1);
    });

    it('zwraca pelne dni dla identycznych godzin', () => {
      const d1 = new Date(2026, 0, 1, 12, 0, 0);
      const d3 = new Date(2026, 0, 3, 12, 0, 0);
      expect(getDaysBetween(d1, d3)).toBe(2);
    });
  });

  describe('getCalendarDaysBetween', () => {
    it('zwraca roznice w dniach kalendarzowych', () => {
      expect(getCalendarDaysBetween(JAN_1, JAN_3)).toBe(2);
    });
  });

  describe('getMinutesBetween', () => {
    it('zwraca roznice w minutach', () => {
      const d1 = new Date(2026, 0, 1, 10, 0, 0);
      const d2 = new Date(2026, 0, 1, 11, 30, 0);
      expect(getMinutesBetween(d1, d2)).toBe(90);
    });
  });

  describe('areConsecutiveDays', () => {
    it('zwraca true dla kolejnych dni', () => {
      expect(areConsecutiveDays(JAN_1, JAN_2)).toBe(true);
      expect(areConsecutiveDays(JAN_2, JAN_3)).toBe(true);
    });

    it('zwraca false dla niekolejnych dni', () => {
      expect(areConsecutiveDays(JAN_1, JAN_3)).toBe(false);
      expect(areConsecutiveDays(JAN_3, JAN_5)).toBe(false);
    });

    it('zwraca false dla odwroconej kolejnosci', () => {
      expect(areConsecutiveDays(JAN_2, JAN_1)).toBe(false);
    });
  });

  // ════════════════════════════════════════════════════════
  // TIME OF DAY
  // ════════════════════════════════════════════════════════

  describe('getTimeOfDay', () => {
    it('rozpoznaje poranek (5-11)', () => {
      expect(getTimeOfDay(new Date(2026, 0, 1, 5, 0, 0))).toBe('morning');
      expect(getTimeOfDay(new Date(2026, 0, 1, 8, 0, 0))).toBe('morning');
      expect(getTimeOfDay(new Date(2026, 0, 1, 11, 59, 0))).toBe('morning');
    });

    it('rozpoznaje popoludnie (12-16)', () => {
      expect(getTimeOfDay(new Date(2026, 0, 1, 12, 0, 0))).toBe('afternoon');
      expect(getTimeOfDay(new Date(2026, 0, 1, 14, 0, 0))).toBe('afternoon');
      expect(getTimeOfDay(new Date(2026, 0, 1, 16, 59, 0))).toBe('afternoon');
    });

    it('rozpoznaje wieczor (17-20)', () => {
      expect(getTimeOfDay(new Date(2026, 0, 1, 17, 0, 0))).toBe('evening');
      expect(getTimeOfDay(new Date(2026, 0, 1, 19, 0, 0))).toBe('evening');
      expect(getTimeOfDay(new Date(2026, 0, 1, 20, 59, 0))).toBe('evening');
    });

    it('rozpoznaje noc (21-4)', () => {
      expect(getTimeOfDay(new Date(2026, 0, 1, 21, 0, 0))).toBe('night');
      expect(getTimeOfDay(new Date(2026, 0, 1, 23, 30, 0))).toBe('night');
      expect(getTimeOfDay(new Date(2026, 0, 1, 0, 0, 0))).toBe('night');
      expect(getTimeOfDay(new Date(2026, 0, 1, 3, 0, 0))).toBe('night');
      expect(getTimeOfDay(new Date(2026, 0, 1, 4, 59, 0))).toBe('night');
    });
  });

  describe('getDayOfWeek / getDayName / getShortDayName', () => {
    it('zwraca poprawny dzien tygodnia', () => {
      // 1 stycznia 2026 to czwartek
      expect(getDayOfWeek(JAN_1)).toBe(4); // Thursday
      expect(getDayName(JAN_1)).toBe('Thursday');
      expect(getShortDayName(JAN_1)).toBe('Thu');
    });
  });

  // ════════════════════════════════════════════════════════
  // STREAK UTILITIES
  // ════════════════════════════════════════════════════════

  describe('getUniqueDateKeys', () => {
    it('zwraca unikalne klucze dat posortowane chronologicznie', () => {
      const isoStrings = [
        '2026-01-04T10:00:00.000Z',
        '2026-01-04T15:00:00.000Z', // duplikat dnia
        '2026-01-03T08:00:00.000Z',
      ];
      const result = getUniqueDateKeys(isoStrings);
      expect(result).toHaveLength(2);
      expect(result[0]).toBe('2026-01-03');
      expect(result[1]).toBe('2026-01-04');
    });

    it('zwraca pusta tablice dla pustego wejscia', () => {
      expect(getUniqueDateKeys([])).toEqual([]);
    });
  });

  describe('calculateLongestStreak', () => {
    it('zwraca 0 dla pustej tablicy', () => {
      expect(calculateLongestStreak([])).toBe(0);
    });

    it('zwraca 1 dla pojedynczego dnia', () => {
      expect(calculateLongestStreak(['2026-01-01'])).toBe(1);
    });

    it('oblicza najdluzszy ciag kolejnych dni', () => {
      const dates = [
        '2026-01-01', '2026-01-02', // ciag 2
        '2026-01-05', '2026-01-06', '2026-01-07', // ciag 3
      ];
      expect(calculateLongestStreak(dates)).toBe(3);
    });

    it('oblicza ciag dla ciaglosci na poczatku', () => {
      const dates = [
        '2026-01-01', '2026-01-02', '2026-01-03', // ciag 3
        '2026-01-10', // przerwa
      ];
      expect(calculateLongestStreak(dates)).toBe(3);
    });

    it('rozpoznaje pelny ciag', () => {
      const dates = ['2026-01-01', '2026-01-02', '2026-01-03', '2026-01-04'];
      expect(calculateLongestStreak(dates)).toBe(4);
    });
  });

  describe('getWeekKey', () => {
    it('zwraca klucz tygodnia (poczatek tygodnia)', () => {
      // 1 stycznia 2026 (czwartek) -> poczatek tygodnia (niedziela 28 grudnia 2025)
      const key = getWeekKey(JAN_1);
      expect(key).toBe('2025-12-28');
    });
  });
});

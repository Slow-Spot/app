/**
 * Testy dla logger.ts
 * Sprawdzamy format wyjscia JSON i zachowanie w trybie dev/prod.
 */

// Mock __DEV__ przed importem
Object.defineProperty(global, '__DEV__', { value: true, writable: true });

import { logger } from '../logger';

describe('logger', () => {
  let consoleSpy: {
    log: jest.SpyInstance;
    warn: jest.SpyInstance;
    error: jest.SpyInstance;
    debug: jest.SpyInstance;
  };

  beforeEach(() => {
    consoleSpy = {
      log: jest.spyOn(console, 'log').mockImplementation(),
      warn: jest.spyOn(console, 'warn').mockImplementation(),
      error: jest.spyOn(console, 'error').mockImplementation(),
      debug: jest.spyOn(console, 'debug').mockImplementation(),
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('w trybie development', () => {
    it('logger.log emituje JSON z level=info', () => {
      logger.log('test message');

      expect(consoleSpy.log).toHaveBeenCalledTimes(1);
      const output = JSON.parse(consoleSpy.log.mock.calls[0][0]);

      expect(output.level).toBe('info');
      expect(output.env).toBe('development');
      expect(output.message).toBe('test message');
      expect(output.timestamp).toBeDefined();
    });

    it('logger.warn emituje JSON z level=warn', () => {
      logger.warn('warning');

      expect(consoleSpy.warn).toHaveBeenCalledTimes(1);
      const output = JSON.parse(consoleSpy.warn.mock.calls[0][0]);

      expect(output.level).toBe('warn');
      expect(output.message).toBe('warning');
    });

    it('logger.error emituje JSON z level=error', () => {
      logger.error('failure');

      expect(consoleSpy.error).toHaveBeenCalledTimes(1);
      const output = JSON.parse(consoleSpy.error.mock.calls[0][0]);

      expect(output.level).toBe('error');
      expect(output.message).toBe('failure');
    });

    it('logger.debug emituje JSON z level=debug', () => {
      logger.debug('debug info');

      expect(consoleSpy.debug).toHaveBeenCalledTimes(1);
      const output = JSON.parse(consoleSpy.debug.mock.calls[0][0]);

      expect(output.level).toBe('debug');
      expect(output.message).toBe('debug info');
    });

    it('laczy wiele argumentow w jeden message', () => {
      logger.log('part1', 'part2', 42);

      const output = JSON.parse(consoleSpy.log.mock.calls[0][0]);
      expect(output.message).toBe('part1 part2 42');
    });

    it('wyciaga wiadomosc z obiektow Error', () => {
      logger.error('prefix:', new Error('something broke'));

      const output = JSON.parse(consoleSpy.error.mock.calls[0][0]);
      expect(output.message).toBe('prefix: something broke');
    });

    it('zamienia obiekty na [Object]', () => {
      logger.log('data:', { key: 'value' });

      const output = JSON.parse(consoleSpy.log.mock.calls[0][0]);
      expect(output.message).toBe('data: [Object]');
    });

    it('timestamp jest w formacie ISO 8601', () => {
      logger.log('test');

      const output = JSON.parse(consoleSpy.log.mock.calls[0][0]);
      expect(() => new Date(output.timestamp)).not.toThrow();
      // Sprawdz format ISO
      expect(output.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });
  });
});

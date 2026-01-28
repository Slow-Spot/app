/**
 * Background Timer Service
 *
 * Utrzymuje timer sesji medytacji działający gdy telefon jest zablokowany.
 * Używa strategii audio-based background execution:
 * - Cichy plik audio w pętli utrzymuje app aktywną w tle
 * - Stan sesji persystowany w AsyncStorage (przetrwa restart)
 * - Czas liczony na podstawie timestamps (nie setInterval)
 */

import { createAudioPlayer, setAudioModeAsync, AudioPlayer } from 'expo-audio';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, AppStateStatus } from 'react-native';
import { logger } from '../utils/logger';

// Klucz do persystencji stanu sesji
const SESSION_STATE_KEY = '@slowspot/background_session';

// Stan sesji persystowany w AsyncStorage
export interface BackgroundSessionState {
  // Timestamp rozpoczęcia sesji (Date.now())
  startTime: number;
  // Całkowity czas sesji w sekundach
  totalDuration: number;
  // Czas naliczony przed pauzą (w sekundach)
  elapsedBeforePause: number;
  // Czy sesja jest wstrzymana
  isPaused: boolean;
  // Timestamp ostatniej pauzy (jeśli isPaused)
  pausedAt?: number;
  // Identyfikator sesji (do weryfikacji)
  sessionId: string;
}

// Callback wywoływany co sekundę z aktualnym czasem
export type TimerTickCallback = (remainingSeconds: number, elapsedSeconds: number) => void;

// Callback wywoływany gdy sesja się kończy
export type TimerCompleteCallback = () => void;

class BackgroundTimerService {
  private silentPlayer: AudioPlayer | null = null;
  private isInitialized = false;
  private currentSession: BackgroundSessionState | null = null;
  private tickInterval: NodeJS.Timeout | null = null;
  private onTick: TimerTickCallback | null = null;
  private onComplete: TimerCompleteCallback | null = null;
  private appStateSubscription: ReturnType<typeof AppState.addEventListener> | null = null;

  /**
   * Inicjalizuje serwis - konfiguruje audio mode i ładuje cichy plik
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Konfiguracja audio mode dla działania w tle
      await setAudioModeAsync({
        playsInSilentMode: true,
        shouldPlayInBackground: true,
      });

      // Ładowanie cichego pliku audio
      this.silentPlayer = createAudioPlayer(
        require('../../assets/sounds/silent-1s.mp3')
      );
      this.silentPlayer.loop = true;
      this.silentPlayer.volume = 0.01; // Minimalna głośność

      // Nasłuchiwanie zmian stanu aplikacji
      this.appStateSubscription = AppState.addEventListener(
        'change',
        this.handleAppStateChange.bind(this)
      );

      this.isInitialized = true;
      logger.log('BackgroundTimerService initialized');
    } catch (error) {
      logger.error('Failed to initialize BackgroundTimerService:', error);
      throw error;
    }
  }

  /**
   * Obsługa zmiany stanu aplikacji (foreground/background)
   */
  private handleAppStateChange(nextAppState: AppStateStatus): void {
    if (nextAppState === 'active' && this.currentSession && !this.currentSession.isPaused) {
      // App wraca na pierwszy plan - synchronizuj czas
      this.syncTimeFromTimestamp();
      logger.log('App returned to foreground, synced timer');
    }
  }

  /**
   * Synchronizuje czas na podstawie zapisanych timestampów
   * Wywoływane gdy app wraca na pierwszy plan
   */
  private syncTimeFromTimestamp(): void {
    if (!this.currentSession) return;

    const elapsed = this.calculateElapsedSeconds();
    const remaining = Math.max(0, this.currentSession.totalDuration - elapsed);

    if (this.onTick) {
      this.onTick(remaining, elapsed);
    }

    // Sprawdź czy sesja się skończyła podczas działania w tle
    if (remaining <= 0 && this.onComplete) {
      this.stopSession();
      this.onComplete();
    }
  }

  /**
   * Oblicza ile sekund upłynęło od startu sesji
   * Uwzględnia czas spędzony na pauzie
   */
  private calculateElapsedSeconds(): number {
    if (!this.currentSession) return 0;

    const { startTime, elapsedBeforePause, isPaused, pausedAt } = this.currentSession;

    if (isPaused && pausedAt) {
      // Jeśli jest pauza, zwróć czas do momentu pauzy
      return elapsedBeforePause;
    }

    // Czas od startu + czas naliczony przed poprzednimi pauzami
    const now = Date.now();
    const elapsedSinceStart = Math.floor((now - startTime) / 1000);
    return elapsedBeforePause + elapsedSinceStart;
  }

  /**
   * Rozpoczyna nową sesję timera
   */
  async startSession(
    totalSeconds: number,
    onTick: TimerTickCallback,
    onComplete: TimerCompleteCallback
  ): Promise<string> {
    await this.initialize();

    // Generuj unikalny ID sesji
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Tworzenie stanu sesji
    this.currentSession = {
      startTime: Date.now(),
      totalDuration: totalSeconds,
      elapsedBeforePause: 0,
      isPaused: false,
      sessionId,
    };

    this.onTick = onTick;
    this.onComplete = onComplete;

    // Zapisz stan do AsyncStorage
    await this.persistSessionState();

    // Uruchom cichy audio dla działania w tle
    await this.startSilentAudio();

    // Uruchom tick interval dla UI updates
    this.startTickInterval();

    logger.log(`Started background session: ${sessionId}, duration: ${totalSeconds}s`);
    return sessionId;
  }

  /**
   * Wznawia sesję z AsyncStorage (np. po restarcie app)
   */
  async resumeSession(
    onTick: TimerTickCallback,
    onComplete: TimerCompleteCallback
  ): Promise<boolean> {
    await this.initialize();

    const savedState = await this.loadSessionState();
    if (!savedState) {
      logger.log('No saved session to resume');
      return false;
    }

    // Sprawdź czy sesja się już nie skończyła
    const now = Date.now();
    let elapsed: number;

    if (savedState.isPaused && savedState.pausedAt) {
      elapsed = savedState.elapsedBeforePause;
    } else {
      const elapsedSinceStart = Math.floor((now - savedState.startTime) / 1000);
      elapsed = savedState.elapsedBeforePause + elapsedSinceStart;
    }

    if (elapsed >= savedState.totalDuration) {
      // Sesja się skończyła - wyczyść stan
      await this.clearSessionState();
      logger.log('Saved session already completed');
      return false;
    }

    // Wznów sesję
    this.currentSession = savedState;
    this.onTick = onTick;
    this.onComplete = onComplete;

    if (!savedState.isPaused) {
      await this.startSilentAudio();
      this.startTickInterval();
    }

    logger.log(`Resumed session: ${savedState.sessionId}`);
    return true;
  }

  /**
   * Pauzuje aktualną sesję
   */
  async pauseSession(): Promise<void> {
    if (!this.currentSession || this.currentSession.isPaused) return;

    const elapsed = this.calculateElapsedSeconds();

    this.currentSession = {
      ...this.currentSession,
      elapsedBeforePause: elapsed,
      isPaused: true,
      pausedAt: Date.now(),
      // Reset startTime - będzie ustawiony przy resume
      startTime: this.currentSession.startTime,
    };

    await this.persistSessionState();
    this.stopTickInterval();
    await this.stopSilentAudio();

    logger.log('Session paused');
  }

  /**
   * Wznawia spauzowaną sesję
   */
  async resumeFromPause(): Promise<void> {
    if (!this.currentSession || !this.currentSession.isPaused) return;

    this.currentSession = {
      ...this.currentSession,
      startTime: Date.now(), // Nowy punkt startowy
      isPaused: false,
      pausedAt: undefined,
    };

    await this.persistSessionState();
    await this.startSilentAudio();
    this.startTickInterval();

    logger.log('Session resumed from pause');
  }

  /**
   * Zatrzymuje sesję (kończy lub anuluje)
   *
   * Guard: po operacjach async sprawdza czy sesja nie została podmieniona
   * przez startSession() (race condition gdy stopSession jest fire-and-forget)
   */
  async stopSession(): Promise<void> {
    const stoppingSessionId = this.currentSession?.sessionId ?? null;

    this.stopTickInterval();
    await this.stopSilentAudio();
    await this.clearSessionState();

    // Guard: nie nadpisuj stanu jeśli w międzyczasie startSession() utworzył nową sesję
    if (this.currentSession?.sessionId === stoppingSessionId) {
      this.currentSession = null;
      this.onTick = null;
      this.onComplete = null;
      logger.log('Session stopped');
    } else {
      logger.log('Session stop skipped - new session already started');
    }
  }

  /**
   * Pobiera aktualny pozostały czas
   */
  getRemainingSeconds(): number {
    if (!this.currentSession) return 0;
    const elapsed = this.calculateElapsedSeconds();
    return Math.max(0, this.currentSession.totalDuration - elapsed);
  }

  /**
   * Sprawdza czy sesja jest aktywna
   */
  isSessionActive(): boolean {
    return this.currentSession !== null;
  }

  /**
   * Sprawdza czy sesja jest spauzowana
   */
  isSessionPaused(): boolean {
    return this.currentSession?.isPaused ?? false;
  }

  /**
   * Pobiera ID aktualnej sesji
   */
  getSessionId(): string | null {
    return this.currentSession?.sessionId ?? null;
  }

  // --- Prywatne metody ---

  private async startSilentAudio(): Promise<void> {
    if (this.silentPlayer && !this.silentPlayer.playing) {
      try {
        this.silentPlayer.play();
        logger.log('Silent audio started for background execution');
      } catch (error) {
        logger.error('Failed to start silent audio:', error);
      }
    }
  }

  private async stopSilentAudio(): Promise<void> {
    if (this.silentPlayer && this.silentPlayer.playing) {
      try {
        this.silentPlayer.pause();
        this.silentPlayer.seekTo(0);
        logger.log('Silent audio stopped');
      } catch (error) {
        logger.error('Failed to stop silent audio:', error);
      }
    }
  }

  private startTickInterval(): void {
    this.stopTickInterval(); // Upewnij się że nie ma podwójnego intervalu

    this.tickInterval = setInterval(() => {
      if (!this.currentSession || this.currentSession.isPaused) return;

      const elapsed = this.calculateElapsedSeconds();
      const remaining = Math.max(0, this.currentSession.totalDuration - elapsed);

      if (this.onTick) {
        this.onTick(remaining, elapsed);
      }

      if (remaining <= 0 && this.onComplete) {
        this.stopSession();
        this.onComplete();
      }
    }, 1000);
  }

  private stopTickInterval(): void {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
  }

  private async persistSessionState(): Promise<void> {
    if (!this.currentSession) return;

    try {
      await AsyncStorage.setItem(
        SESSION_STATE_KEY,
        JSON.stringify(this.currentSession)
      );
    } catch (error) {
      logger.error('Failed to persist session state:', error);
    }
  }

  private async loadSessionState(): Promise<BackgroundSessionState | null> {
    try {
      const json = await AsyncStorage.getItem(SESSION_STATE_KEY);
      if (!json) return null;
      return JSON.parse(json) as BackgroundSessionState;
    } catch (error) {
      logger.error('Failed to load session state:', error);
      return null;
    }
  }

  private async clearSessionState(): Promise<void> {
    try {
      await AsyncStorage.removeItem(SESSION_STATE_KEY);
    } catch (error) {
      logger.error('Failed to clear session state:', error);
    }
  }

  /**
   * Cleanup - wywołaj przy zamykaniu aplikacji
   */
  async cleanup(): Promise<void> {
    this.stopTickInterval();

    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
      this.appStateSubscription = null;
    }

    if (this.silentPlayer) {
      this.silentPlayer.release();
      this.silentPlayer = null;
    }

    this.isInitialized = false;
    logger.log('BackgroundTimerService cleaned up');
  }
}

// Singleton instance
export const backgroundTimer = new BackgroundTimerService();

import { createAudioPlayer, setAudioModeAsync, AudioPlayer } from 'expo-audio';
import { logger } from '../utils/logger';

export type AudioLayer = 'voice' | 'ambient' | 'chime';

export interface AudioTrack {
  player: AudioPlayer;
  layer: AudioLayer;
  volume: number;
}

/**
 * 3-Layer Audio Engine with Healing Frequencies
 *
 * Audio Layers:
 * - Voice: Guided meditation narration (foreground)
 * - Ambient: Background sounds tuned to 432Hz (natural harmonic frequency)
 * - Chime: Start/end bells tuned to 528Hz (love/healing frequency)
 *
 * Healing Frequencies:
 * - 432Hz: Natural tuning frequency that resonates with the universe
 *   Promotes mental clarity, emotional stability, and reduced stress
 * - 528Hz: "Miracle tone" associated with transformation and DNA repair
 *   Promotes peace, love, healing, and spiritual awareness
 *
 * Note: Audio files must be pre-tuned to these frequencies during production.
 * See docs/AUDIO_FREQUENCIES.md for detailed guidelines.
 *
 * Migrated from expo-av to expo-audio for SDK 54+ compatibility.
 */
class AudioEngine {
  private tracks: Map<AudioLayer, AudioPlayer> = new Map();
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;

    try {
      await setAudioModeAsync({
        playsInSilentMode: true,
        shouldPlayInBackground: true,
      });
      this.isInitialized = true;
      logger.log('Audio engine initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize audio:', error);
      throw error;
    }
  }

  async loadTrack(layer: AudioLayer, uri: string | number, volume: number = 1.0) {
    await this.initialize();

    try {
      // Unload existing track if present
      await this.unloadTrack(layer);

      // Determine source type:
      // - number = require() result (local asset)
      // - string starting with http = remote URL
      // - string starting with file:// = local file from document picker
      // - string starting with content:// = Android content provider URI
      // - other string = invalid, skip
      let source: { uri: string } | number;

      if (typeof uri === 'number') {
        // Local asset from require()
        source = uri;
      } else if (typeof uri === 'string' && uri.startsWith('http')) {
        // Remote URL
        source = { uri };
      } else if (typeof uri === 'string' && (uri.startsWith('file://') || uri.startsWith('content://'))) {
        // Local file from document picker (iOS: file://, Android: content://)
        source = { uri };
        logger.log(`Loading custom audio file for ${layer}: ${uri.substring(0, 50)}...`);
      } else {
        logger.warn(`Invalid audio source for ${layer}: ${uri}`);
        return;
      }

      // Create player from source using expo-audio
      const player = createAudioPlayer(source);

      // Configure player settings
      player.volume = Math.max(0, Math.min(1, volume));
      player.loop = layer === 'ambient'; // Only ambient loops

      this.tracks.set(layer, player);
      logger.log(`Successfully loaded ${layer} track`);
    } catch (error) {
      logger.error(`Failed to load ${layer} track:`, error);
      // Don't throw - allow app to continue without this audio
      logger.warn(`Continuing without ${layer} audio`);
    }
  }

  async play(layer: AudioLayer) {
    const player = this.tracks.get(layer);
    if (!player) {
      logger.warn(`No track loaded for ${layer}`);
      return;
    }

    try {
      // Przewin na poczatek dla krotkich dzwiekow (chime/bell),
      // zeby mozna bylo odtworzyc ponownie po zakonczeniu
      if (layer === 'chime') {
        player.seekTo(0);
      }
      if (!player.playing) {
        player.play();
        logger.log(`Playing ${layer} track`);
      }
    } catch (error) {
      logger.error(`Failed to play ${layer}:`, error);
    }
  }

  async pause(layer: AudioLayer) {
    const player = this.tracks.get(layer);
    if (!player) return;

    try {
      if (player.playing) {
        player.pause();
        logger.log(`Paused ${layer} track`);
      }
    } catch (error) {
      logger.error(`Failed to pause ${layer}:`, error);
    }
  }

  async stop(layer: AudioLayer) {
    const player = this.tracks.get(layer);
    if (!player) return;

    try {
      player.pause();
      player.seekTo(0);
      logger.log(`Stopped ${layer} track`);
    } catch (error) {
      logger.error(`Failed to stop ${layer}:`, error);
    }
  }

  async setVolume(layer: AudioLayer, volume: number) {
    const player = this.tracks.get(layer);
    if (!player) return;

    try {
      const normalizedVolume = Math.max(0, Math.min(1, volume));
      player.volume = normalizedVolume;
    } catch (error) {
      logger.error(`Failed to set volume for ${layer}:`, error);
    }
  }

  async fadeIn(layer: AudioLayer, duration: number = 2000, targetVolume: number = 1.0) {
    const player = this.tracks.get(layer);
    if (!player) return;

    const steps = 20;
    const stepDuration = duration / steps;

    try {
      // Start at volume 0
      await this.setVolume(layer, 0);
      await this.play(layer);

      // Gradually increase volume
      for (let i = 0; i <= steps; i++) {
        const volume = (i / steps) * targetVolume;
        await this.setVolume(layer, volume);
        await new Promise((resolve) => setTimeout(resolve, stepDuration));
      }
      logger.log(`Faded in ${layer} track`);
    } catch (error) {
      logger.error(`Failed to fade in ${layer}:`, error);
    }
  }

  async fadeOut(layer: AudioLayer, duration: number = 2000) {
    const player = this.tracks.get(layer);
    if (!player) return;

    const steps = 20;
    const stepDuration = duration / steps;

    try {
      // Get current volume
      const currentVolume = player.volume || 1.0;

      // Gradually decrease volume
      for (let i = steps; i >= 0; i--) {
        const volume = (i / steps) * currentVolume;
        await this.setVolume(layer, volume);
        await new Promise((resolve) => setTimeout(resolve, stepDuration));
      }

      await this.stop(layer);
      logger.log(`Faded out ${layer} track`);
    } catch (error) {
      logger.error(`Failed to fade out ${layer}:`, error);
    }
  }

  async playAll() {
    const layers = Array.from(this.tracks.keys());
    for (const layer of layers) {
      await this.play(layer);
    }
  }

  async pauseAll() {
    const layers = Array.from(this.tracks.keys());
    for (const layer of layers) {
      await this.pause(layer);
    }
  }

  async stopAll() {
    const layers = Array.from(this.tracks.keys());
    for (const layer of layers) {
      await this.stop(layer);
    }
  }

  async unloadTrack(layer: AudioLayer) {
    const player = this.tracks.get(layer);
    if (!player) return;

    try {
      // Release the player to free resources
      player.release();
      this.tracks.delete(layer);
      logger.log(`Unloaded ${layer} track`);
    } catch (error) {
      logger.error(`Failed to unload ${layer}:`, error);
    }
  }

  async cleanup() {
    logger.log('Cleaning up audio engine...');
    const layers = Array.from(this.tracks.keys());
    for (const layer of layers) {
      await this.unloadTrack(layer);
    }
    this.isInitialized = false;
    logger.log('Audio engine cleanup complete');
  }

  async getStatus(layer: AudioLayer) {
    const player = this.tracks.get(layer);
    if (!player) return null;

    try {
      return {
        isPlaying: player.playing,
        currentTime: player.currentTime, // Already in seconds
        duration: player.duration, // Already in seconds
        volume: player.volume || 0,
        isLooping: player.loop,
      };
    } catch (error) {
      logger.error(`Failed to get status for ${layer}:`, error);
      return null;
    }
  }
}

export const audioEngine = new AudioEngine();

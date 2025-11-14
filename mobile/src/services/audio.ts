import { Audio } from 'expo-av';

export type AudioLayer = 'voice' | 'ambient' | 'chime';

export interface AudioTrack {
  sound: Audio.Sound;
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
 */
class AudioEngine {
  private tracks: Map<AudioLayer, Audio.Sound> = new Map();
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;

    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
      });
      this.isInitialized = true;
      console.log('Audio engine initialized successfully');
    } catch (error) {
      console.error('Failed to initialize audio:', error);
      throw error;
    }
  }

  async loadTrack(layer: AudioLayer, uri: string, volume: number = 1.0) {
    await this.initialize();

    try {
      // Unload existing track if present
      await this.unloadTrack(layer);

      // Create sound from URI or require()
      const { sound } = await Audio.Sound.createAsync(
        typeof uri === 'string' && uri.startsWith('http')
          ? { uri }
          : uri as any, // For local files passed as require()
        {
          shouldPlay: false,
          isLooping: layer === 'ambient', // Only ambient loops
          volume: Math.max(0, Math.min(1, volume)),
        }
      );

      this.tracks.set(layer, sound);
      console.log(`Successfully loaded ${layer} track`);
    } catch (error) {
      console.error(`Failed to load ${layer} track:`, error);
      // Don't throw - allow app to continue without this audio
      console.warn(`Continuing without ${layer} audio`);
    }
  }

  async play(layer: AudioLayer) {
    const sound = this.tracks.get(layer);
    if (!sound) {
      console.warn(`No track loaded for ${layer}`);
      return;
    }

    try {
      const status = await sound.getStatusAsync();
      if (status.isLoaded && !status.isPlaying) {
        await sound.playAsync();
        console.log(`Playing ${layer} track`);
      }
    } catch (error) {
      console.error(`Failed to play ${layer}:`, error);
    }
  }

  async pause(layer: AudioLayer) {
    const sound = this.tracks.get(layer);
    if (!sound) return;

    try {
      const status = await sound.getStatusAsync();
      if (status.isLoaded && status.isPlaying) {
        await sound.pauseAsync();
        console.log(`Paused ${layer} track`);
      }
    } catch (error) {
      console.error(`Failed to pause ${layer}:`, error);
    }
  }

  async stop(layer: AudioLayer) {
    const sound = this.tracks.get(layer);
    if (!sound) return;

    try {
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        await sound.stopAsync();
        await sound.setPositionAsync(0);
        console.log(`Stopped ${layer} track`);
      }
    } catch (error) {
      console.error(`Failed to stop ${layer}:`, error);
    }
  }

  async setVolume(layer: AudioLayer, volume: number) {
    const sound = this.tracks.get(layer);
    if (!sound) return;

    try {
      const normalizedVolume = Math.max(0, Math.min(1, volume));
      await sound.setVolumeAsync(normalizedVolume);
    } catch (error) {
      console.error(`Failed to set volume for ${layer}:`, error);
    }
  }

  async fadeIn(layer: AudioLayer, duration: number = 2000, targetVolume: number = 1.0) {
    const sound = this.tracks.get(layer);
    if (!sound) return;

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
      console.log(`Faded in ${layer} track`);
    } catch (error) {
      console.error(`Failed to fade in ${layer}:`, error);
    }
  }

  async fadeOut(layer: AudioLayer, duration: number = 2000) {
    const sound = this.tracks.get(layer);
    if (!sound) return;

    const steps = 20;
    const stepDuration = duration / steps;

    try {
      // Get current volume
      const status = await sound.getStatusAsync();
      if (!status.isLoaded) return;

      const currentVolume = status.volume || 1.0;

      // Gradually decrease volume
      for (let i = steps; i >= 0; i--) {
        const volume = (i / steps) * currentVolume;
        await this.setVolume(layer, volume);
        await new Promise((resolve) => setTimeout(resolve, stepDuration));
      }

      await this.stop(layer);
      console.log(`Faded out ${layer} track`);
    } catch (error) {
      console.error(`Failed to fade out ${layer}:`, error);
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
    const sound = this.tracks.get(layer);
    if (!sound) return;

    try {
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        await sound.unloadAsync();
      }
      this.tracks.delete(layer);
      console.log(`Unloaded ${layer} track`);
    } catch (error) {
      console.error(`Failed to unload ${layer}:`, error);
    }
  }

  async cleanup() {
    console.log('Cleaning up audio engine...');
    const layers = Array.from(this.tracks.keys());
    for (const layer of layers) {
      await this.unloadTrack(layer);
    }
    this.isInitialized = false;
    console.log('Audio engine cleanup complete');
  }

  async getStatus(layer: AudioLayer) {
    const sound = this.tracks.get(layer);
    if (!sound) return null;

    try {
      const status = await sound.getStatusAsync();
      if (!status.isLoaded) return null;

      return {
        isPlaying: status.isPlaying,
        currentTime: status.positionMillis / 1000, // Convert to seconds
        duration: status.durationMillis ? status.durationMillis / 1000 : 0,
        volume: status.volume || 0,
        isLooping: status.isLooping,
      };
    } catch (error) {
      console.error(`Failed to get status for ${layer}:`, error);
      return null;
    }
  }
}

export const audioEngine = new AudioEngine();

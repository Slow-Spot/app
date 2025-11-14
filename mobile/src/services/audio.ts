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
        shouldDuckAndroid: true,
      });
      this.isInitialized = true;
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

      const { sound } = await Audio.Sound.createAsync(
        { uri },
        {
          volume,
          shouldPlay: false,
          isLooping: layer === 'ambient', // Only ambient loops
        }
      );

      this.tracks.set(layer, sound);
    } catch (error) {
      console.error(`Failed to load ${layer} track:`, error);
      throw error;
    }
  }

  async play(layer: AudioLayer) {
    const sound = this.tracks.get(layer);
    if (!sound) {
      console.warn(`No track loaded for ${layer}`);
      return;
    }

    try {
      await sound.playAsync();
    } catch (error) {
      console.error(`Failed to play ${layer}:`, error);
    }
  }

  async pause(layer: AudioLayer) {
    const sound = this.tracks.get(layer);
    if (!sound) return;

    try {
      await sound.pauseAsync();
    } catch (error) {
      console.error(`Failed to pause ${layer}:`, error);
    }
  }

  async stop(layer: AudioLayer) {
    const sound = this.tracks.get(layer);
    if (!sound) return;

    try {
      await sound.stopAsync();
      await sound.setPositionAsync(0);
    } catch (error) {
      console.error(`Failed to stop ${layer}:`, error);
    }
  }

  async setVolume(layer: AudioLayer, volume: number) {
    const sound = this.tracks.get(layer);
    if (!sound) return;

    try {
      await sound.setVolumeAsync(Math.max(0, Math.min(1, volume)));
    } catch (error) {
      console.error(`Failed to set volume for ${layer}:`, error);
    }
  }

  async fadeIn(layer: AudioLayer, duration: number = 2000) {
    const sound = this.tracks.get(layer);
    if (!sound) return;

    const steps = 20;
    const stepDuration = duration / steps;

    await this.play(layer);

    for (let i = 0; i <= steps; i++) {
      const volume = i / steps;
      await this.setVolume(layer, volume);
      await new Promise((resolve) => setTimeout(resolve, stepDuration));
    }
  }

  async fadeOut(layer: AudioLayer, duration: number = 2000) {
    const sound = this.tracks.get(layer);
    if (!sound) return;

    const steps = 20;
    const stepDuration = duration / steps;

    for (let i = steps; i >= 0; i--) {
      const volume = i / steps;
      await this.setVolume(layer, volume);
      await new Promise((resolve) => setTimeout(resolve, stepDuration));
    }

    await this.stop(layer);
  }

  async playAll() {
    for (const layer of this.tracks.keys()) {
      await this.play(layer);
    }
  }

  async pauseAll() {
    for (const layer of this.tracks.keys()) {
      await this.pause(layer);
    }
  }

  async stopAll() {
    for (const layer of this.tracks.keys()) {
      await this.stop(layer);
    }
  }

  async unloadTrack(layer: AudioLayer) {
    const sound = this.tracks.get(layer);
    if (!sound) return;

    try {
      await sound.unloadAsync();
      this.tracks.delete(layer);
    } catch (error) {
      console.error(`Failed to unload ${layer}:`, error);
    }
  }

  async cleanup() {
    for (const layer of this.tracks.keys()) {
      await this.unloadTrack(layer);
    }
    this.isInitialized = false;
  }

  getStatus(layer: AudioLayer) {
    const sound = this.tracks.get(layer);
    return sound?.getStatusAsync();
  }
}

export const audioEngine = new AudioEngine();

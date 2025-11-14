# Audio Sources - Meditation Sounds

## Potrzebne pliki audio (6 dźwięków)

### 1. **Cisza (Silence)** ❌ Nie potrzebny plik
- Brak dźwięku w tle
- Tylko dzwonek i voice guidance

### 2. **Natura (Nature)**
**Źródła:**
- **Pixabay**: https://pixabay.com/sound-effects/search/nature/
  - 100% darmowe, bez licencji, MP3
  - Rekomendacja: Birds singing, forest ambience
- **Freesound.org**: https://freesound.org/browse/tags/nature/
  - Filtruj: CC0 license
  - Ambient Nature Soundscapes pack

**Wymagania:**
- Format: MP3, 128-256kbps
- Długość: Min. 10-15 minut (loop seamless)
- Typ: Peaceful forest, birds, light wind

---

### 3. **Ocean**
**Źródła:**
- **Pixabay**: https://pixabay.com/sound-effects/search/ocean/
  - Ocean waves, beach sounds
  - MP3, royalty-free, no attribution
- **Mixkit**: https://mixkit.co/free-sound-effects/ocean/
  - High quality ocean waves

**Wymagania:**
- Format: MP3, 128-256kbps
- Długość: Min. 10-15 minut (loop seamless)
- Typ: Calm ocean waves, gentle tide

---

### 4. **Las (Forest)**
**Źródła:**
- **Freesound.org**: https://freesound.org/browse/tags/forest/
  - CC0 forest ambience
  - Birds, leaves rustling
- **Pixabay**: https://pixabay.com/sound-effects/search/forest/

**Wymagania:**
- Format: MP3, 128-256kbps
- Długość: Min. 10-15 minut (loop seamless)
- Typ: Deep forest, birds, natural ambience

---

### 5. **432 Hz Healing Frequency**
**Źródła (Najlepsze opcje):**

1. **Pixabay** (REKOMENDOWANE): https://pixabay.com/music/search/432hz/
   - 100% darmowe, bez licencji
   - MP3 download
   - Muzyka medytacyjna w 432Hz

2. **Internet Archive**: https://archive.org/details/432HzDeepHealingMusicForTheBodySoulDNARepairRelaxationMusicMeditationMusic_201901
   - Free download OGG i MP3
   - Public domain

3. **Jaapi Media**: https://jaapi.media/collections/free-downloads
   - Royalty-free 432Hz
   - Personal & commercial use

**Wymagania:**
- Format: MP3, 128-256kbps
- Długość: Min. 10-15 minut (loop seamless)
- Typ: Pure 432Hz tone lub ambient music w 432Hz
- Certyfikacja: Musi być prawdziwe 432Hz (nie pitch-shifted)

---

### 6. **528 Hz Love Frequency (Solfeggio)**
**Źródła:**

1. **Pixabay**: https://pixabay.com/music/search/528hz/
   - Darmowe, MP3

2. **Internet Archive**: Search "528hz meditation"
   - Public domain audio

3. **Jaapi Media**: https://jaapi.media/collections/free-downloads
   - Royalty-free 528Hz
   - Personal & commercial use

**Wymagania:**
- Format: MP3, 128-256kbps
- Długość: Min. 10-15 minut (loop seamless)
- Typ: Pure 528Hz tone lub ambient music w 528Hz
- Certyfikacja: Musi być prawdziwe 528Hz

---

## Specyfikacja techniczna

### Format
- **Container**: MP3
- **Bitrate**: 128-256 kbps (nie więcej dla ambient sounds)
- **Sample rate**: 44.1kHz
- **Channels**: Stereo

### Długość
- **Minimum**: 10 minut
- **Optimal**: 15-20 minut
- **Loop**: Seamless loop (początek i koniec muszą się łączyć bez kliknięcia)

### Wielkość pliku
- Cel: 5-10 MB per file
- Max: 15 MB per file
- Razem wszystkie pliki: ~50 MB

### Naming Convention
```
assets/sounds/ambient/
  ├── nature.mp3
  ├── ocean.mp3
  ├── forest.mp3
  ├── 432hz.mp3
  ├── 528hz.mp3
  └── meditation-bell.mp3 (już istnieje)
```

---

## Licencje - Co można użyć?

✅ **Bezpieczne licencje:**
- **CC0 (Public Domain)** - Najlepsze, zero restrykcji
- **CC BY** - Wymaga attribution (można dodać w Settings > About)
- **Pixabay License** - 100% darmowe, commercial use OK
- **Royalty-Free** - Jeśli specyfikacja mówi "commercial use allowed"

❌ **Unikaj:**
- YouTube downloads (copyright issues)
- "Personal use only"
- Attribution-NonCommercial (jeśli planujesz sprzedaż)

---

## Następne kroki

1. **Download audio** z Pixabay/Freesound
2. **Sprawdź loop** - czy seamlessly zapętlają się?
3. **Konwertuj** jeśli potrzeba (używając Audacity):
   - Ensure 44.1kHz sample rate
   - Export as MP3 128-256kbps
   - Add fade in/out (1-2 seconds) dla smooth loop
4. **Umieść w**: `assets/sounds/ambient/`
5. **Update kod** - dodaj mapping do plików

---

## Narzędzia do edycji (jeśli potrzeba)

**Audacity** (Free):
- Download: https://www.audacityteam.org/
- Do konwersji, fade in/out, loop points
- Export to MP3

**Ocenaudio** (Free):
- Prostsza alternatywa
- https://www.ocenaudio.com/

---

## Preview w aplikacji

Po dodaniu plików, zaktualizuj `CustomSessionBuilderScreen.tsx`:

```typescript
// Mapping ambient sounds to files
const ambientSoundFiles = {
  silence: null,
  nature: require('../../assets/sounds/ambient/nature.mp3'),
  ocean: require('../../assets/sounds/ambient/ocean.mp3'),
  forest: require('../../assets/sounds/ambient/forest.mp3'),
  '432hz': require('../../assets/sounds/ambient/432hz.mp3'),
  '528hz': require('../../assets/sounds/ambient/528hz.mp3'),
};

// Update playPreviewSound to use correct file
const playPreviewSound = (soundId: string) => {
  const file = ambientSoundFiles[soundId];
  if (!file) return;

  // Load and play preview
  const player = new AudioPlayer(file);
  player.play();
  setTimeout(() => player.remove(), 5000); // 5 second preview
};
```

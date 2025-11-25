# 🎵 Manual Ambient Sounds Download Guide

## Quick Start - 15 Minutes Setup

Pobierz 5 plików MP3 i umieść w folderze `assets/sounds/ambient/`

## Krok 1: Gdzie pobrać dźwięki (CC0 - darmowe)

### Opcja A: Pixabay (NAJŁATWIEJSZA) ⭐

1. Odwiedź: https://pixabay.com/music/search/meditation/
2. Filtruj: "Free for commercial use" + "No attribution required"
3. Pobierz 10-15 minutowe pliki dla każdego typu:

**Potrzebne pliki:**
- `nature.mp3` - szukaj: "forest birds nature"
- `ocean.mp3` - szukaj: "ocean waves calm"
- `forest.mp3` - szukaj: "deep forest ambient"
- `432hz.mp3` - szukaj: "432hz meditation"
- `528hz.mp3` - szukaj: "528hz healing"

### Opcja B: Freesound.org

1. Odwiedź: https://freesound.org/
2. Zarejestruj się (darmowe)
3. Wyszukaj: "meditation ambient cc0"
4. Filtruj: License = "CC0 (Public Domain)"

### Opcja C: YouTube Audio Library

1. Odwiedź: https://www.youtube.com/audiolibrary
2. Filtruj: "Ambient" + "Attribution not required"
3. Pobierz w MP3 (konwertuj jeśli potrzeba)

## Krok 2: Specyfikacja plików

Każdy plik powinien mieć:
- **Format:** MP3
- **Bitrate:** 128-256 kbps
- **Sample Rate:** 44.1 kHz
- **Długość:** 10-15 minut
- **Rozmiar:** 5-10 MB
- **Loop:** Powinien się płynnie zapętlać

## Krok 3: Nazwy plików (WAŻNE!)

Pliki MUSZĄ mieć dokładnie te nazwy:

```
assets/sounds/ambient/
  ├── nature.mp3    ✅
  ├── ocean.mp3     ✅
  ├── forest.mp3    ✅
  ├── 432hz.mp3     ✅
  └── 528hz.mp3     ✅
```

## Krok 4: Umieszczenie plików

```bash
# Z katalogu projektu:
cd "assets/sounds/ambient"

# Skopiuj pobrane pliki tutaj
# Upewnij się, że nazwy są poprawne!
ls -lh

# Powinno pokazać:
# nature.mp3
# ocean.mp3
# forest.mp3
# 432hz.mp3
# 528hz.mp3
```

## Krok 5: Weryfikacja

Po dodaniu plików, uruchom:

```bash
cd /Users/leszekszpunar/1.\ Work/1.\ ITEON/1.\ Projekty/Slow\ Spot\ APP/mobile
ls -lh assets/sounds/ambient/*.mp3

# Powinno pokazać 5 plików MP3
```

## 🚀 Szybkie Źródła (Gotowe do pobrania)

### Nature Sounds
- Pixabay: https://pixabay.com/music/search/forest%20birds/
- Freesound: https://freesound.org/search/?q=forest+birds+cc0

### Ocean Waves
- Pixabay: https://pixabay.com/music/search/ocean%20waves/
- Freesound: https://freesound.org/search/?q=ocean+waves+cc0

### Forest Ambience
- Pixabay: https://pixabay.com/music/search/forest%20ambience/
- Freesound: https://freesound.org/search/?q=forest+ambient+cc0

### 432 Hz Frequency
- Pixabay: https://pixabay.com/music/search/432hz/
- YouTube: Search "432hz meditation music no copyright"

### 528 Hz Frequency
- Pixabay: https://pixabay.com/music/search/528hz/
- YouTube: Search "528hz healing music no copyright"

## 🎯 Alternatywne źródła

Jeśli powyższe nie działają:

1. **Incompetech** - https://incompetech.com/music/
   - CC BY 3.0 (wymagana atrybucja)

2. **Free Music Archive** - https://freemusicarchive.org/
   - Różne licencje (sprawdź przed użyciem)

3. **Bensound** - https://www.bensound.com/
   - Darmowe dla niektórych użyć

## ⚠️ Licencje - WAŻNE!

Używaj TYLKO:
- ✅ CC0 (Public Domain) - NAJLEPSZE
- ✅ Pixabay License - OK
- ✅ CC BY (z attribution) - OK (dodaj credits)
- ❌ Copyrighted music - NIE UŻYWAJ!

## 🛠️ Narzędzia do konwersji

Jeśli masz pliki w WAV/OGG/FLAC:

### Online (łatwe):
- CloudConvert: https://cloudconvert.com/
- Online Audio Converter: https://online-audio-converter.com/

### Desktop:
```bash
# ffmpeg (Mac/Linux)
ffmpeg -i input.wav -b:a 192k -ar 44100 output.mp3

# Audacity (Windows/Mac/Linux)
# File > Export > Export as MP3
```

## ✅ Checklist

Po dodaniu plików, sprawdź:

- [ ] 5 plików MP3 w `assets/sounds/ambient/`
- [ ] Nazwy plików są dokładnie poprawne
- [ ] Każdy plik ma 10-15 minut
- [ ] Rozmiar każdego pliku: 5-10 MB
- [ ] Licencje są CC0 lub kompatybilne
- [ ] Pliki się zapętlają płynnie (przetestuj!)

## 🧪 Testowanie

Po dodaniu plików:

1. Uruchom app: `npm start`
2. Przejdź do: Custom Session Builder
3. Wybierz różne ambient sounds
4. Sprawdź czy odtwarzają się poprawnie
5. Zweryfikuj jakość dźwięku

## 💡 Wskazówki

1. **Jakość > Rozmiar**: 192kbps jest idealny balans
2. **Długość**: 15 minut jest lepsze niż 10 (mniej zapętleń)
3. **Seamless Loop**: Sprawdź czy koniec łączy się z początkiem
4. **Volume**: Normalizuj głośność wszystkich plików

## 🆘 Problemy?

**"Nie mogę znaleźć dobrych plików"**
- Użyj YouTube Audio Library (najprostsze)
- Szukaj: "meditation background music 15 minutes"

**"Pliki są za duże"**
- Użyj niższy bitrate: 128 kbps
- Skróć do 10 minut w Audacity

**"Pliki się nie zapętlają"**
- Użyj Audacity: Effect > Crossfade Loop
- Lub szukaj plików z tagiem "seamless loop"

## 🎉 Gotowe!

Po dodaniu plików, aplikacja będzie w pełni funkcjonalna z wszystkimi ambient sounds!

Next step: Przetestuj Custom Session Builder!

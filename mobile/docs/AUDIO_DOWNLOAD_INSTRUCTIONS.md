# Instrukcje pobierania plików audio - KROK PO KROKU

## ⚡ Szybki start (15 minut)

Potrzebujesz pobrać **5 plików MP3** i umieścić je w katalogu `assets/sounds/ambient/`

---

## 📥 KROK 1: Przygotuj folder

Folder już istnieje: `assets/sounds/ambient/`
Sprawdź czy jest pusty (oprócz meditation-bell.mp3):
```bash
ls -la assets/sounds/ambient/
```

---

## 🎵 KROK 2: Pobierz pliki

### 1️⃣ **nature.mp3** (Ptaki i las)

**Opcja A - Pixabay (REKOMENDOWANE):**
1. Otwórz: https://pixabay.com/sound-effects/search/forest%20birds/
2. Znajdź: "Forest Birds" lub "Morning Birds"
3. Wybierz plik 10-15 minut
4. Kliknij zielony przycisk **"Download"** (MP3)
5. Zapisz jako: `nature.mp3`

**Opcja B - Freesound:**
1. Otwórz: https://freesound.org/search/?q=forest+birds&f=duration%3A%5B600+TO+*%5D&s=score+desc&advanced=1&g=1
2. Filtruj: Creative Commons 0, Duration: >10 minutes
3. Pobierz wybrany plik
4. Zmień nazwę na: `nature.mp3`

---

### 2️⃣ **ocean.mp3** (Fale oceanu)

**Opcja A - Pixabay:**
1. Otwórz: https://pixabay.com/sound-effects/search/ocean%20waves/
2. Znajdź: "Ocean Waves" (10+ minut)
3. Download MP3
4. Zapisz jako: `ocean.mp3`

**Opcja B - Mixkit:**
1. Otwórz: https://mixkit.co/free-sound-effects/ocean/
2. Wybierz długi plik z falami
3. Download
4. Zapisz jako: `ocean.mp3`

---

### 3️⃣ **forest.mp3** (Głęboki las)

**Opcja A - Freesound:**
1. Otwórz: https://freesound.org/search/?q=deep+forest+ambience&f=duration%3A%5B600+TO+*%5D&s=score+desc&advanced=1&g=1
2. Filtruj: CC0, Duration >10 min
3. Wybierz "Forest Ambience" lub "Deep Woods"
4. Download
5. Zapisz jako: `forest.mp3`

**Opcja B - Pixabay:**
1. Otwórz: https://pixabay.com/sound-effects/search/deep%20forest/
2. Pobierz długi plik z szumem lasu
3. Zapisz jako: `forest.mp3`

---

### 4️⃣ **432hz.mp3** (Healing Frequency)

**Opcja A - Pixabay Music (NAJLEPSZE):**
1. Otwórz: https://pixabay.com/music/search/432hz/
2. Znajdź: "432Hz Meditation" lub "432Hz Healing"
3. Upewnij się że ma 10+ minut
4. Download MP3
5. Zapisz jako: `432hz.mp3`

**Opcja B - Internet Archive:**
1. Otwórz: https://archive.org/details/432HzDeepHealingMusicForTheBodySoulDNARepairRelaxationMusicMeditationMusic_201901
2. Kliknij: **"VBR MP3"** w prawym menu
3. Download
4. Zapisz jako: `432hz.mp3`

**WAŻNE:** Musi być prawdziwa częstotliwość 432Hz, nie pitch-shifted!

---

### 5️⃣ **528hz.mp3** (Love Frequency)

**Opcja A - Pixabay Music:**
1. Otwórz: https://pixabay.com/music/search/528hz/
2. Znajdź: "528Hz Solfeggio" lub "528Hz Love Frequency"
3. Min. 10 minut
4. Download MP3
5. Zapisz jako: `528hz.mp3`

**Opcja B - Internet Archive:**
1. Szukaj: "528hz meditation" w Archive.org
2. Wybierz plik z Public Domain
3. Download MP3
4. Zapisz jako: `528hz.mp3`

---

## 📂 KROK 3: Umieść pliki w projekcie

1. Otwórz Finder
2. Przejdź do: `assets/sounds/ambient/`
3. Przeciągnij wszystkie 5 pobranych plików:
   - nature.mp3
   - ocean.mp3
   - forest.mp3
   - 432hz.mp3
   - 528hz.mp3

4. Sprawdź czy są tam:
```bash
ls -lh assets/sounds/ambient/
```

Powinieneś zobaczyć:
```
meditation-bell.mp3  (już istnieje)
nature.mp3          (5-15 MB)
ocean.mp3           (5-15 MB)
forest.mp3          (5-15 MB)
432hz.mp3           (5-15 MB)
528hz.mp3           (5-15 MB)
```

---

## ✅ KROK 4: Zaktualizuj kod (już gotowe!)

Kod już jest przygotowany w `CustomSessionBuilderScreen.tsx`:
```typescript
const ambientSoundFiles = {
  silence: null,
  nature: require('../../assets/sounds/ambient/nature.mp3'),
  ocean: require('../../assets/sounds/ambient/ocean.mp3'),
  forest: require('../../assets/sounds/ambient/forest.mp3'),
  '432hz': require('../../assets/sounds/ambient/432hz.mp3'),
  '528hz': require('../../assets/sounds/ambient/528hz.mp3'),
};
```

**Żadnych zmian nie potrzeba!** Pliki będą automatycznie załadowane.

---

## 🧪 KROK 5: Testowanie

1. Zrestartuj Expo:
```bash
npx expo start --clear
```

2. W aplikacji:
   - Przejdź do **Custom Session Builder**
   - W sekcji "Ambient Sound" kliknij każdą opcję
   - Sprawdź czy słyszysz różne dźwięki:
     - **Natura** → ptaki i las
     - **Ocean** → fale
     - **Forest** → głęboki las
     - **432 Hz** → medytacyjna muzyka
     - **528 Hz** → muzyka miłości

---

## ⚠️ Rozwiązywanie problemów

### Problem 1: "Cannot find module"
**Rozwiązanie:**
```bash
npx expo start --clear
```

### Problem 2: Plik jest za duży (>20 MB)
**Rozwiązanie:** Skonwertuj w Audacity:
1. Pobierz: https://www.audacityteam.org/
2. Otwórz plik
3. Export → MP3 → 128 kbps
4. Zapisz

### Problem 3: Audio nie zapętla się płynnie
**Rozwiązanie:** Dodaj fade:
1. Otwórz w Audacity
2. Zaznacz początek (2 sekundy) → Effect → Fade In
3. Zaznacz koniec (2 sekundy) → Effect → Fade Out
4. Export

### Problem 4: Nie słychać żadnego dźwięku
**Sprawdź:**
- Czy plik jest w formacie MP3?
- Czy nazwa pliku jest dokładnie taka jak w instrukcji?
- Czy plik nie jest uszkodzony? (spróbuj otworzyć w innym playerze)

---

## 📝 Checklist

- [ ] nature.mp3 pobrany i umieszczony
- [ ] ocean.mp3 pobrany i umieszczony
- [ ] forest.mp3 pobrany i umieszczony
- [ ] 432hz.mp3 pobrany i umieszczony
- [ ] 528hz.mp3 pobrany i umieszczony
- [ ] Wszystkie pliki są w formacie MP3
- [ ] Każdy plik ma 10-15 minut
- [ ] Expo zrestartowane z --clear
- [ ] Przetestowane w aplikacji - wszystkie dźwięki grają

---

## 🎯 Szybkie linki

**Pixabay Sound Effects:** https://pixabay.com/sound-effects/
**Pixabay Music:** https://pixabay.com/music/
**Freesound.org:** https://freesound.org/
**Internet Archive Audio:** https://archive.org/details/audio

---

## ℹ️ Specyfikacja techniczna

| Parametr | Wartość |
|----------|---------|
| Format | MP3 |
| Bitrate | 128-256 kbps |
| Sample Rate | 44.1 kHz |
| Channels | Stereo |
| Długość | 10-15 minut |
| Wielkość | 5-15 MB per file |
| Loop | Seamless (z fade in/out) |

---

## ✨ Po zakończeniu

Po dodaniu wszystkich plików:
1. ✅ Style są spójne na wszystkich ekranach
2. ✅ Wszystkie dźwięki ambient działają
3. ✅ Aplikacja gotowa do użycia!

Gratulacje! 🎉

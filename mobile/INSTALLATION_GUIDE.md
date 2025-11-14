# Przewodnik instalacji po naprawach - Slow Spot

## Krok 1: Instalacja expo-av

```bash
cd "/Users/leszekszpunar/1. Work/1. ITEON/1. Projekty/Slow Spot APP/mobile"

# Zainstaluj expo-av
npm install expo-av@~15.0.4

# Opcjonalnie: Usuń expo-audio (już niepotrzebne)
npm uninstall expo-audio

# Wyczyść cache
rm -rf node_modules/.cache
```

## Krok 2: Rebuild aplikacji

### iOS:
```bash
npx expo run:ios
```

### Android:
```bash
npx expo run:android
```

## Krok 3: Weryfikacja (opcjonalnie)

### Sprawdź kompilację TypeScript:
```bash
npx tsc --noEmit
```

Powinno działać bez błędów związanych z audio (mogą być inne błędy TypeScript niezwiązane z naprawami).

### Test aplikacji:
1. Uruchom aplikację
2. Wybierz sesję medytacji
3. Kliknij "Start"
4. Sprawdź czy:
   - Timer się uruchamia
   - Breathing animation działa
   - Audio (jeśli dostępne) się odtwarza
   - Aplikacja NIE crashuje przy braku plików audio

## Co zostało naprawione:

✅ **AudioEngine** - Kompletnie przebudowany na expo-av API  
✅ **MeditationScreen** - Merge conflicts rozwiązane, dodano silent mode  
✅ **MeditationTimer** - Migracja chime player na expo-av  
✅ **Package.json** - Zaktualizowane dependencies

## Znane ograniczenia:

- **Brak plików ambient audio** - aplikacja działa w trybie ciszy
  - Lokalizacja: `/assets/sounds/ambient/`
  - Zobacz: `/assets/sounds/ambient/README.md` dla instrukcji

## Potrzebujesz pomocy?

Zobacz pełny raport: `BUGFIX_REPORT.md`

---
**Data:** 2025-11-14  
**Status:** READY FOR TESTING

# Testowanie aplikacji przez Expo Go

## Szybki start (3 kroki)

### 1. Zainstaluj Expo Go na telefonie
- **iOS**: https://apps.apple.com/app/expo-go/id982107779
- **Android**: https://play.google.com/store/apps/details?id=host.exp.exponent

### 2. Uruchom serwer developerski
```bash
cd mobile
./start-expo-go.sh
```

Alternatywnie:
```bash
cd mobile
npx expo start --tunnel
```

### 3. Zeskanuj QR kod
- **iOS**: Otwórz kamerę i zeskanuj QR kod wyświetlony w terminalu
- **Android**: Otwórz Expo Go -> "Scan QR code" i zeskanuj

## Ważne informacje

### Kompatybilność z New Architecture
Aplikacja używa React Native New Architecture (`newArchEnabled: true` w `app.json`).

**Expo Go NIE wspiera New Architecture!**

Jeśli Expo Go nie działa, masz 2 opcje:

#### Opcja 1: Tymczasowo wyłącz New Architecture (dla szybkich testów)
```json
// app.json
{
  "expo": {
    "newArchEnabled": false  // zmień na false
  }
}
```

Uruchom ponownie:
```bash
cd mobile
npx expo start --clear
```

#### Opcja 2: Użyj EAS Build Development (pełne funkcje)
```bash
cd mobile
eas build --profile development --platform ios
# lub
eas build --profile development --platform android
```

## Tryby uruchamiania

### Tunnel (POLECANE dla testowania zdalnego)
```bash
npx expo start --tunnel
```
- Działa przez internet (ngrok)
- Możesz testować z dowolnego miejsca
- Wolniejsze, ale zawsze działa

### LAN (szybsze, wymaga tej samej sieci Wi-Fi)
```bash
npx expo start --lan
```
- Telefon i komputer muszą być w tej samej sieci
- Szybsze niż tunnel
- Może nie działać z niektórymi firewall'ami

### Localhost (tylko dla symulatorów/emulatorów)
```bash
npx expo start
```
- Tylko dla iOS Simulator lub Android Emulator
- Najszybsze

## Debugowanie

### Problem: "Unable to connect to Metro"
1. Sprawdź czy jesteś w tej samej sieci Wi-Fi (tryb LAN)
2. Spróbuj trybu tunnel: `npx expo start --tunnel`
3. Wyczyść cache: `npx expo start --clear`

### Problem: "Incompatible React Native version"
- Upewnij się że Expo Go jest zaktualizowane do najnowszej wersji
- Sprawdź czy używasz Expo SDK 54 (w package.json)

### Problem: "This app requires a development build"
- Aplikacja używa modułów niekompatybilnych z Expo Go
- Użyj EAS Build development profile (patrz Opcja 2 powyżej)

### Problem: New Architecture error
- Tymczasowo wyłącz `newArchEnabled` w app.json
- Lub użyj EAS Build development

## Automatyczne przeładowanie

Metro automatycznie wykrywa zmiany w kodzie i przeładowuje aplikację!

Możesz też:
- **Shake phone** -> "Reload"
- W terminalu naciśnij **`r`** -> przeładuj
- W terminalu naciśnij **`m`** -> otwórz menu

## Testowanie na wielu urządzeniach

Możesz mieć otwartą aplikację na wielu urządzeniach jednocześnie!

1. Uruchom `npx expo start --tunnel`
2. Zeskanuj QR kod na iPhone
3. Zeskanuj ten sam QR kod na Android
4. Zeskanuj ten sam QR kod na drugim telefonie
5. Wszystkie urządzenia będą synchronizowane!

## Współdzielenie z zespołem

### Sposób 1: QR kod w terminalu
- Wyślij screenshot QR kodu
- Testerzy skanują i testują

### Sposób 2: Link tekstowy
```
exp://@leszekszpunar/slow-spot
```
- Wyślij link
- Otwórz w Expo Go

### Sposób 3: Publish do Expo (trwałe)
```bash
npx eas update --branch preview --message "Latest version"
```
- Tworzy trwałą wersję
- Link działa bez lokalnego serwera
- Automatyczne aktualizacje

## Porównanie: Expo Go vs Development Build

| Funkcja | Expo Go | Development Build |
|---------|---------|-------------------|
| Czas instalacji | 30 sekund | 15-20 minut (build) |
| Koszt | Darmowe | Darmowe (30 builds/m) |
| New Architecture | ❌ Nie | ✅ Tak |
| Custom native code | ❌ Nie | ✅ Tak |
| Auto reload | ✅ Tak | ✅ Tak |
| Debugowanie | ✅ Tak | ✅ Tak |
| Push notifications | ❌ Ograniczone | ✅ Pełne |
| In-app purchases | ❌ Nie | ✅ Tak |
| **Polecane dla** | Szybkie testy UI/UX | Finalne testy przed produkcją |

## Najlepsze praktyki

1. **Rozpocznij od Expo Go** - najszybszy sposób na zobaczenie UI
2. **Przejdź na Development Build** - gdy potrzebujesz pełnych funkcji
3. **Używaj tunnel** - jeśli LAN nie działa
4. **Testuj na prawdziwych urządzeniach** - symulatory to nie to samo
5. **Współdziel z zespołem** - łatwo wysłać QR kod na Slack

## Przydatne komendy

```bash
# Start z QR kodem
npx expo start

# Start z tunelem (dla zdalnego testowania)
npx expo start --tunnel

# Start z czystym cache
npx expo start --clear

# Sprawdź status
npx expo whoami

# Zobacz wszystkie opcje
npx expo start --help
```

## Następne kroki

Po przetestowaniu w Expo Go:
1. Zbuduj Development Build: `eas build --profile development`
2. Przetestuj pełne funkcje (New Architecture, native modules)
3. Zbuduj Preview Build: `eas build --profile preview`
4. Udostępnij testerom przez TestFlight/Internal Testing

---

**Pytania?** Sprawdź główną dokumentację: [BUILD_AND_DEPLOY.md](../BUILD_AND_DEPLOY.md)

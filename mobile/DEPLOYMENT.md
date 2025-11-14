# Deployment Guide - Slow Spot App

## Metoda 1: Expo EAS Build + TestFlight (NAJLEPSZA dla iOS)

### Setup (jednorazowo)

```bash
# 1. Zaloguj się do Expo
npx expo login

# 2. Zainicjalizuj EAS
npx eas init

# 3. Skonfiguruj build profile
npx eas build:configure
```

### Build dla testerów iOS

```bash
# Build development profile (dla wewnętrznych testów)
npx eas build --profile development --platform ios

# Lub build preview (dla TestFlight)
npx eas build --profile preview --platform ios
```

Po zakończeniu build:
1. Dostaniesz link do pobrania .ipa
2. Możesz przesłać do TestFlight automatycznie:
   ```bash
   npx eas submit --platform ios
   ```
3. W App Store Connect dodaj testerów przez email
4. Testerzy dostaną zaproszenie przez TestFlight

### Build dla testerów Android

```bash
# Build APK dla prostego udostępniania
npx eas build --profile preview --platform android

# Lub AAB dla Google Play Internal Testing
npx eas build --profile production --platform android
```

Po zakończeniu:
- APK: Prześlij link bezpośrednio testerom
- AAB: Prześlij do Google Play Console → Internal Testing

---

## Metoda 2: Expo Development Build + Expo Go (SZYBKA dla developmentu)

### Dla testerów z dostępem do Twojej sieci

```bash
# 1. Uruchom Expo
npx expo start

# 2. Wciśnij 's' aby przełączyć na LAN/tunnel
# 3. Wyślij QR code testerom
# 4. Testerzy skanują w Expo Go app
```

**Ograniczenie**: Wymaga Expo Go app i dostępu do Twojej sieci/tunelu.

---

## Metoda 3: Expo Snack (dla szybkiego demo)

1. Idź na https://snack.expo.dev
2. Skopiuj kod lub połącz z GitHub
3. Udostępnij link testerom
4. Działa w przeglądarce lub Expo Go

**Ograniczenie**: Nie dla wszystkich native features.

---

## Metoda 4: GitHub + Automated Builds (CI/CD)

### Setup GitHub Actions (automatyczny build przy push)

Stwórz `.github/workflows/eas-build.yml`:

```yaml
name: EAS Build
on:
  push:
    branches:
      - main
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install -g eas-cli
      - run: eas build --platform all --non-interactive --profile preview
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
```

Teraz każdy push do main automatycznie tworzy build!

---

## Rekomendacja dla Twojego przypadku

**Dla testerów zewnętrznych (najlepsze):**
```bash
# iOS
npx eas build --profile preview --platform ios
npx eas submit --platform ios  # Prześlij do TestFlight

# Android
npx eas build --profile preview --platform android
# Prześlij APK link bezpośrednio lub użyj Google Play Internal Testing
```

**Dla szybkich testów wewnętrznych:**
```bash
npx expo start --tunnel  # Testerzy skanują QR w Expo Go
```

---

## Konfiguracja eas.json (jeśli nie istnieje)

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false
      }
    },
    "production": {
      "distribution": "store"
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "twoj@email.com",
        "ascAppId": "123456789",
        "appleTeamId": "ABCD123456"
      },
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json"
      }
    }
  }
}
```

---

## Koszty

- **Expo Free Plan**: 30 builds/miesiąc (wystarczy do testów)
- **Production/TestFlight**: Apple Developer ($99/rok), Google Play ($25 jednorazowo)
- **Development builds**: Free unlimited w Expo Go

---

## Quick Start (TERAZ!)

```bash
cd "/Users/leszekszpunar/1. Work/1. ITEON/1. Projekty/Slow Spot APP/mobile"

# Zaloguj się
npx expo login

# Stwórz build preview
npx eas build --profile preview --platform ios

# Czekaj 10-15 min na build
# Dostaniesz link do .ipa który możesz przesłać testerom!
```

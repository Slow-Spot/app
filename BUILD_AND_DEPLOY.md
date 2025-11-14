# Build & Deploy Guide - Slow Spot App

Przewodnik po budowaniu i dystrybuowaniu aplikacji mobilnej Slow Spot na urządzenia testowe i produkcyjne.

## 📋 Spis treści

- [Expo Go - Najszybszy sposób (POLECANE dla testów)](#expo-go---najszybszy-sposób)
- [Wymagania](#wymagania)
- [Konfiguracja EAS](#konfiguracja-eas)
- [Budowanie aplikacji](#budowanie-aplikacji)
- [Dystrybucja na urządzenia testowe](#dystrybucja-na-urządzenia-testowe)
- [GitHub Releases](#github-releases)
- [TestFlight (iOS)](#testflight-ios)
- [Google Play Internal Testing (Android)](#google-play-internal-testing-android)

---

## Expo Go - Najszybszy sposób

**Expo Go to najszybszy i najłatwiejszy sposób do testowania aplikacji!**

### Zalety Expo Go
- ✅ Nie wymaga budowania aplikacji (0 minut zamiast 15-20 minut)
- ✅ Nie wymaga Apple Developer Account ($0 zamiast $99/rok)
- ✅ Natychmiastowa dystrybucja (skanuj QR kod lub kliknij link)
- ✅ Automatyczne aktualizacje (po każdym `expo publish`)
- ✅ Działa na iOS i Android
- ⚠️ Ograniczenie: tylko dla aplikacji używających Expo SDK (nasza używa!)

### Jak udostępnić aplikację przez Expo Go

#### 1. Opublikuj aplikację
```bash
cd mobile

# Zaloguj się (jeśli nie jesteś)
npx expo login

# Opublikuj aktualizację
npx eas update --branch preview --message "Latest changes"
```

#### 2. Udostępnij link lub QR kod

Po publikacji otrzymasz:
- **Link**: `exp://exp.host/@leszekszpunar/slow-spot?release-channel=preview`
- **QR kod**: Wyświetli się w terminalu

#### 3. Testerzy instalują Expo Go

**iOS:**
1. Zainstaluj Expo Go z App Store: https://apps.apple.com/app/expo-go/id982107779
2. Otwórz Expo Go
3. Zeskanuj QR kod KAMERĄ (nie w Expo Go!)
4. Lub otwórz link bezpośrednio

**Android:**
1. Zainstaluj Expo Go z Google Play: https://play.google.com/store/apps/details?id=host.exp.exponent
2. Otwórz Expo Go
3. Zeskanuj QR kod (w Expo Go -> "Scan QR Code")
4. Lub otwórz link bezpośrednio

### Aktualizacje

Każda zmiana w kodzie wymaga ponownej publikacji:

```bash
cd mobile
npx eas update --branch preview --message "Fixed bug X"
```

Testerzy zobaczą aktualizację automatycznie przy następnym uruchomieniu!

### Kanały (Channels)

Możesz mieć różne wersje dla różnych grup testerów:

```bash
# Dla zespołu developerskiego
npx eas update --branch development --message "Dev version"

# Dla testerów wewnętrznych
npx eas update --branch preview --message "Preview version"

# Dla beta testerów
npx eas update --branch beta --message "Beta version"
```

Każdy kanał ma swój własny link i QR kod!

### Obecny status Expo Go

```bash
# Sprawdź czy aplikacja jest opublikowana
npx eas update:list --branch preview

# Zobacz wszystkie kanały
npx eas channel:list
```

### Kiedy NIE używać Expo Go

Expo Go **NIE** działa jeśli:
- Używasz native modułów spoza Expo SDK
- Potrzebujesz custom native code
- Chcesz testować push notifications (wymaga standalone build)
- Chcesz testować in-app purchases

W takich przypadkach użyj EAS Build (patrz poniżej).

### Szybki start - Opublikuj TERAZ

```bash
cd mobile
npx eas update --branch preview --message "Initial preview"
```

Po publikacji wyślij testerom:
1. Link do Expo Go (iOS: App Store, Android: Google Play)
2. QR kod lub link do aplikacji
3. Gotowe!

---

## Wymagania

### 1. Konto Expo
- Zarejestruj się na https://expo.dev
- Zaloguj się: `npx eas-cli login`

### 2. Apple Developer Account (dla iOS)
- Wymagane do budowania iOS: https://developer.apple.com
- Koszt: $99/rok
- Potrzebne do: certyfikatów, provisioning profiles, TestFlight

### 3. Google Play Console (dla Android)
- Wymagane do publikacji: https://play.google.com/console
- Koszt jednorazowy: $25
- Potrzebne do: podpisywania APK, dystrybucji

### 4. Narzędzia
```bash
# Instalacja EAS CLI
npm install -g eas-cli

# Weryfikacja instalacji
eas --version
```

---

## Konfiguracja EAS

### 1. Zaloguj się do EAS
```bash
cd mobile
npx eas-cli login
```

### 2. Skonfiguruj credentials (pierwsze uruchomienie)

**iOS:**
```bash
# EAS automatycznie wygeneruje certyfikaty
eas build:configure
```

**Android:**
```bash
# EAS automatycznie wygeneruje keystore
eas build:configure
```

---

## Budowanie aplikacji

### Profile budowania (z eas.json)

1. **Development** - dla developmentu z Expo Dev Client
2. **Preview** - dla testowania (internal distribution)
3. **Production** - dla sklepów (App Store, Google Play)

### Budowanie wersji testowej (Preview)

**iOS (internal distribution):**
```bash
cd mobile
eas build --platform ios --profile preview
```

Build iOS (`.ipa`) będzie dostępny w:
- Expo Dashboard: https://expo.dev/accounts/leszekszpunar/projects/slow-spot/builds
- Link do pobrania (ważny 30 dni)

**Android (APK):**
```bash
cd mobile
eas build --platform android --profile preview
```

Build Android (`.apk`) będzie dostępny w:
- Expo Dashboard
- Bezpośredni link do pobrania

**Obie platformy jednocześnie:**
```bash
cd mobile
eas build --platform all --profile preview
```

### Czas budowania
- Android APK: ~5-10 minut
- iOS IPA: ~15-20 minut
- Wyświetlany jest progress w terminalu

---

## Dystrybucja na urządzenia testowe

### iOS - Ad Hoc Distribution (Preview)

1. **Zbuduj aplikację:**
   ```bash
   eas build --platform ios --profile preview
   ```

2. **Po zakończeniu buildu, otrzymasz URL:**
   ```
   https://expo.dev/accounts/leszekszpunar/projects/slow-spot/builds/abc123
   ```

3. **Instalacja na iPhone:**
   - Otwórz link na iPhone w Safari
   - Kliknij "Install"
   - Potwierdź instalację profilu
   - Aplikacja pojawi się na ekranie głównym

**Ważne (iOS):**
- Urządzenie musi być zarejestrowane w Apple Developer Portal
- Ad Hoc builds działają tylko na zarejestrowanych urządzeniach (max 100)
- Do zarejestrowania potrzebujesz UDID urządzenia

**Jak znaleźć UDID iPhone:**
```bash
# Podłącz iPhone do komputera
# macOS:
# 1. Otwórz Finder
# 2. Wybierz iPhone z lewego panelu
# 3. Kliknij na numer seryjny - zmieni się na UDID
# 4. Prawy klik > Kopiuj
```

**Dodaj UDID do buildu:**
```bash
# W trakcie pierwszego buildu EAS zapyta o UDID
# Możesz też dodać je później w Expo Dashboard
```

### Android - APK Installation

1. **Zbuduj aplikację:**
   ```bash
   eas build --platform android --profile preview
   ```

2. **Po zakończeniu buildu, otrzymasz URL do APK:**
   ```
   https://expo.dev/accounts/leszekszpunar/projects/slow-spot/builds/def456
   ```

3. **Instalacja na Android:**
   - Otwórz link na telefonie Android
   - Pobierz plik `.apk`
   - Otwórz plik (może wymagać włączenia "Nieznane źródła")
   - Kliknij "Instaluj"

**Ważne (Android):**
- Może wymagać włączenia "Instaluj aplikacje z nieznanych źródeł"
- Ustawienia > Bezpieczeństwo > Nieznane źródła

---

## GitHub Releases

Możesz automatycznie uploadować buildy do GitHub Releases, żeby wszyscy mieli łatwy dostęp.

### 1. Ręczne utworzenie release

```bash
# 1. Zbuduj aplikacje
cd mobile
eas build --platform all --profile preview

# 2. Pobierz linki do buildów z Expo Dashboard

# 3. Utwórz release na GitHub
gh release create v1.0.0-preview \
  --title "Preview Build v1.0.0" \
  --notes "
  ## Preview Build v1.0.0

  ### iOS
  [Download IPA](link-z-expo-dashboard)

  ### Android
  [Download APK](link-z-expo-dashboard)

  ### Changes
  - Feature 1
  - Feature 2
  "
```

### 2. Automatyczne GitHub Actions (opcjonalne)

Możemy stworzyć workflow, który automatycznie buduje i uploaduje do GitHub Releases:

```yaml
# .github/workflows/eas-build.yml
name: EAS Build

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - name: Install dependencies
        run: |
          cd mobile
          npm ci

      - name: Build on EAS
        run: |
          cd mobile
          eas build --platform all --profile preview --non-interactive
```

**Setup:**
1. Wygeneruj token: https://expo.dev/accounts/leszekszpunar/settings/access-tokens
2. Dodaj jako secret `EXPO_TOKEN` w GitHub repo settings

---

## TestFlight (iOS)

TestFlight to oficjalny system Apple do dystrybucji testowych wersji iOS.

### 1. Zbuduj produkcyjną wersję
```bash
cd mobile
eas build --platform ios --profile production
```

### 2. Submit do TestFlight
```bash
cd mobile
eas submit --platform ios --latest
```

### 3. Zaproś testerów
- Wejdź na App Store Connect
- Wybierz aplikację
- TestFlight > Internal Testing / External Testing
- Dodaj testerów (email)
- Testerzy otrzymają link do instalacji

**Limity:**
- Internal Testing: do 100 testerów (członkowie zespołu)
- External Testing: do 10,000 testerów (wymaga review od Apple)

---

## Google Play Internal Testing (Android)

Internal Testing to szybki sposób dystrybucji wersji testowych na Android.

### 1. Zbuduj produkcyjną wersję
```bash
cd mobile
eas build --platform android --profile production
```

### 2. Submit do Google Play
```bash
cd mobile
eas submit --platform android --latest
```

### 3. Skonfiguruj Internal Testing
- Wejdź na Google Play Console
- Wybierz aplikację
- Testing > Internal testing
- Utwórz release
- Upload AAB (zostanie automatycznie przesłany przez `eas submit`)
- Utwórz listę testerów
- Skopiuj link do testowania

### 4. Zaproś testerów
- Wyślij testerom link do dołączenia
- Testerzy klikają link i instalują z Google Play
- Automatyczne aktualizacje przez Play Store

**Limity:**
- Internal Testing: nieograniczona liczba testerów
- Natychmiastowa dostępność (bez review)

---

## Szybki Cheat Sheet

### Testowe buildy (preview)
```bash
# iOS + Android jednocześnie
cd mobile
eas build --platform all --profile preview

# Sprawdź status
eas build:list
```

### Produkcyjne buildy + submit
```bash
# Build + Submit iOS
cd mobile
eas build --platform ios --profile production
eas submit --platform ios --latest

# Build + Submit Android
cd mobile
eas build --platform android --profile production
eas submit --platform android --latest
```

### Sprawdzanie buildów
```bash
# Lista wszystkich buildów
eas build:list

# Szczegóły konkretnego buildu
eas build:view [BUILD_ID]

# Otwórz dashboard w przeglądarce
eas build:list --platform all
```

---

## Koszty

### EAS Build (Expo)
- Free tier: 30 builds/month
- Production tier: $29/month (unlimited builds)
- Priority Medium: szybsze buildy (m-medium resource class)

### Apple Developer
- $99/rok (wymagane dla iOS)

### Google Play
- $25 jednorazowo (wymagane dla Android)

---

## Troubleshooting

### Problem: "No development team found"
```bash
# iOS wymaga Apple Developer Account
# Zaloguj się w Xcode:
# Xcode > Settings > Accounts > Add Apple ID
```

### Problem: "Android keystore not found"
```bash
# EAS automatycznie wygeneruje keystore przy pierwszym buildzie
cd mobile
eas build --platform android --profile preview
```

### Problem: "Build failed - Out of memory"
```bash
# Zwiększ resource class w eas.json:
"ios": {
  "resourceClass": "m-large"  // lub "m-medium"
}
```

### Problem: "Device not registered (iOS)"
```bash
# Dodaj UDID urządzenia w Expo Dashboard:
# https://expo.dev/accounts/leszekszpunar/projects/slow-spot/devices
```

---

## Najlepsze praktyki

1. **Wersjonowanie**: Zawsze zwiększaj `version` w `app.json` przed buildem
2. **Changelog**: Dokumentuj zmiany w każdym buildzie
3. **Testing**: Testuj na prawdziwych urządzeniach przed produkcją
4. **Credentials**: Nigdy nie commituj credentials do Git
5. **Buildy Preview**: Używaj do internal testing przed produkcją
6. **GitHub Releases**: Publikuj preview builds dla zespołu
7. **TestFlight/Internal Testing**: Używaj do wider testing przed production

---

## Przydatne linki

- **EAS Build Documentation**: https://docs.expo.dev/build/introduction/
- **EAS Submit Documentation**: https://docs.expo.dev/submit/introduction/
- **Expo Dashboard**: https://expo.dev/accounts/leszekszpunar/projects/slow-spot
- **Apple Developer**: https://developer.apple.com
- **Google Play Console**: https://play.google.com/console
- **TestFlight**: https://developer.apple.com/testflight/

---

## Kontakt

W razie problemów:
- Slack: `#slow-spot-dev`
- Email: leszek@iteon.pl
- Issues: https://github.com/Slow-Spot/app/issues

---

**Wersja:** 1.0
**Data:** 2025-11-14
**Autor:** Leszek Szpunar + Claude Code

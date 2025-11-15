# 🚀 Deployment Pipelines - Slow Spot App

## Przygotowane rozwiązania do publikacji testowej

Stworzyłem **3 automatyczne pipelines**, które obsługują różne scenariusze testowania i deploymentu.

---

## 📋 Opcje publikacji (od najszybszej do najpełniejszej)

### 1. **EAS Update (OTA) - NAJSZYBSZA** ⚡
**Czas: ~2-5 minut | Koszt: DARMOWE**

✅ Idealna do:
- Szybkich testów UI/UX
- Zmian w kodzie JS/TS (bez zmian native)
- Iteracyjnego testowania z zespołem

**Jak działa:**
- Push na branch `develop` lub `test` → automatyczna aktualizacja OTA
- Testerzy z Expo Go dostają update automatycznie
- Bez rebuildu aplikacji!

**Setup dla testerów:**
1. Zainstaluj Expo Go ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
2. Otwórz link: `exp://@leszekszpunar/slow-spot`
3. Gotowe! Każdy push dostaje automatycznie

**Ręcznie:**
```bash
cd mobile
eas update --branch preview --message "Nowe zmiany"
```

---

### 2. **EAS Preview Build - REKOMENDOWANA** 🎯
**Czas: ~15-20 minut | Koszt: DARMOWE (30 builds/miesiąc)**

✅ Idealna do:
- Testowania na prawdziwych urządzeniach Android
- Sprawdzania native features (push notifications, in-app purchases)
- Udostępniania zewnętrznym testerom

⚠️ **Uwaga:** Preview builds generują tylko **Android APK**. Dla iOS potrzebne jest Apple Developer account ($99/rok).

**Jak działa:**
- Push na branch `develop`, `test`, `feature/*`, `claude/*` → automatyczny build
- Generuje APK (Android)
- Link do pobrania dostępny w ~15 minut

**Automatycznie:**
1. Push na branch testowy
2. GitHub Actions automatycznie buduje
3. Sprawdź status: https://expo.dev/accounts/leszekszpunar/projects/slow-spot/builds
4. Pobierz APK/IPA i wyślij testerom

**Ręcznie:**
```bash
cd mobile

# Android APK (darmowe, bez płatnego konta)
eas build --platform android --profile preview

# iOS (wymaga Apple Developer account $99/rok)
# eas build --platform ios --profile preview
```

**Udostępnianie testerom:**
- **Android**: Wyślij link do APK (bezpośrednia instalacja - działa od razu!)
- **iOS**: Wymaga Apple Developer account + TestFlight/AdHoc distribution

---

### 3. **EAS Production Build** 🏆
**Czas: ~20-30 minut | Koszt: DARMOWE (build) + Apple $99/rok, Google $25**

✅ Idealna do:
- Publikacji w App Store / Google Play
- Wersji finalnych przed release
- Internal Testing w stores

**Jak działa:**
- Stwórz tag `v1.0.0` → automatyczny production build
- Opcjonalnie auto-submit do stores
- Gotowa do publikacji

**Automatycznie:**
```bash
git tag v1.0.0
git push origin v1.0.0
# Automatyczny build + opcjonalnie submit do stores
```

**Ręcznie:**
```bash
cd mobile
eas build --platform all --profile production --auto-submit
```

---

## 🔧 Setup (jednorazowy, 5 minut)

### Krok 1: Zaloguj się do Expo
```bash
cd mobile
npx expo login
```

### Krok 2: Dodaj EXPO_TOKEN do GitHub Secrets

1. Wygeneruj token:
```bash
npx expo token:create
```

2. Skopiuj wygenerowany token

3. Dodaj do GitHub:
   - Idź do: `Settings` → `Secrets and variables` → `Actions`
   - Kliknij `New repository secret`
   - Name: `EXPO_TOKEN`
   - Value: [wklej token]
   - Kliknij `Add secret`

### Krok 3: ⚠️ WYMAGANE - Setup Android Keystore (jednorazowy!)

**Przed pierwszym automatycznym buildem musisz wygenerować Android keystore:**

**Opcja A - Automatyczny script (najłatwiejszy):**
```bash
cd mobile
../scripts/setup-android-keystore.sh
```

**Opcja B - Ręcznie (przez build):**
```bash
cd mobile
eas build --platform android --profile preview
# Gdy zapyta "Generate new keystore?" → YES
```

**Opcja C - Ręcznie (tylko keystore, szybkie):**
```bash
cd mobile
eas credentials
# Wybierz: Android → Set up new keystore → Generate
```

📖 **Szczegóły:** Zobacz `FIRST_TIME_SETUP.md` dla pełnej instrukcji

⚠️ **To jest wymagane!** Bez tego GitHub Actions buildy będą failować z błędem "Generating a new Keystore is not supported in --non-interactive mode"

✅ **Po setupie:** Wszystkie kolejne buildy przez GitHub Actions będą działać automatycznie!

### Krok 4: (Opcjonalnie) Skonfiguruj Apple/Google credentials

**Dla iOS (TestFlight):**
```bash
cd mobile
eas credentials
# Wybierz iOS → Set up Apple credentials
```

**Dla Android (Google Play):**
```bash
cd mobile
eas credentials
# Wybierz Android → Set up Google Service Account
```

---

## 📱 Praktyczne scenariusze

### Scenariusz 1: Szybkie testy z zespołem (dzisiaj!)
```bash
# 1. Push zmiany na develop
git checkout develop
git add .
git commit -m "feat: nowa funkcja"
git push

# 2. GitHub Actions automatycznie:
#    - Publikuje OTA update
#    - Testerzy z Expo Go dostają update w ~2 min
```

### Scenariusz 2: Testy z zewnętrznymi testerami (jutro)
```bash
# 1. Push na branch testowy
git checkout test
git merge develop
git push

# 2. GitHub Actions automatycznie buduje APK/IPA (~15 min)
# 3. Pobierz z https://expo.dev/accounts/leszekszpunar/projects/slow-spot/builds
# 4. Wyślij link testerom
```

### Scenariusz 3: Publikacja do TestFlight
```bash
# 1. Zrób tag
git tag v1.0.0-beta.1
git push origin v1.0.0-beta.1

# 2. Automatyczny production build
# 3. Ręcznie submit do TestFlight:
cd mobile
eas submit --platform ios --latest
```

---

## 🎮 Manual Control (workflow_dispatch)

Możesz też wywołać buildy ręcznie przez GitHub UI:

1. Idź do `Actions` tab na GitHubie
2. Wybierz workflow (np. "EAS Preview Build")
3. Kliknij `Run workflow`
4. Wybierz platformę (iOS/Android/All)
5. Kliknij zielony `Run workflow`

![GitHub Workflow Dispatch](https://docs.github.com/assets/cb-33363/mw-1440/images/help/actions/workflow-dispatch.webp)

---

## 💰 Koszty i limity

| Metoda | Czas | Koszt | Limit |
|--------|------|-------|-------|
| **EAS Update (OTA)** | 2-5 min | DARMOWE | Unlimited |
| **EAS Preview Build** | 15-20 min | DARMOWE | 30 builds/miesiąc |
| **EAS Production Build** | 20-30 min | DARMOWE | 30 builds/miesiąc |
| **TestFlight (iOS)** | + 5-10 min | $99/rok (Apple Developer) | 10k testerów |
| **Google Play Internal** | + 5 min | $25 jednorazowo | 100 testerów |

---

## 🚨 Troubleshooting

### Build fails: "Generating a new Keystore is not supported in --non-interactive mode"

**To jest NORMALNY błąd przy pierwszym buildzie!**

**Rozwiązanie:** Musisz raz wygenerować Android keystore ręcznie (jednorazowy setup):

```bash
cd mobile
eas build --platform android --profile preview
# Gdy zapyta "Generate new keystore?" → YES
```

**Alternatywnie (szybsze, bez buildu):**
```bash
cd mobile
eas credentials
# Wybierz: Android → Set up new keystore → Generate
```

📖 **Pełna instrukcja:** `FIRST_TIME_SETUP.md`

✅ **Po tym setupie wszystkie GitHub Actions buildy będą działać automatycznie!**

### Build fails: "Missing EXPO_TOKEN"
```bash
# Sprawdź czy secret istnieje
gh secret list

# Dodaj jeśli nie ma
npx expo token:create
gh secret set EXPO_TOKEN
```

### Build fails: "Invalid credentials"
```bash
cd mobile
eas credentials
# Re-configure credentials
```

### OTA update nie działa
```bash
# Wyczyść cache i spróbuj ponownie
cd mobile
eas update --branch preview --clear
```

### "This app requires a development build"
- Expo Go nie wspiera New Architecture (które używasz)
- **Rozwiązanie 1**: Użyj Preview Build (rekomendowane)
- **Rozwiązanie 2**: Tymczasowo wyłącz `newArchEnabled` w `app.json`

---

## 📊 Monitorowanie buildów

### Expo Dashboard
https://expo.dev/accounts/leszekszpunar/projects/slow-spot/builds

Tutaj zobaczysz:
- ✅ Status wszystkich buildów
- 📦 Download links (APK/IPA)
- 📱 QR codes do Expo Go
- 📈 Statystyki użycia

### GitHub Actions
https://github.com/Slow-Spot/app/actions

Tutaj zobaczysz:
- 🔄 Status workflow runs
- 📝 Build logs
- ❌ Error messages

---

## 🎯 Rekomendacja dla Ciebie

**Rozpocznij od EAS Update (OTA):**
```bash
# Push na develop i testuj przez Expo Go
git checkout develop
git add .
git commit -m "feat: nowa funkcja"
git push
# → Automatyczna aktualizacja w 2 minuty!
```

**Gdy potrzebujesz udostępnić innym:**
```bash
# Push na test i pobierz APK
git checkout test
git merge develop
git push
# → Automatyczny build w 15 minut
# → Pobierz z expo.dev i wyślij link
```

**Przed publikacją:**
```bash
# Tag i automatic production build
git tag v1.0.0
git push origin v1.0.0
# → Production build + optional submit
```

---

## 🔗 Przydatne linki

- **Expo Dashboard**: https://expo.dev/accounts/leszekszpunar/projects/slow-spot
- **GitHub Actions**: https://github.com/Slow-Spot/app/actions
- **EAS Docs**: https://docs.expo.dev/eas/
- **TestFlight**: https://developer.apple.com/testflight/
- **Google Play Console**: https://play.google.com/console

---

## ❓ FAQ

**Q: Mogę hostować buildy na własnym serwerze?**
A: Tak! Po zbudowaniu przez EAS, pobierz APK/IPA i hostuj gdzie chcesz (S3, własny serwer, etc).

**Q: Czy mogę wyłączyć automatyczne buildy?**
A: Tak, usuń/zmodyfikuj `.github/workflows/*.yml` lub użyj `workflow_dispatch` (manual trigger).

**Q: Co jeśli nie mam Apple Developer account?**
A: Możesz budować IPA przez EAS i dystrybuować AdHoc (do 100 devices bez TestFlight).

**Q: Jak dodać więcej testerów?**
A:
- Expo Go: Wyślij link `exp://@leszekszpunar/slow-spot`
- TestFlight: Dodaj w App Store Connect
- Google Play: Dodaj w Play Console → Internal Testing

---

## 📞 Support

Masz pytania? Sprawdź:
- Mobile app guide: `mobile/DEPLOYMENT.md`
- Build guide: `BUILD_AND_DEPLOY.md`
- Expo docs: https://docs.expo.dev

---

**Przygotowane! 🎉**

Wszystko jest skonfigurowane i gotowe do użycia. Po prostu:
1. Ustaw `EXPO_TOKEN` w GitHub Secrets
2. Push na `develop` lub `test`
3. Obserwuj automatyczne buildy! 🚀

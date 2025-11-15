# 🔐 Pierwszy Setup - WYMAGANY!

## Problem: "Generating a new Keystore is not supported in --non-interactive mode"

To **normalny błąd przy pierwszym buildzie**! GitHub Actions nie może wygenerować Android keystore (certyfikatu podpisywania) w trybie automatycznym.

**Rozwiązanie:** Musisz raz ręcznie wygenerować keystore. Potem wszystko będzie działać automatycznie! ✅

---

## 🚀 Quick Start (2 opcje)

### Opcja A: Automatyczny Script (NAJŁATWIEJSZY) ⭐

```bash
cd mobile
chmod +x ../scripts/setup-android-keystore.sh
../scripts/setup-android-keystore.sh
```

Script przeprowadzi Cię przez proces i wygeneruje keystore.

---

### Opcja B: Ręcznie (Opcja 1 - przez build)

**Najszybszy sposób - generuje keystore i robi pierwszy build jednocześnie:**

```bash
cd mobile
eas build --platform android --profile preview
```

Gdy zapyta: **"Generate a new Android Keystore?"** → wybierz **`Yes`**

**To zajmie ~15-20 minut**, ale:
- ✅ Wygeneruje keystore
- ✅ Zapisze go na Expo servers
- ✅ Zbuduje pierwszą wersję APK
- ✅ **Wszystkie kolejne buildy przez GitHub Actions będą działać automatycznie!**

---

### Opcja B: Ręcznie (Opcja 2 - tylko keystore, bez buildu)

**Szybsza opcja - tylko generuje keystore (~30 sekund):**

```bash
cd mobile
eas credentials
```

**W menu wybierz:**
1. **Android** (strzałka w dół → Enter)
2. **Keystore: Set up a new keystore**
3. **Generate new keystore**
4. Poczekaj ~30 sekund
5. Gotowe! ✅

Potem GitHub Actions automatyczne buildy będą działać od razu.

---

## 📊 Co się dzieje?

### Dlaczego potrzebujesz keystore?

**Android wymaga podpisywania APK** przed instalacją. Keystore to cyfrowy certyfikat używany do podpisywania Twojej aplikacji.

### Gdzie jest przechowywany keystore?

- ☁️ **Expo Cloud** - bezpiecznie przechowywany na serwerach Expo
- 🔒 **Zaszyfrowany** - tylko Ty masz do niego dostęp
- ♻️ **Reużywalny** - GitHub Actions używa tego samego keystore dla wszystkich buildów

### Co się stanie po setupie?

```
1. Keystore wygenerowany ✅
2. Upload do Expo Cloud ✅
3. GitHub Actions może teraz używać keystore automatycznie ✅
4. Każdy push → automatyczny build! 🚀
```

---

## ✅ Weryfikacja setupu

**Sprawdź czy keystore został wygenerowany:**

```bash
cd mobile
eas credentials

# W menu zobaczysz:
# Android credentials
#   Keystore
#     > View details and download
```

Jeśli widzisz keystore - **wszystko OK!** 🎉

---

## 🎯 Po setupie - automatyczne buildy!

Po setupie keystore, **wszystko działa automatycznie:**

```bash
# Push na develop/test/feature/claude branch
git add .
git commit -m "test: automatic build"
git push

# → GitHub Actions automatycznie zbuduje APK!
# → Sprawdź: https://github.com/Slow-Spot/app/actions
# → Pobierz APK: https://expo.dev/accounts/leszekszpunar/projects/slow-spot/builds
```

---

## 🚨 Troubleshooting

### "eas command not found"
```bash
npm install -g eas-cli
# lub
npx eas build --platform android --profile preview
```

### "Not logged in to Expo"
```bash
npx expo login
# Wpisz email i hasło
```

### "Invalid project root"
```bash
# Upewnij się że jesteś w mobile/ directory
cd mobile
pwd  # Powinno pokazać: .../Slow Spot APP/mobile
```

### Build fails z innym błędem
```bash
# Spróbuj ponownie z --clear-cache
cd mobile
eas build --platform android --profile preview --clear-cache
```

---

## 📖 Więcej informacji

- **EAS Credentials**: https://docs.expo.dev/app-signing/app-credentials/
- **Android Keystores**: https://docs.expo.dev/app-signing/local-credentials/#android-credentials
- **Główna dokumentacja**: `DEPLOYMENT_PIPELINES.md`

---

## ⏱️ Ile to trwa?

| Metoda | Czas | Rezultat |
|--------|------|----------|
| **Opcja B2** (tylko keystore) | ~30 sekund | Keystore wygenerowany, brak APK |
| **Opcja B1** (build) | ~15-20 minut | Keystore + pierwszy APK gotowy |
| **Script** | Zależnie od wyboru | Guided setup |

---

## 💡 Rekomendacja

**Dla niecierpliwych:**
```bash
cd mobile
eas credentials
# Android → Set up new keystore → Generate
```
✅ 30 sekund, GitHub Actions działa od razu

**Dla cierpliwych:**
```bash
cd mobile
eas build --platform android --profile preview
```
✅ 15-20 minut, ale dostajesz też pierwszy APK do testowania

---

## ❓ FAQ

**Q: Czy muszę to robić dla każdego buildu?**
A: **NIE!** Tylko raz. Keystore jest zapisywany i używany automatycznie.

**Q: Co jeśli zgubię keystore?**
A: Jest bezpiecznie przechowywany na Expo Cloud. Możesz go pobrać przez `eas credentials`.

**Q: Czy mogę używać własnego keystore?**
A: Tak, ale dla testów polecam wygenerować przez EAS (prostsze).

**Q: Dlaczego GitHub Actions nie może tego zrobić automatycznie?**
A: Z bezpieczeństwa - generowanie keystore wymaga interaktywnej konfirmacji.

---

**Gotowy? Wykonaj setup i wszystko będzie działać automatycznie!** 🚀

```bash
cd mobile
../scripts/setup-android-keystore.sh
```

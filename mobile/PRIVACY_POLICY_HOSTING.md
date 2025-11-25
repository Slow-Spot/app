# 🌐 Privacy Policy Hosting Guide

## Quick Overview

Musisz zhostować plik `privacy-policy.html` na publicznym URL przed wysłaniem do App Store/Google Play.

## Opcja 1: GitHub Pages (NAJŁATWIEJSZA) ⭐

### Krok 1: Utwórz nowe repozytorium
```bash
# Lokalnie
cd /Users/leszekszpunar/1.\ Work/1.\ ITEON/1.\ Projekty/Slow\ Spot\ APP
mkdir slowspot-privacy
cd slowspot-privacy
git init
```

### Krok 2: Skopiuj plik HTML
```bash
cp ../mobile/privacy-policy.html index.html
git add index.html
git commit -m "Add privacy policy"
```

### Krok 3: Utwórz repo na GitHub
1. Idź do: https://github.com/new
2. Nazwa: `slowspot-privacy`
3. Public
4. Create repository

### Krok 4: Push
```bash
git remote add origin https://github.com/YOUR_USERNAME/slowspot-privacy.git
git branch -M main
git push -u origin main
```

### Krok 5: Włącz GitHub Pages
1. Settings → Pages
2. Source: Deploy from branch
3. Branch: main, folder: / (root)
4. Save

### Krok 6: Twój URL
```
https://YOUR_USERNAME.github.io/slowspot-privacy/
```

**Czas:** 5 minut
**Koszt:** Darmowe
**SSL:** Automatyczne HTTPS ✅

---

## Opcja 2: Netlify (BARDZO ŁATWE)

### Krok 1: Drop & Deploy
1. Idź do: https://app.netlify.com/drop
2. Przeciągnij folder z `privacy-policy.html` (zmień nazwę na index.html)
3. Gotowe!

### Twój URL:
```
https://random-name-123456.netlify.app/
```

**Możesz:**
- Zmienić nazwę subdomain (Settings → Domain management)
- Dodać własną domenę

**Czas:** 1 minuta
**Koszt:** Darmowe
**SSL:** Automatyczne HTTPS ✅

---

## Opcja 3: Firebase Hosting

### Krok 1: Install Firebase CLI
```bash
npm install -g firebase-tools
firebase login
```

### Krok 2: Initialize
```bash
mkdir slowspot-privacy
cd slowspot-privacy
firebase init hosting

# Wybierz:
# - Create new project
# - Public directory: public
# - Single-page app: No
# - Automatic builds: No
```

### Krok 3: Deploy
```bash
cp ../mobile/privacy-policy.html public/index.html
firebase deploy
```

### Twój URL:
```
https://slowspot-privacy.web.app/
lub
https://slowspot-privacy.firebaseapp.com/
```

**Czas:** 10 minut
**Koszt:** Darmowe (Spark Plan)
**SSL:** Automatyczne HTTPS ✅

---

## Opcja 4: Vercel

### Krok 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Krok 2: Deploy
```bash
mkdir slowspot-privacy
cd slowspot-privacy
cp ../mobile/privacy-policy.html index.html
vercel

# Odpowiedz na pytania
```

### Twój URL:
```
https://slowspot-privacy.vercel.app/
```

**Czas:** 5 minut
**Koszt:** Darmowe
**SSL:** Automatyczne HTTPS ✅

---

## Opcja 5: Własny Serwer / Hosting

Jeśli masz już hosting lub domenę:

### Upload via FTP/SFTP:
```
slowspot.app/privacy-policy.html
```

### Lub subdomain:
```
privacy.slowspot.app
```

**Wymagania:**
- ✅ HTTPS (wymagane!)
- ✅ Accessible z mobile devices
- ✅ Nie wymaga logowania

---

## Po zhostowaniu

### Krok 1: Zweryfikuj URL
Otwórz w przeglądarce i sprawdź:
- [ ] Strona się ładuje
- [ ] HTTPS działa (zielona kłódka)
- [ ] Działa na mobile
- [ ] Nie ma błędów

### Krok 2: Dodaj URL do app.json

```bash
cd /Users/leszekszpunar/1.\ Work/1.\ ITEON/1.\ Projekty/Slow\ Spot\ APP/mobile
```

Edytuj `app.json`:

```json
{
  "expo": {
    "privacy": "public",
    "privacyPolicyUrl": "https://YOUR_URL_HERE/privacy-policy.html",
    "ios": {
      "infoPlist": {
        "NSUserTrackingUsageDescription": "..."
      }
    },
    "android": {
      "permissions": [...],
      "privacyPolicyUrl": "https://YOUR_URL_HERE/privacy-policy.html"
    }
  }
}
```

### Krok 3: Test
```bash
npm start
# Sprawdź czy Privacy Policy link działa w app
```

---

## Recommended: GitHub Pages

**Dlaczego?**
✅ Darmowe
✅ Nie wygasa
✅ GitHub = zaufane źródło
✅ Git versioning (historia zmian)
✅ Łatwe aktualizacje (git push)
✅ HTTPS automatycznie
✅ Nie wymaga karty kredytowej

**Przykład URL:**
```
https://leszekszpunar.github.io/slowspot-privacy/
lub
https://slowspot.github.io/privacy/
```

---

## Alternatywa: Google Drive (NIE POLECAM)

**Nie używaj:**
- Google Drive public links (brak custom URL)
- Dropbox public folders (deprecated)
- Pastebin (nie profesjonalne)
- Medium/Blog posts (nie są dedykowane privacy policies)

**Dlaczego?**
- App Store/Google Play preferują dedykowane privacy policy URLs
- Muszą być HTTPS
- Muszą być stable (nie znikać)

---

## Status Check

Po hostowaniu:

```bash
# Test HTTPS
curl -I https://YOUR_URL_HERE/privacy-policy.html

# Powinno zwrócić:
# HTTP/2 200
# content-type: text/html
```

---

## Następne kroki

1. ✅ Zhostuj privacy-policy.html
2. ✅ Zweryfikuj URL działa
3. ✅ Dodaj URL do app.json
4. ✅ Commit i push
5. ✅ Gotowe do submission!

**Help:** Jeśli masz problem, ping me!

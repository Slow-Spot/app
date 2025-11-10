# 🧪 Slow Spot - Instrukcja Testowania

## ✅ Status Aplikacji

**Backend API**: ✅ DZIAŁA (http://localhost:5019)
**Metro Bundler**: ✅ DZIAŁA (http://localhost:8081)
**iOS Projekt**: ✅ ZBUDOWANY (`mobile/ios/`)

---

## 📱 Jak Uruchomić Aplikację na iOS

### Metoda 1: Expo Development Build (POLECANA)

Metro Bundler już działa! Wystarczy otworzyć aplikację w symulatorze.

#### Krok 1: Upewnij się, że Metro działa
```bash
# Jeśli Metro nie działa, uruchom:
cd "/Users/leszekszpunar/1. Work/1. ITEON/1. Projekty/Slow Spot APP/mobile"
npx expo start
```

#### Krok 2: Otwórz symulator iOS
```bash
open -a Simulator
```

#### Krok 3: W terminalu z Metro, naciśnij klawisz:
- `i` - otworzy aplikację na iOS symulatorze
- `shift+i` - wybierz konkretny symulator

#### Krok 4: Poczekaj na bundling
Expo zbuduje bundle JavaScript i otworzy aplikację automatycznie.

---

### Metoda 2: Bezpośrednie Otwarcie w Xcode

Jeśli Metoda 1 nie zadziała, możesz zbudować aplikację bezpośrednio w Xcode:

1. Otwórz projekt w Xcode:
```bash
open "/Users/leszekszpunar/1. Work/1. ITEON/1. Projekty/Slow Spot APP/mobile/ios/mobile.xcworkspace"
```

2. W Xcode:
   - Wybierz symulator z menu (góra ekranu, obok przycisku Play)
   - Wybierz "iPhone 16 Pro" lub inny dostępny symulator
   - Naciśnij `⌘+R` lub przycisk ▶️ (Play)

3. Upewnij się, że Metro Bundler działa:
```bash
cd "/Users/leszekszpunar/1. Work/1. ITEON/1. Projekty/Slow Spot APP/mobile"
npx expo start
```

---

### Metoda 3: Expo Go na Fizycznym iPhone (DEV ONLY)

**UWAGA**: Ta metoda NIE ZADZIAŁA dla tego projektu, ponieważ używamy custom native modules (Tamagui). Wymagany jest development build.

---

## 🔧 Rozwiązywanie Problemów

### Problem: "Unable to find a destination matching the provided destination specifier"
**Przyczyna**: Xcode nie może znaleźć symulatora
**Rozwiązanie**:
```bash
# Lista dostępnych symulatorów
xcrun simctl list devices | grep iPhone

# Uruchom konkretny symulator
open -a Simulator

# Wybierz symulator w Xcode: Product > Destination > iPhone 16 Pro
```

### Problem: Metro nie startuje
**Rozwiązanie**:
```bash
# Zabij proces na porcie 8081
lsof -ti:8081 | xargs kill -9

# Wyczyść cache i uruchom
cd "/Users/leszekszpunar/1. Work/1. ITEON/1. Projekty/Slow Spot APP/mobile"
npx expo start --clear
```

### Problem: "xcodebuild exited with error code 70"
**Przyczyna**: Xcode build config issue
**Rozwiązanie**: Użyj Metody 2 (bezpośrednie otwarcie w Xcode)

### Problem: Aplikacja się otwiera ale pokazuje error screen
**Przyczyna**: Backend API nie działa
**Rozwiązanie**:
```bash
# Sprawdź czy backend działa
curl http://localhost:5019/health

# Jeśli nie, uruchom backend
cd "/Users/leszekszpunar/1. Work/1. ITEON/1. Projekty/Slow Spot APP/backend/SlowSpot.Api"
dotnet run
```

---

## ✅ Testowanie Backend API

Backend już działa na http://localhost:5019! Możesz przetestować endpointy:

### Health Check
```bash
curl http://localhost:5019/health
```

### Cytaty (Quotes)
```bash
# Losowy cytat (angielski)
curl "http://localhost:5019/api/quotes/random?lang=en"

# Losowy cytat (polski)
curl "http://localhost:5019/api/quotes/random?lang=pl"

# Wszystkie cytaty
curl http://localhost:5019/api/quotes
```

### Sesje Medytacji
```bash
# Lista sesji (angielski)
curl "http://localhost:5019/api/sessions?lang=en"

# Lista sesji (polski)
curl "http://localhost:5019/api/sessions?lang=pl"

# Konkretna sesja
curl http://localhost:5019/api/sessions/1
```

### Swagger UI
Otwórz w przeglądarce:
```
http://localhost:5019/swagger
```

---

## 🧪 Checklist Testów Mobile App

Po uruchomieniu aplikacji, przetestuj:

### 1. Home Screen (🏠)
- [ ] Tagline "Find your moment of peace" się wyświetla
- [ ] Dzienny cytat się ładuje z backendu
- [ ] Autor cytatu się wyświetla (jeśli istnieje)
- [ ] Przycisk "Start Meditation" otwiera ekran Meditation
- [ ] Przycisk "Explore Quotes" otwiera ekran Quotes

### 2. Meditation Screen (🧘)
- [ ] Lista sesji medytacji się ładuje
- [ ] Karty sesji pokazują: tytuł, opis, czas, poziom
- [ ] Można wybrać sesję (tap na kartę)
- [ ] Timer pokazuje prawidłowy czas
- [ ] Play button uruchamia timer
- [ ] Pause działa poprawnie
- [ ] Circular progress bar się animuje
- [ ] Timer odlicza do 0:00
- [ ] Po osiągnięciu 0:00 pokazuje "Complete!"

### 3. Quotes Screen (💭)
- [ ] Cytaty się wyświetlają
- [ ] Tekst cytatu jest czytelny
- [ ] Autor się wyświetla (jeśli istnieje)
- [ ] Kategoria (badge) się wyświetla
- [ ] Previous button działa
- [ ] Next button działa
- [ ] Random quote button ładuje nowy cytat

### 4. Settings Screen (⚙️)
- [ ] Wszystkie 6 języków są dostępne:
  - [ ] English
  - [ ] Polski
  - [ ] Español
  - [ ] Deutsch
  - [ ] Français
  - [ ] हिन्दी
- [ ] Zmiana języka od razu zmienia teksty w UI
- [ ] Theme Toggle (Light/Dark) jest widoczny
- [ ] About section wyświetla się poprawnie

### 5. Bottom Navigation
- [ ] Wszystkie 4 przyciski są widoczne
- [ ] Aktywny tab ma inny kolor (highlight)
- [ ] Nawigacja między ekranami działa płynnie
- [ ] Emoji ikony są czytelne (🏠 🧘 💭 ⚙️)

### 6. API Integration
- [ ] Dane cytaty ładują się z http://localhost:5019
- [ ] Dane sesji ładują się z backendu
- [ ] Loading states wyświetlają się podczas ładowania
- [ ] Cache działa (drugi load jest szybszy)

### 7. Offline Mode
```bash
# Wyłącz backend
# Następnie przetestuj aplikację

# Sprawdź:
- [ ] Pokazuje cached cytaty
- [ ] Pokazuje cached sesje
- [ ] Nie crashuje gdy API nie odpowiada
```

### 8. Multi-język
Przetestuj każdy język:
```bash
# W Settings, zmień język na:
- [ ] English - sprawdź wszystkie ekrany
- [ ] Polski - sprawdź wszystkie ekrany
- [ ] Español - sprawdź wszystkie ekrany
- [ ] Deutsch - sprawdź wszystkie ekrany
- [ ] Français - sprawdź wszystkie ekrany
- [ ] हिन्दी - sprawdź wszystkie ekrany
```

---

## 📊 Obecnie Uruchomione Serwisy

### Backend API
```
URL: http://localhost:5019
Status: ✅ RUNNING
Health: http://localhost:5019/health
Swagger: http://localhost:5019/swagger
```

### Metro Bundler
```
URL: http://localhost:8081
Status: ✅ RUNNING
Check: curl http://localhost:8081/status
```

### iOS Build
```
Location: mobile/ios/mobile.xcworkspace
Status: ✅ READY
CocoaPods: ✅ INSTALLED
```

---

## 🎯 Known Issues

1. **TypeScript Warnings**: Tamagui `size` prop na Text - nie blokuje działania
2. **Xcodebuild Error 70**: Używaj Xcode GUI zamiast CLI
3. **Simulator UUID Issues**: Xcode czasami nie rozpoznaje UUID - używaj nazw
4. **First Build Slow**: Pierwsze uruchomienie może trwać 2-3 minuty (bundling)

---

## 🚀 Quick Start (TL;DR)

```bash
# Terminal 1: Upewnij się że backend działa
curl http://localhost:5019/health

# Terminal 2: Upewnij się że Metro działa
curl http://localhost:8081/status

# Otwórz Simulator
open -a Simulator

# W terminalu z Metro, naciśnij 'i'
# LUB
# Otwórz Xcode i naciśnij Play
open "/Users/leszekszpunar/1. Work/1. ITEON/1. Projekty/Slow Spot APP/mobile/ios/mobile.xcworkspace"
```

---

## 💡 Tips

1. **Szybkie Przeładowanie**: W aplikacji naciśnij `⌘+R` aby przeładować
2. **Debug Menu**: W aplikacji naciśnij `⌘+D` aby otworzyć dev menu
3. **Console Logs**: W terminalu z Metro zobaczysz wszystkie console.log()
4. **Network Inspect**: Chrome DevTools - Remote JS Debugging

---

**Powodzenia w testowaniu! 🚀**

Jeśli masz problemy, sprawdź sekcję "Rozwiązywanie Problemów" powyżej.

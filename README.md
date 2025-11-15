# Slow Spot - Meditation & Mindfulness App

**Unikatowa aplikacja do medytacji z naciskiem na prostotę, wielojęzyczność i prywatność.**

## 🚀 Try It Now - Test on Your Phone!

<div align="center">

### 📱 Scan QR Code to Test

<table>
<tr>
<td align="center">
<b>Direct Link (Expo Go)</b><br/>
<img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=exp%3A%2F%2Fu.expo.dev%2F2b3ebb2e-60e7-4355-922a-db729c41792d" alt="QR Code Direct" width="200"/>
<br/>
<sup>Scan in Expo Go app</sup>
</td>
<td align="center">
<b>Web Link (Recommended)</b><br/>
<img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https%3A%2F%2Fexpo.dev%2F%40leszekszpunar%2Fslow-spot" alt="QR Code Web" width="200"/>
<br/>
<sup>Scan with camera</sup>
</td>
</tr>
</table>

### Quick Start

**Step 1:** Install Expo Go
- [📱 iOS (App Store)](https://apps.apple.com/app/expo-go/id982107779)
- [🤖 Android (Google Play)](https://play.google.com/store/apps/details?id=host.exp.exponent)

**Step 2:** Scan QR code above OR open link:
- 🔗 **Web**: [https://expo.dev/@leszekszpunar/slow-spot](https://expo.dev/@leszekszpunar/slow-spot)
- 📱 **Direct**: `exp://u.expo.dev/2b3ebb2e-60e7-4355-922a-db729c41792d?channel-name=preview`

**Step 3:** App opens automatically! ✨

---

📖 **Documentation**: [Testing Guide](./TESTING_GUIDE.md) | [QR Codes](./QR_CODE.md)

</div>

---

## 🎯 O Projekcie

Slow Spot to wieloplatformowa aplikacja do medytacji, która wyróżnia się:
- **Brakiem logowania** - pełna prywatność użytkownika (GDPR compliant)
- **Offline-first** - działanie bez internetu
- **Wielojęzycznością** - pełne wsparcie dla 6 języków (PL, EN, ES, DE, FR, HI)
- **Audio-first experience** - medytacja "bez ekranu"
- **Minimalistycznym UX** - zero rozproszeń
- **Niskimi kosztami** - $6/miesiąc dla MVP

## 📁 Struktura Projektu

```
slow-spot-app/
├── mobile/          # Expo/React Native app (iOS + Android)
├── web/             # Next.js landing page
├── backend/         # .NET Core 8 REST API
├── architecture/    # Pełna dokumentacja architektury
└── README.md        # Ten plik
```

## 🚀 Technologie

### Frontend Mobile
- **Framework:** Expo SDK 50 + React Native
- **UI Library:** Tamagui (performance-focused)
- **Audio:** Expo AV
- **i18n:** react-i18next
- **Storage:** SQLite (offline-first)

### Frontend Web
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Hosting:** Vercel

### Backend
- **Framework:** .NET Core 8 (Minimal APIs)
- **Database:** PostgreSQL 15
- **Cache:** Redis 7
- **Hosting:** Railway

### Infrastructure
- **CDN:** Cloudflare R2 + CDN (audio delivery)
- **Monitoring:** Sentry + PostHog
- **CI/CD:** GitHub Actions

## 📋 Wymagania

- **Node.js:** >= 20.0.0
- **.NET SDK:** >= 8.0
- **Docker:** >= 24.0 (dla lokalnej bazy danych)
- **Expo CLI:** Latest

## 🏗️ Instalacja i Uruchomienie

### 1. Backend API

```bash
cd backend
dotnet restore
dotnet run
# API dostępne na: http://localhost:5000
```

### 2. Mobile App

```bash
cd mobile
npm install
npx expo start
# Skanuj QR code w Expo Go
```

### 3. Landing Page

```bash
cd web
npm install
npm run dev
# Otwórz: http://localhost:3000
```

## 📖 Dokumentacja

### 🚀 Quick Start & Testing
- **[EXPO_GO_TESTING.md](./mobile/EXPO_GO_TESTING.md)** - Testowanie przez Expo Go (0 minut setup!)
- **[BUILD_AND_DEPLOY.md](./BUILD_AND_DEPLOY.md)** - Pełny przewodnik budowania i dystrybucji
- **[mobile/README.md](./mobile/README.md)** - Dokumentacja aplikacji mobilnej

### 🏗️ Architektura
- **[architecture/README.md](./architecture/README.md)** - Przegląd architektury
- **[IMPLEMENTATION-CHECKLIST.md](./architecture/IMPLEMENTATION-CHECKLIST.md)** - MVP Checklist (co zrobione)
- **[TECHNOLOGY-STACK.md](./architecture/TECHNOLOGY-STACK.md)** - Stack technologiczny
- **[ADR-001](./architecture/ADR-001-system-architecture.md)** - Szczegółowa architektura systemu

### 💰 Biznes & Bezpieczeństwo
- **[Cost Analysis](./architecture/cost-analysis.md)** - Analiza kosztów
- **[Security Plan](./architecture/security-plan.md)** - Plan bezpieczeństwa
- **[Deployment](./architecture/deployment-strategy.md)** - Strategia wdrożenia

### 🎨 Zasoby
- **[RESOURCES.md](./RESOURCES.md)** - Darmowe assety (ikony, dźwięki, grafiki)

## 🎯 MVP Roadmap (6 tygodni)

- [x] Week 1: Infrastructure setup
- [x] Week 2: Backend foundation
- [ ] Week 3-4: Mobile app core
- [ ] Week 5: Integration & polish
- [ ] Week 6: Testing & soft launch

## 🌍 Języki

- 🇵🇱 Polski (pl)
- 🇬🇧 English (en)
- 🇪🇸 Español (es)
- 🇩🇪 Deutsch (de)
- 🇫🇷 Français (fr)
- 🇮🇳 हिन्दी (hi)

## 💰 Koszty (Projekcje)

| Etap | Użytkownicy | Koszt/miesiąc |
|------|-------------|---------------|
| MVP | 1,000 | $6 |
| Growth | 10,000 | $103 |
| Scale | 100,000 | $763 |

**92% taniej niż Azure dla MVP!**

## 🔐 Bezpieczeństwo

- ✅ Brak danych osobowych (GDPR compliant)
- ✅ OWASP Top 10 zmitigowane
- ✅ Device ID hashowane (SHA256)
- ✅ TLS 1.3 wszędzie
- ✅ Rate limiting (100 req/min)

## 🧪 Testy

```bash
# Backend
cd backend
dotnet test

# Mobile
cd mobile
npm run test

# Web
cd web
npm run test
```

## 📝 Licencja

Copyright © 2025 ITEON
All rights reserved.

## 👥 Zespół

- **Tech Lead:** [Your Name]
- **Backend:** .NET Core
- **Mobile:** React Native/Expo
- **Web:** Next.js

## 📞 Kontakt

- **Email:** tech@slowspot.app
- **GitHub:** [Repository URL]
- **Slack:** #slow-spot-dev

---

**Ostatnia aktualizacja:** 2025-11-08

# Slow Spot Mobile

React Native mobile application for iOS and Android.

## Tech Stack

- **Framework:** React Native with Expo SDK 52
- **Language:** TypeScript
- **UI:** Custom components with Reanimated 3
- **Storage:** SQLite (expo-sqlite)
- **Audio:** Expo AV
- **i18n:** react-i18next (7 languages)

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Run on iOS Simulator
npx expo run:ios

# Run on Android Emulator
npx expo run:android
```

## Project Structure

```
mobile/
├── app/                 # Expo Router screens
├── assets/              # Images, fonts, sounds
├── src/
│   ├── components/      # Reusable UI components
│   ├── hooks/           # Custom React hooks
│   ├── i18n/            # Translations (7 languages)
│   ├── services/        # Business logic
│   ├── store/           # State management (Zustand)
│   ├── theme/           # Colors, typography
│   └── utils/           # Helper functions
└── ios/                 # Native iOS project
```

## Features

| Feature | Description |
|---------|-------------|
| Breathing Animation | Smooth, 60fps animation with Reanimated 3 |
| Haptic Feedback | Phase-specific vibration patterns |
| Ambient Sounds | 8 high-quality nature sounds |
| Offline Mode | Full functionality without internet |
| Accessibility | VoiceOver/TalkBack support |

## Building

```bash
# Development build
eas build --profile development --platform ios

# Production build
eas build --profile production --platform all
```

## Testing via Expo Go

Scan QR code or visit: [expo.dev/@leszekszpunar/slow-spot](https://expo.dev/@leszekszpunar/slow-spot)

---

See main [README](../README.md) for full project documentation.

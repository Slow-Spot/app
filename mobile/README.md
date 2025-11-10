# Slow Spot Mobile App

A minimalist meditation and mindfulness mobile application built with **Expo**, **React Native**, and **Tamagui**.

## Features

- 🧘 **Meditation Sessions**: Guided meditation with voice, ambient sounds, and interval chimes
- 💭 **Inspirational Quotes**: Daily quotes in 6 languages
- 🌍 **Multilingual**: Full support for English, Polish, Spanish, German, French, and Hindi
- 🎨 **Beautiful UI**: Minimalist design with Tamagui (performance-focused UI framework)
- 📱 **Offline-First**: Works without internet connection with smart caching
- 🎵 **3-Layer Audio**: Voice guidance + ambient sounds + meditation chimes

## Tech Stack

- **Framework**: Expo SDK 54 + React Native
- **UI Library**: Tamagui (performance-optimized, minimalist design)
- **Language**: TypeScript
- **i18n**: react-i18next with expo-localization
- **Audio**: expo-av (3-layer audio engine)
- **Storage**: @react-native-async-storage/async-storage
- **State Management**: React hooks (useState, useEffect)

## Project Structure

```
mobile/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── QuoteCard.tsx    # Quote display card
│   │   ├── SessionCard.tsx  # Meditation session card
│   │   └── MeditationTimer.tsx  # Circular timer with controls
│   ├── screens/             # Main app screens
│   │   ├── HomeScreen.tsx   # Home with daily quote
│   │   ├── MeditationScreen.tsx  # Session selection & player
│   │   ├── QuotesScreen.tsx # Quote browser
│   │   └── SettingsScreen.tsx  # Language & theme settings
│   ├── services/            # Business logic
│   │   ├── api.ts           # API client with offline-first caching
│   │   └── audio.ts         # 3-layer audio engine
│   └── i18n/                # Internationalization
│       ├── index.ts         # i18n configuration
│       └── locales/         # Translation files (en, pl, es, de, fr, hi)
├── tamagui.config.ts        # Tamagui theme configuration
├── App.tsx                  # Main app component with navigation
└── package.json             # Dependencies
```

## Installation

```bash
# Install dependencies
npm install

# Start the development server
npx expo start
```

## Running the App

```bash
# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web browser
npm run web
```

## Key Features Explained

### 1. Offline-First Architecture

The API service layer (`src/services/api.ts`) implements a cache-first strategy:
- Checks AsyncStorage for cached data first
- Falls back to API if cache is expired (1-hour TTL)
- Returns stale cache if API fails (offline mode)

### 2. 3-Layer Audio Engine

The audio engine (`src/services/audio.ts`) manages three simultaneous audio layers:
- **Voice**: Guided meditation narration (foreground, 80% volume)
- **Ambient**: Background sounds like nature or music (looping, 40% volume)
- **Chime**: Start/end bells and interval markers (60% volume)

Features:
- Fade in/out transitions
- Independent volume control
- Plays in background
- Respects silent mode on iOS

### 3. Multilingual Support

Full i18n support with:
- Automatic locale detection via expo-localization
- 6 languages: EN, PL, ES, DE, FR, HI
- Fallback to English if translation missing
- Easy to add new languages (just add JSON file)

### 4. Tamagui UI

Minimal, zen-inspired design with:
- Custom color palette (calm grays and soft tones)
- Smooth animations and transitions
- Accessibility support
- Dark mode ready (theme toggle in Settings)

## API Integration

The app connects to the .NET Core backend API:

**Development**: `http://localhost:5000/api`
**Production**: Will be configured for Railway deployment

API Endpoints:
- `GET /api/quotes?lang=en` - Get all quotes in a language
- `GET /api/quotes/random?lang=en` - Get random quote
- `GET /api/sessions?lang=en&level=1` - Get meditation sessions
- `GET /api/sessions/{id}` - Get specific session

## Configuration

### Backend URL

Update the API base URL in `src/services/api.ts`:

```typescript
const API_BASE_URL = 'https://your-api-url.railway.app/api';
```

### Tamagui Theme

Customize colors, spacing, and typography in `tamagui.config.ts`.

## Adding New Languages

1. Create translation file in `src/i18n/locales/{language-code}.json`
2. Copy structure from `en.json`
3. Translate all keys
4. Add to `LANGUAGES` array in `src/screens/SettingsScreen.tsx`
5. Import in `src/i18n/index.ts`

Example:
```json
{
  "app": {
    "name": "Slow Spot",
    "tagline": "Your translation here"
  },
  ...
}
```

## Dependencies

Main packages:
- `expo` - Expo SDK for React Native
- `tamagui` - UI framework
- `react-i18next` - Internationalization
- `expo-av` - Audio playback
- `@react-native-async-storage/async-storage` - Offline storage
- `expo-localization` - Device locale detection

## Build for Production

```bash
# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Build for both
eas build --platform all
```

## Next Steps

- [ ] Add user preferences storage (favorite sessions, custom timer durations)
- [ ] Implement progress tracking (meditation streak, total minutes)
- [ ] Add notification system (daily reminders)
- [ ] Implement audio download for true offline mode
- [ ] Add analytics (PostHog integration)
- [ ] Set up Sentry for error tracking
- [ ] Configure EAS Build for app store deployment

## License

Private - ITEON Project

## Author

ITEON Development Team

# Onboarding Integration Guide

Complete guide for integrating the user onboarding flow into Slow Spot.

## Current Status

**Implementation**: ✅ Complete (IntroScreen.tsx exists and works)
**Integration**: ⏳ Needs integration into App.tsx
**Translations**: ⏳ Need to be added to all 6 languages

---

## IntroScreen Overview

### Features

- ✅ **3 Beautiful Slides** with gradient backgrounds
- ✅ **Animated Slide Transitions** using `react-native-app-intro-slider`
- ✅ **Decorative Icons** with animated stars
- ✅ **Navigation Controls** (prev/next/done buttons)
- ✅ **AsyncStorage Persistence** (only shows once)
- ✅ **i18next Integration** (updated to use translations)
- ✅ **Helper Functions** (`hasCompletedIntro`, `resetIntro`)

### Slides Content

**Slide 1: Find Your Moment of Peace**
- Icon: Lotus flower (`flower-outline`)
- Gradient: Purple to violet (#667eea → #764ba2)
- Message: Meditations, inspiring quotes, and mindfulness techniques in one place

**Slide 2: Custom Meditation Sessions**
- Icon: Tools (`construct-outline`)
- Gradient: Pink to red (#f093fb → #f5576c)
- Message: Create personalized sessions tailored to your needs

**Slide 3: Track Your Progress**
- Icon: Trending up (`trending-up-outline`)
- Gradient: Blue to cyan (#4facfe → #00f2fe)
- Message: Build a daily practice and observe your growth

---

## Integration Steps

### Step 1: Add Translations to All Languages

Add the following translations to each language file (`src/i18n/locales/*.json`):

#### English (`en.json`)

```json
"onboarding": {
  "slide1": {
    "title": "Find Your Moment of Peace",
    "text": "Meditations, inspiring quotes, and mindfulness techniques in one place"
  },
  "slide2": {
    "title": "Custom Meditation Sessions",
    "text": "Create personalized sessions tailored to your needs"
  },
  "slide3": {
    "title": "Track Your Progress",
    "text": "Build a daily practice and observe your growth"
  }
}
```

#### Polish (`pl.json`)

```json
"onboarding": {
  "slide1": {
    "title": "Znajdź Swoją Chwilę Spokoju",
    "text": "Medytacje, inspirujące cytaty i techniki mindfulness w jednym miejscu"
  },
  "slide2": {
    "title": "Własne Sesje Medytacji",
    "text": "Stwórz spersonalizowane sesje dopasowane do Twoich potrzeb"
  },
  "slide3": {
    "title": "Śledź Swój Postęp",
    "text": "Buduj codzienną praktykę i obserwuj swój rozwój"
  }
}
```

#### Spanish (`es.json`)

```json
"onboarding": {
  "slide1": {
    "title": "Encuentra Tu Momento de Paz",
    "text": "Meditaciones, citas inspiradoras y técnicas de mindfulness en un solo lugar"
  },
  "slide2": {
    "title": "Sesiones de Meditación Personalizadas",
    "text": "Crea sesiones personalizadas adaptadas a tus necesidades"
  },
  "slide3": {
    "title": "Sigue Tu Progreso",
    "text": "Construye una práctica diaria y observa tu crecimiento"
  }
}
```

#### German (`de.json`)

```json
"onboarding": {
  "slide1": {
    "title": "Finde Deinen Moment der Ruhe",
    "text": "Meditationen, inspirierende Zitate und Achtsamkeitstechniken an einem Ort"
  },
  "slide2": {
    "title": "Eigene Meditationssitzungen",
    "text": "Erstelle personalisierte Sitzungen, die auf deine Bedürfnisse zugeschnitten sind"
  },
  "slide3": {
    "title": "Verfolge Deinen Fortschritt",
    "text": "Baue eine tägliche Praxis auf und beobachte dein Wachstum"
  }
}
```

#### French (`fr.json`)

```json
"onboarding": {
  "slide1": {
    "title": "Trouvez Votre Moment de Paix",
    "text": "Méditations, citations inspirantes et techniques de pleine conscience en un seul endroit"
  },
  "slide2": {
    "title": "Séances de Méditation Personnalisées",
    "text": "Créez des séances personnalisées adaptées à vos besoins"
  },
  "slide3": {
    "title": "Suivez Vos Progrès",
    "text": "Construisez une pratique quotidienne et observez votre croissance"
  }
}
```

#### Hindi (`hi.json`)

```json
"onboarding": {
  "slide1": {
    "title": "शांति का अपना पल खोजें",
    "text": "ध्यान, प्रेरक उद्धरण और माइंडफुलनेस तकनीकें एक जगह"
  },
  "slide2": {
    "title": "कस्टम ध्यान सत्र",
    "text": "अपनी आवश्यकताओं के अनुसार व्यक्तिगत सत्र बनाएं"
  },
  "slide3": {
    "title": "अपनी प्रगति ट्रैक करें",
    "text": "दैनिक अभ्यास बनाएं और अपनी वृद्धि देखें"
  }
}
```

---

### Step 2: Integrate IntroScreen into App.tsx

#### Add State to Track Onboarding Status

At the top of `App.tsx`, add state for onboarding:

```typescript
const [showOnboarding, setShowOnboarding] = useState(false);
const [onboardingChecked, setOnboardingChecked] = useState(false);
```

#### Check if Onboarding Has Been Completed

In the `useEffect` that prepares the app, check onboarding status:

```typescript
useEffect(() => {
  const prepareApp = async () => {
    try {
      // Load theme preference
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme !== null) {
        const parsedTheme = JSON.parse(savedTheme) as ThemeMode;
        setThemeMode(parsedTheme);
      }

      // Check if onboarding has been completed
      const { hasCompletedIntro } = require('./src/screens/IntroScreen');
      const completed = await hasCompletedIntro();
      setShowOnboarding(!completed);

      // Hide native splash screen
      await SplashScreen.hideAsync();
    } catch (error) {
      logger.warn('Error loading app resources:', error);
    } finally {
      setAppIsReady(true);
      setOnboardingChecked(true);
    }
  };

  prepareApp();
}, []);
```

#### Show IntroScreen if Not Completed

Update the return statement to show IntroScreen:

```typescript
// Show custom splash screen
if (showSplash || !appIsReady) {
  return <CustomSplashScreen onFinish={handleSplashFinish} />;
}

// Show onboarding if not completed
if (!onboardingChecked) {
  return null; // Still loading
}

if (showOnboarding) {
  return (
    <IntroScreen
      onDone={() => {
        setShowOnboarding(false);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }}
    />
  );
}

// Rest of the app...
return (
  <SafeAreaProvider>
    {/* ... */}
  </SafeAreaProvider>
);
```

#### Add Import at Top of File

```typescript
import { IntroScreen } from './src/screens/IntroScreen';
```

---

### Step 3: Test Onboarding Flow

#### Test First Launch

1. **Clear AsyncStorage** to simulate first launch:
   ```typescript
   // In App.tsx, temporarily add:
   import { resetIntro } from './src/screens/IntroScreen';

   // In prepareApp:
   await resetIntro(); // Remove after testing
   ```

2. **Restart app** and verify:
   - [ ] Onboarding appears after splash screen
   - [ ] All 3 slides display correctly
   - [ ] Translations work in all languages
   - [ ] Navigation buttons work (prev/next/done)
   - [ ] Completion is saved to AsyncStorage
   - [ ] App proceeds to HomeScreen after completion

#### Test Subsequent Launches

1. **Remove `resetIntro()` call**
2. **Restart app** and verify:
   - [ ] Onboarding does NOT appear
   - [ ] App goes directly to HomeScreen

---

## Development Testing

### Reset Onboarding (For Testing)

Add a reset button in SettingsScreen for development:

```typescript
import { resetIntro } from '../screens/IntroScreen';

// In SettingsScreen:
<TouchableOpacity
  onPress={async () => {
    await resetIntro();
    Alert.alert('Onboarding Reset', 'Restart the app to see onboarding again.');
  }}
>
  <Text>Reset Onboarding (Dev Only)</Text>
</TouchableOpacity>
```

**Remove before production!**

### Manual Reset via AsyncStorage

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

await AsyncStorage.removeItem('@slow_spot_intro_completed');
```

---

## Technical Details

### Dependency

The IntroScreen uses `react-native-app-intro-slider` library.

**Verify installation:**

```bash
npm list react-native-app-intro-slider
```

**If not installed:**

```bash
npm install react-native-app-intro-slider
```

### AsyncStorage Key

Onboarding completion is stored in AsyncStorage with key:

```typescript
const INTRO_COMPLETED_KEY = '@slow_spot_intro_completed';
```

**Value**: `'true'` when completed

### Helper Functions

#### `hasCompletedIntro()`

```typescript
import { hasCompletedIntro } from './src/screens/IntroScreen';

const completed = await hasCompletedIntro();
// Returns: boolean
```

#### `resetIntro()`

```typescript
import { resetIntro } from './src/screens/IntroScreen';

await resetIntro();
// Removes completion flag, onboarding will show again
```

---

## Customization Options

### Change Slides Content

Edit `IntroScreen.tsx` slides array:

```typescript
const slides: Slide[] = [
  {
    key: '1',
    titleKey: 'onboarding.slide1.title',
    textKey: 'onboarding.slide1.text',
    icon: 'flower-outline', // Change icon
    gradient: {
      colors: ['#667eea', '#764ba2'], // Change gradient colors
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
  },
  // Add more slides...
];
```

### Add More Slides

Simply add more objects to the `slides` array:

```typescript
{
  key: '4',
  titleKey: 'onboarding.slide4.title',
  textKey: 'onboarding.slide4.text',
  icon: 'trophy-outline',
  gradient: {
    colors: ['#FFD700', '#FFA500'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
}
```

Don't forget to add translations!

### Change Button Styles

Modify button styles in `IntroScreen.tsx`:

```typescript
const styles = StyleSheet.create({
  buttonCircle: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Change button background
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Change done button
  },
});
```

---

## Analytics Integration (Optional)

Track onboarding completion:

```typescript
import { logger } from '../utils/logger';

const handleDone = async () => {
  try {
    await AsyncStorage.setItem(INTRO_COMPLETED_KEY, 'true');

    // Optional: Track analytics
    logger.log('Onboarding completed');
    // Analytics.track('onboarding_completed');

    onDone();
  } catch (error) {
    logger.error('Error saving intro completion:', error);
    onDone();
  }
};
```

---

## User Experience Best Practices

### Do's ✅

- ✅ Keep onboarding short (3-4 slides maximum)
- ✅ Show only on first launch
- ✅ Make skip/back buttons easily accessible
- ✅ Use engaging visuals
- ✅ Focus on key value propositions
- ✅ Test with real users

### Don'ts ❌

- ❌ Don't make onboarding mandatory with no skip option
- ❌ Don't show onboarding on every launch
- ❌ Don't include too much text
- ❌ Don't use technical jargon
- ❌ Don't make it too long

---

## Accessibility

### Current Features

- ✅ High contrast text (white on gradients)
- ✅ Large touch targets (50x50 buttons)
- ✅ Clear, readable fonts
- ✅ Simple navigation

### Improvements (Optional)

- [ ] Add accessibility labels to buttons
- [ ] Support VoiceOver announcements
- [ ] Add reduced motion support
- [ ] Test with screen readers

```typescript
<TouchableOpacity
  accessible={true}
  accessibilityLabel="Next slide"
  accessibilityHint="Move to the next onboarding slide"
  accessibilityRole="button"
>
  {/* Button content */}
</TouchableOpacity>
```

---

## Troubleshooting

### Onboarding Doesn't Appear

**Possible causes:**
1. AsyncStorage key already set (completed before)
2. Import error in App.tsx
3. State not updated correctly

**Solutions:**
```typescript
// Check AsyncStorage
const value = await AsyncStorage.getItem('@slow_spot_intro_completed');
console.log('Intro completed:', value);

// Reset manually
await AsyncStorage.removeItem('@slow_spot_intro_completed');
```

### Translations Not Working

**Possible causes:**
1. Translation keys not added to all language files
2. i18next not initialized
3. Typo in translation key

**Solutions:**
```typescript
// Check if key exists
console.log(t('onboarding.slide1.title'));

// Verify language
console.log(i18n.language);
```

### Slides Not Transitioning

**Possible causes:**
1. `react-native-app-intro-slider` not installed
2. Library version conflict

**Solutions:**
```bash
# Reinstall library
npm install react-native-app-intro-slider

# Check version
npm list react-native-app-intro-slider
```

---

## Testing Checklist

### Functional Testing

- [ ] Onboarding appears on first launch
- [ ] All 3 slides display correctly
- [ ] Slide transitions work smoothly
- [ ] Next button advances slides
- [ ] Previous button goes back
- [ ] Done button completes onboarding
- [ ] Completion saved to AsyncStorage
- [ ] Onboarding doesn't appear on subsequent launches

### Localization Testing

- [ ] Test in English - all slides translated
- [ ] Test in Polish - all slides translated
- [ ] Test in Spanish - all slides translated
- [ ] Test in German - all slides translated
- [ ] Test in French - all slides translated
- [ ] Test in Hindi - all slides translated
- [ ] Text fits in UI (no overflow)

### Device Testing

- [ ] iOS (iPhone)
- [ ] iOS (iPad)
- [ ] Android (Phone)
- [ ] Android (Tablet)
- [ ] Different screen sizes (small, medium, large)

### Performance Testing

- [ ] Smooth 60 FPS animations
- [ ] No memory leaks
- [ ] Quick load time (< 1 second)

---

## Future Enhancements (Optional)

### Version 1.1+

- [ ] **Interactive Tutorials**: Guide users through first meditation
- [ ] **Feature Highlights**: Highlight new features in updates
- [ ] **Personalization**: Ask user preferences during onboarding
- [ ] **Progress Indicators**: Show onboarding progress percentage
- [ ] **Video Content**: Add video demonstrations
- [ ] **Tooltips**: Show tooltips for first-time feature usage

### Advanced Features

- [ ] **A/B Testing**: Test different onboarding flows
- [ ] **Skip Analytics**: Track how many users skip
- [ ] **Completion Rate**: Measure onboarding completion
- [ ] **User Feedback**: Collect feedback on onboarding experience

---

## Summary

**Current State**:
- ✅ IntroScreen implemented and styled
- ✅ i18next integration added
- ⏳ Translations need to be added
- ⏳ App.tsx integration pending

**Next Steps**:
1. Add translations to all 6 language files
2. Integrate IntroScreen into App.tsx
3. Test onboarding flow thoroughly
4. Verify on physical devices

**Estimated Time**: 1-2 hours

**Priority**: Medium (nice-to-have for launch, not critical)

---

**File**: IntroScreen.tsx
**Location**: `/src/screens/IntroScreen.tsx`
**Dependencies**: `react-native-app-intro-slider`, `react-i18next`
**AsyncStorage Key**: `@slow_spot_intro_completed`

**Last Updated**: November 24, 2024

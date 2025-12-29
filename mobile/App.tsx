import React, { useState, useEffect, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, TouchableOpacity, Platform, useColorScheme, Linking } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import * as SplashScreen from 'expo-splash-screen';
import './src/i18n';
import { useTranslation } from 'react-i18next';
import { logger } from './src/utils/logger';
import { AnimatedScreenContainer } from './src/components/AnimatedScreenContainer';
import { AppModal } from './src/components/AppModal';

// Keep the splash screen visible while we load resources
SplashScreen.preventAutoHideAsync();

// Note: Analytics removed - app operates fully offline
// No external services or API calls required

import { HomeScreen } from './src/screens/HomeScreen';
import { MeditationScreen } from './src/screens/MeditationScreen';
import { QuotesScreen } from './src/screens/QuotesScreen';
import { SettingsScreen, THEME_STORAGE_KEY, ThemeMode } from './src/screens/SettingsScreen';
import { CustomSessionBuilderScreen, SessionConfig } from './src/screens/CustomSessionBuilderScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import InstructionsScreen from './src/screens/InstructionsScreen';
import { PersonalizationScreen } from './src/screens/PersonalizationScreen';
import { IntroScreen, hasCompletedIntro } from './src/screens/IntroScreen';
import { MeditationSession } from './src/services/api';
import { SplashScreen as CustomSplashScreen } from './src/components/SplashScreen';
import { ensureStorageSchema } from './src/services/storage';
import { PersonalizationProvider, usePersonalization } from './src/contexts/PersonalizationContext';
import { UserProfileProvider, useUserProfile } from './src/contexts/UserProfileContext';

type Screen = 'home' | 'meditation' | 'quotes' | 'settings' | 'custom' | 'profile' | 'instructions' | 'personalization';

// Meditation session state for persistence across navigation
export interface ActiveMeditationState {
  session: MeditationSession;
  flowState: 'instructions' | 'meditation' | 'celebration';
  userIntention?: string;
  startedAt: number; // timestamp
}

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [editSessionId, setEditSessionId] = useState<string | undefined>();
  const [editSessionConfig, setEditSessionConfig] = useState<SessionConfig | undefined>();
  const [activeMeditationState, setActiveMeditationState] = useState<ActiveMeditationState | null>(null);
  const [sessionRefreshKey, setSessionRefreshKey] = useState(0);
  const [appIsReady, setAppIsReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingChecked, setOnboardingChecked] = useState(false);
  // Modal state for meditation exit confirmation
  const [showExitMeditationModal, setShowExitMeditationModal] = useState(false);
  const [pendingScreen, setPendingScreen] = useState<Screen | null>(null);
  // Temporary session config for immediate start from custom builder
  const [pendingSessionConfig, setPendingSessionConfig] = useState<SessionConfig | null>(null);
  const systemColorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  // Translations
  const { t } = useTranslation();

  // Get personalized colors from context
  const { currentTheme } = usePersonalization();
  const { refreshProfile } = useUserProfile();
  const primaryColor = currentTheme.primary;
  // Dynamic active button background with personalized color
  const activeButtonBgLight = `${primaryColor}26`; // 15% opacity
  const activeButtonBgDark = `${primaryColor}40`; // 25% opacity

  // Calculate actual dark mode based on theme mode and system preference
  const isDark = themeMode === 'system'
    ? systemColorScheme === 'dark'
    : themeMode === 'dark';

  // Load saved theme preference and prepare app
  useEffect(() => {
    const prepareApp = async () => {
      try {
        // Load theme preference
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme !== null) {
          const parsedTheme = JSON.parse(savedTheme) as ThemeMode;
          setThemeMode(parsedTheme);
        }

        // Ensure storage schema and run migrations before using local data
        await ensureStorageSchema();

        // Check if onboarding/intro has been completed
        const introCompleted = await hasCompletedIntro();
        setShowOnboarding(!introCompleted);
        setOnboardingChecked(true);

        // Hide native splash screen immediately as we show custom one
        await SplashScreen.hideAsync();
      } catch (error) {
        logger.warn('Error loading app resources:', error);
        setOnboardingChecked(true);
      } finally {
        setAppIsReady(true);
      }
    };

    prepareApp();
  }, []);

  // Deep linking handler for screenshots automation
  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      const url = event.url;
      // Handle slowspot://screen/home, slowspot://screen/meditation, etc.
      const match = url.match(/slowspot:\/\/screen\/(\w+)/);
      if (match) {
        const screen = match[1] as Screen;
        if (['home', 'meditation', 'quotes', 'settings', 'profile'].includes(screen)) {
          setCurrentScreen(screen);
          logger.log('Deep link navigation to:', screen);
        }
      }
    };

    // Handle initial URL
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    // Listen for URL events
    const subscription = Linking.addEventListener('url', handleDeepLink);
    return () => subscription.remove();
  }, []);

  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);
  }, []);

  const onLayoutRootView = useCallback(() => {
    // Layout callback for SafeAreaView
  }, []);

  // Show custom splash screen
  if (showSplash || !appIsReady) {
    return <CustomSplashScreen onFinish={handleSplashFinish} />;
  }

  // Wait for onboarding check to complete
  if (!onboardingChecked) {
    return null;
  }

  // Show onboarding/intro if not completed
  if (showOnboarding) {
    return (
      <IntroScreen
        onDone={async () => {
          // Refresh profile from storage to get the latest name value
          await refreshProfile();
          setShowOnboarding(false);
          setCurrentScreen('home'); // Always navigate to home after onboarding
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }}
      />
    );
  }

  const handleThemeChange = async (mode: ThemeMode) => {
    try {
      setThemeMode(mode);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(mode));
    } catch (error) {
      logger.error('Failed to save theme preference:', error);
    }
  };

  const handleNavigate = (screen: Screen) => {
    // Prevent navigation away from active meditation without confirmation
    if (activeMeditationState && currentScreen === 'meditation' && screen !== 'meditation') {
      setPendingScreen(screen);
      setShowExitMeditationModal(true);
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentScreen(screen);
  };

  const handleConfirmExitMeditation = () => {
    setActiveMeditationState(null);
    setShowExitMeditationModal(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (pendingScreen) {
      setCurrentScreen(pendingScreen);
      setPendingScreen(null);
    }
  };

  const handleCancelExitMeditation = () => {
    setShowExitMeditationModal(false);
    setPendingScreen(null);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  };

  const handleStartCustomSession = (config: SessionConfig) => {
    // Navigate to meditation screen with the custom session config
    // Note: Saving is handled by CustomSessionBuilderScreen when user explicitly saves
    logger.log('Starting custom session:', config.name || 'unnamed');
    setPendingSessionConfig(config);
    setCurrentScreen('meditation');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleClearPendingSession = () => {
    setPendingSessionConfig(null);
  };

  const handleEditSession = (sessionId: string, sessionConfig: SessionConfig) => {
    setEditSessionId(sessionId);
    setEditSessionConfig(sessionConfig);
    setCurrentScreen('custom');
  };

  const handleBackFromCustomBuilder = () => {
    setEditSessionId(undefined);
    setEditSessionConfig(undefined);
    // Increment refresh key to trigger session reload in MeditationScreen
    setSessionRefreshKey(prev => prev + 1);
    setCurrentScreen('home');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <HomeScreen
            isDark={isDark}
            onNavigateToMeditation={() => setCurrentScreen('meditation')}
            onNavigateToQuotes={() => setCurrentScreen('quotes')}
            onNavigateToCustom={() => setCurrentScreen('custom')}
            onNavigateToProfile={() => setCurrentScreen('profile')}
            onNavigateToInstructions={() => setCurrentScreen('instructions')}
          />
        );
      case 'meditation':
        return (
          <MeditationScreen
            key={sessionRefreshKey}
            isDark={isDark}
            onEditSession={handleEditSession}
            onNavigateToCustom={() => setCurrentScreen('custom')}
            activeMeditationState={activeMeditationState}
            onMeditationStateChange={setActiveMeditationState}
            pendingSessionConfig={pendingSessionConfig}
            onClearPendingSession={handleClearPendingSession}
          />
        );
      case 'quotes':
        return <QuotesScreen isDark={isDark} />;
      case 'settings':
        return (
          <SettingsScreen
            isDark={isDark}
            themeMode={themeMode}
            onThemeChange={handleThemeChange}
            onNavigateToProfile={() => setCurrentScreen('profile')}
            onNavigateToPersonalization={() => setCurrentScreen('personalization')}
            onRestartOnboarding={() => setShowOnboarding(true)}
          />
        );
      case 'personalization':
        return (
          <PersonalizationScreen
            isDark={isDark}
            onBack={() => setCurrentScreen('settings')}
          />
        );
      case 'profile':
        return <ProfileScreen isDark={isDark} onNavigateToCustom={() => setCurrentScreen('custom')} />;
      case 'instructions':
        return <InstructionsScreen isDark={isDark} navigation={{ goBack: () => setCurrentScreen('home') }} />;
      case 'custom':
        return (
          <CustomSessionBuilderScreen
            isDark={isDark}
            onStartSession={handleStartCustomSession}
            onBack={handleBackFromCustomBuilder}
            editSessionId={editSessionId}
            initialConfig={editSessionConfig}
          />
        );
      default:
        return null;
    }
  };

  return (
      <View
        style={[styles.container, isDark ? styles.darkContainer : styles.lightContainer, { paddingTop: insets.top }]}
        onLayout={onLayoutRootView}
      >
        <StatusBar style={isDark ? 'light' : 'dark'} />

        <View style={styles.mainContent}>
        {/* Main Content with animated transitions */}
        <View style={styles.screenContainer}>
          <AnimatedScreenContainer
            screenKey={currentScreen}
            onNavigate={handleNavigate as (screen: string) => void}
            enableSwipe={currentScreen !== 'meditation' || !activeMeditationState}
          >
            {renderScreen()}
          </AnimatedScreenContainer>
        </View>

        {/* Bottom Navigation - Glassmorphism Effect */}
        <BlurView
          intensity={isDark ? 80 : 60}
          tint={isDark ? 'dark' : 'light'}
          style={[styles.bottomNav, styles.glassmorphNav]}
        >
          <View style={[styles.navContent, { paddingBottom: Math.max(insets.bottom - 16, 4) }]}>
            <TouchableOpacity
            style={[
              styles.navButton,
              currentScreen === 'home' && { backgroundColor: isDark ? activeButtonBgDark : activeButtonBgLight },
            ]}
            onPress={() => handleNavigate('home')}
            accessibilityLabel="Home"
            accessibilityHint="Navigate to home screen"
            accessibilityRole="button"
          >
            <Ionicons
              name={currentScreen === 'home' ? 'home' : 'home-outline'}
              size={24}
              color={
                currentScreen === 'home'
                  ? primaryColor
                  : isDark
                  ? '#8E8E93'
                  : '#3A3A3C'
              }
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.navButton,
              currentScreen === 'meditation' && { backgroundColor: isDark ? activeButtonBgDark : activeButtonBgLight },
            ]}
            onPress={() => handleNavigate('meditation')}
            accessibilityLabel="Meditation"
            accessibilityHint="Navigate to meditation screen"
            accessibilityRole="button"
          >
            <Ionicons
              name={currentScreen === 'meditation' ? 'flower' : 'flower-outline'}
              size={24}
              color={
                currentScreen === 'meditation'
                  ? primaryColor
                  : isDark
                  ? '#8E8E93'
                  : '#3A3A3C'
              }
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.navButton,
              currentScreen === 'quotes' && { backgroundColor: isDark ? activeButtonBgDark : activeButtonBgLight },
            ]}
            onPress={() => handleNavigate('quotes')}
            accessibilityLabel="Quotes"
            accessibilityHint="Navigate to quotes screen"
            accessibilityRole="button"
          >
            <Ionicons
              name={currentScreen === 'quotes' ? 'book' : 'book-outline'}
              size={24}
              color={
                currentScreen === 'quotes'
                  ? primaryColor
                  : isDark
                  ? '#8E8E93'
                  : '#3A3A3C'
              }
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.navButton,
              currentScreen === 'settings' && { backgroundColor: isDark ? activeButtonBgDark : activeButtonBgLight },
            ]}
            onPress={() => handleNavigate('settings')}
            accessibilityLabel="Settings"
            accessibilityHint="Navigate to settings screen"
            accessibilityRole="button"
          >
            <Ionicons
              name={currentScreen === 'settings' ? 'settings' : 'settings-outline'}
              size={24}
              color={
                currentScreen === 'settings'
                  ? primaryColor
                  : isDark
                  ? '#8E8E93'
                  : '#3A3A3C'
              }
            />
          </TouchableOpacity>
          </View>
        </BlurView>
      </View>

      {/* Exit Meditation Confirmation Modal */}
      <AppModal
        visible={showExitMeditationModal}
        title={t('meditation.endSessionTitle', 'Zakończyć sesję?')}
        message={t('meditation.endSessionMessage', 'Twój postęp zostanie zapisany. Czy na pewno chcesz zakończyć medytację?')}
        icon="pause-circle-outline"
        onDismiss={handleCancelExitMeditation}
        buttons={[
          {
            text: t('meditation.endSessionCancel', 'Kontynuuj'),
            style: 'cancel',
            onPress: handleCancelExitMeditation,
          },
          {
            text: t('meditation.endSessionConfirm', 'Zakończ'),
            style: 'destructive',
            onPress: handleConfirmExitMeditation,
          },
        ]}
      />
    </View>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={styles.gestureRoot}>
      <SafeAreaProvider>
        <UserProfileProvider>
          <PersonalizationProvider>
            <AppContent />
          </PersonalizationProvider>
        </UserProfileProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  gestureRoot: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  lightContainer: {
    backgroundColor: '#FFFFFF',
  },
  darkContainer: {
    backgroundColor: '#1C1C1E', // Consistent with darkBackgrounds.primary
  },
  mainContent: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
  },
  bottomNav: {
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(0, 0, 0, 0.08)',
    overflow: 'hidden',
  },
  glassmorphNav: {
    backgroundColor: 'transparent',
  },
  navContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 8,
    paddingHorizontal: 20,
    gap: 8,
  },
  navButton: {
    width: 64,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

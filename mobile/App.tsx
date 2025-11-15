import React, { useState, useEffect, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, TouchableOpacity, Platform, useColorScheme, Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import * as SplashScreen from 'expo-splash-screen';
import './src/i18n';

// Keep the splash screen visible while we load resources
SplashScreen.preventAutoHideAsync();

import { HomeScreen } from './src/screens/HomeScreen';
import { MeditationScreen } from './src/screens/MeditationScreen';
import { QuotesScreen } from './src/screens/QuotesScreen';
import { SettingsScreen, THEME_STORAGE_KEY, ThemeMode } from './src/screens/SettingsScreen';
import { CustomSessionBuilderScreen, CustomSessionConfig } from './src/screens/CustomSessionBuilderScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { MeditationSession } from './src/services/api';

type Screen = 'home' | 'meditation' | 'quotes' | 'settings' | 'custom' | 'profile';

// Meditation session state for persistence across navigation
export interface ActiveMeditationState {
  session: MeditationSession;
  flowState: 'instructions' | 'meditation' | 'celebration';
  userIntention?: string;
  startedAt: number; // timestamp
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [editSessionId, setEditSessionId] = useState<string | undefined>();
  const [editSessionConfig, setEditSessionConfig] = useState<CustomSessionConfig | undefined>();
  const [activeMeditationState, setActiveMeditationState] = useState<ActiveMeditationState | null>(null);
  const [appIsReady, setAppIsReady] = useState(false);
  const systemColorScheme = useColorScheme();

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

        // Simulate minimum splash screen time for smooth experience (500ms)
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.warn('Error loading app resources:', error);
      } finally {
        setAppIsReady(true);
      }
    };

    prepareApp();
  }, []);

  // Hide splash screen when app is ready
  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  // Don't render app until ready
  if (!appIsReady) {
    return null;
  }

  const handleThemeChange = async (mode: ThemeMode) => {
    try {
      setThemeMode(mode);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(mode));
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  const handleNavigate = (screen: Screen) => {
    // Prevent navigation away from active meditation without confirmation
    if (activeMeditationState && currentScreen === 'meditation' && screen !== 'meditation') {
      Alert.alert(
        'Active Meditation',
        'You have an active meditation session. Do you want to exit and end the session?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
          },
          {
            text: 'Exit',
            style: 'destructive',
            onPress: () => {
              setActiveMeditationState(null);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setCurrentScreen(screen);
            },
          },
        ]
      );
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentScreen(screen);
  };

  const handleStartCustomSession = (config: CustomSessionConfig) => {
    // TODO: Implement custom session playback with the configured settings
    // For now, just navigate to meditation screen
    console.log('Starting custom session with config:', config);
    setCurrentScreen('meditation');
  };

  const handleEditSession = (sessionId: string, sessionConfig: CustomSessionConfig) => {
    setEditSessionId(sessionId);
    setEditSessionConfig(sessionConfig);
    setCurrentScreen('custom');
  };

  const handleBackFromCustomBuilder = () => {
    setEditSessionId(undefined);
    setEditSessionConfig(undefined);
    setCurrentScreen('home');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <HomeScreen
            onNavigateToMeditation={() => setCurrentScreen('meditation')}
            onNavigateToQuotes={() => setCurrentScreen('quotes')}
            onNavigateToCustom={() => setCurrentScreen('custom')}
            onNavigateToProfile={() => setCurrentScreen('profile')}
          />
        );
      case 'meditation':
        return (
          <MeditationScreen
            onEditSession={handleEditSession}
            activeMeditationState={activeMeditationState}
            onMeditationStateChange={setActiveMeditationState}
          />
        );
      case 'quotes':
        return <QuotesScreen />;
      case 'settings':
        return (
          <SettingsScreen
            isDark={isDark}
            themeMode={themeMode}
            onThemeChange={handleThemeChange}
            onNavigateToProfile={() => setCurrentScreen('profile')}
          />
        );
      case 'profile':
        return <ProfileScreen onNavigateToCustom={() => setCurrentScreen('custom')} />;
      case 'custom':
        return (
          <CustomSessionBuilderScreen
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
    <SafeAreaProvider>
      <SafeAreaView
        style={[styles.container, isDark ? styles.darkContainer : styles.lightContainer]}
        onLayout={onLayoutRootView}
      >
        <StatusBar style={isDark ? 'light' : 'dark'} />

        <View style={styles.mainContent}>
        {/* Main Content */}
        <View style={styles.screenContainer}>{renderScreen()}</View>

        {/* Bottom Navigation - Glassmorphism Effect */}
        <BlurView
          intensity={isDark ? 80 : 60}
          tint={isDark ? 'dark' : 'light'}
          style={[styles.bottomNav, styles.glassmorphNav]}
        >
          <View style={styles.navContent}>
            <TouchableOpacity
            style={[
              styles.navButton,
              currentScreen === 'home' && (isDark ? styles.activeButtonDark : styles.activeButtonLight),
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
                  ? '#FFFFFF'
                  : isDark
                  ? '#8E8E93'
                  : '#3A3A3C'
              }
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.navButton,
              currentScreen === 'meditation' && (isDark ? styles.activeButtonDark : styles.activeButtonLight),
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
                  ? '#FFFFFF'
                  : isDark
                  ? '#8E8E93'
                  : '#3A3A3C'
              }
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.navButton,
              currentScreen === 'quotes' && (isDark ? styles.activeButtonDark : styles.activeButtonLight),
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
                  ? '#FFFFFF'
                  : isDark
                  ? '#8E8E93'
                  : '#3A3A3C'
              }
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.navButton,
              currentScreen === 'settings' && (isDark ? styles.activeButtonDark : styles.activeButtonLight),
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
                  ? '#FFFFFF'
                  : isDark
                  ? '#8E8E93'
                  : '#3A3A3C'
              }
            />
          </TouchableOpacity>
          </View>
        </BlurView>
      </View>
    </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lightContainer: {
    backgroundColor: '#FFFFFF',
  },
  darkContainer: {
    backgroundColor: '#1A1A1A',
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
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 6,
  },
  navButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeButtonLight: {
    backgroundColor: '#007AFF',
  },
  activeButtonDark: {
    backgroundColor: '#0A84FF',
  },
});

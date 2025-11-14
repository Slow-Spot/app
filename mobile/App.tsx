import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, TouchableOpacity, Platform, useColorScheme } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import './src/i18n';

import { HomeScreen } from './src/screens/HomeScreen';
import { MeditationScreen } from './src/screens/MeditationScreen';
import { QuotesScreen } from './src/screens/QuotesScreen';
import { SettingsScreen, THEME_STORAGE_KEY, ThemeMode } from './src/screens/SettingsScreen';
import { CustomSessionBuilderScreen, CustomSessionConfig } from './src/screens/CustomSessionBuilderScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';

type Screen = 'home' | 'meditation' | 'quotes' | 'settings' | 'custom' | 'profile';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const systemColorScheme = useColorScheme();

  // Calculate actual dark mode based on theme mode and system preference
  const isDark = themeMode === 'system'
    ? systemColorScheme === 'dark'
    : themeMode === 'dark';

  // Load saved theme preference on mount
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme !== null) {
          const parsedTheme = JSON.parse(savedTheme) as ThemeMode;
          setThemeMode(parsedTheme);
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
      }
    };

    loadThemePreference();
  }, []);

  const handleThemeChange = async (mode: ThemeMode) => {
    try {
      setThemeMode(mode);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(mode));
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  const handleNavigate = (screen: Screen) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentScreen(screen);
  };

  const handleStartCustomSession = (config: CustomSessionConfig) => {
    // TODO: Implement custom session playback with the configured settings
    // For now, just navigate to meditation screen
    console.log('Starting custom session with config:', config);
    setCurrentScreen('meditation');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <HomeScreen
            onNavigateToMeditation={() => setCurrentScreen('meditation')}
            onNavigateToQuotes={() => setCurrentScreen('quotes')}
            onNavigateToCustom={() => setCurrentScreen('custom')}
          />
        );
      case 'meditation':
        return <MeditationScreen />;
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
            onBack={() => setCurrentScreen('home')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.container, isDark ? styles.darkContainer : styles.lightContainer]}>
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
              name={currentScreen === 'meditation' ? 'radio-button-on' : 'radio-button-off'}
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

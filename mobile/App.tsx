import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import './src/i18n';

import { HomeScreen } from './src/screens/HomeScreen';
import { MeditationScreen } from './src/screens/MeditationScreen';
import { QuotesScreen } from './src/screens/QuotesScreen';
import { SettingsScreen, THEME_STORAGE_KEY } from './src/screens/SettingsScreen';

type Screen = 'home' | 'meditation' | 'quotes' | 'settings';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [isDark, setIsDark] = useState(false);

  // Load saved theme preference on mount
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme !== null) {
          setIsDark(JSON.parse(savedTheme));
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
      }
    };

    loadThemePreference();
  }, []);

  const handleToggleDark = async () => {
    try {
      const newValue = !isDark;
      setIsDark(newValue);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(newValue));
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <HomeScreen
            onNavigateToMeditation={() => setCurrentScreen('meditation')}
            onNavigateToQuotes={() => setCurrentScreen('quotes')}
          />
        );
      case 'meditation':
        return <MeditationScreen />;
      case 'quotes':
        return <QuotesScreen />;
      case 'settings':
        return <SettingsScreen isDark={isDark} onToggleDark={handleToggleDark} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.container, isDark ? styles.darkContainer : styles.lightContainer]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <View style={styles.mainContent}>
        {/* Main Content */}
        <View style={styles.screenContainer}>{renderScreen()}</View>

        {/* Bottom Navigation */}
        <View style={[styles.bottomNav, isDark ? styles.darkNav : styles.lightNav]}>
          <TouchableOpacity
            style={[
              styles.navButton,
              currentScreen === 'home' && (isDark ? styles.activeButtonDark : styles.activeButtonLight),
            ]}
            onPress={() => setCurrentScreen('home')}
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
            onPress={() => setCurrentScreen('meditation')}
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
            onPress={() => setCurrentScreen('quotes')}
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
            onPress={() => setCurrentScreen('settings')}
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
      </View>
    </SafeAreaView>
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
    flexDirection: 'row',
    borderTopWidth: 0.5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 6,
  },
  lightNav: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopColor: 'rgba(0, 0, 0, 0.08)',
  },
  darkNav: {
    backgroundColor: 'rgba(26, 26, 26, 0.95)',
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
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

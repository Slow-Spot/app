import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import './src/i18n';

import { HomeScreen } from './src/screens/HomeScreen';
import { MeditationScreen } from './src/screens/MeditationScreen';
import { QuotesScreen } from './src/screens/QuotesScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

type Screen = 'home' | 'meditation' | 'quotes' | 'settings';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [isDark, setIsDark] = useState(false);

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
        return <SettingsScreen isDark={isDark} onToggleDark={() => setIsDark(!isDark)} />;
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
            <Feather
              name="home"
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
              name="flower-outline"
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
            <Feather
              name="book-open"
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
            <Feather
              name="settings"
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

import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';
import { TamaguiProvider, Theme, YStack, XStack, Button } from 'tamagui';
import config from './tamagui.config';
import './src/i18n';

import { HomeScreen } from './src/screens/HomeScreen';
import { MeditationScreen } from './src/screens/MeditationScreen';
import { QuotesScreen } from './src/screens/QuotesScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

type Screen = 'home' | 'meditation' | 'quotes' | 'settings';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');

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
        return <SettingsScreen />;
      default:
        return null;
    }
  };

  return (
    <TamaguiProvider config={config}>
      <Theme name="light">
        <SafeAreaView style={styles.container}>
          <StatusBar style="auto" />

          <YStack flex={1} backgroundColor="$background">
            {/* Main Content */}
            <YStack flex={1}>{renderScreen()}</YStack>

            {/* Bottom Navigation */}
            <XStack
              borderTopWidth={1}
              borderColor="$borderColor"
              backgroundColor="$background"
              paddingVertical="$3"
              paddingHorizontal="$4"
              gap="$2"
            >
              <Button
                flex={1}
                size="$4"
                backgroundColor={
                  currentScreen === 'home' ? '$primary' : '$backgroundPress'
                }
                color={currentScreen === 'home' ? '$background' : '$color'}
                borderRadius="$md"
                onPress={() => setCurrentScreen('home')}
              >
                🏠
              </Button>
              <Button
                flex={1}
                size="$4"
                backgroundColor={
                  currentScreen === 'meditation' ? '$primary' : '$backgroundPress'
                }
                color={currentScreen === 'meditation' ? '$background' : '$color'}
                borderRadius="$md"
                onPress={() => setCurrentScreen('meditation')}
              >
                🧘
              </Button>
              <Button
                flex={1}
                size="$4"
                backgroundColor={
                  currentScreen === 'quotes' ? '$primary' : '$backgroundPress'
                }
                color={currentScreen === 'quotes' ? '$background' : '$color'}
                borderRadius="$md"
                onPress={() => setCurrentScreen('quotes')}
              >
                💭
              </Button>
              <Button
                flex={1}
                size="$4"
                backgroundColor={
                  currentScreen === 'settings' ? '$primary' : '$backgroundPress'
                }
                color={currentScreen === 'settings' ? '$background' : '$color'}
                borderRadius="$md"
                onPress={() => setCurrentScreen('settings')}
              >
                ⚙️
              </Button>
            </XStack>
          </YStack>
        </SafeAreaView>
      </Theme>
    </TamaguiProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

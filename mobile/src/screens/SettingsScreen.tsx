import React from 'react';
import { YStack, XStack, H2, H4, Text, Button, Switch } from 'tamagui';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'pl', name: 'Polski' },
  { code: 'es', name: 'Español' },
  { code: 'de', name: 'Deutsch' },
  { code: 'fr', name: 'Français' },
  { code: 'hi', name: 'हिन्दी' },
];

interface SettingsScreenProps {
  isDark: boolean;
  onToggleDark: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ isDark, onToggleDark }) => {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
  };

  return (
    <ScrollView>
      <YStack flex={1} p="$6" gap="$6" background="$background">
        <H2 size="$8" fontWeight="400" color="$color" pt="$4">
          {t('settings.title')}
        </H2>

        {/* Language Selection */}
        <YStack gap="$3">
          <H4 size="$5" fontWeight="500" color="$color">
            {t('settings.language')}
          </H4>
          <YStack gap="$2">
            {LANGUAGES.map((lang) => (
              <Button
                key={lang.code}
                size="$4"
                background={
                  i18n.language === lang.code ? '$primary' : '$backgroundPress'
                }
                color={i18n.language === lang.code ? '$background' : '$color'}
                br="$md"
                justifyContent="flex-start"
                onPress={() => handleLanguageChange(lang.code)}
                borderWidth={1}
                borderColor="$borderColor"
              >
                {lang.name}
              </Button>
            ))}
          </YStack>
        </YStack>

        {/* Theme Toggle */}
        <YStack gap="$3">
          <H4 size="$5" fontWeight="500" color="$color">
            {t('settings.theme')}
          </H4>
          <XStack
            justifyContent="space-between"
            alignItems="center"
            p="$4"
            background="$backgroundPress"
            br="$md"
            borderWidth={1}
            borderColor="$borderColor"
          >
            <Text fontSize="$4" color="$color">
              {isDark ? t('settings.dark') : t('settings.light')}
            </Text>
            <Switch
              size="$3"
              checked={isDark}
              onCheckedChange={onToggleDark}
            >
              <Switch.Thumb animation="quick" />
            </Switch>
          </XStack>
        </YStack>

        {/* About Section */}
        <YStack gap="$3" mt="$6">
          <H4 size="$5" fontWeight="500" color="$color">
            {t('settings.about')}
          </H4>
          <YStack
            p="$4"
            background="$backgroundPress"
            br="$md"
            gap="$2"
            borderWidth={1}
            borderColor="$borderColor"
          >
            <Text fontSize="$4" fontWeight="600" color="$color">
              {t('app.name')}
            </Text>
            <Text fontSize="$3" color="$placeholderColor">
              {t('app.tagline')}
            </Text>
            <Text fontSize="$2" color="$placeholderColor" mt="$2">
              Version 1.0.0
            </Text>
          </YStack>
        </YStack>
      </YStack>
    </ScrollView>
  );
};

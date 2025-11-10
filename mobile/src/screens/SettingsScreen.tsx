import React from 'react';
import { YStack, XStack, H2, H4, Text, Button, Select, Switch } from 'tamagui';
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

export const SettingsScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isDark, setIsDark] = React.useState(false);

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
  };

  return (
    <ScrollView>
      <YStack flex={1} padding="$6" gap="$6" backgroundColor="$background">
        <H2 size="$8" fontWeight="400" color="$color" paddingTop="$4">
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
                backgroundColor={
                  i18n.language === lang.code ? '$primary' : '$backgroundPress'
                }
                color={i18n.language === lang.code ? '$background' : '$color'}
                borderRadius="$md"
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
            padding="$4"
            backgroundColor="$backgroundPress"
            borderRadius="$md"
            borderWidth={1}
            borderColor="$borderColor"
          >
            <Text size="$4" color="$color">
              {isDark ? t('settings.dark') : t('settings.light')}
            </Text>
            <Switch
              size="$3"
              checked={isDark}
              onCheckedChange={setIsDark}
            >
              <Switch.Thumb animation="quick" />
            </Switch>
          </XStack>
        </YStack>

        {/* About Section */}
        <YStack gap="$3" marginTop="$6">
          <H4 size="$5" fontWeight="500" color="$color">
            {t('settings.about')}
          </H4>
          <YStack
            padding="$4"
            backgroundColor="$backgroundPress"
            borderRadius="$md"
            gap="$2"
            borderWidth={1}
            borderColor="$borderColor"
          >
            <Text size="$4" fontWeight="600" color="$color">
              {t('app.name')}
            </Text>
            <Text size="$3" color="$placeholderColor">
              {t('app.tagline')}
            </Text>
            <Text size="$2" color="$placeholderColor" marginTop="$2">
              Version 1.0.0
            </Text>
          </YStack>
        </YStack>
      </YStack>
    </ScrollView>
  );
};

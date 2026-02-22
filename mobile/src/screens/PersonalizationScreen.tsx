/**
 * PersonalizationScreen
 *
 * Beautiful screen for customizing app appearance.
 * Single compact color palette + color picker + additional personalization options.
 */

import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Switch,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import ColorPicker, { Panel1, HueSlider, Preview } from 'reanimated-color-picker';
import { GradientBackground } from '../components/GradientBackground';
import { GradientCard } from '../components/GradientCard';
import theme, { getThemeColors, getThemeGradients } from '../theme';
import {
  usePersonalization,
  COLOR_THEMES,
  generateGradientFromColor,
} from '../contexts/PersonalizationContext';

// All predefined colors in a flat array for compact display
const ALL_THEME_COLORS = Object.entries(COLOR_THEMES).map(([key, value]) => ({
  key: key as keyof typeof COLOR_THEMES,
  ...value,
}));

interface PersonalizationScreenProps {
  isDark: boolean;
  onBack: () => void;
}

export const PersonalizationScreen: React.FC<PersonalizationScreenProps> = ({
  isDark,
  onBack,
}) => {
  const { t } = useTranslation();
  const {
    settings,
    setColorTheme,
    setCustomTheme,
    setAnimationsEnabled,
    setZenMode,
    currentTheme,
  } = usePersonalization();

  // Color picker modal state
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [pickerColor, setPickerColor] = useState(currentTheme.primary);

  // Get theme-aware colors and gradients
  const colors = useMemo(() => getThemeColors(isDark), [isDark]);
  const themeGradients = useMemo(() => getThemeGradients(isDark), [isDark]);

  // Dynamic styles based on theme
  const dynamicStyles = useMemo(
    () => ({
      title: { color: colors.text.primary },
      subtitle: { color: colors.text.secondary },
      cardShadow: isDark
        ? {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 6,
          }
        : {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.1,
            shadowRadius: 16,
            elevation: 8,
          },
      optionBg: isDark
        ? colors.neutral.charcoal[200]
        : colors.neutral.lightGray[50],
      settingRowBg: isDark
        ? colors.neutral.charcoal[200]
        : colors.neutral.lightGray[100],
    }),
    [colors, isDark]
  );

  const handleSelectTheme = async (themeKey: keyof typeof COLOR_THEMES) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await setColorTheme(themeKey);
  };

  const handleOpenColorPicker = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPickerColor(settings.colorTheme === 'custom' && settings.customTheme
      ? settings.customTheme.primary
      : currentTheme.primary);
    setShowColorPicker(true);
  };

  const handleApplyCustomColor = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await setCustomTheme(pickerColor, t('personalization.customThemeName', 'Custom'));
    setShowColorPicker(false);
  };

  // Preview gradient for picker
  const pickerPreviewGradient = useMemo(() => {
    return generateGradientFromColor(pickerColor);
  }, [pickerColor]);

  return (
    <GradientBackground
      gradient={themeGradients.screen.home}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <Ionicons
            name="chevron-back"
            size={28}
            color={colors.text.primary}
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, dynamicStyles.title]}>
          {t('personalization.title', 'Personalization')}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Preview Card */}
        <GradientCard
          gradient={themeGradients.card.whiteCard}
          style={[styles.card, dynamicStyles.cardShadow]}
          isDark={isDark}
        >
          <Text style={[styles.sectionTitle, dynamicStyles.title]}>
            {t('personalization.preview', 'Preview')}
          </Text>

          {/* Live Preview */}
          <View style={styles.previewContainer}>
            <LinearGradient
              colors={[...currentTheme.gradient]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.previewGradient}
            >
              <View style={styles.previewContent}>
                <View style={styles.previewIcon}>
                  <Ionicons name="leaf" size={28} color="#FFFFFF" />
                </View>
                <Text style={styles.previewText}>
                  {t('personalization.sampleButton', 'Meditate')}
                </Text>
              </View>
            </LinearGradient>

            {/* Preview elements row */}
            <View style={styles.previewElements}>
              <View
                style={[
                  styles.previewChip,
                  { backgroundColor: `${currentTheme.primary}20` },
                ]}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={14}
                  color={currentTheme.primary}
                />
                <Text style={[styles.previewChipText, { color: currentTheme.primary }]}>
                  {t('personalization.active', 'Active')}
                </Text>
              </View>
              <View
                style={[
                  styles.previewDot,
                  { backgroundColor: currentTheme.primary },
                ]}
              />
              <View
                style={[
                  styles.previewBar,
                  { backgroundColor: currentTheme.primary },
                ]}
              />
            </View>
          </View>
        </GradientCard>

        {/* Color Theme Selection - Single Card */}
        <GradientCard
          gradient={themeGradients.card.whiteCard}
          style={[styles.card, dynamicStyles.cardShadow]}
          isDark={isDark}
        >
          <View style={styles.colorSectionHeader}>
            <Text style={[styles.sectionTitle, dynamicStyles.title]}>
              {t('personalization.colorTheme', 'Color Theme')}
            </Text>
            {/* Custom color picker button */}
            <TouchableOpacity
              style={[
                styles.pickerButton,
                { backgroundColor: `${currentTheme.primary}15` },
              ]}
              onPress={handleOpenColorPicker}
              activeOpacity={0.7}
            >
              <Ionicons name="color-palette" size={18} color={currentTheme.primary} />
              <Text style={[styles.pickerButtonText, { color: currentTheme.primary }]}>
                {t('personalization.customColor', 'Custom')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Compact colors grid */}
          <View style={styles.colorsGrid}>
            {ALL_THEME_COLORS.map((themeOption) => {
              const isSelected = settings.colorTheme === themeOption.key;

              return (
                <TouchableOpacity
                  key={themeOption.key}
                  style={[
                    styles.colorCircle,
                    isSelected && styles.colorCircleSelected,
                  ]}
                  onPress={() => handleSelectTheme(themeOption.key)}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={[...themeOption.gradient]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.colorCircleGradient}
                  >
                    {isSelected && (
                      <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              );
            })}

            {/* Custom color circle */}
            {settings.colorTheme === 'custom' && settings.customTheme && (
              <TouchableOpacity
                style={[styles.colorCircle, styles.colorCircleSelected]}
                onPress={handleOpenColorPicker}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={[...settings.customTheme.gradient]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.colorCircleGradient}
                >
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        </GradientCard>

        {/* Animations Setting */}
        <GradientCard
          gradient={themeGradients.card.whiteCard}
          style={[styles.card, dynamicStyles.cardShadow]}
          isDark={isDark}
        >
          <Text style={[styles.sectionTitle, dynamicStyles.title]}>
            {t('personalization.additionalSettings', 'Additional Settings')}
          </Text>

          {/* Animations */}
          <View style={[styles.settingRow, { backgroundColor: dynamicStyles.settingRowBg }]}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: `${currentTheme.primary}15` }]}>
                <Ionicons name="sparkles-outline" size={20} color={currentTheme.primary} />
              </View>
              <View>
                <Text style={[styles.settingTitle, dynamicStyles.title]}>
                  {t('personalization.animations', 'Animations')}
                </Text>
                <Text style={[styles.settingDescription, dynamicStyles.subtitle]}>
                  {t('personalization.animationsDesc', 'Smooth transitions and effects')}
                </Text>
              </View>
            </View>
            <Switch
              value={settings.animationsEnabled}
              onValueChange={async (value) => {
                if (settings.hapticEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                await setAnimationsEnabled(value);
              }}
              trackColor={{ false: colors.neutral.gray[300], true: `${currentTheme.primary}60` }}
              thumbColor={settings.animationsEnabled ? currentTheme.primary : colors.neutral.gray[100]}
            />
          </View>

          {/* Zen Mode */}
          <View style={[styles.settingRow, { backgroundColor: dynamicStyles.settingRowBg }]}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: `${currentTheme.primary}15` }]}>
                <Ionicons name="leaf-outline" size={20} color={currentTheme.primary} />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingTitle, dynamicStyles.title]}>
                  {t('personalization.zenMode', 'Zen Mode')}
                </Text>
                <Text style={[styles.settingDescription, dynamicStyles.subtitle]}>
                  {t('personalization.zenModeDesc', 'Hide UI during meditation, focus only on breathing')}
                </Text>
              </View>
            </View>
            <Switch
              value={settings.zenMode}
              onValueChange={async (value) => {
                if (settings.hapticEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                await setZenMode(value);
              }}
              trackColor={{ false: colors.neutral.gray[300], true: `${currentTheme.primary}60` }}
              thumbColor={settings.zenMode ? currentTheme.primary : colors.neutral.gray[100]}
            />
          </View>
        </GradientCard>

        {/* Info Card */}
        <GradientCard
          gradient={themeGradients.card.whiteCard}
          style={[styles.card, dynamicStyles.cardShadow]}
          isDark={isDark}
        >
          <View style={styles.infoRow}>
            <View
              style={[
                styles.infoIcon,
                { backgroundColor: `${currentTheme.primary}15` },
              ]}
            >
              <Ionicons
                name="information-circle"
                size={24}
                color={currentTheme.primary}
              />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={[styles.infoTitle, dynamicStyles.title]}>
                {t('personalization.infoTitle', 'How does it work?')}
              </Text>
              <Text style={[styles.infoDescription, dynamicStyles.subtitle]}>
                {t(
                  'personalization.infoDescription',
                  'The selected color will be used in buttons, icons, and accents. The change is instant and works in both light and dark modes.'
                )}
              </Text>
            </View>
          </View>
        </GradientCard>
      </ScrollView>

      {/* Color Picker Modal */}
      <Modal
        visible={showColorPicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowColorPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[
            styles.modalContent,
            { backgroundColor: isDark ? colors.neutral.charcoal[300] : colors.neutral.white }
          ]}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, dynamicStyles.title]}>
                {t('personalization.pickColor', 'Pick a color')}
              </Text>
              <TouchableOpacity
                onPress={() => setShowColorPicker(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>

            {/* Color Picker */}
            <ColorPicker
              value={pickerColor}
              onComplete={(color) => setPickerColor(color.hex)}
              style={styles.colorPicker}
            >
              <Preview style={styles.pickerPreview} />
              <Panel1 style={styles.pickerPanel} />
              <HueSlider style={styles.pickerHueSlider} />
            </ColorPicker>

            {/* Preview of selected color */}
            <View style={styles.modalPreview}>
              <LinearGradient
                colors={[...pickerPreviewGradient]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.modalPreviewGradient}
              >
                <Ionicons name="leaf" size={20} color="#FFFFFF" />
              </LinearGradient>
              <Text style={[styles.modalPreviewText, { color: pickerColor }]}>
                {pickerColor.toUpperCase()}
              </Text>
            </View>

            {/* Apply Button */}
            <TouchableOpacity
              style={[styles.applyButton, { backgroundColor: pickerColor }]}
              onPress={handleApplyCustomColor}
              activeOpacity={0.8}
            >
              <Text style={styles.applyButtonText}>
                {t('personalization.apply', 'Apply')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: '600',
  },
  headerSpacer: {
    width: 44,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxxl,
    gap: theme.spacing.md,
  },
  card: {
    // padding handled by GradientCard
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: '600',
    marginBottom: theme.spacing.md,
  },
  // Preview styles
  previewContainer: {
    gap: theme.spacing.md,
  },
  previewGradient: {
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  previewContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  previewIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewText: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  previewElements: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.md,
  },
  previewChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    gap: 4,
  },
  previewChipText: {
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: '600',
  },
  previewDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  previewBar: {
    width: 50,
    height: 5,
    borderRadius: 2.5,
  },
  // Color section styles
  colorSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    gap: 4,
  },
  pickerButtonText: {
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: '600',
  },
  // Compact colors grid
  colorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    padding: 2,
  },
  colorCircleSelected: {
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.2)',
  },
  colorCircleGradient: {
    flex: 1,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Settings styles
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.sm,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    flex: 1,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: '600',
  },
  settingDescription: {
    fontSize: theme.typography.fontSizes.xs,
    marginTop: 2,
  },
  // Info row styles
  infoRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  infoIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: theme.typography.fontSizes.xs,
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.xs,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxxl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  modalTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: '600',
  },
  modalCloseButton: {
    padding: theme.spacing.xs,
  },
  colorPicker: {
    gap: theme.spacing.md,
  },
  pickerPreview: {
    height: 50,
    borderRadius: theme.borderRadius.lg,
  },
  pickerPanel: {
    height: 200,
    borderRadius: theme.borderRadius.lg,
  },
  pickerHueSlider: {
    height: 30,
    borderRadius: theme.borderRadius.full,
  },
  modalPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  modalPreviewGradient: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalPreviewText: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: '700',
    letterSpacing: 1,
  },
  applyButton: {
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: theme.typography.fontSizes.md,
    fontWeight: '600',
  },
});

export default PersonalizationScreen;

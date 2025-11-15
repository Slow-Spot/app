import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Animated, ScrollView, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { GradientBackground } from './GradientBackground';
import { GradientButton } from './GradientButton';
import { api, Quote } from '../services/api';
import theme, { gradients } from '../theme';

interface CelebrationScreenProps {
  durationMinutes: number;
  sessionTitle: string;
  onContinue: (mood?: MoodRating) => void;
}

type MoodRating = 1 | 2 | 3 | 4 | 5;

const moodEmojis: Record<MoodRating, string> = {
  1: '😔',
  2: '😐',
  3: '🙂',
  4: '😊',
  5: '😄',
};

const moodLabels: Record<MoodRating, { en: string; pl: string }> = {
  1: { en: 'Difficult', pl: 'Trudno' },
  2: { en: 'Okay', pl: 'W porządku' },
  3: { en: 'Good', pl: 'Dobrze' },
  4: { en: 'Great', pl: 'Świetnie' },
  5: { en: 'Excellent', pl: 'Wspaniale' },
};

export const CelebrationScreen: React.FC<CelebrationScreenProps> = ({
  durationMinutes,
  sessionTitle,
  onContinue,
}) => {
  const { t, i18n } = useTranslation();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMood, setSelectedMood] = useState<MoodRating | null>(null);
  const [notes, setNotes] = useState('');
  const [scaleAnim] = useState(new Animated.Value(0));
  const [pulseAnim] = useState(new Animated.Value(1));
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    loadQuote();

    // Animate checkmark entrance
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 40,
      friction: 8,
      useNativeDriver: true,
    }).start();

    // Fade in content
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      delay: 200,
      useNativeDriver: true,
    }).start();

    // Pulsing glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const loadQuote = async () => {
    try {
      setLoading(true);
      const randomQuote = await api.quotes.getRandom(i18n.language);
      setQuote(randomQuote);
    } catch (error) {
      console.error('Failed to load quote:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMoodSelect = (mood: MoodRating) => {
    setSelectedMood(mood);
  };

  const handleContinue = () => {
    onContinue(selectedMood || undefined);
  };

  return (
    <GradientBackground gradient={gradients.primary.subtleBlue} style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Compact header with checkmark and title in one line */}
        <Animated.View style={[styles.headerSection, { opacity: fadeAnim }]}>
          <Animated.View
            style={[
              styles.compactCheckmark,
              { transform: [{ scale: scaleAnim }] },
            ]}
          >
            <LinearGradient
              colors={[theme.colors.accent.mint[400], theme.colors.accent.mint[600]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.checkmarkSmall}
            >
              <Ionicons
                name="checkmark"
                size={32}
                color={theme.colors.neutral.white}
              />
            </LinearGradient>
          </Animated.View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.titleText}>
              {t('meditation.wellDone') || 'Świetna robota!'}
            </Text>
            <Text style={styles.subtitleText}>
              {t('meditation.completedSession') || 'Ukończyłeś sesję medytacji'}
            </Text>
          </View>
        </Animated.View>

        {/* Beautiful stats card with glass morphism */}
        <Animated.View style={[styles.statsCard, { opacity: fadeAnim }]}>
          <View style={styles.statsContent}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>
                {t('meditation.session')}
              </Text>
              <Text style={styles.statValue}>
                {sessionTitle}
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>
                {t('meditation.duration')}
              </Text>
              <Text style={styles.statValue}>
                {t('meditation.minutes', { count: durationMinutes })}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Elegant mood rating section */}
        <Animated.View style={[styles.moodSection, { opacity: fadeAnim }]}>
          <Text style={styles.moodQuestion}>
            {t('meditation.howDoYouFeel') || 'How do you feel?'}
          </Text>
          <View style={styles.moodOptions}>
            {([1, 2, 3, 4, 5] as MoodRating[]).map((mood) => (
              <TouchableOpacity
                key={mood}
                style={[
                  styles.moodOption,
                  selectedMood === mood && styles.moodOptionSelected,
                ]}
                onPress={() => handleMoodSelect(mood)}
                activeOpacity={0.8}
              >
                <View style={[
                  styles.moodCircle,
                  selectedMood === mood && styles.moodCircleSelected,
                ]}>
                  <Text style={styles.moodEmoji}>{moodEmojis[mood]}</Text>
                </View>
                <Text style={[
                  styles.moodLabel,
                  selectedMood === mood && styles.moodLabelSelected,
                ]}>
                  {moodLabels[mood][i18n.language as 'en' | 'pl'] || moodLabels[mood].en}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Notes section */}
        <Animated.View style={[styles.notesSection, { opacity: fadeAnim }]}>
          <Text style={styles.notesLabel}>
            {t('meditation.sessionNotes', 'Notatki z sesji (opcjonalnie)')}
          </Text>
          <TextInput
            style={styles.notesInput}
            placeholder={t('meditation.notesPlaceholder', 'Jak się czujesz? Jakie masz przemyślenia?')}
            placeholderTextColor={theme.colors.neutral.gray[400]}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
            maxLength={500}
          />
        </Animated.View>

        {/* Elegant quote section - Only if loaded successfully */}
        {!loading && quote && quote.text && (
          <Animated.View style={[styles.quoteSection, { opacity: fadeAnim }]}>
            <View style={styles.quoteContainer}>
              <Text style={styles.quoteText}>
                "{quote.text}"
              </Text>
              {quote.author && (
                <Text style={styles.authorText}>
                  — {quote.author}
                </Text>
              )}
            </View>
          </Animated.View>
        )}

        {/* Continue button with fade-in */}
        <Animated.View style={[styles.buttonContainer, { opacity: fadeAnim }]}>
          <GradientButton
            title={t('meditation.continue') || 'Continue'}
            gradient={gradients.button.primary}
            onPress={handleContinue}
            size="lg"
          />
        </Animated.View>
      </ScrollView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xxl,
    paddingBottom: theme.spacing.xxxl,
    gap: theme.spacing.xl,
    alignItems: 'center',
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  compactCheckmark: {
    ...theme.shadows.md,
  },
  checkmarkSmall: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
  },
  titleText: {
    fontSize: 28,
    fontWeight: '600',
    color: theme.colors.text.primary,
    letterSpacing: 0.3,
  },
  subtitleText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
    fontWeight: '400',
    letterSpacing: 0.2,
    opacity: 0.85,
    marginTop: 2,
  },
  statsCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 28,
    padding: theme.spacing.xl,
    ...theme.shadows.lg,
  },
  statsContent: {
    gap: theme.spacing.md,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
  },
  statDivider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
    marginVertical: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
    fontWeight: '500',
    letterSpacing: 0.2,
    opacity: 0.75,
  },
  statValue: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: '600',
    color: theme.colors.text.primary,
    letterSpacing: 0.2,
  },
  moodSection: {
    width: '100%',
    gap: theme.spacing.lg,
  },
  moodQuestion: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: '500',
    textAlign: 'center',
    color: theme.colors.text.primary,
    letterSpacing: 0.3,
  },
  moodOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  moodOption: {
    flex: 1,
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  moodCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    ...theme.shadows.sm,
  },
  moodCircleSelected: {
    backgroundColor: `${theme.colors.accent.mint[600]}26`,
    borderColor: theme.colors.accent.mint[600],
    borderWidth: 3,
    ...theme.shadows.md,
  },
  moodEmoji: {
    fontSize: 30,
  },
  moodLabel: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: 0.2,
    opacity: 0.8,
  },
  moodLabelSelected: {
    color: theme.colors.accent.mint[600],
    fontWeight: '600',
    opacity: 1,
  },
  notesSection: {
    width: '100%',
    gap: theme.spacing.sm,
  },
  notesLabel: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: '500',
    color: theme.colors.text.primary,
    letterSpacing: 0.2,
    marginBottom: theme.spacing.xs,
  },
  notesInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
    padding: theme.spacing.lg,
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text.primary,
    minHeight: 100,
    textAlignVertical: 'top',
    ...theme.shadows.sm,
  },
  quoteSection: {
    width: '100%',
    alignItems: 'center',
  },
  quoteContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  quoteText: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.md,
    color: theme.colors.text.primary,
    letterSpacing: 0.2,
  },
  authorText: {
    fontSize: theme.typography.fontSizes.sm,
    fontStyle: 'italic',
    textAlign: 'center',
    color: theme.colors.text.secondary,
    fontWeight: '500',
    letterSpacing: 0.2,
    opacity: 0.85,
  },
  buttonContainer: {
    width: '100%',
  },
});

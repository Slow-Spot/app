import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Animated } from 'react-native';
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
    <GradientBackground gradient={gradients.screen.celebration} style={styles.container}>
      <View style={styles.content}>
        {/* Ultra-modern animated checkmark with halos */}
        <View style={styles.checkmarkContainer}>
          {/* Outer pulsing halo */}
          <Animated.View
            style={[
              styles.haloOuter,
              {
                transform: [{ scale: pulseAnim }],
                opacity: pulseAnim.interpolate({
                  inputRange: [1, 1.15],
                  outputRange: [0.1, 0.05],
                }),
              },
            ]}
          />

          {/* Middle halo */}
          <Animated.View
            style={[
              styles.haloMiddle,
              {
                transform: [{ scale: pulseAnim }],
                opacity: 0.15,
              },
            ]}
          />

          {/* Main checkmark */}
          <Animated.View
            style={[
              styles.iconContainer,
              { transform: [{ scale: scaleAnim }] },
            ]}
          >
            <LinearGradient
              colors={['#6EE7B7', '#34D399', '#10B981']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.checkmarkGradient}
            >
              <Ionicons
                name="checkmark"
                size={56}
                color="#FFFFFF"
                style={styles.checkmarkIcon}
              />
            </LinearGradient>
          </Animated.View>
        </View>

        {/* Congratulations message with fade-in */}
        <Animated.View style={[styles.messageSection, { opacity: fadeAnim }]}>
          <Text style={styles.titleText}>
            {t('meditation.wellDone') || 'Well Done!'}
          </Text>
          <Text style={styles.subtitleText}>
            {t('meditation.completedSession') || 'You completed your meditation session'}
          </Text>
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

        {/* Elegant quote section */}
        <Animated.View style={[styles.quoteSection, { opacity: fadeAnim }]}>
          {loading ? (
            <ActivityIndicator size="small" color={theme.colors.accent.mint[500]} />
          ) : quote ? (
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
          ) : null}
        </Animated.View>

        {/* Continue button with fade-in */}
        <Animated.View style={[styles.buttonContainer, { opacity: fadeAnim }]}>
          <GradientButton
            title={t('meditation.continue') || 'Continue'}
            gradient={gradients.button.primary}
            onPress={handleContinue}
            size="lg"
          />
        </Animated.View>
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.xxl,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  checkmarkContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: theme.spacing.lg,
  },
  haloOuter: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#10B981',
  },
  haloMiddle: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#10B981',
  },
  iconContainer: {
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  checkmarkGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkIcon: {
    fontWeight: 'bold',
  },
  messageSection: {
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  titleText: {
    fontSize: 42,
    fontWeight: '300',
    textAlign: 'center',
    color: theme.colors.text.primary,
    letterSpacing: 0.5,
  },
  subtitleText: {
    fontSize: theme.typography.fontSizes.md,
    textAlign: 'center',
    color: theme.colors.text.secondary,
    fontWeight: '400',
    letterSpacing: 0.3,
    opacity: 0.85,
  },
  statsCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 28,
    padding: theme.spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
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
    paddingVertical: theme.spacing.md,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  moodCircleSelected: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: '#10B981',
    borderWidth: 3,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
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
    color: '#10B981',
    fontWeight: '600',
    opacity: 1,
  },
  quoteSection: {
    width: '100%',
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  quoteContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 24,
    padding: theme.spacing.xl,
    gap: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  quoteText: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.md,
    color: theme.colors.text.primary,
    letterSpacing: 0.2,
    opacity: 0.9,
  },
  authorText: {
    fontSize: theme.typography.fontSizes.sm,
    fontStyle: 'italic',
    textAlign: 'center',
    color: theme.colors.text.secondary,
    fontWeight: '400',
    letterSpacing: 0.3,
    opacity: 0.7,
  },
  buttonContainer: {
    width: '100%',
    paddingTop: theme.spacing.sm,
  },
});

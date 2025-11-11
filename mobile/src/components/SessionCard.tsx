import React from 'react';
import { View, Text, StyleSheet, useColorScheme, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { MeditationSession } from '../services/api';

interface SessionCardProps {
  session: MeditationSession;
  onPress: () => void;
}

const getLevelLabel = (level: number): string => {
  const levels = ['beginner', 'intermediate', 'advanced', 'expert', 'master'];
  return levels[level - 1] || 'beginner';
};

const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  return `${minutes} min`;
};

export const SessionCard: React.FC<SessionCardProps> = ({ session, onPress }) => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <TouchableOpacity
      style={[styles.card, isDark ? styles.darkCard : styles.lightCard]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Card Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={[styles.title, isDark ? styles.darkText : styles.lightText]}>
            {session.title}
          </Text>
          {session.description && (
            <Text style={[styles.description, isDark ? styles.darkPlaceholder : styles.lightPlaceholder]}>
              {session.description}
            </Text>
          )}
        </View>
      </View>

      {/* Card Footer */}
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={[styles.label, isDark ? styles.darkText : styles.lightText]}>
                {t('meditation.duration')}:
              </Text>
              <Text style={[styles.value, isDark ? styles.darkText : styles.lightText]}>
                {formatDuration(session.durationSeconds)}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.label, isDark ? styles.darkText : styles.lightText]}>
                {t('meditation.level')}:
              </Text>
              <Text style={[styles.value, isDark ? styles.darkText : styles.lightText]}>
                {t(`meditation.${getLevelLabel(session.level)}`)}
              </Text>
            </View>
          </View>

          <View style={styles.button}>
            <Text style={styles.buttonText}>
              {t('meditation.start')}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lightCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E5E5',
  },
  darkCard: {
    backgroundColor: '#2C2C2E',
    borderColor: '#3A3A3C',
  },
  header: {
    padding: 16,
  },
  headerContent: {
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
  },
  lightText: {
    color: '#000000',
  },
  darkText: {
    color: '#FFFFFF',
  },
  lightPlaceholder: {
    color: '#8E8E93',
  },
  darkPlaceholder: {
    color: '#8E8E93',
  },
  footer: {
    padding: 16,
    paddingTop: 0,
  },
  footerContent: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailsContainer: {
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 12,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});

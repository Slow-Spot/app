/**
 * ScheduleReminderModal - Modal for scheduling daily meditation reminders
 *
 * Allows users to set a daily reminder time for their meditation practice.
 * Features time picker and frequency options with clean UI.
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { GradientCard } from './GradientCard';
import { GradientButton } from './GradientButton';
import theme, { gradients } from '../theme';

interface ScheduleReminderModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (time: string) => void;
  initialTime?: string; // Format: "HH:mm"
}

export const ScheduleReminderModal: React.FC<ScheduleReminderModalProps> = ({
  visible,
  onClose,
  onSave,
  initialTime,
}) => {
  const { t } = useTranslation();

  // Initialize time from initialTime or default to 9:00 AM
  const getInitialDate = () => {
    const now = new Date();
    if (initialTime) {
      const [hours, minutes] = initialTime.split(':').map(Number);
      now.setHours(hours, minutes, 0, 0);
    } else {
      now.setHours(9, 0, 0, 0); // Default 9:00 AM
    }
    return now;
  };

  const [selectedTime, setSelectedTime] = useState<Date>(getInitialDate());
  const [showPicker, setShowPicker] = useState(Platform.OS === 'ios');

  /**
   * Handle time change from picker
   */
  const handleTimeChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }

    if (date) {
      setSelectedTime(date);
    }
  };

  /**
   * Format time for display (e.g., "9:00 AM")
   */
  const formatTimeDisplay = (date: Date): string => {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  /**
   * Format time for storage (HH:mm 24-hour format)
   */
  const formatTimeForStorage = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  /**
   * Handle save button press
   */
  const handleSave = () => {
    const timeString = formatTimeForStorage(selectedTime);
    onSave(timeString);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <GradientCard
          gradient={gradients.card.lightCard}
          style={styles.modalCard}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Ionicons
                name="time-outline"
                size={32}
                color={theme.colors.accent.blue[600]}
              />
            </View>
            <Text style={styles.title}>{t('calendar.scheduleReminder')}</Text>
            <Text style={styles.subtitle}>{t('calendar.selectTime')}</Text>
          </View>

          {/* Time Display */}
          <View style={styles.timeDisplay}>
            <Text style={styles.timeLabel}>{t('calendar.daily')}</Text>
            <Text style={styles.timeValue}>{formatTimeDisplay(selectedTime)}</Text>
          </View>

          {/* Time Picker */}
          {Platform.OS === 'android' && !showPicker && (
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowPicker(true)}
              accessibilityLabel={t('calendar.selectTime')}
              accessibilityRole="button"
            >
              <Ionicons
                name="time"
                size={24}
                color={theme.colors.accent.blue[600]}
              />
              <Text style={styles.pickerButtonText}>
                {t('calendar.selectTime')}
              </Text>
            </TouchableOpacity>
          )}

          {(showPicker || Platform.OS === 'ios') && (
            <View style={styles.pickerContainer}>
              <DateTimePicker
                value={selectedTime}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleTimeChange}
                textColor={theme.colors.text.primary}
                style={styles.picker}
              />
            </View>
          )}

          {/* Frequency Info */}
          <View style={styles.frequencyInfo}>
            <View style={styles.frequencyRow}>
              <Ionicons
                name="repeat"
                size={20}
                color={theme.colors.accent.mint[600]}
              />
              <Text style={styles.frequencyText}>
                {t('calendar.daily')}
              </Text>
            </View>
            <Text style={styles.frequencyDescription}>
              {t('calendar.reminderSet')}
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              accessibilityLabel={t('calendar.cancel')}
              accessibilityRole="button"
            >
              <Text style={styles.cancelButtonText}>
                {t('calendar.cancel')}
              </Text>
            </TouchableOpacity>

            <GradientButton
              title={t('calendar.save')}
              onPress={handleSave}
              gradient={gradients.button.primary}
              style={styles.saveButton}
              icon="checkmark-circle"
            />
          </View>
        </GradientCard>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: theme.spacing.lg,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalCard: {
    width: '100%',
    maxWidth: 400,
    padding: theme.spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.accent.blue[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSizes.xxl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  timeDisplay: {
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.accent.blue[50],
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
  },
  timeLabel: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: theme.spacing.xs,
  },
  timeValue: {
    fontSize: theme.typography.fontSizes.display,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.accent.blue[600],
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
  },
  pickerButtonText: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.accent.blue[600],
  },
  pickerContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  picker: {
    width: '100%',
    height: Platform.OS === 'ios' ? 200 : 50,
  },
  frequencyInfo: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.accent.mint[50],
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.xl,
  },
  frequencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  frequencyText: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: theme.colors.accent.mint[700],
  },
  frequencyDescription: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.lg + theme.spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  cancelButton: {
    flex: 1,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
  },
  cancelButtonText: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: theme.colors.text.secondary,
  },
  saveButton: {
    flex: 1,
  },
});

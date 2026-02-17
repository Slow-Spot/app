import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import type { TFunction } from 'i18next';
import { GradientButton } from '../../components/GradientButton';
import { getThemeGradients, getThemeColors } from '../../theme';
import { CustomSession } from '../../services/customSessionStorage';
import { styles } from './meditationScreenStyles';

interface SessionActionModalProps {
  session: CustomSession | null;
  isDark: boolean;
  colors: ReturnType<typeof getThemeColors>;
  themeGradients: ReturnType<typeof getThemeGradients>;
  themePrimary: string;
  t: TFunction;
  onClose: () => void;
  onEdit: (session: CustomSession) => void;
  onDelete: (session: CustomSession) => void;
}

export const SessionActionModal: React.FC<SessionActionModalProps> = ({
  session, isDark, colors, themeGradients, themePrimary, t, onClose, onEdit, onDelete,
}) => {
  return (
    <Modal
      visible={session !== null}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <BlurView intensity={20} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={[
          styles.modalContainer,
          { backgroundColor: isDark ? colors.neutral.charcoal[100] : colors.neutral.white }
        ]}>
          <View style={styles.modalHeader}>
            <View style={[styles.modalIconCircle, { backgroundColor: isDark ? `${themePrimary}40` : `${themePrimary}26` }]}>
              <Ionicons name="leaf" size={28} color={themePrimary} />
            </View>
            <Text style={[styles.modalTitle, { color: colors.text.primary }]}>
              {session?.title}
            </Text>
            <Text style={[styles.modalSubtitle, { color: colors.text.secondary }]}>
              {t('custom.sessionOptions') || 'What would you like to do?'}
            </Text>
          </View>

          <View style={styles.modalActions}>
            <GradientButton
              title={t('custom.editSession') || 'Edit session'}
              gradient={themeGradients.button.primary}
              onPress={() => {
                if (session) {
                  onClose();
                  onEdit(session);
                }
              }}
              style={styles.modalButton}
              size="lg"
              icon={<Ionicons name="pencil" size={20} color="#fff" />}
            />

            <TouchableOpacity
              style={[
                styles.modalDeleteButton,
                { backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.1)' }
              ]}
              onPress={() => {
                if (session) {
                  onClose();
                  onDelete(session);
                }
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
              <Text style={styles.modalDeleteButtonText}>
                {t('custom.deleteSession') || 'Delete session'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modalCancelButton,
                { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }
              ]}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={[styles.modalCancelButtonText, { color: colors.text.secondary }]}>
                {t('common.cancel') || 'Cancel'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

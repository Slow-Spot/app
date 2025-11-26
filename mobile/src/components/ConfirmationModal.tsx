/**
 * ConfirmationModal Component
 *
 * Elegant modal for confirming user actions (e.g., ending a meditation session)
 * Follows the app's mint accent color scheme and supports dark mode
 */

import React, { useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import theme, { getThemeColors } from '../theme';

interface ConfirmationModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  isDark?: boolean;
  destructive?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  icon = 'help-circle-outline',
  isDark = false,
  destructive = false,
}) => {
  const colors = useMemo(() => getThemeColors(isDark), [isDark]);

  const dynamicStyles = useMemo(() => ({
    modalContent: {
      backgroundColor: isDark ? colors.neutral.charcoal[200] : colors.neutral.white,
    },
    title: {
      color: colors.text.primary,
    },
    message: {
      color: colors.text.secondary,
    },
    cancelButton: {
      backgroundColor: isDark ? colors.neutral.charcoal[100] : colors.neutral.lightGray[100],
      borderColor: isDark ? colors.neutral.charcoal[50] : colors.neutral.lightGray[200],
    },
    cancelButtonText: {
      color: colors.text.primary,
    },
    confirmButton: {
      backgroundColor: destructive
        ? '#ef4444'
        : colors.accent.mint[500],
    },
    confirmButtonText: {
      color: colors.neutral.white,
    },
    iconContainer: {
      backgroundColor: destructive
        ? (isDark ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)')
        : (isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)'),
    },
    iconColor: destructive ? '#ef4444' : colors.accent.mint[500],
  }), [colors, isDark, destructive]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <Pressable style={styles.overlay} onPress={onCancel}>
        <BlurView intensity={isDark ? 40 : 20} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />

        <Pressable style={[styles.modalContent, dynamicStyles.modalContent]} onPress={(e) => e.stopPropagation()}>
          {/* Icon */}
          <View style={[styles.iconContainer, dynamicStyles.iconContainer]}>
            <Ionicons name={icon} size={32} color={dynamicStyles.iconColor} />
          </View>

          {/* Title */}
          <Text style={[styles.title, dynamicStyles.title]}>{title}</Text>

          {/* Message */}
          <Text style={[styles.message, dynamicStyles.message]}>{message}</Text>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton, dynamicStyles.cancelButton]}
              onPress={onCancel}
              activeOpacity={0.8}
            >
              <Text style={[styles.buttonText, dynamicStyles.cancelButtonText]}>{cancelText}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.confirmButton, dynamicStyles.confirmButton]}
              onPress={onConfirm}
              activeOpacity={0.8}
            >
              <Text style={[styles.buttonText, dynamicStyles.confirmButtonText]}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: theme.spacing.lg,
  },
  modalContent: {
    width: '100%',
    maxWidth: 340,
    borderRadius: theme.borderRadius.xxl,
    padding: theme.spacing.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 30,
    elevation: 10,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.semiBold,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  message: {
    fontSize: theme.typography.fontSizes.md,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.md,
    marginBottom: theme.spacing.lg,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    borderWidth: 1,
  },
  confirmButton: {
    // backgroundColor set dynamically
  },
  buttonText: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semiBold,
  },
});

export default ConfirmationModal;

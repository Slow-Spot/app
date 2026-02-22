import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { TFunction } from 'i18next';
import type { getThemeGradients } from '../../theme';
import { GradientCard } from '../GradientCard';
import { Icon } from './PreSessionIcon';
import { styles } from './preSessionStyles';
import type { PreSessionDynamicStyles } from './preSessionTypes';

interface ChecklistItemCardProps {
  icon: string;
  title: string;
  description: string;
  isOptional: boolean;
  isCompleted: boolean;
  onToggle: () => void;
  t: TFunction;
  isDark?: boolean;
  themeGradients: ReturnType<typeof getThemeGradients>;
  dynamicStyles: PreSessionDynamicStyles;
}

export const ChecklistItemCard: React.FC<ChecklistItemCardProps> = ({
  icon, title, description, isOptional, isCompleted, onToggle, t, isDark, themeGradients, dynamicStyles,
}) => {
  return (
    <Pressable onPress={onToggle}>
      <GradientCard
        gradient={themeGradients.card.whiteCard}
        style={[styles.checklistCard, dynamicStyles.cardShadow, isCompleted && styles.checklistCardCompleted]}
        isDark={isDark}
      >
        <View style={styles.cardRow}>
          <View style={[
            styles.iconBox,
            { backgroundColor: isCompleted
              ? dynamicStyles.iconBoxBgCompleted
              : dynamicStyles.iconBoxBg
            }
          ]}>
            <Icon name={icon} size={22} color={isCompleted ? dynamicStyles.iconColorCompleted : dynamicStyles.iconColor} />
          </View>
          <View style={styles.cardTextContainer}>
            <View style={styles.checklistTitleRow}>
              <Text style={[styles.cardTitle, dynamicStyles.cardTitle]}>
                {title}
              </Text>
              {isOptional && (
                <Text style={[styles.optionalBadge, dynamicStyles.optionalBadge]}>
                  {t('instructions.preparation.optional') || '(optional)'}
                </Text>
              )}
            </View>
            <Text style={[styles.cardDescription, dynamicStyles.cardDescription]}>
              {description}
            </Text>
          </View>
          <Ionicons
            name={isCompleted ? 'checkmark-circle' : 'ellipse-outline'}
            size={28}
            color={isCompleted ? dynamicStyles.checkboxColor : dynamicStyles.checkboxColorUnchecked}
          />
        </View>
      </GradientCard>
    </Pressable>
  );
};

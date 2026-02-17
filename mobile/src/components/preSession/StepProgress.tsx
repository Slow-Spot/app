import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { TFunction } from 'i18next';
import { neutralColors } from '../../theme/colors';
import { usePersonalization } from '../../contexts/PersonalizationContext';
import { styles } from './preSessionStyles';

interface StepProgressProps {
  currentStep: string;
  t: TFunction;
  isDark?: boolean;
}

export const StepProgress: React.FC<StepProgressProps> = ({ currentStep, t, isDark }) => {
  const { currentTheme } = usePersonalization();
  const steps = ['overview', 'setup', 'breathing', 'intention'];
  const currentIndex = steps.indexOf(currentStep);

  return (
    <View style={styles.progressContainer}>
      {steps.map((step, index) => {
        const isActive = index === currentIndex;
        const isComplete = index < currentIndex;

        return (
          <React.Fragment key={step}>
            <View style={styles.progressDotWrapper}>
              {isActive && (
                <View style={[
                  styles.progressDotGlow,
                  { backgroundColor: isDark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)' }
                ]} />
              )}
              <LinearGradient
                colors={
                  isComplete || isActive
                    ? [...currentTheme.gradient]
                    : isDark
                      ? ['#3A3A4A', '#2A2A3A']
                      : [neutralColors.gray[200], neutralColors.gray[300]]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                  styles.progressDot,
                  isActive && styles.progressDotCurrent,
                ]}
              >
                {isComplete && (
                  <Ionicons name="checkmark" size={10} color="#FFFFFF" />
                )}
              </LinearGradient>
            </View>
            {index < steps.length - 1 && (
              <View style={styles.progressLineWrapper}>
                <View
                  style={[
                    styles.progressLine,
                    { backgroundColor: isDark ? '#2A2A3A' : neutralColors.gray[200] },
                  ]}
                />
                <LinearGradient
                  colors={[...currentTheme.gradient]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[
                    styles.progressLineFilled,
                    { width: isComplete ? '100%' : '0%' },
                  ]}
                />
              </View>
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
};

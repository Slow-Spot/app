import React from 'react';
import { View, Text, StyleSheet, Pressable, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import theme, { GradientDefinition } from '../theme';

interface FeatureTileProps {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  gradient: GradientDefinition;
  onPress: () => void;
  style?: ViewStyle;
}

export const FeatureTile: React.FC<FeatureTileProps> = ({
  title,
  description,
  icon,
  gradient,
  onPress,
  style,
}) => {
  const [pressed, setPressed] = React.useState(false);

  return (
    <Pressable
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={onPress}
      style={[styles.container, style]}
    >
      <LinearGradient
        colors={gradient.colors}
        start={gradient.start}
        end={gradient.end}
        style={[
          styles.gradient,
          pressed && styles.pressed,
        ]}
      >
        <View style={styles.iconContainer}>
          <Ionicons
            name={icon}
            size={48}
            color={theme.colors.neutral.white}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        <View style={styles.arrow}>
          <Ionicons
            name="chevron-forward"
            size={24}
            color={theme.colors.neutral.white}
          />
        </View>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    ...theme.shadows.lg,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    minHeight: 90,
  },
  pressed: {
    opacity: 0.85,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: theme.borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.neutral.white,
    marginBottom: theme.spacing.xs,
  },
  description: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.neutral.white,
    opacity: 0.9,
    lineHeight: 20,
  },
  arrow: {
    marginLeft: theme.spacing.sm,
  },
});

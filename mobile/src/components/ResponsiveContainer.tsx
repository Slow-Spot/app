/**
 * ResponsiveContainer Component
 *
 * A wrapper component that constrains content width on larger screens
 * while allowing full-width on mobile. Ensures consistent, centered
 * layouts across all device sizes.
 */

import type { ReactNode} from 'react';
import React, { useMemo } from 'react';
import type {
  ViewStyle,
  ScrollViewProps} from 'react-native';
import {
  View,
  ScrollView,
  StyleSheet
} from 'react-native';
import { useResponsive } from '../hooks/useResponsive';

interface ResponsiveContainerProps {
  /** Content to render inside the container */
  children: ReactNode;
  /** Whether to apply max-width constraint (default: true) */
  constrained?: boolean;
  /** Whether to center the container horizontally (default: true) */
  centered?: boolean;
  /** Whether this is a scrollable container (default: false) */
  scrollable?: boolean;
  /** Custom horizontal padding override */
  padding?: number;
  /** Custom max width override (pixels) */
  maxWidth?: number;
  /** Additional styles for the container */
  style?: ViewStyle;
  /** Additional styles for scroll content (when scrollable) */
  contentContainerStyle?: ViewStyle;
  /** Test ID for testing */
  testID?: string;
  /** Additional ScrollView props (when scrollable) */
  scrollViewProps?: Omit<ScrollViewProps, 'style' | 'contentContainerStyle'>;
}

/**
 * ResponsiveContainer
 *
 * Constrains content to a maximum width on tablets and desktops,
 * while using full width on phones. Content is centered by default.
 *
 * @example
 * ```tsx
 * // Basic usage - content is constrained and centered
 * <ResponsiveContainer>
 *   <YourContent />
 * </ResponsiveContainer>
 *
 * // Full width on all devices
 * <ResponsiveContainer constrained={false}>
 *   <FullWidthBanner />
 * </ResponsiveContainer>
 *
 * // Scrollable container
 * <ResponsiveContainer scrollable>
 *   <LongContent />
 * </ResponsiveContainer>
 *
 * // Custom max width
 * <ResponsiveContainer maxWidth={480}>
 *   <NarrowForm />
 * </ResponsiveContainer>
 * ```
 */
export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  constrained = true,
  centered = true,
  scrollable = false,
  padding,
  maxWidth,
  style,
  contentContainerStyle,
  testID,
  scrollViewProps,
}) => {
  const { isPhone, effectiveContentWidth, screenPadding } = useResponsive();

  const containerStyle = useMemo((): ViewStyle => {
    const effectivePadding = padding ?? screenPadding;
    const shouldConstrain = constrained && !isPhone;
    const effectiveMaxWidth = maxWidth ?? effectiveContentWidth;

    return {
      width: '100%',
      maxWidth: shouldConstrain ? effectiveMaxWidth : undefined,
      alignSelf: centered && shouldConstrain ? 'center' : undefined,
      paddingHorizontal: effectivePadding,
    };
  }, [
    padding,
    screenPadding,
    constrained,
    isPhone,
    maxWidth,
    effectiveContentWidth,
    centered,
  ]);

  if (scrollable) {
    return (
      <ScrollView
        testID={testID}
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          containerStyle,
          contentContainerStyle,
          style,
        ]}
        showsVerticalScrollIndicator={false}
        {...scrollViewProps}
      >
        {children}
      </ScrollView>
    );
  }

  return (
    <View testID={testID} style={[containerStyle, style]}>
      {children}
    </View>
  );
};

/**
 * ResponsiveScrollContainer
 *
 * A pre-configured scrollable ResponsiveContainer.
 * Shorthand for <ResponsiveContainer scrollable>.
 */
export const ResponsiveScrollContainer: React.FC<
  Omit<ResponsiveContainerProps, 'scrollable'>
> = (props) => {
  return <ResponsiveContainer {...props} scrollable />;
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});

export default ResponsiveContainer;

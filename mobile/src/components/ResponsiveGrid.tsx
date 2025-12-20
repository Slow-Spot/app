/**
 * ResponsiveGrid Component
 *
 * A flexible grid layout that automatically adapts the number of columns
 * based on the current breakpoint. Supports equal-height items and
 * custom column configurations per breakpoint.
 */

import React, { ReactNode, Children, useMemo } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useResponsive } from '../hooks/useResponsive';
import { Breakpoint } from '../theme/responsive';
import { spacing } from '../theme';

interface ResponsiveGridProps {
  /** Grid items to render */
  children: ReactNode;
  /** Column configuration per breakpoint */
  columns?: Partial<Record<Breakpoint, number>>;
  /** Gap between items (default: spacing.md = 16) */
  gap?: number;
  /** Force equal height rows using aspect ratio */
  equalHeight?: boolean;
  /** Aspect ratio for grid items when equalHeight is true (default: 1 for squares) */
  itemAspectRatio?: number;
  /** Minimum item width - if set, columns will be calculated to respect this */
  minItemWidth?: number;
  /** Maximum item width - items won't grow beyond this */
  maxItemWidth?: number;
  /** Additional styles for the grid container */
  style?: ViewStyle;
  /** Additional styles applied to each grid item wrapper */
  itemStyle?: ViewStyle;
  /** Test ID for testing */
  testID?: string;
}

/**
 * ResponsiveGrid
 *
 * Creates a responsive grid layout that adapts columns based on screen size.
 *
 * @example
 * ```tsx
 * // Basic 2-column grid on phone, 4 on tablet
 * <ResponsiveGrid
 *   columns={{ phone: 2, tablet: 4, desktop: 4 }}
 *   gap={16}
 * >
 *   <StatCard title="Sessions" value={10} />
 *   <StatCard title="Minutes" value={120} />
 *   <StatCard title="Streak" value={5} />
 *   <StatCard title="Best" value={14} />
 * </ResponsiveGrid>
 *
 * // Square cards with equal height
 * <ResponsiveGrid
 *   columns={{ phone: 2, tablet: 4 }}
 *   equalHeight
 *   itemAspectRatio={1}
 * >
 *   {items.map(item => <Card key={item.id} {...item} />)}
 * </ResponsiveGrid>
 * ```
 */
export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  columns = { phone: 2, tablet: 3, desktop: 4 },
  gap = spacing.md,
  equalHeight = false,
  itemAspectRatio = 1,
  minItemWidth,
  maxItemWidth,
  style,
  itemStyle,
  testID,
}) => {
  const { select, effectiveContentWidth, screenPadding } = useResponsive();

  // Get column count for current breakpoint
  const columnCount = select({
    phone: columns.phone ?? 2,
    tablet: columns.tablet ?? columns.phone ?? 2,
    desktop: columns.desktop ?? columns.tablet ?? columns.phone ?? 3,
    wide: columns.wide ?? columns.desktop ?? columns.tablet ?? 4,
    default: 2,
  });

  // Calculate item width
  const itemWidth = useMemo(() => {
    // Account for container padding
    const containerWidth = effectiveContentWidth - screenPadding * 2;
    const totalGaps = (columnCount - 1) * gap;
    let calculatedWidth = (containerWidth - totalGaps) / columnCount;

    // Apply min/max constraints
    if (minItemWidth && calculatedWidth < minItemWidth) {
      calculatedWidth = minItemWidth;
    }
    if (maxItemWidth && calculatedWidth > maxItemWidth) {
      calculatedWidth = maxItemWidth;
    }

    return calculatedWidth;
  }, [
    effectiveContentWidth,
    screenPadding,
    columnCount,
    gap,
    minItemWidth,
    maxItemWidth,
  ]);

  const childArray = Children.toArray(children);

  const gridStyle = useMemo(
    (): ViewStyle => ({
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginHorizontal: -gap / 2, // Compensate for item margins
    }),
    [gap]
  );

  const getItemStyle = useMemo(
    (): ViewStyle => ({
      width: itemWidth,
      marginHorizontal: gap / 2,
      marginBottom: gap,
      ...(equalHeight && itemAspectRatio
        ? { aspectRatio: itemAspectRatio }
        : {}),
    }),
    [itemWidth, gap, equalHeight, itemAspectRatio]
  );

  return (
    <View testID={testID} style={[gridStyle, style]}>
      {childArray.map((child, index) => (
        <View key={index} style={[getItemStyle, itemStyle]}>
          {child}
        </View>
      ))}
    </View>
  );
};

/**
 * Hook for getting grid item width calculations
 * Useful when you need to apply width directly to custom components
 */
export function useGridItemWidth(
  columns: Partial<Record<Breakpoint, number>>,
  gap: number = spacing.md
): number {
  const { select, effectiveContentWidth, screenPadding } = useResponsive();

  const columnCount = select({
    phone: columns.phone ?? 2,
    tablet: columns.tablet ?? 2,
    desktop: columns.desktop ?? 3,
    wide: columns.wide ?? 4,
    default: 2,
  });

  return useMemo(() => {
    const containerWidth = effectiveContentWidth - screenPadding * 2;
    const totalGaps = (columnCount - 1) * gap;
    return (containerWidth - totalGaps) / columnCount;
  }, [effectiveContentWidth, screenPadding, columnCount, gap]);
}

const styles = StyleSheet.create({
  // Base styles if needed
});

export default ResponsiveGrid;

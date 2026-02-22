/**
 * useResponsive Hook
 *
 * Provides responsive utilities for adapting layouts to different screen sizes.
 * Automatically updates when screen dimensions change (rotation, resize).
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { ScaledSize } from 'react-native';
import { Dimensions } from 'react-native';
import type {
  Breakpoint} from '../theme/responsive';
import {
  breakpoints,
  contentWidths,
  gridColumns,
  screenPadding,
  getBreakpoint,
  calculateItemWidth
} from '../theme/responsive';

export interface ResponsiveInfo {
  /** Current screen width in pixels */
  width: number;
  /** Current screen height in pixels */
  height: number;
  /** Current breakpoint name */
  breakpoint: Breakpoint;
  /** True if on phone-sized screen (< 768px) */
  isPhone: boolean;
  /** True if on tablet-sized screen (768-1023px) */
  isTablet: boolean;
  /** True if on desktop-sized screen (1024-1439px) */
  isDesktop: boolean;
  /** True if on wide screen (>= 1440px) */
  isWide: boolean;
  /** True if tablet or larger */
  isTabletOrLarger: boolean;
  /** True if desktop or larger */
  isDesktopOrLarger: boolean;
  /** Maximum content width for current breakpoint */
  contentWidth: number | '100%';
  /** Effective content width in pixels (for calculations) */
  effectiveContentWidth: number;
  /** Recommended grid columns for current breakpoint */
  gridColumns: number;
  /** Recommended screen padding for current breakpoint */
  screenPadding: number;
  /** Select a value based on current breakpoint */
  select: <T>(options: Partial<Record<Breakpoint, T>> & { default: T }) => T;
  /** Calculate width for grid items */
  getColumnWidth: (columns: number, gap?: number, customPadding?: number) => number;
  /** Get responsive style value */
  responsive: <T>(phone: T, tablet?: T, desktop?: T, wide?: T) => T;
}

/**
 * Hook for responsive design utilities
 *
 * @example
 * ```tsx
 * const { isPhone, select, getColumnWidth } = useResponsive();
 *
 * const columns = select({ phone: 2, tablet: 4, default: 2 });
 * const itemWidth = getColumnWidth(columns, 16);
 *
 * return (
 *   <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
 *     {items.map(item => (
 *       <View key={item.id} style={{ width: itemWidth }}>
 *         <ItemCard item={item} />
 *       </View>
 *     ))}
 *   </View>
 * );
 * ```
 */
export function useResponsive(): ResponsiveInfo {
  const [dimensions, setDimensions] = useState<ScaledSize>(() =>
    Dimensions.get('window')
  );

  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      'change',
      ({ window }: { window: ScaledSize }) => {
        setDimensions(window);
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  const breakpoint = useMemo(
    () => getBreakpoint(dimensions.width),
    [dimensions.width]
  );

  const isPhone = breakpoint === 'phone';
  const isTablet = breakpoint === 'tablet';
  const isDesktop = breakpoint === 'desktop';
  const isWide = breakpoint === 'wide';
  const isTabletOrLarger = !isPhone;
  const isDesktopOrLarger = isDesktop || isWide;

  const currentContentWidth = contentWidths[breakpoint];
  const effectiveContentWidth = useMemo(() => {
    if (currentContentWidth === '100%') {
      return dimensions.width;
    }
    return Math.min(dimensions.width, currentContentWidth);
  }, [dimensions.width, currentContentWidth]);

  const currentGridColumns = gridColumns[breakpoint];
  const currentScreenPadding = screenPadding[breakpoint];

  const select = useCallback(
    <T,>(options: Partial<Record<Breakpoint, T>> & { default: T }): T => {
      // Cascade down from current breakpoint to find a defined value
      const cascadeOrder: Breakpoint[] = ['wide', 'desktop', 'tablet', 'phone'];
      const startIndex = cascadeOrder.indexOf(breakpoint);

      for (let i = startIndex; i < cascadeOrder.length; i++) {
        const bp = cascadeOrder[i];
        if (bp !== undefined && options[bp] !== undefined) {
          return options[bp] as T;
        }
      }

      return options.default;
    },
    [breakpoint]
  );

  const getColumnWidth = useCallback(
    (columns: number, gap: number = 16, customPadding?: number): number => {
      const padding = customPadding ?? currentScreenPadding;
      return calculateItemWidth(effectiveContentWidth, columns, gap, padding);
    },
    [effectiveContentWidth, currentScreenPadding]
  );

  const responsive = useCallback(
    <T,>(phone: T, tablet?: T, desktop?: T, wide?: T): T => {
      return select({
        phone,
        tablet: tablet ?? phone,
        desktop: desktop ?? tablet ?? phone,
        wide: wide ?? desktop ?? tablet ?? phone,
        default: phone,
      });
    },
    [select]
  );

  return useMemo(
    () => ({
      width: dimensions.width,
      height: dimensions.height,
      breakpoint,
      isPhone,
      isTablet,
      isDesktop,
      isWide,
      isTabletOrLarger,
      isDesktopOrLarger,
      contentWidth: currentContentWidth,
      effectiveContentWidth,
      gridColumns: currentGridColumns,
      screenPadding: currentScreenPadding,
      select,
      getColumnWidth,
      responsive,
    }),
    [
      dimensions.width,
      dimensions.height,
      breakpoint,
      isPhone,
      isTablet,
      isDesktop,
      isWide,
      isTabletOrLarger,
      isDesktopOrLarger,
      currentContentWidth,
      effectiveContentWidth,
      currentGridColumns,
      currentScreenPadding,
      select,
      getColumnWidth,
      responsive,
    ]
  );
}

/**
 * Simple hook for selecting a value based on breakpoint
 *
 * @example
 * ```tsx
 * const columns = useBreakpointValue({ phone: 2, tablet: 4, default: 2 });
 * ```
 */
export function useBreakpointValue<T>(
  values: Partial<Record<Breakpoint, T>> & { default: T }
): T {
  const { select } = useResponsive();
  return select(values);
}

/**
 * Hook that returns true when screen width is at or above the given breakpoint
 *
 * @example
 * ```tsx
 * const isLargeScreen = useBreakpointMatch('tablet');
 * ```
 */
export function useBreakpointMatch(minBreakpoint: Breakpoint): boolean {
  const { width } = useResponsive();
  return width >= breakpoints[minBreakpoint];
}

export default useResponsive;

/**
 * Responsive Design System for Slow Spot App
 *
 * Provides breakpoints, content widths, and grid configurations
 * for consistent responsive behavior across phone, tablet, and desktop.
 */

/**
 * Breakpoint values in pixels
 * - phone: 0-767px (default mobile experience)
 * - tablet: 768-1023px (iPad Mini, standard tablets)
 * - desktop: 1024-1439px (iPad Pro landscape, laptops)
 * - wide: 1440px+ (large desktop screens)
 */
export const breakpoints = {
  phone: 0,
  tablet: 768,
  desktop: 1024,
  wide: 1440,
} as const;

export type Breakpoint = keyof typeof breakpoints;

/**
 * Maximum content width per breakpoint
 * Ensures content doesn't stretch too wide on large screens
 */
export const contentWidths: Record<Breakpoint, number | '100%'> = {
  phone: '100%',
  tablet: 720,
  desktop: 960,
  wide: 1200,
} as const;

/**
 * Recommended grid columns per breakpoint
 * Used by ResponsiveGrid for automatic column calculation
 */
export const gridColumns: Record<Breakpoint, number> = {
  phone: 1,
  tablet: 2,
  desktop: 3,
  wide: 4,
} as const;

/**
 * Screen padding adjustments per breakpoint
 * Larger screens get more padding for better visual balance
 */
export const screenPadding: Record<Breakpoint, number> = {
  phone: 16,
  tablet: 24,
  desktop: 32,
  wide: 40,
} as const;

/**
 * Get the current breakpoint based on screen width
 */
export function getBreakpoint(width: number): Breakpoint {
  if (width >= breakpoints.wide) return 'wide';
  if (width >= breakpoints.desktop) return 'desktop';
  if (width >= breakpoints.tablet) return 'tablet';
  return 'phone';
}

/**
 * Check if width matches a specific breakpoint or higher
 */
export function isBreakpointOrHigher(width: number, breakpoint: Breakpoint): boolean {
  return width >= breakpoints[breakpoint];
}

/**
 * Get content width value for a given screen width
 */
export function getContentWidth(width: number): number | '100%' {
  const breakpoint = getBreakpoint(width);
  return contentWidths[breakpoint];
}

/**
 * Get recommended grid columns for a given screen width
 */
export function getGridColumns(width: number): number {
  const breakpoint = getBreakpoint(width);
  return gridColumns[breakpoint];
}

/**
 * Calculate item width for a grid layout
 * @param containerWidth - Total container width
 * @param columns - Number of columns
 * @param gap - Gap between items
 * @param padding - Horizontal padding
 */
export function calculateItemWidth(
  containerWidth: number,
  columns: number,
  gap: number = 16,
  padding: number = 0
): number {
  const availableWidth = containerWidth - padding * 2;
  const totalGaps = (columns - 1) * gap;
  return (availableWidth - totalGaps) / columns;
}

/**
 * Breakpoint-aware value selector
 * Cascades down from current breakpoint to find a defined value
 */
export function selectByBreakpoint<T>(
  width: number,
  values: Partial<Record<Breakpoint, T>> & { default: T }
): T {
  const breakpoint = getBreakpoint(width);
  const cascadeOrder: Breakpoint[] = ['wide', 'desktop', 'tablet', 'phone'];
  const startIndex = cascadeOrder.indexOf(breakpoint);

  for (let i = startIndex; i < cascadeOrder.length; i++) {
    const bp = cascadeOrder[i];
    if (bp !== undefined && values[bp] !== undefined) {
      return values[bp] as T;
    }
  }

  return values.default;
}

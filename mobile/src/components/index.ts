/**
 * Component Library Index
 *
 * Centralized exports for all reusable components.
 * Import from here for better organization.
 *
 * @example
 * import { Badge, Button, GradientButton } from '../components';
 */

// Core UI Components
export { Badge } from './Badge';
export type { BadgeVariant, BadgeSize } from './Badge';

export { Button } from './Button';
export type { ButtonVariant, ButtonSize } from './Button';

export { GradientButton } from './GradientButton';

// Layout Components
export { GradientBackground } from './GradientBackground';
export { GradientCard } from './GradientCard';

// Feature Components
export { QuoteCard } from './QuoteCard';

// Feedback Components
export { ErrorBanner, useErrorBanner } from './ErrorBanner';
export {
  SkeletonLoader,
  SessionCardSkeleton,
  StatCardSkeleton,
  ListItemSkeleton,
  TextSkeleton,
  ScreenSkeleton,
} from './SkeletonLoader';

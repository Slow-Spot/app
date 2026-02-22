import { StyleSheet } from 'react-native';
import theme from '../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  responsiveWrapper: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.layout.screenPadding,
    paddingBottom: theme.spacing.xxxl,
    flexGrow: 1,
  },
  columnWrapper: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  header: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSizes.hero,
    fontWeight: theme.typography.fontWeights.light,
    letterSpacing: -1,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.regular,
  },

  // Main CTA Card
  mainCardContainer: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
  mainCard: {},
  mainCardGradient: {
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  mainCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mainCardTextSection: {
    flex: 1,
    paddingRight: theme.spacing.md,
  },
  mainCardLabel: {
    fontSize: theme.typography.fontSizes.sm,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: theme.spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  mainCardTitle: {
    fontSize: theme.typography.fontSizes.xxl,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: theme.colors.neutral.white,
    marginBottom: theme.spacing.sm,
  },
  mainCardCta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainCardCtaText: {
    fontSize: theme.typography.fontSizes.sm,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  mainCardIconSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconRingsContainer: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconRing: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  iconRing1: {
    width: 72,
    height: 72,
  },
  iconRing2: {
    width: 84,
    height: 84,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  mainCardIconBg: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Sessions header
  sessionsHeader: {
    marginBottom: theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sessionsHeaderText: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semiBold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sessionsHeaderHint: {
    fontSize: theme.typography.fontSizes.xs,
  },

  skeletonContainer: {
    paddingVertical: theme.spacing.md,
  },
  separator: {
    height: theme.spacing.lg,
  },
  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
    paddingHorizontal: theme.spacing.lg,
  },
  emptyStateTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.semiBold,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  emptyStateSubtitle: {
    fontSize: theme.typography.fontSizes.md,
    textAlign: 'center',
    lineHeight: 24,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 340,
    borderRadius: theme.borderRadius.xxl,
    padding: theme.spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 30,
    elevation: 12,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  modalIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  modalTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.semiBold,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  modalSubtitle: {
    fontSize: theme.typography.fontSizes.md,
    textAlign: 'center',
  },
  modalActions: {
    gap: theme.spacing.md,
  },
  modalButton: {
    width: '100%',
  },
  modalDeleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
  },
  modalDeleteButtonText: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: '#EF4444',
  },
  modalCancelButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
  },
  modalCancelButtonText: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.medium,
  },
});

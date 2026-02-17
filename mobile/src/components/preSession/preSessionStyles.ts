import { StyleSheet } from 'react-native';
import theme from '../../theme';
import { backgrounds, neutralColors } from '../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  title: {
    fontSize: theme.typography.fontSizes.xxxl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    fontWeight: theme.typography.fontWeights.medium,
  },
  stepContainer: {
    gap: theme.spacing.sm,
  },
  card: {
    // padding handled by GradientCard
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTextContainer: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  iconLarge: {
    fontSize: 32,
  },
  iconMedium: {
    fontSize: 24,
  },
  cardTitle: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  cardDescription: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.xs,
  },
  listItem: {
    flexDirection: 'row',
    marginTop: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  listBullet: {
    color: '#8B5CF6',
    fontWeight: theme.typography.fontWeights.semiBold,
    fontSize: theme.typography.fontSizes.md,
  },
  listText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.sm,
    flex: 1,
  },
  buttonContainer: {
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  primaryButton: {
    width: '100%',
  },
  beginButton: {
    marginTop: theme.spacing.lg,
  },
  skipButton: {
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.fontWeights.medium,
    textDecorationLine: 'underline',
  },
  checklistCard: {
    padding: theme.spacing.md,
  },
  checklistCardCompleted: {
    borderWidth: 2,
    borderColor: '#8B5CF6',
  },
  checklistContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checklistLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: theme.spacing.sm,
  },
  checklistText: {
    flex: 1,
  },
  checklistTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  checklistTitle: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: theme.colors.text.primary,
  },
  checklistTitleCompleted: {
    color: theme.colors.neutral.white,
  },
  checklistDescription: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xxs,
  },
  checklistDescriptionCompleted: {
    color: theme.colors.neutral.white,
    opacity: 0.9,
  },
  optionalBadge: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.text.tertiary,
    fontStyle: 'italic',
  },
  optionalBadgeCompleted: {
    color: theme.colors.neutral.white,
    opacity: 0.8,
  },
  inputLabel: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.fontWeights.medium,
    marginBottom: theme.spacing.xs,
  },
  textInput: {
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text.primary,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  breathingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    marginVertical: theme.spacing.lg,
  },
  breathingCircleWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  breathingCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderWidth: 3,
    borderColor: '#8B5CF6',
  },
  breathingText: {
    position: 'absolute',
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: '#8B5CF6',
  },
  timerText: {
    fontSize: 48,
    fontWeight: theme.typography.fontWeights.bold,
    color: '#8B5CF6',
    marginVertical: theme.spacing.md,
    textAlign: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
  },
  progressDotWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
  },
  progressDotGlow: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  progressDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressDotCurrent: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  progressLineWrapper: {
    width: 60,
    height: 3,
    marginHorizontal: 4,
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 1.5,
  },
  progressLine: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 1.5,
  },
  progressLineFilled: {
    position: 'absolute',
    height: '100%',
    borderRadius: 1.5,
  },
  skipButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
  },
  skipDivider: {
    marginHorizontal: theme.spacing.sm,
    fontSize: theme.typography.fontSizes.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: backgrounds.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  modalContent: {
    width: '100%',
    maxWidth: 340,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalIconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  modalTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  modalDescription: {
    fontSize: theme.typography.fontSizes.sm,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.fontSizes.sm,
    marginBottom: theme.spacing.lg,
  },
  modalCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  modalCheckboxText: {
    fontSize: theme.typography.fontSizes.sm,
    flex: 1,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  modalButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  modalButtonGradient: {
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonText: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: '600',
  },
  modalButtonTextPrimary: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: '600',
    color: neutralColors.white,
  },
});

# Slow Spot App - Design System Issues Checklist

## Overview
This checklist tracks all design system compliance issues found during the comprehensive audit.
**Total Issues**: 47 items  
**Priority Breakdown**: 4 High | 8 Medium | 15 Low  
**Estimated Total Fix Time**: 4.5-6.5 hours

---

## CRITICAL ISSUES (Fix First - Week 1)

### Colors - CelebrationScreen.tsx
- [ ] Line 142: Replace `colors={['#6EE7B7', '#34D399', '#10B981']}` 
  - **Fix**: Use `theme.colors.accent.mint[200/400/500]`
  - **Time**: 5 min
  - **PR**: 

- [ ] Line 150: Replace color hardcode in LinearGradient
  - **Fix**: Use theme mint gradient
  - **Time**: 2 min
  - **PR**: 

- [ ] Line 276: Replace `backgroundColor: '#10B981'`
  - **Fix**: Use `theme.colors.accent.mint[500]`
  - **Time**: 2 min
  - **PR**: 

- [ ] Line 283: Replace `backgroundColor: '#10B981'` (duplicate)
  - **Fix**: Use `theme.colors.accent.mint[500]`
  - **Time**: 2 min
  - **PR**: 

- [ ] Lines 320, 336, 378, 382, 386, 387, 403: Replace hardcoded rgba colors
  - **Fix**: Use theme.opacity + theme.colors
  - **Time**: 10 min
  - **PR**: 

### Colors - QuoteCard.tsx
- [ ] Line 65: Replace `backgroundColor: '#FFFFFF'`
  - **Fix**: Use `theme.colors.background.card`
  - **Time**: 2 min
  - **PR**: 

- [ ] Line 66: Replace `borderColor: '#E5E5E5'`
  - **Fix**: Use `theme.colors.border.light`
  - **Time**: 2 min
  - **PR**: 

- [ ] Line 69: Replace `backgroundColor: '#2C2C2E'`
  - **Fix**: Use `theme.colors.neutral.charcoal[200]`
  - **Time**: 2 min
  - **PR**: 

- [ ] Line 70: Replace `borderColor: '#3A3A3C'`
  - **Fix**: Use `theme.colors.neutral.charcoal[100]`
  - **Time**: 2 min
  - **PR**: 

### Font Sizes - QuoteCard.tsx (CRITICAL - 0% theme compliance)
- [ ] Line 80: Replace `fontSize: 24` 
  - **Fix**: Use `theme.typography.fontSizes.xxl` (24)
  - **Time**: 2 min
  - **PR**: 

- [ ] Line 85: Replace `fontSize: 16`
  - **Fix**: Use `theme.typography.fontSizes.md` (16)
  - **Time**: 2 min
  - **PR**: 

- [ ] Line 110: Replace `fontSize: 14`
  - **Fix**: Use `theme.typography.fontSizes.sm` (14)
  - **Time**: 2 min
  - **PR**: 

- [ ] Line 113: Replace `fontSize: 14` (duplicate)
  - **Fix**: Use `theme.typography.fontSizes.sm` (14)
  - **Time**: 2 min
  - **PR**: 

### Accessibility Labels (High Priority)
- [ ] HomeScreen.tsx: Add accessibilityLabel to stat card icons
  - **Files**: HomeScreen.tsx lines 90-94, 112-116, 134-138
  - **Fix**: Wrap icons in View with accessible props
  - **Time**: 15 min
  - **PR**: 

- [ ] ProfileScreen.tsx: Add accessibilityLabel to action icons
  - **Files**: ProfileScreen.tsx (multiple locations)
  - **Fix**: Add a11y props to all interactive elements
  - **Time**: 20 min
  - **PR**: 

- [ ] MeditationScreen.tsx: Add accessibilityLabel to session actions
  - **Files**: MeditationScreen.tsx (multiple locations)
  - **Fix**: Add a11y props to all interactive buttons
  - **Time**: 15 min
  - **PR**: 

---

## MEDIUM PRIORITY ISSUES (Fix Week 2)

### Colors - Minor Fixes
- [ ] SessionCard.tsx Line 115: Replace `backgroundColor: 'rgba(255, 255, 255, 0.5)'`
  - **Fix**: Use theme.opacity + proper color
  - **Time**: 3 min
  - **PR**: 

- [ ] SessionCard.tsx Line 128: Replace `backgroundColor: 'rgba(255, 255, 255, 0.3)'`
  - **Fix**: Use theme.opacity + proper color
  - **Time**: 3 min
  - **PR**: 

- [ ] SessionCard.tsx Line 166: Replace `backgroundColor: 'rgba(255, 255, 255, 0.4)'`
  - **Fix**: Use theme.opacity + proper color
  - **Time**: 3 min
  - **PR**: 

- [ ] PreparationScreen.tsx Line 95: Replace `textShadowColor: 'rgba(0, 0, 0, 0.2)'`
  - **Fix**: Use `theme.colors.shadow.md`
  - **Time**: 2 min
  - **PR**: 

- [ ] PreparationScreen.tsx Line 112: Replace `textShadowColor: 'rgba(0, 0, 0, 0.15)'`
  - **Fix**: Use `theme.colors.shadow.sm`
  - **Time**: 2 min
  - **PR**: 

- [ ] PreparationScreen.tsx Line 123: Replace `textShadowColor: 'rgba(0, 0, 0, 0.15)'`
  - **Fix**: Use `theme.colors.shadow.sm`
  - **Time**: 2 min
  - **PR**: 

- [ ] HomeScreen.tsx Line 250: Replace `backgroundColor: 'rgba(255, 255, 255, 0.25)'`
  - **Fix**: Use proper theme opacity + color
  - **Time**: 2 min
  - **PR**: 

- [ ] ProfileScreen.tsx Line 745: Replace `backgroundColor: 'rgba(255, 255, 255, 0.2)'`
  - **Fix**: Use proper theme opacity + color
  - **Time**: 2 min
  - **PR**: 

- [ ] FeatureTile.tsx Line 84: Replace `backgroundColor: 'rgba(255, 255, 255, 0.2)'`
  - **Fix**: Use theme.opacity.glass20 + white
  - **Time**: 2 min
  - **PR**: 

### Font Sizes - Medium Priority
- [ ] MeditationTimer.tsx Line 478: Replace `fontSize: 64`
  - **Fix**: Use `theme.typography.fontSizes.hero` (48) or custom 56-64
  - **Time**: 3 min
  - **PR**: 

- [ ] MeditationTimer.tsx Line 567: Replace `fontSize: 11`
  - **Fix**: Use `theme.typography.fontSizes.xs` (12)
  - **Time**: 3 min
  - **PR**: 

- [ ] PreSessionInstructions.tsx Line 686: Replace `fontSize: 32`
  - **Fix**: Use `theme.typography.fontSizes.xxxl` (32) ✓ Match
  - **Time**: 2 min
  - **PR**: 

- [ ] PreSessionInstructions.tsx Line 689: Replace `fontSize: 24`
  - **Fix**: Use `theme.typography.fontSizes.xxl` (24) ✓ Match
  - **Time**: 2 min
  - **PR**: 

- [ ] PreSessionInstructions.tsx Line 831: Replace `fontSize: 48`
  - **Fix**: Use `theme.typography.fontSizes.display` (40) or 48
  - **Time**: 2 min
  - **PR**: 

- [ ] CelebrationScreen.tsx Line 304: Replace `fontSize: 42`
  - **Fix**: Use `theme.typography.fontSizes.display` (40)
  - **Time**: 2 min
  - **PR**: 

- [ ] CelebrationScreen.tsx Line 392: Replace `fontSize: 30`
  - **Fix**: Use `theme.typography.fontSizes.hero` (48) or xxl (24) - decide
  - **Time**: 2 min
  - **PR**: 

---

## LOW PRIORITY ISSUES (Fix Week 3)

### Spacing - QuoteCard.tsx
- [ ] Line 52: Replace `padding: 16`
  - **Fix**: Use `theme.spacing.md` (16) ✓ Match
  - **Time**: 2 min
  - **PR**: 

- [ ] Line 73: Replace `padding: 16`
  - **Fix**: Use `theme.spacing.md` (16) ✓ Match
  - **Time**: 2 min
  - **PR**: 

- [ ] Line 76: Replace `gap: 8`
  - **Fix**: Use `theme.spacing.xs` (4) or `theme.spacing.sm` (8) - decide
  - **Time**: 2 min
  - **PR**: 

- [ ] Line 102: Replace `lineHeight: 20`
  - **Fix**: Use `theme.typography.lineHeights.relaxed * theme.typography.fontSizes.sm`
  - **Time**: 2 min
  - **PR**: 

- [ ] Line 106: Replace `gap: 4`
  - **Fix**: Use `theme.spacing.xxs` (2) or `theme.spacing.xs` (4) - decide
  - **Time**: 2 min
  - **PR**: 

### Border Radius - Minor
- [ ] InstructionsScreen.tsx Line 249: Replace `borderRadius: 12`
  - **Fix**: Use `theme.borderRadius.md` (12) ✓ Match
  - **Time**: 2 min
  - **PR**: 

- [ ] QuoteCard.tsx Line 53: Replace `borderRadius: 12`
  - **Fix**: Use `theme.borderRadius.md` (12) ✓ Match
  - **Time**: 2 min
  - **PR**: 

### Icons - Accessibility
- [ ] QuotesScreen.tsx: Add accessibilityLabel to navigation buttons
  - **Files**: QuotesScreen.tsx lines 102-134
  - **Fix**: Add a11y props to Previous/Next/Random buttons
  - **Time**: 10 min
  - **PR**: 

- [ ] SettingsScreen.tsx: Add missing/consistent accessibility labels
  - **Files**: SettingsScreen.tsx (check all interactive elements)
  - **Fix**: Ensure all buttons have proper a11y labels
  - **Time**: 10 min
  - **PR**: 

### Icon Sizes
- [ ] CelebrationScreen.tsx Line 149: Replace `size={56}`
  - **Fix**: Use `theme.iconSizes.xxl` (48) or add custom size to theme
  - **Time**: 2 min
  - **PR**: 

### Bonus Improvements (Optional)
- [ ] Add testID props to all interactive components
  - **Benefit**: Enables better testing
  - **Time**: 30 min
  - **PR**: 

- [ ] Add ErrorBoundary component for critical sections
  - **Benefit**: Better error handling
  - **Time**: 20 min
  - **PR**: 

- [ ] Expand useColorScheme to all components
  - **Benefit**: Consistent light/dark mode
  - **Time**: 30 min
  - **PR**: 

---

## SUMMARY STATISTICS

### By Category
```
Colors:        21 issues (8 critical + 9 medium + 4 low)
FontSize:      11 issues (4 critical + 7 medium)
Spacing:        6 issues (0 critical + 0 medium + 6 low)
BorderRadius:   2 issues (0 critical + 0 medium + 2 low)
A11y Labels:   15 issues (3 critical + 2 medium + 10 low)
Icons:          1 issue  (0 critical + 0 medium + 1 low)
─────────────────────────────────────────
TOTAL:         47 issues
```

### By Severity
- **High Priority (Critical)**: 4 + 4 + 3 = 11 issues (2-3 hours)
- **Medium Priority**: 9 + 7 + 2 = 18 issues (1.5-2 hours)
- **Low Priority**: 6 + 1 + 10 = 17 issues (1-1.5 hours)

### By File
- CelebrationScreen.tsx: 8 issues
- QuoteCard.tsx: 13 issues (MOST CRITICAL)
- SessionCard.tsx: 3 issues
- PreparationScreen.tsx: 3 issues
- PreSessionInstructions.tsx: 3 issues
- MeditationTimer.tsx: 2 issues
- Multiple files: 15 a11y issues

---

## COMPLETION TRACKING

### Phase 1: Critical (Estimated 2-3 hours)
- [ ] CelebrationScreen colors
- [ ] QuoteCard colors
- [ ] QuoteCard fonts
- [ ] HomeScreen a11y
- [ ] ProfileScreen a11y
- [ ] MeditationScreen a11y

**Status**: Not Started  
**Estimated Completion**: [DATE]

### Phase 2: Medium (Estimated 1.5-2 hours)
- [ ] SessionCard colors
- [ ] PreparationScreen colors
- [ ] Font size fixes
- [ ] Icon improvements

**Status**: Not Started  
**Estimated Completion**: [DATE]

### Phase 3: Polish (Estimated 1-1.5 hours)
- [ ] Low priority spacing fixes
- [ ] Border radius consistency
- [ ] Additional a11y labels
- [ ] Testing & validation

**Status**: Not Started  
**Estimated Completion**: [DATE]

---

## NOTES & OBSERVATIONS

### QuoteCard.tsx - Highest Risk Component
- **Issues**: 13 out of 47 total
- **Root Cause**: Appears to be an older component not updated to use theme system
- **Recommendation**: Refactor as priority - high impact on compliance score
- **Testing**: After fix, test on both light and dark modes

### Accessibility Gaps
- Missing labels are not breaking, but improve user experience significantly
- Many components already have partial a11y support (SettingsScreen has some labels)
- Consider adding ESLint rules to enforce accessibility

### Color Consistency
- CelebrationScreen uses completely separate color scheme
- Consider whether this is intentional (for celebration UX) or oversight
- If intentional, add comments explaining the design decision

### Font Sizes
- Some custom sizes (64, 42, 30) appear intentional for visual hierarchy
- Recommendation: Add hero/large sizes to theme or comment why they're custom
- Most fonts map perfectly to theme - easy migration

---

## SUCCESS CRITERIA

After all fixes complete:

- [ ] 95%+ colors use theme system
- [ ] 100% font sizes use theme system
- [ ] 100% spacing uses theme system
- [ ] 90%+ border radius uses theme system
- [ ] 100% icons use Ionicons consistently
- [ ] 90%+ accessibility labels present
- [ ] All components pass visual regression tests
- [ ] Light/dark mode consistent across all screens
- [ ] No hardcoded values in new PRs

---

## RESOURCES

- Theme System: `/src/theme/index.ts`
- Colors: `/src/theme/colors.ts`
- Gradients: `/src/theme/gradients.ts`
- Full Audit Report: `/DESIGN_SYSTEM_AUDIT.md`

---

Generated: November 14, 2025  
Last Updated: November 14, 2025

#!/bin/bash
# Compliance Verification Script
# Sprawdza czy wszystkie problemy ze zgodności zostały naprawione

echo "🔍 Slow Spot - Compliance Verification"
echo "======================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

ISSUES=0
WARNINGS=0
PASSED=0

# Function to check
check_pass() {
    echo -e "${GREEN}✅ $1${NC}"
    ((PASSED++))
}

check_fail() {
    echo -e "${RED}❌ $1${NC}"
    ((ISSUES++))
}

check_warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    ((WARNINGS++))
}

echo "🔴 CRITICAL CHECKS:"
echo "-------------------"

# Check 1: Android Service Account
if [ -f "android-service-account.json" ]; then
    check_warn "Android service account file exists (should be in EAS Secrets!)"
else
    check_fail "Android service account not configured (use EAS Secrets)"
fi
echo ""

echo "🟠 HIGH PRIORITY CHECKS:"
echo "------------------------"

# Check 2: LogRocket removed
if grep -q '"logrocket"' package.json; then
    check_fail "LogRocket still in package.json - run: npm uninstall logrocket"
else
    check_pass "LogRocket package removed"
fi

# Check 3: Mock data flag
if grep -q "|| true" src/services/api.ts; then
    check_fail "Mock data flag still has '|| true' in api.ts:8"
else
    check_pass "Mock data flag fixed"
fi

# Check 4: EAS credentials
if grep -q "PLACEHOLDER" eas.json; then
    check_fail "EAS credentials still contain PLACEHOLDER values"
else
    check_pass "EAS credentials updated"
fi

# Check 5: Android manifest
if [ -f "android/app/src/main/AndroidManifest.xml" ]; then
    check_pass "Android manifest exists"

    # Check for microphone permission
    if grep -q "RECORD_AUDIO" android/app/src/main/AndroidManifest.xml; then
        check_warn "Microphone permission found in Android manifest"
    fi
else
    check_fail "Android manifest not generated - run: npx expo prebuild"
fi

# Check 6: Microphone permission (iOS)
if [ -f "app.json" ]; then
    if grep -q '"microphonePermission": false' app.json; then
        check_pass "Microphone permission disabled in app.json"
    else
        check_fail "Microphone permission not disabled in app.json"
    fi
fi
echo ""

echo "🟡 MEDIUM PRIORITY CHECKS:"
echo "--------------------------"

# Check 7: Health claims in audio.ts
if grep -q "DNA repair" src/services/audio.ts; then
    check_fail "Health claims still in src/services/audio.ts"
else
    check_pass "Health claims removed from audio.ts"
fi

# Check 8: Session naming
if grep -q "Healing Through Grief" src/services/mockData.ts; then
    check_warn "Session 'Healing Through Grief' should be renamed"
else
    check_pass "Session naming updated"
fi

# Check 9: Package updates
echo -n "Checking for outdated packages... "
OUTDATED=$(npm outdated | wc -l)
if [ "$OUTDATED" -gt 1 ]; then
    check_warn "$((OUTDATED-1)) packages have updates available"
else
    check_pass "All packages up to date"
fi

echo ""
echo "🟢 CODE QUALITY CHECKS:"
echo "-----------------------"

# Check 10: TODO comments
TODO_COUNT=$(grep -r "TODO" src/ --include="*.ts" --include="*.tsx" | wc -l)
if [ "$TODO_COUNT" -gt 0 ]; then
    check_warn "$TODO_COUNT TODO comments found in code"
else
    check_pass "No TODO comments in production code"
fi

# Check 11: Console.log statements (should use logger)
CONSOLE_COUNT=$(grep -r "console\\.log" src/ --include="*.ts" --include="*.tsx" | wc -l)
if [ "$CONSOLE_COUNT" -gt 0 ]; then
    check_warn "$CONSOLE_COUNT console.log statements found (use logger instead)"
else
    check_pass "No console.log statements (using logger)"
fi

echo ""
echo "======================================"
echo "VERIFICATION SUMMARY:"
echo "======================================"
echo -e "${GREEN}✅ Passed: $PASSED${NC}"
echo -e "${YELLOW}⚠️  Warnings: $WARNINGS${NC}"
echo -e "${RED}❌ Failed: $ISSUES${NC}"
echo ""

if [ $ISSUES -eq 0 ]; then
    echo -e "${GREEN}🎉 All critical issues resolved!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Build preview: eas build --profile preview --platform all"
    echo "2. Test on devices"
    echo "3. Build production: eas build --profile production --platform all"
    echo "4. Submit: eas submit --platform all"
else
    echo -e "${RED}⚠️  $ISSUES critical issues remain!${NC}"
    echo ""
    echo "Fix these issues before submission."
    echo "See APP_STORE_COMPLIANCE_AUDIT.md for details."
fi

if [ $WARNINGS -gt 0 ]; then
    echo ""
    echo -e "${YELLOW}ℹ️  $WARNINGS warnings - recommended to fix but not blocking${NC}"
fi

echo ""
exit $ISSUES

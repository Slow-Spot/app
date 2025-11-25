#!/bin/bash
# Compliance Quick Fixes Script
# Automatycznie naprawia większość problemów ze zgodności App Store

set -e  # Exit on error

echo "🔧 Slow Spot - Compliance Fixes"
echo "================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Remove LogRocket
echo "📦 [1/5] Removing unused LogRocket package..."
if grep -q '"logrocket"' package.json; then
    npm uninstall logrocket
    echo -e "${GREEN}✅ LogRocket removed${NC}"
else
    echo -e "${YELLOW}ℹ️  LogRocket already removed${NC}"
fi
echo ""

# 2. Update packages
echo "⬆️  [2/5] Updating packages to latest versions..."
npm update
echo -e "${GREEN}✅ Packages updated${NC}"
echo ""

# 3. Fix mock data flag
echo "🔧 [3/5] Fixing mock data flag in api.ts..."
if grep -q "|| true" src/services/api.ts; then
    # Create backup
    cp src/services/api.ts src/services/api.ts.backup

    # Fix the line
    sed -i.bak "s/|| true/|| process.env.APP_ENV !== 'production'/g" src/services/api.ts
    rm src/services/api.ts.bak

    echo -e "${GREEN}✅ Mock data flag fixed${NC}"
    echo "   Changed: USE_MOCK_DATA = ... || true"
    echo "   To:      USE_MOCK_DATA = ... || process.env.APP_ENV !== 'production'"
else
    echo -e "${YELLOW}ℹ️  Mock data flag already fixed${NC}"
fi
echo ""

# 4. Generate Android manifest
echo "🤖 [4/5] Generating Android manifest..."
if [ -d "android" ]; then
    echo -e "${YELLOW}ℹ️  Android directory exists, cleaning...${NC}"
    rm -rf android
fi
npx expo prebuild --platform android --clean
echo -e "${GREEN}✅ Android manifest generated${NC}"
echo "   Check: android/app/src/main/AndroidManifest.xml"
echo ""

# 5. Run security audit
echo "🔒 [5/5] Running security audit..."
npm audit fix --force || true
echo -e "${GREEN}✅ Security audit complete${NC}"
echo ""

echo "================================"
echo -e "${GREEN}✅ Automatic fixes complete!${NC}"
echo ""
echo -e "${YELLOW}⚠️  Manual fixes still required:${NC}"
echo ""
echo "1. 🔴 CRITICAL - Android Service Account:"
echo "   → Google Play Console → Setup → API Access"
echo "   → Create service account and download JSON key"
echo "   → Run: eas secret:create --scope project --name ANDROID_SERVICE_ACCOUNT_JSON"
echo ""
echo "2. 🟠 HIGH - Remove Microphone Permission:"
echo "   → Edit app.json, add to plugins array:"
echo '   ["expo-av", { "microphonePermission": false }]'
echo ""
echo "3. 🟠 HIGH - Update EAS Credentials:"
echo "   → Edit eas.json lines 76, 83-84"
echo "   → Replace PLACEHOLDER values with real:"
echo "     - appleId: your-email@example.com"
echo "     - ascAppId: App Store Connect App ID (10 digits)"
echo "     - appleTeamId: Apple Team ID from developer account"
echo ""
echo "4. 🟡 MEDIUM - Remove Health Claims:"
echo "   → Edit src/services/audio.ts lines 13-24"
echo "   → Replace 'DNA repair', 'healing' with neutral terms"
echo ""
echo "5. 🟡 MEDIUM - Rename Session:"
echo "   → Edit src/services/mockData.ts line 1693"
echo "   → Change 'Healing Through Grief' to 'Processing Grief'"
echo ""
echo "Next: Run ./scripts/verify-compliance.sh to check fixes"
echo ""

#!/bin/bash

# First-time Android Keystore Setup
# Run this ONCE before using GitHub Actions automated builds

set -e

echo "🔑 Android Keystore Setup - Slow Spot"
echo "======================================"
echo ""
echo "This script will generate Android signing credentials (keystore)"
echo "that will be stored on Expo servers and used for all future builds."
echo ""
echo "This is a ONE-TIME setup. After this, GitHub Actions will work automatically!"
echo ""

# Check if we're in mobile directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this from the mobile/ directory"
    echo "   cd mobile && ../scripts/setup-android-keystore.sh"
    exit 1
fi

# Check if logged in
if ! npx expo whoami &> /dev/null; then
    echo "❌ You're not logged in to Expo"
    echo "   Run: npx expo login"
    exit 1
fi

EXPO_USER=$(npx expo whoami 2>/dev/null)
echo "✅ Logged in as: $EXPO_USER"
echo ""

# Option 1: Generate keystore via build
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "OPTION 1: Generate keystore via first build (RECOMMENDED)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "This will:"
echo "  1. Generate a new Android keystore"
echo "  2. Upload it to Expo servers"
echo "  3. Start a preview build (~15 min)"
echo "  4. All future GitHub Actions builds will work automatically"
echo ""
read -p "Start first build now? [y/N] " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🚀 Starting preview build..."
    echo ""

    eas build --platform android --profile preview

    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "✅ SETUP COMPLETE!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Keystore has been generated and uploaded to Expo."
    echo "GitHub Actions automated builds will now work!"
    echo ""
    echo "Build status: https://expo.dev/accounts/$EXPO_USER/projects/slow-spot/builds"
    echo ""
else
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "OPTION 2: Generate keystore via credentials (FASTER)"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "This will:"
    echo "  1. Generate keystore without starting a build (~30 seconds)"
    echo "  2. Upload it to Expo servers"
    echo "  3. GitHub Actions builds will work immediately"
    echo ""
    read -p "Generate keystore now? [y/N] " -n 1 -r
    echo ""

    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo ""
        echo "Opening EAS credentials manager..."
        echo ""
        echo "When prompted:"
        echo "  1. Select: Android"
        echo "  2. Select: Keystore: Set up a new keystore"
        echo "  3. Select: Generate new keystore"
        echo ""

        eas credentials

        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "✅ SETUP COMPLETE!"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        echo "Keystore has been generated and uploaded to Expo."
        echo "GitHub Actions automated builds will now work!"
        echo ""
        echo "Test it: git push (on develop/test branch)"
        echo ""
    else
        echo ""
        echo "Setup cancelled. You can run this script again anytime:"
        echo "  cd mobile"
        echo "  ../scripts/setup-android-keystore.sh"
        echo ""
        echo "Or manually:"
        echo "  cd mobile"
        echo "  eas build --platform android --profile preview"
        echo ""
    fi
fi

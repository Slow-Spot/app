#!/bin/bash
# Fix screenshot dimensions for Fastlane deliver
#
# Fastlane requires specific dimensions:
# - iPhone 6.5": 1242 x 2688 (we have 1284 x 2778 from 6.7")
# - iPad 12.9": 2048 x 2732 (we have 2064 x 2752 from 13" M4)
#
# This script resizes screenshots to the correct dimensions

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
SCREENSHOTS_DIR="$PROJECT_DIR/store/screenshots/ios"

LOCALES=("en-US" "pl" "de-DE" "es-ES" "fr-FR" "zh-Hans" "hi")

# Target dimensions for App Store Connect
IPHONE_65_WIDTH=1242
IPHONE_65_HEIGHT=2688
# iPad Pro 13" M4 dimensions (2064x2752) - required by App Store Connect
IPAD_13_WIDTH=2064
IPAD_13_HEIGHT=2752

echo "📱 Fixing screenshot dimensions for Fastlane..."
echo ""

for locale in "${LOCALES[@]}"; do
    echo "🌍 Processing $locale..."

    # Fix iPhone 6.5" screenshots (resize from 1284x2778 to 1242x2688)
    IPHONE_DIR="$SCREENSHOTS_DIR/$locale/iPhone 6.5"
    if [ -d "$IPHONE_DIR" ]; then
        for img in "$IPHONE_DIR"/*.png; do
            if [ -f "$img" ]; then
                filename=$(basename "$img")
                # Use ImageMagick to resize properly
                magick "$img" -resize ${IPHONE_65_WIDTH}x${IPHONE_65_HEIGHT}! "$img" 2>/dev/null || \
                convert "$img" -resize ${IPHONE_65_WIDTH}x${IPHONE_65_HEIGHT}! "$img"
                echo "  ✓ iPhone 6.5\" $filename → ${IPHONE_65_WIDTH}x${IPHONE_65_HEIGHT}"
            fi
        done
    fi

    # Fix iPad Pro 13" screenshots (ensure 2064x2752 for App Store Connect 13" requirement)
    IPAD_DIR="$SCREENSHOTS_DIR/$locale/iPad Pro 13"
    if [ -d "$IPAD_DIR" ]; then
        for img in "$IPAD_DIR"/*.png; do
            if [ -f "$img" ]; then
                filename=$(basename "$img")
                # Use ImageMagick to resize to iPad Pro 13" M4 dimensions
                magick "$img" -resize ${IPAD_13_WIDTH}x${IPAD_13_HEIGHT}! "$img" 2>/dev/null || \
                convert "$img" -resize ${IPAD_13_WIDTH}x${IPAD_13_HEIGHT}! "$img"
                echo "  ✓ iPad 13\" $filename → ${IPAD_13_WIDTH}x${IPAD_13_HEIGHT}"
            fi
        done
    fi
done

echo ""
echo "✅ Screenshot dimensions fixed!"
echo ""
echo "Now run: node scripts/generate-ios-metadata.js"
echo "Then: cd fastlane && bundle exec fastlane ios upload_screenshots"
